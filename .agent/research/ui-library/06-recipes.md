# 6. Recipes and Styling

## What recipes are

A recipe is a CSS file that defines how a component looks across all its variants and states. Recipes reference `--ds-*` custom properties (never specific values) and target components via `data-ds` attributes.

Recipes are the bridge between the token system ("what colours and sizes exist") and the component ("what does a primary button look like"). They are **shared across design systems** — the same recipe works with Oak tokens and Zinc tokens because it only references variables.

## Scoping: data attributes + `@layer`

Instead of CSS Modules (which are framework-specific), recipes use:

- **`data-ds="button"`** on the root element — identifies the component
- **`data-intent="primary"`**, **`data-size="md"`** — identifies variants
- **`@layer ds-recipes`** — isolates recipe styles in the cascade

This approach is:
- **Framework-agnostic** — pure CSS, works in React, Vue, Svelte, plain HTML
- **Debuggable** — DevTools shows `data-ds="button" data-intent="primary"`, not hashed class names
- **Zero build tooling** — no CSS Modules loader, no PostCSS plugin
- **`@layer` isolated** — consumer styles in a higher layer override cleanly

## Why not CSS Modules

CSS Modules would work for React but create portability issues:

| | CSS Modules | Data-attribute scoping |
|--|------------|----------------------|
| Framework support | React, Vue (config), not Svelte naturally | Everything including plain HTML |
| Build requirement | Yes (loader) | No |
| DevTools | `.button_a3x7q` (opaque) | `[data-ds="button"]` (meaningful) |
| Collision risk | Zero (hashes) | Effectively zero (`data-ds` is specific) |

Since the architecture prioritises framework-agnostic recipes, data-attribute scoping is the stronger choice.

## Example: Button recipe

```css
/* packages/recipes/src/button.css */

@layer ds-recipes {
  [data-ds="button"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-2);
    font-family: var(--ds-font-family-body);
    border-radius: var(--ds-radius-md);
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: background-color var(--ds-duration-default) var(--ds-easing-default),
                box-shadow var(--ds-duration-default) var(--ds-easing-default);

    &:focus-visible {
      outline: none;
      box-shadow: var(--ds-shadow-focus);
    }

    &:disabled {
      opacity: var(--ds-opacity-disabled);
      cursor: not-allowed;
    }

    /* ── Intent variants ── */

    &[data-intent="primary"] {
      background: var(--ds-color-btn-primary-bg);
      color: var(--ds-color-btn-primary-text);

      &:hover:not(:disabled) {
        background: var(--ds-color-btn-primary-hover-bg);
      }
    }

    &[data-intent="secondary"] {
      background: var(--ds-color-btn-secondary-bg);
      color: var(--ds-color-btn-secondary-text);
      border: var(--ds-border-width-default) solid var(--ds-color-btn-secondary-border);

      &:hover:not(:disabled) {
        background: var(--ds-color-btn-secondary-hover-bg);
      }
    }

    &[data-intent="tertiary"] {
      background: transparent;
      color: var(--ds-color-text-link);
      text-decoration: underline;

      &:hover:not(:disabled) {
        color: var(--ds-color-text-link-hover);
      }
    }

    &[data-intent="danger"] {
      background: var(--ds-palette-error);
      color: var(--ds-palette-white);

      &:hover:not(:disabled) {
        background: color-mix(in srgb, var(--ds-palette-error), black 10%);
      }
    }

    &[data-intent="ghost"] {
      background: transparent;
      color: var(--ds-color-text-primary);

      &:hover:not(:disabled) {
        background: var(--ds-color-bg-muted);
      }
    }

    /* ── Size variants ── */

    &[data-size="sm"] {
      padding: var(--ds-space-1) var(--ds-space-3);
      font-size: var(--ds-body-3-size);
      line-height: var(--ds-body-3-line-height);
      font-weight: 500;
    }

    &[data-size="md"] {
      padding: var(--ds-space-2) var(--ds-space-5);
      font-size: var(--ds-body-2-size);
      line-height: var(--ds-body-2-line-height);
      font-weight: 500;
    }

    &[data-size="lg"] {
      padding: var(--ds-space-3) var(--ds-space-8);
      font-size: var(--ds-body-1-size);
      line-height: var(--ds-body-1-line-height);
      font-weight: 500;
    }
  }
}
```

## Example: Dialog recipe

```css
/* packages/recipes/src/dialog.css */

@layer ds-recipes {
  [data-ds="dialog-overlay"] {
    position: fixed;
    inset: 0;
    background: var(--ds-color-bg-overlay);
    animation: var(--ds-anim-fade-in);

    &[data-state="closed"] {
      animation: var(--ds-anim-fade-out);
    }
  }

  [data-ds="dialog"] {
    background: var(--ds-color-bg-primary);
    border-radius: var(--ds-radius-lg);
    box-shadow: var(--ds-shadow-xl);
    padding: var(--ds-space-8);
    animation: var(--ds-anim-scale-in);

    &[data-size="sm"] { max-width: 24rem; }
    &[data-size="md"] { max-width: 32rem; }
    &[data-size="lg"] { max-width: 48rem; }
    &[data-size="full"] { max-width: calc(100vw - var(--ds-space-8)); }
  }
}
```

## The data-attribute rule

**Allowed (semantic variants):**
- `data-ds="button"` — component identity
- `data-intent="primary"` — maps to a coordinated set of styles
- `data-size="md"` — maps to padding, font-size, line-height together
- `data-state="open"` — Ark UI provides these automatically

**Not allowed (would reinvent utility CSS):**
- `data-padding="4"` — maps to a single CSS property
- `data-background="primary"` — maps to a single CSS property
- `data-gap="2"` — maps to a single CSS property

If an attribute maps to one CSS property, it's a utility. Use the layout package or plain CSS instead.
