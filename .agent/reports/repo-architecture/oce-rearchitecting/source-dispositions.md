# Source authority and substantive dispositions

**Observation date: 10 October 2026.** This is a bounded desk-research record for
the Engraph programme. Facts, inherited direction and proposed mechanisms remain
separate. It is not a new exhaustive implementation, security or deployment audit.

The owner's subsequent [corpus-first review decision](README.md#owner-decision-corpus-first-review-before-adoption)
defers programme adoption. This source map records the selected corpus
used for the synthesis; it is not a complete file-by-file preservation account of
all Education projects. The entire backup and its repo-local analysis will provide
the basis for the later plan assessment. Original source pins below remain intact.

## Verified primary source baseline

| Source | Exact version/status and read scope | Authority in this design |
| --- | --- | --- |
| Commission and consolidation brief | `oce-architecture-and-rework-plan-consolidation-brief-2026-10-10.md`, body r0.6, saved version 5; full brief read. Owner commission expressly includes execution of desk research/design/documentary incorporation beyond its preparation label | Current scope and settled owner direction; no implementation/deployment authority |
| Project instructions, summary, index, decisions | Current instructions body r4/saved v3; summary r34/v35; index v39; decisions r13/v12. Current records read; no intervening owner reversal found in the inspected project records | Source-authority distinctions, full framework, all mechanisms, zero-change ordinary configuration, Castr/integrity, no team measurement, open invariant set |
| PR1000 comparison and restructuring source map | Report body r7/saved v6; source map body r1. Read as source locators and prior reasoning, with consequential claims followed to primary sources below | Prior synthesis, not primary implementation evidence or the limit of the commission |
| Engraph OCE | Default branch `engraph`, baseline `efe69ff66182832dabe7f667ea0fa0ea021bc2ba`; current instructions, native skills and relevant plans/ADRs/configuration/code inspected | Implementation baseline and repository process; proposed docs do not imply code has changed |
| Oak OCE | `main` at `2a77738377a45164e7d7c2459b8c2874591d7e18` | Upstream comparison, not Engraph source authority |
| Oak PR1000 | Open/unmerged at observation, head `1af97fbc4af8c7c58cbcc57bc99f2bb36cbc2272`. Proposed Oak ADR231 read in full; PR metadata refreshed | One proposed input. Oak ADR231 five-repository topology is distinct from Engraph ADR231 organisation identity |
| Castr | `EngraphCode/castr` main `851c7efee5f4ae058970e7a0cb0c7d7678d7da3d`; README, destination specification v0.4.1, current course and consequential implementation seams inspected | Current destination remains draft awaiting source-owner ratification. Existing exports are source facts, not proof of supported fidelity |
| CF research | Architecture/assurance r14, governing policy r9/saved v10, first delivery r6/saved v5; definite architecture r2 remains unratified; implementer handoff r1 | Derived complete reconstruction contract in permanent CF document, with source-specific scope/standing and N01–N12 disposition retained |
| The exploratory pedagogy project and other consumer requirements | Owner-authored source titles/editions and their scope are listed in the permanent integrity document | The exploratory pedagogy project's obligations are profile-specific. No restricted briefing prose or organisational commitments are incorporated; necessary public-safe distinctions are stated completely |

Exact persistent source identities and restricted reading receipts remain in the
project's private provenance records. They are not implementation dependencies.
The complete necessary contracts are incorporated here; this report does not ask
an implementer to recover authority from private chat.

