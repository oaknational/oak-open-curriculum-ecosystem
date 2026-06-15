---
name: "Statusline logo modularisation and soft-surface hardening"
overview: "Separate statusline setup / generic logo mechanism / Oak acorn asset into clean reusable layers, and close the untyped-shim and soft-fail-guarantee standards gaps in the agent tooling."
todos:
  - id: ws1-cycle-1
    content: "WS1.1: resolveLogoStyle generic (LogoAsset/ResolvedLogo/LogoSelection types) and unit test over a fixture asset. One commit. Tree green."
    status: pending
    depends_on: []
  - id: ws1-cycle-2
    content: "WS1.2: composeLogoColumn and resolveLogo (paint, gap, bare-mark, none→undefined) and unit test. One commit. Tree green."
    status: pending
    depends_on: [ws1-cycle-1]
  - id: ws1-cycle-3
    content: "WS1.3: generic width-uniformity invariant assertion and unit test (mismatched-width rows rejected). One commit. Tree green."
    status: pending
    depends_on: [ws1-cycle-1]
  - id: ws1-cycle-4
    content: "WS1.4: relocate ANSI vocabulary to neutral statusline/ansi.ts under green; repoint claude importers. One commit. Tree green."
    status: pending
    depends_on: []
  - id: ws2-cycle-1
    content: "WS2.1: OAK_ACORN LogoAsset in neutral statusline/oak-acorn.ts (data and colour and default and provenance); migrate oak-logo tests. One commit. Tree green."
    status: pending
    depends_on: [ws1-cycle-1, ws1-cycle-3, ws1-cycle-4]
  - id: ws3-cycle-1
    content: "WS3.1: resolveAdapterPath pure launcher and unit test (env precedence, fallback). One commit. Tree green."
    status: pending
    depends_on: []
  - id: ws3-cycle-2
    content: "WS3.2: adapter genuine soft-fail (catch-all → exit 0, empty output) and integration test feeding stdin that exercises render. One commit. Tree green."
    status: pending
    depends_on: []
  - id: ws3-cycle-3
    content: "WS3.3: reduce .mjs shim to zero-logic bootstrap delegating to built adapter; fix stale shim TSDoc; e2e test runs the shim end-to-end. One commit. Tree green."
    status: pending
    depends_on: [ws3-cycle-1, ws3-cycle-2]
  - id: ws4-cycle-1
    content: "WS4.1: renderer consumes composeLogoColumn and ResolvedLogo; remove by-name OAK_LOGO_ROWS import and the GREEN-in-composer; update render tests. One commit. Tree green."
    status: pending
    depends_on: [ws1-cycle-2, ws1-cycle-4]
  - id: ws4-cycle-2
    content: "WS4.2: adapter wires the acorn at the composition root (resolveLogoStyle(OAK_ACORN, env) → ResolvedLogo injected into render). One commit. Tree green."
    status: pending
    depends_on: [ws2-cycle-1, ws4-cycle-1, ws3-cycle-2]
  - id: ws5-doc-propagation
    content: "WS5: TSDoc on every moved/new module, research-doc home pointer, ADR note on the three-layer cut. Lands with the cycles it documents; integrative sweep here."
    status: pending
    depends_on: [ws4-cycle-2]
  - id: ws6-quality-gates-final
    content: "WS6: full `pnpm check` on the integrated delivery."
    status: pending
    depends_on: [ws5-doc-propagation]
  - id: ws7-adversarial-review
    content: "WS7: architecture-expert-fred/barney, type-expert, test-expert, code-expert, docs-adr-expert. Document findings."
    status: pending
    depends_on: [ws6-quality-gates-final]
  - id: ws8-consolidation
    content: "WS8: /oak-consolidate-docs — graduate settled patterns, rotate napkin, update plan lifecycle."
    status: pending
    depends_on: [ws7-adversarial-review]
isProject: false
---

# Statusline logo modularisation and soft-surface hardening

**Last Updated**: 2026-06-15
**Status**: 🟡 PLANNING (queued — `current/`, not started)
**Scope**: Separate the Claude statusline into three clean layers — statusline setup, a generic reusable logo-column mechanism, and the Oak acorn brand asset as pure data — and remove the standards-loosening in the agent tooling that supports it.

---

## Additional User Request

Add one blank line under the statusline content.

## Context

The Claude Code statusline renders a four-row block: the Oak acorn mark as a
left logo-column with identity / model / context / git segments to its right.
A read-only design review (this session) established the target separation of
concerns and measured the gap. This plan executes that separation and closes
the standards gaps the review surfaced.

### Problem Statement

The current code conflates three concerns that should be cleanly separable, and
the supporting tooling carries two real standards gaps:

