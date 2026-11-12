# OCE rearchitecting programme — 10 October 2026

This is the repository-native entry point to the commissioned architecture and
programme design. A fresh implementer needs this checkout, the linked public
source repositories and the ordinary implementation environment. Private chat
and research-library access are not prerequisites.

**Authority:** the owner's 10 October commission executes consolidation brief
revision 0.6 in full and expressly extends its preparation-only label to complete
desk research, design, review, correction and Engraph documentary incorporation.
It does not commission application implementation, publication, migration or
deployment. No Oak repository mutation or PR communication is authorised. No
team measurement or team study is part of the work. [ADR-233](../../../../docs/architecture/architectural-decisions/233-retained-framework-and-configurable-instances.md)
records settled direction; new detailed plans remain **sketches**. The engineering
design below is proposed at its stated scope, not a claim of implementation.

## Owner decision: corpus-first review before adoption

On 10 October 2026, after the initial documentary submission, the owner deferred
adoption of this programme; its merge is not held (his word of 2026-10-13:
"Merge is not blocked on the corpus being added, but adoption is"; of 2026-10-14:
"we can merge these files without acting on them yet"). First incorporate the entire Google Drive
backup of the Education work as a preserved repository-local source corpus. Then
repo-local agents analyse that corpus on its own terms before assessing this plan.
The plan must not supply the organising frame for their initial corpus analysis.

Preserve original material, provenance, versions, relationships and distinctions
between adopted direction, proposals, superseded work and evidence. Inclusion in
the corpus does not make a source a governing instruction. Backup completeness,
knowledge preservation and programme coverage are separate questions; this design
and its passing CI do not establish that everything valuable has survived.
Existing source-access and publication boundaries remain applicable.

This plan is a provisional synthesis of the examined sources. Record the later
corpus analysis, plan comparison, omissions, distortions, authority conflicts and
necessary corrections with their source basis. The owner reviews that outcome
before adoption; the hold is not cleared by CI or the earlier reviews.
The substantive architecture stays unchanged pending those findings. Proposed
first-tranche and continuation steps below are conditional on that review and
subsequent normal ratification, not the next authorised implementation action.

The backup incorporation and repo-local review are later work. This close-out
records the decision; it neither performs that work nor claims its completion.

## Read path and editing authority

1. [Architecture and open invariants](../../../../docs/architecture/oce-architecture.md)
   owns the responsibility model and cross-cutting interactions.
2. [Configuration contracts and adverse scenarios](../../../../docs/architecture/oce-configuration-contracts.md)
   owns the proposed supported instance boundary.
3. [CF reconstruction](../../../../docs/architecture/foundations/oce-cf-reconstruction.md)
   owns the complete derived reconstruction obligations, ten-workspace disposition,
   geometry-to-heap path and the unratified N01–N12 distinctions.
4. [Integrity and Castr](../../../../docs/architecture/oce-integrity-and-castr.md)
   owns the layered semantic seam matrix and distinct profiles for the exploratory pedagogy project and the curriculum infrastructure consumer.
5. [Wider capability continuity](../../../../docs/architecture/oce-wider-capabilities.md)
   preserves B01–B16, current educational direction and four concrete domain records.
6. [Source and plan dispositions](source-dispositions.md) records exact evidence,
   existing-plan treatment and retained responsibilities; [review record](review-record.md)
   records scrutiny, corrections and limits.
7. Use the native plans below for bounded work, and the
   [instance guide](../../../../docs/development/oce-instance-development.md)
   for the intended receiving experience.

Engraph owns these implementation specifications and plans. Source research retains
its own authorship and authority; changing its conclusion requires reopening the
affected derived contract, not silently rewriting its source. Castr governs its
own specification/ratification until an explicit integration transfers a named
responsibility. Oak PR1000 is comparative evidence, not Engraph direction.
Generated output has no independent editing authority. No instructions here
authorise editing restricted source briefs or publishing their contents.

## Connected incremental delivery

