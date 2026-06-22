# Ponytail Substrate Study

Date: 2026-06-22

Researcher: Perseus turns Horizon

Source: `DietrichGebert/ponytail`, MIT-licensed. Read-only local checkout:
`.agent/reference-local/repos/ponytail/` (git-ignored).

Status: research report, not an adoption plan. Second external-substrate study
after the [Matt Pocock skills study](./external-skills-substrate-study-2026-05-14.md);
feeds the
[external-skills-substrate-learning plan](../../../plans/agentic-engineering-enhancements/future/external-skills-substrate-learning.plan.md)
as a candidate-register input. Names candidate Practice moves; makes none —
promotion stays owner-gated.

## Purpose

Ponytail is a single-thesis agent ruleset distributed as a plugin across ~14
agent harnesses: *the best code is the code never written*. The lens here is the
Practice. The question is not "should Oak install ponytail" — it should not; Oak
already holds simplicity as doctrine — but "does ponytail's substrate reveal a
named operating move Oak lacks, or sharpen one Oak holds loosely?"

## Method

Read first-hand: `README.md`, `AGENTS.md` (the compact ruleset), all six skill
bodies (`ponytail`, `ponytail-review`, `ponytail-audit`, `ponytail-debt`,
`ponytail-gain`, `ponytail-help`), and the repo structure (multi-vendor adapter
surfaces, `ponytail-mcp/`, lifecycle hooks, benchmarks). Compared against Oak's
First/Second Question (`AGENT.md`), the simplification-first architecture
reviewer (Barney), `closed-shape-design-optionality`, `replace-dont-bridge`,
`strict-validation-at-boundary`, TDD-as-design, `pending-graduations` (a
trigger-gated buffer), the `frictions-register`, and the deliberate counter-pole
`feedback_yagni_doesnt_apply_to_innovation` (forward design is creating, not
speculation).

## Executive Verdict

Ponytail is a thin, rhetorically sharp simplicity substrate with one strong,
genuinely portable idea and a great deal that Oak already holds more strongly.

- Its **decision ladder** (YAGNI → stdlib → native → installed-dep → one line →
  minimum) is Oak's First Question made into a compact code-authoring reflex.
  Oak holds the principle; it does not hold the ordered reflex at the moment of
  writing each piece of code.
- Its **safety fence** — validation, data-loss handling, security, accessibility,
  and anything explicitly requested are never simplified away; "lazy code
  without its check is unfinished" — is *weaker* than Oak's equivalents
  (strict-validation-at-boundary, TDD-as-design, the accessibility practice). It
  is a useful confirmation that a simplicity discipline need not threaten Oak's
  invariants, not a thing to learn.
- Its **multi-vendor portability** (one ruleset → ~14 harnesses via adapters)
  independently re-derives Oak's canonical-first + adapter model (PDR-051).
- The one **novel, gap-filling object** is the complexity-debt ledger: a
  `ponytail:` inline marker that names a shortcut's *ceiling and upgrade path*,
  harvested by `/ponytail-debt`, which flags any marker with *no revisit
  trigger* as silent-rot risk. This converges with the Matt Pocock study's C8
  ("negative memory needs revisit conditions") from an independent source — two
  substrates landing on the same shape is the strongest adoption signal this
  study produces.

The fluent move — "adopt the simplicity skill" — is wrong. Oak does not need a
simplicity skill. The honest output is one promote-candidate and several
confirmations.

## Substrate Map

1. **The ladder as a named reflex.** Six ordered rungs, applied before writing
   code, stopping at the first that holds. Concrete where Oak is abstract: rungs
   2–4 (stdlib > native > installed-dep > *never* a new dep for what a few lines
   do) are an explicit ordered preference Oak's doctrine implies but never
   states.
2. **`ponytail:` markers + the debt ledger.** Deliberate simplifications are
   marked inline; a shortcut with a known ceiling names the ceiling *and* the
   upgrade trigger (`# ponytail: global lock, per-account locks if throughput
   matters`). `/ponytail-debt` greps them into a ledger and tags any marker with
   no trigger as the kind that "silently rots". Reads and reports only.
3. **Single-axis review lens.** `/ponytail-review` (diff) and `/ponytail-audit`
   (repo) hunt *only* over-engineering, with a five-tag delete-list
   (`delete/stdlib/native/yagni/shrink`) and a `net: -N lines` score, explicitly
   routing correctness/security/performance to a normal review pass.
