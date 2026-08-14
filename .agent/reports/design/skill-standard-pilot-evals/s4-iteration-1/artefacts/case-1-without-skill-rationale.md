# Rationale: composing the Year 8 history unit landing page

## Starting problem

The brief described five blocks — hero, unit summary, lesson list, downloads,
related units — all rendered at the same visual weight, so the page "reads as
a wall." The fix isn't new content; it's ranking the existing blocks and
expressing that ranking visually (size, position, density, colour weight),
so a teacher's eye lands on the right zone for whatever they came to do.

## Ranking, and why

1. **Lesson list — primary.** A unit landing page exists mainly so a teacher
   can get into a lesson. This is the block most visits are *for*, so it gets
   the biggest column (2fr of a 2fr/1fr grid on wide screens), the top
   position in the reading order after the hero, and the most detail per row
   (numbered, titled, one-line descriptor, explicit "View lesson" action).
   Numbering also does double duty as a sequencing cue — this is a taught
   order, not a menu.

2. **Hero — oriented but deliberately small.** A hero's job on a unit page is
   confirmation ("yes, this is the Year 8 Industrial Revolution unit") plus
   one way in, not persuasion. So it's a single compact band: breadcrumb,
   title, one-line subtitle, three metadata tags, one primary button that
   jumps straight to the lesson list. No full-bleed image, no stacked
   sub-copy — a big hero would out-rank the lesson list it's supposed to
   introduce.

3. **Unit summary and downloads — secondary, sidebar.** Both matter, but to a
   narrower moment: summary when a teacher is checking curriculum fit before
   committing; downloads when they're actually planning to teach it. Neither
   is the reason most people open the page, so both live in a narrower
   sidebar column, in cards with less internal size and detail than a lesson
   row. Downloads gets a scannable list of resource types up front and a
   single "download all" action at the foot of the card — the deliberate
   information architecture is "what's here, then take it all," not a list
   of individual links pretending to be equally important.

4. **Related units — tertiary, out of the main flow.** This is discovery, not
   task completion, and it competes hardest with the lesson list if given
   any real estate near the top. It's pushed to a separate band below
   everything else, given a small uppercase label instead of a heading of
   equal weight to "Lessons in this unit," rendered as a horizontally
   scrolling strip of small cards on a muted background — visually a
   footnote, not a fifth peer section.

## Mechanism, not just spacing

The hierarchy is carried by more than font-size: column width (2fr vs 1fr),
background contrast (white cards vs muted page background for the related
strip), border/heading weight (an `<h2>` for lessons vs a small uppercase
label for related units), and position (related units is the only block
below the fold on a typical laptop). Removing any one signal should still
leave the ranking legible from the others.

## What I did not do

I did not collapse or hide any block — cost-of-change and "no stopgaps"
concerns aside, the brief asked for composition, not deletion. Downloads and
summary are still fully present and readable; they're simply not competing
for the first thing the eye catches.
