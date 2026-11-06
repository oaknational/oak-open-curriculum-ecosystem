import { createMessage, type RuleWithReappraisingMessages } from '../reappraising-message.js';

/**
 * ESLint rule that bans `throw` statements in favour of the Result pattern.
 *
 * @remarks
 * Repository doctrine (`.agent/rules/use-result-pattern.md`) is that errors are part
 * of the type signature: a function that can fail returns `Result<T, E>`, and
 * the compiler rejects a read of `value` or `error` until `ok` is checked;
 * handling the failure is the caller's job. A `throw` re-introduces
 * the invisible control-flow edge the Result pattern exists to remove. Genuine
 * boundary translations — re-expressing an error from a library that cannot
 * return a `Result` — belong at a single named edge, translated to a `Result`
 * there, not scattered through the call graph.
 *
 * Its severity is set in `configs/recommended.ts`, which records why.
 */
const noThrowStatementRule: RuleWithReappraisingMessages<'throwBanned'> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ban throw statements so errors flow through the Result pattern (.agent/rules/use-result-pattern.md) and stay in the type signature.',
    },
    schema: [],
    messages: {
      throwBanned: createMessage({
        prohibition: 'Throwing is banned: a thrown error is invisible to the type system.',
        reappraisal:
          'Return a Result<T, E> (err(...)) from a Result-typed function; where a library that cannot return Result must be wrapped, translate the error to a Result at that single boundary. See .agent/rules/use-result-pattern.md.',
      }),
    },
  },
  defaultOptions: [],

  create(context) {
    return {
      ThrowStatement(node) {
        context.report({
          node,
          messageId: 'throwBanned',
        });
      },
    };
  },
};

export { noThrowStatementRule };
