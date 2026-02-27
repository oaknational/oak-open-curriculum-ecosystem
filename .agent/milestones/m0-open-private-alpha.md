# Milestone 0: Open Private Alpha

## Why this milestone matters

This is the moment the work becomes visible. Making the repository public
means that external developers, edtech teams, and the wider open-source
community can see what Oak has built — a curriculum SDK, MCP servers, and
semantic search, all generated from the Open Curriculum API. The HTTP MCP
server remains private alpha (invitation-only) at this stage, but the
code, documentation, and architectural decisions are available for anyone
to read, learn from, and start building on.

## Who it is for

- **External developers** who want to build curriculum tools on Oak's data
- **Edtech teams** evaluating Oak's open data infrastructure
- **Open-source contributors** interested in MCP, curriculum technology,
  or agentic engineering practice
- **Oak's internal teams** preparing to work on the public repository

## What value it delivers

- The SDK, MCP servers, and search infrastructure become publicly available
  for the first time.
- External developers can start building curriculum tools on Oak's open
  data.
- The repository's quality standards, architectural decisions, and
  engineering practice are visible as a reference for the community.

## Progression gates

All must be true before M0 exit:

- [x] Documentation remediation complete (17 items from onboarding
  simulations — README restructure, jargon expansion, progressive
  disclosure, explanatory documentation)
- [x] Post-remediation onboarding rerun complete (4 personas, 2026-02-27).
  Previous remediation verified effective. No P0 blockers.
- [x] Post-rerun documentation fixes (4 P1 items from onboarding rerun:
  N1 SDK README fabricated examples, N2 README jargon wall, N3 Curriculum
  Guide not linked from README, N4 MCP unexplained for non-technical
  readers). All docs-only. Complete 2026-02-27. N10 generator `as` casts
  also resolved (2026-02-27). All 15 N-items complete. Final validation
  with 4 personas confirmed fixes effective.
- [ ] Final secrets and PII sweep passes (`pnpm secrets:scan:all`)
- [ ] Manual review of configuration files, environment examples, READMEs,
  and research documents for sensitive information
- [ ] `feat/semantic_search_deployment` branch merged
- [ ] Repository made public on GitHub
- [ ] Quality gates green (`pnpm qg`)

## Current status

**In progress.** All code work is complete. All 15 documentation
N-items resolved (including N10 generator `as` casts, 2026-02-27).
Two code patterns extracted to `.agent/memory/code-patterns/`.
Final onboarding validation (4 personas, 2026-02-27) confirmed fixes
effective. 10 new validation findings (V1-V10) discovered — 2 P1
stale-path issues (extending.md, CONTRIBUTING.md), 8 P2 items.
Quality gates green. Remaining M0 gates: secrets sweep, manual
sensitive-information review, branch merge, and make public.

Execution detail:
[release-plan-m1.plan.md](../plans/release-plan-m1.plan.md) §Next Steps.
Validation findings:
[onboarding-simulations-public-alpha-readiness.md](../plans/developer-experience/onboarding-simulations-public-alpha-readiness.md)
§Post-Remediation Final Validation.
