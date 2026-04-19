import path from 'node:path';
import { minimatch } from 'minimatch';
import type { Rule, SourceCode } from 'eslint';
import type * as ESTree from 'estree';

/**
 * ESLint rule requiring a structured-observability emission in newly exported
 * async functions under `apps/**` and `packages/sdks/**`. Operationalises
 * [ADR-162 §Enforcement Mechanism #1](../../../../../docs/architecture/architectural-decisions/162-observability-first.md).
 *
 * @remarks
 * Scope is intentionally narrow in Wave 1: only `logger.*` / `Sentry.*` /
 * delegate-pattern calls count as emissions. Schema-usage detection for
 * `@oaknational/observability-events` is deferred to Wave 2, when that
 * workspace lands. Legitimate non-emission cases use the sentinel comment
 * `// observability-emission-exempt: <reason>` directly above the declaration.
 *
 * Typed as core `Rule.RuleModule` (rather than typescript-eslint's
 * `TSESLint.RuleModule`) so that the rule fits directly into
 * `Linter.Config.plugins`' `ESLint.Plugin.rules` slot without cross-toolchain
 * type friction — the richer TSESLint context shape is incompatible with the
 * core context shape by TypeScript's contravariance rules, even though both
 * refer to the same runtime object.
 *
 * The rule tracks *export declaration anchors* (ExportNamedDeclaration /
 * ExportDefaultDeclaration) rather than inner function nodes. This avoids
 * the `MaybeNamedFunctionDeclaration` subtyping issue on default exports
 * while preserving behavioural equivalence: emissions nested inside an
 * exported async function's body are found by ancestor-walking up to the
 * anchor.
 *
 * @example
 * // Invalid — exported async function in apps/** with no emission.
 * export async function doesNothing() { return 42; }
 *
 * // Valid — emits via logger.
 * export async function handleRequest() { logger.info('request'); return 42; }
 *
 * // Valid — delegate pattern.
 * export async function handle(deps) { deps.logger.info('request'); }
 *
 * // Valid — sentinel opt-out.
 * // observability-emission-exempt: pure formatter, no side effects
 * export async function pureFormatter(x) { return String(x); }
 */
/**
 * Matches absolute or repo-relative paths under an apps/* workspace's src/
 * or a packages/sdks/* workspace's src/. Uses regex (not glob) so the filter
 * is robust against ESLint's per-workspace cwd — `context.cwd` is typically
 * the workspace root, not the repo root, so a glob like `apps/*\/src/**`
 * would never match. The regex anchors on path segments.
 */
const SCOPE_PATTERNS = [
  /(?:^|\/)apps\/[^/]+\/src\//u,
  /(?:^|\/)packages\/sdks\/[^/]+\/src\//u,
] as const;
const TEST_FILE_PATTERN = '**/*.{test,unit.test,integration.test,e2e.test}.{ts,tsx,js,jsx}';

const LOGGER_VERBS = new Set<string>(['info', 'error', 'warn', 'debug', 'trace', 'fatal']);
const CAPTURE_METHODS = new Set<string>([
  'emit',
  'captureException',
  'captureMessage',
  'captureEvent',
  'captureCheckIn',
  'captureFeedback',
  'addBreadcrumb',
  // Span/tracer verbs — structural trace emission is an engineering-axis
  // observability loop per ADR-162 §Five Axes. `withSpan` is the dominant
  // emission shape in apps/oak-curriculum-mcp-streamable-http (see e.g.
  // upstream-metadata-fetch.ts `fetchUpstreamMetadata`, asset-proxy.ts
  // `proxyUpstreamAsset`). Without these, the rule false-positives on
  // legitimate trace-only emitters.
  'withSpan',
  'startSpan',
  'startActiveSpan',
  'setAttribute',
  'setAttributes',
  'recordException',
  'addEvent',
]);

const SENTINEL_PATTERN = /observability-emission-exempt:/iu;

type ExportAnchor = ESTree.ExportNamedDeclaration | ESTree.ExportDefaultDeclaration;

interface RecordedExport {
  readonly anchor: ExportAnchor;
  /** Node to report on — inner function when available, anchor otherwise. */
  readonly reportNode: ESTree.Node;
  readonly name: string;
}

function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}

function isInScope(posixPath: string): boolean {
  return SCOPE_PATTERNS.some((pattern) => pattern.test(posixPath));
}

function isTestFile(posixPath: string): boolean {
  return minimatch(posixPath, TEST_FILE_PATTERN, { dot: true, matchBase: true });
}

function isAsyncFunctionLikeType(type: string): boolean {
  return (
    type === 'FunctionDeclaration' ||
    type === 'FunctionExpression' ||
    type === 'ArrowFunctionExpression'
  );
}