The existing CF, publication and innovation strategic nodes retain their own
outcomes. [OCE rearchitecting](../../../plans/strategic/oce-rearchitecting-programme.plan.md)
replaces the older extraction-centred strategic route. The following is a design
dependency map, not execution status or a parallel schedule. Native `depends_on`
fields govern whole-node edges. A conditional prerequisite below attaches only to
the claim or operation that uses it; it is not a blanket gate.

| Useful increment / native home | Complete exit and receiving role | Actual prerequisite; beneficial ordering |
| --- | --- | --- |
| [CF assurance binding](../../../plans/delivery/oce-cf-assurance-binding.plan.md) | A complete finite geometry contract, proof-to-production route and qualification allocation; foundation builder receives it | Starts from existing contracts. Workspace-shape design is beneficial; actual automatic controls are mandatory before qualification |
| [Geometry-to-heap construction](../../../plans/delivery/graph-and-queue-foundations-delivery.plan.md) with [workspace shape](../../../plans/delivery/reliable-atoms-workspace-shape.plan.md) | Qualified geometry, then complete admission/storage/order/repairs/heap and consumed substitution evidence; downstream CF consumers receive exact guarantees | Binding precedes the affected construction. Each composition requires its actually consumed lower guarantees. Neither this entire node nor all CF blocks unrelated capability work |
| [Reusable core contracts](../../../plans/delivery/oce-reusable-core-contracts.plan.md) | First MCP profile's per-source responsibility/public-contract/configuration and complete closure map; capability and package authors receive it | Can begin immediately; CF binding is beneficial |
| [Curriculum contracts](../../../plans/delivery/oce-curriculum-contracts.plan.md) | Complete small source/domain/projection fixture and target enforcement allocation; data/SDK owners receive it | Can begin with public/synthetic data. Production source rights/identity decisions block only corresponding claims |
| [Castr profile](../../../plans/delivery/oce-castr-integration-profile.plan.md) | Current source authority, integration boundary, generated-output inventory and independent profile corpus; compiler/SDK owners receive it | Can begin immediately. Domain and CF contracts inform it; approved Castr source decisions and readiness block the actual replacement |
| [Configured capability slice](../../../plans/delivery/oce-configured-capability-slice.plan.md) | One complete supported profile works in place with OCE-owned mechanisms and configuration admission | Core contracts block this step. Specific relied-on qualified CF guarantees must exist; no all-CF dependency |
| [Castr replacement](../../../plans/delivery/oce-castr-generator-replacement.plan.md) | Source-approved integration and C-1 construction, then qualified artifacts consumed in OCE and replaced generator authority retired | Profile closure and source approval block integration/construction; actual C-1 readiness blocks consumer replacement. Publication is unnecessary for in-repo verification |
| [Curriculum integrity slice](../../../plans/delivery/oce-curriculum-integrity-slice.plan.md) | Bounded acquisition→admission→store→API/SDK preservation, correction and failure proof | Curriculum contracts block it. Castr blocks only outputs relying on its new profile; compliant existing generation can serve a narrower slice |
| [Complete package closure](../../../plans/delivery/oce-package-consumption-closure.plan.md) | Runtime/types/build/assets/tooling install and operate outside checkout; release owner receives eligible set | Configured slice blocks first-profile proof. Generator/data slices are required only if the chosen profile promises them |
| [Publication](../../../plans/delivery/toolkit-publish-mechanism.plan.md) | Validated release, complete compatible set, provenance, partial-failure convergence and registry read-back | Full eligible closure blocks first publish, not publication design/rehearsal. Actual Engraph namespace/branch/licence/rights must be bound |
| [App handover](../../../plans/delivery/oce-app-handover.plan.md) | Configuration-only instance demonstrably works from published artifacts with receiving authority | Complete published closure and supported profile block it. Operation-specific rights and responsibilities are verified separately |
| [App cutover](../../../plans/delivery/oce-app-cutover.plan.md) | One authorised instance changes live authority with observed readiness and recovery | Handover plus that instance's deployment/data/auth readiness. If its promise includes search operations, that service's acceptance is also required |
| [Search delivery design](../../../plans/delivery/oce-search-delivery-design.plan.md) | Complete separate operating contract and bounded implementation handoff | Architecture supplies namespace/corpus/change/recovery seams. Operational work remains separately commissioned; it does not gate unrelated CF or package design |
| [Wider domain records](../../../plans/delivery/oce-domain-service-contracts.plan.md) | Four exact retrieval/receipt, authoring/edition, teacher-led activity/return and research/evidence contract bindings; legitimate domain owners receive finite construction interfaces | Public/synthetic records start independently. Protected operation and educational decisions wait for their specific authorities, not an all-product gate |
| [RDF reconstruction](../../../plans/delivery/oce-rdf-capability-reconstruction.plan.md) | Complete selected RDF value/Dataset responsibility, with GraphView/processing successors and consumer retirement | The selected consumed contracts and CF evidence block reliance; no geometry/heap or full-graph gate |
| [Framework lifecycle profile](../../../plans/delivery/oce-framework-lifecycle-contracts.plan.md) | One complete composition/elevation/evidence profile, with retained broader facilities and missing-work homes | Can use available capabilities; core and curriculum design are beneficial. Serves existing innovation-kit, alongside its architecture-definition work |

