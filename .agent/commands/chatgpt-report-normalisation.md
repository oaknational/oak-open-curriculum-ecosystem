# ChatGPT Report Normalisation

Normalise a ChatGPT or LLM-exported report into source-faithful clean
markdown with durable citation links.

Read and follow `.agent/skills/chatgpt-report-normalisation/SKILL.md`.

## Quick Reference

The full workflow, guardrails, and validation checklist are in the SKILL
file. This command summary covers the critical path:

1. **Inventory** paired copies (`.md`, `.docx`, `.pdf`)
2. **Treat the markdown as structural source** (headings/order/paragraph flow)
   and use DOCX/pandoc only for citation/URL recovery
3. **Inspect** the DOCX via `pandoc report.docx -t gfm` (primary citation
   recovery surface) and `unzip -p report.docx word/_rels/document.xml.rels`
   (often sparse for deep-research exports)
4. **Detect PUA encoding** with `cat -v` or Python `ord()` inspection:
   - U+E200 = citation block start
   - U+E202 = turn-reference separator
   - U+E201 = citation block end
5. **Replace markers positionally** — match each PUA-wrapped `cite` block to
   its position in the pandoc conversion using preceding text context (not
   line-by-line; use full-text with normalised whitespace)
6. **Do not build a marker-to-URL lookup table** — the same `citeturn` string
   maps to different citations at different positions
7. **Strip all PUA characters** and clean double spaces from marker removal
8. **Validate faithfulness** — strip citations from both original and clean
   copy, normalise whitespace, confirm character-identical text
9. **Deliver** as a `*-clean.md` sibling (always; do not overwrite source)

## Output Contract

Mandatory landing zone:

- **Always write a sibling clean copy** (`*-clean.md`)
- **Never overwrite the original markdown source**
- **Only promote to tracked canon when explicitly requested**, and keep the
  source and clean copy for traceability during validation

## What This Is Not

This is a **repair** task, not a rewrite. Do not summarise, paraphrase, or
editorially reshape the content. Copy faithfully, fix structure, restore
links.
