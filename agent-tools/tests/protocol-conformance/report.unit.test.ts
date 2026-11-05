import { sep } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  loadProtocolDeclaration,
  PROTOCOL_DECLARATION_REL_PATH,
} from '../../src/protocol-conformance/declaration.js';
import { runConformanceDetectors } from '../../src/protocol-conformance/detectors.js';
import { runProtocolConformance } from '../../src/protocol-conformance/report.js';
import { type ConformanceIo } from '../../src/protocol-conformance/types.js';

// Fixture estate: every path is clearly fake repo-relative content assembled
// in memory — detectors see exactly what the maps declare, nothing else.
const CONFORMANT_SCHEMA = JSON.stringify({
  $defs: {
    agent_id: {
      required: ['agent_name', 'platform', 'model', 'session_id_prefix'],
    },
    narrative: {
      properties: { in_response_to: { type: 'string' } },
    },
  },
});

function baseDeclaration(): { [key: string]: unknown } {
  return {
    schema_version: '1.0.0',
    protocol_version: '1.0.0',
    tier_floor: 'tier-1',
    extensions: [],
  };
}

const CONFORMANT_DECLARATION = JSON.stringify(baseDeclaration());

function fakeIo(overrides?: {
  readonly files?: Readonly<Record<string, string | undefined>>;
  readonly dirs?: Readonly<Record<string, readonly string[] | undefined>>;
  readonly env?: Readonly<Record<string, string | undefined>>;
  readonly absoluteDirs?: readonly string[];
}): ConformanceIo {
  const files: Record<string, string | undefined> = {
    [PROTOCOL_DECLARATION_REL_PATH]: CONFORMANT_DECLARATION,
    'agent-tools/src/collaboration-state/schemas/comms-event.schema.json': CONFORMANT_SCHEMA,
    'agent-tools/src/collaboration-state/cli-spec-help.ts':
      'export const HELP = "comms assert-watcher-live (--platform ...)";',
    'agent-tools/src/collaboration-state/cli-comms-assert-watcher-live.ts':
      'export async function assertWatcherLive(): Promise<void> {}',
    '.agent/practice-core/decision-records/PDR-125-inter-practice-collaboration-protocol.md':
      '# fixture protocol record\n\n## Conformance — fixture floor\n',
    '.agent/state/README.md': '# Agent state — the collaboration plane contract (fixture)',
    ...overrides?.files,
  };
  const dirs: Record<string, readonly string[] | undefined> = {
    '.agent/practice-core/incoming': ['fixture-offers.md'],
    '.agent/practice-core/decision-records': [
      'PDR-001-fixture.md',
      'PDR-125-inter-practice-collaboration-protocol.md',
    ],
    ...overrides?.dirs,
  };
  return {
    fileExists: (relPath) => files[relPath] !== undefined,
    readTextFile: (relPath) => files[relPath],
    listDir: (relPath) => dirs[relPath],
    // The real resolver host-joins its substrate probe path while the fixture
    // keys absoluteDirs in POSIX form, so normalise at the fake's choke point.
    absoluteDirectoryExists: (path) =>
      (overrides?.absoluteDirs ?? []).includes(path.split(sep).join('/')),
    env: overrides?.env ?? {},
  };
}

