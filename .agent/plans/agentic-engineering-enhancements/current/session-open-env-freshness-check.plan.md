---
name: "Session-Open Environment Freshness Check"
overview: >
  Close the FM-2 retrieval-at-need gap for the Playwright-cache-missing class
  by adding a session-open environment-freshness advisory primitive in a new
  workspace, surfacing known-stale tooling-cache state before broader gates
  fail. P1 failure-signature catalogue is deferred to a separate plan pending
  second-instance evidence or a build-vs-buy survey of runner-native error
  output.
todos:
  - id: owner-review-gate
    content: "Obtain owner review on this plan body before any implementation tranche starts."
    status: pending
  - id: tranche-a-p2-playwright-detector
    content: "Tranche A: implement P2 — a session-open environment-freshness primitive in a new workspace, with one detector (Playwright browser cache) that uses Playwright's own path-resolution API; advisory polarity; owner-required cure_class by default."
    status: pending
  - id: tranche-b-start-right-quick-integration
    content: "Tranche B: wire the env-freshness advisory CLI into start-right-quick/shared/start-right.md as a named step; explicit advisory-polarity statement; banner-bearing invocation."
    status: pending
  - id: closeout-consolidation
    content: "After implementation tranches land, consolidate learning into napkin and pending-graduations, capture any second-instance triggers for the deferred P1 plan, and propose any rule/PDR graduations the worked instances ratify."
    status: pending
isProject: false
---

# Session-Open Environment Freshness Check (FM-2 P2 Cure Plan v2)

**Last Updated**: 2026-05-23
**Status**: PLANNING — owner review required before implementation
**Collection**: `agentic-engineering-enhancements/current`
**Thread**: `agentic-engineering-enhancements`
**Owner Direction**: 2026-05-23 ~13:54Z chat: "autonomy is the goal"; correction to Director on the `owner-action-is-not-a-cure` anti-shape applied to the Playwright install routing.
**Directed Routing**: Director Scorched Tempering Kiln to Twilit Scattering Twilight at 2026-05-23T13:56:07Z: "author the FM-2 P2 cure plan ... owner-review-gated; not landing as code yet."
**Reviewer dispatch (v1)**: assumptions-expert verdict GO-WITH-CONDITIONS (5 conditions); architecture-expert-fred verdict HOLD-FOR-REWRITE (7 findings). v2 absorbs both. Reviewer-verdict events to be captured in comms at v2 surface time.

## Change Log v1 → v2

- **Scope reduction**: Tranche B (P1 — failure-signature catalogue + always-applied rule + new SKILL) split out to a separate plan. Catalogue defer-trigger named below. v2 plan covers P2-only (Playwright env-freshness primitive).
- **Workspace re-home** (Fred Finding 1): CLI lives in a new workspace, NOT in `@oaknational/agent-tools`.
- **Polarity flip** (Fred Finding 3, ADR-176): advisory polarity; three-surface treatment (script name, banner, SKILL doctrine).
- **Cure-class default reversed** (assumptions C3): `cure_class: 'owner-required'` by default; promotion to `auto-runnable` is a separate decision after one banner-cycle worked instance.
- **Detector mechanism named** (Fred Finding 7, assumptions C1): Playwright's own path-resolution API is the only mechanism; no hard-coded platform paths.
- **Schema discipline** (Fred Finding 2): JSON Schema co-located, JSON format for substrate consistency with `.agent/state/`.
- **Proposed always-applied rule deleted** (Fred Finding 5): substance lives in the SKILL only; rule graduation conditional on second-instance evidence of SKILL being skipped.
- **Coverage boundary named** (assumptions C4): session-open covers fresh-clone / cold-start cases; mid-session tool-state drift after sibling commits is explicitly out-of-scope.
- **PDR-014 relationship named** (assumptions C5): a successor PDR proposing the retrieval-at-need extension surfaces alongside Tranche A landing; the env-freshness primitive itself does not require PDR-014 amendment.
- **Claim-area non-interaction stated** (Fred Finding 6).
- **ADR-183 precondition stated** (Fred Finding 4).

## Intent

Close the **retrieval-at-need gap** for the Playwright-cache-missing failure class: knowledge of the pattern was captured in the team's archived napkin six weeks before today's worked instance but was not retrieved when the same failure mode fired again. The retrieval gap consumed ~7 minutes of team-cadence budget on classification work that captured knowledge would have collapsed to ~30 seconds.

The architectural cure is **a session-open environment-freshness advisory** that detects the known-stale tooling-cache state before broader gates fire. The advisory is the **missing autonomy primitive** for this class — per `feedback_owner_action_is_not_a_cure`, every "owner-directed X worked" observation is a symptom of a missing primitive, never a target cure.

