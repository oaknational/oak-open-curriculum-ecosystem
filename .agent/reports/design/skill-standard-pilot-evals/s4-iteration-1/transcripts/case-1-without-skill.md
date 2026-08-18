# Transcript notes

I worked from the task description alone, with no access to the design
system's actual source or any reference implementation, so every class name
and custom-property name (`oak-btn`, `oak-card`, `--oak-color-grey-06`, and
so on) is a plausible guess rather than a verified value. I treated the
"wall of equal weight" problem as a ranking problem first: decide which of
hero, summary, lessons, downloads, and related units a scanning teacher most
needs, then express that ranking through layout (column width, position,
whether a block sits above or below the fold) rather than through decoration.
Lessons became the dominant column because it's the task most visits are
for; the hero was deliberately shrunk so it orients without out-competing the
lesson list it introduces; summary and downloads moved into a narrower
sidebar as supporting, situational content; related units dropped to a
muted strip below the fold as the lowest-priority, discovery-only block. I
added a minimal layout-only `<style>` block for grid/flex structure, keeping
colours, spacing, and radii on `var(--oak-...)` tokens with literal
fallbacks so the page still renders sensibly even where a guessed token name
doesn't resolve against the real stylesheet.
