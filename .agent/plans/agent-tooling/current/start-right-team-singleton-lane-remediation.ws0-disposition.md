# WS0 Baseline Disposition Ledger

**Plan**: [`start-right-team-singleton-lane-remediation.plan.md`](./start-right-team-singleton-lane-remediation.plan.md)
**Authored**: 2026-05-20 (Stormy Plumbing Atoll / claude / claude-opus-4-7-1m / 2e2764)
**Reviewer dispatch + N3 absorption**: 2026-05-20 (Shaded Creeping Cloak / claude / claude-opus-4-7-1m / 4ef359). Assumptions-expert APPROVE; architecture-expert-fred GO-WITH-CONDITIONS (condition 1 absorbed at `5a55fa4d`; condition 2 invalid).
**Owner sign-off**: 2026-05-20 — "Fine, consider it approved".
**Status**: WS0 acceptance proof complete and owner-approved. WS1 unblocked.

## Scope

Companion report to the lean multi-vendor singleton-lane remediation
(WS0+WS1+WS2+WS3). Records every disposition required by the WS0 acceptance
criteria:

- every stale `comms-events` directory reference,
- every agent-facing `--comms-dir` / `--events-dir` / `--messages-dir` /
  `--lifecycle-dir` / `comms migrate` surface,
- team-start and claim-open entry points that ask agents to choose
  ownership before route formation,
- cleanup flows mutating `.agent/state/collaboration/**`,
- memory entries presenting retired path or CLI shapes as live current
  instructions.

The ledger distinguishes workspace files from external memory notes.

## Inventory Command (reproducible)

```bash
rg -n "comms-events|--comms-dir|--events-dir|--messages-dir|--lifecycle-dir|comms migrate|active_claims" .agent agent-tools
```

Total hits at ledger time: **1001 lines across 385 files** in workspace
scope. Distribution:

| Top-level | File count | Disposition class |
| --- | --- | --- |
| `.agent/state/collaboration/` | 313 | historical-evidence (bulk class) |
| `.agent/memory/active/` | 14 | mixed (active distilled.md + archived napkins) |
| `.agent/plans/agent-tooling/` | 10 | mixed (live plans + completed/archived) |
| `.agent/plans/agentic-engineering-enhancements/` | 9 | mixed |
| `.agent/memory/operational/` | 8 | mixed (live continuity + archive) |
| `agent-tools/tests/collaboration-state/` | 4 | test-fixture |
| `agent-tools/src/practice-substrate/` | 4 | update (live migration-ledger surface) |
| `agent-tools/src/collaboration-state/` | 2 | update (CLI specs — WS3 territory) |
| `agent-tools/tests/practice-substrate/` | 2 | test-fixture |
| Other | ≤2 each | per row below |

## Class A — Source Code (live behaviour, WS3 territory)

| File | Line(s) | Match | Disposition | Owner |
| --- | --- | --- | --- | --- |
| `agent-tools/src/collaboration-state/cli-specs.ts` | 58, 67, 75, 81–82, 87, 93, 100, 109, 174, 194 | `--comms-dir`, `--events-dir`, `--messages-dir`, `--lifecycle-dir`, `comms migrate` in normal agent-facing CLI help | **update** — WS3 removes path-override flags from ordinary comms commands and the public `comms migrate` shape | WS3 |
| `agent-tools/src/collaboration-state/tui/config.unit.test.ts` | 30 | `--comms-dir` exercising current TUI CLI shape | **test-fixture** — covers current behaviour. When WS3 removes the flag, this fixture moves to a runtime-IO injection seam rather than a path flag | WS3 |
| `agent-tools/src/collaboration-state/cli-comms-watch.ts` | 16+ | `comms watch` identity filter currently keyed on `(agent_name, session_id_prefix)` only — partial PDR-027 tuple | **update** — WS3 absorbed scope: widen filter to full tuple `(agent_name, platform, model, session_id_prefix)` with self-echo unit test | WS3 |
| `agent-tools/src/practice-substrate/live-types.ts` | 13 | literal string `.agent/state/collaboration/comms-events/` as migration-ledger trigger | **update** — confirm ledger surface still relevant after WS4 sweep (removal vs retain decision lives in parent plan §WS4 expected changes) | WS4 |
| `agent-tools/src/practice-substrate/live-json.ts` | 10, 75 | `readCommsEventFiles`, `legacy-comms-events-migration-ledger` | **update** — same ledger surface; either retire when no instances remain, or retain as a permanent guard | WS4 |
| `agent-tools/src/practice-substrate/live-report.ts` | 85 | invokes `legacy-comms-events-migration-ledger` collector | **update** alongside live-json.ts | WS4 |
| `agent-tools/src/practice-substrate/report-evaluators.ts` | 40 | `LEDGER_SURFACE = 'legacy-comms-events-migration-ledger'` | **update** alongside live-json.ts | WS4 |

