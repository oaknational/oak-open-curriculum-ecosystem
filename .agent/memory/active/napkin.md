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
