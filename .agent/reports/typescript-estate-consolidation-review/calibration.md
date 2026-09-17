# TypeScript estate detector calibration

## Calibration state

- Calibration base: `7ea6ba55b16988cfb0cdcb0f485db32f71777628`.
- Baseline population at that commit: 3,618 tracked TypeScript/TSX files
  (3,487 `.ts`, 131 `.tsx`).
- Final review snapshot: deliberately not frozen here. It is pinned after the
  evidence entrypoint lands, so the entrypoint's own tracked TypeScript is in
  the denominator rather than silently excluded.
- Detector configuration: re-frozen as contract revision 2.6 in
  `detector-config.json` after the four archetypes below closed without
  requiring incompatible graph models. The unexecuted version 1 freeze was
  rejected at pre-execution review because its construct and fingerprint
  names lacked exact executable mappings; no estate results were produced
  under it. Version 1.1 closed that gap but was rejected before execution
  because its module-target and Git object-read boundaries were incomplete.
  Version 1.2 was also rejected before execution because its Git pathspec
  produced an empty census and its completeness, write, offline-read, and
  held-out contracts were unsound. Version 1.3 closed those boundaries but
  was not executed: the gateway required explicit repetition eligibility,
  fatal-versus-retained read states, semantic reconciliation, build identity,
  and canonical bytes. Version 1.4 closed those gateway items but all five
  independent specialist reviews rejected it before execution: type-truth and
  type-space mechanisms were invisible, delivery booleans collapsed absence
  with unprobed state, role/provenance vocabularies diverged, graph producers
  were incomplete, verification observations could authorise consolidation,
  proof environment and SDK-consumer boundaries were unsafe, and the extractor
  lacked Red-first/built-smoke obligations. No estate results were produced.
  Round 2 confirmed all 30 original blockers cured and exposed new internal
  contradictions before execution. A four-specialist final round then found
  cases where a determination was still delegated to the future
  implementation: producer tokens and real MCP registration names, empty
  prefix aggregation, wildcard export expansion, completion fields, graph-node
  paths, and the widget proof environment. An adversarial verification of that
  cure found four more pre-run contradictions: an impossible widget positive
  control, no canonical packed-member path, no per-producer endpoint recipe,
  and no total runtime-versus-types export rule. The first cure re-check also
  caught segment validation accidentally including the mandatory `./` prefix
  and competing rules for static registration status. Read-only implementation
  mapping then proved the fixed identity list omitted the actual unified
  entrypoint and most of its eagerly evaluated local ESM closure. It also found
  ref option termination, line-count semantics, and pinned workspace-pattern
  grammar unstated. R7 review retained one root-separation ambiguity plus
  symlink-ancestor and external-specifier closure gaps. Version 2.0 was refrozen
  at `2026-08-02T20:37:28Z` with distinct invoking/executing roots, fail-closed
  identity reads, and one syntax-only `node:` identity predicate. Red-first
  implementation then independently exposed one remaining ambiguity:
  `coverage.pathsSha256` was required and recomputed but had no domain or byte
  framing. With no estate result produced, version 2.1 was refrozen at
  `2026-08-02T21:50:38Z` with a domain-separated, unsigned
  64-bit-length-prefixed ordered-path digest. No detector, population,
  interpretation, candidate, or proof boundary changed. R8 verified that
  correction. The first Red/Green AST slice then exposed implementation choices
  still left open in existing detector transformations. With no estate result
  produced, revision 2.2 was refrozen at `2026-08-02T22:38:43Z` to make
  schema-shape extraction, recovered-AST use, repetition encoding, type-truth
  comment boundaries, array ordering, total partitions, and resource-limit
  scope executable. It adds no detector, population, threshold,
  interpretation, candidate, or proof boundary. `schemaVersion` remains the
  evidence-family document version `2.0.0`. R9 passed without findings.
  Continued repetition mapping then showed that the outer clone-analysis order
  remained unstated and that line-only member coordinates could collapse two
  identical anonymous regions on one line. With no estate result produced,
  revision 2.3 was refrozen at `2026-08-02T22:51:36Z` with exact zero-based
  UTF-16 start/exclusive-end offsets and exact-first/structural-second analysis
  order. It also closes the already declared schema-reason, region-kind,
  encoding-version, analysis-tuple, and three-key-floor vocabularies across the
  config, schemas, and TypeScript models. It adds no detector, population,
  threshold, interpretation, candidate, or proof boundary. The subsequent
  classification map found that non-TypeScript inputs lacked a pinned read
  capability and run-wide budget, config diagnostics contradicted the
  TypeScript-only diagnostic-path invariant, and later classifier slices still
  admitted material implementation choices. With no estate result produced,
  revision 2.4 was refrozen at `2026-08-02T23:22:05Z`. It authorises only the
  complete whole-tree index, cached auxiliary-blob reader and ledger, calibrated
  auxiliary limits, and distinct diagnostic subjects; it explicitly holds
  workspace/provenance/role, module, delivery, graph/ownership, and candidate
  implementation. It changes no detector, TypeScript population, threshold,
  interpretation, candidate, or proof boundary. The 2.4 auxiliary substrate
  was then implemented Red/Green and accepted independently. Contract-first
  mapping closed the remaining workspace-YAML, package-manifest, generated
  provenance, signal-identity, role-regex, selector, and fallback choices.
  With no estate result produced, revision 2.5 was refrozen at
  `2026-08-02T23:55:22Z`. It moves only workspace attribution, provenance, and
  roles to contract-ready; module declarations and resolution, delivery,
  graph/ownership, candidates, and the estate run remain held. It changes no
  detector, TypeScript population, threshold, interpretation, candidate, or
  proof boundary. The first implementation gateway then exposed a prose-only
  contradiction: the unknown-provenance sentence included unreadable files
  whose generated-path or generated-header signals earn the higher-precedence
  generated-declared-unconfirmed state. With no estate result produced,
  revision 2.6 was refrozen at `2026-08-03T00:47:05Z`; it changes only that
  sentence and the identities that bind the contract bytes. The implementation
  gate and every detector, population, threshold, candidate, disposition, and
  proof boundary remain unchanged. Revision 2.6 is the current contract.

