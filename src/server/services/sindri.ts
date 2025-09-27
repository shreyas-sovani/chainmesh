import { createHash, randomBytes } from 'node:crypto';
import { env } from '@/server/config';
import type { ArbitrageOpportunity, ProofResult } from '@/server/types';

// Reference docs: Sindri JS SDK (https://github.com/Sindri-Labs/sindri-js)
// For the MVP we simulate off-chain proof generation and validity check.

export async function generateProfitProof(
  opportunity: ArbitrageOpportunity
): Promise<ProofResult> {
  const threshold = env.PROFIT_BPS_THRESHOLD;
  const valid = opportunity.expectedProfitBps >= threshold;

  const salt = randomBytes(16).toString('hex');
  const proofHash = createHash('sha256')
    .update(`${opportunity.id}:${opportunity.expectedProfitBps}:${salt}`)
    .digest('hex');
  const publicSignalsHash = createHash('sha256')
    .update(`${opportunity.chainId}:${threshold}:${opportunity.expectedProfitUsd}`)
    .digest('hex');

  return {
    opportunityId: opportunity.id,
    proofHash,
    publicSignalsHash,
    valid,
    thresholdBps: threshold,
    createdAt: Date.now(),
  };
}


