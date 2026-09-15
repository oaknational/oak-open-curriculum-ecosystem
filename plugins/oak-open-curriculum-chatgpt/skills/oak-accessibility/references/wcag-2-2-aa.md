# WCAG 2.2 AA — what it requires for Oak's output

This is a working summary of the [WCAG 2.2](https://www.w3.org/TR/WCAG22/) Level AA success
criteria that bear on the artefacts Oak produces. It is not a substitute for the spec — when in
doubt, read the criterion. Level AA includes everything at Level A.

## Perceivable

- **1.1.1 Non-text content (A).** Every meaningful image/icon/chart has a concise text
  alternative; decorative images are marked decorative (empty alt).
- **1.2.2 Captions (A)** and **1.2.4 Captions, live (AA).** Synchronised captions for video with
  audio. **1.2.3 / 1.2.5 Audio description (A/AA)** for meaningful visual-only content.
- **1.3.1 Info and relationships (A).** Real headings, lists, and tables with header cells —
  structure conveyed in the markup/format, not just by visual styling.
- **1.3.2 Meaningful sequence (A).** Reading order matches the intended order.
- **1.3.4 Orientation (AA).** Don't lock to portrait/landscape. **1.3.5 Identify input purpose (AA).**
- **1.4.1 Use of colour (A).** Colour is never the only means of conveying information or state.
- **1.4.3 Contrast minimum (AA).** Text **4.5:1**; large text (≥24px, or ≥19px bold) **3:1**.
  _Oak's brand target is **7:1** (AAA) — apply it where the brand applies._
- **1.4.4 Resize text (AA).** Usable at 200% zoom. **1.4.10 Reflow (AA).** Single column at 320px
  width, no 2-D scrolling. **1.4.11 Non-text contrast (AA).** UI components/graphics **3:1**.
- **1.4.5 Images of text (AA).** Use real text, not pictures of text (logos excepted).
  **1.4.12 Text spacing (AA).** Content survives increased line/letter/word spacing.

## Operable

- **2.1.1 Keyboard (A)** / **2.1.2 No keyboard trap (A).** Everything works by keyboard alone.
- **2.2.1 Timing adjustable (A)** / **2.2.2 Pause, stop, hide (A).** No imposed time limits;
  moving/auto-updating content can be paused.
- **2.3.1 Three flashes (A).** Nothing flashes more than three times per second.
- **2.4.2 Page titled (A)**, **2.4.3 Focus order (A)**, **2.4.4 Link purpose (A)** — link text makes
  sense out of context (no bare "click here"). **2.4.6 Headings and labels (AA)**,
  **2.4.7 Focus visible (AA)** — a visible focus indicator.
- **2.5.3 Label in name (A)**, **2.5.4 Motion actuation (A)**.

## Understandable

- **3.1.1 Language of page (A)** / **3.1.2 Language of parts (AA).** Set the document language.
- **3.2.3 Consistent navigation (AA)** / **3.2.4 Consistent identification (AA).**
- **3.3.1 Error identification (A)**, **3.3.2 Labels or instructions (A)**, **3.3.3 Error
  suggestion (AA)**, **3.3.4 Error prevention (AA)** — for forms and quizzes.

## Robust

- **4.1.2 Name, role, value (A)** / **4.1.3 Status messages (AA)** — controls expose their role to
  assistive tech; status updates are announced. (Note: **4.1.1 Parsing was removed in WCAG 2.2**.)

## New in WCAG 2.2 — easy to miss

- **2.4.11 Focus not obscured, minimum (AA).** A focused element isn't entirely hidden by sticky
  headers/footers or overlays.
- **2.5.7 Dragging movements (AA).** Anything done by dragging has a single-pointer (tap/click)
  alternative.
- **2.5.8 Target size, minimum (AA).** Pointer targets are at least **24×24 CSS px** (or have
  adequate spacing). The most common new miss for buttons, quiz options, and icon links.
- **3.2.6 Consistent help (A).** Help (contact, self-help) appears in a consistent place.
- **3.3.7 Redundant entry (A).** Don't make people re-enter information they already gave in the
  same process.
- **3.3.8 Accessible authentication, minimum (AA).** Don't require a cognitive test (e.g. solving a
  puzzle, transcribing) to log in.

## Where Oak goes to AAA

Oak does not target AAA across the board (some AAA criteria aren't achievable for long-form text or
all interactions), but adopts specific AAA bars:

- **1.4.6 Contrast (enhanced) — 7:1.** Oak's brand contrast target. Apply it for Oak-branded
  artefacts.

If a stakeholder asks for "AAA everywhere", push back: AA is the conformance target; AAA is applied
selectively where it's achievable and Oak has chosen to.
