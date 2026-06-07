import type { TSESLint } from '@typescript-eslint/utils';
import { z } from 'zod';

/**
 * Compile-time enforcement that every custom-rule message teaches a positive
 * reappraisal direction, not only a prohibition.
 *
 * A feedback surface that fires but only says "no" leaves the author to reword
 * around it; the firing reads as a wording obstacle rather than the conceptual
 * signal it is. PDR-044 §Innate immunity (as amended 2026-06-07) requires a
 * surfaced detection to pair its citation with the positive reappraisal
 * direction the firing signals. For the PreToolUse guards this is enforced at
 * commit-time by a policy validator, because their registry loads from JSON and
 * must fail open. ESLint rules are TypeScript source, so enforcement moves to
 * the cheaper, stronger layer: the type system.
 *
 * {@link ReappraisingMessage} is a branded string that only {@link createMessage}
 * can mint, and {@link RuleWithReappraisingMessages} narrows a rule's
 * `meta.messages` to that brand. A rule author therefore cannot write a
 * prohibition-only message: a plain string fails `tsc`, and `createMessage`
 * cannot be called without both halves. Presence is true by construction —
 * there is no separate validator to drift from, and no bypass to guard.
 *
 * The brand is minted by zod's `.parse` (the repo's validation idiom), not a
 * hand-written `as`: the shared config bans type assertions outright
 * (`@typescript-eslint/consistent-type-assertions: 'never'`), and zod narrows
 * `unknown` to the branded type at this boundary without one.
 *
 * @packageDocumentation
 */

/**
 * The two halves every rule message must carry. Each is trimmed and required
 * non-empty so a message can never be authored as a bare prohibition with no
 * cure. Derived from its schema (the repo's types-flow-from-schema doctrine).
 */
const messagePartsSchema = z.object({
  prohibition: z
    .string()
    .trim()
    .min(1, 'createMessage: prohibition must be non-empty — a rule must state what is wrong.'),
  reappraisal: z
    .string()
    .trim()
    .min(
      1,
      'createMessage: reappraisal must be non-empty — a rule must teach what to do instead (PDR-044 §Innate immunity, as amended).',
    ),
});

/** The two halves every rule message must carry. */
export type MessageParts = z.infer<typeof messagePartsSchema>;

const reappraisingMessageSchema = z.string().brand<'ReappraisingMessage'>();

/**
 * An ESLint rule message that carries both a prohibition and the positive
 * reappraisal direction. Assignable to `string` (so ESLint's runtime and the
 * `RuleModule` type accept it), but a plain `string` is not assignable to it —
 * the only producer is {@link createMessage}.
 */
export type ReappraisingMessage = z.infer<typeof reappraisingMessageSchema>;

/**
 * Compose a rule message from its prohibition and its positive reappraisal
 * direction. The single space join is not load-bearing: each half is authored
 * as complete prose, and any `{{placeholder}}` is opaque here and preserved for
 * ESLint's runtime interpolation.
 *
 * The non-empty halves are validated at rule-load time (caught by this
 * package's own build and tests, never shipped), so a half can never be
 * silently dropped by a dynamically-built part.
 *
 * @throws {z.ZodError} If either half is empty or whitespace-only.
 */
export function createMessage(parts: MessageParts): ReappraisingMessage {
  const { prohibition, reappraisal } = messagePartsSchema.parse(parts);
  return reappraisingMessageSchema.parse(`${prohibition} ${reappraisal}`);
}

/**
 * A {@link TSESLint.RuleModule} whose `meta.messages` are narrowed to
 * {@link ReappraisingMessage}. Declare a rule with this type and every message
 * must be built via {@link createMessage}; a plain string is a compile error.
 */
export type RuleWithReappraisingMessages<
  MessageIds extends string,
  Options extends readonly unknown[] = [],
> = Omit<TSESLint.RuleModule<MessageIds, Options>, 'meta'> & {
  readonly meta: Omit<TSESLint.RuleModule<MessageIds, Options>['meta'], 'messages'> & {
    readonly messages: Record<MessageIds, ReappraisingMessage>;
  };
};
