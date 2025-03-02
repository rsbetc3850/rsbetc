import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This ensures the route is handled dynamically
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const data = await req.json();
    const { id, isAvailable } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }
    
    // Explicitly update only the availability
    const employee = await prisma.employee.update({
      where: { 
        id: parseInt(id) 
      },
      data: { 
        isAvailable: isAvailable,
        lastSeen: new Date()
      }
    });
    
    console.log(`Updated employee ${id} availability to ${isAvailable}`);
    
    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error updating employee availability:', error);
    return NextResponse.json({ error: 'Failed to update employee availability' }, { status: 500 });
  }
}