import type { GitRunner } from '../operator-profile-git.js';

/** The profile's document pathspecs as the push leg receives them. */
export const PROFILE_PATHSPECS: readonly string[] = ['index.md', 'repos', 'machines'];

/** A result's error, or the empty string for a success. */
export function failure<T>(
  result: { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: string },
): string {
  return result.ok ? '' : result.error;
}

/** A scripted runner: the first matching prefix answers; unmatched commands fail loudly. */
export function scripted(
  answers: readonly {
    readonly prefix: readonly string[];
    readonly stdout?: string;
    readonly ok?: boolean;
    readonly stderr?: string;
  }[],
): { readonly run: GitRunner; readonly calls: string[][] } {
  const calls: string[][] = [];
  const run: GitRunner = (args) => {
    calls.push([...args]);
    const hit = answers.find((answer) =>
      answer.prefix.every((part, index) => args[index] === part),
    );
    if (hit === undefined) {
      return { ok: false, stdout: '', stderr: `unscripted: ${args.join(' ')}` };
    }
    return {
      ok: hit.ok ?? true,
      stdout: hit.stdout ?? '',
      stderr: hit.stderr ?? (hit.ok === false ? 'refused' : ''),
    };
  };
  return { run, calls };
}
