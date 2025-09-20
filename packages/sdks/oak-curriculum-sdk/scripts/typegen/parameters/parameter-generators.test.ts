import { describe, it, expect } from 'vitest';
import {
  generateParameterConstant,
  generateAllParameterConstants,
  PARAMETER_GENERATION_CONFIG,
} from './parameter-generators';

describe('Parameter Generators', () => {
  describe('generateParameterConstant', () => {
    it('should generate parameter constant with type guard', () => {
      const values = ['ks1', 'ks2', 'ks3', 'ks4'];
      const result = generateParameterConstant('keyStage', 'keyStages', values);

      expect(result).toContain('export const KEY_STAGES = [');
      expect(result).toContain('"ks1"');
      expect(result).toContain('"ks2"');
      expect(result).toContain('type KeyStages = typeof KEY_STAGES');
      expect(result).toContain('export type KeyStage = KeyStages[number]');
      expect(result).toContain('export function isKeyStage(value: string): value is KeyStage');
      expect(result).toContain('return keyStages.includes(value)');
    });

    it('should omit emission for empty arrays (no useless constants/guards)', () => {
      const result = generateParameterConstant('emptyParam', 'emptyParams', []);
      expect(result).toBe('');
    });

    it('should handle type parameter specially as AssetType', () => {
      const values = ['slideDeck', 'video', 'worksheet'];
      const result = generateParameterConstant('type', 'assetTypes', values);

      expect(result).toContain('export const ASSET_TYPES = [');
      expect(result).toContain('"slideDeck"');
      expect(result).toContain('"video"');
      expect(result).toContain('type AssetTypes = typeof ASSET_TYPES');
      // IMPORTANT: Should be AssetType, not Type
      expect(result).toContain('export type AssetType = AssetTypes[number]');
      expect(result).toContain('export function isAssetType(value: string): value is AssetType');
      expect(result).toContain('return assetTypes.includes(value)');
    });

    it('should capitalize names correctly for camelCase', () => {
      const result = generateParameterConstant('threadSlug', 'threadSlugs', ['slug1', 'slug2']);

      expect(result).toContain('export const THREAD_SLUGS');
      expect(result).toContain('type ThreadSlugs = typeof THREAD_SLUGS');
      expect(result).toContain('export type ThreadSlug = ThreadSlugs[number]');
      expect(result).toContain('export function isThreadSlug');
    });

    it('should use the constant value directly for type safety', () => {
      const values = ['test1', 'test2'];
      const result = generateParameterConstant('testParam', 'testParams', values);

      // Type flows from the constant
      expect(result).toContain('type TestParams = typeof TEST_PARAMS');
      expect(result).toContain('export type TestParam = TestParams[number]');
      // No manual type definitions - it all flows from the const
    });
  });

  describe('generateAllParameterConstants', () => {
    it('should generate all parameter constants from config', () => {
      const parameters = {
        keyStage: ['ks1', 'ks2'],
        subject: ['maths', 'english'],
        type: ['video', 'worksheet'],
      };

      const result = generateAllParameterConstants(parameters);

      expect(result).toContain('export const KEY_STAGES');
      expect(result).toContain('export const SUBJECTS');
      expect(result).toContain('export const ASSET_TYPES'); // Note: not TYPES
      expect(result).toContain('export type KeyStage');
      expect(result).toContain('export type Subject');
      expect(result).toContain('export type AssetType'); // Note: not Type
    });

    it('should handle missing parameters gracefully by omitting outputs', () => {
      const parameters = {
        keyStage: ['ks1'],
        // Other parameters missing
      };

      const result = generateAllParameterConstants(parameters);

      expect(result).toContain('export const KEY_STAGES');
      // Missing parameters should not be emitted at all
      expect(result).not.toContain('export const SUBJECTS');
      expect(result).not.toContain('export const LESSONS');
    });
  });

  describe('PARAMETER_GENERATION_CONFIG', () => {
    it('should have all required parameter configurations', () => {
      expect(PARAMETER_GENERATION_CONFIG).toContainEqual(
        expect.objectContaining({
          singular: 'keyStage',
          plural: 'keyStages',
          constant: 'KEY_STAGES',
        }),
      );

      expect(PARAMETER_GENERATION_CONFIG).toContainEqual(
        expect.objectContaining({
          singular: 'type',
          plural: 'assetTypes',
          constant: 'ASSET_TYPES',
        }),
      );
    });

    it('should maintain consistency in naming patterns', () => {
      for (const config of PARAMETER_GENERATION_CONFIG) {
        // Constant should be uppercase version of plural
        const expectedConstant = config.plural
          .replace(/([A-Z])/g, '_$1')
          .toUpperCase()
          .replace(/^_/, '');
        expect(config.constant).toBe(expectedConstant);
      }
    });
  });
});