4. **The safety fence.** An explicit non-negotiable list that simplification
   never touches, plus a TDD-adjacent minimum ("one runnable check behind
   non-trivial logic").
5. **Measured value, honestly.** The README retracts an earlier inflated
   single-shot benchmark (issue #126) in favour of a fair agentic baseline, and
   names where the approach inverts (a terse reasoning model spends more, not
   less). Value proven by measurement, limitations named.
6. **Intensity + always-on activation.** `lite/full/ultra/off` levels, persisted
   via lifecycle hooks and an env default — an ergonomics pattern over a binary
   always-applied rule.

## Fit-Gate Verdicts

Each candidate run through: repeated Oak failure mode? already solved? natural
home? proof signal? → verdict.

| Candidate | Oak failure mode | Existing home | Verdict | Natural home (if promoted) | Proof signal |
| --- | --- | --- | --- | --- | --- |
| Complexity-debt ledger (marker + ceiling + **revisit trigger**; no-trigger = rot) | Deliberate code-level shortcuts and known ceilings lost in ungoverned TODOs; deferrals harden silently | Partial: `pending-graduations` (trigger-gated, but for Practice graduations), `frictions-register` (AX friction, not complexity debt), archived decision-debt-register | **promote-candidate** (highest value; reinforced by Matt Pocock C8) | A memory/state convention + a validator that flags markers lacking a revisit trigger | A deferred shortcut is revisited *because its trigger fired*, not rediscovered as confusion |
| Decision ladder as a code-authoring reflex (stdlib > native > dep ordering) | Over-building under the "innovation" licence at *implementation* altitude | First/Second Question, Barney, closed-shape — but at planning/review altitude, not authoring-time | **defer** | A short principles line or rule, scoped to implementation code, explicitly *excluding* forward/innovation design | An implementation reaches for stdlib/native before a new dep without a reviewer catching it |
| Single-axis over-engineering review lens | — | Barney is the simplification-first reviewer; code-expert is the gateway router | **reject** | — (would fragment the gateway+specialist reviewer model) | — |
| Safety fence / "lazy code without its check is unfinished" | — | strict-validation-at-boundary, TDD-as-design, accessibility practice (all stronger) | **observe** (confirmation only) | — | — |
| Measured value + named limitations | — | `value-proven-by-release-not-test`, EEF benchmark discipline | **observe** | — | — |
| Intensity levels / hook activation | — | Binary always-applied rules (deliberate) | **observe** | — | — |
| Multi-vendor canonical + adapter portability | — | PDR-051 (canonical-first + adapters), the skills-standardisation generator | **observe** (independent re-derivation; relevant to the educator-end-users plugin-bundle lane) | — | — |

## What Oak Can Learn

- **One thing, mainly:** a first-class home for *complexity debt* — a deliberate
  shortcut tied to its ceiling and a revisit trigger, where a missing trigger is
  itself the defect. The convergence with Matt Pocock C8 makes this the one
  candidate worth routing into the register first. It is a small, durable,
  Practice-native shape (convention + validator), not a skill import.
- **A design subtlety, if the ladder is ever promoted:** Oak deliberately holds
  the counter-pole — "YAGNI doesn't apply to innovation; forward design with
  consumers in mind is creating, not speculation." Ponytail's ladder is correct
  for *implementation* code and wrong for *forward/innovation* design. Any
  adoption must name that boundary, or it would suppress a valid Oak signal.

## What Oak Should Not Learn

- **Do not import a simplicity skill.** Oak's First/Second Question and Barney
  already carry the axis with more nuance and at the right altitude.
- **Do not fragment the reviewer model** into single-axis user-invoked lenses;
  the gateway (code-expert) + specialist (Barney) shape is deliberate.
- **Do not weaken the safety/validation/a11y fence to ponytail's level** — Oak's
  is the stronger one. Borrow nothing here.

## Meta-Finding: The Second Study Triggers the Template

The Matt Pocock companion note recorded a deferred observation: an "external
substrate review template" should wait *until at least one more external-substrate
study repeats the shape*. This is that second study, and the shape did repeat
(read source first-hand → map substrate → fit-gate each concept → separate
learnings from candidates → name non-plan insights). Authoring the template is a
separate move for the substrate-learning plan to own; this study only records
that its trigger has now fired.

## Candidate Follow-Ups (named, not made)

1. Route the complexity-debt ledger into the substrate-learning candidate
   register as a `promote` candidate, paired with Matt Pocock C8, for the owner
   to dispose. (Creating the register is the plan's owner-gated first slice.)
2. Hold the decision-ladder candidate as `defer` with its innovation-boundary
   caveat recorded.
3. Note that the second-study trigger for the external-substrate-review template
   has fired; promotion of the template is the substrate-learning plan's call.
