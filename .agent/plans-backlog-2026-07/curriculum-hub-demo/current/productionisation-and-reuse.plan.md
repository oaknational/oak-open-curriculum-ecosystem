---
title: Curriculum Hub productionisation & reuse — topology, tokens, extraction, ingestion machine, SSO
status: 🟢 DECISION-COMPLETE (owner-ratified 2026-07-01 ~21:30Z) — QUEUED post-merge; execution
  starts after feat/curriculum-hub-demo merges to main. Workstream-level execution detail
  finalises at activation; the four governing decisions are ratified and recorded.
lane: current
lineage:
  serves_thread: curriculum-hub-demo
  serves_stream: null
  strategic_choice: 'owner 11-point productionisation brief, 2026-07-01'
  derives_from: .agent/plans/curriculum-hub-demo/active/port-prototype-to-live-demo.md
programmes: []
owners:
  - Birch mends Petal (5b5574) — Director #7 (curriculum-hub-demo): authored from the verified
    multi-agent analysis (workflow wf_2e2b74a5-eb8, 17 agents, adversarially verified) + the
    owner's four ratified decisions; execution routed to implementer lanes at activation.
todos:
  - id: ws0-topology-demos-tier
    content: 'WS0: execute the ratified first-class demos/ tier — gate parity + one-way boundary + renames'
    status: pending
  - id: ws1-token-consolidation
    content: 'WS1: consolidate the demo palette into @oaknational/oak-design-tokens (web tier); demo consumes emitted props'
    status: pending
    depends_on: [ws0-topology-demos-tier]
  - id: ws2-ingestion-machine
    content: 'WS2: build the ingestion machine (census, diff/classify, token-gen, pixel-diff triage) in a dedicated tooling workspace'
    status: pending
    depends_on: [ws0-topology-demos-tier]
  - id: ws3-staged-extraction
    content: 'WS3: staged UI extraction — block-kit then web-ui then standards-after-data-inversion, full estate conventions'
    status: pending
    depends_on: [ws1-token-consolidation]
  - id: ws4-mode2-scaffolder
    content: 'WS4: mode-2 new-project scaffolder (consumes WS2 tooling + WS3 packages)'
    status: pending
    depends_on: [ws2-ingestion-machine, ws3-staged-extraction]
  - id: ws5-system-defects
    content: 'WS5: graduate the two system defects (ESLint-10 pin centralisation; SDK development→src consumption decision)'
    status: pending
  - id: ws6-sso-decision-gate
    content: 'WS6 (owner-gated): Clerk SSO decisions + build, per the completed analysis'
    status: pending
---

# Curriculum Hub productionisation & reuse

Turn the completed Curriculum Hub demo into the first instance of a **repeatable, productionised,
reusable UI-production capability**: a first-class demos tier at full repo standards, a single
token authority, staged reusable-UI workspaces, a two-mode Claude-Design ingestion machine, and a
decision-ready SSO path. This plan owns the POST-merge slice of the owner's 11-point brief
(2026-07-01); the pre-merge slice (DoD §A–I + E1–E3 + milestone commit) is owned by
[`../active/port-prototype-to-live-demo.md`](../active/port-prototype-to-live-demo.md) —
facts are authoritative there and referenced here, never restated.

## End goal

Creating the NEXT Oak UI (a new Claude Design project, an Express surface, or a second Next app)
costs a fraction of this one: it scaffolds against extracted, fully-gated workspaces, ingests its
design export through committed tooling instead of hand-archaeology, inherits one token authority,
and lands at full repo standards by construction.

## Value streams (owner, 2026-07-02)

The owner's three co-equal value streams map onto this plan's workstreams: **stream 1** (Heather's
work web-visible for user testing) = the merge + §J hosting; **stream 2** (the agent-driven
ingestion pipeline) = WS2; **stream 3** (rapid web-app capability — the Oak Innovation Kit) =
WS0 + WS3 + WS4. Streams 2 and 3 are not riders on stream 1.

## Mechanism

The demo proved the design→data→code pipeline end-to-end by hand. Each workstream converts one
hand-proven step into repo infrastructure: the topology decision makes the standards automatic;
the token consolidation makes the visual language canonical; the extraction makes the components
consumable; the ingestion machine makes the design-sync repeatable; the scaffolder composes them.
Sequencing is consumption-ordered (PDR-093): each workstream's gate breaks if its predecessor
drifted.

