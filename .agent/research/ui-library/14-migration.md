# 14. Migration Strategy for Oak Consumers

## Approach: incremental, side-by-side

Both libraries (`@oaknational/oak-components` and `@oaknational/ds-oak`) can coexist in the same application. No big-bang migration required.

## Migration steps

1. **Install** `@oaknational/ds-oak` and optionally `@oaknational/ds-layout` alongside existing `oak-components`
2. **Import Oak token CSS** at the app root (e.g. in `layout.tsx` or `_app.tsx`)
3. **Migrate page by page**, replacing `oak-components` imports with `ds-oak` imports
4. **Replace layout primitives** — `OakBox`, `OakFlex`, `OakGrid` → layout package classes or plain CSS using `var(--ds-space-*)` tokens
5. **Remove `OakThemeProvider`** once all pages are migrated (design system tokens are CSS, not React context)
6. **Uninstall** `styled-components` and `@oaknational/oak-components`

## API translation guide

### Typography

```tsx
// Before
<OakHeading tag="h1" $font={["heading-3", "heading-2"]}>Title</OakHeading>
<OakP $font="body-1">Text</OakP>

// After
<Heading level={1}>Title</Heading>
<Text variant="body1">Text</Text>
```

Responsive typography: handled by the consumer via CSS media/container queries on the parent, or by the recipe's responsive styles. The component API doesn't encode responsive breakpoints.

### Buttons

```tsx
// Before
<OakPrimaryButton onClick={fn}>Click</OakPrimaryButton>
<OakSecondaryButton onClick={fn}>Click</OakSecondaryButton>

// After
<Button intent="primary" onClick={fn}>Click</Button>
<Button intent="secondary" onClick={fn}>Click</Button>
```

### Layout

```tsx
// Before
<OakFlex $flexDirection="column" $gap="spacing-4" $pa="spacing-8">
  <OakBox $background="bg-primary">...</OakBox>
</OakFlex>

// After (option A: layout package)
<div class="ds-stack" style="--stack-gap: var(--ds-space-4)">
  <div style="padding: var(--ds-space-8); background: var(--ds-color-bg-primary)">
    ...
  </div>
</div>

// After (option B: plain CSS)
<div className={styles.myLayout}>...</div>
// .myLayout { display: flex; flex-direction: column; gap: var(--ds-space-4); padding: var(--ds-space-8); }

// After (option C: if the consumer uses Tailwind with the Oak preset)
<div className="flex flex-col gap-4 p-8 bg-primary">...</div>
```

### Modal

```tsx
// Before
<OakModalCenter isOpen={open} onClose={close}>
  <OakHeading tag="h2">Title</OakHeading>
  <OakP>Content</OakP>
</OakModalCenter>

// After
<Dialog.Root open={open} onOpenChange={close}>
  <Dialog.Content size="md">
    <Dialog.Title>Title</Dialog.Title>
    <Dialog.Description>Content</Dialog.Description>
    <Dialog.CloseTrigger />
  </Dialog.Content>
</Dialog.Root>
```

### Links with Next.js

```tsx
// Before
<OakLink href="/about">About</OakLink>

// After
<Link asChild>
  <NextLink href="/about">About</NextLink>
</Link>
```

## The biggest migration change: layout

The most significant API shift is moving from `OakBox`/`OakFlex`/`OakGrid` (components with `$`-prefixed styling props) to plain CSS with design tokens. This is the most labour-intensive part of migration because:

- These primitives are used on virtually every page
- Each usage is slightly different (different padding, gap, direction, etc.)
- The replacement isn't 1:1 — it requires thinking about the layout intent and choosing the right approach

Mitigation: the layout package covers the most common patterns (Stack, Grid, Sidebar, etc.) and design tokens make one-off styles straightforward.

## Estimated effort for the Oak Web Application

- ~40 files with oak-components usage
- Average per file: 1–3 hours (typography/button changes are fast; layout changes take longer)
- **Total: 3–5 weeks** at comfortable pace
- Parallelisable across developers (page-by-page, no conflicts)

## Estimated effort for the AI Lesson Assistant

- Smaller surface area (~15–20 files using oak-components)
- **Total: 1–2 weeks**
- Could serve as the pilot migration to validate the approach before tackling the OWA