1. **The generic renderer reaches out to the concrete brand asset by name.**
   `agent-tools/src/claude/statusline-render.ts:27` imports `OAK_LOGO_ROWS`
   directly and indexes `OAK_LOGO_ROWS[logo]` at line 127. The mechanism depends
   on the asset instead of receiving it as data.
2. **The brand colour lives in the mechanism, not the asset.**
   `composeWithLogo` hardcodes `${GREEN}${logoRow}${RESET}`
   (`statusline-render.ts:167`). Green is a property of the Oak acorn (brand
   data), sitting inside the generic composer.
3. **There is no reusable logo mechanism.** The logo-column composition is
   welded into the statusline renderer; no harness or brand other than this one
   can reuse it. (Factual note after review, 2026-06-15: the *current* Cursor
   statusline shim `.cursor/scripts/statusline-identity.mjs` `spawn`s the whole
   Claude adapter and so inherits the logo for free — it is not yet an *importer*
   of the mechanism. That is a fact about today's shim, not a verdict on the
   work.) The extraction is **deliberate creation of reusable capability** for
   consumers the owner has in mind (other harnesses that import rather than spawn;
   other brand marks) — this is innovation, not speculation. It also removes two
   real couplings that exist today: the renderer imports the concrete asset by
   name, and the brand colour lives in the mechanism; and it confines "this repo
   uses the acorn" to one composition root.
4. **Standards-loosening — untyped/untested shim island.** `.claude/scripts/statusline-identity.mjs`
   is hand-written JavaScript with real logic (env-precedence resolution, path
   arithmetic, spawn, exit-code propagation) living outside any lint /
   type-check / test gate. The `agent-tools` eslint config covers only
   `agent-tools/**`; the `.mjs` is gated by nothing.
5. **Standards-loosening — the soft-surface guarantee is incompletely
   implemented.** The shim swallows a missing artefact and a spawn error, but on
   an adapter *runtime* exception the child exits non-zero and the shim
   propagates `code ?? 0` — i.e. the non-zero code
   (`.claude/scripts/statusline-identity.mjs:39-41`). `emitStatusline` in the
   adapter is not wrapped, so a render-time throw is **not** soft-failed despite
   the documented "soft surface" contract.
6. **Documentation drift.** The shim's TSDoc claims it "prints the deterministic
   agent-identity display name" (`statusline-identity.mjs:6-9`); the adapter now
   renders a full four-row statusline.

### Existing Capabilities (build on, do not duplicate)

- Pure renderer already split from I/O: `statusline-render.ts` (pure) vs
  `statusline-identity.ts` (adapter). Strong; preserved.
- Logo data already isolated in `oak-logo.ts` (`OAK_LOGO_ROWS`,
  `resolveLogoStyle`, `OakLogoStyle`).
- ANSI palette already extracted to `statusline-ansi.ts`.
- Tests exist: `tests/claude/oak-logo.test.ts`,
  `tests/claude/statusline-render.test.ts`,
  `tests/claude/statusline-render-session-shape.test.ts`,
  `tests/claude/statusline-session-shape.test.ts`,
  `tests/claude/statusline-identity-input.test.ts`.
- `agent-tools` is the shared home consumed by every harness shim (Claude,
  Cursor), so the neutral modules need no new package — a neutral directory in
  this workspace is the shared home.
- The TypeScript core is clean: no `eslint-disable`, `ts-expect-error`, `any`,
  or skipped tests in `src/claude/`.

---

## Target Architecture

Three layers, dependencies inverted onto a small contract; the single
"this repo uses the Oak acorn" line lives once, at the composition root.

| Layer | Concern | New home | Knows | Must NOT know |
|-------|---------|----------|-------|---------------|
| **A — Statusline setup** | I/O, soft-fail, segment gather/format, two-line-vs-logo layout, wiring | `agent-tools/src/claude/statusline-*.ts` (stays) | "there is a logo slot" | what the logo *is* |
| **B — Logo mechanism** | `LogoAsset`/`ResolvedLogo` contract, style resolution, column composition, width invariant | `agent-tools/src/statusline/logo-column.ts` (NEW, neutral) | the *shape* of a logo | acorn, green, Oak, Claude |
| **C — Oak acorn asset** | glyph rows per style, brand colour, default style, SVG provenance | `agent-tools/src/statusline/oak-acorn.ts` (NEW, neutral) | it is pure data | that statusline surfaces exist |

