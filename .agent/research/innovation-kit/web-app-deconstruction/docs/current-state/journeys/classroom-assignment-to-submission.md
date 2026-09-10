# Classroom assignment to submission

## Observable outcome

**Observed (encoded behavior):** When Oak is launched as a Google Classroom
add-on, a teacher can authenticate, browse Oak curriculum, select one lesson and
attach it to the Google Classroom item that launched the add-on. A pupil can
open that attachment, authenticate with a pupil-specific Google session, use
the normal Oak pupil lesson experience, resume recorded work and have ongoing
lesson progress written back through the Classroom integration. Handed-in or
returned work becomes read-only. A teacher-authenticated results route can
render the recorded work.

**Observed scope qualifier:** The current flow attaches an Oak lesson to an
existing Google Classroom `courseId` and `itemId`; it does not create the
Classroom assignment from the normal OWA teacher journey. The changelog records
the removal of the separate "free tier coursework" flow in the same release
that restored several add-on behaviors
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/CHANGE_LOG.md#L158-L186)).

**Unknown:** Static source does not establish current production enablement,
traffic, Google Marketplace configuration, success rate, which schools permit
the OAuth scopes, or whether per-question persistence and automatic grade sync
are product requirements rather than current implementation choices.

This trace uses the OWA revision pinned in the
[research charter](../../research-charter.md). The locked
`@oaknational/google-classroom-addon@1.33.0` artifact was also inspected to
understand the package boundary. Its source is not one of the three pinned
repositories, so package-internal behavior is treated as an inference until it
is traced in that package's own repository.

## Outcome versus mechanism

| Candidate outcome contract                                                    | Current mechanism                                                                                                                                        | Requirement status                                                                                          |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| A teacher can put a trusted Oak lesson into an existing Classroom assignment. | Google launches an embedded add-on with `courseId`, `itemId` and `addOnToken`; the add-on package supplies selection UI and OWA calls an attachment API. | **Inferred candidate.** Needs product and teacher evidence.                                                 |
| The correct pupil can open and continue the assigned lesson.                  | Separate Google OAuth sessions, provider-shaped query parameters and a redirect from an App Router entry route to the Pages Router pupil lesson.         | **Inferred candidate; mechanism replaceable.**                                                              |
| Work survives navigation, interruption and reopening.                         | The lesson store is hydrated from and continuously synchronized to Classroom progress persistence.                                                       | **Inferred candidate.** Required durability and latency are unknown.                                        |
| A teacher can see useful evidence of learning and, optionally, a mark.        | The integration records section progress, can expose printable results and can send an exit-quiz score when grade sync is enabled.                       | **Unknown.** The minimum useful evidence and marking policy are not established here.                       |
| Work is not changed after it is handed in or returned.                        | Google submission state is re-read and mapped to a local read-only lesson mode.                                                                          | **Strong candidate.** The behavior has recent regression fixes, but stakeholder intent is still unrecorded. |
| Identity, consent, safeguarding and operational failures remain controlled.   | OAuth, encrypted sessions, Firestore, Zod contracts, shell providers, error reporting and age-restricted-content filtering.                              | **Strong candidate; exact technologies are not requirements.**                                              |

## Journey at a glance

