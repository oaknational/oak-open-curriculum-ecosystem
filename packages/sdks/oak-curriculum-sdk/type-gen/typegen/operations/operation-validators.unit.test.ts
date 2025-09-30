import { describe, it, expect } from 'vitest';
import {
  isRecord,
  hasProperty,
  isParameterObject,
  isOperationObject,
  getPropertyValue,
} from './operation-validators';

describe('Operation Validators', () => {
  describe('isRecord', () => {
    it('should return true for plain objects', () => {
      expect(isRecord({})).toBe(true);
      expect(isRecord({ key: 'value' })).toBe(true);
      expect(isRecord({ nested: { object: true } })).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isRecord(null)).toBe(false);
      expect(isRecord(undefined)).toBe(false);
      expect(isRecord('string')).toBe(false);
      expect(isRecord(123)).toBe(false);
      expect(isRecord(true)).toBe(false);
      expect(isRecord([])).toBe(false);
    });
  });

  describe('hasProperty', () => {
    it('should check if object has a property', () => {
      const obj = { name: 'test', value: 42 };
      expect(hasProperty(obj, 'name')).toBe(true);
      expect(hasProperty(obj, 'value')).toBe(true);
      expect(hasProperty(obj, 'missing')).toBe(false);
    });

    it('should work with nested properties', () => {
      const obj = { nested: { prop: 'value' } };
      expect(hasProperty(obj, 'nested')).toBe(true);
      expect(hasProperty(obj, 'prop')).toBe(false);
    });
  });

  describe('getPropertyValue', () => {
    it('should safely get property values', () => {
      const obj = { name: 'test', value: 42, nested: { prop: 'value' } };
      expect(getPropertyValue(obj, 'name')).toBe('test');
      expect(getPropertyValue(obj, 'value')).toBe(42);
      expect(getPropertyValue(obj, 'nested')).toEqual({ prop: 'value' });
    });

    it('should return undefined for missing properties', () => {
      const obj = { name: 'test' };
      expect(getPropertyValue(obj, 'missing')).toBeUndefined();
    });

    it('should handle non-objects safely', () => {
      expect(getPropertyValue(null, 'prop')).toBeUndefined();
      expect(getPropertyValue(undefined, 'prop')).toBeUndefined();
      expect(getPropertyValue('string', 'prop')).toBeUndefined();
    });
  });

  describe('isParameterObject', () => {
    it('should identify valid parameter objects', () => {
      expect(
        isParameterObject({
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        }),
      ).toBe(true);

      expect(
        isParameterObject({
          name: 'filter',
          in: 'query',
          description: 'Filter results',
        }),
      ).toBe(true);
    });

    it('should reject invalid parameter objects', () => {
      expect(isParameterObject({})).toBe(false);
      expect(isParameterObject({ name: 'test' })).toBe(false); // Missing 'in'
      expect(isParameterObject({ in: 'path' })).toBe(false); // Missing 'name'
      expect(
        isParameterObject({
          name: 'test',
          in: 'invalid', // Invalid 'in' value
        }),
      ).toBe(false);
    });

    it('should reject non-objects', () => {
      expect(isParameterObject(null)).toBe(false);
      expect(isParameterObject(undefined)).toBe(false);
      expect(isParameterObject('string')).toBe(false);
      expect(isParameterObject(123)).toBe(false);
    });
  });

  describe('isOperationObject', () => {
    it('should identify valid operation objects', () => {
      expect(
        isOperationObject({
          responses: {
            '200': { description: 'Success' },
          },
        }),
      ).toBe(true);

      expect(
        isOperationObject({
          operationId: 'getUsers',
          summary: 'Get all users',
          responses: {
            '200': { description: 'Success' },
            '404': { description: 'Not found' },
          },
        }),
      ).toBe(true);
    });

    it('should reject invalid operation objects', () => {
      expect(isOperationObject({})).toBe(false); // Missing responses
      expect(isOperationObject({ operationId: 'test' })).toBe(false); // Missing responses
      expect(isOperationObject({ responses: null })).toBe(false); // Null responses
      expect(isOperationObject({ responses: 'invalid' })).toBe(false); // Invalid responses type
    });

    it('should reject non-objects', () => {
      expect(isOperationObject(null)).toBe(false);
      expect(isOperationObject(undefined)).toBe(false);
      expect(isOperationObject('string')).toBe(false);
      expect(isOperationObject(123)).toBe(false);
    });
  });
});
