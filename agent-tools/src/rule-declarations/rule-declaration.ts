/**
 * The declaration a canonical rule carries in its frontmatter.
 *
 * A rule under `.agent/rules/` declares how it is loaded — always (`core`), or on a named
 * trigger (`situational`), optionally scoped to file globs — and one sentence of what it is
 * for. The declaration is the one source for every projection of the rule: the row in
 * `RULES_INDEX.md`, the Cursor trigger under `.cursor/rules/`, the Claude and `.agents`
 * adapters. `render-rule-projections.ts` derives them, `pnpm portability:fix` writes them and
 * `pnpm portability:check` recomputes them; none is ever edited by hand (`compute-dont-hope`).
 *
 * The shape is closed: a core rule has no trigger and no globs (it is always loaded, so a
 * scope would be meaningless), and a situational rule always names its trigger.
 *
 * @packageDocumentation
 */

/** The two ways a rule is loaded. */
export const RULE_CLASSIFICATIONS = ['core', 'situational'] as const;

/** A member of {@link RULE_CLASSIFICATIONS}. */
export type RuleClassification = (typeof RULE_CLASSIFICATIONS)[number];

const RULE_CLASSIFICATION_SET: ReadonlySet<string> = new Set(RULE_CLASSIFICATIONS);

/**
 * Whether a string names a rule classification.
 *
 * @param value - The candidate text.
 * @returns `true` when the text is `core` or `situational`.
 */
export function isRuleClassification(value: string): value is RuleClassification {
  return RULE_CLASSIFICATION_SET.has(value);
}

/** A rule loaded into every session. */
export interface CoreRuleDeclaration {
  /** The rule's basename without `.md`. */
  readonly name: string;
  readonly classification: 'core';
  /** One sentence of what the rule is for, shown wherever the rule is listed. */
  readonly description: string;
}

/** A rule loaded on its named trigger, optionally scoped to file globs. */
export interface SituationalRuleDeclaration {
  /** The rule's basename without `.md`. */
  readonly name: string;
  readonly classification: 'situational';
  /** One sentence of what the rule is for, shown wherever the rule is listed. */
  readonly description: string;
  /**
   * The loading signal as the rules index shows it: a `surface:`, `session:`, `ceremony:`
   * or `tool:` token, optionally followed by ` — ` and a short gloss.
   */
  readonly trigger: string;
  /** File globs the rule attaches to; empty when the trigger is not file-shaped. */
  readonly globs: readonly string[];
}

/** A rule declaration: core or situational, never both, never neither. */
export type RuleDeclaration = CoreRuleDeclaration | SituationalRuleDeclaration;
