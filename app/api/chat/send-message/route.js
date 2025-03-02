import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This ensures the route is handled dynamically
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const data = await req.json();
    const { sessionId, content, isFromCustomer, employeeId, aiGenerated } = data;
    
    // Validate session exists
    const session = await prisma.chatSession.findUnique({
      where: { id: parseInt(sessionId) }
    });
    
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    // Create a new message
    const message = await prisma.chatMessage.create({
      data: {
        content,
        isFromCustomer,
        aiGenerated: aiGenerated || false,
        sessionId: parseInt(sessionId),
        employeeId: employeeId ? parseInt(employeeId) : null
      }
    });
    
    // Update the session's updatedAt timestamp
    await prisma.chatSession.update({
      where: { id: parseInt(sessionId) },
      data: { updatedAt: new Date() }
    });
    
    // Check if we need to use AI (no employee assigned)
    const useAI = !session.employeeId;
    
    return NextResponse.json({
      message,
      useAI
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}