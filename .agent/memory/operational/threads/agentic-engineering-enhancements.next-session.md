---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
# Next-Session Record — `agentic-engineering-enhancements` thread

Practice continuity and temporary knowledge-curation. This is not a product
implementation thread. The full 142-session history (curation passes, the
feedback-mechanism arc, taxonomy work) is retained in git and in the
[`curator-passes/`](../curator-passes/) ledgers; this record carries the live
work brief and the recent identity stretch, per
[`continuity-practice.md` §Disposition](../../../directives/continuity-practice.md).

## Decision-Debt Lane — Next-Session Pickup (updated 2026-06-16, Lapwing holds Troposphere)

**LANDED + PUSHED this session** (`docs/planning-and-validation`, in sync with origin — commits
`8665da651` + `3cb64da91`): the fitness enforcement model is now **report-only** — every fitness
signal (size, decision-debt count, dwell, config findings) is a prioritisation signal that never
fails a build (validator always exits 0; `getExitCode` removed as **dead** enforcement — verified
no hook / CI / `check` ever consumed it). Decision-debt uses **discrete ceiling** thresholds (count
`target 0, soft 2, hard 3`; critical = beyond hard) — NOT the size ratio (fractional ×1.5 is a
category error on small integers) — plus a **dwell-time axis** (`fitness_item_dwell_*`,
oldest-undecided age in days; register `2 / 4 / 7`), classified by one axis-agnostic engine
(`classifyDiscreteZone`). New module `dwell.ts`. ADR-144 reframed (gate→signal, semantics-not-
severity), PDR-100 Decision 3 reconciled, register frontmatter + agent-tooling plan updated.
Reviewers RUN (docs-adr, assumptions, config, test); findings absorbed (doc contradictions swept;
declines reasoned). Prior "add run.unit.test for exit-code folding" is MOOT — the fold was removed
(report-only). The plan `pending-graduations-schema-and-count-fitness.plan.md` is implemented,
ready to archive.

