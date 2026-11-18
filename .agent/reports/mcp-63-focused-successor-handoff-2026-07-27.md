---
status: permanent-dated-record
date: 2026-07-27
capture_boundary_utc: 2026-07-27T13:12:39Z
subject: mcp-product-analytics
identity: Cutter hunts Lagoon / codex / GPT-5 / 019f9e
---

# MCP-63 focused successor handoff — 27 July 2026

This is the permanent, self-contained successor record for Cutter hunts
Lagoon's MCP-63 boundary. It records the state reached before the Codex seat
exhausted its credits. It is intentionally more durable than the operational
thread, plans, claims, comms events, and watcher state, all of which are
temporary coordination surfaces.

Tracking is not used here as a proxy for importance, safety, authority, or
permanence. Source work is safe because it is committed, pushed, and attached
to pull requests. This report is a legitimate long-term destination because
of its semantic role. At the capture boundary, the closeout documentation
created by the exhausted seat still required Director custody, commit, push,
and a PR before it would itself be safe.

## Review and evidence contract

- **Purpose:** let another agent resume the MCP-63 replacement stack without
  reconstructing the session or depending on ephemeral comms.
- **Successful use:** the successor can identify the first safe action, the
  exact protected Git heads, the remaining ticket order, the frozen source
  boundary, and every known uncertainty.
- **Evidence boundary:** Git and PR evidence was read directly. PR #592 was
  last recounted at `2026-07-27T13:01:59Z`; local Git evidence was refreshed at
  the report capture boundary. Any external state can drift after those
  timestamps and must be recounted before mutation.
- **Authority boundary:** current owner direction, ratified plans, ADR-218,
  and live GitHub state remain authoritative. This record preserves dated
  facts and causal understanding; it does not silently widen a ticket.
- **Non-goals:** this is not a claim, execution plan, merge authorisation, or
  proof that later PRs are green.

## Outcome delivered

The inherited PostHog adapter implementation was decomposed from a large
review surface into a serial replacement stack. The first two replacement PRs
merged. A validator-discovered indivisible MCP232+MCP233 bundle is published
as the third PR and was green and thread-clean at the last recount.

