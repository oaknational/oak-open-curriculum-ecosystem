/**
 * Unit tests for browse-curriculum tool validation.
 *
 * Tests that validateBrowseArgs correctly validates optional subject
 * and keyStage filters, including empty/missing inputs.
 */

import { describe, it, expect } from 'vitest';
import { validateBrowseArgs } from './validation.js';

describe('validateBrowseArgs', () => {
  describe('valid inputs', () => {
    it('accepts empty object (browse everything)', () => {
      const result = validateBrowseArgs({});

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.subject).toBeUndefined();
        expect(result.value.keyStage).toBeUndefined();
      }
    });

    it('accepts undefined input (browse everything)', () => {
      const result = validateBrowseArgs(undefined);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.subject).toBeUndefined();
        expect(result.value.keyStage).toBeUndefined();
      }
    });

    it('accepts null input (browse everything)', () => {
      const result = validateBrowseArgs(null);

      expect(result.ok).toBe(true);
    });

    it('accepts subject filter only', () => {
      const result = validateBrowseArgs({ subject: 'maths' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.subject).toBe('maths');
        expect(result.value.keyStage).toBeUndefined();
      }
    });

    it('accepts keyStage filter only', () => {
      const result = validateBrowseArgs({ keyStage: 'ks3' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.subject).toBeUndefined();
        expect(result.value.keyStage).toBe('ks3');
      }
    });

    it('accepts both subject and keyStage', () => {
      const result = validateBrowseArgs({ subject: 'science', keyStage: 'ks2' });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.subject).toBe('science');
        expect(result.value.keyStage).toBe('ks2');
      }
    });

    it.each([['ks1'], ['ks2'], ['ks3'], ['ks4']] as const)('accepts keyStage "%s"', (keyStage) => {
      const result = validateBrowseArgs({ keyStage });
      expect(result.ok).toBe(true);
    });

    it.each([['maths'], ['science'], ['english'], ['history']] as const)(
      'accepts subject "%s"',
      (subject) => {
        const result = validateBrowseArgs({ subject });
        expect(result.ok).toBe(true);
      },
    );
  });

  describe('invalid inputs', () => {
    it('rejects string input', () => {
      const result = validateBrowseArgs('maths');
      expect(result.ok).toBe(false);
    });

    it('rejects number input', () => {
      const result = validateBrowseArgs(42);
      expect(result.ok).toBe(false);
    });

    it('rejects invalid keyStage', () => {
      const result = validateBrowseArgs({ keyStage: 'ks5' });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain('keyStage');
      }
    });

    it('rejects invalid subject', () => {
      const result = validateBrowseArgs({ subject: 'not-a-subject' });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain('subject');
      }
    });

    it('rejects unknown properties', () => {
      const result = validateBrowseArgs({ subject: 'maths', extra: 'value' });
      expect(result.ok).toBe(false);
    });
  });
});