CF-first means lead with the first row and its useful geometry endpoint while
designing contracts in parallel. No deadline or empirical team-capacity claim
justifies reversing that preference. A genuine handover deadline or a demonstrated
dependency can reopen order without weakening qualification or losing mechanisms.

## Startable first design tranche

After the corpus-first review and adoption decision above, the proposed tranche
completes four finite contract decisions and prepares the first construction.
Implementation also requires the selected plan's ratification and normal gates.

1. **Lead: CF binding.** Read the CF reconstruction, current geometry/adoption
   contracts and native first-delivery node. Work the parent relation and boundary
   cases through one exact production-correspondence proposal. Exit with the
   finite number/outcome/grade/toolchain/enforcement binding, independent law and
   rejection fixture, and accepted qualification allocation. The next action is
   stage 0b/first geometry under the existing first-delivery node.
2. **Parallel: first MCP contract.** Walk the actual application bootstrap,
   runtime config, served-surface, widget and package closure. Exit with every
   touched mechanism's maintained OCE home, public seam, allowed instance datum,
   consumer and retirement condition. Include an externally installed package
   path and two independently named search scenarios. The next action is the
   configured capability slice, not moving the current app directory.
3. **Parallel: semantic fixture.** Use one public/synthetic curriculum entity with
   repeated occurrence and two attributable assertions. Exit with complete
   definitions, source/domain/projection mapping, identity/version/eligibility
   and correction contract. The next action is the integrity slice.
4. **Parallel: Castr profile.** Pin current source authority and enumerate consumed
   generator outputs. Work unknown-key/default/status/media/target-version
   examples independently of current output. Exit with approved subset or exact
   unresolved profile decisions, extractability/CF dependency resolution and
   source-owned readiness conditions. The next action is source-approved integration, finite C-1 construction and qualification, then consumer replacement.

All four outputs have native nodes, responsible roles and acceptance above.
Working examples and reviewer verdicts belong beside the affected contracts, with
source/artefact identity. Software assurance can measure behaviour, complexity or
resource bounds where the contract requires it; it cannot be repurposed into
team timing, throughput, roster or workload studies.

The first **construction** tranche, following those bindings, is stage 0b through
qualified geometry. Design-tranche completion is not a geometry qualification.
The first explicit current-core construction is
[honest object-key/entry access](../../../plans/delivery/oce-core-value-reconstruction.plan.md).
The remaining ten-workspace responsibilities have these native receivers; a
receiver must author a bounded implementation slice before modifying that
responsibility, using the complete permanent contract rather than another census.

