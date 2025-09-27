import { NextRequest, NextResponse } from 'next/server';
import { getProof, getProofs } from '@/server/store/memoryStore';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('opportunityId');
  if (id) return NextResponse.json({ proof: getProof(id) });
  return NextResponse.json({ proofs: getProofs() });
}


