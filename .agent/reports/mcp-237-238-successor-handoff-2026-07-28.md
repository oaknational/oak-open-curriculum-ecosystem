---
status: permanent-dated-record
date: 2026-07-28
capture_boundary_utc: 2026-07-28T08:30:00Z
subject: mcp-product-analytics
identity: Swallow guards Tailwind / claude-code / claude-opus-5 / 805902
continues: mcp-63-stack-successor-handoff-2026-07-27-evening.md
---

# MCP-237 / MCP-238 successor handoff — 28 July 2026

Self-contained successor record for the M0 PostHog boundary, written at the
owner's word to prepare for handoff while MCP-237 is mid-flight.

It **continues** rather than replaces
[`mcp-63-stack-successor-handoff-2026-07-27-evening.md`](mcp-63-stack-successor-handoff-2026-07-27-evening.md)
and its parent
[`mcp-63-focused-successor-handoff-2026-07-27.md`](mcp-63-focused-successor-handoff-2026-07-27.md).
Everything those state remains true except where corrected below.

## The scope changed this morning — read this before the records

**Owner ruling, 2026-07-28 ~07:15Z**: M0's "initial PostHog" for the Friday
31 July submission means *events flowing safely, and `@posthog/mcp` in place*
— **not** the full MCP-237–244 stack. `@posthog/mcp` is consumed by the MCP
SDK logger in MCP-238, so the M0 line lands at **MCP-238**, which is also
exactly #576's close condition. The two boundaries coincide.

**MCP-239–244 moved to Engineering Complete, 12 August.** They are sequenced,
not dangling. A successor on this lane owns **two slices and nothing else**.

## Exact state at the capture boundary

| Ticket | State | Evidence |
| --- | --- | --- |
| MCP-237 | **Committed locally, push in flight** | commit `aaf769f11`, bot-authored, 2 files, +584 |
| MCP-238 | **Not started** | — |

**Worktree**: branch `<owner>/mcp-237-closed-product-analytics-sink`,
based on `origin/main` at `ebf3b670d`. Resolve its path with
`git worktree list` rather than assuming a location. Working tree **clean**
(0 entries) at capture — nothing exists only as uncommitted edits.

**What is written**: both MCP-237 files, committed.
**What is committed**: `aaf769f11`.
**What is pushed**: the push was launched at the capture boundary and its
outcome is NOT part of this record — a successor must read `git ls-remote`
for the branch rather than assume either way. If the branch is absent, the
commit is intact locally and only the push needs repeating.
**No PR was opened.** The PR body was drafted in the retiring seat's
scratchpad, which is not durable; every claim it made is reproduced in this
record.

`main` at capture: `ebf3b670d` (release 1.101.0, sitting directly on
`b0a2f832a`, the MCP-236 merge). Nothing has landed on
`packages/libs/posthog-node` since.

## Verified facts — do NOT re-derive these

Each was established first-hand this session against `origin/main`, not read
from a record.

1. **MCP-237 is exactly two files**: `product-analytics-sink.ts` (146 lines)
   and `product-analytics-sink.integration.test.ts`. Ticket ceiling is 6.
2. **No manifest change and no lockfile change are needed.** All four external
   dependencies (`@oaknational/build-metadata`, `@oaknational/observability`,
   `@oaknational/result`, `posthog-node`) were already in
   `packages/libs/posthog-node/package.json` at `origin/main`. The records'
   "plus only required manifest/lock changes" clause resolves to zero.
3. **All five internal imports already exist on main** —
   `actor-pseudonym-contract`, `active-actor-projection`,
   `event-policy-contract`, `event-policy-helpers`,
   `product-analytics-runtime-contract` — landed by MCP-234 and MCP-235.
4. **`product-analytics-sink.ts` is byte-identical to frozen `aac01d12d`.**
   Proven by `git show aac01d12d:<path> | diff - <path>` **after** reverting a
   deliberate mutation — not by trusting the revert.
5. **No package-index change is required.** The sink is internal until the
   MCP-238 runtime consumes it. The canonical `knip:gate` confirms this
   against a fully-built tree. The MCP-235 index-publication cure does **not**
   apply here; the risk was named in advance and is discharged.
6. **`knip:gate` crashes in a fresh worktree that is only partially built.**
   The signature is `Error loading apps/oak-search-cli/vitest.smoke.config.ts
   (No "exports" main defined in … @oaknational/env-resolution …)`. This is
   **not a finding** — it is the unbuilt-workspace-dependency class. A filtered
   `turbo build --filter=<pkg>^...` is not sufficient for a repo-wide gate;
   run full `pnpm build` first.

## The added test case, and why it is not extracted

MCP-237's ticket names five proof obligations: resource allowlist, actor
projection, minimal-Person behaviour, capture failure, content-free
operational errors. Read against **the ticket** rather than the records'
shorter summary, four are covered by the inherited suite and one is not.

`isError: true` appeared **zero times in 409 lines**, and `$mcp_is_error` was
hard-coded `false` in the single expected-properties constant. One case was
added — an errored read of a *second* allowlisted resource at zero duration —
closing three one-sided proofs at once (the error flag never round-tripped,
the second allowlist entry was never positively served, the `>= 0` duration
boundary was never exercised on the accepting side).

**The falsifier was executed, not asserted**: hard-coding
`$mcp_is_error: false` in `buildResourceReadMessage` fails exactly that one
test and leaves the other 110 green.

This is the same class as the MCP-234 key-disclosure gap. **Read each
ticket's own stated proof set against the extracted suite** — the records'
summaries are shorter than the tickets, and this has now paid twice.

## MCP-238 — inherited answers, do not re-open

