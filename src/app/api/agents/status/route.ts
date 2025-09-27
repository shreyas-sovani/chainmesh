import { NextResponse } from 'next/server';
import { getCoordinatorStatus } from '@/server/agents/coordinator';

export async function GET() {
  return NextResponse.json({ status: getCoordinatorStatus() });
}


