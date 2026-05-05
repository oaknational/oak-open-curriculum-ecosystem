import path from 'node:path';
import { minimatch } from 'minimatch';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

/**
 * ESLint rule banning real IO in test files.
 *
 * @remarks
 * Tests must use injected fakes per ADR-078 (dependency injection for
 * testability). Real IO surfaces — filesystem, child processes, worker
 * threads, network sockets, the live `process` global, and non-localhost
 * `fetch` — must not appear in `*.test.ts` / `*.spec.ts` files outside the
 * structural path-shape allowlist.
 *
 * Detection covers all import forms (static `ImportDeclaration`, dynamic
 * `await import(...)`, and CommonJS `require(...)`) for both unprefixed
 * (`fs`) and `node:`-prefixed (`node:fs`) specifiers. The `process` global
 * is matched directly (no import to track). `fetch` calls report unless
 * the first argument is a string literal beginning with one of the
 * permitted localhost prefixes; non-literal arguments cannot be verified
 * statically and report as well.
 *
 * The structural allowlist is hardcoded into the rule because the
 * directory shapes (`**\/test-helpers/**`, `**\/test-fakes/**`) and the
 * Vitest config files (`vitest.config.ts`, `vitest.*.config.ts`,
 * `vitest.setup.ts`) are stable repo-wide contracts. Per-config additions
 * (a frozen historical-violation inventory at branch-merge time) flow in
 * via the `allowlistPathShapes` option.
 *
 * Type-only imports (`import type { Stats } from 'node:fs'`) do not
 * execute IO and are not reported.
 *
 * @example
 * // Invalid — banned static import in a *.test.ts file outside the allowlist.
 * import { readFileSync } from 'node:fs';
 *
 * // Invalid — process.env access in a test.
 * const apiKey = process.env.API_KEY;
 *
 * // Valid — same import inside a test-helpers/ directory.
 * import { readFileSync } from 'node:fs';
 *
 * // Valid — fetch with a literal localhost URL.
 * await fetch('http://localhost:3333/health');
 */

type MessageId =
  | 'bannedModuleStaticImport'
  | 'bannedModuleDynamicImport'
  | 'bannedModuleRequire'
  | 'processEnvAccess'
  | 'processCwdCall'
  | 'processChdirCall'
  | 'fetchNonLocalhost'
  | 'fetchNonLiteralArg';

/**
 * Options accepted by the `no-real-io-in-tests` rule.
 *
 * @remarks
 * Exported so the rule's type signature can be named externally by the
 * plugin re-export chain.
 */
export interface NoRealIoInTestsOptions {
  /**
   * Per-config additional allowlist path-shape patterns (minimatch globs).
   *
   * @remarks
   * The historical real-IO inventory is frozen into this option as a
   * path snapshot at branch-merge time. The structural defaults
   * (`**\/test-helpers/**`, `**\/test-fakes/**`, `vitest.config.ts`,
   * `vitest.*.config.ts`, `vitest.setup.ts`) are hardcoded and are not
   * removable through this option.
   */
  readonly allowlistPathShapes?: readonly string[];
}

const BANNED_MODULE_SPECIFIERS = new Set<string>([
  'fs',
  'node:fs',
  'fs/promises',
  'node:fs/promises',
  'child_process',
  'node:child_process',
  'worker_threads',
  'node:worker_threads',
  'http',
  'node:http',
  'https',
  'node:https',
  'net',
  'node:net',
  'dgram',
  'node:dgram',
]);

/*
 * Structural allowlist: paths whose shape signals "this file is a fake,
 * helper, or test infrastructure surface where real IO is acceptable".
 *
 * The Vitest config patterns (`vitest.config.ts`, `vitest.*.config.ts`,
 * `vitest.setup.ts`) are defence-in-depth: at the current TEST_FILE_PATTERN
 * those filenames do not match the rule's trigger glob, so the rule
 * never fires on them anyway. Keeping the patterns ensures the allowlist
 * remains correct if the trigger glob is ever widened (e.g. to lint setup
 * files for a different real-IO surface) without re-introducing false
 * positives on Vitest configuration.
 */
const STRUCTURAL_ALLOWLIST_PATTERNS: readonly string[] = [
  '**/test-helpers/**',
  '**/test-fakes/**',
  '**/vitest.config.ts',
  '**/vitest.*.config.ts',
  '**/vitest.setup.ts',
];

