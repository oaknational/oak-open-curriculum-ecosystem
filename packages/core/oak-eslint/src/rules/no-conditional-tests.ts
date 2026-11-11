import { AST_NODE_TYPES, type TSESLint, type TSESTree } from '@typescript-eslint/utils';

import { createMessage, type RuleWithReappraisingMessages } from '../reappraising-message.js';

/**
 * ESLint rule that bans Vitest's conditional-execution APIs — `skipIf` and
 * `runIf` — on `it`, `test`, `describe` and `suite`, however the file spells
 * them: the exported name under globals mode, a local alias, or a property of
 * a namespace import.
 *
 * @remarks
 * `.agent/rules/no-conditional-tests.md` names `it.skipIf` FIRST among its
 * forbidden mechanisms, and `testing-strategy.md` requires a suite to produce
 * the same registered test count and the same assertion set on every machine.
 * Until this rule existed that requirement was prose: `vitest/no-disabled-tests`
 * catches `it.skip` and `describe.skip`, and `vitest/no-focused-tests` catches
 * `.only`, but `it.skipIf(...)` passed lint cleanly.
 *
 * That gap had a cost. A succession record instructed a seat to mark four tests
 * `it.skipIf(process.platform === 'win32')` so a host-dependent expectation
 * would not run on Windows (2026-09-11); nothing at the gate would have stopped
 * it, and the correct cure was to remove the host dependency from the product
 * seam instead. A rule a gate cannot see is a rule that survives only as long
 * as everyone remembers it.
 *
 * A conditional test is not a smaller test — it is a test whose absence is
 * invisible on the machine where it matters. When a test needs an environment
 * the host lacks, the answer is to remove the environmental dependency through
 * an injected seam; the directive's own diagnoses cover the rest.
 *
 * @example
 * // Invalid — registration depends on the host.
 * it.skipIf(process.platform === 'win32')('writes 0600', () => {});
 *
 * // Invalid — the same shape inverted.
 * describe.runIf(hasNetwork)('live calls', () => {});
 *
 * // Invalid — an alias renames the identifier, not the construct.
 * import { it as spec } from 'vitest';
 * spec.skipIf(isCi)('writes 0600', () => {});
 *
 * // Invalid — reached through a namespace import.
 * import * as vitest from 'vitest';
 * vitest.describe.skipIf(isCi)('live calls', () => {});
 *
 * // Valid — deterministic enumeration of a literal dataset.
 * it.each([1, 2, 3])('doubles %i', (n) => {});
 *
 * WHAT IT REACHES, stated once rather than enumerated. The rule reads the
 * member access where the guard is applied and resolves its root through
 * scope, so every spelling of that expression is in scope — dotted or
 * bracketed, aliased, namespaced, chained — and a local merely sharing a name
 * is not. It does NOT follow a guard extracted into a value first
 * (`const guard = it.skipIf`), which would need type information a syntactic
 * rule does not have. That is a stated limit rather than a gap to chase: the
 * shape it cannot see is not one anybody reaches for by accident, and the
 * directive stays reviewer-enforced there.
 */
const CONDITIONAL_MEMBERS = new Set(['skipIf', 'runIf']);

/**
 * Vitest's test entry points, by their exported names — `suite` included, since
 * it is the canonical alias for `describe` and a rule that missed it would ban
 * one spelling of the same construct.
 */
const TEST_CALLEES = new Set(['it', 'test', 'describe', 'suite']);

/** The module whose test entry points this rule governs. */
const VITEST_MODULE = 'vitest';

/**
 * What a local name is BOUND to, resolved rather than spelled.
 *
 * @remarks
 * Two failures sit on this question and they pull in opposite directions. Match
 * the exported spellings alone and an alias (`import { it as spec }`) or a
 * namespace (`import * as vitest`) walks past the gate. Match a collected set
 * of local names and a shadowing declaration — a parameter called `vitest`, a
 * `const test` — reports code that has nothing to do with testing, in a rule
 * that is error-level for the whole repository. Both were live here, found one
 * round apart, and a spelling test cannot answer either.
 *
 * So the binding is resolved: walk the scope chain for the name, and ask what
 * its definition IS. Unresolved means nothing declares it, which is Vitest's
 * globals mode. Resolved means somebody declared it, and it counts only if that
 * declaration is an import of the thing itself.
 */
type VitestBindingKind = 'callee' | 'namespace';

