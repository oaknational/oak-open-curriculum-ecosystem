# 9. Design System — Zinc

Zinc is a **completely different** design system that fills the same token schema slots with contrasting values. It exists to prove the architecture works, to catch hardcoded Oak values in recipes, and to demonstrate the library's reuse potential.

## Character

Where Oak is warm, rounded, and playful, Zinc is **cool, sharp, and precise**:

| Trait | Expression |
|-------|-----------|
| **Cool** | Indigo primary, slate neutrals, blue-tinted shadows |
| **Precise** | Inter + Space Grotesk typefaces, tight spacing, minimal letter-spacing |
| **Sharp** | 1–2px border radius, thin 1px borders, crisp edges |
| **Minimal** | Subtle shadows, fast transitions, restrained animations |
| **Technical** | JetBrains Mono for code, dashboard-oriented aesthetic |

## Side-by-side comparison

| Dimension | Oak | Zinc |
|-----------|-----|------|
| Primary colour | Forest green `#287D39` | Indigo `#4F46E5` |
| Accent | Sunny yellow `#F0CE33` | Amber `#F59E0B` |
| Neutral palette | Warm greys | Cool slate greys |
| Heading font | Lexend | Space Grotesk |
| Body font | Lexend 300 | Inter 400 |
| Code font | Roboto Mono | JetBrains Mono |
| h1 size | 3.5rem | 2.75rem |
| Body line-height | 1.6 | 1.5 |
| Base spacing | 0.25rem (4px) | 0.125rem (2px) |
| Default radius | 0.5rem (rounded) | 0.125rem (sharp) |
| Default border | 2px | 1px |
| Default shadow | Warm, diffused | Cool, minimal |
| Default transition | 200ms | 120ms |
| Bounce easing | Strong overshoot | Subtle overshoot |
| Disabled opacity | 0.42 | 0.35 |
| Overlay opacity | 0.6 (navy-tinted) | 0.75 (black) |

Every dimension is intentionally different. If a component looks the same under both systems, something is hardcoded.

## Token values

