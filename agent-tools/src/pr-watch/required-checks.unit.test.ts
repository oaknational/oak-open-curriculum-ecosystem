import { describe, expect, it } from 'vitest';

import { isBranchName, parseRequiredChecks } from './required-checks.js';

describe('parseRequiredChecks', () => {
  it('names the contexts of every required_status_checks rule and no other rule', () => {
    const required = parseRequiredChecks([
      { type: 'deletion' },
      { type: 'pull_request', parameters: { required_approving_review_count: 0 } },
      {
        type: 'required_status_checks',
        parameters: {
          required_status_checks: [{ context: 'run-quality-gates' }, { context: 'CodeQL' }],
          strict_required_status_checks_policy: false,
        },
      },
    ]);

    expect(required).toStrictEqual({ ok: true, value: ['run-quality-gates', 'CodeQL'] });
  });

  it('reads an unprotected branch as requiring nothing, and refuses a body that is not a rules list', () => {
    expect(parseRequiredChecks([])).toStrictEqual({ ok: true, value: [] });
    expect(parseRequiredChecks({ message: 'Not Found' }).ok).toBe(false);
  });

  it('refuses a required_deployments rule, a blocking gate this reader does not read, naming it', () => {
    const parsed = parseRequiredChecks([
      { type: 'deletion' },
      {
        type: 'required_deployments',
        parameters: { required_deployment_environments: ['production'] },
      },
      {
        type: 'required_status_checks',
        parameters: { required_status_checks: [{ context: 'CodeQL' }] },
      },
    ]);

    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.error.message).toContain('required_deployments rule at index 1');
    }
  });

  it.each([
    ['no parameters', { type: 'required_status_checks' }],
    ['no contexts list', { type: 'required_status_checks', parameters: {} }],
    [
      'an empty contexts list',
      { type: 'required_status_checks', parameters: { required_status_checks: [] } },
    ],
    [
      'a nameless context',
      { type: 'required_status_checks', parameters: { required_status_checks: [{ context: '' }] } },
    ],
  ])(
    'refuses a required_status_checks rule carrying %s, naming the rule, never reading it as requiring nothing',
    (shape, rule) => {
      const parsed = parseRequiredChecks([{ type: 'deletion' }, rule]);

      expect(parsed.ok, shape).toBe(false);
      if (!parsed.ok) {
        expect(parsed.error.message).toContain('required_status_checks rule at index 1');
      }
    },
  );
});

describe('isBranchName', () => {
  it('accepts plain branch names and refuses traversal or a leading separator', () => {
    expect(isBranchName('main')).toBe(true);
    expect(isBranchName('coordination/2026-10-10-f436b6')).toBe(true);
    expect(isBranchName('../main')).toBe(false);
    expect(isBranchName('/main')).toBe(false);
    expect(isBranchName('main..x')).toBe(false);
    expect(isBranchName('')).toBe(false);
  });
});
