# PR-1b cure round 6 — slice design (pre-execution input)

Author: Civet spins Cavern (054f5e), design lane. Date: 2026-08-09.
Inputs, all read first-hand: the adjudicated assurance packet (#834
comment 5232387226), Copilot R27's four suppressed findings, the plan's
`## PR-1b integrity & lifecycle hardening` ledger
(`.agent/plans/delivery/identity-switchboard-first-pixels.plan.md`), the
methodology report §6/§8, and the current worktree sources at head
`SHA:db980a967`. This document is the confirmed slicing the standing
pre-execution code-expert review fires on; its durable projections are
the PR body's cure-round-6 section and the commits themselves.

## The one governing rule (owner ruling 2026-08-09)

Every cure is an architecture change that pulls its invariant down to a
unit-provable seam — a pure function or an injected seam — never "add a
wide-net test". Real IO survives only as smoke-tier wiring checks and
the one sanctioned spawn-topology contract. Seams are chosen for
falsification power: the test must be able to fail for exactly the
right reason.

## Slice order and shape (one coherent push; TDD-atomic commits)

Ordered so each commit leaves the tree green and the later slices build
on the earlier seams. PDR-132 binds at this authoring: the whole round
targets ≤2 review rounds on #834; each commit is single-story.

### Slice 1 — BV: boundary strictness (warm-up; pure-unit rhythm)

- **BV-1**: `z.object` → `z.strictObject` in
  `buildPairingMapSchema` (`pairing-schema.ts`) and both apps'
  `fidelity-pairs.ts` pair schemas. Red-first: unknown-key rejection
  test at each of the three levels (package unit + one per app).
- **BV-2**: `resolveBase` in `capture-flags.ts` becomes Result-typed,
  mirroring the landed `resolveWidth` shape (extracted raw-input
  helper; reject a valueless/flag-shaped `--base`; validate an
  HTTP(S) URL via `new URL` + protocol check). `resolveRunFlags`
  composes the two Results. Red-first on the two R27 failure shapes
  (`--base` at argv end; `--base --report-only`).

### Slice 2 — CC-1: one settle unit + a structural gate

