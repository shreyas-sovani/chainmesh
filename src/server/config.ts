import { z } from 'zod';

const envSchema = z.object({
  ONEINCH_API_BASE: z
    .string()
    .default('https://api.1inch.dev/swap/v6.0'),
  EVM_RPC_URL: z.string().optional(),
  FLOW_ACCESS_API: z
    .string()
    .default('https://rest-testnet.onflow.org'),
  ONEINCH_API_KEY: z.string().optional(),
  FLOW_ACCOUNT_ADDRESS: z.string().optional(),
  FLOW_PRIVATE_KEY: z.string().optional(),
  PROFIT_BPS_THRESHOLD: z.coerce.number().int().min(0).default(50),
  TARGET_EVM_CHAIN_ID: z.coerce.number().int().default(8453), // Base mainnet by default
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(
    `Invalid environment configuration: ${parsed.error.message}`
  );
}

export const env = parsed.data;


