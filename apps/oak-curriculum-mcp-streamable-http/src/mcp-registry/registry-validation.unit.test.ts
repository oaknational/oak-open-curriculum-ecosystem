import { describe, expect, it } from 'vitest';
import { unwrap, unwrapErr } from '@oaknational/result';
import {
  describeValidationFailure,
  describeValidationRejection,
  readServedResource,
  readValidationVerdict,
} from './registry-validation.js';

describe('readValidationVerdict', () => {
  it('reads the acceptance the live registry returns for a well-formed document', () => {
    // The exact body observed from POST /v0.1/validate on 2026-09-09.
    expect(unwrap(readValidationVerdict({ valid: true, issues: [] }))).toEqual({
      valid: true,
      issues: [],
    });
  });

  it('reads a rejection with its issues', () => {
    // Also observed: an http:// remote returns exactly this shape.
    const verdict = unwrap(
      readValidationVerdict({
        valid: false,
        issues: [
          {
            type: 'semantic',
            path: 'remotes[0].url',
            message: 'invalid remote URL: http://mcp.thenational.academy/mcp',
            severity: 'error',
            reference: 'invalid-remote-url',
          },
        ],
      }),
    );

    expect(verdict.valid).toBe(false);
    expect(verdict.issues[0]?.path).toBe('remotes[0].url');
    expect(verdict.issues[0]?.reference).toBe('invalid-remote-url');
  });

  it('treats a missing issues array as no issues', () => {
    expect(unwrap(readValidationVerdict({ valid: true })).issues).toEqual([]);
  });

  it.each([
    { shape: 'a body with no verdict', body: { issues: [] } },
    { shape: 'a non-object body', body: 'ok' },
    { shape: 'a null body', body: null },
    { shape: 'a non-boolean verdict', body: { valid: 'yes' } },
    { shape: 'issues that are not a list', body: { valid: false, issues: 'lots' } },
  ])('refuses $shape rather than reading it as a pass', ({ body }) => {
    expect(unwrapErr(readValidationVerdict(body))).toContain('expected shape');
  });
});

describe('describeValidationFailure', () => {
  it('says nothing when the registry accepted the document', () => {
    expect(describeValidationFailure({ valid: true, issues: [] })).toBeUndefined();
  });

  it('names every issue when the registry rejected it', () => {
    const message = describeValidationFailure({
      valid: false,
      issues: [
        { severity: 'error', path: 'body.description', message: 'expected length <= 100' },
        { severity: 'warning', path: '$schema', message: 'schema-version-deprecated' },
      ],
    });

    expect(message).toContain('expected length <= 100');
    expect(message).toContain('schema-version-deprecated');
  });

  it('still fails loudly when a rejection names no issue', () => {
    expect(describeValidationFailure({ valid: false, issues: [] })).toContain('without naming');
  });
});

describe('describeValidationRejection', () => {
  // The exact bodies POST /v0.1/validate returned on 2026-09-10 against build
  // 1.8.1. Both are problem details, and neither carries a `valid` field —
  // which is why the status is read before the body is treated as a verdict.
  it('names the field the registry rejected, for a description over the cap', () => {
    const message = describeValidationRejection(422, {
      title: 'Unprocessable Entity',
      status: 422,
      detail: 'validation failed',
      errors: [{ message: 'expected length <= 100', location: 'body.description' }],
    });

    expect(message).toContain('HTTP 422');
    expect(message).toContain('body.description');
    expect(message).toContain('expected length <= 100');
  });

  it('names the missing property, for an omitted $schema', () => {
    const message = describeValidationRejection(422, {
      title: 'Unprocessable Entity',
      status: 422,
      detail: 'validation failed',
      errors: [{ message: 'expected required property $schema to be present', location: 'body' }],
    });

    expect(message).toContain('expected required property $schema to be present');
  });

  it('falls back to the summary when the body names no field', () => {
    expect(
      describeValidationRejection(400, { title: 'Bad Request', detail: 'validation failed' }),
    ).toContain('validation failed');
  });

  it('still reports the status when the body is not readable at all', () => {
    const message = describeValidationRejection(502, undefined);

    expect(message).toContain('HTTP 502');
    expect(message).toContain('no readable explanation');
  });
});

describe('readServedResource', () => {
  it('reads the resource the deployment publishes for itself', () => {
    // The exact body served by mcp.thenational.academy on 2026-09-09.
    expect(
      unwrap(
        readServedResource({
          resource: 'https://mcp.thenational.academy/mcp',
          authorization_servers: ['https://clerk.thenational.academy'],
          scopes_supported: ['email'],
        }),
      ),
    ).toBe('https://mcp.thenational.academy/mcp');
  });

  it.each([
    { shape: 'metadata with no resource', body: { authorization_servers: [] } },
    { shape: 'a non-string resource', body: { resource: 42 } },
    { shape: 'a non-object body', body: 'https://mcp.thenational.academy/mcp' },
  ])('refuses $shape', ({ body }) => {
    expect(unwrapErr(readServedResource(body))).toContain("no string 'resource'");
  });
});
