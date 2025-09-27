import { addExecution, bus } from '@/server/store/memoryStore';
import { executeSwap } from '@/server/services/oneInch';
import type { ArbitrageOpportunity, ExecutionResult } from '@/server/types';

// Simplified executor - skip ZK proofs for now, just execute profitable opportunities
export async function maybeExecute(opp: ArbitrageOpportunity): Promise<ExecutionResult | null> {
  // For now, we assume all opportunities above threshold are valid
  // In production, you would validate with ZK proofs or other mechanisms

  const exec = await executeSwap(opp);
  addExecution(exec);
  bus.emit('executed', exec);
  return exec;
}


