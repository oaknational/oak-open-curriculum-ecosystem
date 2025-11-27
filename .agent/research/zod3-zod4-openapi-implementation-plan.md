# Implementation Plan: Isolating `openapi-zod-client` (Zod 3) and Exposing Zod 4 Schemas in a pnpm Monorepo

## 1. Objectives and Constraints

### 1.1 Primary Objectives

- Use **Zod 4** across the application codebase (types + runtime).
- Consume **`openapi-zod-client`**, which currently depends on **Zod 3.18.x**, without polluting the rest of the monorepo.
- Provide a **clean, Zod 4–only API** (schemas + types + clients) to downstream packages/apps.
- Avoid brittle peer-dependency hacks; keep the solution explicit, debuggable, and maintainable.

### 1.2 Constraints and Non-Goals

- The solution must work in a **pnpm monorepo**.
- `openapi-zod-client` is **not under our control** and may stay on Zod 3 for some time.
- We **won’t** attempt to deeply modify or fork `openapi-zod-client` at this stage.
- We accept a **single “adapter” workspace** that knows about both Zod 3 and Zod 4.
- The rest of the monorepo should **never directly import or depend on Zod 3**.

## 2. High-Level Architecture

### 2.1 Monorepo Structure

Example layout (`pnpm-workspace.yaml`):

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

Workspaces of interest:

- `packages/openapi-zod-runtime`
  - Knows about:
    - `openapi-zod-client` (Zod 3 dependency)
    - `zod3` (aliased Zod 3)
    - `zod` (Zod 4)
  - Responsibilities:
    - Load/parse OpenAPI specs.
    - Invoke `openapi-zod-client` programmatically (or via CLI, if preferred).
    - Receive **Zod 3 schemas**.
    - Convert Zod 3 schemas into **Zod 4 schemas**.
    - Export Zod 4 schemas and inferred types to the rest of the monorepo.

- `apps/web`, `apps/api`, etc.
  - Depend only on:
    - `zod` (Zod 4)
    - `@your-scope/openapi-zod-runtime`
  - Treat `@your-scope/openapi-zod-runtime` as **the canonical source of API schemas/types**.

### 2.2 Data Flow

1. **OpenAPI Spec** (YAML/JSON) lives in a dedicated location (e.g. `packages/openapi-zod-runtime/specs/api.yaml`).
2. `openapi-zod-runtime` loads the spec (either at build-time or at runtime).
3. `openapi-zod-client` is used to derive **Zod 3 schemas and/or a Zodios client**.
4. A custom converter **`convertZ3ToZ4`** walks Zod 3 schemas and builds equivalent **Zod 4 schemas**.
5. Zod 4 schemas are exported via `openapi-zod-runtime` (and optionally pre-generated into TypeScript source).
6. Application packages import Zod 4 schemas and inferred types from `openapi-zod-runtime`.

This isolates all Zod 3 usage within a single workspace boundary.

## 3. Dependency Strategy in a pnpm Monorepo

### 3.1 Root `pnpm-workspace.yaml`

Ensure `packages` and `apps` are properly defined:

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

### 3.2 Root `package.json`

Establish **Zod 4** as the root version and lock `openapi-zod-client`’s internal Zod to 3.18.x:

```jsonc
{
  "name": "your-monorepo",
  "private": true,
  "dependencies": {
    "zod": "^4.0.0",
  },
  "pnpm": {
    "overrides": {
      "openapi-zod-client>zod": "3.18.1",
    },
  },
}
```

Notes:

- `zod` at the root is **Zod 4**, used by all apps and packages by default.
- `openapi-zod-client` will get its own nested `zod@3.18.1` under its workspace due to the `overrides` rule.

### 3.3 `packages/openapi-zod-runtime/package.json`

Create the “adapter” workspace:

```jsonc
{
  "name": "@your-scope/openapi-zod-runtime",
  "version": "0.1.0",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --dts",
    "dev": "tsup src/index.ts --dts --watch",
    "lint": "eslint src --ext .ts,.tsx",
    "test": "vitest",
  },
  "dependencies": {
    "openapi-zod-client": "^1.15.0", // or your chosen version
    "zod": "^4.0.0",
    "zod3": "npm:zod@3.18.1",
    "yaml": "^2.5.0",
    "openapi3-ts": "^4.0.0",
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "eslint": "^9.0.0",
    "vitest": "^2.0.0",
  },
}
```

