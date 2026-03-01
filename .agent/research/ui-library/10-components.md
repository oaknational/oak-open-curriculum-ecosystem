# 10. Component Scope

## Design principle

The library provides **semantic components with constrained variants**, not general-purpose layout or styling utilities. Each component has a clear purpose and a small number of variant dimensions.

## Shared components (built once in headless, styled by recipes, composed per design system)

### Foundation (~12 components)

| Component | Type | Variants | Notes |
|-----------|------|----------|-------|
| `Heading` | Typography | `level`: 1–6 | Renders h1–h6 semantically |
| `Text` | Typography | `variant`: body1, body2, body3, caption | Body text |
| `Link` | Navigation | — | Polymorphic via `asChild` (works with `next/link`) |
| `Button` | Action | `intent`: primary, secondary, tertiary, danger, ghost; `size`: sm, md, lg | All button styles unified |
| `IconButton` | Action | `intent`, `size` | Icon-only with accessible label |
| `Icon` | Media | — | SVG icon rendering |
| `Image` | Media | — | Polymorphic via `asChild` (works with `next/image`) |
| `VisuallyHidden` | A11y | — | Screen-reader-only content (pure CSS) |
| `Separator` | Structure | `orientation`: horizontal, vertical | Divider line |
| `Badge` | Label | `intent`: default, success, warning, error, info | Small status indicator |
| `Card` | Container | — | Content card with header/body/footer slots |
| `Kbd` | Typography | — | Keyboard shortcut display |

### Interactive (~15 components, Ark UI powered)

| Component | Ark Primitive | Variants | Notes |
|-----------|--------------|----------|-------|
| `Dialog` | Dialog | `size`: sm, md, lg, full | Modal with focus trap, overlay |
| `Accordion` | Accordion | — | Collapsible sections |
| `Tabs` | Tabs | — | Tab navigation + panels |
| `Tooltip` | Tooltip | — | Hover/focus tooltip |
| `Toast` | Toast | `intent`: default, success, error, info | Notifications |
| `Popover` | Popover | — | Floating content panel |
| `Select` | Select | `state`: default, error | Styled dropdown |
| `Checkbox` | Checkbox | `state`: default, error | With label and description |
| `RadioGroup` | RadioGroup | `state`: default, error | Radio buttons |
| `Switch` | Switch | — | Toggle switch |
| `TextInput` | N/A (native) | `state`: default, error, success | Input with label, error, description |
| `TextArea` | N/A (native) | `state`: default, error, success | Textarea |
| `Label` | N/A (native) | — | Form label |
| `Pagination` | N/A | — | Page navigation |
| `Breadcrumbs` | N/A | — | Navigation trail |
| `NavigationMenu` | Menu | — | Site navigation |

## Design-system-specific components

| Oak | Zinc |
|-----|------|
| HandDrawnHR | GlitchDivider |
| JauntyAngleLabel | PrecisionBadge |
| RoundIcon | DataTag |
| CookieBanner | — |
| InlineRegistrationBanner | — |

These are built entirely within their design system package. They may use design-system-specific CSS variables (e.g. `--oak-hand-drawn-*`) that aren't part of the shared schema.

## Explicitly out of scope

These are application-level composites that belong in consuming apps, not the shared library:

- **OWA teacher components** (~20): OakDownloadsAccordion, OakTeacherNotesModal, etc.
- **OWA pupil quiz components** (~15): OakQuizMatch, OakQuizOrder, etc.
- **House CAT components** (~3): OakCATQuestion, etc.
- **General-purpose layout primitives**: Box, Flex, Grid with arbitrary styling props — use the layout package or plain CSS instead
