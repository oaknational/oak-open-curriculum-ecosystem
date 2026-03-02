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

- [x] Documentation quality verified through multi-persona onboarding
  simulations (three rounds: initial remediation, post-remediation
  validation, and post-fix review)
- [x] All documentation defects from onboarding simulations resolved
- [x] Quality gates green (`pnpm qg`)
- [ ] All agent guidance tooling in the MCP tools is folded into the gat-curriculum-model tool
- [ ] Final secrets and PII sweep passes (`pnpm secrets:scan:all`)
- [ ] Manual review of configuration files, environment examples, READMEs,
  and research documents for sensitive information
- [ ] `feat/semantic_search_deployment` branch merged
- [ ] Repository made public on GitHub

## Current status

**In progress.** SDK, MCP servers, semantic search, and documentation
are complete. Three rounds of onboarding simulation (covering junior
developer, lead developer, CTO, and CEO personas) have been completed,
each round identifying and resolving documentation improvements.
Quality gates are green. Secrets scan clean (382 commits, no leaks).
Remaining steps: manual sensitive-information review, branch merge,
and make public.

Execution detail:
[release-plan-m1.plan.md](../plans/release-plan-m1.plan.md).
