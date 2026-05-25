---
name: "Hook-matcher string-awareness cure"
overview: "Refine check-blocked-patterns tokenizer to ignore inert single-quoted string and heredoc content; extend hook-policy-substring-discipline rule to name Bash invocations as in-scope."
todos:
  - id: phase-0-reviewer-pass
    content: "Phase 0: Pre-execution reviewer pass on the cure approach (code-expert, assumptions-expert, test-expert, architecture-expert-fred). No code or rule edits until verdicts absorbed and owner sign-off."
    status: pending
  - id: cycle-1-tokenizer-string-awareness
    content: >
      Cycle 1 (TDD pair): failing unit test asserting that
      single-quoted shell strings and single-quoted heredoc bodies
      do not contribute tokens to subsequence matching; minimal
      implementation in tokenizeCommand (or a pre-tokenize strip
      pass) that satisfies the test. One commit; tree green.
    status: pending
  - id: cycle-2-rule-extension
    content: >
      Cycle 2: extend .agent/rules/hook-policy-substring-discipline.md
      to name Bash invocation as an in-scope surface alongside
      comms-event bodies and dispatch briefs; cure shape is the
      CLI --body-file (or equivalent) pattern. One commit;
      markdownlint clean.
    status: pending
  - id: phase-validation
    content: "Phase 3: Validation — pnpm check green; failure-mode broadcast a826a2b6 reproduction now passes; existing matcher behaviour against re-ordered git args still passes."
    status: pending
---

# Hook-matcher string-awareness cure

**Last Updated**: 2026-05-25 (Phase 0 reviewer pass complete; 7 nits absorbed as plan amendments; awaiting owner sign-off to promote to active/)
**Status**: 🟡 PLANNING (Phase 0 reviewer verdicts all APPROVE-WITH-NITS; awaiting owner sign-off)
**Scope**: Refine the `check-blocked-patterns` token-subsequence matcher so inert string content (single-quoted heredocs, single-quoted shell strings) cannot complete a blocked-pattern subsequence; extend the substring-discipline rule to name Bash invocation as an in-scope surface.

---

## Context

### Trigger

At 2026-05-25T05:50Z a PDR-064 Moment 2 active-acknowledgement broadcast attempt was denied by the `check-blocked-patterns` PreToolUse hook citing pattern `"git push -f"`. The Bash command contained no git invocation; the denial was a false positive across a single-quoted heredoc body + a trailing `rm -f` cleanup token. Full root-cause analysis is in failure-mode comms event `a826a2b6` (2026-05-25T05:57:18Z, tagged `failure-mode`).

### Root cause

`agent-tools/scripts/check-blocked-patterns.ts:79-131`. The `tokenizeCommand` function splits the entire Bash command string on `/\s+/u` with no awareness of single quotes, double quotes, heredoc delimiters, or other shell-string boundaries. `findBlockedPattern` then walks blocked-pattern token sequences looking for an **ordered subsequence** anywhere in the resulting token stream. Any 3-token blocked pattern can match when its tokens happen to appear in order across an inlined body + an unrelated trailing command segment.

The matcher's intent is correct: a re-ordered `git push origin HEAD --force` should match `git push --force`. The over-match is the unintended cost.

### Evidence

- Bash command tokens at 05:50Z denial: `git` (inside heredoc body, inline-code reference), `push` (inside heredoc body, narrative word), `-f` (trailing `rm -f` cleanup).
- Existing tests in `check-blocked-patterns.unit.test.ts` cover re-ordered argument matching and citation propagation but contain no test for the inert-string-content case.
- The CLI's own `--body-file` flag's help text names it as *"the cure for shell-quoting hazards on bodies that contain backticks or dollar signs"* — same flag is the agent-side cure for the hook-token-subsequence hazard. The architectural-correct path is using the CLI as designed; the matcher refinement removes the gratuitous false-positive friction in inert contexts.

### Existing capabilities

- `tokenizeCommand` and `findBlockedPattern` are pure functions, separately exported, already unit-tested. Refinement lands as additional test cases + a localised implementation change.
- `.agent/rules/hook-policy-substring-discipline.md` already names the cure shape for instructive-content surfaces; extending it to Bash invocations is a documentation amendment, not a new doctrine.