Shared neutral ANSI vocabulary moves to `agent-tools/src/statusline/ansi.ts`
(today's `claude/statusline-ansi.ts`) so the asset declares its colour from a
named constant without a harness→neutral or neutral→harness import inversion.

Contract sketch (Layer B):

```typescript
/** An ANSI SGR escape sequence (e.g. the green foreground). */
export type AnsiColor = string;

/** A multi-row glyph logo: named style variants, a default, and a brand colour. */
export interface LogoAsset<Style extends string> {
  readonly styles: Readonly<Record<Style, readonly string[]>>;
  readonly defaultStyle: Style;
  readonly color: AnsiColor;
}

/** A logo resolved to the concrete rows and colour to paint. */
export interface ResolvedLogo {
  readonly rows: readonly string[];
  readonly color: AnsiColor;
}

/** Closed selection: a known style, or 'none' to suppress the column. */
export type LogoSelection<Style extends string> = Style | 'none';

export function resolveLogoStyle<Style extends string>(
  asset: LogoAsset<Style>, raw: string | undefined,
): LogoSelection<Style>;            // validate raw vs keys and 'none'; fallback defaultStyle

export function resolveLogo<Style extends string>(
  asset: LogoAsset<Style>, selection: LogoSelection<Style>,
): ResolvedLogo | undefined;        // undefined when 'none'

export function composeLogoColumn(
  logo: ResolvedLogo, rowTexts: readonly string[], options?: { readonly gap?: string },
): string;                          // painted left column, text to the right
```

`LogoSelection<Style>` is a closed union derived from the asset's own keys — no
raw-string leakage past the boundary (closed-shape-design rule).

---

## Design Principles

1. **Inject the asset; never import it by name into the mechanism.** Layer B and
   the renderer take a `ResolvedLogo`; only the composition root names the acorn.
2. **The asset owns its brand facts.** Colour and default style travel with the
   acorn, not the composer.
3. **Create reusable capability for the consumers in mind.** Extract the logo
   mechanism and asset (harness- and brand-agnostic) as deliberate creation for
   intended consumers (other harnesses that import rather than spawn; other brand
   marks) — innovation, not speculation. It also removes real coupling that exists
   today and confines brand knowledge to one composition root. The statusline
   renderer is **out of scope for this plan** only because its segment/icon
   content is the sibling session-state plan's territory (which is actively
   editing it) — a scope boundary, not a YAGNI judgment.
4. **The soft surface must be a tested guarantee, not an accident of spawn.**
   Soft-fail belongs in the adapter and is proven by test.
5. **Agent tooling is held to the same bar as product code.** Launch logic moves
   into the typed, tested workspace; the shim carries no logic to gate.
6. **Refactor under green.** Every move keeps the existing suite green; behaviour
   change only where the plan names it.

**Non-Goals** (YAGNI):

- Not relocating `statusline-render.ts`, `statusline-indicators.ts`, or
  `statusline-session-shape.ts` to a neutral home (single consumer; defer to the
  Cursor-statusline plan when it lands).
- Not unifying the terminal acorn with the web brand assets
  (`apps/oak-curriculum-mcp-streamable-http/src/server-branding.ts`,
  `apps/oak-curriculum-mcp-streamable-http/widget/src/BrandBanner.tsx`) —
  different render targets, out of scope.
- Not adding new logo styles or changing the acorn glyphs.
- Not changing the `OAK_STATUSLINE_LOGO` env-var contract or its default.
- Not migrating the Cursor shim in this plan (it consumes the neutral modules
  once they exist; that adoption is its own plan).

---

## Build-vs-Buy Attestation

Not applicable — purely internal refactor of first-party agent tooling; no
third-party vendor integrated.

---

## Lifecycle Triggers

> See [Lifecycle Triggers component](../../templates/components/lifecycle-triggers.md)

Work shape: **executable repo plan** (multi-cycle, multi-file refactor with a
behaviour-bearing soft-fail change). Touch points: start-right-quick at session
open; active-claim on `agent-tools/src/claude/**` and the new
`agent-tools/src/statusline/**` and `.claude/scripts/statusline-identity.mjs`;
session-handoff if multi-session; consolidation at completion (WS8).

---

## Cycle Dependencies and Parallelisation

> See [TDD Cycles component](../../templates/components/tdd-phases.md)

Two independent tracks converge at WS4:

- **Track A (WS1 and WS2)** — neutral logo mechanism, ANSI relocation, acorn asset.
  Touches only new `agent-tools/src/statusline/**` files plus a one-line import
  repoint of two claude files (WS1.4).
- **Track B (WS3)** — standards hardening: pure launcher, adapter soft-fail,
  zero-logic shim. Touches `agent-tools/src/claude/statusline-launch.ts` (NEW),
  the adapter, the `.mjs` shim, and new tests.

Tracks A and B share no product files until **WS4** (wiring), which depends on
both. WS1.1/WS1.4/WS3.1/WS3.2 carry `depends_on: []` and are ready to dispatch
to parallel agents from branch HEAD.

---

## Reviewer Scheduling

- **Plan-phase (pre-execution)**: `assumptions-expert` — proportionality of the
  neutral-extraction vs YAGNI, blocking legitimacy of the track ordering.
