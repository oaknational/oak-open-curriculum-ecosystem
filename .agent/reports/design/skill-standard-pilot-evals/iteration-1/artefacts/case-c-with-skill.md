Here's the CSS, built entirely from Oak Design System tokens rather than hard-coded values, so it stays correct across themes:

```css
.oak-exam-board-note {
  background: var(--bg-neutral);
  border-radius: var(--radius-container);
  padding: var(--inset-m);
  border-left: var(--border-solid-xl) solid var(--border-accent);
  color: var(--text-primary);
}
```

```html
<aside class="oak-exam-board-note">
  <p class="oak-body-3">Your exam-board note text goes here.</p>
</aside>
```

Token choices, and why:

- **Grey background** — `var(--bg-neutral)`. This is the token that's actually named and built for a visible grey surface (grey20 in light mode, grey60 in dark). Its sibling `--bg-subtle` is much closer to white/black and reads as barely-there, so it's the wrong pick if you want the note to look distinctly grey.
- **Rounded corners** — `var(--radius-container)`, the same radius the design system already uses for its banner and card-shaped blocks, so this note's corners will match everything else on the page.
- **A bit of padding** — `var(--inset-m)` (16px, density-aware). Same value the built-in `.oak-banner` component uses for its padding, so spacing feels consistent with other callouts on the page.
- **Left accent bar in Oak's yellow** — `var(--border-accent)`, not a hard-coded yellow. This is the important one: `--border-accent` resolves to Oak's lemon yellow in the light and dark themes, but automatically resolves to solid black in the high-contrast theme. If you hard-code the yellow hex instead, the bar stays yellow in high-contrast mode too, which breaks that theme's whole point (it's built to strip out low-contrast colour cues). Using the token means you get correct behaviour in all of Oak's themes for free.
- **Text colour** — `var(--text-primary)`, so the note's text stays readable against the grey background in every theme rather than assuming light-mode black.

One thing to flag: there's no existing "callout" component in `components.css` — the closest built-in shapes are `.oak-banner` (full border + icon slot, coloured by status) and the lesson-authoring blocks like `.oak-guidance` (also full border, no left bar). Neither has the left-accent-bar treatment you're asking for, so this class is assembled from primitives rather than being a class you copy wholesale. If you expect to reuse this "note with a left accent bar" shape elsewhere on the site, it's worth flagging to whoever owns the design system so it can become a proper shared component instead of living as page-local CSS.

Also worth doing: wrap the note in a landmark like `<aside>` (as above) or add a visible label such as "Exam board note" above the text — the design system's accessibility rule is that meaning is never conveyed by colour/position alone, and a floating grey box with a yellow stripe reads as decorative without a label saying what it is.