---

## Owner direction

- 2026-05-25T06:01Z owner approved the cure approach in principle.
- Explicit owner direction: code-expert reviewer pass on the approach before any implementation.
- This plan is held in `current/` (queued, not started) until reviewer verdicts are absorbed and owner signs off promotion to `active/`.

---

## Solution architecture

### Principle

From `principles.md` §Architectural Excellence: false positives across **inert** string content provide no immunity value because the content cannot become executable tokens — the friction is gratuitous and trains agents to work around the matcher (via `--body-file`) instead of learning from it. The lesson lives in the rule (Cure B); the matcher refinement (Cure A) removes the gratuitous friction in inert contexts.

PDR-044 names false positives as an innate-immunity design property. This plan does NOT challenge that: false positives across **active** content (unquoted commands, double-quoted strings supporting expansion, unquoted heredoc bodies) remain in scope. Only inert content (single-quoted strings, single-quoted heredoc bodies) is removed from the token stream.

### Could it be simpler?

Yes — sometimes the simpler answer is *do nothing*. Considered and rejected: agents can always use `--body-file` consistently and never trip the false positive. Reasons for rejecting:

1. The rule (Cure B) tells agents to use `--body-file` for any body content. That is the cure shape regardless. But the matcher still trips on agents who haven't yet absorbed the rule, and the trip teaches no useful lesson because the trigger is in inert content — the agent reads "matched `git push -f`" and looks for git tokens that aren't there.
2. PDR-044's false-positives-as-design-property covers cases where friction has architectural value. Inert-content friction has none — it costs an agent cycle and produces no learning. The architectural-excellence answer is to remove the friction class while preserving the immunity class.

### Strategy

Two cycles, sequenced (Cycle 2 is documentation that references the now-restored matcher behaviour from Cycle 1):

**Cycle 1 — Tokenizer string-awareness (TDD pair).**

Before `tokenizeCommand` runs (or as its first step), strip single-quoted strings and single-quoted heredoc bodies from the command. Concretely:

- Single-quoted strings: replace `'…'` segments with a single space. Single quotes mean no shell expansion; content cannot become a separate executable token.
- Single-quoted heredoc bodies: the pattern `<<'EOF' … EOF` (or any single-quoted delimiter — `<<'WORD'`, `<<-'WORD'`) carries inert content. Strip from the matched-`<<` through the matching unindented `WORD` line.
- **Out of scope for Cycle 1**: double-quoted strings (support expansion) and unquoted heredocs (support expansion) — these remain in the token stream. The matcher's protection against re-ordered active arguments is preserved.

**Cycle 2 — Rule extension.**

Extend `.agent/rules/hook-policy-substring-discipline.md` to name Bash invocation as an in-scope surface. One-paragraph addition under §"In-Scope Surfaces" naming Bash commands that inline narrative body content via heredoc or quoted string; the cure remains the CLI's `--body-file` (or equivalent) flag.

### Non-goals

- ❌ Changing what patterns are blocked. The policy enumeration in `.agent/hooks/policy.json` is out of scope.
- ❌ Migrating existing inlined-heredoc callers. Incremental on next touch; no sweep.
- ❌ Double-quoted-string or unquoted-heredoc tokenizer changes. Out of scope; those contents support expansion and must remain in matcher view.
- ❌ Consolidating with PDR-044's design-property doctrine. Doctrinal review is separate work.
- ✅ What we ARE doing: removing the inert-content false-positive class from the matcher while preserving the re-ordered-argument matching behaviour.

---

## Reviewer scheduling

### Phase 0 (pre-execution, owner-mandated)

- **`code-expert`** — gateway review of the cure approach. Owner-named.
- **`assumptions-expert`** — plan-readiness + proportionality (two cycles for one narrow false-positive class — right-sized?).
- **`test-expert`** — TDD shape for Cycle 1; verify the failing-test design exercises the right surface; flag audit-shape risk.
- **`architecture-expert-fred`** — principles-first review against PDR-044's innate-immunity design-property framing; verify the inert-content scope restriction is principled, not expedient.

### During execution

- `type-expert` if the implementation introduces non-trivial type surface (unlikely; one new pure function).