| Step                          | Current handoff                                                                                                                                               | Evidence status                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1. Add-on launch              | Google supplies assignment context in the URL; the Classroom layout puts it into package state and adds Classroom analytics.                                  | **Observed.**                                                                         |
| 2. Teacher authentication     | OWA requests a teacher Google sign-in URL, handles the OAuth callback, then verifies an encrypted session and access token through the package server client. | **Observed at the OWA adapter.** Token exchange and cookie details are package-owned. |
| 3. Lesson selection           | OWA queries curriculum data for year, subject, programme, unit and lesson pages; package UI owns selection and attachment controls.                           | **Observed.**                                                                         |
| 4. Attachment                 | OWA validates the attachment request and delegates creation to the add-on package.                                                                            | **Observed at the port; provider calls are package-owned.**                           |
| 5. Pupil handoff              | The Classroom pupil entry checks a separate pupil Google session, then redirects with assignment parameters into the ordinary pupil lesson route.             | **Observed.**                                                                         |
| 6. Context and resume         | OWA resolves the Google submission ID, restores saved section results and reads submission state before initializing the pupil stores.                        | **Observed.**                                                                         |
| 7. Continuous progress        | Each section-result change is mapped to the package schema and posted without blocking the lesson.                                                            | **Observed.**                                                                         |
| 8. Grade and submission state | The package may synchronize an exit-quiz score; OWA observes `TURNED_IN` or `RETURNED` and prevents further work.                                             | **Partly inferred.** No current OWA action turns the submission in.                   |
| 9. Work review                | A teacher-authenticated printable route combines curriculum content with stored pupil progress.                                                               | **Observed route.** The exact Google-to-route launch contract is package-owned.       |

## Static trace

### 1. Entry context and shell

**Observed:** The `/classroom` layout reads `courseId`, `itemId` and
`addOnToken` from the query string, passes them to
`OakGoogleClassroomProvider`, and nests a Classroom-specific analytics provider
inside the common App Router shell
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/classroom/layout.tsx#L13-L64)).
Teacher add-on opening is recorded at layout mount, while pupil opening is
recorded later in the pupil experience.

