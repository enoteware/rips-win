import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard, getMetadata } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'all_time';
    
    const [entries, metadata] = await Promise.all([
      getLeaderboard(period, true),
      getMetadata(period),
    ]);
    
    return NextResponse.json({
      entries,
      metadata,
      period,
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
