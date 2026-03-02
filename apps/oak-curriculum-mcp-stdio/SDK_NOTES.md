# SDK Notes

> **Status**: Complete (2026-02-14)
>
> The ESM `.js` extension changes described below have been implemented.
> The SDK uses ESM throughout and all relative imports include `.js`
> extensions. This file is preserved for historical context.

## Historical: ESM Import Extensions

For ESM compatibility, all relative imports in the SDK needed `.js`
extensions. This was required for the MCP server to work correctly in
ESM mode. The change has been applied to all TypeScript files with
relative imports.
