---
id: commit-queue-front-door-cleanup
node_type: delivery
name: Commit-queue front-door cleanup command
overview: >-
  A front-door agent-tools command that archives terminal and expired
  commit-queue entries so the live registry reads clean without hand-editing.
status: superseded
superseded_by: commit-queue-local-ephemera
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-08
ratified_where: >-
  Owner decision card at the Director seat 2026-08-08 morning ("Ratify");
  recorded on comms event 7b609205-293c-4702-9dd6-a975414e9cda
serves: coordination-substrate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-06
---

# Commit-queue front-door cleanup command

**Superseded (2026-09-06)** by `commit-queue-local-ephemera`, which replaced the shared
commit-queue registry this command was to clean with per-intent, machine-local queue
files (landed 2026-09-04); there is no shared registry left to archive entries from. This
is a plan-lifecycle transition (`ratified → superseded`, then the archive directory, the
placement every superseded delivery node takes), executed by the closing lead seat after
the support seat that landed the successor routed it at that lane's close.

Owner word commissioning this plan (2026-08-07, decision card at the
Director seat, verbatim): "Create a repo plan for it, not all work needs
a linear ticket." The repo plan is the record; no Linear ticket is
attached by owner direction.

## Goal

> **Status note, 2026-09-04 (PR #38 / MCP-612):** the premise below is
> superseded. Since registry schema 1.4.0 the queue is the machine-local
> per-intent `commit-queue/` store beside `active-claims.json` (owner ruling
> QUEUE-LOCAL, 2026-08-17): a TTL-expired intent reads as absent and is
> swept by the next queue write, `complete` removes a landed intent, and the
> standing debt named here was dropped as expired rows by the one-time
> migration. No drain command is needed. The node is superseded and archived
> (the note at the top); the plan-node schema makes that transition the
> seat's, and the owner confirmed on 2026-09-06 that lifecycle moves need no
> sign-off.

The `commit_queue` in `active-claims.json` holds only live intents.
Today it carries 190 expired entries (accumulating since July) because
no front-door command can drain them and hand-editing the live
substrate is barred. When this lands, the standing debt is drained and
future terminal or expired entries drain routinely through a tested
command instead of accumulating as registry noise.

## Mechanism

Extend the existing `agent-tools` commit-queue CLI with a cleanup
subcommand that reads the registry through the schema-validated store,
selects entries that are terminal (`completed` / `abandoned`) or expired
past a retention window, moves them count-conserved to the closed
archive surface, and writes both files through the store's existing
atomic-write path. Nothing is deleted — retention is knowledge, and the
archive is the record. The subcommand is the only sanctioned drain
path; the hand-edit bar stands.

## Acceptance criteria (each with a proof — required)

1. On a registry fixture holding live, terminal, and expired entries,
   the cleanup leaves exactly the live entries in `commit_queue` and
   every removed entry appears in the archive, count-conserved
   (before-count equals live-after plus archived-delta). Proof:
   `repo-safe` — agent-tools test suite; cite the test file on the
   implementing PR.
2. An entry belonging to a fresh, unexpired intent is never moved,
   whatever its phase. Proof: `repo-safe` — a dedicated test case.
3. The real registry's standing debt is drained by one command run,
   with the count-conservation arithmetic recorded in-band in the
   command output and quoted on the implementing PR. Proof:
   `repo-safe` — the recorded run plus a `claims` read before and
   after.

## Todos

- Single slice, one single-story PR (PDR-132 default budget, ≤2 review
  rounds): the subcommand, its tests, and the recorded drain of the
  standing debt. Implementer slices further at pickup only if the store
  surface forces it.

## Out of scope

- Claims-row archival policy — claims rows have their own lifecycle and
  tooling; this plan touches only `commit_queue` entries.
- Any change to enqueue / guard / commit semantics — the ceremony is
  correct; only the missing drain path is built.
- Retention-window policy design — the implementer names one sane
  default in the PR; tuning it later is ordinary configuration, not
  this plan.

## Review notes

The `plan-body-first-principles-check` shape fires at authoring (this
body); code-expert and test-expert fire on the implementing PR per the
standing reviewer matrix. No vendor integration is involved, so the
build-vs-buy and vendor-literal clauses do not fire.