## Class B — Doctrine & Skill Documents (live wording)

| File | Line(s) | Concern | Disposition | Owner |
| --- | --- | --- | --- | --- |
| `.agent/state/README.md` | 44, 96 | Presents `collaboration/comms-events/` as a current root and explains regeneration *from* it | **update** — canonical root is `collaboration/comms/`; rewrite the two lines to reflect that and mark `comms-events/` historical-only if still mentioned | WS4 |
| `.agent/skills/session-handoff/SKILL-CANONICAL.md` | 216, 217 | Uses ambiguous term "session comms-events" while pointing at the canonical `comms/` path | **update** — disambiguate wording: "session comms events (stored under `comms/`)" or similar | WS4 |
| `.agent/skills/consolidate-docs/SKILL-CANONICAL.md` | 204, 247, 269 | Same "comms-events" term as both directory name and event class | **update** — same disambiguation as session-handoff | WS4 |
| `.agent/skills/start-right-team/SKILL-CANONICAL.md` | 70 | Team-start report line says `Claimed paths: <paths or none>` — **claim-first wording** | **update** — WS1 replaces with `Intended boundary` and `Claim status`, adds singleton-lane caveat | WS1 |
| `.agent/memory/operational/collaboration-state-conventions.md` | 45 | Surface table row presents `comms-events/` as the canonical communication-event directory with current authority/lifecycle/shape | **update** — WS4 retargets the row to `comms/` (canonical post-WS3 root) and either retires the row's reference link or repoints it | WS4 |
| `.agent/memory/operational/collaboration-state-conventions.md` | 100 | Prose: "The canonical communication-event directory is `comms-events/`." | **update** — WS4 replaces canonical-root name with `comms/`; retain explanatory clause about the older `comms/events/` legacy path as historical-only | WS4 |
| `.agent/memory/operational/collaboration-state-conventions.md` | 204 | Markdown reference-link definition: `[comms-events]: ../../state/collaboration/comms-events/` | **update** — WS4 repoints to `../../state/collaboration/comms/` or removes if the table row above is retired | WS4 |
| `.agent/memory/executive/memory-state-substrate-contracts.md` | 149 | Prose under "Legacy Event Transition Rule": "`.agent/state/collaboration/comms-events/` is the one live communication-event root." | **update** — WS4 changes the named live root to `.agent/state/collaboration/comms/` and adjusts the surrounding paragraph to mark `comms-events/` as deleted/legacy | WS4 |
| `.agent/memory/executive/memory-state-substrate-contracts.manifest.json` | 18 | Field `doctor_start_gate` references "canonical comms-events root" in prose | **update** — WS4 replaces "comms-events" with "comms" in the gate description | WS4 |
| `.agent/memory/executive/memory-state-substrate-contracts.manifest.json` | 50 | `generated_read_models[0].source` = `".agent/state/collaboration/comms-events/"` (path to renderer source) | **update** — WS4 retargets to `.agent/state/collaboration/comms/` once renderer source path is confirmed under the new root | WS4 |
| `.agent/memory/executive/memory-state-substrate-contracts.manifest.json` | 184 | `surfaces[].id` = `"collaboration-comms-events"` (logical id of the surface entry) | **update — name only** — WS4 renames id to `collaboration-comms` for consistency with the new path; cite at any consumer of the id | WS4 |
| `.agent/memory/executive/memory-state-substrate-contracts.manifest.json` | 185 | `surfaces[].path` = `".agent/state/collaboration/comms-events/"` | **update** — WS4 retargets `path` to `.agent/state/collaboration/comms/` | WS4 |
| `.agent/memory/executive/memory-state-substrate-contracts.manifest.json` | 200 | `surfaces[].validator` command string includes `--events-dir .agent/state/collaboration/comms-events` | **update — WS3 co-change** — this row is structurally coupled to the WS3 CLI-flag removal (per architecture-expert-fred 2026-05-20 ADR-034 boundary-contract finding). The manifest validator string and the CLI flag it invokes MUST be updated atomically. WS3 acceptance must include "manifest.json:200 validator string updated to remove `--events-dir` and retarget to the new root in the same commit as the CLI flag removal." Not a Class A WS3 row because the file is doctrine-level (Class B); not a deferred WS4 row because the executable contract drift would last the entire WS4 deferral window | WS3 (co-change, not deferred) |
| `.agent/memory/executive/memory-state-substrate-contracts.manifest.json` | 251 | `surfaces[].validator` field text: "future doctor regenerates from comms-events and compares" | **update — prose only** — WS4 changes the noun to "comms" to match the renamed root | WS4 |

