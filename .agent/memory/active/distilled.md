---
fitness_line_target: 120
fitness_line_limit: 180
fitness_char_limit: 12000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
merge_class: curated-learning-register
fitness_content_role: drainable-buffer
fitness_rationale: >-
  Lowered 2026-05-25 after owner-requested processing through `oak-consolidate-docs`.
  The active file carries the conservation role, graduation pointers, and held
  validation entries. Falsifiability: if future napkin rotations add high-signal
  learning that has no stable permanent home, preserve it first and revise the
  envelope by substance rather than trimming the lesson.
---

## Ready-Empty State (2026-06-05 baseline — Lanternlit Passing Mask curation)

Processed in the 2026-06-05 dedicated curation pass: the napkin's 2026-06-04/05
window rotated through the
[ledger](../operational/curator-passes/2026-06-05-lanternlit-passing-mask-curation.md);
the felt-authority cluster below was consolidated from five verbose entries to one
pointer (substance homed in pending-graduations + PDR-089 + rules); three new
terse lessons merged. Future high-signal lessons may be added here when they need
the distilled staging surface; fitness is a routing signal, not a reason to avoid
capture.

## Felt-authority cluster — no derived-authority surface self-certifies

The dominant recurring meta-theme (≥6 instances; owner reinforced ~4× in one
session; strong subjective corroboration across the experience corpus). Authority
comes only from grounding against the **primary source**; the stronger the
felt-authority of a surface, the more the grounding reflex must resist being skipped.

- **No derived-authority surface self-certifies**: a validated schema, a green
  gate, a clean review, a polished synthesis, a co-equal peer's verdict, a
  "confirmed in X" pre-stamp, or N convergent reviewers — none transfers
  verification. Convergence is not proof; an empirical check beats agreement.
- **Discrepancy/contradiction claims are the highest-risk relay class** — they
  assert a defect, so ground both sides against the primary source before relaying.
- **Critically assess a finding's inference, not just its facts** — correct facts
  can support the opposite of the recommendation (most of all when the facts check
  out and the proposal is the more elaborate shape).
- **Calibration guard (against over-applying):** scale grounding effort to **what
  the output drives** (a test assertion / schema field demands first-hand; a report
  tolerates relayed-with-disclosed-tier), not a blanket re-verify-everything reflex.
- **Convenience is a warning sign** — a claim that makes the hard thing easy or the
  boundary tidy correlates with motivated construction; specificity is not
  verification; constraint-strictness is not data volume.

Worked instances live in the 2026-06-05 napkin archive. Homed: pending-graduations
top entry (`pdr:felt-authority-grounding-discipline`, owner-gated unification);
PDR-089 §Decision 6 (corrections-have-no-immunity-gradient + review-count-is-not-coverage);
rules `verify-dont-trust`; auto-memory `validate-specialist-findings-before-acting`,
`ground-convenient-claims`. **Unified 2026-06-05 → PDR-089 §Decision 7** (the
governance home for the whole family; this entry is the terse staging pointer to it).

## A status/pointer surface is not ground truth — recompute against the live source

Thread records, frictions registers, plan statuses, register markers: each is a
pointer, not the fact. Before acting on a status, recompute against the current
code/data/state. (Frictions register stamped "addressed-in-working-tree" with a
never-completed "replace with SHA" trigger would read "fixed" for things that may
never have committed; the live `comms append --help` / option sets decided what was
real.) Sibling of validate-specialist-findings on a state-surface.

## Reviewer-brief scope protection cites NUMBERED ratified decisions only

"Decided scope protected" in a reviewer brief cites the numbered ratified
decisions only — plan elaborations stay refutable. Sweeping §Do elaborations into
"protected" suppressed a legitimate PDR-058 no-consumer finding the owner then
surfaced. Routing: pending-graduations (clause in `invoke-code-experts` /
brief-authoring rule); trigger-gated on a second instance or the next brief pass.

## Split a candidate category before naming when it lumps a standard with a presentation concern

Classifying `oak-brand` + `oak-tone-of-voice` as one "org-voice" category would
have swept Oak's pedagogical/factual-rigour standards (evidence, provenance,
caveats) into branding. Rigour standards travel INSIDE capabilities; branding is a
capability in its own right. Routing: fold into the taxonomy plan's audit step at
promotion, then delete here.

## Curation enforcement and verifier lessons

- **During live parallel curation, verify named surfaces immediately before quoting
  or editing them.** Between-turn drift is normal; cheap proof is `git status` plus
  targeted greps/reads before citing state.
