---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
merge_class: index-narrative-tables
---

# Repo Continuity

**Session close (2026-05-11 — Dusky Masking Cloak / `claude-code` /
opus-4-7-1m / `c5ff7f`, graph execution-prep steps 1+2+3 landed)**:
ran `2026-05-11-graph-execution-prep-opener.md` steps 1 (D-4 BLOCKER
verification), 2 (graph-stack Inc.1 sub-increment decomposition), and
3 (EEF plan 9-WS overlay). Three atomic commits: `66d4f0fb` (D-4
closure entry — both 2026-05-07 BLOCKERs verified closed by 2026-05-10
graph-stack edit; sub-task D-4a routed: ADR-041 needs amendment to add
`agent-graphs/` + regularise `agent-tools/` before ADR-173
ratification); `579cde34` (Inc.1 split into 1a-substrate / 1b-Threads-
adapter / 1c-query-proof / closure; absorbed code-expert's WS2.1+WS3.1
root-file-conflict finding); `85bcbc41` (EEF 9 capability WS + 1
coordination WS overlay; cross_cuts semantics clarified). Reviewer
dispatch followed opener prescription throughout — `architecture-
expert-betty`, `assumptions-expert`, `code-expert`, `docs-adr-expert`,
each on its own scope. Full pre-commit gates green on every commit
(format, markdownlint, knip, depcruise, type-check, lint, test).
**Next safe step**: opener step 4 — primary-agent-tooling-enhancements
WS 2–5 implementation + B-01 fix (test-first, atomic TDD pairs). Not
this session.

**Session close (2026-05-11 — Burnished Crackling Pyre / `claude-code` /
opus-4-7-1m / `e517c9`, Claude skill-listing-budget bump)**: lightweight
session. Owner directed bump of Claude's `skillListingBudgetFraction`
from default 1% → 3% in `.claude/settings.json` to accommodate the
elevated skill count that is structural to Practice-adopting repos
(vendor-agnostic skills-as-integration-point per PDR-009/PDR-051).
Napkin entry records the architectural rationale and flags the
Practice-Core relevance: any repo adopting the Practice will exhibit
the same elevated floor by construction. Pending-graduations entry
added — target `amend:practice.md OR amend:PDR-051`, trigger
`owner-direction OR second-platform-instance`. **Landed**: bump plus
napkin plus thread-record plus pending-graduations bundled into commit
`9547bb69` (landed by parallel session or owner; working tree was
clean when this session-handoff ran, so the additions made during
handoff itself — pending-graduations entry, thread-record row,
this entry, active-threads column refresh — are uncommitted at the
time this is written and will be committed by the user-requested
end-of-handoff commit). **Next safe step**: unchanged — branch-primary
graph lane remains at graph-stack Inc.1 Oak Ontology Threads proof in
`graph-corpus-sdk` per the 2026-05-10 status updates below.

**Session close (2026-05-10 — Quiet Lurking Mask / `claude-code` /
opus-4-7-1m / `88b0a5`, QUAR-1 reformulation, dead-doctrine
retirement, archive snapshot)**: owner authorised (a)
Reformulate-and-land on the
QUAR-1 owner-decision carried over from the prior Sylvan Fruiting
Glade session. Graduated quarantined `apply-don't-ask` /
`stop-inventing-optionality` to PDR-057 (empirical-answerability
pre-question gate) and PDR-058 (three-tier optionality decomposition).
Pair-reviewed by docs-adr-expert + onboarding-expert +
assumptions-expert; review findings folded into both PDRs (destructive-
action family naming in PDR-057 Anti-Pattern §1; PDR-046 §Move 3
boundary clarification; orthogonality claim softened in PDR-058; pre-
investigation triage scoped out of PDR-057 Forbids). Three commits
landed: `1bd9a18b` (QUAR-1 graduation, 9 files), `67350e82` (dead-
doctrine retro-edits in 4 live-operative surfaces), `a098d709`
(archive snapshot, dropped `pending-graduations.md` 157,255 → 149,079
chars, cleared HARD char zone). User-memory
`project_apply_dont_ask_superseded.md` retired (substance fully
canonical in PDRs). **Surprise — foreign-stage absorption fired
post-verify-staged**: `a098d709` landed 11 files when verify-staged
confirmed a 2-file bundle. The pre-commit hook chain (lint:fix,
format-fix, RULES_INDEX regen, platform-adapter regen) modified files
and auto-staged them between verify-staged returning OK and `git
commit` invoking the hook chain. PDR-054 / ADR-177's verify-staged
check runs BEFORE the hook chain, so cannot catch hook-introduced
absorption. Pending-graduations entry added as PDR-054 / ADR-177
amendment candidate (post-hook verify-staged or hook-staged
classification by regenerator-vs-arbitrary). **Next safe step**:
napkin.md is at 453 lines (HARD limit 300, critical 450) after this
session — owner direction needed on napkin drain or rotation; the
graduated-substance was authored against the load-bearing imperative
to preserve substance over budget.

**Session close (2026-05-10 — Fragrant Regrowing Root / `codex` /
GPT-5 / `019e12`, source-authority clarification + handoff)**:
recorded the graph/EEF source model across ADRs and executable plans.
ADR-173 now carries the decision-level corpus authority split; ADR-157
records typing/naming implications. The graph MVP arc, graph-stack plan,
slice 3a/3b plans, and EEF evidence corpus plan now all agree that EEF
uses the repository-held JSON snapshot as the canonical implementation source
pending EEF clarification, Oak ontology raw material comes from the
`oaknational/oak-curriculum-ontology` GitHub source of truth, and the
misconception graph is constructed in this repo from Oak bulk data during
bulk-data processing. Validated with targeted `markdownlint`,
`git diff --check`, and JSON parse checks. **Next safe step**: commit this
source-authority/handoff bundle; after that, the branch-primary graph lane
still starts with graph-stack Inc.1's Oak Ontology Threads proof in
`graph-corpus-sdk`.

**Session close (2026-05-10 — Umbral Creeping Night / `claude-code` /
opus-4.7 / `188baa`, owner-directed commit drain)**: owner invoked
`/jc-start-right-quick please commit files in logical chunks` against a
working tree carrying ~305 in-flight files from three preceding sessions
(Shaded Rustling Pollen Phase 2 sweep, Sylvan Fruiting Glade drain
Phase 0 doctrine, Fragrant Regrowing Root ADR-173 amendments). Landed
7 commit chunks: `25a8ee6b` (Phase 2 reviewer→expert sweep, 304 files);
`d1e9433b` (polarity discipline backfill, 95 files); `ab12fb3b` (drain
Phase 0 doctrine — 5 PDRs, 3 ADRs, doctrine + tooling, 23 files);
`cb5b791e` (ADR-173 source-authority split); `2380ba6f` (ADR-171
observability orthogonal axes + 4 ADR amendments); `132c74d3` (ADR-173
GitHub raw-import correction); `9a69e293` (drain Phase 1 + post-Phase-0
housekeeping); `ae2d415f` (ADR-173/plan boundary cleanup —
**subject hijacked by prepare-commit-msg hook to "docs(memory): break
long line in distilled.md graduation pointer", body partially
truncated mid-word**). Coordination signals: owner forbade `git reset`
and `git stash` mid-session — used explicit-pathspec `git commit --
<paths>` to leave staged peer files for later chunks; foreign
`.git/index.lock` appeared once and cleared on its own (Shaded Rustling
Pollen finishing in parallel) — surfaced rather than deleted; multiple
parallel agents (Sylvan, Fragrant) were authoring new files DURING my
commit run, so each pre-commit hook retry surfaced different
format/markdownlint failures requiring iterative repair.
**Next safe step**: post-commit reviewer dispatch on the 7 doctrine
chunks if the owner wants validation; otherwise the working tree is
clean, all in-flight work is durable, and Sylvan's claim 07a92f67
remains open for their drain Phase 1+ continuation (PDRs 053–056 are
already landed — their remaining scope is pending-graduations-md
ongoing curation + repo-continuity hard-fitness remediation).
**Hook-overridden-commit-subject signal to surface to owner**: a
prepare-commit-msg hook silently overrode the manually-drafted Chunk 8
subject and truncated one body line mid-word; this is a coordination
risk worth investigating (candidate registered).

