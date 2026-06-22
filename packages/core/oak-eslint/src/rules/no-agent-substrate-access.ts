import path from 'node:path';
import type { TSESTree } from '@typescript-eslint/utils';

import { createMessage, type RuleWithReappraisingMessages } from '../reappraising-message.js';

/**
 * ESLint rule enforcing the architectural boundary around the `.agent/`
 * knowledge substrate.
 *
 * @remarks
 * `.agent/` is the agent operating substrate — plans, memory, rules,
 * sub-agents, state, reports, practice-core. It is shared, mutable,
 * relocatable knowledge, NOT application data and NOT a runtime input.
 * Application code (apps/, packages/) sits outside that substrate's
 * dependency surface and must never read from it: code coupled to the
 * substrate asserts configuration instead of proving behaviour and goes
 * stale the moment the substrate moves (worked instance: a gap-ledger test
 * read a plan JSON via `readFileSync` and silently broke when a plan-estate
 * relocation moved the file).
 *
 * This is an architectural boundary that happens to apply to tests, not a
 * test-hygiene rule — it fires on product and test code alike. The sole
 * sanctioned substrate operator is `agent-tools/` (the tooling whose job IS
 * to manage `.agent/`); files under `agent-tools/` are exempt. There is no
 * per-path allowlist: the prohibition is absolute (owner doctrine
 * 2026-06-22).
 *
 * Detection is deliberately narrow to avoid false positives on the many
 * legitimate non-read mentions of `.agent/` (citation assertions, arg-parser
 * inputs, doc strings). A string or template literal whose value contains a
 * `.agent/` path segment is reported only when it is:
 *
 * - an argument to `new URL(...)` (the global URL constructor); or
 * - an argument to a **filesystem read call bound to a `node:fs` import** —
 *   either a named import called bare (`readFileSync('.agent/…')` where
 *   `readFileSync` was imported from `node:fs`/`node:fs/promises`) or a
 *   member call on an fs namespace/default binding (`fs.readFileSync('.agent/…')`,
 *   `fsp.readFile('.agent/…')`).
 *
 * The fs-import binding requirement is load-bearing: it is what distinguishes
 * `fs.open('.agent/…')` (a real substrate read — reported) from
 * `window.open('.agent/…')` / `db.open('.agent/…')` (an unrelated method that
 * merely shares a generic name — NOT reported). Matching on the callee name
 * alone would false-positive on those.
 *
 * @example
 * // Invalid — reading the substrate from application code.
 * import { readFileSync } from 'node:fs';
 * const ledger = readFileSync('.agent/plans/x/field-gap-ledger.json', 'utf8');
 *
 * // Invalid — constructing a substrate URL to read.
 * const u = new URL('.agent/state/active-claims.json', import.meta.url);
 *
 * // Valid — a `.agent/` string asserted as data, not read.
 * expect(citation).toBe('.agent/rules/never-disable-checks.md');
 *
 * // Valid — a generic `.open()` on a non-fs receiver.
 * window.open('.agent/rules/index.md');
 *
 * // Valid — agent-tools (the substrate operator) is exempt.
 */

type MessageId = 'agentSubstrateRead' | 'agentSubstrateUrl';

const AGENT_SUBSTRATE_SEGMENT = /(?:^|\/)\.agent\//u;

// Module specifiers whose imports bind the Node filesystem API.
const FS_MODULE_SOURCES = new Set<string>(['fs', 'node:fs', 'fs/promises', 'node:fs/promises']);

/*
 * Filesystem read entry points. A read is reported only when the call binds to
 * one of these names AND the binding traces to a `node:fs` import (see the
 * fs-import tracking in `create`). Write entry points are intentionally out of
 * scope — the doctrine governs reading the substrate.
 */
const FS_READ_FUNCTIONS = new Set<string>([
  'readFileSync',
  'readFile',
  'readdirSync',
  'readdir',
  'opendirSync',
  'opendir',
  'existsSync',
  'statSync',
  'stat',
  'lstatSync',
  'lstat',
  'accessSync',
  'access',
  'createReadStream',
  'openSync',
  'open',
  'realpathSync',
  'realpath',
  'readlinkSync',
  'readlink',
]);

function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}

