# Oak Open Curriculum — ChatGPT and Codex package

This directory is the ChatGPT/Codex packaging of the Claude plugin in `../oak-open-curriculum/`.
It is a **checked-in copy**, not a build output, and the Claude plugin is not changed by it.

## Why a separate package

ChatGPT and Codex read a plugin's `skills/` directory and nothing else. The Claude plugin keeps
its two capabilities in `agents/`, reached through workflows that use `$ARGUMENTS` substitution;
neither exists in ChatGPT. So here:

- the three shared skills are byte-identical copies of the Claude ones (`evals/` excluded);
- `audit-sequence` and `find-misconceptions` are each workflow + agent merged into one
  self-contained skill, with three edits: the argument line becomes "the plan/topic the user
  has shared; ask if missing", the delegation line and Claude-only frontmatter go, and the
  skill dependency becomes a sentence;
- there is no `.mcp.json`: bundling a server badges the plugin "desktop only". Live data
  arrives through the Oak connector the user adds themselves;
- `interface.capabilities` is `[]`, the value that passes OpenAI ingestion.

A repo validator fails the build when a shared copy drifts from its Claude source. The
durable fix is a generator (MCP-342); until then the copy is honest because it is checked.

## Sideload for testing (desktop app)

1. `codex plugin marketplace add <repo root>` — the root `.agents/plugins/marketplace.json`
   lists this package.
2. Add the Oak MCP server in Codex: Plugins → Add → Add MCP server, Streamable HTTP,
   `https://mcp.thenational.academy/mcp`; sign in when prompted.
3. Quit the app from the system tray, reopen, Plugins → Personal → install.
4. Skills are invoked with `$` in the desktop app: `$find-misconceptions photosynthesis Year 9`.

Tool names arrive prefixed and with hyphens as underscores (`mcp__codex_apps__oak_get_threads`
via the connector, `mcp__oak_open_curriculum__get_threads` via a direct entry); the merged
skills say to match by suffix treating `-` and `_` as the same.

## Not done here

Publishing to the Oak workspace or the public directory (MCP-107). The Oak Curriculum Toolkit
already in the workspace ships three skills with the same names; whether this is a separate
ChatGPT listing is a product decision to take before any publish.