**Session close (2026-05-10 — Windswept Sweeping Gale / `claude-code` /
opus-4.7 / `726fcb`, claude-insight-report disposition plan executed end-to-end)**:
landed all four phases of the disposition plan authored by the prior
Oceanic Lapping Lighthouse session. Pattern
`owner-course-correct-vocabulary.md` (138 lines, fitness-clean) lifts
items 9 + 20 jointly. Single batch entry "Insight-Report 2026-05-10
Candidates" appended to `pending-graduations.md` covering 8 items as 6
entries after natural pairing (19+21 share target/trigger; 29+30 share
"future generated artefact" scope). Phase 0 audit refined item 16 from
VERIFY-INTEGRATE → CANDIDATE; assumptions-expert caught citation drift
on item 11 caused by the mid-session `invoke-code-reviewers.md` →
`invoke-code-experts.md` rename (Stormbound's commit `249600f1`).
docs-adr-expert APPROVED Phase 1 + APPROVED WITH NITS Phase 2 (one
optional nit applied). Plan body flipped 🔴 → 🟢 → ✅ COMPLETE; YAML
todos all `completed`. Active claim `4aa5cfbe-b859-45bd-84e0-299c26644313`
opened and closed cleanly; active claims now zero. **Fitness signal
to surface**: `pending-graduations.md` HARD on characters
(154209 / 150000) after the batch entry; pre-session was 147743
within budget. Substance preservation discipline applied (paired
items, did not trim withdrawal triggers); flagging for owner decision
on limit recalibration per ADR-144 §9e. **Next safe step**: commits
pending owner authorisation (Commit A: pattern + plan-status flip;
Commit B: batch entry + plan-status flip + claim-state edits — owner
chose to commit at session close).

**Session close (2026-05-10 — Stormbound Floating Current / `claude` /
opus-4.7 / `ea1cbe`, Phase 1B closeout extended scope)**: completed the
sub-agent rename + skill integration plan's Phase 1B end-to-end. Three
commits landed on `feat/mcp-graph-support-foundation`: `ae36670a`
(cleanup — 24 standalone-skill dirs deleted across canonical + Claude +
Agents jc-* surfaces, 8 `Skill()` permissions removed,
`mcp-expert/installation-and-integration.md` companion deleted),
`c31eb492` (reviewer follow-ups — plan-drift fix + dead Style Dictionary
URL fix), `249600f1` (owner-directed pull-forward of Phase 2 trigger
surface — 37 invoke-rule renames across 5 surfaces with body updates,
gateway routing rule + executive memory renamed `invoke-code-reviewers`
→ `invoke-code-experts`, plus 5 immediate-broken-pointer cross-reference
fixes in AGENT.md / executive README / practice-index / `.codex/README`
/ `RULES_INDEX.md`). Phase 1B reviewer matrix dispatched (4
cross-cutting + 5 domain): 2 CLEAN, 7 WARNINGS — convergent finding from
3 reviewers about broken invoke-rule trigger surface drove the
extended-scope commit. Latent issues remain queued: ADR-146 area-count
drift (6 vs 7), ADR filename retention for 146/149, ~590 cross-repo
prose references in non-rule docs (Phase 2 sweep). **Next safe step**:
the Phase 2 cross-repo `*-reviewer` → `*-expert` reference sweep is the
next agentic-engineering lane (~590 sites, mostly mechanical prose
edits in `docs/`, `.cursor/plans/`, `.agent/plans/`, `.agent/memory/`,
governance docs); sub-agent template self-references in
`subagent-architect.md` and `code-expert.md` are equal-priority sites.

**Session close (2026-05-10 — Sylvan Fruiting Glade / `claude-code` /
opus-4.7 / `a53e45`, knowledge graduation session)**: owner-invoked
deep consolidation with explicit reframe — the pending-graduations
register's `vaporware-gated` / `sequenced-deferral` / `XL-deferred`
vocabulary was named as fabricated avoidance, not legitimate
scheduling. Drained the full backlog in session: PDR-052 (directive-file
context budget); PDR-053 + ADR-176 (orchestrator-vs-gate cure + advisory
orchestrator naming) including script rename
`scripts/check-commit-skill-gates.ts` →
`scripts/check-commit-skill-advisories.ts` + commit-skill update;
PDR-054 + ADR-177 (asymmetric-cure discipline + staging enforcement);
PDR-055 + ADR-178 (CLI affordance-set discipline + agent-tools build
isolation); ADR-171 + amendments to ADR-116/143/162/163 (observability
orthogonal axes); PDR-056 (inter-agent collaboration protocol — ten
named cures with inline validation status); PDR-014 amendment for
polarity-required-at-graduation; new rule
`.agent/rules/invoke-doc-and-onboarding-experts-on-significant-changes.md`;
no-moving-targets hook tightening (prose-vs-data distinction in
`scripts/check-blocked-content.ts` with tests); polarity backfill
across ~93 pattern files. New pattern instance
`fabricated-gate-as-avoidance.md` captures the meta-finding so the
register cannot regrow the same vocabulary. Repo-continuity targeted
curation moved 12 historical session-close blocks to
`archive/repo-continuity-session-history-2026-05-10.md`.
**Next safe step**: pending-graduations housekeeping (mark graduated,
archive snapshot), fitness/vocabulary gate verification, and owner
surfacing for the QUAR-1 apply-don't-ask reformulation choice.

[Earlier 2026-05-10 session-close blocks archived — see
`archive/repo-continuity-session-history-2026-05-10.md § Append
2026-05-10` for Sylvan Sprouting Grove, Oceanic Lapping Lighthouse,
Gilded Eclipsing Meteor, Foamy Navigating Hull, Salty Rolling Compass,
Open Lifting Gale, Stratospheric Sweeping Plume, Woodland Growing Leaf,
Velvet Creeping Mask, Iridescent Dancing Nebula, Woodland Shedding
Moss, Blooming Ripening Glade.]

Historical session summaries and old next-safe-step queues moved to
[repo-continuity-session-history-2026-05-07.md](archive/repo-continuity-session-history-2026-05-07.md)
and
[repo-continuity-session-history-2026-05-10.md](archive/repo-continuity-session-history-2026-05-10.md).

## Current State

- Branch `planning/graph-tooling` is in final pre-merge planning closeout. Last
  pushed/refreshed PR #102 head is
  `309d9e5e44cebecb1be2478d2fb084a54f39b6b2`.
- PR #102 technical gates are clean on that pushed head: GitHub checks pass,
  SonarCloud Code Analysis passes through PR checks, and all known review
  threads are resolved.
- Owner direction 2026-05-08: PR #102 must not merge until the graph plans are
  finalised and decision-complete. Closeout docs now record
  `Decision-complete: YES`; merge-ready remains `NO` until the final
  clean-worktree dry-run merge/abort is run.
- Latest eval/structure decisions: EEF slice 1 structural-only now; LLM/outcome
  eval is follow-on infrastructure; Practice graph home is
  `agent-graphs/practice-graph/`.
- Branch-touched-files is `107`, so pre-merge divergence analysis is required.
- The live final-session plan is
  `.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/2026-05-08-pr102-graph-decision-complete-closeout.plan.md`.
- Remaining merge blocker: run the final pre-merge divergence workflow for the
  107-file branch on a clean worktree. Current unrelated local scratch state in
  `.agent/plans/notes/` should be preserved or isolated before that dry-run.
- Opalescent Shimmering Orbit's closeout collaboration claims are closed;
  `claims status` reports zero active claims. The advisory commit queue only
  contains stale/abandoned historical entries.
- Residual Practice fitness pressure is routed, not hidden: `practice.md`
  remains HARD on character count and needs an owner-approved Core edit or
  threshold decision before a strict-hard fitness gate can be clean.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `main-critical-sonar-remediation` | Sonar remediation | [record][main-critical] | Stormy / `claude-code` / `228bc5` / 2026-05-06 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night (commit-only) / `claude-code` / opus-4.7 / `188baa` / 2026-05-10 |
| `agentic-engineering-enhancements` | Practice continuity | [record][agentic] | Fronded Flowering Seed / `claude-code` / opus-4-7-1m / `19ecd5` / 2026-05-11 (graduation-candidates-drain — both due items graduated, commit `53995192`); Soaring Darting Kite / `claude-code` / opus-4-7-1m / `01db95` / 2026-05-11 (R1.b in-flight, claim `b1302a12`); Smouldering Crackling Pyre / `claude-code` / opus-4-7-1m / `ab76ef` / 2026-05-11; Deciduous Twining Dew / `claude-code` / opus-4-7-1m / `a12c90` / 2026-05-11; Blooming Growing Thicket / `claude-code` / opus-4-7-1m / `756c60` / 2026-05-11 |
| `connecting-oak-resources` | Oak resource graph | [record][connecting] | Mistbound Watching Lantern / `claude-code` / opus-4-7-1m / `8fdb8b` / 2026-05-11 (graph-mvp-arc review-absorption + doctrine ratification, commit `67885e3f`); Dusky Masking Cloak / `claude-code` / opus-4-7-1m / `c5ff7f` / 2026-05-11; Blooming Growing Thicket / `claude-code` / opus-4-7-1m / `756c60` / 2026-05-11; Fragrant Regrowing Root / `codex` / GPT-5 / `019e12` / 2026-05-10 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / `claude-code` / `e18e2c` / 2026-05-01 |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / `codex` / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / `codex` / 2026-04-28 |
| `sector-engagement` | External adoption | [record][sector] | Squally / `cursor` / 2026-04-30 |
| `eef` | EEF evidence corpus | [record][eef] | Fragrant Regrowing Root / `codex` / GPT-5 / `019e12` / 2026-05-10 |

[main-critical]: threads/main-critical-sonar-remediation.next-session.md
[observability]: threads/observability-sentry-otel.next-session.md
[agentic]: threads/agentic-engineering-enhancements.next-session.md
[connecting]: threads/connecting-oak-resources.next-session.md
[oer]: threads/exploring-open-education-resources.next-session.md
[budget]: threads/architectural-budget-system.next-session.md
[cloudflare]: threads/cloudflare-mcp-security-and-token-economy-plans.next-session.md
[sector]: threads/sector-engagement.next-session.md
[eef]: threads/eef.next-session.md

## Branch-Primary Lane State

Current branch-primary lane state for `planning/graph-tooling` lives in
[threads/connecting-oak-resources.next-session.md](threads/connecting-oak-resources.next-session.md).
This branch also depends on the Practice/tooling substrate work from main in
[threads/agentic-engineering-enhancements.next-session.md](threads/agentic-engineering-enhancements.next-session.md).

## Current Session Focus

**Latest focus (2026-05-11 — Smouldering Crackling Pyre /
`claude-code` / opus-4-7-1m / `ab76ef`, collaboration-protocol
hardening R1.a)**: executed only Phase 0 + R1.a of the "FINAL"
session opener; arc closure honestly deferred to a fresh opener.
Phase 0: bootstrap fast-path claim `059291ea` registered against
R1-R8 surfaces; bootstrap comms-log entry recording refuted-premise
event. **Refuted-premise event**: pre-flight field-set fingerprint
scan across `comms-events/*.json` returned seven distinct shapes
collapsing to **three families** — narrative (311 with five
accreted optional-field variants), lifecycle (5 — already carrying
an `event_type` discriminator), directed (2). Predecessor's binary
two-family diagnosis was incomplete. Owner direction received:
**Shape A′** — three sibling directories projected from one
canonical schema with three `$defs`. R1.a landed `f7560339`:
`comms-event.schema.json` (one schema, three `$defs`:
narrative/lifecycle/directed) + 12 Ajv-validated unit tests in
`agent-tools/tests/collaboration-state/comms-event-schema.unit.test.ts`

- test-fakes fixture module so `node:fs` stays out of test files
directly per ADR-078. Plan-time reviewers
(assumptions-expert + architecture-expert-betty) returned GO WITH
CONDITIONS pre-execution; both surfaced material findings absorbed
into the plan body. **Live foreign-stage absorption event**: peer
agent `Dusky Masking Cloak` / `c5ff7f` (committing as Jim Cresswell
on the graph thread) was active in parallel; their pre-staged
handoff files (napkin / thread-record /
graduation-candidates-drain-opener) appeared in my index when I
`git add`-ed my pathspec. The commit-queue `verify-staged` check
structurally caught the absorption; cure was `git commit -F - --
<pathspec>` which committed only my five files. This is literally
R4-new's motivating use-case landing in real-time during the
session designed to fix it. Peer's parallel commit `7250e807`
landed cleanly alongside mine; `git restore --staged` blocked by
hook policy (reinforces explicit-pathspec discipline as canonical).
**R1.b** (parsers / types / 7-file migration / 6+ consumer-file
updates) + **R2/R3/R4b/R4-new/R5/Phase 4/Phase 5** deferred to a
fresh opener — R1.b is a full-session atomic landing on its own.
Deferral honesty per PDR-026: named constraint is session-capacity
vs. realistic per-landing care requirement; falsifiability: future
agent attempts R1.b in one session and observes whether it fits
honestly. Session claim `059291ea` to be closed at handoff.
**Reviewers**: assumptions-expert, architecture-expert-betty.
**Surprises** queued for napkin: (a) refuted-premise event — two
families became three at pre-flight; (b) live foreign-stage
absorption from peer's parallel commit window; (c) hook policy
blocks `git restore --staged` even with semantically safe intent;
(d) advisory orchestrator caught pre-existing fitness violations
in peer-committed surfaces (napkin, repo-continuity,
pending-graduations, practice-bootstrap) — pre-existing per
catalogue, not blockers for my commit, but surfaces consolidation
work.

**Prior focus (2026-05-11 — Deciduous Twining Dew / `claude-code` /
opus-4-7-1m / `a12c90`, collaboration-protocol hardening Phases 0-3
partial)**: executed the collaboration-protocol-hardening opener
end-to-end through ground-state, friction audit, remediation design,
and first doctrine landing. Phase 0 compiled 13 protocol promises + 10
30-day frictions + 8 gaps at `/tmp/phase-0-ground-state.md`.
assumptions-expert review found opener spine sound, framing overreached
on 3 of 5 axes: opener amended on sub-system framing (four sub-systems
replace monolithic "collaboration protocol"), scaling claim (narrowed
to super-linear subset), out-of-scope ("blocks ramp, not start"), and
Phase 4 (expanded from 3-agent disjoint-scope dry-run to four-probe
matrix: overlap / commit-discipline / red-gate / session-end-mid-flight)
so architecture-expert-wilma's adversarial seat is earned. Phase 1
categorised frictions by remediation layer (CLI-BUG / CLI-AFFORDANCE /
CONTRACT-GAP / HOOK-ENFORCEMENT); three owner-direction items surfaced
and resolved: OD-1 composed A+B commit-pathspec enforcement; OD-2 Shape
C delete the markdown; OD-3 directive amendment with ≤3-agent
peer-collab default. Phase 2 remediation design absorbed
architecture-expert-betty (R5 coupling concern on
`evaluateSharedCommsLog` evaluator + constants in `live-types.ts:13`
and `cli-comms-commands.ts:14` requires R5.0 prereq) + assumptions-expert
(Path α premise refuted at 98% JSON coverage of markdown; threshold
n=1 at n=5 cannot calibrate integer) + architecture-expert-wilma (R4a
Bash-hook has 6 critical/major bypasses, not structurally sound alone).
Two owner re-decisions taken: ORD-1 → Path β (round-trip 299
timestamp-matched entries + reconcile 6 B-01-damaged + delete markdown);
ORD-2 → Shape B (R4b commit-skill + native git pre-commit hook; drop
R4a entirely). Phase 3 partial: R6 §Coordinator Role doctrine landed
at `9b619a05` (`docs(collaboration): coordinator-role amendment +
opener and B-01 fixes`) with the integer threshold held in ephemeral
state per assumptions-expert, role using existing claims + comms +
commit_queue primitives, automatic termination on chain-symptom clear.
docs-adr-expert reviewed the §Coordinator Role addition and surfaced one
fitness-limit breach (370 lines vs 360 limit); tightened to 360 exactly
before commit. **B-01 diagnosis corrected**: the bug is NOT
"`--now <iso>` not populating `created_at`" — root cause is mixed-schema
events in `comms-events/` (2 pre-existing directed-message events with
`timestamp/from/to/subject/kind/schema_version` shape trip
`parseCommsEvent` during `renderComms`); write path is sound. Fix
shape requires owner direction (split directories / widen parser /
deprecate directed-message schema); R5 Path β reconciliation step
depends on R1 fix. Session claim `718035aa-994f-4099-871d-360e3ef4ab31`
opened plan-scoped to opener + shared-comms-log, closed cleanly at
`70507d72` (`chore(collaboration): close session claim`). Remaining
work queued: R1 (schema-mix), R2 (B-10 shell-mangling), R3 (identity
cache), R4b (commit-skill mandates pathspec), R4-new (native git
pre-commit hook), R5 Path β migration, R7 (B9 fitness-gate plan stub),
R8 (claim-overlap pattern capture), Phase 4 four-probe validation
matrix. Phase 5 closeout (friction register, plan statuses, doctrine
mining) deferred to follow-on session. **Reviewers**: assumptions-expert
(×2), architecture-expert-betty, architecture-expert-wilma,
docs-adr-expert. **New memory**: `feedback_coordinator_role_threshold.md`
captures the owner-stated peer-collab-first-for-≤3-agents principle.
**Surprises** queued for napkin: (a) B-01 misdiagnosis revealed that
shared `comms-events/` directory carries two incompatible schemas
without a discriminator; (b) self-discovered protocol violation —
session-open shared-comms-log entry was direct Edit not `comms append`
because B-01 made the CLI fail; (c) assumptions-expert review at Phase
2 found the original owner-direction premise refuted by evidence,
clean re-decide loop preserved owner authority while honouring
"evidence over precedent".

**Prior focus (2026-05-11 — Blooming Growing Thicket / `claude-code` /
opus-4-7-1m / `756c60`, graph MVP arc reshape)**: reshape the graph MVP
arc per owner direction. Four-dimension value model (substrate /
shape-understanding / surfacing-exploration / partnership-or-
combinatorial) replaces the per-slice "user value triplet" framing;
teacher value named as downstream of AI-client adoption. Slice 3b
moves OUT of MVP arc; new
[`graph-combinatorial-arc.plan.md`](../../plans/graph-combinatorial-arc.plan.md)
authored to `current/` owns substrate-layer cross-corpus composition;
slice-3b executable plan migrated `current/` → `future/` with spine
repointed. gate-1 → gate-3a strict gate relaxed to PARALLEL-SAFE.
graph-stack Inc.3 carries downstream-consumer cross-ref to combinatorial
arc. Five commits: `4881e767` (reshape, 22 files), `fd8c9cee` (comms-log
landing), `ac765955` (B-01 bug record in agent-tooling enhancements),
`9547bb69` (next-session openers, Team-of-Agents Execution section,
architectural-excellence commitment, and skillListingBudgetFraction
bump). Plan-time + post-edit reviewer findings (assumptions-expert,
architecture-expert-betty, docs-adr-expert) absorbed across reviews.
**Discoverable next-session entry points authored**:
[`2026-05-11-graph-execution-prep-opener.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/current/2026-05-11-graph-execution-prep-opener.md)
(four definite steps before graph execution) and
[`2026-05-11-collaboration-protocol-hardening-opener.md`](../../plans/agent-tooling/current/2026-05-11-collaboration-protocol-hardening-opener.md)
(separate session for the real ceiling on safe N-agent work).
**Bug B-01** recorded against `pnpm agent-tools:collaboration-state --
comms send` (`--now <iso>` does not populate `created_at`); test-first
discipline named in the parent enhancements plan's new `## Bugs`
section. **Surprises**: (a) my first parallelisability instinct
collapsed slice 2 + 3a into substrate increments; owner clarified
substrate-building IS the value, slices stay surfaced — reframe was
value-articulation, not structural; (b) reviewer divergence on
folding slice 3b into cross-source-journeys vs keeping
combinatorial-arc separate resolved via architectural-layering
argument (Betty); (c) `comms send` CLI bug B-01 surfaced and worked
around via direct shared-comms-log append per bootstrap fast-path.

**Prior focus (2026-05-10 — Tempestuous Darting Zephyr,
.agent/commands retirement)**: PDR-051 / ADR-125 §2026-05-09
retirement loop closed end-to-end on `feat/mcp-graph-support-foundation`.
Five commits landed (`a098d709` sweep-bundled, `b92a99e6` inline+delete,
`90363d08` docs sweep, `58910fe6` reviewer fixes, `b00ad5a5` final
code-expert/docs-adr findings). `.agent/commands/`, `.cursor/commands/jc-*`,
and `.gemini/commands/jc-*` are gone; `.gemini/commands/review-*.toml`
retained per ADR-125 §2026-05-10. Skills are now the sole
user-and-model-invokable workflow surface. Five reviewers
dispatched in parallel; all actionable findings applied. Quality
gates green at HEAD `b00ad5a5`. Surprises: parallel-agent commit
absorption (Quiet Lurking Mask's `a098d709` bundled my staged work
with their pending-graduations message), vercel plugin duplicate
registration cured by removing project-scope install, validator
failure surface exceeded plan's Issue 2 enumeration (101 issues
across 5 families), `invoke-doc-and-onboarding-experts-on-significant-changes.md`
rule had no platform wrappers and no RULES_INDEX entry — generated
all four surfaces. **Next safe step**: branch-primary graph MVP focus
resumes — Oak Ontology Threads proof in `graph-corpus-sdk`.

**Prior focus (2026-05-10 — Fragrant Regrowing Root)**:
source-authority clarification complete across the graph MVP and EEF plan
estate. The current session changed no implementation code. Branch-primary
graph focus remains the Oak Ontology Threads proof; the clarification prevents
future executors from treating EEF as scraped/reconstructed data or
misconceptions as an external raw corpus.

**Latest focus (2026-05-10 — Umbral Creeping Night, commit drain)**:
working tree is clean. Three preceding sessions' in-flight work was
absorbed into 7 logical commits on `feat/mcp-graph-support-foundation`.
No arc progress was made on any thread; the session was pure
transport. The branch-primary graph MVP focus is unchanged.

**Latest focus (2026-05-10 — Sylvan Sprouting Grove handoff)**:
owner-requested deep consolidation has completed. The active napkin was rotated
and the useful 2026-05-10 lessons were distilled. Windswept's claimed
insight-report implementation lane remains active; `repo-continuity.md` is the
next unclaimed hard-fitness remediation lane.

**Latest focus (2026-05-10 — Salty Rolling Compass final handoff)**:
handoff surfaces now reflect the real post-commit state: Phase 1B expert
content merges are 8/8 landed, cleanup deletions and permission removals are
in the working tree under Stormbound Floating Current's cleanup commit lane,
and reviewer dispatch remains pending after cleanup validation/commit.
Branch-primary graph focus remains the Oak Ontology Threads proof below.

**Prior focus (2026-05-10 — Gilded Eclipsing Meteor)**: ADR coverage sweep is
complete and landed. The branch-primary graph focus below is unchanged; this
session's distinct focus closed the ADR/documentation gap review and left no
Gilded ADR claims active.

**Latest focus (2026-05-10 — Foamy Navigating Hull)**: graph MVP plan
amendment/handoff complete. Branch-primary graph MVP focus is now explicit:
the first graph work is the Oak Ontology Threads proof in `graph-corpus-sdk`
(`curric:Thread` enumeration + inverse `curric:includesThread` Unit lookup
with a tiny fixture-backed test). EEF + misconception graph + cross-source
value remain core MVP scope; NC graph/taxonomy work is excluded from the MVP
and requires separate owner promotion. **Deferred**: monorepo topology ADR /
stage-matrix work (strategic plan remains in `future/` until re-opened).

*Historical context:*

**2026-05-09 (skills standardisation WS0 — Cosmic Glowing Star)**:
WS0 review remediations landed as commit `989375a8` on `feat/mcp-graph-support-foundation`.
Four reviewers ran in parallel; 3 BLOCKER reshapes (WS1.4/1.5 structural body
assertions, WS1.7 structural help-text assertion, WS2.3 subprocess delegation),
7 must-fix WARN reshapes, 4 new WS5 propagation cycles. Plan body records WS0
Outcome paragraph. WS1.1 (Ajv schema + loader) is the next-session opening task.

**2026-05-09 (workspace topology / pipeline stages)**:
strategic plan only — monorepo supply-chain model for superseding ADR-108;
execution intentionally sequenced after graph MVP tranche.

**2026-05-08 (PR #102 graph decision-complete planning)**:
absorb remaining graph-plan findings and apply the latest structural-only EEF
evaluation decision before PR #102 merges. This is a planning closeout session,
not implementation.

## Repo-Wide Invariants / Non-Goals

**Role**: curated branch-relevant session-resume card. Each invariant
below has a canonical home in directives, rules, ADRs, or PDRs (cited
inline); the curation here is the value — at session resume an agent
gets the branch-relevant subset without reading every directive.
Drift is mitigated by the cross-references and consolidate-docs
sweeps; canonical homes always win on conflict.

- no compatibility layers; replace, do not bridge —
  [`replace-dont-bridge`](../../rules/replace-dont-bridge.md);
- distinct architectural layers live in distinct workspaces;
  folders/modules inside one workspace do not satisfy layer separation —
  [ADR-154](../../../docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md)
  - [`principles.md`](../../directives/principles.md);
- TDD at all levels —
  [`tdd-as-design.md`](../../directives/tdd-as-design.md);
- tests prove product behaviour, not configuration or file presence —
  [`testing-strategy.md`](../../directives/testing-strategy.md);
- strict boundary validation only —
  [`strict-validation-at-boundary`](../../rules/strict-validation-at-boundary.md);
- no `process.env` read/write in test files or setup files —
  [`no-global-state-in-tests`](../../rules/no-global-state-in-tests.md);
- `--no-verify` requires fresh per-invocation owner authorisation —
  [`no-verify-requires-fresh-authorisation`](../../rules/no-verify-requires-fresh-authorisation.md);
- no warning toleration —
  [`no-warning-toleration`](../../rules/no-warning-toleration.md);
- owner direction beats plan —
  [`AGENT.md`](../../directives/AGENT.md) +
  [`directive-file-context-budget`](../../rules/directive-file-context-budget.md);
- curriculum data in this monorepo comes only through the published Oak Open
  Curriculum HTTP API and generated SDK, not direct Hasura/materialised views —
  [`principles.md`](../../directives/principles.md) (branch-direction
  invariant; no ADR home yet);
- **knowledge preservation is absolute** — writing to shared-state
  knowledge surfaces is never blocked by fitness limits —
  [PDR-026](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md);
- **shared-state files are always writable and always commit-includable**
  regardless of any active claim (deliberate anti-log-jam tradeoff) —
  [PDR-026](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md)
  - [`respect-active-agent-claims`](../../rules/respect-active-agent-claims.md).

Current branch non-goals:

- do not implement intent-to-commit as claim metadata only; owner direction
requires an explicit minimal queue mechanic;
- do not reopen broader canonicalisation opportunistically;
- do not treat monitor setup or owner-handled preview validation as in-repo
acceptance work;
- do not guess Vercel, Sentry, or GitHub state before checking primary
evidence.

## Next Safe Step

**Status update (2026-05-11 — Fronded Flowering Seed close,
graduation-candidates-drain)**: both `due` items in
`pending-graduations.md` graduated this session (commit `53995192`).
Phase 1 = PDR-059 (regenerator-output-classification) + ADR-177
2026-05-11 amendment + PDR-054 §Related cross-ref. Phase 2 = ADR-041
amendment (agent-tools/ + agent-graphs/ tiers; 8×8 matrix;
Decision-list libs-split note; status Accepted (Revised)) + ADR-173
§Open Questions:1 cross-link + D-4a closed on
`graph-mvp-arc.plan.md:732`. **ADR-173 ratification gate now
unblocked.** Soaring Darting Kite has opened claim `b1302a12` for
R1.b collaboration-protocol hardening (comms-events directory
migration + type splits) — claim explicitly internalises PDR-059
post-hook eyeball discipline. **Next safe step**: (a) owner
ratification of ADR-173 to unblock `graph-stack.plan.md` CURRENT →
ACTIVE; or (b) Soaring's R1.b atomic landing, in flight. Choice is
owner-shape.

**Prior status (2026-05-11 — Deciduous Twining Dew close)**: the
collaboration-protocol-hardening opener has been executed through
Phases 0-3 partial. R6 §Coordinator Role doctrine landed at
`9b619a05`. Two owner re-decisions taken (ORD-1 Path β; ORD-2 Shape B
drops R4a). B-01 diagnosis corrected to schema-mix root cause.
**Original next safe step pointed to the FINAL session in the
collaboration-protocol hardening arc** — see
[`2026-05-11-collaboration-protocol-hardening-final-opener.md`](../../plans/agent-tooling/current/2026-05-11-collaboration-protocol-hardening-final-opener.md)
(authored at session close). The follow-on must surface ONE
owner-direction-needed item first (R1 schema-mix fix shape: split
directories / widen parser / deprecate directed-message schema), then
land the remaining design-resolved items test-first: R1, R2 (B-10),
R3 (identity cache), R4b + R4-new (commit-skill + native git
pre-commit hook), R5 Path β migration (depends on R1), R7 (B9 plan
stub), R8 (pattern capture), then Phase 4 four-probe matrix and Phase
5 closeout. Ephemeral design docs at `/tmp/phase-{0,1,2}-*.md` must
be homed into the parent plan body or named friction-register entry
on the follow-on session per ephemeral-to-permanent-homing.

**Prior status (2026-05-11 — Blooming Growing Thicket close)**: next
graph session entry point is
[`2026-05-11-graph-execution-prep-opener.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/current/2026-05-11-graph-execution-prep-opener.md)
— four definite steps in order (D-4 topology BLOCKERs; Inc.1
decomposition; EEF WS restructure; collaboration-protocol Workstreams
2–5). Steps 1, 2, 3 are parallel-safe planning sessions and can be
fire-and-forget to parallel agents. Step 4 is test-first
implementation (B-01 included). A separate dedicated session is
opened for collaboration-protocol hardening — see
[`2026-05-11-collaboration-protocol-hardening-opener.md`](../../plans/agent-tooling/current/2026-05-11-collaboration-protocol-hardening-opener.md).
Open-decisions D-1 through D-7 are tracked in
[`graph-mvp-arc.plan.md`](../../plans/graph-mvp-arc.plan.md) §
Team-of-Agents Execution; D-1 (AI-client adoption tracking owner)
and D-4 (topology BLOCKERs) are the most urgent. Architectural-
excellence commitment carried into both openers explicitly — we
only ever choose long-term architectural excellence; we never
compromise for the sake of expediency.

**Prior status (2026-05-10 — Fragrant Regrowing Root close)**:
commit the source-authority/handoff bundle, then resume the branch-primary
graph lane at graph-stack Inc.1's Oak Ontology Threads proof in
`graph-corpus-sdk`. Do not start NC taxonomy work. Do not start EEF adapter
migration, misconception replatform, cross-corpus joins, serving prototypes,
or broader query-layer migration before that proof lands.

**Status update (2026-05-10 — Stormbound Floating Current close)**: the
sub-agent rename + skill integration plan's Phase 1B is fully closed
(3 commits this session: `ae36670a` cleanup, `c31eb492` follow-ups,
`249600f1` extended-scope rule rename). The next agentic-engineering
lane is **Phase 2 — cross-repo `*-reviewer` → `*-expert` sweep**: ~590
mechanical prose edits across `docs/foundation/`,
`docs/architecture/architectural-decisions/`, `docs/governance/`,
`.cursor/plans/`, `.agent/plans/`, `.agent/memory/` non-rule docs,
plus equal-priority self-reference cleanup inside
`.agent/sub-agents/templates/subagent-architect.md` and
`.agent/sub-agents/templates/code-expert.md` gateway routing tables.
ADR filenames for 146 and 149 are owner-decision (filename retention
vs rename); ADR-146 area-count drift (6 vs 7 — Build-vs-buy promoted
to area #1 by template but not yet by ADR body) is a separate
doc-drift item. The owning plan
`.agent/plans/agent-tooling/current/sub-agent-rename-and-skill-integration.plan.md`
§Phase 2 is the canonical scope reference.

**Status update (2026-05-10 — Sylvan Sprouting Grove close)**:
the deep consolidate-docs pass is complete. Immediate active work remains with
Windswept Sweeping Gale's insight-report plan/pattern/pending-graduations
claim. The next unclaimed consolidation lane is targeted `repo-continuity.md`
hard-fitness remediation: archive historical closeout blocks and reconcile
stale current-state text with the live `feat/mcp-graph-support-foundation`
branch state.

**Status update (2026-05-10 — Gilded Eclipsing Meteor close)**:
the ADR coverage sweep is complete; ADR-174/175 and the related amendments are
landed, reviewed, and validated. No ADR-sweep follow-up is open. The next safe
step for branch-primary work remains the graph MVP Inc.1 Threads proof below.
For agentic-engineering work, coordinate with the active claims owned by
Stormbound Floating Current and Oceanic Lapping Lighthouse before touching
their surfaces.

**Status update (2026-05-10 — Foamy Navigating Hull close)**:
the graph MVP plan estate is amended and the first graph task is explicit.
Next session on the branch-primary graph lane starts by landing the Oak
Ontology Threads proof in `graph-corpus-sdk`: enumerate `curric:Thread` and
resolve inverse `curric:includesThread` Unit lookup through the substrate with
a tiny fixture-backed test. Do not begin NC taxonomy work. Do not begin EEF
adapter migration, misconception replatform, cross-corpus joins, serving
prototypes, or broader query-layer migration before that proof lands.

**Status update (2026-05-10 — Salty Rolling Compass final handoff)**:
the sub-agent rename / skill-integration lane is no longer waiting on
`react-component-expert`: all eight paired expert content/adaptor merges have
landed. The working tree currently carries the Phase 1B cleanup bundle
(standalone skill deletions, generated `jc-*` skill adapter deletions,
`.claude/settings.json` permission removals, and plan/continuity updates).
Next safe step for agentic-engineering work is to coordinate with Stormbound
Floating Current's active file claim and fresh cleanup `git:index/head` claim
`02faf64f`, validate and land that cleanup bundle, then run the planned Phase
1B reviewer dispatch before any Phase 2 sweep.

**Prior status (2026-05-10 — Open Lifting Gale close)**:
Workstream 1 of the agent-tooling friction closeout is complete and now
landed in commit `05adba87`. Workstream 2 from
`.agent/plans/agent-tooling/current/primary-agent-tooling-enhancements.plan.md`
remains a later lane if the owner resumes that closeout.

**Status update (2026-05-10 — Stratospheric Sweeping Plume close)**:
the practice.md examination lane was opened this session; an agent
framing failure surfaced (treated curation as optimisation in
vocabulary; PDR-003 §Decision-2 violation surfaced via the words
"contractions" and bulleted line-savings). Owner ended the thread
before any Core mutation. The pre-existing HARD char pressure on
`practice.md` (31,870 / 30,500 at session close) persists. This
session counts as one re-attempt of the examination, not as a
"deferred" outcome under PDR-026 deferral-honesty.

**Re-attempt entry criteria** (per the falsifiability captured in the
thread record): the next session re-attempting this examination MUST
(a) read the trinity + `practice-verification.md` at session-open
before any analysis, (b) lead any surfacing with role-questions per
section ("does this section still serve its role in the WHAT-
blueprint?") rather than size measurement, (c) present candidate
shapes as role-justifications with sizing as at most a parenthetical,
and (d) carry no instance of the words "contraction", "trim",
"reduction", or "savings" framing the work. If those tokens appear,
the re-attempt has not held the frame.

**Controlling governance** (do not re-derive next session): PDR-003
§Decision-2 ("consolidation is curation, not optimisation") is the
discipline that failed this session; PDR-026 substance-preservation
overrides fitness pressure; ADR-144 Key Principle 4 makes
`fitness_char_limit` change owner-only; ADR-144 Key Principle 2
forbids raising thresholds to track content drift. No new doctrine
to author — the diagnosis is "agent failed to hold PDR-003 while
surfacing", a pattern-instance candidate
(`read-doctrine-without-holding-frame`).

Branch-primary lane state for `planning/graph-tooling` continues
beneath this examination; the Practice Core lane and the graph MVP
lane remain parallel, not sequential.

**Clear PR #102 merge blocker** (parallel lane):

1. Preserve or isolate the unrelated dirty `.agent/plans/notes/` scratch state
   so the worktree is clean.
2. Because branch-touched-files is `107`, run the final pre-merge divergence
   workflow on a clean worktree before merge. The 2026-05-08 non-mutating probe
   found no changed-both files, no ADR/plan numbering add/add collisions, and
   no merge-tree conflict signal.
3. After PR #102 merges, **start graph MVP feature implementation** per the
   slice plans in `connecting-oak-resources/knowledge-graph-integration/` — that
   arc is now the **primary** engineering focus.
4. **Defer** monorepo workspace topology ADR drafting and stage-matrix audits
   until the owner explicitly returns to that programme **after** the graph
   MVP implementation tranche (see `monorepo-workspace-topology-adr-and-canonical-plan.plan.md`).

**Sequencing (owner 2026-05-09)**:
while PR #102 is still open, finish merge prep (clean worktree, divergence) on
`planning/graph-tooling` before implementation work. **After merge**, the
**primary** arc is **graph MVP feature implementation** per slice plans.
**Park** monorepo topology ADR / **S0–S6** enforcement until the owner
returns to that programme after the MVP tranche.

## Open Owner-Decision Items

Visible owner-appetite items, not blockers for the current branch state:

1. Residual `practice.md` HARD character pressure needs an owner-approved
   Core edit, threshold decision, or dedicated remediation lane. Constraint:
   Practice Core edits require owner approval under the Core care-and-consult
   rule; falsifiability is `pnpm practice:fitness --strict-hard`.
   **Status (2026-05-10 — Stratospheric Sweeping Plume close)**:
   examination lane was opened and re-attempted once this session;
   agent framing failure (curation-vs-optimisation vocabulary;
   PDR-003 §Decision-2 violation) caused owner to end the thread
   before any Core mutation. Item remains active. Re-attempt entry
   criteria captured in §Next Safe Step and the agentic-engineering-
   enhancements thread record. Pre-existing HARD signal persists at
   31,870 / 30,500 chars.
2. The pending-graduations queue remains SOFT and is intentionally calibrated
   for consolidation-pass access rhythm. Continue draining due entries in
   dedicated consolidation sessions.
3. Future doctor arcs are separate owner-choice lanes: repair mode and
   consolidation integration.
4. **Monorepo workspace topology** (superseding ADR-108, **S0–S6** strategic
   plan): **parked** until after the graph MVP implementation tranche; the
   candidate remains in `pending-graduations.md` for a later drafting slot.

## Deep Consolidation Status

**Status (2026-05-11 Mistbound Watching Lantern, claude-code,
opus-4-7-1m, `8fdb8b`, graph-mvp-arc review-absorption +
doctrine ratification — /jc-consolidate-docs run at owner
direction)**: `completed this handoff — focused thread-scoped
pass on connecting-oak-resources`. Pattern candidates surfaced:
schedule-not-trigger doctrine + agents-default-no-gender, both
captured as feedback memories (owner-managed auto-memory);
one-session evidence — keep in distilled state until second
session demonstrates re-application before PDR promotion.
Commit-queue UX friction profile captured (two protocol failures
this session: build-broken-by-in-flight-refactor; record-staged
index-clearing) — routed to next-session brief per owner
direction. Third-instance peer-commit absorption noted by
Soaring Darting Kite (their napkin entry) as the third-instance
trigger for PDR-059 classification-gate plan; routing complete.
Napkin: 264 lines (SOFT), no rotation. Practice Core: no
contradict/extend/refine/supersede candidates. Practice exchange
incoming/: empty. Pre-existing fitness pressure on
pending-graduations.md / repo-continuity.md acknowledged
unchanged.

**Prior status (2026-05-11 Fronded Flowering Seed, claude-code, opus-4-7-1m,
`19ecd5`, graduation-candidates-drain — /jc-consolidate-docs run at
user direction)**: `completed this handoff — focused thread-scoped
pass on agentic-engineering-enhancements`. Pattern graduation (step
5): "Different-lens reviewers catch different gaps" graduated to
repo-local pattern instance at
`.agent/memory/active/patterns/different-lens-reviewer-divergence.md`
with falsifiability + worked-instance evidence from the six
parallel-reviewer dispatches in this session. Pending-graduations
register refreshed: 0 due, ~83 pending (was ~84 — one item
graduated), total ~83 (down from ~86 by three graduations across
the day). Entry-point sweep clean (CLAUDE.md + AGENTS.md at
canonical pointer shape; AGENTS.md retains RULES_INDEX named
extension). Practice-box incoming empty (`.gitkeep`-only).
Practice-Core trinity scan: no contradict/extend/refine/supersede
candidates this session; PDR-059 is a downstream graduation (step
7b shape), not Core trinity refinement. Fitness signals: all
critical-zone items pre-existing and explicitly Out of Scope per
the opener (repo-continuity archive sweep; pending-graduations
size; practice-bootstrap chars); no new pressure introduced beyond
flagged. Wider register drain remains its own sequenced-deferral
lane (2026-05-07 dedicated-drain opener).

**Prior status (2026-05-11 Smouldering Crackling Pyre, claude-code, opus-4-7-1m,
`ab76ef`, collaboration-protocol hardening R1.a — /jc-consolidate-docs
run at user direction)**: `completed this handoff — focused thread-scoped
pass`. Entry-point sweep clean (CLAUDE.md / AGENTS.md / GEMINI.md all at
canonical pointer shape; AGENTS.md retains RULES_INDEX named extension).
Practice-box incoming has only `.gitkeep` (empty); outgoing absent.
Pattern extraction routed three new candidates to pending-graduations
(pre-flight-fingerprint-scan-before-shape-decisions; schema-as-protocol-
authority-with-directory-projection; R4-new native git pre-commit hook
moved queued → due on second instance). Fitness signals on
peer-touched surfaces (napkin critical line-width, repo-continuity
critical lines+chars, pending-graduations HARD lines+chars,
practice-bootstrap HARD chars) acknowledged — substance-preserved
writes per PDR-046 per-write rule; rotation/promotion candidates
deferred to next thread-scoped consolidation. ADR/PDR scan: no
immediate-graduation candidates this session beyond the three
pending-graduations entries above.

**Prior status (2026-05-11 Deciduous Twining Dew, claude-code,
opus-4-7-1m, `a12c90`, collaboration-protocol hardening Phases 0-3
partial — /jc-consolidate-docs run at user direction)**: `completed
this handoff — proportional thread-scoped pass`.

Pattern extraction (step 5): two candidates routed to
pending-graduations: (a) cross-schema-events-in-single-directory
discriminator discipline (target ADR or PDR on
single-schema-per-directory / explicit-discriminator-when-mixed;
trigger second instance in another directory); (b) owner-re-decision-
on-evidence-refuted-premise protocol (target PDR; trigger second
distinct instance in another review type). Both `status: pending`.

ADR/PDR scan (step 7a): one substantive doctrine landed inline —
§Coordinator Role in `agent-collaboration.md` (commit `9b619a05`)
per OD-3, with assumptions-expert calibration applied (integer
threshold held in ephemeral state). Two pending-graduations entries
captured above. Nothing else qualifies for immediate graduation;
B-01 corrected diagnosis is implementation-bound and owner-direction-
needed for the fix shape, not yet doctrine.

Ephemeral-to-permanent homing (step 3): three /tmp/phase-{0,1,2}-*.md
design artefacts — phase-0-ground-state.md (13 promises / 10
incidents / 8 gaps), phase-1-friction-audit.md (categorisation +
owner-direction items), phase-2-remediation-design.md (final design
with two ORD re-decisions). Distilled discoverably into the FINAL
session opener for this thread (next-session destination); raw /tmp
files left for the follow-on agent to read if depth is needed but
the opener carries the load-bearing substance. Parent plan
`primary-agent-tooling-enhancements.plan.md` already carries the
B-01 corrected diagnosis and the queued work via the bug table.

Napkin rotation (step 6): napkin at ~635 lines after this session's
5 SURPRISE entries; over the ~500 trigger threshold. **NOT
rotating this pass** — distillation is owner-direction-gated per
prior consolidation discipline; rotating now would touch entries
authored across multiple prior sessions including the owner-direction-
needed posture from Quiet Lurking Mask 2026-05-10. Falsifiability:
future agent can verify napkin entries authored 2026-05-11 by
Deciduous Twining Dew are preserved verbatim in `napkin.md` and
NOT yet present in `distilled.md`. Routing: napkin distillation
remains owner-direction-gated; the substantive learning is already
in pending-graduations.

Thread-register freshness (7c): identity row for `Deciduous Twining
Dew` (`claude-code` / `claude-opus-4-7-1m` / `a12c90`) added to
`threads/agentic-engineering-enhancements.next-session.md`
Participating Agent Identities table; `Active identities` column in
§Active threads above refreshed to include Dew alongside Blooming
Growing Thicket + Burnished Crackling Pyre. Other thread records
untouched (this session was thread-scoped to
`agentic-engineering-enhancements`).

Collaboration state (7e): one claim opened (`718035aa-…`,
`Deciduous Twining Dew`), closed explicitly at session close to
archive with closure summary and evidence ref (commit `9b619a05`).
Active claims: 0. No foreign claims to audit.

Entry-point drift sweep (step 3, backstop): CLAUDE.md, AGENTS.md,
GEMINI.md all at canonical pointer shape; AGENTS.md carries the
named RULES_INDEX extension. No drift.

Practice exchange (step 10): `.agent/practice-core/incoming/` and
`.agent/practice-context/outgoing/` empty. Nothing to integrate.

**Prior status (2026-05-11 Blooming Growing Thicket, claude-code, opus-4-7-1m,
`756c60`, graph MVP arc reshape — /jc-consolidate-docs run)**:
`completed this handoff — proportional thread-scoped pass`.

Pattern extraction (step 5): two pattern candidates routed to
pending-graduations register with `trigger: second-instance`:
(a) "value-articulation can be wrong while structural shape is right"
(target `candidate-pattern OR amend:PDR-026 OR new-PDR`);
(b) "downstream-consumer cross-reference preserves forcing function
when scope splits between plans" (target `candidate-pattern OR new-rule`).
Single-instance this session; pending until second observation.

ADR/PDR scan (step 7a): three candidates considered. (a) Architectural-
excellence reinforcement applied at opener level — already aligned with
PDR-044 and `principles.md` §Architectural Excellence Over Expediency,
no Core amendment needed. (b) Collaboration-protocol-bounds-MVP-arc-
parallelism observation — already routed via the collaboration-hardening
opener, that session will surface PDR candidates from its friction
audit. (c) Bug-section-with-test-first-discipline — operational
discipline named at the receiving plan surface; PDR-shape would require
≥2 plans needing the pattern (no second instance yet).

Thread-register freshness (7c): all 9 active threads have
`last_session` within 14 days; orphan file
`threads/pr-90-build-fix-landing.next-session.md` persists (same
orphan Burnished Crackling Pyre flagged 2026-05-11 — owner-direction
candidate to retire or restore). No duplicate identity rows, no
missing required fields.

Bidirectional rule/plan citations (7d): named pair
(`dont-break-build-without-fix-plan` ↔ `gate-recovery-cadence.plan.md`)
not touched this session; no validation needed.

Collaboration state (7e): one fresh foreign claim (`Deciduous Twining
Dew` 718035aa, executing the collaboration-protocol-hardening opener
Phase 0 ground-state) — not mine, not blocking. My own claim closed
explicitly to archive earlier this session. 17 stale `abandoned`
commit-queue entries persist (known from prior consolidations; not
auto-cleared per consolidate-docs §7e #2).

Practice exchange (step 10): `.agent/practice-core/incoming/` empty;
`.agent/practice-context/outgoing/` empty. Nothing to integrate or
clear.

Practice Core upstream refinement (step 8): nothing qualifies. Session
substance is graph-plan reshape + opener authoring; no Core
contradiction, extension, refinement, or supersession surfaced.

Fitness (step 9): 1 critical + 3 hard + 14 soft, ALL pre-existing.
napkin.md critical (585 lines / 33,003 chars). Constraint on
non-rotation this pass: a full distillation rotation would touch
napkin entries outside this session's substance scope (older entries
authored across multiple prior sessions including the carried-forward
owner-direction-needed posture from Quiet Lurking Mask 2026-05-10);
treating those as in-scope here would be a substantive distillation
without the owner-direction the prior sessions named as required.
Falsifiability: a future agent can check that this consolidation
touched only napkin entries authored 2026-05-11 (my own session's
additions, which are correctly preserved as pending-graduations
candidates rather than distilled). Routing: napkin distillation
remains owner-direction-gated; the substantive learning from this
session is already routed to pending-graduations.

repo-continuity.md hard (726 lines / 44,162 chars) — known
remediation lane already named in § Next Safe Step (2026-05-10 Sylvan
Sprouting Grove close). pending-graduations.md hard chars (156,067 /
150,000) — within architecture's lifecycle-queue-depth calibration,
drains via graduation passes. practice-bootstrap.md hard chars
(41,035 / 40,500) — owner-decision-gated edit per Core care-and-consult
rule.

Loop-Health post-mortem on napkin critical:

1. Earlier zones did fire — Burnished Crackling Pyre 2026-05-11 and
   Quiet Lurking Mask 2026-05-10 both observed critical state and
   flagged owner-direction need. Not silent; carried-forward owner
   gate.
2. Limits are calibrated for ≤2-session capture rotation; napkin
   accumulates across sessions when distillation is owner-gated.
   Limit shape is correct; the gating is the source of pressure.
3. The capture-vs-distillation gating IS the missing graduation
   path — when the napkin grows past critical, the standard cure is
   graduation to distilled.md / patterns / PDR. Owner-direction on
   how to drain accumulated entries is what unblocks the loop.
   Currently routed to thread next-session record as a standing
   open item.

**Prior status (2026-05-11 Burnished Crackling Pyre, claude-code,
opus-4-7-1m, `e517c9`, Claude skill-listing-budget bump)**: `completed
this handoff — proportional pass given small session substrate. ADR/PDR
scan (7a): the elevated-skill-floor observation is PDR-shaped (Practice
governance: how Practice-adopting repos calibrate platform skill-
listing budgets); already routed to pending-graduations register with
target amend:practice.md OR amend:PDR-051 and trigger second-platform-
instance OR owner-direction. Nothing else surfaces ADR/PDR shape this
session. Thread-register freshness (7c): all 9 active threads have
last_session within 14 days; no orphans, no duplicate identity rows,
no missing required fields. Finding: thread file
threads/pr-90-build-fix-landing.next-session.md exists but is not
listed in § Active threads — orphan-file candidate for owner review
(retire or restore). Track cards: skills-standardisation-followup-
timing.md has no expires_at frontmatter — informational. Collaboration
state (7e): 17 stale "abandoned" commit-queue entries persist (already
known per § Current State; not auto-cleared per consolidate-docs §7e #2).
Zero active claims. Fitness (step 9): napkin.md remains CRITICAL (585
lines, 33,003 chars vs 450/27,000 thresholds) — same pressure
Tempestuous flagged 2026-05-10, owner-direction still required on
drain/rotation per the napkin substance-preservation discipline. repo-
continuity.md remains HARD (now 631 lines / 37,603 chars after this
session's session-close entries) — known remediation lane already
named in § Next safe step (2026-05-10 Sylvan Sprouting Grove close).
pending-graduations.md returned to HARD chars (153,782 / 150,000) after
this session's entry — within architecture's lifecycle-queue-depth
calibration, drains via consolidation graduation passes. practice-
bootstrap.md remains HARD chars (41,035 / 40,500) — owner-decision
domain. Core review (step 8): no Core amendments surfaced this session
beyond the pending-graduation candidate already captured. Practice
exchange (step 10): incoming/ empty, practice-context/outgoing/ does
not exist. No incoming integration needed.`

**Status (2026-05-10 Tempestuous Darting Zephyr, claude-code,
opus-4-7-1m, `cb66a2`, commands retirement)**: `completed this
handoff — settled doctrine (commands retirement closure) graduated
into ADR-125 §2026-05-10 amendment + validator/probe refactor;
practice.md and practice-bootstrap.md amended to match (logged in
Practice Core CHANGELOG); five tracked follow-ups (pre-commit hook
gap, dead getSkillPermissionIssues parameter, evaluateParityChecks
unit-coverage gap, shouldInspectFile single-example coverage, cross-
agent sweep-bundling pattern at 5th instance) routed to
pending-graduations register; napkin captured five surprises +
pattern instances; entry-points clean (no drift); no claims to
close (no active Tempestuous claim); thread record updated; Active
threads register refreshed. Napkin is in critical-fitness zone
(~570 lines after my entries; HARD 300, CRITICAL 450); the
substance is load-bearing session-close capture, owner-direction
needed on rotation cadence vs further drain. Pending-graduations
register grew by ~70 lines (now ~2450); within character HARD
limit per Quiet Lurking Mask's recent recalibration. No ADR-shaped
or PDR-shaped doctrine surfaced beyond what already graduated.`

**Prior status (2026-05-10 Fragrant Regrowing Root, codex, GPT-5, `019e12`,
source-authority clarification)**: `not due — decision captured in ADR-173
and ADR-157, executable plans refreshed, and no new reusable Practice pattern
or cross-session doctrine candidate surfaced. Handoff captured the operational
state; deeper consolidation can wait for the normal post-gate learning loop.`

**Status (2026-05-10 Umbral Creeping Night, claude-code, opus-4.7,
`188baa`, owner-directed commit drain)**: `not due — pure transport
session, no substantive content authored. The 7 chunk commits absorb
already-authored doctrine; consolidation triggers (deep convergence,
pattern extraction, napkin rotation) do not fire on commit-drain
sessions. The "subject-hijacked-by-hook" signal is captured as a
candidate for a future consolidation pass if a second instance
appears.`

**Prior status (2026-05-10 Windswept Sweeping Gale, claude-code, opus-4.7,
`726fcb`, claude-insight-report disposition plan executed):
`not due — small-scope doctrine integration (one new pattern + one
batched candidate entry); no consolidation triggers fired. Napkin
clean (141/220 lines), no graduations beyond the batched candidates
already routed to pending-graduations.md, no major waypoint. The
prior Stormbound 'due' status below remains the controlling state
for the next deliberate consolidation session — Phase 2 cross-repo
*-reviewer → *-expert sweep + ~590-site reference cleanup.`**

**Prior status (2026-05-10 Stormbound Floating Current, claude, opus-4.7,
`ea1cbe`, sub-agent rename + skill integration Phase 1B closeout):
`due — plan-closure trigger fires (Phase 1B fully closed in 3 commits:
ae36670a + c31eb492 + 249600f1). 9-reviewer dispatch returned 2 CLEAN
and 7 WARNINGS; convergent finding from 3 reviewers drove the
extended-scope commit and is now resolved. Not well-bounded for this
closeout: the user explicitly flagged the session as over-running,
~590-site Phase 2 sweep is the next agentic-engineering lane, and
existing fitness/consolidation pressure (Sylvan's prior pass already
cleared napkin) remains routed but not zero. Future consolidation
should mine the convergent-reviewer-finding pattern (3 independent
reviewers surfacing the same trigger-surface break) and the
ADR-146-area-count drift as documentation-integrity captures`.**

**Prior status (2026-05-10 Sylvan Fruiting Glade, claude-code, opus-4.7,
`a53e45`, knowledge graduation session): `completed this handoff —
owner-reframed the pending-graduations register's deferral vocabulary
as fabricated avoidance and directed full backlog drain in session.
Drained: 7 due items + 1 partially-graduated completion via 5 new PDRs
(PDR-052..056), 3 new ADRs (ADR-171, ADR-176, ADR-177, ADR-178), 1
new rule (invoke-doc-and-onboarding-experts), 1 PDR amendment
(PDR-014 polarity), 4 ADR amendments (116/143/162/163), commit-skill
script rename + advisory banner + skill-doctrine update, no-moving-
targets hook tightening (prose-vs-data distinction in
check-blocked-content with new tests), pattern polarity backfill
across ~93 files. Captured the fabricated-gate-as-avoidance pattern
as anti-pattern instance (agent category). 12 historical 2026-05-10
session-close blocks moved to archive. QUAR-1 (apply-don't-ask) left
as owner-decision-moment for session close. Next consolidation should
mine the substance-vs-gate-vocabulary diagnostic that drove this
session's reframe.`**
