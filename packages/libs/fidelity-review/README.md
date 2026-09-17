# @oaknational/fidelity-review

Shared fidelity capture/diff/report core for the demo apps, extracted
when its second consumer arrived (`consolidate-at-second-consumer`): the
curriculum hub built the mechanism; the design showcase's port (PR #834)
duplicated it, hardened it, and thereby forced this consolidation — the
hardened versions are canonical here, and both apps consume the
package. What stays app-local is enumerated in its own section below;
this package owns the invariant machinery.

## Modules (per-module subpath exports, no barrel)

There is deliberately no `src/index.ts`: consumers import exactly the
modules they use, and app migration diffs stay mechanical
(`'./support'` becomes `'@oaknational/fidelity-review/support'`).

- `support` — `runTool` (the tool process boundary: runs a
  Result-returning main, prints the failure, sets the exit code),
  `describeThrown`, `stripTrailing`.
- `dev-server` — `ensureDevServer(base, demoDir)`: attach to a
  responding dev server or spawn `pnpm dev` in `demoDir` and wait for
  readiness. `demoDir` is a required parameter — the module must never
  guess the app root from its own location. Refuses a relative
  `npm_execpath` (PATH-lookup guard, Sonar S4036). Also
  `assertServerUp(base, hint)`: the attach-mode reachability assertion,
  bounded at 10s BECAUSE it is an assertion, not a spawn wait, with the
  app's own start-it advice rendered into the failure.
- `static-path-guard` — `decodeUrlPath` (malformed percent-escapes and
  embedded NULs are a decision, never a throw inside an http listener)
  and `resolveWithinRoot` (absolute-root contract, then
  canonicalise-then-prefix-check traversal guard). Security-critical
  path/IO guards; the consolidation floor of
  `consolidate-at-second-consumer` applies to this module first.
  CONTAINMENT IS LEXICAL: a symlink inside a served root is followed —
  fine for the demos' tool-generated local roots; a consumer serving a
  root that can carry untrusted symlinks must add a realpath check.
- `capture-flags` — `resolveWidth` (strict: `1440px` rejects, never
  truncates), `resolveBase(argv, env, defaultBase)`, the
  matched-geometry scale constant `MATCHED_GEOMETRY_SCALE` (consumed by
  every capture arm AND the report meta, so the declared scale cannot
  drift from the shot scale), and the blank-render classifier
  `isSuspect`. Each app supplies its own default base and keeps its
  app-specific classifiers.
- `pairing-schema` — `buildPairingMapSchema(pairSchema)`: the
  map-level wrapper every app shares (version literal, non-empty
  pairs, exempt surfaces with recorded reasons, unique pair ids)
  around the app's OWN zod pair schema, which stays app-local (pair
  kinds and refinements genuinely differ per app).
- `orchestrator` — the app-neutral run skeleton and the run-level
  entry point: `resolveRunFlags`, `diffPair`/`collectPairResults` (one
  corrupt-evidence policy: a PNG that exists but cannot decode fails
  the run mechanically, never a report row), `buildAndWriteReport`,
  `captureAndReport` (the capture-then-report bracket whose finally
  block is the single spawned-server teardown), and the layout
  convention `reportDirFor`/`registerPathFor`. POSITIONAL CONTRACT:
  the report renderer's evidence links resolve `../../<path>`, so the
  report directory sits exactly two levels below the demo root — which
  is why the locations are derived by the package, never caller
  choices. `ServerMode` is re-exported here for composition roots.
- `register` — the disposition-register schema
  (`strictObject`; owner-edited JSON boundary, so unknown fields are
  rejected loudly), `parseRegister`, `GLOBAL_PAIR_ID`, `entriesForPair`,
  and `newEntryTemplate`.

`image-diff`, `report` (the renderer over the structural
`pairing-types` view — each app's zod-inferred map satisfies it by
assignability, so the PAIR schemas never consolidate),
`review-helpers`, `fidelity-html`, `fidelity-report-sections`, and
`pairing-types` are internal modules with no subpath export: after the
orchestrator absorbed their callers, no consumer outside the package
imports them, and an unused public surface is API frozen for nobody.

## What stays app-local, and why

Each app's PAIR schema and declared pairing map (pair kinds and
refinements genuinely differ per app; the shared map-level wrapper is
`pairing-schema`), capture arms (Playwright usage against the app's own
surfaces), export servers (the hub serves one root; the showcase serves
a bounded two-root studio overlay), each app's default base constant,
server-start hint text and app-specific classifiers (route slugging,
hydration witnesses, frame-aware render checks), and each CLI's `main`
(the showcase attaches to custom bases; the hub always ensures its own
server). The byte-identical serve mechanics (`portOf`, content-type
table, the response half of the request handler) are a recorded
follow-up consolidation (Linear MCP-534), not a silent omission.

## Architectural decisions

- [ADR-041 — workspace structure](../../../docs/architecture/architectural-decisions/041-workspace-structure-option-a.md)
  (dated amendment 2026-08-09 classifies this package as a foundation
  lib).

## License

MIT.
