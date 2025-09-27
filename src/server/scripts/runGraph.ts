import 'dotenv/config';
import { getAgentGraph } from '@/server/langgraph/graph';

async function main() {
  const graph = getAgentGraph();
  const result = await graph.invoke({});
  console.log('LangGraph result:', JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

