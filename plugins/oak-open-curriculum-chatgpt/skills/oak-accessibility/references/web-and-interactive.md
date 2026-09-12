# Accessibility: web pages and interactive content

For HTML/web output, forms, and anything clickable — including **quizzes** (starter/exit/unit) and
other interactive learning content. This is where the WCAG 2.2 additions bite hardest.

## Structure and semantics

- **Real landmarks and headings.** Use `<header>`, `<nav>`, `<main>`, `<footer>`, and a correct
  heading hierarchy (one `<h1>`, then `<h2>`/`<h3>` in order). Don't fake headings/buttons with
  styled `<div>`s.
- **Native elements first.** Use `<button>`, `<a href>`, `<label>`, `<input>`, `<table>` with
  `<th>` — they bring keyboard support, roles, and states for free. Reach for ARIA only to fill a
  gap, and follow "no ARIA is better than bad ARIA".
- **Page title** describes the page; **language** is set on `<html lang>`.

## Keyboard and focus

- **Everything operable by keyboard**, in a logical tab order, with **no keyboard traps**.
- **Visible focus indicator** on every interactive element (2.4.7), and the focused element is not
  hidden behind sticky headers/overlays (**2.4.11**, new in 2.2).
- Provide a **skip-to-content** link for pages with repeated navigation.

## Pointer, target size, and motion

- **Target size ≥ 24×24 CSS px** (**2.5.8**, new) for buttons, links, quiz options, icon controls —
  or ensure adequate spacing. The most common new failure.
- **Dragging has a tap/click alternative** (**2.5.7**, new) — e.g. drag-and-drop matching questions
  also work by select-then-place.
- No essential action depends on a device gesture/motion only.

## Forms and quizzes

- **Every input has a programmatic `<label>`** (or equivalent); instructions aren't placeholder-only.
- **Don't convey correct/incorrect by colour alone** — pair green/red with a word and/or icon
  ("Correct", "Try again", ✓/✗). This is the single most common quiz failure (1.4.1).
- **Errors are identified in text** and suggest a fix (3.3.1/3.3.3); group related fields with
  `<fieldset>`/`<legend>`.
- **Redundant entry** (**3.3.7**, new): don't ask pupils to re-type something already provided in
  the same flow.
- **Accessible authentication** (**3.3.8**, new): no login step that's a cognitive puzzle.
- Quiz timers: if timed, make the limit adjustable/extendable (2.2.1), or avoid time limits.

## Colour, contrast, and zoom

- Text **4.5:1** (large text/UI/graphics **3:1**); **Oak's target is 7:1**.
- **Non-text contrast 3:1** for control boundaries, focus rings, and meaningful graphics (1.4.11).
- Usable at **200% zoom** and **reflows to one column at 320px** (1.4.4/1.4.10); never set
  `user-scalable=no`.

## Media, status, and live updates

- Embedded video/audio: captions + transcript (see `references/media.md`).
- **Status messages** (e.g. "Answer saved", "3 of 10 correct") are announced to assistive tech
  without moving focus (4.1.3).

## Before sign-off

Test with the **keyboard only** (tab through everything), check contrast with a contrast tool, zoom
to 200% and 400%, and run an automated checker (e.g. axe) — then `assets/accessibility-checklist.md`.
Automated tools catch ~30–50% of issues; the keyboard pass and contrast/reading-order checks are
manual.
