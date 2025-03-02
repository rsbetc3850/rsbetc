import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This ensures the route is handled dynamically
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch all active sessions
    const sessions = await prisma.chatSession.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        employee: {
          select: {
            name: true
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1 // Get the most recent message
        }
      }
    });
    
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}