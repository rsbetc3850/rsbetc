import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This ensures the route is handled dynamically
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
  try {
    const data = await req.json();
    const { isAvailable, employeeId } = data;
    
    console.log("Force availability update request:", data);
    
    // Handle the case where there's no employee ID
    if (!employeeId) {
      // Set all employees to unavailable regardless of requested state
      await prisma.employee.updateMany({
        data: { 
          isAvailable: false
        }
      });
      
      return NextResponse.json({ success: true, message: "All employees set to unavailable" });
    }
    
    // First, set ALL employees to unavailable to avoid conflicts
    await prisma.employee.updateMany({
      data: { 
        isAvailable: false
      }
    });
    
    // If we're setting to available, update just this employee
    if (isAvailable) {
      const updatedEmployee = await prisma.employee.update({
        where: { 
          id: parseInt(employeeId) 
        },
        data: { 
          isAvailable: true,
          lastSeen: new Date()
        }
      });
      
      console.log(`Force updated employee ${employeeId} to available`, updatedEmployee);
      return NextResponse.json(updatedEmployee);
    }
    
    return NextResponse.json({ success: true, message: "Status updated successfully" });
    
  } catch (error) {
    console.error('Error updating employee availability:', error);
    return NextResponse.json({ error: 'Failed to update employee availability' }, { status: 500 });
  }
}