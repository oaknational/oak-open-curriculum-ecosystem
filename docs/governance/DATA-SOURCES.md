---
boundary: B1-Governance
doc_role: register
authority: data-sources-governance
status: proposed
last_reviewed: 2026-06-27
---

# Data Sources

A register of the external **data sources** that Oak's apps surface to users, and
the governance that keeps each one suitable. For each source it records what it is,
when it was adopted, its licence and attribution, where it lives (external origin
and in-repo representation), and the governance that applies:
**suitability-review criteria, last-reviewed date, and removal criteria**. The apps
and services that consume these sources are listed under [Consumers](#consumers).

## Why this register exists

[ADR-157](../architecture/architectural-decisions/157-multi-source-open-education-integration.md)
enumerates the sources, their licensing, and their attribution — but it
deliberately does **not** define how a source's continued suitability is reviewed
or when it should be removed. This register fills that governance gap. It is the
single home for the review and removal policy and for the per-source review dates.

It is also the cross-functional surface (leadership, compliance, education,
product) that the **Oak: Under the Hood** explanation lens points to when a user
asks where the apps' data comes from and how it is governed.

**Volatility firewall.** The explanation lens _points to_ this register; it never
copies the dates or policy into itself. Review dates and review/removal policy live
**here** so they have exactly one home and cannot drift between surfaces.

## Scope

The register covers external **sources** the apps surface to users — the data
behind MCP resources, tools, and prompts, and behind semantic search. It is not a
dependency manifest (that is `package.json`) and not a licence reference (that is
[LICENCE-DATA.md](../../LICENCE-DATA.md) and [ATTRIBUTION.md](../../ATTRIBUTION.md),
which this register links to rather than restates).

Provenance prefixes (owner-ratified 2026-06-04, ADR-157 §Namespace Convention) mark
which source a surface's data comes from: `oakapi-` / `bulk-` (Oak API), `onto-`
(ontology), `eef-` (EEF). The `oaksearch-` prefix marks Oak curriculum content
surfaced via the semantic-search **consumer** (see [Consumers](#consumers)), not a
distinct source.

---

## The sources

### 1. Oak Open Curriculum API

| Field                      | Value                                                                                                                                                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Provenance prefixes**    | `oakapi-` (live endpoints), `bulk-` (bulk export)                                                                                                                                                                                                 |
| **What it provides**       | Lessons, units, threads, sequences, quizzes, transcripts — _what curriculum content exists_. The original and majority source.                                                                                                                    |
| **External origin**        | <https://open-api.thenational.academy/> ([API terms](https://www.thenational.academy/legal/terms-and-conditions-api-version), [docs terms](https://open-api.thenational.academy/docs/about-oaks-api/terms))                                       |
| **In-repo representation** | The curriculum **data is not cached** — it is fetched live and via bulk export. The API's **OpenAPI specification is cached** at `packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json` (types are generated from it per ADR-029). |
| **Adopted**                | Repo inception — the first integrated source.                                                                                                                                                                                                     |
| **Licence**                | Curriculum content: [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/). (Repo source code is MIT — separate.)                                                                             |
| **Attribution**            | "Contains public sector information licensed under the Open Government Licence v3.0." Consult the upstream API terms for any additional requirements.                                                                                             |

### 2. Oak Curriculum Ontology

| Field                      | Value                                                                                                                                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Provenance prefix**      | `onto-`                                                                                                                                                                                                                           |
| **What it provides**       | Oak's NC-aligned knowledge taxonomy (SKOS hierarchy), programme structures, and concept relationships — _how the curriculum is structured_. An Oak-developed representation; not an official DfE National Curriculum publication. |
| **External origin**        | <https://github.com/oaknational/oak-curriculum-ontology> (W3C RDF/OWL/SKOS/SHACL)                                                                                                                                                 |
| **In-repo representation** | Derived typed data at `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`. The upstream `.ttl` files are **not** cached in this repo; changes upstream require re-extraction.                                             |
| **Adopted**                | Per ADR-157 (2026-04-10). _ADR-157 is Proposed, not Accepted — the multi-source surface has not yet shipped end to end; the source itself is live in the apps._                                                                   |
| **Licence**                | Data: [OGL v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/). Code: [MIT](https://opensource.org/licenses/MIT). Primary author: Mark Hodierne (Oak National Academy).                             |
| **Attribution**            | "Contains curriculum structure data derived from the Oak Curriculum Ontology, licensed under the Open Government Licence v3.0."                                                                                                   |

### 3. EEF Teaching and Learning Toolkit

| Field                      | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Provenance prefix**      | `eef-`                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **What it provides**       | 30 evidence-synthesised teaching approaches with impact (months of additional progress), cost ratings (1–5), and evidence-strength ratings (0–5 padlocks) — _what teaching approaches work_.                                                                                                                                                                                                                                                             |
| **External origin**        | <https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit> (published by the Education Endowment Foundation)                                                                                                                                                                                                                                                                                                             |
| **In-repo representation** | A versioned `as const` snapshot at `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`. The snapshot is static and canonical; refreshing it is the single maintenance action.                                                                                                                                                                                                                                                  |
| **Adopted**                | Per ADR-157.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Licence / attribution**  | **Attribution REQUIRED.** When citing EEF data, include: _"Data derived from the EEF Teaching and Learning Toolkit, Education Endowment Foundation (<https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit>). All impact estimates, cost ratings, and evidence strength ratings are sourced from EEF publications. Users should consult the original EEF strand pages for full detail and the most current figures."_ |
| **Credits**                | Original research: Higgins, S., Katsipataki, M., Kokotsaki, D., Coleman, R., Major, L.E., & Coe, R. EEF MCP server prototype: John Roberts (Oak National Academy).                                                                                                                                                                                                                                                                                       |

---

## Consumers

The sources above are surfaced to users by **consumers** — the apps and services
that read the sources and present them. Consumers are not sources; they are listed
here so the register is clear about who uses the governed data.

- **MCP server** — exposes the sources to AI agents via MCP resources, tools, and
  prompts.
- **Semantic search** — provides semantic retrieval over Oak curriculum content
  (the `oaksearch-` surfaces). It is itself **consumed** by the MCP server and by
  agents, so it is both a consumer of a source and a consumed capability — not a
  data source of its own (its data is the Oak Open Curriculum API content).

More consumers may be added over time. Adding a consumer does not change this
register — each new consumer surfaces the same governed sources. Only adding a
_source_ changes the register (see [Adding a source](#adding-a-source)).

## Adding a source

The set of sources will grow. A new source is adopted through this process, so that
every source in the register has cleared the same bar:

1. **Propose** the source and confirm it meets **all** the
   [suitability-review criteria](#suitability-review-criteria) below.
2. **Establish licence and attribution**, and record them in
   [`LICENCE-DATA.md`](../../LICENCE-DATA.md) and
   [`ATTRIBUTION.md`](../../ATTRIBUTION.md).
3. **Add the in-repo representation** (cached data, a cached schema/spec, or derived
   typing) and a **provenance prefix** per ADR-157 §Namespace Convention.
4. **Add a source entry** to this register and a row to the
   [review log](#review-log).
5. **Review and sign-off** — docs-adr-expert review, and organisational sign-off
   on suitability and licensing.

The suitability-review criteria that keep a source suitable are the same bar a new
source must clear to be adopted; the removal criteria are the same bar that retires
one.

---

## Governance policy

> **Status: proposed — pending organisational ratification (2026-06-27).** The
> factual register above is grounded in ADR-157, `LICENCE-DATA.md`, and
> `ATTRIBUTION.md`. The criteria and the review approach below are **new
> governance policy** this register proposes; they are deliberately short and
> simple, each with a one-line rationale grounded in the apps' purpose and Oak's
> four pillars (Independent, Optional, Adaptable, Free). This is **org-level
> policy** — not settled by any one person; it takes effect when the organisation
> ratifies it, and the per-source review dates below are provisional until then.

### Suitability-review criteria

A source is suitable to surface when **all** of these hold:

1. **Openly licensed for reuse** — its data is under an open licence (or explicit
   permission) compatible with the apps' open-education posture.
   _Free pillar: what we surface must stay freely reusable downstream._
2. **Authoritative and attributable** — it has a clear owner/author and a stable
   upstream we can cite.
   _Independent pillar: we are transparent about provenance, and licensing audit
   depends on it._
3. **Serves the apps' purpose** — it answers a question the apps exist to answer
   (what content exists / how the curriculum is structured / what teaching
   approaches work).
   _Scope discipline: a source earns its place by serving evidence-grounded
   curriculum discovery, not by being available._
4. **Accurate and current** — it is maintained, or explicitly versioned and
   snapshotted, so what we surface is not stale or misleading.
   _Adaptable and Optional pillars: teachers act on what we surface, so it must be
   trustworthy enough to adapt or to decline._

### Review and relevance

We make best efforts to ensure each source remains relevant and appropriate for the
apps and their users. In practice a source is reviewed against the criteria above
whenever a triggering change occurs: an **upstream licence change**, a **material
change to the upstream data or its shape**, or a **new consumer** beginning to use
the source.
_Rationale: a source's licence, quality, or appropriateness can change upstream
without notice — a standing best-efforts commitment to relevance and
appropriateness, acting on the events that actually move a source's suitability,
serves users better than a fixed calendar._

### Removal criteria

A source is removed from the apps when **any** of these holds:

1. **Licence lapses or becomes incompatible** — the open licence is withdrawn or
   changes to terms incompatible with the apps' reuse posture.
   _Free pillar is non-negotiable: we cannot surface what we cannot openly reuse._
2. **Upstream is abandoned or unreachable** — it is no longer maintained or
   retrievable and cannot be refreshed.
   _A stale source misleads more than it helps._
3. **No longer serves a purpose** — no consumer uses it and none is planned.
   _Scope discipline: an unused source is maintenance burden, not value._
4. **Quality or trust failure** — it is found materially inaccurate or unsafe to
   surface.
   _Teacher trust and Oak's evidence-informed posture outweigh retention._

Removal follows the repository's standard disposition discipline: conserve the
provenance record, update `LICENCE-DATA.md` / `ATTRIBUTION.md`, and remove the
surface. The criteria above are the trigger; the mechanics are ordinary work.

### Review log

| Source                            | Adopted              | Last reviewed            | Review approach                                           |
| --------------------------------- | -------------------- | ------------------------ | --------------------------------------------------------- |
| Oak Open Curriculum API           | Repo inception       | 2026-06-27 (provisional) | Best efforts + on trigger (licence / data / new consumer) |
| Oak Curriculum Ontology           | 2026-04-10 (ADR-157) | 2026-06-27 (provisional) | Best efforts + on trigger (licence / data / new consumer) |
| EEF Teaching and Learning Toolkit | Per ADR-157          | 2026-06-27 (provisional) | Best efforts + on trigger (licence / data / new consumer) |

_Provisional entries become effective when the organisation ratifies the
governance policy above; the "last reviewed" date then reflects the first ratified
review._
