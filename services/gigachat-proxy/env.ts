export function mergeGigaChatEnv(loaded: Record<string, string>): Record<string, string> {
  const merged = { ...loaded };
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('GIGACHAT_') && value != null && value !== '') {
      merged[key] = value;
    }
  }
  return merged;
}

export function isInsecureSslFlag(value: string | undefined): boolean {
  const v = (value ?? '').trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}
