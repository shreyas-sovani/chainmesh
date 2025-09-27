import { addExecution, bus } from '@/server/store/memoryStore';
import { executeSwap } from '@/server/services/oneInch';
import { reportExecutionToFlow } from '@/server/services/flow';
import type { ArbitrageOpportunity } from '@/server/types';

// Simplified executor - skip ZK proofs for now, just execute profitable opportunities
export async function maybeExecute(opp: ArbitrageOpportunity): Promise<void> {
  // For now, we assume all opportunities above threshold are valid
  // In production, you would validate with ZK proofs or other mechanisms

  const exec = await executeSwap(opp);
  addExecution(exec);

  if (exec.status === 'success') {
    await reportExecutionToFlow(exec);
  }

  bus.emit('executed', exec);
}


