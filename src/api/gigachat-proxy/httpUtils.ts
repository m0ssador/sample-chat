import type { IncomingMessage, ServerResponse } from 'node:http';

export async function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => {
      chunks.push(c);
    });
    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    req.on('error', reject);
  });
}

/** Подгрузка web ReadableStream в Node ServerResponse. */
export async function pumpWebStreamToResponse(
  webStream: ReadableStream<Uint8Array>,
  res: ServerResponse,
): Promise<void> {
  const reader = webStream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value?.byteLength) {
        await new Promise<void>((resolve, reject) => {
          res.write(Buffer.from(value), (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    }
  } finally {
    reader.releaseLock();
    if (!res.writableEnded) {
      res.end();
    }
  }
}
