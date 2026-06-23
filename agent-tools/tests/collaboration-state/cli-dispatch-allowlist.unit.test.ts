/**
 * The dispatch-time option-allowlist gate (`unknownValueOptions`): a command
 * spec accepts exactly the option keys it declares and reports the rest. A
 * `claims open --role` invocation once failed here on a spec whose option set
 * omitted `role` (2026-06-12) — the parse-time allowlist accepted the flag but
 * the dispatch-time allowlist did not. This proves the gate through the real
 * parser and the real command spec, with no IO, so the per-command coverage
 * the live bug exposed is guarded without driving the IO-bearing handler.
 */
import { describe, expect, it } from 'vitest';

import { unknownValueOptions } from '../../src/collaboration-state/cli';
import { parseOptions } from '../../src/collaboration-state/cli-options';
import { specs } from '../../src/collaboration-state/cli-specs';

function claimsOpenArgv(extra: readonly string[]): readonly string[] {
  return [
    '--',
    'claims',
    'open',
    '--active',
    'active.json',
    '--thread',
    'agentic-engineering-enhancements',
    '--area-kind',
    'files',
    '--file',
    'agent-tools/src/collaboration-state/cli-claim-commands.ts',
    '--intent',
    'Exercise the dispatch-time option allowlist.',
    '--now',
    '2026-06-12T15:00:00Z',
    ...extra,
  ];
}

const claimsOpenSpec = specs['claims:open'];

describe('unknownValueOptions — claims open dispatch allowlist', () => {
  it('accepts --role (the 2026-06-12 regression guard)', () => {
    const options = parseOptions(claimsOpenArgv(['--role', 'director']));

    expect(unknownValueOptions(options, claimsOpenSpec)).toEqual([]);
  });

  it('reports an option the command spec does not declare', () => {
    const options = parseOptions(claimsOpenArgv(['--role', 'director', '--undeclared', 'x']));

    expect(unknownValueOptions(options, claimsOpenSpec)).toEqual(['undeclared']);
  });
});
