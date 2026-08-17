Here's a callout box for an exam-board note — grey background, rounded corners, padding, and a left accent bar in yellow:

```css
.callout--exam-board {
  background-color: #f2f2f2;
  border-left: 4px solid #fbbf24;
  border-radius: 8px;
  padding: 16px 20px;
}
```

A couple of things worth flagging:

- I don't have access to your actual `styles.css` in this session, so the grey and yellow above are plain hex placeholders (`#f2f2f2` for the background, `#fbbf24` for a standard amber/yellow), not values pulled from Oak's design system. If Oak's stylesheet exposes design tokens as CSS custom properties (something like `--color-grey-40` or `--color-yellow`), swap them in so the callout stays consistent with the rest of the site and updates automatically if the palette changes, e.g.:

```css
.callout--exam-board {
  background-color: var(--color-grey-background, #f2f2f2);
  border-left: 4px solid var(--color-yellow, #fbbf24);
  border-radius: 8px;
  padding: 16px 20px;
}
```

- If the border-radius should only round the corners not touching the accent bar (a common pattern for left-accent callouts), use this instead:

```css
.callout--exam-board {
  background-color: #f2f2f2;
  border-left: 4px solid #fbbf24;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 16px 20px;
}
```

- Also double check contrast: exact grey/yellow shades matter for WCAG contrast against whatever text color sits inside the box, so it's worth testing with Oak's real tokens rather than my placeholders before shipping.

Tell me the actual token names (or hex values) from your stylesheet and I'll drop them straight in.
