# 16. Appendices

## Appendix A: Side-by-Side Token Comparison

| Token Slot | Oak | Zinc |
|-----------|-----|------|
| `--ds-palette-primary` | `#287D39` (forest green) | `#4F46E5` (indigo) |
| `--ds-palette-accent` | `#F0CE33` (sunny yellow) | `#F59E0B` (amber) |
| `--ds-palette-neutral-500` | `#666666` (warm grey) | `#64748B` (cool slate) |
| `--ds-font-family-heading` | Lexend | Space Grotesk |
| `--ds-font-family-body` | Lexend 300 | Inter 400 |
| `--ds-font-family-code` | Roboto Mono | JetBrains Mono |
| `--ds-heading-1-size` | 3.5rem | 2.75rem |
| `--ds-body-1-line-height` | 1.6 | 1.5 |
| `--ds-space-4` | 1rem (16px) | 0.875rem (14px) |
| `--ds-radius-md` | 0.5rem (rounded) | 0.125rem (sharp) |
| `--ds-shadow-md` | Warm, diffused | Cool, minimal |
| `--ds-duration-default` | 200ms | 120ms |
| `--ds-easing-bounce` | Strong bounce | Subtle overshoot |
| `--ds-opacity-disabled` | 0.42 | 0.35 |
| `--ds-opacity-overlay` | 0.6 (navy-tinted) | 0.75 (black) |
| `--ds-border-width-default` | 2px | 1px |

Every dimension is intentionally different. If a component looks the same under both systems, something is hardcoded.

## Appendix B: Reference Architectures

| Library | Architecture | Relevance |
|---------|-------------|-----------|
| **Radix Themes** | Radix Primitives + CSS custom properties + data attributes | Very close (data-attribute styling approach) |
| **Park UI** | Ark UI + Panda CSS recipes + multiple themes | Close (Ark UI, multi-theme) |
| **Mantine** | Custom headless + CSS Modules | Close (CSS approach, though uses Modules) |
| **shadcn/ui** | Radix + Tailwind + CVA | Similar primitives, different styling |
| **Adobe Spectrum** | React Aria + CSS custom properties + themes | Close (schema-driven multi-theme) |
| **Every Layout** | Pure CSS layout primitives | Inspiration for the layout package |

The proposed architecture combines the data-attribute styling of **Radix Themes**, the state-machine headless approach of **Park UI / Ark UI**, and the intrinsic layout patterns of **Every Layout**.

## Appendix C: Modern CSS Features Relied Upon

| Feature | Browser Support | Used For |
|---------|----------------|----------|
| CSS Custom Properties | 98%+ | Token system, theming, layout customisation |
| CSS Nesting | 96%+ | Recipe structure, variant selectors |
| `@layer` | 96%+ | Cascade isolation (tokens < recipes < consumer) |
| `@container` | 95%+ | Component-scoped responsive design |
| `color-mix()` | 95%+ | Derived colours (hover states, tints) |
| `:has()` | 95%+ | Parent-aware styling |
| `@scope` | 90%+ | Optional additional scoping |
| `@property` | 90%+ | Typed custom properties with defaults |

All percentages as of early 2026. Oak's target audience (UK schools) uses predominantly modern Chrome, Edge, and Safari.

## Appendix D: Technology Stack Summary

| Concern | Technology | Framework dependency |
|---------|-----------|---------------------|
| Headless behaviour | Ark UI (Zag.js) | React (bindings) |
| Design tokens | CSS custom properties | None |
| Component scoping | `data-ds` attributes + `@layer` | None |
| Variant system | Data attributes (`data-intent`, `data-size`) | None |
| Layout utilities | Pure CSS classes | None |
| Dark theme | CSS custom property swap via `[data-theme="dark"]` | None |
| Responsive design | `@container` + `@media` | None |
| Colour manipulation | `color-mix()` | None |
| Build | tsup | Node.js |
| Testing | Vitest + Testing Library + axe-core | React (test renderer) |
| Documentation | Storybook 8 | React |
| Types | TypeScript strict mode | None |
| Package management | pnpm workspaces | None |

## Appendix E: Layer Portability Diagram

```
┌─────────────────────────────────────────────────┐
│                    CORE                          │
│         Schema · Types · Validation              │
│            (no framework dependency)             │
└─────────────────┬───────────────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
┌───┴───┐                 ┌────┴────┐
│  OAK  │                 │  ZINC   │
│TOKENS │                 │ TOKENS  │        ← Pure CSS
│(.css) │                 │ (.css)  │           100% portable
└───┬───┘                 └────┬────┘
    │                          │
┌───┴──────────────────────────┴───┐
│           RECIPES                │
│   data-attribute scoped CSS      │        ← Pure CSS
│   references var(--ds-*)         │           100% portable
└──────────────┬───────────────────┘
               │
┌──────────────┴───────────────────┐
│           LAYOUT                 │
│   pure CSS utility classes       │        ← Pure CSS
│   references var(--ds-space-*)   │           100% portable
│          (optional)              │
└──────────────┬───────────────────┘
               │
     ┌─────────┴──────────┐
     │                    │
┌────┴─────┐        ┌────┴─────┐
│ HEADLESS │        │ HEADLESS │
│  React   │        │   Vue    │        ← Framework-specific
│(Ark UI)  │        │(Ark UI)  │           (future)
└────┬─────┘        └────┬─────┘
     │                    │
┌────┴─────┐        ┌────┴─────┐
│COMPOSED  │        │COMPOSED  │
│ ds-oak   │        │ds-oak-vue│        ← Framework-specific
│ (React)  │        │  (Vue)   │           (future)
└──────────┘        └──────────┘
```

The top five layers (core, tokens, recipes, layout) are 100% reusable across any framework. Only the bottom two (headless + composed) are framework-specific, and they are the thinnest layers.
