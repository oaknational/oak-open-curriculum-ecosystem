# @oaknational/safe-path

Path-containment guard for the monorepo. `assertPathWithinBase(candidate, baseDir)`
canonicalises both paths with `realpathSync` — resolving `..` segments **and**
symlinks, unlike `path.resolve` — and asserts the candidate resolves inside the
base, returning the canonical contained path for safe use.

Use it to guard filesystem sinks against path-injection from caller-influenced
input (for example a value taken from `process.argv`).

## Usage

```ts
import { assertPathWithinBase } from '@oaknational/safe-path';

const safe = assertPathWithinBase(untrustedPath, baseDir);
const contents = readFileSync(safe, 'utf-8');
```

Single source of truth: consumed by `@oaknational/agent-tools` and the
`oak-search-cli` app. The injectable `realpath` seam keeps tests off real IO.

## Known extension points

A safe file write within a base needs more than path containment; the containment writer
of 2026-09-06 (`packages/sdks/graph-corpus-sdk/scripts/write-contained.ts`) is the
reference implementation, and its docblock and code carry the mechanics (the open flags,
the one-link and regular-file checks on the descriptor, the write through it). Its known
boundary, stated here because the writer's text does not: `O_NOFOLLOW` guards the last
path component only, so a concurrent swap of an ancestor directory for a symlink stays
open (a directory descriptor walked with `openat` per component is the full cure). That
writer is the third consumer to want "write a file safely inside a base"; per
`consolidate-at-second-consumer`, an `openRegularFileWithin(base, relative)` helper is
the extraction once a second real consumer needs it, not before.
