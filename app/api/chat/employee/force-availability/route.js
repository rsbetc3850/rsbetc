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
      try {
        const employeeIdInt = parseInt(employeeId);
        
        // Check if employee exists first
        const existingEmployee = await prisma.employee.findUnique({
          where: { id: employeeIdInt }
        });
        
        if (!existingEmployee) {
          return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }
        
        const updatedEmployee = await prisma.employee.update({
          where: { id: employeeIdInt },
          data: { 
            isAvailable: true,
            lastSeen: new Date()
          }
        });
        
        console.log(`Force updated employee ${employeeId} to available`, updatedEmployee);
        return NextResponse.json(updatedEmployee);
      } catch (updateError) {
        console.error('Error updating specific employee:', updateError);
        return NextResponse.json({ 
          error: 'Failed to update employee', 
          message: updateError.message 
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ success: true, message: "Status updated successfully" });
    
  } catch (error) {
    console.error('Error updating employee availability:', error);
    return NextResponse.json({ 
      error: 'Failed to update employee availability',
      message: error.message
    }, { status: 500 });
  }
}