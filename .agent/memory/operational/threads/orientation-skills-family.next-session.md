# Thread: orientation-skills-family

**Purpose**: Design and build the human-facing teaching-surface family — the
portable agentic-AI-literacy primer (lead-in) plus the existing repo-bound
orientation lenses (`explain-repo`, `onboard-me`) — across the portability seam
defined by PDR-112.

## Participating agent identities (PDR-027)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Bora lifts Downdraft | claude | claude-opus-4-8 | 5120ef | planner → implementer | 2026-06-22 | 2026-06-22 |
| Orbit rides Horizon | claude | claude-opus-4-8 | ef8284 | implementer | 2026-06-22 | 2026-06-22 |
| Skipper tracks Reef | claude-code | claude-opus-4-8[1m] | 87a7bb | planner — authored the orientation-lens unification plan (owner-directed); did not implement | 2026-06-23 | 2026-06-23 |
| Zenith lifts Firmament | claude-code | claude-opus-4-8[1m] | 5c2f1b | implementer — executed the orientation-lens unification (WS0–WS6); folded two mid-execution owner directions | 2026-06-23 | 2026-06-23 |
| Skipper tracks Kelp | claude | claude-opus-4-8[1m] | 20962d | implementer — WS-B MCP-surface continuation: cherry-picked D1+D2 to a fresh worktree off main, refactored the test surface to behaviour-only, scoped the audience-model work | 2026-06-26 | 2026-06-26 |
| Cedar lifts Canopy | claude | claude-opus-4-8[1m] | 435d30 | implementer — WS-B D0 audience-model reconciliation + compliance firewall (DONE, pushed `36cb27444`); authored the data-sources brief; created the cross-worktree work-state map | 2026-06-26 | 2026-06-27 |
| Peony calls Trunk | claude-code | claude-opus-4-8 | d8ff86 | implementer — WS-B D3 (explain tool) landed `2ef673f4b`; authored the oak-under-the-hood full-lens reframe spine + the session wind-up/correction; D4/D5 and the retire-the-bake decision deferred to a fresh session per owner direction | 2026-06-27 | 2026-06-27 |
| Swordfish rides Surf | claude-code | claude-opus-4-8[1m] | d7bc11 | implementer — re-assessed first-hand, REWROTE the plan to the simple system (one behaviour, two channels, no carried content; pointer-shape MCP; delete the bake), validated via two ultracode suites; **W1 (behaviour) DONE + onboarding-expert-reviewed, uncommitted**; W2/W3 not started; mid-cycle handoff (claim bb9073cd, record set) for an owner-named successor | 2026-06-27 | 2026-06-27 |

## CURRENT PICKUP (2026-06-27, Swordfish rides Surf → Seal lifts Whirlpool) — READ FIRST

The reframe is **scoped, simplified, planned, and partly built.** Pickup surfaces, in order:

1. **The owning plan** `.agent/plans/sdk-and-mcp-enhancements/active/oak-under-the-hood.plan.md`
   — decision-complete and self-contained (the prior `explain-orientation-mcp-surface.plan.md`
   was removed; substance conserved there + in git).
2. **The mid-cycle handoff record**
   `.agent/state/collaboration/handoffs/bb9073cd-137f-46e5-832f-72a9d6ff74dd.md` — the correction
   arc and the loss-scan residue (the *why*). Adopt claim `bb9073cd` first.

**State:** the system is **one behaviour, two channels, no carried content** (pointer-shape MCP;
delete the bake apparatus; tests behaviour-only; official-sourcing + no-PII; all parts always work,
no fallback/optionality). **W1 (the behaviour) is DONE** (canonical authored + onboarding-expert-
reviewed + hardened, **uncommitted** in worktree `worktree-ws-b-explain`). **W2 + W3 not started**
— start at W2 (full verified inventories in the plan). Director: Chinook turns Halo (route ADR-202
and portability there). #243 stays DRAFT until the reframe lands. The Peony WIND-UP below is the
*prior* layer, superseded by the plan but kept for the arc.

## WS-B → oak-under-the-hood reframe — WIND-UP & NEXT-SESSION PICKUP (2026-06-27, Peony calls Trunk) — READ FIRST

