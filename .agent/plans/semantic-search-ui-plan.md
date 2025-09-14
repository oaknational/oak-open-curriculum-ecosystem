# Semantic Search UI Plan (Design, theming, Oak Components)

Role: This plan covers UX/UI, theming, Oak Components integration, and accessibility for the Search app. It extracts front‑end content from `semantic-search-service-plan.md`. API mechanics and docs live in sibling plans.

Document relationships

- API plan: `semantic-search-api-plan.md`
- Documentation & onboarding plan: `semantic-search-documentation-plan.md`
- Archived source: `archive/semantic-search-service-plan.md`

---

## Scope

- Next.js App Router UI for Structured and NL search demos and an Admin page.
- Theming with styled‑components and Oak Components, SSR‑first cookie hint, zero flicker.
- Strong accessibility and alignment with Oak design.

---

## Current status (UI)

- Styled Components SSR wired; shared header/theme; `/healthz` covers ES/SDK/LLM.
- Theme context implemented with SSR cookie (`data-theme-mode`), localStorage convenience, and system‑preference subscription; tests for SSR hint, system subscription, and ThemeSelect interaction.
- Admin page planned; Oak Components migration pending.

---

## Objectives (UI)

- Provide `/search` demo UI for Structured and NL queries.
- Provide `/admin` page for setup/rollup with streaming feedback.
- Integrate Oak Components; ensure WCAG AA; respect reduced motion.
- SSR‑first theming: cookie as source of truth; no pre‑hydration DOM scripts.

---

## Theming approach (accepted)

- Provider: `ThemeContext` client provider exposes mode and resolved mode; wraps `OakThemeProvider` + `OakGlobalStyle`.
- SSR: server reads `theme-mode` cookie, sets `<html data-theme-mode>` and passes `initialMode` to provider.
- Persistence: write cookie + localStorage; default to `system` and subscribe to `matchMedia('prefers-color-scheme: dark')`.
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

- `app/ui/themes/`: `tokens.ts`, `light.ts`, `dark.ts` (typed variants once available).
- `app/lib/theme/`: `ThemeContext.tsx` (provider) and `theme-utils.ts` (pure utilities).
- `app/ui/components/`: prefer Oak Components; minimal atoms/molecules; app‑specific organisms.

---

## Tasks (UI)

1. Build `/search` page with two panels (Structured vs NL); side‑by‑side layout.
2. Wire inputs to endpoints; show results with highlights and metadata.
3. Add `/admin` page (secured interactions using `x-api-key`).
4. Replace primitives with Oak Components; ensure labels/keyboard nav.
5. Add snapshot/interaction tests for key flows.

Definition of Done (UI)

- Demo supports representative queries; admin controls work; Oak‑styled look and feel; tests pass.

---

## References

- styled‑components Theming docs
- Next.js providers (App Router)
- React Context usage
- Oak Components Storybook
