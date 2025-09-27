import { NextResponse } from 'next/server';
import { getCoordinatorStatus } from '@/server/agents/coordinator';

export async function GET() {
  const status = getCoordinatorStatus();
  return NextResponse.json({ ok: true, coordinator: status });
}


