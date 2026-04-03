---
name: "WS3 Contrast Validation Prerequisite"
overview: "Build WCAG contrast ratio validation into the design token pipeline as a blocking quality gate, fix the two known token contrast violations, and establish the pairing/triad model for all future colour work."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
specialist_reviewer: "design-system-reviewer, accessibility-reviewer"
isProject: false
todos:
  - id: core-pure-functions
    content: "Implement relative luminance and contrast ratio pure functions in design-tokens-core (TDD)."
    status: pending
  - id: pairing-manifest-schema
    content: "Define the contrast pairing manifest schema with pairwise and triadic entry types."
    status: pending
  - id: author-pairings
    content: "Author contrast-pairings.json for the current token set (all semantic fg/bg pairs + button triads)."
    status: pending
  - id: build-pipeline-integration
    content: "Wire contrast validation into the oak-design-tokens build pipeline, emitting dist/contrast-report.json."
    status: pending
  - id: fix-focus-ring
    content: "Fix the focus ring token contrast failure (sky-400 on light surfaces, 2.08:1 → ≥3:1)."
    status: pending
  - id: fix-dark-error
    content: "Fix the dark-theme error token contrast failure (danger-500 on dark surfaces, 2.84:1 → ≥4.5:1)."
    status: pending
  - id: quality-gate
    content: "Add contrast:check as a build-time quality gate that fails on threshold violations."
    status: pending
  - id: docs-update
    content: "Update design-token-practice.md with contrast validation API, pairing format, and threshold constants."
    status: pending
---

# WS3 Contrast Validation Prerequisite

**Status**: PENDING — prerequisite for Phase 4 (curriculum-model view)
**Last Updated**: 2026-04-03

## Motivation

The accessibility reviewer identified two blocking WCAG AA token-level
violations (focus ring contrast, dark-theme error colour) that exist before
any view code is written. Rather than fixing these ad-hoc, we build the
contrast validation tool first — the tool proves the fix, and becomes
permanent infrastructure for all future colour work.

## Architecture (reviewer-confirmed)

Three reviewers (Betty, Fred, design-system) converged on this architecture:

### Three-file model

| Concern | File | Location | Authored/Generated |
|---------|------|----------|-------------------|
| Token values | `palette.json`, `semantic.*.json`, `component.json` | `oak-design-tokens/src/tokens/` | Human-authored |
| Which colours to test | `contrast-pairings.json` | `oak-design-tokens/src/tokens/` | Human-authored |
| Computed results | `contrast-report.json` | `oak-design-tokens/dist/` | Machine-generated |

### Pure functions in design-tokens-core

- `hexToSrgb(hex: string): { r: number; g: number; b: number }` — parse hex
- `srgbToRelativeLuminance(rgb): number` — WCAG 2.x relative luminance
- `contrastRatio(l1: number, l2: number): number` — WCAG contrast ratio
- `checkWcagAA(ratio: number, textSize: 'normal' | 'large'): boolean` —
  4.5:1 for normal, 3:1 for large text
- `checkNonTextContrast(ratio: number): boolean` — 3:1 per WCAG 1.4.11
- `validateContrastPairings(resolvedTokens, manifest): ContrastReport` —
  top-level validator, injected with pairing manifest

### Pairing manifest schema

```typescript
interface ContrastManifest {
  readonly pairs: readonly ContrastPair[];
  readonly triads: readonly ContrastTriad[];
}

interface ContrastPair {
  readonly foreground: string;   // token path
  readonly background: string;   // token path
  readonly context: 'text' | 'non-text' | 'large-text';
}

interface ContrastTriad {
  readonly foreground: string;   // e.g. button text
  readonly middle: string;       // e.g. button surface
  readonly background: string;   // e.g. page surface
  readonly contexts: {
    readonly fgMid: 'text' | 'non-text' | 'large-text';
    readonly midBg: 'non-text';
    readonly fgBg: 'text' | 'non-text';
  };
}
```

Triads are first-class: three pairwise checks plus a joint
distinguishability check. The `contexts` object declares which WCAG
criterion applies to each pair within the triad.

### Build pipeline integration

The existing `build-css.ts` in `oak-design-tokens` already resolves palette
references to hex. The contrast step runs after reference resolution:

