---
title: 'One HTML Structure, Many CSS Compositions'
subtitle: 'Designing a fixed semantic DOM for maximal visual restructuring through CSS'
date: 2026-07-19
status: 'Technical design note'
provenance: >-
  Owner-authored, 2026-07-19. The source copy also lives in the Oak Open
  Curriculum Design System project (Claude Design) under uploads/, where its
  conclusions are absorbed as the region contract recorded in that system's
  DECISIONS.md ("Composition as contract"). This copy is the repo's durable
  design-principle home.
---

# One HTML Structure, Many CSS Compositions

## Purpose

This document describes how to ship **one fixed HTML structure** that can be transformed into radically different visual compositions using CSS alone.

The objective is not to use CSS reordering to repair faulty markup. It is to create a modern form of the idea demonstrated by **CSS Zen Garden**:

> A stable document provides the content and structure; independently replaceable stylesheets provide dramatically different visual interpretations.

CSS Zen Garden's defining rule was that designers could change the CSS and supporting visual assets, but not the HTML. Modern CSS provides substantially more compositional power than was available when that project began, particularly through:

- CSS Grid;
- Flexbox;
- positioned layout and stacking;
- media and container queries;
- custom properties;
- cascade layers;
- pseudo-elements and generated decoration;
- subgrid;
- emerging control over reading flow.

The central architectural conclusion is:

> **CSS Grid should normally be the primary compositional mechanism, but the transformability of the page is ultimately determined by the ancestry and granularity of the HTML.**

---

## 1. The design objective

The target is a document with three properties:

1. **The HTML is stable.** Themes do not add, remove, move or wrap elements.
2. **The content remains structurally meaningful.** The unstyled or minimally styled document still has a coherent sequence and usable semantic landmarks.
3. **Themes have maximal freedom over composition.** A stylesheet can place major regions beside, above, below, across, behind or partially overlapping one another.

This differs from an ordinary page template. In a conventional product, markup and CSS are often co-designed for one family of layouts. Here, the HTML must act as a deliberately versatile **compositional substrate**.

A useful conceptual model is:

```text
canonical semantic document
          ↓
stable, independently addressable regions
          ↓
theme-selected outer composition
          ↓
local layouts within each region
          ↓
decoration, typography, imagery and motion
```

---

## 2. The most important constraint: CSS cannot reparent elements

Grid and Flexbox can rearrange boxes participating in a formatting context, but ordinary CSS cannot move an element into a different parent in the document tree.

Consider:

```html
<main>
  <section class="quote">...</section>
</main>

<aside class="context">...</aside>
```

The `.quote` element is a child of `<main>`. It is not a sibling of `<main>` or `.context`, so it cannot ordinarily become an independently positioned item in the outer layout.

This leads to the most important HTML design principle:

> Put elements that themes may need to arrange independently into the same compositional context.

In practice, that normally means giving major page regions a shared parent:

```html
<div class="canvas">
  <header class="masthead">...</header>
  <nav class="navigation">...</nav>
  <main class="content">...</main>
  <aside class="context">...</aside>
  <section class="featured">...</section>
  <footer class="footer">...</footer>
</div>
```

Each direct child of `.canvas` can become an independently placed grid or flex item.

### Avoid visually motivated wrappers

This structure is less transformable:

```html
<div class="canvas">
  <div class="left-column">
    <nav class="navigation">...</nav>
    <aside class="context">...</aside>
  </div>

  <main class="content">...</main>
</div>
```

The `.left-column` wrapper couples the navigation and contextual content because the outer layout sees the wrapper as one item. A later theme that wants the navigation above the content and the aside below it must work around that coupling.

The rule is not “flatten all HTML”. Excessive flattening would discard useful semantics and local structure.

The better rule is:

> Keep ancestry shallow at each **theming boundary**, while retaining meaningful internal structure inside each region.

---

## 3. Grid is the idiomatic outer composition system

