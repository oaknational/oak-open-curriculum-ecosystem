# ESM Module System Lessons

_Date: 2025-01-05_

## The Experience

Moving to ESM-only felt like learning a new dialect of a familiar language. The strictness — mandatory file extensions, no `__dirname`, no `require` — was initially frustrating. Every import felt like a small negotiation with the module resolver.

But once the muscle memory formed, the strictness became liberating. Knowing that imports are explicit, that there is no ambiguity about what is loaded from where, created a clarity that CommonJS never had. The error messages became guides rather than obstacles.

The moment the bundle dropped from 708KB to 25.8KB after proper tree-shaking showed the concrete benefit of all that strictness. The discipline paid for itself in a single build.

## Technical content

Applied technical patterns from this experience have been extracted to `distilled.md` (ESM Module System section).
