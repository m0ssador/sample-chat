import { Agent, fetch as undiciFetch } from 'undici';
import type { RequestInit as UndiciRequestInit } from 'undici';
import { isInsecureSslFlag } from './env';

type FetchFn = typeof globalThis.fetch;

export function createUpstreamFetch(env: Record<string, string>): FetchFn {
  if (!isInsecureSslFlag(env.GIGACHAT_INSECURE_SSL)) {
    return globalThis.fetch.bind(globalThis);
  }

  const agent = new Agent({
    connect: {
      rejectUnauthorized: false,
    },
  });

  const bound: FetchFn = (input, init) =>
    undiciFetch(
      input as string | URL,
      { ...(init ?? {}), dispatcher: agent } as UndiciRequestInit,
    ) as unknown as Promise<Response>;

  return bound;
}