## Class C — Team-Start and Claim-Open Entry Points

| Surface | Current behaviour | Disposition | Owner |
| --- | --- | --- | --- |
| `start-right-team` SKILL §Team Bootstrap step 1 | "Claimed paths: <paths or none>" — invites source claim as part of presence registration | **update** — WS1 replaces with intended-boundary + claim-status pair, plus singleton-lane rendezvous rule | WS1 |
| `agent-tools/src/collaboration-state/cli-claim-commands.ts` `openClaim` (line 15+) | Writes claim immediately, no overlap detection, no `team_routing_required` signal | **update** — WS2 adds overlap grouping + routing-required output | WS2 |
| `agent-tools/src/collaboration-state/cli-specs.ts` `claims open` help | Standard claim-open contract, no overlap surface | **update** — WS2 extends help/output schema | WS2 |

## Class D — Cleanup Flows Mutating `.agent/state/collaboration/**`

| Surface | Cleanup behaviour | Disposition | Owner |
| --- | --- | --- | --- |
| `agent-tools/src/practice-substrate/live-*.ts` | Reads comms-events files for migration-ledger checks (read-only) | **historical-evidence** of the migration — keep ledger surface; classification re-evaluated in WS4 if no comms-events files remain in repo | WS4 |
| Hand-authored `jq` probes against `.active_claims` (in past comms entries) | Wrong JSON key — registry uses `.claims` not `.active_claims` (named in plan §Problem). Attestation 2026-05-20: no `.active_claims` wording remains in `.agent/rules/**`, `.agent/directives/**`, `.agent/skills/**`, or `.agent/prompts/**` (`rg` clean). Remaining instances are inside historical-evidence surfaces only | **historical-evidence** in archived napkins/comms; no live doctrine doc requires deletion | WS5 (deferred) |
| `claims archive-stale` and similar | Writes `.agent/state/collaboration/closed-claims.archive.json` | **update** — WS5 (deferred parallel-with-graph) adds hot-window preflight | WS5 (deferred) |

## Class E — Memory Entries Presenting Retired Paths As Live

| Surface | Concern | Disposition |
| --- | --- | --- |
| `.agent/memory/active/distilled.md` | Contains old comms-events / --comms-dir guidance baked into hard-won rules | **update** — confirm each retained rule against canonical paths; remove or annotate stale items at next consolidation |
| `.agent/memory/active/archive/napkin-2026-05-*.md` (10+ files) | Historical session napkins discussing the migration | **historical-evidence** — preserved by design; no update |
| `.agent/memory/operational/repo-continuity.md` | Live continuity surface | **update** — sweep for retired-path references at WS4 |
| `.agent/memory/operational/pending-graduations.md` | Pending-graduations register | **update** — sweep at WS4 |
| `.agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md` | Live thread record | **update** — sweep at WS4 |
| External: `/Users/jim/.claude/projects/.../memory/MEMORY.md` and per-user files | Personal-memory references to retired CLI shapes (see `feedback_use_built_agent_tools_only.md` entry) | **update via external memory correction note ONLY with explicit owner permission per WS** (mirrors parent plan §Scope line 179); otherwise leave for owner-side curation |

**External memory notes scope**: Out of the workspace ledger by definition.
Listed here only to confirm the WS0 acceptance "distinguish workspace from
external" — workspace updates land in this plan's WS1–WS4 scope; external
correction is owner-cadenced and requires explicit per-execution permission.

## Class F — Historical Evidence (bulk class — no update)

**Closure rule (eliminates loophole)**: membership of Class F is the set
difference `(all 385 inventoried files) − (files itemised in Classes A, B,
C, D, E, G, H)`. Every file matching the inventory pattern is therefore
disposed exactly once: either it appears as a named row in another class,
or it falls into Class F by this closure. The class-disposition rationale
(append-only history-of-record; past discussion of retired paths is correct
historical content, not stale guidance) applies uniformly to every Class F
member.

