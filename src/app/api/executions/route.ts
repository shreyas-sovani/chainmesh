import { NextResponse } from 'next/server';
import { getExecutions } from '@/server/store/memoryStore';

export async function GET() {
  return NextResponse.json({ executions: getExecutions() });
}


