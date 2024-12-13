import { Configuration, OpenAIApi } from 'openai';
import { NextResponse } from 'next/server';
import { ReadableStream } from 'web-streams-polyfill/ponyfill';

// Configure OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Define the edge runtime for Next.js
export const runtime = 'edge';

// Function to handle OpenAI streaming
async function createStream(response: Response) {
  const reader = response.body?.getReader();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller: ReadableStreamDefaultController<Uint8Array>) {
      if (!reader) {
        controller.close();
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          break;
        }
        controller.enqueue(value);
      }
    },
  });

  return stream;
}

// POST handler for Next.js API route
export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        prompt,
        max_tokens: 400,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      return NextResponse.json(errorBody, { status: response.status });
    }

    const stream = await createStream(response);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    });
  } catch (error) {
    console.error('An unexpected error occurred:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message, details: error.stack },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