const TEST_FILE_PATTERN =
  '**/*.{test,unit.test,integration.test,e2e.test,spec}.{ts,tsx,js,jsx,mts,cts}';

const FETCH_LOCALHOST_PREFIXES: readonly string[] = [
  'http://localhost',
  'https://localhost',
  'http://127.0.0.1',
  'https://127.0.0.1',
];

function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}

function isTestFile(posixPath: string): boolean {
  return minimatch(posixPath, TEST_FILE_PATTERN, { dot: true, matchBase: false });
}

function matchesAnyPattern(posixPath: string, patterns: readonly string[]): boolean {
  return patterns.some((pattern) => minimatch(posixPath, pattern, { dot: true }));
}

function isAllowlistedPath(posixPath: string, configuredAllowlist: readonly string[]): boolean {
  if (matchesAnyPattern(posixPath, STRUCTURAL_ALLOWLIST_PATTERNS)) return true;
  return matchesAnyPattern(posixPath, configuredAllowlist);
}

function isBannedSpecifier(value: string): boolean {
  return BANNED_MODULE_SPECIFIERS.has(value);
}

function isLocalhostFetchLiteral(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      FETCH_LOCALHOST_PREFIXES.some((prefix) => value.startsWith(prefix)) &&
      (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
    );
  } catch {
    return false;
  }
}

function isPropertyNamed(property: TSESTree.Node, expected: string): boolean {
  if (property.type === 'Identifier') return property.name === expected;
  if (property.type === 'Literal') return property.value === expected;
  return false;
}

function isProcessIdentifier(node: TSESTree.Node): boolean {
  if (node.type === 'Identifier' && node.name === 'process') return true;
  if (node.type === 'MemberExpression') {
    const object = node.object;
    if (
      object.type !== 'Identifier' ||
      (object.name !== 'globalThis' && object.name !== 'global')
    ) {
      return false;
    }
    return isPropertyNamed(node.property, 'process');
  }
  return false;
}

