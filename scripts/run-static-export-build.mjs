/**
 * output: 'export' несовместим с Route Handlers — перед сборкой Pages убираем app/api и возвращаем после.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const apiDir = path.join(root, 'src', 'app', 'api');
/** Вне `src/app`, иначе Next воспринимает каталог как сегмент маршрута. */
const stashDir = path.join(root, '.api-stash-for-pages-build');
const require = createRequire(import.meta.url);
const nextCli = require.resolve('next/dist/bin/next');

function stashApiDir() {
  if (!fs.existsSync(apiDir)) return;
  if (fs.existsSync(stashDir)) {
    fs.rmSync(stashDir, { recursive: true, force: true });
  }
  fs.renameSync(apiDir, stashDir);
}

function unstashApiDir() {
  if (!fs.existsSync(stashDir)) return;
  if (fs.existsSync(apiDir)) {
    fs.rmSync(apiDir, { recursive: true, force: true });
  }
  fs.renameSync(stashDir, apiDir);
}

stashApiDir();
let exitCode = 1;
try {
  const r = spawnSync(process.execPath, [nextCli, 'build'], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, STATIC_EXPORT: '1' },
  });
  exitCode = r.status === null ? 1 : r.status;
} finally {
  unstashApiDir();
}
process.exit(exitCode);
