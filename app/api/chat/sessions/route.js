import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This ensures the route is handled dynamically
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch all sessions with focus on active ones
    const sessions = await prisma.chatSession.findMany({
      where: {
        OR: [
          { status: 'active' },
          { 
            status: { not: 'closed' },
            updatedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
          }
        ]
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        employee: {
          select: {
            name: true,
            id: true
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