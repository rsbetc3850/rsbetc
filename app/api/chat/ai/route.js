import { NextResponse } from 'next/server';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const systemPrompt = searchParams.get('system');
    const userMessage = searchParams.get('user');
    
    if (!systemPrompt || !userMessage) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
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