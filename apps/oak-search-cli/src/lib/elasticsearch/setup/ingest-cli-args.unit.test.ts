import { describe, it, expect } from 'vitest';
import { SUBJECTS } from '@oaknational/curriculum-sdk';
import { parseArgs } from './ingest-cli-args.js';
import {
  validateSubject,
  validateKeyStage,
  validateIndex,
  resolveSubjects,
} from './ingest-cli-validators.js';

/** Tests for CLI argument parsing. */
describe('parseArgs', () => {
  describe('default mode is bulk', () => {
    it('defaults to bulk mode (api = false)', () => {
      const result = parseArgs([]);
      expect(result.api).toBe(false);
    });

    it('leaves bulkDir unset by default', () => {
      const result = parseArgs([]);
      expect(result.bulkDir).toBeUndefined();
    });

    it('does not require --subject or --all in bulk mode', () => {
      const result = parseArgs([]);
      expect(result.subjects).toEqual([]);
    });
  });

  describe('--api flag', () => {
    it('sets api mode when --api is specified', () => {
      const result = parseArgs(['--api', '--all']);
      expect(result.api).toBe(true);
    });

    it('requires subjects in API mode', () => {
      expect(() => parseArgs(['--api'])).toThrow('No subjects specified');
    });

    it('works with --subject in API mode', () => {
      const result = parseArgs(['--api', '--subject', 'maths']);
      expect(result.api).toBe(true);
      expect(result.subjects).toEqual(['maths']);
    });

    it('works with --all in API mode', () => {
      const result = parseArgs(['--api', '--all']);
      expect(result.api).toBe(true);
      expect(result.subjects).toEqual([...SUBJECTS]);
    });
  });

  describe('--index flag', () => {
    it('parses --index flag with valid kind', () => {
      const result = parseArgs(['--index', 'lessons']);
      expect(result.indexes).toEqual(['lessons']);
    });

    it('accepts multiple --index flags', () => {
      const result = parseArgs(['--index', 'lessons', '--index', 'units']);
      expect(result.indexes).toEqual(['lessons', 'units']);
    });

    it('defaults to empty array when --index not specified', () => {
      const result = parseArgs([]);
      expect(result.indexes).toEqual([]);
    });

    it('preserves other flags when --index is used', () => {
      const result = parseArgs(['--index', 'lessons', '--dry-run']);
      expect(result.indexes).toEqual(['lessons']);
      expect(result.dryRun).toBe(true);
    });
  });

  describe('--all flag for subjects (API mode)', () => {
    it('uses all schema-derived subjects when --all is specified in API mode', () => {
      const result = parseArgs(['--api', '--all']);
      expect(result.subjects).toEqual([...SUBJECTS]);
      expect(result.subjects).toHaveLength(17);
    });

    it('accepts single --subject without --all in API mode', () => {
      const result = parseArgs(['--api', '--subject', 'maths']);
      expect(result.subjects).toEqual(['maths']);
    });

    it('accepts multiple --subject flags without --all in API mode', () => {
      const result = parseArgs(['--api', '--subject', 'maths', '--subject', 'english']);
      expect(result.subjects).toEqual(['maths', 'english']);
    });

    it('--all works with other flags in API mode', () => {
      const result = parseArgs(['--api', '--all', '--dry-run', '--key-stage', 'ks2']);
      expect(result.subjects).toEqual([...SUBJECTS]);
      expect(result.dryRun).toBe(true);
      expect(result.keyStages).toEqual(['ks2']);
    });
  });

  describe('--subject parsing (API mode)', () => {
    it('accepts all valid subjects from schema', () => {
      for (const subject of SUBJECTS) {
        const result = parseArgs(['--api', '--subject', subject]);
        expect(result.subjects).toContain(subject);
      }
    });

    it('--all works with --verbose in API mode', () => {
      const result = parseArgs(['--api', '--all', '--verbose']);
      expect(result.verbose).toBe(true);
      expect(result.subjects).toHaveLength(17);
    });
  });

  describe('--incremental flag', () => {
    it('defaults to false (overwrite mode)', () => {
      const result = parseArgs([]);
      expect(result.incremental).toBe(false);
    });

    it('sets incremental to true when --incremental is specified', () => {
      const result = parseArgs(['--incremental']);
      expect(result.incremental).toBe(true);
    });

    it('sets incremental to true when -i is specified', () => {
      const result = parseArgs(['-i']);
      expect(result.incremental).toBe(true);
    });

    it('works with other flags', () => {
      const result = parseArgs(['--incremental', '--dry-run']);
      expect(result.incremental).toBe(true);
      expect(result.dryRun).toBe(true);
    });
  });

  describe('--ignore-cached-404 flag', () => {
    it('defaults to false', () => {
      const result = parseArgs([]);
      expect(result.ignoreCached404).toBe(false);
    });

    it('sets ignoreCached404 to true when --ignore-cached-404 is specified', () => {
      const result = parseArgs(['--ignore-cached-404']);
      expect(result.ignoreCached404).toBe(true);
    });

    it('works with other flags', () => {
      const result = parseArgs(['--ignore-cached-404', '--verbose']);
      expect(result.ignoreCached404).toBe(true);
      expect(result.verbose).toBe(true);
    });
  });

  describe('--bulk-dir override', () => {
    it('accepts custom bulk-dir', () => {
      const result = parseArgs(['--bulk-dir', '/tmp/my-bulk']);
      expect(result.bulkDir).toBe('/tmp/my-bulk');
    });
  });

  describe('flag combinations', () => {
    it('parses all flags together in API mode', () => {
      const result = parseArgs([
        '--api',
        '--subject',
        'maths',
        '--key-stage',
        'ks4',
        '--incremental',
        '--bypass-cache',
        '--verbose',
        '--dry-run',
      ]);
      expect(result.subjects).toEqual(['maths']);
      expect(result.keyStages).toEqual(['ks4']);
      expect(result.incremental).toBe(true);
      expect(result.bypassCache).toBe(true);
      expect(result.verbose).toBe(true);
      expect(result.dryRun).toBe(true);
    });

    it('short flags work together', () => {
      const result = parseArgs(['-i', '-v']);
      expect(result.incremental).toBe(true);
      expect(result.verbose).toBe(true);
    });
  });
});

