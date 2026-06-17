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

## Where We Are (2026-06-17, Ocelot binds Curfew — vision authored + wired)

- **Branch:** `docs/planning-and-validation`. **Everything this session is
  uncommitted** (doc/memory writes only; no commit, no push, no gates run).
- **VISION is DONE and now lives at the repository root: [`VISION.md`](../../../../VISION.md)**
  (moved from `docs/foundation/` via `git mv`, history preserved). It is a real
  vision in the owner's shape: **what we're changing · why it matters · the
  documents that explain how**. It carries a **strategy placeholder** ("Our
  strategic goals — defined by the strategy (in development; not yet linked
  here)") — the strategy does not exist yet.
- **Next safe step:** **make the STRATEGY documents EXIST** (see §Next below).
  Then, and only then, the plan-estate restructure.

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
2. **Two co-equal, first-class value streams — neither secondary:** (a) an MCP app
   that puts Oak inside the AI assistants teachers already use; (b) engineering
   tools (SDK, semantic search, curriculum graph, MCP, evidence surfaces) for the
   wider ecosystem to build with Oak's curriculum data. The survey §13
   "two-products conflation / tension" was an **unverified sub-agent claim and is
   WITHDRAWN** — there is no tension; one body of infrastructure, two co-equal
   delivery channels.
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

## OUTDATED-CONTENT NOTE (owner-requested — re-anchor during the estate phase)

The vision rewrite **removed the "What We Deliver" canonical inventory** that the
old vision held. Per owner: paths were made correct everywhere, but the
**content anchor is now stale** and must be re-anchored when the estate is
structured (do NOT restructure it now — gate). Specifically, references to
`VISION.md#what-we-deliver` now have correct file paths but **dead anchors**, and
surrounding text still claims "canonical inventory in VISION":

- `README.md` (4 occurrences) — the README's own `## What This Repo Provides`
  table + `### Sector reusable components` now hold the inventory; repoint there.
- `.agent/plans/sector-engagement/` — `README.md`, `current/README.md`,
  `sector-reusable-components-adoption.plan.md`, `roadmap.md` anchor their
  partner-adoption contract on the VISION inventory; decide the canonical home
  (README? the forthcoming strategy?) and re-anchor.
- `.agent/memory/operational/threads/sector-engagement.next-session.md` (one).

## Pending doc refinements (adversarial loss-scan, 2026-06-17 — not yet applied)

Surfaced by the context loss-scan; left unapplied (owner-taste or deferred),
captured so they survive a fresh context:

- **README headline (line ~8) under-represents a co-equal stream** — the prominent
  blockquote frames the repo around *building on the ecosystem* alone, omitting
  the teacher-facing stream (docs-adr reviewer finding, judged valid, left for
  owner taste). Bring it into co-equality when the README front is next touched.
- **README contraction** — one un-contracted "you do not need" in the public
  narrative (editorial-voice nit, trivial).
- **Working tree** carries two pre-existing uncommitted edits NOT from this
  session: `completed-plans.md`, `good-first-issues.md`.
- The detailed 7-agent delta-workflow output is in machine-local `/tmp`
  (ephemeral); its load-bearing headlines are in §Delta above and the raw is
  re-derivable from git state — not re-homed.
- Deliberately NOT carried forward: the rejected flagship/platform/portfolio
  product-shape framing (re-introducing it would re-litigate the settled
  co-equality).

## K1–K3 AUTHORITY ISSUE (still live — resolve in the strategy phase)

Four strategy docs — `curriculum-mcp-path-to-ga/launch-readiness-framework.md`,
`high-level-plan.md`, `curriculum-mcp-path-to-ga/roadmap.md`, and the future
milestone-redefinition stub — assert keystones **K1–K3 as "owner-DECIDED
(2026-06-15)" with no correction qualifier**. The survey §14 records the owner's
position that K1–K3 are **agent INPUT, not ratified** (only `repo-continuity.md`
carries the correction). K1 ("live" = full GA with *observed* positive impact)
is itself an impact definition → treat K1–K3 as **strategy keystones to settle**
(ratify / revise / correct the docs), not a doc-authority footnote.

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

1. **Make the strategy documents EXIST** — organised around delivering the
   vision's impact. Integrate existing strategy surfaces (`high-level-plan.md`,
   `curriculum-mcp-path-to-ga/` roadmap + launch-readiness-framework + milestones,
   the survey report). Settle **K1–K3** as keystones. Derive the **value-stream
   taxonomy** — hold it as a *hypothesis to re-derive from the now-settled vision*,
   not an inherited list (candidates: the teacher-facing MCP-app stream, the
   ecosystem-enablement stream, the Practice stream; possibly organised around the
   three orders of effect rather than a flat list). Fold in the release-readiness
   requirements above. Fill the VISION strategy placeholder + link the corpus.
2. **Then (gated): the plan-estate restructure** driven by strategy + vision —
   new directory structure, rehome/move/remove/create, value-preserving, and
   **re-anchor the What-We-Deliver references** named above.
3. **Owner decision (2026-06-17) — REQUIREMENT for the estate rework:** the
   survey-flagged collection that lacks a README and an owner-agreed gate
   (survey report §4) is **removed**. Every plan it holds is either **properly
   re-housed** in a live lane with a named dependency and an owner-agreed gate,
   **or** its useful concept is **extracted and the item deleted**. No plan is
   left ungated; the section ceases to exist. This settles the open owner
   decision the survey raised about that collection, and aligns the estate with
   the no-holding-state doctrine (`no-hedging-vocabulary`).

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