- New package module `capture-settle.ts` (public subpath
  `/capture-settle`): `settleForCapture(page, opts)` over a minimal
  structural `SettlePage` interface (`evaluate`, `addStyleTag`,
  `waitForTimeout`) — fonts-ready wait (bounded, see LC-1's deadline),
  animation/transition kill, settle delay as the ONE named constant.
  Unit test asserts the ordered call sequence on an injected fake.
- All five capture arms (`capture-live-pages.ts`,
  `render-export-targets.ts` showcase; `capture-live-demo.ts`,
  `capture-live-sections.ts`, `render-canonical-targets.ts`,
  `drive-export-sections.ts` hub — six call sites, five recipes today)
  replace their inline recipe with the one call.
- **Structural gate, not a test**: an ESLint restriction forbidding
  `waitForTimeout` / `document.fonts` in `demos/*/tools/**` capture
  arms outside the package module — scoped `no-restricted-properties`
  (or the standards-plugin boundary mechanism if it fits better; the
  reviewer should judge which home is idiomatic). The rule is the
  "every arm uses it" proof.
- The module is exported so the Quality-bar rule-6 Playwright
  baselines (`apply-state.ts`) can consume it — that consumption is
  PR-2-adjacent work with a named home in the plan (CC-1), not this
  push.

### Slice 3 — EI: the capture manifest keystone (the round's centre)

New package module `capture-manifest.ts` (public subpath
`/capture-manifest`), plus an `EvidenceIo` extension in
`orchestrator.ts`. Design:

- **Manifest value** (zod `strictObject`, dogfooding slice 1):
  `{ version: 1, base, deviceScaleFactor, startedAt, completedAt,
  entries: [{ pairId, side: 'export'|'live', relativePath, widthCssPx,
  contentHash }] }`. `completedAt` present ⇒ the capture arm finished
  and validated; the manifest is written LAST — it is the run's commit
  record. Content hashes make a torn promotion mechanically visible.
- **Staging + promotion**: capture arms write evidence into an
  isolated run directory (`demo-evidence/.staging/<runId>/`, runId from
  the composition root — no hidden clock). On arm success AND
  non-suspect validation, `promoteRun` moves each staged file to its
  declared canonical path and writes the manifest last
  (`demo-evidence/fidelity-capture-manifest.json`). On suspect/failed
  capture: NO promotion — the staged shots remain as diagnostics (this
  is exactly R27's asked-for shape: diagnostic evidence survives,
  canonical evidence is never poisoned). The staging dir is
  gitignored alongside the existing evidence tree.
- **Pure cohort reconciliation**: `reconcileCohort(manifest, expected)
  -> Result<CohortMeta, string>` — pure over in-memory values.
  `expected` carries the declared pairs (ids + evidence paths +
  diffEligible) and the run flags. Refusals, each its own unit case:
  no manifest (report-only with nothing captured), incomplete cohort
  (declared pair absent from manifest), mixed geometry (entries
  disagree on width/scale), stale-vs-declared drift (manifest names a
  path the map no longer declares), missing `completedAt`.
  `CohortMeta` carries the manifest-derived geometry + base +
  timestamps for the report meta.
- **Hash verification at read**: `verifyCohortEvidence(manifest, io)`
  — reads each entry via `EvidenceIo` and compares a content hash
  (pure hash helper; io injected). A hash mismatch or missing file is
  the mechanical failure "evidence does not match the manifest".
- **EvidenceIo extension (subsumes the Result-safe deferrable)**: the
  interface grows `writeEvidence`/`readManifest`/`writeManifest` legs
  and every leg becomes Result-typed; `buildAndWriteReport` stops
  reconstructing fs internally — the composition root passes the io
  (the orchestrator provides `nodeEvidenceIo(demoDir)` as the one
  real implementation). The whole report path becomes provable with
  the same in-memory fakes `diffPair` already uses.
- **EI-2 geometry**: width threads into the hub SECTION arms
  (`capture-live-sections.ts`, `drive-export-sections.ts` — the
  hardcoded 1440s become the run width); every staged write records
  its per-arm width/scale into the manifest; `RunMeta` for
  report-only derives from `CohortMeta`, never from current flags.
  The report-feeding hardcoded widths are deleted.
- **EI-3 lease**: pure decision `judgeRunLease(now, existing:
  LeaseFileContent | undefined, ttlMs) -> Result<'acquire'|'refresh',
  string>` + io legs to read/write/remove
  `demo-evidence/.fidelity-run-lease.json`. A live lease refuses the
  second run loudly (naming the holder + age); a stale lease (crashed
  run, past TTL) is reclaimed. Unit over fakes; the lease rides the
  same staging mechanism (one mechanism, EI-1+EI-3).

### Slice 4 — LC: lifecycle brackets, deadline, child ownership

- **LC-1 bracket**: package `withResource(acquire, use)` higher-order
  helper — acquire yields a handle + release; release runs on every
  path; release failure composes into the Result (the
  `captureAndReport` "then" composition, generalised). Unit: fake
  whose release is asserted on the throw path. `captureAndReport`
  and the app arms' browser handling adopt it; the hub arms gain the
  try/finally they lack today (via the bracket, not hand-rolled).
- **Run-wide deadline**: the composition root creates one
  `AbortSignal.timeout(RUN_DEADLINE_MS)`; it threads through
  `captureAndReport` → capture arms → `settleForCapture` (fonts-ready
  bounded by the signal — the unbounded `document.fonts.ready` hang
  dies here) → nav/eval/screenshot. The deadline value is one named
  package constant.
- **Signal reaper**: package `registerRunTeardown(handle, proc)` —
  registers SIGINT/SIGTERM handlers that stop a spawned server before
  exit, returns an unregister function; pure over an injected
  process-like (`on`/`off`/`exit`). Composition roots call it when
  they receive a spawned handle.
- **LC-2 child ownership**: `dev-server.ts` keeps the ChildProcess
  reference (still detached for group-kill semantics) and observes
  `exit`; "released" = child-exit observed (port-release proof
  retained as the secondary, printed evidence); "ready" = HTTP
  responds AND an app-identity sentinel matches (app passes
  `{ path, marker }`; the served body must contain the marker —
  binds-the-wrong-service becomes a loud identity failure, not a
  silent wrong-capture). The ready/released logic becomes a pure
  state machine over injected probe/exit events, unit-tested; the
  ONE sanctioned real-process test is the spawn-topology contract: a
  bounded synthetic child proving group-term/exit fidelity.
- **Idempotent teardown deferrable rides here** (ESRCH on
  already-exited reads as success) — it is two lines inside
  `stopSpawned` and its unit case, cheaper to land than to home.

### Slice 5 — SEC: fs-target containment, budgets, egress

- **SEC-1**: `static-path-guard.ts` gains `resolveContainedTarget(
  root, urlPath, fsProbe) -> Result<ContainedFile, string>` — pure
  over an injected probe (`lstat`-shape + `realpath`-shape results):
  refuses symlinks and non-regular files, re-anchors the REAL path
  inside the REAL root, treats vanish-between-checks as not-found.
  Both export-servers consume it and stream from the validated open
  handle; the showcase's `existsSync`/`statSync` split and the hub's
  caught `statSync().isFile()` both collapse into the one seam. Unit
  with fake probe results; ONE real symlink at smoke tier proves
  wiring.
- **SEC-2**: pairing schemas gain the safe-relative-path refinement
  (relative, inside the demo root by construction: no absolute, no
  `..` segment, no backslash, no `?`/`#`); `nodeEvidenceIo` adds root
  containment on every resolve (defence in depth behind the schema);
  `image-diff` gains a dimension budget read from the PNG header
  before full decode (named constant, e.g. 8192×16384 — generous for
  full-page shots, fatal for allocation bombs); `fidelity-html`
  URL-encodes path segments at render. Each is a pure unit.
- **SEC-3**: `allowLoopbackOrigin(base) -> Result<URL, string>` in
  `capture-flags` (exact loopback hosts, http(s) only) — consumed by
  `resolveBase` (slice 1's BV-2 validates URL shape; SEC-3 narrows to
  loopback — one composed validator, two named reasons); browser
  subresource allowlist: a pure `isAllowedRequest(url, declaredOrigin)`
  predicate + `context.route` interception in the arms that aborts
  disallowed origins (redirect re-check included: the response URL's
  origin is judged, not just the request's). Predicate unit-tested;
  interception is a code-seam integration proof.

### Slice 6 — records & process (no product code)

- Plan `## Mechanism` "Copy the hub's tools" → the compose form
  (dated in place, primary checkout, coordination branch).
- PR body: PDR-132 round-budget claim trued; cure-round-6 section
  with the design story.
- Porting section (fidelity-review SKILL-CANONICAL + conversion
  playbook + hub README pointer): the composition recipe naming all
  seven public modules, the two export-server shapes, and the worked
  examples (both apps' `fidelity-review.ts`).
- MCP-533 reconcile: the lane owns the ticket's scope — record on the
  ticket that its PR-1b scope completes at #834's merge (comment;
  status per Linear hygiene at the merge moment).
- Deferrables that do NOT ride this push land as named homes on
  MCP-534: NodeNext declaration portability; explicit static-server
  limits (header/timeout/conn caps); the register-schema fingerprint
  design (observed ratio/geometry pinning); the `fidelity-html`
  `../../` depth literal computed instead of literalised (small — may
  ride slice 3 if the EvidenceIo reshape touches that line anyway).

## What I am deliberately NOT doing (proportion, §5)

No refactors outside the ledger's rows; no barrel; no new subpath
beyond `/capture-settle` + `/capture-manifest`; no register-schema
redesign (named home); no rule-6 baseline consumption (PR-2-adjacent,
named home); the demoted-internal module set stays as cured in round 5.

## Proof summary (the merge-gate mapping)

Every blocking row lands with its named unit proof, mock-free where
the seam allows; mutation check (guard-bites) before each commit;
real IO only in: the staging/promotion smoke round, the SEC-1 symlink
smoke, and the LC-2 spawn-topology contract. Gates: package + both
app suites, knip, both `--report-only` smokes, full `pnpm check`
serialised per check-singleton; then dispositions (R27's four),
PR-body truing, re-READY.

## Adjudication addendum — pre-execution review absorbed (2026-08-09, dated in place)

The standing pre-execution code-expert review (opus) returned CHANGES
REQUESTED with eight must-fixes, all first-hand-verified against the
sources. Dispositions (every M accepted; one mechanism modified with
the modification recorded):

- **M1 ACCEPTED (mechanism modified)** — manifest entries key on
  `relativePath` (what an arm actually knows), carrying
  `{ relativePath, widthCssPx, deviceScaleFactor, contentHash }`;
  `reconcileCohort` resolves declared pairs → entries by path. The
  provenance discriminator is DERIVED, not declared: a pure
  `sideProvenance(relativePath)` — under `demo-evidence/` ⇒
  `captured`, else `vendor` — because the declared path already IS
  the declaration and a second declared field could only agree or
  desync. Refusals stay honest both ways: a `captured` side missing
  from the manifest fails; a `vendor` side present in it fails.
  `promoteRun` destinations are restricted by a pure
  `isPromotableTarget` (under `demo-evidence/` only) so promotion can
  never touch the byte-sacred vendor tree. The hub arms stay
  path-keyed (no pair-awareness retrofit — the duplication the
  reviewer warned against).
- **M2 ACCEPTED** — the SEC-3 allowlist is
  `declaredOrigin ∪ ratifiedExternalOrigins`, the ratified list
  consolidated at its second consumer from
  `apply-state.ts` (fonts.googleapis.com, fonts.gstatic.com,
  cdn.jsdelivr.net); the interception lands on ALL SIX capture call
  sites in one commit; a blocked request routes into the
  required-resource-failure machinery and fails the run loudly.
  `allowLoopbackOrigin` admits exactly `localhost`, `127.0.0.1`,
  `[::1]`.
- **M3 ACCEPTED** — the structural gate bans the SCREENSHOT, not the
  settle primitives: the package exports `captureShot(page, opts)`
  (settle-then-shoot, returning the PNG Buffer — the Buffer pivot
  that also enables hashing and the SEC-2 budget); ESLint restricts
  `page.screenshot`/`locator.screenshot` to the package call, scoped
  to the ENUMERATED capture-arm files, homed in each demo's own
  `eslint.config.ts` (options-replace trap respected), never the
  shared standards plugin.
- **M4 ACCEPTED** — the primary release proof is GROUP-GONE via an
  injected `probeGroup(pid)` (`kill(-pid, 0)` catching ESRCH);
  child-exit is the fast-path corroborator; HTTP probe is printed
  evidence only. The idempotent-teardown deferrable falls out of the
  same probe.
- **M5 ACCEPTED** — the identity sentinel binds to the shared
  reachability decision: `assertServerUp` AND both `ensureDevServer`
  branches consume a pure `judgeServerIdentity(status, body, marker)`;
  responds-but-foreign refuses loudly. Each app passes
  `{ path, marker }`; implementation prefers an explicit app-identity
  marker in the served HTML (a meta/data attribute — zero pixel
  impact) over incidental text.
- **M6 ACCEPTED** — the lease carries
  `{ runId, pid, hostname, startedAt }`; the decision takes `self` +
  an injected `holderLiveness` (`alive|gone|unknown` from
  `kill(pid,0)` same-host) and returns
  `acquire|refresh|reclaim`; a dead holder reclaims immediately, a
  live holder never reclaims regardless of age, TTL governs only
  `unknown`; a `release` leg removes the lease on clean exit.
- **M7 ACCEPTED** — proof homes named: the spawn-topology contract in
  `packages/libs/fidelity-review/tests/` (base include reaches it,
  apart from the co-located seam suite); the staging-promotion and
  SEC-1 symlink smokes in `smoke-tests/` directories with CI-run
  scripts wired per testing-strategy §smoke.
- **M8 ACCEPTED** — no run-wide AbortSignal (Playwright's `evaluate`
  cannot take one). The fonts wait bounds INSIDE the page
  (`Promise.race([document.fonts.ready, timeout])` with a named
  `FONTS_READY_BUDGET_MS`, asserted through the SettlePage fake);
  everything else bounds per-call via
  `context.setDefaultTimeout`/`setDefaultNavigationTimeout` at arm
  entry. Every operation bounded ⇒ the run is bounded by
  construction; the single `RUN_DEADLINE_MS` constant is dropped.

Recommendations R1–R13 all accepted as implementation guidance,
notably: R1's handle-yielding SEC-1 sequence (lstat → O_NOFOLLOW open
→ fstat ino/dev compare → realpath containment; `ContainedFile`
carries the fd; the intermediate-component race is STATED as a limit,
not claimed closed); R2's total-pixel budget as primary; R3's
role-split of EvidenceIo (read/diff-write/capture-write/manifest legs,
one `nodeEvidenceIo` satisfying all) which also injects `loadRegister`
(R12); R4 resolved by DROPPING `completedAt` — the canonical
manifest's presence, written last by rename, IS the completion marker
(an unreachable refusal branch is not a proof); R6's two extra
`resolveBase` call sites; R7's hub-local `resolveWidth` folded in the
EI-2 commit; R11 trued to NINE public modules; R13's non-zero-ratio
magnitude case.

**Re-sequenced slices** (pixel-affecting changes land adjacently — ONE
evidence re-baseline, dispositions re-warranted once, stated in the
PR body):

1. BV-1 + BV-2 (+`allowLoopbackOrigin` composed into `resolveBase`;
   R5's `$strict` annotation; R6's call sites).
2. CC-1 `captureShot` + ESLint screenshot gate + SEC-3 interception
   with the ratified-origin allowlist (M2/M3 shapes) — the
   pixel-affecting pair, one re-baseline; the
   `drive-export-sections` per-shot settle decision: the FULL settle
   applies per shot (comparability is the invariant; the pixel change
   is the point and is re-warranted in the same baseline).
3. EI as four commits: (i) manifest value + `reconcileCohort` pure
   core; (ii) EvidenceIo role-split + `nodeEvidenceIo` +
   `buildAndWriteReport` injection + `loadRegister` leg; (iii)
   staging/promotion + `verifyCohortEvidence` + the arms' Buffer
   pivot + EI-2 width threading + R7; (iv) the lease.
4. LC: `withResource` + hub try/finally; in-page fonts bound +
   context default timeouts (M8); signal reaper; group-gone probe
   (M4) + identity sentinel on the shared decision (M5) +
   spawn-topology contract (M7 home).
5. SEC-1 handle-yielding containment in both servers (fd lifetime per
   the reviewer's risk 2: close on every non-serving path,
   `autoClose` stream) + SEC-2 budgets/schema/encoding + R13.
6. Records + smoke wiring (homes per M7).

Post-build review panel (before push): security-expert (SEC slices,
deep) + test-expert (tier homing + falsification power, deep) +
code-expert gateway — per the reviewer's specialist-coverage note;
architecture coverage of M1 is discharged by this addendum's
correction.