- **Mid-cycle**: `type-expert` after WS1.1 (generic contract) and WS4.1 (removal
  of by-name import); `test-expert` after each RED/GREEN; `architecture-expert-fred`
  after WS2.1/WS4.2 (boundary direction, dependency inversion); `code-expert` as
  gateway after WS3.2 (soft-fail correctness) and WS4.2.
- **Close**: `docs-adr-expert` (drift, the three-layer cut); `onboarding-expert`
  only if the moved modules sit on a documented onboarding path (likely N/A).

---

## WS1 — Generic logo-column mechanism (neutral)

New `agent-tools/src/statusline/logo-column.ts` and `agent-tools/src/statusline/ansi.ts`.
Brand- and harness-agnostic. No existing consumer changes except a one-line
import repoint (1.4).

### Cycle 1.1: Generic style resolution and contract types

**Parallel-safety**: parallel-safe (new files).
**Starting state**: branch HEAD.
**File scope**: `agent-tools/src/statusline/logo-column.ts` (NEW),
`agent-tools/tests/statusline/logo-column.unit.test.ts` (NEW).
**File scope NOT to touch**: any `claude/**`, `oak-acorn.ts`.

**Test (Red)**: over a tiny fixture `LogoAsset` with styles `{a, b}` and
`defaultStyle: 'a'`: `resolveLogoStyle(asset, 'b') === 'b'`;
`resolveLogoStyle(asset, 'none') === 'none'`;
`resolveLogoStyle(asset, undefined) === 'a'`;
`resolveLogoStyle(asset, 'zzz') === 'a'`.

**Product code (Green)**: `AnsiColor`, `LogoAsset`, `ResolvedLogo`,
`LogoSelection` types and `resolveLogoStyle` generic.

**Acceptance**: AC-1. Test passes; tree green (`pnpm test` exit 0, no skips).
**Reviewer dispatch**: `type-expert`, `test-expert`.

### Cycle 1.2: Column composition and logo resolution

**Parallel-safety**: sequenced after 1.1 (same file).
**File scope**: `logo-column.ts`, `logo-column.unit.test.ts`.

**Test (Red)**: `composeLogoColumn({rows, color}, rowTexts)` paints each row
`color and row and RESET`; appends `gap and text` only when that row has text; renders
a bare painted mark when the row text is empty; honours a custom `gap`.
`resolveLogo(asset, 'none')` returns `undefined`; `resolveLogo(asset, 'a')`
returns `{rows: asset.styles.a, color: asset.color}`.

**Product code (Green)**: `composeLogoColumn` and `resolveLogo`. `RESET` sourced
from neutral `ansi.ts` (created in 1.4; if 1.4 not yet landed, this cycle is
sequenced after it instead).

**Acceptance**: AC-2. Tests pass; tree green.
**Reviewer dispatch**: `test-expert`.

### Cycle 1.3: Width-uniformity invariant

**Parallel-safety**: sequenced after 1.1.
**File scope**: `logo-column.ts`, `logo-column.unit.test.ts`.

**Test (Red)**: an `assertUniformWidth(rows)` helper counts **code points**
(`[...row].length`, not UTF-16 units — sextant glyphs are astral) and throws on a
width mismatch; passes for uniform rows.

**Product code (Green)**: `assertUniformWidth` exported from `logo-column.ts`.

**Acceptance**: AC-3. Tests pass; tree green.
**Reviewer dispatch**: `test-expert`.

### Cycle 1.4: Relocate ANSI vocabulary to the neutral home

**Parallel-safety**: parallel-safe with 1.1 (different file); precedes 1.2 and
WS2/WS4 use of neutral colours.
**File scope**: `agent-tools/src/statusline/ansi.ts` (NEW, moved content),
`agent-tools/src/claude/statusline-ansi.ts` (DELETED),
`agent-tools/src/claude/statusline-render.ts` (import path only),
`agent-tools/src/claude/statusline-indicators.ts` (import path only).
**File scope NOT to touch**: logic in render/indicators (imports only).

**Refactor under green**: move the palette verbatim; repoint the two importers;
delete the old file (clean break, no re-export stub). Existing render/indicator
tests are the safety net.

**Acceptance**: AC-4. `pnpm test` exit 0; `rg "claude/statusline-ansi"
agent-tools` returns nothing; no re-export shim remains.
**Reviewer dispatch**: `architecture-expert-fred` (import direction).

---

## WS2 — Oak acorn as pure data (neutral)

### Cycle 2.1: `OAK_ACORN` LogoAsset

**Parallel-safety**: sequenced after 1.1, 1.3, 1.4.
**Starting state**: after WS1 lands.
**File scope**: `agent-tools/src/statusline/oak-acorn.ts` (NEW),
`agent-tools/tests/statusline/oak-acorn.unit.test.ts` (NEW; migrated from
`tests/claude/oak-logo.test.ts`), `agent-tools/src/claude/oak-logo.ts` (DELETED
once no consumer remains — deletion may defer to WS4.1/4.2 when the renderer and
adapter stop importing it).
**File scope NOT to touch**: `logo-column.ts`.

