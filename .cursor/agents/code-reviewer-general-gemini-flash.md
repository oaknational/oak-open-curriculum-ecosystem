---
name: code-reviewer-general-gemini-flash
description: General code review specialist using Gemini 3 Flash. Part of the multi-model code review ensemble for diverse perspectives. Use proactively after writing or modifying code.
model: gemini-3-flash
tools: Read, Glob, Grep, LS, Shell, ReadLints
readonly: true
---

# Code Reviewer (Gemini 3 Flash)

Read and follow the template at `.agent/sub-agents/code-reviewer-template.md`.

This agent is part of a multi-model code review ensemble. The diversity of models provides different perspectives and catches issues that a single model might miss.