Key points:

- `zod3` is an **alias** to Zod 3.18.1; this allows us to import Zod 3 explicitly (`import * as z3 from "zod3"`).
- `zod` is Zod 4, consistent with the rest of the monorepo.
- `openapi-zod-client` remains a dependency, and its internal Zod stays at 3.x.

## 4. Spec Management

### 4.1 Location and Format

Decide where to keep the OpenAPI spec(s). For example:

- YAML: `packages/openapi-zod-runtime/specs/api.yaml`
- JSON: `packages/openapi-zod-runtime/specs/api.json`

Recommendation:

- Prefer YAML for hand-edited specs; JSON for generated ones.
- Keep them version-controlled alongside the runtime package.

### 4.2 Spec Loading Utility

Create a simple loader (YAML/JSON agnostic):

```ts
// packages/openapi-zod-runtime/src/loadOpenApiSpec.ts
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';
import type { OpenAPIObject } from 'openapi3-ts';

export function loadOpenApiSpec(relativePath = '../specs/api.yaml'): OpenAPIObject {
  const filePath = path.resolve(__dirname, relativePath);
  const content = fs.readFileSync(filePath, 'utf8');

  if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
    return yaml.parse(content) as OpenAPIObject;
  }

  return JSON.parse(content) as OpenAPIObject;
}
```

This will be used by the generator / runtime code to obtain the spec.

## 5. Integrating `openapi-zod-client` Programmatically

### 5.1 Decide on CLI vs Programmatic Mode

Options:

1. **Programmatic Mode (recommended for flexibility)**
   - Use the library’s internal functions to compute schemas/Zodios endpoints in memory.
   - Convert Zod 3 schemas → Zod 4 on the fly.
   - Optionally generate TS source from these Zod 4 schemas.

2. **CLI Mode (simpler, more static)**
   - Use the CLI to generate a `.ts` file (which currently uses Zod 3).
   - Import the generated file and convert the exported Zod 3 schemas to Zod 4.

Recommendation: **Programmatic mode** for better control and easier evolution, unless you strongly prefer file-based generated code only.

### 5.2 Programmatic Wiring (Conceptual)

You will need a small adapter that:

- Takes an `OpenAPIObject`.
- Uses internal helpers of `openapi-zod-client` to produce a map of **Zod 3 schemas** (e.g. per ref or per name).
- Exposes a function like `getSchema(ref: string): Zod3Schema`.

Because `openapi-zod-client` doesn’t (yet) expose a first-class `getSchema` API, you have two main choices:

1. **Lightweight internal adapter**:
   - Inspect the source (tests/examples) to identify the logic that builds `schemas` in the CLI output.
   - Wrap that logic in a helper `getZodSchemas(openApiDoc): Record<string, z3.ZodTypeAny>` inside your runtime package (using local code that mimics the CLI).
   - This keeps you forward-compatible because if the library changes, you update one adapter module.

2. **CLI-based extraction**:
   - Run the CLI with `--export-schemas` and a `schemas-only` template.
   - The generated file typically exports a `schemas` object (Zod 3 instances).
   - Import that `schemas` object directly in your runtime package.

For a robust, long-lived solution, prefer **Option 1 (lightweight internal adapter)**, as it avoids parsing generated files. However, **Option 2** can be used as a stepping stone.

### 5.3 Example CLI-based Extraction Flow

1. Add a `schemas-only` Handlebars template in `openapi-zod-runtime/templates/schemas-only.hbs` that:
   - Imports `z` from `"zod"` (but in this workspace, that import will resolve to Zod 3 when executed by `openapi-zod-client`).
   - Exports only the `schemas` object, mapping names → Zod schemas.

2. Add a generator script:

   ```ts
   // packages/openapi-zod-runtime/scripts/generate-schemas.ts
   import { execFileSync } from 'node:child_process';
   import path from 'node:path';

   const input = path.resolve(__dirname, '../specs/api.yaml');
   const output = path.resolve(__dirname, '../src/generated/zod3-schemas.ts');
   const template = path.resolve(__dirname, '../templates/schemas-only.hbs');

   execFileSync(
     'pnpm',
     ['openapi-zod-client', input, '-o', output, '-t', template, '--export-schemas'],
     {
       stdio: 'inherit',
     },
   );
   ```

