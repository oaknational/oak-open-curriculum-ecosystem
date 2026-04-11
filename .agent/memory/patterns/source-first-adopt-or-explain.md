---
name: "Source-first adopt-or-explain evaluation"
use_this_when: "Evaluating whether an existing dependency's utilities should replace hand-rolled code"
category: process
proven_in: "docs/spikes/clerk-mcp-tools-express-evaluation.md"
proven_date: 2026-03-26
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Adopting library utilities without understanding their gaps, or keeping hand-rolled code without documenting why"
  stable: true
---

# Source-First Adopt-or-Explain Evaluation

## Pattern

When a dependency provides utilities that overlap with hand-rolled code, evaluate
each utility by reading the **actual library source** (not just documentation).
For each utility, produce an explicit adopt/skip decision with concrete evidence.

1. Read the installed library source (`node_modules/.../dist/*.js`)
2. Compare function-by-function against the hand-rolled implementation
3. For each utility, identify **concrete gaps** (missing RFC compliance, missing
   security features, architectural incompatibility) — not vague preferences
4. Validate findings against the library's **live documentation** (fetch the
   latest docs, don't trust cached knowledge)
5. Record each decision in an ADR with an explicit re-evaluation trigger
6. For adopted utilities, retain existing tests as conformance tests

## Anti-Pattern

- Assuming library utilities are better because they're "official" — they may
  lack features your hand-rolled code has
- Assuming hand-rolled code is better because it exists — the library may be
  identical and reduce maintenance
- Evaluating based on documentation alone — documentation may omit gaps that
  the source reveals (e.g., missing audience validation, environment variable
  reads, shared-vs-per-request server assumptions)
- Skipping without documenting why — future contributors re-investigate the
  same question

## Checklist

1. Fetch the library's live docs and sitemap before starting
2. Read the actual installed source for each utility under evaluation
3. Compare signatures, logic, error handling, and security features
4. Validate gaps against relevant specifications (RFCs, protocol specs)
5. Write a spike document with source citations (file paths, line numbers)
6. Write an ADR with adopt/skip per utility and a re-evaluation trigger
7. For adopted utilities, pin conservatively and retain conformance tests
