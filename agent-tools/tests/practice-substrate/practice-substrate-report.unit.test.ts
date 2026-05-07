import { describe, expect, it } from 'vitest';

import {
  createPracticeSubstrateReport,
  parsePracticeSubstrateCliArgs,
  runPracticeSubstrateCli,
} from '../../src/practice-substrate/report';
import {
  evaluateManifestSnapshot,
  evaluateMigrationLedgerSnapshot,
} from '../../src/practice-substrate/report-evaluators';

describe('practice substrate report-mode argument parsing', () => {
  it('parses the read-only report-mode check command', () => {
    expect(parsePracticeSubstrateCliArgs(['check', '--mode', 'report'])).toStrictEqual({
      command: 'check',
      mode: 'report',
    });
  });

  it('parses the strict safe-merge gate check command', () => {
    expect(parsePracticeSubstrateCliArgs(['check', '--mode', 'strict'])).toStrictEqual({
      command: 'check',
      mode: 'strict',
    });
  });

  it('defaults the check command to report mode', () => {
    expect(parsePracticeSubstrateCliArgs(['check'])).toStrictEqual({
      command: 'check',
      mode: 'report',
    });
  });

  it('ignores the pnpm argument separator before the check command', () => {
    expect(parsePracticeSubstrateCliArgs(['--', 'check', '--mode', 'report'])).toStrictEqual({
      command: 'check',
      mode: 'report',
    });
  });

  it('ignores the pnpm argument separator after the check command', () => {
    expect(parsePracticeSubstrateCliArgs(['check', '--', '--mode', 'strict'])).toStrictEqual({
      command: 'check',
      mode: 'strict',
    });
  });

  it('accepts an explicit repo root and target ref without reading ambient state', () => {
    expect(
      parsePracticeSubstrateCliArgs([
        'check',
        '--mode',
        'report',
        '--repo-root',
        '/repo',
        '--target-ref',
        'origin/main',
      ]),
    ).toStrictEqual({
      command: 'check',
      mode: 'report',
      repoRoot: '/repo',
      targetRef: 'origin/main',
    });
  });

  it('rejects unavailable modes and repair-only flags', () => {
    expect(() => parsePracticeSubstrateCliArgs(['check', '--mode', 'repair'])).toThrow(
      'practice-substrate check supports only --mode report or --mode strict',
    );
    expect(() => parsePracticeSubstrateCliArgs(['repair', '--dry-run'])).toThrow(
      'practice-substrate supports only the check command in this safe-merge gate',
    );
    expect(() => parsePracticeSubstrateCliArgs(['check', '--apply'])).toThrow(
      'Unknown practice-substrate option --apply',
    );
  });
});

