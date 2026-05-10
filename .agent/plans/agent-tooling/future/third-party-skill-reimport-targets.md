# Third-Party Skill Re-Import Targets

**Status**: reference note
**Created**: 2026-05-10
**Companion plan**:
[`canonical-first-skill-pack-ingestion-tooling.plan.md`](canonical-first-skill-pack-ingestion-tooling.plan.md)

## Purpose

On 2026-05-10 the leftover-vendored copies of twelve third-party skills
were deleted from this repo. The skills were originally vendored into
`.agent/skills/<id>/SKILL-CANONICAL.md` with `jc-`-prefixed adapters at
`.claude/skills/jc-<id>/` and `.agents/skills/jc-<id>/`, registered in
`skills-lock.json`. That pattern pre-dated the open `npx skills add`
import path, conflicted with the PDR-051 rule that ingested skills
retain their upstream identity (no local prefix), and depended on a
canonical-first ingestion installer that was never built.

This note captures **what was deleted and how to bring it back**, so a
future agent or contributor needing one of these skill packs has the
exact import command to hand and does not re-vendor by mistake.

## How to re-import

The skill packs ship through the open skills CLI used across Claude
Code, Cursor, Codex, Gemini CLI, GitHub Copilot, Amp, OpenCode, and
others. The CLI installs directly into `.agents/skills/<id>/`
(unprefixed cross-tool path) and exits.

Do **not** copy the installed content into `.agent/skills/`. The
canonical-first ingestion path is governed by the future plan at
[`canonical-first-skill-pack-ingestion-tooling.plan.md`](canonical-first-skill-pack-ingestion-tooling.plan.md);
until that tooling lands, ingested skills live at the cross-tool
adapter path only and are tracked by their upstream source.

## Deleted skill packs

### `clerk/skills` (eight skills)

```bash
npx skills add clerk/skills --yes
```

Pack contents at deletion time:

| id | summary |
|----|---------|
| `clerk` | router skill that dispatches to the framework-specific Clerk skills below |
| `clerk-setup` | add Clerk to a new project (framework detection, Keyless flow) |
| `clerk-custom-ui` | custom sign-in/sign-up flows + appearance theming |
| `clerk-nextjs-patterns` | advanced Next.js patterns (middleware, Server Actions, caching) |
| `clerk-orgs` | Organizations / B2B multi-tenant patterns |
| `clerk-webhooks` | webhook handlers with `verifyWebhook` |
| `clerk-testing` | E2E auth testing with Playwright/Cypress |
| `clerk-backend-api` | Backend REST API explorer + executor |

The repo-owned `clerk-expert` skill (active workflow skill for Clerk
planning) is **not** part of this pack and was not deleted. It lives
at `.agent/skills/clerk-expert/SKILL-CANONICAL.md` and remains the
local entry point for active Clerk work; re-importing the pack adds
the upstream router and framework-specific skills alongside it.

### `modelcontextprotocol/ext-apps` (four skills)

```bash
npx skills add modelcontextprotocol/ext-apps --yes
```

Pack contents at deletion time:

| id | summary |
|----|---------|
| `create-mcp-app` | scaffold a new MCP App with interactive UI |
| `add-app-to-server` | add MCP App UI to an existing MCP tool |
| `convert-web-app` | convert a web app to an MCP App resource |
| `migrate-oai-app` | migrate from the OpenAI Apps SDK to MCP Apps |

The repo-owned `mcp-expert` skill remains and continues to act as the
active-workflow entry point for MCP work in this repo. Its
`installation-and-integration.md` companion describes the same
`npx skills add` flow.

## Why these were deleted, not converted in place

Three converging reasons:

1. **PDR-051 prefix violation.** The canonical+adapter generator
   unconditionally prefixed every adapter with `jc-`, including
   ingested skills. PDR-051 §"Owned vs ingested classification" is
   explicit: ingested skills retain their upstream identity in
   adapters and receive no local prefix. The leftover adapters
   produced names such as `jc-clerk` and `jc-create-mcp-app` that no
   external consumer would recognise.
2. **No installer.** `skills-lock.json` recorded `source`,
   `sourceType`, and `computedHash` for each pack, but the tooling
   that would fetch from those sources and refresh the canonicals
   was never built. The vendored content was therefore frozen at
   ingestion time and could not be updated except by re-vendoring
   manually.
3. **Open CLI exists.** The `npx skills` CLI documented in
   `.agent/research/agentic-engineering/standardising-skills.md`
   provides the full lifecycle (add, update, list) the unbuilt
   installer was meant to provide. Until canonical-first ingestion
   tooling lands per the companion plan, `npx skills add` is the
   correct import path.

## Outstanding cleanup

- The companion future plan
  ([`canonical-first-skill-pack-ingestion-tooling.plan.md`](canonical-first-skill-pack-ingestion-tooling.plan.md))
  references Clerk and `modelcontextprotocol/ext-apps` as
  illustrative pack examples. No edit required — the references are
  vendor-agnostic.
- `.agent/plans/agent-tooling/current/agent-infrastructure-portability-remediation.plan.md`
  contains historical references to `.cursor/skills/clerk*/` paths
  (a surface retired in Wave 1 of skills standardisation). Out of
  scope for this cleanup; archive when the remediation plan
  completes.
