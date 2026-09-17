# OWA and Oak Components through service, rights, channel and decision lenses

## Purpose and method

This record examines Oak Web Application (OWA), Oak Components and their
boundary through eight perspectives that are not reducible to route structure,
component reuse, runtime topology or individual usability. It applies OCE's
pinned
[`concept-exploration`](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/skills/concept-exploration/SKILL-CANONICAL.md)
workflow independently to:

1. service blueprint, frontstage/backstage work and human support;
2. law, content rights, licensing, attribution and accountability;
3. internationalisation, localisation and cultural applicability;
4. channel interoperability across web, print, downloadable documents, video,
   transcripts, offline use and machine-readable projections;
5. measurement validity, analytics and Goodhart effects;
6. reversibility, option value and decisions under uncertainty;
7. curriculum epistemic governance, contestability and participatory
   legitimacy; and
8. institutional and incentive architecture.

Every pass runs all four movements before convergence:

1. reflect on literal observations and expose inherited assumptions;
2. define a mechanism-neutral problem space;
3. reopen competing explanations and possible solution shapes; and
4. synthesise only warranted next investigations, each with an explicit
   falsifier.

The examined revisions are:

| Source                        | Pinned revision                                                                                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Oak Web Application           | [`510ac63a62fb37a70183b00ce0f5fb15be4491e5`](https://github.com/oaknational/Oak-Web-Application/tree/510ac63a62fb37a70183b00ce0f5fb15be4491e5)           |
| Oak Components                | [`8ff8264fa921e4e40fdaf9a99b02fd156c699cc8`](https://github.com/oaknational/oak-components/tree/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8)                |
| OCE Concept Explorer Practice | [`bd878a3a550c8e5e5d21163a6d0962cebdaf43fa`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa) |

This is current-state research. It does not prescribe an OCE architecture and it
does not propose repairs to OWA or Oak Components.

## Epistemic discipline

- **Observed** means the pinned source directly encodes the stated behaviour or
  declares the stated intent.
- **Inferred** means a reasoned interpretation of observations. It is not a fact
  about production practice, legal sufficiency, cultural validity, service
  performance, metric use or operational recovery.
- **Unknown** means the repositories cannot establish the answer. A plausible
  surrounding process is not substituted for evidence.
- A visible contact or feedback mechanism does not establish that a human reads,
  answers or resolves it.
- A licence notice does not establish ownership, clearance or correct application
  to every embedded asset and derived projection.
- Multiple renderings of the same source do not establish semantic, pedagogical,
  accessibility or rights equivalence between channels.
- An event name and schema establish an intended observable. They do not establish
  construct validity, causal interpretation or the decisions made from it.
- An inverse action, feature flag, redirect or semantic version establishes a
  local mechanism. It does not establish end-to-end reversibility.
- An expert-authored, classroom-tested or research-informed claim does not by
  itself establish the evidence, representation, authority or process by which
  it may be challenged.
- A public repository, permissive code licence or published package does not by
  itself establish open governance, accessible contribution or accountable
  stewardship.

## Boundary vocabulary

For these passes:

- **OWA** means application orchestration, content projection, service calls,
  workflow state, persistence, application policy and OWA-local presentation.
- **Components** means the published package's primitives, patterns and
  teacher/pupil product-shaped interactions.
- **Boundary** means the point at which an application fact, policy, service
  transition or measurement intent becomes an interaction contract. It is an
  analytical seam, not a proposal for another package.

---

## Lens 1: service blueprint, frontstage/backstage work and human support

### Governing question

What complete service must operate around each visible interaction, where is
work handed to systems or people out of view, and how can a participant recover
when the backstage reality differs from the frontstage promise?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** The lesson-download submit path sends a HubSpot submission
  before attempting the resource download. On the redirecting journey, the
  visible acknowledgement is `Download started. This may take a few minutes`,
  after which the application replaces the route
  ([download orchestration](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L195-L239)).
- **Observed (OWA):** The Gleap feedback widget is enabled only after statistics
  consent and is explicitly disabled on pupil and standalone-video paths. When
  its enabled state changes from loaded to disabled, the hook reloads the page
  because that is the implemented clearing mechanism
  ([application gating](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/AppComponents/App/AppHooks.tsx#L31-L58),
  [widget lifecycle](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/gleap/useGleap.ts#L15-L34)).
- **Observed (OWA):** The download-success header always invites a teacher to
  click the bottom-right question mark to give feedback. A later sentence about
  using that question mark for extra font help is conditional on consent not
  being denied
  ([success and help copy](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/units/%5BunitSlug%5D/lessons/%5BlessonSlug%5D/Components/DownloadSuccessHeader/DownloadSuccessHeader.tsx#L31-L85)).
- **Observed (OWA):** HubSpot can classify a valid address as `INVALID_EMAIL`.
  OWA then displays an invalid-address error while submitting the address plus
  its local part to a fallback form; the code comments explicitly say the user
  may believe the original address is valid
  ([fallback service path](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/hubspot/forms/hubspotSubmitForm.ts#L76-L95),
  [fallback submission](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/hubspot/forms/hubspotSubmitForm.ts#L137-L208)).
- **Observed (OWA):** If school lookup does not find the teacher's school, the
  onboarding surface offers a manual-entry path and a route back to the picker
  ([school-selection recovery](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/Onboarding/SchoolSelection/SchoolSelection.view.tsx#L96-L160)).
- **Observed (Components):** `OakInlineRegistrationBanner` treats an empty value
  or any rejected submission promise as `Please enter a valid email address`.
  Any resolved promise produces `Thank you for signing up`; the component's
  service contract is only `Promise<string | undefined>`
  ([registration interaction](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/teacher/OakInlineRegistrationBanner/OakInlineRegistrationBanner.tsx#L15-L67),
  [success acknowledgement](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/teacher/OakInlineRegistrationBanner/OakInlineRegistrationBanner.tsx#L89-L107)).
- **Observed (OWA):** A public `Get in touch` route points to an external HubSpot
  form, while the contact page itself projects CMS-authored body content and a
  newsletter form. The pinned source does not state who receives enquiries or
  any response commitment
  ([get-involved contact](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/about-us/get-involved.tsx#L45-L77),
  [contact-page composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/contact-us.tsx#L76-L125)).

#### Initial interpretation and inherited assumptions

- **Inferred:** A visible journey is the frontstage of a service that also
  includes consent state, CRM validation, download generation, third-party
  routing, operational ownership and possible human response.
- **Inferred:** Several visible states compress a more qualified backstage
  transition: `started` is not completed, a resolved form submission is not
  necessarily an enrolled recipient, and `invalid email` can be a provider
  classification rather than user input failure.
- **Unknown:** Support staffing, routing, service levels, escalation, case
  history, outage playbooks, completion rates and the volume of avoidable repeat
  contact are not present in these repositories.

### Movement 2: define the problem space

**Problem frame (Inferred):** A public educational service must carry a person's
intent across visible interaction, hidden automation and any necessary human
work, while preserving truthful state and a proportionate recovery route. The
problem is not a missing help widget. It is a break in the service chain where a
person cannot know what happened, who or what now owns the work, whether they
must wait or act, or how to recover without repeating effort or surrendering
unnecessary data.

The service chain to examine is:

```text
human need -> frontstage request -> validation/consent -> backstage work
           -> operational or human owner -> acknowledged state -> completion
           -> recovery/escalation -> service learning
```

**Constraints (Inferred):** Some operations are asynchronous; a feedback tool is
not necessarily a support service; privacy choices can legitimately limit a
third party; pupils and teachers can require different support; and frontstage
copy cannot enumerate every internal detail.

**Success (Inferred):** For every material journey, the person can distinguish
accepted, queued, completed and failed states, find an available recovery path,
and obtain an answer appropriate to the consequence. Backstage owners can see
and resolve failure without relying on the user to reconstruct hidden context.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                      | Reopened interpretation                                                                                                                                                        |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Changed assumption:** The page flow is the service.                 | **Inferred:** Download, sign-up and support journeys continue through external systems, queues and possibly human teams after the visible action.                              |
| **Changed assumption:** A success flag is a completed outcome.        | **Inferred:** It may mean client validation passed, a provider returned success, a download link was opened, or durable work completed.                                        |
| **Changed assumption:** An error message is recovery.                 | **Inferred:** Recovery also requires correct cause, retained context, a safe retry or alternative path, and ownership when self-service cannot resolve it.                     |
| **Changed assumption:** A feedback widget is human support.           | **Inferred:** It may be research intake, defect reporting or support, and source does not establish response or resolution.                                                    |
| **Competing explanation:** Consent-gated feedback is a service gap.   | **Inferred:** It may intentionally protect privacy because a separate contact path is the real support channel; the current evidence does not establish the service design.    |
| **Competing explanation:** Generic error copy simplifies the journey. | **Inferred:** It can reduce cognitive load for truly invalid input, or misdirect a person when provider, network, policy or operational failure has a different recovery path. |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** OWA exposes meaningful recovery and contact mechanisms,
but the repositories reveal no complete blueprint joining frontstage state to
backstage ownership and human support. Components sometimes owns the language
that interprets an application promise, while OWA and external providers own the
actual transition. The material seam is **visible command -> backstage state ->
operational owner -> truthful acknowledgement -> recovery and learning**.

| Warranted next investigation                                                                                                                   | Warrant                                                                                                                                    | Explicit falsifier                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Blueprint download, onboarding and contact/feedback end to end with product, operations and support participants.                              | These journeys cross visible UI, consent, provider validation, generated assets, external forms and possible human handling.               | Current blueprints already name every state, hand-off, owner, wait, failure, recovery route and service measure, and observed work matches them without material gap. |
| Run controlled failure walks for provider rejection, network loss, slow download, stale school data, consent denial and inaccessible feedback. | Source exposes branches whose real user consequence and operational visibility cannot be established statically.                           | Each injected failure yields truthful state, preserves necessary context, offers a viable alternative and reaches an accountable owner without repeated user effort.  |
| Reconcile the vocabulary `submitted`, `started`, `downloaded`, `signed up`, `saved`, `feedback` and `support` with authoritative transitions.  | Similar frontstage words currently summarize different backstage guarantees across OWA and Components.                                     | Every term already has one precise, user-tested service contract and cannot be asserted by a type-valid caller before that contract is true.                          |
| Analyse failure demand and support exclusion by audience, route, consent state and accessibility need.                                         | Widget availability differs by audience and consent, while the available source does not establish whether alternative channels meet need. | Representative evidence shows no unresolved need, repeated contact, inaccessible recovery or systematic exclusion across those dimensions.                            |

#### Unresolved evidence

- **Unknown:** Which visible feedback and contact paths are research, support,
  incident reporting, complaints or general enquiries.
- **Unknown:** Whether a human receives each path, with what context, authority,
  response expectation and escalation route.
- **Unknown:** Whether download acknowledgement corresponds to eventual file
  delivery and whether OWA or an operator can detect non-completion.
- **Unknown:** The production frequency and human cost of false email rejection,
  provider failure, manual school entry and unavailable feedback.

---

## Lens 2: law, content rights, licensing, attribution and accountability

### Governing question

Can every person and machine that views, downloads, transforms, shares or reuses
an Oak projection determine what is permitted, which conditions follow it, whose
authority supports the claim, and who can correct a mistake?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** Pupil-facing notices distinguish Collection 1 content
  licensed under Oak terms from Collection 2 content marked as Open Government
  Licence version 3.0, both qualified by `except where otherwise stated`
  ([pupil copyright notice](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/CopyrightNotice/CopyrightNotice.tsx#L6-L55)).
- **Observed (OWA):** Teacher-facing licence copy derives a copyright year from
  a supplied date and links to both OGL 3.0 and Oak terms. A separate branch
  renders Collection 1 language for older content
  ([current licence copy](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/CopyrightLicence/CopyrightLicence.tsx#L6-L63),
  [collection selection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/OglCopyrightNotice/OglCopyrightNotice.tsx#L16-L72)).
- **Observed (OWA):** The legacy-download filter treats presentations and
  worksheet PDF/PPTX files as copyright-sensitive when any content record has
  the exact string `This lesson contains copyright material.`; it then removes
  those resource types from downloadable choices
  ([legacy rights classifier](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/helpers/downloadAndShareHelpers/downloadsLegacyCopyright.tsx#L7-L50),
  [download projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L91-L159)).
- **Observed (OWA):** Complex-copyright state can require sign-in/onboarding or
  UK location. The visible blocked state explains copyright as the reason and
  gives a contact route for a UK user who believes the classification is wrong
  ([rights gates](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/ComplexCopyrightRestrictionBanner/ComplexCopyrightRestrictionBanner.tsx#L42-L137),
  [download correction path](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/LessonDownloadRegionBlocked/LessonDownloadRegionBlocked.tsx#L49-L74)).
- **Observed (OWA):** Media-clip attribution is supplied as a name/string pair
  and quiz image attribution is extracted from image metadata when an
  `attribution` field is present. Missing attribution produces no quiz
  attribution output
  ([media attribution rendering](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/LessonMediaAttributions/LessonMediaAttributions.tsx#L3-L22),
  [quiz attribution extraction](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/QuizQuestions/QuizAttribution/QuizAttribution.tsx#L14-L70)).
- **Observed (Components):** The package states that code and documentation
  samples are MIT licensed, documentation is OGL 3.0 except where stated, and
  Oak trademarks and logos are excluded from the MIT grant and governed by
  brand guidance
  ([package licensing](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L154-L166)).
- **Observed (OWA):** The site footer exposes terms, privacy, copyright,
  accessibility, safeguarding, complaints and Freedom of Information routes.
  The pinned code names these accountability surfaces but not their underlying
  decision owners or procedures
  ([legal and accountability navigation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/AppComponents/LayoutSiteFooter/LayoutSiteFooter.tsx#L138-L176)).

#### Initial interpretation and inherited assumptions

- **Inferred:** Rights are not one site-wide Boolean. Code, documentation,
  branding, curriculum prose, video, embedded images, worksheets, presentations
  and third-party material can carry different permissions and obligations.
- **Inferred:** OWA contains both rights communication and rights enforcement,
  but the authority that produces the input classifications and attribution
  strings lies outside the examined code.
- **Unknown:** Chain of title, contributor agreements, rights-holder records,
  exceptions, territorial analysis, licence compatibility, takedown practice and
  legal review are not established by these repositories.

### Movement 2: define the problem space

**Problem frame (Inferred):** Educational material passes through selection,
editing, embedding, transformation, publication, download and reuse. At every
projection, the service must preserve permission, restriction, attribution and
accountability appropriate to each constituent asset. The problem is not merely
displaying a copyright footer. It is preventing a legal claim or condition from
being lost, broadened, contradicted or made impossible to act upon as content
crosses boundaries.

The rights chain to examine is:

```text
creator/rightsholder -> authority and permission -> asset identity/provenance
                     -> transformation/projection -> notice and enforcement
                     -> downstream use/reuse -> correction/takedown/redress
```

**Constraints (Inferred):** Open licensing can coexist with third-party
exceptions; attribution must remain useful without overwhelming the learning
experience; access and download can have different legal bases; jurisdiction
matters; and some correction or takedown actions must be rapid.

**Success (Inferred):** A rights claim is traceable to an accountable authority,
travels with the asset through every supported projection, is intelligible to
the relevant human or machine, and can be corrected or enforced without
guesswork or unrelated access barriers.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                          | Reopened interpretation                                                                                                                                                    |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Changed assumption:** Open-source code means open Oak material.         | **Inferred:** Components code, documentation, branding and educational content have explicitly different grants and exceptions.                                            |
| **Changed assumption:** A site-wide OGL notice establishes reuse rights.  | **Inferred:** `Except where otherwise stated` makes asset-level exceptions, provenance and projection behaviour load-bearing.                                              |
| **Changed assumption:** Public viewing and downloading are the same use.  | **Inferred:** OWA encodes distinct sign-in, geography and file-type restrictions; the authority and proportionality of each remain external evidence.                      |
| **Changed assumption:** Attribution text is a complete rights record.     | **Inferred:** A string can satisfy display needs while omitting identifier, rightsholder, source, licence, territory, expiry and transformation history needed elsewhere.  |
| **Changed assumption:** A gate proves legal compliance.                   | **Inferred:** A gate enforces its input classification; it cannot prove that the classification, location result, exception handling or all downstream copies are correct. |
| **Competing explanation:** Literal legacy matching is intentionally safe. | **Inferred:** It may be a conservative migration adapter around older metadata, or a fragile proxy whose false-positive and false-negative behaviour must be measured.     |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** OWA visibly distinguishes licences, renders
attribution, filters files and gates access, while Components itself carries a
different code/documentation/brand rights boundary. The source does not reveal
one durable rights record that survives every projection. The material seam is
**asset and contribution -> legal authority -> structured rights state ->
projection/enforcement -> accountable correction**.

| Warranted next investigation                                                                                                                         | Warrant                                                                                                                    | Explicit falsifier                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build an asset-level provenance and rights trace for representative lesson text, images, video, quizzes, slides, worksheets, documents and branding. | Site notices are qualified by exceptions, while classification and attribution inputs originate outside the rendered code. | Every constituent asset already has a verified rightsholder, source, permission, jurisdiction, conditions, attribution, review date and accountable owner linked through all derivatives. |
| Follow licence and attribution through web, share, ZIP, DOCX, XLSX, printable result, transcript and Open API projections.                           | Transformations can drop or alter obligations even when each local renderer is internally correct.                         | Automated and human checks show every supported projection preserves the exact required permission, restriction and attribution with no orphaned or broadened asset.                      |
| Reconstruct the decision table and authority for legacy text matching, complex-copyright flags, authentication and geolocation.                      | The code enforces these inputs, but cannot establish their legal basis, provenance, error rate or correction lifecycle.    | Every rule maps to a current approved authority, structured source state, bounded jurisdiction, tested edge cases and a functioning correction path with negligible unexplained mismatch. |
| Walk a rights complaint or takedown from report through identification, containment, derivative discovery, response and audit.                       | Legal accountability depends on correcting all projections and copies, not only linking to a policy or contact page.       | A current exercised procedure identifies and controls every affected projection within its required window, preserves evidence and gives complainant and users an accountable outcome.    |

#### Unresolved evidence

- **Unknown:** Who has authority to assign collection, licence, attribution,
  login and geography state and how those decisions are reviewed.
- **Unknown:** Whether downloadable and machine-readable outputs carry
  equivalent, asset-specific rights metadata.
- **Unknown:** How rights changes propagate to caches, previously shared links,
  downloaded copies and third-party consumers.
- **Unknown:** Complaint, correction and takedown response evidence, including
  false blocks and content published with insufficient permission.

---

## Lens 3: internationalisation, localisation and cultural applicability

### Governing question

For which languages, locales, writing systems, jurisdictions and educational
contexts is the service intended to work, and which encoded assumptions would
change meaning or capability outside that scope?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** App Router pages declare root language `en` and load only
  the Latin subset of Lexend. Pages Router pages declare `en-GB`
  ([App Router root](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/layout.tsx#L24-L68),
  [Pages Router document](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/_document.tsx#L41-L62)).
- **Observed (OWA):** Shared date formatting fixes locale to `en-GB` and time
  zone to `Europe/London`; legal-page and saved-library projections also format
  dates with explicit `en-GB`
  ([shared date formatter](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/utils/formatDate.ts#L1-L9),
  [saved-item wording](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/MyLibraryUnitCard/MyLibraryUnitCard.tsx#L27-L41)).
- **Observed (OWA):** The teacher lesson projection is organised by UK-specific
  curricular dimensions including key stage, phase, year, exam board, tier and
  pathway
  ([lesson curriculum dimensions](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.query.ts#L198-L245)).
- **Observed (OWA):** Onboarding payload code distinguishes UK teacher,
  `OnboardingInternationalTeacherProps` and non-teacher shapes; the international
  branch sends manually entered school name and address instead of a UK URN
  ([onboarding audience shapes](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/hubspot/forms/getHubspotFormPayloads.ts#L153-L189),
  [international payload projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/hubspot/forms/getHubspotFormPayloads.ts#L194-L250)).
- **Observed (OWA):** The generated curriculum DOCX footer assigns Arial to
  ASCII, East Asian, high-ANSI and complex-script font slots and explicitly sets
  right-to-left off in two runs
  ([document font and direction settings](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/docx/index.ts#L66-L106)).
- **Observed (OWA):** One school-search combobox uses `@react-aria/i18n`'s
  locale-sensitive filter, while its labels and placeholders remain English and
  UK-school oriented
  ([locale-sensitive search with English interaction](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/ResourcePageSearchComboBox/ResourcePageSearchComboBox.tsx#L1-L32),
  [school placeholder](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/ResourcePageSearchComboBox/ResourcePageSearchComboBox.tsx#L70-L109)).
- **Observed (Components):** Consumer setup guidance demonstrates `<html
lang="en">` and Lexend's Latin subset. Product-shaped components embed English
  feedback such as `Correct`, `Incorrect`, `Almost correct` and English default
  content-guidance actions, although some guidance strings can be overridden
  ([consumer setup](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L19-L44),
  [quiz feedback vocabulary](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/quiz/OakQuizFeedback/OakQuizFeedback.tsx#L24-L75),
  [configurable guidance defaults](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/browse/OakPupilJourneyContentGuidance/OakPupilJourneyContentGuidance.tsx#L70-L121)).

#### Initial interpretation and inherited assumptions

- **Inferred:** The code expresses a deliberate English and UK educational
  centre of gravity, while international-teacher handling shows that actual or
  intended reach is not identical to a UK-school-directory boundary.
- **Inferred:** Locale capability is unevenly distributed: a search utility can
  be locale-sensitive while language, formatting, direction, fonts, curriculum
  taxonomy and product semantics remain fixed.
- **Unknown:** Intended geographic scope, international traffic, translation or
  cultural-review process, supported languages, jurisdictional policy and
  participant demand are not established here.

### Movement 2: define the problem space

**Problem frame (Inferred):** An educational service must preserve meaning and
capability for the audiences it intentionally serves across language, locale,
writing system, cultural reference, curriculum jurisdiction and output channel.
The problem is not replacing strings. It is discovering which concepts are
universal, which are translated, which must be adapted, and which should remain
explicitly scoped to a particular educational system.

The applicability chain to examine is:

```text
intended audience/context -> concept and curriculum scope -> language/locale
                          -> interaction and content adaptation -> every channel
                          -> comprehension, pedagogical fit and accountable review
```

**Constraints (Inferred):** Oak material can legitimately target England or the
UK; translation can change pedagogical difficulty, assessment validity,
safeguarding meaning and licence obligations; stable identifiers need not be
translated; and direction or glyph support must hold across generated files as
well as the browser.

**Success (Inferred):** Supported and unsupported contexts are explicit. Within
supported contexts, language, format, direction, imagery, curriculum semantics,
legal meaning and channel outputs preserve equivalent intended use, and people
from the relevant culture participate in validation.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                        | Reopened interpretation                                                                                                                                                     |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Changed assumption:** Internationalisation means extracting strings.  | **Inferred:** Direction, fonts, dates, sorting, route metadata, document XML, video/transcript, assessment and rights also carry locale assumptions.                        |
| **Changed assumption:** A design system is culturally neutral.          | **Inferred:** Product-shaped Components exports contain English educational judgements and action language, while layout and imagery can encode reading and cultural norms. |
| **Changed assumption:** English content implies only UK users.          | **Inferred:** International onboarding is encoded; English-medium schools and external consumers can cross the curricular-jurisdiction boundary.                            |
| **Changed assumption:** Translation makes a curriculum applicable.      | **Inferred:** Key stages, exam boards, examples, historical frames, pedagogy and statutory concepts can require adaptation or explicit non-applicability.                   |
| **Changed assumption:** Browser support establishes channel support.    | **Inferred:** Generated DOCX, XLSX, captions, downloadable assets and machine output have independent font, direction, formatting and terminology decisions.                |
| **Competing explanation:** Fixed English/UK behaviour is correct scope. | **Inferred:** It may be exactly the intended service boundary. If so, the requirement is explicit scope and graceful external reuse, not automatic localisation.            |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** OWA visibly encodes UK curriculum and English locale
assumptions, with isolated locale-aware utilities and an international teacher
branch. Components embeds some English product semantics and demonstrates a
Latin-font setup. The seam is **intended audience and jurisdiction -> culturally
valid concept -> locale representation -> channel projection -> verified human
meaning**.

| Warranted next investigation                                                                                                                    | Warrant                                                                                                                                  | Explicit falsifier                                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Establish an evidence-backed scope map by audience, country, curriculum jurisdiction, language, writing system and consumer type.               | Encoded international onboarding and UK-specific content do not reveal what is intentionally supported versus incidentally reachable.    | Current product and public-service policy already defines those boundaries, affected populations confirm them, and no material journey or public claim crosses them unexpectedly. |
| Inventory locale-bearing decisions across routes, content, Components copy, dates/numbers, search/sort, fonts, direction, images and files.     | The source shows fixed and configurable behaviour in different layers, so a string inventory alone would miss consequential assumptions. | Every locale-bearing decision is already centrally declared, propagated consistently to all projections and tested for every supported locale and script.                         |
| Run pseudo-localisation plus representative RTL and non-Latin end-to-end trials across web, DOCX, XLSX, video/transcript, print and sharing.    | Layout and document generation can fail independently; repository types do not establish rendered equivalence.                           | All supported journeys retain readable layout, correct ordering, complete glyphs, input/search behaviour, semantics and accessible alternatives without special-case failure.     |
| Conduct curriculum-cultural and assessment review with educators from each claimed non-UK context before treating translation as applicability. | Language equivalence cannot establish curricular fit, valid examples, safe guidance or assessment interpretation.                        | Existing representative review already demonstrates pedagogical, cultural, legal and assessment applicability for every claimed context, with owned correction mechanisms.        |

#### Unresolved evidence

- **Unknown:** Whether international teachers are a supported audience, a
  tolerated edge case or only a CRM classification.
- **Unknown:** Which UI, curriculum, legal and support content is authored in a
  translatable or adaptable source system.
- **Unknown:** Real behaviour with long expansion, non-Latin glyphs, RTL,
  locale-specific input, screen readers and generated documents.
- **Unknown:** Who can judge cultural and curricular applicability and how
  disagreement or harm is corrected.

---

## Lens 4: channel interoperability

### Governing question

When one educational concept is projected into web UI, print, downloadable
documents, video, transcript, offline artefacts or machine-readable interfaces,
which meaning and obligations must remain invariant and which adaptation is
legitimately channel-specific?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** Teacher lesson data exposes presentation and worksheet
  URLs, ordinary and sign-language video playback IDs, transcript sentences,
  quizzes, a lesson guide and a typed list of presentation, quiz, worksheet,
  supplementary and guide download formats
  ([download format projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.query.ts#L80-L137),
  [lesson media fields](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.query.ts#L214-L254)).
- **Observed (OWA):** The site advertises an RFC 9727 machine-discovery catalog
  for the Curriculum Open API, linking its OpenAPI document, human documentation,
  playground and health endpoint. An alpha, invitation-only MCP endpoint is
  deliberately commented out until general availability
  ([API catalog](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/well-known/api-catalog/route.ts#L1-L82),
  [well-known rewrite](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/next.config.ts#L486-L494)).
- **Observed (OWA):** A curriculum-download endpoint combines curriculum API and
  CMS data, can substitute explicit placeholder CMS content when CMS data is
  absent, and independently invokes DOCX curriculum-plan and XLSX alignment
  generators before optionally packaging both into a ZIP
  ([data combination and placeholder](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L118-L173),
  [format handlers and response](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L277-L387)).
- **Observed (OWA):** DOCX generation runs a sequence of channel-specific
  builders for cover, contents, curriculum explanation, partner, units and
  threads. XLSX generation filters and structures year sheets separately and
  embeds links back to OWA programme/unit routes
  ([DOCX projection pipeline](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/docx/index.ts#L122-L208),
  [XLSX projection and web links](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/xlsx/index.ts#L26-L94)).
- **Observed (OWA):** When transcript sentences are absent, OWA fetches a VTT
  captions file and derives transcript prose by joining cues, splitting on
  punctuation with title exceptions and removing an initial voice tag. Existing
  string transcripts take a separate newline-and-format path
  ([caption-to-transcript transformation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/utils/handleTranscript.ts#L7-L64),
  [lesson transcript population](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/utils/handleTranscript.ts#L90-L108)).
- **Observed (OWA and Components):** The pupil-results projection combines
  persisted video/worksheet state, quiz answers and a copyright notice with a
  Components `OakQuizPrintableHeader`. The header turns video position and
  worksheet state into fixed English printable labels
  ([OWA result projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilViews/PupilResults/PupilResults.view.tsx#L23-L87),
  [Components printable summary](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/quiz/OakQuizPrintableHeader/OakQuizPrintableHeader.tsx#L14-L85)).
- **Observed (OWA and Components):** OWA supplies transcript sentences and a
  sign-language toggle to a product-shaped Components transcript interaction;
  Components owns the show/hide language and collapsible web behaviour
  ([OWA transcript composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/Views/PupilLessonVideo/PupilLessonVideoTranscript/PupilLessonVideoTranscript.tsx#L8-L49),
  [Components transcript interaction](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/OakVideoTranscript/OakVideoTranscript.tsx#L8-L50),
  [collapsible rendering](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/OakVideoTranscript/OakVideoTranscript.tsx#L52-L105)).

#### Initial interpretation and inherited assumptions

- **Inferred:** OWA is already a multi-channel publisher and gateway, not only a
  website. Some projections share upstream facts but have independent
  transformation, layout, rights and accessibility behaviour.
- **Inferred:** Downloaded files provide portability beyond a live page, but
  embedded web links, external fonts, protected media and changing source
  content mean `downloadable` is not synonymous with a complete offline service.
- **Unknown:** Cross-channel parity, document accessibility, offline task
  completion, API-to-UI correspondence, projection versioning and external
  consumer experience are not established by source existence.

### Movement 2: define the problem space

**Problem frame (Inferred):** A teacher, pupil or machine can encounter the same
lesson through several projections with different strengths and constraints.
The service must decide which identity, educational meaning, structure, rights,
provenance, accessibility, version and state are invariant and which are adapted
for the channel. The problem is a divergence that causes a person or consumer to
act on incomplete, contradictory, stale or non-equivalent material.

The projection chain to examine is:

```text
authoritative educational concept + identity + rights + version
    -> channel-specific transformation -> rendered/serialized artefact
    -> use with channel constraints -> equivalence evidence -> correction/update
```

**Constraints (Inferred):** Equivalence need not mean pixel or field identity;
captions and prose transcripts serve different tasks; print and spreadsheets
need different structure; offline copies cannot always be recalled; machine
contracts require version stability; and every projection must remain
accessible in its own medium.

**Success (Inferred):** Each supported channel declares its purpose and
guarantees, preserves all required invariants, adapts only with accountable
rules, identifies source and version, and has evidence that a user or consumer
can achieve the intended equivalent outcome.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                          | Reopened interpretation                                                                                                                                                       |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Changed assumption:** Multiple output formats are interoperability.     | **Inferred:** Interoperability also requires shared identity, semantics, rights, version, accessibility, update rules and a proven consumer outcome.                          |
| **Changed assumption:** A transcript is the text of captions.             | **Inferred:** OWA deliberately transforms timed cues into prose using heuristic punctuation rules, so timing, speaker and sentence boundaries are separate channel decisions. |
| **Changed assumption:** Printable means equivalent to screen.             | **Inferred:** The printable result selects and relabels state; equivalence depends on the teacher's use, mathematical rendering, accessibility and retained context.          |
| **Changed assumption:** Downloadable means offline-capable.               | **Inferred:** A file can open offline while links, fonts, media, correction, provenance or a surrounding workflow still depend on networked services.                         |
| **Changed assumption:** Machine-readable means serialized web content.    | **Inferred:** The Open API has discovery, description, health and maturity contracts distinct from OWA's human projection and internal GraphQL consumption.                   |
| **Competing explanation:** Independent renderers are harmful duplication. | **Inferred:** They may be necessary channel adaptation; the deciding evidence is invariant coverage and change propagation, not shared implementation alone.                  |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** The repositories expose a broad channel estate and
several deliberate transformations, including a public machine interface.
Channel-specific code sometimes owns educational or status language while
upstream data supplies facts. No examined source establishes a common projection
contract or equivalence evidence. The seam is **authoritative concept -> channel
transformation -> retained invariants -> user/consumer outcome -> update and
correction**.

| Warranted next investigation                                                                                                                            | Warrant                                                                                                                                      | Explicit falsifier                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build a projection matrix for representative lesson, unit, curriculum, quiz result and rights objects across every supported human and machine channel. | Source reveals independent fields and renderers but not which identity, meaning, rights, accessibility and version properties must match.    | A current contract already defines every channel's purpose, mandatory invariants, allowed adaptations, version/update behaviour and accountable owner with no uncovered projection. |
| Run semantic and task-parity traces across web, presentation, worksheet, DOCX, XLSX, transcript, sign-language video, printable results and Open API.   | Local renderer correctness cannot prove equivalent educational use or reveal omitted and stale state.                                        | Representative users and contract tests complete the intended equivalent tasks with consistent identity, meaning, rights and accessibility, and no unexplained divergence.          |
| Exercise offline and degraded-network journeys from discovery through classroom/pupil use, recovery and later update.                                   | Downloads create option value but source does not establish the completeness or correction behaviour of an offline workflow.                 | Every claimed offline journey completes without hidden network dependency, exposes source/version and reconnect behaviour, and safely communicates stale or withdrawn material.     |
| Compare Open API objects and lifecycle with OWA projections using independent consumers rather than internal implementation knowledge.                  | Machine interoperability exists as a separate advertised service whose semantic correspondence and consumer usability are outside this repo. | Consumers can discover, interpret and use the API to reproduce all promised outcomes, and versioned contract checks show intentional correspondence or documented divergence.       |

#### Unresolved evidence

- **Unknown:** The authoritative content identity and version shared by web,
  files, video, transcript, print, share links and Open API responses.
- **Unknown:** Which fields and obligations are intentionally omitted or adapted
  in each projection and who approves that decision.
- **Unknown:** Accessibility and pedagogical equivalence of DOCX, XLSX, PDF,
  PPTX, ZIP, printable and transcript outputs.
- **Unknown:** Offline use, stale-copy prevalence, correction propagation and
  independent machine-consumer outcomes.

---

## Lens 5: measurement validity, analytics and Goodhart effects

### Governing question

What construct does each observable claim to represent, what selection and
instrumentation processes shape it, and how could using the measure for a
decision change the behaviour being measured?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** Avo supplies named, typed event functions and sends them to
  PostHog. Event documentation distinguishes platform, product, engagement
  intent, component type and semantic event version; the event version is
  intended to mark downstream breaking changes
  ([event taxonomy](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/avo/Avo.ts#L3881-L3933),
  [Avo-to-PostHog bridge](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/avo/getAvoBridge.ts#L17-L80)).
- **Observed (OWA):** The analytics provider derives page views from path/query,
  routes typed Avo events to PostHog, and gates PostHog and HubSpot through the
  statistics consent policy
  ([provider and consent](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/Analytics/AnalyticsProvider.tsx#L120-L205)).
- **Observed (OWA):** The event queue sends only when a service reports enabled,
  clears queued events when disabled and retains them while consent is pending.
  PostHog's state maps denied to disabled and granted to enabled
  ([queue selection process](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/analytics/withQueue.ts#L79-L123),
  [PostHog consent state](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/posthog/posthog.ts#L78-L99)).
- **Observed (OWA):** `Analytics Use Case` is documented as pupil or teacher
  according to page URL and is marked for future removal. A search-result event
  also records result rank, selected filters, result count and result type
  ([route-derived classification and search observables](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/avo/Avo.ts#L3194-L3239)).
- **Observed (OWA):** A pupil question attempt records `isCorrect` only when the
  local grade equals one. Lesson completion is emitted when every configured
  review section reports complete, after the completed quiz state is assembled
  ([question observable](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/pupil/lessons-pages/new/QuizPageContent.tsx#L217-L251),
  [completion observable](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/pupil/lessons-pages/new/QuizPageContent.tsx#L254-L287)).
- **Observed (OWA):** Teacher resource download, media and AI interactions are
  classified with `engagementIntent: use`; a download event is emitted when the
  button starts the journey rather than when a resulting file is used in
  planning or teaching
  ([teacher engagement events](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonOverview/LessonOverview.view.tsx#L218-L280)).
- **Observed (OWA):** Video instrumentation records play, start, pause and finish
  with duration, elapsed time, mute, captions and content/pathway metadata
  ([video observables](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/VideoPlayer/useVideoTracking.ts#L9-L117)).
- **Observed (Components):** Base button and checkbox primitives expose hover
  callbacks measured with wall-clock duration between mouse enter and leave.
  This makes a low-level interaction observable available to consumers without
  defining what human construct it represents
  ([button hover measurement](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/internal-components/InternalButton/InternalButton.tsx#L49-L86),
  [checkbox hover measurement](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/internal-components/InternalCheckBox/InternalCheckBox.tsx#L28-L75)).

#### Initial interpretation and inherited assumptions

- **Inferred:** OWA has deliberate instrumentation vocabulary and downstream
  compatibility markers. Many observables nevertheless describe application
  transitions or route context, not teacher value, pupil learning or public
  impact.
- **Inferred:** Consent creates known missingness by excluding denied users from
  named-event capture; its direction and downstream correction are unknown.
- **Unknown:** Metric definitions, dashboards, targets, decision rights,
  experiments, causal models, quality controls and whether any event is treated
  as a success target are outside the pinned repositories.

### Movement 2: define the problem space

**Problem frame (Inferred):** A service needs evidence to learn and remain
accountable, but a computable event is only a proxy produced by a particular
instrument, population and context. The problem is an invalid inference from
observable activity to a human or public outcome, especially when selection,
position, consent, device, implementation or changed behaviour influences the
number. If a proxy becomes a target, teams and users can improve the number
without improving the underlying purpose.

The measurement chain to examine is:

```text
intended construct -> observable proxy -> instrumentation and eligibility
                   -> data quality/missingness -> analysis -> decision/incentive
                   -> changed system or behaviour -> outcome and revalidation
```

**Constraints (Inferred):** Privacy can legitimately limit observation;
diagnostic activity metrics remain useful; educational outcomes can be delayed
and contextual; experiments need ethical and statistical bounds; and not every
decision warrants causal certainty.

**Success (Inferred):** Each material metric names its construct, population,
instrument, exclusions, uncertainty, decision use and failure modes. It is
validated against the outcome appropriate to that use, monitored for drift and
gaming, and never granted more authority than its evidence supports.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                       | Reopened interpretation                                                                                                                                         |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Changed assumption:** A typed event is a valid metric.               | **Inferred:** Type and version protect payload shape; construct validity, population validity and causal interpretation require different evidence.             |
| **Changed assumption:** Completion means successful learning.          | **Inferred:** It currently means configured sections reached complete state. That can be a useful workflow fact without warranting learning or mastery.         |
| **Changed assumption:** `use` means realised teacher value.            | **Inferred:** The label is assigned at an interaction boundary such as starting a download; classroom adoption, adaptation and benefit remain unobserved.       |
| **Changed assumption:** Teacher/pupil analytics identifies the person. | **Inferred:** At least one documented classification is derived from route, so it identifies application context rather than a verified role or job.            |
| **Changed assumption:** Missing events are random loss.                | **Inferred:** Consent and service state produce structured exclusion; network, navigation and component availability can add other mechanisms.                  |
| **Competing explanation:** Activity events are being misused.          | **Inferred:** They may be intentionally diagnostic and never treated as outcome targets. Goodhart risk depends on downstream decisions, which are unknown here. |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** OWA encodes extensive, versioned observability and
Components exposes low-level interaction hooks, but source does not expose the
validity argument from activity to decision. Several names deliberately compress
route or workflow state into higher-level vocabulary. The seam is **human or
public construct -> eligible observable -> instrumented event -> analytic
interpretation -> decision and behavioural response**.

| Warranted next investigation                                                                                                                    | Warrant                                                                                                                               | Explicit falsifier                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Build a construct-to-event-to-decision register for all metrics used to prioritise, evaluate, experiment, fund or retire functionality/content. | Source documents event triggers but not metric formulas, interpretation, owner or decision consequence.                               | Every consequential metric already has a current construct definition, population, instrument, exclusions, uncertainty, owner, decision rule and validated use with no orphan event. |
| Validate representative proxies against human outcomes: search success, usable teacher resource, lesson completion and assessment inference.    | Rank clicks, download starts and section completion are plausible proxies whose relationship to intended progress is not established. | Independent evidence shows each proxy predicts the named outcome sufficiently for its actual decision use across relevant contexts and groups, with bounded error and alternatives.  |
| Quantify the event funnel from eligible interaction through consent, queue, transport, schema and warehouse, segmented by audience and channel. | Consent and queue code establish non-observation mechanisms; production completeness and bias remain unknown.                         | Reconciliation accounts for essentially all eligible actions, missingness is measured and immaterial or corrected for each decision, and channel/group comparisons remain valid.     |
| Run a Goodhart and adversarial review of current targets, experiments and performance incentives with product, education, data and operations.  | Source cannot reveal whether convenient proxies have become optimisation targets or how actors respond to them.                       | No material metric is tied to an incentive or decision that can improve through proxy manipulation, displacement, selection or short-term gain without the intended outcome.         |

#### Unresolved evidence

- **Unknown:** Which events become organisational metrics, targets, experiment
  outcomes, funding evidence or content decisions.
- **Unknown:** Definitions, denominators, identity stitching, bot filtering,
  warehouse transformations and retrospective event-version handling.
- **Unknown:** Consent, device, accessibility, audience and channel bias in
  observed populations.
- **Unknown:** Causal and educational validation, counter-metrics, unintended
  behaviour and known cases where a metric improved while the outcome did not.

---

## Lens 6: reversibility, option value and decisions under uncertainty

### Governing question

Which commitments can be undone, compensated, migrated or safely abandoned, how
long does that option remain available, and when is deliberate irreversibility
the more responsible choice?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** Saving a unit and unsaving it are explicit inverse actions.
  Both optimistically update local state and count, and both contain compensating
  state changes when the server request fails
  ([save compensation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/educator-api/helpers/saveUnits/useSaveUnits.tsx#L78-L110),
  [unsave compensation and toggle](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/educator-api/helpers/saveUnits/useSaveUnits.tsx#L113-L155)).
- **Observed (OWA):** Client feature gating reads a PostHog variant, renders
  nothing until it is loaded, and replaces the route with `/404` when the
  required variant is not enabled. Server-side flag lookup depends on a PostHog
  user ID recovered from cookies
  ([client feature gate](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/hocs/withFeatureFlag.tsx#L1-L29),
  [server flag lookup](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/utils/featureFlags.ts#L34-L61)).
- **Observed (OWA):** Content-retirement messaging distinguishes whether new
  units exist. Where they do not, teachers are advised to download old resources
  and check saved or shared links before removal; pupils are directed to a help
  article
  ([retirement decisions and retained copies](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/TakedownBanner/getBannerContent.tsx#L31-L103)).
- **Observed (OWA):** Removed teacher content can redirect to new resources and
  explain that the requested pandemic-era material has been removed. Pupil
  lesson redirects can state that the pupil was taken to a lesson on a similar
  topic
  ([teacher redirect explanation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/TeacherRedirectedOverlay/TeacherRedirectedOverlay.tsx#L11-L50),
  [pupil redirect explanation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/PupilRedirectedOverlay/PupilRedirectedOverlay.tsx#L16-L71)).
- **Observed (OWA):** Redirect data preserves incoming path, outgoing path and a
  choice among permanent and temporary HTTP redirect types. Query code warns if
  more than one redirect exists but uses the first result
  ([redirect contract](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/shared.schema.ts#L384-L408),
  [redirect selection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/browseLessonRedirect/browseLessonRedirect.query.ts#L9-L59)).
- **Observed (OWA):** Teacher-note persistence writes the current payload plus an
  `updated_at` timestamp to a deterministic document key with `set`; this
  function does not write a revision identifier or history entry
  ([note upsert](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/pupil-api/teacher-notes/upsertTeacherNote.ts#L1-L10)).
- **Observed (Components):** The release workflow runs after each successful
  `Verify` workflow on `main`; conventional commits determine whether
  semantic-release publishes and whether the version is patch, minor or major.
  Component guidance asks authors to mark deprecated components and name a
  replacement in source and Storybook
  ([release contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L56-L70),
  [release workflow](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/release.yml#L1-L48),
  [deprecation guidance](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/designingComponents.mdx#L23-L36)).

#### Initial interpretation and inherited assumptions

- **Inferred:** The estate contains several different option-preserving
  mechanisms: inverse user commands, compensating transactions, runtime
  exposure switches, compatibility redirects, retained downloads and package
  migration signals. They do not offer the same guarantee or operate for the
  same time window.
- **Inferred:** Content removal exposes a genuine trade-off: a downloadable copy
  preserves a teacher's option while also escaping future correction,
  accessibility, rights and freshness controls.
- **Unknown:** Production rollback, data restore, content versioning, flag
  lifecycle, redirect expiry, deprecation adoption and recovery exercise evidence
  are not established here.

### Movement 2: define the problem space

**Problem frame (Inferred):** Product, content, legal and technical decisions are
made with incomplete evidence. A responsible system must know which commitments
can be reversed, until when, at what cost and with what residual effects; retain
the evidence and alternatives needed to correct course; and make intentionally
irreversible decisions when safety, privacy or legal duty requires them. The
problem is unexamined lock-in or false confidence in a local undo mechanism.

The decision chain to examine is:

```text
uncertainty and evidence -> bounded commitment -> effects and observation
                         -> reversal/compensation/migration or deliberate finality
                         -> reconciliation -> learning and option retirement
```

**Constraints (Inferred):** Reversibility has carrying cost; deletion and urgent
takedown can need finality; external downloads and consumers cannot always be
recalled; data migrations can outlive a flag; and preserving every historical
state can conflict with privacy and safety.

**Success (Inferred):** Every consequential decision has an explicit
reversibility class, owner, observation window, retained evidence, stop/rollback
or compensation path, compatibility obligation and criteria for retiring the
option. Recovery is exercised at the boundary where effects actually occur.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                       | Reopened interpretation                                                                                                                                               |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Changed assumption:** An inverse button makes the action reversible. | **Inferred:** Save/unsave reverses current membership, while analytics, notifications, races or external effects can require separate reconciliation.                 |
| **Changed assumption:** A feature flag is a rollback plan.             | **Inferred:** It can reverse exposure; schema, content, persisted data, provider side effects and user expectations may already have changed.                         |
| **Changed assumption:** A redirect preserves the old capability.       | **Inferred:** It preserves address continuity while intentionally changing identity or destination; `similar` and `replacement` need separate authority and evidence. |
| **Changed assumption:** SemVer and deprecation make change reversible. | **Inferred:** They communicate compatibility and migration intent; they do not prove that consumers can migrate, pin, restore or avoid behavioural breakage.          |
| **Changed assumption:** Retained downloads are an unqualified option.  | **Inferred:** They preserve local access but can freeze stale, withdrawn, inaccessible or rights-restricted content outside correction channels.                      |
| **Changed assumption:** More reversibility is always more excellent.   | **Inferred:** Safety, privacy, legal takedown and false-content correction can require deliberate irreversibility with audit and accountable compensation.            |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** OWA and Components contain useful local mechanisms for
rollback, compensation, compatibility and warning, but the guarantee changes at
each boundary and no common decision model is visible. The seam is **uncertain
decision -> commitment and side effects -> retained option/evidence -> exercised
reversal or deliberate finality -> reconciliation and learning**.

| Warranted next investigation                                                                                                                            | Warrant                                                                                                                             | Explicit falsifier                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inventory consequential user, content, rights, data, dependency, release and provider decisions by reversibility class, window, owner and blast radius. | Source exposes several non-equivalent mechanisms but not the decision model that chooses or retires them.                           | Every consequential decision already has an owned classification, evidence threshold, stop condition, exercised recovery and explicit finality rationale with no material gap.      |
| Run recovery exercises for failed save reconciliation, feature withdrawal after writes, component major rollback and content/API projection rollback.   | Local inverse paths cannot establish recovery across persistent data, consumers, caches, providers and channels.                    | Each exercise restores or compensates the intended state within its requirement, accounts for every side effect and external consumer, and produces no unexplained residue.         |
| Trace one content retirement through old URLs, shares, saved items, downloads, search, Open API, rights changes and user communication over time.       | Retirement demonstrates the collision between safety/freshness, continuity and copies outside Oak control.                          | The trace shows a complete, owned lifecycle in which every projection is updated or intentionally retained, affected people understand the change, and stale harm is bounded.       |
| Test Components deprecation and breaking-change practice with independent consumers, including pin, parallel migration and rollback.                    | Release and annotation machinery express intent, while consumer option value and migration evidence are not visible in the package. | Representative consumers can detect, plan, validate, migrate and reverse every sampled change using public contracts alone, with bounded compatibility and no hidden OWA knowledge. |

#### Unresolved evidence

- **Unknown:** Which decisions are classified as reversible, compensatable or
  intentionally final and who accepts the residual risk.
- **Unknown:** Database backup/restore, content revision, deployment rollback,
  provider compensation and cross-channel cache behaviour.
- **Unknown:** Feature-flag ownership, expiry, cohort consistency and state
  reconciliation after a flag is disabled.
- **Unknown:** Redirect and deprecation lifetimes, consumer adoption, downloaded
  stale copies and evidence from actual recovery exercises.

---

## Lens 7: curriculum epistemic governance, contestability and participatory legitimacy

### Governing question

Which educational and product claims become authoritative, whose knowledge and
experience count, how are uncertainty and disagreement represented, and can the
people affected challenge a claim and trace how it was adjudicated?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** The teacher home page describes Oak's offer as helping
  teachers deliver a `world-class curriculum` and says that its
  national-curriculum-aligned resources are designed by subject experts
  ([teacher proposition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GenericPagesComponents/TeachersTab/TeachersTab.tsx#L90-L100)).
- **Observed (OWA):** Retirement messaging directs teachers from pandemic-era
  material to resources described as designed by teachers and leading subject
  experts and tested in classrooms
  ([expertise and classroom-testing claim](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/TeacherRedirectedOverlay/TeacherRedirectedOverlay.tsx#L38-L49)).
- **Observed (OWA):** The curriculum landing interaction states that plans are
  National Curriculum-aligned, sequenced across year groups and designed by
  curriculum experts, then links to Oak's curriculum-planning approach
  ([curriculum authority claims](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GenericPagesComponents/CurriculumTab/CurriculumTab.tsx#L71-L115)).
- **Observed (OWA):** Lesson projection schemas represent content guidance,
  misconceptions and responses, teacher tips and key learning points as text.
  The surrounding lesson overview includes an `updatedAt` value, but these
  projected claim structures do not carry a claim author, evidential basis,
  review status or recorded dissent
  ([educational claim shapes](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/shared.schema.ts#L15-L38),
  [lesson projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.query.ts#L222-L238)).
- **Observed (OWA):** Public curriculum pages identify current and legacy
  curriculum partners. Subject overviews project partner names, logos and
  biographies
  ([current and legacy partners](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/about-us/oaks-curricula.tsx#L174-L200),
  [subject partner projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/CurriculumComponents/OverviewTab/OverviewTab.tsx#L404-L465)).
- **Observed (OWA):** `Get involved` offers a teacher research panel, a route to
  published research, and a generic feedback form. Panel registration and
  feedback both leave OWA through HubSpot forms
  ([research and feedback routes](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/about-us/get-involved.tsx#L42-L77)).
- **Observed (OWA):** The organisation page exposes leadership and board
  identities, downloadable documents and CMS-authored governance text
  ([institutional governance projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/about-us/meet-the-team.tsx#L109-L194)).
- **Observed (Components):** Component guidance routes a missing colour-role
  token to `design`, while ambiguous package placement is discussed in an
  `#oak-components` Slack channel. Package changes require one reviewer and ask
  authors to seek QA, designer or product-manager review `when necessary`
  ([design authority](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/designingComponents.mdx#L15-L21),
  [classification authority](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/organisationalStructure.mdx#L5-L13),
  [review rule](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L56-L60)).

#### Initial interpretation and inherited assumptions

- **Inferred:** `Expert`, `world-class`, `tested in classrooms` and curriculum
  alignment are trust-bearing claims. The rendering source establishes that the
  claims are made, not how expertise was selected, what classroom evidence
  warrants them or where the claims cease to apply.
- **Inferred:** Partner identity and organisation-level governance add useful
  provenance, but they are not the same as claim-level provenance, evidence,
  adjudication or correction history.
- **Inferred:** A research panel and feedback route create opportunities to
  contribute experience. They do not establish who is represented, whether an
  input reaches a decision, what weight it receives or whether the contributor
  can see the outcome.
- **Inferred:** Components makes product and design judgement reusable. Its
  consistent defaults can therefore propagate either well-warranted knowledge
  or an unexamined institutional assumption across consumers.
- **Unknown:** Expert and partner selection, conflicts of interest, evidence and
  review standards, classroom-test design, pupil participation, dissent,
  challenge adjudication and claim-level revision history are not established by
  these repositories.

### Movement 2: define the problem space

**Problem frame (Inferred):** A public curriculum service must turn several
legitimate but fallible forms of knowledge, including scholarship, curriculum
authority, subject expertise, teacher practice, pupil experience and empirical
research, into usable claims without making their authority unchallengeable. It
must let affected people contest consequential claims, adjudicate disagreement
accountably, and propagate justified correction without hiding uncertainty or
making every interaction unusably academic. The problem is not merely content
accuracy; it is the legitimacy and revisability of the process that establishes
what counts as accurate.

The epistemic chain to examine is:

```text
experience/evidence/authority -> scoped claim and confidence -> review and decision
                              -> publication and use -> challenge or new evidence
                              -> adjudication -> revision/retraction and public record
```

**Constraints (Inferred):** Expertise remains necessary; not every educational
disagreement is resolved by voting; pupil safeguarding and research privacy
matter; curriculum users need stable, comprehensible material; and urgent safety
or factual corrections can require action before deliberation is complete.

**Success (Inferred):** Consequential claims have proportionate evidence,
scope, uncertainty, accountable decision authority and change history. Relevant
teachers, pupils and affected communities can contribute and challenge them;
adjudication is explainable; dissent is retained where material; and corrections
reach every projection. This does not require a bibliography on every screen.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                                           | Reopened interpretation                                                                                                                                                    |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Changed assumption:** Expert authorship establishes that a claim is justified.           | **Inferred:** Expertise changes the prior warrant, but selection, evidence, scope, conflict and review still determine whether this claim deserves authority.              |
| **Changed assumption:** `Tested in classrooms` establishes effectiveness.                  | **Inferred:** It could mean usability exposure, practitioner review, formative iteration or causal outcome evidence; each supports a different conclusion.                 |
| **Changed assumption:** A research panel and feedback form make the process participatory. | **Inferred:** Voice becomes power only when representation, agenda setting, decision rights, response and visible influence are specified.                                 |
| **Changed assumption:** Naming partners and publishing governance establishes provenance.  | **Inferred:** It identifies institutions and accountable bodies, while the path from a particular claim to its evidence, reviewer, decision and revision remains separate. |
| **Changed assumption:** Open access or a public API makes curriculum claims contestable.   | **Inferred:** Inspection and reuse increase possible scrutiny; contestability additionally needs a route, standing, adjudicator, evidence standard and answer.             |
| **Changed assumption:** Consistent design-system decisions are neutral infrastructure.     | **Inferred:** Defaults encode judgements about language, ability, status and valid use; scale increases the need for warranted and challengeable decisions.                |
| **Changed assumption:** Removing disagreement produces trustworthy consistency.            | **Inferred:** Some convergence is necessary for use, but erasing material uncertainty or defensible minority positions can produce confidence without legitimacy.          |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** OWA exposes expertise claims, partners, research,
feedback and institutional governance, and it projects educational judgements
as usable data. Components exposes some internal design and review authorities.
The missing evidence is not proof of absent practice, but it leaves a critical
seam unresolved: **knowledge and lived experience -> scoped claim -> authority
and participation -> publication -> challenge -> adjudication -> correction and
decision history**.

| Warranted next investigation                                                                                                                      | Warrant                                                                                                                          | Explicit falsifier                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Trace representative curriculum and design claims from source evidence through author, expert/partner review, decision, projection and revision.  | The source exposes consequential claim text and some institutional attribution, but not the complete warrant or authority chain. | Each sampled claim already has a current, inspectable trail linking evidence, scope, uncertainty, contributors, conflicts, accountable approval, versions and every projection.      |
| Walk a real or controlled challenge to a misconception, content-guidance item or design default through intake, adjudication and correction.      | Generic feedback and internal review routes do not show whether a specific knowledge challenge can change authoritative output.  | A challenger can identify the governing standard, follow bounded status and appeal, receive a reasoned answer, and verify timely, versioned correction across all affected channels. |
| Audit participation and decision rights for teachers, pupils, SEND users, minoritised communities, non-users, partners and independent consumers. | Claims of classroom testing and teacher participation leave representation, agenda power and pupil voice unresolved.             | Representative evidence shows every materially affected group has proportionate agenda, evidence, challenge and decision influence, with measured exclusions and effective redress.  |
| Examine the evidential meaning of `expert`, `research-informed` and `tested in classrooms` for a stratified sample of public claims.              | The same language can describe substantially different methods and support substantially different inferences.                   | Every sampled phrase maps to a defined, appropriate method, population, limitation and claim strength, including contrary/null evidence and the decision it changed.                 |

#### Unresolved evidence

- **Unknown:** Who selects curriculum experts, partners and reviewers, their
  relevant credentials, conflicts, terms, decision rights and accountability.
- **Unknown:** Claim-level sources, confidence, peer/practitioner review,
  curriculum version history, minority positions and correction records.
- **Unknown:** Whether teachers, pupils and affected communities can report a
  specific content problem, receive a reasoned outcome, appeal and see every
  derivative corrected.
- **Unknown:** Participation demographics, exclusion and non-response, pupil and
  non-user voice, agenda-setting power and evidence of influence on decisions.
- **Unknown:** What `tested in classrooms` denotes, which outcomes were
  observed, under what conditions, and whether negative or null findings changed
  the resource.

---

## Lens 8: institutional and incentive architecture

### Governing question

Which formal and informal rules allocate authority, reward particular
behaviours and create ongoing obligations, and do those institutions make
public-value excellence and ecosystem stewardship the rational thing to do?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** Local application setup requires configuration from an
  1Password developers vault
  ([OWA setup access](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/README.md#L38-L58)).
- **Observed (OWA):** Changes to `main` are described as pull-request-only and
  drive semantic release and deployment workflows. The pull-request template
  asks for tests, browser/device checks, accessibility consideration, design
  sign-off and product-owner approval
  ([OWA change and release path](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/README.md#L146-L151),
  [OWA approval checklist](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/pull_request_template.md#L25-L32)).
- **Observed (OWA):** The checked-in `CODEOWNERS` rules assign cloud operations
  only for infrastructure and Terraform-workflow paths. They do not express
  product, curriculum, design or general application ownership
  ([OWA CODEOWNERS scope](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/CODEOWNERS#L1-L5)).
- **Observed (OWA):** The repository publishes code under MIT and documentation
  under OGL with brand exceptions, while stating that external code
  contributions are not currently accepted
  ([OWA contribution and licence boundary](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/README.md#L153-L175)).
- **Observed (Components):** The package describes itself as supporting React
  and Next applications produced by Oak. Installation is public, but enabling
  images requires values obtained from OWA configuration or another engineer
  ([consumer and configuration boundary](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L7-L17)).
- **Observed (Components):** A change needs at least one reviewer, with
  QA/designer/product review sought when necessary. The release workflow runs
  semantic-release after a successful `Verify`; commit messages drive whether
  and how it publishes
  ([change and version rules](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L56-L70),
  [verification gate](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/verify.yml#L1-L39),
  [release gate](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/release.yml#L1-L48)).
- **Observed (Components):** Package guidance classifies generic or multiply
  consumed components as shared and directs ambiguity to an internal Slack
  channel. Repo-specific components should live in their repo, except when they
  depend on unexported internals, in which case the guidance puts them in the
  package's squad-specific area
  ([organisational placement rules](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L86-L142)).
- **Observed (Components):** The repository is published under MIT, its
  documentation under OGL and its trademarks excluded from MIT, but external
  code contributions are not currently accepted
  ([Components contribution and licence boundary](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L144-L162)).
- **Observed (Components):** Like OWA, its checked-in `CODEOWNERS` assigns only
  infrastructure and Terraform-workflow paths to cloud operations
  ([Components CODEOWNERS scope](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/CODEOWNERS#L1-L7)).

#### Initial interpretation and inherited assumptions

- **Inferred:** Public source, public installation and permissive code use
  coexist with change, configuration and discussion routes designed primarily
  around internal Oak actors. Those are distinct dimensions of openness.
- **Inferred:** The package boundary partly reflects organisation and access
  boundaries. The documented internal-component caveat is an explicit pressure
  for a repo-specific capability to enter the shared package even when reuse is
  not its reason for being there.
- **Inferred:** Automated checks and releases institutionalise valuable quality
  and distribution work. Automation changes ceremony; it does not allocate
  long-term consumer support, content authority, migration work or stewardship.
- **Inferred:** Review roles and CODEOWNERS express fragments of decision
  authority. They do not reveal the full mandate, priority system, incentives,
  resourcing, outcome ownership or duty to independent consumers.
- **Unknown:** Legal mandate, funding conditions, organisational targets,
  performance incentives, actual branch protections, informal authority,
  maintainer allocation, vendor obligations and ecosystem support commitments
  are not established by these repositories.

### Movement 2: define the problem space

**Problem frame (Inferred):** Architecture is produced and sustained by an
institution. Funding, mandate, accountability, targets, team boundaries,
decision rights, release rules and contribution policy determine which work is
rewarded, whose costs remain visible and whether an ecosystem can exercise
agency. Excellence requires those arrangements to make durable public value,
challenge, interoperability and responsible stewardship rational and
accountable, rather than allowing local proxies, centralised access or hidden
obligations to shape the system accidentally.

The institutional chain to examine is:

```text
mission/mandate/funding -> accountability and targets -> decision rights/resources
                        -> architecture/contribution/release/support behaviours
                        -> consumer and public effects -> feedback and rebalancing
```

**Constraints (Inferred):** This pass assumes no arbitrary delivery deadline or
cost ceiling. Security, safeguarding, legal and brand duties remain real; users
need service continuity; and independent consumers need stable agency rather
than promises that only internal relationships can fulfil.

**Success (Inferred):** Mandate, decision rights, incentives and stewardship
obligations are explicit and mutually consistent. Authority sits with an
accountable owner; excellence evidence governs release and retirement;
independent consumers can inspect, adopt, challenge and evolve safely; lifecycle
work is a first-class responsibility; and institutional rules can themselves be
challenged and revised when their externalities become visible.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                                         | Reopened interpretation                                                                                                                                                         |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Changed assumption:** MIT source plus an NPM package constitutes an ecosystem commons. | **Inferred:** It grants important use rights and distribution, not necessarily configuration access, influence, support, public decision records or contribution standing.      |
| **Changed assumption:** A shared package necessarily has shared ownership and benefit.   | **Inferred:** It can instead collect code because internal dependencies and team boundaries make another location difficult; consumers can inherit the resulting obligation.    |
| **Changed assumption:** More approval gates necessarily produce higher quality.          | **Inferred:** Gates are useful only when consequence determines the right evidence and accountable authority, and when ownership persists after approval.                       |
| **Changed assumption:** Automated release means self-maintaining evolution.              | **Inferred:** It reduces release ceremony while potentially increasing consumer observation, migration and support obligations; the net effect requires lifecycle evidence.     |
| **Changed assumption:** One reviewer plus optional specialists is always proportionate.  | **Inferred:** A style fix and a public curriculum interaction carry different risks; review authority should follow consequence, evidence and affected constituencies.          |
| **Changed assumption:** Slack discussion is merely an efficient coordination channel.    | **Inferred:** It can resolve ambiguity quickly; unless access and rationale are made durable, precedent can remain unavailable to future maintainers and independent consumers. |
| **Changed assumption:** `CODEOWNERS` describes the whole ownership model.                | **Inferred:** The checked-in rules cover infrastructure paths; product, content, design, service and ecosystem accountability may live elsewhere and must be traced.            |
| **Changed assumption:** Closing external contributions guarantees coherence or safety.   | **Inferred:** It is an admission boundary, not evidence of the internal quality model; it also changes who can correct, extend or contest the shared asset.                     |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** OWA and Components encode real institutions in setup
access, sign-off, automation, repository placement, licensing and contribution
rules. They reveal a public distribution surface whose decision and knowledge
surface is more internal. That is not by itself a judgement about the
institution's unseen practice, but it makes the governing seam unavoidable:
**mission and mandate -> funding/targets -> authority and incentives ->
architecture and stewardship behaviours -> consumer/public externalities ->
accountability and institutional change**.

| Warranted next investigation                                                                                                                  | Warrant                                                                                                                           | Explicit falsifier                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Map legal mandate, funding conditions, targets, decision rights and public accountability across curriculum, product, Components and the API. | These determine architectural incentives and legitimate authority but are almost entirely outside the source examined here.       | A current, coherent and public map already shows how each consequential decision and target derives from mandate, names an accountable owner, resolves conflict and measures value.    |
| Build a stewardship ledger for representative capabilities, covering owner, competence, quality evidence, operations, support and succession. | Merge and release rules show admission, while durable ownership and the obligations created for every consumer are not visible.   | Every capability already has accepted end-to-end obligations, capable owners, capacity, service evidence, deprecation/migration duties and tested succession without orphaned work.    |
| Run an independent-consumer and contributor journey from discovery through assets, issue, proposal, upgrade, migration and exit.              | Public installation and licence coexist with internal configuration, private coordination and closed code contribution.           | Independent consumers can complete every required step through durable public contracts, influence proportionately, recover from change and exit without privileged Oak knowledge.     |
| Trace incentives and externalities through recent placement, release, vendor and cross-squad decisions.                                       | The internal-dependency caveat demonstrates that local organisational convenience can shape a long-lived public package boundary. | Each sampled decision optimises an explicit public outcome, accounts for maintenance and consumer externalities, assigns them to the decision-maker and remains revisable on evidence. |
| Stress-test governance with a contested curriculum claim, accessibility regression, breaking package change and maintainer departure.         | Normal-path approvals cannot demonstrate how competing authorities, urgent harm and long-term ownership are reconciled.           | Existing governance resolves every scenario with timely accountable authority, preserved evidence, affected-party voice, bounded harm and sustained service without informal rescue.   |

#### Unresolved evidence

- **Unknown:** Oak's current legal mandate, funding and reporting conditions,
  organisational objectives, targets, counter-metrics and consequences for
  missing them.
- **Unknown:** Full decision-rights and ownership maps, branch protections,
  actual review practice, escalation, appeals and responsibility after release.
- **Unknown:** Maintainer workload, support demand, consumer inventory,
  migration burden, succession risk and total lifecycle obligations of the
  package and application.
- **Unknown:** The reasons external contributions are closed, issue and proposal
  outcomes, community demand, possible contribution modes and the effect on
  independent correction or extension.
- **Unknown:** Procurement and provider incentives, contractual exit and data
  obligations, team performance incentives and cases where local delivery
  externalised work onto another team or consumer.

---

## Cross-lens synthesis

### Problem frame and load-bearing observations

**Inferred:** Together these eight lenses expose OWA and Components as part of a
public service that makes commitments across people, providers, legal authority,
cultures, channels, measurements, knowledge, institutions and time. The
load-bearing observations are:

1. **Observed:** Visible commands and acknowledgements often front asynchronous
   or external work whose owner and completion are not encoded in the same
   contract.
2. **Observed:** Rights state affects notices, attribution, file selection,
   authentication and geography, while the authority and provenance behind that
   state are outside the rendered code.
3. **Observed:** English and UK curriculum assumptions appear in routes, copy,
   formatting, fonts and document generation, alongside an international
   onboarding branch.
4. **Observed:** The estate projects educational material into many human and
   machine channels, including an explicitly discoverable Curriculum Open API,
   with independent transformation paths.
5. **Observed:** Analytics has typed/versioned instrumentation, but several
   observables are route or workflow states and consent changes the observed
   population.
6. **Observed:** Rollback, compensation, redirects, downloads, flags and semantic
   versioning preserve different options and leave different residual effects.
7. **Observed:** OWA makes public claims about expert design, classroom testing
   and curriculum authority, identifies partners and provides research and
   feedback routes, while claim-level warrant and adjudication are not projected
   with the educational claims examined.
8. **Observed:** Public code and package distribution coexist with internal
   configuration, private coordination, closed code contribution and repository
   placement rules partly shaped by unexported internals.
9. **Observed:** Components sometimes owns the human wording of service,
   educational or status state while OWA and external authorities determine the
   underlying truth.
10. **Unknown:** Operational ownership, legal authority, cultural validity,
    cross-channel equivalence, metric decision use, exercised recovery,
    epistemic adjudication and institutional incentives cannot be recovered from
    source structure alone.

The recurring seams are:

| Seam                                                       | Question exposed by the lens                                                                                                                 |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontstage command -> backstage owner                      | Does the visible state identify what actually happened, who owns the next work and how the person recovers?                                  |
| Asset -> rights authority -> every derivative              | Do permission, exception and attribution remain correct and actionable through transformation and reuse?                                     |
| Intended audience -> locale/culture -> educational meaning | Is the context supported, explicitly out of scope, or incidentally reachable with assumptions that change meaning?                           |
| Authoritative concept -> channel projection                | Which semantics, identity, rights, accessibility and version are invariant, and is equivalent use demonstrated?                              |
| Construct -> event -> decision/incentive                   | What inference is valid for the observed population, and what changes when the proxy becomes a target?                                       |
| Uncertain choice -> commitment -> recovery/finality        | Which effects can be reversed or compensated, for how long, and when should the option intentionally close?                                  |
| Evidence/experience -> claim -> challenge -> correction    | Whose knowledge counts, what warrants authority, and can affected people obtain reasoned adjudication and propagated revision?               |
| Mandate -> incentives/authority -> stewardship             | Do institutional rules align decision power, lifecycle obligations, ecosystem agency and accountability with public value?                   |
| Application authority -> Components language               | Can a reusable interaction assert a consequential state only when the real service, legal, educational or persistence authority warrants it? |

### Cross-lens hypotheses and invalidators

These are research hypotheses, not conclusions or architecture proposals.

| Hypothesis                                                                                                                                                               | Why it is plausible from the pinned source                                                                                                                                             | Evidence that would invalidate it                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **H1:** The highest-consequence misunderstandings cluster where concise Components or OWA copy compresses a multi-stage service or authority state.                      | Registration, notes, download, completion, redirect and rights language each summarise a transition owned elsewhere.                                                                   | State contracts and representative comprehension evidence show the copy always produces an accurate belief about authority, durability, consequence and recovery.                                             |
| **H2:** Rights, locale and channel metadata do not yet travel as one durable projection contract across the full estate.                                                 | Rights are strings/flags, locale decisions are distributed, and web, file, transcript and API transformations are implemented independently.                                           | A verified graph links structured rights, locale, identity and version through every source asset and derivative, with automated parity and correction evidence.                                              |
| **H3:** Current analytics is strongest as product-operability evidence and insufficient by itself for claims of educational or public impact.                            | Events directly encode clicks, starts, route context, grades and section completion; outcome validation and decision use are absent here.                                              | Current independent validity evidence demonstrates that the actual metrics used for impact decisions causally and equitably measure the claimed human/public outcomes.                                        |
| **H4:** Option-preserving mechanisms are locally competent but lose guarantees at cross-system and external-copy boundaries.                                             | Save compensation is explicit, while flags, redirects, downloads, package versions and retirement affect different authorities and lifetimes.                                          | Exercised recovery evidence accounts for persistent state, providers, caches, channels and independent consumers for every consequential decision class.                                                      |
| **H5:** Human support, international users, offline users and non-consenting users are the most likely populations to be missing from source-led understanding.          | Their outcomes depend on operations, culture, environment or deliberately absent telemetry rather than code paths alone.                                                               | Representative service, research and outcome evidence already includes each population and shows no material unowned need, exclusion, bias or hidden workaround.                                              |
| **H6:** Public expertise, partnership and research claims are more inspectable than the claim-level process by which curriculum authority can be challenged and revised. | Claims, partner identities and participation routes are rendered, while claim-level evidence, standing, adjudication and decision history are not carried in the examined projections. | Representative claims already expose proportionate evidence, scope, uncertainty, contributors, conflicts, accountable adjudication, dissent and propagated version history.                                   |
| **H7:** The current open-source and package surfaces enable use more strongly than ecosystem governance or independent stewardship.                                      | MIT/OGL distribution coexists with internal configuration and Slack, closed code contribution, narrow checked-in CODEOWNERS and placement pressure from unexported internals.          | Independent consumers already have durable public configuration, decision records, proportionate influence, support/migration contracts and demonstrated stewardship agency without privileged relationships. |

### Assumptions and inherited shapes that changed

- **Changed assumption:** A digital journey is not the complete service.
- **Changed assumption:** A licence notice, attribution string or access gate is
  not the whole rights system.
- **Changed assumption:** Locale-neutral primitives and extracted strings would
  not by themselves establish cultural or curricular applicability.
- **Changed assumption:** Having web, file, transcript, print and API outputs is
  not evidence that they interoperate or preserve equivalent outcomes.
- **Changed assumption:** A typed, semantically versioned event is structurally
  reliable data, not automatically a valid measure.
- **Changed assumption:** Undo, flag, redirect, download, deprecation and rollback
  are not interchangeable forms of reversibility.
- **Changed assumption:** Product language in a kit is not merely presentation
  when it names a service, legal, educational or durable state.
- **Changed assumption:** Expert authorship, classroom testing, partner identity
  and feedback access do not by themselves make a knowledge system legitimate or
  contestable.
- **Changed assumption:** Public code, permissive licensing and package
  distribution are not the same as public decision rights, contribution access
  or funded stewardship.

### Warranted portfolio investigations

These investigations gather missing evidence before any target architecture is
chosen.

| Next investigation                                                       | Warrant                                                                                                                                            | Falsifier                                                                                                                                                                              |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| End-to-end authority trace for three representative educational objects  | Service state, rights, locale, channel, measurement and recovery all converge on the identity and lifecycle of the same object.                    | Existing traces already connect authoritative source, owner, rights, locale, version, every projection, metric, change and recovery with no unexplained boundary.                      |
| State-language correspondence study across OWA and Components            | Reusable product wording can create beliefs about backstage, legal, educational and persistence truth.                                             | Every consequential label has a precise authority-bearing contract and representative users correctly predict state, consequence and recovery.                                         |
| Cross-channel rights, locale and accessibility parity programme          | Independent projection pipelines can preserve local correctness while silently diverging.                                                          | Automated contracts and human outcome evidence demonstrate every required invariant and intentional adaptation across all supported channels.                                          |
| Metric validity and decision-use audit                                   | The event estate is visible, while actual metrics, targets, incentives and causal warrant are not.                                                 | All decision-driving measures have validated constructs, measured missingness, counter-metrics, ethical bounds and no material Goodhart pathway.                                       |
| Service and recovery exercises with operations and independent consumers | Support and reversibility guarantees cannot be inferred from code paths or package release rules.                                                  | Exercised evidence demonstrates bounded recovery across providers, people, persisted data, external copies and public consumers for all material failure classes.                      |
| Curriculum claim, participation and contestability cases                 | Public trust claims and feedback routes do not establish the evidence, representation, adjudication or correction process for a specific claim.    | Sampled claims and challenges already connect evidence, authority, affected-party participation, reasoned resolution, versions and every projection without material opacity.          |
| Institutional incentive and stewardship map                              | Repository rules expose internal access and release institutions, while mandate, targets, ownership, obligations and externalities remain unknown. | Current evidence already links mandate, funding, decision rights, incentives and lifecycle ownership to public outcomes and independent-consumer agency for every material capability. |

### Unresolved evidence capable of changing the whole synthesis

- **Unknown:** A current service catalogue with accountable operational and
  human owners, response commitments and failure demand.
- **Unknown:** An authoritative asset/provenance/rights graph and exercised
  correction or takedown process across every projection.
- **Unknown:** The intended international and cultural scope and representative
  evidence from people inside each claimed context.
- **Unknown:** A projection contract connecting web, documents, media,
  transcripts, print, offline use and public machine interfaces.
- **Unknown:** The organisation's metric catalogue, decision log, target and
  experiment governance, validity evidence and known Goodhart cases.
- **Unknown:** A decision/reversibility register and evidence from cross-system
  rollback, migration, restore and intentional-finality exercises.
- **Unknown:** Claim-level evidence, expert and partner selection, participation,
  dissent, challenge adjudication and correction history for consequential
  curriculum and product decisions.
- **Unknown:** Legal mandate, funding and targets, decision rights, maintainer
  capacity, consumer obligations, contribution rationale and institutional
  externalities.

The synthesis would materially change if that evidence demonstrated explicit
authorities, lossless or intentionally adapted projections, valid measurement,
exercised recovery, legitimate epistemic governance and aligned institutional
stewardship across these seams. Until then, the warranted conclusion is not that
a particular architecture should be adopted. It is that any future architecture
claim must state which service promise, right, cultural meaning, channel
invariant, measurement inference, future option, knowledge authority or public
accountability it protects, and what evidence would falsify that claim.
