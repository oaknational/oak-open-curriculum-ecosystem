---
classification: situational
description: "Before creating or changing Notion page content from a repository, resolve the [AI Managed] title designation from live Notion state — own title or an ancestor's; Human Managed and unmarked pages stay fenced: refuse and route to the Director. Append one Change ledger line per change set (date, repository, summary) plus a collapsed Agent traceability toggle carrying agent name, bare session-id prefix, and credentials. The owner strategy page keeps its stricter fence. Failure shapes — pages drifting under shared credentials without provenance; one ledger row per API call instead of per change set."
trigger: tool:notion
---

# Notion Page Edits Update the Page Ledger

**Operationalises:**
[ADR-212](../../docs/architecture/architectural-decisions/212-federated-visibility-authority-and-evidence-boundaries.md)
(federated audience and authority boundary) and
[PDR-113](../practice-core/decision-records/PDR-113-source-intent-from-the-principal-not-the-records.md)
(records project intent rather than originating it).

For every agent-authored Notion page edit, the agent must leave a concise, page-local audit entry.
Its visible line identifies the originating repository; a collapsed traceability toggle directly
beneath it records the full agent and credential chain. This lets a stakeholder distinguish
deliberate repository-driven updates from unexplained page drift without putting operational
identity detail into the main narrative.

## Trigger

An agent is about to create or change content on a Notion page while working from a repository.

## Allowed edit boundary

The owner-authorised edit boundary is the `[AI Managed]` title designation (owner correction,
2026-07-27): a page is agent-editable when its own title carries `[AI Managed]`, or when it sits
beneath a page whose title does. The owner's Notion content architecture organises index pages
into **Human Managed Pages** and **AI Managed Pages** sections; the per-page designation in the
title is the contract, wherever the page sits. Resolve the designation and ancestry from live
Notion state before writing. Do not maintain a list of page IDs; the owner extends or contracts
the boundary by adding or removing the designation, or by moving pages beneath or out from under
a designated page.

Pages designated Human Managed, and unmarked pages with no `[AI Managed]` ancestor, stay fenced:
refuse edits and surface the request to the Director. The designation makes a page eligible for
editing, but does not independently authorise creating a new child page or choosing between a new
page and an inline affordance; route that content-architecture choice to the Director first.
Agent-created pages carry `[AI Managed]` in their titles and default into the relevant index's
**AI Managed Pages** section.

The owner-held strategy page is governed separately by the stricter
[`notion-strategy-page-fence`](./notion-strategy-page-fence.md) (read-only, three layers);
nothing in this boundary loosens it.

## Action

For each agent-authored change set on a page, the agent MUST append exactly one list item to that
same page's `Change ledger` section and one collapsed traceability toggle directly beneath that
item. If the section does not exist, create it. Multiple API calls that implement one coherent page
update are one change set and receive one ledger entry; edits to multiple pages receive one entry
on each page.

Use a single physical line in this form:

```text
- DD Month YYYY — `<repository-name>` — <concise change summary>.
```

The actor is the repository name, not the agent identity. Resolve the basename of the active
repository rather than copying a machine-local path.

Directly beneath the visible line, add a collapsed toggle titled `Agent traceability` containing:

```text
Agent: <agent-name> (<session-id-prefix>)
Operating credentials: <human-account-or-integration-account>
Date: DD Month YYYY
```

`<session-id-prefix>` is the bare wire prefix (the PDR-027 join key), never the rendered
visual-disambiguator token (`<prefix>-<last 3 of id>`): the ledger row is an authored surface, and
a pasted token silently mis-binds the recorded identity (PDR-027, 2026-08-01 amendment).

The toggle belongs to the same ledger entry; it is not a second visible ledger item. Do not report
the Notion edit complete until the content change, its repository line, and the collapsed identity
toggle are all visible on the page.

## Why

Notion is an audience-shaped projection rather than the durable source of intent. A page-local
ledger supplies provenance and freshness without making Notion authoritative. Repository-name
attribution keeps the visible narrative audience-appropriate, while the collapsed toggle preserves
the complete authorship and credential chain for audit and source-level queries.

## Failure mode prevented

Without the ledger entry, agent-authored stakeholder pages change under shared credentials with no
reliable provenance. A repository-only line cannot answer which agent acted through which account;
an identity-only line clutters the stakeholder narrative and hides the delivery estate. Without
exactly-one-per-change-set discipline, retries and multi-call edits produce either missing history
or noisy implementation-call logs rather than a human audit trail.