Also landed (committed): three structural cures for the fluency/grounding failures this session
demonstrated — **citation-or-silence** (`verify-dont-trust`), **no-mutable-state-in-memory**
(`per-user-memory-is-a-buffer`), and the **Second Question** ("would this be simpler if the system
changed?", owner-added to `AGENT.md`).

**THE UNDONE CORE — owner-confirmed NEXT SESSION:** the register still reads **72 / critical**;
**ZERO of the 72 have been decided.** The instrument is sharper now (dwell + ceilings rank urgency)
but the debt is untouched. DRAIN: decide each of the 72 first-hand under the strict lens. Expect
many REJECTS (legacy single-instance "keep-watching" candidates) but the disposition is **per-item,
not a presumption** — before rejecting, verify the item's insight is conserved in a durable home
(15/18 "covered" claims were once false). Commit per batch. Do NOT build WS-OM before draining.

**Open question (cadence anchor — see `open-questions.md` Q-001):** fitness is report-only, so
nothing *runs* `practice:fitness` at a gate — what cadence anchor ensures the signal is read at
handoff/closure? Report-only is only as live as its invocation (assumptions-expert flagged).

**Owner answer (2026-06-16):** the abolition is propagated across all knowledge-flow doctrine
surfaces (briefs, skills, register, continuity, drain plans — done this session). The SEPARATE
owner-authority concepts that share the word (PDR-006 tool-nomination, plan-promotion / PR-merge
gates, `--no-verify` / limit-raise / Core-edit safety controls, Sonar authorisation) are surfaced
to the owner for an explicit scope decision — NOT auto-purged.

**Antipatterns I enacted (named so the next agent watches for them):** activity-bias /
mechanical-sequence — I ran a satisfying mechanism sequence and decided 0 items (I literally edited
`patterns/mechanical-sequence-is-activity-bias-diagnostic.md`, `comprehensive-cataloguing-drift.md`,
and `feel-state-of-completion-preceding-evidence-of-completion.md` while enacting all three);
reviewer-skipping under momentum (permanent doctrine committed unreviewed); soft-default (deferred
the hardest work — draining — behind comfortable machinery). Cure: drain first, build later; get
the reviews onto what is already committed.

## Current Continuation

**Curation state (2026-06-12, Thyme wakes Canopy / claude Fable 5 / `70655e`, dedicated
consolidation; uncommitted working-tree edits — commit control rests with the live
onboarding lane per owner direction)**: **THE APPROVED-UNAUTHORED QUEUE IS FULLY AUTHORED**
— PDR-092 (mechanical firing moments) + PDR-093 (self-correcting deliverables + the plan
skill drafting clause); amendments to PDR-064 (shadow period, standing-successor
authorisation + citable-gate test, Director closeout; Proposed → Accepted), PDR-011
(voluntariness + holder-exclusive loss-scan; ADR-150 mirrored), PDR-078 (§7 emit-side loop
hygiene), PDR-085 (instrument/discovery delivery); folds F1 (PDR-051 budget note), F2
(commit-skill lock-wait → no-contact), F5 (continuity-practice supersession clause); the
continuity-disposition candidate verified already homed (PDR-011 2026-06-08). The Core
CHANGELOG carries the pass. Same session: napkin rotated (critical cured; archive
`napkin-2026-06-12-thyme-curation.md`), distilled graduated (six new pattern files),
open-questions drained of two resolved entries, repo-continuity + this thread's eef sibling
condensed insight-conserved, three unbacked register pointers conserved as real entries.
**The ADR-131 pause-and-stabilise posture lifts when these edits land in a commit**; no NEW
Core restructuring candidates meanwhile. **Next curation move**: none queued — the next
dedicated pass fires on the consolidate-docs trigger checklist (decision-debt deltas waiting to
decide by the lenses: PDR-082 second-instance evidence; the PDR-081 ledger-clause contradiction).
The prior walk's record (Thermal Circling Updraft, 2026-06-11) lives in git history and the
register.

**Concurrent lanes on this thread.** This thread is a multi-lane container, not a single
linear next-step: the lanes below are independent and can be picked up **in parallel** — by
different checkouts, by separate agents, or collaboratively. Each carries its own state and
pickup trigger; neither blocks the other.

- **Lane A — feedback-mechanism follow-ons (active).** Branch `feat/graph-tooling-tidyup`;
  next is **WS1 → 2b → 2c → WS2** (full detail in the bullets and the Briny Plumbing Beacon
  banner below).
- **Lane B — skills standardisation review (deferred).** Next is the
  **PDR-051 reduced-implementation reconciliation review**. Pickup trigger: the owner review
  session, OR the first ingested external skill, OR promotion of the oversized-core
  decomposition brief. Inputs ready — owning plan §Reality Reconciliation gap ledger
  ([`agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md`](../../../plans/agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md)),
  friction F-37, the pending-graduations entry, and two future briefs
  ([decomposition](../../../plans/agent-tooling/future/skills-oversized-core-decomposition.plan.md),
  [eval harness](../../../plans/agent-tooling/future/skills-eval-harness.plan.md)). On a
  separate branch (committed `cbf01ae0`); not blocking and not blocked by Lane A.
- **Lane C — memory/state semantic merge strategy (decided 2026-06-15; ADR
  pending).** git merges lines, but `.agent/memory` and `.agent/state` files carry
  semantic invariants git cannot see (a JSON set keyed by `claim_id`; a markdown
  file with exactly one Current State block; an append-only narrative buffer; an
  additive identity table) — a textually-clean merge can be semantically wrong.
  Owner-walk decision (2026-06-15): adopt a TIERED approach, preferring the lowest
  tier that works. **Tier 1** — conflict-free by construction (the immutable,
  content-addressed, one-file-per-event comms store already is this; push more
  state toward it). **Tier 2** — schema-driven git `merge=<driver>` drivers for the
  structured registries (`active-claims.json`, `closed-claims.archive.json`,
  comms-seen), making ADR-197's branch-authoritative-for-state policy semantically
  safe rather than textually hopeful. **Tier 3** — agent-driven merge for narrative
  state, emitting a REVIEWABLE diff (never a silent merge), ONLY as a last resort.
  Next: author the formal ADR (mechanism follow-on to ADR-197, which set the policy
  but assumed git's textual merge) plus the per-file-class merge-semantics audit and
  the merge-driver-vs-out-of-band-tooling decision. Pickup trigger: a fresh
  agentic-engineering session, or the next multi-writer state convergence needing it.
- **Lane D — rule-impact instrumentation (lane opened 2026-06-11).** Of the ~70
  rules injected via `CLAUDE.md`, which measurably change agent behaviour and earn
  their context cost? Prose rules have no firing event; hook-backed rules (write-time
  guards, secrets-scan on Read, PreToolUse gates) do execute and can be instrumented.
  Authorised scope: hook invocation fire-count logging only (the one mechanically
  measurable signal), routed to the agent-tools implementation lane; transcript-audit
  for behaviour-change attribution deferred until fire-count evidence exists. Informs
  the ~80k reliably-loaded context budget — the evidence needed to move inert rules
  on-demand or retire them. Lane A's 2b reappraisal-cartography pass remains the
  prose-rule rationalisation vehicle.

- **Branch**: `feat/graph-tooling-tidyup` — **clean and pushed** at HEAD `934d5c21`
  (re-derive git first-hand).
- **Live work (next non-curation session)**: the feedback-mechanism follow-ons, in sequence
  **WS1 → 2b → 2c → WS2**. The full brief and the un-homed design decisions are in the **Briny
  Plumbing Beacon banner** below — preserve it. **Its GATE-STATE / EEF-lint-precondition
  paragraphs were VOID** even before this session (ADR-193 made `EefEvidenceEnvelope` a strict
  `interface` + egress membrane, so the `consistent-type-definitions` lint is green-resolved;
  the branch is clean and pushed). Read Briny for the work; this block for the current gate.
  - **WS1** (`no-type-widening` ESLint rule) plan is at
    [`current/no-type-widening-enforcement.plan.md`](../../../plans/agentic-engineering-enhancements/current/no-type-widening-enforcement.plan.md).
    **Fixture caveat**: the EEF `new Set<string>(OBSERVED_PHASES)` widening that motivated the
    rule was since made zero-widening (`Set<DeclaredPhase>` / `Set<EefStrandId>`) — confirm
    against `graph-corpus-sdk/src/eef-strands/` first-hand; author a dedicated fixture if gone.
  - **2b** = the owner-approved 89-file `.agent/rules/*.md` reappraisal-cartography pass
    (discover cure per rule → cluster → discriminate collapse-candidate vs sharpen vs keep;
    do NOT auto-collapse — owner decides). **2c** = per-surface PDR-044 widening (ESLint
    now-eligible; rules-prose after 2b). **WS2** = tripwire wiring; coordinate with
    [`future/action-time-structural-interrupt-design-space.plan.md`](../../../plans/agentic-engineering-enhancements/future/action-time-structural-interrupt-design-space.plan.md).

> **🤝 Session Handoff (2026-06-07 — Briny Plumbing Beacon / claude / Opus 4.8 / `5dd58c`):
> item 2a LANDED (ESLint reappraisal enforcement); WS1 next**
>
> **Self-contained brief; the fresh session needs nothing from the originating conversation.**
> Owner-agreed sequence was 4 → 1 → 2 → 3; items 4 + 1 landed (Eclipsed, in git),
> **item 2a landed this session**, and the owner expanded scope: **do item 2 (all sub-passes)
> AND the no-type-widening rule, and do NOT wait for the EEF lane.** (The original
> GATE-STATE paragraph here — an EEF-lint precondition blocking commits — is VOID; see Current
> Continuation above.)
>
> **What landed — item 2a (ESLint custom-rule reappraisal enforcement):**
>
> - **Mechanism = compile-time-by-construction (NOT a validator, NOT a factory).**
>   `packages/core/oak-eslint/src/reappraising-message.ts`: a zod-branded `ReappraisingMessage`
>   type, minted only by `createMessage({prohibition, reappraisal})` via
> `z.string().brand().parse()`,
>   plus a `RuleWithReappraisingMessages<MessageIds, Options>` rule type that narrows
> `meta.messages`
>   to the brand. A **plain prohibition-only string now fails `tsc`** in any rule typed this way —
>   non-bypassable, no separate validator to drift, no bypass-guard needed.
> - **Why zod, not a hand-rolled brand:** the shared config bans assertions outright
>   (`@typescript-eslint/consistent-type-assertions: { assertionStyle: 'never' }`,
>   `packages/core/oak-eslint/src/configs/recommended.ts`), and the repo had **no existing branded
>   types**. A hand-rolled `as` brand is illegal; zod's `.parse()` is the only assertion-free mint
> and
>   matches the repo's z.infer / types-flow-from-schema doctrine. This is the **first branded type
> in
>   the repo**. Added `zod@^4.4.3` to `oak-eslint` deps + `tsup.config.ts` `external` (zod is NOT
>   inlined — verified `from 'zod'` in dist, 0 inlined source).
> - **All 6 `meta.messages` rules migrated** (`no-dynamic-import`, `no-eslint-disable`,
>   `no-export-trivial-type-aliases`, `require-observability-emission`, `max-files-per-dir`,
>   `no-real-io-in-tests`). Composed messages are behaviourally identical to the originals EXCEPT
>   `max-files-per-dir`, which **gained a cure it never had** ("Group related files into a cohesive
>   subdirectory…") — the owner's whole thesis, confirmed in the smallest case. `boundary.ts` uses
>   `no-restricted-imports` config `message:` strings (not `meta.messages`) and is **out of scope**.
> - **Green:** oak-eslint type-check, lint, 202 tests, build. TDD test-first
>   (`reappraising-message.unit.test.ts`, red→green). Reviewed at the unit boundary (not backfill):
>   **type-expert SAFE**, **code-expert APPROVED**, **test-expert PASS**. Applied: test assertions
>   pinned to product-owned substrings; zod externalised. **Caught one false positive** —
> code-expert's
>   "zod inlines ~46KB" did not hold (dist unchanged at 62KB; tsup externalises deps by default).
>
> **Decisions held in my context (loss-scan — reached no other durable surface):**
>
> - **Option C beat the factory** (assumptions-expert + architecture-expert-betty converged): a
>   rule-wrapping factory over-reached the M-sized approved capture and needed a fragile no-bypass
>   guard; compile-time brand is lighter AND stronger. Then zod-brand beat a hand-rolled brand
> because
>   of the `as` ban (above). Do not "simplify" this back to a hand-rolled brand — it will not lint.
> - **2b is RESHAPED and OWNER-EXPANDED.** The capture sized it "M"; it is actually an **89-file
>   corpus change** (`.agent/rules/*.md`), many flat-prose with no positive-direction section, so
>   "states a positive move" is **not mechanically checkable** without first imposing a structured
> slot
>   (a keyword heuristic was rejected as false-positive noise). **Owner approved the full 89-file
> pass
>   now.** Reframed as **doctrine cartography, not data-entry** (owner insight: *rules sharing the
> same
>   positive suggestion are collapse candidates*): (1) discover — author a sharp cure per rule; (2)
>   cluster by cure; (3) discriminate+surface each collision as genuine-redundancy (collapse
> candidate,
>   owner decides — do NOT auto-collapse, knowledge-preservation) vs coarse-cure-prose (sharpen,
> don't
>   merge) vs same-cure-different-concept (keep). The reappraisal is a **concept-key**: the
> cure-space
>   is lower-dimensional than the detection-space. Let collision density decide 2b's structure
> (dense →
>   shared concept→cure registry; sparse → per-rule section).
> - **Collision signal already found (feeds 2b):** within the ESLint surface,
> `no-real-io-in-tests`'s
>   three `bannedModule*` messages share one cure ("inject a fake instead"); `eslintDisableBanned` +
>   `tsDirectiveBanned` both cure to "fix the root cause".
> - **2c (PDR-044 widening) is PER-SURFACE**, not all-or-nothing: ESLint widening lands once 2a
>   enforces; rules-prose widening waits for 2b. Never state doctrine wider than enforcement reaches
>   (the amendment's own §Scope / PDR-038).
> - **The interlock binds the no-type-widening rule to the 2a enforcer existing** (now true), so
>   **WS1's message is authored via `createMessage` and is born teaching by construction** — costs
>   nothing extra.
>
> **Remaining work (sequence): WS1 → 2b → 2c → WS2.**
>
> 1. **No-type-widening WS1** (next). A type-aware rule in `oak-eslint` flagging `Set<string>` /
>    `readonly string[]` views over an `as const` literal-union array, steering to
>    `xs.some((x) => x === value)`. **Author its message via `createMessage`** (born teaching).
>    **The hard part** (owner + plan flagged): distinguishing a literal-union widening from a
>    legitimate arbitrary-`string` collection via typescript-eslint's type-checker — precision gates
>    `warn → error`; a permanently-advisory rule is not acceptable, surface-with-evidence if
> precision
>    proves unreachable. Do NOT redo the doctrine already strengthened (typescript-practice.md,
>    ADR-153/038/028, EEF graph-corpus-sdk code).
> 2. **Item 2b** — the 89-file cartography pass above.
> 3. **Item 2c** — per-surface PDR-044 widening (ESLint now-eligible once 2a is confirmed enforcing;
>    rules-prose after 2b).
> 4. **No-type-widening WS2** — tripwire wiring; coordinate with
>    `action-time-structural-interrupt-design-space.plan.md`; beneficial, not blocking; lowest
> priority.
> 5. **Follow-on (not 2a scope):** `toPosix` is duplicated across `max-files-per-dir`,
>    `require-observability-emission`, `no-real-io-in-tests` (third consumer → consolidate-at-third-
>    consumer); extract to `oak-eslint/src/utils/path.ts`.
>
> **Disciplines carried (worked this session):** an `as`-ban + a live multi-writer lockfile turns a
> mechanism choice into a coordination problem — surface it; ground specialist findings first-hand
> before acting (caught the zod-bloat false positive by checking the dist size); reviewers at the
> unit
> boundary, not backfill; the owner's safety-commit can sweep your green WIP in with a peer's —
> verify
> HEAD is green, do not assume your work landed as its own commit.

## Statusline Session-Shape Indicators Lane (2026-06-12 → 2026-06-13) — DONE

**Owning plan**: archived at
`.agent/plans/agent-tooling/archive/completed/statusline-session-shape-indicators.plan.md`
(status: DONE; lifecycle index entry in `completed-plans.md` § Agent Tooling).
**Outcome**: all five workstreams executed by Monsoon guards Cirrus on
`feat/statusline-enhancements` (commits `ac2901fe1` claim `role` field + singleton-cure,
`1ac430378` resolver + `isClaimStale` + porcelain primary-root parser, `4270ea49d`
renderer + adapter two-reads-per-tick + glyph evidence). Pushed, conflict-resolved against
main (napkin/repo-continuity, semantic merge), and **PR #203 merged to main 2026-06-13
(merge `00c1f758d`)** by Flame rides Temper. One post-merge SonarCloud smell (nested ternary,
S3358) fixed by extracting a `teamIcon` helper before merge. **Post-merge live proof
passed**: against the merged schema the write-path validator now accepts a `role:director`
claim (the write it correctly refused pre-merge), and the built statusline adapter renders
the 🧭 Director demark suffixed to the identity plus the 👪 directed-team icon.
**Residue (sweep at next consolidation)**: three abandoned commit-queue intents in the
primary registry (1266cd70, 205de542, 3bdc8219 — pre-merge blocked-window attempt audit);
two stale `current/` plan-path links in `repo-continuity.md` (a dated point-in-time bullet
and the redesign bullet) left for the continuity lane to repoint to `archive/completed/`
when it next touches that file (it carried uncommitted edits in the primary during this
lane, so this PR did not churn it).

Additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md).
This table carries the **recent active stretch**; the full 142-session trail (older curation
passes) is in git history and the [`curator-passes/`](../curator-passes/) ledgers.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Moonless Lurking Dusk` | `claude` | `Opus 4.8` | `0641a3` | `dedicated-knowledge-curation` | 2026-06-01 | 2026-06-01 |
| `Shaded Veiling Mirror` | `codex` | `GPT-5` | `019e88` | `dedicated-curation+closeout` | 2026-06-02 | 2026-06-02 |
| `Lofty Sweeping Falcon` | `codex` | `GPT-5` | `019e8a` | `dedicated-curation-continuation+closeout` | 2026-06-02 | 2026-06-03 |
| `Ashen Burning Magma` | `codex` | `GPT-5` | `019e8d` | `antigravity-practice-integration` | 2026-06-03 | 2026-06-03 |
| `Solar Glowing Meteor` | `codex` | `GPT-5` | `019e8d` | `skills-taxonomy-implementation` | 2026-06-03 | 2026-06-03 |
| `Stratospheric Buffeting Breeze` | `codex` | `GPT-5` | `019e8c` | `antigravity-audit + skills-taxonomy + first-batch-graduation handoffs` | 2026-06-03 | 2026-06-03 |
| `Lacustrine Swimming Beacon` | `claude` | `Opus 4.8` | `687a54` | `working-tree-commit-marshal` | 2026-06-03 | 2026-06-03 |
| `Opalescent Illuminating Prism` | `codex` | `GPT-5` | `019e8e` | `dedicated-knowledge-curation` | 2026-06-03 | 2026-06-03 |
| `Blustery Lifting Gale` | `claude` | `Opus 4.8` | `9b33b0` | `taxonomy-plan-link-repoint (session home: agentic-mechanisms-discovery)` | 2026-06-03 | 2026-06-03 |
| `Arboreal Sprouting Branch` | `claude` | `Opus 4.8` | `262b3f` | `dedicated-knowledge-curation+owner-directed-graduations` | 2026-06-04 | 2026-06-04 |
| `Hidden Hiding Dusk` | `claude` | `Opus 4.8` | `38dbaf` | `dedicated-consolidation+owner-directed-graduations` | 2026-06-04 | 2026-06-04 |
| `Lanternlit Passing Mask` | `claude` | `Opus 4.8` | `748c10` | `dedicated-consolidation+owner-directed-graduations` | 2026-06-05 | 2026-06-05 |
| `Volcanic Blazing Magma` | `codex` | `GPT-5` | `019e9c` | `identity-statusline-docs` | 2026-06-06 | 2026-06-06 |
| `Dim Fading Hush` | `claude` | `Opus 4.8` | `1952e2` | `eef-d6-reflection-and-meta-handoff` | 2026-06-06 | 2026-06-06 |
| `Glittering Weaving Comet` | `claude` | `Opus 4.8` | `47e009` | `feedback-mechanism-reappraisal (L1+L2)` | 2026-06-07 | 2026-06-07 |
| `Eclipsed Watching Veil` | `claude` | `Opus 4.8` | `077e31` | `feedback-mechanism-follow-ons (items 4 + 1)` | 2026-06-07 | 2026-06-07 |
| `Briny Plumbing Beacon` | `claude` | `Opus 4.8` | `5dd58c` | `feedback-mechanism-follow-ons (item 2a landed; WS1 next)` | 2026-06-07 | 2026-06-07 |
| `Lofty Spiralling Plume` | `claude` | `Opus 4.8` | `891aa5` | `continuity-surface-fitness-wiring + prose-line-awareness + ADR-193-fold` | 2026-06-08 | 2026-06-08 |
| `Cosmic Illuminating Planet` | `claude` | `Opus 4.8` | `773ea1` | `dedicated-continuity-surface-consolidation` | 2026-06-08 | 2026-06-08 |
| `Coppery Crackling Crucible` | `claude` | `Opus 4.8` | `a28ee6` | `pending-graduations-drain + recalibration + PDR-091 (precedence-is-not-approval)` | 2026-06-08 | 2026-06-08 |
| `Fruited Twining Canopy` | `claude` | `Opus 4.8` | `1aff59` | `dedicated-knowledge-curation (napkin rotation + graduation + continuity/open-questions drain)` | 2026-06-09 | 2026-06-09 |
| `Arboreal Swaying Thicket` | `claude` | `Fable 5` | `d2947e` | `dedicated-knowledge-curation (register drain + napkin rotation + width repairs + platform-memory)` | 2026-06-11 | 2026-06-11 |
| `Thermal Circling Updraft` | `claude` | `Fable 5` | `f42c24` | `dedicated-consolidation (owner decision walk: all gated dispositions settled; ADR-195/196/197 + skill + PDR-058/091/089 landed; approved-authoring queue frozen)` | 2026-06-11 | 2026-06-11 |
| `Thyme wakes Canopy` | `claude` | `Fable 5` | `70655e` | `dedicated-consolidation (approved queue authored: PDR-092/093 + 4 amendments + 3 folds; napkin rotated; registers drained; continuity condensed)` | 2026-06-12 | 2026-06-12 |
| `Monsoon guards Cirrus` | `claude` | `Fable 5` | `aaa0b7` | `statusline-session-shape-indicators (all five workstreams landed on feat/statusline-enhancements; handed to Flame rides Temper for push/PR/post-merge proof)` | 2026-06-12 | 2026-06-12 |
| `Flame rides Temper` | `claude-code` | `Fable 5` | `362832` | `statusline-lane successor (Monsoon handoff): PR #203 + #206 merged + post-merge director-demark proof + two-line layout; PR merge-readiness discipline plan #205 + WS3-evidence integration #207; review-comment-resolution discipline applied across all PRs` | 2026-06-13 | 2026-06-13 |
| `Margay wakes Whisper` | `claude` | `Opus 4.8` | `803f13` | `skills-estate audit vs agentskills.io + oak-skills compare; reconciled stale skills-standardisation plan (core landed in reduced form); authored 2 enhancement briefs (oversized-core decomposition, eval harness); gaps recorded as F-37, disposition review owner-deferred` | 2026-06-14 | 2026-06-14 |
| `Peregrine turns Airstream` | `claude-code` | `Opus 4.8` | `a29389` | `fitness-validator worktree/transient-root exclusion fix (`6ffbc14e0`) + disposition-category report grouping (PDR-097 + ADR-144 amendment); content-guard workaround/root-cause-avoidance detection captured for the hook-policy plan after a malformed-policy fail-closed deadlock; authored 2 future plans (hook-policy TS+schema unification, cSpell quality gate); dedicated consolidation flagged DUE next session` | 2026-06-15 | 2026-06-15 |
| `Europa binds Perihelion` | `claude-code` | `Opus 4.8 (1M)` | `0008e8` | `dedicated-consolidation (open-questions drained to empty; PDR-078 §4 / PDR-082 Adopted / PDR-098 / PDR-099 graduated + reviewed; wrapped-exit-codes clause; statusline lane committed under owner-directed full-tree ownership); added thread lanes C (memory/state merge) + D (rule-impact instrumentation); handed off mid-bulk-register-drain to Rigel binds Meridian` | 2026-06-15 | 2026-06-15 |
| `Rigel binds Meridian` | `claude` | `Opus-4.8 (1M)` | `b475ee` | `dedicated-consolidation relay (Europa handoff): verified open-questions EMPTY; batch 1 (`40b5750aa`) migrated F-38/39/40 agent-tooling frictions to the register + drained from pending-graduations; produced the full R/W/G/O classification + verified route-homes + Team-Autonomy disposition shape in the napkin HANDOFF BATON; owner set the Class-O "delegate with reported verdicts" policy; handed off mid-bulk-drain to Snapper binds Coral` | 2026-06-15 | 2026-06-15 |
| `Snapper binds Coral` | `claude` | `Opus 4.8 (1M)` | `0beea7` | `curator — dedicated-consolidation drain (Rigel handoff): all agent-tools R items → frictions-register F-41..F-59; 3 behavioural items withdrawn as covered by verify-dont-trust; open-questions re-verified EMPTY; napkin rotated, 2 new + 3 carried lessons → distilled; ~50 owner-gated single-instance candidates + Team-Autonomy PDR-074 cycle + G items remain for owner-walk / reviewed cycle` | 2026-06-15 | 2026-06-16 |
| `Sequoia holds Arbor` | `claude` | `Opus 4.8 (1M)` | `0ed76b` | `n=2 partner (distil lane), owner-stopped cautionary session — committed nothing; conserved two owner-affirmed failure lessons to napkin (orchestration-substituted-for-cognition; the open enforce-edge feedback loop)` | 2026-06-16 | 2026-06-16 |
| `Lapwing holds Troposphere` | `claude` | `Opus 4.8 (1M)` | `85f435` | `fitness made report-only (gate→signal, semantics-not-severity); decision-debt discrete ceilings + dwell-time axis (new dwell.ts); ADR-144/PDR-100 reframed; reviewers run; three discipline cures landed (citation-or-silence, no-mutable-state-in-memory, the Second Question in AGENT.md); committed + pushed 8665da651/3cb64da91; register 72 still undrained → drain is next session` | 2026-06-16 | 2026-06-16 |
| `Basil tracks Xylem` | `claude` | `Opus 4.8 (1M)` | `6381a2` | `owner-gated knowledge-flow purge (PDR-100 propagated across briefs/skills/continuity/plans; action-authority gates kept per owner); actionable-error fix for non-registry --active (PDR-055 cl.9); PDR-055 amended to universal CLI API-surface-design consistency (cl.7-10 + Falsifiability); authored agent-tools-cli-ergonomics plan; superseded memory-surface-critical-drain; register 72 still undrained → drain next session` | 2026-06-16 | 2026-06-16 |

## Cross-Plan and Cross-Thread Links

- **Live-work plans**:
  [`current/no-type-widening-enforcement.plan.md`](../../../plans/agentic-engineering-enhancements/current/no-type-widening-enforcement.plan.md),
  [`future/action-time-structural-interrupt-design-space.plan.md`](../../../plans/agentic-engineering-enhancements/future/action-time-structural-interrupt-design-space.plan.md).
- **Skills arc** (2026-06-14 audit, agent-tooling collection): owning plan
  [`agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md`](../../../plans/agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md)
  (§Reality Reconciliation gap ledger); enhancement briefs
  [`agent-tooling/future/skills-oversized-core-decomposition.plan.md`](../../../plans/agent-tooling/future/skills-oversized-core-decomposition.plan.md)
  and [`agent-tooling/future/skills-eval-harness.plan.md`](../../../plans/agent-tooling/future/skills-eval-harness.plan.md);
  friction F-37; pending-graduations entry "PDR-051 reduced-implementation reconciliation review".
- **Graduation register**: [`pending-graduations.md`](../pending-graduations.md) (decision-debt
  candidates — pending/due/overdue — and fired-trigger candidates from this thread's curation passes).
- **Curation ledgers**: [`curator-passes/`](../curator-passes/) (per-pass disposition evidence).
- **Repo state**: [`repo-continuity.md`](../repo-continuity.md) § Current State (authoritative
  live state across threads).
