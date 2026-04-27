---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in the repo-continuity
[`Deep consolidation status`](../operational/repo-continuity.md#deep-consolidation-status)
register.

The previous overweight active napkin was archived before this reset at
[`archive/napkin-2026-04-26b.md`](archive/napkin-2026-04-26b.md).

---

## 2026-04-27 — Riverine Navigating Hull — `update-config` deferral was overcautious; existing config schema accepted the wiring directly

**Context:** Codex's Phase 4 deferred Claude Code statusline installation
to a future Claude session "with the `update-config` skill available" on
the assumption that wiring `statusLine.command` would require schema
manipulation beyond a settings.json edit. Phase 8 in this Claude Code
session investigated and found `.claude/settings.json` already exposes
`statusLine: { type, command }` as a first-class field; a direct edit
plus a thin `.claude/scripts/` shim was sufficient.

**Lesson:** before deferring work to "a session with skill X," check
whether the target config surface already accepts the change directly.
Skill availability is a tool-access constraint, not a config-schema
constraint. The two get conflated when the deferring agent has not
recently inspected the target file.

**Promotion trigger:** none required. Captured as a single instance of
"deferral on tooling-availability proxy"; if a second instance appears,
graduate to `.agent/rules/` or `consolidate-docs` guidance.

---

## 2026-04-27 — Riverine Navigating Hull — knip + new platform-adapter directory pattern needs two coordinated fixes

**Context:** Phase 8 introduced `agent-tools/src/claude/` as the first
instance of the platform-adapter directory pattern documented in the
plan §Solution Architecture. The first commit attempt blocked on knip
with two distinct findings:

1. The adapter file `statusline-identity.ts` was flagged as "unused" —
   nothing in the TS import graph reaches it because it is spawned from
   outside the workspace by a `.claude/scripts/` shim.
2. The exported `StatuslinePlan` discriminated union was flagged as an
   unused export — the adapter consumed it via TypeScript inference of
   the parser's return type, not via an explicit named import.

**Resolution:** extend `knip.config.ts` `agent-tools` entry list to
include `src/claude/**/*.ts` (treating platform adapters as entry
points), and add an explicit `import { type StatuslinePlan }` plus a
type annotation in the adapter so knip sees the consumer.

**Lesson:** the `agent-tools/src/<platform>/` adapter pattern carries a
two-step knip discipline that recurs whenever a new platform adapter
lands. Both fixes are mechanical and generalisable to future Codex /
Cursor adapters.

**Promotion trigger:** when the second platform adapter lands (Codex
`CODEX_THREAD_ID` work in flight under claim `886181c0`, or any future
Cursor adapter), this becomes a documented rule for `.agent/rules/`
or a section in `agent-tools/README.md`. Until then, capture only.

---

## 2026-04-27 — Riverine Navigating Hull — three concurrent agents on one branch held cleanly via pathspec discipline

**Context:** during this session three agents worked simultaneously on
`feat/otel_sentry_enhancements`: Riverine Navigating Hull on Phase 8
identity wiring (agentic-engineering-enhancements thread); Vining
Bending Root on PR-87 quality remediation in apps/sdks/scripts
(observability-sentry-otel thread); Celestial Waxing Eclipse on Codex
`CODEX_THREAD_ID` wiring in agent-tools/src/bin and identity docs
(agentic-engineering-enhancements thread, same as me).

**Observation:** the collaboration protocol held without owner
intervention. All three claims were structurally disjoint at the file
level. Each agent named the others in their claim notes. The
shared-comms-log carried bidirectional acknowledgements. Vining
explicitly observed "their not-yet-committed registry entries will
land in whichever of our commits stages them first" — captured
ambient race condition, accepted it, did not escalate.

**Lesson:** pathspec discipline is the load-bearing primitive in
multi-agent same-branch work, not the active-claims registry alone.
The registry signals; the disjoint pathspecs prevent. When both align,
three-agent concurrency has roughly the same friction as one-agent.

**Promotion trigger:** this is the first three-agent concurrent
session I have direct evidence of. WS5 evidence harvest should pick
up this signal as additional positive coordination evidence. No new
graduation needed.

---

## 2026-04-26 — Codex — deterministic names became urgent after coordination surfaces multiplied

**Context:** immediately after landing sidebars, owner escalation, and joint
agent decisions, the owner approved implementing the deterministic agent
identity plan. The prior coordination implementation expanded the number of
places where `agent_name` is load-bearing: active claims, sidebars, joint
decision roles, escalation authors, shared-log signatures, handoff reports,
and thread identity rows.

**Observation:** before those surfaces existed, ad-hoc names were mostly a
continuity nicety. After them, ad-hoc names are an architectural weakness:
every new obligation surface asks humans and agents to reason about whether
`Codex`, `Ethereal Alpaca`, or some future generated label is the same actor,
a resumed actor, or a new participant.

**Lesson:** deterministic identity is not a replacement for collaboration
state. It is the naming substrate that makes collaboration state cheaper to
read. The implementation must therefore stay seed-agnostic and portable:
derive names from explicit stable seeds, document platform gaps honestly, and
avoid retroactive renaming. Historical records remain evidence as written.

**Promotion trigger:** incorporate into the PDR-027 amendment and identity-tool
docs during this implementation pass.

---

## 2026-04-26 — Codex — reviewer pass corrected identity-tool hidden assumptions

**Context:** the approved identity plan carried Phase 0 owner approval for the
wordlists, hash routing, override semantics, and `agent-identity` bin name.
Pre-implementation reviewers still found implementation-level ambiguities.

**Corrections accepted:**

- Override results cannot pretend to contain derived `group`, `adjective`,
  `verb`, and `noun` slots. The public result must be type-total, either by
  making override CLI-only or by using a discriminated result shape.
- Session-id seeding creates a session display identity, not necessarily a
  persistent PDR-027 identity across sessions. The docs must name that
  consequence rather than implying persistence the seed cannot provide.
- `git config user.email` fallback silently hashes a personal identifier and
  can collapse concurrent same-machine agents into one identity. Remove it
  until the owner explicitly approves that privacy and collision trade-off.
- Built CLI execution belongs in an E2E/smoke proof, not in an in-process unit
  or integration test that spawns child processes.
- Platform wrapper installation is deferred for Claude, Codex, and Cursor;
  this pass must document each platform's status and next action rather than
  mutating platform-specific config.

**Lesson:** Phase 0 approval closed vocabulary and bin-name choices, not every
runtime semantics question. Reviewer checkpoints are doing their job when they
convert a plan from plausible prose into type-total, testable behaviour.

**Promotion trigger:** no separate graduation needed; apply directly in the
identity implementation and PDR amendment.

---

## 2026-04-26 — Codex — commit separation kept prior coordination history readable

**Context:** the working tree already contained the completed coordination
architecture consolidation. The owner required that work to be preserved as a
separate commit before identity work began.

**Action:** committed the substantive coordination bundle as `4200b93f`
(`docs(agent): consolidate coordination architecture surfaces`) and the
commit-window closeout metadata as `21353e43`
(`docs(agent): close coordination commit window`).

**Lesson:** when one implementation naturally follows another, separating the
durable commit history is more than tidiness. It prevents the second feature
from becoming the explanation for the first feature's schema and workflow
changes. That matters especially for agent collaboration infrastructure, where
future agents read commit history as part of the operational record.

**Promotion trigger:** none. This reinforces existing commit-window and
bundle-integrity doctrine.

---

## 2026-04-27 — Codex — Codex thread id was already in the shell environment

**Context:** after the deterministic identity tool landed, Codex initially
reported that automatic Codex wiring was still a documented gap because no
stable session seed surface had been confirmed.

### Surprise

- **Expected**: Codex would need a manual `--seed` or `OAK_AGENT_SEED` until a
  platform wrapper was designed.
- **Actual**: Codex shell commands receive the active thread id as
  `CODEX_THREAD_ID`; in this session it was
  `019dcd65-4f59-73d3-9ac5-d988b40e6696`.
- **Why expectation failed**: the prior review checked docs and planned
  wrapper surfaces, but did not inspect the live command environment before
  concluding Codex had no automatic seed source.
- **Behaviour change**: when evaluating platform capability gaps, inspect
  `env` and process metadata before documenting "no confirmed wrapper
  surface"; for Codex identity, prefer `pnpm agent-tools:agent-identity
  --format display` because the CLI now consumes `CODEX_THREAD_ID`.
- **Source plane**: active

### Mistake Made

- Misclassified another agent's committed active-claim/log movement as a
  "coordination wrinkle". The owner corrected this: committed collaboration
  state is correct behaviour in a four-agent same-repo session. Treat claim
  state commits as the durable coordination substrate, not anomalous churn,
  while still checking for real overlap before editing.
