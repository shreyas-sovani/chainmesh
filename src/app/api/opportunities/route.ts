import { NextResponse } from 'next/server';
import { getOpportunities } from '@/server/store/memoryStore';

export async function GET() {
  return NextResponse.json({ opportunities: getOpportunities() });
}


