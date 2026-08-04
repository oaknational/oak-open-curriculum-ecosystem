---
title: 'Method and source boundary for the n8n comparative scan'
type: research-method
status: active
stage: 'Established before detailed source analysis'
date: 2026-08-04
audience: 'Authors and reviewers of the comparative research and resulting Practice synthesis'
subject: 'How to learn from observable concepts and arrangements without copying, adapting, redistributing, or reconstructing n8n software'
related:
  - README.md
  - https://github.com/n8n-io/n8n/blob/master/LICENSE.md
---

# Method and source boundary

## Status and purpose

This document defines the research boundary before detailed analysis. It is a methodological and
ethical safeguard, not legal advice.

The aim is to produce original analysis of the Practice. n8n is a comparative observation source,
not a template, implementation specification, dependency, or proposed architecture.

## Licence facts that govern the scan

The repository's current licence file states that:

- only content on the `master` branch falls within the stated source licence;
- files with `.ee.` in the filename or `.ee` in a directory name are excluded from the Sustainable
  Use License and require an Enterprise licence;
- incorporated third-party components retain their original licences;
- the remaining covered software is made available under the Sustainable Use License, subject to
  its limitations.

Source: <https://github.com/n8n-io/n8n/blob/master/LICENSE.md>

The scan therefore:

1. reads only the public `master` branch;
2. excludes every `.ee` directory and `.ee.` file;
3. does not treat third-party components as evidence of n8n's original design unless n8n's own
   arrangement of the component is independently observable at a high level;
4. does not reproduce or redistribute covered software;
5. does not infer permission beyond the licence text.

## Material the research may use

The source-facing companion may record:

- repository and package names;
- paths and direct links;
- public architectural descriptions;
- declared responsibility boundaries;
- dependency and workspace relationships;
- the existence of registries, adapters, checks, commands, state classes, event families, and
  lifecycle stages;
- high-level observations about where authority, state, execution, and feedback appear to move;
- commit and pull-request history used to distinguish current intent from residue;
- independently drawn abstractions and diagrams that describe general relationships rather than
  n8n implementation.

## Material the research must not contain

Neither the companion nor the Practice-facing report may contain:

- copied source code;
- adapted source code or pseudocode shadowing a source implementation;
- copied schemas, interfaces, prompts, skills, tests, configuration, or algorithms;
- reproduced upstream diagrams or visual arrangements;
- substantial quotations from source comments or documentation;
- a package-by-package reconstruction guide;
- instructions sufficient to recreate an n8n subsystem;
- an architecture organised as a renamed mirror of n8n's package topology;
- Enterprise Edition source observations;
- third-party source presented as n8n's work.

Direct links are preferred over embedded source material. Exact quotations are avoided unless a
short phrase is indispensable for proving explicit intent; any such quotation must be minimal and
clearly attributed.

## Transformation pipeline

Every source observation passes through the following separation before it can appear in the main
report:

```text
observable source fact
    → underlying pressure or function
    → abstract relationship across scales
    → independent inspection of the Practice
    → Practice-native proposition
    → outcome direction, uncertainty, and falsifier
```

The main report begins at the **independent inspection of the Practice** step. It does not narrate
n8n's source structure.

### Example of an allowed transformation

Source-facing observation:

> A definition-only telemetry registry is separate from its transports and can emit both a human
> catalogue and structured output.

Abstract function:

> One semantic event definition can govern discovery, validation, instrumentation, and multiple
> transport implementations without allowing a vendor sink to own the event model.

Practice-facing question:

> Does the Practice's telemetry-and-understanding system have one canonical semantic event model
> from which instrumentation contracts, catalogues, quality checks, and evidence projections are
> derived, or are those definitions fragmented across plans and sinks?

Practice-native proposition, only if the independent OCE evidence supports it:

> Establish a transport-independent evidence vocabulary whose generated projections serve agents,
> humans, instrumentation, and validation.

The final proposition neither copies the source expression nor depends on n8n terminology.

## Evidence classes

Every observation is labelled as one of:

| Class | Meaning |
| --- | --- |
| **Explicit** | A public source document states the responsibility or design intention directly. |
| **Structural** | Multiple source relationships strongly imply the arrangement, but the intention is not stated. |
| **Historical** | Commit, migration, compatibility, or deprecation evidence explains how the current shape arose. |
| **Contextual** | The arrangement is likely driven by n8n-specific product, ecosystem, deployment, commercial, or compatibility obligations. |
| **Contradictory** | Source surfaces disagree or reveal a tension that must be preserved rather than smoothed away. |
| **Uncertain** | The evidence is insufficient to support a stable interpretation. |

Explicit description is not automatically stronger evidence of effectiveness. Structural
arrangements and observed feedback may contradict stated intent.

## Comparative diagnosis classes

The Practice is assessed independently for each pressure and capability:

- absent;
- nascent;
- fragmented;
- underpowered;
- well matched;
- overdeveloped;
- misplaced;
- counterproductive;
- valuable and distinct;
- not yet knowable.

A single finding may receive several diagnoses at different scales. For example, a vocabulary may
be absent at Practice Core scale, duplicated at repository scale, and over-centralised at an
external coordination scale.

## Outcome directions

The synthesis permits subtractive and non-adoptive outcomes with the same status as additions:

- introduce;
- strengthen;
- connect;
- relocate;
- simplify;
- constrain;
- reduce;
- stop;
- preserve;
- refuse;
- investigate.

## Source-independent report contract

The final Practice-facing report must:

1. be understandable without prior knowledge of n8n;
2. organise findings by systemic function, scale, and interaction — never by upstream package;
3. use Practice vocabulary and cite OCE evidence directly;
4. keep source provenance in the companion and traceability register;
5. distinguish observation, inference, diagnosis, proposal, and decision;
6. state when n8n's obligations differ from the Practice's;
7. include reasons to preserve or refuse, not only opportunities to add;
8. include falsifiers and evidence requirements before action;
9. avoid claiming originality for general ideas when the comparative source materially prompted
   them;
10. state that no n8n software is included, redistributed, or required.

## Attribution and non-affiliation

The research companion will identify n8n and link directly to the public source locations used as
evidence. The final research estate will state that:

- n8n and associated marks belong to their respective owner;
- the work is independent and is not affiliated with or endorsed by n8n;
- no n8n software is included;
- the report does not grant or interpret permission to use n8n software;
- readers considering software use must consult the current upstream licence themselves.

## Review gate

Before promotion of the final report, perform a dedicated source-boundary review:

- search the complete diff for copied code-shaped passages;
- inspect every upstream quotation;
- check that every `.ee` path is absent;
- check that diagrams are original abstractions;
- check that the main report stands without upstream package vocabulary;
- check that direct links resolve to `master` or stable commit references;
- check that source observations remain in the companion rather than leaking into proposed
  implementation detail.