CSS Grid is a two-dimensional layout model. It is designed to control sizing and positioning across both rows and columns, whereas Flexbox is principally single-axis-oriented.

That makes Grid the natural foundation for this use case.

Grid can express:

- columns and rows;
- named regions;
- spanning;
- empty space;
- asymmetric layouts;
- overlap;
- independent alignment;
- explicit placement unrelated to source position;
- responsive recomposition.

Assign stable area names once:

```css
.canvas {
  display: grid;
  min-block-size: 100dvh;
}

.masthead {
  grid-area: masthead;
}
.navigation {
  grid-area: navigation;
}
.content {
  grid-area: content;
}
.context {
  grid-area: context;
}
.featured {
  grid-area: featured;
}
.footer {
  grid-area: footer;
}
```

Each theme can then define a different map.

### Conventional composition

```css
[data-theme='conventional'] .canvas {
  grid-template-columns: 16rem minmax(0, 1fr) 18rem;
  grid-template-areas:
    'masthead   masthead masthead'
    'navigation content  context'
    'navigation featured context'
    'footer     footer   footer';
}
```

### Editorial composition

```css
[data-theme='editorial'] .canvas {
  grid-template-columns:
    minmax(1rem, 1fr)
    minmax(0, 42rem)
    minmax(0, 22rem)
    minmax(1rem, 1fr);

  grid-template-areas:
    'masthead masthead masthead .'
    '.        content  context  .'
    '.        featured featured .'
    '.        navigation footer .';
}
```

### Sidebar-led composition

```css
[data-theme='sidebar-led'] .canvas {
  grid-template-columns: 18rem minmax(0, 1fr);
  grid-template-areas:
    'navigation masthead'
    'navigation content'
    'context    content'
    'featured   featured'
    'footer     footer';
}
```

Named areas are particularly suitable for theming because they express the composition in a readable, declarative form. They are usually clearer than unexplained numeric order values.

---

## 4. Grid is not limited to tidy rectangular page shells

A theme can use line-based placement instead of named areas to produce a poster-like composition:

```css
[data-theme='poster'] .canvas {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: repeat(10, minmax(4rem, auto));
  min-block-size: 100dvh;
}

[data-theme='poster'] .masthead {
  grid-column: 1 / 10;
  grid-row: 1 / 4;
}

[data-theme='poster'] .featured {
  grid-column: 7 / -1;
  grid-row: 2 / 7;
  z-index: 2;
}

[data-theme='poster'] .content {
  grid-column: 2 / 8;
  grid-row: 4 / 9;
}

[data-theme='poster'] .navigation {
  grid-column: 10 / -1;
  grid-row: 7 / 10;
}
```

Grid items can occupy overlapping cells. Combined with `z-index`, opacity, masks, transforms, backgrounds and blend modes, this permits visual compositions closer to print design, collage, exhibition graphics or motion design than to a conventional application shell.

The HTML remains unchanged.

---

## 5. Where Flexbox belongs

Flexbox is not an alternative that must be chosen instead of Grid for the whole document. It is a one-dimensional layout system for arranging items along a row or column.

Grid and Flexbox are local formatting contexts and compose naturally.

### Grid outside, Flexbox inside

```css
.canvas {
  display: grid;
}

.masthead {
  /* A grid item relative to .canvas */
  display: flex;

  /* A flex container relative to its own children */
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
```

The same element can therefore be:

- a grid item in relation to its parent;
- a flex container in relation to its children.

This is common and idiomatic.

A sensible broad heuristic is:

> **Grid for macro-composition; Flexbox for local one-dimensional arrangement.**

Good Flexbox candidates include:

- navigation links;
- button groups;
- mastheads;
- toolbars;
- metadata;
- tag lists;
- a simple sequence of cards;
- vertically stacked controls.

### Different themes may choose different layout models

The fixed markup does not have to use Grid in every theme.

```css
[data-theme='magazine'] .canvas {
  display: grid;
}

[data-theme='linear'] .canvas {
  display: flex;
  flex-direction: column;
}

[data-theme='minimal'] .canvas {
  display: block;
}
```

