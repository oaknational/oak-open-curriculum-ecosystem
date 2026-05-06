# Memetic Immune System and Progressive Disclosure — Strategic Plan

**Status**: NOT STARTED — strategic backlog
**Created**: 2026-05-04
**Conceptual anchor**: [PDR-044 — Memetic Immune System](../../../practice-core/decision-records/PDR-044-memetic-immune-system.md)
**Companion executable plan**: [doctrine-enforcement-quick-wins.plan.md](../current/doctrine-enforcement-quick-wins.plan.md) (lands the first innate-immunity layer)
**Related governance**:
[PDR-018 §Beneficial prerequisites must not block](../../../practice-core/decision-records/PDR-018-planning-discipline.md);
[PDR-038 §2026-05-04 amendment — doctrine without enforcement at maturity](../../../practice-core/decision-records/PDR-038-stated-principles-require-structural-enforcement.md);
[PDR-039 — external findings reveal local detection gaps](../../../practice-core/decision-records/PDR-039-external-findings-reveal-local-detection-gaps.md);
[ADR-135 — Agent classification taxonomy](../../../../docs/architecture/architectural-decisions/135-agent-classification-taxonomy.md)
(the practice trio is named in §Practice Domain: Three Agents).

---

## Problem and Intent

PDR-044 names a two-layer immune system: an **innate** layer
(deterministic, fast, broad, write-time and commit-time scanners) and
an **adaptive** layer (cognitive, contextual, learning, consolidation-
time and post-incident-review). The companion
[`doctrine-enforcement-quick-wins.plan.md`](../current/doctrine-enforcement-quick-wins.plan.md)
lands the first six fingerprints of innate immunity. This plan is the
strategic roadmap for the work that builds on that foundation:

1. **Adaptive immunity** — a process-executor agent that runs at
   consolidation cadence, recognises substantive pathogens that
   evade surface signatures, and registers new fingerprints with
   doctrinal citations.
2. **Practice trio activation (additive)** — `practice` (gateway),
   `practice-applied` (deep, this-repo doctrine consultant), and
   `practice-core` (deep, lifecycle and learning loop). Currently
   gated in the existing taxonomy plan behind a coordinated
   multi-platform rename. Per PDR-018 §"Beneficial prerequisites
   must not block", the rename is `beneficial`, not `blocking`. The
   trio can ship as additive new agents and the rename can run on
   its own schedule.
3. **Doctrine-scanner CLI** — consolidate the
   `check-blocked-*.ts` scripts into a single vendor-agnostic CLI
   with structured JSON output, citation-based reporting, and a
   commit-skill integration that surfaces detections for cognitive
   disposition (per PDR-044 §"soft-report the substantive class").
4. **Triggered rule loading (progressive disclosure)** — pilot a
   trigger-declared rule loading model on `invoke-*-reviewer` rules.
   The current load-everything-always model is bounded by the
   doctrine surface size; at maturity the bound is being exceeded.
   A pilot tests whether progressive disclosure reduces context
   cost without producing silent rule-misses.

The work is a coherent set: each item operationalises one aspect of
PDR-044 or supports the cost reduction PDR-038 §2026-05-04 amendment
requires.

---

## Intent

Land the structural foundations that let the Practice scale beyond
its current contributor-attention budget. Owner-stated rationale
(2026-05-04, post-`/insights` reflection): *the lines between the
Practice and the agents moving through it blur; complexity rises;
as the emergent intelligence of the repo grows, owner-attention
cannot keep on top of it. Enforcement, refinements, new
mechanisms, feedback loops, and self-awareness of drift become
load-bearing.*

The end goal is a Practice that catches its own pathogens
structurally, surfaces drift adaptively, and disclose its doctrine
progressively — so contributor and agent attention is freed for
substantive product work, not doctrine retrieval.

---

## Domain Boundaries

**In scope:**

- Adaptive-immunity agent (cognitive, contextual, periodic).
- Practice trio agent activation (additive shape).
- Doctrine-scanner CLI (vendor-agnostic, structured output).
- Triggered rule loading pilot (progressive disclosure).
- Citation discipline tooling — fingerprint registry, allowlist
  logging, calibration reports.

**Non-goals (YAGNI):**

- ❌ Replacing existing reviewer agents (the trio is *additive*).
- ❌ A single unified scanner that consumes ESLint output and
  policy.json output — these surfaces have different shapes; keep
  them separate.
