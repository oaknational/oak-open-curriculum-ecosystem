# @oaknational/oak-design-react

The React binding tier for the Oak Open Curriculum Design System — the
downstream sibling ADR-213 §3 decides: the kit
(`@oaknational/oak-design-system`) holds what is framework-invariant; this
package holds what is React-covariant.

## First resident: the theme-store adapter

`createOakThemeStore` / `oakThemeStore` — a
[`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore)-shaped
adapter over the kit's `oakTheme` runtime (the store side of React's
contract: a stable `subscribe` plus snapshot readers, handed to the hook by
consumers). The theme snapshot is the CHOICE
model read through the runtime's `choice()` accessor. The sentinel
encodings (DDR-003, dated amendment 2026-08-11): `undefined` means no
runtime (server render — HTML stays theme-neutral; consumers render their
placeholder shell), and the exported `IDENTITY_DEFAULT`
(`'identity-default'`) names the no-choice state — the identity's own
default, a REAL selectable option that leads the offered theme list.
Choosing it clears the stored choice through the runtime's `clear()`
(which keeps the automatic contrast commitment); the sentinel itself never
reaches `localStorage` or `data-theme`.
The store carries no contrast-media mirror: the OS-contrast route changes
only the applied theme, never `choice()`, so no exposed snapshot can
change on that trigger — an applied-theme accessor (with its mirror) lands
at first materialised need.

The adapter is factory-pure and has **no React dependency**: consumers hand
its members to `useSyncExternalStore`. React itself arrives with the tier's
first component export, which is gated — per ADR-213 §3's hard gate, the
ADR-147 accessibility gate extension must land for this package before any
component ships.

The package's edge to the kit is **contract-only**: `OakThemeRuntime`
re-declares the runtime's public API (the kit ships no type declarations),
and this module is the estate's single ambient declarer of
`Window.oakTheme`.