A theme can select the formatting model most appropriate to its visual concept.

---

## 6. Reordering with `order`

Both Grid and Flexbox support the `order` property.

For a deliberately linear theme, it may be entirely appropriate:

```css
[data-theme='linear'] .canvas {
  display: flex;
  flex-direction: column;
}

[data-theme='linear'] .masthead {
  order: 1;
}
[data-theme='linear'] .featured {
  order: 2;
}
[data-theme='linear'] .content {
  order: 3;
}
[data-theme='linear'] .context {
  order: 4;
}
[data-theme='linear'] .navigation {
  order: 5;
}
[data-theme='linear'] .footer {
  order: 6;
}
```

It can also be parameterised:

```css
.canvas > * {
  order: var(--theme-order, 0);
}

[data-theme='linear'] .masthead {
  --theme-order: 1;
}
[data-theme='linear'] .featured {
  --theme-order: 2;
}
[data-theme='linear'] .content {
  --theme-order: 3;
}
[data-theme='linear'] .context {
  --theme-order: 4;
}
[data-theme='linear'] .navigation {
  --theme-order: 5;
}
[data-theme='linear'] .footer {
  --theme-order: 6;
}
```

However, `order` answers only a sequential question: which item comes before another in the layout algorithm.

Grid placement can additionally describe:

- the row;
- the column;
- the span;
- the size relationship;
- unused cells;
- overlap;
- alignment within the allocated area.

For maximal visual restructuring, `order` is a useful specialised tool, while Grid placement is the more expressive compositional language.

---

## 7. A practical HTML architecture

A strong fixed document might look like this:

```html
<body data-theme="editorial">
  <div class="canvas">
    <header class="region masthead" data-region="masthead">
      <a class="identity" href="/">...</a>
      <p class="strapline">...</p>
    </header>

    <nav class="region navigation" data-region="navigation" aria-label="Primary">...</nav>

    <main class="region content" data-region="content">
      <header class="content-heading">...</header>
      <div class="content-body">...</div>
    </main>

    <aside class="region context" data-region="context">...</aside>

    <section class="region featured" data-region="featured">...</section>

    <footer class="region footer" data-region="footer">...</footer>
  </div>
</body>
```

This structure offers:

- semantic landmarks;
- stable class hooks;
- optional explicit `data-region` hooks;
- independently movable outer regions;
- meaningful internal grouping within each region;
- no wrapper that encodes one intended visual arrangement.

The `.region` class provides a common styling hook without erasing the more meaningful named classes.

---

## 8. Theme organisation

For a small showcase, a theme can be selected with an attribute:

```html
<body data-theme="poster"></body>
```

For a stronger CSS Zen Garden model, each design can load a different theme stylesheet:

```html
<link rel="stylesheet" href="/css/foundation.css" />
<link rel="stylesheet" href="/themes/poster.css" />
```

A useful project structure is:

```text
styles/
├── reset.css
├── foundation.css
├── regions.css
├── components.css
└── themes/
    ├── conventional.css
    ├── editorial.css
    ├── poster.css
    └── immersive.css
```

Possible responsibilities:

- `reset.css`: browser-normalisation decisions;
- `foundation.css`: document defaults, typography primitives and basic resilience;
- `regions.css`: stable region names and minimum structural rules;
- `components.css`: local structures inside regions;
- `themes/*.css`: composition, theme typography, decoration, imagery and motion.

A theme should be able to override almost everything visual while relying on the same stable selectors.

---

## 9. Cascade layers

Cascade layers make the override hierarchy explicit:

```css
@layer reset, foundation, regions, components, theme, utilities;
```

A possible organisation is:

```css
@layer reset {
  /* Normalisation */
}

@layer foundation {
  html {
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
}

@layer regions {
  .canvas {
    display: grid;
  }

  .masthead {
    grid-area: masthead;
  }
  .navigation {
    grid-area: navigation;
  }
  .content {
    grid-area: content;
  }
  .context {
    grid-area: context;
  }
  .featured {
    grid-area: featured;
  }
  .footer {
    grid-area: footer;
  }
}

@layer theme {
  [data-theme='editorial'] .canvas {
    /* Theme composition */
  }
}
```

This is useful where themes need broad authority without relying on escalating selector specificity.

---

## 10. Custom properties: useful, but do not over-tokenise composition

Custom properties are excellent for theme parameters:

```css
.canvas {
  gap: var(--canvas-gap, 1rem);
  padding: var(--canvas-padding, 1rem);
}

[data-theme='editorial'] {
  --canvas-gap: clamp(1rem, 3vw, 4rem);
  --canvas-padding: clamp(1rem, 4vw, 6rem);
}
```

They are well suited to:

- spacing;
- track sizes;
- maximum widths;
- type scales;
- borders;
- radii;
- shadows;
- animation durations;
- image treatments;
- local ordering values.

They can also carry a grid template:

```css
.canvas {
  display: grid;
  grid-template-columns: var(--page-columns);
  grid-template-areas: var(--page-areas);
}

[data-theme='standard'] {
  --page-columns: minmax(0, 1fr) 18rem;
  --page-areas: 'masthead masthead' 'content  context' 'footer   footer';
}
```

However, radically different compositions are often clearer as direct declarations in their own theme blocks. A universal matrix of `--row`, `--column`, `--span`, `--order` and `--alignment` variables can become a less readable programming language built on top of CSS.

Use variables for values that are meaningfully parameterised. Let CSS remain CSS where the design itself is different.

---

## 11. Responsive and contextual recomposition

Themes need not define one fixed arrangement.

A theme can restructure itself through media queries:

```css
[data-theme='editorial'] .canvas {
  grid-template-columns: 1fr;
  grid-template-areas:
    'masthead'
    'featured'
    'content'
    'context'
    'navigation'
    'footer';
}

@media (width >= 64rem) {
  [data-theme='editorial'] .canvas {
    grid-template-columns:
      minmax(1rem, 1fr)
      minmax(0, 42rem)
      minmax(0, 22rem)
      minmax(1rem, 1fr);

    grid-template-areas:
      'masthead masthead masthead .'
      '.        content  context  .'
      '.        featured featured .'
      '.        navigation footer .';
  }
}
```

Container queries are particularly useful inside movable regions. A component cannot assume that a theme places it in a wide main column rather than a narrow sidebar.

```css
.featured {
  container-type: inline-size;
}

.featured-layout {
  display: grid;
  gap: 1rem;
}

@container (width >= 36rem) {
  .featured-layout {
    grid-template-columns: 1fr 1fr;
  }
}
```

This separates two concerns:

- the theme decides **where a region goes**;
- the region decides **how its contents respond to the space it receives**.

That makes the fixed HTML substantially more reusable across compositions.

---

## 12. Decorative freedom without extra markup

Pseudo-elements provide theme-specific visual material without changing the document:

```css
[data-theme='ornate'] .featured {
  position: relative;
  isolation: isolate;
}

[data-theme='ornate'] .featured::before,
[data-theme='ornate'] .featured::after {
  content: '';
  position: absolute;
  pointer-events: none;
  z-index: -1;
}

[data-theme='ornate'] .featured::before {
  inset: -3rem 20% auto -5rem;
  block-size: 12rem;
  border: 0.25rem solid currentColor;
  transform: rotate(-6deg);
}

[data-theme='ornate'] .featured::after {
  inset: auto -2rem -4rem 35%;
  block-size: 9rem;
  background: radial-gradient(circle, currentColor 0 8%, transparent 9%);
  background-size: 1.5rem 1.5rem;
  opacity: 0.2;
}
```

Themes can also vary:

- multiple backgrounds;
- gradients;
- masks and clipping;
- filters and blending;
- transforms;
- writing modes;
- counters;
- generated labels;
- scroll-driven or ordinary animation;
- sticky and fixed positioning;
- typography and variable-font axes.

