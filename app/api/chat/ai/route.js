import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userMessage = searchParams.get('user');
    const customerName = searchParams.get('customerName');
    const customerPhone = searchParams.get('customerPhone');
    const sessionId = searchParams.get('sessionId');
    
    if (!userMessage || !customerName || !sessionId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // Get previous messages from this session to provide context
    const previousMessages = await prisma.chatMessage.findMany({
      where: {
        chatSessionId: parseInt(sessionId),
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    
    // Format previous messages for the AI context
    const chatHistory = previousMessages.map(msg => {
      return `${msg.isFromCustomer ? customerName : 'Assistant'}: ${msg.content}`;
    }).join('\n');
    
    // Define system prompt server-side with the requested constraints and improved guidance
    const systemPrompt = `You are a helpful customer service representative for BATTERIESETCONLINE.COM, a business that sells batteries and related products. The customer's name is ${customerName}. ${customerPhone ? `Their phone number is ${customerPhone}.` : ''}

Our store is located at 3850 E Gulf to Lake Highway, Suite 11 in Inverness, FL. We're open Monday through Friday from 10am to 7pm, and Saturday 10am - 3pm. Our store is located in the same plaza as the locksmith and adjacent to the Nick Nicholas Ford dealership on route 44 headed away from Inverness towards Lecanto.

Be friendly, professional, and helpful in your responses. Focus on helping the customer with their battery needs. If they need to reach our team, direct them to call 352-344-1962.

For inventory questions: We carry a wide variety of batteries but don't have visibility into current stock levels in this system. You can tell customers "we have a lot of batteries and probably have that one, but I haven't been connected to the inventory system so you would have to call first to confirm availability."

For technical questions: Be as specific and helpful as possible. If the customer asks about what kind of battery a device uses, provide that information if you know it (e.g., "The TI-83 calculator typically uses 4 AAA batteries").

Previous conversation:
${chatHistory}

GUIDELINES:
- DO provide specific technical information about what batteries different devices use when asked
- DO be as helpful as possible with specific information when you know it
- DO NOT discuss prices or provide specific pricing information
- DO NOT mention specific manufacturers or brands unless asked directly
- For inventory questions, explain we likely have common batteries but they should call to confirm availability
- If they ask questions you can't answer, offer to take their contact information and have a human representative get back to them.`;
    
    // Forward request to Cloudflare worker
    const workerUrl = `https://orange-shape-c74e.travis-522.workers.dev/?system=${encodeURIComponent(systemPrompt)}&user=${encodeURIComponent(userMessage)}`;
    
    const response = await fetch(workerUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Worker returned status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to AI service:', error);
    return NextResponse.json({ 
      error: 'Failed to get AI response',
      message: error.message
    }, { status: 500 });
  }
}
