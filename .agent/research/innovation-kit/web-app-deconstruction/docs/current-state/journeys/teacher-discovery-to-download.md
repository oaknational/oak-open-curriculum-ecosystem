# Teacher discovery to lesson-resource download

## Scope and outcome

This trace follows a representative, unrestricted teacher journey from the OWA homepage, through subject and phase selection, programme and unit browsing, lesson inspection, resource selection, and initiation of a lesson ZIP download. It uses the Science secondary KS3 lesson in the existing Playwright fixture as its concrete downstream example.

All OWA evidence is pinned to commit [`510ac63a62fb37a70183b00ce0f5fb15be4491e5`](https://github.com/oaknational/Oak-Web-Application/tree/510ac63a62fb37a70183b00ce0f5fb15be4491e5) (`v1.1128.0`). This is a static source trace. No application, test, external API, or production analytics data was executed or inspected.

Evidence labels mean:

- **Observed:** directly evidenced in the pinned source.
- **Inferred:** an interpretation of one or more observations that still needs runtime, incident, or user evidence.
- **Unknown:** not established by this source pass.

**Observed outcome:** OWA can take a teacher from curriculum discovery to a resource-selection form, request a download URL from the Downloads API, create and click a hidden download link, then replace the current route with a download-success route. The existing Playwright test separately waits for a real browser `download` event and asserts a `.zip` filename ([download helper](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink.tsx#L19-L55), [browser test](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/tests/e2e/teacher/lesson-page.spec.ts#L16-L40)).

**Inferred outcome boundary:** the application success screen means "the generated link was clicked and navigation was allowed to continue", not "the archive finished transferring, opened successfully, or contained every selected asset". The route is also directly addressable and reconstructs its view from unit data rather than download evidence ([client redirect](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L211-L239), [success loader](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/units/%5BunitSlug%5D/lessons/%5BlessonSlug%5D/downloads/success/page.tsx#L21-L41)).

## Route sequence

| Step | Teacher intent                                    | Representative route                                                                                          | Runtime and hand-off                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Discover Oak curricula and resources              | `/`                                                                                                           | Pages Router, statically generated with ISR. The homepage loads CMS content, curriculum phase options and top-nav data, then renders `TeachersTab` and `SubjectPhasePicker` ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/index.tsx#L28-L115)).                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 2    | Select Science and Secondary                      | `/teachers/programmes/science-secondary/units`                                                                | The picker validates subject, phase and any required KS4 option, builds a subject-phase slug, records `curriculumVisualiserAccessed`, and navigates with the Pages Router ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker.tsx#L1362-L1438)). The destination is an App Router route.                                                                                                                                                                                                                                                                                                                                                           |
| 3    | Choose a concrete unit/programme variant          | `/teachers/programmes/science-secondary-ks3/units/cells/lessons`                                              | Programme cards derive the concrete `programmeSlug` from each unit's year, exam board, tier and pathway fields. The card link carries that slug plus the unit slug ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/UnitSequence/UnitList.tsx#L58-L135)).                                                                                                                                                                                                                                                                                                                                                                                      |
| 4    | Inspect a lesson in the unit                      | `/teachers/programmes/science-secondary-ks3/units/cells/lessons/the-common-processes-of-all-living-organisms` | The unit page links each published lesson using the programme, unit and lesson slugs; unpublished lessons are disabled ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/units/%5BunitSlug%5D/lessons/Components/LessonList/LessonList.tsx#L186-L226)).                                                                                                                                                                                                                                                                                                                                                                                                              |
| 5    | Download all or one resource group                | `.../downloads?preselected=all` or another validated `preselected` value                                      | Lesson actions link to the download route and preserve resource intent in the query string. Copyright rules can replace the action with sign-in or onboarding ([download-all source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/LessonOverviewDownloadAllButton/LessonOverviewDownloadAllButton.tsx#L36-L71), [individual-resource source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/LessonItemContainerLink/LessonItemContainerLink.tsx#L33-L70)).                                                                                                                                              |
| 6    | Select files, provide required details and submit | Same download route                                                                                           | A client form selects available resources, accepts school/terms data, optionally supplies email, submits engagement data to HubSpot, obtains an optional Clerk token, and asks the Downloads API for a resource URL ([form schema](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/downloadAndShare.schema.ts#L30-L52), [submit source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormSubmit.ts#L26-L78)).                                                                                                                                                     |
| 7    | Receive the archive                               | Downloads API URL, then returned asset URL                                                                    | The browser calls `${DOWNLOADS_API_URL}/api/lesson/:lessonSlug/download`, validates `{ data?: { url }, error? }`, and clicks the returned URL through a hidden `download.zip` anchor ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink.tsx#L9-L98)).                                                                                                                                                                                                                                                                                                                                                                                |
| 8    | Continue after initiation                         | `.../downloads/success`                                                                                       | After the anchor records its click, OWA waits one extra second for Safari, shows a toast, and replaces the route. The success page loads unit data, chooses an experiment variant, and offers return-to-lesson, next lessons and whole-unit download actions ([polling source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink.tsx#L40-L55), [success view](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/units/%5BunitSlug%5D/lessons/%5BlessonSlug%5D/downloads/success/Components/DownloadSuccessView.tsx#L81-L180)). |

**Observed:** the first programme-route slug is a subject-phase selection (`science-secondary`), while the later `programmeSlug` is a concrete curriculum variant (`science-secondary-ks3` in the test fixture). The same URL segment is named `[slug]` in route files but represents different levels of identity across the route sequence.

**Inferred:** a future domain model should make `subjectPhaseSelection`, `programmeVariant`, `unit` and `lesson` distinct concepts even if URLs continue to use slugs.

## End-to-end data and control flow

### 1. Discovery bootstrap

**Observed:** `getStaticProps` obtains homepage and post content from Sanity-facing helpers, calls `curriculumPhaseOptions()`, removes invalid curriculum choices, and separately obtains top-nav data. `getPageProps` adds the repository-wide Sanity ISR interval unless ISR is disabled ([homepage loader](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/index.tsx#L74-L115), [ISR wrapper](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/isr/index.ts#L23-L32)).

**Observed:** the curriculum adapter applies an authenticated server-side GraphQL query, rejects empty results, and Zod-parses the response. The shared GraphQL SDK retries a request up to three times and reports exhausted retries ([query adapter](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.query.ts#L9-L24), [SDK](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/sdk.ts#L12-L57)).

**Observed:** the picker keeps selection, validation, modal visibility and navigation state locally. It exposes radiogroups, focus trapping/wrapping, escape and outside-click behavior, mobile dialogs, error alerts and explicit loading state. A complete selection becomes a URL, making the next route reconstructable without retaining picker context ([selection logic](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker.tsx#L1207-L1260), [validation and navigation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker.tsx#L1378-L1438)).

### 2. Subject-phase to programme and unit

**Observed:** the programme page:

1. validates search parameters and legacy slugs;
2. parses subject, phase and KS4 option identity;
3. redirects compatible invalid slugs or returns 404;
4. fetches curriculum overview, curriculum sequence and KS4 filter dimensions in parallel;
5. fetches curriculum CMS content, programme-page CMS content and materialized-view refresh time;
6. formats and sorts units, resolves initial URL filters, derives display titles and analytics fields; and
7. passes the combined result to a client `ProgrammeView` ([page orchestration](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/page.tsx#L154-L302), [curriculum calls](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/getProgrammeData.ts#L22-L169)).

**Observed:** programme filters are initialized from validated URL parameters but then owned by a client hook. Changing filters records `unitSequenceRefined`. Tabs use browser `history.pushState`, and the client chooses which of unit sequence, curriculum explanation, or curriculum downloads to show ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeView.tsx#L88-L147), [tab source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeView.tsx#L149-L211)).

**Observed:** each unit card derives a concrete programme slug from curriculum fields before resolving the unit route. Selecting a card emits `unitOverviewAccessed`. On arrival, the unit loader checks that the programme is valid for that unit and permanently redirects to the first valid programme if it is not ([card source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/UnitSequence/UnitList.tsx#L42-L67), [canonicalization source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/units/%5BunitSlug%5D/lessons/getCachedUnitData.ts#L20-L69)).

**Observed:** the unit query validates multiple GraphQL result groups, applies generic curriculum overrides and exceptions, rejects empty units, computes restriction flags, transforms lesson rows, and Zod-parses the final page model ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.query.ts#L21-L92)).

### 3. Unit to lesson inspection

**Observed:** the unit screen displays curriculum context, unit rationale, prior knowledge, threads, option toggles, download status, restriction banners, and a lesson list. A lesson row includes its outcome, publication state and copyright status before navigation ([unit composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/units/%5BunitSlug%5D/lessons/Components/UnitView.tsx#L17-L95), [lesson rows](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/units/%5BunitSlug%5D/lessons/Components/LessonList/LessonList.tsx#L32-L89)).

**Observed:** the lesson loader requests browse, content, unit and copyright-work data in one generated GraphQL operation; applies exceptions; rejects missing browse/content/unit data; warns when a uniqueness assumption is violated; validates source shapes; and transforms them into a teacher lesson model. That model contains resources, quizzes, media, adjacent lessons, release cohort/date, restrictions and AI-material eligibility ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.query.ts#L282-L378)).

**Observed:** `LessonView` uses Clerk-backed copyright state to decide whether to render lesson content and actions. It composes a side navigation and skip link, resource-specific sections, previous/next lesson navigation, share and AI actions, MathJax where needed, and a download action for each downloadable resource ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/units/%5BunitSlug%5D/lessons/%5BlessonSlug%5D/Components/LessonView.tsx#L68-L145), [resource rendering](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/units/%5BunitSlug%5D/lessons/%5BlessonSlug%5D/Components/LessonView.tsx#L238-L307)).

### 4. Download-page preparation

**Observed:** the App Router download page is `force-static`. It obtains and caches a `lessonDownloads` model keyed by programme, unit and lesson, creates integrated-journey breadcrumbs, marks the page `noindex, nofollow`, and supplies the success URL to the legacy-named `TeacherViews/LessonDownloads.view` ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/units/%5BunitSlug%5D/lessons/%5BlessonSlug%5D/downloads/page.tsx#L16-L108)).

**Observed:** the query adapter obtains browse and download-asset records from GraphQL, applies teacher exceptions, rejects missing data, validates source records, constructs standard and additional-file options, derives restrictions, and parses a download-page model ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.query.ts#L16-L130)).

**Observed:** the form combines several state sources:

- `preselected` is Zod-validated from the URL, defaults to `all`, and expands an `additional-files` group into asset IDs;
- available resources start from GraphQL flags and legacy copyright filtering;
- a browser-only Downloads API `check-files` request removes standard resources that do not exist;
- email, school and terms can be restored from local storage;
- signed-in user email and school details can overwrite those values from Clerk and HubSpot; and
- React Hook Form plus a Zod resolver owns validation and submit state ([form state](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState.tsx#L43-L84), [preselection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState.tsx#L299-L378), [existence check](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useLessonDownloadExistenceCheck.tsx#L18-L84)).

**Observed:** the `check-files` helper explicitly documents that equivalent SSR/ISR attempts were rolled back because revalidation generated high-volume failures and unreliable upstream behavior. It therefore calls the Downloads API only after hydration and Zod-validates its response ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence.tsx#L9-L38), [request source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence.tsx#L55-L109)).

### 5. Submission, archive initiation and continuation

**Observed:** submit first awaits a HubSpot form attempt. That adapter catches and reports its own errors, so HubSpot failure does not intentionally block the archive request. The form then syncs details to local storage, gets a Clerk token if one exists, normalizes selected additional-file IDs, and calls the download helper ([view submit](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L211-L224), [HubSpot adapter](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit.ts#L11-L53), [resource submit](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormSubmit.ts#L30-L63)).

**Observed:** outside an iframe, the browser calls the configured Downloads API with an optional bearer token. The response is runtime-validated and its returned URL is clicked. Inside an iframe, OWA instead opens an OWA `/classroom/download/:lessonSlug` bridge in a new tab ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources.tsx#L7-L65)).

**Observed:** after submission resolves, OWA emits `lessonResourcesDownloaded` with curriculum context, selected resource types, school classification, onward content, release metadata and total downloadable-resource count. Failures clear progress state, render an inline error, show a persistent error toast and report the wrapped download error ([success analytics](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L240-L285), [failure UI](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L286-L299)).

## Cross-cutting concerns

### State

**Observed:** durable journey identity is primarily encoded in URL slugs and query parameters. Ephemeral UI state is spread across component state, React Hook Form, Clerk hooks, local storage, feature flags and a per-page Zustand teacher-browse analytics store.

**Observed:** the teacher-browse store derives `journeyId` as `sessionId:programmeSlug`, but it is instantiated separately on unit, lesson and success pages. The download form itself uses the general analytics provider, while the click that enters the download flow from a lesson uses the teacher-browse store ([provider](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider.tsx#L24-L51), [lesson download-start event](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsStore.ts#L49-L88)).

**Inferred:** URL reconstruction is what makes the Pages-to-App router transition robust to provider and in-memory state reset. Any future simplification should preserve linkability and back/forward behavior rather than replacing it with a long-lived client workflow store.

### Identity, authorization and copyright

**Observed:** unrestricted browsing and downloads do not require sign-in. `loginRequired` and `geoRestricted` curriculum flags are interpreted with Clerk's sign-in, onboarding and region-authorisation metadata. Depending on that state, download controls become loading, sign-up, onboarding, disabled/hidden, or active actions ([policy hook](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/hooks/useComplexCopyright.ts#L16-L39), [button state machine](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/LoginRequiredButton/LoginRequiredButton.tsx#L108-L239)).

**Observed:** when a user is signed in, OWA asks Clerk for a token and conditionally passes it as a bearer token to the Downloads API. The client still sends no token for an unrestricted signed-out download ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormSubmit.ts#L35-L63), [header source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink.tsx#L28-L66)).

**Unknown:** the Downloads API's server-side authorization, signed-URL lifetime, replay behavior, archive-generation strategy and audit guarantees are outside this repository trace.

### Analytics and engagement data

**Observed:** the journey emits events at discovery (`curriculumVisualiserAccessed`), filter refinement, unit selection, lesson-resource download initiation, archive-request success and onward-content selection. Events carry substantially richer curriculum context after a concrete programme/unit has been chosen.

**Observed:** school, optional email, UTM data and PostHog distinct ID are submitted to HubSpot before download; local storage can avoid repeated detail entry. The final analytics event includes school details and whether email was supplied ([HubSpot payload](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit.ts#L18-L38), [tracking payload](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L244-L285)).

**Unknown:** consent-category enforcement, event delivery rates and whether production dashboards interpret `lessonResourcesDownloaded` as request, link click or completed transfer were not verified.

### Cache and freshness

**Observed:** the homepage uses a Sanity-named ISR interval for CMS content, curriculum choices and top navigation together. App Router core routes declare a two-hour revalidation window. `cacheData` also defaults to two hours and warns that transformed shapes and cache identities need explicit care ([core layout](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/layout.tsx#L11-L30), [cache helper](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cache/index.ts#L1-L33)).

**Observed:** programme, unit, lesson and download-page curriculum data use that broad default unless an enclosing route policy changes it. The download page then performs a live client-side file-existence check against a different service. The success route is `force-dynamic`, but it reuses cached unit data ([unit cache](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/units/%5BunitSlug%5D/lessons/getCachedUnitData.ts#L8-L27), [success route](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/units/%5BunitSlug%5D/lessons/%5BlessonSlug%5D/downloads/success/page.tsx#L21-L39)).

**Inferred:** two notions of availability coexist: publish/content metadata from cached curriculum data and physical file existence from the live Downloads API. This is a legitimate separation, but the user-facing stale/degraded contract is implicit.

### Errors and degraded behavior

**Observed:** server queries use retries, runtime schemas, explicit not-found errors and route wrappers that report unexpected failures before rethrowing. Metadata generation generally catches failures and falls back to layout metadata. Invalid programme and unit combinations can redirect to canonical routes ([route wrapper](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/hocs/withPageErrorHandling.tsx#L31-L70)).

**Observed:** failure of the client file-existence check is reported but not shown directly to the user. The initial GraphQL-derived resource list remains available, so a later archive request can still discover the failure and show form/toast errors ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useLessonDownloadExistenceCheck.tsx#L30-L84)).

**Unknown:** user-visible behavior under stale curriculum metadata, partial archive generation, expired returned URLs, HubSpot latency, blocked third-party scripts and a Downloads API timeout was not exercised.

### UI and runtime shell

**Observed:** discovery is wrapped by the Pages Router shell and `AppLayout`; subsequent routes use the App Router root and core layouts. Both roots include identity, consent, theming, analytics, application hooks and notifications, but their provider trees, global styles, metadata and error boundaries are not identical ([Pages shell](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/_app.tsx#L47-L90), [App shell](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/layout.tsx#L43-L111)).

**Observed:** the journey includes accessible selection radiogroups, modal focus management, skip links, semantic ordered lists, disabled unpublished lessons, labelled restriction states, loading/disabled submit states, inline validation summaries, persistent error toasts and non-indexed transactional pages.

**Inferred:** these are product behaviour, not decorative implementation details. An OCE product that merely reproduces the route sequence and download call would omit accessibility, copyright and recovery behaviour whose impact still needs external evidence.

## Observed strengths and preservation questions

These mechanisms are visible in source. Their impact and necessity remain preservation hypotheses until product, user, operational or impact evidence establishes them.

1. **Observed:** a teacher can enter with a broad educational intent and progressively commit to subject, phase, optional KS4 choice, year/programme variant, unit, lesson and resource without having to understand the underlying data model.
2. **Observed:** URLs preserve meaningful browse context and support canonical redirects, breadcrumbs, next/previous navigation and direct links.
3. **Observed:** curriculum responses are authenticated server-side, retried, runtime-validated, transformed and checked for missing/ambiguous records before UI use.
4. **Observed:** central overrides and exceptions shape browse, lesson and download data consistently enough to encode publishing and content policy at query boundaries.
5. **Observed:** unpublished, expired, copyright-restricted, login-required, onboarding-required and region-blocked states prevent or reshape actions rather than failing only after submission.
6. **Observed:** teachers can inspect lesson outcome, guidance, misconceptions, tips, equipment, quizzes, media and resource availability before downloading.
7. **Observed:** resource intent is carried from the lesson action into a preselected but editable form; unavailable files can be removed by a live existence check.
8. **Observed:** school and terms details can be reused, signed-in details can be populated, and HubSpot failure is reported without intentionally denying the core download outcome.
9. **Observed:** success provides a useful continuation into the lesson, remaining unit sequence or complete-unit download rather than ending the journey.
10. **Observed:** one Playwright path verifies the essential browser-level outcome: clicking the final CTA produces a ZIP download event.

## Observed coupling and risks

### Identity and boundary risks

- **Observed:** `subjectPhaseSlug` and concrete `programmeSlug` are both carried through generically named `[slug]` route segments. The unit-card layer is where broad selection becomes a programme variant.
- **Inferred risk:** accidental interchange is easy in helpers, analytics and redirects because string types do not preserve the conceptual boundary.
- **Observed:** route components and route-local UI coordinate curriculum GraphQL, Sanity, caching, slug policy, URL filters, analytics shaping, feature flags and rendering.
- **Inferred risk:** a change to the teacher outcome can require knowledge of route folders, `node-lib`, `pages-helpers`, generic utilities, several component taxonomies and two analytics APIs.

### Download contract risks

- **Observed:** GraphQL says which resources should exist; the Downloads API says which standard files physically exist; the submit call asks the Downloads API to assemble the selection. Additional-file IDs are passed as `null` to the existence-check hook despite a code comment to replace this later ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L302-L308)).
- **Inferred risk:** standard and additional resources do not receive equivalent pre-submit availability assurance.
- **Observed:** the success transition is gated by a DOM `clicked` marker, not a browser completion event or an API receipt. The success route can be opened without a preceding submission.
- **Inferred risk:** product analytics and user messaging may overstate successful delivery unless "downloaded" is explicitly defined as initiation.
- **Observed:** the view mutates `download.label` props in place when renaming presentations to "Lesson slides" ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L91-L128)).
- **Inferred risk:** shared cached or fixture objects can acquire presentation-only UI policy outside their adapter boundary.

### Runtime and state risks

- **Observed:** the journey crosses from Pages Router to App Router immediately after curriculum selection, with overlapping but different global contracts.
- **Inferred risk:** identity, consent, notifications, analytics or theme behavior can change at the transition even when the page-level journey appears correct.
- **Observed:** the download page combines `next/navigation`, `next/compat/router`, Clerk, HubSpot, local storage, React Hook Form, Zod, feature/copyright policy, generic analytics, notifications and an external asset service.
- **Inferred risk:** this is a high-value integration point whose correctness is not represented by one owned use-case contract.
- **Observed:** a signed-in, onboarded user's form loading state waits for HubSpot/local-storage reconciliation; Clerk has a separate ten-second fallback in onboarding status ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/useOnboardingStatus.ts#L4-L39)).
- **Unknown:** whether HubSpot failure or missing contact data can leave `hubspotLoaded` false for an onboarded user and hold the CTA in a loading state. This needs a runtime test.

### Freshness and assurance risks

- **Observed:** a broad two-hour cache default is used for several curriculum views, while physical file existence is deliberately uncached and client-only because the upstream behaved poorly under revalidation.
- **Inferred risk:** freshness and failure policy are consequences of framework placement rather than an explicit teacher-download service contract.
- **Observed:** the existing end-to-end fixture starts directly on one hard-coded unrestricted lesson. It covers lesson-to-download navigation and a real browser ZIP event, but not homepage selection, programme filtering, unit selection, cross-router behavior, sign-in/onboarding/region variants, error recovery, mobile or additional files ([fixture](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/tests/e2e/fixtures.ts#L4-L24), [spec](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/tests/e2e/teacher/lesson-page.spec.ts#L3-L40)).
- **Observed:** repository testing documentation says Playwright CI wiring is follow-up work and Jest excludes the E2E directory ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/docs/testing.md#L38-L71)).
- **Inferred risk:** the strongest current evidence for the delivered archive outcome is opt-in rather than a pre-deployment gate.

## Open questions

1. **Unknown:** what business definition should distinguish download requested, archive URL issued, browser transfer started, transfer completed and archive contents verified?
2. **Unknown:** what are the Downloads API's authorization, archive-generation, cache, URL-expiry, rate-limit, retry and partial-failure contracts?
3. **Unknown:** which source is authoritative when curriculum metadata and physical asset existence disagree, and what should the teacher see while either source is unavailable?
4. **Unknown:** why are additional files omitted from the live existence check, and have missing additional assets caused support or production incidents?
5. **Unknown:** is HubSpot submission required for a business/legal outcome, or is it explicitly best-effort engagement capture? What archive-initiation latency is acceptable, and what user or service evidence establishes it?
6. **Unknown:** which Pages/App shell differences are intentional for this transition, and does a real client navigation preserve consent, session ID, notifications and analytics exactly once?
7. **Unknown:** are filters expected to survive tab changes, back/forward navigation and return from unit/lesson pages beyond the currently preserved `keystages` parameter?
8. **Unknown:** do lesson and download routes canonicalize invalid programme/unit/lesson combinations as rigorously as the unit route, or do they rely entirely on GraphQL returning no result?
9. **Unknown:** what freshness do teachers actually require for newly published, withdrawn, expired or newly restricted resources? Is two hours acceptable for every step before the live file check?
10. **Unknown:** which recent incidents escaped component tests and would have been caught by a discovery-to-archive journey contract?
11. **Unknown:** does the current Playwright flow run reliably against controlled data and a controlled Downloads API, or is it dependent on mutable production-like content?
12. **Unknown:** what manual and automated accessibility evidence covers the entire modal-to-download flow on mobile, keyboard, screen reader and high-zoom configurations?

## Implications for the hypotheses

### [H001: Capability-owned modules](../../hypotheses/H001-capability-owned-modules.md)

**Observed evidence:** one coherent teacher outcome currently spans both route systems, route-local components, `SharedComponents`, `TeacherComponents`, `TeacherViews`, `CurriculumComponents`, `pages-helpers`, general utilities, query adapters, analytics contexts and external-service helpers.

**Inference:** this supports testing H001's prediction that an explicit teacher discovery/resource-use capability could make the outcome easier to trace. The candidate boundary must still expose shared curriculum, identity, copyright, analytics and archive-generation contracts rather than duplicate them.

**Invalidating or weakening evidence to seek:** sample changes and incidents may show that curriculum publishing, not teacher workflow, is the stable ownership boundary; a vertical slice may duplicate the current validated transformations; or sharing, Classroom and download variants may form a genuinely shared resource-delivery capability that should not sit inside teacher browse.

**Next discriminating test:** specify `discover curriculum -> choose unit -> inspect lesson -> request selected resources` as use cases over fixtures and current adapters. Compare files touched, dependency direction, runtime behavior and explanatory clarity with the present call graph.

### [H003: Unified runtime-shell contract](../../hypotheses/H003-unified-runtime-shell.md)

**Observed evidence:** the representative journey crosses from the Pages shell to the App shell at its first navigation. Both provide Clerk, consent, themes, analytics, application hooks and notifications, but with different provider and error/metadata composition.

**Inference:** this directly supports a contract-level parity investigation. It does not yet prove that the roots should share one implementation.

**Invalidating or weakening evidence to seek:** runtime comparison may show that all differences are deliberate product/performance profiles, that cross-router navigation fully reloads and cleanly re-establishes equivalent contracts, or that a shared conformance layer adds client code and migration complexity without preventing real defects.

**Next discriminating test:** record a parity matrix and instrument one navigation from `/` to a programme route for consent state, Clerk identity, analytics session/journey IDs, duplicate events, notification availability, focus, theme and error behavior.

### [H004: Domain ports and explicit freshness](../../hypotheses/H004-domain-ports-and-freshness.md)

**Observed evidence:** existing query adapters already provide valuable domain-like validation and transformation. The route and download view still coordinate distinct curriculum, CMS, Downloads API, Clerk, HubSpot, local-storage and cache/freshness behavior. The Downloads API existence check has a documented failure history when moved into SSR/ISR.

**Inference:** the trace supports testing H004 specifically around outcome-level freshness and degraded behavior. The evidence does not justify wrapping every query in another pass-through layer.

**Invalidating or weakening evidence to seek:** the existing adapters may already be the right ports; two-hour freshness may meet all teacher needs; the live file check may be the only necessary exception; or a use-case layer may obscure route-specific query selection and worsen performance.

**Next discriminating test:** define a teacher-facing matrix for curriculum metadata, CMS explanation, restriction state, user identity, file existence and archive URL. For each, record authority, acceptable age, stale behavior, timeout, retry, fallback and observability; then implement one provider-independent `prepareLessonDownload` contract against fixtures and current services.

### [H005: Journey-level confidence](../../hypotheses/H005-journey-level-confidence.md)

**Observed evidence:** OWA has already added the highest-value browser assertion for the final segment: an unrestricted lesson can trigger a ZIP download. It also has focused route, component, restriction and success-view tests. The browser fixture bypasses discovery/programme/unit steps and is not currently wired into CI.

**Inference:** this supports a discriminating experiment that extends and stabilizes the existing browser check without replacing lower-level coverage. It does not yet show unique defect signal, an acceptable gate, or the right suite size and variant matrix.

**Invalidating or weakening evidence to seek:** the live download dependency may make the test irreducibly flaky; controlled substitutes may cease to predict production; production defect history may show that failures are overwhelmingly local; or restricted/mobile variants may make a small shared journey suite misleading rather than comprehensive.

**Next discriminating test:** keep the existing real-download smoke test, add one deterministic discovery-to-download contract with controlled curriculum, identity, HubSpot and Downloads adapters, run both repeatedly in CI, and measure duration, flake rate, diagnostic quality and defects uniquely caught.

## Current conclusion

**Inferred, 2026-07-19:** OWA's teacher download journey encodes substantial educational, accessibility, content-policy and operational behavior. It is not merely a chain of pages around a file endpoint. The evidence supports testing all four hypotheses within a narrow scope: capability ownership for the teacher outcome, an explicit cross-router shell contract, source-aware domain/freshness contracts, and a small journey assurance layer. None is validated yet. The most decisive next work is to make the download outcome semantics and source freshness explicit, inspect production incident/change history, and implement a controlled vertical slice that can fail these hypotheses rather than assume them.
