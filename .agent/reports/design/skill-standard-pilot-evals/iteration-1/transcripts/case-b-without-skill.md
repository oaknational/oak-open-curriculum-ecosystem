# Transcript

I settled on a three-way theme set — Light, Dark, System — because the given
context only establishes a themable token layer switched via `data-theme`,
with no named theme catalogue to draw on; Light/Dark maps directly onto the
one signal the platform actually exposes (`prefers-color-scheme`), and
System is the honest default state rather than a fourth invented theme.

For persistence I used `localStorage` under a single key, storing only an
explicit `"light"`/`"dark"` choice and treating an absent key as "follow the
OS": this makes "no preference expressed" a first-class, storage-free state
rather than a stored `"system"` sentinel that could drift out of sync with
the OS. The theme is applied by an inline script in `<head>`, before the
stylesheet paints, to avoid a flash of the wrong theme on reload.

To keep following the OS after a page has loaded (e.g. the OS flips to dark
mode automatically at sunset), a `matchMedia("(prefers-color-scheme: dark)")`
change listener re-applies the system theme, but only while no explicit
choice is stored — once the user picks Light or Dark, that listener's output
is ignored for them until they pick System again.

The hardest part, absent any grounding in the real design system, was
deciding what to invent versus what to leave generic: I used plausible
`--oak-color-*` custom-property names to gesture at a "token layer" without
pretending to know the real token set, and kept the UI to buttons with
`aria-pressed` rather than guessing at real component markup.