3. Wire the script into `package.json`:

   ```jsonc
   {
     "scripts": {
       "generate": "tsx scripts/generate-schemas.ts",
       "build": "pnpm generate && tsup src/index.ts --dts",
     },
   }
   ```

4. Now `src/generated/zod3-schemas.ts` exports Zod 3 schemas (importing `z` from `"zod"` — which, for this generated file, must be resolved to Zod 3 via `openapi-zod-client`’s own dependency or aliases).

5. You import these schemas in the runtime index and convert them to Zod 4 (next section).

## 6. Zod 3 → Zod 4 Conversion Layer

### 6.1 Design Goals for the Converter

- Should handle **only** the subset of Zod types that are generated from the OpenAPI spec (to keep complexity contained).
- Conversion logic should be **isolated** in one file, with tests and clear error messages for unsupported types.
- Expose a single function: `convertZ3ToZ4(schema: z3.ZodTypeAny): z4.ZodTypeAny`.

### 6.2 Converter Implementation Skeleton

Create `packages/openapi-zod-runtime/src/convertZ3ToZ4.ts`:

```ts
import * as z3 from 'zod3';
import * as z4 from 'zod';

type Z3Any = z3.ZodTypeAny;
type Z4Any = z4.ZodTypeAny;

export function convertZ3ToZ4(schema: Z3Any): Z4Any {
  const def = (schema as any)._def;

  switch (def.typeName) {
    case z3.ZodFirstPartyTypeKind.ZodString:
      return z4.string();

    case z3.ZodFirstPartyTypeKind.ZodNumber:
      return z4.number();

    case z3.ZodFirstPartyTypeKind.ZodBoolean:
      return z4.boolean();

    case z3.ZodFirstPartyTypeKind.ZodLiteral:
      return z4.literal(def.value);

    case z3.ZodFirstPartyTypeKind.ZodEnum:
      return z4.enum(def.values);

    case z3.ZodFirstPartyTypeKind.ZodArray: {
      const inner = convertZ3ToZ4(def.type);
      let arr = z4.array(inner);
      if (def.minLength) arr = arr.min(def.minLength.value);
      if (def.maxLength) arr = arr.max(def.maxLength.value);
      return arr;
    }

    case z3.ZodFirstPartyTypeKind.ZodNullable:
      return convertZ3ToZ4(def.innerType).nullable();

    case z3.ZodFirstPartyTypeKind.ZodOptional:
      return convertZ3ToZ4(def.innerType).optional();

    case z3.ZodFirstPartyTypeKind.ZodUnion:
      return z4.union(def.options.map((opt: Z3Any) => convertZ3ToZ4(opt)));

    case z3.ZodFirstPartyTypeKind.ZodObject: {
      const shape = def.shape();
      const newShape: Record<string, Z4Any> = {};
      for (const key of Object.keys(shape)) {
        newShape[key] = convertZ3ToZ4(shape[key]);
      }

      let obj = z4.object(newShape);

      if (def.unknownKeys === 'passthrough') obj = obj.passthrough();
      if (def.unknownKeys === 'strict') obj = obj.strict();

      return obj;
    }

    case z3.ZodFirstPartyTypeKind.ZodRecord: {
      const valueSchema = convertZ3ToZ4(def.valueType);
      // Zod 4 requires an explicit key schema; OpenAPI maps nicely to string keys.
      return z4.record(z4.string(), valueSchema);
    }

    default: {
      const typeName = def?.typeName ?? 'Unknown';
      throw new Error(`Unsupported Zod 3 schema type in convertZ3ToZ4: ${typeName}`);
    }
  }
}
```

### 6.3 Extending the Converter

Steps to extend coverage:

1. Run your generator and write a **small diagnostic script** that logs the `_def.typeName` of all schemas produced from your spec.
2. For each `typeName` not yet handled by `convertZ3ToZ4`, add a case and tests:
   - Examples: `ZodTuple`, `ZodIntersection`, `ZodDiscriminatedUnion`, etc.