**Successor (owner-directed): Swordfish rides Surf.** Standing mandate for the pickup:
**re-assess the reports, findings, plans, and conclusions first-hand — do not inherit them as
settled.** This session took wrong turns (corrected mid-flight), so treat its conclusions, the
"validated facts", and the reviewer verdicts (barney / docs-adr / mcp-expert) as **inputs to
verify**, not truth; re-fetch live state (main and the estate moved); apply verify-don't-trust
throughout, most strictly where a claim is convenient. Full detail in the owning plan's
`## SESSION WIND-UP & CORRECTION` section (read it first).

**Landed this session:** WS-B **D3** (the model-fired explain tool) committed local on `worktree-ws-b-explain` at `2ef673f4b` (full gate green; folded code-expert + mcp-expert + test-expert). The **oak-under-the-hood reframe spine + a session wind-up/correction** are committed to the owning plan.

**Owner reframe (2026-06-27):** rename `effort`/`explain` → **oak-under-the-hood**, full-lens across BOTH channels (in-repo `/oak-explain` skill + the MCP projection), + an **intent → value → impact** content spine. THEN the owner corrected the *thinking*: **synthesis, not either-or** — route to canonical SSOT (the PUBLIC GitHub repo for repo doctrine/docs; the PUBLIC Oak site `www.thenational.academy/about-us/...` for org mission/goals/pillars), **minimum custom content**, DRY/SSOT, and **official-sourcing** (relay what Oak officially says — VISION quotes the mission verbatim; never the repo's own derivation). **No PII**; use **"executive audience"**, never "Oak leadership".

**Authoritative pickup = `oak-under-the-hood.plan.md` §1 (the two frozen models).** Swordfish rides Surf rewrote `explain-orientation-mcp-surface.plan.md` → `oak-under-the-hood.plan.md` (decision-complete, 2026-06-27); the prior plan's wind-up/correction substance is conserved in §1 (frozen models) + §4 (disposition). Settled: Oak Under the Hood explores THIS REPO through lenses (angle × facet: impact/intent/mechanisms/value) framed by Oak's vision/goals/strategy, with Oak-org as context + on-interest depth; access-aware source resolution (read-local when local, fetch-public when remote); NO baking (retire `effort-overview.ts`); official Oak (website + `meet-the-team#documents` PDFs) authoritative for org claims, repo docs for repo-intent.

**Fresh session owns:** whether/how to retire the baked overview (owner: *a fresh session decides*; leading read = retire for SSOT/DRY) and the route-vs-cite-vs-minimal-synthesis **composition** for the remote channel — a synthesis of all three reviewers, not a pick. Do NOT execute the retire here. Then the R-workstreams (R1 content/routing → R2 lens rename → R3 ADR-202 amend + AGENT.md → R4 MCP rename → R5 D4/D5 → R6 UK-spelling). Route the ADR-202 amendment + rename portability to the Director (Oyster spins Coral) for review.

**Merge/coordination:** #243 stays DRAFT until the reframe lands; the Director owns merge order + the napkin/repo-continuity `/oak-semantic-merge`. Main advanced this session (#246/#249/#251/#247 landed; napkin drain in progress), so the branch needs a main-rebase before #243 is merge-ready.

## WS-B MCP surface — ACTIVE continuation handoff (2026-06-26, Skipper tracks Kelp)

The WS-B explain-orientation MCP-surface lane is LIVE again (owner-directed). Read this section
first, then the owning plan (`oak-under-the-hood.plan.md` — the decision-complete rewrite).

**UPDATE (Cedar lifts Canopy, 2026-06-26) — D0 audience side RESOLVED.** The explain audience model
is reconciled across the SKILL-CANONICAL (SSOT) and the MCP projection: added data analyst/scientist,
education expert, product expert; kept "educator" in the canonical only (the projection omits it —
separation principle); added a third **compliance firewall** (owner: no compliance claims; route
direct questions to Oak's official surfaces). code-expert + docs-adr-expert APPROVE; 766 app tests
green (behaviour-only). The plan's stale §D1.1/§Proof-Contract/§Faithful-Projection/§Risk sections
are reconciled in-place; see the plan's §"D0 — Audience model RESOLVED". **DATA-SOURCES.md ownership
(owner-directed):** Cedar authors it as a **ship-independent governance PR off main** (reuse the
`oak-data-sources` worktree); explain POINTS to it at WS-B ship-time. **Next:** commit D0 → author
DATA-SOURCES.md (separate PR) → D3 tool / D4 prompt / D5 value-proxy.

**CLOSEOUT (Cedar lifts Canopy, 2026-06-27).** D0 is DONE and PUSHED — `worktree-ws-b-explain` at
`36cb27444` on origin (full pre-push gate green), draft PR #243. The cross-worktree work-state map
is at `.agent/state/collaboration/cross-worktree-work-state.md` (read it for the live picture). The
data-sources brief is written + owner-approved — short/simple review/removal criteria the owner
reviews in the finished doc; per-source links to the external source + any in-repo representation
(data cache *or* schema/spec) — at
`.agent/plans/product-development-governance/data-sources-governance.brief.md` in the PRIMARY
checkout (untracked; the data-sources session commits it). **Continuation:** D3 tool → D4 prompt →
D5 value-proxy (all behaviour-only); update the WS-B branch on main before merge (#242 landed
`3895b3f45`). Cedar retiring; WS-B claim released.

**Branch / how to continue.** Work is on branch **`worktree-ws-b-explain`** (pushed to origin).
Next session: check it out (or a fresh worktree off it), then run **`pnpm install` AND `pnpm build`**
before any gate — a fresh worktree's ESLint flat-config imports the internal
`@oaknational/eslint-plugin-standards`, which must be built or `eslint` exits 2. Open a fresh claim
on the boundary (the prior claim was local-only and is closed).

**SEMANTIC-MERGE REQUIRED at branch→main reconciliation.** This branch commits shared `.agent/`
memory/state/doctrine files (this thread record, repo-continuity, napkin, the plan) that have
diverged from main while other sessions moved it. When `worktree-ws-b-explain` merges to main, merge
these files **SEMANTICALLY by hand (`/oak-semantic-merge`), never a git line-merge** — git
understands lines, not concepts (the `merge_class:` frontmatter + owner standing direction).

**State landed this session:**

- 8 D1+D2 commits cherry-picked onto a fresh worktree off `main`; verified current + gate-green.
- **`03c279ca2`** — test-surface refactor to behaviour-only (owner-directed). Full pre-commit gate
  chain green; +114/−605. D1 (generation step + curated behaviour-shell + curated effort-overview +
  DI'd assembler + regenerate→git-diff drift check) and D2 (`docs://oak/explain.md` low-salience
  resource) are BUILT and behaviour-only-tested.

**DECISIONS / VERDICTS — do not re-litigate:**

1. **Test doctrine (owner, absolute): tests prove BEHAVIOUR, never configuration or content.** Six
   disqualifying screens — tests config / asserts content-that-changes / tests test-code / tests a
   third-party lib / uses a complex mock over a trivial DI'd fake. Hashing a source to detect change
   (the deleted fingerprint drift-guards) is a config-pin, the antithesis. Content greps are brittle.
   DELETED: both fingerprint-guard modules + tests, both content-grep test files.
2. **The firewall (effort-domain; no curriculum; no volatile status) is a PR-REVIEW checklist item,
   not a test** — a content-quality property of the curated prose, held by construction + review.
   The PR reviewer MUST read the served body for curriculum-domain leakage and point-in-time status.
3. **Tested behaviour:** MCP-observable registration (resource/tool/prompt with their metadata
   contract) + serving (read/call/get returns the wired body) + the DI'd assembler's composition
   (trivial fakes) + the regenerate→git-diff codegen freshness check.
4. **Disposition:** the lane is being completed + landed (owner-directed), not retired.

**Remaining work (owner-directed scope):**

- **D0 — Audience-model audit + consistency (NEW, foundational).** Identify ALL audiences and
  audience-like decision points across the explain SKILL-CANONICAL (the SSOT) AND the MCP projection;
  reconcile them consistently; **add data analyst / data scientist** — served the EFFORT/data
  orientation (Oak's data architecture, graph stack, SDK, how to engage), **firewalled from
  curriculum data**. Open design questions: is "educator" distinct from the deferred "education
  expert"? where do product / compliance experts sit? Re-curate the behaviour-shell to the CURRENT
  canonical (it changed via #238 since the WS-B branch was built — the deleted drift-guard's only
  real concern, now met by doing this re-curation as part of D0).
- **D3 (model-fired tool), D4 (prompt), D5 (value-proxy)** — behaviour-only tests from the start. The
  plan's D3/D4 MCP shapes + the mcp-expert CORRECT verdict (SDK 1.29.0: zero-arg extra-only handlers,
  no `outputSchema`, single-object prompt content, low priority 0.2, `audience: ['assistant']`)
  remain valid grounding.
- Final gates + PR to main via code-owner review (never `--admin`).

**Owner ship-gate (still live):** WS-B does not SHIP (expose to users) until the explain skill serves
the new expert audiences (the D0 work is the audience side of this) + the open `DATA-SOURCES.md`
governance decision (separate axis; the surface POINTS to it, never bakes it). Landing code to main
is fine; user exposure is gated.

**Sibling lanes (Alder tracks Topsoil):** `oak-pr-watch` (proto-chain dispatch guard) + `oak-pilot-ws-e`
(search-cli cli-contract e2e) handed off + ACKed; disjoint from this lane (comms stream + local
`.agent/state/collaboration/handoffs/alder-pr-watch-and-ws-e-integration.md`).

## Lane state

- **Owning plan**: [`orientation-lens-unification.plan.md`](../../../plans/developer-experience/current/orientation-lens-unification.plan.md) (`current/`, queued — the family-unification work). Superseded predecessor: [`orientation-and-agentic-ai-literacy.plan.md`](../../../plans-old-archive/developer-experience/archive/completed/orientation-and-agentic-ai-literacy.plan.md) (the primer + seam build, completed).
- **Current objective**: WS1–WS6 complete; committed `5b3453d41`. Consolidation
  (three watchlist lessons promoted to `distilled.md`) and plan archive done this
  session. Only push remains (owner-gated); the thread may retire after push.
- **Current state** (one commit pending at time of writing):
  - **WS1** — primer authored as the owned, host-free skill
    `working-with-agentic-ai`
    (`.agent/skills/working-with-agentic-ai/SKILL-CANONICAL.md`,
    `classification: passive`); adapters generated (`.claude`/`.agents`);
    `skills:check` + `portability:check` green; skill-permission entry wired in
    `.claude/settings.json`. Leakage verified by judgment (deterministic
    validator owner-released): no phenotype, the Practice memotype invoked only
    as a footing example, single abstract hand-off edge.
  - **WS2** — family wired: AGENT.md §Orientation Requests names the family and
    routes "new to agentic AI" → primer (opt-in prelude); onboard-me Branch F
    suggests the primer as a prelude; explain-repo carries a one-line aside;
    CONTRIBUTING points new-to-agentic-AI readers at the primer and records the
    host-side stance (the Practice *enables* heavy agentic delegation but does
    not *require* it — assistant-led work is equally supported). No duplicated
    teaching content.
  - **WS3** — onboarding-expert persona walk: PASS (ledger below); no unserved
    reader, so no owner-gated new surface.
  - **WS4** — gates green: markdownlint 0, `skills:check`, `portability:check`,
    `format:root` unchanged. (The `repo-validators` broken-link count is
    pre-existing repo-wide; none in this change set.)
  - **WS5** — adversarial panel (docs-adr-expert, assumptions-expert,
    architecture-expert-fred) plus the WS3 onboarding-expert. All actionable
    findings fixed: five stale dropped-validator references reconciled across the
    plan; PDR-112 §Required gained a seeding precondition (a host wires at least
    one continuation behind the edge before seeding the lead-in).
  - **Doctrine** — PDR-112 clarified as current-state: host *phenotype* is
    forbidden in the lead-in body; the Practice *memotype* (incl. vocabulary) is
    portable substance and may be invoked (PDR-035 grounding). Plan WS1
    acceptance / Work / cycle-dependencies aligned to judgment-based leak review.

## WS3 disposition ledger

| Persona | Verdict | Evidence |
| --- | --- | --- |
| New to working with agentic AI | served-by-primer | Footing from zero repo knowledge; reaches the single abstract edge; AGENT.md routes the intent to the primer, then forwards into onboard-me |
| Experienced, new to this repo/Practice | served-by-existing-surface | Primer is opt-in and declinable; "onboard me" / "explain this repo" land on their lenses with no primer detour |
| Experienced, hunting a specific detail | served-by-existing-surface | explain-repo (no-interaction briefing) + onboard-me Branch F's four addressable Practice questions; the primer body is topic-sectioned |

## Deferred follow-ups (not blocking; out of this plan's scope)

- **`metadata.owned` doctrine-vs-implementation drift**: PDR-051 §Validation /
  ADR-125 item 5 say owned skills carry `metadata.owned: true`, but the live
  discriminator is `skills-lock.json` absence; existing owned skills
  (`napkin`, `working-with-graphs`) also lack the flag. Repo-wide reconciliation
  for docs-adr-expert — do not patch per-skill (inconsistent treatment of peers).
- **Adapter H1 title-casing** ("Working With Agentic Ai"): generator-owned
  cosmetic; fix in the generator repo-wide if desired (never hand-edit adapters).

## Propagation note

The primer is a propagation candidate: it travels to other Practice-bearing repos
by transplantation/seeding (PDR-005), gated on the host having wired a
continuation behind the edge (PDR-112 §Required). PDR-112 (the *pattern*)
graduates into `practice-lineage.md` only after it hydrates across more than one
repo (PDR-112 §Graduation intent) — single-instance now, so not graduated.

- **REOPENED (owner-directed, 2026-06-23)**: the family is being unified — the two
  repo-bound lenses (`explain-repo`, `onboard-me`) become ONE intent-discerning lens
  with delivery mode (specific answer / area overview / guided tour) as a discerned
  variable; setup stays distinct and go-ahead-gated; the `working-with-agentic-ai`
  primer is unchanged; **PDR-112 is NOT amended** (host instantiation is phenotype,
  recorded in a host ADR + AGENT.md). Design owner-confirmed.
- **UNIFICATION IMPLEMENTED (Zenith lifts Firmament, 2026-06-23) — push-pending (owner-gated).**
  WS0–WS6 executed against
  [`orientation-lens-unification.plan.md`](../../../plans/developer-experience/current/orientation-lens-unification.plan.md).
  Outcome: ONE intent-discerning lens `/oak-explain` (`.agent/skills/explain/`); delivery mode
  (specific answer / area overview / guided tour) is a discerned variable; setup distinct +
  go-ahead-gated; `working-with-agentic-ai` primer + PDR-112 seam unchanged (PDR-112 NOT amended).
  Host decision recorded in
  [`ADR-202`](../../../../docs/architecture/architectural-decisions/202-orientation-as-one-intent-discerning-lens.md).
  AGENT.md §Orientation Requests rewritten to route every intent to the one lens (primer leads in via
  the edge → lens). Real-time onboarding-expert review (READY-WITH-FIXES) verified first-hand and folded.
  Gates green: `skills:check`, `portability:check`, `markdownlint` 0, `format`.
  - **Two owner directions mid-execution superseded the plan's letter** (owner direction is a stream):
    1. **Lens name = `/oak-explain`** (owner chose this over the plan default `onboard-me` and the
       `orient` option).
    2. **Clean break, no compatibility layers** (`replace-dont-bridge`) — the plan's aliasing /
       "no dangling slash command" approach is RETIRED; old skills (`onboard-me`, `explain-repo`)
       deleted, slash commands removed not aliased, every live reference migrated.
    3. **Minimise unique info in the skill** — the six architectural invariants moved to a new
       **README §Architectural invariants** block; the skill points to it (no baked repo facts).
  - **Live owner walkthrough DONE (2026-06-23)** — three `/oak-explain` runs
    (engineer, CEO persona, meta probe). Drove three refinements the simulations
    missed: (1) progressive disclosure — added a "Delivery grain" discipline and
    fixed two mode descriptions that invited walls of text; (2) scope accuracy —
    added a "Scope, accurately" guard (this repo is ONE of Oak's AI efforts, puts
    Oak *into* third-party AI assistants; not "how Oak does AI"); (3) positioning —
    a generic boundary added to `VISION.md` (no product named; owner decision).
  - **Remaining**: commit (one coherent docs-and-skills commit); push (owner-gated);
    consolidation/handoff + memory at close.
  - The prior session's primer/seam commit (`5b3453d41`) also remains push-pending (owner-gated).
- **Promotion watchlist**: DONE — value-conveyance, knowledge-surfaces-are-curated,
  and decision-records-record-current-state were promoted from the per-user buffer
  to `distilled.md` this session (2026-06-22), each flagged with its graduation
  candidate target (rule / PDR-clause). A future first-hand consolidation graduates
  them to rules/PDRs.
