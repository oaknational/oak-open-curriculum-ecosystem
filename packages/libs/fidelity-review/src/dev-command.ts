/*
 * Resolving the `pnpm dev` invocation to absolute paths — never a PATH
 * search (Sonar S4036): the pnpm that launched this tool announces
 * itself via npm_execpath. Split from dev-server.ts purely for module
 * size; dev-server re-exports the public names.
 */
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

export interface DevCommand {
  readonly bin: string;
  readonly args: readonly string[];
}

const JS_ENTRY_EXTENSIONS = ['.js', '.cjs', '.mjs'] as const;

/**
 * Resolve the `pnpm dev` invocation to absolute paths — never a PATH search
 * (Sonar S4036): the pnpm that launched this tool announces itself via
 * `npm_execpath`. A JS entry (corepack's pnpm.mjs, nvm's pnpm.cjs) runs under
 * the current node binary; a native pnpm binary runs directly by its absolute
 * path. Anything else fails loud — this repo is pnpm-only.
 */
export function resolveDevCommand(
  npmExecPath: string | undefined,
  nodeBin: string,
): Result<DevCommand, string> {
  if (npmExecPath === undefined || npmExecPath === '') {
    return err(
      'dev-server: npm_execpath is not set — run this tool through a pnpm script (e.g. pnpm tool:fidelity)',
    );
  }
  if (!path.isAbsolute(npmExecPath)) {
    // A relative value would spawn via PATH lookup, exactly the search the
    // absolute-paths contract above exists to prevent (Sonar S4036).
    return err(
      `dev-server: npm_execpath (${npmExecPath}) is not an absolute path — refusing a PATH lookup`,
    );
  }
  const lowerBasename = path.basename(npmExecPath).toLowerCase();
  if (!lowerBasename.includes('pnpm')) {
    return err(`dev-server: npm_execpath (${npmExecPath}) is not pnpm — this repo is pnpm-only`);
  }
  if (JS_ENTRY_EXTENSIONS.some((ext) => lowerBasename.endsWith(ext))) {
    return ok({ bin: nodeBin, args: [npmExecPath, 'dev'] });
  }
  return ok({ bin: npmExecPath, args: ['dev'] });
}
