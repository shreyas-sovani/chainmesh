import { getFlowService } from '@/server/services/flow';
import { bus, getSchedules, upsertSchedule } from '@/server/store/memoryStore';
import type { AgentStatus, Schedule } from '@/server/types';
import { scanMarkets } from './scout';
import { maybeExecute } from './executor';

let status: AgentStatus = { coordinatorRunning: false };
let pollingInterval: NodeJS.Timeout | null = null;
let lastProcessedHeight = 0;

async function pollForEvents(): Promise<void> {
  try {
    const flowService = getFlowService();
    const { events, latestHeight } = await flowService.pollForTaskReadyEvents(lastProcessedHeight);

    if (events.length > 0) {
      console.log(`Found ${events.length} TaskReady events from blocks ${lastProcessedHeight + 1} to ${latestHeight}`);
      status.lastCallbackAt = Date.now();

      for (const event of events) {
        console.log(`Processing TaskReady event: ${JSON.stringify(event.payload)}`);
        // Process each TaskReady event by running the agent pipeline
        await runAgentPipeline();
      }
    }

    lastProcessedHeight = latestHeight;
  } catch (e) {
    status.lastError = e instanceof Error ? e.message : String(e);
    console.error('Error polling for events:', e);
  }
}

async function runAgentPipeline(): Promise<void> {
  try {
    // Step 1: Scan markets for opportunities
    const opportunity = await scanMarkets();
    if (!opportunity) {
      console.log('No profitable opportunities found');
      return;
    }

    console.log(`Found opportunity: ${opportunity.id} with ${opportunity.expectedProfitBps}bps profit`);

    // Step 2: Execute the opportunity
    await maybeExecute(opportunity);

    console.log(`Successfully processed opportunity: ${opportunity.id}`);
  } catch (error) {
    console.error('Error in agent pipeline:', error);
  }
}

function startPolling(): void {
  if (pollingInterval) return;

  // Poll every 5 seconds for Flow events
  pollingInterval = setInterval(pollForEvents, 5000);
}

function stopPolling(): void {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

export function startCoordinator(): AgentStatus {
  if (status.coordinatorRunning) return status;
  status.coordinatorRunning = true;
  startPolling();
  return status;
}

export function stopCoordinator(): AgentStatus {
  stopPolling();
  status.coordinatorRunning = false;
  return status;
}

export function upsertAndReschedule(schedule: Schedule): void {
  upsertSchedule(schedule);
  // No need to reschedule - Flow events drive the timing
}

export function getCoordinatorStatus(): AgentStatus {
  return status;
}

// Convenience: create a default schedule if none
export function ensureDefaultSchedule(): Schedule {
  const existing = getSchedules()[0];
  if (existing) return existing;
  const s: Schedule = {
    id: 'default',
    name: 'Default Scan',
    intervalSeconds: 15,
    nextRunAt: Date.now() + 15_000,
    enabled: true,
    createdAt: Date.now(),
  };
  upsertAndReschedule(s);
  return s;
}


