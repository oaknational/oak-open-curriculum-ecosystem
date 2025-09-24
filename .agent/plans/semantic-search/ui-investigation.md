# Semantic Search UI Investigation

## Theme colours missing

- Observed hydration mismatch between server-rendered and client-rendered class names; Next dev console reports server markup using `esm__…` classes while the client swaps in `sc-…` classes, triggering repeated hydration failures and preventing Oak theme styles from sticking (Next console: `Maximum update depth exceeded … @ http://127.0.0.1:3000/_next/static/chunks/64c68_next_dist_b13f552a._.js:2359`).
- Because the styled-components sheet is not hydrating consistently, Oak components fall back to unstyled HTML (header border resolves to `rgb(128, 128, 128)` instead of the token value) and the overall palette never reflects the configured tokens from `app/lib/theme/ThemeBridgeProvider.tsx`.
- Suspect root cause is the SSR bridge in `app/lib/registry.tsx:1-24`, which instantiates a `ServerStyleSheet` inside a client component; this appears to generate different class keys on the server versus the client when running under React 19/Next 15, leading to the mismatch.

## Theme selector stuck

- The theme radio controls invoke `setMode`, but `SyncModeToResolved` in `app/lib/Providers.tsx:38-49` guards on `didSyncRef` and only syncs the colour mode context during the first render. Subsequent changes never propagate to `ColorModeProvider`, so `#app-theme-root` keeps the initial `data-theme` and no theme switch occurs.

## Primary nav hidden in practice

- Mark-up for the nav renders (`nav[aria-label="Primary"]` is in the DOM), yet Playwright’s attempt to click the `Admin` link fails because the Next Dev overlay portal intercepts pointer events (`<nextjs-portal> … intercepts pointer events`), effectively hiding the menu during development.
- The overlay is opened by the hydration error above; once the styling pipeline is stable the menu should remain accessible.

## Layout appears broken / “total mess”

- The repeated hydration error cascades into the Next Dev overlay and a flood of `Maximum update depth exceeded` logs, leaving split styling between server and client. Until the styled-components SSR mismatch is resolved, the page renders with unstyled Oak components, stacked radio buttons, and the overlay covering key areas of the UI.

## Next steps for remediation

1. Rework the styled-components SSR bridge so that server and client share the same class key generation (e.g. follow the Next 15 + styled-components v6 app router pattern, ensure the registry runs as a Server Component, and verify `compiler.styledComponents` options).
2. Remove the one-time guard in `SyncModeToResolved` so the colour mode context stays in sync with `ThemeContext` (or otherwise derive the DOM `data-theme` directly from the resolved theme).
3. After addressing the above, retest the page to confirm Oak theme tokens apply, the theme selector toggles modes, and the nav/menu remains interactable without the overlay.
