# Thread: eslint-no-throw-result-migration

Migrate every `throw` to the Result pattern (ADR-088), drive the 1000 ESLint
warnings (999 `@oaknational/no-throw-statement` + 1 `no-real-io-in-tests`) to zero,
then promote the rule `warn`→`error`. Owner-ruled strict: no exemptions; ADR-088 is
amended to match.

## Participating agent identities

| platform | model | agent_name | role | last_session |
| --- | --- | --- | --- | --- |
| claude | Opus 4.8 (1M) | Vanilla weaves Undergrowth (8fc36b) | plan-author + exemplar | 2026-06-19 |
| claude | Opus 4.8 (1M) | Merlin spins Cirrus (5e7419) | execution (WS0/WS2/WS4 start) | 2026-06-19 |
| claude | Opus 4.8 (1M) | Siren mends Rudder (fcdfe9) | execution (WS2 leaves + vendor-callback) | 2026-06-19 |

Merlin spins Cirrus executed the first conversions (commit `1556b9191`); **Siren mends
Rudder** (`fcdfe9` — owner-named, DISTINCT from Siren guards Reef `e0eb7f`, the separate
PDR-105 lane, now retired) received the natural-boundary handoff and landed 3 further
conversions (see session progress below). Vanilla→Merlin handoff `9564bbd3`/pickup `acd987e1`;
Merlin→Siren handoff (natural-boundary, no PDR-063 record) broadcast `6519b97d`/pickup `fbb5861b`.

## Lane state

