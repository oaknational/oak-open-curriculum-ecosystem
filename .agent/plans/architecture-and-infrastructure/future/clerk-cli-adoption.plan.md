---
name: "Clerk CLI Adoption"
overview: "Strategic follow-up to give Clerk's CLI (https://github.com/clerk/cli) the same first-class, repo-integrated treatment we are giving the Sentry CLIs: per-workspace dev-dependency pinning, repo-tracked project-scoped config, README prereqs entries where applicable, and agent-discoverable usage docs."
depends_on:
  - "../active/sentry-otel-integration.execution.plan.md"
todos:
  - id: research-clerk-cli-surface
    content: "Document the Clerk CLI subcommand surface, install modes (brew vs npm -g vs pnpm), auth/link/unlink behaviour, config/env pull scope, api subcommand capabilities, doctor command, and agent-mode output. Capture findings in docs/operations/ (new) or append to an existing Clerk operations doc."
    status: pending
  - id: map-use-cases-to-repo-workspaces
    content: "Enumerate which workspaces currently integrate Clerk and for each decide: does this workspace need clerk CLI at dev time, at CI time, both, or not at all. Produce a use-case → workspace matrix."
    status: pending
  - id: choose-installation-shape
    content: "Choose between npm-global install, brew install, and pnpm dev-dependency. Prefer pnpm dev-dependency per rule 3.5 if Clerk publishes a workable package shape; fall back to README prereq + fail-fast script warning if not."
    status: pending
  - id: repo-local-project-scoping
    content: "Confirm whether Clerk CLI supports repo-local config (analogue of sentry-cli's .sentryclirc) and, if so, commit a scoped config per workspace that uses Clerk. If Clerk CLI only supports user-global link/auth state, document that limitation and choose the least-global route (e.g. --app id flags in scripts) so project scoping is reproducible."
    status: pending
  - id: agent-skill-update
    content: "Update .claude/skills/clerk/* and .agents/skills/clerk-expert/SKILL.md to reference the Clerk CLI as an agent-facing capability (it exposes a --mode agent flag and --prompt output). Ensure the skill makes the CLI discoverable so agents reach for it instead of hand-rolling API calls."
    status: pending
  - id: failure-mode-hygiene
    content: "Add warning patterns to any script that calls clerk so missing binary, missing link, or missing auth fails fast with a helpful message and link, matching the lsof/bun/jq/gitleaks/sentry pattern."
    status: pending
---

# Clerk CLI Adoption

**Last Updated**: 2026-04-16
**Status**: Strategic brief — not yet executable
**Lane**: `future/`

## Problem and Intent