**Test (Red)**: `OAK_ACORN.styles` has the four styles, each four rows;
`assertUniformWidth` passes for every style; `OAK_ACORN.defaultStyle ===
'braille-sharp'`; `OAK_ACORN.color === GREEN`.

**Product code (Green)**: `OakAcornStyle` type and `OAK_ACORN: LogoAsset<OakAcornStyle>`
holding the verified glyph rows (moved from `OAK_LOGO_ROWS`), `color: GREEN`
(from neutral `ansi.ts`), `defaultStyle: 'braille-sharp'`. Carry the SVG /
regeneration provenance TSDoc across verbatim.

**Acceptance**: AC-5. Tests pass; tree green. Glyph rows byte-identical to the
prior `OAK_LOGO_ROWS` (diff the string literals).
**Reviewer dispatch**: `architecture-expert-fred`, `test-expert`.

---

## WS3 — Soft-surface hardening (standards-loosening removal)

### Cycle 3.1: Pure adapter-path launcher

**Parallel-safety**: parallel-safe (new file).
**Starting state**: branch HEAD.
**File scope**: `agent-tools/src/claude/statusline-launch.ts` (NEW),
`agent-tools/tests/claude/statusline-launch.unit.test.ts` (NEW).

**Test (Red)**: `resolveAdapterPath(env, scriptUrl)` prefers
`env.CLAUDE_PROJECT_DIR` when set; falls back to the script-relative repo-root
arithmetic when unset; returns the `agent-tools/dist/...statusline-identity.js`
path. Pure — environment passed as an explicit arg (no `process.env` read in the
function; tests touch no global state).

**Product code (Green)**: `resolveAdapterPath` in `statusline-launch.ts`.

**Acceptance**: AC-6. Tests pass; tree green; `resolveAdapterPath` reads no
global.
**Reviewer dispatch**: `test-expert`, `type-expert`.

### Cycle 3.2: Adapter genuine soft-fail

**Parallel-safety**: parallel-safe with WS1/WS2/3.1; touches the adapter only.
**File scope**: `agent-tools/src/claude/statusline-identity.ts`,
`agent-tools/tests/claude/statusline-identity.integration.test.ts` (NEW).

**Test (Red)**: piping a stdin payload that drives the full render path produces
a four-row statusline on stdout AND exit 0; an input that makes `emitStatusline`
throw still yields exit 0 with empty/partial output (no uncaught exception). Run
against the adapter's exported emit entry, not a spawned process, so it is a true
integration test with explicit inputs.

**Product code (Green)**: wrap the emit path so any throw soft-fails to exit 0
with no disruptive output (e.g. try/catch around `emitStatusline` plus a
top-level `uncaughtException`/`unhandledRejection` → exit 0 guard). The soft
surface becomes a property of the adapter, independent of how it is launched.

**Acceptance**: AC-7. Both tests pass; tree green; a forced render throw exits 0.
**Reviewer dispatch**: `code-expert`, `test-expert`.

### Cycle 3.3: Zero-logic shim and drift fix

**Parallel-safety**: sequenced after 3.1, 3.2.
**File scope**: `.claude/scripts/statusline-identity.mjs`,
`agent-tools/e2e-tests/statusline-shim.e2e.test.ts` (NEW; or `tests/` if no node
spawn boundary is needed).

**Test (Red)**: running `node .claude/scripts/statusline-identity.mjs` with a
sample Claude stdin JSON prints a non-empty four-row statusline and exits 0;
running it with the dist artefact absent (simulated) exits 0 with empty stdout.

**Product code (Green)**: reduce the shim to a bootstrap that delegates to the
built, tested adapter via a fixed script-relative URL and soft-fails on any
import/runtime error — no env arithmetic, no spawn-code propagation in the shim:

```javascript
#!/usr/bin/env node
/**
 * Claude Code statusline bootstrap.
 *
 * Zero-logic delegation to the built, typed, tested statusline adapter at
 * agent-tools/dist/src/claude/statusline-identity.js. All launch and render
 * logic — and the soft-fail guarantee — live there. Any failure here (artefact
 * absent, import or runtime error) exits 0 silently so the statusline never
 * disrupts the session.
 */
try {
  await import(
    new URL('../../agent-tools/dist/src/claude/statusline-identity.js', import.meta.url)
  );
} catch {
  process.exit(0);
}
```

The stale "prints the deterministic agent-identity display name" TSDoc is
replaced. `resolveAdapterPath` (3.1) remains the typed/tested home for any
path resolution the adapter itself needs; if the final shim needs no path
logic, 3.1 covers the adapter's internal resolution and the shim stays
logic-free.