- **Owning plan (RESHAPED 2026-06-19)**:
  [`no-throw-remediation.plan.md`](../../../plans/architecture-and-infrastructure/current/no-throw-remediation.plan.md)
  — investigation-first, **READY (survey-first), remediation PAUSED by owner** to progress the
  strategy thread. It **supersedes the convert-all framing** of
  [`no-throw-statement-result-migration.plan.md`](../../../plans/architecture-and-infrastructure/current/no-throw-statement-result-migration.plan.md)
  (now a dated input the WS0 survey validates; its 92KB worklist's per-site labels are distrusted).
  Owner reopened the work because the 1000-count is an indiscriminate-rule artefact (~6 cause-classes,
  not 1000 problems; ~1/3 tests, ~189 generated from ~10 templates, ~400/811 flagged false-positive),
  and the per-site analysis proved unreliable (3 mis-labels this session). Reviewed READY by
  assumptions-expert + test-expert (folded). **Resume from the remediation plan's WS0**, NOT the
  migration plan's WS0-WS9.
- **Current objective**: execute the plan WS0→WS9. Convert every throw; amend ADR-088
  / `use-result-pattern.md` / `principles.md` (WS9); promote the rule.
- **Current state**: executing on `docs/planning-and-validation`. 4 conversion commits landed
  (Merlin `1556b9191`; Siren `93beffcfe` observability, `304b68f8d` graph-core jsonld,
  `61bdbc3e4` logger) — all full-gate-green, reviewed. WS0 keystone (`assertNeverResult`) done.
  **The cheap WS2 result-returns are largely exhausted; the leaf residue is design-laden**
  — see §"Remaining-throw tier map" below (the load-bearing grounded knowledge for the next executor).
- **Blockers / low-confidence areas**: the remaining leaf src throws are NOT mechanical WS2 —
  they split into type-narrowing-artifacts (removable via type-strengthening), genuine
  result-returns, and design-laden (construction-contract / module-init / WS5 rethrow / stateful
  guards) that each need a dedicated reviewed cycle. Inherited per-workspace counts conflate
  src/test AND throw-class — re-read every site (this overturned 3 inherited labels this session).
- **Next safe step (when remediation RESUMES — currently PAUSED for the strategy thread)**:
  the remediation plan's **WS0 fresh holistic cause-survey**, NOT a site fix. The
  §"Remaining-throw tier map" below and the old worklist are **input the survey validates**,
  not the next action — the whole point of the reshape is to re-ground before executing. After
  WS0: WS1 (review fixes-to-date for hacks), then WS2 (test-quality triage, priority), then WS3
  (generator causes, F-74-gated), then the WS4 reassess gate. `express-middleware.ts:92` /
  `log-levels.ts:102` are candidate early fixes the survey will confirm, not pre-committed steps.
- **Coordination**: agent-tools (214 sites) and the WS9 doctrine edits sit on Siren
  guards Reef's claim `b01b303e` — narrow-claim + pathspec per Siren's coordination
  broadcast; execute last.
- **Promotion watchlist**: WS9 amends ADR-088 (owner-ruled); the rule promotes to
  `error` at zero warnings.

## Merlin spins Cirrus session progress (2026-06-19)

**Execution is on `docs/planning-and-validation`** — the intended branch (owner-corrected
2026-06-19). A brief worktree off `main` was an unnecessary complication and is retired
(stale `feat/no-throw-result-migration` worktree/branch awaits tidy-up — owner deferred it).
Same-branch coordination via claims + explicit pathspec is the protocol; no worktree is
needed (Siren guards Reef's PDR-105 edits coexist on this branch untouched). **Owner controls
push — nothing pushed.**

**Landed: commit `1556b9191`** (full pre-commit gate green, 97 turbo tasks) — consolidates
the first conversions onto this branch:

- **build-metadata** WS2 exemplar: `isLessThanOrEqual` → `Result`.
- **`@oaknational/result`**: the `assertNeverResult` exhaustiveness keystone helper (WS0).
- **graph-core** `term-reconstruction.ts` → Result: 4 exhaustiveness arms via `assertNeverResult`
  (WS4) + 6 position-invalid throws via `err(...)` (WS2); `canonicalize`'s `runReconstruct`
  consumes the Result by short-circuit (try/catch removed). graph-core 26→16 warnings;
  behaviour-preserving (`canonicalize.unit.test.ts` green, 82 tests).
- Reviewed PASS by type-expert, test-expert, code-expert.
- (The retired worktree commits `7ea98b243` + `814b772c0` carried this same content, now
  superseded by `1556b9191` on this branch.)

**WS0 plan-refinement (reviewer-validated, propagates to all ~100 WS4 sites):**
`assertNeverResult(value: never, makeError: (unexpected: string) => E): Err<E>`.
It CANNOT have a standalone assertion-free runtime unit test (the repo bans `as`,
and a `never` param is only reachable by defeating types) — its correctness is the
compile-time exhaustiveness guarantee (proven by `tsc` at each use site). So it
lands **atomically with its first real WS4 consumer**, not as a standalone WS0 with
a contrived test. The factory shape (error built from the stringified unexpected
value) is required because `noUnusedParameters` forbids an unused `value` and the
no-underscore-rename rule bars `_value`. code-expert S3 carry-forward: the `default`
arms are unreachable-by-construction, so the runtime arm is untested (defensive net).

**Reconcile vs worklist (off-main, verified `pnpm lint`):** ~1000 warnings total but
distribution drifted from Vanilla's docs-branch worklist — agent-tools **213** (not
214), sentry-node **24** (not 21), no-real-io **3** (not 1), build-metadata **0**
(exemplar done). Treat worklist line numbers as guidance; re-derive per workspace.

**WS2 leaf-first order (derived from the real import DAG, acyclic):**
tier-0 leaves `env-resolution`(4), `observability`(4), `result`(1=D1 unwrap, owner
question); tier-1 `graph-core`(16 remaining), `logger`(13), `env`(3),
`design-tokens-core`(7); tier-2 `sdk-codegen`(270, mostly WS1), `sentry-node`(24),
`oak-design-tokens`(6); tier-3/4 `graph-corpus-sdk`(9), `oak-search-sdk`(37),
`curriculum-sdk`(77); tier-5 apps `streamable-http`(144), `search-cli`(162).
`agent-tools`(213) is a separate top-level tree (not in my packages/apps claim;
extend claim when reached).

**Next safe steps:** continue WS2 leaves (env-resolution / observability / env /
logger), then finish graph-core's remaining 16, up the DAG. WS1 (codegen templates)
later — see the hazard below. WS9 doctrine (ADR-088 / use-result-pattern.md /
principles.md) LAST, narrow-claim + ping Siren (`b01b303e`) before staging.

**Hazards / frictions (recorded in `.agent/plans/agent-tooling/frictions-register.md`
F-70–F-74):** F-74 is load-bearing for WS1 — a full `pnpm build` in a fresh worktree
**fetches live upstream OpenAPI schema** and dirties generated SDK files (belongs to
the `fix/align_with_upstream_api_spec` lane). Excluded by explicit pathspec on every
commit; for WS1 (which regenerates codegen) this non-determinism must be resolved
first or upstream drift will contaminate the migration. F-70/71/72/73 are
collaboration-CLI ergonomics.

## Siren mends Rudder session progress (2026-06-19)

Received Merlin's natural-boundary handoff (no PDR-063 record — thread record + `1556b9191`
were the complete handoff). Landed **3 conversions, all full-gate-green + reviewed**:

