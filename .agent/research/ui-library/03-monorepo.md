# 3. Monorepo Structure

## Directory layout

```
oak-ui/
├── packages/
│   ├── core/                         # Design system infrastructure
│   │   ├── src/
│   │   │   ├── schema/               # Token schema contracts (TypeScript)
│   │   │   ├── types/                # Shared types (variants, component props)
│   │   │   ├── utils/                # Token validation, CSS utilities
│   │   │   └── test-helpers/         # renderWithDesignSystem, a11y matchers
│   │   └── package.json
│   │
│   ├── headless/                     # Headless components (behaviour only)
│   │   ├── src/
│   │   │   ├── components/           # Ark UI wrappers with data-attribute mapping
│   │   │   │   ├── button/
│   │   │   │   ├── dialog/
│   │   │   │   ├── accordion/
│   │   │   │   ├── tabs/
│   │   │   │   └── ...
│   │   │   └── index.ts
│   │   └── package.json              # depends on: core, @ark-ui/react
│   │
│   ├── recipes/                      # Shared CSS recipes (no framework)
│   │   ├── src/
│   │   │   ├── button.css
│   │   │   ├── dialog.css
│   │   │   ├── heading.css
│   │   │   ├── tabs.css
│   │   │   └── ...
│   │   ├── index.css                 # Aggregates all recipes
│   │   └── package.json              # no dependencies (pure CSS)
│   │
│   ├── layout/                       # Optional CSS layout utilities
│   │   ├── src/
│   │   │   ├── container.css
│   │   │   ├── stack.css
│   │   │   ├── cluster.css
│   │   │   ├── sidebar.css
│   │   │   ├── grid.css
│   │   │   ├── switcher.css
│   │   │   ├── center.css
│   │   │   └── cover.css
│   │   ├── index.css                 # Aggregates all layout utilities
│   │   └── package.json              # no dependencies (pure CSS)
│   │
│   ├── oak/                          # Oak design system
│   │   ├── src/
│   │   │   ├── tokens/
│   │   │   │   ├── tokens.css        # CSS custom properties
│   │   │   │   ├── tokens.ts         # TypeScript token values
│   │   │   │   └── tailwind-preset.js
│   │   │   ├── components/           # Composed: headless + recipes
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Dialog.tsx
│   │   │   │   ├── Heading.tsx
│   │   │   │   └── ...
│   │   │   ├── brand/                # Oak-specific branded elements
│   │   │   │   ├── HandDrawnHR.tsx
│   │   │   │   ├── JauntyAngleLabel.tsx
│   │   │   │   └── RoundIcon.tsx
│   │   │   └── index.ts
│   │   └── package.json              # depends on: core, headless, recipes
│   │
│   ├── zinc/                         # Zinc design system
│   │   ├── src/
│   │   │   ├── tokens/
│   │   │   │   ├── tokens.css
│   │   │   │   ├── tokens.ts
│   │   │   │   └── tailwind-preset.js
│   │   │   ├── components/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Dialog.tsx
│   │   │   │   └── ...
│   │   │   ├── brand/
│   │   │   │   ├── GlitchDivider.tsx
│   │   │   │   ├── PrecisionBadge.tsx
│   │   │   │   └── DataTag.tsx
│   │   │   └── index.ts
│   │   └── package.json              # depends on: core, headless, recipes
│   │
│   └── storybook/                    # Shared Storybook app
│       ├── .storybook/
│       │   ├── main.ts
│       │   └── preview.ts            # Theme switcher: Oak / Zinc
│       └── package.json
│
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── package.json
└── README.md
```

## Package dependency graph

```
core  (no internal deps)
  ↑
headless  (core, @ark-ui/react)
  ↑
recipes   (no internal deps — pure CSS)
  │
layout    (no internal deps — pure CSS)
  │
  ├── oak   (core, headless, recipes)
  └── zinc  (core, headless, recipes)
        ↑
     storybook (oak, zinc)
```

Note: `recipes` and `layout` have no internal package dependencies. They reference `--ds-*` CSS custom properties by convention, but the actual values come from whichever token CSS file the consumer loads. There is no build-time coupling.

## Published packages

| Package | npm name | Framework | What consumers get |
|---------|----------|-----------|--------------------|
| `core` | `@oaknational/ds-core` | None | Types, token schema, validation |
| `headless` | `@oaknational/ds-headless` | React | Unstyled accessible components |
| `recipes` | `@oaknational/ds-recipes` | None | CSS files for component styling |
| `layout` | `@oaknational/ds-layout` | None | Optional CSS layout utilities |
| `oak` | `@oaknational/ds-oak` | React | Fully styled Oak-branded components |
| `zinc` | `@oaknational/ds-zinc` | React | Fully styled Zinc-branded components |

Most consumers import only the design system package they need (`ds-oak`). The core, headless, and recipes packages are transitive dependencies. The layout package is a separate, optional install.

## Consumer install patterns

```bash
# Typical Oak app — components + optional layout
pnpm add @oaknational/ds-oak @oaknational/ds-layout

# Just the tokens (e.g. for a partner integration with custom components)
pnpm add @oaknational/ds-core  # types only
# plus import the tokens CSS from ds-oak's published tokens.css

# Just the layout utilities (e.g. for a static site using Oak tokens)
pnpm add @oaknational/ds-layout
```
