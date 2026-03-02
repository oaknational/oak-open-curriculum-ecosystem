# 15. Risks and Open Questions

## Risk Register

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Consistency drift** — plain CSS allows non-token styling | Medium | Recipes use only `var(--ds-*)`. Lint rule flags raw colour/size values in recipe CSS. Code review culture. |
| **Schema too rigid** — design systems need tokens the schema doesn't anticipate | Medium | Schema is versioned. Design systems can extend with `--{ds-name}-*` prefixed extras for brand components. |
| **Schema too loose** — insufficient constraint leads to visual inconsistency | Low | Start minimal, expand as needed. Two design systems immediately reveal gaps. |
| **Ark UI maturity** — less production usage than Radix | Medium | Zag.js state machines are architecturally sound. Monitor the Ark UI ecosystem. If critical issues found, migrating to Radix (which has the same `asChild` pattern) is a bounded change in the headless package only. |
| **CSS browser support** — `@container`, `color-mix()`, nesting | Low | All features >95% support as of early 2026. Oak's UK school audience uses modern browsers. |
| **Doubled Storybook maintenance** — two design systems | Medium | Zinc is a proof-of-concept. It can be maintained at lower fidelity or frozen after initial validation. |
| **Layout package adoption** — teams may resist learning a new layout approach | Medium | The layout package is optional. Teams can use any layout approach (plain CSS, Tailwind, etc.) with the design tokens. |
| **Migration disruption** — side-by-side period increases bundle size | Medium | Time-box the migration. Both libraries work simultaneously. Migrate by page, not by component. |
| **Team learning curve** — new patterns (data attributes, Ark UI, CSS custom properties) | Low | All patterns are simpler than what they replace. One pairing session covers fundamentals. |
| **Design team alignment** — new component APIs may not match design tool naming | Low | Involve design early. Align variant names (`intent`, `size`) with Figma component properties. |

## Open Questions

### Architecture

1. **Package naming:** `@oaknational/ds-oak` or `@oaknational/oak-ui`? The former is more systematic; the latter is friendlier for consumers.

2. **Monorepo location:** New standalone repo? Inside the existing `oak-components` repo as a v3? Inside the Oak Web Application monorepo?

3. **Recipe sharing vs. per-system:** Should both design systems share a single set of recipe CSS files (all styling via `--ds-*` variables), or should each have its own recipe files? Shared is DRYer and enforces the abstraction; separate allows per-system structural differences (e.g. a Zinc dialog might have a different layout than an Oak dialog).

4. **Icon delivery:** Integrate with the cloudinary-icon-ingest-poc build-time pipeline, or continue with Cloudinary runtime delivery?

### Component design

5. **Responsive variant API:** How should responsive typography work? CSS container queries in the recipe? Consumer-applied media queries? Responsive tokens in the schema?

6. **Form composition:** Should form components (TextInput, Select, etc.) include their label and error message, or should these be separate components that consumers compose?

7. **Toast positioning:** Should the library provide a `ToastProvider` that manages toast positioning and stacking, or is that a consumer concern?

### Process

8. **Minimum viable consumer:** Which Oak application pilots first? The AI Lesson Assistant (smaller surface, faster feedback) or the OWA (more components, higher impact)?

9. **Zinc's long-term status:** Maintained indefinitely as proof-of-architecture? Frozen after initial validation? Published to npm or internal-only?

10. **Design team involvement:** At what point does the design team review the Storybook and validate visual fidelity with the current oak-components?

11. **Storybook deployment:** One Storybook instance with a theme switcher, or separate deploys per design system?
