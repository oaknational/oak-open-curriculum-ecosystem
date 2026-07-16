import { err, ok, type Result } from '@oaknational/result';

export function parseProtocolJson(
  line: string,
): Result<unknown, { readonly kind: 'schema-failure' }> {
  try {
    const parsed: unknown = JSON.parse(line);
    return ok(parsed);
  } catch {
    return err({ kind: 'schema-failure' });
  }
}
