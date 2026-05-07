---
phase: 0
status: complete
merge_class: index-narrative-tables
---

# Memory/State Contract Doctor Phase 0 Ledger

**Date**: 2026-05-07
**Agent**: Stratospheric Whirling Airstream / codex / GPT-5 / `019e02`
**Plan**: [`memory-state-contract-doctor.plan.md`](memory-state-contract-doctor.plan.md)

This ledger is the Phase 0 evidence surface for the memory/state contract
doctor. It records the current substrate state, existing checks, Known Contract
Gaps classifications, and the checkpoint that must happen before Phase 1
fixtures. It is not an implementation surface and does not add
`practice:substrate:*` aliases.

## Scope Boundary

Phase 0 covers read-only evidence plus this sidecar ledger and plan
bookkeeping. It does not author fixtures, implement doctor logic, add root
substrate aliases, clean historical archives, rewrite evidence, or trim content
to satisfy fitness.

The command contract remains queued in the parent plan:

```bash
pnpm practice:substrate:check
pnpm practice:substrate:check -- --mode strict
pnpm practice:substrate:repair -- --dry-run
pnpm practice:substrate:repair -- --apply
```

Those commands are unavailable until the implementation phases land. Phase 0
validation must use existing checks and explicit read-only probes only.

## Session Preflight

| Check | Result |
| --- | --- |
| Identity preflight | `Stratospheric Whirling Airstream / codex / GPT-5 / 019e02`, seed `CODEX_THREAD_ID` |
| Branch and HEAD | `fix/sonar-fixes-20260506` at `bf1094338d93e19c265e31539c455e78d1477b9d` |
| Active claims before Phase 0 claim | 0 live claims |
| Commit queue before Phase 0 claim | 15 entries, all `abandoned` |
| Phase 0 claim | `921db177-7cb0-45da-bf18-7fd595ef6451` |

## Existing Check Inventory

| Concern | Existing owner/check | Current result | Gap |
| --- | --- | --- | --- |
| Narrow collaboration-state parsing | `pnpm agent-tools:collaboration-state -- check --active ... --closed ... --events-dir .../comms-events` | Passes | Does not drift-check generated read models or validate broader substrate inventory |
| Working-tree whitespace | `git diff --check` | Passes | No substrate-specific coverage |
| Root script regression lane | `pnpm test:root-scripts` | Passes before ledger drafting | Does not include substrate doctor because it does not exist yet |
| Portability | `pnpm portability:check` | Passes before ledger drafting | Validates platform adapters, not substrate health |
| Fitness vocabulary | `pnpm practice:vocabulary` | Passes before ledger drafting | Vocabulary-only |
| Practice fitness | `pnpm practice:fitness:informational` | Reports known routed pressure | Fitness is a routing signal, not repair permission |
| Markdown structure | `pnpm markdownlint-check:root` | Passes before ledger drafting | Does not validate substrate semantics |
| Strict substrate manifest | Direct JSON parse and required-field probe | 22 surfaces, no missing required fields, no duplicate surface IDs | No exposed root JSON Schema validator for this manifest yet |
| Migration ledger | Direct read-only hash and byte-count probe | 114 entries, no duplicate original/target paths, no target byte/hash drift | Probe is ad hoc until doctor report mode owns it |
| Legacy event root | `find .agent/state/collaboration/comms/events -maxdepth 1 -type f -print` | `.gitkeep` only | Needs doctor enforcement |
| Conflict markers | `rg -n "^(<<<<<<<\|=======\|>>>>>>>)" .agent/memory .agent/state` | No matches | Needs doctor enforcement |
| Root substrate aliases | `rg -n "practice:substrate" package.json agent-tools/package.json` | No matches | Expected until implementation phases |

## Current Substrate Evidence

| Evidence | Result |
| --- | --- |
| Manifest required contract fields | 22 surfaces; all carry the 13 required PDR-050 fields |
| Manifest duplicate IDs | None |
| Migration ledger entries | 114 |
| Migration ledger duplicate original paths | None |
| Migration ledger duplicate target paths | None |
| Migration ledger target byte/hash drift | None |
| Legacy `comms/events/` root | Known-good terminal state: `.gitkeep` only |
| Canonical event root | Explicit collaboration-state parse passes against `comms-events/` |
| Shared comms log header | Present: generated from canonical `comms-events/` |
| Active/closed claim IDs | No duplicate active IDs, no duplicate closed IDs, no active/closed overlap |
| Current active claims | One Phase 0 claim owned by this session |
| Current commit queue | 15 abandoned entries; no active queued/staging/pre-commit entries |
| Conversation examples in live root | Two `.example.json` files; manifest declares explicit exclusion |

## Known Contract Gaps Classification

