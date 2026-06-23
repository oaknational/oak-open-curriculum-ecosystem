---
title: 'Orientation lens unification — one intent-discerning surface'
type: plan
collection: developer-experience
lane: current
status: 'READY FOR EXECUTION — readiness review run + folded 2026-06-23 (assumptions-expert, onboarding-expert, docs-adr-expert; all load-bearing findings verified first-hand before folding)'
owning_thread: orientation-skills-family
design_confirmed_by: owner (2026-06-22 / 2026-06-23 conversation)
supersedes_reference: ../../../plans-old-archive/developer-experience/archive/completed/orientation-and-agentic-ai-literacy.plan.md
todos:
  - id: ws0-reground
    content: "Re-ground first-hand (the three current skills, PDR-112, AGENT.md §Orientation Requests, this plan); confirm the unify decision still holds via scope-from-goal; emit a Goal·In·Out artefact; confirm sub-decision 1 (lens name) with the owner or take its default. The readiness-reviewer pass already ran (2026-06-23) and is folded — see §Readiness review — do NOT re-dispatch it as a workstream."
    status: pending
  - id: ws1-author-unified-lens
    content: "Author the single repo-bound orientation lens SKILL-CANONICAL: the conversational discernment contract (<=3 adaptive questions, never a menu), the three delivery modes (specific answer / area overview / guided tour), setup as a distinct go-ahead-gated sub-branch, the PDR-112 primer hand-off edge, the merged live-doc router table, the Headline Invariants authored ONCE (both modes reference the single block), setup-only state detection, re-entry/personal-state with the parse-failure-to-stateless fallback, the access-aware teammate/external fork, both honesty invariants, and completion. Fold explain-repo's briefing doctrine in as overview mode (scopable to an area)."
    status: pending
    depends_on: [ws0-reground]
  - id: ws2-retire-redirect-old-skills
    content: "Retire explain-repo into the unified lens (default keeps onboard-me as the canonical name); alias /oak-explain-repo into the lens so no slash command dangles; regenerate adapters; reconcile .claude/settings.json; reconcile ALL live references via a repo-wide grep (onboard-me|explain-repo|oak-onboard-me|oak-explain-repo) EXCLUDING plans-old-archive, /archive/, and the auto-generated CHANGELOG.md; green pnpm skills:check + portability:check."
    status: pending
    depends_on: [ws1-author-unified-lens]
  - id: ws3-agent-md-routing
    content: "Rewrite AGENT.md §Orientation Requests: route every orientation intent into the one lens (lens discerns mode internally); keep the primer leading in via the PDR-112 edge with the edge resolving to the live lens; preserve the non-loader-platform fallback naming the one canonical SKILL-CANONICAL path; remove the explain-vs-onboard split language."
    status: pending
    depends_on: [ws1-author-unified-lens]
  - id: ws4-host-adr
    content: "Author host ADR-202 (re-check the number against the live directory at author time) recording the WHAT only: the orientation surface is one intent-discerning lens; delivery mode is a discerned variable not a skill boundary; setup is a distinct side-effecting capability; the PDR-112 seam and primer are unchanged. Cross-reference PDR-112 (NOT amended), PDR-009, ADR-125; check whether a prior orientation ADR is superseded. Mode names, the question contract, and the router table live in the SKILL, not the ADR."
    status: pending
    depends_on: [ws1-author-unified-lens]
  - id: ws5-validation-simulations
    content: "Validate by CONVERSATIONAL orientation-request simulation (the agent receives each trigger phrase and conducts the front-door discernment) — NOT README-first doc-path walks — with explicit no-probe-before-first-answer and no-menu-shape checks; plus a live owner walkthrough (the register's standing lesson: only a real run proves the experience). Update the onboarding-simulations register with a dated entry + the host-ADR cross-ref; run markdownlint, skills:check, portability:check, format; confirm the WS2 grep is clean of stale refs."
    status: pending
    depends_on: [ws2-retire-redirect-old-skills, ws3-agent-md-routing, ws4-host-adr]
  - id: ws6-thread-continuity
    content: "Reopen the orientation-skills-family thread (new lane state + identity row), update repo-continuity, cross-reference the superseded archived plan, and run the consolidation/handoff learning loop at close."
    status: pending
    depends_on: [ws5-validation-simulations]
