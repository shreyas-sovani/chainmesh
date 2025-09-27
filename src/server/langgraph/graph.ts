import { StateGraph, START, END } from '@langchain/langgraph';
import type { AgentGraphState } from '@/server/langgraph/state';
import { scoutNode, executeNode, reportNode } from '@/server/langgraph/nodes';

let compiledGraph: ReturnType<StateGraph<AgentGraphState>['compile']> | null = null;

export function getAgentGraph() {
  if (compiledGraph) return compiledGraph;

  const graph = new StateGraph<AgentGraphState>({ channels: {} });

  graph.addNode('scout', async (state) => ({ ...state, ...(await scoutNode(state)) }));
  graph.addNode('execute', async (state) => ({ ...state, ...(await executeNode(state)) }));
  graph.addNode('report', async (state) => ({ ...state, ...(await reportNode(state)) }));

  graph.addEdge(START, 'scout');
  graph.addEdge('scout', 'execute');
  graph.addEdge('execute', 'report');
  graph.addEdge('report', END);

  compiledGraph = graph.compile();
  return compiledGraph;
}

