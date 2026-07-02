---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 115
fitness_line_length_rationale: >-
  Raised 100 → 115 (owner-authorised 2026-06-29) for this append-heavy
  narrative/continuity surface. Marginal prose-width drift on appended prose is
  chronic-cosmetic (99% of breaches were ≤120; median 104) and manual reflow is a
  transient non-cure on a file that grows by append each session; 115 clears the
  noise while still flagging genuine over-runs (this record still has a few >115
  lines that correctly remain flagged).
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

## RUN COMPLETE — salvage ws1 is the next action (2026-07-02 evening, Perseus wakes Oblivion)

**Self-contained. The discovery run EXECUTED to a green deterministic close and a FAILED
calibration verdict; the owner has directed salvage-not-rerun. Next session: execute ws1 of
[`corpus-analysis-salvage-and-topology-redesign.plan.md`](../../../plans/agentic-engineering-enhancements/current/corpus-analysis-salvage-and-topology-redesign.plan.md).**

**State (all committed, branch `docs/consolidations`, unpushed — owner's call):**

1. **Checkpoints in `reports/agentic-engineering/large-corpus-analysis-tooling/data/`**: partition
   (15w/100f), map (580 leaves), reduce (246 candidates), validate
   (`discovery-run-validate-result-2026-07-02.json`: 26 keep / 220 kill, 984 voters all
   adjudicated), meta (`discovery-run-meta-result-2026-07-02.json`: 2 subsumes / 5 partial / 11
   missed over 18 baselines), and the banked paired-comparison corpus
   (`discovery-run-banked-freetool-verdicts-2026-07-02.json`: 202 Opus + 31 Sonnet free-tool
   verdicts mapped to candidate ids — tier-C evidence, conserved from the transcript dir).
2. **The calibration verdict**: Choice-B MISS (strict within-remit 0.2, lenient 0.6); the meta
   notes name the missed baselines' matching candidates as found-then-KILLED — the Sonnet
   no-tools voter regime over-killed (kill verdicts failed 3–4 conjunctive tests at once;
   `grounded` was the LEAST-failed test, so machine-verified grounding would NOT have cured it).
   Integrity 0, recompute 246/246 zero-diff — the mechanics are trustworthy; the survivors list
   is not a complete discovery set.
3. **Economics**: `burn-analysis-2026-07-02.md` is the method of record (transcript-summed raw
   usage; ~1M raw tokens per 5h-meter point; unit costs per agent type; agent-count formulas
   incl. validate worst case 4C; quota overflow silently moves subagents to API billing —
   ~$448 API-equivalent this session). Owner directives now standing in the plan: never re-run
   the full validate; ~1/10th pilots first; every run pre-declares agents/tokens/dollars.
4. **Tooling state**: all four stage dispatches use least-privilege agent types (corpus-mapper /
   -reducer / -voter / -meta; findings map in the canonical templates — null-value `tools:` is
   the zero-tools shape); validate MAX_CONCURRENCY=8; the post-run driver has a KNOWN BUG (ws1
   fixes it): corroboration `existsSync` resolves repo-relative claims against the agent-tools
   cwd, reporting 0/18 corroborated when the meta agent had disk-verified real homes.

**ws1 salvage (executable now, zero validate spend):** fix the driver cwd bug (TDD); compute the
tier table — A: Sonnet-keeps ∩ (corroborated ∪ Opus-quorum-keep); B: remaining Sonnet keeps;
C: Opus-keep/Sonnet-kill disagreements (recompute from the banked-verdicts checkpoint: quorum =
strict-majority keep over the 3 lensed verdicts per candidate; 18 candidates incl. C03–C05, C07,
C10, C11, C15, C18–C21, C25, C33, C35, C37, C45, C47, C52; C36 is the lone reverse); D: kills
named in meta recall notes as baseline-matching (proven-real false kills); E: remaining kills
ranked by window span + groundingCount for the owner's manual round. Then the discovery report
with novelty stratification (corroboration claims in the meta checkpoint; triage bands in the
driver output) → conservation buffer → tasks #6/#7 (consolidate-until-done + napkin rotation).
Napkin writes are safe (map long done); rotation belongs to the consolidate-until-done.

**Operator discipline unchanged:** typed envelopes inspected before trust; never `--no-verify`;
lean pathspec commits sanctioned for checkpoints; `.claude/settings.json` working-tree mod is
pre-existing and NOT ours.

## Current Continuation

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
>    `require-observability-emission`, `no-real-io-in-tests` (consolidate-at-second-consumer);
>    extract to `oak-eslint/src/utils/path.ts`.
>
> **Disciplines carried (worked this session):** an `as`-ban + a live multi-writer lockfile turns a
> mechanism choice into a coordination problem — surface it; ground specialist findings first-hand
> before acting (caught the zod-bloat false positive by checking the dist size); reviewers at the
> unit
> boundary, not backfill; the owner's safety-commit can sweep your green WIP in with a peer's —
> verify
> HEAD is green, do not assume your work landed as its own commit.

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
| `Phobos turns Singularity` | `claude` | `Opus 4.8 (1M)` | `e85d37` | `collaboration-doctrine-decomposition plan author — compared the two collaboration directives against the start-right-team skill + PDR corpus; found both are layer-blenders predating their own PDR homes; authored the future/ strategic brief (doctrine-surface counterpart to the rightsizing keystone) + wired it into future/README.md` | 2026-06-17 | 2026-06-17 |
| `Skunk hunts Crescent` | `claude` | `Opus 4.8 (1M)` | `54eb83` | `curator — dedicated-consolidation buffer drain: rotated the napkin (critical→healthy) and drained distilled by DECIDING every entry (5 patterns + PDR-101 graduation-quorum + PDR-058/PDR-018 amendments + patterns-README single-instance reconciliation; F-64..F-67 + skill-two-gate routed; enforce-edge instance homed in the action-time plan), all through the PDR-101 quorum (rescued 4 over-rejections); committed f4a1416ad, gate green. HARD reference/doctrine surfaces (repo-continuity, testing-strategy) left for a specialist session per owner.` | 2026-06-16 | 2026-06-17 |
| `Wisteria spins Bark` | `claude-code` | `Opus 4.8 (1M)` | `d143c9` | `curator — dedicated-consolidation (n=2 with Bluebell on SDK): operationalised PDR-098 recurrence-capture (consolidate-docs step-7 + semantic-pathogen inventory seeded); graduated PDR-104 best-effort policy (+ PDR-003/step-8 reconciliation) and 5 napkin patterns (incl. fluency-is-a-failure-vector, homing 13 dangling wikilinks); processed repo-continuity to rest (15 concluded entries conserved to pointers, verification-backed); 7c/7e audits; F-68. The HARD repo-continuity surface Skunk left for a specialist session is now done; testing-strategy assessed (reported).` | 2026-06-18 | 2026-06-18 |
| `Sandpiper lifts Downdraft` | `claude-code` | `Opus 4.8 (1M)` | `0c6576` | `curator — dedicated-consolidation: buffers drained; continuity curated to live-work-only; testing recipes graduated; PDR-105 reference-direction invariants + validate-reference-direction enforcer landed; threads relocated to paused/retired; tracks/workstreams removal + ref-burndown deferred (refs-first)` | 2026-06-18 | 2026-06-19 |
| `Tulip spins Xylem` | `claude` | `Opus 4.8 (1M)` | `34b8e5` | `PDR-105 reference-direction burndown: §Context SDP/DIP fix; stable-addressed-surface exemption (validator + corollary generalisation) + built --verbose; wired no-moving-targets + practice-core-portability to PDR-105; retired consolidate-docs 7d; inverted dont-break-build to own the green-gate invariant; validator 197→145; tracks/workstreams + bulk burndown deferred to fresh budget` | 2026-06-19 | 2026-06-19 |
| `Siren guards Reef` | `claude` | `Opus 4.8 (1M)` | `e0eb7f` | `PDR-105 burndown COMPLETED 145→0 (Tulip successor): portability 55 (7ac5fe657) + durability 90 (6893962c2), pure de-link, 3 docs-adr passes APPROVED, gate green, NOT pushed; Task-2 tracks/workstreams operational surfaces retired (uncommitted) + 7 self-made tombstones fixed; handed to Drake lifts Obsidian — blocking remaining: PDR-011/ADR-150 foundational edits, dir deletion, validator warn→error escalation, ADR-026/093 coverage gaps, PDR-058:359 + register-identity stale-link tombstones` | 2026-06-19 | 2026-06-19 |
| `Drake lifts Obsidian` | `claude` | `Opus 4.8 (1M)` | `9258d7` | `PDR-105 burndown COMPLETE (Siren guards Reef successor): Tranche A doctrine cures d8ec8867c (de-links + PDR-011/ADR-150/PDR-027/PDR-058 + no-moving-targets:135 reconciliation; docs-adr APPROVED); Tranche B 774a49e5e (tracks/workstreams deleted + PDR-049/050 manifest reconciled + §Notes past-tense; owner-authorised); Tranche C 563487f79 (validate-reference-direction report-only→blocking + .agent/analysis/ ephemeral; code/test-expert APPROVE; probe-proven); validator now BLOCKING at 0; backticked-detection deliberately rejected; NOT pushed` | 2026-06-19 | 2026-06-19 |
| `Finch binds Halo` | `claude` | `Opus 4.8 (1M)` | `b0831c` | `four-files lane RESOLVED → jointly designed the Closure & Role-Routing fitness doctrine with the owner; committed the findings record + backbone plan (547d889c9); committed Kayak's strategy + compliance lanes (453896d64, d1387b81f) at owner direction; merged the 8 remote planning-cluster commits; prior 2026-06-19: dedicated-consolidation drain (detail in git + the findings record). NOT pushed` | 2026-06-19 | 2026-06-20 |
| `Ferret seeks Tunnel` | `claude-code` | `Opus 4.8 (1M)` | `77bfae` | `dedicated-knowledge-curation: drained the 2026-06-20/21 capture window bottom-up (napkin rotated; decision-locus + cause-classes lessons → distilled; F-75 peer-heartbeat-silence recovered from comms; fluency-cluster + education=pupils recurrence → action-time t2 inventory); promoted-and-assessed PDR-107 + README-index doc clause + culture Active Principle (docs-adr-assessed), rejected the pupils guard; commits 358a1636a + handoff; then restored practice-lineage to the evolution record (855→283; evacuated Learned Principles + what/how duplicates by intent; PDR-108/109/110 + PDR-002/024; reviewer-folded first-hand; 18 staged + gate-clean, commit handed to Director Vesuvius calls Quench — knip-blocked on peer WIP); NOT pushed` | 2026-06-21 | 2026-06-21 |
| `Oyster weaves Surf` | `claude` | `Opus 4.8 (1M)` | `d16a4a` | `WS-3 F-41 path-safety LANDED: resolveCoordinationHome resolves the PRIMARY checkout via \`git worktree list\` (b5408291d consolidation + c90150ffa core fix + 4fd640089 commit-queue topic), closing F-41 across comms AND commit-queue defaults; B2 deferred (git-resolved-home reframe); carried the proper-question-forces-the-answer lesson (forced-answer-test PDR candidate) + no-single-checkout-assumption; 3 code + 3 docs commits + a forward-only merge (ed0c7f3b2) integrating the other checkout's 2 commits; WS-1 set as next step; gate-green, NOT pushed (await safe remote integration)` | 2026-06-21 | 2026-06-22 |
| `Perseus turns Horizon` | `claude` | `Opus 4.8 (1M)` | `a7227a` | `substrate-source de-anon + ponytail fit-review (\`9abcd7679\`, pathspec-scoped commit in a 3-agent window, gate-green, NOT pushed): owner-directed naming of mattpocock/skills (MIT) openly across the study + non-plan note + research README + substrate-learning plan (attribution over source-neutral framing); authored \`ponytail-substrate-study-2026-06-22\` — one promote-candidate (complexity-debt ledger w/ revisit triggers, CONVERGING with the mattpocock C8 candidate → route into the substrate-learning candidate register), rest confirmations of existing doctrine; second-study trigger for the external-substrate-review template noted; Q-004 raised (openly-licensed-source naming convention); subagent-verdict-discipline reinforced (memory). Thread next step UNCHANGED = WS-1 (Oyster)` | 2026-06-22 | 2026-06-22 |

| `Petrel stirs Wingspan` | `claude` | `Opus 4.8 (1M)` | `b8cd66` | `dedicated-knowledge-curation: napkin rotated 667→44 (critical→green); the 2026-06-22 action-time recurrence cluster routed to the design-space plan; graduated the forced-answer-test → scope-from-goal rule, bottom-up-flow → consolidate-until-done skill, decision-records-current-truth → no-tombstones, and PDR-113 (source-intent-from-the-principal); 9 new lessons → distilled (now soft); F-83 (whole-tree-gate coupling) + F-84 + test-estate-audit plan stub homed; run-the-lenses pending-graduation drained; first-hand loss-scan caught F-84 (the decision-debt count was a silent false-green) and the F-84 fix landed with TDD (detector f056285fb + register reformat ea633117a — count now honest at 2/soft, dwell anti-starvation alarm restored); register drain-semantics clarified (decide-all-to-zero + dwell, d0ba6ef41); 12 commits, gate-green, NOT pushed. Thread next step UNCHANGED = WS-1` | 2026-06-22 | 2026-06-22 |

| `Magnolia spins Mulch` | `claude-code` | `Opus 4.8` | `5c3c64` | `MCPJam integration + curriculum-MCP validation (session home for the MCPJam thread; evals doctrine is the agentic-engineering tie-in): drove a full MCPJam-driven validation that closed the manual-UAT §11/§13/dual-shape gaps (UAT addendum 2026-06-23); settled the host-rebinding conformance finding FROM SOURCE → ADR-122 rewrite + ADR-158 (authed /mcp Host-validated in the auth layer via getPRMUrl→403; Origin deliberately permissive; no-auth dev = accepted residual) + a Host→403 regression test (auth-enforcement.e2e.test.ts); wired MCPJam (.mcp.json + README prereq + UAT-runbook programmatic pointer). Evals doctrine: authored the evals-and-assurance position report (test/evaluate/assure frame; 5 open questions for ratification) + the QUEUED skill-evals-pilot (start-right-quick). Lesson → distilled: trace ALL layers for a security check; a black-box re-run can false-pass; symmetric subagent skepticism. NOT pushed; thread next step UNCHANGED = WS-1` | 2026-06-23 | 2026-06-23 |
| `Thyme lifts Compost` | `claude` | `claude-opus-4-8[1m]` | `c2b721` | `team-session-closer — worktree-pilot consolidation + team closer: PR #222 proto-dispatch fix merged to main (8bebfd0a5, release 1.35.0; pr-watch lane COMPLETE); placed the guiding plan worktree-pilot-consolidation-and-model-verdict + restructured director-handoff.md (canonical, uncommitted); orphan mitigation DONE (3 at-risk branches pushed to origin, push-not-merge for zero-risk reversible preservation); F-94..F-97 captured; Sonar S8707 sites 2-3 PAUSED (site-3 → next team session). Team DISSOLVED, Director seat vacant; consolidation commit of continuity buffers is the one owner-gated orphan-prevention action remaining` | 2026-06-25 | 2026-06-25 |
| `Seal hunts Offing` | `claude` | `claude-opus-4-8[1m]` | `8210d6` | `fix-before-tooling — F-94 (claims adopt/set-handoff) + F-95 (watcher-presence gate) built TDD and MERGED to main via PR #225 (e95fb9594); register + live continuity surfaces corrected to fixed (fa2de8f74, 282171f8b); branch is continuity-only, 22 ahead/5 behind main, rebase declined by owner` | 2026-06-25 | 2026-06-25 |
| `Schooner hunts Tide` | `claude` | `claude-opus-4-8[1m]` | `e07e57` | `corpus-analysis-runbook-design (read-only) — designed the Discovery / Surprises / Directed corpus-analysis method on one substrate; wrote the design report + build-and-prove plan + current/README row + this thread record; first napkin Discovery run pending a writeable/execution-authorised session; no run launched, nothing committed` | 2026-06-29 | 2026-06-29 |
| `Borealis binds Genesis` | `claude-code` | `claude-opus-4-8[1m]` | `9f7741` | `dedicated-knowledge-curation — graduated Falcon's 6 staged carry-forwards + the napkin's behaviour-changing entries to rule/pattern homes (verify-dont-trust self-state blind-spot + gh-auth signature; pr-comments merge-instant async race; precedence-is-not-approval; reviewer-poisoned-brief; shared-array PR dependence; help-docs-no-op; light-scan-for-builds); drained distilled; verified pending-graduations 0 + open-questions kept-open; vendor surfaces scanned (all homed/superseded); stale claims + dead commit_queue cleared; conserved Schooner's corpus-runbook design. THEN a corrective arc on owner direction: graduated Director-craft → PDR-117 + shrank director-handoff; added consolidation-disposition guardrails (read-gates-verdict, graduation-non-deferrable) then RE-CENTRED both consolidate skills on impact-not-thresholds (\`dc5280a21\`); drained this record's completed arcs (PDR-105 burndown + Lapwing); authored \`patterns/legitimate-principle-as-avoidance-cover\` + \`current/consolidation-disposition-discipline.plan.md\`. Commits 03c0c8d16 → dc5280a21, NOT pushed` | 2026-06-29 | 2026-06-29 |
| `Wren stirs Rainbow` | `claude-code` | `claude-opus-4-8[1m]` | `093458` | `corpus-discovery-proving-run + v2-design + reusable-design-panel-protocol — ran the first Discovery pass of the large-corpus-analysis method (100 files/14 windows; machinery sound, apophenia gate functioning 9/19 killed; recall below threshold, corrected 0.28/0.56 — the run's self-reported 0.72 was a meta-arithmetic defect caught first-hand; misses all out-of-remit single-window). Designed v2 (deterministic aggregation; full Tier 0+1+2 adversary ensemble OWNER-CHOSEN; typed within-remit recall; real-world-signal close; Lens-4 prose-now/graph-later) via a 4-designer+1-critic design panel; captured a reusable agentic-design-panel protocol (apply+refine elsewhere). Conserved: substance report + curator-pass + 2 design reports + v2 impl plan; napkin + pending-graduations (LLM-judges-deterministic-aggregates PDR candidate) updated. Verdict refine-and-rerun; runbook graduation gated on a passing v2.` | 2026-06-29 | 2026-06-29 |
| `Callisto lifts Perigee` | `claude-code` | `claude-opus-4-8[1m]` | `94fe5d` | `built check-encoding (permanent agent-tools UTF-8/encoding scanner; deterministic byte scan + 35 unit tests; reporter + \`--fail-on\` gate); committed the precursor encoding fixes (raw-ESC-bytes in statusline test → SSOT \`\x1b\` import; mojibake doc deleted) as \`96f15f583\`. Wiring the gate surfaced that **agent-tools has no architectural direction** (invocation source-vs-dist, error-handling, dependency, gate-wiring all inconsistent); I thrashed on it (invented a "build-free class", reached for shallow fixes, owner corrected 4×). Landed check-encoding CONSISTENT with the existing \`skills:check\` precedent (build-then-node-dist gate via \`pnpm encoding:check\`, wired into \`pnpm check\` + pre-push), removed the turbo-task hack, kept canonical \`@oaknational/result\`. Wrote the deep state+assumptions handoff for Limpet herds Atoll: \`reports/agentic-engineering/agent-tools-architecture-state-and-check-encoding-handoff-2026-06-29.md\`. Owner is taking agent-tools architecture fresh.` | 2026-06-29 | 2026-06-29 |
| `Tornado spins Pinnacle` | `claude-code` | `claude-opus-4-8[1m]` | `0f7718` | `corpus-analysis-v2-build — built + committed the v2 deterministic layer (atomic-judgment schemas, the recall counter v1-bug fix, keep/kill/reroute predicate, tier-0/1/2 quorum state machine, frozen 18-baseline fixture 10 emergent/8 single-window, cost+coverage gate, real-world-signal close) in agent-tools/src/corpus-analysis/ — 88 unit tests, reviewed by 4 expert lenses (each critically assessed first-hand). Owner-confirmed the Choice-B dual graduate gate (strict within-remit ≥0.6 AND lenient ≥0.85). Rerun PREPARED, NOT run (owner-deferred on low context): self-contained launch runbook reports/agentic-engineering/large-corpus-analysis-v2-rerun-runbook-2026-06-29.md. Commits 5c34af7bc→33f0484a8 on docs/consolidations, cleanly stacked after a non-destructive branch-move off the peer's statusline branch (no work lost). Deep loss+metaloss handoff scan run first-hand + verification fan-out (3 agents); napkin carries the shared-checkout commit-move recipe + the agent-tools library-only cross-lane dependency.` | 2026-06-29 | 2026-06-29 |
| `Limpet herds Atoll` | `claude-code` | `claude-opus-4-8[1m]` | `d04779` | `took over Callisto's check-encoding for a fresh architectural take (owner: working-now, excellence-later). Verified the tool green on its own files (encoding:check 0 critical; type-check / lint / 1748 tests / knip / depcruise / prettier clean) AFTER fixing 2 knip-flagged dead exports (reportHasSeverity deleted; tallyBySeverity un-exported). Authored the decision-lens analysis report + the strategic plan agent-tooling/future/agent-tools-architecture-standard.plan.md (WS0 execution-model fork → ADR consolidating ADR-178/168/041/159 + enforcement + engine→packages/core + where-supported hook + convergence); reconciled with Callisto's handoff (ADR-178 grep finding: skills:check + encoding:check both trip the build-prefix verification). Surfaced a commit blocker: live untracked corpus-analysis WIP (different lane) fails whole-tree knip+lint and pre-commit runs those whole-tree, so the commit + full pnpm check green are OWNER-HELD until it clears. Nothing committed/pushed this session.` | 2026-06-29 | 2026-06-29 |
| `Laurel turns Stamen` | `claude-code` | `claude-opus-4-8[1m]` | `fe6101` | `corpus-analysis-v2-rerun — ran the v2 rerun end-to-end (15 windows, 682 leaves, 50 candidates, 45 keep/5 kill); verdict REFINE (strict within-remit 0.50, lenient 0.90). Landed the quorum-floor adjudication correction (a kill needs the diverse-lens quorum; rescued 4/5 false n=1 kills), the post-reduce cost re-gate (validateStagePlan), and PDR-122; conserved the tooling + corrected-findings JSON + run-record (7e87fbf2b to fe68d5c52). Row reconstructed at the 2026-06-30 Linnet closeout from the pickup + napkin — the rerun session did not self-register.` | 2026-06-30 | 2026-06-30 |
| `Linnet binds Leeward` | `claude-code` | `claude-opus-4-8[1m]` | `cbd113` | `v3 + conservation planning then discovery-first re-rooting. Authored the v3-extraction-grain + conservation plans, then (owner-directed) re-rooted the arc to discovery-first (recall = tuning, not the milestone) and authored the napkin-corpus-discovery-run plan (supersedes v3; first-class checkpointing, cost reconciliation, longitudinal falsifier, conservation buffer); re-rooted the chain-origin plan; reconciled the lineage. Reviewers (assumptions/docs-adr) + Explore + Plan agents, all assessed first-hand. Commits 9a4d59d06 to bfdd51358 (ahead 4, NOT pushed).` | 2026-06-30 | 2026-06-30 |
| `Flare hunts Obsidian` | `claude-code` | `claude-opus-4-8[1m]` | `48caf4` | `WS1 of the napkin-corpus-discovery-run (solo, ultracode). Landed the actuator-grain + longitudinal prompts and the run-orchestration TDD module (resume / completeness / hard-abort re-gate / ~50k calibration / jitter; aggregation FROZEN, diff-confirmed; 5-lens review, 2 criticals fixed incl. a stale routing mirror in the straight-through .mjs) — 974c8fa04. The cheap grain-probe stalled in reduce (output truncation under cap-removal + kind-confusion, NOT rate-limit); salvaged 167 leaves, hardened the reduce (bounded supportingLeafIds + KIND-rule), SPLIT the combined template into map.workflow + reduce.workflow (the combined cannot self-checkpoint) — 91ee28474. Re-run reduce-only PASSED the probe gate (all 5 v2-failing baselines as distinct actuator candidates; ≥4 longitudinal with real splits; broad clusters coherent). Surfaced the full-run cost constraint (~80-120 candidates ⇒ re-derive the 16M ceiling). Continuity b2228bc9d. Then 2026-07-01: reconciled main's upstream fix (merge 9dbb38cfb), ran the launch-preflight (map.workflow.run instantiated, 30M ceiling, metaPrompt drift fixed), verified GO_WITH_CONDITIONS, and a fresh-reader trawl found + fixed a grounding-strip run-collapse blocker plus doc gaps; commits through this closeout, ahead of origin, NOT pushed.` | 2026-06-30 | 2026-07-01 |

## Cross-Plan and Cross-Thread Links

- **Live-work plans**:
  [`current/no-type-widening-enforcement.plan.md`](../../../plans/agentic-engineering-enhancements/current/no-type-widening-enforcement.plan.md),
  [`future/action-time-structural-interrupt-design-space.plan.md`](../../../plans/agentic-engineering-enhancements/future/action-time-structural-interrupt-design-space.plan.md).
- **Evals lane (queued, owner-directed 2026-06-23)**:
  [`current/skill-evals-pilot-start-right-quick.plan.md`](../../../plans/agentic-engineering-enhancements/current/skill-evals-pilot-start-right-quick.plan.md)
  — pilot the in-repo skill `evals/` convention on the high-traffic `start-right-quick` grounding skill;
  grounded by the position report `.agent/reports/evals-and-assurance-position-2026-06-23.md`, whose 5 open
  questions — proportionality tiers, in-repo vs hosted eval home, the real-world signal, the Agentic-Quality
  principle wording, the `validation-strategy.md` home — were **ratified by the owner 2026-06-23** and homed
  in the rewritten [`principles.md` §Agentic Quality](../../../directives/principles.md) + the seeded
  [`validation-strategy.md`](../../../directives/validation-strategy.md) (3 harm-keyed tiers; eval
  definitions always in-repo, MCPJam = runner for the MCP-server surface only; telemetry-now loop).
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
