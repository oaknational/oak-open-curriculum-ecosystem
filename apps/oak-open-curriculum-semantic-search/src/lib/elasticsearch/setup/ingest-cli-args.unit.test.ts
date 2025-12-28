import { describe, it, expect } from 'vitest';
import { SUBJECTS } from '@oaknational/oak-curriculum-sdk';
import { parseArgs } from './ingest-cli-args.js';

describe('parseArgs', () => {
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

    it('throws for invalid index kind', () => {
      expect(() => parseArgs(['--subject', 'maths', '--index', 'invalid'])).toThrow(
        'Invalid index kind',
      );
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

    it('throws error when neither --all nor --subject is specified', () => {
      expect(() => parseArgs([])).toThrow(
        'No subjects specified. Use --subject <slug> or --all for all subjects.',
      );
    });

    it('throws error when --all is combined with --subject', () => {
      expect(() => parseArgs(['--all', '--subject', 'maths'])).toThrow(
        '--all cannot be combined with --subject',
      );
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
      const result = parseArgs(['--all', '--dry-run', '--keystage', 'ks2']);
      expect(result.subjects).toEqual([...SUBJECTS]);
      expect(result.dryRun).toBe(true);
      expect(result.keyStages).toEqual(['ks2']);
    });
  });

  describe('--subject validation', () => {
    it('throws for invalid subject', () => {
      expect(() => parseArgs(['--subject', 'invalid-subject'])).toThrow('Invalid subject');
    });

    it('accepts all valid subjects from schema', () => {
      for (const subject of SUBJECTS) {
        const result = parseArgs(['--subject', subject]);
        expect(result.subjects).toContain(subject);
      }
    });
  });
});