The retrieval-at-need gap as a **class** (i.e., closing it for failure modes beyond Playwright) is deferred to a separate plan, triggered by second-instance evidence OR a build-vs-buy survey of runner-native machine-readable error output.

## Evidence Base

**Worked instance (today, 2026-05-23 12:38Z–13:46Z)**:

HEAD `86f340b5` landed clean at husky pre-commit (90 turbo tasks). `pnpm check` (108 turbo tasks) failed RED on 4 gates: `test:a11y`, `test:ui`, `test:widget:a11y`, `test:widget:ui`. All 7 failing tests in `apps/oak-curriculum-mcp-streamable-http` shared the identical verbatim error text:

```text
Error: browserType.launch: Executable doesn't exist at /Users/jim/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell
Looks like Playwright was just installed or updated.
Please run: pnpm exec playwright install
```

CI runs the cure correctly at `.github/workflows/ci.yml:72`: `pnpm exec playwright install --with-deps chromium`. CI green ≠ local green when local has not run the install since the last Playwright version bump, after a fresh clone, or after cache clear. Investigation (Ferny event `a7b00c3d`) classified the failure as Category D — environment / local-tooling. Test code is clean.

**Prior knowledge captured but not retrieved**: `.agent/memory/active/archive/napkin-2026-04-11.md` lines 515-525 named this exact failure pattern + cure six weeks ago. The capture path of PDR-014's memory-graduation pipeline worked correctly. The retrieval-at-need path did not fire.

**Owner direction at the cure moment**: 2026-05-23 ~13:54Z chat: "autonomy is the goal" + correction to Director on the `feedback_owner_action_is_not_a_cure` anti-shape. The architectural cure is a primitive that closes the gap without owner intervention.

**Reviewer substrate from v1**:

- assumptions-expert verdict (GO-WITH-CONDITIONS, 5 conditions): proportionality concerns on combined-tranche plan; detector-mechanism assumption load-bearing; auto-cure default reversed; session-open coverage boundary needs naming.

- architecture-expert-fred verdict (HOLD-FOR-REWRITE, 7 findings): boundary violation (agent-tools wrong home); schema discipline (JSON Schema required); ADR-176 violation (advisory polarity required); always-applied rule shape (delete; SKILL-only); cross-platform must be acceptance criterion not open question.

## Decision

Adopt **P2 — Session-Open Environment-Freshness Advisory** as a single primitive in a new dedicated workspace. The primitive ships with **one detector** (Playwright browser cache) at first landing. The detector surface is intentionally narrow — only the worked-instance class. Additional detectors (Node version vs `.nvmrc`, pnpm-lock drift, codegen freshness) are out-of-scope for this plan.

**Sequencing**: Tranche A (new workspace + CLI + Playwright detector + JSON Schema for cure metadata) → Tranche B (SKILL integration into `start-right-quick`). Each tranche is owner-review-gated independently.

**Deferred to separate plan** (`session-open-env-freshness-class-extension.plan.md` or similar — name TBD):

- P1 failure-signature catalogue (defer-trigger: second-instance evidence of a non-Playwright pattern with verbatim-error-signature shape, OR a build-vs-buy survey of runner-native structured error output completes).
- Red-gate-investigation SKILL formalisation (defer-trigger: same).
- Always-applied rule promotion (defer-trigger: second-instance evidence of SKILL being skipped).

## Tranche A — P2 Implementation in New Workspace

### Workspace home

A new workspace at **`packages/libs/env-freshness`** (sibling-shape to other libs; final placement subject to owner verdict — the alternative is `agent-tools-env-freshness` as a workspace sibling to `agent-tools`). The workspace is independent of `@oaknational/agent-tools` and `agent-tools` does not depend on it.

Rationale (Fred Finding 1): `@oaknational/agent-tools` hosts agent-coordination substrate (collaboration-state, commit-queue, comms-watch, identity, branch-touched-files, repo-check, claude-agent-ops). Every existing subcommand operates on `.agent/state/...` or git-index/working-tree metadata. None know about the application/test toolchain or `node_modules/`. Pushing a Playwright detector into agent-tools cross-cuts the workspace boundary and propagates application-toolchain knowledge into agent-coordination — wrong polarity.

### CLI shape (advisory polarity per ADR-176)

```bash
pnpm env-freshness:check-advisories
pnpm env-freshness:check-advisories --surface-only  # dry-run; never auto-cures
```

Every invocation prints a banner on the first line of stdout:

```text
[ADVISORY ONLY — NOT A COMMIT GATE]
```

