# Continuation Prompt: Oak MCP Ecosystem

**Use this prompt in a fresh chat session to resume work efficiently.**

---

## Context Loading Prompt

```text
I'm working on the Oak MCP Ecosystem monorepo. It contains MCP servers, SDKs, and support libraries
that expose Oak's open curriculum data.

Please read:
1. @.agent/context/context.md – latest state snapshot
2. @.agent/directives-and-memory/rules.md – repository rules (mandatory)
3. @.agent/directives-and-memory/schema-first-execution.md – schema-first mandate
4. @.agent/directives-and-memory/testing-strategy.md – TDD/testing guidelines
5. @.agent/plans/high-level-plan.md – active strategic priorities

After reading, please:
- Summarise the current state in ≤4 sentences.
- List the top 3 priorities.
- Ask which priority to tackle (or if there's a different task).

Reminders:
- Always apply TDD (Red → Green → Refactor).
- All runtime types flow from the Open Curriculum OpenAPI via `pnpm type-gen`.
- Avoid type shortcuts (`any`, `as`, `!`, broad records).
- Prefer clarity and specificity over speed.
```

---

## Quick Start Snippets

### Resume Auth Refactor / Smoke Automation

```text
I want to continue the auth refactor work around Clerk.

Read:
1. @.agent/plans/auth-architecture-refactor.md – up-to-date auth plan
2. @.agent/context/context.md – current state summary

Context:
- All quality gates and smoke modes (stub/live/remote) pass.
- Headless Playwright helper (`headless:oauth`) provisions the Clerk handshake and launches Chromium, but Clerk still redirects to the hosted sign-in page and times out without provider credentials.
- Clerk M2M tokens aren’t suitable for `mcpAuthClerk`; the harness still switches between API and headless flows via `SMOKE_USE_HEADLESS_OAUTH`, with manual `@auth-smoke` traces as fallback.
- Automated trace capture (`pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http trace:oauth`) already produced HAR + Playwright traces under `apps/oak-curriculum-mcp-streamable-http/temp-secrets/`.
- Phase 3A plan now needs a strategy to satisfy the hosted login (inject provider creds, attach to Chrome, or backend acknowledgement) before we can mark the headless automation complete.

Please:
1. Recommend how to unblock the hosted login (e.g. env vars for provider credentials vs Chrome connection).
2. Describe how `SMOKE_USE_HEADLESS_OAUTH` toggles the harness between helper and API flows, including artefact handling and cleanup.
3. Confirm whether to implement the automation fix immediately or capture updated documentation/prompts first.
```

### Resume Curriculum Ontology Work

```text
I want to pick up the Curriculum Ontology resource work.

Read:
1. @.agent/plans/curriculum-ontology-resource-plan.md
2. @docs/architecture/curriculum-ontology.md
3. @.agent/plans/mcp-aggregated-tools-type-gen-refactor-plan.md

Please:
1. Recap why the aggregated tools refactor is still a prerequisite.
2. Ask whether to tackle the refactor first, prototype a shimmed ontology resource, or pause.
```

### Resume API Wishlist Work

```text
I want to continue the Upstream API metadata wishlist.

Read:
1. @.agent/plans/upstream-api-metadata-wishlist.md

Please:
1. Summarise the highest-priority wishlist items.
2. Ask if the next step is sharing with the API team, expanding the list, or drafting
   implementation plans.
```

### Starting Something New

```text
I have a new task: [describe task].

Please:
- Read @.agent/context/context.md and the repository rules.
- Check for related plans in .agent/plans/.
- Confirm alignment with @.agent/plans/high-level-plan.md.
- Ask clarifying questions before proceeding.
```

---

## Quality Gate Checklist

- `pnpm format:root`
- `pnpm markdownlint:root`
- `pnpm type-gen`
- `pnpm build`
- `pnpm type-check`
- `pnpm lint`
- `pnpm test`

Run sequentially; all must pass before committing or opening a PR.

---

## Common Pitfalls to Avoid

- Reintroducing module-level side effects in Express apps.
- Skipping tests or using `process.exit` to hide failing assertions.
- Forgetting to clean up temporary Clerk users/sessions in smoke helpers.
- Assuming session tokens are sufficient for OAuth-protected endpoints—use real OAuth access tokens generated through the approved flow.