1. Resolve all token references to hex (existing step)
2. Read `contrast-pairings.json`
3. Call `validateContrastPairings()` from `design-tokens-core`
4. Emit `dist/contrast-report.json`
5. Fail the build if any pairing violates its threshold

### Quality gate integration

Runs as part of the existing `build` gate (category 7 in the taxonomy).
No separate script or gate row needed — the build fails on violation.
A convenience script `pnpm contrast:check` runs the validation in
isolation for development feedback.

## Key decisions (reviewer-sourced)

- **No write-back to source JSON** — contrast data is derived, not source.
  Storing it in `$extensions` would create staleness risk and noisy diffs.
  (Betty: coupling risk; Fred: DRY violation; design-system: DTCG spec
  guidance against computed data in source)
- **Pairing manifest in oak-design-tokens, not design-tokens-core** — the
  manifest encodes Oak-specific design intent. The validator accepts it as
  a parameter (dependency injection). (Betty: change-cost allocation)
- **No new ADR** — ADR-148 already names contrast validation in
  design-tokens-core's charter. ADR-147 establishes a11y as blocking.
  Update design-token-practice.md instead. (Fred: implements existing
  decisions)
- **Triadic distinguishability threshold** — WCAG does not define a
  three-way metric. We define a minimum: the weakest of the three pairwise
  ratios must still meet the applicable WCAG threshold for its context.
  Document this in design-token-practice.md.

## Tasks

### 1. Pure functions (TDD)

Write RED tests first for:
- `hexToSrgb` — known hex values to known RGB
- `srgbToRelativeLuminance` — known RGB to known luminance (WCAG formula)
- `contrastRatio` — known luminance pairs to known ratios
- `checkWcagAA` / `checkNonTextContrast` — threshold boundary cases
- `validateContrastPairings` — manifest with passing/failing pairs

Implement in `packages/design/design-tokens-core/src/contrast.ts`.
Export from `packages/design/design-tokens-core/src/index.ts`.

### 2. Pairing manifest schema

Define the `ContrastManifest` type in `design-tokens-core`. This is the
contract — the manifest data lives in `oak-design-tokens`.

### 3. Author contrast-pairings.json

Define all current pairings for both themes. At minimum:
- `text-primary` on `surface-page`, `surface-panel`
- `text-secondary` on `surface-page`, `surface-panel`
- `text-inverse` on `accent`, `accent-strong`
- `accent` on `surface-page`, `surface-panel` (non-text)
- `focus-ring` on `surface-page`, `surface-panel` (non-text)
- `error` on `surface-page`, `surface-panel` (text)
- `attention` on `surface-page` (non-text)
- Button triad: `button-primary-text-color` / `button-primary-background` / `surface-page`

### 4. Build pipeline integration

Extend `build-css.ts` to:
- Load `contrast-pairings.json`
- Resolve all referenced tokens to hex (both themes)
- Call `validateContrastPairings()` per theme
- Write `dist/contrast-report.json`
- Throw on violations (fails the build)

### 5. Fix blocking token issues

Using the new tool to prove the fix:
- **Focus ring**: Replace or supplement `sky-400` for light theme focus.
  Double-ring technique (2px accent + 2px dark outline) recommended by
  accessibility reviewer. Verify ≥3:1 against both surfaces.
- **Dark error**: Add a lighter error colour for dark theme in
  `semantic.dark.json`. Verify ≥4.5:1 against both dark surfaces.

### 6. Quality gate

Add `pnpm contrast:check` script in root `package.json` for isolated
development feedback. The build gate catches violations automatically.

### 7. Documentation

Update `docs/governance/design-token-practice.md`:
- Contrast validation API surface
- Pairing manifest format and authoring guide
- WCAG AA threshold constants and triadic model
- How to add new pairings when new tokens are introduced

## Acceptance evidence

1. `pnpm build` in `oak-design-tokens` fails when a pairing violates WCAG AA
2. `dist/contrast-report.json` contains all pairings with computed ratios
3. Focus ring passes ≥3:1 in both themes
4. Dark-theme error passes ≥4.5:1
5. Button triad passes all three pairwise checks
6. `pnpm check` passes
7. design-system-reviewer and accessibility-reviewer approve
