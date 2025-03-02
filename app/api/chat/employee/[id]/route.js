import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This ensures the route is handled dynamically
export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }
    
    // Find employee by ID
    const employee = await prisma.employee.findUnique({
      where: { 
        id: parseInt(id) 
      }
    });
    
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    
    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
  }
}