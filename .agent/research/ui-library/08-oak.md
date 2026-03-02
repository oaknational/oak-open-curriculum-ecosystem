# 8. Design System — Oak

## Character

| Trait | Expression |
|-------|-----------|
| **Warm** | Forest green primary, mint accents, cream-toned neutrals |
| **Friendly** | Lexend typeface (high readability), generous spacing, rounded corners |
| **Playful** | Hand-drawn HR, jaunty angle labels, bounce easing on animations |
| **Educational** | Clear hierarchy, high contrast, readable body text |
| **Accessible** | Strong focus rings, semantic colour roles, large touch targets |

## Token values

```css
/* packages/oak/src/tokens/tokens.css */

:root {
  /* ── Palette ── */
  --ds-palette-primary: #287D39;
  --ds-palette-primary-light: #BEF2BD;
  --ds-palette-primary-dark: #1A5426;
  --ds-palette-secondary: #222F5A;
  --ds-palette-secondary-light: #575F7A;
  --ds-palette-secondary-dark: #141B38;
  --ds-palette-accent: #F0CE33;
  --ds-palette-accent-light: #FFF4B5;
  --ds-palette-accent-dark: #C6A817;
  --ds-palette-neutral-50: #FAFAFA;
  --ds-palette-neutral-100: #F2F2F2;
  --ds-palette-neutral-200: #E6E6E6;
  --ds-palette-neutral-300: #CCCCCC;
  --ds-palette-neutral-400: #999999;
  --ds-palette-neutral-500: #666666;
  --ds-palette-neutral-600: #4D4D4D;
  --ds-palette-neutral-700: #373737;
  --ds-palette-neutral-800: #2B2B2B;
  --ds-palette-neutral-900: #222222;
  --ds-palette-neutral-950: #1A1A1A;
  --ds-palette-white: #FFFFFF;
  --ds-palette-black: #222222;
  --ds-palette-success: #287D39;
  --ds-palette-warning: #F0CE33;
  --ds-palette-error: #DD0035;
  --ds-palette-info: #0077C8;

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
  --ds-color-bg-overlay: rgba(34, 47, 90, 0.6);
  --ds-color-border-default: var(--ds-palette-neutral-200);
  --ds-color-border-strong: var(--ds-palette-neutral-900);
  --ds-color-border-muted: var(--ds-palette-neutral-100);
  --ds-color-focus-ring: var(--ds-palette-secondary);
  --ds-color-btn-primary-bg: var(--ds-palette-primary);
  --ds-color-btn-primary-text: var(--ds-palette-white);
  --ds-color-btn-primary-hover-bg: var(--ds-palette-primary-dark);
  --ds-color-btn-secondary-bg: transparent;
  --ds-color-btn-secondary-text: var(--ds-palette-primary);
  --ds-color-btn-secondary-border: var(--ds-palette-primary);
  --ds-color-btn-secondary-hover-bg: rgba(40, 125, 57, 0.08);

  /* ── Typography ── */
  --ds-font-family-body: 'Lexend', sans-serif;
  --ds-font-family-heading: 'Lexend', sans-serif;
  --ds-font-family-code: 'Roboto Mono', monospace;
  --ds-heading-1-size: 3.5rem;
  --ds-heading-1-line-height: 1.15;
  --ds-heading-1-weight: 700;
  --ds-heading-1-letter-spacing: -0.02em;
  --ds-heading-2-size: 2.5rem;
  --ds-heading-2-line-height: 1.2;
  --ds-heading-2-weight: 700;
  --ds-heading-2-letter-spacing: -0.01em;
  --ds-heading-3-size: 2rem;
  --ds-heading-3-line-height: 1.25;
  --ds-heading-3-weight: 600;
  --ds-heading-3-letter-spacing: 0;
  --ds-heading-4-size: 1.5rem;
  --ds-heading-4-line-height: 1.3;
  --ds-heading-4-weight: 600;
  --ds-heading-4-letter-spacing: 0;
  --ds-heading-5-size: 1.25rem;
  --ds-heading-5-line-height: 1.4;
  --ds-heading-5-weight: 600;
  --ds-heading-5-letter-spacing: 0;
  --ds-heading-6-size: 1.125rem;
  --ds-heading-6-line-height: 1.4;
  --ds-heading-6-weight: 600;
  --ds-heading-6-letter-spacing: 0;
  --ds-body-1-size: 1.125rem;
  --ds-body-1-line-height: 1.6;
  --ds-body-1-weight: 300;
  --ds-body-1-letter-spacing: 0;
  --ds-body-2-size: 1rem;
  --ds-body-2-line-height: 1.6;
  --ds-body-2-weight: 300;
  --ds-body-2-letter-spacing: 0;
  --ds-body-3-size: 0.875rem;
  --ds-body-3-line-height: 1.5;
  --ds-body-3-weight: 300;
  --ds-body-3-letter-spacing: 0;
  --ds-caption-size: 0.75rem;
  --ds-caption-line-height: 1.4;
  --ds-caption-weight: 400;
  --ds-caption-letter-spacing: 0.02em;
  --ds-code-size: 0.9rem;
  --ds-code-line-height: 1.6;
  --ds-code-weight: 400;
  --ds-code-letter-spacing: 0;

  /* ── Spacing ── */
  --ds-space-0: 0;
  --ds-space-1: 0.25rem;
  --ds-space-2: 0.5rem;
  --ds-space-3: 0.75rem;
  --ds-space-4: 1rem;
  --ds-space-5: 1.25rem;
  --ds-space-6: 1.5rem;
  --ds-space-8: 2rem;
  --ds-space-10: 2.5rem;
  --ds-space-12: 3rem;
  --ds-space-16: 4rem;
  --ds-space-20: 5rem;
  --ds-space-24: 6rem;

  /* ── Borders ── */
  --ds-radius-none: 0;
  --ds-radius-sm: 0.25rem;
  --ds-radius-md: 0.5rem;
  --ds-radius-lg: 0.75rem;
  --ds-radius-xl: 1rem;
  --ds-radius-full: 9999px;
  --ds-border-width-default: 2px;
  --ds-border-width-thick: 3px;

  /* ── Shadows ── */
  --ds-shadow-none: none;
  --ds-shadow-sm: 0 1px 2px rgba(34, 34, 34, 0.08);
  --ds-shadow-md: 0 2px 8px rgba(34, 34, 34, 0.12);
  --ds-shadow-lg: 0 4px 16px rgba(34, 34, 34, 0.16);
  --ds-shadow-xl: 0 8px 32px rgba(34, 34, 34, 0.2);
  --ds-shadow-inner: inset 0 2px 4px rgba(34, 34, 34, 0.08);
  --ds-shadow-focus: 0 0 0 3px var(--ds-color-focus-ring);

  /* ── Transitions ── */
  --ds-duration-fast: 100ms;
  --ds-duration-default: 200ms;
  --ds-duration-slow: 400ms;
  --ds-easing-default: cubic-bezier(0.4, 0.0, 0.2, 1);
  --ds-easing-in: cubic-bezier(0.4, 0.0, 1, 1);
  --ds-easing-out: cubic-bezier(0.0, 0.0, 0.2, 1);
  --ds-easing-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ── Animations ── */
  --ds-anim-fade-in: oak-fade-in var(--ds-duration-default) var(--ds-easing-out);
  --ds-anim-fade-out: oak-fade-out var(--ds-duration-fast) var(--ds-easing-in);
  --ds-anim-slide-up: oak-slide-up var(--ds-duration-default) var(--ds-easing-bounce);
  --ds-anim-slide-down: oak-slide-down var(--ds-duration-default) var(--ds-easing-out);
  --ds-anim-scale-in: oak-scale-in var(--ds-duration-default) var(--ds-easing-bounce);
  --ds-anim-spin: oak-spin 1s linear infinite;

  /* ── Opacity ── */
  --ds-opacity-muted: 0.72;
  --ds-opacity-disabled: 0.42;
  --ds-opacity-overlay: 0.6;
  --ds-opacity-subtle: 0.16;

  /* ── Z-Index ── */
  --ds-z-base: 0;
  --ds-z-dropdown: 100;
  --ds-z-sticky: 200;
  --ds-z-modal: 300;
  --ds-z-popover: 400;
  --ds-z-toast: 500;
  --ds-z-tooltip: 600;
}

@keyframes oak-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes oak-fade-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes oak-slide-up { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes oak-slide-down { from { transform: translateY(-8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes oak-scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes oak-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* ── Dark theme ── */
[data-theme="dark"] {
  --ds-color-text-primary: var(--ds-palette-neutral-100);
  --ds-color-text-secondary: var(--ds-palette-neutral-300);
  --ds-color-text-muted: var(--ds-palette-neutral-500);
  --ds-color-text-inverse: var(--ds-palette-neutral-900);
  --ds-color-text-link: var(--ds-palette-primary-light);
  --ds-color-text-link-hover: var(--ds-palette-white);
  --ds-color-bg-primary: var(--ds-palette-neutral-950);
  --ds-color-bg-secondary: var(--ds-palette-neutral-900);
  --ds-color-bg-muted: var(--ds-palette-neutral-800);
  --ds-color-bg-inverse: var(--ds-palette-primary-light);
  --ds-color-bg-overlay: rgba(0, 0, 0, 0.7);
  --ds-color-border-default: var(--ds-palette-neutral-700);
  --ds-color-border-strong: var(--ds-palette-neutral-300);
  --ds-color-border-muted: var(--ds-palette-neutral-800);
  --ds-color-focus-ring: var(--ds-palette-primary-light);
  --ds-color-btn-primary-bg: var(--ds-palette-primary-light);
  --ds-color-btn-primary-text: var(--ds-palette-neutral-900);
  --ds-color-btn-primary-hover-bg: var(--ds-palette-white);
  --ds-color-btn-secondary-bg: transparent;
  --ds-color-btn-secondary-text: var(--ds-palette-primary-light);
  --ds-color-btn-secondary-border: var(--ds-palette-primary-light);
  --ds-color-btn-secondary-hover-bg: rgba(190, 242, 189, 0.1);
  --ds-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --ds-shadow-md: 0 2px 8px rgba(0, 0, 0, 0.4);
  --ds-shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.5);
  --ds-shadow-xl: 0 8px 32px rgba(0, 0, 0, 0.6);
  --ds-shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}
```

## Oak-specific brand components

These exist only in the Oak package and have no counterpart in the schema:

- **HandDrawnHR** — SVG-based wobbly horizontal rule
- **JauntyAngleLabel** — rotated label with Oak's signature playful angle
- **RoundIcon** — icon in a coloured circle with optional shadow
- **CookieBanner** — Oak-branded GDPR consent UI
- **InlineRegistrationBanner** — Oak registration prompt
