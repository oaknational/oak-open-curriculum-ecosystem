import { unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { parseApplyPatchContent } from './apply-patch-content.js';

/**
 * Unit tests for the `apply_patch` content projection.
 *
 * Modules harvested from the tested MCP-150 branch implementation
 * (PR #707 at f96149836 — the branch closes; the PR record and commit are
 * the durable provenance); these tests pin the behaviour the policy relies
 * on: additions and deletions are separated per file so deleted text is
 * never misread as newly added content.
 */
describe('parseApplyPatchContent', () => {
  it('projects an add-file section into wholly-new content', () => {
    const patch = [
      '*** Begin Patch',
      '*** Add File: notes/example.txt',
      '+first line',
      '+second line',
      '*** End Patch',
      '',
    ].join('\n');

    const result = parseApplyPatchContent(patch);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual([
        {
          newContent: 'first line\nsecond line',
          priorContent: '',
          filePath: 'notes/example.txt',
        },
      ]);
    }
  });

  it('separates additions from deletions in an update section', () => {
    const patch = [
      '*** Begin Patch',
      '*** Update File: notes/example.txt',
      '@@',
      ' unchanged context',
      '-removed line',
      '+added line',
      '*** End Patch',
      '',
    ].join('\n');

    const result = parseApplyPatchContent(patch);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual([
        {
          newContent: 'added line',
          priorContent: 'removed line',
          filePath: 'notes/example.txt',
        },
      ]);
    }
  });

  it('yields one change per file section', () => {
    const patch = [
      '*** Begin Patch',
      '*** Add File: a.txt',
      '+alpha',
      '*** Add File: b.txt',
      '+beta',
      '*** End Patch',
      '',
    ].join('\n');

    const result = parseApplyPatchContent(patch);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.map((change) => change.filePath)).toEqual(['a.txt', 'b.txt']);
    }
  });

  it('rejects a structurally invalid add-section body line', () => {
    const patch = [
      '*** Begin Patch',
      '*** Add File: a.txt',
      'missing plus prefix',
      '*** End Patch',
      '',
    ].join('\n');

    const result = parseApplyPatchContent(patch);

    expect(result.ok).toBe(false);
  });

  // Ported from the MCP-150 branch's router suite (PR #707 at f96149836,
  // MCP-183 secondary port): move/delete projection and the malformed-shape
  // rejection battery.

  it('projects add, move, and delete sections per target path', () => {
    const patch = [
      '*** Begin Patch',
      '*** Add File: /repo/added.md',
      '+added line',
      '*** Update File: /repo/old.md',
      '*** Move to: /repo/moved.md',
      '@@',
      '-old line',
      '+moved line',
      '*** Delete File: /repo/deleted.md',
      '*** End Patch',
      '',
    ].join('\n');

    expect(unwrap(parseApplyPatchContent(patch))).toStrictEqual([
      { newContent: 'added line', priorContent: '', filePath: '/repo/added.md' },
      {
        newContent: 'moved line',
        priorContent: 'old line',
        filePath: '/repo/moved.md',
        movedFromPath: '/repo/old.md',
      },
      { newContent: '', priorContent: '', filePath: '/repo/deleted.md' },
    ]);
  });

  it.each([
    {
      label: 'an empty add section',
      patch: '*** Begin Patch\n*** Add File: /repo/empty.md\n*** End Patch',
    },
    {
      label: 'a delete section with body lines',
      patch: '*** Begin Patch\n*** Delete File: /repo/deleted.md\n-deleted\n*** End Patch',
    },
    {
      label: 'a late move target',
      patch:
        '*** Begin Patch\n*** Update File: /repo/old.md\n@@\n-old\n+new\n' +
        '*** Move to: /repo/new.md\n*** End Patch',
    },
    {
      label: 'a non-terminal end-of-file marker',
      patch:
        '*** Begin Patch\n*** Update File: /repo/file.md\n@@\n-old\n*** End of File\n' +
        '+new\n*** End Patch',
    },
  ])('rejects $label', ({ patch }) => {
    expect(parseApplyPatchContent(patch).ok).toBe(false);
  });
});
