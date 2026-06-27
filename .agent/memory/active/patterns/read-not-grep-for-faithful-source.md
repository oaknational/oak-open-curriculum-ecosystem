---
name: "Read, Not Grep/Bash, for a Faithful Read of Source"
polarity: pattern
use_this_when: "Reading load-bearing source content through a Bash/grep pipeline and the output looks mangled, masked, or suspiciously collapsed."
category: process
proven_in: "2026-06-23 (Blazar) — greps returned bodies with tokens collapsed (user-search→n, examBoard); the Read tool rendered the same files faithfully"
proven_date: 2026-06-23
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Reasoning over substring-filtered or mangled Bash/grep output of source as if it were the faithful text, and drawing wrong conclusions from collapsed tokens."
  stable: true
---

> **POLARITY: PATTERN.** Bash/grep output of source can be
> substring-filtered or token-collapsed by the harness; the Read tool is
> faithful.

## The shape

Several greps once returned source bodies with tokens collapsed
(`user-search` → `n`, `examBoard` dropped); the Read tool rendered the
same files correctly. When grep/Bash output of source looks mangled,
masked, or suspiciously collapsed, **switch to Read for the load-bearing
read** — do not reason over the filtered text.

## The cure

Use Read for any source content a decision rests on; reserve grep/Bash
for locating, not for the authoritative content read. Sibling:
[`verify-dont-trust`](../../../rules/verify-dont-trust.md),
[`feedback_credential_file_tool_choice`].
