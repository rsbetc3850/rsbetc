import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This ensures the route is handled dynamically
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Delete all chat messages
    await prisma.chatMessage.deleteMany({});
    console.log("All chat messages deleted");
    
    // Delete all chat sessions
    await prisma.chatSession.deleteMany({});
    console.log("All chat sessions deleted");
    
    // Delete all employees
    await prisma.employee.deleteMany({});
    console.log("All employees deleted");
    
    // Set all employees to unavailable
    await prisma.employee.updateMany({
      data: { isAvailable: false }
    });
    console.log("All employees set to unavailable");
    
    return NextResponse.json({ 
      success: true, 
      message: "All chat data has been reset"
    });
  } catch (error) {
    console.error('Error resetting chat data:', error);
    return NextResponse.json({ error: 'Failed to reset chat data' }, { status: 500 });
  }
}