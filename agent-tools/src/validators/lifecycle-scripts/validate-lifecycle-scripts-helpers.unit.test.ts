import { describe, expect, it } from 'vitest';

import {
  findLifecycleScriptViolations,
  SCANNED_LIFECYCLE_HOOKS,
} from './validate-lifecycle-scripts-helpers.js';

describe('findLifecycleScriptViolations', () => {
  it('returns no violations for the canonical clean lifecycle scripts', () => {
    const scripts = {
      prepare: 'husky',
      postinstall: 'tsx agent-tools/src/bootstrap/bootstrap.ts',
    };

    expect(findLifecycleScriptViolations(scripts)).toStrictEqual([]);
  });

  it('returns no violations for an empty scripts object', () => {
    expect(findLifecycleScriptViolations({})).toStrictEqual([]);
  });

  it.each([
    { term: 'turbo', script: 'turbo run build --filter=@oaknational/agent-tools' },
    { term: 'pnpm', script: 'pnpm --filter @oaknational/agent-tools build' },
    { term: 'pnpx', script: 'pnpx some-tool' },
    { term: 'npm', script: 'npm run build' },
    { term: 'npx', script: 'npx turbo build' },
    { term: 'yarn', script: 'yarn build' },
  ])('flags `$term` in a lifecycle hook (postinstall)', ({ term, script }) => {
    const violations = findLifecycleScriptViolations({ postinstall: script });

    expect(violations).toContainEqual({ hook: 'postinstall', script, term });
  });

  it('does NOT scan non-lifecycle scripts (a normal `build` may use turbo)', () => {
    const scripts = {
      build: 'turbo run --continue build',
      test: 'turbo run --continue test',
      postinstall: 'tsx agent-tools/src/bootstrap/bootstrap.ts',
    };

    expect(findLifecycleScriptViolations(scripts)).toStrictEqual([]);
  });

  it('does not false-match `npm` inside `pnpm`', () => {
    const violations = findLifecycleScriptViolations({ postinstall: 'pnpm install' });

    expect(violations).toStrictEqual([
      { hook: 'postinstall', script: 'pnpm install', term: 'pnpm' },
    ]);
  });

  it('flags violations across every scanned lifecycle hook', () => {
    const scripts = Object.fromEntries(
      SCANNED_LIFECYCLE_HOOKS.map((hook) => [hook, 'turbo run x']),
    );

    const violations = findLifecycleScriptViolations(scripts);

    expect(violations).toHaveLength(SCANNED_LIFECYCLE_HOOKS.length);
    expect(violations.every((violation) => violation.term === 'turbo')).toBe(true);
  });

  it('reports one violation per matched term and orders by hook then term', () => {
    const scripts = {
      postinstall: 'pnpm dlx turbo run build',
      prepare: 'husky',
    };

    expect(findLifecycleScriptViolations(scripts)).toStrictEqual([
      { hook: 'postinstall', script: 'pnpm dlx turbo run build', term: 'pnpm' },
      { hook: 'postinstall', script: 'pnpm dlx turbo run build', term: 'turbo' },
    ]);
  });
});
