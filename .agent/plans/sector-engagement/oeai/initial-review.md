# OEAI Initial Review

**Reviewed**: 2026-04-29
**Source**: [Open-Education-AI/OEAI](https://github.com/Open-Education-AI/OEAI)
**Snapshot inspected**: `main` at
`a71890128c41a39fb1bbf1e540f7409e3691bb20`
**Review status**: Initial read-only review; not an adoption decision.

## Short Version

OEAI is best understood as a UK education lakehouse accelerator, not a
conventional software product. It offers a strong conceptual architecture:
education use cases, source-system modules, analytical packages, shared
schemas, Microsoft Fabric/Azure infrastructure, and a Power BI MVP report. Its
public positioning is as a not-for-profit Centre of Excellence for UK MATs,
rooted in Microsoft Open Education Analytics and localised for UK K12/MAT
needs.

The repo is promising, but immature as production software. The review
inspected current `main`, 40 commits, 31 notebooks, docs, DBML schemas, Fabric
setup scripts, modules, packages, and report assets. It has no tags/releases,
no CI, no tests, no dependency manifest, and the implementation is
overwhelmingly notebook-based.

## What Is There

The structure is coherent:

- `modules/`: connectors/transforms for Wonde, Arbor, Bromcom, EES, MS Graph,
  Weather, Police, and Renaissance.
- `packages/`: higher-order products such as `MIS_Insight` and
  `Predictive_Attendance`.
- `education-use-cases/`: use-case framing and a template.
- `docs/`: silver/gold DBML schemas and a self-implementation guide.
- `cloud-infrastructure/`: PowerShell setup for Azure/Fabric-style deployment.
- `report/`: Power BI MVP report and semantic model.

The README describes a clear building-block model: cloud infrastructure as
Rock, source modules as Grass, packages as Brick, and education value/use cases
as Diamond.

## Technical Read

The strongest asset is the shared education data model. The silver/gold DBML
schemas and Power BI report give a concrete target shape for MAT analytics:
students, organisations, groups, attendance, behaviour, achievement,
exclusions, assessment, academic-year grouping, calculated fields, and reference
dimensions.

The connector coverage is meaningful. Wonde, Bromcom, and Arbor cover common
UK MIS paths; EES adds national attendance benchmarking; Police, Weather, MS
Graph, and Renaissance show the intended enrichment pattern.

The implementation has field-kit maturity. The notebooks contain broad
exception handling, extensive `print` debugging, dynamic schema logic,
`mergeSchema` / auto-merge patterns, manual casting, and many implicit runtime
assumptions. That is acceptable for an implementation accelerator, but Oak
should not treat it as a robust dependency without wrapping it in validation,
tests, release controls, and security review.

## Main Risks

The biggest engineering risk is reproducibility. There is no `requirements.txt`,
`pyproject.toml`, lockfile, CI, test suite, or notebook execution harness. A MAT
or partner can probably follow the guide with the right Fabric experience, but
the repo does not yet behave like repeatable software.

The biggest security issue found in the review is in
`cloud-infrastructure/OEASetup.ps1`: it contains a hardcoded generated-user
password, `1qaz@WSX3edc`, used to create an `oeai@domain` user. There are also
placeholder credential patterns in notebooks. Some are clearly placeholders,
but the infrastructure script should be treated with care before execution.

The biggest governance gap is that the repo discusses responsible AI and
educational use cases, but the codebase does not yet include the operational
governance artefacts expected around predictive attendance, pupil-level
enrichment, postcode/crime context, bias evaluation, DPIAs, model cards, or
intervention safeguards.

There is also a licensing oddity: the GitHub page displayed GPL-3.0 metadata
during the review, while current cloned `main` contained Apache License 2.0.
History showed GPL was deleted and Apache was created on 2026-04-20. Clarify
this before reuse.

## Strategic Interpretation

For Oak, OEAI is most valuable as a reference architecture and schema/use-case
corpus, not something to import wholesale. The idea of shared MAT data modules
plus packages is strong. The DBML schemas and Power BI semantic model are
especially useful for comparing education-domain entities and analytical
grains.

Oak should be cautious about copying notebook code directly. The patterns are
tightly coupled to Microsoft Fabric/Azure, Key Vault, Spark, OneLake/ADLS-style
paths, and Power BI. The public README mentions broader cloud infrastructure
ambition, but the implemented centre of gravity is Microsoft Fabric/Azure.

## Recommended Next Move

If Oak wants to engage seriously with OEAI:

1. Treat it as a reference, not a dependency.
2. Compare `docs/schema_silver.dbml` and `docs/schema_gold.dbml` against Oak's
   curriculum/search/data models.
3. Ask OEAI to clarify Apache vs GPL, release/version policy, and module
   assurance.
4. Run any technical trial only in a sandbox Fabric workspace with synthetic or
   de-identified data.
5. Validate one module end-to-end, probably Wonde/Bromcom/Arbor into gold
   schema plus the MVP report.
6. Build Oak's own quality wrapper if borrowing patterns: schema contract
   tests, data-quality checks, deterministic transformations, secret handling,
   and CI.

Bottom line: OEAI has a real and useful thesis, and the repo contains
substantial domain work. It is not yet polished infrastructure, but it is a
serious map of how UK MAT analytics could be standardised.