- ❌ Full agent-roster taxonomy rename (separate plan, runs on
  its own schedule per PDR-018 §Beneficial prerequisites).
- ❌ Cross-platform parity beyond the platform-adapter contract
  already specified in ADR-125.
- ❌ Skill-attached rules refactor (deferred until triggered rule
  loading produces calibration evidence).

---

## Dependencies and Sequencing Assumptions

### Prerequisite (BLOCKING)

- The `current/` companion plan
  ([doctrine-enforcement-quick-wins.plan.md](../current/doctrine-enforcement-quick-wins.plan.md))
  must land first. Its six structural surfaces are the empirical
  evidence base for calibrating the broader scanner CLI and the
  citation discipline; without that base, the broader work would be
  speculative.

### Beneficial (NOT BLOCKING)

Per PDR-018 §Beneficial prerequisites must not block:

- The full agent-roster taxonomy rename. Cleaner with the rename;
  ships without it through the additive shape (new agents, no
  renaming of the existing 17).
- An adapter-generation tool. Cheaper migration with it; the
  additive shape ships without it.
- A practice-graph payoff peak pilot
  ([practice-graph-payoff-peak-pilot.plan.md](practice-graph-payoff-peak-pilot.plan.md))
  — the graph view would inform fingerprint registry shape; not
  required.

### Internal sequencing

The four scope items have an internal order based on which produces
evidence the next consumes:

1. **Doctrine-scanner CLI** consolidates the surfaces the
   `current/` plan lands; produces structured citations + allowlist
   logs; this is the empirical base for everything else.
2. **Practice trio activation (additive)** consumes the structured
   citations; `practice-applied` becomes the on-demand doctrine
   consultant referencing the citations.
3. **Adaptive-immunity surveillance agent** consumes the allowlist
   logs and the citation patterns; identifies fingerprint drift and
   new pathogen candidates.
4. **Triggered rule loading pilot** runs in parallel with 1–3 once
   the doctrine surface count is large enough to make the cost
   measurable (already true at maturity).

---

## Success Signals (what would justify promotion)

A given workstream promotes from `future/` to `current/` when:

### For the doctrine-scanner CLI

- The `current/` companion plan lands all six workstreams green.
- A consolidation pass identifies that the
  `check-blocked-*.ts` scripts have grown to a count where
  consolidation reduces complexity rather than introducing a layer
  (likely after WS3+WS4+WS6 land in the `current/` plan).
- A second-or-later instance of citation discipline is required
  (per `feedback_register_owner_direction_substance`, register on
  substance not instance count).

### For practice trio activation (additive)

- The `current/` companion plan lands.
- An owner direction confirms the additive shape (no rename) is
  the path forward — already implicit in the
  2026-05-04 owner-named pattern that produced PDR-018 §Beneficial
  prerequisites.
- A draft canonical template for `practice-applied` exists and has
  been reviewed by `assumptions-reviewer` for proportionality.

### For the adaptive-immunity surveillance agent

- The doctrine-scanner CLI lands and produces at least one
  consolidation pass of allowlist logs.
- The fingerprint registry has at least 10 entries (sufficient
  surface to surveil).
- A near-miss vaccination instance is captured in the napkin
  (validating the recognition path the agent will execute).

### For the triggered rule loading pilot

- A baseline measurement of session-open context cost exists. **First
  baseline captured 2026-05-05** at
  [`practice-context-cost-baseline.md`](../../../analysis/practice-context-cost-baseline.md);
  refinement targets named in §Refinement Targets of that file.
- An owner direction confirms a small reversible pilot is
  acceptable (the calibration risk is real per PDR-044 §autoimmunity
  safeguard).
