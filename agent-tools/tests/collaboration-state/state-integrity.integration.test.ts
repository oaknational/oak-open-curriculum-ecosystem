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

  it('hard-fails when a canonical collaboration directory is missing', async () => {
    const repoRoot = await makeTempCollaborationRepo();
    try {
      await removeDirectory(join(repoRoot, '.agent/state/collaboration/conversations'));

      await expect(validateCollaborationStateIntegrity({ repoRoot })).rejects.toThrow(
        '.agent/state/collaboration/conversations',
      );
    } finally {
      await removeDirectory(repoRoot);
    }
  });
});