```css
/* packages/zinc/src/tokens/tokens.css */

:root {
  /* ── Palette ── */
  --ds-palette-primary: #4F46E5;
  --ds-palette-primary-light: #A5B4FC;
  --ds-palette-primary-dark: #3730A3;
  --ds-palette-secondary: #0F172A;
  --ds-palette-secondary-light: #334155;
  --ds-palette-secondary-dark: #020617;
  --ds-palette-accent: #F59E0B;
  --ds-palette-accent-light: #FDE68A;
  --ds-palette-accent-dark: #B45309;
  --ds-palette-neutral-50: #F8FAFC;
  --ds-palette-neutral-100: #F1F5F9;
  --ds-palette-neutral-200: #E2E8F0;
  --ds-palette-neutral-300: #CBD5E1;
  --ds-palette-neutral-400: #94A3B8;
  --ds-palette-neutral-500: #64748B;
  --ds-palette-neutral-600: #475569;
  --ds-palette-neutral-700: #334155;
  --ds-palette-neutral-800: #1E293B;
  --ds-palette-neutral-900: #0F172A;
  --ds-palette-neutral-950: #020617;
  --ds-palette-white: #FFFFFF;
  --ds-palette-black: #0F172A;
  --ds-palette-success: #059669;
  --ds-palette-warning: #D97706;
  --ds-palette-error: #DC2626;
  --ds-palette-info: #2563EB;

  /* ── Semantic Colours ── */
  --ds-color-text-primary: var(--ds-palette-neutral-900);
  --ds-color-text-secondary: var(--ds-palette-neutral-600);
  --ds-color-text-muted: var(--ds-palette-neutral-400);
  --ds-color-text-inverse: var(--ds-palette-white);
  --ds-color-text-link: var(--ds-palette-primary);
  --ds-color-text-link-hover: var(--ds-palette-primary-dark);
  --ds-color-bg-primary: var(--ds-palette-white);
  --ds-color-bg-secondary: var(--ds-palette-neutral-50);
  --ds-color-bg-muted: var(--ds-palette-neutral-100);
  --ds-color-bg-inverse: var(--ds-palette-secondary);
  --ds-color-bg-overlay: rgba(15, 23, 42, 0.75);
  --ds-color-border-default: var(--ds-palette-neutral-200);
  --ds-color-border-strong: var(--ds-palette-neutral-800);
  --ds-color-border-muted: var(--ds-palette-neutral-100);
  --ds-color-focus-ring: var(--ds-palette-primary);
  --ds-color-btn-primary-bg: var(--ds-palette-primary);
  --ds-color-btn-primary-text: var(--ds-palette-white);
  --ds-color-btn-primary-hover-bg: var(--ds-palette-primary-dark);
  --ds-color-btn-secondary-bg: transparent;
  --ds-color-btn-secondary-text: var(--ds-palette-primary);
  --ds-color-btn-secondary-border: var(--ds-palette-primary);
  --ds-color-btn-secondary-hover-bg: rgba(79, 70, 229, 0.06);

  /* ── Typography ── */
  --ds-font-family-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --ds-font-family-heading: 'Space Grotesk', 'Inter', sans-serif;
  --ds-font-family-code: 'JetBrains Mono', 'Fira Code', monospace;
  --ds-heading-1-size: 2.75rem;
  --ds-heading-1-line-height: 1.1;
  --ds-heading-1-weight: 700;
  --ds-heading-1-letter-spacing: 0.01em;
  --ds-heading-2-size: 2.125rem;
  --ds-heading-2-line-height: 1.15;
  --ds-heading-2-weight: 700;
  --ds-heading-2-letter-spacing: 0.01em;
  --ds-heading-3-size: 1.75rem;
  --ds-heading-3-line-height: 1.2;
  --ds-heading-3-weight: 600;
  --ds-heading-3-letter-spacing: 0;
  --ds-heading-4-size: 1.375rem;
  --ds-heading-4-line-height: 1.25;
  --ds-heading-4-weight: 600;
  --ds-heading-4-letter-spacing: 0;
  --ds-heading-5-size: 1.125rem;
  --ds-heading-5-line-height: 1.3;
  --ds-heading-5-weight: 600;
  --ds-heading-5-letter-spacing: 0;
  --ds-heading-6-size: 1rem;
  --ds-heading-6-line-height: 1.3;
  --ds-heading-6-weight: 600;
  --ds-heading-6-letter-spacing: 0.02em;
  --ds-body-1-size: 1rem;
  --ds-body-1-line-height: 1.5;
  --ds-body-1-weight: 400;
  --ds-body-1-letter-spacing: 0;
  --ds-body-2-size: 0.9375rem;
  --ds-body-2-line-height: 1.5;
  --ds-body-2-weight: 400;
  --ds-body-2-letter-spacing: 0;
  --ds-body-3-size: 0.8125rem;
  --ds-body-3-line-height: 1.45;
  --ds-body-3-weight: 400;
  --ds-body-3-letter-spacing: 0.01em;
  --ds-caption-size: 0.6875rem;
  --ds-caption-line-height: 1.35;
  --ds-caption-weight: 500;
  --ds-caption-letter-spacing: 0.04em;
  --ds-code-size: 0.85rem;
  --ds-code-line-height: 1.5;
  --ds-code-weight: 400;
  --ds-code-letter-spacing: -0.01em;

  /* ── Spacing (tighter rhythm) ── */
  --ds-space-0: 0;
  --ds-space-1: 0.125rem;
  --ds-space-2: 0.375rem;
  --ds-space-3: 0.625rem;
  --ds-space-4: 0.875rem;
  --ds-space-5: 1.125rem;
  --ds-space-6: 1.375rem;
  --ds-space-8: 1.75rem;
  --ds-space-10: 2.25rem;
  --ds-space-12: 2.75rem;
  --ds-space-16: 3.5rem;
  --ds-space-20: 4.5rem;
  --ds-space-24: 5.5rem;

  /* ── Borders (sharp) ── */
  --ds-radius-none: 0;
  --ds-radius-sm: 0.0625rem;
  --ds-radius-md: 0.125rem;
  --ds-radius-lg: 0.25rem;
  --ds-radius-xl: 0.375rem;
  --ds-radius-full: 9999px;
  --ds-border-width-default: 1px;
  --ds-border-width-thick: 2px;

  /* ── Shadows (minimal, cool) ── */
  --ds-shadow-none: none;
  --ds-shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04);
  --ds-shadow-md: 0 1px 4px rgba(15, 23, 42, 0.08);
  --ds-shadow-lg: 0 2px 8px rgba(15, 23, 42, 0.1);
  --ds-shadow-xl: 0 4px 16px rgba(15, 23, 42, 0.12);
  --ds-shadow-inner: inset 0 1px 2px rgba(15, 23, 42, 0.06);
  --ds-shadow-focus: 0 0 0 2px var(--ds-palette-primary), 0 0 0 4px rgba(79, 70, 229, 0.2);

  /* ── Transitions (fast, precise) ── */
  --ds-duration-fast: 75ms;
  --ds-duration-default: 120ms;
  --ds-duration-slow: 250ms;
  --ds-easing-default: cubic-bezier(0.2, 0.0, 0.0, 1);
  --ds-easing-in: cubic-bezier(0.4, 0.0, 1, 1);
  --ds-easing-out: cubic-bezier(0.0, 0.0, 0.2, 1);
  --ds-easing-bounce: cubic-bezier(0.2, 0.0, 0.0, 1.1);

  /* ── Animations (restrained) ── */
  --ds-anim-fade-in: zinc-fade-in var(--ds-duration-default) var(--ds-easing-out);
  --ds-anim-fade-out: zinc-fade-out var(--ds-duration-fast) var(--ds-easing-in);
  --ds-anim-slide-up: zinc-slide-up var(--ds-duration-default) var(--ds-easing-default);
  --ds-anim-slide-down: zinc-slide-down var(--ds-duration-default) var(--ds-easing-default);
  --ds-anim-scale-in: zinc-scale-in var(--ds-duration-default) var(--ds-easing-default);
  --ds-anim-spin: zinc-spin 0.8s linear infinite;

  /* ── Opacity ── */
  --ds-opacity-muted: 0.65;
  --ds-opacity-disabled: 0.35;
  --ds-opacity-overlay: 0.75;
  --ds-opacity-subtle: 0.08;

  /* ── Z-Index ── */
  --ds-z-base: 0;
  --ds-z-dropdown: 10;
  --ds-z-sticky: 20;
  --ds-z-modal: 30;
  --ds-z-popover: 40;
  --ds-z-toast: 50;
  --ds-z-tooltip: 60;
}

@keyframes zinc-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes zinc-fade-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes zinc-slide-up { from { transform: translateY(4px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes zinc-slide-down { from { transform: translateY(-4px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes zinc-scale-in { from { transform: scale(0.98); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes zinc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* ── Dark theme ── */
[data-theme="dark"] {
  --ds-color-text-primary: var(--ds-palette-neutral-100);
  --ds-color-text-secondary: var(--ds-palette-neutral-400);
  --ds-color-text-muted: var(--ds-palette-neutral-500);
  --ds-color-text-inverse: var(--ds-palette-neutral-900);
  --ds-color-text-link: var(--ds-palette-primary-light);
  --ds-color-text-link-hover: var(--ds-palette-white);
  --ds-color-bg-primary: var(--ds-palette-neutral-950);
  --ds-color-bg-secondary: var(--ds-palette-neutral-900);
  --ds-color-bg-muted: var(--ds-palette-neutral-800);
  --ds-color-bg-inverse: var(--ds-palette-primary-light);
  --ds-color-bg-overlay: rgba(2, 6, 23, 0.85);
  --ds-color-border-default: var(--ds-palette-neutral-700);
  --ds-color-border-strong: var(--ds-palette-neutral-200);
  --ds-color-border-muted: var(--ds-palette-neutral-800);
  --ds-color-focus-ring: var(--ds-palette-primary-light);
  --ds-color-btn-primary-bg: var(--ds-palette-primary-light);
  --ds-color-btn-primary-text: var(--ds-palette-neutral-950);
  --ds-color-btn-primary-hover-bg: var(--ds-palette-white);
  --ds-color-btn-secondary-bg: transparent;
  --ds-color-btn-secondary-text: var(--ds-palette-primary-light);
  --ds-color-btn-secondary-border: var(--ds-palette-primary-light);
  --ds-color-btn-secondary-hover-bg: rgba(165, 180, 252, 0.08);
  --ds-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
  --ds-shadow-md: 0 1px 4px rgba(0, 0, 0, 0.3);
  --ds-shadow-lg: 0 2px 8px rgba(0, 0, 0, 0.4);
  --ds-shadow-xl: 0 4px 16px rgba(0, 0, 0, 0.5);
  --ds-shadow-inner: inset 0 1px 2px rgba(0, 0, 0, 0.2);
}
```

## Zinc-specific brand components

- **GlitchDivider** — CSS-animated glitch-effect horizontal rule
- **PrecisionBadge** — sharply cornered badge with monospace text
- **DataTag** — small label with a coloured left border, dashboard aesthetic