- The `invoke-*-reviewer` rules carry their own triggers as natural
  pilot candidates (already true; their substance is "load when
  reviewer X is invoked").

---

## Risks and Unknowns

### Doctrine-scanner CLI

- **Risk**: consolidation introduces a new abstraction that obscures
  the simple shape of the `check-blocked-*.ts` scripts.
  - *Mitigation*: only consolidate when the script count exceeds the
    point where they are individually scannable. Until then, extend
    in place.
- **Unknown**: structured JSON output format. Should follow ESLint /
  similar conventions; settle at promotion time.

### Practice trio (additive)

- **Risk**: the additive shape produces two parallel surfaces
  (renamed and not-yet-renamed) and contributors are confused.
  - *Mitigation*: the trio is *new* agents; no existing agents are
    renamed under the additive shape. The confusion vector is
    reduced.
- **Unknown**: whether `practice-applied` produces value
  immediately or requires a fingerprint registry to consult. The
  `current/` plan lands the citation discipline; promotion is
  gated on that being present.

### Adaptive-immunity surveillance agent

- **Risk**: surveillance produces pattern-fatigue if it surfaces
  too many candidate pathogens.
  - *Mitigation*: citation-discipline gating means only doctrinally-
    anchored candidates surface; allowlist usage reports calibration
    drift, not false positives by default.
- **Unknown**: cadence — per-session, per-consolidation, weekly?
  Settle at promotion based on initial running.

### Triggered rule loading

- **Risk**: silent rule-miss when triggers are mis-calibrated.
  - *Mitigation*: pilot scope is `invoke-*-reviewer` rules only
    (already conceptually triggered); `pnpm rules:audit` and
    `pnpm rules:why` debug commands surface what fired and what
    didn't; the pilot is reversible.
- **Unknown**: trigger declaration format. YAML frontmatter is the
  obvious shape; settle at promotion.

---

## Promotion Trigger

This strategic plan promotes to `current/` when:

1. The companion `current/` plan
   ([doctrine-enforcement-quick-wins.plan.md](../current/doctrine-enforcement-quick-wins.plan.md))
   has landed all six workstreams green.
2. A consolidation pass produces structured evidence that the
   workstream named (scanner consolidation, trio activation,
   surveillance agent, or progressive disclosure pilot) is the
   highest-leverage next step.
3. Owner direction confirms the workstream is in scope for the
   next plan-authoring round.

Each of the four scope items may promote independently — they are
not bundled. The order in §Internal sequencing is recommended, not
mandatory; owner direction at promotion supersedes.

---

## Implementation Detail (Reference Context Only)

The text below is reference context from the post-`/insights`
reflection round. It informs the strategic intent above; it is *not*
an in-progress execution commitment. Execution decisions are
finalised only during promotion to `current/`.

### Doctrine-scanner CLI sketch

A vendor-agnostic CLI invoked from a portable git pre-commit hook
(`pnpm agent-tools:doctrine-scan` or similar). Inputs: a staged diff
on stdin or a file path. Outputs: structured JSON with `{ file, line,
pattern, citation, severity }`. Soft-block via report; hard-block
via exit code only for the irreducible class (destructive history
operations, hook-skipping flags). Wired into the commit skill as a
named pre-message gate.

### Practice trio (additive) sketch

Three new agents authored as additive entries in the existing
sub-agent template directory:

- `practice` — broad gateway, must-read tier: `index.md`,
  `AGENT.md`, the artefact inventory overview.
- `practice-applied` — deep, this-repo doctrine consultant.
  Must-read tier: ADR index, `invoke-code-reviewers.md`, the artefact
  inventory, quality-gate configuration, the fingerprint registry.
- `practice-core` — deep, Practice lifecycle. Must-read tier: the
  six practice-core files, ADR-124, ADR-131.

The existing 17 agents are not renamed under this scope. The full
taxonomy rename (ADR-135 Decision §Full Rename) runs on its own
schedule.

### Adaptive-immunity surveillance agent sketch

A `process_executor`-classified agent operating against the
practice's portable knowledge surfaces (recent commits, plan estate,
napkin, comms log). Cadence-driven (consolidation pass start, weekly
sweep, post-incident review). Produces:

- Candidate fingerprint additions (substance + recognition cue +
  doctrinal citation candidate).
- Calibration reports (allowlist usage rate per fingerprint).
- Vaccination samples (near-miss reports captured from napkin
  entries).

### Triggered rule loading pilot sketch

Add `triggers:` frontmatter block to existing rule files on a small
pilot set (the `invoke-*-reviewer` rules). Build a small loader hook
that reads the frontmatter and injects matching rules per turn.
Existing always-on rules unchanged. Measure context delta over a
calibration window. If cost is materially down without a silent
miss, expand. If silent misses appear, retreat.

---

## Scope Expansion Register

Items deliberately deferred from the first measurement pass. Recorded
here so the scope is visible and not absorbed silently into adjacent
work. Each item is gated on baseline-driven evidence before promoting
to executable scope; the first baseline is at
[`practice-context-cost-baseline.md`](../../../analysis/practice-context-cost-baseline.md).

### 1. Agent-tools CLI for passive harvest + token estimation

