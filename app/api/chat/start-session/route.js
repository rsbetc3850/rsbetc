import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This ensures the route is handled dynamically
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, phone, email, query } = data;
    
    // Find an available employee
    const availableEmployee = await prisma.employee.findFirst({
      where: { isAvailable: true },
      orderBy: { lastSeen: 'desc' } // Get the most recently active employee
    });
    
    // Create a new chat session
    const session = await prisma.chatSession.create({
      data: {
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        query: query,
        employeeId: availableEmployee?.id || null,
        status: 'active'
      },
      include: {
        employee: true
      }
    });
    
    // If an employee is available, connect them to this session
    if (availableEmployee) {
      // Update the employee's last seen timestamp
      await prisma.employee.update({
        where: { id: availableEmployee.id },
        data: { lastSeen: new Date() }
      });
      
      return NextResponse.json({
        sessionId: session.id,
        employeeConnected: true,
        employeeName: availableEmployee.name
      });
    } else {
      // No employee available, set the session to be handled by AI
      return NextResponse.json({
        sessionId: session.id,
        employeeConnected: false,
        useAI: true
      });
    }
  } catch (error) {
    console.error('Error starting chat session:', error);
    return NextResponse.json({ error: 'Failed to start chat session' }, { status: 500 });
  }
}