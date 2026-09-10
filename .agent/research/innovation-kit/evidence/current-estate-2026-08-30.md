# Innovation Kit current-estate evidence — 2026-08-30

- **Status:** dated, source-bounded research evidence
- **Evidence pin:** PR 25 head [`4915fe1826372d9b0b6ee18322500c811128f41c`](https://github.com/EngraphCode/oak-open-curriculum-ecosystem/commit/4915fe1826372d9b0b6ee18322500c811128f41c)
- **Owns:** what the inspected repository demonstrates, partially demonstrates, proposes, lacks or
  leaves unknown at the pin
- **Does not own:** the target definition, implementation priorities, providers or live production
  claims

## Reading the evidence

OCE contains substantial reusable ingredients, but there is no runtime Innovation Kit workspace,
composition declaration, profile system or end-to-end creation/elevation path. Current demos are
substantial consumers of read-oriented capability; they do not yet exercise the complete path for
authoritative application state or sustained multi-user service.

This snapshot uses two independent ideas:

1. **Implementation evidence:** demonstrated, partial, proposed, absent or unknown.
2. **Reach and placement:** reusable, specialised, app-specific, externally operated or not yet a
   Kit capability, stated in each row.

| State | Meaning |
| --- | --- |
| **Demonstrated** | The named capability has real implementation and a consumer or conformance evidence within the stated reach |
| **Partial** | Some mechanism or evidence exists, but the complete semantic, lifecycle, composition or assurance contract named in the row does not |
| **Proposed** | Research or a proposed decision describes a direction that is not binding or landed |
| **Absent** | A bounded tracked-repository scan found no implementation in the searched estate |
| **Unknown** | Source cannot establish the claim, usually because live control-plane, user, legal, service or operational evidence is required |

No state is a quality score. A specialised app mechanism may be excellent; a reusable package may
still be ineffective. The table is not a deficit score or a backlog.

## Scan boundary

Absent claims are bounded to tracked manifests and source under `apps/`, `demos/` and `packages/`
at the pin. The scan enumerated all 32 tracked `package.json` manifests plus tracked paths and
source. Dependency/source terms included PostgreSQL, Neon, `pg`, Drizzle, Prisma, Kysely and Knex;
path/content checks covered SQL and migration artefacts. Vector inspection separately covered
`semantic_text`, ELSER, dense and sparse vector terms so existing Elastic-specific semantic
operations were not erased by a generic-gap claim.

Ignored local infrastructure, later commits, deployed services and provider control planes are
outside the boundary. Absence of a reusable Kit capability does not erase app-specific or external
work outside the scan.

## Evidence map

| Capability | Evidence | Reach, source and boundary |
| --- | --- | --- |
| Intent and evidence workflow | **Partial** | Reusable strategy, Practice, plan, research, review and fidelity methods are deep, but a cross-demo evidence ledger and disposition workflow are not integrated as a Kit capability |
| Curriculum API and SDK | **Demonstrated** | [`@oaknational/curriculum-sdk`](../../../../packages/sdks/oak-curriculum-sdk/README.md) and code generation provide a reusable public consumer surface; semantic capability authorship remains distinct from generated transport |
| Pedagogy, assessment and educational-outcome composition | **Unknown** | Source demonstrates curriculum access and some experience mechanics, but cannot establish competent pedagogical authority, teacher/pupil outcome evidence or a reusable Kit composition; pinned OWA traces are historical evidence |
| Contract compilation and generated surfaces | **Demonstrated** | [`oak-sdk-codegen`](../../../../packages/sdks/oak-sdk-codegen/README.md) provides a specialised pipeline for OpenAPI acquisition, transformation, generated types/validators/clients/tools and runtime conformance; it is not a general loss-accounting contract compiler |
| MCP and agent capability delivery | **Demonstrated** | The [MCP HTTP app](../../../../apps/oak-curriculum-mcp-streamable-http/README.md), generated tool definitions, resources, host integration and agent-support metadata form a real specialised vertical slice; they do not establish general product composition |
| Search lifecycle and evaluation | **Demonstrated** | [`oak-search-sdk`](../../../../packages/sdks/oak-search-sdk/README.md), the [search CLI](../../../../apps/oak-search-cli/README.md) and accepted evaluation/lifecycle decisions implement an Elastic-specific reusable slice; semantic portability and general correction remain partial |
| Graph substrate and corpus views | **Partial** | `graph-core`, `graph-ingest`, `graph-project` and [`graph-corpus-sdk`](../../../../packages/sdks/graph-corpus-sdk/README.md) provide reusable typed capability; planned ingestion modes and wider-estate activation remain uneven |
| Design language and assets | **Demonstrated** | [`packages/design`](../../../../packages/design/README.md) separates tokens, assets, framework-neutral design, React and Ink primitives with real consumers |
| Product and interaction recipes | **Partial** | Demos and the MCP app contain app-specific composition and accessibility evidence, but no general host/profile/recipe capability equivalent to the breadth recovered from OWA |
| Host and runtime composition | **Partial** | MCP and Next.js demos perform app-specific routing, auth, observability and design integration; no reusable host profiles, composition declaration or compatibility matrix exists |
| Accessibility and fidelity assurance | **Partial** | Reusable browser, widget, axe, design-system and [`fidelity-review`](../../../../packages/libs/fidelity-review/README.md) machinery is substantial; complete outcome evidence across journeys, channels and assistive technology remains claim-specific |
| Identity and authorisation | **Partial** | The MCP HTTP app demonstrates app-specific Clerk/OAuth and deployment policy; no reusable principal/session/tenancy/policy composition exists for Kit consumers |
| Privacy, consent, safeguarding, rights and remedy | **Partial** | Reusable redaction/privacy mechanisms and bounded app policy exist; no whole-Kit grant, safeguarding, rights-holder or correction/remedy composition exists |
| Human research, product evidence and service support | **Unknown** | Methods and some review artefacts are visible, but representative research, human outcomes, service operations and disposition authority are externally operated; method presence is not evidence of use or effect |
| Transactional persistence and SQL lifecycle | **Absent** | The bounded scan found no PostgreSQL/Neon/`pg`/Drizzle/Prisma/Kysely/Knex dependency and no SQL or migration artefacts in the tracked workspace roots |
| Typed/ORM-adjacent data access | **Absent** | The scan found no reusable query builder, ORM profile, repository/mapping tooling, transaction harness or schema-to-domain correspondence capability |
| Object storage and durable asset lifecycle | **Absent** | Existing assets and delivery paths do not provide a reusable object lifecycle covering authority, upload, metadata, rights, versioning, delivery, retention, deletion and provider exit |
| Cache and ephemeral acceleration | **Partial** | The search CLI has an app-specific [Redis-backed SDK-response cache](../../../../apps/oak-search-cli/src/adapters/sdk-cache/index.ts) with TTL jitter, negative caching, fallback and diagnostics; no reusable Kit cache contract exists |
| Jobs, queues, events and outbox | **Absent** | The scan found no repository-owned durable-work, queue, event-handoff or transactional-outbox capability with retries, ordering, repair and conformance |
| Derived projection lifecycle | **Partial** | Search, graph and code generation contain strong specialised pipelines; no common authority/release/completeness/correction/cutover/result-envelope contract spans them |
| Vector-store operations | **Absent** | No separately addressable generic vector-store CRUD/lifecycle capability was found. Elastic-specific `semantic_text`, ELSER inference/retry and index lifecycle operations exist inside search; accepted ADR-075 records that its dense-vector arm reduced the measured quality/latency trade-off |
| Configuration and environment | **Partial** | [`@oaknational/env`](../../../../packages/core/env/README.md) and [`env-resolution`](../../../../packages/libs/env-resolution/README.md) provide typed contracts and resolution; capability/profile discovery and provider composition remain absent |
| Observability and analytics | **Partial** | Reusable [`observability`](../../../../packages/core/observability/README.md), logger, Sentry and PostHog packages provide redaction, diagnostics, traces and sinks; universal health/objective/semantic-canary/incident-response contracts are not present |
| Build, repository and supply assurance | **Demonstrated** | Root checks, `agent-tools`, workspace config, custom ESLint, generation, provenance and security gates form a strong reusable delivery substrate |
| Deployment, preview, promotion and rollback | **Partial** | The MCP app has an app-specific Vercel production path and search has specialised atomic index promotion/rollback; no Kit-wide host profile or release/elevation pipeline exists |
| Backup, restore, PITR, state portability and provider exit | **Proposed** | Provider research and proposed ADR/PDR material articulate a direction; no current Kit state capability exercises authoritative export/restore, independent-target recovery or provider exit |
| Long-horizon preservation and custody | **Partial** | Repository history, provenance and supersession practices are strong; no Kit capability defines preserved product objects, significant properties, custody, fixity, future readability and lawful disposal independently of backup |
| Developer scaffolding, diagnostics and local profiles | **Partial** | Workspaces have reusable instructions, generators and diagnostics, but no Kit consumer path, capability activation probe, scenario system or fresh-checkout product composition exists |
| Upgrade, deprecation, placement and stewardship | **Partial** | Decisions and package/version machinery are reusable; cross-Kit semantic upgrade, data/projection migration, unlike-use placement and retirement are not one coherent product |

## Interpretation

The estate is strongest where it has repeatedly exercised real paths: curriculum and generated
contracts, search, graph, design, MCP/agent delivery and repository assurance. It is least
evidenced where runnable hosts have not needed to write authoritative application state, support
long-lived multi-user products, connect digital states to whole-service operation, or prove human
outcomes and authorised disposition.

This pattern supports the definition's **closure** diagnosis: innovative ingredients can be
strong while the complete product-creation loop remains fragmented. Conventional foundations are
illustrative stress points because they become unavoidable in stateful, externally integrated or
sustained propositions. They are not the only missing closure: human authority, product/service
evidence, support, correction, preservation and consumer experience are equally material.

## Revalidation

This evidence must be refreshed from a new pin before it supports a present-tense implementation
decision. A future current view should derive activation and conformance from executable evidence
where practical, but generated status remains a projection: it cannot establish human outcomes or
authority by itself.
