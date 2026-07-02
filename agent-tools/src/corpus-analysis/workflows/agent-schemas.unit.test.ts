import { describe, expect, it } from 'vitest';

import type { DerivedJsonSchema } from './agent-schemas.js';
import { deriveAgentJsonSchemas } from './agent-schemas.js';

/**
 * The agent-call JSON Schemas are DERIVED from the zod SSOT at build time and inlined
 * into the sandbox artefacts — zod never enters the bundle, and drift between the zod
 * contract and what an agent is asked to emit is impossible rather than detected. These
 * tests pin the derived shape the harness `agent()` schema parameter requires: fully
 * inlined (no `$ref`/`$defs`/`$schema`), strict objects everywhere, exact enums.
 */

/** `Array.isArray` typed to also narrow readonly arrays out of a union's else-branch. */
function isReadonlyArray(value: unknown): value is readonly unknown[] {
  return Array.isArray(value);
}

/**
 * Narrow a JSON Schema position to a schema object. The spec (and zod's types) allow
 * `true`/`false` and arrays in schema positions; our derived schemas never use them,
 * so non-objects simply do not contribute nodes. Union narrowing only — no assertions.
 */
function asSchemaObject(
  value: DerivedJsonSchema | boolean | readonly (DerivedJsonSchema | boolean)[] | undefined,
): DerivedJsonSchema | undefined {
  if (typeof value !== 'object' || isReadonlyArray(value)) {
    return undefined;
  }
  return value;
}

/** Walk a derived schema's typed object graph, collecting every schema node. */
function collectNodes(
  schema: DerivedJsonSchema,
  out: DerivedJsonSchema[] = [],
): DerivedJsonSchema[] {
  out.push(schema);
  for (const property of Object.values(schema.properties ?? {})) {
    const node = asSchemaObject(property);
    if (node) {
      collectNodes(node, out);
    }
  }
  const items = asSchemaObject(schema.items);
  if (items) {
    collectNodes(items, out);
  }
  return out;
}

/** The schema object at a named property of a node, e.g. the category enum schema. */
function propertySchema(
  node: DerivedJsonSchema | undefined,
  name: string,
): DerivedJsonSchema | undefined {
  return asSchemaObject(node?.properties?.[name]);
}

/** The node that declares a named property, e.g. the leaf object inside the leaves array. */
function nodeWithProperty(schema: DerivedJsonSchema, name: string): DerivedJsonSchema | undefined {
  return collectNodes(schema).find((candidate) => candidate.properties?.[name] !== undefined);
}

const byAlpha = (a: string, b: string): number => a.localeCompare(b);

const schemas = deriveAgentJsonSchemas();
const allNodes = Object.values(schemas).flatMap((schema) => collectNodes(schema));

describe('deriveAgentJsonSchemas — sandbox-inlinable shape', () => {
  it('derives all four stage agent schemas', () => {
    expect(Object.keys(schemas).sort(byAlpha)).toEqual([
      'candidateStage',
      'leafStage',
      'metaStage',
      'voterJudgment',
    ]);
  });

  it('contains no $schema, $defs, or $ref anywhere (fully inlined for the harness)', () => {
    expect(JSON.stringify(schemas)).not.toMatch(/"\$(?:schema|defs|ref)"\s*:/);
  });

  it('declares additionalProperties false on every object node (strict everywhere)', () => {
    const objectNodes = allNodes.filter((node) => node.type === 'object');
    expect(objectNodes.length).toBeGreaterThan(0);
    for (const node of objectNodes) {
      expect(node.additionalProperties).toBe(false);
    }
  });
});

describe('leafStage (map agent contract)', () => {
  const leaf = nodeWithProperty(schemas.leafStage, 'category');

  it('requires exactly the leaf fields', () => {
    expect(schemas.leafStage.required).toEqual(['leaves']);
    expect([...(leaf?.required ?? [])].sort(byAlpha)).toEqual([
      'category',
      'confidence',
      'grounding',
      'id',
      'statement',
      'window',
    ]);
  });

  it('pins the category and confidence enums in order', () => {
    expect(propertySchema(leaf, 'category')?.enum).toEqual([
      'motif',
      'surprise',
      'tension',
      'shift',
      'behavioural-reflex',
    ]);
    expect(propertySchema(leaf, 'confidence')?.enum).toEqual(['low', 'med', 'high']);
  });

  it('keeps the grounding minItems: 1 floor', () => {
    expect(propertySchema(leaf, 'grounding')?.minItems).toBe(1);
  });
});

describe('candidateStage (reduce agent contract)', () => {
  const candidate = nodeWithProperty(schemas.candidateStage, 'kind');

  it('pins the pattern-kind enum in order', () => {
    expect(propertySchema(candidate, 'kind')?.enum).toEqual([
      'recurrence',
      'trajectory',
      'relational-lagged',
      'regime',
      'distributional',
      'behavioural',
      'absence',
      'meta',
    ]);
  });

  it('keeps groundingCount an integer with a zero floor (never widened to number)', () => {
    expect(propertySchema(candidate, 'groundingCount')?.type).toBe('integer');
    expect(propertySchema(candidate, 'groundingCount')?.minimum).toBe(0);
  });
});

describe('voterJudgment (adversary agent contract)', () => {
  it('has no lens property — the orchestrator attaches the lens, the agent never emits it', () => {
    const expected = ['baseRateHolds', 'grounded', 'importance', 'notArtefact', 'survivesNull'];
    expect(Object.keys(schemas.voterJudgment.properties ?? {}).sort(byAlpha)).toEqual(expected);
    expect([...(schemas.voterJudgment.required ?? [])].sort(byAlpha)).toEqual(expected);
  });
});

describe('metaStage (meta agent contract)', () => {
  it('requires all four envelope fields including corroborationClaims', () => {
    expect([...(schemas.metaStage.required ?? [])].sort(byAlpha)).toEqual([
      'corroborationClaims',
      'discountNote',
      'recallMatches',
      'synthesisNotes',
    ]);
  });

  it('pins the recall verdict enum in order and keeps matchedCandidateId optional', () => {
    const match = nodeWithProperty(schemas.metaStage, 'verdict');
    expect(propertySchema(match, 'verdict')?.enum).toEqual([
      'subsumes',
      'refines',
      'equal',
      'partial',
      'missed',
    ]);
    expect(match?.required).not.toContain('matchedCandidateId');
  });
});
