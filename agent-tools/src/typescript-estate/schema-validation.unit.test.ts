import { describe, expect, it } from 'vitest';

import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { compileStrictSchema } from './schema-validation.js';

const SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  additionalProperties: false,
  required: ['frozenAt', 'count'],
  properties: {
    frozenAt: { type: 'string', format: 'date-time' },
    count: { type: 'integer', minimum: 0 },
  },
} as const;

describe('compileStrictSchema', () => {
  it('parses a value accepted by the injected strict schema', () => {
    const validator = unwrapOrThrow(
      compileStrictSchema<{ readonly count: number }>(SCHEMA, 'fixture'),
    );

    expect(
      unwrapOrThrow(validator.parse('{"frozenAt":"2026-08-02T20:00:00Z","count":2}')),
    ).toMatchObject({ count: 2 });
  });

  it('reports every rejected site without reading a repository schema', () => {
    const validator = unwrapOrThrow(compileStrictSchema(SCHEMA, 'fixture'));
    const error = unwrapErr(validator.validate({ frozenAt: 'not-a-date', count: -1, extra: true }));

    expect(error.message).toMatch(
      /fixture failed schema validation.*additional properties.*date-time.*must be >= 0/u,
    );
  });

  it('refuses malformed JSON through the typed configuration failure', () => {
    const validator = unwrapOrThrow(compileStrictSchema(SCHEMA, 'fixture'));
    const error = unwrapErr(validator.parse('{'));

    expect(error.message).toContain('fixture is not valid JSON');
  });
});