## Ratified decisions (owner, 2026-07-01 ~21:30Z — the plan's governing constraints)

1. **Topology: first-class `demos/` tier** (Option 3 of the analysis). Gate parity (remove the
   knip / prettier / markdownlint / depcruise exemptions for demos), a one-way depcruise rule
   (apps/packages must never depend on demos), directory renames (drop the person-initials dir
   name). The previously owner-gated topology hold is RESOLVED by this ratification.
2. **Extraction trigger: owner brief items 8+9 constitute the named second consumer.** Staged
   extraction proceeds post-merge under consolidate-at-second-consumer's own terms (PDR-058
   precondition satisfied by owner naming).
3. **Token authority: `@oaknational/oak-design-tokens` is the single canonical owner.**
   Evidence, corrected by the assumptions-expert pass (2026-07-01): the package's DTCG source
   carries SOME demo values (oak-black `#222222`, mint `#bef2bd`) but only **3 of the demo's 20
   distinct hex values** exist in its token sources — WS1 is therefore **authoring ~17 new DTCG
   web-tier tokens** (incl. lemon `#ffe555`, navy-family, greys), each passing
   `design-tokens-core` contrast validation, not merely emitting an existing set. The MCP app
   already consumes the package (second consumer exists → consolidation DUE under the rule). The
   export's `_ds/tokens/fig-tokens.css` becomes a per-project validation INPUT, never a second
   authority.
4. **§J hosting is owner-run from `main`** (2026-07-02); SSO remains analysis-complete,
   decision-gated (WS6).

## Workstreams

### WS0 — First-class demos/ tier (M)

Execute ratified decision 1. Order within: (a) directory rename
`demos/curriculum-hub-hw/` → `demos/oak-curriculum-hub/` shape (blast radius verified 2026-07-01:
`pnpm-workspace.yaml`, `knip.config.ts`, root `.gitignore`, `README.md`, regenerable
`pnpm-lock.yaml`; turbo tasks are package-name-keyed and survive; the app's configs are
self-relative; app+export must move together — `scripts/generate-course.ts` reaches the export
relatively); (b) gate-parity graduation, ONE GATE PER STEP: prettier (format demo, drop the
`demos/` ignore → `format-check:root` green) → markdownlint (fix demo md, drop `"demos/**"` →
green) → knip (drop `ignoreWorkspaces`, register Next entry points → `pnpm knip` green) →
depcruise (add `demos` to the root script + author the one-way boundary rule → green);
(c) demo tsconfig extends `../../../tsconfig.base.json` + `tsconfig.lint.json` (pre-merge
conformance steps land what they can; whatever remains lands here).
**Acceptance:** all four root gates run over demos and pass; a depcruise test proves an
apps→demos import fails; `CI=true pnpm check` green estate-wide. **Proof: integration (gate
runs).**

### WS1 — Token consolidation (M — resized from S–M per ratified-decision-3's corrected evidence)

Add a web tier to `@oaknational/oak-design-tokens`: **author the ~17 missing DTCG tokens** (the
demo's palette minus the 3 already present) + emit CSS custom properties via the existing
`design-tokens-core` pipeline, which also buys contrast validation. Entry gate: a token-parity
audit between the package's emitted values and the demo's `globals.css` `@theme` block (seed
tool: `token-fidelity-audit.mjs`, relocated to `tools/` pre-merge). Then the demo swaps its
hand-mirrored `@theme` values for the emitted props. TDD: the parity audit becomes a committed
test in the package (RED on any drift between DTCG source and demo consumption).
**Contrast-failure resolution path (pre-answered):** WS1-internal by default — the demo's shipped
pairs already carry computed AA evidence (7.93:1, 10.2:1, 12.6:1 from the §E reviews), so
failures are unlikely; if a pair genuinely fails validation, WCAG AA wins (org mandate) and the
resolution (which value/usage changes) escalates to the owner ONLY then, because it trades
visual fidelity — a constitutively-owner trade.
**Acceptance:** one token authority; demo renders byte-identical (visual capture diff clean);
parity test green. **Proof: unit (parity test) + value-proxy (capture diff).**

### WS2 — The ingestion machine (M–L)

Build the owner-ratified six-stage pipeline (mechanism SSOT:
[`../future/demo-maintenance-and-structure.md`](../future/demo-maintenance-and-structure.md) —
the second-consumer guard is owner-dis-applied for this capability) in a **dedicated tooling
workspace** (shape precedent: `agent-tools`; name settled at activation, e.g.
`packages/tools/claude-design-ingest`), at full estate conventions.

**Owner design input (2026-07-02, co-equal-streams direction):** the pipeline is stream 2 of
three CO-EQUAL value streams (not a rider on the demo), it is **skill and agent-tools driven**,
and UPDATE-INTEGRATION into existing demos is explicitly **agent-judged** — "careful, intelligent
integration, there is likely no deterministic route and that will be something for an agent to
handle." At activation, name the reconcile step as a first-class AGENT stage (skill-driven
judgment over the diff/classify output), not tool residue; the CLIs feed it, they do not replace
it. Residue for owner re-ratification at activation: whether any "heavier reusable-skill
codification gated on demo #2" note survives co-equality.

