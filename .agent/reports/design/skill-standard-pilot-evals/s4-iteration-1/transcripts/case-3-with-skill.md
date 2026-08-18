## Files read

- `.agent/skills/domain-craft/ui-design/ui-visual-design/SKILL-CANONICAL.md`
- `.agent/skills/domain-craft/ui-design/ui-visual-design/references/craft-fundamentals.md`
- `packages/design/oak-design-system/dtcg/component.json` (structural `btn` tokens — no colour)
- `packages/design/oak-design-system/studio-source/components/OakButton/oakbutton.html` (compiled component demo, confirms `variant="primary"` usage)
- `packages/design/oak-design-system/components.css` (grepped for `.oak-btn`/`btn-primary`; found `.oak-btn` background rule references `var(--bg-btn-primary)`)
- `packages/design/oak-design-system/colors_and_type.css` (grepped for `--bg-btn-primary` and the underlying primitives `--oak-black`, `--oak-white`, `--oak-black-true`; found the token is defined as `light-dark(var(--oak-black), var(--oak-white))` by default and overridden to `var(--oak-black-true)` under `[data-theme='high-contrast']`)
- `packages/design/oak-design-system/dtcg/semantic.light.json`, `semantic.dark.json`, `semantic.high-contrast.json`, `semantic.colour-safe.json` (grepped for `btn-primary` to confirm which theme files declare an override; colour-safe declares none)

## Reasoning

The skill is explicit that this entry decides layout/hierarchy/interaction judgment, not token values — "picking tokens... design-system-usage owns that" — and separately warns against inventing visual values and against encoding meaning in a single hue since the system requires holding across light, dark, high-contrast, and colour-safe themes. So a literal single hex answer would already violate the skill's own theming section even before checking the source. I read the design system source directly (read-only, as instructed) rather than guessing, and found the primary button background is implemented as the CSS custom property `--bg-btn-primary`, defined via `light-dark()` (resolving to `#222222` in light, `#ffffff` in dark) with a `#000000` override for high-contrast and no separate colour-safe override. Since the user asked for "just the value," I gave the concrete resolved hexes per theme rather than lecturing at length, but I could not honestly collapse it to one number without contradicting what the design system itself declares, so I named the token/class to use in code and offered to narrow to one theme's value if they truly need a single hardcoded number.