3. For complex types (tuple, intersection), decide on how to map semantics to Zod 4:
   - For tuples, create `z4.tuple([ ... ])` with each item converted.
   - For intersections, use `z4.intersection(convert(a), convert(b))`.

Keep the list of supported types documented in comments for future maintainers.

## 7. Exposing Zod 4 Schemas and Types

### 7.1 Runtime Package Public API

Create `packages/openapi-zod-runtime/src/index.ts`:

```ts
import * as z4 from 'zod';
import * as z3 from 'zod3';
import { convertZ3ToZ4 } from './convertZ3ToZ4';

// Example: import Zod 3 schemas from generated file
import { schemas as z3Schemas } from './generated/zod3-schemas';

// Convert all Zod 3 schemas to Zod 4
const z4Schemas: Record<string, z4.ZodTypeAny> = {};

for (const [name, schema] of Object.entries(z3Schemas as Record<string, z3.ZodTypeAny>)) {
  z4Schemas[name] = convertZ3ToZ4(schema);
}

// Narrowed exports for known entities (optional, recommended)
export const UserSchema = z4Schemas['User'];
export type User = z4.infer<typeof UserSchema>;

export const PetSchema = z4Schemas['Pet'];
export type Pet = z4.infer<typeof PetSchema>;

// Or export a map for generic lookup
export const schemas = z4Schemas;
```

### 7.2 Consuming in Apps

In `apps/web` (or any other app):

```ts
// apps/web/src/api/types.ts
import { UserSchema, type User } from '@your-scope/openapi-zod-runtime';

// `UserSchema` is Zod 4
// `User` is a Zod 4–inferred type

export function assertValidUser(data: unknown): User {
  return UserSchema.parse(data);
}
```

Guarantees:

- No app imports Zod 3.
- No app is aware that `openapi-zod-client` exists; it only knows `@your-scope/openapi-zod-runtime`.

## 8. Build and CI Wiring

### 8.1 Local Build

In the `openapi-zod-runtime` workspace:

1. **Generate Zod 3 schemas** from OpenAPI:

   ```bash
   pnpm --filter @your-scope/openapi-zod-runtime run generate
   ```

2. **Build the runtime package**:
   ```bash
   pnpm --filter @your-scope/openapi-zod-runtime run build
   ```

In the monorepo root:

```bash
pnpm install
pnpm -r run build
```

### 8.2 CI Pipeline

In your CI configuration (e.g. GitHub Actions, GitLab CI, etc.), ensure:

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Generate schemas & build runtime package:

   ```bash
   pnpm --filter @your-scope/openapi-zod-runtime run generate
   pnpm --filter @your-scope/openapi-zod-runtime run build
   ```

3. Build all apps/packages:

   ```bash
   pnpm -r run build
   ```

4. Run tests:
   ```bash
   pnpm -r test
   ```

## 9. Testing Strategy

### 9.1 Unit Tests for the Converter

Use `vitest` in `openapi-zod-runtime` to cover `convertZ3ToZ4`:

- For each supported Zod 3 type, create a small schema and a payload set, then compare behavior:

```ts
// packages/openapi-zod-runtime/test/convertZ3ToZ4.test.ts
import { describe, it, expect } from 'vitest';
import * as z3 from 'zod3';
import * as z4 from 'zod';
import { convertZ3ToZ4 } from '../src/convertZ3ToZ4';

describe('convertZ3ToZ4', () => {
  it('converts string schemas', () => {
    const s3 = z3.string().min(3);
    const s4 = convertZ3ToZ4(s3) as z4.ZodString;

    expect(() => s3.parse('ab')).toThrow();
    expect(() => s4.parse('ab')).toThrow();

    expect(s3.parse('abcd')).toBe('abcd');
    expect(s4.parse('abcd')).toBe('abcd');
  });

  // Add tests for object, array, union, record, etc.
});
```

### 9.2 Integration Tests from OpenAPI Spec

- After generation, write integration tests that validate **round-trip behavior** for selected schemas:

