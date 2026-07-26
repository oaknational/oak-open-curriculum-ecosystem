# Oak design assets

Oak brand artwork that has to be a **file**: raster images consumed by things outside the browser's CSS pipeline — share cards, email, app listings.

The design system holds everything a stylesheet can reach, including the vector logo. This holds the rest, so there is one answer to "which logo, at what size, from where" instead of a copy in every app's `public/` folder.

Consumers take it as a `workspace:*` devDependency and copy what they need into their own served output at build time. The MCP app's `build-scripts/copy-oak-ds.ts` is the worked example.

Licensing: [LICENCES.md](LICENCES.md). Oak's marks are not open-licensed.
