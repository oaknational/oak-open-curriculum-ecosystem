/**
 * @fileoverview Tests for core types
 * @module moria/types/core.test
 */

import { describe, it, expect, expectTypeOf } from 'vitest';
import type {
  Result,
  AsyncResult,
  Optional,
  Nullable,
  NonEmptyArray,
  DeepReadonly,
  DeepPartial,
  Primitive,
  JsonValue,
  JsonObject,
  JsonArray,
  Brand,
  Tagged,
  Opaque,
} from './core';

describe('Core types', () => {
  describe('Result type', () => {
    it('should represent success values', () => {
      const success: Result<number, string> = {
        ok: true,
        value: 42,
      };

      expect(success.ok).toBe(true);
      if (success.ok) {
        expectTypeOf(success.value).toBeNumber();
        expect(success.value).toBe(42);
      }
    });

    it('should represent error values', () => {
      const failure: Result<number, string> = {
        ok: false,
        error: 'Something went wrong',
      };

      expect(failure.ok).toBe(false);
      if (!failure.ok) {
        expectTypeOf(failure.error).toBeString();
        expect(failure.error).toBe('Something went wrong');
      }
    });

    it('should work with Error objects', () => {
      const error: Result<string, Error> = {
        ok: false,
        error: new Error('Failed'),
      };

      expect(error.ok).toBe(false);
      if (!error.ok) {
        expect(error.error).toBeInstanceOf(Error);
        expect(error.error.message).toBe('Failed');
      }
    });
  });

  describe('AsyncResult type', () => {
    it('should wrap Result in Promise', async () => {
      const asyncSuccess: AsyncResult<number, string> = Promise.resolve({
        ok: true,
        value: 42,
      });

      const result = await asyncSuccess;
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(42);
      }
    });
  });

  describe('Optional type', () => {
    it('should allow undefined', () => {
      const maybeString: Optional<string> = undefined;
      expect(maybeString).toBeUndefined();
      expectTypeOf(maybeString).toMatchTypeOf<string | undefined>();
    });

    it('should allow the value type', () => {
      const maybeNumber: Optional<number> = 42;
      expect(maybeNumber).toBe(42);
    });
  });

  describe('Nullable type', () => {
    it('should allow null', () => {
      const nullableString: Nullable<string> = null;
      expect(nullableString).toBeNull();
      expectTypeOf(nullableString).toMatchTypeOf<string | null>();
    });

    it('should allow the value type', () => {
      const nullableBoolean: Nullable<boolean> = true;
      expect(nullableBoolean).toBe(true);
    });
  });

  describe('NonEmptyArray type', () => {
    it('should ensure at least one element', () => {
      const nonEmpty: NonEmptyArray<number> = [1];
      expect(nonEmpty).toHaveLength(1);
      expect(nonEmpty[0]).toBe(1);
      expectTypeOf(nonEmpty[0]).toBeNumber();
    });

    it('should allow multiple elements', () => {
      const nonEmpty: NonEmptyArray<string> = ['a', 'b', 'c'];
      expect(nonEmpty).toHaveLength(3);
      expect(nonEmpty[0]).toBe('a');
    });
  });

  describe('DeepReadonly type', () => {
    it('should make nested properties readonly', () => {
      type User = {
        name: string;
        settings: {
          theme: string;
          notifications: {
            email: boolean;
          };
        };
      };

      const readonlyUser: DeepReadonly<User> = {
        name: 'Alice',
        settings: {
          theme: 'dark',
          notifications: {
            email: true,
          },
        },
      };

      expect(readonlyUser.name).toBe('Alice');
      expect(readonlyUser.settings.theme).toBe('dark');
      expect(readonlyUser.settings.notifications.email).toBe(true);

      // TypeScript should prevent these at compile time:
      // readonlyUser.name = 'Bob';
      // readonlyUser.settings.theme = 'light';
      // readonlyUser.settings.notifications.email = false;
    });
  });

  describe('DeepPartial type', () => {
    it('should make nested properties optional', () => {
      type Config = {
        server: {
          port: number;
          host: string;
        };
        database: {
          url: string;
          pool: {
            min: number;
            max: number;
          };
        };
      };

      const partialConfig: DeepPartial<Config> = {
        server: {
          port: 3000,
          // host is optional
        },
        // database is optional
      };

      expect(partialConfig.server?.port).toBe(3000);
      expect(partialConfig.server?.host).toBeUndefined();
      expect(partialConfig.database).toBeUndefined();
    });
  });

  describe('Primitive type', () => {
    it('should include all primitive types', () => {
      const string: Primitive = 'text';
      const number: Primitive = 42;
      const boolean: Primitive = true;
      const symbol: Primitive = Symbol('test');
      const bigint: Primitive = BigInt(9007199254740991);
      const nullValue: Primitive = null;
      const undefinedValue: Primitive = undefined;

      expect(typeof string).toBe('string');
      expect(typeof number).toBe('number');
      expect(typeof boolean).toBe('boolean');
      expect(typeof symbol).toBe('symbol');
      expect(typeof bigint).toBe('bigint');
      expect(nullValue).toBeNull();
      expect(undefinedValue).toBeUndefined();
    });
  });

  describe('JSON types', () => {
    it('should represent valid JSON values', () => {
      const jsonString: JsonValue = 'text';
      const jsonNumber: JsonValue = 42;
      const jsonBoolean: JsonValue = true;
      const jsonNull: JsonValue = null;
      const jsonArray: JsonValue = [1, 'two', true, null];
      const jsonObject: JsonValue = {
        name: 'test',
        count: 42,
        active: true,
        data: null,
        nested: { key: 'value' },
      };

      expect(jsonString).toBe('text');
      expect(jsonNumber).toBe(42);
      expect(jsonBoolean).toBe(true);
      expect(jsonNull).toBeNull();
      expect(jsonArray).toEqual([1, 'two', true, null]);
      expect(jsonObject).toHaveProperty('name', 'test');
    });

    it('should type JsonObject correctly', () => {
      const obj: JsonObject = {
        string: 'value',
        number: 42,
        boolean: true,
        null: null,
        array: [1, 2, 3],
        nested: {
          key: 'value',
        },
      };

      expect(obj.string).toBe('value');
      expect(obj.nested).toEqual({ key: 'value' });
    });

    it('should type JsonArray correctly', () => {
      const arr: JsonArray = [
        'string',
        42,
        true,
        null,
        { key: 'value' },
        [1, 2, 3],
      ];

      expect(arr[0]).toBe('string');
      expect(arr[1]).toBe(42);
      expect(arr[4]).toEqual({ key: 'value' });
    });
  });

  describe('Brand type', () => {
    it('should create branded types', () => {
      type UserId = Brand<string, 'UserId'>;
      type PostId = Brand<string, 'PostId'>;

      const userId = 'user123' as UserId;
      const postId = 'post456' as PostId;

      expect(userId).toBe('user123');
      expect(postId).toBe('post456');

      // These should be different types at compile time
      expectTypeOf(userId).not.toEqualTypeOf(postId);
    });
  });

  describe('Tagged type', () => {
    it('should create tagged union types', () => {
      type Success = Tagged<'success', { data: string }>;
      type Error = Tagged<'error', { message: string }>;
      type Result = Success | Error;

      const success: Result = {
        _tag: 'success',
        data: 'Hello',
      };

      const error: Result = {
        _tag: 'error',
        message: 'Failed',
      };

      expect(success._tag).toBe('success');
      expect(error._tag).toBe('error');

      if (success._tag === 'success') {
        expect(success.data).toBe('Hello');
      }

      if (error._tag === 'error') {
        expect(error.message).toBe('Failed');
      }
    });
  });

  describe('Opaque type', () => {
    it('should create opaque types', () => {
      type Email = Opaque<string, 'Email'>;
      type Url = Opaque<string, 'Url'>;

      const email = 'user@example.com' as Email;
      const url = 'https://example.com' as Url;

      expect(email).toBe('user@example.com');
      expect(url).toBe('https://example.com');

      // These should be different types at compile time
      expectTypeOf(email).not.toEqualTypeOf(url);
    });
  });
});