- **`93beffcfe`** — observability `redactText` (`primitives.ts`). The throw was a
  type-narrowing artifact (`redactTelemetryValue` typed `JsonValue→JsonValue` but its string
  branch always returns string). Fixed by adding a type-sound `string→string` **overload** to
  `redactTelemetryValue` (`redaction.ts`); the guard became provably dead and was removed. No
  `Result`, no cascade. code-expert + type-expert PASS.
- **`304b68f8d`** — graph-core `jsonld/runtime.ts` `noRemoteDocumentLoader` → `Promise.reject`.
  **Owner ruling on the vendor-callback class** (see below). code-expert + type-expert PASS.
- **`61bdbc3e4`** — logger `unified-logger.ts` `redactStringValue`: same narrowing pattern as
  `redactText`, removed using the **same `redactTelemetryValue` overload** from `93beffcfe`
  (one type-strengthening fix unlocked two call sites). code-expert PASS.

**OWNER RULING — vendor-callback-required-throw class (load-bearing for WS9 / ADR-088):**
*"We can't ever control how third parties handle errors, and we should not try. Either wrap our
call to the vendor appropriately, or — if we don't need the callback — simplify by deleting it.
Simplification beats fixing-through-added-complexity."* Applied to jsonld: the loader honours
jsonld's reject-to-refuse contract via `Promise.reject` (no `throw` statement), and our boundary
(`processor.ts` `runProcessor` try/catch → `err(processorFailure)`) already types the error as
`Result`. This is NOT gaming the rule — the error is typed at our boundary; the loader merely
speaks the vendor's protocol. **ADR-088's WS9 amendment should record this class explicitly.**

### Remaining-throw tier map (grounded execution knowledge — verified first-hand per site)

The inherited "WS2 leaves, follow the `assertNeverResult` template" framing does NOT fit the
residue. Verified by reading every site (this overturned 3 inherited labels):

- **Tier 1 — type-narrowing artifacts** (remove via type-strengthening, no `Result`, no cascade):
  `redactText` ✅, `unified-logger.ts:89` ✅, `express-middleware.ts:92` (logger — same pattern,
  needs a `sanitiseObject`/`isJsonObject` overload; **the clean NEXT cycle**).
- **Tier 2 — genuine result-return / boundary** (textbook WS2/WS3): logger `log-levels.ts:102`
  (env-value validation → `err`), `test-helpers/parse-otel-log-record.ts:59` (JSON-parse boundary).
- **Tier 3 — design-laden, each its own reviewed cycle with architecture input:**
  - graph-core `create-graph-view.ts:54/69/72/147` — a **documented infallible-or-throw
    construction contract** (module doc lines 11-17; ADR-179). Converting → `Result`-returning
    constructor cascades to every `createGraphView` consumer + rewrites the contract.
  - env `root-package-version.ts:17/27` — **D2 load-time module-init** (`export const
    ROOT_PACKAGE_VERSION` computed at import). → `Result` cascades to build-metadata +
    oak-search-cli; also an existing import-time-side-effect concern (git-sha test). Consider the
    system-change angle (drop the eager const).
  - observability `span-context.ts:85` — **WS5 rethrow** in transparent `withActiveSpan<T>` wrapper;
    converting changes the error-propagation contract for every caller.
  - logger `timing.ts:169/213` — **stateful-misuse guards** (phase-already-active / already-ended);
    converting changes the timing API contract.
  - logger `log-levels.ts:83` — invariant (default-search "can't happen"); system-change angle
    (make the default statically known).

**Per-workspace src/test split verified this session** (lint, on-branch — counts drift, re-derive):
env-resolution **0 src** / 4 test (all WS7, NOT a WS2 leaf — inherited label was wrong);
observability **1 src left** (span-context) + 2 test; env **2 src** (both module-init) + 1 test;
logger **5 src left** + test; graph-core **4 src left** (all create-graph-view) + 11 test.

**Coordination note:** WS9's 3 doctrine files + agent-tools (213) remain on the PDR-105 claim line.
PDR-105 is now COMPLETE (Drake lifts Obsidian, `563487f79` — validator now blocking); coordinate WS9
with whoever next holds that lane. **Shared-branch lesson:** a peer's transient mid-edit window can
red the full-tree gate for your commit — diagnose first-hand, surface to the lane owner, never touch
their dirty work; the window self-resolves (worked instance this session, ~15:12–15:17Z).
