import { err, ok, type Result } from '@oaknational/result';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
  composeDriveListArgs,
  composeDriveCallArgs,
  runDrive,
  type DriveIo,
} from '../../src/mcp-conformance/drive.js';
import { type McpjamSpawnResult } from '../../src/mcp-conformance/runner.js';
import { loadFixtureRaw } from './test-helpers/fixture-loader.js';

// Stub-observed vendor outputs (2026-07-28): tools list --format json and
// tools call --format json against the served stubbed app.
const TOOLS_LIST_RAW = loadFixtureRaw('tools-list-stub-observed-2026-07-28.json');
const TOOLS_CALL_RAW = loadFixtureRaw('tools-call-stub-observed-2026-07-28.json');

const TARGET = 'https://mcp.thenational.academy/mcp';

/**
 * Branch-free parametric fake over the drive's two-method seam: each method
 * is a single lookup expression over canned results, keyed by tool name for
 * calls. The argv layout is no concern of the fake — the composers carry it
 * and are described by their own cases below.
 */
function fakeDriveIo(overrides?: {
  readonly list?: Result<McpjamSpawnResult, Error>;
  readonly calls?: Readonly<Record<string, Result<McpjamSpawnResult, Error>>>;
}): DriveIo {
  return {
    listTools: () => overrides?.list ?? ok({ exitCode: 0, stdout: TOOLS_LIST_RAW, stderr: '' }),
    callTool: (toolName: string) =>
      overrides?.calls?.[toolName] ?? ok({ exitCode: 0, stdout: TOOLS_CALL_RAW, stderr: '' }),
  };
}

/**
 * Loose structural schema for IN-TEST mutation of the captured tools-list
 * document: parse, surgically alter one tool, re-serialise. `.loose()`
 * everywhere so untouched capture content passes through verbatim.
 */
const fixtureListSchema = z
  .object({
    tools: z.array(
      z
        .object({
          name: z.string(),
          inputSchema: z
            .object({
              properties: z
                .record(z.string(), z.object({ examples: z.array(z.unknown()).optional() }).loose())
                .optional(),
            })
            .loose()
            .optional(),
          annotations: z.object({ readOnlyHint: z.boolean().optional() }).loose().optional(),
        })
        .loose(),
    ),
  })
  .loose();

function parseFixtureList(): z.infer<typeof fixtureListSchema> {
  return fixtureListSchema.parse(JSON.parse(TOOLS_LIST_RAW));
}

/** Throw-guard for fixture picks: a missing entry fails setup loudly (no-conditional-tests). */
function required<T>(value: T | undefined, message: string): T {
  if (value === undefined) {
    throw new Error(message);
  }
  return value;
}

describe('composeDriveListArgs / composeDriveCallArgs — reproducible vendor invocations', () => {
  it('list composes format-json quiet with the target', () => {
    expect(composeDriveListArgs({ target: TARGET })).toEqual([
      '--format',
      'json',
      '--quiet',
      'tools',
      'list',
      '--url',
      TARGET,
    ]);
  });

  it('call composes the tool name, JSON args, validation, and credentials when given', () => {
    const args = composeDriveCallArgs({
      target: TARGET,
      toolName: 'download-asset',
      toolArgs: { lesson: 'adding-fractions-with-the-same-denominator', type: 'slideDeck' },
      credentialsFile: 'tmp/creds.json',
    });
    expect(args).toEqual([
      '--format',
      'json',
      '--quiet',
      'tools',
      'call',
      '--url',
      TARGET,
      '--tool-name',
      'download-asset',
      '--tool-args',
      '{"lesson":"adding-fractions-with-the-same-denominator","type":"slideDeck"}',
      '--validate-response',
      '--expect-success',
      '--credentials-file',
      'tmp/creds.json',
    ]);
  });
});

