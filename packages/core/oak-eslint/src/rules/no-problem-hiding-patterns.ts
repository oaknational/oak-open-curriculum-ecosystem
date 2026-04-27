import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

/**
 * ESLint rule that bans two named problem-hiding patterns:
 *
 * 1. `void <bare-identifier>;` as an expression statement — silences the
 *    unused-variable lint by discarding the binding's value rather than
 *    removing the binding.
 * 2. Underscore-prefix on any local identifier binding (parameter,
 *    variable declarator, destructure target — shorthand or rename) —
 *    silences the `@typescript-eslint/no-unused-vars` warning by
 *    convention without fixing the underlying dead state. The leading
 *    underscore is not a language feature; it is a convention for one
 *    specific lint rule.
 *
 * Both patterns are forms of "fix it or delete it; never silence the
 * warning that names it" per `principles.md` § "Don't hide problems".
 *
 * @remarks
 * The rule is uniform: any local binding whose name starts with `_` is
 * flagged, regardless of whether the underscore came from a property
 * shorthand, a `__` Node.js convention, or an explicit rename. Cure is
 * always to rename or delete the local binding. **Property access** on
 * an object whose schema names a field with a leading underscore (e.g.
 * `obj._meta` for the MCP `_meta` protocol field) is unaffected — the
 * rule targets BINDINGS, not member expressions. When destructuring
 * such a field, rename the local: `const { _meta: meta } = obj`.
 *
 * `void <method-call>;` and `void <other-expression>;` (fire-and-forget
 * promises, discarded return values) are not flagged because the rule
 * only flags bare-identifier voids — the silencer-of-unused-binding
 * shape. `void` on an effectful expression is a different mechanism
 * with a different intent.
 *
 * @example
 * ```typescript
 * // BANNED: void on a bare unused binding
 * const { a, ...rest } = obj;
 * void a;
 *
 * // BANNED: parameter rename to silence unused-vars
 * function handler(_req, res) { res.send('ok'); }
 *
 * // BANNED: shorthand destructure that produces an underscore local
 * const { _meta } = tool;
 *
 * // CURED: rename during destructure so the local has no underscore
 * const { _meta: meta } = tool;
 *
 * // ALLOWED: void on a fire-and-forget promise (effectful expression)
 * void runAsync();
 *
 * // ALLOWED: property access on a field whose name has an underscore
 * const meta = tool._meta;
 * ```
 */
const noProblemHidingPatternsRule: TSESLint.RuleModule<
  'voidUnusedBinding' | 'underscorePrefixRename',
  []
> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        "Ban `void <unused-binding>;` and `_foo` rename patterns that silence unused-variable lint. Per principles.md § Don't hide problems — fix them or delete them.",
    },
    schema: [],
    messages: {
      voidUnusedBinding:
        '`void <bare-identifier>;` is banned. The unused binding is dead state; the `void` only silences the unused-variable lint. Restructure so the binding is not produced (avoid the destructure capture, remove the assignment, or use `satisfies` directly on the value). No wrappers, no adapters — fix it or delete it.',
      underscorePrefixRename:
        'Underscore-prefix rename of an identifier binding is banned. The leading underscore is not a language feature — it is a default convention for `@typescript-eslint/no-unused-vars` that silences the warning without fixing the dead state. Use the parameter for its intended purpose, or delete it from the signature. No wrappers, no adapters — fix it or delete it.',
    },
  },
  defaultOptions: [],

  create(context) {
    const flagBareIdentifier = (statement: TSESTree.ExpressionStatement): void => {
      const expression = statement.expression;
      if (expression.type !== AST_NODE_TYPES.UnaryExpression || expression.operator !== 'void') {
        return;
      }
      if (expression.argument.type !== AST_NODE_TYPES.Identifier) {
        return;
      }
      context.report({
        node: statement,
        messageId: 'voidUnusedBinding',
      });
    };

    const startsWithUnderscore = (name: string): boolean => name.startsWith('_');

    const flagUnderscoreParam = (param: TSESTree.Parameter): void => {
      // Strip TSParameterProperty / AssignmentPattern / RestElement / ArrayPattern
      // wrappers down to the underlying identifier or pattern.
      const inner = param.type === AST_NODE_TYPES.AssignmentPattern ? param.left : param;
      if (inner.type === AST_NODE_TYPES.Identifier && startsWithUnderscore(inner.name)) {
        context.report({ node: inner, messageId: 'underscorePrefixRename' });
      }
    };

    const flagUnderscoreVarDeclarator = (decl: TSESTree.VariableDeclarator): void => {
      if (decl.id.type === AST_NODE_TYPES.Identifier && startsWithUnderscore(decl.id.name)) {
        context.report({ node: decl.id, messageId: 'underscorePrefixRename' });
      }
    };

    const flagUnderscoreDestructureBinding = (property: TSESTree.Property): void => {
      // Flag any destructure target that produces a local binding with a
      // leading underscore. This includes shorthand destructures of fields
      // whose schema name begins with `_` (e.g. `const { _meta } = obj`):
      // the local binding's name still starts with `_`, regardless of the
      // syntactic form. Cure: rename during destructure to drop the
      // underscore from the local (e.g. `const { _meta: meta } = obj`).
      // Property access (`obj._meta`) is unaffected — that is a member
      // expression, not a binding.
      if (
        property.value.type === AST_NODE_TYPES.Identifier &&
        startsWithUnderscore(property.value.name)
      ) {
        context.report({ node: property.value, messageId: 'underscorePrefixRename' });
      }
    };

    return {
      ExpressionStatement: flagBareIdentifier,

      'FunctionDeclaration > Identifier.params, FunctionExpression > Identifier.params, ArrowFunctionExpression > Identifier.params':
        (node: TSESTree.Identifier) => {
          if (startsWithUnderscore(node.name)) {
            context.report({ node, messageId: 'underscorePrefixRename' });
          }
        },

      'FunctionDeclaration > AssignmentPattern.params, FunctionExpression > AssignmentPattern.params, ArrowFunctionExpression > AssignmentPattern.params':
        (node: TSESTree.AssignmentPattern) => {
          flagUnderscoreParam(node);
        },

      VariableDeclarator: flagUnderscoreVarDeclarator,

      'ObjectPattern > Property': flagUnderscoreDestructureBinding,
    };
  },
};

export { noProblemHidingPatternsRule };
