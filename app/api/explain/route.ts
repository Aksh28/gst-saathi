import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const API_TIMEOUT_MS = 30_000;
const API_MAX_RETRIES = 3;
const MAX_INPUT_CHARS = 6000;

const SYSTEM_PROMPT = `You are GST Saathi, a plain-language explainer for Indian small shopkeepers who do not understand tax jargon.
You are given the text of a GST filing or invoice. Explain, in simple everyday language (short sentences, no jargon, Hindi-English mixed terms are fine where natural):
1. What this document is and what period/business it covers.
2. In plain terms, how much tax was paid, collected, or claimed back (ITC), and what that means for their money this month.
3. Anything in the document a shopkeeper should double check with their accountant (if unsure, say so plainly rather than guessing).

Rules:
- You are explaining, not auditing or verifying. Never claim the filing is correct, incorrect, fraudulent, or that the accountant made a mistake — you do not have enough information to judge that.
- If the text is not a GST filing or invoice at all, say so plainly instead of making something up.
- Keep the whole answer under 250 words.`;

function getErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : 'Unknown error';
}

function isNetworkError(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes('socket connection was closed') ||
    lower.includes('fetch failed') ||
    lower.includes('econnreset') ||
    lower.includes('etimedout') ||
    lower.includes('network') ||
    lower.includes('terminated')
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text, apiKey: userKey, provider = 'anthropic' } = body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ error: 'Paste or select a GST filing/invoice first.' }, { status: 400 });
  }
  if (text.length > MAX_INPUT_CHARS) {
    return NextResponse.json(
      { error: `That document is too long (max ${MAX_INPUT_CHARS} characters for this prototype).` },
      { status: 400 }
    );
  }

  const resolvedKey =
    userKey?.trim() ||
    (provider === 'openai' ? process.env.OPENAI_API_KEY : process.env.ANTHROPIC_API_KEY);

  if (!resolvedKey) {
    return NextResponse.json(
      {
        error:
          provider === 'openai'
            ? 'No OpenAI key configured on the server.'
            : 'No Anthropic key configured on the server.',
      },
      { status: 400 }
    );
  }

  const userPrompt = `Here is the GST filing/invoice text:\n\n"""\n${text}\n"""`;

  try {
    if (provider === 'openai') {
      const client = new OpenAI({ apiKey: resolvedKey, timeout: API_TIMEOUT_MS, maxRetries: API_MAX_RETRIES });
      const completion = await client.chat.completions.create({
        model: OPENAI_MODEL,
        max_tokens: 600,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      });
      const explanation = completion.choices[0]?.message.content ?? '';
      return NextResponse.json({ explanation, model: OPENAI_MODEL, provider: 'openai' });
    }

    const client = new Anthropic({ apiKey: resolvedKey, timeout: API_TIMEOUT_MS, maxRetries: API_MAX_RETRIES });
    const message = await client.messages.create(
      {
        model: ANTHROPIC_MODEL,
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      },
      { timeout: API_TIMEOUT_MS, maxRetries: API_MAX_RETRIES }
    );
    const explanation = message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ explanation, model: ANTHROPIC_MODEL, provider: 'anthropic' });
  } catch (err: unknown) {
    const msg = getErrorMessage(err);
    const lower = msg.toLowerCase();

    if (msg.includes('401') || lower.includes('invalid') || lower.includes('authentication')) {
      return NextResponse.json({ error: 'Invalid API key - check server configuration.' }, { status: 401 });
    }
    if (msg.includes('429') || lower.includes('rate limit')) {
      return NextResponse.json({ error: 'Rate limit hit - wait a moment and try again.' }, { status: 429 });
    }
    if (isNetworkError(msg)) {
      return NextResponse.json(
        { error: 'Could not reach the AI provider. Please try again.' },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: `AI error: ${msg}` }, { status: 500 });
  }
}
