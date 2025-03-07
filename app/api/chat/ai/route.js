import { NextResponse } from 'next/server';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userMessage = searchParams.get('user');
    const customerName = searchParams.get('customerName');
    const customerPhone = searchParams.get('customerPhone');
    
    if (!userMessage || !customerName) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // Define system prompt server-side with the requested constraints
    const systemPrompt = `You are a helpful customer service representative for BATTERIESETCONLINE.COM, a business that sells batteries and related products. The customer's name is ${customerName}. ${customerPhone ? `Their phone number is ${customerPhone}.` : ''}

Our store is located at 3850 E Gulf to Lake Highway, Suite 11 in Inverness, FL. We're open Monday through Friday from 10am to 7pm, and Saturday 10am - 3pm. We have a limited selection of SLA batteries and need to match any battery first to ensure compatibility. Our store is located in the same plaza as the locksmith and adjacent to the Nick Nicholas Ford dealership on route 44 headed away from Inverness towards Lecanto.

Be friendly, professional, and concise in your responses. Focus on helping the customer with their battery needs. If they need to reach our team, direct them to call 352-344-1962.

IMPORTANT GUIDELINES:
- Do NOT discuss prices or provide specific pricing information
- Do NOT mention specific manufacturers or brands
- Do NOT discuss inventory levels or product availability
- Emphasize that we need to match batteries to ensure compatibility
- If asked about these topics, politely explain that this information changes frequently and encourage the customer to contact the store directly for the most up-to-date information
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