# Craft fundamentals

The reasoning behind the entry's calls, and the failure shape each one
prevents. Read this when a judgment is contested or when the entry's rule
seems to give the wrong answer for a particular screen — the reasoning tells
you whether you have found an exception or a mistake.

## Why hierarchy is ranked, not weighted

A reader does not perceive "importance" as a continuous quantity; they
perceive an order. Two elements at 90% and 85% emphasis read as a tie, and a
tie costs the reader a decision. Ranking forces the author to answer the
question the reader will ask.

The channels, in order of reliability:

1. **Position** — first in reading order is the strongest claim on attention,
   and it survives every theme, every screen size, and every projector.
2. **Size** — reliable, but expensive: each distinct size the page uses makes
   every other size harder to place.
3. **Weight and space** — cheap and precise; the workhorse.
4. **Colour** — the weakest, because it is the one channel the palette
   themes deliberately vary and the one a colour-vision difference or a
   washed-out display can flatten.

*Failure shape:* a page where the author raised the emphasis of everything
they cared about, so nothing is emphasised.

## Gestalt, in the order it actually bites

- **Proximity** beats everything else. Readers group by distance before they
  group by anything the author intended.
- **Similarity** groups by shared treatment — which is why an inconsistent
  treatment reads as a claim of difference.
- **Common region** (a shared background or border) is powerful but heavy;
  it is the tool that gets reached for when proximity has been mismanaged,
  and it usually hides rather than fixes the problem.
- **Continuity** makes an aligned edge read as a single object — the reason
  alignment feels like a promise, and misalignment feels like a lie.

*Failure shape:* boxes drawn around groups whose spacing already contradicts
the grouping, so the page carries two conflicting structural signals.

## Space is the layout

Most layout defects are spacing defects wearing a costume. Before adding a
divider, a border, a background, or a card, try changing the ratio of
inner-group to between-group space. The system's spacing scale makes this
cheap; arbitrary values make it expensive and unrepeatable.

Rhythm matters more than any individual gap: a page with a consistent
vertical beat can be scanned by a reader who is not reading, which is the
normal case for a teacher looking for one thing during a lesson.

## Type: measure, scale, and restraint

- **Measure** (45–75 characters) is a legibility constraint, not a
  preference: too long and the eye loses the line return; too short and the
  return happens too often to build rhythm.
- **Scale steps** exist to be used sparingly. Content that needs six heading
  levels is content whose structure has not been decided.
- **Line height rises with measure** — a wide column needs more leading than
  a narrow one to keep line returns reliable.

### The two ladders

Type carries two independent ladders, and conflating them does damage in
both directions.

- **`h1`–`h6` is the document's outline.** It is what screen-reader users
  navigate by, what "jump to next heading" walks, and what a document
  summary is built from. It descends without skips because an outline is a
  tree, not a size ramp.
- **`oak-heading-1…7` is the visual step.** It says how loud this text is on
  this screen, and nothing about structure.

Oak pairs them deliberately: `<h1 class="oak-heading-2">` is the documented
masthead pairing, and specimens carry `<h3 class="oak-heading-5">`. The
correct instinct is not "one level, one class" but "choose each from its own
ladder".

*Failure shape, direction one:* an author wants a smaller rendered step and
demotes an `<h2>` to an `<h3>` to get it — silently breaking the outline,
keyboard navigation, and every assistive technology that reads structure.

*Failure shape, direction two:* an author believes levels and classes must
correspond, so every `<h2>` takes `oak-heading-2` regardless of how loud
that section should be — flattening visual hierarchy onto the document tree
and losing the ability to make one thing primary.

## Interaction: declare, confirm, forgive

Every control owes the user three things: a declaration that it can be
touched, a confirmation that it was, and a way back. The design system
carries the first two in `.oak-interactive`; the third is a composition
decision the author must make — a destructive action without a way back is a
design defect regardless of how it looks.

Target size is about the *hit area*, not the glyph. The common defect is a
control that looks large and responds only at its centre, which is
indistinguishable from a broken page to the person tapping it.

Two thresholds, kept apart. WCAG 2.2 **AA** requires 24×24 CSS pixels
([SC 2.5.8](https://www.w3.org/TR/WCAG22/#target-size-minimum), with its
exceptions for inline, essential, and user-agent-controlled targets).
**44×44 is AAA**
([SC 2.5.5](https://www.w3.org/TR/WCAG22/#target-size-enhanced)), and Oak
adopts it as the house floor because the audience is teachers on classroom
hardware, often standing, often on a tablet. Both numbers are real and they
mean different things: a 32px control misses Oak's floor and still meets AA
on size. Reporting it as an AA failure is a false conformance claim, and
this skill routes conformance judgment to the accessibility reviewer
precisely so that claim is never made casually.

## Motion

Motion is a change-of-state explanation. The system's 120/200ms durations
are short enough to feel immediate and long enough to be perceived. Two
questions decide whether an animation belongs: does something change
position or state, and would the reader be confused if it changed instantly?
Two noes mean the motion is decoration, and decoration is the first thing to
fail under reduced-motion — which is the tell that it was never carrying
meaning.

## Designing across four palette themes

The four token-bearing themes (light, dark, high-contrast, colour-safe) are
peers. Two consequences for composition:

- **Do not encode meaning in a hue relationship.** "The warm one is the
  active one" survives light and dark, and dies in colour-safe. Encode with
  shape, position, weight, or text, and let colour reinforce.
- **Check the extremes first.** A composition that holds in high-contrast
  almost always holds in light and dark; the reverse is not true. Designing
  light-first and patching the access themes afterwards is how a subtle
  layout arrives at a high-contrast theme with nothing left to distinguish
  its layers.

`system` is a selection, not a theme: it resolves to light or dark and mints
no tree (DDR-003/004). A design that treats it as a fifth palette will
produce a token tree that nothing consumes.

## Removal

Removal is last in the critique order because it is the strongest move and
the easiest to overuse. Remove when an element does not serve the screen's
one purpose, when it duplicates a signal already carried elsewhere, or when
it exists to fill space. Do not remove to reach a target density: a page is
not better for being sparse, it is better for being unambiguous.
