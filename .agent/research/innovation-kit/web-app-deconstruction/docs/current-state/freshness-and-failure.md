# Freshness and failure semantics

## Purpose and evidence boundary

This record asks a narrower question than the journey traces: when OWA reads or
writes state, how old may that state be, what happens when its provider is
unavailable, and how does the system recover?

All source observations are pinned to OWA commit
[`510ac63a62fb37a70183b00ce0f5fb15be4491e5`](https://github.com/oaknational/Oak-Web-Application/tree/510ac63a62fb37a70183b00ce0f5fb15be4491e5).
This is a static-source investigation. It does not establish live environment
values, CDN behavior, upstream service guarantees, incident frequency, user
expectations or the internals of `@oaknational/google-classroom-addon`.

The labels follow the [research charter](../research-charter.md):

- **Observed:** directly encoded in the pinned source.
- **Inferred:** the current explanation of one or more observations.
- **Unknown:** a contract or runtime fact that the source does not establish.

In this document, freshness includes both age of public data and consistency of
user-owned state. A cache duration is a mechanism, not evidence that its duration
meets a user requirement. Likewise, an uncached `fetch` is not by itself a
strong-consistency guarantee.

## Summary matrix

| Boundary                        | Observed mechanism or configured default                                                                                                   | Observed degraded behavior                                                                                                                                  | Observed retry or invalidation                                                                                                        | Unknown user-required freshness                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Curriculum GraphQL              | Pages routes commonly use ISR whose configured fallback is 60 seconds; traced App routes use a two-hour layout/cache default.              | Most invalid or missing domain data becomes a 404, redirect or route error; top navigation alone has a null-navigation fallback.                            | GraphQL SDK uses a retry count of three. Cache tags are attached, but no tag/path invalidation caller was found in the snapshot.      | Maximum age for publication, withdrawal, copyright, takedown, navigation and browse changes.                          |
| Sanity CMS                      | Sanity CDN use defaults to enabled; Pages ISR and App `cacheData` introduce separate page-level clocks. Live overrides are unknown.        | A missing required document can become 404; some optional programme copy is omitted and reported; curriculum export has a dummy-copy fallback.              | The Sanity SDK wrapper reports and rethrows; it has no OWA retry loop. Regeneration is time based in inspected code.                  | Maximum editorial delay by content type, and whether old content or no content is safer during outage.                |
| Downloads and file existence    | Curriculum data advertises expected assets; a client-only Downloads API check asks what physically exists after hydration.                 | Lesson check failure leaves the advertised list available; unit check failure hides the button. Archive-request failure shows retryable UI.                 | Each existence hook checks once per mount. Archive and existence fetches have no request retry.                                       | How current file existence must be, which source wins on disagreement, and what counts as a successful download.      |
| Clerk identity and onboarding   | Browser Clerk state gates UI; final onboarding updates Clerk metadata and reloads the user.                                                | Loading walls avoid premature UI; failed completion shows a retry message. A webhook sync failure returns 500.                                              | No OWA request retry; explicit user retry. Educator provisioning also repairs a missing user on first save.                           | Read-after-write, cross-tab/session propagation, region re-evaluation and webhook convergence requirements.           |
| Educator saved content          | Authenticated BFF reads are runtime validated; clients use SWR plus hook-local optimistic arrays and a shell count.                        | Non-OK mutation responses roll back local state. Library read failure can leave a header-only page. Missing browse rows are skipped.                        | No app-specific SWR policy is passed. Programme changes call `mutate`; successful writes do not explicitly reconcile all read models. | When a save must appear across page, tab and device; treatment of retired or partially published content.             |
| Pupil local and Firestore state | In-progress ordinary lessons are module memory; completed printable attempts are local storage; shared attempts are appended to Firestore. | Refresh loses ordinary in-progress state. A shared URL is copied before persistence completes. Local results without storage do not reach a terminal error. | No persistence queue or Firestore request retry. Remote client deduplicates the same attempt in one client session until a failure.   | Required survival across refresh/device, result availability delay, retention, revocation and content/result binding. |
| Classroom and Google            | Add-on context/progress hydrate once; submission state is also refreshed on window focus; each section change is posted.                   | Context/read failures degrade to an ordinary working lesson with sync disabled; write failures are silent to the pupil.                                     | No client debounce, ordering, acknowledgement or retry queue is visible. Server endpoints report provider exceptions.                 | Resume convergence, maximum delay for turn-in/return, offline behavior and acceptable visible warning.                |

## Boundary profiles

### 1. Curriculum GraphQL and route data

#### Mechanism and defaults

**Observed:** The App Router cache helper defaults to 7,200 seconds, accepts
tags, and warns that cached transformed data can retain an old shape across a
deployment. The core layout independently exports the same two-hour revalidation
value ([cache helper](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cache/index.ts#L1-L33),
[core layout](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/layout.tsx#L11-L39)).
Programme curriculum calls, unit data and lesson-download data use that helper
without a shorter use-case-specific duration ([programme cache](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/getProgrammeData.ts#L20-L78),
[unit cache](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/units/%5BunitSlug%5D/lessons/getCachedUnitData.ts#L8-L27)).

**Observed:** The Pages ISR decorator obtains one environment value named
`sanityRevalidateSeconds`; its configured fallback is 60 seconds. That decorator
is also applied to Pages routes whose main data is curriculum content
([ISR decorator](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/isr/index.ts#L7-L32),
[configuration fallback](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/getServerConfig.ts#L86-L102)).
**Unknown:** the live environment values and effective Next/Vercel cache state
are not established by the repository.

#### Failure, recovery and observability

**Observed:** The curriculum SDK wraps operations with Polly, sets
`retryCount = 3`, logs retry attempts, and reports an Oak timeout error at the
terminal count ([SDK retry](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/sdk.ts#L24-L57)).
Page adapters then Zod-validate and shape responses. Invalid slugs and missing
records become canonical redirects, 404s or route errors. App error UI reports
the error and offers `reset` plus `router.refresh`
([programme handling](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/page.tsx#L154-L244),
[error recovery](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/components/ErrorHandling/ErrorFallback.tsx#L26-L76)).

**Observed:** Top navigation is an explicit exception: a schema mismatch is
reported and returns `{ teachers: null, pupils: null }`, allowing the shell to
render without curriculum navigation ([top-nav fallback](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/topNav/topNav.query.ts#L26-L50)).

**Observed (repository search):** cache tags are assigned to programme queries,
but the pinned `src` tree contains no `revalidateTag` or `revalidatePath` call.
The inspected invalidation policy is therefore time based or external to this
repository.

#### Missing contract and competing explanations

**Unknown:** OWA source does not say whether a teacher may see a newly published
lesson 60 seconds or two hours late, how quickly a withdrawal or restriction
must take effect, or whether serving the last known curriculum is safer than an
error for each use case.

**Competing explanations:** the two-hour default may intentionally match a
stable materialized curriculum publication cycle, or it may be a framework-level
default inherited by data with different urgency. The different Pages/App clocks
may be a deliberate migration comparison, or simply two generations of cache
configuration. Publication timestamps and incident evidence can discriminate;
folder placement cannot.

### 2. Sanity CMS

#### Mechanism and defaults

**Observed:** The Sanity GraphQL endpoint uses the CDN when `sanityUseCDN` is
true, and that setting defaults to the string `"true"`. Requests are authenticated
and wrapped with operation-level logging
([Sanity client](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/sanity-graphql/index.ts#L13-L40),
[request wrapper](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/sanity-graphql/index.ts#L85-L108),
[configuration](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/getServerConfig.ts#L65-L70)).
Pages commonly add the ISR clock described above, while the integrated programme
route puts CMS calls behind the App two-hour cache helper
([programme CMS cache](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/page.tsx#L49-L90)).

**Observed:** CMS methods return `null` for a missing singleton/slug document and
`[]` for a missing list, resolve embedded references, and parse results with Zod.
Production parsing is strict; preview list parsing can filter invalid items
([CMS methods](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cms/sanity-client/cmsMethods.ts#L28-L128),
[parse policy](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cms/sanity-client/parseResults.ts#L88-L144)).

#### Failure, recovery and observability

**Observed:** The Sanity request wrapper reports and rethrows; no OWA retry loop
is present. Callers choose different degraded behavior. A curriculum programme
requires curriculum-overview CMS data and returns 404 when it is absent, while
missing programme-header copy is reported and the page continues without it
([programme decisions](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/page.tsx#L222-L244)).
The curriculum document export is another exception: missing Sanity data is
replaced with conspicuous dummy copy and recorded in `dataWarnings`; broader
load failure becomes not-found
([export fallback](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L72-L190)).

**Unknown:** whether Next retains a previous successful generation after each
kind of regeneration failure in the deployed configuration, and whether any
publish webhook invalidates caches outside this repository.

#### Missing contract and competing explanations

**Unknown:** required publication delay and outage behavior are not stated for
campaigns, safeguarding copy, programme explanations, policies and export prose.
Those content types need not share one answer.

**Competing explanations:** strict 404 behavior may protect against incomplete
editorial compositions, or it may unnecessarily couple otherwise usable
curriculum browsing to descriptive CMS content. The export dummy data may be an
intentional operational recovery path, or a diagnostic behavior that should
never reach users. Analytics, support history and editorial policy are needed
before changing either.

### 3. Downloads API and physical file existence

#### Mechanism and defaults

**Observed:** Cached curriculum data declares which lesson resources should be
available. After hydration, OWA asks the Downloads API `check-files` endpoint
which standard files physically exist. A source comment records that SSR/ISR
checks were repeatedly rolled back because revalidation caused high-volume
failures and unreliable upstream behavior
([existence adapter](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence.tsx#L9-L15),
[request and schema](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence.tsx#L44-L109)).

**Observed:** Each hook marks its check complete before issuing the request and
does not retry during that mount. Lesson checks filter the initial resource list
on success, but on failure only report an error, leaving the curriculum-derived
list in place ([lesson check](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useLessonDownloadExistenceCheck.tsx#L18-L84)).
Unit download UI instead renders only when `hasCheckedFiles && exists`, so a
failed check leaves no unit action
([unit check](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck.tsx#L9-L41),
[unit button decision](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/UnitDownloadButton/UnitDownloadButton.tsx#L294-L372)).
This is an observed fail-open/fail-closed asymmetry for related outcomes.

#### Failure, recovery and observability

**Observed:** Archive URL fetches have runtime response validation and optional
Clerk authorization, but no timeout or request retry in OWA
([download-link request](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink.tsx#L28-L98)).
Lesson request failures are reported by the submit wrapper and surfaced as an
inline error plus persistent toast; submitting again is the recovery action
([reporting](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/helpers/downloadAndShareHelpers/downloadDebounceSubmit.tsx#L16-L40),
[user fallback](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L211-L299)).

**Observed:** The success transition observes a hidden link click, polls for at
most about one second, then waits another second for Safari. It does not observe
transfer completion or archive contents
([link callback](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink.tsx#L19-L55)).
Additional-file IDs are not included in the lesson existence check even though
they can be submitted for the archive
([view call](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L302-L308)).

**Unknown:** the Downloads API's cache headers, signed-URL lifetime, archive
generation, partial-failure, idempotency and rate-limit behavior are outside
this source snapshot.

#### Missing contract and competing explanations

**Unknown:** which authority should win when curriculum metadata and physical
existence disagree, how old an existence answer may be, and whether success
means URL issued, click initiated, transfer completed or archive verified.

**Competing explanations:** the lesson fail-open behavior may deliberately keep
a valuable download path available during a flaky check, while the unit
fail-closed behavior may avoid promising a large archive. Alternatively, two
hooks may have drifted. Controlled failure tests plus product intent can decide;
making both mechanically identical cannot.

### 4. Clerk identity and onboarding

#### Mechanism and defaults

**Observed:** Browser eligibility is derived from Clerk `isLoaded`, `isSignedIn`
and public `owa` metadata. Onboarding writes validated public/private metadata
through the Clerk server client, then the browser reloads its Clerk user before
returning to the prior route
([onboarding gate](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28registration%29/onboarding/layout.tsx#L37-L69),
[metadata write](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/auth/onboarding/route.ts#L7-L44),
[reload sequence](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/OnboardingForm/OnboardingForm.tsx#L145-L168)).

#### Failure, recovery and observability

**Observed:** The client onboarding request has no automatic retry. It reports
network/non-OK failures and the form presents "Something went wrong. Please try
again." ([request adapter](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/OnboardingForm/onboardingActions/onboardUser.ts#L5-L46),
[form recovery](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/OnboardingForm/OnboardingForm.tsx#L149-L168)).
Because metadata update and `user.reload()` are in the same client `try`, a
successful write followed by reload failure is presented as a failed completion.
**Inferred:** a later reload may reveal the user as onboarded; this needs a
fault-injection test rather than assumption.

**Observed:** A verified Clerk `user.updated` webhook attempts to provision the
Educator API user and returns 500 when that operation fails. The save endpoint
also checks for and creates a missing Educator user, providing action-time repair
([webhook](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/webhooks/route.ts#L68-L87),
[lazy repair](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/educator/saveUnit/%5BprogrammeSlug%5D/%5BunitSlug%5D.ts#L36-L52)).
**Unknown:** Clerk/Svix redelivery behavior, Educator create idempotency and the
maximum convergence time.

#### Missing contract and competing explanations

**Unknown:** the required propagation time after onboarding across tabs,
sessions, server token claims and region-authorized actions. The source also does
not state when region authorization must be recomputed.

**Competing explanations:** webhook plus lazy creation may be intentional
defence against lost events, or migration residue with ambiguous ownership. The
client reload may be the necessary read-after-write barrier, or a provider-specific
workaround. Removing either without delivery/idempotency evidence would weaken
recovery.

### 5. Educator saved content

#### Mechanism and defaults

**Observed:** Signed-in clients use a small SWR wrapper with only a conditional
key and fetcher; no app-specific revalidation, retry or staleness options are
passed. `useSaveUnits` calls `mutate()` when the programme slug changes, while
the My Library read does not expose an explicit reconciliation step
([SWR helper](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/educator-api/helpers/useGetEducatorData.ts#L1-L26),
[programme refresh](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/educator-api/helpers/saveUnits/useSaveUnits.tsx#L23-L64),
[library read](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/educator-api/helpers/saveUnits/useMyLibrary.tsx#L28-L44)).
SWR package defaults may add behavior, but that is not an explicit Oak contract
in this helper.

**Observed:** Save and unsave update hook-local membership, a shell count and a
toast before posting. A non-OK response invokes a compensating callback. A
successful response does not explicitly mutate the SWR read or reconcile the
other local projections
([optimistic save](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/educator-api/helpers/saveUnits/useSaveUnits.tsx#L78-L141),
[post helper](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/educator-api/helpers/postEducatorData.ts#L1-L10)).

#### Failure, recovery and observability

**Observed:** The compensating callback runs for an HTTP non-success response.
A rejected `fetch` throws before that callback and before the hook clears its
`isSavingUnit` state. This is an encoded difference between provider rejection
and transport failure, not a tested runtime result.

**Observed:** The BFF authenticates with Clerk-derived identity, validates the
Educator response, joins it to `browse_mv[0]`, and silently omits saved records
without matching browse data. Provider/schema errors are reported and returned
as 500 ([library BFF](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/educator/getSavedContentLists/index.ts#L18-L100)).
The client hook ignores the SWR `error` value; with `collectionData` still null,
the view renders its header but neither an empty state nor an error
([client shaping](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/educator-api/helpers/saveUnits/useMyLibrary.tsx#L28-L125),
[view states](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/MyLibrary/MyLibrary.tsx#L53-L72)).

**Observed:** BFF errors reach the shared reporter, schema failures on client
data are also reported, and mutations show a toast for non-OK responses.
Analytics is emitted after `postEducatorData` resolves even when it resolved
`false`, so the event name alone is not durable proof of persistence.

#### Missing contract and competing explanations

**Unknown:** whether a successful save must immediately appear after navigation,
in another tab, on another device or only on the next provider read. Treatment
of retired units, removed programme variants and mixed publication states is
also unstated.

**Competing explanations:** optimistic projections may intentionally prioritize
fast, low-conflict bookmarking and accept later provider convergence, or the
multiple projections may create avoidable drift. Omitted browse rows may enforce
publication policy, or hide user-owned records without explanation. Delayed and
cross-context experiments are required before choosing a model.

### 6. Pupil local and Firestore results

#### Mechanism and defaults

**Observed:** Ordinary in-progress lesson state is a module-level Zustand store
without persistence middleware. It survives client section navigation but not a
hard refresh. Once complete, a local printable result is a separate immutable
snapshot in browser local storage
([progress store](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/PupilLessonProgress/usePupilLessonProgress.ts#L13-L70),
[local snapshot](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/pupil-client/client.ts#L110-L132)).

**Observed:** Sharing creates an attempt ID, copies its URL immediately, and
posts a schema-projected attempt asynchronously. The server checks for an
existing ID and appends a Firestore document with a creation timestamp
([copy ordering](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/Views/Hooks/usePupilReviewExperience.ts#L99-L138),
[attempt route](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/pupil/lesson-attempt/route.ts#L33-L69),
[Firestore append](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/pupil-api/lesson-attempt/logLessonAttempt.ts#L8-L16)).

#### Failure, recovery and observability

**Observed:** There is no request retry or offline queue. The browser client
deduplicates a repeated identical remote attempt within its own state and clears
that remembered ID after a rejected promise
([client state](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/pupil-client/client.ts#L110-L155)).
The share UI changes to failed after promise rejection, but the already copied
URL cannot be withdrawn.

**Observed:** The API reports Firestore exceptions but returns
`NextResponse.json({ status: 500, ... })` without setting the HTTP status. The
browser adapter reports non-OK HTTP responses but still returns parsed JSON
rather than rejecting
([API catch](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/pupil/lesson-attempt/route.ts#L53-L69),
[browser handling](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/pupil-client/network/PupilApiClient.ts#L9-L29)).
**Observed, local verification 2026-07-19:** The focused API Jest test passes,
but its `NextResponse` mock assigns status 500 when response init is omitted,
([mock](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/pupil/lesson-attempt/route.test.ts#L28-L46)). Creating the same response with the installed real `NextResponse` returned HTTP 200 and `ok: true`; the test masks the production status mismatch.
**Inferred:** a failed write is therefore presented as success at both
server-status and browser-rejection boundaries. The composed user-facing outcome
still needs a browser execution before it is recorded as reproduced.

**Observed:** A local printable link without its matching browser record stays
on a loading/banner branch rather than reaching not-found or retry. Firestore
reads validate stored attempts and report malformed records
([local reader behavior](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/pupils/lessons/%5BlessonSlug%5D/results/%5BattemptId%5D/printable.tsx#L35-L71),
[Firestore read](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/pupil-api/lesson-attempt/getLessonAttempt.ts#L10-L43)).

#### Missing contract and competing explanations

**Unknown:** whether ordinary progress should survive refresh, when a copied
result must become resolvable, how long local/remote results live, how they are
revoked, and whether result identity must be bound to the lesson slug in the URL.

**Competing explanations:** ephemeral ordinary progress may deliberately avoid
identity and retention complexity, or it may be an unrecorded resilience gap.
Copy-before-confirmation may optimize a familiar browser interaction, or expose
dead links. Pupil research, privacy policy and failure rates must set the
contract.

### 7. Classroom, Google and provider progress

#### Mechanism and defaults

**Observed:** OWA constructs the add-on service with Google OAuth/session
secrets and the pupil Firestore instance, while provider behavior lives in the
external package
([add-on construction](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/google-classroom/getOakGoogleClassroomAddon.ts#L1-L32)).
For a pupil assignment, context, saved progress and submission state hydrate
once. Only submission read-only state is rechecked on window focus
([context hydration](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/Views/ViewHelpers/Shared/useClassroomAddonContext.ts#L86-L173)).

**Observed:** Every `sectionResults` change is mapped and posted unless context
is incomplete or the assignment is read-only. The subscription has no visible
debounce, sequence/version field, acknowledgement state or retry queue
([progress synchronization](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/Views/ViewHelpers/Shared/useClassroomProgressSync.ts#L20-L80)).

#### Failure, recovery and observability

**Observed:** Browser API helpers turn context, progress and submission-state
failures into `null` after console logging. Hydration catches again and marks the
lesson ready, explicitly allowing the lesson to work with progress sync disabled
([browser degradation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/google-classroom/googleClassroomApi.ts#L189-L275),
[lesson fallback](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/Views/ViewHelpers/Shared/useClassroomAddonContext.ts#L99-L137)).
Progress write failures are caught and discarded so later state changes may
still submit; there is no pupil-visible unsaved state.

**Observed:** API routes validate input, report external-package exceptions and
return 4xx/5xx responses. The progress-write endpoint distinguishes package
exceptions as 403 from other failures as 500
([write endpoint](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/classroom/pupil/progress/submit/route.ts#L18-L57)).
The context route separately treats a Firestore failure while finding the
teacher login hint as non-fatal and returns `null`
([context endpoint](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/classroom/context/route.ts#L19-L31)).

**Observed:** The progress-read browser helper requests the teacher cookie
profile while context, submission-state and progress-write helpers request the
pupil profile
([auth profiles and progress read](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/google-classroom/googleClassroomApi.ts#L12-L33),
[progress read/write](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/google-classroom/googleClassroomApi.ts#L206-L252)).
**Unknown:** whether this is intentional package/API policy, compatibility for
teacher printable results, or an auth-profile mismatch.

#### Missing contract and competing explanations

**Unknown:** how quickly resume data must converge, whether concurrent writes are
ordered by the provider, how promptly turn-in/return must make a lesson read-only,
and whether silent degradation is acceptable for pupil and teacher outcomes.
Token refresh, offline behavior and conflict semantics are also outside the
inspected OWA code.

**Competing explanations:** fire-and-forget writes may intentionally maximize
lesson continuity and rely on provider upsert ordering, or they may allow an
older request to overwrite newer work. Silent context failure may be a sensible
fallback from an optional integration, or hidden loss of the assignment's core
promise. Latency and failure injection against the actual package are the most
direct discriminators.

## Cross-boundary findings

1. **Observed:** OWA already contains several useful provider/domain boundaries:
   runtime schemas, curriculum exceptions, authenticated BFFs, error taxonomies
   and explicit fallback branches. The question is not whether to add a wrapper
   around every query.
2. **Inferred:** freshness is usually selected by framework placement or provider
   call site: Pages ISR, App cache, SWR defaults, one-shot effects or direct
   fetches. It is rarely named as part of a user outcome.
3. **Observed:** closely related behaviors can fail differently: lesson file
   checking fails open while unit checking fails closed; public lesson progress
   disappears on refresh while Classroom progress attempts write-through;
   provider HTTP rejection rolls back a save while a network rejection can
   bypass compensation.
4. **Inferred:** error reporting is stronger than user-outcome observability.
   Provider failures are often reported, but current events do not always prove
   durable save, resolvable result, ordered Classroom progress or completed
   archive transfer.
5. **Unknown:** which asymmetries are intentional policy, which are migration
   states, and which have caused material incidents.

## Competing system hypotheses

| Explanation                                                   | Evidence that would strengthen it                                                                                                                                   | Evidence that would weaken it                                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Broad cache defaults are deliberate publication policy.       | Source-to-page lag stays within agreed targets for publish, correction, withdrawal and restriction events; teams can explain the two clocks.                        | Urgent changes exceed agreed targets, or different use cases need materially different clocks.            |
| Existing adapters are already sufficient domain ports.        | Callers can state freshness, stale fallback, idempotency and errors without coordinating provider-shaped details; substitutions leave route/UI contracts unchanged. | Route/hooks must know provider cache, auth and failure details to preserve outcomes.                      |
| Silent degradation protects the primary educational outcome.  | Users prefer continuing with an explicit lower guarantee; later reconciliation is reliable and loss is observable operationally.                                    | Users believe work/download/save is durable when it is not, or support incidents show hidden loss.        |
| Missing mutation retries are deliberate duplicate protection. | Providers lack idempotency and manual retry is safer; failures are rare and visible.                                                                                | Idempotency exists, transport failures are common, or compensation leaves stuck/divergent state.          |
| Ephemeral ordinary pupil state is a privacy/product decision. | Research and retention policy explicitly prefer session-only progress.                                                                                              | Pupils commonly refresh/return and expect recovery, with acceptable privacy-preserving storage available. |

## Effect on H004 and H005

### H004: Domain ports and explicit freshness

**Effect:** the matrix supports testing H004; it does not validate it. The
same journeys combine reference content, editorial content, authorization,
physical assets, personal saved state, anonymous results and mutable Classroom
state, each with different encoded clocks and failure modes. A useful port would
name those policies and make them testable; it would not merely rename the
existing Zod adapters.

**Invalidators or material narrowing evidence:**

- stakeholder and incident evidence shows the important outcomes genuinely share
  the current freshness and degraded-behavior defaults;
- existing adapters can already express the full policy without route/UI
  knowledge, and a new use-case boundary adds pass-through indirection;
- route-specific query and caching needs are measurably obscured or made slower;
- controlled provider substitution cannot preserve production-relevant behavior;
- stale/mismatched data has no meaningful connection to observed user or
  operational harm.

### H005: Journey-level confidence

**Effect:** the matrix supports testing H005 and narrows its candidate assertions.
The valuable journey assertions
are failure contracts: withdrawal reaching a download, onboarding becoming
save-eligible, a failed optimistic mutation reconciling, a copied result becoming
resolvable, and Classroom progress surviving reordered writes. Another broad
happy path would not cover these claims.

**Invalidators or material narrowing evidence:**

- sampled high-impact defects are local and focused tests provide clearer diagnosis;
- controlled adapters cannot reproduce the provider behavior that matters;
- the small suite remains slow or flaky after identity, time, data and network
  are controlled;
- existing deployment checks already assert the same degraded outcomes with
  better diagnostic value;
- variants have irreducibly different contracts, so a shared journey test gives
  misleading confidence.

## Most decisive experiments

| Priority | Experiment                                                                                                                                                                                                  | Observation that decides something                                                                        |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1        | Ask product, curriculum, editorial, safeguarding and support owners to complete one table: maximum acceptable age, safe stale fallback, user message and recovery owner for each row in the summary matrix. | Establishes requirements without inferring them from cache code. A genuine uniform answer weakens H004.   |
| 2        | Record the deployed cache/CDN environment and publish timestamps for one normal curriculum change, one withdrawal/restriction, one CMS correction and one programme-copy change.                            | Confirms effective clocks and whether Pages/App paths meet the stated requirements.                       |
| 3        | Against a controlled Downloads adapter, fail `check-files`, return disagreement, delay archive generation and omit an additional file for both lesson and unit flows.                                       | Decides whether fail-open/fail-closed behavior is intentional and what download success means.            |
| 4        | Fault onboarding at metadata write, client reload and webhook delivery; then attempt a save twice.                                                                                                          | Establishes read-after-write, retry, idempotency and lazy-provisioning recovery.                          |
| 5        | Exercise Educator save/unsave with HTTP 500, network rejection, delayed success, duplicate click, two tabs and immediate navigation to My Library.                                                          | Measures compensation, stuck state and convergence across all local/SWR/provider projections.             |
| 6        | Fail and delay Firestore result publication before opening the copied URL; repeat the same attempt and inspect HTTP status, UI state and reporting.                                                         | Confirms or rejects the false-success inference and defines publish acknowledgement.                      |
| 7        | Inject ordered and reversed Classroom write latencies, drop the final write, expire auth and turn in work while the tab is open/backgrounded.                                                               | Establishes provider ordering, resume loss, read-only delay and whether silent degradation is acceptable. |
| 8        | Add one correlation ID to each controlled journey and compare user-visible outcome with error and analytics events.                                                                                         | Tests whether observability can distinguish attempted, acknowledged and durable outcomes.                 |

The experiments should record negative results. If current mechanisms meet an
explicit requirement under failure and the additional port or journey layer adds
no unique signal, that is evidence to narrow or reject the corresponding
hypothesis.