| Current responsibility | Native receiver and concrete next output |
| --- | --- |
| Result algebra | `reliable-atoms-programme`; exact independent outcome contract and consumer/evidence closure before a Result reconstruction slice. The geometry outcome choice is D01, not permission to duplicate Result |
| Object keys and entries | `oce-core-value-reconstruction`; honest open-object versus admitted-keyspace contract, implementation and consumer migration |
| RDF values, Dataset, GraphView and processing | `oce-curriculum-contracts` owns the selected semantic fixture; `oce-rdf-capability-reconstruction` owns the selected RDF continuation from graph W02/W07/W09; `oce-reusable-core-contracts` allocates SDK/public dependencies. Graph implementation slices qualify only selected complete responsibilities |
| Filesystem-resolved containment | `oce-package-consumption-closure` owns the first consumed tooling path; bind the complete safe-path contract, race/platform assumptions and affected callers before its replacement slice |
| Telemetry normalisation/lifecycle/provider policy | `oce-configured-capability-slice` owns the first runtime separation; lower value capabilities remain CF-owned and receive separate qualification when reconstructed |
| Environment acquisition and configuration admission | `oce-configured-capability-slice`; explicit acquisition/provider/profile contract, removing ambient module-load dependence |
| Build/release identity and SemVer candidates | `oce-package-consumption-closure` and `toolkit-publish-mechanism`; release identity input/precedence and actual consumed-form replacement. A general SemVer capability is separately justified before construction |
| Lint architecture policy and AST/tool adapters | `reliable-atoms-workspace-shape` owns class controls; first-delivery stage 0b owns additional complete exposure/ownership enforcement; package closure owns externally consumed presets/tooling |
| Portable build/test configuration | `oce-package-consumption-closure`; supported public presets, setup/no-I/O contracts, examples and real-store tooling consumption |
| Existing OpenAPI adapter and generation compatibility | `oce-castr-integration-profile` inventories responsibility; `oce-castr-generator-replacement` integrates, constructs, qualifies and then retires the replaced forms |

This allocation covers preservation, construction, affected-consumer migration and
retirement. It does not grandfather existing code as Qualified or force every
responsibility into its own package. The first profile must resolve every needed
row; unused wider framework work remains in its named owner programme.

## Precise remaining design decisions

These are proposed implementation choices with exact homes. They are not a new
programme-wide discovery exercise. No active dated owner gate or staffing promise
is fabricated: at implementation pickup, translate a genuine waiting decision
into the native node's expiring gate under its parent policy. An absent decision
blocks the specified action, not the already authorised documentary commission.