Generated content should remain decorative or supplementary. Essential information should remain in the HTML.

---

## 13. `display: contents`: a limited escape hatch

`display: contents` suppresses an element's own principal box while allowing its child boxes to participate as though the wrapper box were absent.

For example:

```html
<div class="canvas">
  <main class="content">
    <section class="introduction">...</section>
    <section class="details">...</section>
  </main>
</div>
```

A theme could use:

```css
[data-theme='deconstructed'] .content {
  display: contents;
}
```

The sections may then participate more directly in the layout established by `.canvas`.

This can increase compositional freedom, but it should not be the foundation of the architecture because:

- the wrapper no longer produces a box;
- backgrounds, borders, dimensions and positioning expected on that box disappear;
- accessibility behaviour requires careful cross-browser testing;
- the theme becomes dependent on details of the inner markup;
- it can make the CSS harder to reason about.

Treat it as an optional advanced theme technique, not as general CSS reparenting.

A `<details>` element is the measured exception to "the wrapper box is absent": the browser renders its content through a user-agent shadow slot whose box (`::details-content`) survives `display: contents` on the element and becomes the single flex item, so a disclosure dissolved with `display: contents` alone still stacks its controls in a column (measured on the showcase, 2026-09-04: a two-row strip under a one-row sticky offset, while the lane's spec passed because it asserted only "summary hidden, radio visible"). Where the engine exposes `::details-content` (Chromium at the time of writing; not yet cross-engine), dissolve both — the element and its `::details-content`; elsewhere keep the element's own box and make it the flex container, since a declaration on an unsupported pseudo-element is ignored and the double dissolve then cures nothing. An `@supports selector(::details-content)` branch is the shape of that fallback; the showcase's disclosure CSS dissolves unconditionally and does not yet carry it (2026-09-07). On either path prove the wide face with geometry: the controls share one horizontal band and the strip's height equals its one-row height.

---

## 14. Subgrid

Subgrid addresses a related but different problem.

It allows a nested grid to use tracks defined by its parent grid:

```css
.canvas {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.content {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 2 / 10;
}
```

Subgrid helps nested content align with the outer composition. It does **not** make descendants into direct siblings of the outer grid's other items.

Therefore:

- use shallow sibling regions when elements must move independently;
- use subgrid when nested elements should align with outer tracks while retaining their parent.

---

## 15. Source order, visual order and reading flow

A fixed document still needs a canonical sequence. That sequence should be coherent when:

- CSS is unavailable;
- the content is linearised;
- a basic user agent renders it;
- a theme does not alter its composition.

Traditionally, Grid placement, Flexbox direction and `order` alter visual layout without necessarily changing DOM order, speech order or sequential keyboard navigation.

For the present objective, this does **not** mean visual restructuring is illegitimate. It means the canonical HTML should represent a defensible base narrative, while themes should be tested to ensure visual movement does not create a confusing focus path.

A reasonable canonical order might be:

```html
<header>...</header>
<nav>...</nav>
<main>...</main>
<aside>...</aside>
<section class="featured">...</section>
<footer>...</footer>
```

There is no universally correct order independent of the document's meaning. The point is to choose one deliberately.

### Emerging `reading-flow` support

CSS Display Level 4 defines `reading-flow` and `reading-order`. These are intended to influence the order in which children are exposed to speech and visited through linear sequential navigation.

For a grid:

```css
.canvas {
  display: grid;
  reading-flow: grid-rows;
}
```

This is directly relevant to a system in which different themes may create genuinely different visual reading sequences.

Because support is still developing, it should be treated as progressive enhancement rather than the sole accessibility mechanism:

```css
@supports (reading-flow: grid-rows) {
  [data-theme='editorial'] .canvas {
    reading-flow: grid-rows;
  }
}
```

The fixed DOM should still have a coherent base order.

---

## 16. Maximising transformability: practical rules

### 16.1 Make independently movable things siblings

If two elements might need to occupy unrelated places in different themes, avoid nesting one inside the other solely for the first design.

### 16.2 Give important regions stable names

Prefer durable hooks:

```html
<aside class="region context" data-region="context"></aside>
```

Avoid selectors that depend on incidental position:

```css
.canvas > :nth-child(4) {
  /* Fragile */
}
```

### 16.3 Keep component internals meaningful but adaptable

Outer regions should be independently positionable. Their internal structures can remain nested and semantic.

### 16.4 Avoid wrappers that encode columns

Use wrappers for meaning, behaviour or a genuine local formatting context—not merely because the first theme has “a left column”.

### 16.5 Separate composition from component adaptation

Use Grid and theme CSS to place regions. Use container queries to adapt the contents of those regions to the space they receive.

### 16.6 Permit themes to replace the layout model

Do not assume every theme must inherit the same `display: grid` declaration. A theme may use Grid, Flexbox, normal flow or positioned layout.

### 16.7 Use direct theme declarations for genuinely different designs

Do not force every visual concept through one enormous token schema.

### 16.8 Treat pseudo-elements as theme-owned visual material

They provide decoration without polluting the shared HTML.

### 16.9 Define invariants explicitly

A theme contract might state:

- all essential document content remains available;
- semantic landmarks remain intact;
- themes may visually reorder and overlap regions;
- themes may hide only content designated optional;
- interactive content remains operable;
- reduced-motion preferences are respected;
- themes work across an agreed viewport range;
- experimental properties require fallbacks.

### 16.10 Test the document as a matrix

Each theme should be tested across:

- viewport sizes;
- zoom levels;
- text enlargement;
- keyboard navigation;
- reduced motion;
- forced colours or high contrast;
- long and short content;
- missing optional media;
- localisation and longer strings;
- browser support targets.

Maximum compositional freedom increases the importance of systematic theme validation.

---

## 17. Recommended baseline implementation

### HTML

```html
<body data-theme="conventional">
  <div class="canvas">
    <header class="region masthead" data-region="masthead">...</header>

    <nav class="region navigation" data-region="navigation" aria-label="Primary">...</nav>

    <main class="region content" data-region="content">...</main>

    <aside class="region context" data-region="context">...</aside>

    <section class="region featured" data-region="featured">...</section>

    <footer class="region footer" data-region="footer">...</footer>
  </div>
</body>
```

### Structural CSS

```css
@layer reset, foundation, regions, components, theme, utilities;

@layer foundation {
  :root {
    font-family: system-ui, sans-serif;
  }

  html {
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  body {
    margin: 0;
  }
}

@layer regions {
  .canvas {
    display: grid;
    min-block-size: 100dvh;
  }

  .masthead {
    grid-area: masthead;
  }
  .navigation {
    grid-area: navigation;
  }
  .content {
    grid-area: content;
  }
  .context {
    grid-area: context;
  }
  .featured {
    grid-area: featured;
  }
  .footer {
    grid-area: footer;
  }

  .region {
    min-inline-size: 0;
  }
}
```

### One conventional theme

```css
@layer theme {
  [data-theme='conventional'] .canvas {
    grid-template-columns:
      minmax(12rem, 18rem)
      minmax(0, 1fr)
      minmax(14rem, 20rem);

    grid-template-areas:
      'masthead   masthead masthead'
      'navigation content  context'
      'navigation featured context'
      'footer     footer   footer';

    gap: clamp(0.75rem, 2vw, 2rem);
    padding: clamp(0.75rem, 2vw, 2rem);
  }
}
```

### A radically different theme

```css
@layer theme {
  [data-theme='poster'] .canvas {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-template-rows: repeat(12, minmax(3rem, auto));
    gap: 0;
    overflow: clip;
  }

  [data-theme='poster'] .masthead {
    grid-column: 1 / 9;
    grid-row: 1 / 4;
    z-index: 3;
  }

  [data-theme='poster'] .featured {
    grid-column: 6 / -1;
    grid-row: 2 / 8;
    z-index: 1;
  }

  [data-theme='poster'] .content {
    grid-column: 2 / 8;
    grid-row: 4 / 11;
    z-index: 2;
  }

  [data-theme='poster'] .context {
    grid-column: 8 / 12;
    grid-row: 8 / 12;
    z-index: 4;
  }

  [data-theme='poster'] .navigation {
    grid-column: 9 / -1;
    grid-row: 1;
    z-index: 5;

    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }

  [data-theme='poster'] .footer {
    grid-column: 1 / 7;
    grid-row: 12;
  }
}
```

---

## 18. Final recommendation

For one shipped HTML structure with maximal visual transformability:

1. Build a canonical semantic document.
2. Identify major elements that themes may need to move independently.
3. Make those regions siblings at a shared theming boundary.
4. Give every region a stable semantic and CSS identity.
5. Use CSS Grid as the default outer compositional canvas.
6. Use Flexbox or nested Grid within individual regions.
7. Allow individual themes to replace the layout model entirely.
8. Use named grid areas for readable page maps and line placement for freer compositions.
9. Use `order` for genuinely sequential themes, not as the sole composition system.
10. Use container queries so components adapt to whatever space a theme gives them.
11. Use pseudo-elements and CSS imagery for theme-specific visual material.
12. Use `display: contents` only as a carefully tested escape hatch.
13. Use subgrid for nested alignment, not as a substitute for independent sibling regions.
14. Preserve a coherent canonical DOM sequence.
15. Treat `reading-flow` as promising progressive enhancement until support is sufficiently broad.
16. Establish a theme contract and test every theme systematically.

The concise architectural model is:

```text
one canonical semantic document
        ↓
shallow, independently addressable regions
        ↓
Grid as the principal compositional canvas
        ↓
Grid, Flexbox or flow inside each region
        ↓
independent theme stylesheets
```

The decisive insight is that **Grid supplies the compositional power, but HTML ancestry sets the ceiling on that power**.

---

## References

All links below point directly to the original source or the maintaining documentation site.

## CSS Zen Garden

- [CSS Zen Garden: The Beauty of CSS Design](https://csszengarden.com/)
- [CSS Zen Garden: About](https://csszengarden.com/pages/about/)
- [CSS Zen Garden: All Designs](https://csszengarden.com/pages/alldesigns/)
- [Dave Shea's CSS Zen Garden project page](https://daveshea.com/projects/zen/)

## CSS specifications

- [CSS Grid Layout Module Level 1 — W3C](https://www.w3.org/TR/css-grid-1/)
- [CSS Grid Layout Module Level 2 — W3C](https://www.w3.org/TR/css-grid-2/)
- [CSS Flexible Box Layout Module Level 1 — W3C](https://www.w3.org/TR/css-flexbox-1/)
- [CSS Display Module Level 4 — W3C](https://www.w3.org/TR/css-display-4/)
- [CSS Containment Module Level 3 — W3C](https://www.w3.org/TR/css-contain-3/)
- [CSS Cascading and Inheritance Level 5 — W3C](https://www.w3.org/TR/css-cascade-5/)
- [CSS Custom Properties for Cascading Variables Level 1 — W3C](https://www.w3.org/TR/css-variables-1/)

## Maintained technical documentation

- [CSS Grid layout — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout)
- [`grid-template-areas` — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-areas)
- [Grid layout and accessibility — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Accessibility)
- [Flexbox — MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox)
- [Relationship of Flexbox to other layout methods — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Relationship_with_other_layout_methods)
- [`display` — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/display)
- [`display: contents` and accessibility notes — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/display-box)
- [Container queries — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
- [Custom properties — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables)
- [`@layer` — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40layer)
- [`@supports` — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40supports)
- [`reading-flow` — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/reading-flow)
- [`reading-order` — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/reading-order)