CLIs from auth and observability vendors are becoming first-class
agent-facing developer tooling rather than human-only conveniences. The
Clerk CLI ([clerk/cli](https://github.com/clerk/cli)) explicitly exposes
this with `--mode agent`, `--prompt` output, and a flat `clerk api`
surface for humans and agents alike. Its commands (`init`, `auth`,
`link`, `unlink`, `config pull/schema/patch/put`, `env pull`, `api`,
`doctor`, `open`) overlap substantially with the tasks agents already
perform manually via the Clerk Dashboard or by hand-rolling API calls.

The Sentry CLI follow-up lane (in the parent plan's "Follow-up hygiene"
section) is establishing the repo's pattern for CLI-as-infrastructure:
pnpm-installed where possible; per-workspace config committed to the
repo; README prereqs entries with fail-fast warnings where not. That
pattern should extend to the Clerk CLI so agents and humans have the
same discoverable, portable, reproducible path.

This plan is a placeholder so that pattern extension does not get
forgotten once the Sentry lane closes.

## Domain Boundaries and Non-Goals

- **In scope**: Clerk CLI installation, per-workspace scoping, config
  hygiene, agent-discoverability, integration with existing Clerk
  skills.
- **Out of scope**:
  - Any Clerk SDK upgrade that is not motivated by CLI adoption.
  - Any change to Clerk-side configuration (applications, instances,
    JWT templates). We read/pull config from Clerk; we do not mutate
    Clerk-side state from this plan.
  - Codex-specific auth compatibility (separate plan:
    [`codex-mcp-server-compatibility.plan.md`](./codex-mcp-server-compatibility.plan.md)).
- **Cross-reference**: the Codex lane may benefit from
  `clerk config schema`, `clerk config pull`, and `clerk api` for
  diagnosing OAuth client metadata. That is a discovery opportunity,
  not a scope-expansion path.

## Dependencies and Sequencing Assumptions

- Parent Sentry validation closure lane
  ([`sentry-otel-integration.execution.plan.md`](../active/sentry-otel-integration.execution.plan.md))
  must land first so the CLI-as-infrastructure pattern exists before
  this plan extends it.
- The Sentry CLI hygiene follow-up session documented in the parent
  plan's "Follow-up hygiene" section should also land first so that the
  precedent for per-workspace `.sentryclirc` (or equivalent)
  commit-to-repo pattern is established.
- No other active plan depends on this one; it can slip without
  blocking anything.

## Success Signals

- Every workspace that uses Clerk has the CLI invocable locally with
  zero human-specific state (other than auth).
- Any script that calls `clerk` fails fast with an informative message
  and install link if the binary is missing, matching the repo's
  existing pattern for `lsof`, `bun`, `jq`, `gitleaks`, and the
  Sentry dev CLI.
- Agent skills for Clerk reference the CLI explicitly as the
  agent-facing capability, including `--mode agent` and `--prompt`
  usage.
- A concise `docs/operations/clerk-cli-usage.md` (or equivalent) exists
  and is linked from the Clerk skills so humans and agents can self-serve.

## Risks and Unknowns

- Clerk CLI is a young tool (version / stability TBC); upgrade cadence
  may be fast. Pin versions carefully and monitor.
- Unknown whether Clerk CLI supports repo-local config beyond the
  `--app` / `--instance` flags. If not, per-workspace scoping relies on
  disciplined flag usage in scripts rather than a committed config
  file.
- Potential auth-token sprawl: `clerk auth login` stores credentials
  user-globally. This is acceptable for developer use but must not
  become a CI dependency — CI should use scoped API keys via env
  rather than interactive login.
- The Clerk CLI `--prompt` output is explicitly AI-agent-targeted; we
  need to confirm the prompt format is stable before building agent
  workflows on top of it.

## Promotion Trigger (`future/` → `current/`)

Any of:

1. A separate Clerk-integration workstream starts (e.g. Clerk webhook
   sync, org-scoped OAuth refinement, or the Codex compatibility lane
   matures to the point that `clerk config pull` becomes its primary
   diagnostic tool).
2. A developer hits friction from the current hand-rolled Clerk
   dashboard or API workflow that the CLI would remove.
3. An agent needs `clerk` as a first-class capability for a planned
   workflow (e.g. a pre-flight Clerk health check before Sentry-style
   validation lanes).

When any of the above happens, copy this strategic brief into
`current/clerk-cli-adoption.plan.md`, mine the six todos above into
executable TDD phases with acceptance criteria, and apply the same
quality gates the Sentry hygiene lane will have established.

## Implementation Detail (Reference Only)

These notes are **reference context only**; execution decisions are
finalised during promotion to `current/`/`active/`.

- Install: `brew install clerk/stable/clerk` or `npm install -g clerk`.
  Probe for a pnpm-installable shape first (rule 3.5). If Clerk publishes
  `@clerk/cli` on npm with a binary, add as devDependency and invoke via
  `pnpm exec clerk`.
- Repo-local config: confirm `clerk config pull --output` and
  `--app <id>` flag behaviour. If there is no ancestor-discovery config
  file like `.sentryclirc`, mandate `--app <id>` in every script that
  calls `clerk` so project scoping is always explicit.
- Agent skill integration: `.claude/skills/clerk/` and
  `.agents/skills/clerk-expert/SKILL.md` are the right entry points.

## Foundation Alignment

- [principles.md](../../../directives/principles.md) — especially the
  infrastructure-config-in-repo rule reinforced in the 2026-04-16
  napkin entry.
- [ADR-159: Per-Workspace Vendor CLI Ownership with Repo-Tracked
  Configuration](../../../../docs/architecture/architectural-decisions/159-per-workspace-vendor-cli-ownership.md)
  — the canonical decision this plan implements for the Clerk CLI.
- Rule 3.5 (pnpm-installable tools MUST be pnpm-installed), now
  formalised end-to-end in ADR-159.
- README prerequisite pattern (see `lsof`, `bun`, `jq`, `gitleaks`,
  `sentry` dev CLI).

## Learning Loop

After promotion and completion, run `/jc-consolidate-docs` to:

- Extract any durable CLI-as-infrastructure patterns into
  `.agent/memory/patterns/`.
- Update the Clerk skills with lessons learned.
- Reconcile with the Sentry hygiene lane's patterns so both vendor CLIs
  share a single operating doctrine.
