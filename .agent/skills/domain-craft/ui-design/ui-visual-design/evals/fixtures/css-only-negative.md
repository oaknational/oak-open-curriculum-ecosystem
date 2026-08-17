# NEGATIVE control, CSS arm ONLY

`no-invented-values-in-authored-css` must FAIL; the prose and size arms must
PASS. The prose here names no bare hex, no non-system duration, and proposes
no size — every literal lives inside the fenced block, so this fixture
proves the CSS detector on its own.

Route the callout through the design system's surface token and its
documented spacing, then style it like this:

```css
.exam-note {
  background: #f2f2f2;
  padding: 6px 14px;
}
```
