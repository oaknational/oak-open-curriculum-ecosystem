---
id: identity-switchboard-first-pixels
node_type: delivery
name: "Identity switchboard in the showcase — first-pixels pull-forward"
overview: >-
  The showcase serves a design-system-built identity-switchboard page — picker
  chrome plus a query-addressable full specimen composition — faithful to the
  Claude Design export except recorded workspace-clash divergences.
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-09
ratified_where: "Owner card at the Director seat 2026-08-09 ~08:3xZ (card answer: 'Ratify' — formalising the same morning's pull-forward word; session Plover lifts Troposphere b10c37)"
serves: design-system-as-configured-framework
impact_areas:
  - design-system
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-08-10  # governing steer + in-place re-skin supersession marker
---

# Identity switchboard in the showcase — first-pixels pull-forward

Authored at the owner's word (2026-08-09 morning, plan-mode build selection):
a decision-complete pull-forward that takes the estate to the showcase app
serving a design-system-built version of the export's identity-picker page
(`packages/design/oak-design-system/studio-source/Identity Switchboard.html`
framing `studio-source/whitelabel/specimen.html`), then returns the lane to
the original `design-system-completion` order. Ground verified first-hand
2026-08-09 by three exploration sweeps (export + showcase anatomy;
plan-estate conventions + the W0.5 ledger; fidelity + instrument machinery).

## Goal

`demos/oak-design-showcase` serves `/identity-switchboard` (non-primary): the
export picker rebuilt on the design system — controls switching the identity
of the framed specimen, the full ten-region specimen composition — judged by
the W0.7 instrument before the owner sees it, browsed by the owner as pixels
in Chrome, with every divergence from the export recorded and dispositioned,
never silent. On completion the lane resumes the design census at its
slice-A boundary (the named resume gate: todo 5).

### Governing steer — ends before means (owner recalibration, 2026-08-10)

The END this lane serves is **near-zero-cost exploratory app experiments**:
whitelabelling is the proof that *presentation is data*, and the showcase must
SHOW that power — the wow page is the demonstration. The fidelity instrument
(the whole PR-1b hardening ledger) is **means**, never the end. Two bindings on
routing and adjudication, in force from here:

1. **Cure round 6 completes at LEDGER-MINIMUM depth.** Where a hardening row
   honestly permits deferral (named home, no false-evidence exposure), defer it
   — the instrument earns exactly the rigour that protects the demonstration's
   trust, no gold-plating. Evidence-integrity rows (the tool must never certify
   false evidence) are the floor that does NOT defer; instrument ergonomics and
   completeness beyond that floor defer to a named follow-on. The Director's
   grant bar moves accordingly: blocking = the evidence-integrity floor +
   `mergeStateStatus` + R27 dispositions, not the entire ledger.
2. **Every READY from this lane states DISTANCE-TO-PIXELS**, not only
   gates-green — the metric that matters is how close the owner is to browsing
   the wow page, and each lane signal reports it.

## Step 0 — compaction preparation (owner word: the very first step)

Executed at this plan's landing, before any implementation: napkin lens
harvest; thread-record freeze entry carrying the full resume map (this node
as the executing input; the census at its slice-A boundary with its resume
gated on this node's completion per todo 5 — the uncommitted
`census-types.ts` stays untracked in the `w01-census` worktree until that
resume, recorded in the freeze entry; worktree inventory; claim retained);
canonical freeze broadcast; monitor state verified. The resuming seat
re-arms per start-right and opens the first implementation todo.

## Mechanism (decision-complete)

### Shape: two routes, reproducing the export's scoped switching

The export keeps its picker chrome Oak-branded while the specimen switches
inside an iframe via `?brand=` query reload. The faithful equivalent,
entirely inside our workspaces:

- `app/identity-switchboard/specimen/page.tsx` — the FULL specimen
  composition (all ten regions of `whitelabel/specimen.html`: utility,
  masthead incl. search form and sign-in, hero with four-crumb breadcrumb,
  facets, results, detail, resources, support, cta, footer), authored as
  route-local React components, hook-clean (zero inline styles — the
  workspace ESLint bans them; presentation in route CSS walked by
  `validate-authored-css`, tokens only). Identity is QUERY-ADDRESSABLE: the
  route reads `?brand=` (validated against the imported `IDENTITIES` from
  `components/useIdentity.ts` — never a re-typed slug, keeping the
  identity-naming ratchet at zero delta) and applies the brand sheet
  (`/brands/<slug>/brand.css`, already served and manifest-guarded) at
  FIRST PAINT — no flash of the Oak base before the brand (a Playwright
  cell proves it; the exact link-injection mechanics are the execution
  cycle's call within this stated shape and acceptance).
- **[Superseded 2026-08-10 by the owner's in-place re-skin ruling — the
  frame navigates once and controls mutate presentation data inside the
  framed document; dated amendment rides PR #846.]**
  `app/identity-switchboard/page.tsx` — the picker chrome: header
  (`oak-heading-4` plus the export's framing prose MINUS its stale "wind
  the contract back to Part A" sentence — the prose is flagged for the
  owner-voice batch at the checkpoint, the W0.5 item-10 class); the
  controls strip; `main.stage` framing the specimen route in an IFRAME
  whose src the controls drive (the export's mechanism minus
  `document.write`); an `.oak-link` "Open full page ↗" kept in sync with
  the frame src. The frame is RESPONSIVE (width 100%,
  `aspect-ratio: 16/10`) — the export's fixed-1280 `scale()` fit is
  replaced for SC 1.4.10 reflow, a recorded accessibility-clash
  divergence.

### Controls — the taste-anchor affordance

A route-local `SegmentedControl`: `fieldset`/`legend` with
`role="radiogroup"` over real radio inputs hidden with the kit's
`.oak-visually-hidden` (not the export's hand-rolled 1px hide); pills
styled via `:has(input:checked)` / `:has(input:focus-visible)` from
tokens; control rhythm from `--input-min-h` — never the export's
`--size-target-min` pin (the routed kit finding recorded in the showcase
`globals.css`). IDENTITY group: three options, labels from the imported
`IDENTITY_LABELS`. THEME group: the five kit presets wired to
`oakThemeStore` — a segmented group, not the export's native select, per
the estate's ruled control pattern (design-system-completion W1.2, L0 r2:
"never a native select") — the clearest instance of the owner's "except
where it clashes" clause; the export's empty "Page default" option is
dropped (`system` owns default semantics) — recorded. NO motion control
(export adherence; runtime honouring intact).

### Discoverability

One nav link to `/identity-switchboard` added to the root page's masthead.
The root route's own fate stays with design-system-completion W1.5.

### Content provenance (W0.5 item 3, blocking)

Every persona, institution, statistic and product name in the composed
specimen enters the content-provenance manifest as
verified-real-or-fictional; rides the page PR.

### Fidelity machinery (ported per the fidelity-review skill's porting section)

COMPOSE the showcase's fidelity tooling from the shared package
`@oaknational/fidelity-review` (correction 2026-08-10, truing this
decision-complete clause to what PR-1a actually landed — it read "copy
the hub's tools", and the copy shape was refused by the merge-required
duplication gate; `consolidate-at-second-consumer` directed the
extraction, the hub migrated to the same package, and its copies
deleted. The correction had landed only in the PR-1 todo). Only the
genuinely app-local surfaces stay in `demos/oak-design-showcase/tools/`:
the export overlay and its path guards, the pairing map, capture config,
and the runner's `main`; author a showcase `fidelity-pairs.ts`
with SIX diff-eligible pairs — three identities × {fold, full}: the
specimen route `?brand=<slug>` vs the export's
`whitelabel/specimen.html?brand=<slug>` served by the ephemeral export
server over the STUDIO OVERLAY — `studio-source/` falling back to the
design-system package root (correction 2026-08-09 at PR-1, #834: the
export pages link kit CSS studio-relatively and `studio-source/` holds
no root CSS, so the single-root serve this clause first named renders
them unstyled; the overlay is the clause's intent, verified rendering
styled first-hand) — capture tooling only, nothing app-serves the
fenced tree — plus ONE
`reference-only` chrome pair (picker page vs the export picker, divergent
by ruled design). Pair ids use target-state naming (`picker-oak-*`,
`picker-pds-*`, `picker-emc2-*`); slugs derive from the imported constant
in code, never literals, so the ratchet stays at zero delta in every new
file. `exemptSurfaces`: the root route (owner-rejected; W1.5's) with its
reason. Seed `fidelity-register.json` as `{"version":1,"entries":[]}`;
add a `tool:fidelity` script. Every finding is dispositioned
(`fix|deliberate|investigate|matched|superseded`; author = role handle).
Expected deliberate rows, pre-known: responsive frame vs scaled 1280;
segmented theme control vs native select; dropped "Page default" option;
dropped stale prose sentence; visually-hidden mechanism; control-rhythm
token.

### Instrument run (before any render reaches the owner)

Mechanical gates green first; then the seat leg SEALED before expert
dispatch; `accessibility-expert` and `design-system-expert` blind on
opus, per-criterion over all seven rubric slugs, notes on every non-PASS.
Rows land in `docs/design/design-review/wow-verdict-register.json`
(pre-read class WITH all three legs filled — the honest post-instrument
shape; the register identity for the pre-rename-slugged brand is `pds`),
validated by the agent-tools suite. A leg FAIL routes to the Director in
the Quality-bar rule-3 shape (findings, screenshot, blocker assessment)
plus an `instrument-blocked` row; the three-iteration bound applies.

### Owner browse

`pnpm --filter @oaknational/oak-design-showcase dev:open` (3020) with the
export served beside it on 3030 for comparison; pixels in the owner's
Chrome, verdicts batched and Director-relayed verbatim → checkpoint row;
on PASS the page's rendered screenshot baselines land in the same PR
window (Quality-bar rule 6).

### Return clause

On the checkpoint verdict's registration: a dated amendment note lands on
`design-system-completion` naming this node as the switchboard-page
carrier feeding W1.5 (root replacement and the probe's remaining scope
stay there); the lane resumes the census at its slice-A boundary; this
node takes its completion note.

## Todos

Each slice is a single-story PR within its PDR-132 round budget (≤2
rounds); the per-cycle code-expert pre-execution review fires at each
slice per the standing rule.

1. Step 0 — compaction preparation at plan landing (above). DONE marker
   lands in the thread record's freeze entry.
2. PR-1 — fidelity tooling port + pairs + seeded register + `tool:fidelity`
   script (tools only; no page). Amendment 2026-08-09 (at #834's settle):
   the merge-required Sonar gate refused the copy shape —
   new-duplicated-lines 21.5% against the 3% condition, the counterparts
   the hub's own `tools/` copies — and `consolidate-at-second-consumer`
   directs the cure (its text names duplication-density gate refusal as
   its enforcement; path/IO guards are its consolidation floor; the
   fidelity-review skill's app-local-until-WS2 deferral cannot license a
   second copy landing against a required gate). PR-1 splits, round
   budgets rebinding at this re-authoring per PDR-132:
   - PR-1a — extract the shared fidelity core (support, image-diff,
     dev-server, fidelity-report, fidelity-report-sections, fidelity-html,
     register core, five app-neutral runner helpers, and the
     decodeUrlPath/resolveWithinRoot path guard as `static-path-guard`)
     to a new `packages/libs/fidelity-review` workspace package
     (correction 2026-08-09 at build, pre-execution review concurring:
     libs foundation tier, NOT packages/design — the design container is
     ADR-041's token-chain matrix and `validate-boundaries` enumerates
     libs, so registration is build-load-bearing; ADR-041 takes a
     one-line dated amendment). The hardened showcase versions are
     canonical (the hub's three inherited defects — the
     decodeURIComponent crash, the relative-npm_execpath lookup, the
     loose register schema — die by construction). Pairing-map schemas
     stay app-local behind structural package types; capture-checks and
     each app's runner stay app-local; the hub migrates and its copies
     delete. May land as two slices cut at the mechanical/cure seam per
     the pre-execution review; the PDR-132 size warning fires and each
     PR body states the mostly-moved-code ground. Residue (byte-identical
     export-server serve mechanics) is a named follow-up ticket, not a
     silent deferral.
   - PR-1b — #834 merges main after PR-1a lands and swaps its copied
     modules for package imports; its remaining diff is the genuinely
     app-local code already through three review rounds (export overlay +
     path guards, pairs map, capture config, `lib/identities`).
     Amendment 2026-08-09 (at the swap head's settle): the same gate
     re-fired at 8.1% against the 3% condition — the residual
     duplication being the run-orchestrator skeleton and the map-level
     pairing-schema wrapper both apps still carried as twins, so
     `consolidate-at-second-consumer` directs the same cure one layer
     up, inside PR-1b (a separate extraction PR off main could not be
     honest: the second consumer exists only on this branch). They join
     the package as `/orchestrator` and `/pairing-schema`;
     `assertServerUp` joins `dev-server` (bounded, one copy);
     the matched-geometry scale constant joins `capture-flags`; both
     apps collapse to composition roots; and the hub's corrupt-evidence
     drift (a PNG decode error rendered into the report's missing-paths
     list) unifies to the ruled fail-the-run policy. Capture arms, pair
     schemas, and each CLI's `main` stay app-local. Round budgets
     rebind at this re-authoring per PDR-132.
   - PR-1b hardening (assurance round, 2026-08-09) — the owner-commissioned
     full-work review (45-agent multi-model fleet + three Codex reviews at
     max effort, four independent surfaces on head `db980a967`; method and
     economics captured in
     `.agent/reports/agentic-engineering/multi-agent-review-methodology-2026-08-09.md`)
     returned CURES-NEEDED. #834 is **not mergeable** until the ledger in
     `## PR-1b integrity & lifecycle hardening` below is cleared. The
     completed cures of the prior five rounds are verified sound; the new
     surface is evidence-integrity + capture-comparability + lifecycle +
     fs-target containment + boundary strictness. Every cure is authored as
     an architecture change that pulls its invariant down to a unit-provable
     seam (owner ruling 2026-08-09, §HOW below); real-fs/real-process proofs
     survive only as smoke-tier wiring checks and the one sanctioned
     spawn-topology contract. Round budgets rebind at this re-authoring per
     PDR-132; the code-expert pre-execution review fires before the slice.
3. PR-2 — the two routes + `SegmentedControl` + route CSS + unit tests +
   Playwright cells (the a11y matrix gains the new routes' identity ×
   theme cells and the no-flash first-paint cell) + the
   provenance-manifest rows + the root nav link. Single-story by
   construction: the page IS the story; its size ground is stated in the
   PR body.
4. PR-3 — evidence: fidelity run + dispositions, wow-register rows, (on
   PASS) screenshot baselines, the completion amendment note on
   `design-system-completion`.
5. Return: the census resumes at its slice-A boundary; completion note
   here.

## PR-1b integrity & lifecycle hardening — the cure ledger (assurance round, 2026-08-09)

Complete record of what #834 needs fixing and how, from the four-surface
assurance round (adjudicated packet: PR #834 comment 5232387226; per-surface
raw records in the session review collation; method report cited in the PR-1b
todo). Ordered by theme. Each row: the **invariant** at stake, the
**architectural root** (why it is not unit-provable today), the **cure** (the
seam or decomposition), and the **proof** it lands with.

### HOW — the governing rule for every cure below (owner ruling, 2026-08-09)

> Tests that use the filesystem and network have their place — full-system
> smoke tests — but almost everything can be more effectively proven with
> lower-level testing, and if that is hard, that difficulty is typically
> exposing a weakness in the architectural design rather than a lack of
> wide-net testing.

Every cure is therefore authored as an **architecture change that makes the
invariant provable at the lowest level** — a pure function or an injected seam
(ADR-078) — never as "add a wide-net test." The reason each defect below evaded
five review rounds is that the current shape pushes its proof out to the
real-fs/real-process boundary; the cure pulls it back. Real IO proofs survive
only in two narrow forms: a **smoke-tier** check that the wiring holds on the
real artefact, and the one **spawn-topology contract** (a bounded synthetic
child) reserved for a real child's signal/exit fidelity where no seam below can
carry the proof. Neither is the primary proof of any invariant here. Every cure
lands test-and-code atomic (TDD), and the guard is shown to bite (mutation
check) before the commit.

### DEPTH — how far each cure goes (owner recalibration, 2026-08-10)

The §HOW ruling above says how a cure is SHAPED. This says how FAR it goes,
and it was set after this node was ratified — the frame arrived on
2026-08-10, the ratification stamp is 2026-08-09, so the ledger below was
authored under a frame that no longer governs on its own.

> The design work exists to decrease the cost of exploratory app
> experiments to near zero — hence whitelabelling, hence the need to show
> how powerful and efficient the system is.

The wow page is that demonstration; this instrument is MEANS. So the round
completes at **ledger-minimum depth**: the ledger is the bound and nothing
beyond it, and where a row admits a named home, DEFER rather than cure.
Every status and READY report states DISTANCE-TO-PIXELS, not gates-green.

The per-row test is therefore: **does this row block the merge, or does it
improve an instrument that cannot yet do its job?** — because six of the
showcase's seven declared pairs target `/identity-switchboard/specimen`,
a route PR-2 has not built yet. The map is a red test for a page that does
not exist, and EI-1 is what makes that red HONEST: before it, a 404
capture wrote a blank PNG the report trusted; after it, the run refuses.
That is the cure round's real warrant, and it is also its bound — further
hardening of a showcase-side instrument buys nothing until PR-2 lands.
(The hub consumer is live today and is not covered by this bound.)

Scope discipline: ledger MEMBERSHIP is the Director's — the adjudicated
packet (PR comment 5232387226) is theirs and the round was
owner-commissioned. This clause bounds DEPTH within rows, never which
rows exist. The
non-override clause of `proportionality` binds here in full: this changes
how much is built, never whether the built thing is correct.

### Blocking — evidence integrity (the tool's core invariant; confirmed on 4 surfaces + R27)

- **EI-1 — a failed/blank/404 capture must never become trusted evidence.**
  Root: capture writes go straight to canonical names
  (`capture-live-pages.ts:58-61`, `render-export-targets.ts:143-145`,
  `capture-live-sections.ts:80`), and `buildAndWriteReport`
  (`orchestrator.ts:145-174`) reconstructs its filesystem dependencies
  internally — the `EvidenceIo` seam is injected only into `diffPair`, so the
  "report-only refuses a mixed/incomplete cohort" invariant has no unit-level
  hold. Cure: (a) a first-class **capture manifest** value — base, per-arm
  width, scale, pair set, timestamps, content hashes, and a completed-run
  marker; (b) extend `EvidenceIo` over the whole capture-write and
  report-read path; (c) capture stages into an isolated run directory and
  **atomically promotes** only on a complete manifest; (d) a **pure**
  `reconcileCohort(manifest, requestedFlags) -> Result<Report, MixedCohort>`.
  Proof: `reconcileCohort` is unit-tested over in-memory manifests
  (mixed-geometry rejected, incomplete-run rejected, matching cohort accepted)
  — mock-free, no filesystem. One smoke-tier round proves stage→promote wiring.
- **EI-2 — a report must state the geometry the evidence was shot at.** Root:
  `orchestrator.ts:165-170` writes current flags as truth unconditionally, and
  the hub SECTION arms hardcode 1440 (`drive-export-sections.ts:123-128`,
  `capture-live-sections.ts:91-104`) while page arms honour `--width`. Cure:
  geometry is per-arm/per-pair in the manifest (EI-1); report-only derives it
  from the manifest; width threads into both section arms; report-feeding
  hardcoded widths deleted. Proof: the manifest-to-report meta mapping is a
  pure function, unit-tested.
- **EI-3 — concurrent runs must not corrupt a shared evidence set.** Root: no
  run lease; A spawns and stops the shared server mid-B-capture; both write
  fixed paths. Cure: a per-consumer run lease over the isolated run dir + the
  atomic promotion of EI-1 (one mechanism serves both). Proof: the lease
  acquire/refuse decision is a pure function over an injected clock+lockfile
  fake.

### Blocking — capture comparability (the fleet's frame-challenger finding)

- **CC-1 — export and live sides must be captured under the same settle, or no
  disposition's warrant holds.** Root: the five-line settle recipe
  (`document.fonts.ready` + animation-kill + `waitForTimeout(2000)`) is
  byte-duplicated across five arms (`capture-live-demo.ts:89-92`,
  `capture-live-sections.ts:49-51`, `render-canonical-targets.ts:75-78`,
  `capture-live-pages.ts:45-48`, `render-export-targets.ts:127-130`) — there is
  no single settle unit, so comparability is unprovable. Cure: consolidate into
  one package function `settleForCapture(page, opts)`; every arm calls it; make
  it available to the Quality-bar rule-6 screenshot baselines
  (`apply-state.ts:127`, which today settles differently — the frame-challenger's
  cross-surface link). Proof: the settle sequence is one unit over an injected
  page fake (ordered-call assertion); "every arm uses it" is an **ESLint
  boundary rule** forbidding a direct `waitForTimeout` in capture arms — a
  structural gate, not a test (the-kind-fits-the-class). NOT covered by MCP-534
  (serve mechanics only).

### Blocking — lifecycle & cleanup (Codex ×3 + fleet round-audit)

- **LC-1 — every acquired browser/server is released on every path.** Root:
  cleanup lives in success-path control flow (`render-canonical-targets.ts:98-133`,
  `drive-export-sections.ts:123-161`, `capture-live-demo.ts:130-142`,
  `capture-live-sections.ts:100-111`); an unbounded `document.fonts.ready` can
  hang teardown; no top-level CLI SIGINT/SIGTERM handler reaps the detached
  child. Cure: a resource-**bracket** abstraction (`withResource(acquire, use)`
  guaranteeing release) owning browser and server handles; a run-wide
  `AbortSignal`/deadline threaded through nav→fonts→eval→screenshot→report; a
  signal handler that reaps the detached child. Proof: the bracket is a pure
  higher-order function unit-tested with a fake whose release is asserted on the
  throw path — zero real processes.
- **LC-2 — "server released/ready" must mean the child actually is.** Root:
  liveness is inferred from a 2s HTTP probe (`dev-server.ts:73-79`) that a
  socket-holding, header-withholding server defeats, and a startup race can bind
  the wrong service with no identity check (`dev-server.ts:182-202`) — the
  mechanism behind SOL-1's "infra failure presented as product divergence." Cure:
  own the child handle and observe its exit event; verify an app/route/identity
  sentinel on the served response; prove group termination independent of HTTP;
  prove the port re-bindable. Proof: "released = child-exited" and
  "ready = identity-sentinel-seen" are a pure state machine over an injected
  process-handle + response fake; the ONE real-process test is the sanctioned
  spawn-topology contract for a real child's exit/signal fidelity.

### Blocking — fs-target containment (Codex SOL-3, double-confirmed)

- **SEC-1 — a served path must resolve to a regular file inside the root.**
  Root: containment is lexical (`static-path-guard.ts:35-40` admits it) and the
  servers `stat`/`createReadStream` follow symlinks/FIFOs
  (`export-server.ts` hub:46-67 / showcase:98-123); the untracked vendor export
  root cannot be assumed clean; the showcase accepts every non-directory node and
  splits `existsSync`→`statSync` (R27 suppressed comment names this exactly).
  Cure: `resolveContainedTarget(root, urlPath, statFn) -> Result<RegularFile,
  Escape>` — pure over an injected stat (lstat/realpath) result; regular-files
  only; stream from the validated opened handle. Proof: unit-tested with fake
  stat results (symlink-escape rejected, FIFO rejected, vanish-between-checks
  handled) — no real filesystem; one real symlink at smoke tier proves wiring.
- **SEC-2 — evidence paths and image sizes are bounded.** Root: schemas are
  `z.string().min(1)` (`fidelity-pairs.ts` both apps); `orchestrator.ts:150-154`
  does uncontained `path.resolve`; PNG decode allocates `w×h×4` unbounded; literal
  `?`/`#` read raw by fs but emitted unencoded to report URLs
  (`fidelity-html.ts:10-15`). Cure: a safe-relative-path schema + root containment
  on every read/write + size/dimension budgets + URL-encoded segments. Proof: the
  path-validation schema and the budget check are pure functions, unit-tested.
- **SEC-3 (adversarial-input model) — capture egress is confined to the declared
  origin.** Root: unvalidated `--base` (`capture-flags.ts:62-69`) and
  unrestricted browser subresources permit SSRF (needs CLI/env or page-content
  control; no direct remote HTTP input). Cure: `allowLoopbackOrigin(base) ->
  Result<Origin, Rejected>` pure guard + a browser-request allowlist to the
  declared origin + redirect re-check. Proof: the origin guard is a pure unit;
  the request-interception allowlist proves at integration tier (a code seam).

### Blocking — boundary strictness (Codex SOL-2 + R27 + fleet second wave)

- **BV-1 — the pairing boundary rejects unknown keys.** Root: `z.object` (not
  `strictObject`) at `pairing-schema.ts:23-46` and both apps' `fidelity-pairs.ts`
  silently strips a misspelled/obsolete field — a direct strict-validation-at-
  boundary violation, untested. Cure: `z.strictObject` at all three levels. Proof:
  a unit test per level (unknown key rejected) — always was unit-shaped, simply
  never written.
- **BV-2 — `resolveBase` rejects a flag-shaped/missing value** (R27 suppressed
  comment at `orchestrator.ts:52`; asymmetric with the red-first `resolveWidth`
  already landed). Cure: Result-typed `resolveBase`, require a following value,
  validate an HTTP(S) URL. Proof: pure unit test, mirroring `resolveWidth`.

### Deferrable — land with a named home, never silently

`EvidenceIo` made Result-safe over the whole report path (subsumed by EI-1);
idempotent teardown (ESRCH-on-already-stopped reads as success); NodeNext
declaration portability (`.js`-qualified specifiers or bundled `.d.ts` + a
NodeNext consumer smoke); explicit static-server limits (header/timeout/conn
caps); the report positional-contract constraint is a package-internal HTML
detail (`fidelity-html.ts:15` `../../` literal) — compute the depth instead of
literalising it; the register schema pins no observed ratio / export fingerprint
/ geometry, so `orphanedEntries` is its only staleness signal and its evidence
lives in a gitignored tree a clean checkout cannot verify (design the register
to carry the judged fingerprint).

### Records & process cures (some Director-side)

- `## Mechanism` still says "Copy the hub's tools" in the decision-complete
  section (the copy-vs-compose correction landed only in the todo) — true the
  Mechanism clause.
- MCP-533 is marked Done while its described PR-1b scope is unmerged — reconcile
  at the lane's resume (it owns the ticket's scope).
- The PR body's PDR-132 round-budget claim is inaccurate at the current head —
  true it.
- Porting instructions name 3 of the 7 needed public modules, point at no worked
  example, and do not distinguish the two export-server shapes — the skill/playbook
  porting section needs the composition recipe.
- Test-coverage gaps that let the EI/LC defects ship: `buildAndWriteReport` /
  orchestrator-wiring / `loadRegister` / `writeReport` and `export-server`'s named
  failure branches are untested, and the magnitude-invariant is asserted only at
  `changedRatio=0`. Each EI/LC/SEC/BV cure above closes its own gap by
  construction — the untested state IS the design debt this ledger repays.

### Positives verified in the round (route to the rules process, not this PR)

The overlay's exports-map-bounded package-root fallback (converts wrong-target-
passes-blank-classifier from invisible to mechanical — the best new design in the
arc); the diff-magnitude-never-gates invariant surviving two refactors; the
reactive-consolidation-at-the-duplication-gate pattern; the dated-in-place
plan-correction discipline.

## Out of scope (YAGNI)

Root-route replacement (W1.5's); a motion control; a Part-A-only lever;
logo-per-identity (no token role carries a logo — deliberate, recorded);
serving `studio-source/` from any app; identity persistence across
reloads (deliberate showcase behaviour, recorded).

## Acceptance criteria

- `repo-safe`: workspace `type-check`/`lint`/`test` green;
  `validate-authored-css` green over the new route CSS;
  `validate-kit-assets` green (manifest closure, incl. any new rows);
  `test:ui` and `test:a11y` green including the new routes' cells and the
  no-flash cell; `tool:fidelity` mechanically green with ZERO
  UNREGISTERED pairs; the wow-verdict register parses with the new rows
  (agent-tools suite); the identity-naming ratchet census-exact (zero new
  occurrences by construction).
- `owner-held`: the browse verdict recorded as a checkpoint row with the
  owner's Director-relayed words as `source`; on PASS, the screenshot
  baselines landed.
- PR-1b hardening (`repo-safe` + `owner-held`): every blocking row in
  `## PR-1b integrity & lifecycle hardening` cleared, each with the
  unit-level proof its cure names (mock-free where the seam allows; the
  smoke-tier wiring check and the single spawn-topology contract are the
  only real-IO proofs); the guard shown to bite (mutation check) before
  each landing; the `mergeStateStatus: BLOCKED` and the R27 undispositioned
  round both resolved. #834 does not merge until this clears.

## Review notes (plan-body-first-principles-check)

The shape clause fired at this authoring (this body). Landing-path: the
three PRs above. Vendor-literal: none — no new vendors; the three
already-whitelisted external origins are unchanged. Record-consumers: the
fidelity register is read by PR review and W4.2's inventory dispositions;
the wow rows by the instrument's miss-rate obligation; the provenance
manifest by W2.9. Optionality: closed vocabularies throughout
(dispositions, identities, themes).

## Relationships

This node executes the owner's 2026-08-09 pull-forward word and owns ONLY
the switchboard page pair, its fidelity machinery, and its evidence.
`design-system-completion` keeps W1.2 (the plain-demo pages), W1.5 (probe
scope + root replacement — this node's landing is its switchboard-page
input, noted by dated amendment), W0.9 (unchanged, already unblocked),
and the census/charter continue in parallel per its own §Sequencing
(first pixels never gated on them). W0.5's blocking ledger binds here as
at W1.2: items 1 (asset closure via the kit + manifest), 2 (ordered-calm,
judged by rubric criterion 7), 3 (the provenance manifest), and 10 (the
framing-prose owner-voice batch at the checkpoint); items 6-defect and 7
do not render on this page.

## Verification (end-to-end)

1. `pnpm check` green from cold at each PR.
2. PR-2: `dev:open` → both routes render; switching identity re-brands
   the specimen with no Oak flash; the theme group drives `data-theme`;
   keyboard-only operation of both groups; 400%-zoom reflow of the picker
   page.
3. PR-3: the `tool:fidelity` report open — six pairs, ratios, zero
   unregistered; the instrument legs' verdicts in the register; the owner
   browse at 3020 with the export at 3030 beside it.