**Acceptance**: AC-8. e2e passes; tree green; the shim contains no env/path/spawn
logic (review and `rg` for `CLAUDE_PROJECT_DIR|spawn|resolve\\(` in the shim
returns nothing).
**Reviewer dispatch**: `code-expert`, `docs-adr-expert`.

---

## WS4 — Wiring (the inversion)

### Cycle 4.1: Renderer consumes the contract, not the asset

**Parallel-safety**: sequenced after 1.2, 1.4.
**File scope**: `agent-tools/src/claude/statusline-render.ts`,
`agent-tools/tests/claude/statusline-render.test.ts`.

**Test (Red)**: `renderStatusline(parts, { logo: <ResolvedLogo> })` paints the
mark in the logo's own colour via `composeLogoColumn`; `{ logo: undefined }` (or
absent) renders the two-line layout. No assertion references `OAK_LOGO_ROWS`.

**Product code (Green)**: `StatuslineRenderOptions.logo?: ResolvedLogo`; delegate
to `composeLogoColumn`; delete the `OAK_LOGO_ROWS` import (line 27) and the
`GREEN`-in-`composeWithLogo` hardcode (line 167). The renderer no longer names
Oak or green.

**Acceptance**: AC-9. Tests pass; tree green; `rg "OAK_LOGO_ROWS|GREEN"
agent-tools/src/claude/statusline-render.ts` returns nothing.
**Reviewer dispatch**: `type-expert`, `architecture-expert-fred`.

### Cycle 4.2: Composition root injects the acorn

**Parallel-safety**: sequenced after 2.1, 4.1, 3.2.
**File scope**: `agent-tools/src/claude/statusline-identity.ts`;
delete `agent-tools/src/claude/oak-logo.ts` if now consumer-free.

**Test (Red)**: extend the adapter integration test — with
`OAK_STATUSLINE_LOGO` unset the output carries the braille-sharp acorn in green;
with `=none` it renders two lines; with `=quad` it carries the quad rows.

**Product code (Green)**: at the adapter, `resolveLogoStyle(OAK_ACORN,
process.env.OAK_STATUSLINE_LOGO)` → `resolveLogo(OAK_ACORN, …)` →
`renderStatusline(parts, { logo })`. This is the single line that says "this
repo's statusline uses the Oak acorn". Name the env var via a constant.

**Acceptance**: AC-10. Tests pass; tree green; `agent-tools/src/claude/oak-logo.ts`
deleted; `rg "oak-logo" agent-tools` returns nothing.
**Reviewer dispatch**: `code-expert`, `architecture-expert-fred`.

---

## WS5 — Documentation and cross-surface updates

- TSDoc on `logo-column.ts`, `oak-acorn.ts`, `ansi.ts`, `statusline-launch.ts`
  (`@packageDocumentation` headers; the acorn provenance block carried verbatim).
- Update the regeneration-recipe pointer in
  `.agent/research/developer-experience/statusline-logos/statusline-logos.md`
  to the new `oak-acorn.ts` home.
- A short **new** ADR (verified 2026-06-15: no statusline ADR exists; highest is
  105) recording the repo-specific three-layer cut and home choice; the
  inject-don't-import rule itself is already general doctrine (ADR-024, ADR-078)
  and need not be restated. Scope the ADR to the WHAT (PDR-019). Authority for the
  decision is the ADR, not this plan (ADRs permanent, plans ephemeral).
- **Enforcement seam (Fred MAJOR, accepted):** `agent-tools` has no import-boundary
  ESLint config, so the neutral↔harness direction would be prose-only (PDR-038:
  stated principles need structural enforcement). Add an `import/no-restricted-paths`
  (or `no-restricted-imports`) rule forbidding `agent-tools/src/statusline/**` from
  importing `agent-tools/src/claude/**`, wired at `warn` initially (new-ESLint-rules
  -start-at-warn). Land it in WS1.4 alongside the neutral-home move.

---

## WS6 — Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

Per-cycle: `pnpm type-check && pnpm lint && pnpm test` (plus the cycle's focused
vitest file). Final aggregate from repo root:

```bash
pnpm check
```

Every gate blocks; there is no acceptable failure.

---

## WS7 — Adversarial Review

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

`architecture-expert-fred` (dependency direction: mechanism never imports the
asset; neutral never imports claude), `architecture-expert-barney`
(simplification — did extraction remove more moving parts than it added?),
`type-expert` (closed `LogoSelection`, no `any`/assertions),
`test-expert` (atomic landing, describe-vs-audit, no global state),
`code-expert` (gateway; soft-fail correctness), `docs-adr-expert` (drift closed).
Document findings; spawn a follow-up plan only for BLOCKERs.

---

## Proof Contract

