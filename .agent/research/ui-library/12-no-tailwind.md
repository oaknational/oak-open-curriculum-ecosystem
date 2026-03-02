# 12. Why Not Tailwind

## Decision

Modern CSS (custom properties, nesting, `@layer`, `@container`, `color-mix()`, `@property`) provides everything needed for this use case. No additional abstraction is warranted.

## Arguments considered in favour

| Argument | Assessment |
|----------|------------|
| Large ecosystem, lots of examples | True, but patterns translate directly to CSS |
| Rapid prototyping speed | Not relevant in a library where styles are deliberate |
| Design constraint enforcement | CSS custom properties achieve the same constraint |
| shadcn/ui compatibility | shadcn is copy-paste, not a dependency; not relevant for a published library |
| Developer familiarity | CSS is more universally known than Tailwind |

## Decisive arguments against

### 1. Forced consumer dependency

Tailwind forces every consumer to install and configure Tailwind, PostCSS, and its build pipeline. A CSS file has no such requirement. For a shared library consumed by multiple applications, this coupling is a significant cost.

### 2. Multi-design-system complexity

With CSS custom properties, swapping design systems is a CSS import change. With Tailwind, each design system would need its own `tailwind.config` and the consumer would need to configure which one is active. The `--ds-*` custom property approach is fundamentally simpler for multi-theme support.

### 3. className merging

Tailwind requires `tailwind-merge` (or `clsx` + careful ordering) to handle conflicting utility classes when composing components. CSS with `@layer` has native cascade resolution. This is especially important for a library where consumers may want to override styles — the cascade handles this naturally.

### 4. Debugging opacity

A Tailwind component in DevTools shows a wall of utility classes. A data-attribute-styled component shows `data-ds="button" data-intent="primary" data-size="md"` — immediately meaningful, inspectable, and debuggable.

### 5. Library vs. application concern

Tailwind's value proposition is speed of authoring at the application level — trying many layout options quickly, iterating on spacing, experimenting with colours. Inside a component library, styles are deliberate, reviewed, and change infrequently. The speed benefit doesn't apply.

### 6. Data attributes are not reinventing Tailwind

A key concern that was raised and resolved: using data attributes for component variants is fundamentally different from Tailwind's utility approach. Data attributes select from **pre-defined semantic variants** (a button has 2-3 variant dimensions). Tailwind maps **individual CSS properties** to classes (hundreds of combinations). The distinction:

- `data-intent="primary"` → a coordinated set of styles (background, text colour, hover, focus) — this is a variant
- `class="bg-green-500 text-white px-4 py-2 rounded-md"` → individual CSS properties — this is a utility system

The library uses the former for components and plain CSS (or the optional layout package) for layout. It never creates data attributes that map to single CSS properties.

## Compromise: optional Tailwind presets

Each design system package can optionally export a **Tailwind preset** that maps `--ds-*` tokens into Tailwind utility classes. This lets consuming applications that use Tailwind get Oak/Zinc tokens in their Tailwind config:

```javascript
// packages/oak/src/tokens/tailwind-preset.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--ds-palette-primary)',
        'primary-light': 'var(--ds-palette-primary-light)',
        // ...
      },
      spacing: {
        1: 'var(--ds-space-1)',
        2: 'var(--ds-space-2)',
        // ...
      },
    },
  },
};
```

This gives Tailwind-using consumers the best of both worlds without the library itself depending on Tailwind.
