# ChatGPT Report Normalisation

Normalise a ChatGPT or LLM-exported report into source-faithful clean
markdown with durable citation links.

Read and follow `.agent/skills/chatgpt-report-normalisation/SKILL.md`.

## Quick Reference

The full workflow, guardrails, and validation checklist are in the SKILL
file. This command summary covers the critical path:

1. **Inventory** paired copies (`.md`, `.docx`, `.pdf`)
2. **Inspect** the DOCX via `pandoc report.docx -t gfm` (primary citation
   recovery surface) and `unzip -p report.docx word/_rels/document.xml.rels`
   (often sparse for deep-research exports)
3. **Detect PUA encoding** with `cat -v` or Python `ord()` inspection:
   - U+E200 = citation block start
   - U+E202 = turn-reference separator
   - U+E201 = citation block end
4. **Replace markers positionally** — match each PUA-wrapped `cite` block to
   its position in the pandoc conversion using preceding text context (not
   line-by-line; use full-text with normalised whitespace)
5. **Do not build a marker-to-URL lookup table** — the same `citeturn` string
   maps to different citations at different positions
6. **Strip all PUA characters** and clean double spaces from marker removal
7. **Validate faithfulness** — strip citations from both original and clean
   copy, normalise whitespace, confirm character-identical text
8. **Deliver** as a `-clean.md` sibling (or as directed)

## Output Contract

Agree the landing zone before editing:
- **Sibling clean copy** (`*-clean.md`) when originals must remain intact
- **In-place repair** when overwriting is acceptable
- **Promotion to tracked canon** only when explicitly requested

## What This Is Not

This is a **repair** task, not a rewrite. Do not summarise, paraphrase, or
editorially reshape the content. Copy faithfully, fix structure, restore
links.
