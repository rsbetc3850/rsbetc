import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This ensures the route is handled dynamically
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, isAvailable, id } = data;

    // Either update existing employee or create a new one
    if (id) {
      const employee = await prisma.employee.update({
        where: { id: parseInt(id) },
        data: { 
          name, 
          isAvailable,
          lastSeen: new Date()
        }
      });
      return NextResponse.json(employee);
    } else {
      const employee = await prisma.employee.create({
        data: { 
          name, 
          isAvailable,
          lastSeen: new Date()
        }
      });
      return NextResponse.json(employee);
    }
  } catch (error) {
    console.error('Error handling employee:', error);
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get all available employees
    const employees = await prisma.employee.findMany({
      where: { isAvailable: true },
      orderBy: { lastSeen: 'desc' }
    });

    return NextResponse.json({ employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}