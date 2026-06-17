# Next-Session Record — `strategy-and-plan-estate-holistic-review` thread

Holistic work on Oak's **vision, strategy, and planning estate**. The transition
this thread now serves: **the repository is moving from an important experiment to
an important product** (owner, 2026-06-17). That needs, in order: a clear coherent
**vision** → a practical, measurable **strategy** organised around delivering the
vision's impact → a consolidated, simplified **planning landscape** re-organised
around the strategy and vision. Re-org is **value-preserving**: understand the
value encoded in plans and express it more clearly and discoverably — never delete
ideas.

The 2026-06-15 survey (waves, census, adversarial verification) is the prior
foundation; its report + raw data live in
[`.agent/reports/plan-estate-survey-2026-06-15/`](../../../reports/plan-estate-survey-2026-06-15/README.md).

## Where We Are (2026-06-17, Squall spins Stratus — Phase 2A ratification gate COMPLETE)

- **Branch:** `docs/planning-and-validation`. **Scope authority is the controlling plan**
  [`vision-strategy-and-plan-estate.plan.md`](../../../plans/vision-strategy-and-plan-estate.plan.md);
  this record is the pickup surface, not an authority for scope.
- **Phase 1 (Vision) DONE** — [`VISION.md`](../../../../VISION.md) at repo root, three co-equal
  value streams (`d4f6e0293`). README headline now names all three streams (this session).
- **Phase 2A ratification gate COMPLETE (this session).** The owner ratified all three decisions
  ([`2a-decisions.md`](../../../plans/vision-strategy-and-plan-estate.2a-decisions.md) → status
  `ratified`): **K1–K3** = the **MCP-app stream's** keystones (§14.2 correction to K1 — value-proof
  articulated here, measured by Oak, not in-repo; impact-gate app-stream-only; K2 "for now" =
  post-GA non-commitment; K3 = app's real dependency set, whole-estate only at portfolio level);
  **taxonomy depth = hybrid** (drives Phase 2B granularity); **README = name all three streams**
  (applied). **Value/impact articulation AUTHORED** — the MCP-app stream in full (it alone gates
  go-live) plus a separate mention of the ecosystem and framework streams' value
  ([`value-and-impact.md`](../../../plans/vision-strategy-and-plan-estate.value-and-impact.md)).
  Owner refinement 2026-06-17: all three streams are **co-equal and each needs its own strategy +
  planning**; only the MCP-app stream gates go-live; the other two's fuller strategy follows
  (tracked `p2a-other-streams-strategy`). Controlling plan amended; K1–K3 reconciled across the
  five keystone surfaces + `repo-continuity.md` (the dated survey report left as a dated input).
- **Next safe step (owner-directed 2026-06-17):** a fresh session opens by **discussing the
  nature of the strategy layer and the vision→strategy→planning flow** — before any more strategy
  work. Only then the ecosystem + framework streams' strategy + planning → Phase 2B → 2C. See §Next.

## Order (owner-set 2026-06-17 — SUPERSEDES the prior A→B→C)

1. **Vision** — to standard, correct audience. **COMPLETE.**
2. **Strategy** — make the strategy documents *exist*, organised around delivering
   the vision's impact; integrate existing strategy surfaces as appropriate.
   **NOT STARTED.**
3. **Plan-estate restructure** — rehome/move/remove/create plans and coordination
   surfaces, likely a **new directory structure driven by strategy + vision**.
   **GATED until 1 + 2 are done.** Value-preserving (no idea loss).

**The gate:** no plan-estate restructuring until vision + strategy are done. It was
lifted only once, narrowly, for VISION-path link-hygiene (now complete).

## Framing decisions ratified with the owner this session (load-bearing)

1. **The repository is a *means* to Oak's *ends*.** The vision enables Oak's
   mission; it does not restate or own it. Oak's mission is quoted **verbatim**
   (do not paraphrase it — "supporting teachers to teach, and enabling pupils to
   access" is precise teacher-agency language; an earlier paraphrase
   "helping teachers teach" was wrong and was corrected).
2. **Three co-equal value streams — none secondary** (settled 2026-06-17; the
   vision names all three): (a) an MCP app that puts Oak inside the AI assistants
   teachers already use; (b) engineering tools (SDK, semantic search, curriculum
   graph, MCP, evidence surfaces) for the wider ecosystem to build with Oak's
   curriculum data; (c) the agentic-engineering framework that delivers AI-enhanced
   innovation (the Practice as a value stream in its own right, per owner §14.1).
   One body of infrastructure, three co-equal delivery fronts.
3. **A vision states the change + why + a map to the how.** It delegates
   explanations and commitments (deliverables inventory, measurement, integrations,
   positioning, licensing) to other documents and *points* to them — it does not
   contain them. (The earlier "meandering explanations and commitments" draft was
   the failure to make it a vision.)
