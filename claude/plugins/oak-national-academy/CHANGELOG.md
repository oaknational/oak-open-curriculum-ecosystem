# Changelog

Versions are the plugin manifest version. The Claude Code plugin and the
ChatGPT/Codex package are cut from the same source at the same version.
Each entry is dated when it is written; oaknational/oak-ai-plugins records
the oak-open-curriculum-ecosystem release that shipped it.

## 0.1.7 — 2026-10-09

- The ChatGPT/Codex package declares the Oak National Academy MCP connection
  in `.mcp.json`, referenced by its plugin manifest. The server identifier is
  `oak-national-academy` and its URL is `https://mcp.thenational.academy/mcp`.
- Packaging guidance follows OpenAI's current complete-plugin ZIP submission
  format and describes authentication and imported-package desktop restrictions.
- Removes the ChatGPT/Codex package configuration test suite. Functional
  verification targets successful authenticated curriculum retrieval.

## 0.1.6 — 2026-10-01

- The Claude plugin README says who the plugin is for and the DfE standards it
  is designed in line with, warns against entering pupil data, and links
  Anthropic's privacy policy alongside Oak's.

## 0.1.5 — 2026-09-30

- The Claude plugin gains support, documentation and terms of service links
  for its directory listing.
- New listing text: a one-line description, and a README that describes Oak
  and what the plugin draws on.
- The Claude plugin names oaknational/oak-ai-plugins as its repository: the
  public copy the directory lists, rather than oak-open-curriculum-ecosystem.

## 0.1.4 — 2026-09-30 (repo release v1.185.4)

- The Claude plugin and the ChatGPT/Codex package are renamed from
  `oak-open-curriculum` to `oak-national-academy`, to match the display name.
  The full form of a command is now `/oak-national-academy:<skill>`. Claude
  Code moves existing installs to the new name.
- The MCP server is now named `oak-national-academy`. It is the same server at
  the same address, but Claude identifies it by the plugin and server names, so
  it asks you to sign in again and to approve each tool again the first time it
  is used.

## 0.1.3 — 2026-09-28 (repo release v1.185.3)

- Claude plugin: adds an icon, a privacy policy link and a README, which the
  Claude plugin directory asks for.
- oak-curriculum-principles: the hexagon diagram's path is a Markdown link,
  not code, so the directory does not hold the plugin for a reviewer.

## 0.1.2 — 2026-09-17 (repo release v1.182.0)

- Adds the ChatGPT/Codex package: the same skills, with the two workflows
  packaged as skills.
- oak-accessibility: transcripts recommended, not required, at WCAG AA.
- MCP-enabled skill and agents: tool names may arrive with underscores in
  place of hyphens.
- oak-curriculum-principles: three passages matched to oak-skills' approved
  wording.
- find-misconceptions: keeps the order the tool returns.

## 0.1.1 — 2026-09-07

- audit-sequence: checks same-year order now the tool serves it; reads
  prior-knowledge statements as what a unit assumes, not a dependency graph.

## 0.1.0 — 2026-08-07

- First release: three skills, two workflows, two agents, and the Oak
  Curriculum MCP binding.
