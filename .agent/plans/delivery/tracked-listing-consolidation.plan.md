---
id: tracked-listing-consolidation
node_type: delivery
name: 'One tracked-file listing for every gate that reads the repository'
overview: 'The three private git ls-files copies left after the shared tracked-path set move onto core/repository-paths.ts, notion-fence first because its copy runs git through PATH and skips unreadable tracked files.'
status: sketch
serves: engineering-directions
impact_areas:
  - practice-and-estate
tickets: []
owner_gates: []
last_updated: 2026-09-24
---

# One tracked-file listing for every gate that reads the repository

## Goal

Every agent-tools gate that asks what the repository holds reads one listing,
`agent-tools/src/core/repository-paths.ts`, so a fix to how git is run or how its output is read
reaches every gate at once. Validators are the security floor, and a private copy that drifts is a
hole in whichever gate falls behind.

## Mechanism

The shared tracked-path set landed with the markdown-links validator as its first consumer, and
the core `listTrackedFiles` moved beside it. Three private copies remain, and they have already
drifted:

- `agent-tools/src/validators/notion-fence/validate-notion-fence.ts` runs `git` found through
  `PATH` rather than `resolveTrustedGit`, and skips a tracked file it cannot read. The skip is the
  green-gate bypass `core/tracked-file-scan.ts` exists to refuse. This one goes first, and its
  unreadable-file posture becomes a refusal.
- `agent-tools/src/workspace-census/inputs.ts` runs `git` through `PATH` and returns a Result.
- `agent-tools/src/encoding/check-encoding.ts` holds a byte-identical copy of the core listing.

Each moves onto the shared module, and its private copy is deleted in the same change.

## Acceptance criteria (each with a proof — required)

- No agent-tools source outside `core/repository-paths.ts` runs `git ls-files` — `repo-safe`: a
  search of `agent-tools/src` finds one call site.
- notion-fence refuses an unreadable tracked file instead of skipping it — `repo-safe`: a unit test
  over the pure decision.
- Every moved gate's standing run passes on the tree before and after — `repo-safe`: the runs
  recorded in each pull request.

## Out of scope

New gates. The cited-path and cited-script validators from the second estate's J2 build on the
shared module when they land, and add no copy of their own.

## Todos

Sliced at pickup by the implementer.
