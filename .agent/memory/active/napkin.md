---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation summary is archived at
[`archive/napkin-2026-05-06-evening.md`](archive/napkin-2026-05-06-evening.md);
the pre-step napkin from the same pass is at
[`archive/napkin-2026-05-06.md`](archive/napkin-2026-05-06.md).

## 2026-05-06 — Briny Plumbing Fjord / claude-code / opus-4-7-1m / `fd36cf`

### Insight: graduation-flow inertia produces wrong-file landings

The deep-exploration read on `collaboration-state-lifecycle.md`
converged on one repeating pattern: substance had accumulated by
*adjacency to existing sections* rather than *first-principles
match to substance-kind*. Concrete: apparently-orphaned-claim
policy landed here because §Archive Stale Claims was nearby
(doctrine clauses belong in the directive); §Schema-Field
Provenance was moved from conventions.md but is field-level
metadata for the schema; §Claims preamble carries doctrine that
gates *all* shared-state mutation, not claim opening.

**Cure**: a *placement contract* authored before the next
graduation, not a report after. Lives at
`.agent/memory/executive/collaboration-state-placement-contract.md`.

**Session-shape diagnostic**: one repeating shape across N
findings → graduate the shape as a contract. *One pattern →
contract; N independents → report.*

### Surprise: "doctrine-scanner CLI" gating is vaporware-shaped