```ts
// packages/openapi-zod-runtime/test/integration.test.ts
import { describe, it, expect } from 'vitest';
import { UserSchema } from '../src';

describe('UserSchema', () => {
  it('accepts valid user', () => {
    const validUser = { id: 1, name: 'Alice' };
    expect(UserSchema.parse(validUser)).toEqual(validUser);
  });

  it('rejects invalid user', () => {
    const invalidUser = { id: 'oops' };
    expect(() => UserSchema.parse(invalidUser)).toThrow();
  });
});
```

- Optionally, if you still have access to the original Zod 3 schemas, you can cross-check behavior: parse with Zod 3 and Zod 4 and compare error shapes and/or success/failure outcomes.

### 9.3 Contract Tests in Consumer Apps

In `apps/api` or `apps/web`, you can write higher-level tests that:

- Hit real endpoints (or mocks) and validate responses with the exported Zod 4 schemas.
- Ensure that your client code and server implementation stay in sync with the OpenAPI document.

## 10. Migration and Evolution

### 10.1 If `openapi-zod-client` Adds Zod 4 Support

In the future, if `openapi-zod-client` officially supports Zod 4:

1. Re-evaluate whether the internal Zod 3 usage is still present.
2. If the library begins emitting Zod 4 schemas directly, you can:
   - Temporarily keep the converter in place but no-op for Zod 4 schema inputs.
   - Gradually remove Zod 3 aliases and the converter once you are confident no Zod 3 code paths remain.
3. Consumers (apps) will remain unaffected because they depend on `@your-scope/openapi-zod-runtime` which continues exporting Zod 4 schemas.

### 10.2 If You Switch Generators Entirely

If you later move to a different generator (e.g. `typed-openapi`, Orval, or `@hey-api/openapi-ts` with a Zod v4 plugin):

1. Implement the new generator inside `openapi-zod-runtime`.
2. Adjust the generation script to produce Zod 4 schemas directly.
3. Remove `openapi-zod-client`, `zod3`, and `convertZ3ToZ4` when no longer needed.

The apps still depend solely on `@your-scope/openapi-zod-runtime`, so they require minimal (or zero) changes.

## 11. Risk Analysis and Mitigations

### 11.1 Risks

1. **Internal Zod `_def` structure changes**
   - The converter relies on `_def` and `ZodFirstPartyTypeKind`, which are not public API.
   - Future minor/patch updates to Zod 3 or 4 could tweak these internals.

2. **Library Output Shape Changes**
   - `openapi-zod-client` might change how it structures the generated schemas (e.g. new strategies for enums/unions).

3. **pnpm Resolution Edge Cases**
   - Multiple versions of `zod` in the dependency graph can sometimes cause confusing stack traces or type resolution issues.

### 11.2 Mitigations

1. **Version Pinning**
   - Pin `zod3` alias and `openapi-zod-client` versions explicitly in `package.json`.
   - Avoid auto-upgrading them without running converter tests.

2. **Comprehensive Tests**
   - Keep unit + integration tests for the converter and exported schemas.
   - Add tests for any newly observed `_def.typeName` branching.

3. **CI Contracts**
   - Integrate tests into CI so any breakage from dependency updates is caught early.

4. **Strict Boundaries**
   - Enforce at the lint level that no app imports from `"zod3"` or `"openapi-zod-client"` directly.
   - All API/schema imports must go through `@your-scope/openapi-zod-runtime`.

## 12. Summary

- We isolate the **Zod 3 / `openapi-zod-client` world** in a single `openapi-zod-runtime` workspace.
- We introduce a **Zod 3 → Zod 4 converter** based on Zod’s internal `_def` and `ZodFirstPartyTypeKind` for the subset of types produced from OpenAPI.
- We use pnpm’s **overrides** and a `zod3` alias to control which parts of the graph see which version of Zod.
- Downstream apps always consume **pure Zod 4 schemas and types**, never touching Zod 3 directly.
- The design is forward-compatible:
  - If `openapi-zod-client` adds Zod 4 support, we can progressively remove the converter.
  - If a better generator appears, we can swap it into `openapi-zod-runtime` without touching consumers.

This gives you a clear, robust path to keep your **core codebase on Zod 4** while still leveraging `openapi-zod-client` and its Zod 3 dependency in a controlled, well-tested way.