describe('practice substrate report aggregation', () => {
  it('summarises findings and fails only when blocking findings exist', () => {
    const report = createPracticeSubstrateReport([
      {
        id: 'deterministic-defect',
        surface: 'surface-one',
        severity: 'blocking',
        repair: 'deterministic',
        message: 'A deterministic defect exists.',
      },
      {
        id: 'historical-evidence',
        surface: 'surface-two',
        severity: 'informational',
        repair: 'forbidden',
        message: 'Historical evidence is preserved.',
      },
    ]);

    expect(report).toStrictEqual({
      ok: false,
      mode: 'report',
      summary: {
        blocking: 1,
        reviewRequired: 0,
        informational: 1,
      },
      findings: [
        {
          id: 'deterministic-defect',
          surface: 'surface-one',
          severity: 'blocking',
          repair: 'deterministic',
          message: 'A deterministic defect exists.',
        },
        {
          id: 'historical-evidence',
          surface: 'surface-two',
          severity: 'informational',
          repair: 'forbidden',
          message: 'Historical evidence is preserved.',
        },
      ],
    });
  });

  it('returns success for review-required and informational findings only', async () => {
    const result = await runPracticeSubstrateCli({
      argv: ['check', '--mode', 'strict'],
      repoRoot: '/repo',
      executeReport: () =>
        Promise.resolve(
          createPracticeSubstrateReport(
            [
              {
                id: 'semantic-collision',
                surface: 'closed-claims',
                severity: 'review-required',
                repair: 'forbidden',
                message: 'Semantic judgement is required.',
              },
            ],
            'strict',
          ),
        ),
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toStrictEqual({
      ok: true,
      mode: 'strict',
      summary: {
        blocking: 0,
        reviewRequired: 1,
        informational: 0,
      },
      findings: [
        {
          id: 'semantic-collision',
          surface: 'closed-claims',
          severity: 'review-required',
          repair: 'forbidden',
          message: 'Semantic judgement is required.',
        },
      ],
    });
    expect(result.stderr).toBe('');
  });

  it('passes strict mode through to the report executor', async () => {
    await expect(
      runPracticeSubstrateCli({
        argv: ['check', '--mode', 'strict'],
        repoRoot: '/repo',
        executeReport: (options) =>
          Promise.resolve(createPracticeSubstrateReport([], options.mode)),
      }),
    ).resolves.toMatchObject({
      exitCode: 0,
      stdout: JSON.stringify(
        {
          ok: true,
          mode: 'strict',
          summary: {
            blocking: 0,
            reviewRequired: 0,
            informational: 0,
          },
          findings: [],
        },
        null,
        2,
      ).concat('\n'),
      stderr: '',
    });
  });

  it('maps blocking reports and runtime failures to distinct exit codes', async () => {
    await expect(
      runPracticeSubstrateCli({
        argv: ['check', '--mode', 'report'],
        repoRoot: '/repo',
        executeReport: () =>
          Promise.resolve(
            createPracticeSubstrateReport([
              {
                id: 'blocking-defect',
                surface: 'surface-one',
                severity: 'blocking',
                repair: 'manual-with-provenance',
                message: 'Blocking defect.',
              },
            ]),
          ),
      }),
    ).resolves.toMatchObject({ exitCode: 1, stderr: '' });

    await expect(
      runPracticeSubstrateCli({
        argv: ['check', '--mode', 'report'],
        repoRoot: '/repo',
        executeReport: () => Promise.reject(new Error('boom')),
      }),
    ).resolves.toStrictEqual({
      exitCode: 2,
      stdout: '',
      stderr: 'boom\n',
    });
  });

  it('maps CLI parse failures to usage exit code 2 without running the report', async () => {
    const executeReport = () => {
      throw new Error('report should not execute');
    };

    await expect(
      runPracticeSubstrateCli({
        argv: ['status', '--mode', 'report'],
        repoRoot: '/repo',
        executeReport,
      }),
    ).resolves.toStrictEqual({
      exitCode: 2,
      stdout: '',
      stderr: 'practice-substrate supports only the check command in this safe-merge gate\n',
    });

    await expect(
      runPracticeSubstrateCli({
        argv: ['check', '--mode', 'report', '--unknown', 'value'],
        repoRoot: '/repo',
        executeReport,
      }),
    ).resolves.toStrictEqual({
      exitCode: 2,
      stdout: '',
      stderr: 'Unknown practice-substrate option --unknown\n',
    });

    await expect(
      runPracticeSubstrateCli({
        argv: ['check', '--mode'],
        repoRoot: '/repo',
        executeReport,
      }),
    ).resolves.toStrictEqual({
      exitCode: 2,
      stdout: '',
      stderr: '--mode requires a value\n',
    });
  });
});

describe('practice substrate manifest snapshot classification', () => {
  it('accepts a coherent manifest snapshot', () => {
    expect(
      evaluateManifestSnapshot({
        manifestPath: '.agent/memory/executive/memory-state-substrate-contracts.manifest.json',
        expectedSurfaceCount: 1,
        requiredContractFields: ['purpose', 'merge_class', 'generated_outputs'],
        surfaces: [
          {
            id: 'state-entrypoint',
            path: '.agent/state/README.md',
            fields: {
              purpose: 'entrypoint',
              merge_class: 'index-narrative-tables',
              generated_outputs: [],
            },
            surfaceKind: 'markdown',
          },
        ],
      }),
    ).toStrictEqual([]);
  });

  it('detects surface count drift, duplicate surface IDs, missing fields, and invalid merge classes', () => {
    expect(
      evaluateManifestSnapshot({
        manifestPath: '.agent/memory/executive/memory-state-substrate-contracts.manifest.json',
        expectedSurfaceCount: 22,
        requiredContractFields: ['purpose', 'merge_class', 'validator'],
        surfaces: [
          {
            id: 'state-entrypoint',
            path: '.agent/state/README.md',
            fields: {
              purpose: 'entrypoint',
              merge_class: 'index-narrative-tables',
              validator: 'markdownlint',
            },
            surfaceKind: 'markdown',
          },
          {
            id: 'state-entrypoint',
            path: '.agent/state/README-copy.md',
            fields: {
              purpose: 'entrypoint copy',
              merge_class: 'append-only-structured-by-',
            },
            surfaceKind: 'markdown',
          },
        ],
      }),
    ).toStrictEqual([
      {
        id: 'manifest-surface-count-drift',
        surface: 'substrate-inventory',
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message:
          'Manifest .agent/memory/executive/memory-state-substrate-contracts.manifest.json declares 2 surfaces; expected 22.',
        evidence: ['.agent/memory/executive/memory-state-substrate-contracts.manifest.json'],
      },
      {
        id: 'duplicate-stable-id',
        surface: 'substrate-inventory',
        severity: 'blocking',
        repair: 'deterministic',
        message: 'Stable identity state-entrypoint is duplicated with identical content.',
        evidence: ['.agent/state/README.md', '.agent/state/README-copy.md'],
      },
      {
        id: 'surface-contract-field-missing',
        surface: 'state-entrypoint',
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message: 'Surface state-entrypoint is missing required contract field validator.',
        evidence: ['.agent/state/README-copy.md'],
      },
      {
        id: 'merge-class-invalid',
        surface: 'state-entrypoint',
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message: 'merge_class append-only-structured-by- is not a PDR-049 token.',
        evidence: ['.agent/state/README-copy.md'],
      },
    ]);
  });
});

describe('practice substrate migration-ledger snapshot classification', () => {
  it('accepts a coherent migration-ledger snapshot', () => {
    expect(
      evaluateMigrationLedgerSnapshot({
        ledgerPath:
          '.agent/state/collaboration/comms/archive/legacy-comms-events-migration-ledger-2026-05-07.json',
        expectedEntryCount: 1,
        entries: [
          {
            originalPath: '.agent/state/collaboration/comms/events/one.json',
            targetPath: '.agent/state/collaboration/comms-events/one.json',
            recordedSha256: 'sha256:same',
            actualSha256: 'sha256:same',
            recordedByteCount: 12,
            actualByteCount: 12,
          },
        ],
      }),
    ).toStrictEqual([]);
  });

  it('detects migration-ledger count, identity, byte-count, and hash drift', () => {
    expect(
      evaluateMigrationLedgerSnapshot({
        ledgerPath:
          '.agent/state/collaboration/comms/archive/legacy-comms-events-migration-ledger-2026-05-07.json',
        expectedEntryCount: 114,
        entries: [
          {
            originalPath: '.agent/state/collaboration/comms/events/one.json',
            targetPath: '.agent/state/collaboration/comms-events/one.json',
            recordedSha256: 'sha256:old',
            actualSha256: 'sha256:new',
            recordedByteCount: 100,
            actualByteCount: 101,
          },
          {
            originalPath: '.agent/state/collaboration/comms/events/one.json',
            targetPath: '.agent/state/collaboration/comms-events/one.json',
            recordedSha256: 'sha256:same',
            actualSha256: 'sha256:same',
            recordedByteCount: 12,
            actualByteCount: 12,
          },
        ],
      }),
    ).toStrictEqual([
      {
        id: 'migration-ledger-count-drift',
        surface: 'legacy-comms-events-migration-ledger',
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message:
          'Migration ledger .agent/state/collaboration/comms/archive/legacy-comms-events-migration-ledger-2026-05-07.json declares 2 entries; expected 114.',
        evidence: [
          '.agent/state/collaboration/comms/archive/legacy-comms-events-migration-ledger-2026-05-07.json',
        ],
      },
      {
        id: 'migration-ledger-duplicate-original-path',
        surface: 'legacy-comms-events-migration-ledger',
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message:
          'Migration ledger contains duplicate original path .agent/state/collaboration/comms/events/one.json.',
        evidence: ['.agent/state/collaboration/comms/events/one.json'],
      },
      {
        id: 'migration-ledger-duplicate-target-path',
        surface: 'legacy-comms-events-migration-ledger',
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message:
          'Migration ledger contains duplicate target path .agent/state/collaboration/comms-events/one.json.',
        evidence: ['.agent/state/collaboration/comms-events/one.json'],
      },
      {
        id: 'migration-ledger-target-byte-count-drift',
        surface: 'legacy-comms-events-migration-ledger',
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message:
          'Migration target .agent/state/collaboration/comms-events/one.json byte count does not match the ledger.',
        evidence: ['.agent/state/collaboration/comms-events/one.json'],
      },
      {
        id: 'migration-ledger-target-hash-drift',
        surface: 'legacy-comms-events-migration-ledger',
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message:
          'Migration target .agent/state/collaboration/comms-events/one.json SHA-256 does not match the ledger.',
        evidence: ['.agent/state/collaboration/comms-events/one.json'],
      },
    ]);
  });
});
