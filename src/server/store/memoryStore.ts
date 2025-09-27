import { EventEmitter } from 'events';
import type {
  ArbitrageOpportunity,
  ExecutionResult,
  ProofResult,
  Schedule,
} from '@/server/types';

export const bus = new EventEmitter();

const schedules = new Map<string, Schedule>();
const opportunities = new Map<string, ArbitrageOpportunity>();
const proofs = new Map<string, ProofResult>();
const executions = new Map<string, ExecutionResult>();

export function upsertSchedule(schedule: Schedule): void {
  schedules.set(schedule.id, schedule);
}

export function getSchedules(): Schedule[] {
  return Array.from(schedules.values()).sort((a, b) => a.createdAt - b.createdAt);
}

export function getSchedule(id: string): Schedule | undefined {
  return schedules.get(id);
}

export function removeSchedule(id: string): void {
  schedules.delete(id);
}

export function addOpportunity(opp: ArbitrageOpportunity): void {
  opportunities.set(opp.id, opp);
  bus.emit('opportunity', opp);
}

export function getOpportunities(): ArbitrageOpportunity[] {
  return Array.from(opportunities.values()).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

export function addProof(proof: ProofResult): void {
  proofs.set(proof.opportunityId, proof);
}

export function getProof(opportunityId: string): ProofResult | undefined {
  return proofs.get(opportunityId);
}

export function getProofs(): ProofResult[] {
  return Array.from(proofs.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function addExecution(exec: ExecutionResult): void {
  executions.set(exec.id, exec);
  bus.emit('execution', exec);
}

export function getExecutions(): ExecutionResult[] {
  return Array.from(executions.values()).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}