| PR | Ticket boundary | Captured state | Protected Git identity |
| --- | --- | --- | --- |
| [#585](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/585) | MCP230 provider-neutral port | merged | merge commit `4c677f391` |
| [#586](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/586) | MCP231 adapter skeleton | merged | head `91c982e20`; merge commit `8dba5ab537836a829981bd13525d1bd286f53089` |
| [#592](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/592) | MCP232 vendor boundary plus MCP233 dependency-cruiser enforcement | draft; green and thread-clean at last recount | exact head `2fdce34759dcfed7e70c2fc31690276b12fff2fa` |
| [#576](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/576) | original frozen adapter source | draft preservation surface; do not merge | exact head `aac01d12dd696e4e1831a683b41fde692be721ca` |

PR #592 contains exactly 18 files. At the last direct recount it was
`MERGEABLE`, with merge state `BLOCKED` only because it remained a draft:
31 checks passed, none failed or remained pending, review threads were 0/0,
there were no review requests or reviews, and the Sonar quality gate passed
with no reported issues or hotspots. Its local worktree was clean and exactly
synced to upstream, 0 ahead and 0 behind, at capture.

The MCP232 dependency-boundary contract could not be truthfully reviewed
without the MCP233 validator support that enforces it. That is the warranted
exception to the otherwise one-ticket-per-PR stack. It is not precedent for
combining later independent tickets.

## First successor action

Director Squall wakes Apex owns the immediate shepherding boundary.

1. Recount PR #592 at exact head
   `2fdce34759dcfed7e70c2fc31690276b12fff2fa`.
2. If it is still green, clean, mergeable, and thread-clean, mark it ready for
   review using the repository merge-bot identity.
3. Recount after the ready transition. If it remains green and clean, merge it
   immediately. The owner's standing direction is explicit: no additional
   approval is required to merge a green and clean PR.
4. Mark MCP232 and MCP233 Done and correct their stale link to closed false
   start PR #591 when the Linear connector permits writes.
5. Open a new, successor-owned claim for MCP234. Do not adopt or revive
   Cutter's closed claims.

Use this exact token invocation from the primary repository:

```sh
bot_token=$(pnpm --silent agent-tools merge-bot mint-token)
```

Do **not** insert `--` before `merge-bot`. The incorrect command returned
empty output; `GH_TOKEN=""` then allowed `gh` to fall back to the human
credential and created PR #591 under the wrong identity. That false start was
closed immediately and replaced by bot-authored PR #592. Before every GitHub
write, verify GraphQL `viewer.login` is
`jimbot-oakington-iii[bot]`. A REST `/user` 403 is expected for an App
installation token and is not the identity test.

When merging, protect the exact head. Never use `--admin`. If state changed,
stop at the changed evidence rather than forcing the remembered outcome.

## Frozen PR #576

PR #576 is lineage and extraction source, not a merge candidate. Keep it open
at exact head `aac01d12dd696e4e1831a683b41fde692be721ca` until **every**
adapter-foundation replacement through MCP238 has a pushed and linked PR.
MCP234–MCP238 had not started at capture, so the close condition was false.

Extract later work by path from the frozen head. Do not cherry-pick its mixed
commits. Its older automatic-wrapper language and ticket wording about
owner-gated merging do not override ADR-218 or the owner's current direction.

The frozen worktree was clean and exactly synced to upstream, 0 ahead and
0 behind. The original local delivery branch was also clean but was four
commits ahead and 62 behind `origin/main` at capture. Those four commits have
no unique unsafe source: patch-ID comparison matched them to merged PR #573
and the three commits already preserved by PR #576. Keep the branch as
historical evidence; do not deliver from it and do not delete it during
pickup.

## Remaining serial stack

Only one replacement PR should be open at a time. Local preparation may run
ahead, but do not open the next dependent PR before its predecessor settles.

| Ticket | Intended boundary | File ceiling / proof |
| --- | --- | --- |
| MCP234 | actor pseudonyms | no more than 7 files; golden vector, rotation, deletion, and contract proof |
| MCP235 | closed event policy | exactly 8 policy files |
| MCP236 | public transport observer | no more than 7 files |
| MCP237 | closed product-analytics sink | no more than 6 files |
| MCP238 | runtime composition and logger | no more than 8 files |
| MCP239 | application configuration | no more than 10 files |
| MCP240 | application dependency and deploy documentation | no more than 5 files |
| MCP241 | application runtime and transport composition | no more than 10 files |
| MCP242 | resource reads | no more than 10 files |
| MCP243 | process lifecycle | no more than 10 files |
| MCP244 | final protocol and built-application proof | no more than 20 files |

MCP234 should be the next implementation slice after #592 merges. The
candidate extraction map below comes from the frozen source and must be
verified against the live ticket and main before editing:

- **MCP234:** `actor-pseudonym-contract.ts`, `actor-pseudonym.ts`,
  `actor-pseudonym.unit.test.ts`, package index exports, and only the
  README/manifest/lock changes actually required by the proof. Verify the
  seven-file ceiling and whether a package-local Vitest configuration is
  needed.
- **MCP235:** `automatic-event-policy.ts`,
  `automatic-event-policy.unit.test.ts`,
  `event-policy-canonical-values.integration.test.ts`,
  `event-policy-contract.ts`, `event-policy-helpers.ts`,
  `event-policy.integration.test.ts`, `event-policy.ts`, and
  `final-event-policy.ts`. This is the exact eight-file boundary.
- **MCP236:** `mcp-transport-event-observer.ts`,
  `mcp-transport-event-reader.ts`,
  `mcp-transport-observer-collaborator.integration.test.ts`,
  `mcp-transport-observer-contract.ts`, `mcp-transport-observer.ts`, plus only
  required manifest/lock changes.
- **MCP237:** `active-actor-projection.ts`,
  `product-analytics-runtime-contract.ts`,
  `product-analytics-sink.integration.test.ts`,
  `product-analytics-sink.ts`, plus only required manifest/lock changes.
- **MCP238:** package index exports,
  `posthog-final-wire.integration.test.ts`,
  `posthog-mcp-logger.smoke.ts`, `posthog-mcp-sdk-logger.ts`,
  `product-analytics-runtime.integration.test.ts`,
  `product-analytics-runtime.ts`, plus only required manifest/lock changes.

There is one unresolved MCP238 count risk: the frozen source also contains
`vitest.config.ts`. The successor must prove where that configuration is
actually needed or omit it; its presence is not permission to exceed the
ticket ceiling.

No application source for MCP239–MCP244 had landed in the replacement stack at
capture.

## Tracking and authority repairs

- MCP230 and MCP231 were Done.
- MCP232 and MCP233 were In Progress and linked to both canonical #592 and
  closed false start #591.
- MCP234–MCP244 were Backlog with serial dependencies.
- MCP63 remained In Progress and linked #585, #586, #592, and preserved #576.
- MCP63's Linear description still said merge execution was owner-gated.
  That sentence was stale: the owner's latest direction permits merging a
  green and clean PR without asking. Correct it when connector writes are
  available.

Linear tracks delivery state; it is not the permanent knowledge home for the
causal model in this report.

## Claims, queues, and worktrees at closeout

Cutter held seven inherited file claims during implementation. All were to be
closed at seat retirement, because the code boundary was at rest and safe on
published PRs. A successor should make a fresh claim addressed to its exact
slice. There is no adoptable dirty source and no reason to preserve a zombie
owner.

The commit queue contained historical entries, but every inspected Cutter
entry was `abandoned`; Cutter held no active Git intent or Git claim. The old
main-merge Git claim had already closed.

The primary coordination worktree contained peer-owned tracked changes in:

- `.agent/collaboration/rapid-comms/2026-07-27-mcp-227-228-delivery-squall-wakes-apex-peony-spins-tendril.md`
- `.agent/memory/active/napkin.md`
- `.agent/memory/operational/threads/design-system-integration.next-session.md`
- `.agent/memory/operational/threads/mcp-agent-facing-content.next-session.md`
- `.agent/memory/operational/threads/upstream-api-alignment.next-session.md`

and a peer-owned untracked experience letter. These are not MCP-63 source
work. Preserve them; never stage, reset, or overwrite them as part of this
handoff. Cutter's napkin contribution is an append to the already shared
file, so the Director must preserve both the peer edits and the new entry.

## Concept exploration and changed understanding

The closeout problem was not “write a summary.” It was how to transfer
actionability and causal knowledge under a terminal seat constraint without
seizing the Director's repo-wide closeout authority.

Load-bearing observations:

- A running watcher, an advancing cursor, delivered bytes, a notification, and
  cognition are different liveness classes. The user discovered that messages
  were being consumed without waking this reasoning loop.
- “Green,” “clean,” “ready,” and “merged” are separate states. PR #592 had
  green checks and no threads but remained a draft.
- Large PRs multiplied review-comment complexity. The small serial stack made
  each story settle independently. MCP232+MCP233 stayed together only because
  the validator made their proof indivisible.
- Empty authentication material is not a harmless failure. In the GitHub CLI
  it can expose a fallback credential and change authorship.
- A local branch can be ahead without containing unsafe unique work. Patch-ID
  equivalence, not ahead count alone, established the old branch's status.
- Temporary claims, comms, operational threads, and plans are useful routing
  surfaces, but none is a long-term safety destination. This permanent record
  is the semantic custody surface; the Director still needs to land it.

The proposed continuation is therefore deliberately small: settle #592, then
resume one ticket at a time from MCP234. Its warrant is the observed reduction
in review complexity. Its falsifier is any live dependency proof showing a
ticket cannot be reviewed or validated independently; if found, document the
exact indivisibility rather than widening by convenience.

## Loss and metaloss scan

First pass recovered:

- the bot-token empty-output fallback and wrong-author false start;
- the distinction between #592 being green and it actually being ready;
- #576's all-MCP230–238 close condition;
- patch equivalence for the four old local commits;
- the stale owner-gated Linear wording;
- the fact that these closeout documents were not yet safe until the Director
  committed, pushed, and opened their PR.

Second pass recovered losses in the recovery process itself:

- an index of knowledge homes also needs a permanent home, hence this report;
- custody of the report must be directed to a seat with GitHub capacity;
- connector state and external PR state can drift after the capture boundary;
- no self-authored handoff can prove its own completeness, so user corrections,
  Director instructions, exact Git identities, and falsifiers remain visible.

A third pass would only re-find the indexed current-state drift,
green-versus-ready distinction, and landing/custody requirement. The
recursion therefore closes here.

## Successor definition of done

The focused successor stack is complete only when MCP230–MCP244 have settled
under their ticket proofs, #576's preservation condition is true and it is
closed without merging, MCP63's acceptance evidence is current, and the final
built application proves the ratified privacy and lifecycle contract. A useful
partial slice is not completion.


_Record locations, 2026-09-06: of the thread records named above by their paths of the
time, those the 2026-09-06 consolidation paused moved under
`.agent/memory/operational/threads/paused/` (the threads README's lifecycle layout; the
paused index in `repo-continuity.md` names each); a record still active keeps its root path
under `.agent/memory/operational/threads/`; the paths here are the historical ones._