const noRealIoInTestsRule: TSESLint.RuleModule<MessageId, [NoRealIoInTestsOptions?]> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ban real IO in test files. Tests must inject fakes per ADR-078; real fs / child_process / worker_threads / network / process / non-localhost fetch are forbidden in *.test.ts and *.spec.ts files outside the structural path-shape allowlist.',
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          allowlistPathShapes: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    ],
    messages: {
      bannedModuleStaticImport:
        'Real-IO module "{{specifier}}" must not be imported in test files. Inject a fake from a test-helpers/ or test-fakes/ surface instead. See .agent/rules/test-immediate-fails.md and ADR-078.',
      bannedModuleDynamicImport:
        'Real-IO module "{{specifier}}" must not be dynamically imported in test files. Inject a fake from a test-helpers/ or test-fakes/ surface instead. See .agent/rules/test-immediate-fails.md and ADR-078.',
      bannedModuleRequire:
        'Real-IO module "{{specifier}}" must not be required in test files. Inject a fake from a test-helpers/ or test-fakes/ surface instead. See .agent/rules/test-immediate-fails.md and ADR-078.',
      processEnvAccess:
        'Tests must not read or write process.env. Pass literal inputs via dependency injection (ADR-078). See .agent/rules/test-immediate-fails.md.',
      processCwdCall:
        'Tests must not call process.cwd(). Anchor paths at import.meta.dirname or inject a path resolver. See .agent/rules/test-immediate-fails.md.',
      processChdirCall:
        'Tests must not call process.chdir(). Mutating the working directory is shared global state forbidden by ADR-078. See .agent/rules/test-immediate-fails.md.',
      fetchNonLocalhost:
        'Tests must not call fetch() against non-localhost URLs. Allowed prefixes: http(s)://localhost, http(s)://127.0.0.1. Inject a fake fetch or use MSW for HTTP fakes.',
      fetchNonLiteralArg:
        'Tests must call fetch() with a string literal targeting localhost. A non-literal first argument cannot be verified statically; refactor to inject a fake fetch or pass a literal URL.',
    },
  },
  defaultOptions: [{}],

  create(context) {
    const rawFilename = context.physicalFilename ?? context.filename;
    if (!rawFilename) return {};
    const posixPath = toPosix(rawFilename);
    if (!isTestFile(posixPath)) return {};

    const options = context.options[0] ?? {};
    const configuredAllowlist = options.allowlistPathShapes ?? [];
    if (isAllowlistedPath(posixPath, configuredAllowlist)) return {};

    function reportBannedStaticImport(node: TSESTree.Node, specifier: string): void {
      context.report({
        node,
        messageId: 'bannedModuleStaticImport',
        data: { specifier },
      });
    }

    function reportBannedDynamicImport(node: TSESTree.Node, specifier: string): void {
      context.report({
        node,
        messageId: 'bannedModuleDynamicImport',
        data: { specifier },
      });
    }

    function reportBannedRequire(node: TSESTree.Node, specifier: string): void {
      context.report({
        node,
        messageId: 'bannedModuleRequire',
        data: { specifier },
      });
    }

    function reportFetchCall(node: TSESTree.CallExpression): void {
      const firstArg = node.arguments[0];
      if (firstArg === undefined) {
        context.report({ node, messageId: 'fetchNonLiteralArg' });
        return;
      }
      if (firstArg.type !== 'Literal' || typeof firstArg.value !== 'string') {
        context.report({ node, messageId: 'fetchNonLiteralArg' });
        return;
      }
      if (!isLocalhostFetchLiteral(firstArg.value)) {
        context.report({ node, messageId: 'fetchNonLocalhost' });
      }
    }

    function handleRequireCall(node: TSESTree.CallExpression): boolean {
      const callee = node.callee;
      if (callee.type !== 'Identifier' || callee.name !== 'require') return false;

      const arg = node.arguments[0];
      if (
        arg?.type === 'Literal' &&
        typeof arg.value === 'string' &&
        isBannedSpecifier(arg.value)
      ) {
        reportBannedRequire(node, arg.value);
      }
      return true;
    }

    function handleProcessMethodCall(node: TSESTree.CallExpression): void {
      const callee = node.callee;
      if (callee.type !== 'MemberExpression') return;

      const object = callee.object;
      const property = callee.property;
      if (!isProcessIdentifier(object)) return;
      if (isPropertyNamed(property, 'cwd')) {
        context.report({ node, messageId: 'processCwdCall' });
        return;
      }
      if (isPropertyNamed(property, 'chdir')) {
        context.report({ node, messageId: 'processChdirCall' });
      }
    }

    return {
      ImportDeclaration(node) {
        // Type-only imports compile away and never execute IO; skip.
        if (node.importKind === 'type') return;
        const specifier = node.source.value;
        if (typeof specifier !== 'string') return;
        if (!isBannedSpecifier(specifier)) return;
        // If every named import is type-only, treat as a type-only import.
        if (
          node.specifiers.length > 0 &&
          node.specifiers.every(
            (spec) => spec.type === 'ImportSpecifier' && spec.importKind === 'type',
          )
        ) {
          return;
        }
        reportBannedStaticImport(node, specifier);
      },

      ImportExpression(node) {
        const source = node.source;
        if (source.type !== 'Literal') return;
        if (typeof source.value !== 'string') return;
        if (!isBannedSpecifier(source.value)) return;
        reportBannedDynamicImport(node, source.value);
      },

      CallExpression(node) {
        const callee = node.callee;

        if (handleRequireCall(node)) {
          return;
        }

        // Bare fetch(...) — global. Member-expression fetches (e.g.
        // window.fetch) are not in scope; the rule targets the global form.
        if (callee.type === 'Identifier' && callee.name === 'fetch') {
          reportFetchCall(node);
          return;
        }

        // process.cwd() / process.chdir() and globalThis.process.cwd() etc.
        // Bracket-notation forms (process['cwd']()) are caught via
        // `isPropertyNamed`, which accepts both Identifier and Literal.
        handleProcessMethodCall(node);
      },

      MemberExpression(node) {
        // process.env.X — the inner MemberExpression `process.env` is the
        // surface the rule targets. The outer .X access is a consequence.
        // Bracket-notation forms (process['env']) are caught via
        // `isPropertyNamed`, which accepts both Identifier and Literal.
        if (!isPropertyNamed(node.property, 'env')) return;
        if (!isProcessIdentifier(node.object)) return;
        context.report({ node, messageId: 'processEnvAccess' });
      },
    };
  },
};

export { noRealIoInTestsRule };