The contract bytes supplied for post-cure verification are frozen as:

| Contract member | SHA-256 |
| --- | --- |
| `detector-config.json` | `54ace41d941d9fe190b1fd467a3c3ed8aac223953a2e28841b573830e83c7c2d` |
| `detector-config.schema.json` | `cc052b863ff972b7cfaf03dc53098b6081dcaf9f67faf1984b7c8019d28c8016` |
| `raw-extraction.schema.json` | `365ddba4532efbc91d4c6b8a1970c1a62492a806f6f1b60d76e5dac343396ddf` |
| `evidence.schema.json` | `cfcf97f3e5c5ae75849fe5a4c587a3a32253b84624d9fd652bd617ba887a198e` |

Any byte change to those four members invalidates this freeze set and requires
a new pre-execution verification before the first estate run.

The authoritative baseline count was recomputed by parsing the complete
NUL-delimited output of `git ls-tree -r -z --long <commit>` and suffix-filtering
decoded paths for `.ts` and `.tsx`; no TypeScript pathspec was passed. A
separate `git ls-files` cross-check produced the same count but is not the
regeneration contract. Workspace membership was reconciled by expanding only
the pinned `pnpm-workspace.yaml` globs: 32 workspaces were admitted, 31 of
them contained the 3,598 TypeScript files attributed to workspaces, and 20
TypeScript files were outside all admitted workspaces. Tracked manifests
outside those globs are not workspaces. This is calibration evidence, not the
final coverage claim.

## Model decision

One review-specific typed node-edge document can represent the four paths if it
keeps authority, carrier, runtime ownership, and composition distinct. It needs
nine edge kinds: import, re-export, export-map, generation, script,
filesystem-read, filesystem-write, build, and runtime-registration.

The document is not a generic graph implementation. The extractor may collect
and serialise nodes and edges, but may not add traversal, projection, graph
storage, or ontology infrastructure to `agent-tools`. Those responsibilities
remain in the foundation graph workspaces under ADR-173, ADR-179, and ADR-221.

## Archetype 1: OpenAPI to codegen to curriculum SDK to MCP

Observed chain:

1. Semantic authority is the committed OpenAPI cache by default; live refresh
   is explicit (`packages/sdks/oak-sdk-codegen/code-generation/codegen.ts:39-71`
   and `resolve-schema-source.ts:1-40`).
2. Authored generators emit API, validator, search, MCP, bulk, and widget
   carriers (`code-generation/codegen-core.ts:58-115` and
   `code-generation/codegen-core-file-operations.ts:20-113`).
3. The codegen workspace exports those generated runtime surfaces
   (`packages/sdks/oak-sdk-codegen/package.json:16-72`).
4. The curriculum SDK composes them into authored client, validation, and MCP
   façades (`packages/sdks/oak-curriculum-sdk/src/index.ts:26-109` and
   `src/public/mcp-tools.ts:13-123`).
5. The MCP app filters and registers the composed tools
   (`apps/oak-curriculum-mcp-streamable-http/src/handlers.ts:158-249`).