describe('runDrive — every advertised tool is driven with advertised examples', () => {
  it('drives every derivable tool, and the dated capture names exactly two example gaps', () => {
    const outcome = runDrive(fakeDriveIo());

    expect(outcome.listFailure).toBeUndefined();
    // The capture's true state at its 2026-07-28 date: two hand-authored
    // graph tools advertised required properties with no examples. The
    // cures landed at the schema source in this same commit (guarded by
    // the SDK integration tests); this pin documents the drive leg's
    // founding finding against the capture that exposed it.
    expect(
      outcome.witnesses
        .filter((w) => w.outcome === 'no-example')
        .map((w) => w.toolName)
        .sort((a, b) => a.localeCompare(b)),
    ).toEqual(['get-keyword-graph', 'get-prior-knowledge-graph']);
    for (const witness of outcome.witnesses.filter((w) => w.outcome !== 'no-example')) {
      expect(witness.outcome, `tool ${witness.toolName}`).toBe('called-ok');
    }
    const download = outcome.witnesses.find((w) => w.toolName === 'download-asset');
    expect(download?.args).toEqual({
      lesson: 'adding-fractions-with-the-same-denominator',
      type: 'slideDeck',
    });
  });

  it('one tool losing its required-property examples is a loud no-example witness while every other tool still drives', () => {
    const mutated = parseFixtureList();
    const download = required(
      mutated.tools.find((tool) => tool.name === 'download-asset'),
      'capture lost download-asset',
    );
    for (const property of Object.values(download.inputSchema?.properties ?? {})) {
      property.examples = undefined;
    }
    const outcome = runDrive(
      fakeDriveIo({ list: ok({ exitCode: 0, stdout: JSON.stringify(mutated), stderr: '' }) }),
    );

    expect(
      outcome.witnesses
        .filter((w) => w.outcome === 'no-example')
        .map((w) => w.toolName)
        .sort((a, b) => a.localeCompare(b)),
    ).toEqual(['download-asset', 'get-keyword-graph', 'get-prior-knowledge-graph']);
    expect(outcome.witnesses.filter((w) => w.outcome === 'called-ok').length).toBe(37);
    const witness = outcome.witnesses.find((w) => w.toolName === 'download-asset');
    expect(witness?.detail).toContain('no example');
  });

  it('a failed call is a loud call-failed witness carrying the exit code and BOTH stream excerpts', () => {
    // Live-run truth (2026-07-28): under --format json the vendor reports
    // the tool-level failure on STDOUT and often leaves stderr empty.
    const outcome = runDrive(
      fakeDriveIo({
        calls: {
          'get-curriculum-model': ok({
            exitCode: 1,
            stdout: '{"content":[{"type":"text","text":"Input validation failed"}],"isError":true}',
            stderr: 'boom',
          }),
        },
      }),
    );
    const failed = outcome.witnesses.find((w) => w.toolName === 'get-curriculum-model');
    expect(failed?.outcome).toBe('call-failed');
    expect(failed?.detail).toContain('exit 1');
    expect(failed?.detail).toContain('Input validation failed');
    expect(failed?.detail).toContain('boom');
  });

  it('a tool not declaring readOnlyHint true is refused with a loud not-read-only witness, and the rest still drive', () => {
    const mutated = parseFixtureList();
    required(
      mutated.tools.find((tool) => tool.name === 'get-subjects'),
      'capture lost get-subjects',
    ).annotations = { readOnlyHint: false };
    const outcome = runDrive(
      fakeDriveIo({ list: ok({ exitCode: 0, stdout: JSON.stringify(mutated), stderr: '' }) }),
    );

    const refused = outcome.witnesses.find((w) => w.toolName === 'get-subjects');
    expect(refused?.outcome).toBe('not-read-only');
    expect(refused?.detail).toContain('readOnlyHint');
    expect(outcome.witnesses.filter((w) => w.outcome === 'called-ok').length).toBe(37);
  });

  it('a non-zero list exit is a loud list failure carrying the vendor stderr, never a parse complaint', () => {
    // Observed vendor contract: a completed-but-failed list (unreachable
    // server, expired credentials) exits 1 with structured error on STDERR
    // and EMPTY stdout — the seam returns ok(exit 1), never err().
    const outcome = runDrive(
      fakeDriveIo({
        list: ok({
          exitCode: 1,
          stdout: '',
          stderr: '{"error":{"code":"SERVER_UNREACHABLE","message":"fetch failed"}}',
        }),
      }),
    );
    expect(outcome.listFailure).toContain('exit 1');
    expect(outcome.listFailure).toContain('SERVER_UNREACHABLE');
    expect(outcome.witnesses).toEqual([]);
  });

  it('an unlaunchable list is a loud list failure with no witnesses', () => {
    const outcome = runDrive(fakeDriveIo({ list: err(new Error('spawn ENOENT')) }));
    expect(outcome.listFailure).toContain('ENOENT');
    expect(outcome.witnesses).toEqual([]);
  });

  it('a tool advertising no inputSchema is underivable — a schema is never invented for it', () => {
    const mutated = parseFixtureList();
    required(
      mutated.tools.find((tool) => tool.name === 'get-subjects'),
      'capture lost get-subjects',
    ).inputSchema = undefined;
    const outcome = runDrive(
      fakeDriveIo({ list: ok({ exitCode: 0, stdout: JSON.stringify(mutated), stderr: '' }) }),
    );
    const witness = outcome.witnesses.find((w) => w.toolName === 'get-subjects');
    expect(witness?.outcome).toBe('no-example');
  });

  it('duplicate advertised tool names are a refusal — an ambiguous surface cannot be driven honestly', () => {
    // Case-changed, not identical: the retention storage key folds case, so
    // this is the subtlest collision the refusal must catch.
    const mutated = parseFixtureList();
    const first = required(mutated.tools[0], 'capture has no tools');
    mutated.tools.push({ ...first, name: first.name.toUpperCase() });
    const outcome = runDrive(
      fakeDriveIo({ list: ok({ exitCode: 0, stdout: JSON.stringify(mutated), stderr: '' }) }),
    );
    expect(outcome.listFailure).toContain('duplicate names');
    expect(outcome.listFailure).toContain(first.name);
    expect(outcome.witnesses).toEqual([]);
  });

  it('a tool name outside the conventional shape is a loud list refusal, never a pack heading', () => {
    const mutated = parseFixtureList();
    required(
      mutated.tools.find((tool) => tool.name === 'get-subjects'),
      'capture lost get-subjects',
    ).name = 'get/subjects\n## injected';
    const outcome = runDrive(
      fakeDriveIo({ list: ok({ exitCode: 0, stdout: JSON.stringify(mutated), stderr: '' }) }),
    );
    expect(outcome.listFailure).toContain('mcpjam tools list output');
    expect(outcome.witnesses).toEqual([]);
  });

  it('a zero-tool list is a refusal, never a vacuous green', () => {
    const outcome = runDrive(
      fakeDriveIo({ list: ok({ exitCode: 0, stdout: '{"tools":[]}', stderr: '' }) }),
    );
    expect(outcome.listFailure).toContain('zero tools');
    expect(outcome.witnesses).toEqual([]);
  });

  it('a paginated list is a refusal — one page must not be reported as the whole surface', () => {
    const mutated = parseFixtureList();
    const outcome = runDrive(
      fakeDriveIo({
        list: ok({
          exitCode: 0,
          stdout: JSON.stringify({ tools: mutated.tools, nextCursor: 'page-2' }),
          stderr: '',
        }),
      }),
    );
    expect(outcome.listFailure).toContain('paginated');
    expect(outcome.witnesses).toEqual([]);
  });
});