---

# Orientation lens unification — one intent-discerning surface

## End goal

When a contributor asks to be told about this repository, about agentic
engineering, about working with AI, or anything orientation-shaped, the agent
**discerns their interest, experience, focus, and the lens that fits** through
two or three carefully crafted, friendly, conversational questions — never a
menu — and then delivers in the mode they actually want. Today that behaviour is
unreliable: it depends on which of two skills the phrasing happens to route to,
and the "just tell me about the repo" path (`explain-repo`) is deliberately
non-interactive and briefs immediately without discerning anything.

## Mechanism (why this produces the outcome)

The current split treats **delivery mode** — direct answer vs guided walk — as a
_skill boundary_ (`explain-repo` vs `onboard-me`), so the agent must _guess the
mode from phrasing_ and routes to one fixed behaviour. Make delivery mode a
**discerned variable** inside one orientation lens and the guess disappears: the
lens asks (or infers), then delivers. One lens also removes the
drift-and-duplication risk of two surfaces re-teaching the same material, and
gives the homeless middle ("I want to understand _one area_") and narrow end ("I
just need _one fact_") a home.

## The design (confirmed with the owner)

**One unified repo-bound orientation lens.** Delivery mode is a discerned
variable with **three categories** (two felt gulfy; three fills the scoped middle
and the pinpoint end):

1. **Specific answer** — a pinpoint, live-doc-grounded answer at the right level,
   then offers to widen.
2. **Area overview** — a synthesised briefing (the current `explain-repo`
   behaviour), now **scopable to an area** (the whole repo, or one area such as
   search, the Practice, or the graph stack), then offers depth or the tour.
3. **Guided tour** — the current `onboard-me` paced, one-at-a-time interactive
   walk, which can lead into setup.

These form an **escalation ladder** (specific → overview → tour): the person
picks an entry point and widens only if they want. The "offer to widen" stays a
single conversational closing line, never a forced "want more?" prompt at every
boundary (that would re-introduce menu-feel).

**The discernment front door.** On any orientation request the lens opens
conversationally (warm greeting; **no tool calls or probes before the person
answers** — inherited from `onboard-me`) and gathers, in **≤3 conversational
questions, adaptively** (infer from phrasing and skip what is already clear;
**never a forced-choice menu** — offer flavours inside a sentence and let them
answer in their own words):

- **What** they want to understand (topic / area, or the specific question);
- **Who / angle** — their background and lens (engineer, strategy, educator,
  AI-builder, leader) and rough experience, to pitch language and depth;
- **Mode** — tour / overview / specific — usually inferable from _What_.

**Setup stays distinct.** Machine-state detection, install, env, and verify steps
are a separate, **go-ahead-gated** capability that the tour (or an overview) leads
into once the person has said they want hands-on help. Setup is an _action with
side effects_, not an information mode — it must not be folded into "a piece of
information delivered."

**The primer is unchanged.** The portable `working-with-agentic-ai` primer
remains the PDR-112 lead-in; it still hands off to the repo-bound surface — now
one lens instead of two — via the single named edge.

## Governance (read before WS4)

This is a **host-phenotype** change, not a portable-doctrine change.

- **PDR-112 is NOT amended.** It governs the portable-primer ↔ repo-lens _seam_
  and explicitly scopes the host's instantiation — _which lenses exist, the
  routing, the lead-in's placement_ — to **host ADRs and the operational entry
  point** (`PDR-112 §Consequences/Required`, verified first-hand at lines
  113–116). Unifying two repo-bound lenses into one is exactly that host
  instantiation. The primer body and the seam-plus-edge contract are untouched.
- **PDR-112 §Required's no-dangle precondition stays satisfied**: the merge keeps
  exactly one continuation behind the hand-off edge (the unified lens). WS3 must
  assert the named edge resolves to the live lens, never a retired name.
- **PDR-009** (canonical-first, no duplication) still holds: one lens, content
  read live from the corpus, no teaching content duplicated. Note: `explain-repo`
  currently sources its Headline Invariants _from_ `onboard-me` (a cross-skill
  pointer); on merge, author the six invariants **once** and have both modes
  reference that single block — do not re-state them per mode (that would
  introduce the PDR-009 violation the split currently avoids).
- **ADR-125** governs the adapter topology: canonical body in `.agent/skills/`,
  generated thin adapters in `.claude/` and `.agents/`; never hand-edit adapters.
- The decision is recorded in a **new host ADR** (WS4) plus the AGENT.md routing
  block (WS3).

## Readiness review (ran 2026-06-23, findings folded)

The three reviewers the planning discipline requires ran against the committed
plan; their load-bearing claims were **verified first-hand** before folding (a
specialist's citations are input-to-verify, not accepted second-hand):

- **assumptions-expert** → READY-WITH-FIXES. Critical: the readiness-reviewer
  dispatch was mis-placed inside WS0, making the status label self-referential
  (fixed — review is this gate, WS0 re-scoped to re-ground only). Important:
  sub-decision 1 (lens name) gates WS1's `name:` frontmatter and the confirmed
  `.claude/settings.json` entries, so it resolves at WS0, not "optionally later"
  (fixed — resolved to a default below).
- **onboarding-expert** → serves onboarding well, gaps in execution fidelity.
  P1s: the access-aware teammate/external fork was missing from the WS1 invariant
  list; a rename breaks live slash commands (verified); WS5 as written (README-first
  persona walks) would never exercise the conversational front door — the exact
  "DOS menus from 1996" failure the register already recorded (register lines
  1328–1336, verified). All folded into WS1/WS2/WS5.
- **docs-adr-expert** → governance APPROVED; the "PDR-112 not amended" claim is
  correct (independently verified). Gaps: the live cross-reference surface is wider
  than the plan named (verified by repo-wide grep — see WS2); the auto-generated
  `CHANGELOG.md` and archive must be excluded from reconciliation (verified:
  `@semantic-release/changelog` in package.json); affirm the no-dangle precondition
  (folded into Governance); pin ADR-202 and constrain the ADR to WHAT-not-HOW
  (folded into WS4).

First-hand verification performed this gate: the live-reference grep surfaced all
the cited targets **plus one the reviewers missed**
(`project-context-preservation-gap-report.md:376`) — which is why WS2's
reconciliation is a **grep-gate, not a fixed checklist**; highest ADR is 201
(→ 202); CHANGELOG is semantic-release-generated; the register's menu-shape
lesson exists as cited.

## Sub-decisions (resolved at the readiness gate; owner may override #1)

1. **Skill name for the unified lens — RESOLVED to a safe default; owner may
   override.** Default: **keep `onboard-me` as the canonical skill name** (it
   already owns the interactive walk and is the more general surface), fold
   `explain-repo` in as overview mode, and **alias `/oak-explain-repo`** into the
   lens. This minimises the verified blast radius: `/oak-onboard-me` is referenced
   in `README.md:73`, `CONTRIBUTING.md:60`, `docs/README.md:16` (and the Codex
   `$oak-onboard-me` form at :17), `good-first-issues.md:99`/`:118` (a path-link),
   `AGENT.md:113`, the onboarding-expert template `:38`, and the simulations
   register — keeping the name avoids breaking all of those. **Owner option:**
   rename to a mode-neutral `orient`; if chosen, it requires alias adapters for
   _both_ old commands plus the full grep-clean reconciliation. Confirm at WS0.
2. **Mode question shape.** Default: **adaptive** (infer from phrasing, confirm
   only when ambiguous), not a fixed always-asked question. Implementer default.
3. **Old skills disposition.** Default: fold `explain-repo` content into overview
   mode, retire the separate skill body, keep its triggers + an alias routing into
   the lens (no dangling slash command, not just no dangling phrase). Implementer
   default.
4. **Host ADR.** Default: **yes** (ADR-202) — PDR-112 §Required names a host ADR
   _and_ the entry point as the two phenotype surfaces. Implementer default.

## Means (workstreams)

Landing unit note: this is a docs-and-skills change, so the unit of landing is a
coherent skill/routing/ADR edit validated by **behavioural conversational
simulation and the skills/markdown gates**, not unit tests. Proof levels are
`non-code` and `value-proxy` (simulated orientation conversations + a live owner
walk); there is no product code under test here.

### WS0 — Re-ground and confirm (blocking)

Re-read first-hand the three current skills, `PDR-112`, `AGENT.md §Orientation
Requests`, and this plan (they may have changed). Run the
[plan-body first-principles check](../../../rules/plan-body-first-principles-check.md):
confirm the three skills still match this plan's description and the unify
decision still holds; emit a `Goal · In · Out` scope artefact. Confirm
sub-decision 1 (lens name) with the owner, or take its default. The
readiness-reviewer pass already ran (see §Readiness review); do **not** re-dispatch
it. **Acceptance:** scope artefact emitted; sub-decision 1 settled; no drift found
between the plan and the live surfaces (or drift recorded and reconciled).

### WS1 — Author the unified lens (depends: WS0)

Author the canonical SKILL-CANONICAL for the one lens, preserving the inherited
invariants below and folding `explain-repo`'s briefing doctrine in as overview
mode. **Acceptance:** one skill body covers all three modes + the setup
sub-branch + the primer edge; no teaching content duplicated; the six Headline
Invariants authored once; a leakage/phenotype read confirms the lens reads the
live corpus rather than baking content.

Inherited invariants that MUST survive (from `onboard-me` / `explain-repo`):

- the greeting-first, **no-probe-before-answer** contract;
- questions as free prose, **never menus**; the private routing model (never
  displayed); plain language until depth is opted into;
- the **live-doc router table** (docs win over the skill body);
- the **six Headline Invariants**, authored once and referenced by both modes;
- the **access-aware teammate/external fork** (onboard-me D1) — routes
  documentation only, never gates access; hides teammate-only surfaces from
  external visitors; relays the live external-contribution posture warmly;
- **state detection only inside setup**; **re-entry/personal-state** (untracked,
  **no PII**) in a closed versioned shape, with the **parse-failure → stateless
  fallback** and the **machine-state-re-verify-is-truth** rule (the state file is
  a hypothesis, never a fact);
- **both honesty invariants** — setup-completion attribution (never claim
  pre-existing work; never present usage stats as "the team workflow") AND the
  exists-vs-planned distinction with live progress-report resolution;
- the PDR-112 hand-off edge.

### WS2 — Retire/redirect the old skills + reconcile references (depends: WS1)

Per sub-decision 1/3: retire `explain-repo` into the lens, alias `/oak-explain-repo`,
regenerate adapters, reconcile `.claude/settings.json`. **Reconcile every LIVE
reference** via a repo-wide grep for `onboard-me|explain-repo|oak-onboard-me|oak-explain-repo`,
**excluding** `plans-old-archive/`, any `/archive/` path, and `CHANGELOG.md` (it is
auto-generated by semantic-release — never hand-edit it). Verified live surfaces to
expect (re-grep at execution; the list is not exhaustive — the grep is the gate):
`README.md`, `CONTRIBUTING.md`, `docs/README.md` (incl. the Codex `$oak-onboard-me`
form), `good-first-issues.md` (incl. the `:118` path-link),
`.agent/sub-agents/templates/onboarding-expert.md`, the simulations register,
`project-context-preservation-gap-report.md`, `AGENT.md`, `.claude/settings.json`,
and both adapter sets. **Acceptance:** `pnpm skills:check` + `pnpm portability:check`
green; no orphaned adapters; **no dangling slash command** (not just no dangling
phrase); the grep is clean of stale refs modulo archive + CHANGELOG.

### WS3 — AGENT.md routing rewrite (depends: WS1)

Rewrite `AGENT.md §Orientation Requests` to route every orientation intent into the
one lens (mode discerned internally), with the primer still leading in via the edge.
**Acceptance:** the block names one lens plus the primer; no guess-which-skill
language; the named hand-off edge resolves to the live lens (not a retired name);
the non-loader-platform fallback names the one canonical SKILL-CANONICAL path; a
fresh read routes "tell me about this repo", "explain X", "how does Y work",
"onboard me", "where do I start", and "new to AI" all into the lens (the last via
the primer edge).

### WS4 — Host ADR (depends: WS1)

Author host **ADR-202** (re-check the number against the live directory at author
time — highest is currently 201). State the **WHAT only**: the orientation surface
is one intent-discerning lens; delivery mode is a discerned variable, not a skill
boundary; setup is a distinct side-effecting capability, not an information mode;
the PDR-112 seam and primer are unchanged. The mode _names_, the ≤3-question
contract, the router table, and the setup mechanics live in the SKILL (WS1), not the
ADR. **Acceptance:** ADR accepted; cross-references PDR-112 (states it is NOT
amended), PDR-009, ADR-125; checks and records whether a prior orientation ADR is
superseded; PDR-112 file unchanged.

### WS5 — Validation by conversational simulation (depends: WS2, WS3, WS4)

Run the behavioural acceptance scenarios below as **simulated orientation
conversations** (the agent receives the trigger phrase and must conduct the
front-door discernment) — NOT README-first doc-path persona walks, which never
exercise the conversational front door (the register's recorded "DOS menus" failure,
lines 1328–1336). Each scenario gets an explicit **no-probe-before-first-answer**
check and a **no-menu-shape** check. Add a **live owner walkthrough** — the
register's standing lesson is that only a real run proves the experience. Update
[`onboarding-simulations-public-alpha-readiness.md`](../active/onboarding-simulations-public-alpha-readiness.md)
with a dated family entry and a cross-ref to ADR-202; run `markdownlint`,
`skills:check`, `portability:check`, `format:root`. **Acceptance:** every scenario
passes its expected behaviour (incl. the two interaction checks); the owner walk is
recorded; gates green; the WS2 grep is clean.

### WS6 — Thread, continuity, learning loop (depends: WS5)

Reopen the `orientation-skills-family` thread with new lane state and an identity
row; update `repo-continuity.md`; cross-reference the superseded archived plan; run
`oak-consolidate-docs` / `oak-session-handoff` at close. **Acceptance:** thread
reopened and continuity reflects the unified lens; archived plan cross-referenced.

## Behavioural acceptance scenarios (the real proof — simulate each as a conversation)

- _"Tell me about this repo"_ → opens with conversational discernment (NOT an
  immediate briefing, NOT a menu); infers/asks angle and mode; delivers a
  whole-repo overview pitched to their lens; offers tour or a specific dive.
- _"How does the SDK codegen work?"_ → recognised as specific; answered directly
  from live docs at the right level; offers to widen.
- _"I want to understand the search architecture"_ → area overview scoped to
  search; offers depth or the tour.
- _"Onboard me" / "where do I start"_ → guided tour; leads into go-ahead-gated
  setup if they want hands-on.
- _An external (non-teammate) visitor asking to contribute_ → routed past
  teammate-only surfaces; the external-contribution posture relayed warmly; access
  never gated by the question.
- _"I'm new to working with AI agents"_ → the primer leads in (PDR-112 edge), then
  forwards into the lens.
- Across all: no duplicated teaching content; the PDR-112 seam intact; gates green.

## Prerequisites

- **Blocking:** sub-decision 1 (lens name) is confirmed or defaulted at WS0 — it
  gates the WS1 `name:` frontmatter and the WS2 settings/adapter reconciliation.
- **Beneficial:** the `onboarding-expert` persona-simulation register
  (`developer-experience/active/`) as the established validation home. Minimum
  shippable shape without it: WS5 still runs the conversational simulations + the
  owner walk and records verdicts inline in the thread record.

## Non-goals (YAGNI)

- Not changing the `working-with-agentic-ai` primer.
- Not amending PDR-112.
- Not changing what any doc _says_ — only how orientation is discerned and
  delivered. No new teaching content is authored; the live corpus is reused.
- Not folding setup (machine actions) into an information mode.
- Not adding a forced-choice menu UI for the mode question.
- Not editing archived plans or the auto-generated `CHANGELOG.md` during
  reconciliation — they are historical and frozen.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Over-merge — setup folded into "information" | Forbidden by design; setup is a distinct go-ahead-gated sub-branch. WS1 acceptance checks the boundary. |
| Under-merge — the explain-vs-onboard binary survives | The whole point is to dissolve it; WS3 removes the split language; the "tell me about this repo" scenario must discern, not briefing-dump. |
| Breaking the PDR-112 seam | Do not touch the primer body or the edge contract; the edge keeps exactly one live continuation; WS4 asserts PDR-112 unchanged. |
| Renaming the lens silently breaks live slash commands / path-links | Default keeps `onboard-me` canonical; if renamed, alias BOTH old commands; WS2 grep-gate + "no dangling slash command" acceptance (verified surfaces incl. the `good-first-issues.md:118` and onboarding-expert.md:38 path-links). |
| Over-eager reconciliation edits the auto-generated CHANGELOG or archive | Explicit non-goal; WS2 grep excludes `CHANGELOG.md`, `plans-old-archive/`, `/archive/`. |
| Menu-shape / lost-conversation regression | WS5 validates by conversational simulation with explicit no-menu and no-probe-before-answer checks, plus a live owner walk (the register's recorded failure mode). |
| Headline Invariants duplicated per mode | Authored once, both modes reference the single block (WS1). |
| Live-doc drift | The lens keeps the router-principle (docs win); no content baked into the body. |

## Foundation alignment

- [PDR-112](../../../practice-core/decision-records/PDR-112-teaching-surface-family-across-a-portability-seam.md)
  — the pattern instantiated (host instantiation is phenotype; not amended).
- [PDR-009](../../../practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md)
  — canonical-first, no duplication, routing.
- [ADR-125](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
  — adapter topology (regenerate, never hand-edit).
- [ADR-117](../../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md)
  and [PDR-018](../../../practice-core/decision-records/PDR-018-planning-discipline.md)
  — plan architecture and discipline.
- [`present-verdicts-not-menus`](../../../rules/present-verdicts-not-menus.md) and
  `onboard-me`'s not-a-menu greeting contract — the conversational discernment.
- `principles.md` first question — _could it be simpler?_ One lens is simpler than
  two-plus-a-guess.

## Plan-body first-principles check

Fires at **WS0**: re-read the three current skills + PDR-112 + the AGENT.md routing
block first-hand and confirm they match this plan before authoring (they may have
been edited since 2026-06-23). The landing path is the unified skill body, its
generated adapters, the AGENT.md routing block, and a host ADR — confirm those are
the live surfaces. No vendor-literal call shapes are involved.

## Lifecycle triggers

Reference [`lifecycle-triggers`](../../templates/components/lifecycle-triggers.md).
Execution touches skills, an entry point, and an ADR — significant Practice/doc
change → the readiness reviewers (already run) and WS5 onboarding/docs validation
are the required touch points; WS6 runs the consolidation learning loop at
completion.

## Readiness reviewers

The required reviewers (`assumptions-expert`, `onboarding-expert`,
`docs-adr-expert`) **ran 2026-06-23** against the committed plan; their load-bearing
findings were verified first-hand and folded (see §Readiness review). This is why
the plan is marked READY FOR EXECUTION rather than draft. WS0 re-grounds against any
drift since; it does not re-run the review.
