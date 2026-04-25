# Markdown Code Blocks Must Have Language

Operationalises [ADR-121 (Quality Gate Surfaces)](../../docs/architecture/architectural-decisions/121-quality-gate-surfaces.md),
[ADR-125 (Agent Artefact Portability)](../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md),
and [ADR-127 (Documentation as Foundational Infrastructure)](../../docs/architecture/architectural-decisions/127-documentation-as-foundational-infrastructure.md).

## Rule

Every fenced Markdown code block in repo-authored Markdown or
Markdown-like instruction files MUST declare an info string on the
opening fence. Use the real language or data format where it is known;
use `text` when the block is prose, command output, a diagram made of
plain characters, pseudocode, or otherwise intentionally unhighlighted.

The rule applies to `.md`, `.mdc`, agent rules, skills, commands,
plans, ADRs, runbooks, PR text stored in the repo, and generated
project instructions when they are committed or handed to another
agent as durable Markdown.

Correct shape:

````markdown
```bash
pnpm markdownlint-check:root
```

```json
{ "MD040": true }
```

```text
Plain output, ASCII diagrams, transcripts, or unknown formats.
```
````

## Forbidden

- Opening a fenced block with a bare fence.
- Using whitespace-only info strings.
- Removing fences or moving content inline to dodge MD040.
- Preserving unlanguaged fences from copied source material inside a
  linted project document. Add the nearest true language, or `text`.
- Using a misleading language just to get highlighting. If the syntax
  is not actually that language, use `text`.

## Required Follow Guidance

When adding or editing a fenced block:

1. Choose the most specific accurate language label (`ts`, `tsx`,
   `bash`, `json`, `yaml`, `toml`, `markdown`, and so on).
2. If no accurate syntax label is useful, write `text`.
3. If a tool or platform proposes an unlanguaged fence, fix it before
   committing, copying into a durable artefact, or handing it to
   another agent.
4. When touching a Markdown file with existing bare fences, fix the
   touched file's bare fences unless the owner has explicitly scoped
   the edit away from that content.

## Enforcement

- Markdownlint MD040 is enabled explicitly in `.markdownlint.json`.
- `pnpm markdownlint-check:root` and `pnpm markdownlint:root` are the
  project gates for this rule.
- Platform adapters must remain thin pointers back to this canonical
  rule so the behaviour stays platform-agnostic.

## Why

Unlabelled fences create inconsistent rendering, weak copy-paste
signals, and avoidable markdownlint failures. More importantly, soft
guidance without a gate loses to artefact gravity: agents copy the
shape they see. The durable shape is therefore canonical rule plus
thin platform adapters plus MD040 at the quality boundary.
