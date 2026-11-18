import { join, resolve, sep } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  inMemorySyncFileSystem,
  type InMemoryTree,
} from '../../src/core/test-helpers/in-memory-sync-file-system';
import { buildConformanceNodeIo } from '../../src/protocol-conformance/node-io.js';
import { runProtocolConformance } from '../../src/protocol-conformance/report.js';

/**
 * The adapter's one piece of logic — a read failure is an absent artefact,
 * never a throw — and the composition the bin executes, run over an estate of
 * clearly-fake artefacts held in memory.
 */

// Resolved, not joined: the adapter resolves every relative path against the
// root, which carries the drive letter on Windows, so a joined `\estate` would
// miss every key of the in-memory tree there.
const ROOT = resolve(sep, 'estate');

/** A path under the fixture estate root. */
const at = (...segments: readonly string[]): string => join(ROOT, ...segments);

const INCOMING_OFFERS = at('.agent', 'practice-core', 'incoming', 'fixture-offers.md');
const STATE_README = at('.agent', 'state', 'README.md');

/** A tier-1 conformant estate. */
const CONFORMANT_FILES: Readonly<Record<string, string>> = {
  [INCOMING_OFFERS]: '# fixture\n',
  [at(
    '.agent',
    'practice-core',
    'decision-records',
    'PDR-001-inter-practice-collaboration-protocol.md',
  )]: '# fixture protocol record\n\n## Conformance — fixture floor\n',
  [at('.agent', 'practice-core', 'protocol.json')]: JSON.stringify({
    schema_version: '1.0.0',
    protocol_version: '1.0.0',
    tier_floor: 'tier-1',
    extensions: [],
  }),
  [at('agent-tools', 'src', 'collaboration-state', 'schemas', 'comms-event.schema.json')]:
    JSON.stringify({
      $defs: {
        agent_id: { required: ['agent_name', 'platform', 'model', 'session_id_prefix'] },
        narrative: { properties: { in_response_to: { type: 'string' } } },
      },
    }),
  [at('agent-tools', 'src', 'collaboration-state', 'cli-spec-help.ts')]:
    'export const HELP = "comms assert-watcher-live (--platform ...)";\n',
  [at('agent-tools', 'src', 'collaboration-state', 'cli-comms-assert-watcher-live.ts')]:
    'export async function assertWatcherLive(): Promise<void> {}\n',
  [STATE_README]: '# collaboration plane contract (fixture)\n',
};

/** The conformant estate without the named files, plus any extra tree. */
function estateWithout(omitted: readonly string[], extra: InMemoryTree = {}) {
  return inMemorySyncFileSystem({
    ...extra,
    files: {
      ...Object.fromEntries(
        Object.entries(CONFORMANT_FILES).filter(([filePath]) => !omitted.includes(filePath)),
      ),
      ...extra.files,
    },
  });
}

const DECLARED_HOME = at('declared-home');

describe('buildConformanceNodeIo', () => {
  it('reads an absent file or directory as undefined rather than throwing', () => {
    const io = buildConformanceNodeIo(ROOT, {}, estateWithout([]));

    expect(io.fileExists('.agent/practice-core/incoming/fixture-offers.md')).toBe(true);
    expect(io.fileExists('.agent/no-such-file.md')).toBe(false);
    expect(io.readTextFile('.agent/practice-core/incoming/fixture-offers.md')).toBe('# fixture\n');
    expect(io.readTextFile('.agent/no-such-file.md')).toBeUndefined();
    expect(io.listDir('.agent/practice-core/incoming')).toEqual(['fixture-offers.md']);
    expect(io.listDir('.agent/no-such-directory')).toBeUndefined();
  });

  it('answers the absolute directory probe for directories only', () => {
    const io = buildConformanceNodeIo(ROOT, {}, estateWithout([]));

    expect(io.absoluteDirectoryExists(at('.agent', 'state'))).toBe(true);
    expect(io.absoluteDirectoryExists(STATE_README)).toBe(false);
    expect(io.absoluteDirectoryExists(at('nowhere'))).toBe(false);
  });
});

describe('buildConformanceNodeIo + runProtocolConformance', () => {
  it('reports tier-1 with exit 0 on a conformant estate', () => {
    const { report, exitCode } = runProtocolConformance(
      buildConformanceNodeIo(ROOT, {}, estateWithout([])),
    );

    expect(report).toEqual({
      protocol_version: '1.0.0',
      tier: 'tier-1',
      extensions: [],
      failures: [],
    });
    expect(exitCode).toBe(0);
  });

  it('flips to tier none with exit 1 when the incoming box directory is absent', () => {
    const { report, exitCode } = runProtocolConformance(
      buildConformanceNodeIo(ROOT, {}, estateWithout([INCOMING_OFFERS])),
    );

    expect(report.tier).toBe('none');
    expect(report.failures.map((failure) => failure.item)).toEqual(['t0-incoming-box']);
    expect(exitCode).toBe(1);
  });

  it('passes the process env through to the coordination-home leg', () => {
    // The declared home must hold the full collaboration substrate — the
    // detector certifies the real resolver's contract, and bare
    // `.agent/state` does not resolve.
    const estate = estateWithout([STATE_README], {
      directories: [join(DECLARED_HOME, '.agent', 'state', 'collaboration')],
    });

    const { report, exitCode } = runProtocolConformance(
      buildConformanceNodeIo(ROOT, { PRACTICE_COORDINATION_HOME: DECLARED_HOME }, estate),
    );

    expect(report.failures).toEqual([]);
    expect(exitCode).toBe(0);
  });

  it('refuses a declared home holding a FILE where the substrate directory should be', () => {
    const estate = estateWithout([STATE_README], {
      files: { [join(DECLARED_HOME, '.agent', 'state', 'collaboration')]: 'not a directory\n' },
    });

    const { report, exitCode } = runProtocolConformance(
      buildConformanceNodeIo(ROOT, { PRACTICE_COORDINATION_HOME: DECLARED_HOME }, estate),
    );

    expect(report.failures.map((failure) => failure.item)).toEqual(['t1-coordination-home']);
    expect(exitCode).toBe(1);
  });
});
