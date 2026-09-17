# Claude Design Conversion Playbook

How to convert a Claude Design project into a first-class Next.js workspace in
this repository. Distilled from the first conversion (the Oak Curriculum Hub,
`demos/oak-curriculum-hub/`, 2026-06-30 → 2026-07-02), including every mistake
made so the next conversion does not repeat them. The reusable-pipeline
programme that owns the forward automation of this playbook is
[`productionisation-and-reuse.plan.md`](../../.agent/plans-backlog-2026-07/curriculum-hub-demo/current/productionisation-and-reuse.plan.md)
(WS2).

## The two governing rules

**The spec is the surface, never the source** (owner-ruled 2026-08-10).
The export defines what the converted app LOOKS LIKE and DOES — appearance
and behaviour, at every canonical width, in every identity and theme. It
defines nothing about how the app is BUILT. Its markup, its inline hacks,
and its bundled demo components are out of bounds as source, however
right their names look: the app is built from the design system's
documented components and the repo's own patterns, and a real component is
built properly under the component gate, never conjured to match a name in
the export. The export's TEXT CONTENT is part of appearance and carries
over exactly. Differences are the exception, not the output: page chrome
and the demo's selector controls may differ; everything else that differs
carries a disposition in the fidelity register. This is the pipeline's
whole value — the result looks amazing _because it looks the same_, and
underneath it is nothing like the demo.

**The converted app is ordinary repo code from day one.** It is subject to the
same rules as everything else: strict TypeScript extending
`tsconfig.base.json`, the full shared ESLint ruleset, TDD, WCAG 2.2 AA, and
every repo-wide gate (prettier, markdownlint, knip, depcruise, Sonar, CodeQL).
There is no "prototype zone", no "temporary tier", no deferred gate parity.
Lint/gate exceptions are errors; when a gate hurts, the code changes, not the
gate (owner-ratified 2026-07-02, superseding the earlier prototype-zone
exemptions). A failing check after an exception is removed is not a collision
between gates — it is a signal becoming visible because it stopped being
masked.

The first conversion accumulated exemptions (prettier/markdownlint/knip
ignores, per-path ESLint rule-offs, scanner-scope debates) precisely because
the "temporary demo" frame survived in config comments after the tier had been
ratified first-class. Do not let that frame in the door.

## Reference first

**And visual first** (owner directive, 2026-08-10): every comparison
against the reference includes a rendered-image pair at matched canonical
widths, looked at with eyes — computed-style probes corroborate and
localise but never substitute (the probe-said-match-while-pixels-differed
incident is recorded in the reference-first rule).