function collectFromNamedExport(node: ESTree.ExportNamedDeclaration, out: RecordedExport[]): void {
  const decl = node.declaration;
  if (!decl) return;
  if (decl.type === 'FunctionDeclaration' && decl.async) {
    // @types/estree's `FunctionDeclaration.id` is `Identifier` (non-null)
    // but the default-export variant `MaybeNamedFunctionDeclaration` allows
    // null. Defensive null-guard mirrors collectFromDefaultExport below and
    // shields against any future @types/estree loosening.
    if (!decl.id) return;
    out.push({ anchor: node, reportNode: decl, name: decl.id.name });
    return;
  }
  if (decl.type === 'VariableDeclaration') {
    for (const declarator of decl.declarations) {
      const init = declarator.init;
      if (!init) continue;
      if (!isAsyncFunctionLikeType(init.type)) continue;
      if (
        (init.type === 'FunctionExpression' || init.type === 'ArrowFunctionExpression') &&
        init.async
      ) {
        const name = declarator.id.type === 'Identifier' ? declarator.id.name : '<anonymous>';
        out.push({ anchor: node, reportNode: init, name });
      }
    }
  }
}

function collectFromDefaultExport(
  node: ESTree.ExportDefaultDeclaration,
  out: RecordedExport[],
): void {
  const decl = node.declaration;
  if (decl.type === 'FunctionDeclaration' && decl.async) {
    // MaybeNamedFunctionDeclaration; id may be null when anonymous.
    const name = decl.id ? decl.id.name : '<default>';
    out.push({ anchor: node, reportNode: node, name });
    return;
  }
  if (
    (decl.type === 'FunctionExpression' || decl.type === 'ArrowFunctionExpression') &&
    decl.async
  ) {
    out.push({ anchor: node, reportNode: node, name: '<default>' });
  }
}

function memberFinalName(callee: ESTree.Expression): string | null {
  if (callee.type !== 'MemberExpression') return null;
  const prop = callee.property;
  if (prop.type !== 'Identifier') return null;
  return prop.name;
}

function memberRootName(callee: ESTree.Expression): string | null {
  if (callee.type !== 'MemberExpression') return null;
  let cursor: ESTree.Node = callee.object;
  while (cursor.type === 'MemberExpression') {
    cursor = cursor.object;
  }
  if (cursor.type === 'Identifier') return cursor.name;
  if (cursor.type === 'ThisExpression') return 'this';
  return null;
}

function isEmissionCall(node: ESTree.CallExpression): boolean {
  const callee = node.callee;

  if (callee.type === 'Identifier' && callee.name === 'log') return true;

  if (callee.type === 'MemberExpression') {
    const root = memberRootName(callee);
    const final = memberFinalName(callee);
    if (!final) return false;

    if (root === 'Sentry') return true;

    if (LOGGER_VERBS.has(final)) return true;

    if (CAPTURE_METHODS.has(final)) return true;
  }

  return false;
}

function findEnclosingAnchor(
  ancestors: readonly ESTree.Node[],
  recorded: readonly RecordedExport[],
): ExportAnchor | null {
  for (let index = ancestors.length - 1; index >= 0; index -= 1) {
    const ancestor = ancestors[index];
    if (!ancestor) continue;
    for (const record of recorded) {
      if (record.anchor === ancestor) return record.anchor;
    }
  }
  return null;
}

function hasSentinel(anchor: ESTree.Node, sourceCode: SourceCode): boolean {
  const leading = sourceCode.getCommentsBefore(anchor);
  return leading.some((comment) => SENTINEL_PATTERN.test(comment.value));
}

const requireObservabilityEmissionRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Require a structured-observability emission in newly exported async functions per ADR-162.',
    },
    schema: [],
    messages: {
      requireEmission:
        'Exported async function "{{name}}" has no observability emission. Per ADR-162, every runtime capability emits structured events. Add a logger.*, Sentry.*, or delegate-pattern emission, or tag with `// observability-emission-exempt: <reason>`.',
    },
  },
  create(context) {
    const rawFilename = context.physicalFilename ?? context.filename;
    if (!rawFilename) return {};
    const posixPath = toPosix(rawFilename);
    if (!isInScope(posixPath) || isTestFile(posixPath)) return {};

    const recorded: RecordedExport[] = [];
    const emitted = new WeakSet<ExportAnchor>();

    return {
      ExportNamedDeclaration(node) {
        collectFromNamedExport(node, recorded);
      },
      ExportDefaultDeclaration(node) {
        collectFromDefaultExport(node, recorded);
      },
      CallExpression(node) {
        if (!isEmissionCall(node)) return;
        const ancestors = context.sourceCode.getAncestors(node);
        const anchor = findEnclosingAnchor(ancestors, recorded);
        if (anchor) emitted.add(anchor);
      },
      'Program:exit'() {
        for (const record of recorded) {
          if (emitted.has(record.anchor)) continue;
          if (hasSentinel(record.anchor, context.sourceCode)) continue;
          context.report({
            node: record.reportNode,
            messageId: 'requireEmission',
            data: { name: record.name },
          });
        }
      },
    };
  },
};

export { requireObservabilityEmissionRule };
