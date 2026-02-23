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

  describe('strict schema enforcement (remove passthrough)', () => {
    it('removes .passthrough() - unknown keys must not be silently ignored', () => {
      const input = 'z.object({}).passthrough()';

      expect(transformZodV3ToV4(input)).toBe('z.object({})');
    });

    it('removes multiple passthrough calls', () => {
      const input = 'schema1.passthrough(); schema2.passthrough();';

      expect(transformZodV3ToV4(input)).toBe('schema1; schema2;');
    });

    it('preserves .strict() calls when passthrough is also present', () => {
      // openapi-zod-client may produce contradictory .strict().passthrough()
      // We keep .strict() and remove .passthrough()
      const input = 'z.object({}).strict().passthrough()';

      expect(transformZodV3ToV4(input)).toBe('z.object({}).strict()');
    });

    it('preserves standalone .strict() calls', () => {
      const input = 'z.object({}).strict()';

      expect(transformZodV3ToV4(input)).toBe('z.object({}).strict()');
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

  describe('allOf intersection strict fix', () => {
    it('removes .strict() from both sides of .and() intersections', () => {
      const input = `z.array(
              z
                .object({ order: z.number() })
                .strict()
                .and(
                  z.object({ type: z.string(), content: z.string() }).strict()
                )
            )`;

      const result = transformZodV3ToV4(input);

      expect(result).not.toContain('.strict()');
      expect(result).toContain('.and(');
      expect(result).toContain('.object({ order: z.number() })');
      expect(result).toContain('z.object({ type: z.string(), content: z.string() })');
    });

    it('preserves .strict() on non-intersection objects', () => {
      const input = `z.object({ name: z.string() }).strict()`;

      const result = transformZodV3ToV4(input);

      expect(result).toContain('.strict()');
    });

    it('handles multiple intersection occurrences while preserving non-intersection strict', () => {
      const input = `z.union([
        z.object({ a: z.string() }).strict(),
        z.object({ order: z.number() })
          .strict()
          .and(
            z.object({ type: z.string() }).strict()
          ),
        z.object({ b: z.number() }).strict(),
      ])`;

      const result = transformZodV3ToV4(input);

      expect(result).toContain('z.object({ a: z.string() }).strict()');
      expect(result).toContain('z.object({ b: z.number() }).strict()');
      expect(result).toContain('.and(');
      expect(result).not.toContain('z.object({ type: z.string() }).strict()');
      expect(result).toContain('z.object({ type: z.string() })');
      expect(result).not.toMatch(/\.strict\(\)\s*\.and\(/);
    });
  });

  describe('combined transformations', () => {
    it('applies all transformations to realistic input with strict schemas', () => {
      const input = `import { z, type ZodSchema } from "zod";
import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";

const UserSchema: ZodSchema = z.object({
  name: z.string(),
  metadata: z.object({}).strict(),
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
      expect(result).toContain('.strict()');
      expect(result).not.toContain('.passthrough()');
      expect(result).not.toContain('makeApi(');
      expect(result).toContain('endpoints = ([');
      expect(result).not.toContain('export const api');
      expect(result).not.toContain('createApiClient');
    });

    it('removes passthrough and preserves strict in mixed schema', () => {
      // Real-world case: openapi-zod-client produces .strict().passthrough() combinations
      const input = `import { z, type ZodSchema } from "zod";
const UserSchema: ZodSchema = z.object({
  name: z.string(),
  metadata: z.object({}).strict().passthrough(),
});`;

      const result = transformZodV3ToV4(input);

      expect(result).toContain('.strict()');
      expect(result).not.toContain('.passthrough()');
    });
  });
});