**Observed:** The browser context explicitly distinguishes an iframe from a
normal browser, and Classroom identity is represented by provider IDs plus a
derived `courseId:itemId` assignment key
([environment](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/google-classroom/getClientEnvironment.ts#L1-L7),
[context](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GoogleClassroom/useGoogleClassroomContext.ts#L22-L58)).

**Inferred:** Classroom is an explicit runtime-shell profile rather than only a
page feature. It needs iframe behavior, Google identity, partition-compatible
session storage, provider context and journey analytics in addition to the Oak
root shell.

### 2. Teacher OAuth and session verification

**Observed:** The protected browse layout gives the package auth wrapper an OWA
session-verification action and `/classroom/sign-in` fallback, then gives the
package browse layout OWA attachment and analytics actions
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/classroom/browse/layout.tsx#L14-L31)).

**Observed:** The teacher sign-in page passes the optional Google `login_hint`,
tracks start/completion, and only accepts a decoded redirect target beginning
with a single `/`; otherwise it returns to the Classroom browse route with the
launch parameters preserved
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/classroom/sign-in/page.tsx#L12-L60)).

**Observed:** The sign-in API selects teacher or pupil OAuth URL generation.
The callback validates the authorization code, preserves the pupil/teacher and
newsletter distinction in OAuth state, delegates token exchange to the package
and redirects a successful popup to the auth-success view
([sign-in API](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/classroom/auth/sign-in/route.ts#L25-L60),
[callback](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/classroom/auth/callback/route.ts#L76-L138)).
The success page itself only hands the encrypted session and access token to a
package view
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/classroom/auth/success/page.tsx#L7-L29)).

**Observed:** Classroom APIs are deliberately excluded from Clerk middleware;
they implement a separate Google session contract through `Authorization` and
`X-Oakgc-Session` headers
([middleware](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/middleware.ts#L4-L16),
[verification](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/classroom/auth/verify/route.ts#L11-L57)).

**Unknown:** The end-user behavior when popup messaging, partitioned cookies,
third-party-cookie policy or access-token refresh fails is owned largely by the
package and is not demonstrated by an OWA journey test.

### 3. Browse, select and attach

**Observed:** The browse starts with an OWA-owned list of Years 1-11, then uses
the curriculum API for subjects, programme options, units and lessons
([year entry](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/classroom/browse/page.tsx#L7-L33),
[subjects](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/classroom/browse/years/%5ByearSlug%5D/subjects/page.tsx#L7-L40),
[lessons](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/classroom/browse/programmes/%5BprogrammeSlug%5D/units/%5BunitSlug%5D/lessons/page.tsx#L9-L67)).
The unit route sorts curriculum results, groups optionality and removes units
with age-restricted lessons before rendering the package view
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/classroom/browse/programmes/%5BprogrammeSlug%5D/units/page.tsx#L36-L107)).

**Observed:** OWA wraps package subject, option, unit and lesson views mainly to
attach Oak analytics. The lesson wrapper builds a lookup from OWA curriculum
records and emits selection or preview events
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GoogleClassroom/GoogleClassroomLessonListing.tsx#L23-L72)).

**Observed:** Attachment creation crosses a narrow browser API into an OWA BFF
route. The route requires both Google session headers, validates the body with
a schema exported by the add-on package, then calls the package server client
([browser adapter](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/google-classroom/googleClassroomApi.ts#L142-L173),
[route](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/classroom/attachment/create/route.ts#L12-L54)).

**Inferred from the locked package:** The package translates this call into a
Google Classroom add-on attachment with teacher, pupil and optional student
work review URIs, then persists attachment metadata in Firestore. OWA source
proves the call and injected dependencies, but not those provider details.

### 4. Pupil authentication and handoff

**Observed:** The Classroom pupil entry verifies a pupil session using distinct
cookie keys. On success it redirects from the App Router route into
`/pupils/programmes/.../lessons/...`, preserving all query parameters; on
failure it redirects to a pupil sign-in URL that carries the lesson slugs
([entry](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/classroom/pupil/programmes/%5BprogrammeSlug%5D/%5BunitSlug%5D/%5BlessonSlug%5D/page.tsx#L17-L41),
[sign-in](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/classroom/pupil/sign-in/page.tsx#L45-L89)).
The pupil sign-in hides the newsletter option and deliberately uses the pupil
session/access-token keys.

**Observed:** Classroom detection in the normal pupil route is delegated to the
package, while OWA resolves `courseId`, `itemId`, `attachmentId`, login hint and
the client environment from package state or search parameters
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GoogleClassroom/useGoogleClassroomContext.ts#L22-L58)).
The same pupil layout guards embedded video behavior, initializes the common
pupil stores, records Classroom opening and shows a read-only banner
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/PupilLayout/PupilLayout.tsx#L28-L51)).

**Inferred:** Google Classroom is an entry surface for the standard pupil lesson
capability, not a second lesson engine. The cross-router redirect and query
contract are current mechanisms for reusing that capability.

### 5. Context, resume and read-only state

**Observed:** The Classroom context endpoint requires the pupil Google headers,
validates the three provider IDs, asks the package for the Google add-on context
and reads `teacherLoginHint` from the `classroomAttachments` Firestore
collection
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/classroom/context/route.ts#L11-L74)).

**Observed:** `useClassroomAddonContext` then:

1. obtains the pupil `submissionId` and both login hints;
2. loads saved progress and maps it into ordinary pupil section results;
3. asks Google for current submission state;
4. treats `TURNED_IN` and `RETURNED` as read-only;
5. rechecks read-only state when the browser regains focus; and
6. lets the lesson continue with Classroom synchronization disabled if context
   resolution fails.

The implementation is explicit in the hydration and focus effects
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/Views/ViewHelpers/Shared/useClassroomAddonContext.ts#L19-L188)).
`usePupilStores` waits for that resolution, seeds the existing pupil progress
store and adds Classroom identity to ordinary pupil analytics
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/Views/ViewHelpers/Shared/usePupilStores.ts#L32-L153)).

**Observed:** Progression code rechecks read-only at section boundaries and
redirects handed-in work to review, while using cached state between quiz
questions to avoid a network round trip per Next action
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/Views/Hooks/usePupilExperienceBase.ts#L40-L63)).

### 6. Progress persistence, grade synchronization and hand-in

**Observed:** OWA maps intro activity, starter and exit quiz grades and answers,
and video progress into the add-on package's runtime-validated progress schema
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/google-classroom/mapToSubmitPupilProgress.ts#L27-L90)).
The sync hook subscribes to every `sectionResults` change, including in-progress
quiz-question changes. It posts asynchronously, swallows failures, and performs
no visible retry, ordering or acknowledgement work
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/Views/ViewHelpers/Shared/useClassroomProgressSync.ts#L20-L80)).

**Observed:** The BFF requires pupil session headers, validates the package
schema and delegates to `upsertPupilLessonProgress`. Provider exceptions such
as a non-updatable submission become `403`; generic failures become `500`
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/classroom/pupil/progress/submit/route.ts#L18-L58)).
The package client is constructed with Oak's pupil Firestore database, OAuth
secrets and the OWA callback/base URLs
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/google-classroom/getOakGoogleClassroomAddon.ts#L6-L32));
production Firestore access uses a GCP OIDC external account rather than a
checked-in credential
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/firestore/getPupilFirestore.ts#L25-L49)).

**Inferred from the locked package:** The package stores the latest lesson
progress in Firestore and, when grade sync is enabled and the exit quiz first
becomes complete, patches `pointsEarned` through the Google Classroom add-on
student-submission API using the teacher's stored OAuth credentials.

**Observed negative evidence:** No current OWA route or browser action calls a
turn-in operation. OWA only upserts progress and reads the external submission
state. Therefore "submission" in this current trace means Google owns the
hand-in transition; Oak reacts to `TURNED_IN` or `RETURNED`. The removed
coursework implementation previously had a turn-in route, which is consistent
with the current absence but does not prove the intended long-term contract.

### 7. Teacher work review

**Observed:** The printable Classroom results route is guarded with the teacher
Google session keys. It loads pupil progress plus current curriculum content,
maps the progress into OWA's ordinary lesson-attempt shape and renders the
shared pupil results view
([auth layout](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/classroom/pupil/programmes/%5BprogrammeSlug%5D/%5BunitSlug%5D/%5BlessonSlug%5D/results/printable/layout.tsx#L16-L41),
[results](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/classroom/pupil/programmes/%5BprogrammeSlug%5D/%5BunitSlug%5D/%5BlessonSlug%5D/results/printable/page.tsx#L30-L135)).

**Observed seam:** The underlying `GET /api/classroom/pupil/progress` route has
a comment to add an auth-header check but currently validates only the three
query IDs before reading progress
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/classroom/pupil/progress/route.ts#L11-L40)).
The page-level auth wrapper is therefore not also enforced at this data
boundary.

**Unknown:** This static trace cannot determine whether the identifier tuple is
treated as an unguessable capability, whether another network layer protects
the endpoint, or whether unauthenticated reads are intentional. An
authorization review is required before calling it a security defect or an
acceptable public contract.

## Identity and data contracts

| Contract                             | Current owner                       | Static finding                                                                                                                   |
| ------------------------------------ | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| OWA account identity                 | Clerk/root shell                    | **Observed:** Not used to authorize Classroom APIs.                                                                              |
| Teacher Google identity              | Add-on package plus OWA BFF         | **Observed:** Separate encrypted session/access token; teacher credentials also enable attachment and optional grade operations. |
| Pupil Google identity                | Same package, distinct browser keys | **Observed:** Used for add-on context and progress writes.                                                                       |
| Assignment identity                  | Google IDs in URL/package state     | **Observed:** `courseId`, `itemId`, `attachmentId`, `submissionId`; OWA also derives `courseId:itemId` for analytics.            |
| Curriculum identity                  | OWA curriculum API slugs            | **Observed:** Programme, unit and lesson slugs form the handoff to the ordinary pupil lesson.                                    |
| Attachment and progress persistence  | Pupil Firestore through package     | **Observed at construction and OWA reads; package-internal write layout needs separately pinned source.**                        |
| Submission state and optional points | Google Classroom through package    | **Observed at OWA port; exact provider calls inferred from locked package.**                                                     |

**Inferred:** Provider IDs have become part of OWA's UI state, analytics,
routing and progress model. That is workable integration code, but they should
not automatically become the domain model of an OCE product.

## Package and responsibility boundary

The locked dependency graph resolves the add-on to `1.33.0` alongside Google
Classroom, Firestore and Oak Components
([manifest](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/package.json#L84-L102),
[lockfile](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/pnpm-lock.yaml#L23-L58)).

| Boundary                                     | Current responsibility                                                                                                    | Assessment                                                                                                     |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| OWA Classroom routes and wrappers            | Launch context, curriculum queries, redirects, analytics wiring, BFF HTTP status and error behavior.                      | **Observed:** Product composition remains in OWA.                                                              |
| `@oaknational/google-classroom-addon/ui`     | Auth views/wrappers, browse and selection views, add-on state and attachment submission UI.                               | **Observed from imports:** This is more than a headless provider adapter.                                      |
| `@oaknational/google-classroom-addon/types`  | Runtime schemas and provider-facing progress/attachment/submission types.                                                 | **Observed:** Schemas are shared across browser and server boundaries.                                         |
| `@oaknational/google-classroom-addon/server` | OAuth/session facade, Google Classroom operations, Firestore-backed attachment/progress behavior and provider exceptions. | **Observed at the facade calls; internal division inferred from the locked artifact.**                         |
| Oak Components                               | Visual primitives and theme used directly by OWA and as a resolved peer of the add-on.                                    | **Observed:** Classroom UI shares the design-system runtime rather than carrying a separate visual foundation. |
| OWA pupil lesson capability                  | Lesson content, section state, interaction, accessibility, review and pupil analytics.                                    | **Observed:** Classroom adapts this capability rather than replacing it.                                       |

**Inferred seam:** The package is simultaneously a provider integration, UI
kit, state store and server domain facade. That may be the correct separately
owned product boundary, or it may bundle responsibilities that should change at
different rates. Consumer and change-history evidence is needed to distinguish
those interpretations.

## Analytics and failure behavior

**Observed:** OWA records add-on opened, sign-in started/completed, browse
refinements, lesson selected/previewed and lesson attached, with Classroom
platform context and the assignment key
([provider](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/GoogleClassroomAnalytics/GoogleClassroomAnalyticsProvider.tsx#L18-L59),
[payloads](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/GoogleClassroomAnalytics/TrackingFunctions.ts#L67-L170)).
Session storage deliberately carries an "opened" flag across the App Router
sign-in to Pages Router lesson navigation to avoid double tracking
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/GoogleClassroomAnalytics/classroomAddonTracking.ts#L24-L57)).

**Observed:** API operations use a shared Classroom error reporter backed by
the configured Sentry or Bugsnag implementation, and route rendering failures
reach a Classroom-specific error boundary and recovery view
([reporter](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/google-classroom/errorHandling.ts#L19-L31),
[boundary](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/classroom/error.tsx#L7-L16)).

**Observed:** Failure policy is intentionally asymmetric. Authentication and
attachment failures stop or redirect the journey; context and progress-sync
failures are logged or swallowed so the educational lesson continues.

**Unknown:** The source does not establish an SLO for lost progress, how users
learn that resume/grade sync is degraded, whether attachment analytics denotes
attempt or confirmed success, or whether reporting remains consent-compliant
inside every iframe/session state.

## Observed strengths and preservation questions

These mechanisms are visible in source. Their impact and necessity remain preservation hypotheses until product, user, operational or impact evidence establishes them.

- **Observed:** Classroom reuses the full pupil lesson engine instead of
  maintaining a second educational experience.
- **Observed:** Resume restores question-level work, not only completed-section
  flags, and sync runs after each in-progress change.
- **Observed:** Returned and handed-in state is treated as a live external
  invariant, rechecked on focus and at progression boundaries.
- **Observed:** Failure to resolve Classroom context does not prevent a pupil
  from accessing the lesson.
- **Observed:** Teacher and pupil Google sessions are deliberately separated,
  and server writes validate package-owned schemas.
- **Observed:** Content selection preserves programme optionality, ordering and
  age-restricted-lesson filtering rather than exposing a raw content index.
- **Observed:** Analytics distinguishes teacher/pupil use case, iframe/browser
  environment and meaningful browse/attachment actions.
- **Observed:** The local developer workflow starts both HTTPS Next and a
  Firestore emulator, acknowledging that embedded OAuth and persistence are
  part of the feature's operating context
  ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/scripts/dev/dev-gclassroom.sh#L1-L14)).

## Seams and weakening evidence

1. **Capability spread.** One outcome crosses App routes, Pages routes, package
   UI, OWA wrappers, browser adapters, API routes, Firestore setup, pupil
   stores, analytics and curriculum queries. The package boundary reduces
   provider code in OWA but does not make the OWA capability locally traceable.
2. **Broad external package.** The add-on package exports UI, schemas and server
   services. OWA is narrow at individual call sites but coupled to its views,
   store, cookie keys, types, error class and server facade.
3. **Provider-shaped domain state.** Google IDs and login hints cross routing,
   analytics and learning-progress code. There is no OWA-owned assignment or
   progress port that names provider-independent semantics.
4. **Cross-router handoff.** Authentication and Classroom entry use the App
   Router; the actual lesson uses the Pages Router. Query preservation,
   analytics de-duplication and compatible shell behavior are part of the
   journey contract.
5. **Unacknowledged progress writes.** Every change launches a fire-and-forget
   request. No serialization, coalescing, retry, unload flush or visible degraded
   state appears in OWA, so delayed or reordered responses are an **inferred
   risk**, not a proven production failure.
6. **Availability versus integrity tradeoff.** Silent sync failure preserves
   access to teaching content but can make the resume and teacher-evidence
   outcomes fail invisibly.
7. **Authorization asymmetry.** Progress writes and submission-state reads
   require Google headers, while the progress read endpoint currently does not.
8. **Package contract observability.** OWA unit tests mock the add-on facade at
   the boundary. They verify routing and delegation but cannot establish OAuth,
   Google API, Firestore or refreshed-session interoperability.
9. **Migration sensitivity.** The current changelog groups fixes for missing
   Classroom progress, analytics, read-only UI, iframe video behavior,
   per-question sync and handed-in redirects in one pupil-experience migration
   release
   ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/CHANGE_LOG.md#L161-L186)).
   This is evidence of a recent boundary transition, not proof of permanently
   poor architecture.

## Competing interpretations

| Interpretation                                                                                                                                                                                       | What supports it                                                                                                              | What would weaken or invalidate it                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. The add-on package is a sound capability boundary.** OWA supplies Oak curriculum and learning behavior while the package owns Google UI, OAuth, schemas and provider services.                  | Narrow OWA BFF calls; package subpaths for UI/types/server; a local-package workflow.                                         | Most changes still require synchronized OWA/package releases; the package has no other consumer; or provider changes repeatedly leak into pupil code. |
| **B. The package is a provider platform adapter, not the Classroom capability.** Classroom outcome orchestration belongs in an OWA capability module, with only OAuth/Google/Firestore behind ports. | OWA owns curriculum selection, pupil learning, analytics and degraded behavior; provider IDs currently leak past the adapter. | A provider-independent layer adds only pass-through indirection or prevents package reuse by other Oak products.                                      |
| **C. Cross-router composition is an acceptable migration profile.** Explicit query and analytics handoffs allow reuse without duplicating the pupil engine.                                          | The current flow deliberately bridges roots and recent fixes make the contract visible.                                       | Rendered parity tests show identity, consent, errors or progress differ across the handoff; migration defects continue despite contract tests.        |
| **D. Per-question asynchronous sync is the right resilience policy.** Frequent full-state writes minimize lost work and never block learning.                                                        | The code and tests explicitly moved from per-section to per-question synchronization.                                         | Network traces show excessive request volume, out-of-order state, duplicate grades or worse durability than a serialized/coalesced writer.            |
| **E. Firestore progress is a recoverability projection, not the source of submission truth.** Google owns submission state; Oak owns rich learning evidence.                                         | OWA never turns work in and consults Google for read-only state.                                                              | Product intent expects Oak to own turn-in, authoritative marks or an auditable submission transaction.                                                |

## Effects on current hypotheses

### H001: Capability-owned modules

**Result:** Supports testing H001, but also supplies an invalidator.
Classroom is recognizably one user outcome yet spans many technical and audience
folders. At the same time, its core educational behavior genuinely belongs to
the shared pupil lesson capability, and Google integration has an independently
versioned package. A useful module boundary must permit those dependencies
rather than forcing all files into one folder.

### H003: Unified runtime-shell contract

**Result:** Supports testing H003 as a profile/conformance claim. This single journey
crosses the App and Pages roots and needs identity, iframe policy, analytics,
errors, theming and consent to remain coherent. It weakens any interpretation
of H003 as one unconditional provider tree: Classroom has materially distinct
Google and iframe needs.

### H004: Domain ports and explicit freshness

**Result:** Mixed support. `getOakGoogleClassroomAddon` is already a substantial
provider facade and package schemas validate boundaries. However, OWA's
journey-level contract does not state ordering, retry, idempotency, staleness,
authorization or degraded-mode semantics for progress. H004 is useful only if
an Oak-owned port makes those policies explicit rather than wrapping the same
methods one more time.

### H005: Journey-level confidence

**Result:** Supports a discriminating test of H005. The snapshot has focused route, hook,
mapper and component tests, but no discovered Classroom Playwright journey.
Recent regressions crossed router, store, iframe, analytics and submission-state
boundaries despite those lower-level tests. A deterministic journey could cover
the contract while unit tests retain fault localization, but the static gap does
not establish unique signal. This remains a hypothesis until such a test is
stable, predictive and catches a failure earlier layers do not.

## Unknowns to resolve

1. What teacher and pupil outcomes define success, and which are contractual:
   attachment, resume, question-level evidence, grade sync, results review or
   hand-in?
2. Is the add-on live for all users, feature-limited, in pilot, or retained for
   compatibility? What are completion, OAuth failure and sync failure rates?
3. What exact OAuth scopes, token retention, deletion and privacy rules have
   been approved for teacher credentials, pupil identity and answer data?
4. Is unauthenticated progress read intentional, protected elsewhere, or a gap?
5. What ordering/idempotency guarantees does package version 1.33.0 provide for
   concurrent progress writes and the first completed exit quiz?
6. Where does the pupil perform the actual Google hand-in action, and is Oak
   expected only to observe it?
7. Does teacher work review always arrive through Google's
   `studentWorkReviewUri`, and what happens when current curriculum content has
   changed since the pupil attempt?
8. Does the analytics "lesson attached" event mean attempted, API-confirmed or
   Google-visible attachment?
9. Does the package's refreshed-token response shape match OWA's verification
   adapter under an expired-token scenario?
10. Who owns the add-on package, and are release compatibility and supported
    OWA versions explicit?

## Most direct invalidating work

1. **Run one controlled journey:** use the Firestore emulator and a fake Google
   Classroom server to execute launch, teacher OAuth, selection, attachment,
   pupil OAuth, resume, per-question sync, exit-quiz completion, hand-in state
   and teacher review. Record every boundary payload and user-visible state.
2. **Disturb progress delivery:** delay, reorder, duplicate and fail three
   question updates, then reload. This directly tests whether frequent
   fire-and-forget writes provide the claimed durability.
3. **Expire the access token:** verify refresh, browser storage and continued
   attachment/progress behavior across the OWA/package contract.
4. **Probe authorization deliberately:** exercise the progress read with no,
   pupil, wrong-pupil and teacher credentials; compare with the approved data
   access policy.
5. **Test the router handoff:** assert consent state, analytics cardinality,
   assignment parameters, iframe detection, error fallback and pupil progress
   survive App-to-Pages navigation.
6. **Read package source at 1.33.0:** pin its repository revision and map Google
   calls, Firestore collections, encryption, retry/idempotency and URL creation
   rather than relying on the installed build artifact.
7. **Interview service owners and inspect operational evidence:** validate the
   candidate outcome contract against product intent, OAuth/sync telemetry,
   incidents and support cases before treating current mechanisms as the design
   of an OCE product.
