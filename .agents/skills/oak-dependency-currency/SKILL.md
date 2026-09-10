---
name: oak-dependency-currency
description: Run a full dependency-currency pass — survey with pnpm -r outdated and pnpm audit, triage every bump by measured risk tier, execute one type-affecting major at a time with baseline-capture proof, drive pnpm audit to zero via annotated override floors, and refresh SHA-pinned GitHub Actions against verified stable tags. Use when the owner asks to bring dependencies to latest, clear audit or Dependabot findings, or reopen a dependency-currency lane. Do NOT use for a single dependency bump riding other work, a lockfile-only refresh, or one urgent advisory patch — those take the ordinary commit path, borrowing this skill's tier proofs only as reference. Right — a whole-estate pass of one proof-gated commit per type-affecting cycle ending at audit zero. Wrong — sweeping every major in one commit, or regenerating snapshots to green without reading the diff.
---

# Dependency Currency (Cross-tool)

Read and follow `.agent/skills/dependency-currency/SKILL-CANONICAL.md`.
