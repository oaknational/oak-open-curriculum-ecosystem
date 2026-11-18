---
classification: core
description: The owner-held Notion strategy page is strictly read-only and never enters version control. Three fence layers bind — mechanical (validate-notion-fence blocks workspace hosts + hashed page ID), construction (strategy material enters only via owner-added documents), human (CODEOWNERS review).
---

# Notion strategy-page fence

The owner-held Notion strategy page is the stakeholder-facing strategy
layer. It contains sensitive internal Oak information. It is strictly
read-only to agents, and neither its content nor its location may ever
enter version control (owner directive, 2026-07-21: this care is
"enforced rather than simply promised").

The fence has three layers; all three bind, always:

1. **Mechanical** — `validate-notion-fence` (in
   `repo-validators:check`, so pre-commit, pre-push, and CI) blocks
   Notion workspace-page hosts (`app.notion.com`, `notion.so`) from
   every tracked file, and blocks the strategy page's ID via a stored
   SHA-256 — the fence's own config never carries the ID it fences, so
   the ID is caught even with the domain stripped. The public
   developer-docs host (`developers.notion.com`) is deliberately not
   fenced. Content-similarity greps are explicitly NOT the mechanism.
2. **Construction** — strategy-derived material enters the repository
   ONLY via owner-added documents (the owner reads the strategy layer
   and writes what belongs in-repo, e.g.
   `.agent/reports/initial-release-supporting-docs/`). Agents never
   transcribe, summarise, or paraphrase the Notion page into tracked
   content — content invariants cure by construction, not by scanning.
3. **Human** — CODEOWNERS review (`* @jimCresswell`) on every planning
   surface; the owner's eye crosses every change that could carry
   strategy-layer material.

Agents reading the page (read-only, for context) route what they learn
into questions and proposals for the owner, never into tracked text.
