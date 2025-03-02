import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This ensures the route is handled dynamically
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const data = await req.json();
    const { sessionId } = data;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }
    
    // Update the session status to 'closed'
    const closedSession = await prisma.chatSession.update({
      where: { id: parseInt(sessionId) },
      data: { 
        status: 'closed',
        updatedAt: new Date()
      }
    });
    
    // Add a system message indicating the session was closed
    await prisma.chatMessage.create({
      data: {
        content: 'This chat session has been closed.',
        isFromCustomer: false,
        sessionId: parseInt(sessionId),
        aiGenerated: false
      }
    });
    
    return NextResponse.json({
      success: true,
      session: closedSession
    });
  } catch (error) {
    console.error('Error closing session:', error);
    return NextResponse.json({ error: 'Failed to close session' }, { status: 500 });
  }
}