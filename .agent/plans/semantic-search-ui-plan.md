# Semantic Search UI Plan (Design, theming, Oak Components)

Role: Actionable plan for the Search app UI. Focuses on theming, Oak Components
integration, a11y, and page structure. Mirrors current code and defines a clear
path to an Oak‑quality UI.

Document relationships

- API plan: `semantic-search-api-plan.md`
- Documentation & onboarding plan: `semantic-search-documentation-plan.md`
- Archived source: `archive/semantic-search-service-plan.md`

---

## Scope

- Next.js App Router UI for Structured and NL search demos and an Admin page.
- Theming with styled‑components and Oak Components, SSR‑first cookie hint, zero flicker.
- Light + dark theme variants (derive dark if Oak doesn’t provide one yet).
- WCAG 2.2 AA contrast and reduced motion respected.

---

## Current state (as‑is, code audited)

- Styled Components SSR wired with clean server/client boundary; `/healthz` covers ES/SDK/LLM.
- ThemeContext with SSR cookie (`data-theme-mode`), localStorage, and
  system‑preference subscription; tests for SSR hint/system subscription/ThemeSelect.
- Theme tokens scaffolded under `app/ui/themes/{tokens,light,dark,types}` with typed
  DefaultTheme; dark theme derivation in place (palette overrides only).
- Tabs removed; page shows Structured and NL side‑by‑side per plan.
- Header styling moved to `app/ui/client/HeaderStyles.tsx` (client); layout remains server.
- Inline styling remains in forms/results; header/page shell largely tokenized.
- Admin page planned; Oak Components migration pending.
- Mode-aware Bridge implemented: `ThemeBridgeProvider` derives light/dark `theme.app` and emits CSS vars keyed by mode; `HtmlThemeAttribute` syncs `<html data-theme>`; tests prove CSS var values and `theme.app` tokens change on toggle.

---

## Objectives (UI)

- Provide `/` search demo UI for Structured and NL queries.
- Provide `/admin` page for setup/rollup with streaming feedback.
- Integrate Oak Components; ensure WCAG 2.2 AA; respect reduced motion.
- SSR‑first theming: cookie as source of truth; no pre‑hydration DOM scripts.

---

## Theming approach (accepted)

- Provider composition follows ADR‑045 (Hybrid theming Bridge):
  - `OakThemeProvider (oakDefaultTheme)` → `ColorModeProvider` → `ThemeBridgeProvider` → styled `ThemeProvider`.
  - The Bridge maps Oak raw tokens to a typed semantic theme and emits a single CSS variable sheet.
  - Bridge is mode‑aware via `createLightTheme`/`createDarkTheme`; CSS variable values and `theme.app` tokens depend on the current mode.
- SSR: server reads `theme-mode` cookie and sets `<html data-theme>` to the resolved mode; passes `initialMode` to the client provider.
- Mode switching: toggle an HTML attribute/class for instant switch; avoid provider remounts.
- Persistence: cookie + localStorage; default `system`; subscribe to `prefers-color-scheme`.
- Separation of concerns: storage/media utilities in `theme-utils.ts`; semantic mapping isolated in the Bridge.
- Reference: `docs/architecture/architectural-decisions/045-hybrid-theming-bridge-for-oak-components.md`.

Acceptance (theming)

1. Toggle selects System/Light/Dark.
2. Default System when no preference exists.
3. System follows OS preference.
4. Persists (cookie + localStorage) and restores.
5. No hydration errors; no flash.
6. `theme.app` tokens are present and typed in all consumers.
7. CSS variable sheet emitted once; mode toggles without flicker.
8. Unit tests for utils; component tests for provider/SSR hint/toggle; Bridge tests for CSS var emission.
9. WCAG AA contrast; themed focus outlines.
10. `prefers-reduced-motion` observed.
11. Semantic tokens and CSS variable values change on toggle (tested).

---

## UI structure and conventions

- `app/ui/themes/`: `tokens.ts`, `light.ts`, `dark.ts` (typed variants).
- `app/lib/theme/`: `ThemeContext.tsx` (provider) and `theme-utils.ts` (utilities).
- `app/ui/client/`: client‑only containers and widgets (`SearchPageClient`, `HeaderStyles`,
  `ThemeSelect`, `useSearchController`).
