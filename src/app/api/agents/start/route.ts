import { NextResponse } from 'next/server';
import { startAgents } from '@/server/runtime';
import { getCoordinatorStatus } from '@/server/agents/coordinator';

export async function POST() {
  startAgents();
  return NextResponse.json({ status: getCoordinatorStatus() });
}


