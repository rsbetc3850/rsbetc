import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create Prisma client - best practice is to reuse a single instance
const prisma = new PrismaClient();

// Format contact data into a readable HTML email
function formatContactDataHtml(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #e11d48; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">New Contact Form Submission</h2>
      
      <div style="margin-bottom: 20px;">
        <p><strong>Name:</strong> ${data.name}</p>
        ${data.email ? `<p><strong>Email:</strong> ${data.email}</p>` : ''}
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
        ${data.bestTimeToContact ? `<p><strong>Best Time to Contact:</strong> ${data.bestTimeToContact}</p>` : ''}
        ${data.howDidYouHearAboutUs ? `<p><strong>How they heard about us:</strong> ${data.howDidYouHearAboutUs}</p>` : ''}
      </div>
      
      ${data.subject ? `
      <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
        <h3 style="margin-top: 0; color: #374151;">Message:</h3>
        <p style="white-space: pre-wrap;">${data.subject}</p>
      </div>
      ` : ''}
      
      <div style="margin-top: 20px; font-size: 12px; color: #6b7280;">
        <p>Submitted on: ${new Date().toLocaleString()}</p>
        <p>Marketing Opt-in: ${data.optIn ? 'Yes' : 'No'}</p>
      </div>
    </div>
  `;
}

export async function POST(req) {
  // Check if it's a POST request - this is redundant in Next.js Route Handlers as they're method-specific
  try {
    const formData = await req.json();

    // Prepare data for database with cleaner fields
    const contactData = {
      ...formData,
      // Store actual source, using otherSource when "Other" is selected  
      howDidYouHearAboutUs: formData.howDidYouHearAboutUs === 'Other' 
        ? formData.otherSource 
        : formData.howDidYouHearAboutUs,
    };

    // Save to database
    const savedContact = await prisma.contact.create({
      data: contactData,
    });

    // Email configuration - using environment variables
    // These should be set in your environment or .env file
    const emailUser = process.env.EMAIL_USER || 'reallmynl@gmail.com';
    const emailPass = process.env.EMAIL_PASS;
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'rsbetc3850@gmail.com';
    
    // Only attempt to send email if we have required credentials
    if (emailUser && emailPass) {
      // Set up email transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      // Generate email content
      const htmlContent = formatContactDataHtml(contactData);
      
      // Send email with formatted content
      await transporter.sendMail({
        from: '"BATTERIESETCONLINE.COM" <' + emailUser + '>',
        to: recipientEmail,
        subject: "New Contact Form Submission",
        text: `New contact form submission from ${contactData.name}`,
        html: htmlContent,
      });
    } else {
      console.warn('Email not sent: Missing email credentials in environment variables');
    }

    return NextResponse.json({ 
      message: 'Form submitted successfully', 
      id: savedContact.id 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ 
      message: 'Error submitting form', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  }
}
