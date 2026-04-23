<!-- Rapidly become a standard file for AI Agent config-ish instructions. -->
<!-- Also the default file for Codex agent instructions -->

# AGENTS.md

Read [AGENT.md](.agent/directives/AGENT.md)

## Agent Tool Discovery

Primary agent workflow CLIs live in `agent-tools/` and are invoked from repo root:

- `pnpm agent-tools:claude-agent-ops status`
- `pnpm agent-tools:claude-agent-ops health`
- `pnpm agent-tools:cursor-session-from-claude-session find --last-hours 2`
- `pnpm agent-tools:codex-reviewer-resolve code-reviewer`

### Commit workflow helpers (added 2026-04-23, Pippin)

Two shell scripts in `scripts/` for safer commit cycles:

- `scripts/check-commit-message.sh` — validate a commit message
  against this repo's commitlint config in isolation from the rest
  of the pre-commit / commit-msg hook chain. Mirrors `git commit`
  message intake (`-m` repeats, `-F`, `-F -`, stdin). Exit 0
  conforms, 1 violates, 2 invalid usage. Catches
  `header-max-length` and `body-max-line-length` violations
  before the ~34s pre-commit cycle. Use BEFORE every `git commit`.
- `scripts/log-commit-attempt.sh` — append one TSV row to
  `.agent/memory/operational/diagnostics/commit-attempts.log`
  recording outcome (`ok|fail|truncated|interrupted`), elapsed
  seconds, sha, invocation mode, subject, and optional note. See
  the [diagnostics README](.agent/memory/operational/diagnostics/README.md)
  for the convention. Use AFTER every `git commit` attempt
  (success OR failure) so the truncation pattern stays countable.

**Commit workflow standard (this branch, 2026-04-23 onward)**:

```bash
# 1. Validate the message in isolation (~1s).
./scripts/check-commit-message.sh -F - <<'EOF'
<your full commit message>
EOF

# 2. Stage, then commit with stdout/stderr redirected to a file
#    (workaround for the Shell-tool stream-truncation pattern
#    documented in the napkin top entry, 2026-04-23).
git add <paths>
START=$(date +%s)
git commit -F - >/tmp/commit.log 2>&1 <<'EOF'
<your full commit message>
EOF
RC=$?; END=$(date +%s); ELAPSED=$((END-START))
tail -3 /tmp/commit.log
SHA=$(git log -1 --format=%h)

# 3. Log the attempt.
if [ $RC -eq 0 ]; then
  scripts/log-commit-attempt.sh ok $ELAPSED $SHA heredoc-fileout "<subject>" "<note>"
else
  scripts/log-commit-attempt.sh fail $ELAPSED - heredoc-fileout "<subject>" "rc=$RC"
fi
```

Do NOT pre-prime the turbo cache via `bash .husky/pre-commit`
before `git commit`. It wastes ~30s and confuses symptom for
cause.

## Learned User Preferences

- `.env.local` files must mirror the structure of `.env.example` (same section headers, ordering, documentation comments)
- Scope changes precisely — when asked for "only config, no code", respect that boundary strictly
- For long or multi-phase work (including GO-style cadence), invoke specialist reviewers (code-reviewer, architecture reviewers, and other relevant reviewers) repeatedly during the work, not only at the end.
- When external concepts are adopted or adapted, attribution must be explicit and include direct links to the upstream source.

## Learned Workspace Facts

- In `apps/oak-curriculum-mcp-streamable-http`, MCP App widget HTML is produced by `pnpm build:widget` (Vite writes to `.widget-build/`, then `scripts/embed-widget-html.js` generates committed `src/generated/widget-html-content.ts`); production serves it by wrapping `createApp` in `src/index.ts` with `getWidgetHtml: () => WIDGET_HTML_CONTENT`, not by reading HTML from `dist/` at runtime.
- Sentry org: `oak-national-academy`, MCP server project: `oak-open-curriculum-mcp`, region: `de.sentry.io` (EU)
- Sentry MCP server (`sentry-ooc-mcp`) is project-scoped via URL path to `oak-national-academy/oak-open-curriculum-mcp`
- Vercel project for MCP HTTP server: `poc-oak-open-curriculum-mcp` at `vercel.com/oak-national-academy/poc-oak-open-curriculum-mcp`
- Sentry DSN is public (not a secret per Sentry docs); safe as regular (non-sensitive) Vercel env vars
- On Vercel, `SENTRY_RELEASE` and `SENTRY_ENVIRONMENT` auto-resolve from `VERCEL_GIT_COMMIT_SHA` and `VERCEL_ENV`
