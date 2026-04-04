## Napkin rotation — 2026-04-04

Rotated at 579 lines after Phase 4 closure. Archived to
`archive/napkin-2026-04-04.md`. Merged 1 new entry into
`distilled.md`: ESLint `lint:fix` value+type import merging.
Extracted 1 pattern: `review-intentions-not-just-code.md`.
Previous rotation: 2026-04-03 at 632 lines.

## Session 2026-04-04 — MCP App UI not rendering (investigation)

### What Was Done

- Called `get-curriculum-model` via the running `oak-local` MCP server
  in Claude Code (VS Code extension). The text content was returned
  correctly but no brand banner was displayed.
- Investigated and found four issues:

### Corrections (from user)

- **I guessed instead of verifying**: claimed Claude Code doesn't
  support MCP Apps. It does. The claude-code-guide agent confirmed
  with evidence. Never guess — verify.
- **I explained away the failure instead of acknowledging it**: listed
  possible reasons and suggested the user try things. The correct
  response was to acknowledge the implementation is unproven and
  investigate.

### Patterns to Remember

- **`registerAppTool` is canonical, not `server.registerTool`**: the
  ext-apps SDK's `registerAppTool()` normalises both modern
  (`_meta.ui.resourceUri`) and legacy (`_meta["ui/resourceUri"]`)
  metadata keys. Without this, hosts reading the legacy key skip the
  widget. The repo's own docs/tests/skills say to use it, but
  production code doesn't.
- **`preserve-schema-examples.ts` is a compatibility layer**: it
  overrides the `tools/list` handler to work around the MCP SDK's
  lossy Zod→JSON Schema conversion. This violates "no shims, no
  hacks, no workarounds." The canonical fix needs investigation
  (Zod 4 `.meta()`, direct JSON Schema passthrough, or upstream fix).
- **Test coverage proves pieces, not composition**: 16 widget tests +
  157 E2E tests + 3 UI tests all pass, but nothing proves the MCP App
  actually renders in a host. The test pyramid has a gap at the
  integration level between "tool response has `_meta.ui`" and
  "widget appears in an iframe."

### Mistakes Made

- Guessed that Claude Code doesn't support MCP Apps — it does.
- Tried to explain away the non-functional UI rather than
  acknowledging the problem.
- Did not inspect the wire protocol to verify what `tools/list`
  actually returns.
- Investigation brief written at
  `~/.claude/plans/glistening-sniffing-eich.md` for next session.
