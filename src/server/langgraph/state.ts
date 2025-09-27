import type { AgentContextState } from '@/server/types';

export type AgentGraphState = AgentContextState;

export type AgentGraphUpdate = Partial<AgentGraphState>;

export const initialAgentState: AgentGraphState = {};

