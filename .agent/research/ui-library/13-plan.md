# 13. Effort Estimate and Phased Plan

## Phase 1: Infrastructure (Weeks 1–2)

Token packages, build pipeline, monorepo scaffolding.

| Task | Duration |
|------|----------|
| Monorepo scaffolding (pnpm workspaces, 6 packages) | 1 day |
| Token schema contract (TypeScript interfaces in `core`) | 1 day |
| Token validation tooling | 0.5 day |
| Shared variant types and component prop types | 0.5 day |
| Oak tokens (translate from existing oak-components) | 2 days |
| Zinc tokens (author from scratch) | 1.5 days |
| Dark theme for both design systems | 1 day |
| tsup build config for all packages | 1 day |
| Storybook with Oak/Zinc theme switcher | 1 day |
| Vitest + Testing Library + axe-core setup | 0.5 day |
| ESLint, CI pipeline | 0.5 day |
| **Subtotal** | **~10.5 days** |

## Phase 2: Headless + Foundation Components (Weeks 3–4)

Ark UI wrappers, foundation components, recipe CSS.

| Task | Duration |
|------|----------|
| Headless component wrappers (Ark UI integration) | 2 days |
| Recipe CSS: Heading, Text | 1 day |
| Recipe CSS: Button (all variants), IconButton | 1.5 days |
| Recipe CSS: Link | 0.5 day |
| Recipe CSS: Icon, Image | 0.5 day |
| Recipe CSS: Badge, Card, Separator, Kbd | 1 day |
| VisuallyHidden (pure CSS) | 0.25 day |
| Oak composed components (wire headless + recipes) | 1 day |
| Zinc composed components | 1 day |
| Storybook stories (both design systems) | 1.5 days |
| Tests (behaviour + a11y) | 1 day |
| **Subtotal** | **~11.25 days** |

## Phase 3: Interactive Components (Weeks 5–6)

Ark UI-powered interactive components.

| Task | Duration |
|------|----------|
| Recipe CSS: Dialog | 0.5 day |
| Recipe CSS: Accordion, Tabs | 1 day |
| Recipe CSS: Tooltip, Toast, Popover | 1 day |
| Recipe CSS: Select, Checkbox, RadioGroup, Switch | 1.5 days |
| Recipe CSS: TextInput, TextArea, Label | 1 day |
| Recipe CSS: Pagination, Breadcrumbs | 0.5 day |
| Recipe CSS: NavigationMenu | 0.5 day |
| Oak composed components | 1 day |
| Zinc composed components | 1 day |
| Storybook stories (both design systems) | 1.5 days |
| Tests (behaviour + a11y) | 1 day |
| **Subtotal** | **~10.5 days** |

## Phase 4: Layout Package (Week 7)

Pure CSS layout utilities.

| Task | Duration |
|------|----------|
| Container, Stack | 0.5 day |
| Cluster, Sidebar | 0.5 day |
| Grid, Switcher | 0.5 day |
| Center, Cover | 0.5 day |
| Documentation and usage examples | 0.5 day |
| Test with both design system tokens | 0.5 day |
| **Subtotal** | **~3 days** |

## Phase 5: Brand Components + Polish (Weeks 7–8)

Design-system-specific components, quality assurance.

| Task | Duration |
|------|----------|
| Oak: HandDrawnHR, JauntyAngleLabel, RoundIcon | 1.5 days |
| Oak: CookieBanner, InlineRegistrationBanner | 1 day |
| Zinc: GlitchDivider, PrecisionBadge, DataTag | 1 day |
| Comprehensive a11y audit (axe-core + manual, both systems) | 1.5 days |
| Colour contrast validation in CI | 0.5 day |
| Dark theme testing (both systems) | 0.5 day |
| Optional Tailwind presets for both design systems | 0.5 day |
| Documentation: usage guide, architecture guide, contributing guide | 1.5 days |
| **Subtotal** | **~8 days** |

## Total

| Metric | Value |
|--------|-------|
| Total working days | ~43 |
| Calendar weeks (comfortable pace) | 8–9 weeks |
| Calendar weeks (compressed, 1 dev) | 7 weeks |
| Calendar weeks (2 devs, some parallelism) | 5–6 weeks |

## What's parallelisable

With 2 developers:
- **Dev 1:** Infrastructure + headless + recipes
- **Dev 2:** Token authoring (Zinc) + layout package + Storybook

Brand components and polish are naturally parallelisable (one dev per design system).

## What this estimate does NOT include

- Migration of the Oak Web Application (see [14-migration.md](./14-migration.md))
- Migration of the AI Lesson Assistant
- Production deployment and monitoring
- Design review and iteration (visual QA with the design team)
