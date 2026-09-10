# OWA and Oak Components through preservation and human-rights lenses

## Purpose and method

This record applies OCE's pinned
[`concept-exploration`](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/skills/concept-exploration/SKILL-CANONICAL.md)
workflow to two perspectives that require different kinds of deepening:

1. **Human rights and duty-bearer analysis** is an **orthogonal expansion** from
   human outcomes and public value. It asks whether a rights-holder has a claim
   against an identifiable duty-bearer and an effective remedy, including where
   aggregate benefit remains positive.
2. **Long-term digital preservation and archival continuity** is a **recursive
   deepening** of the portfolio's information, time and lifecycle work. It asks
   whether an exact, authentic and intelligible information object can survive
   decades of change, not merely whether today's route or current content remains
   available.

Each pass runs the four movements in order:

1. reflect on the raw observations and expose inherited assumptions;
2. define a mechanism-neutral problem space;
3. reopen possible solutions and competing explanations; and
4. synthesise only warranted next investigations, each with an explicit
   falsifier.

The examined revisions are:

| Source                        | Pinned revision                                                                                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Oak Web Application           | [`510ac63a62fb37a70183b00ce0f5fb15be4491e5`](https://github.com/oaknational/Oak-Web-Application/tree/510ac63a62fb37a70183b00ce0f5fb15be4491e5)           |
| Oak Components                | [`8ff8264fa921e4e40fdaf9a99b02fd156c699cc8`](https://github.com/oaknational/oak-components/tree/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8)                |
| OCE Concept Explorer Practice | [`bd878a3a550c8e5e5d21163a6d0962cebdaf43fa`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa) |

This is current-state research. It neither prescribes an OCE target architecture
nor proposes repairs to OWA or Oak Components. Rights terminology supplies an
analytical structure, not a legal conclusion about Oak, a school, a supplier or
any individual case.

## Epistemic discipline

- **Observed** means that the pinned source directly contains the behaviour,
  dependency, data shape or declared intent.
- **Inferred** means a reasoned interpretation of those observations. It is not
  a fact about production operation, historical custody, legal applicability or
  human impact.
- **Unknown** means the repositories cannot establish the answer. A plausible
  external process, supplier control or policy is not substituted for evidence.
- A source pin proves what was in Git at one revision. It does not by itself
  prove which package artifact was deployed, what mutable authorities returned,
  or what a user received on a date.
- A policy link or interaction proves that a route or control is encoded. It
  does not prove that a child understood it, a right was realised, or a remedy
  was effective.

## Boundary vocabulary

- **OWA** means application routes, orchestration, generated outputs, remote
  authorities, workflow state, persistence and application policy.
- **Components** means the public package/source's primitives, patterns and
  teacher/pupil product-shaped components, including the source manifest's
  runtime and asset assumptions. The pinned source is not evidence that a
  corresponding version 3 tarball was inspected.
- **Preservation object** means the content or record whose identity and
  significant properties are to survive, together with the information needed
  to understand and verify it.
- **Rights-holder** means the person whose claim is being examined; this can be
  a pupil, teacher, parent or other affected person depending on context.
- **Duty-bearer** means the actor accountable for respecting, protecting or
  fulfilling that claim. Source structure does not determine legal duty.

---

## Lens 1: human rights and duty-bearer analysis

### Governing question

When an Oak journey affects education, equality, privacy, participation, safety,
expression or access to a remedy, who can make a claim, who must answer it, what
limit is being imposed, and can a person obtain timely and effective correction?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed (OWA):** The pupil entry page describes free KS1 to KS4 lessons,
  videos and quizzes reached by choosing a year group, subject and lesson
  ([pupil offer](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/pupils/index.tsx#L13-L35)).
- **Observed (boundary):** OWA decides whether pupil content guidance can open,
  supplies age restriction and supervision facts, and records accept or decline.
  For classroom assignments it changes decline to `Exit lesson`; for other
  journeys it uses the Components default
  ([OWA content-guidance policy](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/Views/PupilLessonOverview/PupilLessonOverviewContentGuidanceModal/PupilLessonOverviewContentGuidanceModal.tsx#L16-L85)).
- **Observed (Components):** The reusable guidance contract includes label,
  description and area, but its rendering deduplicates and displays labels,
  optionally displays supervision level, requires an accept or decline action,
  and hides the ordinary close control
  ([guidance contract and projection](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/browse/OakPupilJourneyContentGuidance/OakPupilJourneyContentGuidance.tsx#L13-L68),
  [decision interaction](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/browse/OakPupilJourneyContentGuidance/OakPupilJourneyContentGuidance.tsx#L84-L161)).
- **Observed (OWA):** The lesson query retains content-guidance label,
  description and area and joins guidance with a supervision level. It also
  carries ordinary and sign-language video playback identifiers plus transcript
  sentences
  ([guidance projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.query.ts#L102-L113),
  [supervision and alternate media](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.query.ts#L222-L245)).
- **Observed (boundary):** The pupil video view exposes a transcript when
  sentences exist and can offer a sign-language switch. The Components shell
  connects its disclosure control with `aria-controls`, `aria-expanded` and a
  polite live region
  ([OWA alternate-media composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/Views/PupilLessonVideo/PupilLessonVideoTranscript/PupilLessonVideoTranscript.tsx#L8-L49),
  [Components transcript interaction](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/lesson/OakLessonVideoTranscript/OakLessonVideoTranscript.tsx#L24-L79)).
- **Observed (OWA):** Some copyrighted teacher material requires sign-in; some
  is limited to the UK. The geoblock explains copyright as the reason, links to
  more information, and offers contact when a UK user believes the decision is
  wrong
  ([restriction and contestation copy](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/RestrictedContentPrompt/RestrictedContentPrompt.tsx#L32-L127)).
  A hook derives the restriction from authentication, onboarding and a region
  authorisation value in user metadata
  ([restriction decision inputs](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/hooks/useComplexCopyright.ts#L16-L39)).
- **Observed (OWA):** A persisted pupil attempt can contain lesson identity,
  time, subject/year, exact pupil answers, grades, feedback, correct answers,
  hint state, worksheet activity and detailed video activity
  ([attempt record](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/pupil-api/types/lessonAttempt.ts#L43-L136)).
  A server-rendered sharing route retrieves an attempt by an `attemptId` path
  parameter and passes the result with current lesson questions to the result
  view
  ([shared-result projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/pupils/lessons/[lessonSlug]/results/[attemptId]/share.tsx#L15-L81)).
- **Observed (boundary):** OWA wraps the application in a consent client and
  Components consent UI, passes policy states and logs changes. The Components
  contract represents policy purpose, strict necessity, third parties and
  grant/deny state, with accept-all, reject-non-essential and granular-confirm
  actions
  ([OWA consent composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/cookie-consent/CookieConsentProvider.tsx#L1-L73),
  [Components policy and choice contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/cookies/OakCookieConsentProvider/OakCookieConsentProvider.tsx#L15-L108)).
- **Observed (OWA):** Error monitoring and feedback services are consent-gated.
  The Gleap feedback service is additionally disabled on `/pupils` and
  standalone video paths, while an optional accessibility logger is initialised
  from configuration
  ([service gating](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/AppComponents/App/AppHooks.tsx#L31-L58)).
- **Observed (OWA):** The global footer names contact, help, privacy, cookie,
  copyright, accessibility, safeguarding, complaints and freedom-of-information
  routes
  ([help and policy routes](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/AppComponents/LayoutSiteFooter/LayoutSiteFooter.tsx#L111-L176)).
  Their titles, update dates and substantive bodies are fetched from CMS rather
  than fixed in the pinned repository
  ([policy projection and authority](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/legal/[policyPageSlug].tsx#L109-L153),
  [policy retrieval](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/legal/[policyPageSlug].tsx#L161-L213)).
- **Observed (OWA):** A generic application error is reported internally; the
  default person-facing actions are retry and go back, with an optional supplied
  action slot
  ([error response](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/components/ErrorHandling/ErrorFallback.tsx#L15-L80)).

#### Initial interpretation and inherited assumptions

- **Inferred:** The code contains several safeguards relevant to rights: a
  declared free pupil offer, content warnings, alternate media, accessible interaction
  semantics, consent choices, policy routes and a route to contest one form of
  geolocation error. These are evidence of encoded controls, not proof that a
  substantive right is realised for each affected person.
- **Inferred:** Aggregate public value and an individual's claim are different
  units. A service could help many teachers and pupils while one pupil cannot
  access an accommodation, understand a warning, correct a record or obtain a
  remedy.
- **Inferred:** The removal of in-product Gleap feedback from pupil paths may be
  a protective privacy or safeguarding decision. It also means this particular
  feedback channel cannot evidence pupil participation or remedy. Source alone
  cannot choose between those interpretations or reveal other channels.
- **Inferred:** Copyright and education interests are both present. A
  rights-based inquiry does not assume that maximum access overrides creator
  rights; it asks who authorised the limit, whether the rule is necessary and
  proportionate to its legitimate purpose, who bears its effects, and how an
  error can be corrected.
- **Unknown:** Which human-rights instruments or statutory/public-law duties
  apply to Oak, schools, parents, authenticated users or suppliers in each
  journey. The repositories do not establish legal status, contracts or a
  complete allocation of responsibility.
- **Unknown:** Whether children or representative groups participate in content,
  warning, consent, data, accessibility and complaint decisions outside the
  repositories; whether notices are understood at different ages; or whether
  remedies work in practice.

### Movement 2: define the problem space

**Problem frame (Inferred):** A rights-respecting educational service must make
substantive entitlements and legitimate limits traceable from an affected person
to an accountable actor. It must prevent individual or minority harms from
being hidden by aggregate impact, consider children's best interests and
evolving capacities, detect indirect as well as direct discrimination, and make
participation and remedy real rather than symbolic. For education, this pass
tests availability, accessibility, acceptability and adaptability as distinct
qualities rather than treating a free URL as sufficient.

The accountability chain to examine is:

```text
rights-holder and context -> substantive claim or minimum guarantee
  -> duty-bearer and authority -> rule, decision or delegated service
  -> distribution of benefit and burden -> age-appropriate notice and participation
  -> reasoned decision -> timely remedy -> retained accountability evidence
```

**Who is harmed (Inferred):** A pupil can be excluded, exposed to unsuitable
content, unable to understand or challenge a decision, or have learning data
used without effective control. A teacher can be wrongly blocked or unable to
correct a restriction. Creators can have licensed material used beyond agreed
terms. Disabled, linguistically diverse, geographically marginalised or poorly
connected people can bear burdens that a nominally identical journey conceals.

**Constraints (Inferred):** Rights can be interdependent and can conflict; this
is not a single-score optimisation. Children may need protection and supported
decision-making as well as agency. Some controls can be implemented in reusable
Components, but a package cannot by itself assume legal authority, investigate
facts, own a reasoned decision or deliver an institutional remedy.

**Success (Inferred):** For every materially consequential journey, the affected
claim, minimum guarantee, legitimate aim, accountable owner, delegated actors,
group effects, best-interest reasoning, notice, participation and remedy are
explicit and evidenced. A person can obtain a timely correction or reasoned
outcome, and a beneficial aggregate metric cannot authorise crossing a protected
minimum.

### Movement 3: reflect on possible solutions

#### Assumptions and inherited shapes that changed

| Inherited assumption                                                                     | Changed understanding                                                                                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Positive public impact discharges the relevant duty.**                                 | **Inferred:** Aggregate benefit and equality averages can coexist with an unremedied individual claim or a burden concentrated on a small group.                                                                                                            |
| **Accessibility, safeguarding, privacy and consent controls prove rights are realised.** | **Inferred:** They are material safeguards. Realisation also depends on coverage, comprehension, outcomes, accountability and effective remedy.                                                                                                             |
| **Free content fulfils the education claim.**                                            | **Inferred:** Price and availability matter, but accessibility, acceptability, adaptability, learning context and remedies remain separate questions.                                                                                                       |
| **Treating everybody identically is non-discrimination.**                                | **Inferred:** A uniform interface or rule can impose unequal indirect burdens; accommodation and differentiated support may be necessary.                                                                                                                   |
| **A click is participation.**                                                            | **Inferred:** Accepting guidance, choosing cookies or generating telemetry is not the same as being heard in a decision that shapes a child's interests. Participation needs usable information, voice and evidence that the voice can affect the decision. |
| **A policy or complaints link is an effective remedy.**                                  | **Inferred:** Discoverability is one precondition. Effectiveness also requires accessibility, authority, timeliness, interim protection where needed, correction, reasons and appeal or review.                                                             |
| **A legitimate restriction is self-justifying.**                                         | **Inferred:** Copyright can justify a limit, but the particular decision still needs traceable authority, accurate inputs, proportionate burden and correction of error.                                                                                    |
| **A component can own a human-rights duty.**                                             | **Inferred:** It can preserve accessible semantics, warnings and choice affordances. The accountable application or institution must supply authority, context, ownership and remedy.                                                                       |
| **No observed complaint means no harm.**                                                 | **Inferred:** People with the least power or weakest feedback channel can be least visible in operational evidence. Absence of repository evidence is not outcome evidence.                                                                                 |

#### Competing explanations kept open

- **Inferred:** Mandatory content guidance may be an appropriate best-interest
  safeguard and supported pause, or it may elicit a formal click without
  comprehension. Age, context, wording and adult mediation determine which.
- **Inferred:** Hiding a close control can ensure an explicit safety decision;
  the accept and decline actions still encode agency. It can also create pressure
  if consequences and alternatives are not understood. Interaction shape alone
  cannot settle proportionality.
- **Inferred:** Disabling pupil feedback tooling may deliberately reduce child
  data collection and unsafe contact. Pupil voice and remedy may be provided
  through research, schools, parents, contact or safeguarding operations not
  visible here.
- **Inferred:** An `attemptId` sharing route can support pupil agency in showing
  learning to a trusted adult. It can also create disclosure risk if identifiers,
  access boundaries, expiry and deletion are weak. The route alone proves
  neither outcome.
- **Inferred:** The policy bodies and operational complaint processes may be
  complete and effective in CMS and service operations. The pinned source can
  establish their routes and mutable authority, but not their current substance
  or exercise.
- **Inferred:** Uniform English interaction language and UK-oriented restrictions
  may match the present remit. That explanation does not answer whether indirect
  burdens within the served population are identified and accommodated.

### Movement 4: synthesise and propose

**Synthesis (Inferred):** OWA and Components encode meaningful safeguards and
some contestability, but the repositories do not expose a complete
rights-holder-to-duty-bearer accountability chain. The most consequential seam
is not UI versus backend; it is **claim -> accountable authority -> system or
delegated decision -> distributed burden -> effective remedy**. Components can
carry durable interaction safeguards, while OWA supplies context and policy,
but neither repository alone proves who bears the duty or whether a person can
secure a reasoned correction.

#### Warranted next investigations

| Investigation                                                                                                                                                                                                                                                                           | Warrant                                                                                                                                                                           | Explicit falsifier                                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Map rights-holders, duty-bearers and delegated actors for pupil lesson access, warnings, assessment records, result sharing, analytics/consent, copyright restriction and accessibility support. Record the source of authority and any duty that cannot be delegated.                  | The same journey crosses Oak, schools or adults, content authorities, identity, consent, media and support services; repository ownership is not accountability.                  | Current governance already names the accountable actor, authority, delegation, escalation and evidence for every material decision, and exercised cases show no responsibility gap.                            |
| Conduct a child-rights impact assessment of the pupil lesson journey with direct, age-appropriate participation from varied children and mediating adults. Include content guidance, assessment feedback, alternate media, attempt persistence/sharing, analytics and support.          | Pupil-facing controls encode protection and choice, but source cannot establish comprehension, best interests, evolving capacities or meaningful voice.                           | A current assessment covering these exact journeys already includes representative child participation, records how it changed decisions and finds no material unsupported burden when independently reviewed. |
| Audit direct and indirect discrimination in outcomes and burdens across disability, language/literacy, geography, device/connectivity, school support and account status, using ethically governed evidence rather than only completion averages.                                       | Free and nominally uniform access can conceal disparate friction; alternate media and geographic/authentication branches show that materially different conditions already exist. | Disaggregated evidence with adequate coverage shows no material disparity, and tested accommodations and escalation paths close any detected gap without shifting harm elsewhere.                              |
| Run an effective-remedy walk-through for five adverse cases: harmful or misunderstood content, inaccessible lesson, inaccurate pupil attempt/result, incorrect geoblock and privacy/consent request. Observe notice, human contact, interim protection, correction, reasons and review. | Policy links, a geoblock contact route and retry/back controls establish entry points, not end-to-end redress.                                                                    | Representative cases consistently reach an authorised, timely and accessible outcome with reasons, correction or appeal as appropriate, and evidence shows claimants can actually use the route.               |
| Define and test rights-based minimum guarantees and non-tradeable thresholds against real product decisions, including a high aggregate-benefit scenario that harms a small group.                                                                                                      | Aggregate public-value reasoning cannot itself protect an individual floor or resolve conflicting rights.                                                                         | Existing decision records already name minimum guarantees, necessity/proportionality and best-interest tests, and governance demonstrably prevents optimisation or experimentation from crossing them.         |
| Trace supplier and package delegation for identity, media, captions, consent, analytics, error reporting and feedback. Verify that a change of provider or reusable component cannot silently remove notice, accommodation, evidence or remedy.                                         | Rights-relevant behaviour crosses OWA, Components and external services, while a package's affordance is not institutional accountability.                                        | Contracts, technical controls, monitoring and exit exercises already preserve every relevant guarantee and route claims to the accountable duty-bearer across provider or package change.                      |

#### Unresolved evidence

- **Unknown:** The applicable legal and policy duties and the allocation among
  Oak, schools, parents or guardians, content partners and service providers.
- **Unknown:** Current CMS policy text, age-specific notices, complaint service
  levels, independent review, case outcomes and whether remedies reach pupils
  without requiring an unusually capable adult intermediary.
- **Unknown:** Pupil understanding of content guidance, consent, assessment
  feedback, data sharing and support routes across ages and contexts.
- **Unknown:** Attempt-record purpose, access control, retention, expiry,
  correction, deletion, sharing threat model and the identity or capacity of the
  person exercising consent or other data rights.
- **Unknown:** Measured direct or indirect disparities, accommodation coverage,
  and the experiences of people who abandon a journey or cannot reach its
  telemetry and feedback channels.
- **Unknown:** Whether sign-language video, transcripts and other adjustments
  cover the content and significant learning claims sufficiently for affected
  pupils, rather than merely being present on some lessons.

---

## Lens 2: long-term digital preservation and archival continuity

### Governing question

What would have to remain identifiable, authentic, intelligible and usable for
a designated future community to understand an Oak lesson, curriculum,
resource, interaction or decision decades after its live dependencies changed?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed (OWA):** Takedown copy states that specified lessons and resources
  will be removed by the end of Spring Term 2026. Where there is no replacement,
  it tells teachers they may want to download resources to save them and to
  check links they have saved or shared
  ([retirement and local-copy advice](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/TakedownBanner/getBannerContent.tsx#L31-L104)).
- **Observed (OWA):** Redirect records contain an incoming path, an outgoing
  path and an HTTP redirect type. OWA asks the current curriculum API for the
  matching record, then sends the user to the outgoing path with a
  `redirected=true` marker
  ([redirect schema](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/shared.schema.ts#L384-L408),
  [redirect resolution](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/shared/lesson-pages/getRedirects.ts#L20-L89)).
- **Observed (OWA):** A canonical teacher lesson is assembled from the current
  curriculum API and a transcript-population step. If no lesson is returned,
  the page tries the current redirect authority and otherwise becomes not found
  ([lesson projection and fallback](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/teachers/lessons/[lessonSlug].tsx#L133-L176)).
- **Observed (OWA):** A production build requires an Oak configuration location
  supplied through `OAK_CONFIG_LOCATION`. A checked-in comment says production builds depend on a
  Vercel-specific environment value and anticipates future failover work, while
  the adjacent code also considers an override and Netlify `CONTEXT`
  ([build-time configuration](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/next.config.ts#L43-L86)).
- **Observed (OWA):** A lesson projection joins curriculum facts with resource
  URLs, Mux playback identifiers, a sign-language playback identifier,
  transcript sentences, deprecation state, media clips and additional files
  ([lesson representation set](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.query.ts#L206-L269)).
- **Observed (OWA):** Signed video playback depends on a live signing endpoint;
  client tokens last six hours and are refreshed. The endpoint selects separate
  2020 or 2023 Mux signing credentials and creates another six-hour token
  ([client token lifecycle](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/VideoPlayer/useSignedVideoToken.ts#L10-L103),
  [server signing authorities](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/video/signed-url/index.ts#L24-L104)).
- **Observed (OWA):** Transcript population reads WebVTT from a hard-coded
  production Google Cloud Storage bucket. It maps cues to text, removes the
  first voice tag and reconstructs sentences with a punctuation heuristic;
  media-clip caption names are inferred from media URLs
  ([caption retrieval and transformation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/utils/handleTranscript.ts#L7-L108),
  [clip-key derivation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/utils/handleTranscript.ts#L111-L133)).
- **Observed (OWA):** Curriculum downloads are regenerated from current
  curriculum and CMS authorities. When CMS material is absent, the generation
  path substitutes explicit placeholder copy rather than refusing every output
  ([current authorities and fallback content](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L72-L185)).
- **Observed (OWA):** The download endpoint redirects stale requests to the
  current materialised-view refresh time. A multi-file ZIP suffix hashes only
  the requested types and that refresh time, not the resulting bytes
  ([cache identity and generation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L229-L387)).
  If no refresh record is available, the refresh-time helper defaults to the
  current clock
  ([refresh fallback](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/downloads/getMvRefreshTime.ts#L4-L31)).
- **Observed (OWA):** DOCX generation has a SHA-256 helper, but an inserted
  image's relationship identifier and embedded filename hash the source URL or
  path before the bytes are fetched or read. The document footer also embeds
  the generation date
  ([URL/path-derived image identity](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/docx/docx.ts#L86-L175),
  [time-dependent footer](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/docx/index.ts#L48-L120)).
- **Observed (boundary):** OWA declares Oak Components `^2.45.0`, and its
  lockfile resolves `2.45.0`; the separately pinned Components revision declares
  package version `3.0.0`. The Components source manifest declares only `dist`
  for package publication and declares framework, styling and runtime peers
  ([OWA declaration](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/package.json#L84-L105),
  [OWA resolution](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/pnpm-lock.yaml#L44-L64),
  [Components package identity](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/package.json#L1-L44)).
- **Observed (Components):** Correct presentation requires two externally
  supplied asset environment values, theme, global styles and Lexend. Some
  pupil layout backgrounds construct absolute URLs from those values
  ([consumer prerequisites](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L7-L44),
  [lesson background dependency](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/lesson/OakLessonLayout/OakLessonLayout.tsx#L251-L280)).
- **Observed (Components):** A product-shaped image component accepts a
  version-like Cloudinary identifier, obtains provider configuration from
  context and is explicitly described as tightly coupled to Cloudinary
  ([Cloudinary representation contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/OakCloudinaryImage/OakCloudinaryImage.tsx#L11-L64)).
- **Observed (Components):** The source documents semantic-release rules in
  which qualifying conventional commits determine whether a patch, minor or
  major release is made, while `chore`, `refactor` and `docs` do not trigger a
  release. The release workflow runs semantic-release only after the `Verify`
  workflow completes successfully on `main`
  ([release declaration and exclusions](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L56-L70),
  [release workflow](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/release.yml#L1-L48)).

These are not observations that nothing is preserved. Git revisions and the
lockfile preserve source and dependency references; versioned package releases
can preserve named assemblies; redirects preserve a form of address continuity;
WebVTT-derived transcripts preserve some speech content; and DOCX, XLSX and ZIP
provide portable derivatives. The question is what preservation claim each
mechanism can actually support.

#### Initial interpretation and inherited assumptions

- **Inferred:** The live service is a projection across Git source, a resolved
  Components package, remote curriculum and CMS responses, configuration,
  fonts, media providers, caption storage and credentials. No one observed item
  is the complete historical lesson representation.
- **Inferred:** The code primarily encodes current delivery, replacement,
  redirection, download and cache behaviour. Those are useful continuity
  mechanisms, but their names do not establish archival identity, fixity,
  custody or future renderability.
- **Inferred:** A transcript is a meaningful alternate representation, yet the
  observed transform discards cue timing and at least some speaker markup. It
  cannot silently stand in for the significant properties of the original
  video and caption object.
- **Unknown:** Whether upstream curriculum, CMS, Mux, Cloudinary, Google Cloud,
  NPM, Vercel or internal operations retain versioned immutable inputs,
  manifests, checksums, provenance events or restorable historical releases.
- **Unknown:** Which future communities and uses matter: operational recovery,
  evidencing what was taught, curriculum research, legal accountability,
  re-publication, package consumers, or some combination.

### Movement 2: define the problem space

**Problem frame (Inferred):** Long-term preservation is the ability to maintain
an authentic and intelligible information object despite content retirement,
provider loss, link rot, format obsolescence, runtime decay, organisational
change and staff turnover. Availability today, a backup, a stable-looking URL
and a Git history can each contribute without being sufficient. The object also
needs enough representation information and preservation history for a future
custodian to know what it is, verify it, render its meaning and distinguish an
authorised migration from silent change.

For this analysis, a preservation object comprises:

```text
content/data/assets
  + representation information (schema, format, codec, font, runtime, service assumptions)
  + preservation description information
      (reference identity, provenance, context, fixity, rights, custody and events)
```

The causal chain to examine is:

```text
authoritative object -> captured representation set -> fixity and provenance
  -> custody, retention and access -> monitored dependencies
  -> verified migration or emulation -> future intelligible rendering
```

**Who is harmed (Inferred):** Teachers and pupils can lose material they relied
on; curriculum stewards can lose evidence of prior intent and change; future
maintainers can reproduce an artifact that looks plausible but is historically
wrong; researchers and accountable institutions can lose the ability to verify
what the public received.

**Constraints (Inferred):** Preservation is not equivalent to perpetual public
availability. Copyright, safeguarding correction, privacy, security and lawful
destruction can require restricted custody, redaction or deletion. A migration
can preserve meaning while changing bytes, but only if the significant
properties and transformation history are explicit and verified.

**Success (Inferred):** For each claimed object, an authorised future custodian
can identify the exact version, verify that it is unchanged or trace a validated
migration, render its significant meaning without an undocumented live
dependency, establish rights and access conditions, and audit custody and
preservation events.

### Movement 3: reflect on possible solutions

#### Assumptions and inherited shapes that changed

| Inherited assumption                                       | Changed understanding                                                                                                                                                                                      |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A pinned Git commit is the historical Oak service.**     | **Inferred:** It is an exact source snapshot. The observed service also depends on a different pinned Components package version and mutable configuration, content and media authorities.                 |
| **A redirect preserves a resource.**                       | **Inferred:** It preserves a route from an old address to a current destination. It need not preserve the identity, representation or meaning previously served at that address.                           |
| **A download is an archive.**                              | **Inferred:** It improves present portability. Once copied locally it can also escape correction, takedown, provenance updates and managed custody.                                                        |
| **A hash-looking name proves fixity.**                     | **Inferred:** The observed ZIP suffix hashes request types and a refresh time; the DOCX image name hashes a URL/path. Neither observation proves a digest of the final artifact bytes.                     |
| **An open or documented format guarantees longevity.**     | **Inferred:** OOXML and WebVTT improve the representation story, but future use still depends on retained schemas, fonts, codecs, transformation semantics, significant-property decisions and validation. |
| **A transcript preserves a video.**                        | **Inferred:** It can preserve speech content and improve access. The observed derivative omits timing and speaker structure and cannot establish visual or delivery equivalence.                           |
| **Keeping everything forever is preservation excellence.** | **Inferred:** Indiscriminate retention can conflict with privacy, safeguarding, security, copyright and legitimate destruction. Excellence includes reasoned retention, access and disposal.               |
| **Format migration is inherently preservative.**           | **Inferred:** A migration becomes preservative only when its authority, provenance, significant properties and equivalence checks are retained.                                                            |

#### Competing explanations kept open

- **Inferred:** The curriculum platform, CMS and media providers may already be
  the designated preservation authorities, with OWA intentionally acting only
  as a current projection. That would move custody rather than remove the need
  to establish it.
- **Inferred:** Cloud and package services may retain durable versions and
  backups. Backup and provider retention address some failure modes, but neither
  necessarily establishes authenticity, representation information, retention
  authority or an exit path.
- **Inferred:** Curriculum downloads may be intended only as immediately useful
  classroom derivatives. Their lack of an observed archival manifest would then
  be outside their claim, not a defect in that purpose.
- **Inferred:** Redirecting people to improved content can be exactly the right
  current-service behaviour even while it provides no historical continuity.
- **Inferred:** Removing or restricting an object can be required to protect a
  person or a creator. Preservation custody can remain restricted, or lawful
  destruction can be documented, without requiring public re-publication.

### Movement 4: synthesise and propose

**Synthesis (Inferred):** The pinned source exposes several continuity
mechanisms, but it does not establish an end-to-end preservation claim for a
lesson, curriculum version, media set, generated download, policy page or
deployed application. The load-bearing observation is compositional: a single
human-readable lesson crosses mutable authorities and representation
dependencies, while the two pinned repositories do not even describe the same
Components package assembly. The central seam is therefore **authoritative
object -> captured representation set -> verifiable custody -> future
interpretation**, not merely old URL -> new URL.

#### Warranted next investigations

| Investigation                                                                                                                                                                                                                                                                         | Warrant                                                                                                                                           | Explicit falsifier                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build a preservation-object and designated-community inventory for a lesson version, curriculum graph, media/captions, generated curriculum download, legal policy, Components package and deployed release. Record each object's significant properties and claimed horizon.         | The observed mechanisms preserve different fragments; without an object boundary, claims such as "archived" or "reproducible" are not testable.   | A current, exercised record already names every material object, community, horizon, significant property and accountable custodian, with no orphaned representation dependency.                    |
| Run a forensic reproduction drill for one historical release date: reconstruct the exact lesson page, resource set, video/captions and generated download without reading a mutable current authority. Compare bytes where required and documented semantic properties elsewhere.     | The source pin, external configuration, package-version mismatch, provider IDs and current generation path make historical equivalence uncertain. | An independent drill reproduces or validly migrates the selected release from retained inputs, and existing manifests, fixity evidence and provenance explain every difference.                     |
| Create an evidence-only dependency-obsolescence register covering curriculum/CMS schemas, OOXML, WebVTT, fonts, Mux, Cloudinary, Google Cloud, Next/React, package artifacts and build configuration. Test provider exit and representation loss scenarios.                           | Future intelligibility depends on more than content bytes, and several dependencies are runtime services or implicit environment knowledge.       | A monitored preservation plan already retains the necessary specifications, binaries or substitutes, test corpora and migration triggers, and a provider-exit exercise validates them.              |
| Audit each current transformation and continuity mechanism: redirects, transcript derivation, Cloudinary transforms, DOCX/XLSX/ZIP generation, package releases and content replacement. Identify the significant properties retained or lost and the provenance event recorded.      | The same mechanism can be an appropriate current derivative yet an invalid historical surrogate.                                                  | Existing transformation records and tests demonstrate authorised, traceable equivalence for every preservation claim, including known losses.                                                       |
| Exercise conflicts between preservation and takedown using concrete cases: copyright expiry, safeguarding correction, personal-data erasure, inaccurate assessment record and public-record research. Separate custody, discoverability, access, redaction and destruction decisions. | Local downloads, shared result records and removal notices show that continued possession and current publication are already separable.          | Approved retention and access schedules already assign authority and produce consistent, reviewed outcomes for these cases, including deletion evidence where destruction is required.              |
| Verify release-to-service provenance across OWA source, resolved Components package, built artifact, remote configuration and content/media snapshots.                                                                                                                                | The two repository pins are not the deployed package pairing, so repository chronology alone cannot answer "what did this release serve?"         | A signed or otherwise verifiable release manifest already binds every deployed build to immutable code, dependency, configuration and content/media identifiers and has been restored successfully. |

#### Unresolved evidence

- **Unknown:** Any existing archive mandate, retention schedule, designated
  community, preservation policy, archival partner or accountable custodian.
- **Unknown:** Whether curriculum and CMS authorities retain queryable version
  history rather than only current state.
- **Unknown:** Media-provider source masters, checksums, rendition manifests,
  caption versions, storage versioning and tested provider-exit procedures.
- **Unknown:** Whether NPM artifacts, deployed OWA bundles, source maps,
  configuration and generated outputs are captured in a release manifest.
- **Unknown:** Which properties of a lesson or curriculum export are considered
  significant enough that a changed representation would cease to be authentic.
- **Unknown:** The lawful and ethical retention constraints for pupil attempt
  records and any record that contains personal, licensed or safeguarding
  material.

---

## Cross-lens synthesis

The two lenses are orthogonal but coupled. Preservation asks whether reliable
evidence survives; human-rights analysis asks whose claim that evidence must
serve, who may see it, and when it must be corrected, restricted or destroyed.
Neither can simply dominate the other.

| Cross-lens seam                             | Preservation reading                                                                                      | Human-rights reading                                                                                               | Current synthesis                                                                                                                                    |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content retirement and redirects            | A successor route does not preserve the prior representation or decision history.                         | Replacement can protect educational quality or safety; continued publication can itself cause harm.                | **Inferred:** Preserve enough authorised evidence to explain the change where warranted, while separating archival custody from public availability. |
| Local downloads and shared results          | Copies improve continuity but leave managed provenance, correction and takedown channels.                 | Copies can support education and agency but can expose licensed or personal material.                              | **Inferred:** Possession, authenticity, access, correction and deletion are separate claims and must not be collapsed into "available".              |
| Pupil attempt records                       | Authentic records can evidence what the system concluded and support later challenge.                     | The same detail can create privacy, profiling or disclosure harms and may be subject to correction or destruction. | **Inferred:** Accountability needs proportionate evidence with explicit purpose, custody, access and disposal, not maximum retention.                |
| Content guidance and policy versions        | A later policy body or warning can obscure what a person actually saw and accepted.                       | Effective notice and remedy may require proof of the wording, context and authority at the time.                   | **Inferred:** Versioned decision evidence is potentially rights-enabling, but it needs lawful retention and must not be treated as blanket consent.  |
| Media, captions and transformed derivatives | Future intelligibility depends on retained media, timing, language, codecs and transformation provenance. | Equivalent educational access can depend on the very properties a lossy transform removes.                         | **Inferred:** Significant-property decisions must include affected people and substantive learning access, not only technical renderability.         |
| Components package and deployed service     | Package source, package artifact and composed release are distinct preservation objects.                  | A reusable control can encode a safeguard but cannot absorb the duty-bearer's authority or remedy.                 | **Inferred:** Both provenance and accountability must cross the package/application/provider boundary without pretending the boundary owns them.     |

### Combined changed assumptions

- **Inferred:** Historical accountability is not achieved by retaining all data;
  it is achieved by retaining proportionate, authentic evidence under explicit
  rights, custody and disposal rules.
- **Inferred:** Erasure and correction are not inherently anti-preservation.
  When authorised and recorded appropriately, they are preservation events that
  change what may lawfully remain and who may access it.
- **Inferred:** Preservation is not a purely technical back-office concern.
  Losing the exact warning, restriction reason, assessment rule or policy a
  person encountered can make a later remedy impossible.
- **Inferred:** Human-rights assurance is not only current interaction design.
  A claimant may need durable provenance to challenge an automated, delegated
  or historically changed decision.
- **Inferred:** A stable component API is neither archival continuity nor a
  rights guarantee. It can support both only when the composed service retains
  version identity, significant semantics, accountable ownership and remedy.

### Combined warranted investigations

| Investigation                                                                                                                                                                                              | Warrant                                                                                                                                                                | Explicit falsifier                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Select one rights-relevant historical case, such as a geoblock error, harmful-content correction or disputed pupil result, and reconstruct the complete evidence-and-remedy chain at the time of decision. | This is the smallest exercise that simultaneously tests version identity, delegated inputs, lawful evidence retention, accountable authority and effective correction. | Existing records reconstruct the exact rule, input, representation, notice, responsible actor, decision, access history and remedy without undocumented inference, and an affected person can use them successfully. |
| Produce a joined retention-and-rights schedule for each preservation object, distinguishing custody, public access, claimant access, correction, redaction, legal hold and destruction.                    | The source already creates portable copies, personal learning records and mutable policy/content versions; "keep" versus "delete" is too coarse.                       | A current, approved and exercised schedule already covers every object and conflict, and audit evidence shows systems and suppliers enforce it consistently.                                                         |
| Include affected rights-holders in defining significant properties for pupil lessons, assessment evidence and alternate media before any preservation equivalence test.                                    | A technically renderable derivative can lose the property needed for equal educational use or a later claim.                                                           | Existing significant-property definitions were established with representative affected people and validation demonstrates equivalent meaning and access across the relevant contexts.                               |

### Evidence that could materially overturn the synthesis

- A tested institutional archive that binds deployed OWA releases to immutable
  Components, configuration, curriculum, CMS, media and generated-output
  manifests would narrow most preservation uncertainties.
- Exercised rights-impact records that name duty-bearers, include child and
  affected-group participation, analyse conflicting rights and demonstrate
  effective remedies would narrow most accountability uncertainties.
- Evidence that OWA is explicitly outside the preservation or decision authority
  for particular objects would relocate, not eliminate, the need to verify
  custody and duty at the responsible boundary.
- Production and qualitative evidence may show that protective choices such as
  disabling pupil feedback, mandatory guidance or identifier-based sharing work
  materially better or worse than either repository interpretation.
- Applicable legal instruments, contracts and regulator or court decisions could
  change the duty allocation or required safeguards. No legal determination is
  made here.

## Exploration outcome

Both passes changed their starting frames:

- The preservation question moved from keeping code, links or files to
  preserving a bounded information object with representation information,
  fixity, provenance, rights and custody across a composed service.
- The human-rights question moved from beneficial outcomes and visible
  safeguards to a rights-holder/duty-bearer chain with minimum guarantees,
  justified limits, participation, non-discrimination and effective remedy.
- Their synthesis rejects both indiscriminate retention and evidence-free
  deletion. Excellence requires authentic, proportionate accountability evidence
  whose custody and use remain rights-respecting over time.

These are warranted research frames, not target designs or implementation
recommendations.
