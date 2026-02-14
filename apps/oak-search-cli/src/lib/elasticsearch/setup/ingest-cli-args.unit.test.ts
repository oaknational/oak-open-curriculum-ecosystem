import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SUBJECTS } from '@oaknational/curriculum-sdk';
import { parseArgs } from './ingest-cli-args.js';
import {
  validateSubject,
  validateKeyStage,
  validateIndex,
  resolveSubjects,
  validateBulkMode,
} from './ingest-cli-validators.js';

/**
 * Tests for CLI argument parsing.
 *
 * Commander calls process.exit(1) on validation errors, so we mock it
 * for tests that need to verify error handling behavior.
 */
describe('parseArgs', () => {
  let mockExit: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
  });

  afterEach(() => {
    mockExit.mockRestore();
  });

  describe('--index flag', () => {
    it('parses --index flag with valid kind', () => {
      const result = parseArgs(['--subject', 'maths', '--index', 'lessons']);
      expect(result.indexes).toEqual(['lessons']);
    });

    it('accepts multiple --index flags', () => {
      const result = parseArgs(['--subject', 'maths', '--index', 'lessons', '--index', 'units']);
      expect(result.indexes).toEqual(['lessons', 'units']);
    });

    it('defaults to empty array when --index not specified', () => {
      const result = parseArgs(['--subject', 'maths']);
      expect(result.indexes).toEqual([]);
    });

    it('preserves other flags when --index is used', () => {
      const result = parseArgs(['--index', 'lessons', '--subject', 'maths', '--dry-run']);
      expect(result.indexes).toEqual(['lessons']);
      expect(result.subjects).toEqual(['maths']);
      expect(result.dryRun).toBe(true);
    });
  });

  describe('--all flag for subjects', () => {
    it('uses all schema-derived subjects when --all is specified', () => {
      const result = parseArgs(['--all']);
      expect(result.subjects).toEqual([...SUBJECTS]);
      expect(result.subjects).toHaveLength(17);
    });

    it('accepts single --subject without --all', () => {
      const result = parseArgs(['--subject', 'maths']);
      expect(result.subjects).toEqual(['maths']);
    });

    it('accepts multiple --subject flags without --all', () => {
      const result = parseArgs(['--subject', 'maths', '--subject', 'english']);
      expect(result.subjects).toEqual(['maths', 'english']);
    });

    it('--all works with other flags', () => {
      const result = parseArgs(['--all', '--dry-run', '--key-stage', 'ks2']);
      expect(result.subjects).toEqual([...SUBJECTS]);
      expect(result.dryRun).toBe(true);
      expect(result.keyStages).toEqual(['ks2']);
    });
  });

  describe('--subject parsing', () => {
    it('accepts all valid subjects from schema', () => {
      for (const subject of SUBJECTS) {
        const result = parseArgs(['--subject', subject]);
        expect(result.subjects).toContain(subject);
      }
    });

    it('--all works with --verbose', () => {
      const result = parseArgs(['--all', '--verbose']);
      expect(result.verbose).toBe(true);
      expect(result.subjects).toHaveLength(17);
    });
  });

  describe('--incremental flag', () => {
    it('defaults to false (overwrite mode)', () => {
      const result = parseArgs(['--subject', 'maths']);
      expect(result.incremental).toBe(false);
    });

    it('sets incremental to true when --incremental is specified', () => {
      const result = parseArgs(['--subject', 'maths', '--incremental']);
      expect(result.incremental).toBe(true);
    });

    it('sets incremental to true when -i is specified', () => {
      const result = parseArgs(['--subject', 'maths', '-i']);
      expect(result.incremental).toBe(true);
    });

    it('works with other flags', () => {
      const result = parseArgs(['--all', '--incremental', '--dry-run']);
      expect(result.incremental).toBe(true);
      expect(result.dryRun).toBe(true);
      expect(result.subjects).toHaveLength(17);
    });
  });

  describe('--ignore-cached-404 flag', () => {
    it('defaults to false', () => {
      const result = parseArgs(['--subject', 'maths']);
      expect(result.ignoreCached404).toBe(false);
    });

    it('sets ignoreCached404 to true when --ignore-cached-404 is specified', () => {
      const result = parseArgs(['--subject', 'maths', '--ignore-cached-404']);
      expect(result.ignoreCached404).toBe(true);
    });

    it('works with other flags', () => {
      const result = parseArgs(['--all', '--ignore-cached-404', '--verbose']);
      expect(result.ignoreCached404).toBe(true);
      expect(result.verbose).toBe(true);
      expect(result.subjects).toHaveLength(17);
    });
  });

  describe('flag combinations', () => {
    it('parses all flags together', () => {
      const result = parseArgs([
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
      const result = parseArgs(['--subject', 'maths', '-i', '-v']);
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
    it('returns empty array in bulk mode', () => {
      expect(resolveSubjects(['maths'], false, true)).toEqual([]);
    });

    it('throws when --all combined with subjects', () => {
      expect(() => resolveSubjects(['maths'], true, false)).toThrow(
        '--all cannot be combined with --subject',
      );
    });

    it('throws when no subjects and no --all', () => {
      expect(() => resolveSubjects([], false, false)).toThrow('No subjects specified');
    });

    it('returns all subjects when --all is true', () => {
      const result = resolveSubjects([], true, false);
      expect(result).toHaveLength(17);
    });

    it('returns explicit subjects when provided', () => {
      expect(resolveSubjects(['maths', 'english'], false, false)).toEqual(['maths', 'english']);
    });
  });

  describe('validateBulkMode', () => {
    it('throws when bulk mode without bulk-dir', () => {
      expect(() => validateBulkMode(true, undefined)).toThrow('--bulk requires --bulk-dir');
    });

    it('does not throw when bulk mode with bulk-dir', () => {
      expect(() => validateBulkMode(true, './data')).not.toThrow();
    });

    it('does not throw when not in bulk mode', () => {
      expect(() => validateBulkMode(false, undefined)).not.toThrow();
    });
  });
});
