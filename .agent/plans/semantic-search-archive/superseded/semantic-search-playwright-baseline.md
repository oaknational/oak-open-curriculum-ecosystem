# Semantic Search Playwright Baseline Capture (Phase 1 UX)

_Last updated: 2025-09-26_

## Purpose

Create failing visual and accessibility baselines that expose the current responsive regressions across the `bp-xs` → `bp-xxl` ramp (360 px, 800 px, 1 200 px, 2 000 px). These baselines will guide the responsive layout workstream and ensure fixes are validated through automation.

## Tooling

- `pnpm dlx @playwright/mcp@latest` (alias: `playwright`) – drives snapshots and axe checks via MCP.
- Browser: Chromium only for baselines (extend to WebKit/Firefox in later phases if needed).
- Viewports map to UX breakpoints:
  - 360 × 800 → `bp-xs`
  - 800 × 1 000 → `bp-md`
  - 1 200 × 1 000 → `bp-lg`
  - 2 000 × 1 200 → `bp-xxl`

## Global Assertions

Across all pages capture:

1. **Screenshot** – stored under `apps/oak-open-curriculum-semantic-search/tests/visual/{page}/{width}.png`.
2. **DOM snapshot** – optional HTML excerpt to aid debugging (`.snap` alongside screenshot).
3. **Accessibility** – axe violation report written to `tests/visual/{page}/{width}.axe.json` (expected to fail initially due to layout-driven issues).

## Page-by-Page Failing Checks

### Search (`/`)

| Breakpoint          | Capture                 | Expected Failure                                                                                | Notes                                                                                                             |
| ------------------- | ----------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 360 px (`bp-xs`)    | Hero + forms screenshot | Structured/Natural panels remain side-by-side; screenshot should show overlapping inputs/forms. | Assert two `.structured`/`.natural` panels occupy single row; add locator count check expecting 2 columns (fail). |
|                     | Results list screenshot | Cards push beyond viewport edge; expect horizontal scroll or clipped content.                   | DOM assertion: `.search-result-card` width > viewport, triggers failure.                                          |
| 800 px (`bp-md`)    | Forms screenshot        | Secondary panels sit too far apart due to rigid min-width 20 rem; expect empty gutter.          | Visual diff emphasises whitespace; DOM check verifying computed gap > 160 px.                                     |
| 1 200 px (`bp-lg`)  | Hero screenshot         | Hero text spans entire width without clamp.                                                     | Inspect `max-inline-size` (currently missing) to fail assertion.                                                  |
| 2 000 px (`bp-xxl`) | Results screenshot      | Container sticks at 72 rem causing huge outer gutters; cards remain two columns.                | DOM check expecting `grid-template-columns` to have 3 tracks but currently 2.                                     |

### Admin (`/admin`)

| Breakpoint | Capture                | Expected Failure                                                                           | Notes                                                                                                          |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| 360 px     | Run panels screenshot  | Buttons and output strips appear as tall narrow columns with empty surroundings.           | DOM assertion ensures `.admin-section` width equals container; fails due to 900 px max width + centred layout. |
| 800 px     | Action grid screenshot | Panels still stack vertically; failing expectation for side-by-side layout.                |
| 1 200 px   | Telemetry screenshot   | Logs overflow container without scroll, causing layout shift.                              |
| 2 000 px   | Overview screenshot    | Hard-coded 900 px `maxWidth` keeps layout narrow; fail comparing to expected clamp 78 rem. |

### Docs (`/api/docs`)

| Breakpoint | Capture                  | Expected Failure                                                                   | Notes                                                    |
| ---------- | ------------------------ | ---------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 360 px     | Header screenshot        | Header lacks breathing room; expect multi-line text compressed.                    | Use axe to flag insufficient landmarks (Redoc defaults). |
| 800 px     | Redoc wrapper screenshot | Iframe collapses to narrow column (min width 1 000 px), causing horizontal scroll. | DOM assertion on wrapper `overflow`/`width`.             |
| 1 200 px   | Redoc screenshot         | No Oak surface styling; raw Redoc UI flush with background.                        |
| 2 000 px   | Redoc screenshot         | Content anchored left, leaving large blank area; expected centred clamp fails.     |

### Health (`/healthz` rendered UI TBD)

Given current JSON output, capture placeholder page from functionality plan once UI shell exists. For now, loading `/healthz` returns JSON; record failure that the page lacks Oak surface entirely.

| Breakpoint | Capture                | Expected Failure                                     | Notes                                                                                       |
| ---------- | ---------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| All widths | HTTP response snapshot | Non-HTML response (JSON) indicates missing UI layer. | Visual capture simply records text response; mark as baseline failure until UI implemented. |

## Test Structure

Create Playwright MCP script `tests/visual/responsive-baseline.spec.ts`:

- Parameterise pages & viewports.
- For each combination:
  1. Navigate to page.
  2. Wait for `data-testid` markers (`search-page`, `admin-dashboard`, etc.).
  3. Run axe (expect violations → test marked `test.fail()` with descriptive message).
  4. Capture screenshot (commit as baseline). Current layout defects ensure future assertion updates fail (status `test.fail()` until fixes land).
  5. Perform DOM assertions (grid track counts, element widths) using `test.fail()` to highlight mismatches.

Example snippet:

```ts
for (const [label, viewport] of VIEWPORTS) {
  test.describe(`viewport ${label}`, () => {
    test(`${label} – Search layout`, async ({ page }, testInfo) => {
      test.fail();
      await page.goto('./');
      await expect(page.getByTestId('search-page')).toBeVisible();
      await checkColumnCount(page, 'structured', 1); // expects failure (currently 2)
      await takeSnapshot(page, `search-${label}`, testInfo);
      await runAxe(page, `search-${label}`); // expected to report issues
    });
  });
}
```

`checkColumnCount` reads computed styles (`grid-template-columns`, card widths) to reflect expectations from the responsive architecture.

## Next Steps

1. Implement the spec above, committing failing baselines (tests marked `test.fail()` to track progress).
2. Coordinate with functionality plan for Health UI so snapshots evolve from JSON to Oak cards.
3. Once responsive work completes, flip `test.fail()` to pass and update baselines.

This baseline ensures every fix ties back to the shared breakpoint ramp and protects against regressions as we iterate on the layout architecture.