Primary repository links are immutable: [Engraph baseline](https://github.com/EngraphCode/open-curriculum-ecosystem/tree/efe69ff66182832dabe7f667ea0fa0ea021bc2ba),
[Oak baseline](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/2a77738377a45164e7d7c2459b8c2874591d7e18),
[Oak proposed ADR231](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/1af97fbc4af8c7c58cbcc57bc99f2bb36cbc2272/docs/architecture/architectural-decisions/231-five-repository-topology-product-search-plugins-skills.md),
and [Castr specification](https://github.com/EngraphCode/castr/blob/851c7efee5f4ae058970e7a0cb0c7d7678d7da3d/docs/SPECIFICATION.md).

## Source facts with architectural consequences

- A bounded inventory of `packages/`, `apps/`, `demos/` and `agent-tools/` finds
  33 package manifests, 32 private. The sole non-private curriculum SDK declares
  restricted access and relies on private workspaces. Runtime manifest closure
  alone omits required build/assets/tooling; it is not the final handover set.
- Anonymous metadata requests for `@oaknational/curriculum-sdk`, `oak-search-sdk`,
  `sdk-codegen`, `result`, `logger` and `graph-corpus-sdk` returned 404 on 10 October.
  This shows no anonymously accessible package at those names in that observation,
  not absence of private or renamed releases. No install was attempted.
- `.releaserc.mjs` has `npmPublish: false` in both publishing paths and stamps only
  root/curriculum SDK. Release branch/workflow assumptions name `main`, while the
  Engraph default is `engraph`. The workflow grants OIDC for Turbo; this does not
  establish npm trusted publishing/provenance. The exact validated-head release
  race remains a future repair, not a completed capability.
- `packages/core/env/src/root-package-version.ts` reads the monorepo root file at
  module load; its exported value is a real outside-install blocker. Explicit
  build/runtime identity replaces this assumption in the package contract.
- Search SDK config has `primary`/`sandbox`, version and zero-hit choices, but
  `src/internal/index-resolver.ts` fixes `oak_*` aliases, metadata and related
  names. Injectable clients do not establish independently configurable instances.
- MCP configuration acquisition/validation and live/dormant served-surface typing
  are useful existing mechanisms. Reusable selectors, runtime bootstrap, host
  lifecycle, widget and conformance machinery still sit with app data and must be
  separated inside their boxes, not moved wholesale.
- `search-contracts` field inventory is a documented libs→SDK dependency exception.
  Ownership of generated domain contracts must be resolved; the new general layer
  cannot hide that back edge behind a barrel or generated declaration.
- Castr is not in the inspected OCE manifests/lock. SDK generation still depends
  on the existing adapter and `openapi-typescript`; the adapter's `z.unknown()`
  fallback is a contract gap. Castr replacement must cover actual output consumers,
  not just produce compiling schemas.

These observations justify the future acceptance evidence. They do not establish
that all current code is defective, that no search implementation exists, or that
the intended package registry and operational systems are configured.

## Native plan and decision dispositions

| Existing source and standing | Retained contribution | Substantive treatment / receiving home |
| --- | --- | --- |
| `toolkit-re-architecture`, ratified historical strategy | Any-service ambition, retained toolkit/packs, public contracts, constructed import/manifest boundaries, useful carrier/liveness concerns | Superseded by `oce-rearchitecting-programme`. Extraction-first, blanket adopt-first for owner-directed CF, compulsory folder taxonomy and team/line-count success measures no longer control. Original stamped body retained as history |
| `oak-open-curriculum-mcp-extraction`, ratified historical design step | Per-box analysis, mechanism/identity/instance distinction, thin in place, complete finish closure, real-store evidence, staged cutover and recovery | Superseded by `oce-reusable-core-contracts` and connected nodes. Publication blocks handover, not design. D0b quarter-history/rosters/line counts, dip threshold and team-monitoring AC8 removed from the current route. App-local custom checks/scripts/callbacks/domain mechanisms are not permitted residue |
| `toolkit-publish-mechanism`, historical ratification 3 September | Validated release, one repository version initially, stamp/order/convergence, installed evidence, provenance, release-age floor and forward correction | Regrounded for Engraph branch/namespace/rights and full eligible closure; stale OIDC fact corrected. Real registry proof is owner-held. Scope change returns it to sketch with historical stamp conserved. Design/rehearsal can start before closure; live first publish cannot |
| `public-packages-release`, ratified strategy | Fully automatic releases, public-surface change policy, compatibility, possible later clock groups | Dated authority amendment keeps initial one-repository version, removes extraction-first and second-consumer conditions from this programme. Clock groups require a separate evidence-based decision, not automatic per-package versioning |
| `reliable-atoms-programme`, ratified | Complete CF assurance and coherent useful capability construction | Dated amendment connects full OCE reconstruction and rejects second-consumer/all-CF gates. First-unit evidence obligations replace a blocking whole-estate catalogue. No team timing |
| `graph-and-queue-foundations-delivery`, sketch | Geometry first; complete admission/storage/order, repairs, heap and substitution; later stable queue/graph branches | Exact native edits repair generic-core placement, proof-versus-test claims, duplicate-occurrence oracle and qualification evidence. New CF binding node owns stage 0a decision output; this node owns construction stages |
| `reliable-atoms-workspace-shape`, sketch | Automatic strict class/size/dependency controls | Retains class-specific structural controls. First-delivery stage 0b owns the additional complete source/exposure reconciliation and consumed forms. Class-control design is beneficial; the required controls and stage-0b outputs block qualification, not every parallel workstream |
| `innovation-kit` and `innovation-kit-capability-architecture-definition`, ratified | Whole repeatable creation/evidence/elevation system; domain authority, accessibility, trust/state, operations and recovery; wider portfolio | Retained, with new framework lifecycle contract node serving the existing strategy. Current extraction is one reference consumer, not the innovation programme's definition or endpoint |
| `workspace-reorganisation-programme`, already superseded | Migration census and useful historical source locations | Remains superseded; no revival of the approximately 66-workspace target, five-root taxonomy or standing whole-estate census |
| Toolkit Atlas, historical design source | Mechanism/identity/instance distinctions, carrier and reuse reasoning | Preserve as historical rationale. Not authority for current CF origin, fixed taxonomy, release readiness or per-package clocks |
| ADR108 SDK split, accepted | Generation/runtime separation and directional public boundaries | Per-output authority and consumed-form mapping carried into core/Castr/package nodes; no claim generated contracts have moved |
| Engraph ADR227, accepted with dated amendment | Published-package boundary, retained mechanisms, one-repository version initially and thin-in-place approach | ADR233 supersedes external executable residue, extraction-first ordering, team measurement and unchosen search grouping. Historical accepted record preserved with explicit notice |
| Engraph ADR230, accepted | Own-built algorithm/data-structure CF, complete meaningful compositions | Retained. Distinct from Oak ADR230 plugin distribution; no adopt-first override of this chosen class |
| Engraph ADR231, accepted | Organisation identity as explicit bindings | Retained. Distinct from Oak proposed ADR231 topology; publication/profile decisions apply it |
| Practice PDR143, accepted standalone distribution direction | Practice source custody with independently usable distribution | Retained. This programme does not mutate Practice doctrine or move its source out of OCE. Plugin/skill distribution is a separate publication surface, not a reason to remove mechanisms |

## PR1000: steering within the settled direction

Keep its distinctions among product deployments, reusable libraries, curriculum
content/plugin distribution and the lifecycle of experimental/public skills.
Keep non-wholesale separation and explicit distribution/evaluation evidence.
Do not adopt its five destinations as OCE's required source topology. Reusable
search SDK, source adaptation, indexing, evaluation, operation and lifecycle
mechanisms remain in OCE. So do Practice and experimental reusable material.

Independent releases do not require independent source repositories. A shared
search runtime is an optional operational arrangement, not a dependency implied
by possible future consumers. A curriculum-content generator is not a universal
repository or package synchroniser. Oak's organisational destinations, permissions
and operational commitments are not assigned to Engraph by this analysis.

## Retained mechanism and receiving-interface map

This is the initial responsibility inventory for the chosen reference profile,
not a claim that exact packages are decided. Implementation pickup expands affected
consumer closure before moving or removing a public contract.

| Current source family | Retained OCE responsibility / proposed public seam | Instance datum and evidence | Native receiving home |
| --- | --- | --- | --- |
| MCP application/server/handlers/register/bootstrap and app host routes | Protocol/runtime registration, sessions, lifecycle, host adapters and execution runner | Host/profile/capability references; protocol and activation/rollback fixtures | Core contracts → configured capability slice |
| MCP auth/security/instrumentation | Authentication provider integration, request authority, origins, error and credential handling | Permitted provider/policy and secret references; rejection/nondisclosure tests | Configured slice, then handover/cutover |
| Widget, embed/build scripts, assets, design packages | Rendering/build/serving/download, supported theming and accessibility facilities | Theme/layout/content identifiers; real-store asset/rendering/accessibility proof | Core contracts/package closure; framework lifecycle for new presentation facilities |
| Observability, analytics composition and telemetry | Lifecycle, correlation, normalisation/redaction, event validation and provider sinks | Supported event/sink/retention policy; secret-free diagnostic fixture | Configured slice; CF reconstruction for general value capabilities |
| Search CLI indexing/Elasticsearch/commands and search SDK | Acquisition/supplement, chunking/embedding, retry/bulk I/O, lifecycle, querying, evaluation, diagnostics | Versioned corpus, isolated namespace/resources, tuning/budgets/evaluation profile; two-instance and failure matrix | Core contracts plus separate search design |
| SDK codegen outputs and adapter | Generation orchestration, domain schema/vocabulary/graph/bulk/search/MCP artifacts and compatibility facilities | Approved contract/source/profile selection; independent semantic and consumer fixtures | Castr profile/replacement and curriculum contracts |
| Existing ten `packages/core` workspaces | Full explicit dispositions in CF reconstruction; no rename-only qualification | Public reliance contract and profile, with consumed source/emitted closure | Reliable-atoms programme and bounded reconstruction units; core contracts routes first app prerequisites |
| Guidance/content, agent/plugin packs and Practice tooling | Authoring/validation/build/evaluation/distribution mechanisms and useful guidance | Versioned pack selection and permitted instance content; source/build/artifact/evidence lineage | Framework lifecycle and existing owning programmes |
| Demos/research/experiments | Workbenches, reference consumers, useful candidate mechanisms and negative evidence | Explicit hypothesis/profile/claim boundary; no empirical commonality from planned consumers | Innovation strategy/architecture-definition and framework lifecycle |
| Release/CI/deployment/scaffold/conformance/recovery | Reusable execution facilities and provider adapters for whole consumed lifecycle | Supported workflow/action/CLI references, provider metadata and policy values; no app-local custom script fallback | Package closure, publication, handover and cutover |

## Source limits and refresh triggers

Specialist inspections are deliberately bounded: ten CF manifests and material
seams, actual MCP/search/generator and release contracts, whole relevant current
ADRs/plans where recorded, with historical archives used as locators. They do not
substitute for each implementation slice's complete affected-consumer analysis.
Library body revisions and storage versions sometimes differ; the two are not
silently equated. Sources marked draft or unratified remain so.

Reopen a conclusion when a relevant source/contract/profile revision, actual
consumer, repository authority, release mechanism, deployment promise, source
right or semantic guarantee changes. Recheck branch heads and working state at
implementation pickup. Static research and correlated agent review establish a
reasoned design, not measured effectiveness or production assurance.

## Wider programme and adjacent research dispositions

The primary programme-delivery report r1.2 (4 October; stored v2), §7 B01–B16,
and current coverage register r1.1 (6 October; stored v2) were followed during the
coverage review. The adopted `education-mastery-approach.md` r2 (6 October; stored
v2) was read in full. Its teacher-led mastery/Bayesian direction supersedes older
optional-model language. The corrected Bayesian synthesis remains provisional
analysis; adopted authority comes from the mastery definition. These directions
do not commission protected-data use or educational/participant/team studies.

The [permanent wider-capability specification](../../../../docs/architecture/oce-wider-capabilities.md)
incorporates the necessary obligations and four concrete adverse contract records.
The native `oce-domain-service-contracts` node owns their bounded binding, and
`oce-rdf-capability-reconstruction` owns the selected RDF continuation. No row
is a package count or all-catalogue prerequisite.

| Build area | Retained/partial provision and substantive disposition | Receiver and required output / dependency effect |
| --- | --- | --- |
| B01 Curriculum model/definitions | Retain current API/bulk definitions, authored assertions and research. Extend owned domain definitions instead of freezing current payloads as universal meaning. | `oce-curriculum-contracts`: entity/revision/occurrence/assertion/material/definition/rights contracts and independent semantic fixtures. Blocks the representations that promise them. |
| B02 Curriculum authoring/curation/publication | Ingestion and generated serving are downstream ingredients, not an authoritative editing service. Preserve future authoring, accepted change, approval, assets/accessibility/rights barriers and coherent edition construction. | `oce-domain-service-contracts`: one synthetic authoring-change→review→edition→consumer-correction case with separate editor/publisher authority and failed-approval semantics. Integrity and configuration machinery support it; it does not block public read extraction. |
| B03 Source/material/data pipelines | Retain bulk/API ingest, transformations, assets and staging. Complete exact source correspondence, eligibility, quality, provenance and reproducible generation. | `oce-curriculum-integrity-slice`; search-specific pipeline operations in `oce-search-delivery-design`. Source/rights and selected projection contracts block affected activation, not all programmes. |
| B04 Layered semantics/transformation | Retain schema generation and bounded adapters, reject one mandatory schema pipeline. Preserve independent curriculum, research, authority, operational and app models. | `oce-curriculum-contracts` + `oce-castr-integration-profile`: versioned definitions/mappings, declared loss, current authority and correction; `oce-domain-service-contracts` adds distinct tutoring/research examples where required. |
| B05 Inquiry/retrieval/relationships | Retain search, typed access and honest projections. Reconstruct required complete contextual operations and graph semantics rather than pretending lossy projection is full preservation. | Curriculum contracts/integrity and search design; `oce-rdf-capability-reconstruction` and graph W02/W07/W09 for graph-native boundaries. Explicit coverage, source basis and query limits precede stronger results. |
| B06 CF/composed systems | Retain and execute owner-governed complete Primitive/Component/Subsystem programme, not merely extraction helpers. | Existing reliable-atoms programme, first geometry→heap, core-value reconstruction and explicit ten-workspace receivers. Only actually consumed guarantees block a slice. |
| B07 Innovation/application construction | Retain design, demo, composition, host, lifecycle and authoring facilities and broader possible experiences. No one product template. | `innovation-kit-capability-architecture-definition` + `oce-framework-lifecycle-contracts`; one complete composition/elevation profile and maintained responsibility map. |
| B08 Full tutoring service | Settled wider OCE target, not current implementation. Preserve teacher/learner experience, help attribution, qualified return, correction, sufficient support, continuity and recovery, with current teacher-led mastery/Bayesian direction. The curriculum infrastructure consumer and the exploratory pedagogy project remain distinct. | `oce-domain-service-contracts` owns a tutor activity/return contract and exact educational/protected boundary; subsequent full-service construction has its educational/service owner and own commission. Neither learner modelling nor national custody is inferred for MCP. |
| B09 Interoperability/standards workbench | Retain schema/compiler/conformance tools. Structural checks alone do not settle semantic compatibility, legitimate disagreement or useful receipt. | `oce-domain-service-contracts` supplies bounded profile/extension/compatibility/receipt/import contracts and independently justified cases. Castr and existing protocol tooling provide mechanisms; standards/domain authorities decide meaning. |
| B10 Governed research/data science | Retain experiments/evaluation assets and reusable research mechanisms; telemetry is not permission to research. Need dataset/purpose/access, transformations, methods/configuration, uncertainty and negative-result custody. | `oce-domain-service-contracts` with research/data steward: a public/synthetic evidence package contract independent of curriculum and protected-data admission requirements. No participant or team study is commissioned. |
| B11 AI evaluation/safety engineering | Retain search/protocol/skill evaluation, fidelity and technical controls; do not infer calibrated judges, educational safety or operational remediation from their presence. | Framework lifecycle supplies reusable pipeline; `oce-domain-service-contracts` owns exact claim/candidate/case/adverse-result/hazard/remedy/reassessment profile. Educational evaluation remains separately commissioned. |
| B12 Evidence/learning/decisions | Retain reports, plans and proposed Kit records. Need linked questions→input/run→finding/contrary result→interpretation→accountable decision/correction, including possibility value without learning-gain claims. | Existing Kit definition and framework lifecycle with `oce-domain-service-contracts`'s independent research/evidence case; exact evidence packet and permitted disclosure rather than universal ledger engine. |
| B13 Identity/authority/privacy/state | Retain auth and privacy controls. Add purpose/role/delegation, protected custody, minimisation, continuation, revocation and current-authority checks only where promised. Identity does not grant every educational use. | Configuration/integrity contracts + `oce-domain-service-contracts`'s tutoring/research authority records. Protected operation is blocked by legitimate authority/retention/receiver decisions; public curriculum design is not. |
| B14 Correction/challenge/support/remedy | Retain rollback, restrictions and runbooks. Correction must reach affected reliance and accepted human response/re-entry; send is not receipt and refusal is not complete remedy. | Integrity handles derived correction; app cutover/lifecycle handles technical recovery; `oce-domain-service-contracts` binds reachable human receiver and supported ending for authoring/tutor/research cases. External copies have explicit limits. |
| B15 Practice/engineering | Retain skills, agents, CI, review methods and tooling; separate canonical Practice, technology bindings, organisation policy and generated distributions. Proposed agent-framework research is not automatic adoption. | Existing Practice/distribution owners plus framework lifecycle and package closure. Source→build→artifact→version/promotion/update/retirement contract; no Practice rebuild or team measurements. |
| B16 Lifecycle/operation | Retain runtime, metadata, diagnostics and recovery mechanisms. Complete supported distribution, resources, recovery/re-entry, compatibility, provider substitution and custody/retirement. Code cannot supply institutional authority or staffing. | Package closure, publishing, handover/cutover and framework lifecycle; separate search delivery owns actual search operation. Receiving role/authority is explicit; no staff/date promises inferred. |


The Typescript Graphs completed design (r1, 3 October) and pending demonstration
programme remain specialist-owned design sources; no case is marked demonstrated
here. Relevant RDF/addressability/transport contracts route through graph W02,
W07 and W09 and the bounded RDF node, with later-source reconciliation at pickup.
The Effective AI agent-capability construction/migration programme v4/r4 remains
proposed. Its useful definition, admission, generated distribution, controlled
effect, host-observation, evidence and retirement obligations inform the framework
lifecycle/Practice receivers. No universal agent framework or Practice rebuild is
adopted by that reception. These adjacent programmes were located and scoped as
receiving sources; this session does not claim a full renewed audit of them.
