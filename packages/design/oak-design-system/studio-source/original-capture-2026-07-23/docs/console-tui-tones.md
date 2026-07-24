# Console TUI tones — role→ANSI vocabulary

For React console TUIs (Ink — the pattern is the ecosystem repo's collaboration TUI, `agent-tools/src/collaboration-state/tui/`). Terminal cells have no CSS custom properties, so tokens port as a **vocabulary, not a stylesheet**: role names + an ANSI mapping + three rules. This is deliberately a document, not a package — TUIs stay on local Ink primitives with no runtime dependency on this project (their boundary, our agreement).

## The tone map

Mirror of the collaboration TUI's `StatusTone`, aligned to our tier-2 roles:

| Tone | Design-system role | ANSI 16 (Ink `color`) | Meaning |
|---|---|---|---|
| `active` | `--text-link` | `cyan` | in-progress, interactive, selected pane |
| `success` | `--text-success` | `green` | healthy, complete, claim active |
| `warning` | `--text-warning` | `yellow` | stale, expiring, lifecycle events |
| `danger` | `--text-error` | `red` | collision, failure, needs action |
| `muted` | `--text-subdued` | default + `dimColor` | metadata, timestamps, empty states |
| (structure) | `--border-primary` | `gray` border / `cyan` when active | panel borders, dividers |

```ts
// tones.ts — copy into the TUI, do not import across repos
export type StatusTone = 'active' | 'success' | 'warning' | 'danger' | 'muted';
export const toneColor: Record<StatusTone, string | undefined> =
  { active: 'cyan', success: 'green', warning: 'yellow', danger: 'red', muted: undefined };
```

## The three rules (the a11y charter, translated to cells)

1. **State is never colour alone.** Every toned element pairs colour with a text label — the TUI's `StatusBadge` renders `[active]`/`[stale]`/`[collision]` in brackets, and active panes get a `>` prefix as well as the cyan border. Keep both; the label is the accessible signal, the colour is the enhancement.
2. **Degrade honestly.** Honour `NO_COLOR` and dumb terminals: with colour stripped, the output must read identically (rule 1 makes this free). Never encode a value pair (e.g. red-vs-green only) — ANSI palette colours are themed by the *user's terminal*, so contrast is ultimately theirs, not ours.
3. **The text path is the accessible surface.** Terminal screen readers are line-based; interactive panes are chrome. The non-interactive output (`--format text` in the collaboration TUI) is the first-class accessible artefact — every piece of information visible in the panes must be present in it, in reading order, with the bracketed state labels intact.

## What does NOT port

Web headless libraries (Base UI etc. — §5b of consuming-nextjs.md) have no role in terminals; Ink's `<Box>`/`<Text>` are both framework and primitive layer. Focus rings, themes (`data-theme`), motion tokens and the contrast audit are web/print concepts — the terminal equivalents are the three rules above.
