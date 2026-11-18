---
name: Prove the Checker With a Negative Control
polarity: pattern
use_this_when: A checker is about to be trusted on the strength of a green result — a new validator, guard, lint rule, harness comparison or schema check passing on the current tree, or a targeted run (a lint over specific paths, an advisory commit-message check, a one-off validator invocation) that came back green — and it has never been shown to fail on the failure it exists to catch
category: testing
layer: general
proven_in: "the visual-regression harness proved in an isolated repository from `git archive` with a deliberate visual change, and the schema-dts guard's red phase with the historical failure re-added (jimcresswell.net, 2026-03-08); markdownlint dot-directory false-greens (paired controls, 2026-06-12) and argless commit-message advisory false-greens (two seats, 2026-06-11) in OCE"
proven_date: 2026-03-08
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A checker that passes on a healthy tree, or a targeted run that matched no input, is declared working without ever having been shown to fail, so a vacuous check (wrong glob, wrong flag, wrong exit code, wrong comparison) ships green and guards nothing"
  stable: true
---

> **POLARITY: PATTERN.** This is a shape to repeat: before trusting a
> checker, prove detection with a deliberately bad input through the
> invocation you intend to trust.

## Principle

A checker earns its verdict by failing on the thing it checks for. Passing on the current
tree proves only that the tree is healthy or the checker is blind, and the two look the same
from outside; a green targeted run that never echoed its inputs checked nothing. So every
checker is proved with a negative control before it is trusted: a deliberate instance of the
failure it exists to catch, run through the same invocation, refused. This is the
checker-level form of the guard-level rule in `validation-strategy` §Prove the guard bites (a
mutant applied in place to product code); the checker's control often needs its own fixture,
because the failure cannot be introduced safely into the live tree.

## The shape

1. **Name the failure the checker exists to catch**, in one sentence, before writing or
   running it. If the sentence cannot be written, the checker has no claim to prove.
2. **Build the control where the failure can exist safely, and INSIDE the repository.** For a
   repository-level checker (a visual harness, a link validator, a portability check), that is
   an isolated temporary repository made from `git archive` of the current tree with the
   failure introduced by hand. For a guard over generated output (a schema-dts type guard), it
   is the historical failure re-added to a fixture. For a lint or a targeted run, it is a
   deliberately bad file placed inside the tree (deleted after): markdownlint rejects absolute
   paths outside the repository, so a control under `/tmp` proves nothing.
3. **Run the checker on the control through the same invocation shape** you intend to trust
   (same wrapper, same working directory, same flags) **and demand RED.** Read the refusal, not
   just the exit code: the message names the failure the checker was written for, at the
   location the control put it. A checker that stays green on the bad input is checking
   nothing; fix the invocation before reading any result from it.
4. **Then run it on the healthy tree** and confirm it echoes or enumerates its inputs (a count,
   the file list, the message body). A result with no evidence of inputs is not a result. Only
   now is the checker's verdict evidence.
5. **Keep the control** where the checker can be re-proved after each change to it: a fixture
   beside the checker, or the recipe for the isolated repository in the checker's README.

## Worked instances

- **The visual-regression harness (2026-03-08).** Proved by making a temporary repository
  from `git archive`, introducing a deliberate visual change, and reading the harness refuse
  it, before any claim that the harness detects rendering drift. This entry is the recipe's
  only record: the harness README (`jcdotnet/visual-regression-harness/README.md`) does not
  yet carry it.
- **The schema-dts guard (2026-03-08).** The red phase re-added the historical failure the
  guard was written to prevent; the guard refused it; then the fix landed and the guard passed.
- **markdownlint without `--dot` (2026-06-12).** The tool matches ZERO files under any dot
  directory, prints usage and exits 0: every targeted "markdownlint OK" on `.agent/**` paths
  run without `--dot` was void. The root script passes `--dot .`; targeted runs on
  dot-directory paths must too.
- **The argless commit-message advisory check (2026-06-11).** Two seats saw it exit 0 with no
  message; the false-green was environment-dependent and not reproducible from the repository
  root on re-test, which is the point: without the control there is no way to know.

## Exception: a downstream unconditional gate makes the per-invocation control redundant

When the same input is also checked by a downstream gate that fires unconditionally (no
flags, no path-scoping that can silently match nothing), the per-invocation negative control
is redundant; trust the gate. The canonical case: a commit message is gated by the
`commit-msg` hook, which runs commitlint on every commit, so the pre-commit advisory checker
is convenience and a per-commit deliberate-RED control on it tests the tool, not the message.
Run a one-off self-check on such a checker only on a real suspicion that it is broken on this
machine, never as a per-invocation ritual. The control earns its place where there is NO such
downstream gate (a targeted lint run, a one-off validator, a new harness): the green there
could be a structural false-green with nothing else to catch it.

## Relationship

- `validation-strategy` §Prove the guard bites: the guard-level form, a mutant in place; this
  pattern is the checker-level form with a control.
- `tests-prove-behaviour-no-exemptions`: a test that cannot fail proves nothing; the same
  invariant one level up.
- `compute-dont-hope`: a checker's coverage is computed by running it on a known failure, not
  assumed from its source.
- Sibling families: the green-verifier-without-count lesson and zero-hit absence claims
  needing a positive control (`verify-dont-trust` §Anti-Patterns).
