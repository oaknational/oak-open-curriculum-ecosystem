# Next-session opener — agentic-engineering-enhancements (WS1: no-type-widening rule)

Paste the block below into a fresh session.

```text
Continue the agentic-engineering-enhancements thread. Item 2a landed last session — ESLint
custom-rule reappraisal enforcement (every oak-eslint rule message now teaches a positive
reappraisal direction, enforced at compile time via a zod-branded ReappraisingMessage that only
createMessage can mint; a prohibition-only string fails tsc). It is committed, entangled with EEF
WIP, in the owner safety-commit 2cd529b5. WS1 is next.

First, run /oak-start-right-thorough and /oak-metacognition. Then read FIRST-HAND (your own ground
truth, not a summary) the TOP handoff banner in
.agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md (Briny Plumbing
Beacon, 2026-06-07) — it is self-contained and IS your brief. Do not assume it is accurate: verify
its load-bearing claims (HEAD SHA, ahead/behind, gate state, file:line) against source as you read.
In particular, verify the GATE STATE from a cache-MISS run, never a cached pnpm check exit code — a
turbo cache-hit false-green bit the last session.

PRECONDITION before any commit: HEAD 2cd529b5 was RED on a pre-existing graph-corpus-sdk lint
(eef-evidence.ts declares EefEvidenceEnvelope as a deliberate `type` — required for Record<string,
unknown> carrier assignability — which trips @typescript-eslint/consistent-type-definitions). This
is the EEF-lane owner-scoped decision; it is NOT item 2a, and it must NOT be "fixed" to `interface`.
Every commit is blocked until that lint is scoped green. Confirm it is GREEN before committing
anything. Do NOT touch the EEF peer's files; do NOT --no-verify.

The last session's handoff edits are written and STAGED but UNCOMMITTED, awaiting a green HEAD.
Before committing them, re-stage repo-continuity.md and packages/core/oak-eslint/package.json (the
owner made concurrent edits — EEF Current State + dependency patch-bumps — after the bundle was
staged), then commit by explicit pathspec.

Owner-agreed scope: item 2 (all sub-passes) AND the no-type-widening rule; do not wait for the EEF
lane. Remaining sequence: WS1 -> 2b -> 2c -> WS2.

  - WS1 (next): the targeted type-aware no-type-widening rule in @oaknational/eslint-plugin-standards
    (.agent/plans/agentic-engineering-enhancements/current/no-type-widening-enforcement.plan.md).
    Flag Set<string> / readonly string[] views over an `as const` literal-union array; steer to
    xs.some((x) => x === value). Author its message via the 2a createMessage helper so it is born
    teaching (the interlock). THE HARD PART: distinguish a literal-union widening from a legitimate
    arbitrary-string collection via typescript-eslint's type-checker — precision gates warn -> error;
    a permanently-advisory rule is not acceptable (surface with evidence if precision proves
    unreachable). Free test fixture: the EEF `new Set<string>(OBSERVED_PHASES)` widening. Do NOT redo
    the doctrine already strengthened (typescript-practice.md, ADR-153/038/028, EEF graph-corpus-sdk).
  - 2b: the 89-file .agent/rules/*.md pass as doctrine cartography (owner-approved FULL pass) —
    author a sharp cure per rule, cluster by cure, then discriminate each collision as genuine-
    redundancy (collapse candidate; owner decides) vs coarse-cure (sharpen, don't merge) vs same-cure-
    different-concept (keep). Never auto-collapse. Let collision density decide the structure (dense ->
    a shared concept->cure registry rules reference; sparse -> per-rule positive-direction section).
  - 2c: widen the PDR-044 amendment PER-SURFACE as each enforces (ESLint once 2a is confirmed
    enforcing; rules-prose after 2b). Never state doctrine wider than enforcement reaches.
  - WS2: tripwire wiring, coordinating with action-time-structural-interrupt-design-space; beneficial,
    not blocking; lowest priority.
  - Follow-on (not 2a scope): toPosix is triplicated across max-files-per-dir / require-observability-
    emission / no-real-io-in-tests -> extract to oak-eslint/src/utils/path.ts.

Disciplines: verify-don't-trust (especially cached gates); ground specialist findings first-hand
before acting; reviewers at every lifecycle stage, not backfill; TDD test-first; stage by explicit
pathspec in this multi-writer window; the adversarial loss-scan at close is the context-holder's
exclusive job. Also due on a dedicated pass: napkin rotation (critical, 595 lines) + the pending-
graduations drain (soft, near limit).

Use /oak-metacognition throughout. For each item, tell me the shape and what excellence looks like
before executing — then we go.
```
