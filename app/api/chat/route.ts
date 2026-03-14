import { NextRequest, NextResponse } from 'next/server';
import { groq, SYSTEM_PROMPT } from '@/lib/groq';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      // Return a mock response if no API key is set
      return NextResponse.json({
        message: {
          role: 'assistant',
          content:
            "Hey, I hear you. 💜 I'm here to listen and support you through whatever you're going through. While I'm running in demo mode right now (no API key configured), know that the full version of Peaclify will be able to have deep, meaningful conversations with you. You matter, and your feelings are valid. 🌟",
        },
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
    });

    const responseMessage = completion.choices[0]?.message;

    return NextResponse.json({
      message: responseMessage,
    });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
