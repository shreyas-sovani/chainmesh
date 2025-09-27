import { getFlowService } from '@/server/services/flow';
import { bus, getSchedules, upsertSchedule } from '@/server/store/memoryStore';
import type { AgentStatus, AgentContextState, Schedule } from '@/server/types';
import { getAgentGraph } from '@/server/langgraph/graph';

let status: AgentStatus = { coordinatorRunning: false };
let pollingInterval: NodeJS.Timeout | null = null;
let lastProcessedHeight = 0;
let graphRunner: ReturnType<typeof getAgentGraph> | null = null;

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
    if (!graphRunner) {
      graphRunner = getAgentGraph();
    }

    const initialState: AgentContextState = {};
    const result = await graphRunner.invoke(initialState);

    if (!result.opportunity) {
      console.log('LangGraph run completed without opportunity.');
      return;
    }

    console.log(
      `LangGraph run completed. Opportunity ${result.opportunity.id} execution status: ${
        result.execution?.status ?? 'skipped'
      }`
    );
  } catch (error) {
    status.lastError = error instanceof Error ? error.message : String(error);
    console.error('Error running LangGraph pipeline:', error);
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