/**
 * Tests for individual validators.
 *
 * These throw errors directly without going through commander,
 * so they can be tested without mocking process.exit.
 */
describe('validators', () => {
  describe('validateSubject', () => {
    it('returns valid subject', () => {
      expect(validateSubject('maths')).toBe('maths');
    });

    it('throws for invalid subject', () => {
      expect(() => validateSubject('invalid')).toThrow('Invalid subject');
    });
  });

  describe('validateKeyStage', () => {
    it('returns valid key stage', () => {
      expect(validateKeyStage('ks1')).toBe('ks1');
      expect(validateKeyStage('ks4')).toBe('ks4');
    });

    it('throws for invalid key stage', () => {
      expect(() => validateKeyStage('ks5')).toThrow('Invalid key stage');
    });
  });

  describe('validateIndex', () => {
    it('returns valid index kind', () => {
      expect(validateIndex('lessons')).toBe('lessons');
      expect(validateIndex('units')).toBe('units');
    });

    it('throws for invalid index', () => {
      expect(() => validateIndex('invalid')).toThrow('Invalid index');
    });
  });

  describe('resolveSubjects', () => {
    it('returns empty array in bulk mode (apiMode=false)', () => {
      expect(resolveSubjects([], false, false)).toEqual([]);
    });

    it('throws when --all combined with subjects in API mode', () => {
      expect(() => resolveSubjects(['maths'], true, true)).toThrow(
        '--all cannot be combined with --subject',
      );
    });

    it('throws when no subjects and no --all in API mode', () => {
      expect(() => resolveSubjects([], false, true)).toThrow('No subjects specified');
    });

    it('returns all subjects when --all is true in API mode', () => {
      const result = resolveSubjects([], true, true);
      expect(result).toHaveLength(17);
    });

    it('returns explicit subjects when provided in API mode', () => {
      expect(resolveSubjects(['maths', 'english'], false, true)).toEqual(['maths', 'english']);
    });
  });
});
