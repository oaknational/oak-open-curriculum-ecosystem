# Manifest-Driven Adapter Generation — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements

## Problem and Intent

Platform adapters (`.claude/agents/`, `.cursor/agents/`, `.claude/rules/`,
`.cursor/rules/`, `.gemini/commands/`, `.agents/skills/`) are thin wrappers
around canonical artefacts in `.agent/`. They are boilerplate — 5–15 lines each,
differing only in platform-specific frontmatter fields (tools, model, readonly).

With the planned specialist roster reaching **dozens of agents** across 4
platforms, the
adapter count will reach ~100+ files. Manual maintenance at this scale:

- Creates drift between canonical templates and platform adapters
- Makes new specialist creation a multi-file chore (4+ adapter files per
  specialist)
- Makes the taxonomy rename (ADR-135) a high-risk, high-effort operation
- Makes `portability:check` a freshness detector rather than a correctness
  guarantee

## Proposed Solution

A **specialist manifest** defines each agent's platform-specific properties
once. A build script generates all adapter files from the manifest + canonical
templates.

### Manifest Format

A single `specialist-manifest.yaml` in `.agent/`:

```yaml
agents:
  - name: clerk-reviewer
    canonical_template: .agent/sub-agents/templates/clerk-reviewer.md
    tier: deep  # gateway | sentinel | deep
    default_depth: deep  # deep | focused | both
    readonly: true
    skill: .agent/skills/clerk-expert/SKILL.md
    rule: .agent/rules/invoke-clerk-reviewer.md
    platforms:
      claude:
        tools: [Read, Grep, Glob, Bash, WebFetch, WebSearch]
        model_tier: deep  # maps to opus
      cursor:
        tools: [Read, Glob, Grep, LS, Shell, ReadLints, WebFetch, WebSearch]
        model: gpt-5.4-xhigh  # Cursor uses explicit model names
      codex:
        # Skills are knowledge, not agents — minimal config
        type: skill
      gemini:
        type: command
```

### Generation Script

`scripts/generate-adapters.mjs` (or `.ts`):

1. Reads `specialist-manifest.yaml`
2. For each agent, generates platform-specific adapters using templates:
   - `.claude/agents/<name>.md` — Claude Code agent wrapper
   - `.cursor/agents/<name>.md` — Cursor agent wrapper
   - `.claude/rules/invoke-<name>.md` — Claude Code rule adapter
   - `.cursor/rules/invoke-<name>.mdc` — Cursor rule adapter (with frontmatter)
   - `.gemini/commands/review-<name>.toml` — Gemini CLI command
   - `.agents/skills/<name>/SKILL.md` — Codex skill wrapper
3. Each generated file includes a `<!-- GENERATED — do not hand-edit -->` header
4. Outputs a summary of files generated/updated

### Turbo Integration

```json
{
  "generate:adapters": {
    "inputs": [".agent/specialist-manifest.yaml", ".agent/sub-agents/templates/**"],
    "outputs": [".claude/agents/**", ".cursor/agents/**", ".claude/rules/**", ".cursor/rules/**", ".gemini/commands/**", ".agents/skills/**"]
  }
}
```

### Validation Evolution

`portability:check` evolves from "do adapters exist?" to "are generated files
fresh?" — comparing the manifest + templates against the generated output.

## What This Enables

| Before (manual) | After (generated) |
|---|---|
| New specialist = write 4–6 adapter files | New specialist = add 1 manifest entry + `pnpm generate:adapters` |
| Rename = find-and-replace across 100 files | Rename = change manifest + regenerate |
| Taxonomy WS3 = manually create many wrapper files | Taxonomy WS3 = update manifest + regenerate |
| Drift between canonical and adapter | Impossible — adapters are derived |
| `portability:check` detects missing files | `portability:check` detects stale generation |

## Scope

### In scope

- Manifest schema design
- Generation script for all four platforms
- Migration of existing adapters to generated format
- Turbo task integration
- `portability:check` evolution to freshness check
- CI gate: fail if generated files are stale

### Out of scope

- Canonical template content (unchanged — still hand-authored)
- Canonical rule content (unchanged — still hand-authored)
- Skill content (unchanged — still hand-authored)
- Platform-specific capability differences (documented in manifest, not in
  generator logic)

## Relationship to Other Plans

- **Agent Classification Taxonomy**: This plan is a **prerequisite optimisation**
  for the taxonomy rename. If adapters are generated, WS3 goes from "manually
  rename 100 files" to "update manifest, regenerate". Strongly recommended to
  execute this BEFORE the taxonomy plan.
- **Every future specialist plan**: Every new specialist benefits from manifest-
  driven generation. Reduces each specialist's "platform adapters" deliverable
  from "create 4–6 files" to "add manifest entry".

## Promotion Trigger

This plan promotes to `current/` when:

1. The specialist count reaches a point where manual adapter maintenance is
   demonstrably unsustainable (arguably already the case now)
2. OR: the taxonomy rename is about to begin (this plan should execute first)