**SEEDED PRE-MERGE (2026-07-03, owner-directed):** the reconcile stage and stage 5 now have a
working first realisation in the demo — the fidelity review (`tool:fidelity`: export server +
dev-server lifecycle + both capture arms + pixelmatch triage + a side-by-side report) with the
**divergence register BUILT** as `demos/oak-curriculum-hub/fidelity-register.json`
(zod-validated; dispositions fix/deliberate/investigate/matched/superseded; keys stable across
export refreshes) and the workflow carried by the `claude-design-pipeline` skill
(`.agent/skills/domain-craft/ui-design/claude-design-pipeline/SKILL-CANONICAL.md`). Stage 2's reader consumes that register;
stage 5 generalises the demo's `tools/image-diff.ts` (correction 2026-08-09: this
generalisation landed early — the diff core and the shared fidelity machinery now live in
`packages/libs/fidelity-review`, a foundation lib per ADR-041's dated amendment, consolidated
at the second consumer's arrival rather than at WS2 activation); stage 6's runbook extends the
skill. The playbook §"Fidelity review and the divergence register" carries the porting method.

1. **Census/currency tool** — per-page block/section/qs counts, data hashes, asset inventory
   (mechanises the stale-bundle-trap cure). TDD against the committed export snapshot.
2. **Diff/classify** — git-diff previous snapshot + census-delta → typed report (content /
   structure / style / asset), reading a committed **divergence register** so ratified
   divergences (e.g. the 6th hub card) are not re-flagged.
3. **Generator hardening** — QS generator reads the export (or hash-verified sync), not the
   app-local JSON copy (pre-merge item if capacity allows; else here). Census-fixture emitter
   proposes test-fixture updates, never auto-commits.
4. **Token generation** — from the export's `_ds/tokens/fig-tokens.css`, VALIDATING against the
   WS1 canonical authority (never overwriting it).
5. **Pixel-diff triage** — `pixelmatch`-class diff between canonical render and live capture at
   the matched 1440/dSF2 geometry; triage only, §D acceptance stays human.
6. **Acquire runbook** — an `.agent/skills` runbook wrapping the CLIs (manual trust-boundary
   steps: owner export, drop-point, snapshot commit convention incl. the future `uploads/`
   exclusion).

**Acceptance:** mode-1 re-ingest of THIS project's next export runs end-to-end producing a typed
delta report + regenerated modules + capture diffs, with hand-work items flagged. **Proof:
integration (a rehearsal run against a copy of the current snapshot).**

### WS3 — Staged UI extraction (L)

Execute ratified decision 2 in dependency order, each package at full estate conventions
(tsconfig chain, `tsconfig.lint.json`, `0.0.0-development`, engines 24.x, exports map, tsup +
vitest base configs):

1. **`oak-block-kit`** (name indicative): `lib/blocks/types.ts` (248-line zero-import keystone) +
   BlockRenderer + 18 views + CourseNavContext + `lib/course/types` + CourseShell/Sidebar/
   view-model. Peer: react. CalloutBlockView's single `next/link` → injected renderer or `<a>`.