/** Whether one variable definition is the vitest import this kind needs. */
function isVitestImport(definition: TSESLint.Scope.Definition, kind: VitestBindingKind): boolean {
  const specifier = definition.node;
  if (
    specifier.type !== AST_NODE_TYPES.ImportSpecifier &&
    specifier.type !== AST_NODE_TYPES.ImportNamespaceSpecifier
  ) {
    return false;
  }
  const declaration = specifier.parent;
  if (
    declaration.type !== AST_NODE_TYPES.ImportDeclaration ||
    declaration.source.value !== VITEST_MODULE
  ) {
    return false;
  }
  if (specifier.type === AST_NODE_TYPES.ImportNamespaceSpecifier) {
    return kind === 'namespace';
  }
  return (
    kind === 'callee' &&
    specifier.imported.type === AST_NODE_TYPES.Identifier &&
    TEST_CALLEES.has(specifier.imported.name)
  );
}

const noConditionalTestsRule: RuleWithReappraisingMessages<'conditionalTestBanned'> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ban Vitest skipIf/runIf so every suite registers the same tests on every machine.',
    },
    schema: [],
    messages: {
      conditionalTestBanned: createMessage({
        prohibition:
          'Conditional test execution (skipIf/runIf) is banned: the suite would register a different set of tests depending on the host.',
        reappraisal:
          'Remove the environmental dependency instead — inject the host-specific edge through a seam so the behaviour is describable everywhere. See .agent/rules/no-conditional-tests.md.',
      }),
    },
  },
  defaultOptions: [],

  create(context) {
    /** The variable a name resolves to here, or `undefined` when nothing declares it. */
    function resolve(node: TSESTree.Identifier): TSESLint.Scope.Variable | undefined {
      let scope: TSESLint.Scope.Scope | null = context.sourceCode.getScope(node);
      while (scope !== null) {
        const variable = scope.set.get(node.name);
        if (variable !== undefined) {
          return variable;
        }
        scope = scope.upper;
      }
      return undefined;
    }

    /**
     * Whether this identifier IS the Vitest binding of the given kind here.
     *
     * One test for both kinds, because the two failures it answers are the
     * same question asked twice: unresolved means globals mode, which only a
     * bare entry-point name can be; resolved means it counts only if the
     * declaration is the vitest import itself, so a parameter or a `const`
     * that merely shares the spelling is somebody else's.
     */
    function isVitestBinding(node: TSESTree.Identifier, kind: VitestBindingKind): boolean {
      const variable = resolve(node);
      if (variable === undefined) {
        return kind === 'callee' && TEST_CALLEES.has(node.name);
      }
      return variable.defs.some((definition) => isVitestImport(definition, kind));
    }

    /**
     * The statically known property name of a member access, under either
     * spelling: `x.skipIf` and `x['skipIf']` are the same call, so reading only
     * the dotted form would leave the bracketed one — ordinary, legal syntax —
     * outside a gate that claims to ban the construct.
     */
    function staticPropertyName(node: TSESTree.MemberExpression): string | undefined {
      if (!node.computed) {
        return node.property.type === AST_NODE_TYPES.Identifier ? node.property.name : undefined;
      }
      return node.property.type === AST_NODE_TYPES.Literal &&
        typeof node.property.value === 'string'
        ? node.property.value
        : undefined;
    }

    /** `vitest.it` / `vitest['it']`, where `vitest` resolves to a namespace import. */
    function isNamespacedTestCallee(node: TSESTree.MemberExpression): boolean {
      const property = staticPropertyName(node);
      return (
        property !== undefined &&
        TEST_CALLEES.has(property) &&
        node.object.type === AST_NODE_TYPES.Identifier &&
        isVitestBinding(node.object, 'namespace')
      );
    }

    /**
     * Walk `it.each(...).skipIf`, `it.concurrent.skipIf` and every other
     * chained form back to what the chain is rooted in, and say whether that
     * is a Vitest test entry point under ANY of its reachable spellings: the
     * exported name (Vitest's globals mode injects it unimported), a local
     * alias, or a property of a namespace import.
     */
    function rootsAtTestCallee(start: TSESTree.Node): boolean {
      let current = start;
      while (
        current.type === AST_NODE_TYPES.CallExpression ||
        current.type === AST_NODE_TYPES.MemberExpression
      ) {
        if (current.type === AST_NODE_TYPES.MemberExpression) {
          if (isNamespacedTestCallee(current)) {
            return true;
          }
          current = current.object;
          continue;
        }
        current = current.callee;
      }
      if (current.type !== AST_NODE_TYPES.Identifier) {
        return false;
      }
      return isVitestBinding(current, 'callee');
    }

    return {
      MemberExpression(node) {
        const property = staticPropertyName(node);
        if (property === undefined || !CONDITIONAL_MEMBERS.has(property)) {
          return;
        }
        if (!rootsAtTestCallee(node.object)) {
          return;
        }
        context.report({ node, messageId: 'conditionalTestBanned' });
      },
    };
  },
};

export { noConditionalTestsRule };
