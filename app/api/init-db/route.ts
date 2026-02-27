import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { initDb } from '@/lib/db';

// POST /api/init-db - Initialize database schema (admin only)
export async function POST() {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    await initDb();
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
