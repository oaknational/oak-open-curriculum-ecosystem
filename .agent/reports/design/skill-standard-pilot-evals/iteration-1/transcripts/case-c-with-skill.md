# Transcript

## Files read

- `<worktree>/.agent/skills/domain-craft/ui-design/design-system-usage/SKILL-CANONICAL.md`
- `<worktree>/.agent/skills/domain-craft/ui-design/design-system-usage/references/whats-where.md`
- `<worktree>/packages/design/oak-design-system/components.css` (grepped for `banner`/`Banner`, then read the inline-banners section around lines 690-760; grepped for `oak-guidance`/`oak-teacher-tip`/`oak-misconception`/`oak-block-label`/`border-left`, then read the authoring-blocks section around lines 1100-1200; grepped for `--inset`)
- `<worktree>/packages/design/oak-design-system/colors_and_type.css` (grepped for `--radius`/border-radius, `grey`, `yellow`/`lemon`/`accent`, `--border-solid`/`--space-`/`--inset-`/`--gap-`, `--bg-neutral`/`--bg-subtle`/`--border-primary`/`--border-neutral`/`--text-primary`, and `.oak-scope`; read lines 340-360 for the functional-fills comment block)
- `<worktree>/packages/design/oak-design-system/brand.css` (matched by a grep for `--inset`, confirming where the density-scaled inset tokens are declared)

## Reasoning

The skill's "what's where" map pointed straight at `colors_and_type.css` for tokens and `components.css` for the component class library, so I read those instead of guessing at token names. I grepped `components.css` for "banner" and for the lesson-authoring blocks (`oak-guidance`, `oak-misconception`, `oak-teacher-tip`) since those looked like the closest existing "grey box with a message" shapes, but confirmed none of them use a left-border-accent treatment — this callout has no ready-made class to copy, so it has to be assembled from primitives. I picked `--bg-neutral` over `--bg-subtle` for "grey background" because `--bg-neutral` is the token actually built for a visibly grey surface (grey20/grey60), whereas `--bg-subtle` is closer to white/black in each theme. The key finding was tracing `--border-accent` through the theme blocks: in the high-contrast theme it's redefined to resolve to solid black rather than lemon yellow, which is the reason to use the semantic token instead of a hard-coded yellow hex — hard-coding would silently break the high-contrast theme's contrast guarantees. Padding and radius came from matching the values already used by `.oak-banner` (`--inset-m`, `--radius-container`) so the note's spacing and corners feel consistent with the rest of the page.