2. **`oak-web-ui`**: chrome (SiteNav/SiteFooter), Destinations (props-driven), SectionScaffold,
   ContentLinks, ResultCards + `search-types` + `use-curriculum-search` (its `/api/search`
   endpoint contract is the Express seam), framework components.
3. **Standards UI** — only after data inversion (builders/palette parameterised on injected
   `qualityStandards`; the 10,604-line generated module stays app-side).

Verified sizing input (adversarially re-verified 2026-07-01): shim surface = 6 `next/link` +
2 `next/image` files, zero `next/navigation`; alias-rewrite surface = **58 `@/` imports (28
non-test)**, and the candidate set must pull in `lib/standards-view-model` (4 imports leak to it)
— ~a full day of mechanical work, not half. CSS ships as compiled stylesheet (option B) or
Tailwind-native (option A) — decided at activation; the pre-merge styling pass keeps
`data-variant` attributes so option C stays open.
**Acceptance:** demo consumes the packages with zero behaviour change (full demo suite green,
capture diff clean); packages pass all estate gates. **Proof: integration + value-proxy.**

### WS4 — Mode-2 scaffolder (M; after WS2+WS3)

New-project entry: scaffold a demos-tier workspace consuming the extracted packages + ingest
tooling + a per-project config (export drop-point, extractor entry points — the evaluator core is
generic, entry points parameterise; capture targets/routes). What stays hand-work per project:
content types, extractor entry-point config, project-specific components.
**Acceptance:** a rehearsal scaffold of a minimal second project reaches "census, extracted data,
rendered shell" without copying demo-local code. **Proof: integration (rehearsal).**

### WS5 — System-defect graduation (S–M; parallel-safe)

1. **ESLint-10 × eslint-plugin-react:** the upstream fix is BLOCKED (7.37.5 IS latest — verified
   via npm 2026-07-01; the "bump the plugin" path was refuted). Centralise the
   `settings.react.version` pin INTO `oak-eslint`'s `configs.react` (one canonical workaround;
   demo's FLAGGED WORKAROUND pin removed in the same change; demo is the sole consumer today —
   blast radius one file). Full-estate lint re-run as the gate. Revisit on any upstream release.
2. **SDK `development→src` vs Turbopack dev:** a repo-level SDK-consumption decision (fix the
   export map vs a shared next-config helper in `packages/core`) — route to architecture review;
   the second Next consumer (WS3/WS4) is its forcing trigger. Never paper over per-app.

### WS6 — Clerk SSO (owner-gated; analysis COMPLETE)

The analysis (2026-07-01, adversarially verified) is the deliverable of owner-brief item 5;
build starts only when the owner resolves the decision points. Analysis facts: reuse = the
**shared Clerk instance** (ADR-053 2026-04-21 amendment mandates it; `thenational.academy`
allowlist gives "Oak accounts only" free); zero reusable auth CODE exists (the MCP server's is
Express/OAuth-proxy-shaped); wiring = `@clerk/nextjs` + `proxy.ts` (Next 16 — NOT `middleware.ts`;
the in-tree research doc predates Next 16) + `<ClerkProvider>` + Google-only sign-in + env (~1–2
days on the dev instance). The honest second-consumer extraction at wiring time is a Clerk
env-schema fragment into `packages/core/env`; a `@oaknational/auth-next` package waits for the
second Next UI.

