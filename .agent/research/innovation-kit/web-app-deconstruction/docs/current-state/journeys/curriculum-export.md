# Curriculum export: programme to editable document

## Scope and outcome

This trace follows the curriculum-resource export offered from a teacher programme page. It maps the adjacent download paths, then traces the generated curriculum-plan DOCX path in depth. It does not treat lesson-resource ZIPs, unit archives and curriculum documents as one mechanism merely because the UI calls each of them a download.

All OWA evidence is pinned to commit [`510ac63a62fb37a70183b00ce0f5fb15be4491e5`](https://github.com/oaknational/Oak-Web-Application/tree/510ac63a62fb37a70183b00ce0f5fb15be4491e5) (`v1.1128.0`). This is a static source trace. The application, generators, external services and tests were not run for this investigation.

Evidence labels mean:

- **Observed:** directly evidenced in the pinned source.
- **Inferred:** the best current interpretation of observations, still requiring runtime, operational or user evidence.
- **Unknown:** not established by this source pass.

**Observed outcome:** on a curriculum programme's Download tab, a teacher can select an editable curriculum plan (DOCX), a national-curriculum alignment workbook (XLSX) when the data supports it, or both. OWA fetches a same-origin API route, receives the complete generated body as a browser `Blob`, creates a temporary object URL, and clicks a hidden anchor using the server-provided filename. The UI then replaces the form with an in-page success state ([download choices](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/CurriculumComponents/CurriculumDownloadView/helper.ts#L41-L81), [browser delivery](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadFileFromUrl.ts#L5-L28), [success transition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeDownloads/ProgrammeDownloads.tsx#L192-L237)).

**Inferred outcome boundary:** this success means OWA received a `200` response body, created a blob URL and invoked the browser's download action. It does not establish that the user saved the file, that Word or Excel opened it without repair, that assistive technology can navigate the generated artifact, or that the document still matches a later curriculum or CMS revision.

## Download paths are not uniform

| Path                        | Observable product                                                                                    | Generation/delivery boundary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Identity and restriction behavior                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Programme curriculum export | DOCX curriculum plan, XLSX national-curriculum alignment, or a ZIP containing both                    | **Observed:** generated synchronously inside OWA's Pages API from curriculum, CMS and local OOXML templates; returned as the response body ([API handlers](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L277-L387)).                                                                                                                                                                                                           | **Observed:** the UI supports signed-out teachers and sends no Clerk token to the generation route. School and terms data gate the form, but the API itself is publicly addressable ([submit path](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormSubmit.ts#L64-L77), [form invocation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeDownloads/ProgrammeDownloads.tsx#L309-L405)). |
| Lesson resources            | Selected lesson assets assembled behind the separate Downloads API and exposed through a returned URL | **Observed:** OWA asks the configured Downloads API for a link and then clicks that URL; the archive generator and storage are outside this repository ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink.tsx#L28-L98)).                                                                                                                                                            | **Observed:** a Clerk token is passed when available, and copyright policy may require sign-in, onboarding or region authorisation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Whole-unit resources        | Prebuilt/generated unit archive behind the Downloads API                                              | **Observed:** OWA checks existence, obtains a Downloads API URL with a Clerk token, and clicks it ([link creation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink.tsx#L100-L118), [button state](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/UnitDownloadButton/UnitDownloadButton.tsx#L274-L331)). | **Observed:** the button explicitly handles signed-out, not-onboarded and geo-blocked states.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

**Inference:** curriculum export is currently a publishing/document-generation capability embedded in OWA, while lesson and unit downloads are resource-delivery integrations. A future Oak app needs explicit contracts for both, but evidence from one should not be used as proof about the other.

## Teacher-to-document sequence

| Step | Teacher or system intent                           | Current mechanism                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Open a curriculum's Download tab                   | The App Router programme route accepts `units`, `curriculum-explainer` and `download`. Its client view renders accessible linked tabs and uses `history.pushState` for tab changes ([tab schema](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/tabSchema.ts#L1-L20), [tab composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeView.tsx#L155-L211)).                    |
| 2    | Load export choices for the selected subject/phase | The server validates the subject-phase route, loads programme/curriculum data and CMS content, obtains a materialized-view refresh time, and derives available tiers and child subjects from units ([page orchestration](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/page.tsx#L154-L302), [download dimensions](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/docx/tab-helpers.ts#L290-L347)).                                 |
| 3    | Refine a KS4 export                                | If tiers or child subjects exist, radio groups default to Foundation and the first child subject. Copy explains that these choices change KS4 content while the document still includes KS3 ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeDownloads/ChildSubjectTierSelector/ChildSubjectTierSelector.tsx#L34-L135)).                                                                                                                                                              |
| 4    | Choose artifact types and provide required details | Curriculum resources are selected by default. The form requires at least one resource, a school value and accepted terms; email is optional. Signed-in/onboarded details can be loaded through Clerk, HubSpot and local storage ([form state](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState.tsx#L43-L84), [schema](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/downloadAndShare.schema.ts#L30-L52)). |
| 5    | Request the selected export                        | The client builds `/api/curriculum-downloads/` from artifact types, the page's MV refresh time, subject, phase and optional KS4 dimensions. It does not attach user data or an auth token ([URL contract](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/utils/curriculum/urls.ts#L5-L29), [submission](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormSubmit.ts#L64-L77)).                                                                 |
| 6    | Bind the request to current curriculum data        | The API compares the supplied MV refresh time with a fresh refresh-time query. A mismatch produces a `307` to the same logical request with the current timestamp ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L229-L275)).                                                                                                                                                                                                                                                                                           |
| 7    | Assemble export data                               | The API loads and runtime-validates curriculum sequence and overview data, loads curriculum-explainer CMS data, applies KS4 tier/child-subject filtering and sorting, and merges the results ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L55-L226)).                                                                                                                                                                                                                                                                 |
| 8    | Generate the DOCX                                  | OWA loads an empty OOXML template, inserts local and remote images, appends a fixed sequence of document sections, adds layouts/footers, and compresses the package to a buffer ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/docx/index.ts#L48-L208)).                                                                                                                                                                                                                                                                               |
| 9    | Optionally generate and package the XLSX           | The XLSX builder creates year worksheets and resource links from national-curriculum mappings. If both types were selected, the API generates them concurrently and puts both buffers in a new ZIP ([XLSX source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/xlsx/index.ts#L26-L149), [packaging](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L327-L373)).                                                                                  |
| 10   | Receive and continue                               | The response is publicly cacheable. The client buffers it, clicks a temporary object URL, records engagement and renders a success header that can return to downloads ([response](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L375-L387), [client completion](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeDownloads/ProgrammeDownloads.tsx#L192-L237)).                                  |

## Deep trace: curriculum-plan DOCX

### 1. Page data and available choices

**Observed:** the programme page obtains curriculum option data, a curriculum sequence and overview, programme/filter data, two CMS records and the MV refresh timestamp. The CMS and refresh-time group is wrapped in React `cache` and `cacheData` with the repository's default two-hour revalidation ([page cache](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/page.tsx#L45-L90), [cache contract](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cache/index.ts#L1-L33)).

**Observed:** the national-curriculum workbook is shown when at least one flattened unit advertises `national_curriculum_content`. The workbook generator is stricter: it emits a year's sheet only when every unit in that year advertises the feature ([availability predicate](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/utils/curriculum/units.ts#L50-L58), [sheet filter](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/xlsx/index.ts#L26-L43)).

**Inferred:** "an XLSX is available" and "every displayed curriculum year will be represented in the XLSX" are different contracts. The UI does not expose that distinction.

### 2. Identity, authorisation and form restrictions

**Observed:** the curriculum export UI explicitly passes `loginRequired={false}`, `geoRestricted={false}` and `downloadsRestricted={false}`. Signed-out or not-onboarded teachers see the details and terms form; onboarded teachers rely on previously collected values ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeDownloads/ProgrammeDownloads.tsx#L304-L405)).

**Observed:** the form schema requires school, terms and a resource selection, but none of school, email, terms, Clerk identity or region is sent to the export API. The endpoint handler contains no identity check or request-method branch ([form schema](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/downloadAndShare.schema.ts#L30-L52), [API request contract](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L229-L318)).

**Inferred competing interpretations:**

1. School and terms are a product/legal acknowledgement that should gate the normal interface, while the artifact itself is intentionally public.
2. School and terms are engagement capture inherited from lesson downloads, and requiring them is not essential to the curriculum-export outcome.
3. Direct endpoint access is an unmodelled bypass of a business requirement.

**Unknown:** which interpretation reflects policy intent. Static code cannot decide it.

**Observed:** an onboarded signed-in user's CTA remains in loading state until local and HubSpot school details reconcile. If a signed-in/onboarded user has no returned HubSpot contact, the shown code does not set `schoolFromHubspot`, while the `noDetailsInHubspot` branch is false ([state reconciliation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState.tsx#L91-L161), [CTA state](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeDownloads/ProgrammeDownloads.tsx#L384-L402)).

**Inferred risk:** a valid public export can be unavailable through the normal UI because an engagement-data dependency has not settled. This requires a runtime test with an onboarded user and a `204` HubSpot contact response before treating it as a confirmed defect.

### 3. Versioning and cache identity

**Observed:** `getMvRefreshTime` asks for the latest matching materialized-view refresh. If no record exists, it reports an error and returns the current millisecond timestamp ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/downloads/getMvRefreshTime.ts#L4-L31)).

**Observed:** the page's timestamp becomes a query parameter. The API queries the refresh time again and redirects if it differs. Successful output is marked `public, durable` with a 24-hour shared max age and three-minute stale-while-revalidate window ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L21-L35), [redirect and response](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L244-L275)).

**Inferred:** this is content-addressing by upstream MV version, implemented through the URL and CDN rather than a stored artifact record. It is a meaningful contract, not merely a performance option: a data refresh changes the canonical download URL.

**Inferred failure mode:** while refresh metadata remains absent, each request can derive a new `Date.now()` value. A redirected request then obtains another value and can redirect again. The most direct invalidation is a handler test in which `refreshedMVTime` returns an empty list across a followed redirect; if the second request settles without another redirect, this inference is false.

**Observed:** DOCX content also includes Sanity curriculum explanation and partner data, but the URL version is derived only from curriculum MV refresh time. CMS absence is replaced with diagnostic dummy copy, recorded in `dataWarnings`, and generation continues; those warnings are not subsequently used in this handler ([CMS fallback](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L118-L174), [merged response data](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L192-L226)).

**Inferred competing interpretations:** the fallback preserves document availability during a CMS incident; alternatively, it converts an upstream integrity failure into an apparently successful, publicly cached document containing placeholder diagnostic text. Product, support and incident evidence should decide which behaviour preserves the intended availability and integrity contract.

### 4. Data shaping

**Observed:** the curriculum GraphQL SDK authenticates server-to-server, retries up to three times and reports exhausted retries. Sequence and overview adapters reject missing data and Zod-parse successful responses ([SDK](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/sdk.ts#L12-L57), [sequence adapter](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/curriculumSequence/curriculumSequence.query.ts#L9-L124), [overview adapter](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/curriculum-api-2023/queries/curriculumOverview/curriculumOverview.query.ts#L7-L35)).

**Observed:** the export handler adds route-specific shaping after those adapters. It filters child subject and tier only for KS4, sorts exam-board units ahead of nulls, replaces null order with `-1000`, sorts by order, looks up exam-board title, and spreads sequence, overview and CMS records into one generator model ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L77-L127), [merge](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L192-L226)).

**Inferred:** preserving all KS3 while refining KS4 is deliberate product behavior, corroborated by the selector copy. The sorting comments and null-order replacement are compatibility policy embedded in the HTTP handler, not generic transport work.

### 5. OOXML generation

**Observed:** DOCX is not produced through a high-level document model. OWA stores an unpacked empty DOCX, loads it into JSZip, parses selected XML parts, and directly inserts OOXML. A `JSZipCached` wrapper holds parsed XML in memory and flushes it before DEFLATE compression ([template loading and buffer](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/docx/docx.ts#L613-L715)).

**Observed:** the orchestrator sequentially builds a cover, table of contents, Oak curriculum explanation, thread explanation, subject explanation/principles, partner section, units, thread overview/detail and back cover. It inserts an export date and page number in the footer ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/docx/index.ts#L48-L208)).

**Observed:** most images are local assets, while the subject icon and partner images can be fetched remotely during generation. Remote SVGs are converted to PNG with Sharp. The image fetch path has no explicit timeout, response-status check or fallback after a non-empty URL fails ([front cover](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/docx/builder/1_frontCover.ts#L21-L40), [image loader](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/docx/docx.ts#L86-L175), [partner images](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/docx/builder/7_ourPartner.ts#L47-L80)).

**Inferred:** the synchronous export outcome depends on curriculum GraphQL, CMS and remote image delivery in addition to local CPU and memory. GraphQL has retry policy; remote artifact enrichment does not expose an equivalent explicit policy.

### 6. Packaging, filename and browser delivery

**Observed:** one selected handler returns its file directly. Two selections run concurrently with `Promise.all` and are repackaged into a ZIP. Filenames carry product, subject, phase, exam board, child subject/tier where applicable, generation date, and for the combined ZIP a short hash of selected types plus MV refresh time ([handler assembly](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L277-L373), [filename policy](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/utils/curriculum/formatting.ts#L439-L498), [ZIP helper](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/utils/curriculum/zip.ts#L1-L18)).

**Observed:** every successful response declares `content-type: application/msword`, including XLSX and ZIP responses. The `Content-Disposition` value starts a filename quote but does not close it; the browser helper instead relies on the custom `x-filename` header ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L375-L387), [client filename](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadFileFromUrl.ts#L19-L28)).

**Inferred risk:** the first-party `fetch` path masks response metadata defects that direct navigation, other clients, security gateways or content inspection could expose. A header-contract test is the most direct discriminator.

**Observed:** server generation holds each artifact in a buffer; dual generation holds both before constructing another ZIP buffer. The browser then buffers the entire response into a `Blob`. There is no streaming path in the traced code.

**Unknown:** production document sizes, function duration/memory, cache-hit rate and concurrency headroom. Without these measurements, synchronous generation cannot be called either sufficient or unscalable.

## Storage, privacy and document controls

**Observed:** within the traced path, generated artifacts exist as in-memory buffers, a response body, a browser `Blob` and a temporary object URL. There is no object-store upload, artifact database record or generated-file identifier in the curriculum-export implementation ([server buffer flow](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L327-L387), [browser blob flow](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadFileFromUrl.ts#L5-L28)). CDN caching may persist response bodies operationally, but no artifact-store contract is visible here.

**Observed:** school, email, terms and user identity are not incorporated into the URL or generated document. After download, school and optional email are sent separately to HubSpot and analytics ([tracking](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeDownloads/tracking.ts#L21-L56)).

**Observed:** no password, OOXML document protection, watermark, classification label, malware scan or DLP call is present in the traced generator and response path. The artifacts are explicitly presented as editable and the API response is public.

**Unknown:** whether CDN, endpoint-security or organisational DLP controls exist outside this repository; whether they are required for public curriculum content; and whether remote CMS images are subject to a provenance or malware-control contract before embedding.

## Accessibility

### Browser interaction

**Observed:** the programme tabs are a labelled `nav`; KS4 choices use radio groups with legends and named radio buttons; resource choices sit in a fieldset with a visually hidden legend; errors use polite live regions; and the API error is rendered as a large `FieldError` with live announcement ([tabs](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeView.tsx#L164-L195), [KS4 selection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeDownloads/ChildSubjectTierSelector/ChildSubjectTierSelector.tsx#L77-L134), [download form semantics](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/DownloadPageWithAccordion/DownloadPageWithAccordion.tsx#L189-L233), [announcements](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/DownloadPageWithAccordion/DownloadPageWithAccordion.tsx#L266-L319)).

### Generated artifacts

**Observed:** the choice labels call both artifacts accessible. DOCX content uses Word heading styles, sets the document style language to `en-GB`, supplies alt text for the Oak logo and marks decorative images as decorative ([labels](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/CurriculumComponents/CurriculumDownloadView/helper.ts#L57-L79), [cover semantics](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/docx/builder/1_frontCover.ts#L61-L131), [portable-text headings](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/docx/builder/portableText.ts#L233-L313)).

**Observed:** XLSX worksheets use text cells for curriculum statements and ticks, human-readable link text, external hyperlink relationships and frozen panes ([sheet source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/xlsx/builders/buildSheet.ts#L14-L223), [tick cells](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/xlsx/builders/buildTickCell.ts#L6-L22)).

**Inferred:** these are substantive accessibility measures, but the word "accessible" remains a product claim until the final generated artifacts are checked with Office accessibility tools and representative assistive technology. OOXML snapshots prove structure, not usable reading order, table navigation, colour independence or repair-free opening.

**Unknown:** the audit standard, last manual artifact audit, supported Office/viewer versions, high-zoom behavior, screen-reader journey, workbook table/header semantics and ownership of generated-document accessibility.

## Analytics and meaning of success

**Observed:** choosing KS4 dimensions emits `curriculumResourcesDownloadRefined` with subject, tier and child-subject context. After the blob download action, OWA submits engagement data to HubSpot and emits `curriculumResourcesDownloaded` ([refinement](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeDownloads/tracking.ts#L59-L84), [completion sequence](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeDownloads/ProgrammeDownloads.tsx#L192-L227)).

**Observed:** the final tracking helper sends HubSpot `resources: ["docx"]` and analytics `resourceType: ["curriculum document"]` regardless of whether the teacher selected DOCX, XLSX or both. Tier and child-subject choices are absent from the completion event ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeDownloads/tracking.ts#L21-L56)).

**Inferred:** analytics can count the interaction as a curriculum-document download after body receipt, but cannot reconstruct the delivered artifact mix from the completion event alone. The earlier refinement event is not a reliable substitute because users may change resource selection afterward.

**Unknown:** whether product reporting intentionally groups all curriculum artifacts, whether events are joined by session, and whether CDN/function telemetry provides generation failures, latency and cache outcomes.

## Failure and recovery behavior

**Observed:** GraphQL calls retry; route-level curriculum/CMS failures inside `getData` are logged and collapsed to `404`; invalid `state=new` also returns `404`. Query-parse failures, refresh-time failures outside `getData`, remote image failures and generator failures have no local response mapping in the handler ([data error handling](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L72-L190), [handler branches](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/api/curriculum-downloads/index.ts#L229-L392)).

**Observed:** the browser helper treats every non-`200` response as an error. The UI reports a single retryable message, resets submitting state and keeps the form. It does not distinguish invalid selection, unavailable data, timeout, generation defect or server overload ([client error](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/helpers/downloadFileFromUrl.ts#L19-L28), [UI recovery](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeDownloads/ProgrammeDownloads.tsx#L192-L227)).

**Observed:** HubSpot submission catches and reports its own errors without rethrowing, so engagement capture failure after a delivered blob does not intentionally turn the export into a UI failure ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit.ts#L18-L50)).

**Inferred:** the generic user recovery is appropriate when retry is safe, but collapsing upstream absence and system failure into `404` weakens operational diagnosis unless error reporting preserves enough context. The handler's `logErrorMessage` only writes a console message outside tests ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/utils/curriculum/testing.ts#L1-L6)).

## Existing assurance

**Observed:** the capability has several useful test layers:

- Programme component tests cover tier/child-subject choices, accessible radio names, refinement analytics and URL formation ([tests](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeDownloads/ProgrammeDownloads.test.tsx#L128-L296)).
- Shared download-form tests assert resource errors and the polite, remounted screen-reader validation summary ([tests](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/DownloadPageWithAccordion/DownloadPageWithAccordion.test.tsx#L64-L177)).
- API tests cover stale-version redirect, `new` state, missing data and a `200` DOCX response ([tests](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/__tests__/pages/api/curriculum-downloads/index.test.ts#L204-L329)).
- DOCX helpers and most section builders have structural/snapshot tests. The central units builder still has only a placeholder test ([DOCX helper tests](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/docx/docx.test.ts#L153-L249), [units placeholder](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/docx/builder/8_units/8_units.test.ts#L1-L3)).
- XLSX tests generate packages for varied KS4 pathways, exam boards, tiers, child subjects, swimming, filtering and unit-option links ([tests](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/xlsx/index.e2e.test.ts#L11-L126), [link/filter tests](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/xlsx/index.e2e.test.ts#L331-L406)).

**Observed gaps in the pinned tree:** the API tests select only `curriculum-plans` and do not assert response headers, filename, response contents or dual-file ZIP behavior. The programme test mocks `downloadFileFromUrl`; there is no test beside that helper. No Playwright curriculum-export journey is present under the repository's E2E directory, and the repository testing guide says Playwright CI wiring remains follow-up work ([API test](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/__tests__/pages/api/curriculum-downloads/index.test.ts#L204-L329), [programme mock](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/%28core%29/teachers/programmes/%5Bslug%5D/%5Btab%5D/Components/ProgrammeDownloads/ProgrammeDownloads.test.tsx#L61-L73), [testing guide](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/docs/testing.md#L38-L71)).

**Observed structural mismatch to characterise:** XLSX sheet files and workbook entries use the filtered set of years, while workbook relationships are written from all unfiltered year options ([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/xlsx/index.ts#L34-L43), [relationships and workbook](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/curriculum/xlsx/index.ts#L96-L139)).

**Inferred risk:** some packages can contain relationships to sheets that were not generated. Whether Office ignores, repairs or rejects those unused relationships must be tested; source inspection alone does not establish user impact.

## Observed strengths and preservation questions

These mechanisms are visible in source. Their impact and necessity remain preservation hypotheses until teacher, product, accessibility, operational or impact evidence establishes them.

1. **Observed:** teachers receive editable, familiar office formats rather than a screen-only representation.
2. **Observed:** subject/phase, exam-board, tier and child-subject context is translated into a progressive teacher interaction and meaningful filenames.
3. **Observed:** the KS4 selector explains that refinement affects KS4 while preserving KS3, preventing a hidden data-scope change.
4. **Observed:** curriculum GraphQL boundaries authenticate, retry, reject missing data and runtime-validate successful data before generation.
5. **Observed:** a curriculum MV refresh changes the canonical request URL, allowing public shared caching without silently pinning an older curriculum version forever.
6. **Observed:** the public artifact request carries no teacher identity, school or email, so shared caches do not vary on personal data.
7. **Observed:** document builders include semantic headings, image descriptions/decorative flags, editable content and links back to live unit resources.
8. **Observed:** UI selection, validation and failure states include radio/fieldset semantics and live announcements.
9. **Observed:** DOCX and XLSX logic has detailed fixture and structural tests across educational variants, even though journey assurance remains incomplete.

## Seams and competing interpretations

### Capability ownership

**Observed seam:** one outcome spans an App Router route and route-local UI, shared lesson-download form state, Clerk, local storage, HubSpot, Avo analytics, a Pages API route, curriculum/CMS adapters, document-specific helpers, OOXML templates and low-level ZIP/XML utilities.

**Competing interpretations:**

- This is a teacher-download vertical slice and should be owned with lesson/unit resource delivery.
- This is a curriculum publishing/export capability whose consumer happens to be the teacher programme page.
- Document generation is a platform capability, while each format's content model belongs to curriculum.

**Invalidating work:** select a representative set of curriculum-export changes and incidents using an explicit sampling rationale, classify the intent and co-changed areas, then ask which boundary would have owned each change without coordination or duplication. H001 is weakened if most changes are document-engine primitives shared across unrelated capabilities, or if curriculum ownership still requires touching the same cross-cutting files after a vertical slice.

### Synchronous generation

**Observed seam:** data fetch, remote image fetch, XML assembly, compression, response buffering and browser buffering all sit on the request path.

**Competing interpretations:** shared caching makes synchronous generation the smallest reliable design; or an artifact job/store is needed for bounded latency, observability and replay.

**Invalidating work:** measure p50/p95/p99 generation duration, peak memory, output size, concurrent requests, cache-hit ratio and timeout/error rate by artifact combination. An async store hypothesis is weakened if cold generation meets explicit service objectives at realistic concurrency and failures are rare and recoverable. A synchronous hypothesis is weakened by timeouts, memory pressure or repeated identical generation after cache misses.

### Freshness authority

**Observed seam:** curriculum MV time versions the URL; CMS content, remote images, generator code and template revision do not.

**Competing interpretations:** curriculum data is the only freshness users care about; or the document is a composite artifact whose version must include every material input.

**Invalidating work:** define a content manifest for one fixture containing curriculum MV, CMS revision, asset references, generator commit and template version. Regenerate after changing each input and ask product/content owners whether a different document must be delivered immediately. H004's composite-version claim is weakened if only curriculum changes are material within the accepted 24-hour window.

### Form gate

**Observed seam:** normal UI requires school/terms, while the same public artifact URL needs neither.

**Competing interpretations:** intentional acknowledgement plus best-effort engagement capture; inherited friction; or policy bypass.

**Invalidating work:** obtain the explicit legal/product requirement and compare completion/support analytics for signed-out, onboarded and no-HubSpot-contact states. A direct public contract is invalid if audit evidence requires per-user acceptance. A mandatory UI form is invalid as an essential technical control if policy says the documents are unconditional public resources.

### Artifact assurance

**Observed seam:** tests validate builders and package XML, but do not prove browser delivery, correct HTTP metadata, application compatibility or artifact accessibility.

**Competing interpretations:** detailed structural tests plus manual release checks are sufficient; or the educational outcome requires an executable document-level journey contract.

**Invalidating work:** generate DOCX, XLSX and dual ZIP fixtures; assert HTTP headers and archive manifest; open artifacts in a headless office validator; run available Office accessibility checks plus a short manual screen-reader protocol; and test one real browser download. H005 is weakened if existing deployment/manual evidence already covers these checks reliably and escaped defects do not cluster at integration boundaries.

## Implications for the hypotheses

### [H001: Capability-owned modules](../../hypotheses/H001-capability-owned-modules.md)

**Effect:** supports testing H001, but the likely boundary is not yet known. The current file taxonomy obscures one traceable curriculum-export outcome, yet generator internals may deserve format-specific ownership rather than being pulled into a teacher feature folder.

**Prediction:** a `curriculum-export` use case should be able to name request selection, source manifest, generated artifact(s), cache/version identity and failure classes without importing React, Clerk, HubSpot or route types.

**Invalidator:** representative export changes still require comparable cross-area edits after introducing the boundary, or the proposed use case merely forwards the current combined data object and adds no ownership or test leverage.

**Most direct test:** characterise one DOCX fixture behind `prepareCurriculumExport` and compare dependency direction, touched files and explanatory clarity with the present route-to-builder call graph. Do not move the builders first.

### [H003: Unified runtime-shell contract](../../hypotheses/H003-unified-runtime-shell.md)

**Effect:** weak evidence. The teacher remains inside the App Router UI; the Pages Router boundary is an HTTP API, not a second rendered shell. Shell unification would not by itself correct versioning, headers or artifact quality.

**Prediction:** shell conformance should protect identity, consent, analytics and notification behavior around the form, but the export use case and artifact contract should remain independently testable.

**Invalidator:** a shell parity test passes while the identified export failures remain reproducible, showing that H003 has little leverage over this outcome. Conversely, if no-HubSpot loading or duplicate analytics is caused by provider differences, this journey becomes stronger H003 evidence.

**Most direct test:** run the same curriculum form states through the proposed shell contract and a direct use-case harness. Attribute each failure to shell, capability or provider before changing roots.

### [H004: Domain ports and explicit freshness](../../hypotheses/H004-domain-ports-and-freshness.md)

**Effect:** supports testing H004. Valuable validated curriculum adapters already exist, but the composite artifact's authorities, acceptable ages, fallback, version key and failure meanings are distributed across page cache, query timestamp, handler and CDN headers.

**Prediction:** an explicit export manifest and policy will expose CMS revision, curriculum MV, generator/template version, permitted staleness and fallback behavior, while retaining current adapters rather than wrapping them mechanically.

**Invalidator:** production evidence shows the current MV-only URL has met all content-freshness and recovery obligations, CMS/template drift within 24 hours is accepted, and a manifest adds no observable correctness or operability.

**Most direct test:** write the freshness/failure matrix for curriculum data, CMS text, remote images, generator/template and cached artifact, then exercise missing MV metadata and a CMS-only change against the current handler.

### [H005: Journey-level confidence](../../hypotheses/H005-journey-level-confidence.md)

**Effect:** supports a discriminating test of H005. The outcome crosses test boundaries that currently stop at mocked browser delivery or internal OOXML structure, but static coverage gaps do not establish unique defect signal.

**Prediction:** a small export contract suite will catch response metadata, redirect stability, artifact manifest, Office compatibility and accessibility regressions that component snapshots cannot.

**Invalidator:** recent defect history is concentrated entirely inside already well-tested pure builders, or existing post-deployment/manual checks provide reliable evidence for the full outcome and are recorded elsewhere.

**Most direct test:** establish the distinct evidence supplied by a fixture characterisation from HTTP request through DOCX/XLSX/ZIP inspection plus a browser download assertion, then compare it with the evidence from current tests before choosing the complete assurance design.

## Open questions

1. **Unknown:** what user outcome distinguishes document generated, response delivered, browser download invoked, file saved, file opened and content trusted?
2. **Unknown:** is school/terms collection legally required for each export, or is it an engagement workflow that must never block public curriculum access?
3. **Unknown:** what happens in production for an onboarded user whose HubSpot contact endpoint returns `204` or errors?
4. **Unknown:** which inputs must invalidate a cached artifact: curriculum MV, CMS revision, remote image, generator code, template, policy override or all of them?
5. **Unknown:** does the CDN honour `durable` and vary query parameters exactly as assumed, including redirects and parameter order?
6. **Unknown:** what request volume, cache-hit ratio, cold-generation latency, output size and peak memory exist for DOCX, XLSX and combined ZIP?
7. **Unknown:** can arbitrary public query combinations create material compute amplification, and is a rate or concurrency limit needed?
8. **Unknown:** do current DOCX and XLSX fixtures open without repair in every supported Office/viewer version?
9. **Unknown:** have final artifacts been audited with Word/Excel accessibility checkers and representative assistive technology, and who owns repeating that audit?
10. **Unknown:** are remote CMS and subject-icon images trusted, immutable and available enough to sit on the synchronous generation path?
11. **Unknown:** should missing CMS content fail closed, serve a last-known-good artifact, omit the section, or expose diagnostic placeholder text?
12. **Unknown:** do product analytics need to distinguish DOCX, XLSX and combined ZIP, and should success mean completed response or user-visible saved file?
13. **Unknown:** does the XLSX relationship mismatch cause repair dialogs or validator failures for partially covered year sets?
14. **Unknown:** which team currently owns the public endpoint contract, the curriculum content model, each document format and operational support when generation fails?
