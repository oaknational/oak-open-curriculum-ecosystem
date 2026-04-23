import type { TSESLint } from '@typescript-eslint/utils';

/**
 * ESLint rule that bans dynamic `import(...)`.
 *
 * @remarks
 * Dynamic imports create the same kind of hidden runtime boundary as
 * `eval`: the imported surface is resolved late, outside the module's
 * explicit static dependency graph. Repository doctrine is to model
 * those boundaries explicitly with static imports and named entry
 * points instead.
 */
const noDynamicImportRule: TSESLint.RuleModule<'dynamicImportBanned', []> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ban dynamic import(...) so module boundaries stay static, reviewable, and lintable.',
    },
    schema: [],
    messages: {
      dynamicImportBanned:
        'Dynamic import(...) is banned. Use a static import or an explicit boundary module instead.',
    },
  },
  defaultOptions: [],

  create(context) {
    return {
      ImportExpression(node) {
        context.report({
          node,
          messageId: 'dynamicImportBanned',
        });
      },
    };
  },
};

export { noDynamicImportRule };
