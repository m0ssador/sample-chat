import { handleGigaChat } from '@/lib/gigachat/handleGigaChat';
import {
  CHAT_COMPLETIONS_PATH,
  HEALTH_PATH,
} from '@/api/gigachat-proxy/paths';

export const runtime = 'nodejs';

function pathFromSegments(segments: string[]): string {
  return `/api/gigachat/${segments.join('/')}`;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const pathname = pathFromSegments(path);
  if (pathname !== HEALTH_PATH) {
    return new Response('Not found', { status: 404 });
  }
  return handleGigaChat(request, pathname);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const pathname = pathFromSegments(path);
  if (pathname !== CHAT_COMPLETIONS_PATH) {
    return new Response('Not found', { status: 404 });
  }
  return handleGigaChat(request, pathname);
}
