import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  formatCollaborationStateIntegrityReport,
  validateCollaborationStateIntegrity,
} from '../../src/collaboration-state/state-integrity';
import {
  jsonSurfaces,
  readSurfaceText,
} from '../../src/collaboration-state/state-integrity-surfaces';
import {
  makeTempCollaborationRepo,
  removeDirectory,
  writeJson,
  writeText,
} from '../test-helpers/temp-collaboration-state';

describe('collaboration state integrity validator', () => {
  it('passes a clean true-JSON collaboration estate and ignores comms-seen cursors', async () => {
    const repoRoot = await makeTempCollaborationRepo();
    try {
      const report = await validateCollaborationStateIntegrity({
        repoRoot,
        coordinationHome: repoRoot,
      });

      expect(report.findings).toStrictEqual([]);
      expect(formatCollaborationStateIntegrityReport(report)).toContain('OK');
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('reports malformed comms events by path', async () => {
    const repoRoot = await makeTempCollaborationRepo();
    try {
      await writeText(
        join(repoRoot, '.agent/state/collaboration/comms/bad-event.json'),
        '{ "schema_version": "2.0.0", "body": "unterminated',
      );

      const report = await validateCollaborationStateIntegrity({
        repoRoot,
        coordinationHome: repoRoot,
      });

      expect(report.findings).toHaveLength(1);
      expect(report.findings[0]?.path).toBe('.agent/state/collaboration/comms/bad-event.json');
      expect(report.findings[0]?.message).toContain('malformed JSON');
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('reports a contract-violating commit-queue intent file with the parser leg’s own loud message, before schema validation', async () => {
    // Characterisation kept through the 1.4.0 queue split: the id-less
    // intent row now lives in the per-intent store, the contract-parser
    // gate still fires ahead of Ajv, and the finding carries the parser's
    // message verbatim (anchored — a wrapping slip would prefix it).
    const repoRoot = await makeTempCollaborationRepo();
    try {
      await mkdir(join(repoRoot, '.agent/state/collaboration/commit-queue'), { recursive: true });
      await writeJson(
        join(
          repoRoot,
          '.agent/state/collaboration/commit-queue/33333333-3333-4333-8333-333333333333.json',
        ),
        {
          intent_id: '33333333-3333-4333-8333-333333333333',
          claim_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
          agent_id: {
            agent_name: 'Vintage Pre-Sunset Seat',
            platform: 'codex',
            model: 'gpt-4.9',
            session_id_prefix: '00aa11',
          },
          files: ['agent-tools/src/commit-queue/index.ts'],
          commit_subject: 'feat(queue): exercise the parser gate',
          queued_at: '2026-04-27T07:20:00Z',
          updated_at: '2026-04-27T07:20:00Z',
          expires_at: '2026-04-27T07:35:00Z',
          phase: 'queued',
        },
      );

      const report = await validateCollaborationStateIntegrity({
        repoRoot,
        coordinationHome: repoRoot,
      });

      expect(report.findings).toHaveLength(1);
      expect(report.findings[0]?.path).toBe(
        '.agent/state/collaboration/commit-queue/33333333-3333-4333-8333-333333333333.json',
      );
      expect(report.findings[0]?.message).toMatch(
        /^commit_queue entry 33333333-3333-4333-8333-333333333333 carries an invalid agent_id/,
      );
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('reports a commit-queue intent file whose filename disagrees with its intent_id, naming the delete remedy', async () => {
    // The store finds an intent BY its filename and deletes by that path,
    // so a file named for one id and carrying another is unreachable
    // through the store's own API — and it makes every read of the whole
    // directory throw. Content-only validation cannot see it: this file
    // satisfies its schema and its contract parser exactly.
    const repoRoot = await makeTempCollaborationRepo();
    try {
      await mkdir(join(repoRoot, '.agent/state/collaboration/commit-queue'), { recursive: true });
      await writeJson(
        join(
          repoRoot,
          '.agent/state/collaboration/commit-queue/44444444-4444-4444-8444-444444444444.json',
        ),
        {
          intent_id: '33333333-3333-4333-8333-333333333333',
          claim_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
          agent_id: {
            agent_name: 'Prismatic Waxing Constellation',
            platform: 'codex',
            model: 'gpt-5.5',
            session_id_prefix: '019dcd',
            id: 'e2e793c7-923e-5baa-97f0-2bedfb9b6b50',
          },
          files: ['agent-tools/src/commit-queue/index.ts'],
          commit_subject: 'feat(queue): exercise the filename correspondence check',
          queued_at: '2026-04-27T07:20:00Z',
          updated_at: '2026-04-27T07:20:00Z',
          expires_at: '2026-04-27T08:20:00Z',
          phase: 'queued',
          queued_seq: 0,
        },
      );

      const report = await validateCollaborationStateIntegrity({
        repoRoot,
        coordinationHome: repoRoot,
      });

      expect(report.findings).toHaveLength(1);
      expect(report.findings[0]?.path).toBe(
        '.agent/state/collaboration/commit-queue/44444444-4444-4444-8444-444444444444.json',
      );
      expect(report.findings[0]?.message).toContain('33333333-3333-4333-8333-333333333333.json');
      // Queue files are ephemera by the QUEUE-LOCAL owner ruling, so
      // deleting the mismatched file is a legitimate operator cure — and
      // the finding must say so, or the operator has a fault and no remedy.
      expect(report.findings[0]?.message).toMatch(/delete/i);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('reports a commit-queue intent file whose expires_at disagrees with updated_at plus the TTL', async () => {
    // Two well-formed timestamps satisfy the schema; only their relation is
    // wrong. The runtime's every read refuses such a file, so the validator
    // must recompute the same relation rather than record two valid strings.
    const repoRoot = await makeTempCollaborationRepo();
    try {
      await mkdir(join(repoRoot, '.agent/state/collaboration/commit-queue'), { recursive: true });
      await writeJson(
        join(
          repoRoot,
          '.agent/state/collaboration/commit-queue/55555555-5555-4555-8555-555555555555.json',
        ),
        {
          intent_id: '55555555-5555-4555-8555-555555555555',
          claim_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
          agent_id: {
            agent_name: 'Prismatic Waxing Constellation',
            platform: 'codex',
            model: 'gpt-5.5',
            session_id_prefix: '019dcd',
            id: 'e2e793c7-923e-5baa-97f0-2bedfb9b6b50',
          },
          files: ['agent-tools/src/commit-queue/index.ts'],
          commit_subject: 'feat(queue): exercise the expiry relation check',
          queued_at: '2026-04-27T07:20:00Z',
          updated_at: '2026-04-27T07:20:00Z',
          expires_at: '2026-04-27T07:35:00Z',
          phase: 'queued',
          queued_seq: 0,
        },
      );

      const report = await validateCollaborationStateIntegrity({
        repoRoot,
        coordinationHome: repoRoot,
      });

      expect(report.findings).toHaveLength(1);
      expect(report.findings[0]?.path).toBe(
        '.agent/state/collaboration/commit-queue/55555555-5555-4555-8555-555555555555.json',
      );
      expect(report.findings[0]?.message).toContain('disagrees with updated_at plus the TTL');
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('reads a queue intent file that vanished between the listing and the read as absent, not as a fault', async () => {
    // Queue files are mutable ephemera: a peer completing or sweeping an
    // intent between readdir and the read is the store's ordinary absence,
    // and the enumerated surface carries the directory's optionality.
    const repoRoot = await makeTempCollaborationRepo();
    try {
      const queueDir = join(repoRoot, '.agent/state/collaboration/commit-queue');
      await mkdir(queueDir, { recursive: true });
      const intentPath = join(queueDir, '66666666-6666-4666-8666-666666666666.json');
      await writeText(intentPath, '{}');

      const intentSurfaces = (await jsonSurfaces(repoRoot, repoRoot)).filter((surface) =>
        surface.path.endsWith('66666666-6666-4666-8666-666666666666.json'),
      );
      expect(intentSurfaces.map((surface) => surface.optionalWhenAbsent)).toStrictEqual([true]);

      await rm(intentPath);
      for (const surface of intentSurfaces) {
        expect(await readSurfaceText(surface)).toBeUndefined();
      }
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('reports schema-invalid true-JSON files without stopping at the first finding', async () => {
    const repoRoot = await makeTempCollaborationRepo();
    try {
      await writeJson(join(repoRoot, '.agent/state/collaboration/comms/empty-event.json'), {});
      await writeJson(join(repoRoot, '.agent/state/collaboration/conversations/bad-thread.json'), {
        schema_version: '1.1.0',
        conversation_id: 'bad-thread',
      });

      const report = await validateCollaborationStateIntegrity({
        repoRoot,
        coordinationHome: repoRoot,
      });

      expect(report.findings.map((finding) => finding.path)).toStrictEqual([
        '.agent/state/collaboration/comms/empty-event.json',
        '.agent/state/collaboration/conversations/bad-thread.json',
      ]);
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('reports timestamp format violations as schema-invalid', async () => {
    const repoRoot = await makeTempCollaborationRepo();
    try {
      await writeJson(join(repoRoot, '.agent/state/collaboration/comms/bad-time.json'), {
        schema_version: '2.0.0',
        event_id: 'bad-time',
        created_at: 'not-a-date',
        kind: 'narrative',
        author: {
          agent_name: 'Woodland Creeping Petal',
          platform: 'codex',
          model: 'GPT-5',
          session_id_prefix: '019dd3',
        },
        title: 'Bad time',
        body: 'This event has an invalid timestamp.',
      });

      const report = await validateCollaborationStateIntegrity({
        repoRoot,
        coordinationHome: repoRoot,
      });

      expect(report.findings[0]?.path).toBe('.agent/state/collaboration/comms/bad-time.json');
      expect(report.findings[0]?.message).toContain('Invalid ISO datetime');
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('treats absent untracked-by-design surfaces as clean (fresh checkout / CI)', async () => {
    const repoRoot = await makeTempCollaborationRepo();
    try {
      // ADR-199 Phase-3 untracked the instance tier, so a fresh checkout (e.g.
      // CI) has NONE of these on disk: the comms/ directory, active-claims.json,
      // or closed-claims.archive.json. That absence is the clean state, not an
      // integrity fault — the validator must not crash on any of them.
      await removeDirectory(join(repoRoot, '.agent/state/collaboration/comms'));
      await rm(join(repoRoot, '.agent/state/collaboration/active-claims.json'));
      await rm(join(repoRoot, '.agent/state/collaboration/closed-claims.archive.json'));

      const report = await validateCollaborationStateIntegrity({
        repoRoot,
        coordinationHome: repoRoot,
      });

      expect(report.findings).toStrictEqual([]);
      expect(formatCollaborationStateIntegrityReport(report)).toContain('OK');
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('validates the machine-local surfaces at the coordination home, not the invoking checkout', async () => {
    // A linked worktree's repo-local claims/comms/commit-queue are decoys:
    // clean-or-absent locally while the canonical home store is corrupt.
    // The validator must find the corruption at the HOME and name the
    // absolute home path so an operator can locate the file.
    const repoRoot = await makeTempCollaborationRepo();
    const coordinationHome = await makeTempCollaborationRepo();
    try {
      const queueDir = join(coordinationHome, '.agent/state/collaboration/commit-queue');
      await mkdir(queueDir, { recursive: true });
      const corruptPath = join(queueDir, 'deadbeef-dead-4dea-8dea-deadbeefdead.json');
      await writeText(corruptPath, '{ "intent_id": "unterminated');

      const report = await validateCollaborationStateIntegrity({ repoRoot, coordinationHome });

      expect(report.findings).toHaveLength(1);
      expect(report.findings[0]?.path).toBe(corruptPath);
      expect(report.findings[0]?.message).toContain('malformed JSON');
    } finally {
      await removeDirectory(repoRoot);
      await removeDirectory(coordinationHome);
    }
  });

  it('accepts a legacy pending-migration registry at the home without a finding', async () => {
    // The estate mid-rollout: the home's live registry still carries the
    // flat commit_queue shape the runtime migrates on first contact. That
    // is a valid state, not corruption — the runtime contract pin must not
    // fire on it (Ajv still validates the legacy shape via the schema's
    // wider version enum).
    const repoRoot = await makeTempCollaborationRepo();
    const coordinationHome = await makeTempCollaborationRepo();
    try {
      await writeText(
        join(coordinationHome, '.agent/state/collaboration/active-claims.json'),
        `${JSON.stringify({ schema_version: '1.3.0', commit_queue: [], claims: [] }, null, 2)}\n`,
      );

      const report = await validateCollaborationStateIntegrity({ repoRoot, coordinationHome });

      expect(report.findings).toStrictEqual([]);
    } finally {
      await removeDirectory(repoRoot);
      await removeDirectory(coordinationHome);
    }
  });

  it('hard-fails when a tracked collaboration directory is missing', async () => {
    const repoRoot = await makeTempCollaborationRepo();
    try {
      // conversations/ stays tracked (repo-tier decision provenance), so its
      // absence is a genuine integrity fault, not the untracked-by-design case.
      await removeDirectory(join(repoRoot, '.agent/state/collaboration/conversations'));

      // The raw filesystem error names the directory in host separators, so
      // the expected substring is derived in host form (the POSIX literal on
      // POSIX).
      await expect(
        validateCollaborationStateIntegrity({ repoRoot, coordinationHome: repoRoot }),
      ).rejects.toThrow(join('.agent', 'state', 'collaboration', 'conversations'));
    } finally {
      await removeDirectory(repoRoot);
    }
  });
});
