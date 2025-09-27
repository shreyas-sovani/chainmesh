import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function main() {
  // Dynamically import after env is loaded so config sees ONEINCH_API_KEY
  const { scanMarkets } = await import('../src/server/agents/scout')
  const { executeSwap } = await import('../src/server/services/oneInch')
  const opp = await scanMarkets()
  if (!opp) {
    console.log('No opportunities found')
    return
  }
  console.log('Opportunity:', opp)
  const res = await executeSwap(opp)
  console.log('Execution:', res)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