**What I expected**: distilled.md's `Sequenced-Deferral Discipline`
entry was held under owner-set gating ("PDR-026 amendment sequenced
behind enforcement infrastructure — doctrine-scanner CLI extension")
and would graduate when the enforcement infrastructure landed.

**What happened**: owner audit. The doctrine-scanner CLI lives in
`future/memetic-immune-system-and-progressive-disclosure.plan.md`
with promotion gates that have not fired and are conditional on
`current/doctrine-enforcement-quick-wins.plan.md` landing six
workstreams green PLUS a consolidation pass identifying that the
existing `check-blocked-*.ts` script count justifies consolidation
PLUS a second instance of citation discipline. Three compound gates
that must all fire. The amendment is functionally indistinguishable
from "later" — the precise failure mode the discipline names. The
held-deferral cited itself out of accountability.

**Lesson**: a sequenced deferral whose gating mechanism is in
`future/` with unmet compound promotion gates is a *hidden
declaration of non-action* wearing the costume of a sequenced
deferral. The second shape is more dangerous than the bare "we'll
do X later" because it looks like discipline. Audit fence:
permanent-doc deferrals must point at `current/` or fully-promoted
`future/` plans; pointing at `future/` with unmet promotion gates
is the failure mode the discipline forbids. Updated distilled.md
in this session to acknowledge the vaporware-citation issue
explicitly; the PDR-026 amendment now graduates without the
vaporware gating in the next directive-edit session.

### Surprise: learning-loop framing was inherent-cost not artefactual-cost

**What I expected**: graduate the entry "Cyclical learning-loop
maintenance is a full-time process even at small N" to
`agent-collaboration.md` or a PDR amendment as written.

**What happened**: owner reframed mid-session. The cost is not
inherent to the loop; it is artefactual — the symptom of letting
fitness pressure accumulate across sessions instead of each session
running its own handoff plus consolidation at close. Per-session
closure discipline is the steady-state; reactive graduation passes
are recovery work after closure was skipped. Already a current/
plan addressing this shape:
`learning-loop-negative-feedback-tightening.plan.md`.

**Lesson**: when an observation about "cost" surfaces, re-ask the
first question. The new
`re-apply-first-question-at-elaboration-boundaries.md` rule
(written earlier in this same session) names exactly this case:
a finding that asserts inherent cost may be a symptom of poor
discipline. The reframe is the work; the original framing is not
something to graduate, it is something to correct. Distilled.md
entry rewritten in this session to the closure-discipline framing.

### Observation: foreign-stage absorption recurred at commit `cc8866a8`

I edited `docs/governance/development-practice.md` during the
graduation pass; the parallel principles.md-extraction agent's
commit (subject "docs(principles): extract compiler-time types
guidance") absorbed my working-tree edit into their staged bundle.
My edit landed in HEAD under their commit subject, so the
graduation provenance is split: the new rules and distilled trim
landed under `docs(practice): graduate distilled.md to rules and
governance docs`; the dev-practice graduations landed silently
under the typescript-extraction commit. Substance gain; ceremony
loss — same shape Dawnlit Transiting Galaxy logged 2026-05-05.
Coordination cure named in the agent-collaboration directive
(`git commit -- pathspec`) was not used by the peer.

### Correction: `/doctor` is session-local evidence, not a shell gate

During urgent skill-load pressure relief, I initially framed the blocked
evidence as "Codex cannot get non-interactive `claude doctor` output".
Owner clarified the sharper point: `/doctor` reports on skills loaded into
the active Claude Code session, so command-line invocation would not prove
the session skill surface anyway.

Behaviour change: plans should not make shell `claude doctor` a validation
gate. Treat `/doctor` counts as optional owner-supplied session-local
evidence; validate settings changes through repo-local gates and explicit
settings/plugin diffs.

## 2026-05-06 — Cindery Charring Pyre / cursor / GPT-5.5 / `e220de`

### Surprise: markdown exact-prose checks are implementation tests

**What I expected**: deterministic validation for ADR/README propagation could
use `rg` checks for required phrases, mirroring code-surface checks.

**What happened**: the owner corrected that this precisely constrains markdown
implementation rather than documentation behaviour. The useful behaviour is
that the decision is discoverable and accurate; exact phrasing is incidental.

**Lesson**: for prose artefacts, acceptance criteria name the decision and
audience outcome; validation is reviewer/read-through plus formatting/link
hygiene. Reserve executable tests and `rg` guards for code contracts, generated
surfaces, or forbidden runtime exposure, not markdown sentence shape.

## 2026-05-06 — Umbral Cloaking Silhouette / claude-code / opus-4-7-1m / `a70b57`

### Surprise: reviewer brief scope opened a closed decision

**What I expected**: invoking `assumptions-reviewer` on a multi-phase plan
would surface execution-quality findings (cycle independence, dependency
graph correctness, build-ordering) — the meta-level shape per its named
remit.

**What happened**: the brief I drafted asked "is the plan over-scoped?" as
the lead proportionality question. Owner had directed the comprehensive
scope earlier in the same session ("the remediation plan must include
moving all skills, rules, hooks, commands and related concept management
into a new agent-tools CLI/CLI-section"). Reviewer dutifully answered the
question I asked, returning a "reshape before Phase 0" verdict. I relayed
the verdict as if the decision were open. Owner correction: *"I didn't
ask for an analysis of if this was the right direction, only for how to
achieve it and to flag any major problems. I have already decided we are
going this route. […] some of the effort here was wasted in examining
closed decisions, rather than figuring out the best way forward."*

**Lesson**: When dispatching reviewers on plans where direction is fixed,
brief them on **execution-legitimacy-given-decisions**, not
**decision-validation**. Saved as
`feedback_reviewer_brief_respects_decided_scope.md` in user-memory with
diagnostic signal: if a relay reads "reviewer says X; should we reshape?"
on a directed topic, the brief was at the wrong scope. Feel it at
brief-time, not relay-time.

**Diagnostic for next time**: before drafting any reviewer brief, list
the owner-fixed decisions in the session and explicitly tell the
reviewer those are out of scope.

### Surprise: `npx skills` already ships the full lifecycle

**What I expected**: when proposing a build of `add / list / update /
remove` for vendor-skill management, that would be a from-scratch CLI.

**What happened**: `npx skills` (vercel-labs/skills) ships exactly that
verb set end-to-end. The build-vs-buy attestation in the strategic plan
§0.2 had dismissed it on canonicalisation grounds without doing the
verb-by-verb comparison. The right shape is a **wrapper around
`npx skills` plus our canonicalisation post-step**, not a parallel
implementation.

**Lesson**: build-vs-buy attestations need verb-by-verb comparison, not
"insufficient because it doesn't do X" dismissals. The repo's
build-vs-buy memory rule already says this; the gap was that I treated
the attestation step as a checklist item rather than the structural
question it is.

### Note: bootstrap fast-path was missed at session open

I did not register an active claim or post a "no other agents present"
comms event at session open. The session edited many files. Per memory
rules, no backfill — recording the omission here as honest signal,
not retroactively registering. Agent-tools session-open registration
remains a recurring failure mode for sessions that begin as light
audits and grow.

## 2026-05-06 — Hidden Slipping Moth / claude-code / opus-4-7-1m / `4be7b5`

### Surprise: rule extension introduced a self-violation in the same change set

**What I expected**: extending `no-moving-targets-in-permanent-docs.md`
with a new "Citation Directionality: Permanent → Ephemeral Is Forbidden"
section was a clean substance-preserving graduation from distilled.md.

**What happened**: the rule's own `## Source Landing` footer at file
end already read `WS4 of doctrine-enforcement-quick-wins.plan
(2026-05-04)` — directly violating the new clause as soon as the
clause landed. The change set authored the prohibition and the
violation in the same commit. Both reviewers (docs-adr + code) flagged
it as P1. Removed the footer in a follow-up commit; provenance lives
in git history.

**Lesson**: when extending a rule with a new prohibition, scan the
*entire rule body* for instances of the new prohibition before
committing. Pre-existing self-violations are the exact failure mode
the new clause exists to prevent; missing them invalidates the
extension's first-day credibility. Add to reviewer brief on rule
extensions: "audit the rule body itself for instances of the new
clause".

### Surprise: commit-queue fingerprint recursion when claim file is in staged set

**What I expected**: the commit-skill protocol (claim → enqueue →
stage → record-staged → verify-staged → commit) would converge
straightforwardly when active-claims.json was part of the staged
bundle (which it must be, because the queue entry lives there).

**What happened**: `record-staged` writes `staged_bundle_fingerprint`
into the working-tree active-claims.json, creating an `MM` split
(staged content has no fingerprint; working-tree has fingerprint).
Re-staging active-claims.json to "include the fingerprint" then
breaks `verify-staged` because the staged content now differs from
what was hashed. The loop never converges — every record-staged +
re-stage iteration shifts the fingerprint.

**Workflow that works**: stage all files including active-claims.json
(with queue entry but no fingerprint). Run `record-staged` once. Do
NOT re-stage active-claims.json afterwards. `verify-staged` reads
the fingerprint from working-tree and recomputes from staged; they
match because staged hasn't moved. Commit; the fingerprint never
needs to land in history.

**Lesson**: the queue-tooling-self-modifies-its-own-state-file
recursion is a tool ergonomic gap, sibling to F-12/F-13. Already-
present friction, but not yet documented in the commit skill body
or the queue CLI help text. Candidate for tooling-friction register
addition (F-15?) and SKILL.md clarification.

### Note: Phase 0 in same session as plan authoring is viable when contract is small

The strategic plan landed in this session, then owner directed Phase 0
(authoring the operationalisation contract directive) be run in the
same session. Worked because the contract content was already drafted
in the plan body and the directive landed at 171 lines (within Level-1
discipline). The pattern requires (a) explicit owner pre-alignment,
(b) the contract being self-illustrating in scale, (c) the plan body
already containing the substantive contract content. Not a default —
the standing 30%-context rule for directive-file work still applies;
this session's directive was authored at ~85% context but only because
the substance was already drafted.

### Practice/tooling feedback

- **Surface**: `agent-tools:collaboration-state comms send`
- **Signal**: surprise
- **Observation**: `comms send` wrote my event, then failed rendering
  because one older comms-event used top-level identity fields instead
  of the current `author` object shape.
- **Behaviour change / candidate follow-up**: render should either
  tolerate legacy event shape with a migration warning, or the checker
  should surface the offending event path before the write attempt.
  I repaired `cd25a954-f569-4f7b-8d1e-f1fe9eed5dd7.json` mechanically.

### Mistake: misread pending-graduations list style

- I mistook the working-tree `+` bullet in `pending-graduations.md`
  for a stray diff marker and changed it to `-`. The pre-commit
  markdownlint hook correctly rejected the file because the local list
  style is `+`. Behaviour change: when a diff shows `++` at the start
  of a line in markdown, inspect the file content before "repairing"
  it; one `+` may be the intended bullet marker.

### Session handoff + light consolidation closeout

- Owner asked for `/jc-session-handoff` followed by light
  `/jc-consolidate-docs` after the quota-recovery commits. The light pass
  found no entry-point drift, no track cards, no escalations, one unchanged
  open example decision thread, vocabulary green, and inherited HARD
  fitness pressure in `principles.md`, `distilled.md`, and
  `pending-graduations.md`.
- `claims open` accepted repeated `--area-pattern` flags but kept only the
  last pattern in the authored claim. I repaired the claim entry before
  editing. Owner correction: manual claim editing is tooling friction and
  must be preserved with analysis. Root cause: I inferred repeatability from
  neighbouring path flags, while the parser appears to treat `area-pattern`
  as scalar last-write-wins. Tooling route: F-14 added to
  `.agent/plans/agent-tooling/frictions-register.md`; likely cure is
  repeatable `--area-pattern` support plus help text and regression tests,
  or an explicit duplicate-flag rejection if single-pattern is intentional.
  Behaviour change: after using the collaboration-state CLI for a multi-file
  claim, inspect the claim JSON before relying on it as evidence.