### Post-execution

- `docs-adr-expert` — confirm rule extension language is consistent with the rule's existing voice; no doctrinal drift.
- `release-readiness-expert` — confirm cure ships safely; existing matcher behaviour preserved against re-ordered-argument tests.

---

## Foundation document commitment

Re-read before Cycle 1 starts and before promoting to `active/`:

1. `.agent/directives/principles.md` — architectural excellence, no-cheap-cure, replace-don't-bridge.
2. `.agent/directives/testing-strategy.md` — describe-vs-audit, atomic-landing invariant.
3. `.agent/directives/schema-first-execution.md` — not central here (no codegen), but verify no schema-first violations from the changes.

Apply `.agent/rules/plan-body-first-principles-check.md` shape/landing-path/vendor-literal clauses before executing prescribed tests or implementation.

---

## Build-vs-buy attestation

Not applicable — internal repo tooling change to a single TypeScript file we own. No vendor surface touched.

---

## Resolution plan

### Phase 0: Pre-execution reviewer pass

**Foundation check-in**: read `principles.md` §Architectural Excellence and PDR-044 (innate-immunity design property) before dispatching reviewers.

#### Task 0.1: Dispatch reviewers

Dispatch the four Phase-0 reviewers (see §Reviewer scheduling) in parallel with the same brief: *"Review this plan's cure approach for the hook-matcher false-positive class. Specifically: is the inert-content scope restriction the right shape under PDR-044's design-property framing? Is the two-cycle decomposition the right grain? Is the Cycle-1 failing-test design substantive (describes a behaviour) or audit-shaped (mirrors the implementation)?"*

**Acceptance criteria**:

1. ✅ All four reviewer transcripts captured.
2. ✅ Each reviewer's verdict recorded: APPROVE / APPROVE-WITH-NITS / CONCERNS / OBJECT.
3. ✅ Any CONCERNS or OBJECT findings absorbed via plan amendment OR reasoned re-argue + owner-class escalation.
4. ✅ Owner sign-off to promote plan from `current/` to `active/`.

**Deterministic validation**:

```bash
# Reviewer transcripts captured under .agent/state/collaboration/handoffs/
# (one per reviewer, named by reviewer + cycle)
ls .agent/state/collaboration/handoffs/2026-05-25-hook-matcher-cure-phase-0-*.md
# Expected: 4 files
```

**Task complete when**: all 4 reviewer transcripts present, all CONCERNS absorbed or escalated, owner signs off promotion.

**If any reviewer raises a structural objection that invalidates the cure shape**: STOP. Return to design gate with owner.

---

### Phase 1: Cycle 1 — Tokenizer string-awareness (TDD pair)

**Parallel-safety**: standalone; no dependencies on other in-flight cycles.

**Starting state**: HEAD at promotion to `active/`; clean working tree on the cure files.

**File scope**:

- `agent-tools/scripts/check-blocked-patterns.unit.test.ts` (failing test added).
- `agent-tools/scripts/check-blocked-patterns.ts` (minimal product change).

**Failing test (added first, in the same commit as the product change per atomic-landing invariant)**:

Describe-shape: assert that single-quoted strings and single-quoted heredoc bodies do not contribute tokens to subsequence matching.

```typescript
// In check-blocked-patterns.unit.test.ts under describe('findBlockedPattern'):
it('does not match blocked-pattern subsequences across single-quoted string content', () => {
  // Body inside single quotes is inert; its tokens must not complete a subsequence.
  const command = `pnpm append --body 'narrative referencing git and push' rm -f path`;
  expect(findBlockedPattern(command, ['git push -f'])).toBeNull();
});

it('does not match blocked-pattern subsequences across single-quoted heredoc bodies', () => {
  const command = [
    "cat > file <<'EOF'",
    'narrative referencing git and push',
    'EOF',
    'rm -f file',
  ].join('\n');
  expect(findBlockedPattern(command, ['git push -f'])).toBeNull();
});

it('does not match a blocked pattern that appears verbatim inside a single-quoted string', () => {
  // T-1 completeness test: the inert-content strip removes a pattern that would have matched
  // if the quotes were absent. Strongest possible statement of the inert-content rule.
  expect(findBlockedPattern("echo 'git push --force'", ['git push --force'])).toBeNull();
});

it('still matches re-ordered arguments when the full command is unquoted active shell tokens', () => {
  // Regression test: cure does not weaken the existing protection on active content.
  expect(findBlockedPattern('git push origin HEAD --force', ['git push --force'])).toStrictEqual({
    pattern: 'git push --force',
  });
});
```

