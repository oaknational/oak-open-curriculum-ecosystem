# Component language and kit boundary

## Scope and method

This record applies the four movements of OCE's
[`concept-exploration`](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/skills/concept-exploration/SKILL-CANONICAL.md)
Practice separately to twelve questions at the OWA/Oak Components boundary.
The source revisions and evidence language are defined in the
[portfolio control record](./README.md).

The reproducible component-boundary inventory was rerun against both clean
pinned trees. It reports 425 public names in current Components source, 169
distinct names imported directly by pinned OWA, 438 analysed OWA files using
Components directly or through OWA's client re-export, and 192 using OWA-local
`SharedComponents`. These are static structural observations, not measures of
render frequency, usefulness or desired package shape; method and qualifications
live in the [boundary report](../component-boundary.md).

## Lens 1: design language and semiotics

**Governing question:** What meanings does Oak's component system enable a
product to express, and when can a visually coherent sign communicate the wrong
action, state, audience or educational meaning?

### Movement 1: reflect on raw observations

**Observed:** Components exposes semantic colour roles such as text, background,
interaction, status and border roles, mapped onto palette values in the default
theme
([default role map](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/styles/theme/default.theme.ts#L3-L98)).
Its guidance says role tokens must be used for their named purpose and asks
authors to return to design when a role is missing
([design guidance](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/designingComponents.mdx#L15-L21)).

**Observed:** The public vocabulary includes broad primitives and controls but
also OWA discourse-level names such as pupil journey, quiz, teacher note,
download and lesson components
([OWA exports](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/index.ts#L1-L42),
[pupil exports](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/index.ts#L1-L5)).
OWA then combines those names with curriculum data, explanatory copy,
navigation, analytics and local interaction state
([programme projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view.tsx#L222-L301)).

**Inherited assumption exposed:** A design system is primarily a visual
consistency mechanism.

### Movement 2: define the problem space

The mechanism-neutral problem is to give independent Oak products a language in
which visual treatment, semantic element, interaction, status, audience and
educational intent agree. The harmed subject is a person who acts on an
incorrect sign, not merely a screen that looks inconsistent. Success is a
recognisable Oak expression whose meaning survives product, viewport, input
modality and assistive technology.

### Movement 3: reflect on possible explanations

The evidence supports at least three strata: vocabulary (tokens and primitives),
grammar (controls and composition rules), and discourse (outcome-specific
recipes). A flat import surface does not make those strata one kind of thing.
Conversely, three strata do not imply three packages. A role token can prevent a
palette mistake but cannot decide whether “success”, “continue”, a link or a
quiz result is the truthful sign for the domain state.

**Changed assumption:** Consistency is a consequence of shared meaning and
rules; shared values alone are insufficient.

### Movement 4: synthesise and propose

**Inferred:** Oak Components contains a partial design language, while OWA
supplies much of the sentence-level meaning. The boundary currently preserves
both genuine shared vocabulary and product-specific utterances. Treating every
export as interchangeable “UI” obscures which authority may define each sign.

**Next investigation:** Build a corpus of representative OWA tasks and annotate
each visible sign with intended meaning, semantic element, state, audience and
source authority. Compare repeated meanings across journeys. **Warrant:** it
distinguishes reusable language from coincidental visual recurrence.
**Falsifier:** if independent reviewers cannot agree on stable meanings, or the
same sign intentionally means materially different things in each context, the
claim that a shared semantic grammar exists must be narrowed.

**Unresolved evidence:** Design rationale, user comprehension studies, brand
research, and whether non-OWA consumers use the vocabulary with the same
meanings.

## Lens 2: composition algebra and validity constraints

**Governing question:** Which combinations of Oak parts remain semantically,
behaviourally and accessibly valid, including combinations the type system
currently permits?

### Movement 1: reflect on raw observations

**Observed:** `OakBox` exposes thirteen families of style capability and an
`onClick` affordance on a styled `div`
([box contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/layout-and-structure/OakBox/OakBox.tsx#L40-L104)).
Polymorphic utilities combine an arbitrary element's React props with an
`element` selector
([polymorphic types](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/polymorphic.ts#L1-L18)).
`OakLink` defaults to an anchor but explicitly supports rendering as a button or
another element
([link contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/navigation/OakLink/OakLink.tsx#L15-L56)).

**Observed:** Library guidance prefers fewer props and more components,
composition, explicit variable props and single responsibility
([component heuristics](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/designingComponents.mdx#L49-L75)).
Some recipes constrain combinations: `OakPupilJourneyLayout` admits a closed set
of section names and two phases, then derives backgrounds and layout from them
([journey contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/browse/OakPupilJourneyLayout/OakPupilJourneyLayout.tsx#L8-L96)).

**Inherited assumption exposed:** More prop flexibility and polymorphism make a
component more reusable.

### Movement 2: define the problem space

The problem is to make valid product composition easy and invalid composition
detectable without closing legitimate variation. The unit is not an individual
component but the rendered interaction and its surrounding state. Failure
includes an allowed prop combination that produces false semantics, broken
focus order, inaccessible activation, incoherent responsive behaviour or an
impossible Oak expression.

### Movement 3: reflect on possible explanations

Primitives, constrained controls, slots and recipes are different ways to place
the validity boundary. A permissive primitive may be correct when a capable
product owner retains semantic responsibility. A recipe may be correct when it
encodes a stable cross-product invariant. “Composable” therefore cannot mean
either unrestricted or preassembled in the abstract.

**Changed assumption:** The key property is closure under valid composition,
not the number of props or pieces.

### Movement 4: synthesise and propose

**Inferred:** Components expresses local prop validity more strongly than
cross-component validity. OWA supplies many of the missing relational rules in
views and feature code. That may be the right authority boundary, but static
source does not show a named algebra of roles, slots, permitted nesting or
whole-interaction invariants.

**Next investigation:** Generate pairwise and stateful compositions for a
sample spanning polymorphic primitives, controls, overlays and pupil recipes;
evaluate semantic HTML, keyboard/focus behaviour, accessible name, responsive
layout and visual-state truthfulness. **Warrant:** it tests the boundary where
component-level correctness stops composing. **Falsifier:** if current types,
runtime guards and tests reject or correctly render every sampled invalid state,
the claimed missing composition constraint is weakened.

**Unresolved evidence:** Intended escape hatches, supported nesting contracts,
and whether design review or product tests already police combinations outside
this repository.

## Lens 3: public API contracts and compatibility

**Governing question:** What promise does a Components import make to a consumer
beyond compiling against a named TypeScript export?

### Movement 1: reflect on raw observations

**Observed:** The Version 3.0.0 source manifest declares one CJS entry, one ESM
entry and one declaration entry
([package contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/package.json#L1-L14)).
The root re-exports components, styles, test helpers and hooks, while the
component barrel re-exports every public category including OWA recipes
([root exports](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/index.ts#L1-L4),
[component exports](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/index.ts#L1-L14)).
The inventory resolves 425 public names.

**Observed:** Pinned OWA requests Components `^2.45.0`, rather than the inspected
3.0.0 source release
([OWA manifest](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/package.json#L99-L101)).
Component guidance represents deprecation through source comments, JSDoc and a
Storybook title suffix
([deprecation process](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/designingComponents.mdx#L23-L41)).

**Inherited assumption exposed:** Semantic versioning plus TypeScript defines
compatibility.

### Movement 2: define the problem space

The problem is for a consumer to know which source, type, DOM, interaction,
accessibility, visual, runtime, peer and environmental behaviours may be relied
upon, and how those promises change. Success is intentional evolution with no
silent break in an outcome that the compatibility policy claims to preserve.

### Movement 3: reflect on possible explanations

A single root can be a convenient discovery contract while containing several
compatibility classes. A major version can honestly signal deliberate breakage
without teaching migration. Stable types can still change DOM order, focus,
CSS cascade, text, payload or server/client viability. Conversely, freezing
incidental DOM or pixels can prevent legitimate improvement.

**Changed assumption:** Compatibility must name the behaviour and observer; it
is not one scalar property of a package version.

### Movement 4: synthesise and propose

**Inferred:** The current public surface is broader than a conventional
component API: it includes style foundations, product recipes and test support.
Those areas plausibly need different compatibility promises, but the root entry
and release number present one undifferentiated version boundary.

**Next investigation:** Select releases across the current OWA-to-Components
gap and execute a consumer contract matrix: type-check, render, semantic DOM,
keyboard/focus, visual states, SSR/RSC, payload and codemod/migration evidence.
**Warrant:** it discovers the compatibility dimensions consumers actually bear.
**Falsifier:** if a documented policy already predicts every observed break and
consumer verification enforces it before release, the claim of an
undifferentiated contract is false.

**Unresolved evidence:** Release notes, downstream upgrade histories, incident
reports, other consumers and which behaviours teams regard as contractual.

## Lens 4: inversion of control and responsibility ownership

**Governing question:** For every slot, callback, polymorphic element, raw
content or environmental input, which side owns the invariant and has enough
information to uphold it?

### Movement 1: reflect on raw observations

**Observed:** `OakPupilJourneyLayout` receives product-selected `sectionName`,
`phase`, navigation content and children, but chooses the page background and
structural layout
([layout inputs and policy](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/browse/OakPupilJourneyLayout/OakPupilJourneyLayout.tsx#L18-L95)).
Its asset URLs are constructed from environment variables inside Components
([asset resolution](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/browse/OakPupilJourneyLayout/OakPupilJourneyLayout.tsx#L98-L118)).

**Observed:** `OakTeacherNotesInline` accepts a value named `sanitizedHtml` and
inserts it with `dangerouslySetInnerHTML`
([recipe boundary](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/teacher/OakTeacherNotesInline/OakTeacherNotesInline.tsx#L7-L65)).
OWA performs DOMPurify sanitisation before supplying that value
([consumer policy](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/TeacherNoteInline/TeacherNoteInline.tsx#L9-L40)).

**Inherited assumption exposed:** Slots and callbacks automatically decouple a
framework from its consumer.

### Movement 2: define the problem space

The problem is to place each decision with the party that owns its meaning and
has the required context, while making the hand-off explicit and enforceable.
Failure occurs when both sides assume the other validates, announces, secures,
persists or observes an outcome, or when a framework freezes product policy it
cannot legitimately decide.

### Movement 3: reflect on possible explanations

Inversion can transfer content while retaining layout policy, transfer markup
while retaining behaviour, or transfer a security obligation without a runtime
proof. A strongly typed slot is not necessarily a strong responsibility
contract. Conversely, internalising every obligation in a library can make it a
policy owner without the domain data needed to be correct.

**Changed assumption:** The important boundary is the invariant hand-off, not
whether data travels through props, context, children or callbacks.

### Movement 4: synthesise and propose

**Inferred:** Current APIs demonstrate several legitimate control directions,
but responsibility is often communicated by a prop name or repository
knowledge. The sanitised-HTML example is particularly clear: the consumer owns
the security transformation while the recipe owns raw insertion and display.
That can be correct only if the hand-off remains truthful and testable.

**Next investigation:** Produce a responsibility table for a representative
sample: input authority, validation, accessible naming, focus, security,
analytics, recovery and lifecycle. Inject deliberately invalid inputs at every
hand-off. **Warrant:** it identifies confused or duplicated ownership rather
than judging API shape by taste. **Falsifier:** if each obligation has one
documented owner and invalid hand-offs are rejected or safely represented, no
ownership change is warranted.

**Unresolved evidence:** Whether branded `TrustedHTML`, runtime schemas, review
policy or upstream contracts provide guarantees not visible in the sampled
files.

## Lens 5: web-platform alignment and progressive enhancement

**Governing question:** Which Oak outcomes require React and client execution,
and which should retain truthful HTML, navigation and form behaviour when
optional layers are absent, delayed or fail?

### Movement 1: reflect on raw observations

**Observed:** Link and button foundations default to native elements, but their
polymorphic contracts permit changing those elements
([link element contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/navigation/OakLink/OakLink.tsx#L27-L56),
[button element contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/internal-components/InternalButton/InternalButton.tsx#L49-L87)).
The package declares React, React DOM, styled-components, Next and
next-cloudinary peers
([peer contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/package.json#L34-L43)).

**Observed:** OWA's App layout imports Components through a module explicitly
marked `use client`
([client re-export](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/styles/oakThemeApp.ts#L1-L2))
and installs theme, consent, analytics, identity, notification, menu and saved
state around route content
([App composition root](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/layout.tsx#L43-L111)).
The existing runtime experiment found that even a token-only root import from
the installed Components artifact retained React/framework dependencies and
failed in its sampled Server Component; this is a package-boundary observation,
not proof that tokens intrinsically need a client.

**Inherited assumption exposed:** Because the products are React applications,
the component contract begins at hydration.

### Movement 2: define the problem space

The problem is to preserve the strongest available browser semantics and a
coherent core outcome across loading, no-script, failed-script, slow-network,
keyboard, assistive-technology and print states. Success does not require every
enhanced interaction to work without JavaScript; it requires the degradation
policy to be intentional and truthful.

### Movement 3: reflect on possible explanations

Some quiz, drag-and-drop, modal and optimistic interactions genuinely require
client coordination. Navigation, reading, download links, structured content
and ordinary form submission have stronger platform baselines. A common React
API can wrap both, but a common root runtime can erase the distinction for the
consumer.

**Changed assumption:** Platform alignment is an outcome classification, not a
blanket preference for or against client components.

### Movement 4: synthesise and propose

**Inferred:** Components contains substantial native-semantic intent, while its
current distribution and OWA integration make client/runtime capability coarse.
The architectural question is not “remove JavaScript”; it is whether each
outcome declares the minimum capability and its fallback.

**Next investigation:** Run representative reading, navigation, selection,
form, download, quiz and overlay journeys under server HTML only, delayed
hydration, failed chunks and reduced browser APIs. **Warrant:** it observes the
actual capability boundary instead of inferring it from component names.
**Falsifier:** if every relevant outcome is explicitly classified as
client-essential and provides the intended failure/recovery state, a broader
progressive-enhancement contract would add no value.

**Unresolved evidence:** Production hydration failures, user network/device
profiles, crawler behaviour, and which tasks product policy requires before
client readiness.

## Lens 6: responsive and adaptive state space

**Governing question:** Does the UI remain understandable and operable across
the combined state space of viewport, zoom, content, language, input, preference,
media and assistive technology?

### Movement 1: reflect on raw observations

**Observed:** Components defines two numeric breakpoints, three named device
ranges and responsive values as scalar-or-array inputs
([responsive model](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/styles/utils/responsiveStyle.ts#L11-L49)).
Array positions are translated into base CSS followed by minimum-width media
queries
([responsive expansion](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/styles/utils/responsiveStyle.ts#L58-L110)).

**Observed:** `OakPupilJourneyLayout` uses responsive arrays for padding,
height and width while its decorative backgrounds change at the large
breakpoint
([journey responsiveness](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/browse/OakPupilJourneyLayout/OakPupilJourneyLayout.tsx#L25-L94)).
OWA supplies curriculum labels and explanations whose lengths vary with the
selected programme factor
([programme language](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view.tsx#L222-L259)).

**Inherited assumption exposed:** Responsive design is adequately modelled by
mobile, tablet and desktop widths.

### Movement 2: define the problem space

The problem is to preserve task sequence, information hierarchy, target size,
readability, orientation and recovery for relevant combinations of environment
and user capability. The failure signal is an unreachable or misleading state,
not a mismatch against one screenshot width.

### Movement 3: reflect on possible explanations

Viewport breakpoints are one useful projection of a larger state space. Content
length, browser zoom, text spacing, motion preference, contrast preference,
pointer precision, virtual keyboard, orientation and embedded contexts can be
independent axes. More media queries are not necessarily the solution; intrinsic
layout and simpler information structures can remove states.

**Changed assumption:** Adaptation should follow the constraint that changes,
not an inferred device category.

### Movement 4: synthesise and propose

**Inferred:** The current responsive API is compact and predictable for width,
but its positional arrays encode a global breakpoint model and do not establish
whole-interaction robustness. Recipe and product evidence is needed before
deciding whether that is an appropriate kit contract.

**Next investigation:** Derive scenario sets from actual content extremes and
user/browser preferences, then test representative primitives, controls and
complete OWA projections using pairwise coverage plus targeted worst cases.
**Warrant:** it tests independent axes without pretending to exhaust their full
Cartesian product. **Falsifier:** if failures correlate only with the existing
two width thresholds and intrinsic/content/preference states add no distinct
failure, the broader adaptation model is unnecessary for those outcomes.

**Unresolved evidence:** Real content distributions, supported locales, device
and zoom analytics, assistive-technology research and embedded consumer needs.

## Lens 7: tokens, themes and policy encoding

**Governing question:** Which design decisions are authoritative policy, which
are reusable values, and which must remain contextual product judgement?

### Movement 1: reflect on raw observations

**Observed:** The Components theme type contains a name and a UI-role colour map
([theme type](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/styles/theme/theme.ts#L1-L12)),
while its style index separately exports colour, spacing, shadow, opacity,
transition, border, typography and z-index tokens
([theme exports](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/styles/theme/index.ts#L1-L38)).
The default role map distinguishes text, background, icon, border, interaction
and status roles
([role mapping](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/styles/theme/default.theme.ts#L3-L98)).

**Observed:** OWA retains a separate, wider legacy theme containing raw colours,
contrast mappings, component-specific state maps and font configuration
([OWA theme contract](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/styles/theme/types.ts#L137-L275)).
The Pages root installs both its styled-components theme and the Components
theme
([dual theme roots](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/_app.tsx#L45-L88)),
while the App root configures third-party Clerk appearance using raw values
([third-party appearance](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/layout.tsx#L58-L94)).

**Inherited assumption exposed:** A token is itself a design decision and a
theme is one coherent layer.

### Movement 2: define the problem space

The problem is to preserve the reason behind a visual or interaction decision
across products and technologies. A valid system must distinguish stable intent
from replaceable value, constrain misuse, support necessary themes and external
surfaces, and still permit product-specific judgement. Failure is a token-valid
screen that violates contrast, hierarchy, status truthfulness or brand intent.

### Movement 3: reflect on possible explanations

Raw scales, semantic roles, component variants and product recipes encode
different scopes of policy. A theme can swap values without making every role
contextually valid. A component can hard-code a role to protect an invariant,
or expose it when variation is legitimate. Third-party theming can require a
translation rather than sharing the runtime token mechanism.

**Changed assumption:** Token coverage measures available vocabulary, not the
completeness or correctness of design governance.

### Movement 4: synthesise and propose

**Inferred:** Current source carries design decisions in several forms: semantic
role names, raw scales, component-fixed variants, two runtime theme models,
global CSS and provider-specific configuration. Some duplication may be
migration residue; some expresses genuinely different policy scopes. Naming all
of it “tokens” would discard that distinction.

**Next investigation:** Trace a sample of decisions such as focus, error,
disabled, selected, pupil phase and third-party identity from design intent to
every rendered technology. Mutate underlying values and roles, then test
contrast, state distinction and meaning. **Warrant:** it reveals whether the
stable contract is value, role, component rule or product policy.
**Falsifier:** if one existing semantic mapping governs all sampled surfaces and
automated checks reject every invalid substitution, the multi-authority account
is overstated.

**Unresolved evidence:** Design-source provenance, ownership of role names,
theme requirements for future consumers and whether dark theme is a supported
product contract or catalogue demonstration.

## Lens 8: build, distribution and runtime boundaries

**Governing question:** When a consumer imports one capability, what code,
runtime, side effect and framework obligation actually crosses the boundary?

### Movement 1: reflect on raw observations

**Observed:** Rollup is configured to build one source entry into one ESM file,
one CJS file and one declaration file; peers are externalised but source
categories are not separate entries
([Rollup build](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/rollup.config.js#L12-L43)).
The manifest exposes `main`, `module` and `types`, with no `exports` map in the
inspected source
([package entries](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/package.json#L1-L14)).

**Observed:** The reproducible runtime experiment found a roughly 94 KB gzip
isolated floor for a token, `OakBox` or a primary button imported from OWA's
installed 2.45.0 ESM artifact; token and primitive Server Component probes
failed through the root dependency graph. Version 3.0.0 source was not built in
that experiment, so equivalent bytes and behaviour remain **Unknown**. OWA also
provides a client-marked re-export of the root
([client re-export](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/styles/oakThemeApp.ts#L1-L2)).

**Inherited assumption exposed:** Named imports and peer dependencies make
runtime boundaries correspond to source concepts.

### Movement 2: define the problem space

The problem is for every consumer environment to receive only the capabilities,
effects and framework contracts required for its outcome, with deterministic
resolution and useful diagnostics when the environment is incompatible.
Failure includes unnecessary client code, server/client ambiguity, retained
framework peers, duplicated styling runtime, or an import that works only by
bundler convention.

### Movement 3: reflect on possible explanations

A single release unit can still expose precise entries; multiple packages can
still share one accidental graph. Tree shaking can solve unused declarations
but not eager module construction, side effects or client-boundary ambiguity.
Conversely, production chunking and long-lived caching may make an alarming
isolated artifact result irrelevant to real outcomes.

**Changed assumption:** Distribution is an executable architecture contract,
not packaging aftercare and not synonymous with package count.

### Movement 4: synthesise and propose

**Inferred:** Current source categories are more precise than the published
runtime boundary. The existing measurement supports investigating that mismatch,
but does not prove production harm or a desired number of entries.

**Next investigation:** Compare the existing root with competing single-release
entry graphs in representative OWA and independent kit-consumer builds. Measure
module ownership, emitted client/server code, cache reuse, side effects,
resolution failures and diagnostics. **Warrant:** it tests the delivery contract
without presupposing packages. **Falsifier:** if production-grade builds already
isolate every capability and current resolution is explicit across supported
environments, changing entry topology has no demonstrated value.

**Unresolved evidence:** Version 3.0.0 published artifacts, real route chunks,
cache behaviour, non-Next consumers and acceptable runtime environments.

## Lens 9: framework-consumer cognition, diagnostics and teachability

**Governing question:** Can a capable but unfamiliar team choose and use the
right Oak capability without reconstructing hidden policy from source, Slack or
OWA precedent?

### Movement 1: reflect on raw observations

**Observed:** Organisational guidance tells uncertain authors to ask in an Oak
Components Slack channel and makes the author responsible for moving a
repo-specific component when reuse arises
([placement guidance](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/organisationalStructure.mdx#L5-L13)).
It classifies components by broad UI category, internal reuse and repository
specificity
([category model](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/organisationalStructure.mdx#L15-L62)).

**Observed:** Creation guidance recommends copying a template
([template instruction](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/designingComponents.mdx#L71-L75));
naming guidance uses `Oak` as the public/internal distinction and documents
token/style naming rules
([naming model](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/namingConventions.mdx#L5-L31),
[style names](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/namingConventions.mdx#L33-L77)).
The root currently resolves to 425 public names.

**Inherited assumption exposed:** Discoverability is principally naming plus a
catalogue.

### Movement 2: define the problem space

The problem is to help consumers form a correct mental model, choose the right
level of abstraction, satisfy hidden obligations and diagnose failure with
bounded effort. Success includes knowing when no component is appropriate.
Failure is a plausible, compiling implementation that violates an Oak contract
or requires maintainers to supply oral history.

### Movement 3: reflect on possible explanations

Autodocs, examples, types, lint rules, generators, recipes, compiler errors and
runtime diagnostics teach in different moments. A large public vocabulary can
be excellent when organised around consumer tasks; a small API can be opaque if
its abstractions hide policy. Slack can provide valuable collaborative judgement
while also revealing knowledge not yet encoded in the kit.

**Changed assumption:** Developer experience is correctness support across a
decision journey, not API terseness or documentation quantity.

### Movement 4: synthesise and propose

**Inferred:** Current material teaches implementation conventions more directly
than outcome selection, boundary ownership and complete-product obligations.
OWA source remains a likely source of examples, but copying it can also copy
historical constraints.

**Next investigation:** Ask unfamiliar teams to complete representative tasks:
choose a control, create a responsive composition, integrate a product recipe,
handle an adverse state and decide where new policy belongs. Record decisions,
source navigation, errors and requests for human help. **Warrant:** cognition is
an observed consumer outcome, not inferable from API size. **Falsifier:** if
teams consistently reach correct, complete results using only supported kit
surfaces and diagnostics, the claimed hidden-policy burden is false.

**Unresolved evidence:** Actual support questions, onboarding time, consumer
personas, external partner constraints and which decisions maintainers intend to
remain human-reviewed.

## Lens 10: governance, versioning, deprecation and institutional memory

**Governing question:** How does an Oak interaction contract acquire authority,
change intentionally, teach migration and eventually cease to exist?

### Movement 1: reflect on raw observations

**Observed:** Components uses semantic-release from `main`; the release workflow
runs only after the Verify workflow succeeds and requests npm provenance
permissions
([release trigger and authority](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/release.yml#L1-L20),
[release execution](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/release.yml#L28-L48)).
The manifest derives releases from commits and publishes to npm
([release configuration](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/package.json#L126-L145)).

**Observed:** Deprecation guidance requires comments, JSDoc and catalogue naming,
but does not state a removal threshold or consumer migration proof
([deprecation guidance](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/designingComponents.mdx#L23-L41)).
Pinned OWA remains on the 2.x line while current Components source is 3.0.0
([consumer version](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/package.json#L99-L101)).

**Inherited assumption exposed:** Automated, semantically versioned publication
is the governance system.

### Movement 2: define the problem space

The problem is to decide which party may change meaning, behaviour or support;
preserve the evidence for that decision; coordinate affected consumers; and
remove obsolete surface without surprise or permanent sediment. Failure can be
a technically valid release that breaks product meaning, or a safe deprecation
that never becomes removable.

### Movement 3: reflect on possible explanations

Commit-derived versioning gives repeatable release mechanics but cannot itself
establish product authority. Central ownership may protect cross-product
semantics; capability ownership may keep recipes aligned with the outcome.
Automated migration can preserve syntax while human review protects changed
meaning. No one mechanism answers all three.

**Changed assumption:** Release, compatibility and governance are related but
separate state machines.

### Movement 4: synthesise and propose

**Inferred:** Components has a clear publication path and visible deprecation
conventions. Static source does not establish how an API is admitted, which
consumer evidence authorises a breaking change, or when a deprecation is safe to
remove. The 2.x/3.x gap is a useful case, not evidence of governance failure by
itself.

**Next investigation:** Reconstruct a sample of introduced, changed, deprecated
and removed contracts across history, including design/product authority,
consumer migrations, incidents and release evidence. **Warrant:** lifecycle
history discriminates intentional evolution from accumulated surface.
**Falsifier:** if every sample has an explicit owner, decision record, affected
consumer set, compatibility evidence and completed removal policy, the missing
governance hypothesis is rejected.

**Unresolved evidence:** Branch protections, npm provenance results, release
notes, ownership records, current migration work and non-OWA consumers.

## Lens 11: boundary placement, escape hatches and consumer diversity

**Governing question:** Which responsibilities belong in shared Oak framework,
product capability, application composition or the web platform, and what
variation must remain possible without duplicating policy?

### Movement 1: reflect on raw observations

**Observed:** Components guidance defines shared components partly by genericity
or use by more than one repository. It says repo-specific components should
normally live in their repository, except when they require non-exported
Components internals
([boundary guidance](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/organisationalStructure.mdx#L10-L62)).
The static inventory found 80 OWA-recipe component directories and 27 recipe
files importing non-exported internals.

**Observed:** OWA itself has a “Kitchen” for components expected eventually to
move to Components; its note combines curriculum-team control, cross-team use
and API review
([OWA Kitchen contract](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/CurriculumComponents/OakComponentsKitchen/README.md#L1-L10)).
OWA also has 192 analysed files consuming local `SharedComponents`, with 151
also consuming Oak Components.

**Inherited assumption exposed:** Reuse count, generic appearance or access to
internals determines the right framework boundary.

### Movement 2: define the problem space

The problem is to place responsibility according to semantic authority,
invariant, lifecycle, failure isolation and legitimate consumer variability.
Success permits independent products to create excellent Oak outcomes without
copying hidden policy or being captured by OWA-specific workflow. Failure occurs
both when shared obligations drift locally and when product policy becomes a
framework release dependency.

### Movement 3: reflect on possible explanations

An escape hatch can be evidence of necessary consumer ownership, an incomplete
framework contract, or a bypass around an overconstrained abstraction. Product
recipes can centralise genuine cross-product outcome knowledge or relocate OWA
composition for access to internals. Additional consumers are an intended kit
outcome, so lack of a second current consumer cannot settle placement.

**Changed assumption:** The framework/product question is not an extraction
threshold. It is a decision about authority and supported variation.

### Movement 4: synthesise and propose

**Inferred:** Current placement rules mix reuse, source accessibility, team
practice and product specificity. Those rules explain some repository movement
but cannot by themselves justify the enduring Innovation Kit boundary. The
overlap between Oak Components and OWA-local shared UI is evidence of multiple
composition roles, not automatically duplication.

**Next investigation:** Sample changes across foundations, controls, recipes and
local shared UI; record reason for change, approving authority, affected
consumers, invariant, release cadence, required escape and failure blast radius.
Test at least two intentionally different consumer profiles. **Warrant:** change
semantics reveal ownership better than static reuse. **Falsifier:** if current
placement consistently matches one authority/lifecycle model and every escape
maps to documented supported variation, no boundary revision is warranted.

**Unresolved evidence:** Intended kit consumers, current team ownership,
cross-repository change history, reasons for recipe placement and which local
components are temporary migration strata.

## Lens 12: documentation and examples as executable contract

**Governing question:** Do the examples teach a complete, valid Oak outcome, and
what evidence detects when taught behaviour drifts from runtime behaviour?

### Movement 1: reflect on raw observations

**Observed:** Storybook discovers stories and MDX, includes accessibility,
themes and documentation addons, and generates prop documentation
([catalogue configuration](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.storybook/main.ts#L10-L32)).
Its preview installs themes and global styles and orders documentation,
components, internal components, OWA recipes, tokens and test helpers
([preview contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.storybook/preview.tsx#L37-L88)).

**Observed:** `OakLink` stories demonstrate variants, button polymorphism,
icons, disabled/loading states, typography and wrapping
([link stories](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/navigation/OakLink/OakLink.stories.tsx#L11-L114)).
Its colocated unit test only snapshots a default rendering
([link test](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/navigation/OakLink/OakLink.test.tsx#L1-L13)).
The Verify workflow runs format, lint, type, build, Jest and Sonar, but source
does not show a Storybook build or interaction test in that workflow
([verification steps](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/verify.yml#L29-L38)).

**Inherited assumption exposed:** A rendered catalogue entry is documentation,
and documentation becomes trustworthy by compiling.

### Movement 2: define the problem space

The problem is for normative examples to express intended semantics, complete
states, integration obligations and adverse behaviour, while continuously
proving that the taught contract still holds. Failure includes an attractive,
type-correct example that omits accessible naming, recovery, provider context,
security, responsive extremes or product responsibility.

### Movement 3: reflect on possible explanations

Stories can be visual specimens, exploratory sandboxes, executable acceptance
tests or teaching narratives; those are distinct jobs. Autodocs accurately
describes types but cannot decide which props should be used together. A snapshot
detects structural change but not necessarily semantic validity. Complete
journey examples may belong in consumer fixtures rather than the component
catalogue.

**Changed assumption:** Documentation is part of assurance when it is normative;
otherwise its authority must be explicitly limited.

### Movement 4: synthesise and propose

**Inferred:** Components has a rich specimen surface and authored heuristics,
but the observed CI path does not establish correspondence between every taught
state and its accessibility, interaction, responsive or integration claims.
That is a claim-coverage question, not a criticism of Storybook itself.

**Next investigation:** Classify examples as specimen, teaching contract or
acceptance claim; execute the latter in clean consumer fixtures across normal
and adverse states. Introduce deliberate semantic and integration faults to
prove each check can fail. **Warrant:** trustworthy teaching must be able to
invalidate what it teaches. **Falsifier:** if existing CI already executes all
normative examples against their complete stated claims and blocks publication,
the assurance gap is false.

**Unresolved evidence:** Deployed catalogue checks, Chromatic or external CI,
documentation analytics, support feedback and whether Storybook accessibility
results gate release elsewhere.

## Boundary synthesis

The twelve passes expose different seams; none is a package proposal:

| Seam                                     | Question preserved                                                                           |
| ---------------------------------------- | -------------------------------------------------------------------------------------------- |
| Meaning -> design sign                   | Who decides what the person should understand?                                               |
| Allowed props -> valid experience        | Which relational invariants survive composition?                                             |
| Exported name -> compatibility promise   | Which observers and behaviours does a version protect?                                       |
| Supplied value -> owned responsibility   | Which side validates, secures, announces and recovers the hand-off?                          |
| Native outcome -> enhanced execution     | What remains truthful when optional runtime capability is missing?                           |
| Width rule -> adaptive human environment | Which actual constraint changed, and did the task remain operable?                           |
| Token name -> design policy              | Does the reusable value retain the reason for the decision?                                  |
| Named import -> delivered capability     | What runtime graph and environment obligation crossed the boundary?                          |
| Discoverable surface -> correct decision | Can the consumer act correctly without hidden institutional knowledge?                       |
| Release event -> preserved promise       | Who authorised the semantic change, and what proves migration?                               |
| Reuse -> authority and variation         | Is shared placement justified by invariant and lifecycle rather than current consumer count? |
| Example -> warranted confidence          | Can the teaching artefact falsify the behaviour it claims?                                   |

### Convergences

**Inferred:** The same three levels recur through semiotics, composition,
runtime and governance: foundations, interaction grammar and outcome recipes.
This convergence warrants investigating the levels as distinct contracts. It
does not establish distinct repositories, packages, teams or release units.

**Inferred:** Types are important but insufficient in every pass. The missing
information is relational or temporal: which combinations are truthful, who
owns a hand-off, what survives failure, which behaviour a version preserves and
whether an example proves the intended outcome.

**Inferred:** The current boundary contains both deliberate excellence and
historical accommodation. Semantic roles, native defaults and product recipes
carry hard-won understanding; root flattening, internals-driven placement and a
client re-export are current mechanisms. Each needs independent evidence before
being preserved or rejected.

### Material contradictions to retain

- Flexibility enables unknown consumers, but can permit invalid compositions.
- Product recipes preserve complete interaction knowledge, but can make product
  policy a shared-library release concern.
- A single root simplifies discovery, but obscures runtime and compatibility
  classes.
- Central governance protects coherence, but can separate authority from the
  outcome owner.
- Strong browser-native baselines improve resilience, but some excellent Oak
  interactions genuinely require coordinated client state.

The contradictions are evidence requirements for later design; resolving them
by slogan would undo the Concept Explorer pass.
