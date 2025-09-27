import { NextRequest, NextResponse } from 'next/server';
import { getSchedules } from '@/server/store/memoryStore';
import { upsertAndReschedule } from '@/server/agents/coordinator';
import type { Schedule } from '@/server/types';

export async function GET() {
  return NextResponse.json({ schedules: getSchedules() });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Schedule>;
  if (!body.id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }
  const schedule: Schedule = {
    id: body.id,
    name: body.name ?? 'Scan',
    intervalSeconds: body.intervalSeconds ?? 30,
    nextRunAt: Date.now() + (body.intervalSeconds ?? 30) * 1000,
    enabled: body.enabled ?? true,
    createdAt: Date.now(),
  };
  upsertAndReschedule(schedule);
  return NextResponse.json({ schedule });
}


