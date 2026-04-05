## Napkin rotation — 2026-04-04

Rotated at 579 lines after Phase 4 closure. Archived to
`archive/napkin-2026-04-04.md`. Merged 1 new entry into
`distilled.md`: ESLint `lint:fix` value+type import merging.
Extracted 1 pattern: `review-intentions-not-just-code.md`.
Previous rotation: 2026-04-03 at 632 lines.

## Session 2026-04-05 — Practice Core evolution: concepts, ADRs, self-containment

### What Was Done

- Added ADR infrastructure section to `practice-bootstrap.md` — the
  graduation target of the learning loop was the only artefact type
  without a bootstrap template
- Discovered and promoted three foundational principles:
  1. **Concepts are the unit of exchange** — all Practice exchange
     operates at the concept level, not the file or name level
  2. **Substance before fitness** — write concepts at the weight they
     deserve first, deal with fitness holistically afterward
  3. **Self-containment requires concept export** — travelling content
     carries the substance, not pointers to host-repo artefacts
- Removed 6 specific ADR-144 references from Practice Core files and
  10 specific ADR references from Practice Context outgoing files
- Enhanced the ADR README with template, lifecycle, and creation guidance
- Wrote all three principles to their correct homes across 5+ locations
  each, then performed holistic fitness compression as a separate pass

### Patterns to Remember

- **Fitness budgets distort writing**: I repeatedly compressed concepts
  _during writing_ to stay within char limits. The user corrected this:
  write the concept fully first, then deal with fitness as a separate
  editorial concern. The distortion was subtle — I wasn't aware I was
  doing it until called out.
- **A descriptive name is still a pointer**: replacing "ADR-144" with
  "the two-threshold fitness model" is an improvement but not sufficient
  if the receiving context has never encountered the concept. The
  substance must travel, not just a better label.
- **Three levels of reference quality**: (1) opaque pointer ("ADR-144"),
  (2) descriptive name ("two-threshold fitness model"), (3) exported
  concept (what it is, how it works, why it matters). Only level 3 is
  sufficient for portable content.
- **Self-containment is concept-level, not file-level**: the Practice
  Core and Context travel between repos. They must carry concepts, not
  references to the host repo's specific artefact system.

### Corrections (from user)

- "The Practice Core MUST be self-contained — no ADR references in
  portable files." I had added a perfectly good ADR section to the
  bootstrap with host-repo-specific paths. The section was right; the
  location was wrong. Fixed by making the section portable (generic
  paths, no specific ADR numbers).
- "A name is still a pointer." I thought replacing ADR numbers with
  descriptive names was sufficient. The user showed it's not — the
  substance must travel. This is the deeper insight.
- "Write the concept fully first, deal with fitness after." I was
  self-censoring concepts to fit char limits. The user identified this
  as artificially underweighting vital understanding.
- "Concepts are the unit of exchange — that feels foundational." The
  user elevated what I'd framed as an exchange-mechanism guard to a
  fundamental principle of how the Practice thinks, teaches, and evolves.

### Mistakes Made

- Self-censored concept weight to stay within fitness limits
- Initially placed ADR infrastructure in Practice Core with host-repo
  references (specific directory path, specific numbering conventions
  that only make sense in this repo)
- Framed "export concepts not pointers" as a defensive guard rather
  than recognising it as the fundamental operating principle of
  Practice exchange
- Made 5+ round trips to compress 10-50 chars at a time instead of
  writing fully and compressing holistically

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
