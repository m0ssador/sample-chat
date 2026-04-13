/**
 * Пишет public/gigachat-proxy.json из GIGACHAT_PROXY_URL (CI передаёт vars/secrets в эту переменную).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outFile = path.join(root, 'public', 'gigachat-proxy.json');

const url = (process.env.GIGACHAT_PROXY_URL ?? '').trim();

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ url }, null, 0), 'utf8');
process.stdout.write(`gigachat-proxy.json written, url length: ${url.length}\n`);