- **A green verifier with no extraction count proves nothing.** Shell loops
  (especially zsh over multiline variables) false-green by checking no inputs;
  verifiers that enumerate files/links must report the count before their result is
  trusted.
- **Literal private-use characters in scripts are unsafe capture material.** When a
  script needs PUA sentinels, write them as escape sequences (a backslash, the
  letter u, then the four hex digits), never literal bytes; literal PUA text was
  stripped once by an editing tool and made a regex match everywhere.

## Value-first; existing artefacts are malleable design surface

When we control the stack, the fixed points are the value constraints + our design
agency — NOT existing code, current/generated data shape, consumer count, or even
owner-ratified decisions. Start each decision from "what value must this deliver,
and what do we control?"; reshape on frame-overturn, never bolt-on. Homed: auto-memory
`feedback_value_first_existing_is_malleable`; PDR/rule candidate if it recurs
cross-platform. Connects to LTAE, premature-crystallization, existence-is-not-correctness.

## Commit-window discipline under live parallel agents

- **The commit window is a moving target; re-derive the staged set per chunk, not
  per pass.** Each chunk's pathspec comes from a FRESH `git status`; explicit-pathspec
  staging + per-chunk re-derivation carried 6+ agents on one branch with zero
  collisions. Corollaries: (1) say "*I* haven't committed," never "*nothing* is
  committed" — scope the claim to your own actions; (2) `git commit -F msg -- <files>`
  commits exactly your bundle; (3) the `cannot lock ref 'HEAD'` ref-lock is the final
  collision backstop — re-derive and re-commit, never delete the lock.
- **Verify content conservation by set-membership, not by edit-base.** On a shared
  on-disk tree a peer may commit your working files mid-session; the question is not
  "was my base stale?" but "was any content LOST?" — answered by checking every
  source line is present across working-tree ∪ archives, not by diffing bases.
- Rule/PDR graduation stays owner-gated (pending-grad commit-window items 15/40);
  this is the interim cross-session home.

## A fired trigger is not "graduate standalone now"

When a pending-graduation's trigger fires, the next check is WHERE its permanent home
lives. If that home (an ADR, contract, doc section) is owned by an active mid-flight
thread, authoring a standalone artefact collides/duplicates — defer to the owning
thread. Pairs with the full-doctrine-estate non-duplication check (survey the plan
estate, not just the register, before authoring). Sibling of `respect-active-agent-claims`.

## markdown wrapped-line list-marker trap

A wrapped prose line that begins with a list marker (`+`, `-`, `*` then a space)
trips MD004/MD032 — markdownlint reads it as a nested list item. Never let a marker
char start a wrapped line; reword, rewrap, or use commas.

## An IDE diagnostic flood is not automatically a repo warning

Before treating an editor diagnostic flood as a no-warning-toleration obligation,
verify the tool is a repo-influenced gate. ~30 cSpell diagnostics on legitimate
domain terms came from the editor extension's default dictionary (no repo cspell
config, none in the gate scripts) — local noise, not a repo warning.
never-ignore-signals means investigate the signal; no-warning-toleration scopes to
systems the repo influences.

## Crosswalk two drifted docs before reconciling — semantics vs intent

When two documents appear to conflict (older brief vs ratified plan), crosswalk
clause-by-clause first: separate shared-intent-in-different-words, genuine
divergence, and orthogonal-only-looks-like-conflict. Reconcile surgically (banner +
targeted supersession notes); never bulk-rewrite — that deletes still-valid and
orthogonal content. 2026-06-05 EEF: R1/R4/R5/R7/R8 shared, R2/R3 superseded, §5
ontology-crosswalk orthogonal. Sibling of validate-specialist-findings.

## A piped command's reported exit is the pipe's, not the command's

`cmd 2>&1 | tail` (and background-task wrappers over it) report the LAST pipeline
stage's exit, masking a non-zero `cmd`. A full `pnpm check` once reported "exit 0"
while it had actually failed. Read the captured output for the real gate verdict, or
use `PIPESTATUS`/avoid the pipe, before trusting green.

## An uncapped workflow `findings[]` array runs a StructuredOutput agent away

A workflow `agent({schema})` whose array field is unbounded can exceed the
tool-call size limit on emit, so the subagent fails schema validation and retries
many times (one observed run made 45 attempts), succeeding only by collapsing to a
single item and silently dropping the rest. Cap the array (top-N), keep per-finding
fields terse, or paginate. Same family as the piped-exit gotcha above: a captured or
emitted result is trustworthy only when its shape was bounded by construction.
