import { describe, expect, it } from 'vitest';

import { shouldInspectFitnessPath } from './paths.js';

describe('shouldInspectFitnessPath', () => {
  it('keeps live markdown files and excludes backups and archives', () => {
    expect(shouldInspectFitnessPath('.agent/practice-core/practice.md')).toBe(true);
    expect(shouldInspectFitnessPath('.agent/practice-core-backup-2026-03-23/practice.md')).toBe(
      false,
    );
    expect(shouldInspectFitnessPath('.agent/memory/active/archive/napkin-2026-03-21.md')).toBe(
      false,
    );
    expect(shouldInspectFitnessPath('.agent/practice-core/incoming/practice.md')).toBe(false);
  });
});
