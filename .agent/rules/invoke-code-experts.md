---
classification: core
description: After non-trivial changes, invoke code-expert as the gateway and the specialist reviewers the change profile names; the roster table maps what changed to the reviewer, and the host's executive catalogue adds its domain reviewers and path triggers.
---

# Invoke Specialist Experts

Operationalises the [sub-agent architecture](../sub-agents/README.md) — layered prompt composition and domain-specialist experts.

After non-trivial changes, invoke specialist experts. `code-expert`
is the gateway reviewer: triage what changed, choose the
specialists and review depth needed, capture findings explicitly, and act on
them before considering the work complete.
Pull-request (vendor) reviews — Copilot's, Codex's — are a different instrument,
requested under the pr-lifecycle skill's review request policy for a stated reason,
never automatically; this rule governs the estate's own reviewers (the owner,
2026-10-28: "there is a difference between subagents and PR reviewers").

A consult is a reading, not the directive: when a reviewer's consult licenses
something a directive names absolutely, read the directive's sentence before
acting on the consult (a test-expert consult licensed new cases in a loopback
suite "since no new IO is introduced"; the directive has no such clause, and
both vendor reviewers cited it at round one, 2026-09-20). A finding received
from any reviewer is information to evaluate critically, never authority
(the owner, 2026-10-14: "Reviewing agents are NEVER a source of authority");
its precondition and the owner's prior rulings are verified first-hand before
it reaches a record, a cure or the owner.

Each test change gets a `test-expert` verdict before it is committed, and the commit message
or the pull-request body records the verdict (both estates' practice from 2026-09-29, after
test changes landed against the testing directive with green gates).

## The roster

One row per general-layer reviewer whose brief both Practice instances carry. The trigger
column names concepts and file kinds; the host's catalogue names the paths.

| reviewer | invoke when the change touches | brief |
| --- | --- | --- |
| `code-expert` | any non-trivial change: the gateway, which triages what changed and names the specialists below | [code-expert](../sub-agents/templates/code-expert.md) |
| `accessibility-expert` | rendered markup, semantics, ARIA, keyboard and focus flows, colour contrast, motion, generated documents (a PDF), assistive-technology behaviour | [accessibility-expert](../sub-agents/templates/accessibility-expert.md) |
| `architecture-expert` | workspace boundaries, import direction, module structure, dependency injection, public APIs, any decision with long-term structural consequence; its four lenses (Barney, Betty, Fred and Wilma) are named over this one brief, each the lens for the lane a change touches | [architecture-expert](../sub-agents/templates/architecture-expert.md) |
| `assumptions-expert` | plan authoring: a decision-complete or ready-for-execution mark, a blocking claim over other workstreams, three or more proposed agents, workspace or package topology changes, a third-party vendor integration, a technology commitment before research, a related document set drafted together, a requested assumption audit or proportionality check | [assumptions-expert](../sub-agents/templates/assumptions-expert.md) |
| `config-expert` | TypeScript, lint, test-runner, formatter, markdownlint, task-runner, dead-code and dependency-graph configuration; package scripts, lockfiles, environment handling, the framework's own config files, hook configuration, deployment tooling | [config-expert](../sub-agents/templates/config-expert.md) |
| `design-system-expert` | design tokens, CSS custom properties, theming, colour palettes, spacing and typography scales, motion, layout rhythm, breakpoints, multi-surface styling, shared-component styling, visual consistency | [design-system-expert](../sub-agents/templates/design-system-expert.md) |
| `docs-adr-expert` | decision records (ADRs, PDRs and the host's other record kinds), README contract docs, `.agent/` documentation, permanent narrative surfaces: numbering, status, truthfulness, cross-references; and, paired with `onboarding-expert`, every significant doctrine or Practice change (below) | [docs-adr-expert](../sub-agents/templates/docs-adr-expert.md) |
| `onboarding-expert` | an onboarding entry point (the README's getting-started section, CONTRIBUTING, AGENT.md, the platform entry files) or any document on an onboarding path; and, paired with `docs-adr-expert`, every significant doctrine or Practice change (below) | [onboarding-expert](../sub-agents/templates/onboarding-expert.md) |
| `prose-expert` | the writing of any significant authored document: clarity, concision, lead-with-the-point; proportionately, never every trivial doc touch | [prose-expert](../sub-agents/templates/prose-expert.md) |
| `react-component-expert` | React component architecture, hooks, render performance, prop API, composition, client or server boundaries, hydration, lifecycle | [react-component-expert](../sub-agents/templates/react-component-expert.md) |
| `release-readiness-expert` | a release boundary: a merge to a release branch, a version bump, a contract or schema change, a re-evaluation after a prior no-go | [release-readiness-expert](../sub-agents/templates/release-readiness-expert.md) |
| `security-expert` | headers, CSP, secrets, environment loading, middleware and proxies, dependencies, auth, any public attack surface | [security-expert](../sub-agents/templates/security-expert.md) |
| `subagent-architect` | the reviewer roster, the sub-agent templates, this rule and the catalogue, skills, the platform agent, rule and skill adapters, the platform entry points | [subagent-architect](../sub-agents/templates/subagent-architect.md) |
| `test-expert` | tests, test helpers, proof layers, test-runner and browser-harness configuration, TDD discipline; every test change, before its commit (above) | [test-expert](../sub-agents/templates/test-expert.md) |
| `type-expert` | complex type flow, exported types, schema inference, assertions, generics, compile-time guarantees | [type-expert](../sub-agents/templates/type-expert.md) |
| cricket (judgement and procedure) | a cycle or decision boundary where the question is whether this is the right work: a fast second opinion through the `cricket` skill, never an artefact review | [cricket-judgement](../sub-agents/templates/cricket-judgement.md), [cricket-procedure](../sub-agents/templates/cricket-procedure.md) |

**A significant doctrine or Practice change dispatches both `docs-adr-expert` and
`onboarding-expert`, in parallel, before the work is complete** (owner-stated standing
direction, 2026-05-02, verbatim: *"for all significant documentation or Practice changes — and
this is always true — we need reviews from the documentation reviewer and the onboarding
reviewer."*). Significant: doctrine added, removed, renamed, rewritten or restructured (the
directives, the Practice Core, the rules, the reference documents, the engineering docs, the
decision records, the governance docs); an onboarding entry point changed; a command, skill,
slash command, agent or reviewer renamed across files. Not significant: a typo fix, a
frontmatter-only edit, a citation insertion, a source-only change whose docs are generated.
When in doubt it is significant; each reviewer alone misses a class the other catches. The two
receive briefs scoped to their lenses (documentation drift, decision-record and TSDoc alignment,
permanent-versus-ephemeral homing; the human and agent onboarding paths for freshness,
discoverability and first-success speed). A finding that names a missing or stale permanent doc
blocks; a friction or freshness finding routes to the remediation list. A change set that mixes
code and significant documentation fires the gateway dispatch and this pair.

The host's executive catalogue, `.agent/memory/executive/invoke-code-experts.md`, adds the
host's own domain reviewers and its path triggers (the globs each row fires on); it is the full
reviewer catalogue and invocation policy.
