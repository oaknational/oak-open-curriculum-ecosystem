import { rm } from 'node:fs/promises';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  formatCollaborationStateIntegrityReport,
  validateCollaborationStateIntegrity,
} from '../../src/collaboration-state/state-integrity';
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
      const report = await validateCollaborationStateIntegrity({ repoRoot });

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

      const report = await validateCollaborationStateIntegrity({ repoRoot });

      expect(report.findings).toHaveLength(1);
      expect(report.findings[0]?.path).toBe('.agent/state/collaboration/comms/bad-event.json');
      expect(report.findings[0]?.message).toContain('malformed JSON');
    } finally {
      await removeDirectory(repoRoot);
    }
  });

  it('reports a contract-violating active-claims registry with the parser leg’s own loud message, before schema validation', async () => {
    // Characterisation written before the seam consolidation and kept green
    // through it: the contract-parser gate fires ahead of Ajv, and the
    // finding carries the parser's message verbatim (anchored — a wrapping
    // slip would prefix it).
    const repoRoot = await makeTempCollaborationRepo();
    try {
      await writeJson(join(repoRoot, '.agent/state/collaboration/active-claims.json'), {
        schema_version: '1.3.0',
        commit_queue: [
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
        ],
        claims: [],
      });

      const report = await validateCollaborationStateIntegrity({ repoRoot });

      expect(report.findings).toHaveLength(1);
      expect(report.findings[0]?.path).toBe('.agent/state/collaboration/active-claims.json');
      expect(report.findings[0]?.message).toMatch(
        /^commit_queue entry 33333333-3333-4333-8333-333333333333 carries an invalid agent_id/,
      );
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

      const report = await validateCollaborationStateIntegrity({ repoRoot });

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

      const report = await validateCollaborationStateIntegrity({ repoRoot });

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

      const report = await validateCollaborationStateIntegrity({ repoRoot });

      expect(report.findings).toStrictEqual([]);
      expect(formatCollaborationStateIntegrityReport(report)).toContain('OK');
    } finally {
      await removeDirectory(repoRoot);
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
      await expect(validateCollaborationStateIntegrity({ repoRoot })).rejects.toThrow(
        join('.agent', 'state', 'collaboration', 'conversations'),
      );
    } finally {
      await removeDirectory(repoRoot);
    }
  });
});
