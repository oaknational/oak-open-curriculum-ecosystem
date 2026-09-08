# Oak Open Curriculum — ChatGPT and Codex package

This directory is the ChatGPT/Codex packaging of the Claude plugin in `../oak-open-curriculum/`.
It is a **checked-in copy**, not a build output. The Claude plugin is the source: a correction to
a shared skill lands there first and is re-copied here, never the other way round.

## Why a separate package

ChatGPT and Codex read a plugin's `skills/` directory and nothing else. The Claude plugin keeps
its two capabilities in `agents/`, reached through workflows that use `$ARGUMENTS` substitution;
neither exists in ChatGPT. So here:

- every skill present in both plugins is a byte-identical copy of the Claude one (`evals/`
  excluded); the validator discovers that set from the two trees rather than keeping a list;
- `audit-sequence` and `find-misconceptions` are each workflow + agent merged into one
  self-contained skill, with three edits: the argument line becomes "the plan/topic the user
  has shared; ask if missing", the delegation line and Claude-only frontmatter go, and the
  skill dependency becomes a sentence;
- there is no `.mcp.json`: bundling a server badged the plugin "desktop only" (observed in
  the desktop app, 2026-09-07). Live data arrives through the Oak connector the user adds;
- `interface.capabilities` is `[]`, the value the OpenAI sideload accepted on 2026-09-07.

Both properties, and the agreement of the two manifests, are recomputed by
`agent-tools/tests/skills/chatgpt-plugin-package-invariants.integration.test.ts`.

A repo validator fails the build when a shared copy drifts from its Claude source, and an
integration test (`chatgpt-merged-skill-derivation.integration.test.ts`) fails it when either
merged skill and its Claude agent stop matching from the first heading onward, in either
direction. The durable fix is a generator (MCP-342); until then the copies are honest because
they are checked.

## Sideload for testing (desktop app)

1. `codex plugin marketplace add <repo root>` — the root `.agents/plugins/marketplace.json`
   lists this package.
2. Add the Oak MCP server in Codex: Plugins → Add → Add MCP server, Streamable HTTP,
   `https://mcp.thenational.academy/mcp`; sign in when prompted.
3. Quit the app from the system tray, reopen, Plugins → Personal → install.
4. Skills are invoked with `$` in the desktop app: `$find-misconceptions photosynthesis Year 9`.

Tool names arrived prefixed and with hyphens as underscores (`mcp__codex_apps__oak_<tool>`
via the connector, `mcp__<server key>__<tool>` via a direct entry; observed 2026-09-07), so
the merged skills say to match by suffix treating `-` and `_` as the same.

## Not done here

Publishing to the Oak workspace or the public directory (MCP-107). The Oak Curriculum Toolkit
already in the workspace ships three skills with the same names; whether this is a separate
ChatGPT listing is a product decision to take before any publish.