The banner is non-optional. The script name carries the `-advisories` suffix mirroring `pnpm agent-tools:check-commit-skill-advisories` (per ADR-176 §Decision).

### Detector shape

Each detector is a small TypeScript function returning a discriminated union:

```typescript
type DetectorResult =
  | { kind: 'fresh'; detector: string }
  | { kind: 'stale'; detector: string; signature: string; cure: CureCommand; cause: string }
  | { kind: 'inapplicable'; detector: string; reason: string }
  | { kind: 'error'; detector: string; message: string };

interface CureCommand {
  shell: string;
  idempotent: boolean;
  estimated_seconds: number;
  cure_class: 'auto-runnable' | 'owner-required';
}
```

### Initial detector: `playwright-browser-cache`

**Detection mechanism (cross-platform-portable per Fred Finding 7 + assumptions C1)**:

The detector imports `@playwright/test` and queries `chromium.executablePath()` from the public API surface. `fs.existsSync(executablePath)` is the freshness check. **No hard-coded platform paths anywhere in the detector body.**

```typescript
// Sketch — exact shape pending Tranche A authoring
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

export async function detectPlaywrightBrowserCache(): Promise<DetectorResult> {
  let executablePath: string;
  try {
    executablePath = chromium.executablePath();
  } catch (cause) {
    return { kind: 'inapplicable', detector: 'playwright-browser-cache', reason: 'Playwright path-resolution unavailable' };
  }
  if (fs.existsSync(executablePath)) {
    return { kind: 'fresh', detector: 'playwright-browser-cache' };
  }
  return {
    kind: 'stale',
    detector: 'playwright-browser-cache',
    signature: `Playwright chromium binary missing at ${path.dirname(executablePath)}/`,
    cure: {
      shell: 'pnpm exec playwright install --with-deps chromium',
      idempotent: true,
      estimated_seconds: 60,
      cure_class: 'owner-required',  // see "Cure-class default" below
    },
    cause: 'Playwright browser binary missing or stale relative to @playwright/test package version',
  };
}
```

Cross-platform behaviour: `chromium.executablePath()` returns the platform-appropriate path on macOS, Linux, and Windows; the detector body has no platform conditionals. Test surface covers at least macOS and Linux (CI exercises Linux); Windows asserts the path-resolution call succeeds without asserting platform-specific path shape.

### Cure-class default — `owner-required` (banner shape)

Per assumptions C3: the detector ships with `cure_class: 'owner-required'` and the CLI prints the cure command in a banner-bearing format. The cure is **not** auto-executed at first landing.

```text
[ADVISORY ONLY — NOT A COMMIT GATE]
[STALE] playwright-browser-cache: Playwright chromium binary missing
   cause: Playwright browser binary missing or stale relative to @playwright/test package version
   cure (~60s, idempotent):
     pnpm exec playwright install --with-deps chromium
```

Rationale: the banner is the missing autonomy primitive (retrieval-at-need); auto-execution is a follow-on optimisation that requires one worked-instance cycle of banner → manual cure to validate the cure does not produce unexpected side-effects in this team's environment. Promotion to `auto-runnable` is a separate decision after that evidence accumulates.

The `--surface-only` flag is preserved for explicit dry-run semantics even when `cure_class` later promotes to `auto-runnable`.

### Cure metadata schema (Fred Finding 2)

Cure metadata is currently inlined in the detector code (TypeScript). When P1 (catalogue) lands in the deferred plan, the metadata externalises into a schema-validated structure. For Tranche A's narrower scope (one detector, in-code metadata), the schema requirement is satisfied by the TypeScript `CureCommand` interface — which IS the schema, statically verified per `schema-first-execution.md`.

If a JSON Schema substrate is desired for early extensibility (Fred Finding 2 cross-references the comms-event pattern), it co-locates at `packages/libs/env-freshness/src/cure-command.schema.json` with the matching `z.infer<typeof cureCommandSchema>` Zod surface. v2 names this as a Tranche A reviewer decision: in-code interface alone, or co-located JSON Schema. Default: in-code interface alone, defer JSON Schema until the deferred P1 plan triggers.

### Test surface

```typescript
// Asserts (sketch)
- playwright-browser-cache returns 'stale' when chromium.executablePath() exists in path-resolution but the file is absent
- playwright-browser-cache returns 'fresh' when the file exists at the resolved path
- playwright-browser-cache returns 'inapplicable' when chromium.executablePath() throws (e.g. @playwright/test not in node_modules)
- --surface-only flag suppresses auto-cure (when cure_class later promotes to auto-runnable)
- CLI prints the [ADVISORY ONLY — NOT A COMMIT GATE] banner on every invocation
```

