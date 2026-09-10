// Env vars copied from .env.example arrive as empty strings, and `??` would
// treat those as set. Everything server-side reads env through this so that
// "present but blank" behaves exactly like "absent".
export function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}
