---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-06-08 — napkin rotated (Ferny Ripening Meadow curation pass)

Rotated the 2026-06-06 → 2026-06-07 window during a dedicated knowledge-curation
pass. The processed window is preserved verbatim at
[`napkin-2026-06-08-ferny-curation.md`](archive/napkin-2026-06-08-ferny-curation.md).
Every behaviour-changing entry was verified live in a permanent home before
rotation; the commit and those homes are the record. Fresh capture continues
below.

## Session: 2026-06-08 — EEF type boundary → ADR-193 + the egress membrane (Evergreen Blossoming Copse)

**Decision landed.** The strict-types-vs-MCP-vendor question resolved into
[ADR-193](../../../docs/architecture/architectural-decisions/193-system-vendor-type-boundary-membrane.md)
(system↔vendor type boundary): strict domain types hold from the `as const` corpus
to a per-primitive egress function; the vendor's `Record<string, unknown>` is the
external contract at the membrane, never in domain code. EEF tool egress
(`eefEvidenceToCallToolResult`) built + green. Committed `496ea7ca` (egress) +
`83d791e8` (ADR-193).

**Surprise — the membrane sits lower than the vendor call.** Expected to thread
strict types through executor/auth/registration to `registerTool` (a generic spine).
Actual: executor/auth/registration are vendor-facing TRANSPORT (auth errors ARE
`CallToolResult`), so the membrane is the domain→transport seam — one egress function,
no spine refactor, no union-dispatch problem. The clean shape was hidden ~1.5 days
because every prior attempt anchored on preserve-to-wire (impossible) or generic-spine
(complex).

**Correction-pattern (5 owner corrections → one root).** I repeatedly reached for a
general-codebase reflex where this repo demands maximal architectural rigour:
proof-at-construction-is-enough → scope-the-lint-rule → adapter-around-the-vendor →
index-sig fallback → solve-the-instance-not-the-boundary. Root: the LTAE lens must be
the PRIMARY GENERATOR of moves, not a post-hoc filter; the incoming validation
boundary (ADR-032) has a symmetric OUTGOING egress mirror I kept missing; and when I
NAME a lever ("the SDK version is in our power"), PULL it — don't park it. A
convenient *interpretation* deserves the same suspicion as a convenient *fact*.

**Grounded knowledge (the next agent re-derives otherwise):**

- **dist-gotcha:** `oak-curriculum-sdk` type-checks `graph-corpus-sdk` via built
  `dist`; focused cross-package type-checks are STALE until
  `pnpm --filter @oaknational/graph-corpus-sdk build`. This masked the vendor-carrier
  wall until I rebuilt.
- SDK 1.29.0 (latest): `ToolCallback` hard-codes `CallToolResult`; `outputSchema` is
  NOT tied to the callback return type (runtime-validated only, `mcp.js:200-201`).
- The spread `{ ...env }` is `Record`-assignable (fresh object); a clean named
  interface is not; a generic `<T extends object>` spread is not — egress is
  per-concrete-type.
- Three under-described safety commits (`2cd529b5`, `496ea7ca` "chore: safety commit",
  `83d791e8` "--amend" — a mangled message) carry EEF work mixed with peer/other-thread
  content; decoded in `threads/eef.next-session.md`.

**Closeout learnings (handoff):**

- **`--no-verify` is OFF (owner directive, this session).** The remaining EEF commits
  must land GREEN — gating (c6) clears the only red (app e2e parity); do not reach for
  `--no-verify`.
- **The agentic hook blocks the *agent's* `git commit --no-verify` even with in-chat
  owner authorisation** — the owner must run the commit (or `! <command>`). In-chat
  authorisation is necessary but the hook still intercepts the agent's invocation.
- **Staging a file that holds another agent's uncommitted work sweeps it.** My
  `napkin.md` carried Ferny's rotation entangled with my entry in one file, so it rode
  into `1917f0ea`; explicit pathspec protects against staging the *wrong files*, not
  against multiple agents' edits *within one file*. The rotated-out window is recoverable
  from `496ea7ca`; its archive `archive/napkin-2026-06-08-ferny-curation.md` is untracked
  (dangling link in the committed napkin).
- **Uncommitted doc-polish carried into the handoff (this turn):** the
  `repo-continuity.md` Current-State EEF bullet (re-pointed from the dead carrier-fix to
  ADR-193) and this napkin addendum are UNCOMMITTED (gate red, `--no-verify` off). The
  next session should stage them into its first GREEN commit (after gating).

**Over-generalisation correction (Lofty Spiralling Plume, 2026-06-08):**

- **Expected:** owner rejecting "archive/rotate" as the disposition for continuity
  surfaces meant the archive apparatus + `/archive/` fitness exclusion were wrong.
  **Actual:** owner scoped it — the strategy was unsuitable *for continuity surfaces
  only*; the apparatus is fine. **Why it failed:** I escalated a surface-scoped note
  correction into a system-wide condemnation (doctrine-by-analogy: "big systemic cure"
  when the situation was "narrow surface note"). I had written a blanket "archiving is
  not knowledge preservation" into `continuity-practice.md` §Disposition and was about to
  propose flipping the checker's `/archive/` exclusion. **Behaviour change:** when an
  owner rejects a strategy for a named surface type, scope the correction to that surface
  type; the fitness checker only *surfaces signals*, agents act — strategy notes are
  guidance for the agent, not apparatus law. Cure landed: §Disposition re-scoped to
  continuity surfaces; no fitness-system code touched.