Calibration result: generated provenance and runtime delivery are independent.
The curriculum SDK is an authored runtime over generated contracts, not a
generated directory. Package export-map and runtime-registration edges are
both necessary.

## Archetype 2: bulk data to generated vocabulary/search to consumers

Observed chain:

1. Vocabulary generation reads the search CLI bulk-download directory and
   writes `oak-sdk-codegen/src/generated/vocab`
   (`packages/sdks/oak-sdk-codegen/vocab-gen/run-vocab-gen.ts:48-59,112-130`).
2. Only metadata, not the full downloaded sequence payload, is present in a
   clean checkout. Full vocabulary regeneration is therefore not hermetic.
3. Generated graph and synonym carriers are exported through codegen barrels;
   authored graph-corpus and search SDKs consume them at runtime
   (`packages/sdks/graph-corpus-sdk/src/curriculum/index.ts:1-91` and
   `packages/sdks/oak-search-sdk/src/retrieval/query-processing/detect-curriculum-phrases.ts:9-17`).
4. Search CLI scripts own download, codegen, and ingest operations
   (`apps/oak-search-cli/package.json:9-42`).

Calibration result: the graph needs non-TypeScript artefact and external-input
nodes even though the file denominator is TypeScript/TSX. A missing
materialised input is a recorded evidence gap. It is not replaced with a
generated-output-only determinism claim.

## Archetype 3: agent-tools source to dist to CLI or hook

Observed chain:

1. `agent-tools/tsconfig.build.json:3-12` compiles every source TypeScript file,
   including source test modules.
2. Package scripts mix built `node dist/...` execution and direct `tsx src/...`
   execution (`agent-tools/package.json:7-101`).
3. Platform configuration and shims load built files by path, while one guard
   dynamically imports committed TypeScript
   (`.claude/settings.json:181-209`,
   `.claude/hooks/run-pretooluse-guard.mjs:56-102`, and
   `.codex/hooks/practice-session-identity.mjs:14-29`).
4. Workflow entries are registered as strings before esbuild consumes them
   (`agent-tools/src/corpus-analysis/workflows/build/build-config.ts:35-48`).

`agent-tools/dist/` is globally ignored and has no pinned-tree members. Its
generated-carrier selector therefore resolves permanently to `null` plus the
exact `generatedCarrier:selector-zero:artefact-prefix:agent-tools/dist/`
token in source-tree extraction; only the separate executable build proof may
establish the emitted carrier. An empty repo-prefix aggregate is never
created.

Calibration result: typecheck-project inclusion does not prove emitting-project
membership or runtime reachability. The delivery model retains independent
`present | absent | not-probed | ambiguous` states for typecheck membership,
emitting-project membership, actual emission, package export, executable entry,
operator invocation, runtime registration, filesystem/string loading,
verification-only use, and repository-reference-only use. No unprobed state is
encoded as false.

## Archetype 4: TSX to bundle to served UI

Two different shapes exist inside the MCP application:

- Widget TSX is bundled by a separate Vite command into HTML, embedded into a
  committed generated TypeScript constant, imported by server entries, and
  registered as an MCP App resource (`widget/vite.config.ts:48-144`,
  `widget/src/main.tsx:1-15`, `scripts/embed-widget-html.ts:43-59`, and
  `src/register-widget-resource.ts:42-73`). The normal server build consumes
  the committed constant; it does not regenerate it.
- Landing-page TSX is rendered to static markup at build time and inlined into
  the deployed server bundle (`src/landing-page/render-landing-page.tsx:1-64`,
  `build-scripts/bake-landing-page.ts:17-72`, and
  `build-scripts/esbuild-config.ts:63-80`).

Calibration result: `.tsx` is not a delivery category; its only automatic role
is `tsx-syntax-source`. Browser runtime,
build-time rendering, Next application source, Ink terminal UI, tests,
research fixtures, and agent templates must remain distinguishable.

## Coverage gap and extractor decision

Existing tools answer narrower questions:

- root TypeScript configuration covers root configuration files, not the full
  estate;
- Turbo covers registered workspaces, leaving 20 tracked TypeScript files
  outside them;
- Dependency Cruiser excludes root/research/platform/generated surfaces;
- Knip needs explicit entries for scripts, shims, and string registrations;
- Sonar duplication policy intentionally excludes generated contracts, tests,
  configs, and selected ledgers.

