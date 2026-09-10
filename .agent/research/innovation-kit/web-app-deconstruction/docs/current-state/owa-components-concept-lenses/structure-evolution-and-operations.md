# OWA and Oak Components through structural, evolutionary and operational lenses

## Purpose and scope

This record explores Oak Web Application (OWA) and Oak Components from twelve
differentiated perspectives which seek orthogonal questions where possible. It
asks what each perspective reveals, what it cannot
establish, and which evidence would invalidate the resulting hypotheses.

The source is pinned to:

- OWA
  [`510ac63a62fb37a70183b00ce0f5fb15be4491e5`](https://github.com/oaknational/Oak-Web-Application/tree/510ac63a62fb37a70183b00ce0f5fb15be4491e5),
  release `v1.1128.0`;
- Oak Components
  [`8ff8264fa921e4e40fdaf9a99b02fd156c699cc8`](https://github.com/oaknational/oak-components/tree/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8),
  release `v3.0.0`; and
- OCE's canonical
  [`concept-exploration`](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/skills/concept-exploration/SKILL-CANONICAL.md)
  workflow at
  [`bd878a3a550c8e5e5d21163a6d0962cebdaf43fa`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa).

This is a current-state exploration. It is neither an OWA or Oak Components
remediation plan nor a decision about OCE's architecture. A warranted
investigation below is a request for evidence, not an implied implementation.

## Method and epistemic contract

Each lens runs all four Concept Explorer movements in order:

1. reflect on raw observations and expose inherited assumptions;
2. define the mechanism-neutral problem space;
3. reflect on possible solutions and reopen competing explanations; and
4. synthesise a current understanding with warranted, falsifiable next steps.

Statements are labelled:

- **Observed:** directly visible in the pinned repositories or a stated local
  static inventory of those trees;
- **Inferred:** an explanation which fits those observations but has not yet
  been causally established; and
- **Unknown:** evidence absent from the repositories or not gathered in this
  pass.

Static inventory at the pins found 642 OWA source files importing Oak
Components. Oak Components contains 915 tracked TypeScript/TSX files, including
636 TSX files, 190 stories, 223 test files and 177 snapshot files. Its `owa`
subtree alone contains 251 TSX files. These counts describe authored files, not
runtime reach, quality, ownership or value.

## Why these lenses are distinct

| Lens                      | Primary axis                        | Boundary or seam it makes visible                 |
| ------------------------- | ----------------------------------- | ------------------------------------------------- |
| Complexity kind           | Cause and necessity                 | enduring obligation -> current mechanism          |
| Coupling and cohesion     | Change graph                        | stable contract -> transitive change reach        |
| Evolution                 | Time and path                       | current capability -> migration residue           |
| Socio-technical ownership | Decision authority                  | code ownership -> communication topology          |
| Product-line variability  | Difference and policy               | supported variation -> runtime branching          |
| Reliability               | Failure and recovery                | failed dependency -> contained user outcome       |
| Performance               | Demand, service and resource        | arrival rate -> work amplification -> budget      |
| Security                  | Adversary, authority and capability | possessed identifier -> authorised action         |
| Observability             | Feedback and control                | emitted signal -> diagnosis -> operator action    |
| Assurance epistemology    | Knowledge and proof                 | outcome claim -> invalidating evidence -> gate    |
| Supply chain              | Provenance and substitutability     | imported package -> executable trust and lock-in  |
| Sustainability            | Externalised resource use           | user value -> compute, transfer and retained data |

The same fact can appear under more than one lens, but its governing question
and falsifier must change. Repetition without a changed frame would not satisfy
Concept Explorer.

---

## Lens 1: essential, accidental and compensating complexity

### Governing question

Which complexity exists because Oak's outcomes are intrinsically plural, which
is contingent on chosen mechanisms or history, and which exists to compensate
for a limitation elsewhere?

### Movement 1: reflect on raw observations

- **Observed:** OWA's Pages root composes Clerk, consent, two theme providers,
  two analytics layers, pupil state, overlays, menus, toasts, save counts and
  notifications around every Pages route
  ([OWA `_app.tsx` lines 40-90](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/_app.tsx#L40-L90)).
- **Observed:** the App root expresses an overlapping but different provider
  composition and contains an explicit comment preserving `#__next` for
  deployment checks
  ([OWA App layout lines 43-110](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/layout.tsx#L43-L110)).
- **Observed:** Oak Components' own organisational rule says repo-specific
  components should normally live in the repo, but must live in Oak Components
  when they require non-exported internals
  ([organisation lines 53-62](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/organisationalStructure.mdx#L53-L62)).
- **Observed:** the package consequently exports an extensive `owa` surface,
  including teacher and pupil families
  ([`components/owa/index.ts` lines 1-42](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/index.ts#L1-L42)).
- **Observed:** a HubSpot submission adapter documents a second form as a
  fallback for a provider email-validation behaviour
  ([OWA HubSpot adapter lines 85-92](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/hubspot/forms/hubspotSubmitForm.ts#L85-L92)).

**Inherited assumption exposed:** a complicated implementation is not evidence
of a complicated requirement. Conversely, a mechanism that looks duplicative
may encode necessary compatibility, accessibility, privacy or migration work.
The categories cannot be assigned from shape alone.

### Movement 2: define the problem space

**Problem frame:** Oak needs to preserve real outcome complexity such as
audience differences, curriculum identity, accessible interaction, public
address compatibility, privacy and durable transitions. The gap is that the
repositories do not make the causal category of each mechanism explicit. This
harms anyone trying to distinguish an enduring kit obligation from a temporary
migration bridge or a provider workaround. Success is not fewer artefacts; it
is a defensible explanation of why each complexity-bearing mechanism exists and
what evidence permits its removal.

### Movement 3: reflect on possible solutions

**Competing explanation:** the two roots and the `owa` package area may be an
intentional strangler migration which lowers change risk. Provider-specific
fallbacks may be the least complex reliable response to behaviour Oak cannot
control. Removing either could increase total system complexity.

**Changed assumption:** "shared" and "simple" are not intrinsic properties.
They depend on whose change, failure and cognitive load is counted. A local
adapter can reduce global complexity; a globally shared primitive can export
complexity to every consumer.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** plural audiences, accessibility, privacy and content/address
  continuity are likely essential complexity.
- **Inferred:** duplicate framework roots and styling/provider composition are
  plausible accidental or transitional complexity, but the source alone cannot
  classify them.
- **Inferred:** repo-specific library placement forced by private internals and
  the HubSpot fallback are explicit candidates for compensating complexity.
- **Unknown:** defect, change-time and user-impact evidence by category.

The most revealing seam is **enduring obligation -> current mechanism ->
compensated limitation**. Any future target decision that skips the middle
causal explanation risks either preserving a workaround as architecture or
deleting a requirement as "legacy."

| Warranted investigation                                                                                                                         | Warrant                                                                                           | Falsifier                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Build a mechanism ledger for the highest-change pathways, recording obligation, mechanism, originating constraint, owner and removal condition. | Current comments and placement rules expose all three complexity kinds but do not enumerate them. | The ledger finds that mechanisms map one-to-one to enduring obligations and no meaningful contingent or compensating cluster exists. |
| Trace five apparent duplicates through incident and migration history.                                                                          | Two roots and overlapping component surfaces are not enough to establish accidental complexity.   | Each duplicate is shown to enforce a distinct, current outcome contract with independent evidence.                                   |

**Unresolved evidence:** incident history; planned router/component end states;
provider contracts; accessibility and policy obligations; cost-of-change data;
and whether users still depend on every compatibility path.

---

## Lens 2: coupling, cohesion and change propagation

### Governing question

Where does one conceptual change propagate, and do the present boundaries keep
things that change together while keeping independent decisions apart?

### Movement 1: reflect on raw observations

- **Observed:** Oak Components has one public root which exports components,
  styles, test helpers and hooks
  ([`src/index.ts` lines 1-4](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/index.ts#L1-L4)).
- **Observed:** Rollup is configured from that single root to emit one ESM file,
  one CommonJS file and one declaration bundle
  ([Rollup lines 12-43](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/rollup.config.js#L12-L43)).
- **Observed:** the package declares Next, Next Cloudinary, React, React DOM and
  styled-components as peer dependencies
  ([package lines 34-43](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/package.json#L34-L43)).
- **Observed:** OWA imports Oak Components from 642 tracked source files in the
  local pinned-tree inventory, while its Pages root also nests Oak's theme
  provider inside OWA's own styled-components provider
  ([OWA `_app.tsx` lines 45-88](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/_app.tsx#L45-L88)).
- **Observed:** Oak Components' design guidance recommends composition and
  inheritance, fewer props, single responsibility and reuse of existing
  utilities
  ([design guidance lines 49-69](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/designingComponents.mdx#L49-L69)).

**Inherited assumption exposed:** a package boundary is not automatically a
decoupling boundary. A broad stable import name can conceal transitive runtime,
styling, asset, framework and release coupling.

### Movement 2: define the problem space

**Problem frame:** a change should reach every dependent outcome which needs it
and no independent outcome which does not. The present source gives file and
package boundaries but not the semantic change graph. Consumers are harmed when
a visual token, interaction contract, framework upgrade or OWA-specific change
has a wider review, build, migration or regression radius than its obligation.
Success is predictable propagation, explicit compatibility and cohesive
ownership, not zero dependencies.

### Movement 3: reflect on possible solutions

**Competing explanation:** the single barrel may deliberately maximise API
discoverability and bundler tree-shaking may keep runtime payloads local. A
framework-aware library may provide substantially better integrated behaviour
than nominally portable primitives.

**Changed assumption:** coupling has several independent dimensions: source
imports, emitted code, runtime context, data/semantic knowledge, release timing,
and organisational coordination. Import counts measure only one of them.

### Movement 4: synthesise and propose

**Synthesis:**

- **Observed:** source-level adoption of Oak Components inside OWA is broad.
- **Inferred:** the single export/build surface makes package compatibility and
  release coordination a large potential change boundary even where bundlers
  remove unused code.
- **Inferred:** `owa` product components and framework peers reduce conceptual
  cohesion of "shared component library," although they may increase cohesion
  for the actual Oak application family.
- **Unknown:** emitted module reach, consumer-specific bundle inclusion,
  co-change clusters and whether downstream consumers use supported deep entry
  points.

The principal seam is **semantic contract -> public export -> runtime context ->
consumer change radius**.

| Warranted investigation                                                                                                          | Warrant                                                                                        | Falsifier                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Construct a cross-repository symbol-level dependency and co-change graph, separating type, test, story, build and runtime edges. | File import count and barrels cannot reveal semantic propagation.                              | Symbol changes remain tightly local, co-change modularity matches current boundaries, and consumer migrations rarely cross unrelated areas. |
| Measure package build output and three representative consumer bundles per exported family.                                      | One Rollup entry and peer dependencies create plausible but unproven payload/runtime coupling. | Bundles demonstrate reliable per-symbol elimination, no unwanted runtime peers, and stable isolated chunks across consumers.                |

**Unresolved evidence:** other consumers; package API-usage telemetry; bundle
manifests; co-change history by symbol; release migration effort; and the design
authority behind shared tokens and interactions.

---

## Lens 3: evolutionary architecture, path dependence and migration strata

### Governing question

Which structures are current destination, deliberate transition, compatibility
stratum or historical residue, and what preserves optionality while the system
evolves?

### Movement 1: reflect on raw observations

- **Observed:** OWA retains Pages and App composition roots with overlapping but
  different responsibilities
  ([Pages root lines 40-95](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/_app.tsx#L40-L95),
  [App root lines 43-113](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/layout.tsx#L43-L113)).
- **Observed:** an OWA script maintains an explicit catalogue of old local
  components and finds their importers
  ([old-component catalogue lines 69-120](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/scripts/dev/old-components/list.ts#L69-L120),
  [reporting lines 192-233](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/scripts/dev/old-components/list.ts#L192-L233)).
- **Observed:** Oak Components includes a codemod import map from the former
  atoms/molecules/organisms hierarchy into capability-oriented directories
  ([migration map lines 1-40](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/scripts/migrate/component-import-map.ts#L1-L40),
  [transform lines 10-32](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/scripts/migrate/update-component-imports.ts#L10-L32)).
- **Observed:** deprecated components remain exported and documented with
  replacements, for example `OakForm`
  ([`OakForm` lines 8-20](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/form-elements/OakForm/OakForm.tsx#L8-L20)).
- **Observed:** OWA at its pin consumes Oak Components `^2.45.0`, while the
  Components pin is the `v3.0.0` release
  ([OWA package lines 84-102](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/package.json#L84-L102),
  [Components package lines 1-12](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/package.json#L1-L12)).

**Inherited assumption exposed:** the repository at a commit is not one
architecture. It is a superposition of generations, with compatibility and
migration machinery carrying information about both origin and intended
direction.

### Movement 2: define the problem space

**Problem frame:** changes to public addresses, component contracts, rendering
runtimes and product flows must preserve user outcomes while the underlying
mechanisms evolve. The gap is that source strata do not consistently encode
their intended lifetime, convergence condition or removal evidence. This harms
maintainers and future kit consumers because temporary bridges can become
permanent policy and "new" code can reproduce old assumptions. Success is
reversible, observable evolution with explicit transition states, not perpetual
compatibility or wholesale replacement.

### Movement 3: reflect on possible solutions

**Competing explanation:** coexistence is healthy evolutionary architecture:
routes move independently, deprecations give consumers time, and major package
releases state genuine contract breaks. Uniformity could unnecessarily couple
delivery.

**Changed assumption:** path dependence is neither debt nor proof of bad design.
It becomes constraining when the reason, owner, convergence signal or supported
compatibility horizon is unknowable.

### Movement 4: synthesise and propose

**Synthesis:**

- **Observed:** both repositories contain deliberate migration instruments, not
  merely stale artefacts.
- **Inferred:** architecture is presently shaped by at least four strata:
  public compatibility, router evolution, local-to-library component movement,
  and package-major adoption.
- **Inferred:** source comments and codemods preserve some transition knowledge,
  but they do not form one verifiable migration state model.
- **Unknown:** supported horizons, rollback paths, completion definitions and
  whether OWA's v2 pin is a brief release offset or a substantive migration.

The key seam is **old contract -> compatibility bridge -> new contract ->
verified convergence -> removal authority**.

| Warranted investigation                                                                                                                                                   | Warrant                                                                            | Falsifier                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create a temporal architecture map from commits, releases and route/component moves, with entry, current state, target claim and exit condition for every active stratum. | Explicit migration scripts and dual roots show time is architecture here.          | Every apparent stratum already has a current, enforced owner and exit condition discoverable from existing records.                                         |
| Reconstruct two completed migrations and two active ones, including rollback and user-impact evidence.                                                                    | Current structure cannot distinguish effective evolutionary controls from residue. | Completed and active migrations show no material difference in lead time, regression, duplication lifetime or removability regardless of explicit controls. |

**Unresolved evidence:** migration ADRs; issue/PR intent; release support policy;
consumer upgrade histories; rollback records; analytics proving old-path use; and
the intended router end state.

---

## Lens 4: socio-technical ownership, Conway forces and team topology

### Governing question

Which people or teams can make, review and operate each architectural decision,
and where do code boundaries amplify or contradict the communication topology?

### Movement 1: reflect on raw observations

- **Observed:** both CODEOWNERS files assign Cloud Ops to infrastructure and
  Terraform workflow paths, but assign no source-domain owners
  ([OWA CODEOWNERS lines 1-5](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/CODEOWNERS#L1-L5),
  [Components CODEOWNERS lines 1-7](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/CODEOWNERS#L1-L7)).
- **Observed:** Oak Components directs ambiguous placement decisions to an
  `#oak-components` Slack channel and makes the engineer needing reuse
  responsible for moving a repo-specific component into the shared area
  ([organisation lines 5-13](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/organisationalStructure.mdx#L5-L13)).
- **Observed:** its README says changes require at least one reviewer and that
  QA, design or product review should be sought "when necessary"
  ([Components README lines 56-68](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L56-L68)).
- **Observed:** Oak Components' release workflow is configured to publish
  independently only after a successful Verify run, creating a declared release
  authority and consumer-upgrade boundary
  ([release workflow lines 1-20](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/release.yml#L1-L20),
  [lines 39-48](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/release.yml#L39-L48)).
- **Observed:** the library explicitly contains shared, internal and
  repo-specific categories
  ([organisation lines 10-62](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/organisationalStructure.mdx#L10-L62)).

**Inherited assumption exposed:** repository, package and directory ownership do
not necessarily name product, semantic, operational or design authority. Sparse
CODEOWNERS may mean healthy collective ownership, implicit teams, or an
unrecorded coordination bottleneck.

### Movement 2: define the problem space

**Problem frame:** every cross-cutting outcome needs an authority able to make
trade-offs across product, curriculum, interaction, accessibility, data,
security and operations. The gap is that encoded review ownership is much
narrower than the architectural decision surface. This can harm teams through
hidden consultation queues, unclear escalation and dependency release handoffs.
Success is aligned decision authority and fast expert feedback with resilience
to staff change, not maximal per-file ownership.

### Movement 3: reflect on possible solutions

**Competing explanation:** lightweight ownership may be intentional because a
stable, highly collaborative team already shares context; adding formal owners
could create queues without changing actual accountability. The Slack channel
may be an effective enabling-team interface.

**Changed assumption:** Conway analysis must follow decisions and interaction
frequency, not infer an org chart from folder names. The separate package can be
an enabling platform, a collaboration hub, or a handoff boundary; source alone
does not decide which.

### Movement 4: synthesise and propose

**Synthesis:**

- **Observed:** infrastructure ownership is encoded; product and component
  semantic ownership is mostly not.
- **Inferred:** Oak Components creates a socio-technical coordination boundary
  because it has a separate review, release and adoption cycle.
- **Inferred:** repo-specific families inside the shared package may reveal
  team/product communication paths more strongly than their directory label
  reveals reusable semantics.
- **Unknown:** actual team topology, review latency, knowledge concentration,
  on-call ownership and whether design/accessibility authorities can veto a
  release.

The key seam is **outcome authority -> code ownership -> review communication ->
release authority -> operational accountability**.

| Warranted investigation                                                                                                                                    | Warrant                                                         | Falsifier                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Map decision rights and actual reviewer/co-change networks for representative cross-repo changes, including design, accessibility, product and operations. | CODEOWNERS captures only a narrow slice of authority.           | Review and incident data shows clear, resilient ownership with low handoff latency and no concentrated knowledge risks. |
| Trace demand on the component-library maintainers from request through OWA adoption.                                                                       | The package may be an enabling interface or a dependency queue. | Requests, reviews, releases and adoption are consistently self-service, parallel and do not wait on a central group.    |

**Unresolved evidence:** organisation/team boundaries; bus-factor and review
data; Slack decisions; on-call rotations; design-system governance; support
demand from other consumers; and cross-repo incident response.

---

## Lens 5: product-line variability and configuration

### Governing question

Which differences are stable dimensions of an Oak application family, which are
environment or rollout policy, and where does variability become uncontrolled
branching or consumer-specific coupling?

### Movement 1: reflect on raw observations

- **Observed:** Oak Components describes itself as supporting React and Next
  applications produced by Oak, requires Oak asset configuration, and requires
  theme, global styles, Lexend and styled-components SSR integration
  ([Components README lines 7-45](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L7-L45)).
- **Observed:** its `OakTheme` varies a name and a complete UI-role colour map
  ([theme type lines 1-13](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/styles/theme/theme.ts#L1-L13));
  default and dark themes implement that same shape
  ([default theme lines 1-18](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/styles/theme/default.theme.ts#L1-L18),
  [dark theme lines 1-18](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/styles/theme/dark.theme.ts#L1-L18)).
- **Observed:** responsive component props accept either one value or an array
  mapped across two fixed breakpoints
  ([responsive style lines 11-49](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/styles/utils/responsiveStyle.ts#L11-L49),
  [lines 53-110](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/styles/utils/responsiveStyle.ts#L53-L110)).
- **Observed:** OWA validates a large typed registry of environment-derived
  browser configuration, including browser visibility, requiredness, defaults
  and allowed values
  ([browser config lines 1-49](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/getBrowserConfig.ts#L1-L49)).
- **Observed:** OWA evaluates PostHog flags on both the server and browser; the
  client HOC renders nothing until a flag loads and redirects when disabled
  ([server flag lines 34-61](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/utils/featureFlags.ts#L34-L61),
  [client HOC lines 1-29](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/hocs/withFeatureFlag.tsx#L1-L29)).

**Inherited assumption exposed:** "configuration" conflates brand/theme,
responsive adaptation, environment wiring, provider selection, experiments,
permissions, content differences and product capabilities. These have different
owners, lifetimes and valid state spaces.

### Movement 2: define the problem space

**Problem frame:** a kit intended to enable additional consumers must express
legitimate variation without forcing every consumer into OWA's provider and
runtime choices or making every combination a supported product. The gap is an
explicit variability model: which dimensions are compile-time, deployment-time,
request-time or user-time; which combinations are valid; and who owns defaults.
Consumers are harmed by hidden prerequisites, flag interactions, invalid
combinations and runtime branches standing in for separate capabilities.
Success is deliberate, typed, testable variability with clear unsupported
states, not maximal configurability.

### Movement 3: reflect on possible solutions

**Competing explanation:** the present library is intentionally an Oak product
library rather than a general design-system kernel. Asset hosting, framework
integration and product families may be valuable conventions which make the
supported line coherent. Generalising them could erase useful constraints.

**Changed assumption:** the choice is not "configurable library versus copied
apps." A product line can have a small invariant core, separately composable
capabilities and opinionated application profiles without representing all
differences as props or flags.

### Movement 4: synthesise and propose

**Synthesis:**

- **Observed:** variability currently appears at theme, responsive prop,
  environment, feature-flag, provider and repo-specific component levels.
- **Inferred:** Oak Components mixes invariants of the visual language with
  assumptions about an OWA-shaped host and assets.
- **Inferred:** OWA flags are rollout mechanisms as well as route/product
  availability policy; treating them as one variability kind obscures lifecycle.
- **Unknown:** the actual set of current and intended consumers, supported
  combinations, extension demand and whether dark theme is a production outcome
  or Storybook/design exploration.

The key seam is **product invariant -> capability selection -> deployment
configuration -> experiment/rollout -> per-user state**.

| Warranted investigation                                                                                                                               | Warrant                                                                                           | Falsifier                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Produce a variability model for three existing and three plausible consumers, naming dimension, binding time, owner, valid combinations and evidence. | Current mechanisms express several independent kinds of variability without one support contract. | Consumers require the same invariant profile and no meaningful independent variability dimensions emerge.                    |
| Exercise pairwise and high-risk combinations of flags, themes, providers and runtimes against outcome contracts.                                      | Locally correct options can interact into unsupported states.                                     | Static constraints already make invalid combinations unrepresentable and observed interactions add no failures or ambiguity. |

**Unresolved evidence:** consumer catalogue and road map; active PostHog flag
inventory; theme use in production; configuration ownership; asset-host
portability; unsupported combinations; and frequency of consumer-specific
forks.

---

## Lens 6: reliability, resilience and fault containment

### Governing question

When a dependency, projection, transition or component fails, what outcome is
lost, what remains usable, and where is failure detected, contained, recovered
or amplified?

### Movement 1: reflect on raw observations

- **Observed:** OWA's client error boundary selects Sentry or Bugsnag when
  configured but retains a local fallback boundary when the reporting provider
  is unavailable or uninitialised
  ([error boundary lines 54-107](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/AppComponents/ErrorBoundary/ErrorBoundary.tsx#L54-L107)).
- **Observed:** the App core layout translates only a 404-class `OakError` into
  `notFound` and rethrows other errors
  ([core layout lines 15-40](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/layout.tsx#L15-L40)).
- **Observed:** generated curriculum downloads build all requested files with
  `Promise.all`, buffer them, optionally zip them, and publish a
  stale-while-revalidate cache policy
  ([download route lines 330-380](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L330-L380)).
- **Observed:** the HubSpot adapter contains a domain-specific fallback path
  rather than treating all provider failure uniformly
  ([HubSpot adapter lines 151-220](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/hubspot/forms/hubspotSubmitForm.ts#L151-L220)).
- **Observed:** Oak Components supplies interaction behaviours such as a modal
  with trapped focus, close control, backdrop and escape handling
  ([`OakModalCenter` lines 100-119](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/messaging-and-feedback/OakModalCenter/OakModalCenter.tsx#L100-L119));
  it does not own the application's remote-service recovery policy.

**Inherited assumption exposed:** an error boundary or fallback is not the
reliability architecture. Reliability is an outcome-specific property spanning
dependencies, state transitions, resource limits, stale data, user recovery and
operational response.

### Movement 2: define the problem space

**Problem frame:** teachers and pupils need useful, trustworthy outcomes despite
partial failure, but different outcomes have different integrity and
availability requirements. The repositories show local recovery decisions
without one failure-domain map. Users are harmed when an optional dependency
collapses a whole route, a retry duplicates a write, stale data is presented as
current, or graceful UI hides lost durability. Success is bounded failure with
explicit degradation and recovery semantics, not universal retries or a page
that merely continues rendering.

### Movement 3: reflect on possible solutions

**Competing explanation:** framework boundaries, serverless isolation, CDN
caches and provider SLAs may already supply much of the containment, while local
code correctly handles only domain-specific recovery. Adding application-level
machinery could create correlated retry storms or inconsistent replicas.

**Changed assumption:** resilience is not "catch more errors." Some failures
must stop an unsafe or misleading outcome; some should degrade locally; some
need idempotent replay; and some should preserve the last warranted projection.

### Movement 4: synthesise and propose

**Synthesis:**

- **Observed:** OWA contains fallbacks at UI, provider, cache and domain-error
  layers.
- **Inferred:** fault-containment units follow route/provider implementations
  more than explicit user-outcome boundaries.
- **Inferred:** Oak Components' reliability contribution is deterministic,
  accessible interaction behaviour and stable contracts; application recovery
  belongs above it unless a component itself owns asynchronous work.
- **Unknown:** timeout, retry, idempotency, overload, recovery-time and
  acceptable-staleness objectives for each critical outcome.

The key seam is **dependency failure -> integrity decision -> containment unit ->
user degradation -> recovery and reconciliation**.

| Warranted investigation                                                                                                                                                | Warrant                                                              | Falsifier                                                                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build an outcome-by-dependency failure matrix and inject timeout, malformed response, stale replica, rate-limit and partial-write failures in representative journeys. | Local catches and fallbacks do not establish end-to-end containment. | Existing tests and production evidence already demonstrate bounded, correctly communicated degradation for every critical dependency and transition. |
| Trace acknowledgement and idempotency for writes, webhooks, downloads and generated artefacts under retry and concurrency.                                             | HTTP success and continued rendering may precede durable outcome.    | Each transition is already idempotent or explicitly at-most-once, with read-back/reconciliation evidence matching the user acknowledgement.          |

**Unresolved evidence:** production dependency failure rates; SLOs; timeout and
retry defaults; cache serve-stale behaviour; platform limits; webhook replay;
disaster recovery; and user research on acceptable degradation.

---

## Lens 7: performance, queueing and resource budgets

### Governing question

How do request arrival, concurrency, service time, caching, fan-out, payload and
client work combine at peak and tail, and which budgets protect the user outcome?

### Movement 1: reflect on raw observations

- **Observed:** Clerk middleware is deliberately restricted to API/tRPC routes
  because the comment records page latency
  ([OWA middleware lines 1-16](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/middleware.ts#L1-L16)).
- **Observed:** OWA wraps Next's `unstable_cache` with a two-hour default and
  documents cache identity, schema coupling and invalidation constraints
  ([cache wrapper lines 1-33](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cache/index.ts#L1-L33)).
- **Observed:** AI-backed search intent is IP-rate-limited and successful model
  output receives a 30-day shared CDN cache, while direct local matches bypass
  model work
  ([search intent lines 22-62](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/search/intent/index.ts#L22-L62),
  [lines 78-93](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/search/intent/index.ts#L78-L93)).
- **Observed:** Oak Components' Rollup configuration declares one minified ESM
  and one minified CommonJS entry, externalising declared peers
  ([Rollup lines 12-38](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/rollup.config.js#L12-L38)).
- **Observed:** the package tells App Router consumers to configure
  styled-components SSR to avoid unstyled-content flicker
  ([Components README lines 19-45](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L19-L45)).
- **Observed:** OWA exposes bundle analysis as an optional build command, but no
  performance or payload threshold is declared beside it
  ([OWA package lines 8-18](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/package.json#L8-L18)).

**Inherited assumption exposed:** static rendering and caching do not make a
system "fast" in the abstract. They move work among build, first request, CDN,
serverless function, browser and invalidation paths, each with different queues
and tail behaviour.

### Movement 2: define the problem space

**Problem frame:** user-perceived latency and resource use arise from a network
of queues and work amplifiers: source fan-out, cache miss, cold start,
serialization, bundle evaluation, hydration, media and interaction. The gap is a
set of outcome budgets tied to representative demand and devices. Users are
harmed by tail latency, layout/style instability, overloaded dependencies and
large browser work even when average server time looks healthy. Success is
predictable behaviour within explicit response, payload, memory and concurrency
budgets at realistic percentiles, not a single Lighthouse or bundle score.

### Movement 3: reflect on possible solutions

**Competing explanation:** current cache layers, static projections, CDN assets,
rate limits and code splitting may already make hot paths excellent; the source
shows conscious performance choices. Additional abstraction or uniform budgets
could optimise cheap paths while harming freshness and correctness.

**Changed assumption:** performance decisions must name the queue and scarce
resource. "Cache it," "parallelise it" and "move it to the client" can each
reduce one latency while increasing invalidation load, burst concurrency,
memory, transfer or device work elsewhere.

### Movement 4: synthesise and propose

**Synthesis:**

- **Observed:** performance policy exists in middleware scope, cache lifetime,
  rate limiting, parallel work, package build and SSR integration.
- **Inferred:** these are local optimisations without a repository-visible
  outcome budget or queueing model.
- **Inferred:** the package's broad barrel is not proof of a broad consumer
  bundle; emitted and evaluated reach must be measured.
- **Unknown:** traffic distributions, cache-hit ratios, cold starts, dependency
  tails, JavaScript/CSS cost by route, build cost and low-end device behaviour.

The key seam is **demand -> queue -> service/fan-out -> cached or computed
projection -> transferred payload -> device work -> interaction readiness**.

| Warranted investigation                                                                                                                                          | Warrant                                                                                         | Falsifier                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Establish outcome budgets and measure p50/p95/p99 server, dependency, payload, render and interaction cost for representative cold/hot and low-end-device paths. | Existing local controls do not reveal end-to-end tail behaviour.                                | Current production telemetry already provides complete outcome-level budgets and shows ample headroom under peak demand.         |
| Run controlled cache-miss and burst models for curriculum pages, search intent and generated downloads, including memory and downstream concurrency.             | Parallel buffering, model calls and cache regeneration can amplify work under miss convergence. | Platform coalescing and measured service capacity keep all paths within declared budgets with no correlated downstream pressure. |

**Unresolved evidence:** real traffic and percentiles; regional cache behaviour;
bundle/chunk manifests; serverless memory and duration; media bytes; Core Web
Vitals by device; build carbon/time; and explicit freshness-versus-latency
priorities.

---

## Lens 8: security, capabilities and threat boundaries

### Governing question

Which actor may exercise which authority over which subject, what evidence
grants that capability, and where can untrusted data or confused authority cross
a boundary?

### Movement 1: reflect on raw observations

- **Observed:** Clerk middleware is attached to API/tRPC routes except Classroom;
  the middleware call itself does not show per-route authorisation policy
  ([OWA middleware lines 1-16](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/middleware.ts#L1-L16)).
- **Observed:** teacher-note GET and POST use `note_id` and `sid_key`, validate
  writes, inspect text and HTML for PII, and upsert through the pupil datastore
  ([teacher-note route lines 16-35](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/teacher/note/route.ts#L16-L35),
  [lines 37-83](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/teacher/note/route.ts#L37-L83)).
- **Observed:** the same route's `PUT` starts batch redaction without a
  route-local request or authorisation check
  ([teacher-note route lines 86-91](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/teacher/note/route.ts#L86-L91)).
- **Observed:** Clerk webhooks require Svix headers and signature verification
  before event handling
  ([webhook route lines 19-66](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/webhooks/route.ts#L19-L66)).
- **Observed:** the global CSP is emitted in report-only mode and currently
  permits broad script sources including `https:`, `http:` and `unsafe-inline`
  ([CSP base lines 157-187](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/config/contentSecurityPolicy.ts#L157-L187),
  [Next header lines 170-180](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/next.config.ts#L170-L180)).
- **Observed:** Oak Components renders `sanitizedHtml` with
  `dangerouslySetInnerHTML` but types it as `string | TrustedHTML`; OWA's wrapper
  sanitises the source with DOMPurify first
  ([component lines 7-9 and 45-63](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/teacher/OakTeacherNotesInline/OakTeacherNotesInline.tsx#L7-L63),
  [OWA wrapper lines 14-39](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/TeacherNoteInline/TeacherNoteInline.tsx#L14-L39)).

**Inherited assumption exposed:** authentication provider presence does not
establish authorisation, and a prop name does not establish sanitisation.
Identifiers, provider sessions, signed webhooks, network perimeter controls and
trusted values are different capability forms.

### Movement 2: define the problem space

**Problem frame:** Oak must preserve confidentiality, integrity, availability
and safeguarding across public content, minors' progress, teacher notes,
accounts, third-party callbacks, analytics and consumer-rendered HTML. The gap
is an explicit capability and trust-boundary model linking actor, subject,
operation, proof, lifetime, delegation, revocation and audit. Harm includes data
disclosure, cross-subject mutation, injection, unsafe administration and
telemetry that violates consent. Success is least authority with explicit
boundary validation and independently testable denial, not simply successful
login or schema parsing.

### Movement 3: reflect on possible solutions

**Competing explanation:** `sid_key` and note IDs may deliberately form an
unguessable capability for anonymous pupil journeys; batch redaction may be
protected by a platform, gateway or private invocation policy outside this
repository. Report-only CSP may be a staged route to enforcement. None is
established as a vulnerability by source shape alone.

**Changed assumption:** subject identity and capability authority can exist
without a named account, while an authenticated session can still lack the
right capability. Threat analysis must include platform and provider controls,
not only route code.

### Movement 4: synthesise and propose

**Synthesis:**

- **Observed:** OWA uses session middleware, capability-like identifiers,
  signatures, schemas, DLP, origin checks and CSP reporting at different
  boundaries.
- **Inferred:** authorisation policy is distributed and cannot be reconstructed
  reliably from the presence of Clerk alone.
- **Inferred:** the trusted-HTML seam is deliberately split between OWA
  sanitation and component rendering, but the component type permits an
  unbranded string and therefore relies on consumer discipline.
- **Unknown:** entropy and disclosure paths of capability identifiers,
  platform-level route protection, CSP violation rates, retention, audit and
  incident evidence.

The key seams are **identity -> capability -> authorised operation**, **untrusted
value -> validated/sanitised value -> dangerous sink**, and **application route
-> platform perimeter**.

| Warranted investigation                                                                                                                                                                       | Warrant                                                                        | Falsifier                                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Produce a capability matrix for every non-public route and state transition, including anonymous subjects, administrative operations, provider callbacks, platform controls and denial tests. | Middleware and route-local checks do not form one visible authorisation model. | Existing generated policy already proves subject, operation, capability, expiry, revocation and denial at every boundary, including platform rules. |
| Trace every dangerous browser sink and externally supplied content value to a branded validation/sanitisation boundary, then test bypasses.                                                   | One current contract relies on a conventionally named plain string.            | The type and runtime enforcement make unsanitised construction impossible across every consumer and sink.                                           |

**Unresolved evidence:** deployment protection and WAF rules; Clerk middleware
configuration and route policy; datastore security rules; capability entropy;
secret rotation; retention/deletion obligations; abuse cases; CSP reports;
penetration tests; and safeguarding threat models.

---

## Lens 9: observability, operability and the control plane

### Governing question

Can an operator tell which user outcome and architectural stage failed, explain
why, take a bounded corrective action and verify recovery without relying on
private intuition?

### Movement 1: reflect on raw observations

- **Observed:** OWA's common error reporter adds context and metadata, suppresses
  duplicate or non-notifiable errors, respects browser consent, and selects
  Sentry or Bugsnag according to configuration
  ([error reporter lines 69-99](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/common-lib/error-reporter/errorReporter.ts#L69-L99),
  [lines 107-155](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/common-lib/error-reporter/errorReporter.ts#L107-L155)).
- **Observed:** Sentry attaches release and environment, avoids default PII and
  samples traces at `0.2`
  ([Sentry config lines 39-71](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/common-lib/error-reporter/sentry.ts#L39-L71));
  Bugsnag attaches version/stage, disables IP collection and routes notification
  endpoints through Oak domains
  ([Bugsnag config lines 45-86](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/common-lib/error-reporter/bugsnag.ts#L45-L86)).
- **Observed:** PostHog analytics queues events, reconciles a legacy anonymous
  ID, exposes session ID and changes capture state with consent
  ([PostHog adapter lines 20-58](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/posthog/posthog.ts#L20-L58),
  [lines 70-102](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/posthog/posthog.ts#L70-L102)).
- **Observed:** deployment-status events trigger deployed accessibility and
  visual checks, and the workflow writes custom statuses so results from
  multiple environments are retained
  ([deployment checks lines 67-115](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/workflows/post_deployment_actions.yml#L67-L115),
  [lines 117-176](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/workflows/post_deployment_actions.yml#L117-L176)).
- **Observed:** OWA's Terraform drift workflow covers separate website and
  Storybook workspaces and sends drift information to Slack
  ([drift workflow lines 11-32](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/workflows/terraform_vercel_drift.yml#L11-L32)).
- **Observed:** Oak Components has no application runtime telemetry layer in its
  tracked source. Storybook is configured with docs, accessibility and themes
  ([Storybook config lines 10-32](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.storybook/main.ts#L10-L32)).
- **Inferred:** Storybook is the primary runtime inspection surface visible in
  the repository; its public availability and actual use are not established by
  that configuration.

**Inherited assumption exposed:** telemetry volume and vendor dashboards are not
observability. Observability requires a question-to-signal path; operability
also requires authority and a safe control which changes the system.

### Movement 2: define the problem space

**Problem frame:** Oak needs to explain failures and degradation across browser,
router, cache, service, provider, deployment and consumer-package boundaries.
The gap is correlation between a user outcome, request/transition stage,
release, environment, dependency and deployed artefact, plus a documented
control and recovery confirmation. Users and operators are harmed by consent-
shaped blind spots, duplicate vendor semantics, unowned alerts, noisy errors and
controls which cannot be tied back to recovery. Success is fast, evidence-based
detection, diagnosis, action and verification for declared outcomes, not total
collection.

### Movement 3: reflect on possible solutions

**Competing explanation:** the missing correlations, dashboards, alerts and
runbooks may live appropriately in managed platforms and private operational
systems rather than source. Dual error providers may be a controlled migration
or resilience choice. A component library should usually expose semantic events
and deterministic behaviours, not choose a telemetry vendor.

**Changed assumption:** source-visible instrumentation is only one part of the
control loop. The investigation must connect emitted events to retained data,
alert policy, human ownership, mitigation authority and recovery evidence.

### Movement 4: synthesise and propose

**Synthesis:**

- **Observed:** OWA emits product, error, trace, CSP, deployment and drift
  signals through several systems.
- **Inferred:** the signals are richer than a simple error-reporting layer but
  are organised by tool and lifecycle event rather than an explicit outcome
  control model.
- **Inferred:** consent is correctly a telemetry boundary, which also means
  absence of browser evidence cannot automatically mean absence of failure.
- **Unknown:** alert definitions, on-call ownership, trace propagation,
  dashboards, retention, cardinality, diagnostic success and control use.

The key seam is **outcome event -> correlated signal -> retained explanation ->
alert/decision authority -> bounded control -> verified recovery**.

| Warranted investigation                                                                                                 | Warrant                                                               | Falsifier                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Reconstruct the complete control loop for three incidents or synthetic failures from user symptom to verified recovery. | Repository evidence stops at emission, checks and drift notification. | Existing operational records consistently correlate outcome, release, dependency and action within declared detection/recovery objectives. |
| Inventory signals and controls by outcome and stage, including consent-off and provider-down blind spots.               | Tool-specific telemetry can leave architectural stages unobserved.    | Every critical stage has a minimal, privacy-compatible signal and an owned corrective control, with proven fallback observation.           |

**Unresolved evidence:** vendor dashboards and alerts; logs and trace IDs;
sampling bias; on-call/runbooks; incident timelines; feature-flag controls;
deployment rollback; data retention; telemetry cost; and whether Storybook usage
or component failures are observed outside OWA.

---

## Lens 10: assurance epistemology and claims-to-evidence correspondence

### Governing question

What exactly is each test, review, scan or deployment check evidence for, what
could it invalidate, and does that evidence have authority over release or
promotion?

### Movement 1: reflect on raw observations

- **Observed:** OWA's code workflow separates format/lint/type checks from Jest
  and Sonar and explicitly labels the tests as unit tests with no integration
  tests
  ([code checks lines 14-46](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/workflows/code_checks.yml#L14-L46),
  [lines 48-80](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/workflows/code_checks.yml#L48-L80)).
- **Observed:** OWA's testing guide says manual evaluation is vital but outside
  the automated lifecycle, and says Playwright CI wiring is follow-up work
  ([testing guide lines 1-9](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/docs/testing.md#L1-L9),
  [lines 38-71](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/docs/testing.md#L38-L71)).
- **Observed:** the current Playwright suite contains one teacher-flow spec with
  two download-path tests
  ([lesson journey lines 1-40](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/tests/e2e/teacher/lesson-page.spec.ts#L1-L40)).
- **Observed:** Pa11y runs against selected deployment URLs but excludes several
  third-party elements and three rule classes, recording reasons
  ([Pa11y config lines 19-61](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/pa11yci.config.js#L19-L61),
  [lines 71-89](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/pa11yci.config.js#L71-L89)).
- **Observed:** Oak Components Verify runs format, lint, types, build, Jest and
  Sonar before the release workflow can publish
  ([Components Verify lines 10-39](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/verify.yml#L10-L39),
  [release condition lines 1-20](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/release.yml#L1-L20)).
- **Observed:** the Components template asks for a render assertion and snapshot,
  while the repository also holds 190 stories, 223 test files and 177 snapshot
  files in the pinned-tree inventory
  ([template test lines 8-21](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/CopyPasteThisComponent/CopyPasteThisComponent.test.tsx#L8-L21)).

**Inherited assumption exposed:** a large test or story count is not a quality
claim, and a green workflow is not evidence for outcomes its checks cannot
observe. Conversely, narrow tests can be excellent evidence for narrow claims.

### Movement 2: define the problem space

**Problem frame:** each important outcome needs a falsifiable claim, plausible
failure mechanisms, the cheapest evidence able to expose them, and a gate with
appropriate authority. The gap is visible correspondence between claims and
checks across package source, built artefact, consuming application, deployed
system and lived human experience. Harm arises from false confidence, tests
coupled to implementation, snapshots accepted without semantic review, and
post-deployment findings that do not prevent promotion. Success is justified
belief proportional to risk, including explicit residual uncertainty, not
maximum coverage.

### Movement 3: reflect on possible solutions

**Competing explanation:** the current layers may intentionally partition
evidence well: component behaviour in Jest/Storybook, application projections in
unit tests, and rendered deployments in Percy/Pa11y. GitHub branch protection,
Vercel promotion and human review may supply the missing authority outside the
repository.

**Changed assumption:** the object of assurance is not a file or component; it
is a claim about an outcome at a version and environment. Evidence must be
evaluated for sensitivity, independence, representativeness and gating power.

### Movement 4: synthesise and propose

**Synthesis:**

- **Observed:** both repositories have substantial multi-layer assurance
  machinery, and Components gates publication on its Verify result.
- **Inferred:** OWA has a gap between numerous unit/static checks and sparse
  executable cross-system journeys; post-deployment checks observe only a
  selected URL/profile set.
- **Inferred:** package tests do not alone warrant compatibility in OWA, as shown
  by the documented local-package test workflow
  ([Components README lines 72-84](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L72-L84)).
- **Unknown:** required GitHub statuses, promotion gates, snapshot review
  discipline, mutation sensitivity, flaky-test policy and manual sign-off.

The key seam is **outcome claim -> failure mechanism -> observing layer ->
executed evidence -> release/promotion authority -> residual uncertainty**.

| Warranted investigation                                                                                                                           | Warrant                                                       | Falsifier                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Build a claims-to-evidence matrix for critical outcomes and shared component contracts, recording negative cases, environment and gate authority. | Tool inventories do not establish evidential correspondence.  | Every critical claim already maps to a sensitive, executed, representative and promotion-authoritative check with explicit residual risk. |
| Seed representative semantic, accessibility, integration and release faults to measure which checks fail and when.                                | Configuration and coverage can overstate effective detection. | The intended cheapest layer reliably rejects each seeded failure before the claimed outcome can be promoted.                              |

**Unresolved evidence:** branch protection and promotion rules; actual workflow
history; coverage and mutation reports; flaky/quarantined tests; Percy approval;
manual exploratory records; consumer contract tests; production verification;
and which exclusions remain justified.

---

## Lens 11: supply chain, provenance, portability and vendor independence

### Governing question

Can Oak establish what code and service produced an outcome, trust that chain,
replace or operate critical dependencies, and preserve its data and semantics
without an uncontrolled rewrite?

### Movement 1: reflect on raw observations

- **Observed:** the pinned OWA package declares 100 entries under `dependencies`
  in the local inventory, spanning identity, storage, classroom, CMS, media,
  analytics, error reporting, search/model, cache, UI and document generation;
  representative vendor bindings are visible together
  ([OWA package lines 84-123](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/package.json#L84-L123)).
- **Observed:** OWA's build configuration says production classification depends
  on a Vercel environment variable and explicitly notes failover would require
  changes
  ([environment writer lines 45-64](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/scripts/build/write_env_file/index.ts#L45-L64)).
- **Observed:** Oak Components' Rollup configuration declares ESM, CommonJS,
  source-map and type-bundle outputs from one source root, externalising peers
  while bundling resolved non-peer implementation imports
  ([Rollup lines 12-43](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/rollup.config.js#L12-L43)).
- **Observed:** Oak Components' release job requests the provenance-capable
  `id-token: write` permission and checks installed registry signatures before
  semantic release
  ([release workflow lines 13-20](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/release.yml#L13-L20),
  [lines 28-48](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/release.yml#L28-L48)).
- **Observed:** both repos use SHA-pinned Oak Terraform actions, while some
  general GitHub actions are referenced by mutable major tags; Components
  Dependabot covers actions, npm and selected Terraform modules
  ([Components Verify lines 15-27](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/verify.yml#L15-L27),
  [Dependabot lines 1-34](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/dependabot.yml#L1-L34)).
- **Observed:** Oak Components is MIT-licensed but Oak marks and logos are not
  included in that grant; external code contributions are not currently
  accepted
  ([Components README lines 144-162](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L144-L162)).

**Inherited assumption exposed:** open source, a lockfile and multiple providers
do not by themselves create supply-chain trust or operational independence.
Portability includes semantics, data, assets, build/release controls, expertise
and contractual exit, not only replaceable imports.

### Movement 2: define the problem space

**Problem frame:** Oak must know and reproduce the source-to-outcome chain,
respond to compromised or abandoned dependencies, and retain the ability to move
critical capabilities without losing public identity, data or service quality.
The gap is outcome-level provenance and substitutability evidence across npm,
GitHub Actions, hosted platforms, asset CDNs and SaaS APIs. Users and maintainers
are harmed by tampered builds, emergency upgrades, opaque transitive code,
semantic lock-in and failover that exists only in principle. Success is verified
provenance plus proportionate exit and continuity options, not zero external
dependencies.

### Movement 3: reflect on possible solutions

**Competing explanation:** specialist managed services and framework integration
may deliver higher reliability, security and accessibility than locally owned
substitutes. OIDC provenance, signatures, lockfiles, generated clients and
provider-specific adapters may already be a strong risk-adjusted posture.

**Changed assumption:** vendor independence is the ability to make a deliberate
choice under pressure, not avoidance of vendors. Some dependencies warrant a
portable contract and data export; others warrant only provenance, monitoring
and a documented loss boundary.

### Movement 4: synthesise and propose

**Synthesis:**

- **Observed:** dependency automation, signature checking, provenance-capable
  OIDC permission, locked package graphs and pinned Oak infrastructure actions
  exist. An emitted or retained release attestation is not established.
- **Inferred:** OWA's operational portability is constrained by build-stage and
  runtime provider semantics even where code has adapters.
- **Inferred:** Oak Components is portable at the registry/module level but
  intentionally couples its supported host profile to React, Next,
  styled-components, Oak assets and some bundled implementation libraries.
- **Unknown:** SBOM/attestation retention, reproducible-build equality, licence
  review, vendor exit terms, data exports, dependency criticality and recovery
  exercises.

The key seam is **source/dependency identity -> verified build provenance ->
deployed artefact -> provider semantics/data -> substitutable outcome**.

| Warranted investigation                                                                                                                                 | Warrant                                                                                          | Falsifier                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Generate and verify an outcome-oriented SBOM/provenance chain for OWA and the published Components tarball, including bundled code and deployed digest. | Release signatures do not alone connect source, package contents, consumer build and deployment. | Existing attestations already provide verifiable source-to-deployment identity, complete bundled dependency inventory and retained evidence.            |
| Run tabletop and bounded technical exit exercises for identity, hosting, assets, content, analytics and the component styling/runtime profile.          | Source comments explicitly qualify failover and several contracts embed provider semantics.      | Each critical provider has a recently proven substitute or acceptable loss mode within declared continuity objectives and with data/identity preserved. |

**Unresolved evidence:** registry attestations and tarball contents; deployment
digests; SBOMs; licences of bundled dependencies; provider contracts and export;
secret provenance; vulnerability response history; mirror/offline strategy; and
the actual consumers' framework constraints.

---

## Lens 12: sustainability and resource externalities

### Governing question

What compute, transfer, storage, device work, third-party processing and human
attention are consumed per unit of educational value, and where are those costs
shifted to users, suppliers or future maintainers?

### Movement 1: reflect on raw observations

- **Observed:** OWA deploys to three declared regions
  ([`vercel.json` lines 1-4](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/vercel.json#L1-L4)).
- **Observed:** OWA uses a two-hour default cross-request cache and documents the
  need to avoid caching transformed shapes which outlive their schema
  ([cache wrapper lines 3-23](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cache/index.ts#L3-L23)).
- **Observed:** generated curriculum downloads may create multiple in-memory
  files and a zip per miss, then publish a durable stale-while-revalidate result
  ([download route lines 330-387](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L330-L387)).
- **Observed:** production and preview builds generate source maps unless
  disabled, and production uploads them to the configured error service
  ([Next config lines 294-350](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/next.config.ts#L294-L350)).
- **Observed:** Oak Components' Rollup configuration declares parallel ESM and
  CommonJS artefacts, source maps and a declaration bundle
  ([Rollup lines 12-43](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/rollup.config.js#L12-L43));
  its Terraform declares a separate Vercel project for Storybook
  ([Components infrastructure lines 14-27](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/infrastructure/project/main.tf#L14-L27)).
- **Observed:** after excluding curricular subject matter, a repository-wide
  static search at both pins found no engineering carbon, energy, emissions or
  resource-budget definition. Absence of a source record is not evidence that
  Oak has no organisational sustainability practice.

**Inherited assumption exposed:** caching, server rendering, client rendering,
multi-region deployment and reuse are not inherently sustainable or
unsustainable. Each moves resource consumption among infrastructure, network,
device, build pipeline and human maintenance.

### Movement 2: define the problem space

**Problem frame:** educational value should be delivered with proportionate
whole-system resource use and without shifting avoidable cost onto constrained
devices, networks, suppliers or future teams. The gap is a functional unit and
measurement boundary: for example, a successful lesson-resource discovery and
use, not a server request or repository build. Harm includes unnecessary bytes
and device energy, duplicated recomputation, retained data, idle replicated
capacity, excessive CI/build work and engineering attention consumed by
mechanism churn. Success is excellent outcomes with measured, intentionally
allocated resource use and acknowledged trade-offs, not a generic "green" score.

### Movement 3: reflect on possible solutions

**Competing explanation:** CDN caching, static projections, shared components,
regional proximity and managed infrastructure may already reduce total
resources compared with repeated origin work or bespoke consumers. Redundancy
and source maps may be warranted by availability and faster incident recovery.

**Changed assumption:** sustainability cannot be collapsed into minimising cloud
compute. Device lifespan, accessibility, network constraints, operational
recovery, staff attention and avoided duplicate product work can dominate a
narrow hosting estimate.

### Movement 4: synthesise and propose

**Synthesis:**

- **Observed:** architecture makes consequential allocation choices through
  regions, cache lifetimes, artefact generation, payload/runtime dependencies
  and configured deployment topology and triggers.
- **Inferred:** some mechanisms amortise work across users while others duplicate
  build, storage or client/runtime cost; direction and magnitude are unmeasured.
- **Inferred:** a kit can reduce ecosystem duplication, but only if its
  abstractions do not impose unused runtime and upgrade work on each consumer.
- **Unknown:** energy/carbon factors, transfer and device cost, cache efficiency,
  data retention, CI consumption, supplier reporting and educational value per
  resource unit.

The key seam is **educational outcome -> functional unit -> whole-lifecycle
resource use -> externalised cost -> measured trade-off**.

| Warranted investigation                                                                                                                             | Warrant                                                                           | Falsifier                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Define representative educational functional units and measure build, origin, CDN, transfer, device and retained-data resources for cold/hot paths. | Current mechanism choices expose resource implications but no common denominator. | Existing audited measurements already cover the whole lifecycle and show the proposed units would not alter any material decision.    |
| Compare reuse and consumer autonomy using total ecosystem work: shipped bytes, builds, upgrades, duplicated implementation and incident recovery.   | A kit can either amortise excellence or export unused complexity.                 | Across consumers, both approaches have indistinguishable total resource use and maintenance attention within measurement uncertainty. |

**Unresolved evidence:** hosting and CDN energy data; regional traffic; cache-hit
and invalidation rates; bundle transfer by route; low-end device profiles; CI
minutes; artefact retention; analytics/log retention; supplier emissions; and a
validated measure of educational value served.

---

## Cross-lens synthesis

### What changed when the lenses were combined

**Inferred:** OWA and Oak Components are not merely a runtime application plus a
UI dependency. Together they form a changing product-line and control system:

```text
educational obligation
  -> product and interaction contract
  -> evolving implementation and package boundary
  -> configured runtime and provider capability
  -> queued work and state transition
  -> user-visible outcome or bounded degradation
  -> telemetry and evidence
  -> human or automated control
  -> next architectural change
```

Each arrow can change authority, lifetime, failure domain, team ownership,
resource allocation or evidential strength. Those transitions, rather than the
framework labels, are the deepest structural seams exposed by this pass.

| Cross-lens finding                                                                                              | Status                | Why it matters                                                                                                            |
| --------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| The package boundary is simultaneously a code, runtime, release, team and provenance boundary.                  | **Inferred**          | Optimising only source reuse can worsen adoption, payload, authority or assurance.                                        |
| Migration is a first-class runtime and public-contract state, not work outside the architecture.                | **Observed/Inferred** | Dual roots, deprecations, codemods and release-major offsets actively shape current outcomes.                             |
| Configuration, feature rollout and product-line variability are different binding-time decisions.               | **Inferred**          | Treating all as flags makes valid combinations and ownership difficult to establish.                                      |
| Reliability, security and success all depend on naming the transition stage and authority.                      | **Inferred**          | HTTP acceptance, local projection, provider commit and verified user outcome are not interchangeable.                     |
| Observability and assurance are duals: one explains the running system; the other warrants the proposed change. | **Inferred**          | Both require a claim-to-signal/evidence path and an authority able to act.                                                |
| Performance and sustainability are two views of resource allocation, but use different success functions.       | **Inferred**          | Latency optimisation can shift cost to devices, builds, storage or future maintenance.                                    |
| Repository-visible controls are not the whole control plane.                                                    | **Observed/Unknown**  | Platform policy, branch protection, alerts, ownership and supplier contracts could materially change several conclusions. |

### Load-bearing hypotheses and invalidators

#### H-SO-1: complexity clusters at changes of authority, lifetime and ownership

**Warrant:** provider adapters, caches, migration bridges, route roots,
repo-specific library components and assurance workflows concentrate where one
of those properties changes.

**Invalidator:** a symbol-level change/incident analysis finds complexity and
defects evenly distributed, with no association to those transitions.

#### H-SO-2: the current package boundary is broader than the stable shared contract

**Warrant:** one root exports components, styles, hooks and test helpers; the
package contains extensive OWA product families and requires an OWA-shaped host
profile.

**Invalidator:** consumer analysis shows that these capabilities version,
deploy, fail and evolve together across all intended consumers, and splitting
their contract would increase propagation and inconsistency.

#### H-SO-3: coexistence represents governed evolution and ungoverned residue at once

**Warrant:** explicit codemods, deprecation conventions and old-component
inventories demonstrate governed migration, while convergence criteria and
support horizons are not source-visible.

**Invalidator:** decision records and enforcement show every coexisting stratum
has a current owner, target state, rollback, compatibility horizon and automated
exit signal.

#### H-SO-4: assurance strength is uneven across the source-to-outcome chain

**Warrant:** substantial unit, static, story, visual and accessibility evidence
coexists with one current browser journey spec and follow-up CI wiring.

**Invalidator:** required checks, consumer contract suites, deployment promotion
and production verification outside the inspected files provide sensitive,
authoritative evidence for all critical outcomes.

#### H-SO-5: provider choice is embedded in semantics as well as transport

**Warrant:** feature evaluation, error/consent behaviour, asset paths, hosting
classification, cache headers, webhook subjects and provider-specific fallback
logic affect application policy.

**Invalidator:** replacement exercises show providers can be changed through
narrow adapters with no change to public identity, data, user semantics,
deployment control or assurance.

#### H-SO-6: there is no current whole-system resource model tied to educational value

**Warrant:** caches, regions, bundles, generated artefacts and client work are
configured locally, while no engineering functional unit or resource budget was
found in the pinned trees.

**Invalidator:** organisational or platform evidence supplies audited
outcome-level resource budgets which govern these implementation decisions.

## Highest-information evidence still needed

These are research streams, not a build sequence or target-architecture plan.

| Evidence stream                                      | Lenses it can materially change                      | A no-change result would mean                                                            |
| ---------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Cross-repo symbol/co-change/reviewer graph           | complexity, coupling, evolution, ownership           | Current package and team boundaries already predict change accurately.                   |
| Active migration and compatibility ledger            | complexity, evolution, product line, assurance       | Coexistence is already governed and removable.                                           |
| Consumer/profile variability study                   | coupling, product line, supply chain, sustainability | The intended kit genuinely has one coherent host and capability profile.                 |
| Outcome-level failure and threat injection           | reliability, security, observability, assurance      | Present containment, denial, telemetry and gates correspond to critical claims.          |
| Source-to-deployment control-plane trace             | ownership, observability, assurance, provenance      | External controls close the apparent repository-visible gaps.                            |
| Peak/cold-path queue and whole-resource measurement  | performance, reliability, sustainability             | Local cache, concurrency and deployment decisions already meet explicit outcome budgets. |
| Provider exit and data/identity portability exercise | complexity, reliability, security, supply chain      | Embedded provider semantics are proportionate and deliberately accepted.                 |

## Boundary of this exploration

No lens here establishes that OWA or Oak Components should be repaired,
repackaged, replaced or copied. The evidence establishes questions and
falsifiable current-state hypotheses for OCE. Target choices require OCE's own
intent, consumer profiles, outcome standards and newly gathered evidence; they
must not be reverse-engineered from either the presence or absence of a current
mechanism.
