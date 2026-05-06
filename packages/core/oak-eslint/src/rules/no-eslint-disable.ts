import type { TSESLint } from '@typescript-eslint/utils';

/**
 * Pattern matching `eslint-disable` directive variants but NOT `eslint-enable`.
 * Matches: `eslint-disable`, `eslint-disable-next-line`, `eslint-disable-line`.
 * The `(?!d)` lookahead prevents matching if followed immediately by `d`
 * (e.g. the hypothetical word `eslint-disabled`).
 */
const ESLINT_DISABLE_PATTERN = /eslint-disable(?!d)(?:-next-line|-line)?(?!\w)/u;

/**
 * Pattern matching the unconditionally banned TypeScript suppression
 * directives: `@ts-ignore` and `@ts-nocheck`. There is no escape hatch
 * for either, regardless of trailing description.
 */
const UNCONDITIONAL_TS_DIRECTIVE_PATTERN = /@ts-(?:ignore|nocheck)(?!\w)/u;

/**
 * Pattern matching `@ts-expect-error`. This directive is conditionally
 * permitted by the strict shared lint config when paired with a
 * substantive description; the contract is enforced by
 * `@typescript-eslint/ban-ts-comment` with
 * `'ts-expect-error': 'allow-with-description'` and a
 * `minimumDescriptionLength`. This custom rule defers to that surface
 * for `@ts-expect-error` rather than duplicating its behaviour.
 *
 * Bare `@ts-expect-error` (no description) is still flagged by
 * `ban-ts-comment` per the strict config; this rule no longer reports
 * `@ts-expect-error` directly so the two rules do not overlap.
 */
const TS_EXPECT_ERROR_PATTERN = /@ts-expect-error(?!\w)/u;

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
 * The motivation is to make suppression comments visible to lint so they
 * can be tracked and remediated. Only the project owner may introduce new
 * suppressions by adding the approval prefix.
 *
 * `@ts-ignore` and `@ts-nocheck` are banned unconditionally — there is no
 * exception for either directive. `@ts-expect-error` is governed by the
 * strict shared lint config's `@typescript-eslint/ban-ts-comment` rule
 * (configured with `allow-with-description` and `minimumDescriptionLength`)
 * rather than by this rule, so a substantively-described
 * `@ts-expect-error` passes through this rule unflagged. Bare or trivially
 * described `@ts-expect-error` is still flagged by `ban-ts-comment` per
 * the strict config.
 *
 * Per the doctrine-enforcement-quick-wins plan §Issue 2 and PDR-044
 * §Innate immunity, two-rule defence is intentional: this custom rule
 * covers the universal "no bare suppression" gate; the typescript-eslint
 * rule encodes the description-length contract that the broader
 * ecosystem expects.
 *
 * `eslint-enable` comments are explicitly allowed; they undo prior
 * disable blocks and should not be restricted.
 */
const noEslintDisableRule: TSESLint.RuleModule<'eslintDisableBanned' | 'tsDirectiveBanned', []> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ban eslint-disable comments unless they carry the project-owner approval marker. Also bans @ts-ignore and @ts-nocheck unconditionally; defers to @typescript-eslint/ban-ts-comment for @ts-expect-error.',
    },
    schema: [],
    messages: {
      eslintDisableBanned:
        'eslint-disable is banned. Fix the root cause. Only the project owner can approve exceptions.',
      tsDirectiveBanned:
        '@ts-ignore and @ts-nocheck are banned. Fix the root cause — these TypeScript suppression directives are never permitted. For @ts-expect-error, use the @typescript-eslint/ban-ts-comment surface with a substantive description.',
    },
  },
  defaultOptions: [],

  create(context) {
    return {
      Program() {
        const sourceCode = context.sourceCode;

        for (const comment of sourceCode.getAllComments()) {
          const text = comment.value;

          if (UNCONDITIONAL_TS_DIRECTIVE_PATTERN.test(text)) {
            context.report({
              loc: comment.loc ?? { line: 1, column: 0 },
              messageId: 'tsDirectiveBanned',
            });
            continue;
          }

          if (TS_EXPECT_ERROR_PATTERN.test(text)) {
            // Defer to @typescript-eslint/ban-ts-comment (configured by
            // the strict shared config with allow-with-description and a
            // minimumDescriptionLength). This rule does not double-report.
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