| AC | Proof level | Command / observation |
|----|-------------|-----------------------|
| AC-1..AC-3 | unit | `pnpm --filter @oaknational/agent-tools test logo-column` exit 0 |
| AC-4 | integration | `pnpm test` exit 0 and `rg "claude/statusline-ansi" agent-tools` empty |
| AC-5 | unit | `pnpm --filter @oaknational/agent-tools test oak-acorn` exit 0 and glyph diff empty |
| AC-6 | unit | `pnpm --filter @oaknational/agent-tools test statusline-launch` exit 0 |
| AC-7 | integration | adapter integration test exit 0 incl. forced-throw → exit 0 |
| AC-8 | e2e | shim e2e exit 0 and `rg -e CLAUDE_PROJECT_DIR -e spawn .claude/scripts/statusline-identity.mjs` empty |
| AC-9 | unit | render test exit 0 and `rg -e OAK_LOGO_ROWS -e GREEN …/statusline-render.ts` empty |
| AC-10 | integration | adapter env-matrix test exit 0 and `rg "oak-logo" agent-tools` empty |
| All | aggregate | `pnpm check` exit 0 |

Completion = every AC proven; no `complete` verdict before `pnpm check` is green
and WS7 findings are resolved. TDD evidence is test-first per cycle
(failing test in the same commit as the product code that greens it), not
retrospective coverage.

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Mitigation |
|------|------------|
| Shim dynamic-import URL drifts if `.claude/scripts/` or `agent-tools/` relocates | The relative URL is the single point of coupling; the e2e (AC-8) breaks loudly if it drifts; no silent path arithmetic remains |
| In-process import loses spawn isolation; an adapter throw could crash the harness | AC-7 makes soft-fail an adapter property (catch-all and top-level guard) before AC-8 relies on it; `depends_on` enforces the order |
| Glyph corruption during the data move (astral sextant chars) | AC-5 diffs the moved literals byte-for-byte against `OAK_LOGO_ROWS`; width invariant (AC-3) re-checks |
| Over-modularisation (speculative neutral homes) | Non-goal fence: only the logo mechanism and asset and shared ANSI move; renderer stays put until the Cursor consumer lands |
| Import-churn races between parallel tracks | Tracks A/B share no product files until WS4; `depends_on` serialises the convergence |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- `principles.md` — separation of concerns, dependency inversion, replace-don't-bridge
  (old files deleted, no re-export stubs), no-machine-local-paths.
- `testing-strategy.md` — TDD cycle-pairs as the unit of landing; tests touch no
  global state (env injected as args); no skipped/conditional tests; soft-fail
  proven by test, not assumed.
- `schema-first-execution.md` / closed-shape-design — `LogoSelection<Style>` is a
  closed union over the asset's own keys; the width invariant is embedded and
  tested.
- Memory anchors: `feedback_platform_independent_naming` (neutral home),
  `feedback_tests_no_global_state`, `feedback_untestable_without_io_is_a_product_defect`
  (launch logic gains a DI seam), `feedback_scripts_dir_is_no_checks_zone`
  (logic warranting checks leaves the no-checks `.mjs` island).

---

## Plan-body first-principles check