Composing those tools cannot produce a closed per-file role/provenance/delivery
record, one static module-edge set, or consistently defined construct counts.
A minimal extractor is therefore justified. Its scope is limited to tracked
file discovery, source inspection, run-scoped classification signals, all nine
frozen graph-edge observations, the four calibrated chain records, construct
and type-truth counts, schema-shape matches, and implementation/type-space
repetition signals. Human disposition,
package generation, packing, runtime exercise, history interpretation, and
generic graph operations stay outside it.

## Frozen-detector rule

`detector-config.json` contract revision 2.6 is frozen before the estate-wide run. Earlier
drafts produced no estate results; revision 2.6 retains the corrected complete-tree
enumeration, ordered-path digest, complete-output, offline object-read, graph-production,
type-truth/type-space, four-state delivery, test-doctrine, proof-environment,
packed-consumer, TDD, built-smoke, and held-out contracts. A detector may be
reopened only if calibration failed to model a mechanism class. A surprising
result in an already modelled class does not permit threshold tuning.

Every detector declares a falsifier and unresolved behaviour. Rejected
detectors remain in the evidence bundle. No signal selects a disposition; all
signals are inferences grounded in source or executable evidence and undergo a
preselected held-out review whose membership never depends on detector output.

The independent R8 review verified version 2.1 at identical opening and closing
hashes, strict-compiled and validated the schema/config family, and found no
blocking or material inconsistency. Its only minor observation concerned the
strength of a Unicode ordering test; an adversarial astral/BMP fixed vector now
proves JavaScript UTF-16 ordering independently from UTF-8 ordering. No frozen
contract byte changed. The pre-run contract hold is discharged, while the
estate run itself remains unstarted until the implementation and built smoke
are complete.

The later AST implementation mapping did not contradict R8; it found a
different family of open transformations. Revision 2.2 closed those choices.
Independent R9 review matched its opening and closing config hash
`94b32946fd921d26beeaeecdf878f0a09895a9b0115c54a64c0be24e9c8a7739`,
strict-compiled all three schemas under AJV 2020, validated the config, and
found no blocking, material, or minor issue. It confirmed that the additions
were total and moved no detector, population, threshold, interpretation,
candidate, or proof boundary. The R9 contract hold is discharged.

The subsequent Red-first repetition slice exposed the distinct occurrence
identity and outer-array order gaps described above. Revision 2.3 closes only
those gaps at the current hashes. Independent R10 review matched all four
opening and closing hashes, strict-compiled all three schemas under AJV 2020,
validated the config, and found no blocking, material, or minor issue. Its
adversarial counterexample placed two identical eligible anonymous arrows on
one line: both had 47 nodes, 45 tokens, and identical normalised text, while
offsets `12..120` and `122..230` kept the occurrences distinct. The R10 hold is
discharged and repetition implementation may resume. The estate run remains
prohibited until integration and the external built smoke are complete.

The later classification map exposed a separate pinned-input and diagnostic
domain boundary rather than contradicting R10. Revision 2.4 closes only that
substrate and makes every still-open classifier slice an explicit schema-frozen
hold. The first R11 pass retained a schema/model mismatch and an orphaned
`auxiliary-read` diagnostic stage; both were cured before implementation.
Independent R11 re-review matched all four opening and closing hashes,
strict-compiled all three schemas under AJV 2020, validated the config, and
found no blocking, material, or minor issue. It confirmed that direct auxiliary
read refusals are never published as successful-ledger subjects and that later
classification remains prohibited. The R11 auxiliary-substrate hold is
discharged, and its implementation has subsequently passed its independent
code gateway.

The R12 contract-first map then totalised workspace parsing and attribution,
generated-output preflight, provenance matchers and signal identity, and role
selector/fallback semantics. Independent revision 2.5 review matched all four
opening and closing hashes, strict-compiled all three schemas under AJV 2020,
validated the config, type-checked the models, verified all ten producer paths
as pinned regular blobs, exercised adversarial schema mutations, and found no
blocking, material, or minor issue. The workspace/provenance/role contract
hold is discharged and those three implementation slices may begin. Module,
delivery, graph/ownership, candidate synthesis, and the estate run remain held
by the revision 2.5 implementation gate.

The first classification implementation gateway then exposed the
unknown-provenance wording contradiction described above. Revision 2.6 closes
that contradiction without changing the gate. Independent R13 re-review
matched the four hashes above, strict-compiled all three schemas under AJV
2020, validated the configuration, type-checked and linted the implementation,
and passed the corrected focused classification tests. It approved the current
tranche with no blocking or material correctness issue and no estate run. Its
friction-ratchet did require an assumptions review of the configuration-boundary
shape before this implementation pattern is extended; that architecture hold
does not alter the accepted 2.6 evidence contract.
