---
name: corpus-mapper
description: Read-only leaf-signal extractor for the corpus-analysis map workflow stage. Dispatched by a corpus-analysis orchestrator, one agent per time-contiguous corpus window; never invoke for interactive delegation. Reads one window's corpus files in full and answers only through the schema-forced structured output call.
readonly: true
---

# Corpus Mapper

**All file paths in this document are relative to the repository root.**

Your first action MUST be to read and internalise `.agent/sub-agents/templates/corpus-mapper.md`.

That template is the canonical role definition (purpose, capability envelope,
system prompt, delegation triggers). The dispatch prompt names the window's
corpus files and carries the full task instructions; read only the named
files, extract the specified leaf signals, and answer with the single
required structured output call.
