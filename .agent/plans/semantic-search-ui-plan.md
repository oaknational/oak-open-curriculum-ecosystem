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

- Styled Components SSR wired; shared header/theme; `/healthz` covers ES/SDK/LLM.
- ThemeContext with SSR cookie (`data-theme-mode`), localStorage, and
  system‑preference subscription; tests for SSR hint/system subscription/ThemeSelect.
- Theme uses `oakDefaultTheme` only; dark variant not yet implemented.
- Inline styling scattered across header, tabs, forms, results, and page shell.
- Admin page planned; Oak Components migration pending.

---

## Objectives (UI)

- Provide `/` search demo UI for Structured and NL queries.
- Provide `/admin` page for setup/rollup with streaming feedback.
- Integrate Oak Components; ensure WCAG 2.2 AA; respect reduced motion.
- SSR‑first theming: cookie as source of truth; no pre‑hydration DOM scripts.

---

## Theming approach (accepted)

- Provider: `ThemeContext` client provider exposes mode and resolved mode; wraps
  `OakThemeProvider` + `OakGlobalStyle`.
- SSR: server reads `theme-mode` cookie, sets `<html data-theme-mode>` and
  passes `initialMode` to provider.
- Persistence: write cookie + localStorage; default to `system` and subscribe to
  `matchMedia('prefers-color-scheme: dark')`.
- Separation of concerns: storage/media utilities in `theme-utils.ts`.

Acceptance (theming)

1. Toggle selects System/Light/Dark.
2. Default System when no preference exists.
3. System follows OS preference.
4. Persists (cookie + localStorage) and restores.
5. No hydration errors; no flash.
6. Applied to Oak Components and custom UI.
7. Canonical Next.js/React patterns; no ad‑hoc DOM writes.
8. Unit tests for utils; component tests for provider, SSR hint, and toggle.
9. WCAG AA contrast; themed focus outlines.
10. `prefers-reduced-motion` observed.

---

## UI structure and conventions

- `app/ui/themes/`: `tokens.ts`, `light.ts`, `dark.ts` (typed variants).
- `app/lib/theme/`: `ThemeContext.tsx` (provider) and `theme-utils.ts` (utilities).
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
- Replace inline styles with styled‑components consuming theme tokens.

Acceptance (M0): No raw hex/magic numbers remain; visual output unchanged.

### M1 — Oak theme integration (light + dark)

- Use `oakDefaultTheme` as light base. If Oak has a dark theme, adopt it;
  otherwise derive `oakDarkTheme` with palette/semantic color overrides only.
- Hook `ThemeContext` to select variants; keep SSR cookie strategy.
- Add contrast checks for key surfaces (text/backgrounds/focus rings).

Acceptance (M1): Toggle switches cleanly; SSR/hydration clean; AA contrast.

### M2 — Component refactor to Oak Components

- Replace inputs/selects/buttons/tabs/header with Oak Components (or thin
  wrappers) preserving labels/roles/keyboard nav.
- Results: themed list/cards; highlight styling from tokens.
- Option: side‑by‑side Structured/NL on desktop; stack on small screens.

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

Acceptance (M4): Flow coverage without network I/O; a11y checks pass.

Definition of Done (UI)

- Demo supports representative queries; admin controls work; Oak‑styled look and feel; tests pass.

---

## References

- styled‑components Theming docs
- Next.js providers (App Router)
- React Context usage
- Oak Components Storybook
