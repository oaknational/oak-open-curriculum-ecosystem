# 7. Layout Package

## Purpose

The layout package (`@oaknational/ds-layout`) provides **optional, pure-CSS layout utilities** that use the design system's spacing tokens. It is:

- **Completely optional** — consumers can construct their own layout with plain CSS, Tailwind, or any other approach
- **Pure CSS** — no React, no JavaScript, no framework dependency
- **Token-aware** — uses `var(--ds-space-*)` for spacing, so layouts adapt to whichever design system's tokens are loaded
- **Customisable per instance** — each utility accepts CSS custom properties on the element for overrides

## Design philosophy

Inspired by [Every Layout](https://every-layout.dev/) by Andy Bell and Heydon Pickering: a small set of CSS layout primitives that solve common layout problems using intrinsic CSS (flexbox, grid, container queries) rather than breakpoint-driven media queries.

Each layout utility is a CSS class that:
1. Has a sensible default using design tokens
2. Can be customised via a scoped CSS custom property on the element
3. Uses no JavaScript
4. Has no opinion about what goes inside it

## The utilities

### Container

Centred max-width wrapper with consistent horizontal padding.

```css
@layer ds-layout {
  .ds-container {
    max-width: var(--container-max, 80rem);
    margin-inline: auto;
    padding-inline: var(--container-padding, var(--ds-space-4));
  }
}
```

Usage:
```html
<div class="ds-container">
  <!-- content constrained to 80rem, centred -->
</div>

<div class="ds-container" style="--container-max: 60rem">
  <!-- narrower container -->
</div>
```

### Stack

Vertical flow with consistent spacing between children. The fundamental layout primitive.

```css
@layer ds-layout {
  .ds-stack {
    display: flex;
    flex-direction: column;
    gap: var(--stack-gap, var(--ds-space-4));
  }

  .ds-stack-sm { --stack-gap: var(--ds-space-2); }
  .ds-stack-lg { --stack-gap: var(--ds-space-8); }
  .ds-stack-xl { --stack-gap: var(--ds-space-12); }
}
```

Usage:
```html
<div class="ds-stack">
  <h1>Title</h1>
  <p>Paragraph with default gap</p>
  <p>Another paragraph</p>
</div>

<div class="ds-stack" style="--stack-gap: var(--ds-space-6)">
  <!-- custom gap -->
</div>
```

### Cluster

Horizontal wrapping layout for items of varying width. Good for tags, buttons, navigation items.

```css
@layer ds-layout {
  .ds-cluster {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cluster-gap, var(--ds-space-3));
    align-items: var(--cluster-align, center);
  }
}
```

Usage:
```html
<div class="ds-cluster">
  <button>Tag 1</button>
  <button>Tag 2</button>
  <button>Tag 3</button>
</div>
```

### Sidebar

Content area with a sidebar that collapses below a threshold width. Uses flexbox wrapping — no media query needed.

```css
@layer ds-layout {
  .ds-sidebar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sidebar-gap, var(--ds-space-6));

    & > :first-child {
      flex-basis: var(--sidebar-width, 20rem);
      flex-grow: 1;
    }

    & > :last-child {
      flex-basis: 0;
      flex-grow: 999;
      min-width: var(--sidebar-threshold, 60%);
    }
  }
}
```

Usage:
```html
<div class="ds-sidebar">
  <aside>Sidebar content</aside>
  <main>Main content — sidebar collapses when main can't be 60% wide</main>
</div>
```

### Grid

Auto-fit responsive grid. Items wrap to maintain a minimum width — no media query needed.

```css
@layer ds-layout {
  .ds-grid {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(var(--grid-min, 16rem), 100%), 1fr)
    );
    gap: var(--grid-gap, var(--ds-space-4));
  }
}
```

Usage:
```html
<div class="ds-grid">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
  <div>Card 4</div>
</div>

<div class="ds-grid" style="--grid-min: 20rem; --grid-gap: var(--ds-space-6)">
  <!-- wider minimum, larger gap -->
</div>
```

### Switcher

Switches from horizontal to vertical layout based on a container width threshold. Good for content that should sit side-by-side on wide screens and stack on narrow ones.

```css
@layer ds-layout {
  .ds-switcher {
    display: flex;
    flex-wrap: wrap;
    gap: var(--switcher-gap, var(--ds-space-4));

    & > * {
      flex-grow: 1;
      flex-basis: calc((var(--switcher-threshold, 40rem) - 100%) * 999);
    }
  }
}
```

### Center

Horizontally and optionally vertically centres its content.

```css
@layer ds-layout {
  .ds-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--center-gap, var(--ds-space-4));
    max-width: var(--center-max, 60ch);
    margin-inline: auto;
  }
}
```

### Cover

Full-height layout with a centred principal element. Good for hero sections, error pages, or any full-viewport layout.

```css
@layer ds-layout {
  .ds-cover {
    display: flex;
    flex-direction: column;
    min-height: var(--cover-min-height, 100vh);
    padding: var(--cover-padding, var(--ds-space-4));

    & > * { margin-block: auto; }
    & > :first-child:not([data-cover-center]) { margin-block-start: 0; }
    & > :last-child:not([data-cover-center]) { margin-block-end: 0; }
  }
}
```

## Customisation pattern

Every utility uses a CSS custom property with a fallback to a design token. Consumers override by setting the property on the element:

```html
<!-- Default: uses --ds-space-4 -->
<div class="ds-stack">...</div>

<!-- Custom: uses --ds-space-8 -->
<div class="ds-stack" style="--stack-gap: var(--ds-space-8)">...</div>

<!-- Fully custom: uses a raw value (escape hatch) -->
<div class="ds-stack" style="--stack-gap: 2.5rem">...</div>
```

This keeps the utilities simple (one class, no variants to enumerate) while allowing any level of customisation.

## What this package does NOT do

- No React components — it's pure CSS classes
- No data attributes for styling — layout classes apply to the consumer's own HTML
- No opinion on what goes inside the layout — it wraps any content
- No responsive breakpoint classes — the layouts use intrinsic CSS (flexbox wrapping, auto-fit grid) that adapts to available space without media queries
- No duplication of the component library's concerns — layout is about spatial arrangement, not visual design
