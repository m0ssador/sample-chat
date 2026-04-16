import type { NextRequest } from 'next/server';
import { handleGigaChat } from '@/lib/gigachat/handleGigaChat';

export async function OPTIONS(request: NextRequest) {
  return handleGigaChat(request, request.nextUrl.pathname);
}

export async function GET(request: NextRequest) {
  return handleGigaChat(request, request.nextUrl.pathname);
}
