import { ensureDefaultSchedule, startCoordinator } from '@/server/agents/coordinator';

// Simple bootstrap entrypoint for running agents in-process
export function startAgents(): void {
  ensureDefaultSchedule();
  startCoordinator();
}


