---
boundary: B1-Governance
doc_role: index
authority: model-behaviour-content-navigation
status: active
last_reviewed: 2026-08-06
---

# Model-behaviour content — the review workspace

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

This is every piece of writing this repository puts in front of an AI agent, in one place, in plain view. It exists so that the people best placed to judge that writing — education, curriculum, legal, safety, and accessibility experts — can read and challenge it without reading any code.

## What is in here

**728 items** of content, every one of them listed. 684 are shown with the wording the system uses today, read straight from the code. 44 have been retired since the audit and are listed with their last known wording so nothing vanishes silently. Anything this pass could not render from current source is named in [unrendered items](./unrendered.md) — the list is never quietly shortened.

Whether an agent can actually see an item is derived, not declared: see [what an agent sees today](./served-surface.md).

## How to review

1. **Open the view for your area** from the table below. You do not need to read any other view.
2. **Read each item.** Every item shows the words themselves, what they are for, whether an agent can currently see them, and which file they live in.
3. **Check the words against your expertise** — is this accurate, safe, fair, legally sound, and does it say what we want an agent to do?
4. **Raise anything that is wrong.** Each item names the repository that owns its words. For items owned in this repository, an engineer can change the named file. For items owned elsewhere, the change has to be raised in that repository.

You do not need to read any code to do this. If an item makes no sense without its surroundings, that is itself a finding worth raising.

## The review views

| Review view | Items | Ours to change | Owned elsewhere | What it covers |
| --- | ---: | ---: | ---: | --- |
| [pedagogy](./domains/pedagogy.md) | 99 | 97 | 2 | Prompts, orientation, and curriculum-model doctrine — how the content teaches an agent to teach. Reviewed by Oak education experts. |
| [curriculum-accuracy](./domains/curriculum-accuracy.md) | 27 | 27 | 0 | The authored conceptual model — ontology, domain concepts, subject and key-stage vocabulary. Reviewed by Oak curriculum experts. |
| [pedagogy-external](./domains/pedagogy-external.md) | 8 | 0 | 8 | External EEF Teaching and Learning Toolkit material carrying Oak editorial framing. The corpus is cited, not rewritten; the framing around it is ours to review. |
| [legal-licensing](./domains/legal-licensing.md) | 20 | 17 | 3 | Attribution, Open Government Licence v3.0 notices, trademark, and EEF citation obligations. |
| [ux-accessibility](./domains/ux-accessibility.md) | 16 | 16 | 0 | Human-facing surfaces — the landing page, the widget, and authorisation and consent copy. WCAG 2.2 AA applies. |
| [tool-usability](./domains/tool-usability.md) | 304 | 194 | 110 | How an agent discovers and uses the tools — titles, descriptions, parameter descriptions, and the orientation directives that steer a first call. |
| [recovery-copy](./domains/recovery-copy.md) | 151 | 151 | 0 | What an agent receives when something fails or returns nothing — validation, empty-state, and degradation messages. This copy shapes whether an agent recovers or fabricates. |
| [engineering-structural](./domains/engineering-structural.md) | 93 | 89 | 4 | Annotations, schemas, authorisation scopes, and discovery or branding metadata. |
| [other](./domains/other.md) | 2 | 2 | 0 | Items whose review domain is mixed or uncategorised. |
| [owner-signed-copy](./domains/owner-signed-copy.md) | 1 | 1 | 0 | Copy carrying an explicit owner sign-off, held apart so a change to it is never routine. |
| [resource-metadata-and-routing](./domains/resource-metadata-and-routing.md) | 7 | 7 | 0 | How each guidance document announces itself — its name, address, audience, and freshness — which decides when an agent reaches for it. |

## What counts as content here

In scope: everything this repository controls that reaches an AI agent and can shape how it behaves — the instructions the server sends on connection, every tool and parameter description, guidance documents, error and empty-state messages, attribution, and the human-facing landing and consent copy.

Not in scope: the curriculum data itself — lesson, quiz, and unit content fetched from the Oak Open Curriculum API. Those are the bytes we pass through, not words we author. Where we wrap that data in a sentence of our own, the sentence is in scope and the data is not.

116 items are served by this system but authored in the Oak Open Curriculum API specification. They are listed in full, marked as owned elsewhere, so the review is complete even where the fix is not local.

## Where this comes from

This workspace is generated from the content registry recorded in the [MCP agent-facing content audit](../../../.agent/reports/mcp-agent-facing-content-audit/report.md), which is the audit that found and classified every item. The registry holds what each item is; the current-source projection holds where it lives now and whether it is served; the wording is read from the code itself at each item's verified anchor.

To rebuild it after a content change:

```bash
pnpm --filter @oaknational/agent-tools build-mcp-content-workspace
```

The same script run with `--check` fails when these pages have drifted from the registry, so a stale workspace cannot merge unnoticed.
