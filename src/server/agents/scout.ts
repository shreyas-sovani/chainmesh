import { env } from '@/server/config';
import { addOpportunity } from '@/server/store/memoryStore';
import { getQuote } from '@/server/services/oneInch';
import type { ArbitrageOpportunity } from '@/server/types';

// Using real 1inch API to scan for arbitrage opportunities
// We'll check USDC -> WETH swaps and look for profitable opportunities

export async function scanMarkets(): Promise<ArbitrageOpportunity | null> {
  try {
    // Use USDC and WETH on Base for scanning
    const fromTokenAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // USDC on Base
    const toTokenAddress = '0x4200000000000000000000000000000000000006'; // WETH on Base

    const amount = '1000000'; // 1 USDC (6 decimals)

    // Get quote from 1inch
    const quote = await getQuote(fromTokenAddress, toTokenAddress, amount);

    // Calculate potential profit (simplified - in reality would compare with other DEXes)
    const toAmount = parseInt(quote.toAmount);
    const inputAmount = parseInt(amount);
    const wethPrice = 2000; // Assume $2000 per WETH for calculation
    const expectedOutputUsd = (toAmount / 1e18) * wethPrice;
    const inputUsd = (inputAmount / 1e6); // USDC has 6 decimals

    const profitUsd = expectedOutputUsd - inputUsd;
    const profitBps = (profitUsd / inputUsd) * 10000; // Basis points

    // Only create opportunity if profitable above threshold
    if (profitBps >= env.PROFIT_BPS_THRESHOLD) {
      const opp: ArbitrageOpportunity = {
        id: `${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
        chainId: env.TARGET_EVM_CHAIN_ID,
        baseSymbol: 'USDC',
        quoteSymbol: 'WETH',
        expectedProfitBps: Math.floor(profitBps),
        expectedProfitUsd: parseFloat(profitUsd.toFixed(2)),
        createdAt: Date.now(),
      };

      addOpportunity(opp);
      return opp;
    }

    return null;
  } catch (error) {
    console.error('Error scanning markets:', error);
    return null;
  }
}


