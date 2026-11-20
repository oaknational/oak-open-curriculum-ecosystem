---
id: migrate-to-curriculum-api-v1
node_type: delivery
name: 'Migrate to the Oak Curriculum API v1'
overview: >-
  Move the generator, the SDK, the MCP app and the search CLI from /api/v0 to /api/v1 and bring
  the cached schema up to the published v1 schema, in one pull request.
status: ratified
ratified_by: owner
ratified_date: 2026-11-20
ratified_where: "The owner's answer to a question prompt in the session of Sandpiper guards Wind (690653), 2026-11-20: 'Go straight to v1'."
serves: upstream-api-currency
impact_areas:
  - served-surface
tickets: []
depends_on: []
last_updated: 2026-11-20
---

# Migrate to the Oak Curriculum API v1

## Goal

Everything this repository generates and serves is built from, and calls, the Oak Curriculum
API's current major.

## User groups and value

- **Teachers using Oak through an AI assistant** are served by the API version Oak maintains.
- **Developers using the SDK** get types and a default base address that match it.
- **Oak's API team** can retire v0 without this repository holding it open.

The owner, 2026-11-20: "We are going to need to migrate to V1 soon if not already done."

## What was read on 2026-11-20

Read from `https://open-api.thenational.academy` and the cached schema; re-read at pickup.

- The API's catalogue lists `/api/v1` and `/api/v0`. v0 describes itself as "frozen: it continues
  to receive fixes, but new endpoints and fields land in `/api/v1`", and its responses carry a
  `successor-version` link to v1. No sunset date was published.
- v1 is at 1.1.1; v0 is at 0.11.2. Apart from one example list they are the same document: the
  same 32 paths and the same schemas.
- The cache (`packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json`) is v0 at
  0.7.0, refreshed on 2026-08-03. Against v0 at 0.11.2 it differs in 221 places: 62 removals
  (the named response schemas under `components/schemas` are gone, and `/changelog` and
  `/changelog/latest` are no longer listed), 104 additions, 53 changed values and two wording changes.
- The v0 address is written in four source files: `codegen.ts` in `oak-sdk-codegen` (the schema
  address), `config/index.ts` in `oak-curriculum-sdk` (base and schema addresses, under a key
  named `v0`), `core-endpoints.ts` in the MCP app (the default for `OAK_API_BASE_URL`) and
  `api-helpers.ts` in the search CLI's evaluation code. Tests, READMEs and UAT reports name it
  too.

So the change has two parts of unequal risk. Almost all the risk is in the schema differences,
which this repository owes on either major. The address change is small because v1 equals
current v0.

## Mechanism

One pull request, straight to v1 (the owner, 2026-11-20: "Go straight to v1"). Its commits keep
the two parts apart so each can be read alone.

1. **Move to v1.** Change the four source addresses and the SDK's configuration key, and true the
   tests and documents that name v0.
2. **Refresh the cache to the published v1 schema.** Follow the `update-upstream-api-spec` skill
   and its runbooks: characterise the drift first-hand, refresh, regenerate, treat each failing
   correction-layer test as a signal about that correction's life, re-attest the MCP content
   audit, and verify the served tool descriptions. An upstream falsehood found on the way is
   reported upstream, never absorbed by loosening validation.

## Acceptance criteria

1. The cached schema's version equals the version `/api/v1/swagger.json` reports on the day, and
   its server address is `/api/v1`. Proof: `repo-safe`, the cache file and the advisory
   schema-drift check in CI.
2. No source file under `apps/` or `packages/` names `/api/v0`, other than a dated report.
   Proof: `repo-safe`, a search recorded on the pull request.
3. `pnpm check` passes with the generated files regenerated, not hand-edited. Proof:
   `repo-safe`, CI, and a clean `git status` after `pnpm sdk-codegen`.
4. Every tool the MCP app serves returns a successful result from the preview deployment against
   v1. Proof: `repo-safe`, the preview's tool run recorded on the pull request.
5. The MCP content audit is re-attested against the regenerated surface. Proof: `repo-safe`, the
   audit record in the same pull request.
6. Each correction-layer entry is either still needed, with its test passing, or removed with its
   test. Proof: `repo-safe`, the diff of step 2.

## Todos

1. Re-read the catalogue and both schemas; record the versions and whether a sunset date exists.
2. Characterise the 221 differences by kind: additive, consumer-breaking, document-only.
3. Step 1: the address change and the configuration key.
4. Step 2: refresh, regenerate, work through the correction layer and the content audit.
5. Run the served tools on the preview deployment against v1.
6. True the READMEs and the SDK documents that name v0.

## Out of scope

- New tools or fields built on what upstream has added since 0.7.0.
- The bulk-download schema, which has its own skill and authority (ADR-222).
- Keeping v0 selectable. The owner decides at pickup whether the SDK needs it; the default here
  is that it does not.