- `app/ui/server/`: server‑only pieces (reserved; keep empty until needed).
- `app/ui/shared/`: shared/isomorphic utilities/components.
- `app/ui/components/`: prefer Oak Components; minimal atoms/molecules; app‑specific organisms.

---

## Milestones & tasks

### M0 — Audit and unify styling (First step)

- Create `app/ui/themes/{tokens.ts,light.ts,dark.ts}` scaffolding.
- Inventory all styling usage and design constants, then migrate to tokens:
  - Inline styles: layout header/nav; page shell; SearchTabHeader; forms;
    SearchResults; ThemeSelect.
  - Colors: replace `#e5e7eb`, `#ddd`, `#666`, `crimson`, and any raw values.
  - Spacing: `padding`, `margin`, `gap`, `borderRadius`.
- Define token names mapping to Oak tokens first; add app‑specific tokens only
  when Oak lacks an equivalent.
- Replace inline styles with styled‑components consuming theme tokens. Progress:
  header + layout refactored via `HeaderStyles` client wrapper; tabs removed;
  style audit captured in `.agent/plans/ui-style-audit.md`.

Acceptance (M0): No raw hex/magic numbers remain; visual output unchanged.

### M1 — Oak theme integration via Bridge (light + dark)

- Introduce Theme Bridge per ADR‑045: map raw → semantic, emit CSS variables, expose typed `theme.app`.
- Use `oakDefaultTheme` as light base; derive dark palette at semantic layer until official dark available.
- Hook `ThemeContext` to select variants (cookie → `<html data-theme>`); keep SSR cookie strategy.
- Add contrast checks for key surfaces (text/backgrounds/focus rings).

Status: ThemeContext remains client‑only under `Providers`; SSR sets
`<html data-theme>` from cookie; header includes `ThemeSelect`. Bridge is mode‑aware and tested (tokens and CSS vars change on toggle).

Acceptance (M1): Toggle switches cleanly; semantic tokens and CSS vars change; SSR/hydration clean; AA contrast.

### M2 — Component refactor to Oak Components

- Replace inputs/selects/buttons/tabs/header with Oak Components (or thin
  wrappers) preserving labels/roles/keyboard nav.
- Results: themed list/cards; highlight styling from tokens.
- Option: side‑by‑side Structured/NL on desktop; stack on small screens.

Definition of ready for M2: Bridge is in place; `theme.app` is available; inline styles in target components are replaced by tokens.

Acceptance (M2): Primary UI surfaces use Oak; a11y semantics intact.

### M3 — Highlights safety and semantics

- Audit `dangerouslySetInnerHTML`; sanitize/allowlist server‑side or render
  safely with emphasis.
- Add tests to ensure no unsafe HTML is rendered.

Acceptance (M3): Safe highlight rendering; tests pass.

### M4 — Tests & checks

- Component tests for Structured/NL flows (submit, errors, results render).
- a11y checks (axe) for core pages/components.
- Keep theming unit/integration tests green.
- Bridge tests verify mode toggling updates both CSS vars and `theme.app` tokens.

Status: theming unit/integration tests all green; SSR cookie mapping test stabilized
with scoped styled‑components mock. Build verified with Turbopack.

Acceptance (M4): Flow coverage without network I/O; a11y checks pass.

Definition of Done (UI)

- Demo supports representative queries; admin controls work; Oak‑styled look and feel; tests pass.

---

## References

- styled‑components Theming docs
- Next.js providers (App Router)
- React Context usage
- Oak Components Storybook

---

## Dev & E2E workflow note (Playwright MCP)

- The Playwright MCP server is available in this repo. For rapid UI iteration and E2E probing:
  - Start the Next app in dev mode so server logs remain visible in the terminal.
  - Use Playwright via MCP to drive the client (navigate, fill, click) while observing server logs in real time.
  - This is especially useful to validate theme switching, search submissions, and highlight rendering without introducing network flakiness (stub external calls where applicable).