## Tranche B — `start-right-quick` SKILL Integration

### Scope

Add a named step to `start-right-quick/shared/start-right.md` before the live-state read:

```text
### 1a. Environment Freshness Advisory (FM-2 cure)

Run `pnpm env-freshness:check-advisories` before substantive work. The
advisory CLI runs the registered detectors; each prints a banner-bearing
classification on stdout.

This is an **advisory** surface (ADR-176): a reporting surface, not an
enforcing one. Stale verdicts surface a cure command for owner action (or
auto-cure on explicit cure_class promotion). The advisory does not block any
git operation.

Skipping the advisory is allowed but is the failure mode this primitive
exists to prevent — the worked instance the advisory addresses lost
~7 minutes of team-cadence budget that the advisory would have collapsed
to ~30 seconds at session-open.
```

The SKILL amendment is the only doctrine change in Tranche B. **No new always-applied rule.** Per Fred Finding 5, the substance lives in the SKILL only; rule graduation is conditional on second-instance evidence of the SKILL being skipped.

### Coverage boundary (assumptions C4)

The SKILL amendment names what the advisory covers and what it does not:

- **Covers**: fresh-clone / cold-start / post-Playwright-bump sessions — i.e., the cache is stale at session-start.
- **Does not cover**: mid-session tool-state drift (e.g., a sibling agent commits a Playwright version bump during the session window). That coverage is a follow-on tranche, deferred until second-instance evidence.

## Composition With Existing Surfaces

- **`start-right-quick/shared/start-right.md`** — the env-freshness step inserts between identity preflight and the live-state read. Composition is additive; no existing step changes.
- **`start-right-team/SKILL-CANONICAL.md` §0 (all-channels comms watcher)** — independent surface; env-freshness does not depend on or block the comms watcher.
- **`start-right-team/SKILL-CANONICAL.md` §1a (gate-runner election)** — independent; env-freshness fires at session-open, before any gate-state report consideration.
- **`@oaknational/agent-tools`** — explicitly NOT the workspace home (Fred Finding 1). `agent-tools` and `env-freshness` are siblings; neither depends on the other.
- **`register-active-areas-at-session-open` rule** — no interaction. The advisory at most writes to host browser cache (`~/Library/Caches/ms-playwright/` or platform equivalent), never to the repo working tree, never to `node_modules/`, never to git-index. The `kind` enum of the active-claims schema (`files | workspace | plan | adr | git`) does not cover host cache directories; no claim required.
- **`@oaknational/agent-tools` commit-queue** — no interaction. Env-freshness runs at session-open, well before any commit-cycle work.
- **PDR-014 (memory-graduation pipeline)** — the env-freshness primitive does not amend PDR-014; capture/distil/graduate/enforce remains intact. A successor PDR proposing the retrieval-at-need extension (i.e., the broader class P1 addresses) is named below as a follow-on alongside the deferred P1 plan.
- **PDR-066 (comms-events as failure-mode channel)** — when the advisory surfaces stale at session-open, the agent MAY emit a tagged behaviour-note comms event for team-substrate visibility. Not required; the banner is the primary surface.
- **ADR-176 (advisory orchestrator naming)** — explicitly applied: `-advisories` script suffix, banner-bearing invocation, SKILL-doctrine polarity statement.
- **ADR-183 (comms-event tag namespace substrate)** — both ADR-183 tranches are already landed (`c4bacfc5` schema + `03da8e3d` watcher rendering). Tagged comms-event writes from the advisory (if any) use the existing `behaviour-note` namespace; no namespace amendment proposed.
- **`feedback_owner_action_is_not_a_cure`** — the advisory IS the missing autonomy primitive for this class. Owner intervention to type the cure command is replaced by either (a) the banner naming the cure (Tranche A) or (b) auto-execution (post-promotion). Owner-action remains a valid stopgap; the advisory removes the gap from being load-bearing.

## Falsifiability

The plan succeeds if:

1. A future session encounters the same Playwright-cache-missing pattern. The advisory surfaces the stale verdict at session-open, BEFORE any red gate fires. Red-gate-to-cure latency measured: this session ~7 minutes; target post-landing < 60 seconds (advisory run time + cure run time).
2. The detector does not false-positive on common workstation states: Apple Silicon vs Intel, fresh clone, warm cache, `node_modules` present vs absent post-install. Tranche A's tests assert this.
3. The advisory's banner is consistently observable to both the running agent and the chat-watching owner.

The plan fails if:

1. The detector produces noise (false stale verdicts). Cure: tighten the API-call wrapper; add an `inapplicable` return path for environments the detector cannot reason about (Playwright not installed; weird symlink state).
2. The `chromium.executablePath()` API surface changes or is removed in a future Playwright release. Cure: pin to a documented API; if Playwright's public API churn rate becomes a real cost, surface for a re-route via Playwright's reporter API instead.
3. The advisory's banner is missed (e.g. agent stdout-handling drops the first line). Cure: assert banner presence in CLI test; SKILL amendment names "banner must be observable" as a precondition.
4. Owner / Director chooses to keep cure-class default at `owner-required` indefinitely (the banner-cycle-promotion-to-auto-runnable never fires). Acceptable; the primitive still closes the retrieval-at-need gap at the banner level.

## Out-of-Scope

- **FM-1 — husky-vs-broader-gate scope divergence**. A separate decision shape (Ferny's C1 unify vs C2 declare-scope-as-first-class). Accepted as the current structural fact; this plan works within it.
- **P1 failure-signature catalogue + always-applied rule + red-gate-investigation SKILL formalisation**. Deferred to a separate plan, triggered by second-instance evidence of a non-Playwright pattern OR a build-vs-buy survey of runner-native structured error output.
- **Memory-graduation pipeline amendments to PDR-014**. The capture path worked correctly; the retrieval path is what this plan addresses. A successor PDR proposing the retrieval-at-need extension may surface separately if the deferred P1 plan lands.
- **Generalised tool-cache detectors beyond Playwright** (Node version, pnpm-lock drift, codegen freshness). Out-of-scope; named for future tranches.
- **Husky pre-commit hook scope changes**. Independent of this plan.
- **Mid-session tool-state drift coverage** (sibling-commit-during-session timeline). Deferred to a follow-on tranche.

## Rollback Plan

Each tranche is independently rollbackable:

- **Tranche A**: delete the new workspace. No other repo surface depends on it.
- **Tranche B**: revert the `start-right-quick` amendment.

If Tranche A's detector fires false positives in production and an immediate disable is needed: the SKILL amendment in Tranche B can be soft-disabled by replacing the step body with a "skip — see issue #N" notice, in a single edit. Full removal follows the rollback above.

## Open Questions

1. **Workspace name + path**: `packages/libs/env-freshness` vs `agent-tools-env-freshness` (sibling-to-agent-tools convention). Tranche A reviewer to confirm.
2. **JSON Schema for cure metadata**: in-code TypeScript interface alone (current default, narrower scope) vs co-located JSON Schema (extensibility upfront). Tranche A reviewer to confirm.
3. **Detector cost budget at session-open**. The Playwright detector is fast (one API call + one `fs.existsSync`). Future detectors may need budget discipline. Out of scope for this plan.
4. **Promotion criteria for `cure_class: 'owner-required'` → `'auto-runnable'`**. Default: after one banner-cycle worked instance with no unexpected side-effects, surface a promotion proposal. Surface for Wilma (adversarial-resilience) review per assumptions-expert recommendation.
5. **Successor PDR for retrieval-at-need extension to PDR-014**. Deferred — surfaces alongside the deferred P1 plan if pattern #2 fires.

## Authorisation Chain

- Owner direction (~13:54Z chat): "autonomy is the goal"; correction to Director on the `owner-action-is-not-a-cure` anti-shape.
- Director Scorched routing (13:56:07Z directed event): author FM-2 P2 plan; P1 and/or P2; owner-review-gated.
- Ferny Fruiting Root substrate event 13:50:09Z (`9c240ce5`) — FM-1/FM-2/BN-1 three-part broadcast.
- Ferny Fruiting Root verdict event 13:44:39Z (`a7b00c3d`) — classification D + recommended routing.
- Scorched tick #1 (13:48:43Z, `70a9e2cb`) — P2 substrate-event capture request + architectural cure framing.
- v1 → v2 reviewer dispatch: assumptions-expert (GO-WITH-CONDITIONS) + architecture-expert-fred (HOLD-FOR-REWRITE). Both verdicts absorbed.

## Validation Plan

- v2 surfaces to Director Scorched for routing verdict.
- If Director routes for owner review, surfacing to owner with the change-log + reviewer-verdict summary.
- Implementation gate: Tranche A starts only on explicit owner direction. Tranche B follows Tranche A's successful landing.
- Optional adversarial-resilience review (Wilma) recommended by assumptions-expert before Tranche A lands, focused on auto-cure promotion criteria.

## Identity

Authored by Twilit Scattering Twilight / claude / claude-opus-4-7 / 8d8d93 (PDR-027 identity tuple).