| Decision | Proposed direction / alternatives to resolve | Responsible role and home | Blocks |
| --- | --- | --- | --- |
| D01 First CF grade/outcome and production proof | Finite geometry contract; canonical Result means composition, not Primitive. Select finite formal/reviewed proof with exact production correspondence rather than call sampled tests proof | CF and repository contract owners; `oce-cf-assurance-binding` and existing first-delivery stage 0a | First construction binding/qualification |
| D02 CF source/exposure/consumed-form instruments | Complete reconciled source and emitted closure, exhaustive finite policy and negative probes; choose smallest real instrument serving the first unit | Foundation/tooling owner; workspace-shape supplies class controls, first-delivery stage 0b supplies complete dependency/exposure and consumed-form instruments | Affected qualified claim; not contract authoring |
| D03 N01–N12 definite CF proposals | Preserve exact itemised dispositions in CF reconstruction; adopt each only under its source authority. No blanket adoption of the research addendum | CF architecture owner; binding node for needed first-unit items, later bounded CF nodes for the remainder | Only work relying on an unaccepted proposal |
| D04 Public package responsibilities and profile format | Small typed product-specific contract families first; bounded composition only when required. Physical package/location follows cohesive guarantee and closure | Capability/instance contract owners; `oce-reusable-core-contracts` | Configured slice, final package set |
| D05 Curriculum identity/definition/storage bindings | Preserve source identity, separate entity/revision/occurrence/assertion/generation. Select complete small target enforcement; the exploratory pedagogy project's relational/UUID profile stays scoped | Domain and integrity owners; `oce-curriculum-contracts` | New public identity and affected store/generator implementation |
| D06 Castr source approval/model/readiness | Follow current source-owned RATIFY/MEASURE/MOVE/PLOT; decide evolve/rebuild from actual construct outcome evidence | Castr owner; `oce-castr-integration-profile` | Source integration/replacement dependent on that decision |
| D07 Castr/OCE shared CF versus extractability | Isolated workspace group with explicit dependencies; resolve proposed condition that no Castr workspace may depend on an OCE package outside Castr before any shared CF import | Castr and OCE architecture owners; integration-profile node | Cross-boundary imports/move technique |
| D08 Castr source/profile/target meaning | Explicit unknown-key, defaults, formats and transport discrimination; reconcile the exploratory pedagogy project's inherited OpenAPI target with actual supported writer edition | Domain/compiler/consumer owners; integration-profile node | Affected generated artifacts |
| D09 Namespace, release branch, rights and first eligible set | One repository package version initially; bind actual Engraph authority. No inherited Oak publisher credentials or rights assumption | Release owner; `toolkit-publish-mechanism`, supported by package-closure node | Live publish and registry-backed handover |
| D10 Compatibility, freshness, withdrawal and recovery policy | Explicit supported combinations and bounded propagation; separate configuration/code rollback from durable state recovery | Product, source and operating owners; curriculum/configured-slice/package nodes for owned contracts | The corresponding service/publication promise |
| D11 Search tenancy and operations | Support independent resource namespaces; choose deliberate shared or isolated runtime from data/authority/operating requirements | Search capability owner and receiving operator; `oce-search-delivery-design` | Search operations, not search source custody or unrelated extraction |
| D12 Host, domain, auth and receiving authority | Choose actual Engraph instance/repository/operator; verify rights and recovery before cutover | Instance owner/operator; `oce-app-handover` and `oce-app-cutover` | External creation/operation, never this document incorporation |
| D13 Exploratory pedagogy project actual-context/protected-data qualification | Qualify exact host/lifecycle and purpose/delegation/minimum information separately. Public curriculum path can stop at controlled API/SDK boundary | The exploratory pedagogy project's integration and educational authorities; integrity contract plus a later implementation node owned by that project | Claims beyond controlled boundary and protected-record use |
| D14 Framework composition/elevation shape | One complete reference profile; retain source authorities and declare new obligations on elevation. No universal workflow engine presumed | Innovation architecture owner; `oce-framework-lifecycle-contracts` and existing architecture-definition node | New shared lifecycle facility, not unrelated basic contracts |

D15 binds the four wider service records in `oce-domain-service-contracts`: exact
editorial approval/edition, teacher-authorised activity/return and Bayesian policy,
research/evaluation evidence, standards/receipt, protected purpose/state and accepted
remedy. The named domain authorities decide their own record; only its corresponding
service/stronger claim is blocked. D16 binds RDF value/Dataset semantics and higher
GraphView/processing assumptions in `oce-rdf-capability-reconstruction`, with graph
specialist ownership. Neither decision reopens the full programme architecture.

## Programme completeness and boundaries

The responsibility coverage is: complete CF construction and reconstruction;
general and domain reusable core; configuration and authority; layered data and
end-to-end integrity; Castr/generated artifacts; package/tool/asset closure;
release and consumption; receiving/cutover/recovery; separately scoped search;
and the innovation framework's workbench, composition, evidence and elevation.
Each has a native home, accountable role and received/output contract. Existing
material is substantively disposed in the companion report rather than erased.

The first implementation cannot rely on a repository plan stamp as CF proof,
a manifest as registry availability, a source-only pass as external consumption,
or an API response as intact host context. No deployment, educational outcome or
formal assurance is asserted by this planning work. Its completion is assessed
by the coherent source-grounded design, bounded plans, review corrections and
documentary incorporation; later decisions above govern later actions.
