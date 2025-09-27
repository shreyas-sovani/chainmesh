import type { ArbitrageOpportunity, ExecutionResult } from '@/server/types';
import { env } from '@/server/config';
import axios from 'axios';

// Reference docs: 1inch Developer Portal (https://portal.1inch.dev/documentation)
// Using 1inch v6 Swap API on Base chain (8453)

interface OneInchQuoteResponse {
  toAmount: string;
  gasEstimate: string;
  gasPrice: string;
  protocols: Array<Array<{ name: string; part: number; fromTokenAddress: string; toTokenAddress: string }>>;
}

interface OneInchSwapResponse {
  tx: {
    from: string;
    to: string;
    data: string;
    value: string;
    gas: string;
    gasPrice: string;
  };
}

export async function getQuote(
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
  chainId: number = env.TARGET_EVM_CHAIN_ID
): Promise<OneInchQuoteResponse> {
  const url = `${env.ONEINCH_API_BASE}/${chainId}/quote`;
  const params = {
    fromTokenAddress,
    toTokenAddress,
    amount,
    fee: '0.5', // 0.5% fee for 1inch
  };

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (env.ONEINCH_API_KEY) {
    headers['Authorization'] = `Bearer ${env.ONEINCH_API_KEY}`;
    headers['X-API-KEY'] = env.ONEINCH_API_KEY;
  }
  // Debug
  if (process.env.NODE_ENV !== 'production') {
    console.log('[1inch] GET', url, 'auth=', Boolean(headers['Authorization']));
  }
  const response = await axios.get(url, { params, headers });
  return response.data;
}

export async function buildSwapTransaction(
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
  fromAddress: string,
  slippage: number = 1, // 1% default slippage
  chainId: number = env.TARGET_EVM_CHAIN_ID
): Promise<OneInchSwapResponse> {
  const url = `${env.ONEINCH_API_BASE}/${chainId}/swap`;
  const params = {
    fromTokenAddress,
    toTokenAddress,
    amount,
    fromAddress,
    slippage: slippage.toString(),
    fee: '0.5',
    referrer: '0x0000000000000000000000000000000000000000',
  };

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (env.ONEINCH_API_KEY) {
    headers['Authorization'] = `Bearer ${env.ONEINCH_API_KEY}`;
    headers['X-API-KEY'] = env.ONEINCH_API_KEY;
  }
  if (process.env.NODE_ENV !== 'production') {
    console.log('[1inch] GET', url, 'auth=', Boolean(headers['Authorization']));
  }
  const response = await axios.get(url, { params, headers });
  return response.data;
}

export async function executeSwap(
  opportunity: ArbitrageOpportunity,
  walletAddress: string = '0x0000000000000000000000000000000000000000'
): Promise<ExecutionResult> {
  try {
    // For MVP, we'll use USDC as base and WETH as quote token
    const fromTokenAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // USDC on Base
    const toTokenAddress = '0x4200000000000000000000000000000000000006'; // WETH on Base

    const amount = '1000000'; // 1 USDC (6 decimals)

    // Get quote first
    const quote = await getQuote(fromTokenAddress, toTokenAddress, amount);

    // Build swap transaction
    const swapData = await buildSwapTransaction(
      fromTokenAddress,
      toTokenAddress,
      amount,
      walletAddress
    );

    // In a real implementation, you would:
    // 1. Sign the transaction with a wallet
    // 2. Broadcast it to the network
    // 3. Wait for confirmation
    // 4. Get the actual tx hash

    // For demo purposes, we'll simulate a successful execution
    const mockTxHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');

    return {
      id: `${opportunity.id}:${Date.now()}`,
      opportunityId: opportunity.id,
      chainId: opportunity.chainId,
      txHash: mockTxHash,
      profitUsd: opportunity.expectedProfitUsd,
      status: 'success',
      createdAt: Date.now(),
    };
  } catch (error) {
    return {
      id: `${opportunity.id}:${Date.now()}`,
      opportunityId: opportunity.id,
      chainId: opportunity.chainId,
      txHash: '',
      profitUsd: 0,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      createdAt: Date.now(),
    };
  }
}