function isExemptOperatorPath(posixPath: string): boolean {
  // agent-tools/ is the only sanctioned operator of the `.agent/` substrate.
  // ESLint supplies the absolute physical path, so a `/agent-tools/` segment is
  // the production signal (the prior `startsWith('agent-tools/')` branch only
  // matched a relative path the file engine never produces).
  return posixPath.includes('/agent-tools/');
}

function literalReferencesSubstrate(node: TSESTree.Node): boolean {
  if (node.type === 'Literal') {
    return typeof node.value === 'string' && AGENT_SUBSTRATE_SEGMENT.test(node.value);
  }
  if (node.type === 'TemplateLiteral') {
    return node.quasis.some(
      (quasi) =>
        typeof quasi.value.cooked === 'string' && AGENT_SUBSTRATE_SEGMENT.test(quasi.value.cooked),
    );
  }
  return false;
}

function anyArgReferencesSubstrate(args: readonly TSESTree.CallExpressionArgument[]): boolean {
  return args.some((arg) => literalReferencesSubstrate(arg));
}

const noAgentSubstrateAccessRule: RuleWithReappraisingMessages<MessageId> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Forbid application code from reading the `.agent/` knowledge substrate. `.agent/` is the agent operating substrate, outside the application dependency boundary; only agent-tools/ may operate on it. Absolute, no allowlist.',
    },
    schema: [],
    messages: {
      agentSubstrateRead: createMessage({
        prohibition:
          'Application code must not read the `.agent/` knowledge substrate (path literal "{{path}}").',
        reappraisal:
          'The `.agent/` tree is shared, mutable, relocatable agent knowledge, not application input — reading it asserts configuration instead of proving behaviour. Build fixture data in the workspace itself (e.g. a mkdtemp fixture); only agent-tools/ operates on the substrate. See .agent/directives/testing-strategy.md.',
      }),
      agentSubstrateUrl: createMessage({
        prohibition:
          'Application code must not construct a URL into the `.agent/` knowledge substrate (path literal "{{path}}").',
        reappraisal:
          'Constructing a `.agent/` URL is reaching across the application boundary into agent knowledge. Use a workspace-local fixture instead; only agent-tools/ operates on the substrate. See .agent/directives/testing-strategy.md.',
      }),
    },
  },
  defaultOptions: [],

  create(context) {
    const rawFilename = context.physicalFilename ?? context.filename;
    if (!rawFilename) return {};
    const posixPath = toPosix(rawFilename);
    if (isExemptOperatorPath(posixPath)) return {};

    // fs-import bindings local to this file. A read is reported only when its
    // callee binds to one of these — never on a callee-name match alone.
    const fsNamespaceBindings = new Set<string>(); // `import fs`/`import * as fs` from node:fs
    const fsReadBindings = new Set<string>(); // `import { readFileSync } from node:fs`

    function isFsRead(callee: TSESTree.Node): boolean {
      if (callee.type === 'Identifier') {
        return fsReadBindings.has(callee.name);
      }
      return (
        callee.type === 'MemberExpression' &&
        callee.object.type === 'Identifier' &&
        fsNamespaceBindings.has(callee.object.name) &&
        callee.property.type === 'Identifier' &&
        FS_READ_FUNCTIONS.has(callee.property.name)
      );
    }

    return {
      ImportDeclaration(node) {
        if (typeof node.source.value !== 'string' || !FS_MODULE_SOURCES.has(node.source.value)) {
          return;
        }
        for (const spec of node.specifiers) {
          if (spec.type === 'ImportDefaultSpecifier' || spec.type === 'ImportNamespaceSpecifier') {
            fsNamespaceBindings.add(spec.local.name);
          } else if (
            spec.type === 'ImportSpecifier' &&
            spec.imported.type === 'Identifier' &&
            FS_READ_FUNCTIONS.has(spec.imported.name)
          ) {
            fsReadBindings.add(spec.local.name);
          }
        }
      },

      NewExpression(node) {
        if (node.callee.type !== 'Identifier' || node.callee.name !== 'URL') return;
        if (!anyArgReferencesSubstrate(node.arguments)) return;
        context.report({ node, messageId: 'agentSubstrateUrl', data: { path: '.agent/…' } });
      },

      CallExpression(node) {
        if (!isFsRead(node.callee)) return;
        if (!anyArgReferencesSubstrate(node.arguments)) return;
        context.report({ node, messageId: 'agentSubstrateRead', data: { path: '.agent/…' } });
      },
    };
  },
};

export { noAgentSubstrateAccessRule };