**Substance**: a vendor-agnostic CLI (likely
`pnpm agent-tools:context-cost` or similar) wrapping the passive-harvest
methodology described in the baseline file. Inputs: a session JSONL
path or directory, optional date range, optional file-glob for the
always-on tier estimate. Outputs: structured per-file + aggregate
token estimate.

**Promotion gate**: a second consumer of the harvest logic emerges
(cross-platform aggregation, automated baseline refresh, or CI
fitness-pass extension). Until then the bash one-liner in the baseline
methodology is sufficient.

**Eventual home**: `agent-tools/` workspace.

### 2. Token-estimate fields in standard fitness frontmatter

**Substance**: extend the fitness frontmatter schema to include
`fitness_token_target` and `fitness_token_limit`, mirroring the
existing `fitness_line_target` / `fitness_line_limit` /
`fitness_char_limit` shape. Surfaces the meaningful unit (tokens)
alongside the proxy units (lines, chars).

**Promotion gate**: owner direction confirmed (2026-05-05); schedule
to be set by owner.

**Eventual home**: fitness validator schema and all files currently
carrying fitness frontmatter.

### 3. Fitness reporter renders tokens alongside chars

**Substance**: extend the fitness report
(`pnpm practice:fitness:informational` and the strict-hard variant) to
surface estimated token counts in the per-file rows. Token counts
derive from `chars / 4` until a more accurate estimator is wired in.

**Promotion gate**: depends on §2 (fields exist in schema) for
target/limit comparison. The informational figure can land
independently before targets are authored per file.

**Eventual home**: the fitness reporter implementation.

### 4. Fitness frontmatter mandation across agent guidance files

**Substance**: extend the existing fitness-frontmatter convention to
include all agent guidance files: rules (`.agent/rules/*.md`), skills
(`.agent/skills/**/SKILL.md`), commands (`.agent/commands/*.md`),
practice-core surfaces. Entry points (`CLAUDE.md`, `AGENT.md`) remain
exempt — they are already simple pointers under existing discipline.

**Promotion gate**: baseline data (refinement targets ⇒ multi-session
aggregation) identifies guidance files whose size warrants per-file
targets/limits rather than uniform treatment; three+ files showing
meaningful divergence from a uniform default justifies the cross-cutting
mandate.

**Eventual home**: rule, skill, command, and practice-core file
authoring conventions; documented in
[`extending.md`](../../../../docs/engineering/extending.md) or successor.

---

These four items collectively are the in-scope expansion enabled by
the first baseline pass. They are NOT promoted by this baseline; they
are recorded so subsequent owner direction can sequence them against
empirical evidence.

## References

- [PDR-044 — Memetic Immune System](../../../practice-core/decision-records/PDR-044-memetic-immune-system.md)
- [PDR-038 §2026-05-04 amendment](../../../practice-core/decision-records/PDR-038-stated-principles-require-structural-enforcement.md)
- [PDR-018 §Beneficial prerequisites must not block](../../../practice-core/decision-records/PDR-018-planning-discipline.md)
- [PDR-039 — external findings reveal local detection gaps](../../../practice-core/decision-records/PDR-039-external-findings-reveal-local-detection-gaps.md)
- [ADR-135 — Agent classification taxonomy](../../../../docs/architecture/architectural-decisions/135-agent-classification-taxonomy.md)
- [practice-context-cost-baseline.md](../../../analysis/practice-context-cost-baseline.md)
  — first baseline measurement (2026-05-05); evidence surface for the
  Workstream 4 promotion gate.
- [doctrine-enforcement-quick-wins.plan.md](../current/doctrine-enforcement-quick-wins.plan.md)
- [agent-classification-taxonomy.plan.md](agent-classification-taxonomy.plan.md)
  (the existing taxonomy-rename plan; this strategic plan does *not*
  block on it)
- [adapter-generation.plan.md](adapter-generation.plan.md)
- [practice-graph-payoff-peak-pilot.plan.md](practice-graph-payoff-peak-pilot.plan.md)

---

## Note on Scope Discipline

This is a strategic plan. It does not contain executable workstreams
or TDD cycle pairs. The four scope items will each receive their own
executable plan when promoted to `current/`, at which point TDD
cycle structure, acceptance criteria, deterministic validation, and
quality-gate sequencing will be authored against the specific
substance of that workstream.

The temptation at strategic-plan time is to pre-author execution
detail. Per PDR-018 §"Beneficial prerequisites must not block" and
ADR-117's document-hierarchy discipline, the strategic brief
intentionally stops at intent + sequencing + promotion triggers.
