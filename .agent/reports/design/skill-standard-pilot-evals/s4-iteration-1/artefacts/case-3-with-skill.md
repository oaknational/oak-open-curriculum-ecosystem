There isn't one fixed hex — the primary button background is a theme-resolving token in the design system, not a static colour, so the actual value depends on which palette/theme is active:

- **Light**: `#222222` (`oak-black`)
- **Dark**: `#ffffff` (`oak-white`)
- **High-contrast**: `#000000` (`oak-black-true`)
- **Colour-safe**: same as light/dark (no separate override)

Don't hardcode any of these — use the token/class instead, so it keeps resolving correctly across all four themes:

- CSS: `background: var(--bg-btn-primary);` (already applied by the `.oak-btn` class)
- Component: `<OakButton variant="primary">`

If you genuinely need one literal number for a single fixed context (e.g. a static export that can't reference the token), tell me which theme it's for and I'll give you just that one value.
