# WS-D1 — Workspace Decomposition (G-8 RATIFIED 2026-06-04)

**Status**: G-8 RATIFIED by the owner 2026-06-04 (Fiery Sparking Caldera,
`80d50a`). Input to the build workstreams; the
[POC plan](school-data-search-poc.plan.md) gates WS1+ on this.

Applies report §5 C-02 and the owner layout directive (2026-06-04): everything
school-data-search-SPECIFIC under a top-level `school-data-search/` tier;
genuinely REUSABLE pieces under normal topology, graduating on a second consumer.

## Settled decomposition — 4 workspaces under a new `school-data-search/` tier

```text
school-data-search/                         new ADR-041 tier (amendment adds a matrix row)
  packages/
    contracts/   Zod canonical schemas (G-1) + canonical types/enums +
                 name-variant / source-identifier / dataset-version types (G-3) +
                 the generated OpenAPI 3.x spec. Pure schema/types; DB-FREE.
    sdk/         domain mechanism as modules under ONE DI factory + shared db:
                   data/   Drizzle schema + migrations + repos + storage-port (G-4)
                   ingest/ nation adapters (GIAS/Wales/Scotland/NI) + import-run
                           state machine + redaction + hard-fail validation +
                           versioned whole-dataset promotion (G-4/G-6)
                   search/ search-doc builder + deterministic ranking +
                           multilingual normaliser + cursors (G-7)
    client/      typed fetch client generated from the spec; Result boundary
                 (G-1/C-05); built, unpublished (G-9).
  apps/
    api/         Next.js: 10-route core + access-gated picker page (WS11) +
                 auth/ module (split-token, G-5) + cron + observability. Thin.
```

**Dependency direction** (no reverse edges): `contracts → core/foundation-libs
only`; `sdk → contracts`; `client → contracts`; `apps/api → contracts, sdk,
client`. Nothing imports the `school-data-search/` tier from outside it.

**Reuse existing `packages/`** (not recreated): `@oaknational/env` +
`@oaknational/env-resolution`, `@oaknational/logger` (stdio sink),
`@oaknational/observability` (OTEL), `@oaknational/result`.

**SDK shape — the ratified architectural choice (G-8).** One `sdk` workspace
with `data`/`ingest`/`search` modules and a single DI factory, NOT three
separate workspaces. Rationale: the repo idiom is a multi-module SDK that
bundles read-path and write-path behind one DI factory over a shared data
client — `packages/sdks/oak-search-sdk` bundles `retrieval/` (read) and
`admin/` (write) exactly this way. The shared change axis (the canonical
schema) lives in `contracts` and propagates to ingest and search regardless of
the split, so a 3-way split buys configuration cost without a proportionate
boundary gain at POC scale (First Question). The 6-workspace split remains the
named upgrade path if independent evolution later justifies it.

## Named extraction seams (co-located now → `packages/` on a 2nd consumer)

Per "don't extract single-consumer abstractions" + "Separate Framework from
Consumer": each is a clean module now, with a recorded trigger.

| Seam | Lives now | Extraction trigger → home |
| --- | --- | --- |
| Multilingual normaliser | `sdk/search` | 2nd consumer (or Elasticsearch adoption) → `packages/libs/` |
| Source-agnostic ingestion framework | `sdk/ingest` | 2nd register-ingestion consumer → `packages/` |
| Token/auth subsystem | `apps/api/auth` | 2nd authenticated internal API → `packages/` |

Drizzle ownership (G-4): table definitions + migration runner in `sdk/data`;
`contracts` stays DB-free (a depcruise rule bans `drizzle-orm` from
`contracts`).

## First scaffolding cycle — boundary rules are AUTHORED, not generated

The repo's boundary rules do not derive from directory globs — they are
hand-authored. These land BEFORE any new-workspace code:

1. **ADR-041 amendment** — add a `school-data-search/` row to the
   dependency-direction matrix (the agent-graphs row is the template): may
   import core + foundation libs + sdks (for the reuse set); intra-tier
   `contracts → sdk → client → apps/api`, no reverse edges; no substrate-tier
   back-edges into the tier.
2. **`pnpm-workspace.yaml`** — enumerate the four workspaces explicitly
   (`school-data-search/packages/contracts|sdk|client`,
   `school-data-search/apps/api`); the file enumerates, it does not glob
   (only `packages/design/*` is a glob).
3. **`.dependency-cruiser.mjs`** — add path-prefix rules for the new tier
   (intra-tier direction + edges to/from `packages/`); the existing rules are
   `^packages/...`/`^apps/` prefixes that a new tier silently escapes.
4. **`packages/core/oak-eslint/src/rules/boundary.ts`** — add a
   `school-data-search`-tier rule factory (the four packages are absent from
   the hardcoded `*_PACKAGE_IMPORTS` arrays), with unit tests mirroring
   `app-boundary.unit.test.ts`, wired into each new workspace's
   `eslint.config.ts` (ensure `apps/api` gets cross-app + tooling-import
   protection).
5. **`contracts` DB-free guard** — a depcruise rule banning `drizzle-orm` in
   the `contracts` dependency graph.

## Reviewer dispositions (validated, not relayed)

Both dispatched 2026-06-04; every load-bearing claim re-verified in-repo
before acting.

- **architecture-expert-fred — READY-WITH-CHANGES; all findings verified and
  accepted.** Boundary rules are authored not generated (verified:
  `.dependency-cruiser.mjs` path-prefixes + `boundary.ts` hardcoded arrays);
  ADR-041 amendment must add a matrix row (verified: the matrix + agent-graphs
  precedent exist); `pnpm-workspace.yaml` enumerate not glob (verified). The
  report's "generated ESLint/depcruise rule sets" wording (§C-02) is corrected
  to "authored".
- **architecture-expert-betty — READY-WITH-CHANGES; F2/F3 accepted, F1/F4
  critically rejected.** Accepted: auth moved out of the SDK into `apps/api`
  (it has one consumer; bundling it coupled every SDK consumer to crypto);
  `contracts` co-locates the G-1 contract + G-3 model correctly and must stay
  DB-free. Rejected: the split into 6 workspaces — her own cited precedent
  (`oak-search-sdk`) bundles read-path + write-path in one SDK, which supports
  the 4-workspace bundle, not the split (the shared schema axis lives in
  `contracts` regardless). Owner ratified the 4-workspace shape at G-8.

## Next

WS-D1 is complete. Draft **ADR-191** (the produced-spec contract ADR; distinct
from the ADR-041 topology amendment) and the ADR-041 amendment, then promote
the plan to `active/` and begin WS1 (contract canon) + WS2 (model), with
England/GIAS as the front-loaded first WS4 milestone.
