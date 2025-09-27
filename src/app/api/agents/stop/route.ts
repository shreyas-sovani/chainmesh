import { NextResponse } from 'next/server';
import { stopCoordinator, getCoordinatorStatus } from '@/server/agents/coordinator';

export async function POST() {
  stopCoordinator();
  return NextResponse.json({ status: getCoordinatorStatus() });
}


