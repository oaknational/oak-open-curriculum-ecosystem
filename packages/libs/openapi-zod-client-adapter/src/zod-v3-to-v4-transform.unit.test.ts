import { describe, it, expect } from 'vitest';
import { transformZodV3ToV4 } from './zod-v3-to-v4-transform.js';

describe('transformZodV3ToV4', () => {
  describe('import transformations', () => {
    it('keeps basic zod import unchanged (consuming packages have zod v4)', () => {
      const input = 'import { z } from "zod";';
      const expected = 'import { z } from "zod";';

      expect(transformZodV3ToV4(input)).toBe(expected);
    });

    it('keeps zod import with single quotes unchanged', () => {
      const input = "import { z } from 'zod';";
      const expected = "import { z } from 'zod';";

      expect(transformZodV3ToV4(input)).toBe(expected);
    });

    it('transforms ZodSchema type import to ZodType (keeps path as zod)', () => {
      const input = 'import { z, type ZodSchema } from "zod";';
      const expected = 'import { z, type ZodType } from "zod";';

      expect(transformZodV3ToV4(input)).toBe(expected);
    });
  });

  describe('type transformations', () => {
    it('transforms standalone ZodSchema to ZodType', () => {
      const input = 'const schema: ZodSchema = z.string();';
      const expected = 'const schema: ZodType = z.string();';

      expect(transformZodV3ToV4(input)).toBe(expected);
    });

    it('transforms multiple ZodSchema occurrences', () => {
      const input = 'type A = ZodSchema; type B = ZodSchema;';
      const expected = 'type A = ZodType; type B = ZodType;';

      expect(transformZodV3ToV4(input)).toBe(expected);
    });
  });

  describe('method transformations', () => {
    it('transforms .passthrough() to .loose()', () => {
      const input = 'z.object({}).passthrough()';
      const expected = 'z.object({}).loose()';

      expect(transformZodV3ToV4(input)).toBe(expected);
    });

    it('transforms multiple passthrough calls', () => {
      const input = 'schema1.passthrough(); schema2.passthrough();';
      const expected = 'schema1.loose(); schema2.loose();';

      expect(transformZodV3ToV4(input)).toBe(expected);
    });
  });

  describe('zodios removal', () => {
    it('removes makeApi, Zodios, ZodiosOptions import', () => {
      const input =
        'import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";\nconst x = 1;';
      const expected = 'const x = 1;';

      expect(transformZodV3ToV4(input)).toBe(expected);
    });

    it('removes makeApi-only import', () => {
      const input = 'import { makeApi } from "@zodios/core";\nconst x = 1;';
      const expected = 'const x = 1;';

      expect(transformZodV3ToV4(input)).toBe(expected);
    });

    it('replaces makeApi( with plain (', () => {
      const input = 'const endpoints = makeApi([...]);';
      const expected = 'const endpoints = ([...]);';

      expect(transformZodV3ToV4(input)).toBe(expected);
    });

    it('removes export const api = new Zodios(endpoints)', () => {
      const input = 'export const api = new Zodios(endpoints);\nconst x = 1;';
      const expected = 'const x = 1;';

      expect(transformZodV3ToV4(input)).toBe(expected);
    });

    it('removes createApiClient function', () => {
      const input = `export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
const x = 1;`;
      const expected = 'const x = 1;';

      expect(transformZodV3ToV4(input)).toBe(expected);
    });
  });

  describe('combined transformations', () => {
    it('applies all transformations to realistic input', () => {
      const input = `import { z, type ZodSchema } from "zod";
import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";

const UserSchema: ZodSchema = z.object({
  name: z.string(),
  metadata: z.object({}).passthrough(),
});

const endpoints = makeApi([
  { method: "get", path: "/users", response: UserSchema },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}`;

      const result = transformZodV3ToV4(input);

      expect(result).toContain('import { z, type ZodType } from "zod"');
      expect(result).not.toContain('@zodios/core');
      expect(result).toContain('ZodType');
      expect(result).not.toContain('ZodSchema');
      expect(result).toContain('.loose()');
      expect(result).not.toContain('.passthrough()');
      expect(result).not.toContain('makeApi(');
      expect(result).toContain('endpoints = ([');
      expect(result).not.toContain('export const api');
      expect(result).not.toContain('createApiClient');
    });
  });
});