A fifth test exercises the strip helper directly (I-2 isolation; ensures the helper is
addressable as a design unit, not only as an integrated-path effect):

```typescript
// Direct-strip helper test under describe('stripInertShellContent') or equivalent:
it('removes single-quoted string content while preserving surrounding active tokens', () => {
  const stripped = stripInertShellContent(`pnpm append --body 'git push --force' rm --force path`);
  // The tokenisation result must not contain git, push, or --force from inside the quoted span.
  expect(stripped).not.toMatch(/\bgit\b/);
  expect(stripped).not.toMatch(/\bpush\b/);
  // Active tokens outside the quoted span are preserved.
  expect(stripped).toMatch(/\brm\b/);
  expect(stripped).toMatch(/\bpath\b/);
});
```

**Product changes**:

- Extract a strip helper (e.g. `stripInertShellContent`) called from `tokenizeCommand` before the whitespace split. Export the helper separately so it can be unit-tested in isolation (consistent with the existing pattern where `tokenizeCommand`, `findBlockedPattern`, etc. are all separately exported). [code-expert nit I-2]
- Strip the following inert shapes:
  - **Single-quoted strings**: `'…'` → single space.
  - **Single-quoted heredoc bodies**: anchor on `<<-?'WORD'` (both `<<'WORD'` and `<<-'WORD'` dash forms) through the matching closing-delimiter line, where the closing-delimiter line in the `<<-` form may carry leading tab characters that bash strips at runtime. The regex must match the closing delimiter against `\n\t*WORD\n` (or equivalent) so the dash-form is fully stripped. [code-expert nit I-1]
- Leave double-quoted strings and unquoted heredocs untouched (they support expansion; their content can become executable tokens).
- The strip is conservative and non-destructive for the unit-tested shapes; out-of-scope shapes (nested heredocs, unrecognised delimiter forms) intentionally remain in the token stream — safe default.
- **TSDoc above the helper MUST**:
  - Name the in-scope shapes (single-quoted strings, `<<'WORD'`, `<<-'WORD'` with optional tab-indented closing line) explicitly.
  - State that single-quoted shell content is inert under POSIX semantics — no parameter expansion, no command substitution (`$(...)` / backtick), no variable expansion. This is why these shapes are safely strippable. [fred nit F-1]
  - State that double-quoted and unquoted shapes are out of scope and remain in the matcher's view because they support expansion.
  - State the safe-default behaviour for unrecognised shapes: residual content remains in the token stream and may trip the matcher (which is the safer direction than under-blocking).

**Acceptance criteria**:

1. ✅ All five new test cases above pass — the four integrated-path `findBlockedPattern` tests AND the one direct-helper `stripInertShellContent` isolation test [I-2].
2. ✅ Every existing test in `check-blocked-patterns.unit.test.ts` still passes (no regression on re-ordered-argument matching, citation propagation, hook-input parsing).
3. ✅ The integration test `check-blocked-patterns.integration.test.ts` still passes.
4. ✅ TSDoc on the new helper covers all four points named in §Product changes: in-scope shapes (including `<<-'WORD'` dash form); POSIX inert-content rationale (no expansion / no command substitution / no variable expansion); out-of-scope shapes (double-quoted, unquoted); safe-default behaviour for unrecognised shapes [F-1 + I-1].
5. ✅ The strip helper is separately exported from `check-blocked-patterns.ts` and addressable as a design unit [I-2].
6. ✅ One commit: tests + product code together (atomic-landing invariant).

**Informational sanity check (NOT a blocking acceptance gate)** [F-2]:

The five new tests are the deterministic gate. The manual CLI reproduction below is an optional sanity check the implementing agent MAY run to confirm the integrated path behaves as expected against a real hook payload; it is not a parity gate. The automated tests block promotion; the manual step does not.

