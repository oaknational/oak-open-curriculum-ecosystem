---
id: H001
status: testing
confidence: low
evidence_snapshot: OWA 510ac63; OCE bd878a3
last_updated: 2026-07-19
---

# H001: Capability-owned modules

## Claim

**Hypothesis:** Organising parts of the Innovation Kit around enduring product capabilities, with explicit relationships to shared domain authority and framework responsibilities, will make Oak behaviour more coherent and traceable than the current OWA mixture of technical and audience folders.

This does not imply that every capability is independently deployable or that shared domain concepts should be duplicated.

## Why it is plausible

**Observed:** A representative teacher programme route coordinates code from route-local components, `pages-helpers`, general utilities, domain components, URL configuration, CMS and curriculum adapters ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/page.tsx#L1-L38)).

**Observed:** OWA's component taxonomy mixes technical scope (`SharedComponents`, `AppComponents`), audience (`TeacherComponents`, `PupilComponents`) and content domain (`CurriculumComponents`) ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/introduction.mdx#L10-L42)).

**Inferred:** A change to one user outcome can require navigating several ownership models before its full behavior is visible.

## Predictions

If the hypothesis is useful:

1. Representative changes can be explained mostly within one capability plus explicit shared contracts.
2. Route files become adapters rather than the principal owner of orchestration policy.
3. A new engineer can trace a user outcome with fewer unrelated branches and less repository-wide knowledge.
4. The same capability can support web, Classroom or future entry surfaces without copying its domain decisions.
5. Cross-capability dependencies form a small, directed graph rather than cycles between UI and data folders.

## Invalidators and weakening evidence

Reject or materially narrow this hypothesis if:

- representative outcomes require cyclic dependencies or routine edits across peer capability modules rather than explicit shared authority;
- change history shows that curriculum, interaction or another domain is the more stable semantic boundary than the proposed product capabilities;
- a vertical-slice prototype duplicates any authoritative curriculum validation, grading, rights or interaction rule instead of reusing it through one explicit contract;
- unfamiliar engineers cannot trace the complete outcome more accurately through the proposed structure;
- the ownership map shows that the proposed boundary separates responsibilities that must be reasoned about and changed together;
- premise analysis shows that several proposed capabilities are compensating for one underlying system decision and should collapse into a different model.

## Most direct discriminating work

1. Trace teacher download, pupil completion, saved content and Classroom submission end to end.
2. Sample recent commits for each journey and record the files, top-level areas and reasons changed.
3. Sketch competing module boundaries: audience capability, curriculum domain and workflow/use-case.
4. Produce a premise record for one candidate capability and test whether changing its surrounding data or service model removes current boundaries.
5. Compare trace accuracy and conceptual completeness across the competing structures.

## Decision affected

Whether OCE product verticals, Innovation Kit examples and teaching workspaces should be organised primarily by product capability, domain layer or technical layer.

## Evidence history

- **2026-07-19:** Proposed from initial static system and component mapping.
- **2026-07-19:** Teacher and account traces plus a 20-PR history sample found outcome changes crossing horizontal folders and service layers. Compact editorial changes and shared curriculum policy weaken a universal package-per-capability interpretation.
- **2026-07-19:** Pupil trace identified one coherent lesson-session model across canonical, browse, shared and Classroom entries, while also showing that curriculum, media, identity, analytics and Classroom are genuine shared capabilities. H001 is being tested as outcome ownership with ports, not an audience silo.
- **2026-07-19:** Classroom trace supports reusing the pupil-learning capability behind a Google entry/provider profile. It weakens a single self-contained Classroom module because Google integration is independently packaged and the educational behavior is shared.
- **2026-07-19:** Editorial and curriculum-export traces identify coherent publication outcomes, but shared CMS, document and platform services plus compact editorial changes remain counterevidence to package-per-page or package-per-capability interpretations.
- **2026-07-19:** Production topology shows that capability ownership need not imply independent deployment: identity, cache, release and observability remain shared across one OWA unit.
