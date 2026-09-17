# ADR-215: Top-Level `research/` Surface for Imported Research Records

- **Status:** Superseded by
  [ADR-226](226-agent-research-surface-for-imported-records.md) (2026-08-30)
- **Date:** 2026-07-20
- **Relates to:** [ADR-041](041-workspace-structure-option-a.md) (workspace tier
  structure — deliberately unchanged by this ADR)

## Supersession record (2026-08-30)

The imported record relocated to
[`.agent/research/innovation-kit/web-app-deconstruction/`](../../../.agent/research/innovation-kit/web-app-deconstruction/README.md)
and the top-level `research/` surface retired with it. ADR-226 carries the live
surface declaration and the research-import pattern; the corpus README's
preservation boundary pins the exact pre-relocation record at commit
`4915fe182`. The original decision text below is retained unchanged.

## Context

The owner directed a content-only import of the `web-app-deconstruction`
research record — the OWA/Components/OCE/Database-Tools/oak-openapi
deconstruction study — into this repository at
`research/web-app-deconstruction/`. The record is a self-contained corpus:
Markdown research documents, operational continuity surfaces, an evidence
package (`@oaknational/research-evidence`, TypeScript with a Vitest suite),
and deterministic validators (`scripts/check-research.ts`).

ADR-041 enumerates the permitted top-level workspace directories and
`research/` is not among them. At the same time, the repository already treats
`research/` as an exempt content class in several tools: the shared ESLint
config ignores `research/`, markdownlint excludes `**/research/**`, and
dependency-cruiser scans only `apps packages agent-tools demos`. The tooling
anticipated a research surface the structure did not yet declare.

A research record is evidence, not product. Reformatting or house-styling it
would destroy byte-level fidelity with its source repository and weaken its
value as a preserved artefact.

OCE is public. A record may cite private Oak repositories; a permalink URL into
a private repository discloses that repository's internal file layout even
while its contents 404. The imported record therefore enters as a public
**projection** whose private-repo permalinks are reduced to plain-text
citations, with the full-fidelity linked master retained in the private source
repository. The presumption is publication; only content for which a specific
potential harm can be shown is withheld.

## Decision

1. Introduce `research/` as a top-level, out-of-band research surface, outside
   the ADR-041 product dependency lattice. ADR-041's tier enumeration and
   dependency-direction matrix are unchanged.
2. No workspace under `apps/`, `packages/`, `agent-tools/`, `agent-graphs/`,
   or `demos/` may import from `research/**`, and research records must not
   import from product workspaces. Records are self-contained.
3. A record's **documents** (Markdown research content and operational
   surfaces) are preserved byte-faithfully except for the private-source
   reduction below, and are exempt from house prose formatting/analysis
   (Prettier, markdownlint). A record's **code is not exempt**: all executable
   content is TypeScript held to OCE's gates — type-check, ESLint, Prettier and
   the vitest suite — configured per the package's own `tsconfig`,
   `eslint.config.ts` and `vitest.config.ts`. Tooling scripts take the same
   scoped relaxations OCE already applies to its own `build-scripts/**`
   (console, complexity, house property-access), while the type-safety rules
   stay on. The record keeps its own integrity harness (for
   `web-app-deconstruction`: `scripts/check-research.ts`, a TypeScript CLI, and
   the vitest evidence suite). The class boundary is by ROLE, not file
   extension: the package's `fixtures/**` are measurement samples — source
   text the runtime probe copies as data into a temporary app — so they
   belong to the byte-faithful documents class above, not to the gated
   tooling-code class.
4. A record is imported as a public projection. Permalinks into private Oak
   repositories are reduced to plain-text citations; the citing prose (file
   name, line range, pinned revision) is kept. Each such projection points to a
   stable index in its private source repository that resolves the citations
   and records the withheld sensitive minimum (for `web-app-deconstruction`:
   `docs/oce-projection-and-private-source-index.md`). Permalinks into public
   repositories are kept live.
5. Only a record's dependency-free leaf packages may be registered in
   `pnpm-workspace.yaml` (so `turbo run test` exercises their self-contained
   suites). A record's root workspace scaffolding (its own `package.json`
   turbo wrappers, `pnpm-workspace.yaml`, `turbo.json`, lockfile) is retained
   as content but never registered — registering it would nest a second turbo
   invocation inside OCE's.
6. Repository-wide integrity gates still apply to the subtree: secret
   scanning, machine-local path validation, markdown link validation, and
   encoding checks.

## Consequences

- Research provenance is preserved; the projection is comparable line-for-line
  with its private source repository apart from the private-repo permalink
  reduction, which the stable private-source index resolves.
- The style/analysis exemption is scoped to the record's **documents** only
  (`.prettierignore` exempts `research/**/*.md`, `.agent/` and the illustrative
  fixtures; markdownlint already excludes `**/research/**`). The record's
  TypeScript is formatted, linted and type-checked like any OCE code; the
  package is a full workspace member (`pnpm-workspace.yaml`), analysed by knip
  (`knip.config.ts`), and its tests run under `turbo run test`. The shared
  ESLint `ignores` still lists `research/` for root-level runs, but the package
  ships its own `eslint.config.ts`, so per-package `eslint .` lints it.
- The Decision 2 import ban is not automatically enforced (dependency-cruiser
  does not scan `research/`); for dependency-free, self-contained records this
  is accepted residual risk, revisited if a record ever grows dependencies.
- Future research imports follow the same pattern: copy content, exclude
  owner-directed private material, register only dependency-free leaf
  packages, and leave the record's own harness authoritative for its internal
  discipline.