Before anything is built against the export, RENDER the export and look
at it (the `render-the-reference-before-reproducing` rule fires on all of
this pipeline's work; this section is its application here):

1. Serve the export demo statically and open its pages — the finished
   thing is the specification, and no amount of reading its source
   substitutes for seeing it.
2. Capture the reference set with Playwright — full-page and fold, per
   identity — at the canonical measurement widths
   ([DDR-009](../design/design-decisions/009-measurement-happens-at-canonical-widths.md);
   the values live beside the fidelity tooling in
   `tools/measurement-widths.ts`). The capture tooling refuses free-hand
   widths, so a comparison outside the canonical set cannot be produced.
3. Every fidelity claim thereafter cites the captured reference, and the
   reference-vs-rebuild comparison runs from the first buildable slice —
   never only at the end.

Playwright is the standard instrument throughout this pipeline: reference
capture, live capture, behavioural probes, and the accessibility cells all
run on it.

## Target structure

One workspace directory IS the demo. Nothing lives beside it.

```text
demos/<app-name>/            # the pnpm workspace (registered in pnpm-workspace.yaml)
  app/  components/  lib/    # the Next.js app — ordinary source
  scripts/                   # re-runnable extractors (export → data), strict TS
  tools/                     # evidence/verification tooling, strict TS run via tsx
  claude-design-canonical-export/   # UNTRACKED vendor reference (see below)
  demo-evidence/             # UNTRACKED regenerable tool output
```

Anti-patterns from conversion #1, all dissolved on owner direction: a wrapper
directory holding the app beside `reference-prototype/`, `oak-design-kit/`,
`oak-design-system/` sibling folders (vendor residue with no consumers — if
material is real and reusable it becomes a package; if not, it does not enter
git); loose `.cjs`/`.mjs` scripts outside any workspace ("we don't allow
random javascript files in the repo"); evidence PNGs committed as payload
(evidence is a _capability_ — the tools regenerate it on demand).

## The canonical export (vendor data)

What a Claude Design export contains: the page exports (`*.dc.html` — NOT
static HTML: an `<x-dc>` element hydrated by `_ds/…/_ds_bundle.js`, fetching
`data/*.json` at runtime, so `file://` renders blank — serve over local HTTP
to render), `support.js`, the design-system bundle + token CSS under `_ds/`,
`embeds/*.jsx`, `data/*.json`, and sometimes `screenshots/` (in-export visual
targets).

Disposition (owner-ratified 2026-07-02):

- **Untracked, inside the workspace.** It is generated vendor output; its
  bundled Oak brand assets are not openly licensed; a fresh copy is
  re-obtainable via the claude-design MCP (`mcp__claude-design__*`) — which is
  also the update-pull path for export refreshes.
- **Genuinely excluded from all checks** — by _gitignore-awareness_, never by
  per-path exceptions scattered through tool configs. Each tool has one
  mechanism; wire all of them (see the gate checklist).
- **Byte-integrity is sacred.** The export is the visual-match ground truth
  and the future diff baseline. NEVER run a formatter or fixer over it.
  Worked incident (2026-07-02): a `.prettierignore` exemption was removed
  before the root-`.gitignore` mirror landed; a `format:root` run in that
  window rewrote 19/62 export files including every HTML page and the design
  bundle. Restoration was only possible because the export had earlier been
  tracked (byte-exact recovery from git history, verified with `cmp` per
  file). For an export that was never tracked, the only restoration is an MCP
  re-pull — so land the ignore wiring BEFORE removing any formatting
  exemption, and run discovery gates in check mode only.

## Content is data, not code

The single deepest lesson of conversion #1. Extractors initially emitted
curriculum content as giant TypeScript literal modules (3,760 and 10,604
lines) to get compile-time validation. Every code gate then judged content as
code: `max-lines` errors, 48–62% copy-paste density in Sonar, generator
throw-pattern pressure — three exception classes all rooted in one design
choice.

The correct shape:

1. **Zod schemas are the single source of truth** for the content types; the
   TypeScript types are `z.infer` re-exports (one schema, no hand-authored
   union drifting beside it).
2. **Extractors emit JSON**, validating against the schema before writing
   (generation-time belt). Extractors are strict TS run via tsx, Result-based
   error flow with one process boundary.
3. **Loaders validate the JSON at load** (runtime belt) and export the same
   constants consumers used before.

Both validation belts are kept; no gate needs an exception; a fresh export
re-runs the extractors and diffs as _data_.

## Gate integration checklist (per conversion)

- `pnpm-workspace.yaml`: register the workspace.
- `tsconfig.json`: `"extends": "../../tsconfig.base.json"` + only the
  Next-required overrides (`lib` +dom, `jsx`, `noEmit`, `isolatedModules`,
  `incremental`, the `next` plugin, `paths`). No `allowJs`.
- ESLint: shared `configs.strict` + `configs.next`; `globalIgnores` for build
  outputs only; `includeIgnoreFile(<workspace .gitignore>)` (core ESLint ≥10
  export from `eslint/config` — `@eslint/compat`'s copy is deprecated) for the
  untracked vendor data. Note: typescript-eslint's project service is a
  per-run singleton — `.mjs` config files join the typed corpus via
  `projectService.allowDefaultProject` in the SAME parserOptions block as
  ts/tsx, or the full run crashes.
- Root `.gitignore`: mirror the workspace's untracked-vendor entries — root
  tools (prettier and friends) read the ROOT file, not nested ones. This
  mirror is load-bearing (see the mutation incident above).
- markdownlint: `"gitignore": true` (lint scope = tracked files).
- depcruise: the workspace's `@/*` alias needs a resolution mapping
  (`tsconfig.depcruise.json`) or every aliased import dangles and all
  components report as `no-orphans` false positives; `.next/` sits in the
  exclude set with `dist` (build-output class). **The root mapping is
  single-occupancy**: `tsconfig.depcruise.json` can hold exactly one `@/*`
  entry, and `demos/oak-curriculum-hub` holds it (recorded in the file's
  comment). Conversion #2 must either adopt a distinct alias (e.g.
  `@<demo-name>/*` in its own tsconfig AND the depcruise mapping) or move
  depcruise to per-workspace configs — plan for this at scaffold time
  rather than discovering it as a gate failure.
- knip/prettier/markdownlint: NO workspace exemptions.
- Tools/scripts: TypeScript in the workspace, run via `tsx` package scripts
  (`tool:*`), under the workspace gates; stdout via `process.stdout.write`
  (their output is their interface); Result-pattern error flow.
- Playwright evaluate callbacks type-check against the DOM lib; `document`/
  `window` inside `page.evaluate` need no lint accommodation in typed TS.

## Verification tooling pattern

Conversion needs evidence tools; the shared core lives in
`@oaknational/fidelity-review` and conversion #1's app-local set is the
worked example (`demos/oak-curriculum-hub/tools/`): render the export's
target pages over
local HTTP (canonical render targets), capture the live app at matched
geometry (§D fidelity), a 320px two-state reflow gate (WCAG 1.4.10 — measure
the no-JS SSR state AND the hydrated state; hydration honesty: click until
`aria-expanded` actually flips so an unhydrated page fails loud), and a
token-fidelity audit (demo tokens vs the export's `_ds/…/tokens/fig-tokens.css`;
authorities not present in the export are inlined in the audit's consumer
config with a provenance citation, not carried as extra vendor files).

## Fidelity review and the divergence register

Comparison is a workflow, not a gate. One command
(`tool:fidelity` in conversion #1) serves the canonical export, ensures the
dev server (attach when up, spawn with bounded ready-wait and process-group
teardown when free), captures both sides at matched geometry, perceptually
diffs every pair a schema-validated **pairing map** declares (page pairs,
per-block section pairs, reference-only pairs that are never pixel-diffed,
and the exempt surfaces that HAVE no export target — absence is recorded,
never silent), and renders a self-contained side-by-side report
(export | live | diff, WCAG 2.2 AA itself).

Three rules make it honest:

- **Diff magnitude never gates.** Changed-pixel ratios triage attention;
  §D-class acceptance stays human/agent judgment over the report. The tool
  exits non-zero only on mechanical failure (blank capture, invalid
  register, server never ready, teardown failure).
- **Every finding gets a disposition** in the app's tracked
  `fidelity-register.json`: `fix` / `deliberate` (cite the ratified
  decision) / `investigate` (name the next check) / `matched` /
  `superseded`. Entries are keyed `<pairId>/<finding-slug>` (stable across
  export refreshes) and carry evidence, rationale, a role-handle author,
  and a date — the register is the divergence register the ingestion
  pipeline's diff stage reads so ratified divergences are not re-flagged on
  a refresh (productionisation plan WS2 stage 2).
- **The workflow is skill-carried**: the
  [`claude-design-pipeline` skill](../../.agent/skills/domain-craft/ui-design/claude-design-pipeline/SKILL-CANONICAL.md)
  owns the review loop (run → read report highest-ratio-first → judge →
  record → re-run `--report-only`); this playbook owns the porting method:
  compose `@oaknational/fidelity-review` (`packages/libs/fidelity-review`,
  consolidated at its second consumer 2026-08-09 — its README's §Modules
  is the authoritative enumeration), and author only the app-local parts
  in the new conversion's `tools/` — the app's own PAIR schema wrapped
  with the package's `buildPairingMapSchema`, capture arms, export
  server, default base and `SERVER_HINT`, and a `tools/fidelity-review.ts`
  composing the package's `/orchestrator` with only paths, capture arms,
  and `main` of its own.

## Accessibility bar

WCAG 2.2 AA is a hard gate, not a review note: jest-axe over every surface
state, the 320px reflow tool over every route in both designed states,
keyboard contracts TDD'd (the APG patterns — and only navigation keys may
mutate state: conversion #1 shipped a quiz where ANY key answered question
one), per-block `useId`-scoped DOM ids (index-derived ids collide across
repeated blocks), live regions as native `<output>` where content is phrasing.

## Review discipline

Every PR review comment gets fixed in code or explicitly rejected with
written rationale, and every thread resolved. Scanner findings resolve to
FIXED or FALSE_POSITIVE per the
[Sonar disposition policy](../governance/sonar-disposition-policy.md) — never
bulk-accepted, never excluded to make a red check green. Check-scope changes
of any kind are the owner's to authorise, ahead of time, every time.
