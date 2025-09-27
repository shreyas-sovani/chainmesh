import { reportExecutionToFlow } from '@/server/services/flow';
import { executeSwap } from '@/server/services/oneInch';
import { addExecution, addOpportunity } from '@/server/store/memoryStore';
import type { AgentGraphState } from '@/server/langgraph/state';
import { scanMarkets } from '@/server/agents/scout';

export type AgentGraphNode = (state: AgentGraphState) => Promise<Partial<AgentGraphState>>;

export const scoutNode: AgentGraphNode = async () => {
  const opportunity = await scanMarkets();
  if (!opportunity) {
    return {};
  }
  addOpportunity(opportunity);
  return { opportunity };
};

export const executeNode: AgentGraphNode = async (state) => {
  if (!state.opportunity) {
    return {};
  }
  try {
    const execution = await executeSwap(state.opportunity);
    addExecution(execution);
    return {
      execution,
      error: execution.status === 'failed' ? execution.error ?? 'Execution failed' : undefined,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
};

export const reportNode: AgentGraphNode = async (state) => {
  if (!state.execution || state.execution.status !== 'success' || !state.opportunity) {
    return {};
  }
  await reportExecutionToFlow(state.execution);
  return {};
};

export const noopNode: AgentGraphNode = async () => ({});