**Deterministic validation**:

```bash
# 1. New tests pass
pnpm --filter @oaknational/agent-tools test --filter check-blocked-patterns
# Expected: exit 0; all describe blocks pass.

# 2. Workspace-level gates
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
# Expected: exit 0.

# 3. Repo-level gates
pnpm check
# Expected: exit 0.

# 4. Manual reproduction: simulate the 05:50Z denial input via the hook entrypoint and
#    confirm no deny payload is emitted.
echo '{"tool_name":"Bash","tool_input":{"command":"cat > file <<'\''EOF'\''\nreferencing git and push in narrative\nEOF\nrm -f file"}}' \
  | node agent-tools/scripts/check-blocked-patterns.ts
# Expected: exit 0, no stdout output (no deny payload).
```

**Cycle 1 complete when**: all 6 acceptance criteria checked, all deterministic validations exit 0, cycle landed as a single test+product commit through Hushed's marshal queue.

---

### Phase 2: Cycle 2 — Rule extension

**Parallel-safety**: sequenced after Cycle 1 lands (Cycle 2's text references the restored matcher behaviour).

**Starting state**: HEAD includes Cycle 1's matcher refinement.

**File scope**:

- `.agent/rules/hook-policy-substring-discipline.md` (rule extension).

**Product change**:

One paragraph added to §"In-Scope Surfaces" naming Bash invocation. Suggested addition (final wording subject to docs-adr-expert review):

> **Bash invocations that inline narrative body content** via heredoc (`<<EOF … EOF`, even single-quoted), shell strings, or other quoted/unquoted body forms. The matcher's tokenizer now ignores single-quoted string and heredoc content (see `check-blocked-patterns.ts`), but the architectural-correct path remains: use the CLI's `--body-file` (or equivalent) flag so body text never enters the bash command tokens at all. Inlining narrative bodies via heredoc remains discouraged even where the matcher will not trip, because double-quoted and unquoted body shapes still feed the matcher and the same false-positive class can fire on similar token coincidences.

**Acceptance criteria**:

1. ✅ Rule file landed with the addition.
2. ✅ `pnpm markdownlint-check:root` exits 0 on the changed file.
3. ✅ `pnpm format-check:root` exits 0.
4. ✅ The rule's voice, structure, and cross-references remain consistent (verified by `docs-adr-expert` post-execution review).

**Deterministic validation**:

```bash
pnpm markdownlint-check:root
pnpm format-check:root
pnpm check
# Expected: all exit 0.
```

**Cycle 2 complete when**: all 4 acceptance criteria met; one commit landed through Hushed's marshal queue.

---

### Phase 3: Validation + consolidation

#### Task 3.1: Final aggregate validation

```bash
pnpm check
```

**Acceptance criteria**:

1. ✅ `pnpm check` exits 0 across all workspaces.
2. ✅ Failure-mode broadcast `a826a2b6` reproduction passes (the 05:50Z command shape no longer trips the matcher).
3. ✅ Re-ordered-argument tests still pass (no regression).

#### Task 3.2: Post-execution reviewers

- `docs-adr-expert` — rule extension language review.
- `release-readiness-expert` — cure-ships-safely synthesis.

#### Task 3.3: Consolidation

Run `/oak-consolidate-docs` to graduate settled content (the failure-mode capture + cure pattern is graduation-grade per Misty's 06:00Z framing), rotate napkin, and update practice exchange.

---

## Plan-body first-principles check

Per `.agent/rules/plan-body-first-principles-check.md`:

- **Shape**: TDD pair (Cycle 1) + documentation amendment (Cycle 2). Both single-file changes. No invented complexity.
- **Landing path**: through the established Hushed-marshal cycle; one commit per cycle; subject lines pre-flighted ≤100 chars before queue-open.
- **Vendor literals**: none — internal repo tooling change.

---

## Risk assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Tokenizer refinement weakens immunity against re-ordered active arguments | Low | High | Cycle 1 includes a regression test (`still matches re-ordered active git arguments outside of inert content`). `architecture-expert-fred` reviews against PDR-044 framing pre-execution. |
| Heredoc-stripping regex is fragile across shell variants | Medium | Medium | Restrict to single-quoted heredocs only; document the exact shapes the strip covers in TSDoc; add unit tests for the named shapes only. Out-of-scope shapes intentionally trip the matcher (safe default). |
| Cycle 2 rule language drifts from existing rule voice | Low | Low | `docs-adr-expert` post-execution review. |
| Reviewer Phase 0 surfaces structural objection to the cure shape | Low | Plan-invalidating | Plan held in `current/`; promotion to `active/` gated on owner sign-off after reviewer absorption. No code or rule edits until then. |

---

## Dependencies

**Blocking prerequisites**:

- Owner sign-off after Phase 0 reviewer pass (owner-mandated 2026-05-25T06:01Z).

**Related plans**:

- `branch-fitness-and-push-cadence.plan.md` — adjacent; touches the same broader thread of Practice-infrastructure hardening but does not overlap files.

**Beneficial prerequisites**: none.

**Minimum shippable shape**: Cycle 1 alone (matcher refinement) ships the structural cure.

**Named gap-risk** [assumptions-expert A-C1]: between Cycle 1 landing and Cycle 2 landing, agents have no rule surface naming Bash invocation as in-scope for the substring-discipline. The matcher improvement may be misread as permission to inline narrative bodies more aggressively in Bash commands — recreating the false-positive class for double-quoted and unquoted shapes that Cycle 1 does NOT strip. Cycle 2's rule text explicitly closes this risk by stating that inlining narrative bodies via heredoc remains discouraged even where the matcher will not trip, because double-quoted and unquoted body shapes still feed the matcher.

**Commitment to manage the gap**: Cycle 1 and Cycle 2 ship in the same session unless a session boundary forces separation. If separated, the rule extension (Cycle 2) is the first item in the next session — not allowed to drift further behind. The minimum-shippable-shape claim is structural-only; the agent-behaviour surface is partially unguided until Cycle 2 lands.

---

## Success criteria (overall)

- ✅ The 05:50Z false-positive class no longer trips the matcher.
- ✅ Re-ordered-active-argument protection preserved (PDR-044 immunity class intact).
- ✅ Rule names Bash invocation as in-scope surface; cure shape (`--body-file`) documented for agents.
- ✅ All quality gates green after Cycle 1 and Cycle 2.
- ✅ Failure-mode broadcast `a826a2b6` graduated to napkin / `distilled.md` / pending-graduations as appropriate via `/oak-consolidate-docs`.

---

## Lifecycle triggers

Apply `.agent/plans/templates/components/lifecycle-triggers.md`:

- **Session entry**: this plan was authored under the Director-then-Implementer lane during Starless's session (PDR-064 Moment 2 chain re-anchored to Misty; Starless pivoted to this technical-issue lane).
- **Work-shape declaration**: bounded simple plan — two cycles, single-file changes, internal tooling.
- **Collaboration claim registration**: claim opens at promotion to `active/` (not now).
- **Handoff closure**: own-claim closed at session-handoff; if cycles span sessions, mid-cycle retirement per PDR-063.
- **Consolidation**: `/oak-consolidate-docs` after Phase 3.

---

## References

- Failure-mode broadcast: comms event `a826a2b6` (2026-05-25T05:57:18Z, tagged `failure-mode`).
- Source: `agent-tools/scripts/check-blocked-patterns.ts:79-131`.
- Existing tests: `agent-tools/scripts/check-blocked-patterns.unit.test.ts`, `…integration.test.ts`.
- Policy enumeration: `.agent/hooks/policy.json` `hooks.preToolUse.blocked_patterns`.
- Existing rule: `.agent/rules/hook-policy-substring-discipline.md`.
- Doctrinal anchors: `principles.md` §Architectural Excellence; PDR-044 (innate-immunity design property).
- Owner approval: 2026-05-25T06:01Z (in principle, reviewer pass required pre-execution).

---

## Out of scope (future work)

- Migrating existing inlined-heredoc Bash callers across the agent-tools surface — incremental on next touch.
- Double-quoted-string awareness in the tokenizer — would require expansion-aware analysis; reconsider only if a separate false-positive class is observed there.
- Wider review of `.agent/hooks/policy.json` blocked-pattern set — separate doctrinal pass.