4. **Audience = Oak** (leadership deciding to back this as a product, and the
   delivery team); external developers / sector / ecosystem are beneficiaries
   described within, not co-addressees.
5. **Editorial voice** applies to the vision, the strategy, and the public-facing
   parts of the README — **never to plans or developer-facing docs** (it interferes
   with transmission of understanding to builders). The teacher-protagonist
   "you" mechanic is for teacher-facing copy; strategic/internal docs use the
   voice *qualities* in Oak's "we" voice.

## Artefacts landed this session

- **`VISION.md`** — rewritten + moved to root + content-fixed.
- **`.agent/directives/editorial-tone.md`** — NEW directive, derived from the
  `oak-tone-of-voice` skill in the sibling `oak-skills` repo: the three
  principles, British terminology, anti-patterns, self-edit checklist, the
  **application boundary** (apply to vision/strategy/public-README; not to
  plans/dev), and an **audience palette** organised on the **build-vs-decide axis**
  (builders want capability/contracts; leaders want value/impact/cost) — owner
  confirmed "builders and leaders" over splitting edtech/AI. Wired into `AGENT.md`.
- **VISION reference sweep** — all LIVE references repointed to root `VISION.md`
  (README, docs/README, docs/foundation/README, AGENT.md, onboard-me skill,
  curriculum-guide, ADR-008/119/194, two reports, the sector-engagement thread,
  and — per owner direction lifting the gate for hygiene — the live sector /
  developer-experience / discovery / architecture plans). **31 historical records**
  (archives, raw survey data, dated evidence, napkins, `.cursor/plans`) left
  untouched per archive discipline.
- **AGENT.md** — `[vision]` path fixed; editorial-tone trigger added; the
  `## Oak Open Curriculum Cardinal Rule` heading typo (missing space) fixed.
- **README** — public narrative aligned to the vision and given the editorial
  voice in earlier passes (developer sections left plain).

## Pending doc refinements (adversarial loss-scan, 2026-06-17 — not yet applied)

Surfaced by the context loss-scan; left unapplied (owner-taste or deferred),
captured so they survive a fresh context:

- **README headline** — DONE (2026-06-17): owner ratified "name all three streams";
  the headline (`:8`) and strapline (`:6`) now name all three in the editorial voice.
- The 7-agent delta-workflow output is ephemeral (`/tmp`); its headlines are in
  §Delta above and the raw is re-derivable from git state.

## K1–K3 AUTHORITY ISSUE — RESOLVED (owner-ratified 2026-06-17)

The decided-vs-input contradiction is closed. The owner ratified K1–K3 on
**2026-06-17** as the **MCP-app stream's** keystones, with the §14.2 correction to K1
(value-proof articulated here and measured by Oak, not instrumented in-repo) and K3
scoped to the app's real dependency set (whole-estate only at portfolio level). The
five "decided" surfaces (`launch-readiness-framework.md`, `high-level-plan.md`,
`roadmap.md`, the milestone-redefinition stub, the readiness assessment report) plus
`repo-continuity.md` are reconciled to the ratified wording; the dated survey report
§12/§14 is left as a dated input (Non-Goal: not edited). Authoritative wording lives
in the [Phase-2A decisions brief](../../../plans/vision-strategy-and-plan-estate.2a-decisions.md)
and the launch-readiness framework.

## Delta since the 2026-06-15 survey (re-grounded first-hand this session)

- The estate churned ~82 commits on `docs/planning-and-validation`, **dominated by
  the Practice/substrate value stream** (PDR-096–101, decision-debt machinery,
  fitness made report-only, owner-gated-vocabulary purge, `distilled.md` drained).
  This is the deliberate inward value stream (owner §14), not a defect.
- Strategy surfaces received **scaffolding-wiring only** (date bumps, framework +
  stub pointers); **no substantive forward movement.** Survey hygiene findings are
  **UNCHANGED**: reachability ~42% (153/363 unlinked), 59 stale executables, 14
  session-openers, missing lane READMEs, the reachability-CI-validator plan still
  `decision-incomplete`.
- Product/user-value gaps **unchanged**: widget **search UI not started**
  (brand-banner-only); **no production-Clerk execution plan**; Cloudflare gate
  unpromoted; WS3-Phase-5 plan still carries a **dead blocker on PR #76** (merged
  2026-04-10); **no impact/value articulation started**.
- Survey-framing correction: the README front door reads **"Invite-Only Alpha"**
  (not "private alpha"), one milestone behind the M2 tracker. (A survey
  "missing-README" collection finding was a labelling artefact; its disposition is
  an open owner decision — detail in the survey report §4.)

## RELEASE-READINESS / DUE-DILIGENCE REQUIREMENTS (abstracted; fold into the estate)

From an owner-provided private source (abstracted — **no PII, no named people or
institutes**; not exhaustive, use judgement). These are go-live gates for the
**MCP-app value stream**, several owned **outside this repository** — the estate
structuring must include plans/owners for them:

- **Algorithmic transparency / compliance** — a public-body algorithmic
  transparency reporting obligation must be completed before release.
- **Privacy policy & Terms/Conditions** — decided and published (reuse an existing
  Oak product's, or author new).
- **AI output quality & safety evals** — independent stress-testing of the MCP's
  AI outputs against Oak's quality and safety benchmarks before release.
- **Data-availability gate** — the curriculum data the API needs must actually be
  served (close the data gap, e.g. a missing materialised view at lesson level); a
  hard go-live prerequisite.
- **UX** — the teacher interaction experience within the host product considered;
  for a text/tool MCP the UX is largely the host interface, UI is optional and can
  be disruptive, minimal branding + link-back is the current baseline; the
  design-system work may apply.
- **Go-to-market / distribution / school support** — launch enablement and
  discoverability (teachers will not auto-discover or self-install), and messaging
  / positioning alongside Oak's other AI offerings.

## Next (fresh context starts here)

**The controlling plan is**
[`vision-strategy-and-plan-estate.plan.md`](../../../plans/vision-strategy-and-plan-estate.plan.md)
— read it first; it is the scope authority (Phases 1–3, the DAG, gates, acceptance,
the §4 ungated-collection removal, the disposition-ledger value-preservation). This
record is the pickup surface, not the scope.

**Phase 2A ratification gate is COMPLETE; the value/impact articulation is AUTHORED.**
**Owner-directed gate (2026-06-17): a fresh session opens by DISCUSSING the nature of the
strategy layer and the vision→strategy→planning flow — BEFORE any more strategy work.**
This is a design discussion with the owner, not an authoring task; it likely reshapes what
"the strategy layer" and Phases 2A–2C mean. Logged as `Q-` in open-questions. In order:

1. Read the plan, the [decisions brief](../../../plans/vision-strategy-and-plan-estate.2a-decisions.md)
   (status `ratified`), and the [value/impact articulation](../../../plans/vision-strategy-and-plan-estate.value-and-impact.md)
   (the MCP-app stream in full + a separate mention of the other two streams' value).
2. **Discuss with the owner: what is the strategy layer, and how does vision → strategy →
   planning flow?** Settle this before authoring more. It may revise the phase structure below.
3. **Only then — author the ecosystem + framework streams' strategy + planning.** Owner
   refinement 2026-06-17: all three streams are co-equal and each needs its own strategy layer
   and planning; their value is already named in the articulation, their fuller strategy follows
   (tracked `p2a-other-streams-strategy`). Only the MCP-app stream gates go-live.
4. **Then Phase 2B** — value-stream redundancy/gap analysis at the **hybrid** depth
   (ecosystem decomposed to SDK/search/graph/EEF); re-verify the survey's empirical
   counts first. **Then Phase 2C** — execution spine. Do not jump to the spine first.
5. **Estate hygiene runs in parallel anytime (NOT strategy-gated):** re-anchor the
   dead VISION What-We-Deliver references, fix the editorial-tone vision path, clear
   the dead PR-76 blocker — after re-verifying current reachability counts.

Phase 3 (the plan-estate restructure — new structure, value-preserving via the
disposition ledger, this plan's permanent home) stays gated until Phases 1+2 are
done. Full scope: the plan.

## Method carried forward

- Long analytical sessions **narrow and over-claim** — this session took ~6 owner
  re-framings (experiment→product, question-the-order, co-equality-not-tension,
  vision-is-not-a-kitchen-sink, mission-verbatim-not-paraphrased). Self-ask on a
  cadence: *still at the right altitude? has the newest input reframed it? am I
  over-claiming? is this "tension/conflation" an owner judgement or my unverified
  frame?*
- **An agent-sourced claim of product "tension/conflation" is a product judgement
  the owner owns** — default to co-equal-by-design until the owner names a real
  tension. (The §13 conflation claim was the trap.)
- **Authoritative/mission language is quoted exactly, never smoothed for prose.**
- Treat all agent-produced inputs (sub-agent reviewers, survey waves, K1–K3) as
  **input-to-verify**; validate load-bearing claims first-hand.

## Participating agent identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Baobab lifts Topsoil | claude-code | claude-opus-4-8 | 3be248 | surveyor-synthesist | 2026-06-15 | 2026-06-15 |
| Ocelot binds Curfew | claude-code | claude-opus-4-8[1m] | c9423b | vision-author + estate-rewiring | 2026-06-17 | 2026-06-17 |
| Tempest spins Spire | claude-code | claude-opus-4-8[1m] | 94a5c5 | controlling-plan author + review-synthesis + hygiene | 2026-06-17 | 2026-06-17 |
| Squall spins Stratus | claude-code | claude-opus-4-8[1m] | 8b8770 | Phase-2A ratification gate + decision recording + K1–K3 reconciliation | 2026-06-17 | 2026-06-17 |
