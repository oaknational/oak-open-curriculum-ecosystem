# Oak Open Curriculum — ChatGPT and Codex package

This directory is the ChatGPT/Codex packaging of the Claude plugin in `../oak-open-curriculum/`.
It is a **checked-in copy**, not a build output. The Claude plugin is the source: a correction to
a shared skill lands there first and is re-copied here, never the other way round.

## Why a separate package

ChatGPT and Codex read a plugin's `skills/` directory and nothing else (observed 2026-09-07).
The Claude plugin keeps its two capabilities as agents in `agents/`, each reached through a
workflow that passes the user's input as `$ARGUMENTS`; ChatGPT has neither agents nor
workflows. So here:

- every skill present in both plugins is a byte-identical copy of the Claude one (`evals/`
  excluded); `validate-plugin-skill-copies` (in `pnpm repo-validators:check`) discovers that
  set from the two trees rather than keeping a list;
- `audit-sequence` and `find-misconceptions` each merge a Claude workflow and its agent into
  one self-contained skill. The agent's body is carried byte-identical from its first heading
  onward. The edits: the workflow's `$ARGUMENTS` line and its restatement of the method become
  one opening paragraph ("the plan or topic the user has shared; ask if missing"); the
  "Delegate to" line and the Claude-only frontmatter (`argument-hint`, `skills`, `model`) are
  dropped; the `skills:` dependency becomes one sentence appended to the agent's opening
  paragraph; the description is the Claude workflow's, word for word (both carry a do-not-use
  boundary naming the sibling skills); and `license`, `compatibility` and `metadata` are added
  to match the shared skills;
- there is no `.mcp.json`: bundling a server badged the plugin "desktop only" (observed in
  the desktop app, 2026-09-07). Live data arrives through the Oak MCP server the user connects
  themselves, as a ChatGPT connector or a direct Codex entry (see Sideload);
- `interface.capabilities` is `[]`, the value the OpenAI sideload accepted on 2026-09-07.

The last two, no `.mcp.json` and `capabilities: []`, and the agreement of the two manifests
are recomputed by `agent-tools/tests/skills/chatgpt-plugin-package-invariants.integration.test.ts`.

That validator fails the build when a shared copy drifts from its Claude source. An
integration test, `agent-tools/tests/skills/chatgpt-merged-skill-derivation.integration.test.ts`,
fails it when a merged skill and its Claude agent stop matching from the first heading onward.
The durable fix is a generator (MCP-342); until then the copies are honest because they are
checked.

## Sideload for testing (desktop app)

Steps observed in the Codex desktop app, 2026-09-07.

1. `codex plugin marketplace add <repo root>` — the root `.agents/plugins/marketplace.json`
   lists this package.
2. Add the Oak MCP server in Codex: Plugins → Add → Add MCP server, Streamable HTTP,
   `https://mcp.thenational.academy/mcp`; sign in when prompted.
3. Quit the app from the system tray, reopen, Plugins → Personal → install.
4. Invoke a skill with `$` in the desktop app: `$find-misconceptions photosynthesis Year 9`.

Tool names arrived prefixed and with hyphens as underscores (`mcp__codex_apps__oak_<tool>`
via the connector, `mcp__<id>__<tool>` via a direct entry; observed 2026-09-07), so
the merged skills say to match by suffix treating `-` and `_` as the same.

## Not done here

Publishing to the Oak workspace or the public directory (MCP-107). The Oak Curriculum Toolkit
already in the workspace ships the three shared skills under the same names (observed
2026-09-07); whether this package is listed separately from the toolkit is a product decision
to take before any publish.
