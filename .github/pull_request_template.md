# Experience

- Experience ID: [link to .agent/experience/YYYY-MM-DD-...md]
- Why now: <one line>

# Grounding

- [ ] Read ../GO.md
- [ ] Read ../.agent/directives-and-memory/AGENT.md
- [ ] Skim ../.agent/directives-and-memory/rules.md
- [ ] Skim ../docs/agent-guidance/typescript-practice.md

# Non‑mutating signals (paste minimal snippets)

```bash
git status --porcelain
git diff --name-only
pnpm -C <workspace-path> exec tsc --noEmit
pnpm -C <workspace-path> exec eslint .
```

# Sub‑agent checkpoints (attach payloads or N/A)

- [ ] architecture-reviewer
- [ ] type-reviewer
- [ ] code-reviewer

Payload hints:

- Paths (files/dirs)
- Minimal repro
- Diagnostics (errors, stack, versions)
- Intent/outcome

# Tests and risk

- [ ] Tests updated/added (vitest) and pass
- [ ] Scope/impact radius
- [ ] Rollback strategy

# Intent

- Outcome: <one sentence>
