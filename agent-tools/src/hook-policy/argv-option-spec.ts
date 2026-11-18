/**
 * The shape of one option in the argument-aware matcher's tables. Its own
 * module so the command tables and the git subcommand tables can both name
 * it without importing each other.
 *
 * @packageDocumentation
 */

/**
 * One option a command accepts. `name` is the canonical name (the long
 * spelling, or the letter of a `shortOnly` option); `short` lists every
 * short letter that means the same option; `arg` says whether the option
 * takes a value — `required` (attached, `=`-joined, or the next token) or
 * `optional` (an `=`-joined value on the long form, or the rest of the
 * cluster on the short form — `-Skey` is the gpg-sign option with a key,
 * never the sign and a `-k`; the next token is never taken); `implies`
 * names the canonical options this spelling stands for, so a pattern and an
 * invocation meet on the same set whichever spelling either uses;
 * `overrides` names the options this one cancels when it comes later on the
 * line (`rm -f` and `rm -i` each override the other, last wins), except
 * under a value listed in `overridesUnless` (`--interactive=never` prompts
 * for nothing and so cancels nothing).
 */
export interface OptionSpec {
  readonly name: string;
  readonly short?: string;
  readonly arg?: 'required' | 'optional';
  /** The option has no long spelling (`git clean -d`): long-option lookups never resolve to it. */
  readonly shortOnly?: true;
  /** The option is a spelling of these canonical options (`git branch -D` is `--delete --force`). */
  readonly implies?: readonly string[];
  /** The options this one cancels when it appears later on the line (last wins). */
  readonly overrides?: readonly string[];
  /** Values of this option under which it cancels nothing (`--interactive=never` leaves `-f` in force). */
  readonly overridesUnless?: readonly string[];
}
