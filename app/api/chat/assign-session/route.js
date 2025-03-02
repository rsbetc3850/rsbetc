import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This ensures the route is handled dynamically
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const data = await req.json();
    const { sessionId, employeeId } = data;
    
    if (!sessionId || !employeeId) {
      return NextResponse.json({ error: 'Session ID and employee ID are required' }, { status: 400 });
    }
    
    // Update the session with the employee ID
    const updatedSession = await prisma.chatSession.update({
      where: { id: parseInt(sessionId) },
      data: { 
        employeeId: parseInt(employeeId),
        updatedAt: new Date()
      },
      include: {
        employee: true
      }
    });
    
    // Update the employee's last seen timestamp
    await prisma.employee.update({
      where: { id: parseInt(employeeId) },
      data: { lastSeen: new Date() }
    });
    
    return NextResponse.json({
      session: updatedSession,
      success: true
    });
  } catch (error) {
    console.error('Error assigning session:', error);
    return NextResponse.json({ error: 'Failed to assign session' }, { status: 500 });
  }
}