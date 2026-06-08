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
