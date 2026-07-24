# Pairing guide — Ark UI / Zag.js · the non-React and multi-framework option

Ark UI (`@ark-ui/react` / `/vue` / `/solid` / `/svelte`) wraps **Zag.js** — framework-agnostic WAI-ARIA state machines with per-spec Playwright e2e tests — so the same widget behaviour ships identically across frameworks, and Zag itself runs in **vanilla JS / web components**. MIT (Chakra team). This is the pairing when a consumer isn't React, spans frameworks, or needs a widget behaviour inside a web component — capabilities Base UI and React Aria don't have. In a pure-React Next app, prefer Base UI (§5b). Pin versions at adoption (Ark and Zag move together) and record them here. Shared obligations: `wrapped-widget-a11y-checklist.md`.

## Install & shape

```bash
pnpm add @ark-ui/react        # React apps
pnpm add @zag-js/tabs @zag-js/vanilla   # or: machine + adapter for vanilla/web components
```

Ark: compound parts (`Tabs.Root`/`Tabs.List`/`Tabs.Trigger`/`Tabs.Content`). Zag direct: `machine` + `connect` returns prop getters you spread onto your own markup — the most control, the most assembly.

## Where our rules land

Every part carries **`data-scope` + `data-part`** plus state as `data-*` — one CSS vocabulary across all frameworks, which is exactly how our token layer likes it:

| Our rule | Ark/Zag hook |
|---|---|
| Double focus ring | `:focus-visible` on parts (real DOM focus); `[data-highlighted]` for virtual focus — style both |
| State never colour alone | `[data-state="active|checked|open"]`, `[data-selected]`, `[data-disabled]` — pair with border/icon/text |
| Motion axis | Transitions are yours on `[data-state]` changes — motion verbs only |
| Semantic HTML | Parts render correct elements; `asChild` swaps in a more semantic one |
| Theming/tenants | `[data-scope="tabs"][data-part="trigger"]` selectors work in any consumer — no framework in the stylesheet |

## Worked example — Oak-tokened Tabs (selectors work for React, Vue, or vanilla alike)

```tsx
'use client';
import { Tabs } from '@ark-ui/react/tabs';

export function UnitTabs() {
  return (
    <Tabs.Root defaultValue="lessons">
      <Tabs.List className="ark-tabs__list">
        <Tabs.Trigger value="lessons" className="ark-tabs__trigger">Lessons</Tabs.Trigger>
        <Tabs.Trigger value="quiz" className="ark-tabs__trigger">Quiz</Tabs.Trigger>
        <Tabs.Indicator className="ark-tabs__indicator" />
      </Tabs.List>
      <Tabs.Content value="lessons" className="ark-tabs__content">…</Tabs.Content>
      <Tabs.Content value="quiz" className="ark-tabs__content">…</Tabs.Content>
    </Tabs.Root>
  );
}
```

```css
:root { --tabs-trigger-pad: var(--space-8) var(--space-16); --tabs-active-border: var(--border-solid-l) solid var(--border-primary); }
[data-scope="tabs"][data-part="list"] { display: flex; gap: var(--gap-s); border-bottom: var(--border-solid-m) solid var(--border-primary); }
[data-scope="tabs"][data-part="trigger"] { padding: var(--tabs-trigger-pad); min-height: var(--size-target); font: var(--type-label); color: var(--text-subdued); background: none; border: 0; border-bottom: var(--border-solid-l) solid transparent; }
[data-scope="tabs"][data-part="trigger"][data-state="active"] { color: var(--text-primary); font-weight: var(--weight-bold); border-bottom: var(--tabs-active-border); } /* colour + weight + border */
[data-scope="tabs"][data-part="trigger"]:focus-visible { outline: var(--focus-outline); outline-offset: var(--focus-outline-offset); box-shadow: var(--focus-ring); }
[data-scope="tabs"][data-part="content"] { padding-block: var(--inset-m); }
```

Done-criteria: arrow keys move tabs with SR announcement; active tab announced as selected; single `Tab` reaches the panel; pairing in the audit ×4 themes.

## Gotchas

- The state-machine model means behaviour props differ from Radix/Base UI conventions (`onValueChange` payloads are objects) — read the machine's docs, don't guess by analogy.
- Smaller ecosystem: fewer third-party examples; the Zag docs are the source of truth for edge behaviour.
- Don't mix Ark and Base UI for the *same* widget class in one app; split by capability or framework, and record the split in the app's README.