**Owner decision points (carried with WS6's gate; they block only WS6):**
(a) what an "Oak account" is (domain allowlist / enterprise connection / invitation — and whether
allowlisted personal addresses count; NOTE a pure domain allowlist locks out the owner's own
gmail.com account); (b) the "Google + Oak accounts" parse (restricted-Google vs two populations);
(c) public vs gated vs split posture for the hosted demo (any allowlist change is INSTANCE-WIDE —
it hits the MCP server too); (d) dev instance (100-user cap) vs triggering the production
migration (L-sized, documented, unexecuted); (e) the standing shared-vs-independent instance
tension (migration doc §0 Option B vs ADR-053's shared mandate) — needs ADR-level reconciliation
whenever production fires. Side item for the K-lane: ADR-142 version drift (`~0.3.1` pinned vs
`^0.5.0` shipped, re-evaluation trigger fired unactioned).

## Prerequisite classification

- **Blocking:** the feature-branch merge to main (all WS); WS1 parity audit before the demo token
  swap; WS2 before WS4; WS3 before WS4; the owner decision set before WS6 build.
- **Sequencing-with-rationale (soft edges, encoded in the frontmatter `depends_on`; churn
  avoidance, not hard blocks):** WS1/WS2 after WS0 (the rename moves the files both touch — doing
  them first would double the path churn); WS3 after WS1 (packages should consume the
  consolidated token authority rather than re-plumb the demo's private `@theme` and swap twice).
  An executor MAY start WS1/WS2 design work before WS0 lands; only the file-touching slices wait.
- **Beneficial:** §J hosting live before WS2's pixel-diff stage (real deployed captures; minimum
  shippable shape without it = local captures, as today); the E-verifier's full alias census
  before WS3 activation (re-derive counts at execution time — the tree moves).

## Non-goals

- No compatibility layers anywhere (replace-don't-bridge) — the demo's `lib/env.ts` self-declared
  bridge is REPLACED (with `@oaknational/env` composition) by the FIRST workstream that touches
  that file, unconditionally; the replacement must not wait for WS6.
- No speculative extraction surface: no plugin frameworks, no router adapters (zero
  `next/navigation` usage — verified), no headless/styled split enforcement beyond keeping the
  existing `data-variant` hooks.
- No curriculum-data types outside the SDK codegen flow (Cardinal Rule); course/standards DATA
  stays app-side or becomes a content package — never inside the UI packages.
- No production Clerk migration inside this plan (WS6 names it as a separate documented
  programme).

## Risk assessment

| Risk | Mitigation |
| --- | --- |
| Rename blast radius breaks hidden path consumers | Verified consumer list in WS0; rename in one commit; full `CI=true pnpm check` gate; grep-sweep for the literal old path post-rename |
| Gate graduation surfaces bulk fallout (prettier/markdownlint over demos) | One gate per step, each its own commit; fallout sized before starting via dry-runs |
| Token swap changes rendering subtly | Parity audit is the entry gate; capture-diff at 1440/dSF2 is the exit gate |
| Extraction churns APIs under a single consumer | Extraction starts only post-merge against the COMPLETED demo; packages consume the demo's proven props |
| Ingest tooling over-generalises (N=1 trap) | Parameterise only what mode 2 demonstrably needs; the owner's dis-applied-guard mandate covers the capability, not unlimited abstraction |
| SSO dashboard changes blast other instance consumers | WS6 gated on the owner decision set; any dashboard change named instance-wide in the ask |

## Plan-body first-principles check

Fires before executing: (a) WS0's rename list (re-derive the consumer set at execution — the
verified list is 2026-07-01 evidence, the tree moves); (b) WS3's ENTIRE sizing-input set — alias
imports, `next/link`/`next/image` file counts, candidate-set leakage — re-derived at activation:
the counts drifted TWICE on 2026-07-01 alone (alias imports 18→58 by adversarial correction,
then 58→85 under the live styling pass the same evening; link files 6→10; image 2→3;
`standards-view-model` importers 4→6); only `next/navigation` = 0 has held stable; (c) WS6's
Clerk vendor shapes (`proxy.ts` convention, allowlist semantics — re-verify against live Clerk
docs at build time per verify-vendor-call-shapes-at-plan-author-time; the in-tree research is
known-stale on Next 16).

## Foundation alignment

principles.md (First Question at every workstream boundary; strict-everywhere is WS0's whole
point), testing-strategy.md + tdd-as-design.md (every code-bearing cycle lands test+code
together; WS1's parity test and WS2's census tests are the RED anchors),
schema-first-execution.md (Cardinal Rule non-goal above; WS2 token-gen validates against the
canonical owner rather than forking an authority).

## Readiness reviewers

assumptions-expert review of this plan (proportionality + blocking-legitimacy) before activation;
architecture reviewers (barney/betty) at WS3 package-boundary design and WS5.2's SDK-consumption
decision; design-system-expert at WS1; clerk-expert (rule-mandated) on all WS6 surfaces.

## Learning loop

On completion of each workstream: consolidation touch per
[`../../../plans/templates/components/lifecycle-triggers.md`](../../../plans/templates/components/lifecycle-triggers.md);
plan archival mines outcomes into ADRs (topology + token authority likely earn one each) and runs
`/oak-consolidate-docs`.
