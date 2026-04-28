import type { TSESLint } from '@typescript-eslint/utils';

/**
 * Pattern matching `eslint-disable` directive variants but NOT `eslint-enable`.
 * Matches: `eslint-disable`, `eslint-disable-next-line`, `eslint-disable-line`.
 * The `(?!d)` lookahead prevents matching if followed immediately by `d`
 * (e.g. the hypothetical word `eslint-disabled`).
 */
const ESLINT_DISABLE_PATTERN = /eslint-disable(?!d)(?:-next-line|-line)?(?!\w)/u;

/**
 * Pattern matching TypeScript suppression directives: `@ts-ignore`,
 * `@ts-expect-error`, and `@ts-nocheck`.
 */
const TS_DIRECTIVE_PATTERN = /@ts-(?:ignore|expect-error|nocheck)(?!\w)/u;

/**
 * Case-insensitive pattern for the user-approval marker.
 * An `eslint-disable` comment containing this substring is permitted.
 */
const APPROVAL_MARKER_PATTERN = /--\s*jc:/iu;

/**
 * ESLint rule that bans `eslint-disable` comments unless they carry the
 * project-owner approval marker.
 *
 * @remarks
 * The motivation is to make suppression comments visible to lint so they can
 * be tracked and remediated. Only the project owner may introduce new
 * suppressions by adding the approval prefix.
 *
 * `@ts-ignore`, `@ts-expect-error`, and `@ts-nocheck` are banned
 * unconditionally — there is no exception for TypeScript suppression
 * directives.
 *
 * `eslint-enable` comments are explicitly allowed; they undo prior disable
 * blocks and should not be restricted.
 */
const noEslintDisableRule: TSESLint.RuleModule<'eslintDisableBanned' | 'tsDirectiveBanned', []> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ban eslint-disable comments unless they carry the project-owner approval marker. Also bans @ts-ignore, @ts-expect-error, and @ts-nocheck unconditionally.',
    },
    schema: [],
    messages: {
      eslintDisableBanned:
        'eslint-disable is banned. Fix the root cause. Only the project owner can approve exceptions.',
      tsDirectiveBanned:
        '@ts-ignore, @ts-expect-error, and @ts-nocheck are banned. Fix the root cause — TypeScript suppression directives are never permitted.',
    },
  },
  defaultOptions: [],

  create(context) {
    return {
      Program() {
        const sourceCode = context.sourceCode;

        for (const comment of sourceCode.getAllComments()) {
          const text = comment.value;

          if (TS_DIRECTIVE_PATTERN.test(text)) {
            context.report({
              loc: comment.loc ?? { line: 1, column: 0 },
              messageId: 'tsDirectiveBanned',
            });
            continue;
          }

          if (ESLINT_DISABLE_PATTERN.test(text) && !APPROVAL_MARKER_PATTERN.test(text)) {
            context.report({
              loc: comment.loc ?? { line: 1, column: 0 },
              messageId: 'eslintDisableBanned',
            });
          }
        }
      },
    };
  },
};

export { noEslintDisableRule };
