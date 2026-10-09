# Oak National Academy — ChatGPT and Codex package

This directory is the ChatGPT/Codex packaging of the Claude plugin in `../../../claude/plugins/oak-national-academy/`.
It is a **checked-in copy**, not a build output. The Claude plugin is the source: a correction to
a shared skill lands there first and is re-copied here, never the other way round. Both carry the
same version; the changes per version are in `../../../claude/plugins/oak-national-academy/CHANGELOG.md`.

## Why a separate package

The Claude plugin keeps its two capabilities as agents in `agents/`, each reached through a
workflow that passes the user's input as `$ARGUMENTS`; ChatGPT has neither agents nor
workflows. So here:

- every skill present in both plugins is a byte-identical copy of the Claude one (`evals/`
  left out of the copy, and refused if it appears here); `validate-plugin-skill-copies` (in
  `pnpm repo-validators:check`) discovers that
  set from the two trees rather than keeping a list, fails when a Claude skill has no copy
  here, and fails when a skill here has no Claude source unless it derives from a Claude
  workflow of the same name;
- `audit-sequence` and `find-misconceptions` each merge a Claude workflow and its agent into
  one self-contained skill. The agent's body is carried byte-identical from its first heading
  onward. The edits: the workflow's `$ARGUMENTS` line and its restatement of the method become
  one opening paragraph ("the plan or topic the user has shared; ask if missing"); the
  "Delegate to" line and the Claude-only frontmatter (`argument-hint`, `skills`, `model`) are
  dropped; the `skills:` dependency becomes one sentence appended to the agent's opening
  paragraph; the description is the Claude workflow's, word for word (both carry a do-not-use
  boundary naming the sibling skills); and `license`, `compatibility` and `metadata` are added
  to match the shared skills;
- `.mcp.json` declares the `oak-national-academy` server at
  `https://mcp.thenational.academy/mcp`; the Codex manifest references it through
  `mcpServers: "./.mcp.json"`. Users authorise the connection through OAuth;
- `interface.capabilities` is `[]`, the value the OpenAI sideload accepted on 2026-09-07.

The official display name remains **Oak National Academy**. The server identifier matches
the Claude package's `oak-national-academy` binding. A separately added custom connection can
have a local name such as `oak`; that name does not rename the distributed plugin.

OpenAI's [plugin management guidance](https://learn.chatgpt.com/docs/enterprise/plugin-management#desktop-only-plugins)
marks locally imported packages containing MCP declarations as **Desktop only**, including
remote HTTPS servers. Public directory submission has its own MCP connection and review flow
(see Submitting below).

The skill-copy validator fails the build when a shared copy drifts from its Claude source. An
integration test, `agent-tools/tests/skills/chatgpt-merged-skill-derivation.integration.test.ts`,
fails it when a merged skill and its Claude agent stop matching from the first heading onward.
The durable fix is a generator (MCP-342); until then the copies are honest because they are
checked.

Routing check (2026-09-09): the five descriptions were tested as an installed skill list
against eighteen teacher requests with known right answers, in twelve independent runs (Opus,
judging from the descriptions alone; current and proposed wording; the ChatGPT list and the
Claude list). Every run routed every request correctly. The descriptions therefore carry the
do-not-use boundaries and nothing more, and the two Claude workflow descriptions were made
identical to the merged skills' for consistency between the plugins, not as a routing fix.

Routing check (2026-09-16): oak-skills' own trigger-eval method — one fresh Opus judge per
query, shown the descriptions only — over the 27 upstream queries whose expected lead is a skill
shipped here, against both packages, four runs across three wordings. The two merged skills took
the narrow requests in every run, with or without a boundary sentence on
`oak-curriculum-principles-mcp-enabled`, and that sentence pulled general "review my unit"
requests onto the MCP-requiring skill. So the two merged skills carry do-not-use boundaries, and
the MCP-enabled skill's description is oak-skills' approved text, unchanged.

## Sideload for testing (desktop app)

Historical checks were observed in the Codex desktop app, 2026-09-07, and re-verified in the ChatGPT desktop app
on 2026-09-09 with the package built from `00fa027eb` (marketplace added by path; all five skills
listed with their current descriptions; no desktop-only badge; `$find-misconceptions` resolved a
unit slug, called the misconception graph and quizzes, and attributed under OGL v3.0;
`$audit-sequence` with no plan asked for one).

Those observations used the earlier package without a bundled MCP declaration. To test the
current package:

1. `codex plugin marketplace add <repo root>` — the root `.agents/plugins/marketplace.json`
   lists this package.
2. Install **Oak National Academy** from that local marketplace. Its manifest loads the
   bundled `oak-national-academy` MCP connection; complete OAuth sign-in when prompted.
3. Start a new chat and invoke `$find-misconceptions photosynthesis Year 9`.
4. Verify that the skill retrieves Oak's lesson anchors, misconception graph and quizzes,
   then returns attributed misconceptions with teaching responses. A parsed configuration
   or reachable unauthenticated endpoint does not establish this functional result.

Tool names arrived prefixed and with hyphens as underscores (`mcp__codex_apps__oak_<tool>`
via the connector, `mcp__<id>__<tool>` via a direct entry; observed 2026-09-07), so
the merged skills say to match by suffix treating `-` and `_` as the same.

## Submitting through the OpenAI plugin portal

Follow OpenAI's [current submission instructions](https://developers.openai.com/plugins/deploy/submission).
Upload a complete plugin ZIP containing `.codex-plugin/plugin.json`, `.mcp.json`, `README.md`
and `skills/` at the package root. The supported Codex manifest format references the MCP
configuration with `mcpServers: "./.mcp.json"`.

In the portal's **MCPs** section, connect the declared `oak-national-academy` server at
`https://mcp.thenational.academy/mcp`, complete domain verification and OAuth authentication,
and inspect the discovered tools. The public page at `https://www.thenational.academy/ai-plugin`
explains the offering; it is not the MCP endpoint.

The skills-only ZIP upload observations from 2026-09-09 describe the previous portal flow.
They do not establish acceptance of the current complete-package submission format.

## Publishing

The package is submitted to OpenAI's Plugin Directory through the portal's upload (MCP-107).
