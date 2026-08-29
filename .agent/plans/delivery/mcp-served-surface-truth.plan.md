---
id: mcp-served-surface-truth
node_type: delivery
name: "Served-surface truth: cache refresh, dead tools, dead code, absence pins"
overview: >-
  Make the served surface tell the truth: refresh the stale schema cache,
  stop advertising the two tools whose upstream endpoints are gone, delete
  dead code, and execute the owner's absence-pin test ruling.
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-19
ratified_where: >-
  In-session owner word, Director session Ocelot binds Tunnel (c28ad9),
  2026-08-19 — verbatim: "ratify all three -- then commit and push",
  answering the enumerated stamp scope presented at that seat; the
  advertisement ruling folded the same day from the in-session card
  answer ("option 1 then leaning to 2, but let's see what 1 gives us").
serves: mcp-output-contracts
impact_areas:
  - served-surface
tickets:
  - MCP-630
depends_on: []
owner_gates: []
last_updated: 2026-08-19
---

# Served-surface truth: cache refresh, dead tools, dead code, absence pins

## Goal

The served MCP surface stops asserting things that are not true. Today
(verified first-hand 2026-08-19, live tool calls + credential-free HTTP):
`get-changelog` and `get-changelog-latest` are classified `live` in
`apps/oak-curriculum-mcp-streamable-http/src/served-surface/served-surface.ts`
while their upstream endpoints return 404 — the live spec (0.11.0,
32 paths) removed `/changelog` and `/changelog/latest`, which exist only
in the committed cache
(`packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json`,
version 0.7.0, 34 paths). Every user of those two tools gets a failure.
This is a live product defect, prior to and independent of output-schema
work, and it makes any per-live-tool acceptance drive unsatisfiable.

Sequencing note: PR #911 (MCP-626's signal arm) is in flight on the
schema-drift instrument this plan cites in acceptance criterion 1 —
land this plan's todo 1 after #911 merges, or rebase its proof reading
onto whichever instrument shape lands.

## Mechanism

- **Cache refresh + regeneration**: `pnpm sdk-codegen:refresh` then the
  canonical regeneration chain brings the cache to the live 0.11.0 spec.
  The two removed paths drop out of the generated descriptor set by
  construction. The served-surface rows do NOT vanish by construction —
  `SERVED_SURFACE.universalTools` is a hand-maintained literal typed
  `Readonly<Record<UniversalToolName, ServedState>>`, so regeneration
  turns the two stale rows into a compile error and a red totality test
  (`served-surface.unit.test.ts`), which force the manual row removal.
  That existing pair IS the red-first signal for this change. Verified
  safe on 2026-08-19 against live spec 0.11.0: after ref-resolution and
  prose-stripping, the 200-response schemas of all 32 shared paths are
  byte-identical between cache and live — the refresh removes dead
  surface; it does not change any live contract. Acceptance criterion 1
  re-checks in-sync at landing as the structural backstop for this
  perishable claim.
- **Regeneration blast radius** (all hand-maintained carriers of the
  dead tool names, enumerated so none survives as a phantom):
  `PUBLIC_TOOLS` in
  `packages/sdks/oak-sdk-codegen/code-generation/mcp-security-policy.ts`;
  the e2e tests that call both tools by name
  (`apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-enforcement.e2e.test.ts`,
  `application-routing.e2e.test.ts`) — these assert 401 before dispatch
  and would stay green for phantom tools, so they are retargeted to
  live tools, not merely observed; and the fixture fallback in
  `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/apply-security-policy.unit.test.ts`.
- **Dead code**: `formatData` in
  `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts`
  is an unreached third result producer carrying a divergent envelope
  shape; delete it (zero non-test callers, not on the public surface).
- **Absence-pin execution** (owner ruling 2026-08-19, recorded in
  testing-strategy.md §Rules): delete the
  `not.toHaveProperty('outputSchema')` assertion and its sibling
  config-literal pins in the oak-under-the-hood integration test. The
  durable record of the deliberate free-form shape lives in the
  completed tool plan
  (`.agent/plans-backlog-2026-07/sdk-and-mcp-enhancements/active/oak-under-the-hood.plan.md`
  §"No outputSchema"); as part of the same changeset, amend ADR-202
  with that free-form rationale (it already carries dated amendment
  sections) so the record survives the plan's eventual archival — the
  directive bullet requires the absence be recorded in the owning ADR
  or plan, and the executable pin being deleted is what makes the ADR
  amendment due now.
- **Comment truth**: the handlers.ts dormant-tool comment says two
  where the served-surface definition names three; correct it in
  passing.

## Acceptance criteria (each with a proof — required)

1. **The cache matches live at landing.** Proof (`repo-safe`): the
   committed cache's `info.version` equals the version the regeneration
   run recorded in the changeset; the schema-drift check reports
   in-sync on the landed commit — noting that instrument is an
   advisory landing-time signal, not a standing guard, so this
   criterion is evidence at landing, never a durable guarantee.
2. **No phantom tool survives.** Proof (`repo-safe`): after
   regeneration, the build compiles and the served-surface totality
   test passes with the two changelog rows removed (the typed
   `Record<UniversalToolName, ServedState>` makes a stale row a compile
   error); the blast-radius surfaces above carry no reference to the
   removed tool names, proven by the estate's existing gates (build,
   unit, e2e) staying green after retargeting — no new test is added
   for this, because the guarding pair already exists and a
   path-in-cache assertion would be a tautology this parcel's own
   testing doctrine forbids.
3. **The dead producer is gone.** Proof (`repo-safe`): `formatData` no
   longer exists; knip/dead-code and the full gate chain stay green.
4. **The oak-under-the-hood coverage proves behaviour only.** Proof
   (`repo-safe`): the integration suite for the tool passes while
   containing no configuration-object property pins (present or
   absent); the tool's served behaviour (closed empty input, pointer
   result) remains proven through its execution boundary; ADR-202
   carries the dated free-form amendment.

## Todos

1. **Cache refresh + regeneration + served-surface truth** —
   generated-artefact changeset (size-warning exempt per the
   generated-artefact clause of `design-work-for-small-prs`; PDR-132's
   two-round budget binds). Refresh, regenerate, remove the two dead
   rows the compile error names, retarget the blast-radius surfaces,
   re-derive counts everywhere they surface. Runs after PR #911 lands.
2. **Dead code + test-doctrine cleanup** — code changeset. Delete
   `formatData`; delete the absence/config pins in the
   oak-under-the-hood integration test per the owner ruling and land
   the ADR-202 amendment in the same changeset; correct the handlers.ts
   dormant comment.

Note for pickup: the sibling implementation plan's todos 1–8 are
start-safe in parallel with this plan; only its later slices (9–12)
wait for this plan's todo 1.

## Out of scope

- Output schemas themselves — the sibling implementation plan owns them.
- Restoring the changelog capability — the upstream removed the
  endpoints; if upstream restores them, regeneration re-adds the tools
  by construction.
- Any change to live tools' response handling — verified unnecessary
  (zero semantic response-schema drift on shared paths, 2026-08-19).
