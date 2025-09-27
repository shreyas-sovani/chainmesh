import { ensureDefaultSchedule, startCoordinator } from '@/server/agents/coordinator';
import { getAgentGraph } from '@/server/langgraph/graph';

// Simple bootstrap entrypoint for running agents in-process
export function startAgents(): void {
  // Warm LangGraph so first run does not pay compile cost
  getAgentGraph();
  ensureDefaultSchedule();
  startCoordinator();
}


