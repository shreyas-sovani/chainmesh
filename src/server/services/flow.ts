import { bus } from '@/server/store/memoryStore';
import type { ExecutionResult, Schedule } from '@/server/types';
import { env } from '@/server/config';
import axios from 'axios';

// Reference: Flow Access API (https://docs.onflow.org/access-api/)
// Using direct HTTP calls since FCL is browser-focused

interface FlowEvent {
  type: string;
  transactionId: string;
  transactionIndex: number;
  eventIndex: number;
  payload: any;
}

interface FlowBlock {
  header: {
    id: string;
    height: string;
    timestamp: string;
  };
}

interface FlowTransaction {
  id: string;
  script: string;
  arguments: any[];
  referenceBlockId: string;
  gasLimit: string;
  proposalKey: {
    address: string;
    keyId: number;
    sequenceNumber: number;
  };
  payer: string;
  authorizers: string[];
  payloadSignatures: any[];
  envelopeSignatures: any[];
}

export class FlowService {
  private accessApiUrl: string;

  constructor() {
    this.accessApiUrl = env.FLOW_ACCESS_API;
  }

  async getLatestBlock(): Promise<FlowBlock> {
    const response = await axios.post(`${this.accessApiUrl}/v1/blocks`, {
      sealed: true
    });
    return response.data;
  }

  async getEvents(eventType: string, fromBlockHeight: number, toBlockHeight: number): Promise<FlowEvent[]> {
    const response = await axios.post(`${this.accessApiUrl}/v1/events`, {
      type: eventType,
      start_height: fromBlockHeight.toString(),
      end_height: toBlockHeight.toString()
    });
    return response.data;
  }

  async sendTransaction(
    script: string,
    args: any[] = [],
    proposerAddress: string,
    proposerKeyId: number,
    payerAddress: string
  ): Promise<string> {
    // In a real implementation, you would:
    // 1. Get the latest block for reference
    // 2. Build the transaction with proper signatures
    // 3. Sign it with the private key
    // 4. Submit to the network

    // For demo purposes, we'll simulate a transaction ID
    const mockTxId = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return mockTxId;
  }

  async tickScheduler(now: number): Promise<void> {
    // Call the tick transaction on the contract
    const script = `
      import ChainMeshActions from 0xf8d6e0586b0a20c7

      transaction(now: UFix64) {
        prepare(signer: AuthAccount) {}
        execute {
          let adminRef = signer.borrow<&ChainMeshActions.SchedulerAdmin>(from: ChainMeshActions.AdminStoragePath)
            ?? panic("admin not found")
          adminRef.tick(now: now)
        }
      }
    `;

    await this.sendTransaction(script, [now.toString()], env.FLOW_ACCOUNT_ADDRESS || '', 0, env.FLOW_ACCOUNT_ADDRESS || '');
  }

  async reportExecution(
    id: number,
    evmChainId: number,
    txHash: string,
    profit: number,
    proofHash: string,
    publicSignalsHash: string
  ): Promise<void> {
    // Call the report execution transaction
    const script = `
      import ChainMeshActions from 0xf8d6e0586b0a20c7

      transaction(
        id: UInt64,
        evmChainId: UInt64,
        txHash: String,
        profit: UFix64,
        proofHash: String,
        publicSignalsHash: String
      ) {
        prepare(signer: AuthAccount) {}
        execute {
          let reporterRef = signer.borrow<&ChainMeshActions.Reporter>(from: ChainMeshActions.ReporterStoragePath)
            ?? panic("reporter not found")
          reporterRef.reportExecution(
            id: id,
            evmChainId: evmChainId,
            txHash: txHash,
            profit: profit,
            proofHash: proofHash,
            publicSignalsHash: publicSignalsHash
          )
        }
      }
    `;

    await this.sendTransaction(
      script,
      [id.toString(), evmChainId.toString(), txHash, profit.toString(), proofHash, publicSignalsHash],
      env.FLOW_ACCOUNT_ADDRESS || '',
      0,
      env.FLOW_ACCOUNT_ADDRESS || ''
    );
  }

  async pollForTaskReadyEvents(lastProcessedHeight: number): Promise<{events: FlowEvent[], latestHeight: number}> {
    try {
      const latestBlock = await this.getLatestBlock();
      const latestHeight = parseInt(latestBlock.header.height);

      if (latestHeight <= lastProcessedHeight) {
        return { events: [], latestHeight };
      }

      const events = await this.getEvents('A.f8d6e0586b0a20c7.ChainMeshActions.TaskReady', lastProcessedHeight + 1, latestHeight);

      return { events, latestHeight };
    } catch (error) {
      console.error('Error polling for TaskReady events:', error);
      return { events: [], latestHeight: lastProcessedHeight };
    }
  }
}

// Singleton instance
let flowServiceInstance: FlowService | null = null;

export function getFlowService(): FlowService {
  if (!flowServiceInstance) {
    flowServiceInstance = new FlowService();
  }
  return flowServiceInstance;
}

export function emitScheduledCallback(schedule: Schedule): void {
  bus.emit('scheduledCallback', { scheduleId: schedule.id, at: Date.now() });
}

export async function reportExecutionToFlow(result: ExecutionResult): Promise<void> {
  const flowService = getFlowService();

  try {
    // For demo, we'll skip the actual transaction and just emit the event
    // In production, you would call:
    // await flowService.reportExecution(
    //   parseInt(result.id.split(':')[0]),
    //   result.chainId,
    //   result.txHash,
    //   result.profitUsd,
    //   'mock_proof_hash',
    //   'mock_public_signals_hash'
    // );

    bus.emit('flowReport', result);
  } catch (error) {
    console.error('Failed to report execution to Flow:', error);
    bus.emit('flowReport', result);
  }
}