describe('loadProtocolDeclaration', () => {
  it('loads a valid declaration', () => {
    const result = loadProtocolDeclaration(fakeIo());
    if (!result.ok) {
      throw new Error(`expected ok, got: ${result.error}`);
    }
    expect(result.value).toEqual({
      schema_version: '1.0.0',
      protocol_version: '1.0.0',
      tier_floor: 'tier-1',
      extensions: [],
    });
  });

  it('refuses a missing declaration file with a teaching error naming the path', () => {
    const result = loadProtocolDeclaration(
      fakeIo({ files: { [PROTOCOL_DECLARATION_REL_PATH]: undefined } }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toContain(PROTOCOL_DECLARATION_REL_PATH);
  });

  it('refuses an unknown field as a typed refusal, never a best-effort parse', () => {
    const declaration = { ...baseDeclaration(), surprise: true };
    const result = loadProtocolDeclaration(
      fakeIo({ files: { [PROTOCOL_DECLARATION_REL_PATH]: JSON.stringify(declaration) } }),
    );
    expect(result.ok).toBe(false);
  });

  it('refuses a cross-family schema_version (major mismatch) with a version-naming error', () => {
    const declaration = baseDeclaration();
    declaration['schema_version'] = '2.0.0';
    const result = loadProtocolDeclaration(
      fakeIo({ files: { [PROTOCOL_DECLARATION_REL_PATH]: JSON.stringify(declaration) } }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toContain('2.0.0');
  });

  it('refuses malformed JSON with an unreadable error naming the path', () => {
    const result = loadProtocolDeclaration(
      fakeIo({ files: { [PROTOCOL_DECLARATION_REL_PATH]: '{ not json' } }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error).toContain('unreadable');
    expect(result.error).toContain(PROTOCOL_DECLARATION_REL_PATH);
  });

  it('refuses a tier_floor outside the ladder', () => {
    const declaration = baseDeclaration();
    declaration['tier_floor'] = 'tier-2';
    const result = loadProtocolDeclaration(
      fakeIo({ files: { [PROTOCOL_DECLARATION_REL_PATH]: JSON.stringify(declaration) } }),
    );
    expect(result.ok).toBe(false);
  });
});

describe('runConformanceDetectors', () => {
  it('passes every detector on the conformant fixture estate', () => {
    expect(runConformanceDetectors(fakeIo())).toEqual([]);
  });

  it('flips t0-incoming-box when the box directory is absent', () => {
    const failures = runConformanceDetectors(
      fakeIo({ dirs: { '.agent/practice-core/incoming': undefined } }),
    );
    expect(failures.map((f) => f.item)).toEqual(['t0-incoming-box']);
    expect(failures[0]?.tier).toBe('tier-0');
  });

  it('flips t0-protocol-record when no protocol PDR is in the decision-record set', () => {
    const failures = runConformanceDetectors(
      fakeIo({ dirs: { '.agent/practice-core/decision-records': ['PDR-001-fixture.md'] } }),
    );
    expect(failures.map((f) => f.item)).toEqual(['t0-protocol-record']);
    expect(failures[0]?.tier).toBe('tier-0');
  });

  it('refuses a misnamed placeholder whose name merely mentions the protocol', () => {
    const failures = runConformanceDetectors(
      fakeIo({
        dirs: {
          '.agent/practice-core/decision-records': [
            'zzz-not-really-inter-practice-collaboration-protocol-PLACEHOLDER.md',
          ],
        },
      }),
    );
    expect(failures.map((f) => f.item)).toEqual(['t0-protocol-record']);
  });

  it('refuses a correctly-named protocol record that carries no Conformance contract', () => {
    const failures = runConformanceDetectors(
      fakeIo({
        files: {
          '.agent/practice-core/decision-records/PDR-125-inter-practice-collaboration-protocol.md':
            '# an empty shell\n',
        },
      }),
    );
    expect(failures.map((f) => f.item)).toEqual(['t0-protocol-record']);
    expect(failures[0]?.message).toContain('Conformance');
  });

  it("names its proving artefact in every failure's evidence", () => {
    const failures = runConformanceDetectors(
      fakeIo({ dirs: { '.agent/practice-core/incoming': undefined } }),
    );
    expect(failures[0]?.evidence.some((e) => e.includes('incoming'))).toBe(true);
  });

  it('flips BOTH wire-schema detectors when the schema file itself is absent', () => {
    const failures = runConformanceDetectors(
      fakeIo({
        files: {
          'agent-tools/src/collaboration-state/schemas/comms-event.schema.json': undefined,
        },
      }),
    );
    expect(failures.map((f) => f.item).sort((a, b) => a.localeCompare(b))).toEqual([
      't1-identity-with-prefix',
      't1-threadable-comms',
    ]);
    expect(failures[0]?.message).toContain('absent');
  });

  it('names the real fault when the wire schema is unparseable, not a field gap', () => {
    const failures = runConformanceDetectors(
      fakeIo({
        files: {
          'agent-tools/src/collaboration-state/schemas/comms-event.schema.json': '{ not json',
        },
      }),
    );
    expect(failures.map((f) => f.item).sort((a, b) => a.localeCompare(b))).toEqual([
      't1-identity-with-prefix',
      't1-threadable-comms',
    ]);
    for (const failure of failures) {
      expect(failure.message).toContain('unreadable');
    }
  });

  it('flips t1-threadable-comms when the wire schema lacks the threading field', () => {
    const schema = {
      $defs: { agent_id: { required: ['session_id_prefix'] }, narrative: { properties: {} } },
    };
    const failures = runConformanceDetectors(
      fakeIo({
        files: {
          'agent-tools/src/collaboration-state/schemas/comms-event.schema.json':
            JSON.stringify(schema),
        },
      }),
    );
    expect(failures.map((f) => f.item)).toEqual(['t1-threadable-comms']);
    expect(failures[0]?.tier).toBe('tier-1');
  });

  it('flips t1-identity-with-prefix when the wire schema stops requiring the prefix', () => {
    const schema = {
      $defs: {
        agent_id: { required: ['agent_name', 'platform', 'model'] },
        narrative: { properties: { in_response_to: { type: 'string' } } },
      },
    };
    const failures = runConformanceDetectors(
      fakeIo({
        files: {
          'agent-tools/src/collaboration-state/schemas/comms-event.schema.json':
            JSON.stringify(schema),
        },
      }),
    );
    expect(failures.map((f) => f.item)).toEqual(['t1-identity-with-prefix']);
    expect(failures[0]?.tier).toBe('tier-1');
  });

  describe('t1-coordination-home (the env leg certifies the real resolver)', () => {
    it('flips t1-coordination-home when neither the env home nor the git-native contract resolves', () => {
      const failures = runConformanceDetectors(
        fakeIo({ files: { '.agent/state/README.md': undefined } }),
      );
      expect(failures.map((f) => f.item)).toEqual(['t1-coordination-home']);
      expect(failures[0]?.tier).toBe('tier-1');
    });

    it('resolves t1-coordination-home through PRACTICE_COORDINATION_HOME when set', () => {
      const failures = runConformanceDetectors(
        fakeIo({
          files: { '.agent/state/README.md': undefined },
          env: { PRACTICE_COORDINATION_HOME: '/fixture/home' },
          absoluteDirs: ['/fixture/home', '/fixture/home/.agent/state/collaboration'],
        }),
      );
      expect(failures).toEqual([]);
    });

    it('fails t1-coordination-home LOUD when the declared env home does not resolve', () => {
      const failures = runConformanceDetectors(
        fakeIo({ env: { PRACTICE_COORDINATION_HOME: '/fixture/missing' } }),
      );
      expect(failures.map((f) => f.item)).toEqual(['t1-coordination-home']);
      expect(failures[0]?.message).toContain('/fixture/missing');
      expect(failures[0]?.message).toContain('does not exist or is not a directory');
    });

    it('refuses a declared home holding bare .agent/state without the collaboration substrate', () => {
      // The anti-weakening property this detector exists to certify: the env
      // leg recomputes the REAL resolver, never a laxer recording of it
      // (PR #320 review finding — the prior leg accepted any .agent/state).
      const failures = runConformanceDetectors(
        fakeIo({
          env: { PRACTICE_COORDINATION_HOME: '/fixture/home' },
          absoluteDirs: ['/fixture/home', '/fixture/home/.agent/state'],
        }),
      );
      expect(failures.map((f) => f.item)).toEqual(['t1-coordination-home']);
      expect(failures[0]?.message).toContain('.agent/state/collaboration');
      expect(failures[0]?.evidence).toEqual(['/fixture/home/.agent/state/collaboration']);
    });

    it('refuses a relative declared home with the resolver teaching text', () => {
      const failures = runConformanceDetectors(
        fakeIo({
          env: { PRACTICE_COORDINATION_HOME: 'fixture/relative-home' },
          absoluteDirs: [
            'fixture/relative-home',
            'fixture/relative-home/.agent/state/collaboration',
          ],
        }),
      );
      expect(failures.map((f) => f.item)).toEqual(['t1-coordination-home']);
      expect(failures[0]?.message).toContain('absolute path');
    });

    it('refuses an empty-string declared home as malformed, never as absence', () => {
      const failures = runConformanceDetectors(fakeIo({ env: { PRACTICE_COORDINATION_HOME: '' } }));
      expect(failures.map((f) => f.item)).toEqual(['t1-coordination-home']);
      expect(failures[0]?.message).toContain('absolute path');
    });
  });

  it('flips t1-watcher-liveness-gate when the assertion action leaves the CLI surface', () => {
    const failures = runConformanceDetectors(
      fakeIo({
        files: {
          'agent-tools/src/collaboration-state/cli-spec-help.ts':
            'export const HELP = "comms append ...";',
        },
      }),
    );
    expect(failures.map((f) => f.item)).toEqual(['t1-watcher-liveness-gate']);
    expect(failures[0]?.tier).toBe('tier-1');
  });

  it('flips t1-watcher-liveness-gate when the CLI advertises the action but the module is gone', () => {
    const failures = runConformanceDetectors(
      fakeIo({
        files: {
          'agent-tools/src/collaboration-state/cli-comms-assert-watcher-live.ts': undefined,
        },
      }),
    );
    expect(failures.map((f) => f.item)).toEqual(['t1-watcher-liveness-gate']);
  });

  it('refuses a prose MENTION of the assertion that is not a registered usage spec', () => {
    const failures = runConformanceDetectors(
      fakeIo({
        files: {
          'agent-tools/src/collaboration-state/cli-spec-help.ts':
            "export const HELP = 'comms append ...; we removed assert-watcher-live last week, do not use it';",
        },
      }),
    );
    expect(failures.map((f) => f.item)).toEqual(['t1-watcher-liveness-gate']);
  });

  it('refuses a gutted assertion module that exports no handler', () => {
    const failures = runConformanceDetectors(
      fakeIo({
        files: {
          'agent-tools/src/collaboration-state/cli-comms-assert-watcher-live.ts':
            "throw new Error('this module is a broken stub');",
        },
      }),
    );
    expect(failures.map((f) => f.item)).toEqual(['t1-watcher-liveness-gate']);
  });

  it('refuses a stray home contract that does not document the collaboration plane', () => {
    const failures = runConformanceDetectors(
      fakeIo({ files: { '.agent/state/README.md': 'no substrate here' } }),
    );
    expect(failures.map((f) => f.item)).toEqual(['t1-coordination-home']);
    expect(failures[0]?.message).toContain('does not document');
  });
});

describe('runProtocolConformance', () => {
  it('reports tier-1 with exit 0 on the conformant estate at a tier-1 floor', () => {
    const { report, exitCode } = runProtocolConformance(fakeIo());
    expect(report).toEqual({
      protocol_version: '1.0.0',
      tier: 'tier-1',
      extensions: [],
      failures: [],
    });
    expect(exitCode).toBe(0);
  });

  it('reports tier-0 with exit 1 when a tier-1 item fails under a tier-1 floor', () => {
    const { report, exitCode } = runProtocolConformance(
      fakeIo({ files: { '.agent/state/README.md': undefined } }),
    );
    expect(report.tier).toBe('tier-0');
    expect(report.failures.map((f) => f.item)).toEqual(['t1-coordination-home']);
    expect(exitCode).toBe(1);
  });

  it('reports tier-0 with exit 0 when the declared floor is tier-0', () => {
    const declaration = baseDeclaration();
    declaration['tier_floor'] = 'tier-0';
    const { report, exitCode } = runProtocolConformance(
      fakeIo({
        files: {
          [PROTOCOL_DECLARATION_REL_PATH]: JSON.stringify(declaration),
          '.agent/state/README.md': undefined,
        },
      }),
    );
    expect(report.tier).toBe('tier-0');
    expect(exitCode).toBe(0);
  });

  it('reports tier none with exit 1 when a tier-0 item fails', () => {
    const { report, exitCode } = runProtocolConformance(
      fakeIo({ dirs: { '.agent/practice-core/incoming': undefined } }),
    );
    expect(report.tier).toBe('none');
    expect(exitCode).toBe(1);
  });

  it('exits 0 when the computed tier EXCEEDS the declared floor', () => {
    const declaration = baseDeclaration();
    declaration['tier_floor'] = 'tier-0';
    const { report, exitCode } = runProtocolConformance(
      fakeIo({ files: { [PROTOCOL_DECLARATION_REL_PATH]: JSON.stringify(declaration) } }),
    );
    expect(report.tier).toBe('tier-1');
    expect(exitCode).toBe(0);
  });

  it('reports tier none and lists BOTH failures when tier-0 and tier-1 items fail together', () => {
    const { report, exitCode } = runProtocolConformance(
      fakeIo({
        dirs: { '.agent/practice-core/incoming': undefined },
        files: { '.agent/state/README.md': undefined },
      }),
    );
    expect(report.tier).toBe('none');
    expect(report.failures.map((f) => f.item).sort((a, b) => a.localeCompare(b))).toEqual([
      't0-incoming-box',
      't1-coordination-home',
    ]);
    expect(exitCode).toBe(1);
  });

  it('exits 1 with a declaration failure named in the report when the declaration is missing', () => {
    const { report, exitCode } = runProtocolConformance(
      fakeIo({ files: { [PROTOCOL_DECLARATION_REL_PATH]: undefined } }),
    );
    expect(exitCode).toBe(1);
    expect(report.protocol_version).toBe('undeclared');
    expect(report.failures.some((f) => f.item === 'protocol-declaration')).toBe(true);
    // The recomputation is still honest while undeclared: the report carries
    // the computed tier; the exit code is what enforces the declaration.
    expect(report.tier).toBe('tier-1');
  });

  it('carries detector failures alongside the declaration failure when both are broken', () => {
    const { report, exitCode } = runProtocolConformance(
      fakeIo({
        files: { [PROTOCOL_DECLARATION_REL_PATH]: undefined },
        dirs: { '.agent/practice-core/incoming': undefined },
      }),
    );
    expect(report.failures.map((f) => f.item).sort((a, b) => a.localeCompare(b))).toEqual([
      'protocol-declaration',
      't0-incoming-box',
    ]);
    expect(report.tier).toBe('none');
    expect(exitCode).toBe(1);
  });

  it('carries the declared extensions through to the report verbatim', () => {
    const declaration = baseDeclaration();
    declaration['extensions'] = ['comms-threading'];
    const { report } = runProtocolConformance(
      fakeIo({ files: { [PROTOCOL_DECLARATION_REL_PATH]: JSON.stringify(declaration) } }),
    );
    expect(report.extensions).toEqual(['comms-threading']);
  });
});