| Surface | Disposition rationale |
| --- | --- |
| `.agent/state/collaboration/shared-comms-log.md` (345 matches) | Rendered history of agent comms events. Past entries legitimately discuss retired paths because they *were* live at the time. **historical-evidence** by construction. |
| `.agent/state/collaboration/closed-claims.archive.json` (49 matches) | Archived claim summaries. **historical-evidence**. |
| `.agent/state/collaboration/comms/*.json` (event files, ~250+) | Immutable event bodies. **historical-evidence**. |
| `.agent/memory/active/archive/napkin-2026-05-*.md` | Archived per-session napkins. **historical-evidence**. |
| `.agent/memory/operational/archive/repo-continuity-session-history-*.md` | Archived continuity snapshots. **historical-evidence**. |
| `.agent/experience/2026-05-*.md` | Per-session experience reports. **historical-evidence**. |
| `.agent/plans/.../archive/**` | Archived plans (completed, superseded). **historical-evidence**. |
| `.agent/plans/.../current/...opener.md` | Session openers naming the substrate state at the time. **historical-evidence** once the session closed; **update** only if explicitly referenced as live guidance. |
| `.agent/practice-core/decision-records/PDR-052-directive-file-context-budget.md` | PDR text references the substrate by name. **historical-evidence** unless content makes a stale claim. |
| `.agent/research/agentic-engineering/.../historical-napkin-synthesis-*.md` | Research synthesis. **historical-evidence**. |
| `.agent/prompts/agentic-engineering/collaboration/experiments/E1/*.md` | Experiment prompts. **historical-evidence**; if reused, **update** at re-use time only. |

## Class G — Plan Files (mixed)

| File | Disposition |
| --- | --- |
| `.agent/plans/agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md` (this remediation plan) | **historical-evidence** within itself; the plan *describes* the retired surfaces it removes. No self-update needed. |
| `.agent/plans/agent-tooling/current/collaboration-state-write-safety.plan.md` | **update at execution time** — if it still proposes work, sweep wording against canonical paths before execution. |
| `.agent/plans/agent-tooling/current/cost-of-collaboration.plan.md` | **update at execution time**. |
| `.agent/plans/agent-tooling/current/primary-agent-tooling-enhancements.plan.md` | **update at execution time**. |
| `.agent/plans/agent-tooling/current/2026-05-11-collaboration-protocol-hardening-*-opener.md` | **historical-evidence** (session openers, time-stamped). |
| `.agent/plans/agent-tooling/frictions-register.md` | **update at next register pass** if any entry presents retired paths as a live friction shape. |
| `.agent/plans/agent-tooling/future/collaboration-state-domain-model-and-comms-reliability.plan.md` | **update at promotion time** — when this future plan moves to current/active. |
| `.agent/plans/agent-tooling/future/comms-watch-liveness-floor.plan.md` | **update at promotion time** (deferred per the lens). |
| `.agent/plans/agentic-engineering-enhancements/current/2026-05-06-*-opener.md` | **historical-evidence** (session openers). |
| `.agent/plans/agentic-engineering-enhancements/current/2026-05-12-collaboration-protocol-hardening-r1b-opener.md` | **historical-evidence** (session opener). |
| `.agent/plans/agentic-engineering-enhancements/current/memory-state-substrate-portable-contracts.plan.md` | **update at execution time** if still active. |
| `.agent/plans/agentic-engineering-enhancements/future/multi-agent-delegation-orchestration.plan.md` | **update at promotion time**. |
| `.agent/plans/observability/current/feat-eef-exploration-completion.plan.md` | **update at execution time** if still active. |
| `.agent/plans/architecture-and-infrastructure/current/pr-90-landing-closure.plan.md` | **update at execution time** if still active. |

## Class H — Test Fixtures

| Path | Disposition |
| --- | --- |
| `agent-tools/tests/collaboration-state/*.test.ts` | **test-fixture** — tests that prove parser behaviour against the retired paths are valuable; keep. |
| `agent-tools/tests/practice-substrate/*.test.ts` | **test-fixture** — tests on the migration-ledger surface; classification follows live-json.ts (WS4). |

## WS0 Acceptance Mapping

| Acceptance bullet (plan §WS0) | Evidence in this ledger |
| --- | --- |
| Disposition table exists | Classes A–H above. |
| Every stale comms-root surface has one disposition | Class A (source — update), Class B (doctrine — update; line-by-line dispositions now enumerated for all three previously partial-WS0 surfaces — 2026-05-20 Shaded Creeping Cloak / claude / opus-4-7-1m / 4ef359), Class F (historical-evidence — preserved), Class G (plans — update-at-execution), Class H (test-fixture — keep). Bulk class F covers the 313 collaboration/ matches and 14 archived memory matches by category. |
| Workspace vs external distinguished | Class E names workspace memory files explicitly and the external `/Users/jim/.claude/projects/...` correction surface separately. |
| No implementation change starts before ledger exists | This file is the gate; WS1+ proceeds only after owner review. |

## Next Safe Step

WS1 (team-start rendezvous contract) — amend
`.agent/skills/start-right-team/SKILL-CANONICAL.md` line 70 per Class B
row and add the singleton-lane caveat. Solo execution; stays in this session
only if owner-directed, otherwise hands off to the next session per the
plan's prerequisite-classification stipulation that owner review precedes
execution.
