export type ChainId = number;

export interface Schedule {
  id: string;
  name: string;
  intervalSeconds: number;
  nextRunAt: number;
  enabled: boolean;
  createdAt: number;
}

export interface ArbitrageOpportunity {
  id: string;
  chainId: ChainId;
  baseSymbol: string;
  quoteSymbol: string;
  expectedProfitBps: number;
  expectedProfitUsd: number;
  createdAt: number;
  proofHash?: string;
  publicSignalsHash?: string;
}

export interface ProofResult {
  opportunityId: string;
  proofHash: string;
  publicSignalsHash: string;
  valid: boolean;
  thresholdBps: number;
  createdAt: number;
}

export type ExecutionStatus = 'success' | 'failed';

export interface ExecutionResult {
  id: string;
  opportunityId: string;
  chainId: ChainId;
  txHash: string;
  profitUsd: number;
  status: ExecutionStatus;
  error?: string;
  createdAt: number;
}

export interface AgentStatus {
  coordinatorRunning: boolean;
  lastCallbackAt?: number;
  lastError?: string;
}