> See [`.agent/rules/plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md)

- **Shape clause** fires at WS3.3: the shim shape is being replaced, not patched —
  verify the dynamic-import bootstrap is the minimum irreducible logic before
  writing it; do not preserve the spawn/exit-propagation shape by habit.
- **Landing-path clause** fires at WS4.2: confirm `oak-logo.ts` has zero
  consumers before deletion (`rg`), rather than leaving a tombstone re-export.
- **Vendor-literal clause**: not applicable (no vendor call shapes).

---

## First Question

*Could it be simpler without compromising quality?* The simplest shape that still
delivers the asked-for reuse is: extract **only** the logo mechanism and acorn
asset and shared ANSI (the genuine cross-harness/cross-brand boundary), inject the
asset at the one composition root, and harden the soft surface in the typed
workspace. Relocating the whole statusline renderer, or building a brand-registry
abstraction, would add moving parts no current or in-flight consumer needs — the
non-goals fence holds the line.

---

## Consolidation

WS8: after `pnpm check` is green and WS7 findings are resolved, run
`/oak-consolidate-docs` — graduate the inject-don't-import pattern and the
soft-surface-is-a-tested-guarantee lesson, rotate the napkin, and move this plan
`current/` → `active/` at execution start, then `archive/completed/` at close.

---

## Dependencies

**Blocking**: none — all inputs are in-repo and grounded.

**Related Plans** (the unified `statusline-enhancements` lane — hub:
[thread record](../../../memory/operational/threads/statusline-enhancements.next-session.md)):

- [`session-and-team-state-statusline-icons.plan.md`](session-and-team-state-statusline-icons.plan.md)
  — sibling in the same lane: the session-state foundation, team-state
  derivation, and session-shape icon projection. Shares the `renderStatusline`
  seam with this plan; coordinated, not dependent (this plan owns the logo column;
  that plan owns the segment/icon content).
- `.agent/plans/agent-tooling/archive/completed/statusline-session-shape-indicators.plan.md`
  — prior (completed) statusline work; this plan preserves the session-shape segments.
- Cursor-statusline adoption — a *prospective* future importer of the neutral
  logo modules. Today the Cursor shim spawns the whole Claude adapter and imports
  no logo code (verified 2026-06-15); a Cursor path that imports the neutral
  module is a separate, not-yet-designed plan.

---

## Review dispositions (2026-06-15)

Findings from docs-adr-expert and architecture-experts barney/betty/fred/wilma,
each validated first-hand before acceptance (owner directive). YAGNI /
over-building / speculative-optionality findings were re-screened against the
innovation-and-discovery context (owner 2026-06-15): forward design for consumers
the owner has in mind is creation, not a YAGNI breach. Verdicts:

| # | Source | Finding | Verdict and action |
| --- | --- | --- | --- |
| 1 | barney | "Second consumer (Cursor) in flight" is unsupported — the Cursor shim spawns the adapter and imports no logo code | **ACCEPTED.** Validated first-hand. Re-grounded Problem §3 and Design Principle 3: the extraction is justified on cohesion (two real inversions) and single-composition-root, not a speculative importer |
| 2 | docs | `widget/src/BrandBanner.tsx` path does not resolve | **ACCEPTED.** Validated; corrected to `apps/oak-curriculum-mcp-streamable-http/widget/src/BrandBanner.tsx` |
| 3 | fred | Neutral↔harness boundary has no enforcement seam (PDR-038) | **ACCEPTED.** Validated: `agent-tools` has no import-boundary config. Added an `import/no-restricted-paths` rule (`statusline/**` ⇏ `claude/**`) at `warn`, landed in WS1.4 |
| 4 | fred / barney | `<Style>` generic is speculative optionality — one asset, one style-set | **REJECTED (YAGNI-by-analogy, owner 2026-06-15).** Keep the `<Style>` generic as deliberate forward design: the owner has consumers in mind (other brand marks / style-sets). The closed-shape rule's own precondition ("cannot name a concrete second instantiation") is not met here, so it does not fire. This is innovation, not over-building |
| 5 | docs / betty | WS4.1 omits `statusline-render-session-shape.test.ts` (imports `OAK_LOGO_ROWS`) and the `StatuslineRenderOptions.logo` type change | **ACCEPTED.** WS4.1 must enumerate every `logo: OakLogoStyle` call site (`statusline-identity.ts:84`, both render tests) and migrate them atomically to `ResolvedLogo` |
| 6 | fred | WS5 "amend existing statusline ADR" — none exists | **ACCEPTED.** Reworded to a new ADR scoped to the WHAT (PDR-019) |
| 7 | fred | Confirm the adapter is the ADR-078 entry point for the `process.env` read | **ACCEPTED.** `statusline-identity.ts` is the composition root (the shim becomes `await import`); it is the sanctioned single env-read site |
| 8 | betty / barney | Two plans both edit `renderStatusline`/`statusline-identity.ts` — name a landing order | **ACCEPTED.** Land this plan's WS4.1 (renderer signature) first; the session-state plan's WS4 rebases onto the settled signature |
| 9 | wilma | Dynamic-import shim risks losing buffered stdin | **DOWNGRADED.** Node stdin is paused until a listener attaches (attached synchronously during the import), and AC-8 feeds stdin and asserts output. Kept as an explicit WS3.3 empirical check, not a blocker |
| 10 | wilma | WS3.2 "empty/partial output" on soft-fail is undefined | **ACCEPTED.** Tightened to "empty output only" — the line is assembled then written in one atomic `process.stdout.write` |
| 11 | wilma | Shim relative-URL drift caught only by e2e | **ACCEPTED.** Add a build/lint check asserting the shim's resolved dist path exists (the build already chmods that file; extend the assertion to the shim URL) |
| 12 | wilma | `ws1-cycle-2` `depends_on` omits `ws1-cycle-4` (RESET from neutral `ansi.ts`) | **ACCEPTED.** Add `ws1-cycle-4` to the dependency |
| 13 | barney / betty | `resolveAdapterPath` (WS3.1) may have no consumer once the shim is zero-logic | **ACCEPTED.** Confirm a consumer before building WS3.1; if the zero-logic shim wins, drop WS3.1 (the plan's own First-Question simplification) |
| 14 | barney | Neutral dir name `statusline/` reads feature-specific; ANSI relocation is a cost of the split | **NOTED.** Name acceptable; ANSI move recognised as a cost of the neutral home, not a free win |