- **The Vitest question is answered.** A package-local `vitest.config.ts`
  re-exporting the root `baseTestConfig` **is** the house pattern — six of six
  sibling `packages/libs/*` carry it. A freshly scaffolded package also needs
  `vitest.config.ts` added to the config-files override in its own
  `eslint.config.ts`, or the relative import of the shared base trips
  `import-x/no-relative-packages`. Both landed with MCP-234. The file-ceiling
  worry attached to this is discharged.
- **Verify MCP-238's extraction map against main before editing.** That
  discipline has now caught something **three** times (the MCP-235 mutual
  cycle, the MCP-237 narrowing, and the MCP-237 zero-manifest finding). The
  parent record's candidate list for MCP-238 is: package index exports,
  `posthog-final-wire.integration.test.ts`, `posthog-mcp-logger.smoke.ts`,
  `posthog-mcp-sdk-logger.ts`, `product-analytics-runtime.integration.test.ts`,
  `product-analytics-runtime.ts`. **Unverified** — treat as hypothesis.
- **When MCP-238 has a pushed and linked PR, #576's preservation condition
  becomes TRUE.** Tell the Director; he closes it without merging. Do not
  merge #576, ever.

## Decision-complete versus open

**Decision-complete** (no routing needed): MCP-237's scope and map; the added
test case and its falsifier; the knip verdict; MCP-238's Vitest question; the
M0 boundary at MCP-238; the serial one-PR-at-a-time discipline.

**Open**:

- The MCP-237 push outcome and whether a PR exists. **Read the remote.**
- The **gateway code review**. The Director has undertaken to run it from his
  own seat (one test-expert, Opus, focused on the 27-line test case) against
  the pushed diff before merge, because this seat's harness fences subagent
  dispatch. That promise stands whoever pushes. The pre-execution review rule
  was ruled **not to bind** this slice: its trigger is a `/loop` cycle that
  fans out sub-agent implementers, and a single seat extracting two files has
  no fan-out.
- MCP-238 in its entirety.

## Two corrections this session owes the record

1. **A pre-push/pre-commit gate failure is not automatically yours.** The
   MCP-237 commit's first attempt died on
   `apps/oak-curriculum-mcp-streamable-http/src/security-headers.integration.test.ts`
   with `Parse Error: Expected HTTP/, RTSP/ or ICE/`. That file is in a
   different package from this slice. Re-run in isolation before touching
   anything: it passed 29/29, so it is a concurrency flake under a loaded
   multi-agent host, not a defect and not a pre-existing break.

2. **An invented rationale is worse than a misread proxy.** This seat wrote
   that its harness's AgentTool prohibition "read as owner cost-control" and
   that dispatching would spend "budget he appears to have fenced". Nobody
   said that. The owner has confirmed he does not know why the directive
   exists. The inference was hedged in reasoning and **transmitted
   unhedged**, and it propagated through the Director toward the owner before
   being caught. A misread proxy keeps the error inside the evidence; a
   manufactured authority creates a constraint everyone downstream then
   obeys. **The directive's provenance is UNKNOWN.** Mark transmitted claims
   with a Fact / Owner's-call / To-verify ledger — most of all when the claim
   is about the owner.

## Operational facts still binding

- Settle reads derive required contexts from `/rules/branches/main` and check
  each **by name** across **both** `/commits/{sha}/check-runs` **and**
  `/commits/{sha}/status` — `Vercel` is a required status publishing no
  check-run.
- The bot token can expire **during** the pre-push gate chain (bare 403 on
  write, reads fine). Re-mint and retry; it is not a permissions problem.
- Mint with `pnpm --silent agent-tools merge-bot mint-token` — **no `--`
  before `merge-bot`**. The wrong form returns empty and lets `gh` fall back
  to the human credential.
- The merge endpoint requires the **full 40-character SHA**.
- Never pipe an exit code, and **do not trust the harness's own completion
  summary**: it reported "exit code 0" for a `knip:gate` that exited 1 and for
  a commit that exited 1, twice in one session, because the compound
  command's status was `tail`'s. The in-band echo caught both. The class has a
  documented home at
  [`wrapped-exit-codes-false-green.md`](../memory/active/patterns/wrapped-exit-codes-false-green.md).
- **Exit zero with empty output is the most dangerous variant** — emptiness
  reads as absence-of-problems when it may be absence-of-analysis. A
  `pnpm --filter <pkg> exec knip` passed vacuously here before the canonical
  `knip:gate` caught the real state.

## Claim disposition

Claim `63baafec-87b3-4905-b802-73f0a3678f0d`
(`packages/libs/posthog-node/src/**`, role implementer, thread
`mcp-product-analytics`) is **closed at stand-down, not retained**. There is
no dirty source to protect and no zombie owner to inherit: the worktree is
clean and the work is committed. A successor opens a **fresh** claim addressed
to its own slice rather than adopting this one.

## First successor action

1. Read this record and both parent records; the three are complete.
2. `git ls-remote origin <owner>/mcp-237-closed-product-analytics-sink`
   — establish whether the push landed. Do not assume.
3. If pushed and no PR exists, open the single-story PR, rebuilding its body
   from this record.
4. Tell the Director the diff is pushed so his gateway review can run.
5. Settle by name across both surfaces; merge under the standing mandate.
6. Then MCP-238, at a map verified against main first.

## Definition of done, unchanged in kind, narrowed in scope

The **M0** boundary is complete when MCP-237 and MCP-238 have settled under
their ticket proofs and #576 is closed without merging. The full MCP-63 stack
(MCP-239–244) completes at Engineering Complete, 12 August. A useful partial
slice is not completion.