| Gap | Classification | Severity | Repairability | Owner/reviewer route | Evidence and Phase 1 implication |
| --- | --- | --- | --- | --- | --- |
| `comms/events/` legacy fragments migrated | Known-good terminal state | Informational unless JSON reappears | Deterministic validation only | Agent tooling doctor | Ledger has 114 entries with matching target hashes and byte counts; legacy root is `.gitkeep` only. Phase 1 fixture should prove JSON under legacy root is blocking while `.gitkeep` is accepted. |
| Live and archived prose still mention `comms/events/` | Deferred semantic review | Review-required | Manual-with-provenance | Doctor stale-path classifier plus docs-ADR reviewer | `rg` finds live, archived, generated, ledger, and evidence references. Archived/generated references are preserved evidence; only live instructions should become defects after semantic classification. |
| `shared-comms-log.md` is not drift-checked by no-arg collaboration check | Live deterministic checker defect | Blocking once doctor exists | Deterministic | Agent tooling doctor; test-reviewer for fixtures | `renderSharedCommsLog` can regenerate the read model, but current `check` only parses events. Phase 1 needs a pure fixture for source fragments vs committed read-model drift. |
| Communication event JSON has a parser but no colocated JSON Schema | Live contract defect | Blocking for contract completeness | Manual-with-provenance first, deterministic later | Agent tooling | `parseCommsEvent` exists in `agent-tools`, but no colocated `comms-event.schema.json` exists beside the event root. Phase 1 should not invent the schema yet; it should encode the expected validator boundary. |
| Markdown `merge_class` coverage is partial | Live structural metadata defect | Review-required until unambiguous | Deterministic only after contract is clear | Doctor report/repair mode plus docs-ADR reviewer | Read-only probe found 133 non-archive `.agent/memory`/`.agent/state` Markdown files, 8 with `merge_class`, 125 without. Phase 1 should separate missing metadata detection from automatic repair. |
| Conversation example files sit inside the live root | Known-good terminal state with enforcement gap | Informational now; blocking if parsed as live | Deterministic exclusion | Doctor inventory parser | Manifest explicitly excludes `.agent/state/collaboration/conversations/*.example.json`; two example files are present. Phase 1 should prove examples are excluded while real conversation files are parsed. |
| Directory README contract coverage is partial across memory roots | Live structural metadata defect | Review-required | Manual-with-provenance | Doctor report mode plus docs-ADR reviewer | Read-only probe found 21 non-archive/non-fixture directories under `.agent/memory`/`.agent/state`, 11 with README files and 10 without. Some are historical or transitional; doctor must classify before repair. |
| Memory/state merge claims lack topology validation | Live checker defect | Review-required, blocking when validating merge claims | Manual-with-provenance for judgement, deterministic for topology facts | Doctor topology phase plus architecture reviewer | Current checks parse state content but do not inspect git parentage or prove a merge claim preserved ancestry. Phase 1 should use injected topology snapshots, not live git IO in in-process tests. |

## Fixture Strategy Checkpoint

`test-reviewer` ran after Phase 0 ledger drafting and found one blocker: the
planned Phase 1 validation command could pass without selecting the substrate
fixture suite. The parent plan now replaces that lane with:

```bash
pnpm --filter @oaknational/agent-tools exec vitest run \
  tests/practice-substrate --passWithNoTests=false
```

The no-match behaviour was verified with an impossible file path; the command
exited 1 with "No test files found". The old
`pnpm --filter @oaknational/agent-tools test -- practice-substrate` form is
forbidden for Phase 1 validation.

The checkpoint otherwise approved the fixture strategy, subject to this lane
fix. Phase 1 should verify:

- fixture tests are pure in-process tests over injected snapshots, strings, and
  literal objects;
- live filesystem and git topology access stays in the runtime validator, not
  in unit tests;
- no test reads `process.env`, `process.cwd()`, repo files, fixture files, or
  live git state;
- each fixture class lands with the product code that greens it;
- no RED-only commit, skipped test, conditional test, or product-code-only
  landing is permitted.

Phase 1 may not begin unless this exact-match, no-zero-tests validation lane is
preserved or replaced by an equivalent dedicated script/config that fails on
zero selected tests.

## Fitness Disposition

`pnpm practice:fitness:informational` is expected to report existing routed
pressure. The current known pressure is led by `repo-continuity.md`,
`napkin.md`, and `practice.md`. This is not Phase 0 repair scope. Per
PDR-050 and the napkin rule, substance must be preserved first; fitness routes
to homing, graduation, splitting, limit review, or explicit remediation lanes.

## Open Phase 1 Inputs

- Implement a real substrate manifest/schema validator in the doctor rather
  than relying on the ad hoc Phase 0 probe.
- Decide whether communication event JSON gets a colocated JSON Schema or a
  generated schema from existing parser types.
- Encode stale-path classification with archived/generated/evidence exclusions
  before treating `comms/events` prose mentions as blocking.
- Keep root aliases absent until built `agent-tools` substrate output exists.
