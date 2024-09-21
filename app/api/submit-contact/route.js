import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(req) {
  if (req.method === 'POST') {
    try {
      const formData = await req.json();

      // Prepare data for database
      const contactData = {
        ...formData,
        role: formData.role === 'Other' ? formData.otherRole : formData.role,
        howDidYouHearAboutUs: formData.howDidYouHearAboutUs === 'Other' ? formData.otherSource : formData.howDidYouHearAboutUs,
      };

      // Save to database
      const savedContact = await prisma.contact.create({
        data: contactData,
      });

      // Send email
      let transporter = nodemailer.createTransport({
        // Configure your email service here
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'reallmynl@gmail.com', // your email
          pass: 'kxvr hiaz pjex rhqa', // your email password
        },
      });

      await transporter.sendMail({
        from: '"LMYNL SPACES" <reallmynl@gmail.com>',
        to: "reallmynl@gmail.com",
        subject: "New Contact Form Submission",
        text: JSON.stringify(contactData, null, 2),
        html: `<pre>${JSON.stringify(contactData, null, 2)}</pre>`,
      });

      return NextResponse.json({ message: 'Form submitted successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ message: 'Error submitting form' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
}