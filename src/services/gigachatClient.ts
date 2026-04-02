export type GigachatApiRole = 'user' | 'assistant';

export interface GigachatApiMessage {
  role: GigachatApiRole;
  content: string;
}

const CHAT_URL = '/api/gigachat/chat/completions';

async function readHttpErrorMessage(res: Response): Promise<string> {
  const t = await res.text();
  try {
    const j = JSON.parse(t) as { error?: string; details?: string };
    if (j.error && j.details) return `${j.error}: ${j.details}`;
    if (j.error) return j.error;
  } catch {

  }
  return t.slice(0, 400) || `HTTP ${res.status}`;
}

export async function postGigaChatStream(
  messages: GigachatApiMessage[],
  options: {
    signal?: AbortSignal;
    model?: string;
    onDelta: (delta: string) => void;
  },
): Promise<void> {
  const res = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({
      model: options.model ?? 'GigaChat',
      messages,
      stream: true,
    }),
    signal: options.signal,
  });

  if (!res.ok) {
    throw new Error(await readHttpErrorMessage(res));
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error('Пустой поток ответа');
  }

  const decoder = new TextDecoder();
  let lineBuffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    lineBuffer += decoder.decode(value, { stream: true });
    const lines = lineBuffer.split(/\r?\n/);
    lineBuffer = lines.pop() ?? '';
    for (const line of lines) {
      processSseLine(line, options.onDelta);
    }
  }

  if (lineBuffer.trim()) {
    for (const line of lineBuffer.split(/\r?\n/)) {
      processSseLine(line, options.onDelta);
    }
  }
}

function processSseLine(line: string, onDelta: (d: string) => void): void {
  const trimmed = line.trim();
  if (!trimmed.startsWith('data:')) return;
  const data = trimmed.slice(5).trim();
  if (data === '[DONE]') return;
  try {
    const json = JSON.parse(data) as {
      choices?: { delta?: { content?: string } }[];
    };
    const piece = json.choices?.[0]?.delta?.content;
    if (piece) onDelta(piece);
  } catch {
    
  }
}

export async function postGigaChatComplete(
  messages: GigachatApiMessage[],
  options: { signal?: AbortSignal; model?: string },
): Promise<string> {
  const res = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      model: options.model ?? 'GigaChat',
      messages,
      stream: false,
    }),
    signal: options.signal,
  });

  if (!res.ok) {
    throw new Error(await readHttpErrorMessage(res));
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = json.choices?.[0]?.message?.content;
  if (typeof text !== 'string') {
    throw new Error('В ответе GigaChat нет choices[0].message.content');
  }
  return text;
}

export function messagesToGigaChatPayload(
  messages: { role: string; content: string }[],
): GigachatApiMessage[] {
  return messages
    .filter(
      (m): m is GigachatApiMessage =>
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string',
    )
    .map((m) => ({ role: m.role, content: m.content }));
}
