# Editorial publish to public page: Oak's impact

## Scope and outcome

This trace follows the editorial content behind `/about-us/oaks-impact` from the
Sanity-facing content model to query generation, runtime validation, preview,
server rendering and deployment assurance.

All OWA evidence is pinned to commit
[`510ac63a62fb37a70183b00ce0f5fb15be4491e5`](https://github.com/oaknational/Oak-Web-Application/tree/510ac63a62fb37a70183b00ce0f5fb15be4491e5).
This is a static source trace. The Sanity Studio/schema repository, a CMS
dataset, feature-flag state, production responses, editor research and
deployment history were not inspected.

Evidence labels mean:

- **Observed:** directly evidenced in the pinned source.
- **Inferred:** an interpretation of observations that needs runtime, history
  or stakeholder evidence.
- **Unknown:** not established by this source pass.

### Editorial outcome, independent of mechanism

**Inferred contract:** an authorised editor should be able to prepare an Oak
impact page, inspect the draft in its real page context, publish it without a
code release, and have visitors receive an accessible, trustworthy rendering
whose visible content, media, metadata and analytics identity correspond to the
published revision.

That contract does not require Sanity, GraphQL, Zod, the Next.js Pages Router,
PostHog or Vercel. Those are current mechanisms.

**Observed current outcome:** the page renders the CMS-authored introductory
text and statistics only. Its title, hero image, case studies, quotes, support
CTA and SEO inputs are fixed, fixture-backed or placeholders despite a richer
CMS query and runtime model
([page composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/about-us/oaks-impact.tsx#L33-L70),
[CMS query](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/sanity-graphql/queries/oaksImpactPage.gql#L1-L50)).

**Observed release boundary:** the route returns `404` unless the request has a
PostHog distinct-ID cookie whose server-side `oaks-impact` flag resolves to
`true`. Requests without that cookie do not query the CMS
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/about-us/oaks-impact.tsx#L75-L105)).

**Inferred:** this is a safely gated, incomplete migration rather than a mature
example of every editorial contract. It remains useful because the gaps make
the current ownership boundaries visible. It must not be treated as the
template for all CMS pages.

## Journey at a glance

| Stage       | Editorial intent                                     | Current mechanism                                                                                        | Static result                                                                                     |
| ----------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1. Model    | Define the content an editor can maintain.           | A Sanity GraphQL type named `NewAboutCorePageOaksImpact`; the Studio schema is outside this repo.        | **Observed consumer shape; Unknown authoring behavior.**                                          |
| 2. Select   | Ask only for the fields needed by the page.          | Hand-written GraphQL operation and shared fragments.                                                     | **Observed:** header/video, statistics, case studies and school quotes are selected. SEO is not.  |
| 3. Generate | Keep transport calls statically typed.               | GraphQL Code Generator emits the SDK from the remote schema and local operations.                        | **Observed build-time type contract.**                                                            |
| 4. Adapt    | Hide transport details and reject malformed content. | `CMSClient.oaksImpactPage` uses the singleton adapter, resolves embedded references and parses with Zod. | **Observed runtime boundary.**                                                                    |
| 5. Preview  | Let an editor see draft content at the final URL.    | A secret-bearing App Router endpoint enables Next draft mode and redirects to the Pages route.           | **Observed mechanism; Unknown end-to-end editor experience.**                                     |
| 6. Gate     | Limit who can see the work-in-progress page.         | Server-side PostHog feature flag keyed by a browser cookie.                                              | **Observed:** non-cohort requests receive `404`.                                                  |
| 7. Render   | Shape content into an accessible Oak page.           | Pages `getServerSideProps`, shared layout and impact components.                                         | **Observed:** only intro and statistics currently use CMS values.                                 |
| 8. Publish  | Make an approved CMS revision visible.               | Production query excludes drafts; request-time rendering asks Sanity again.                              | **Inferred:** no OWA code deploy is intrinsically required, subject to CDN behavior and the gate. |
| 9. Assure   | Prove the page is correct in a deployed environment. | Jest/component snapshots plus deployment Pa11y and Percy infrastructure.                                 | **Observed:** the impact URL is absent from the deployment URL list.                              |

## Static trace

### 1. Editor and source model

**Observed:** the consumer query describes a singleton-like document with four
content groups:

1. a header with introductory text, Mux video asset and video description;
2. a statistics section with a text block, CTA, icons, headings and portable
   text;
3. case-study cards with images, portable text and CTAs; and
4. school-quote cards with logo, summary, quote and headshot.

The operation matches both published and draft IDs ending in
`newAboutCorePage.oaksImpact`, sorts by update time, and takes one result
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/sanity-graphql/queries/oaksImpactPage.gql#L1-L50)).

**Observed:** shared fragments preserve authoring semantics rather than merely
returning URLs. Images include `altText`, `isPresentational`, a dark-mode asset
and hotspot; video includes title, captions and Mux playback identity
([image fragment](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/sanity-graphql/queries/imageWithAltTextAndDarkMode.fragment.gql#L1-L18),
[video fragment](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/sanity-graphql/queries/video.fragment.gql#L1-L11)).

**Unknown:** OWA does not contain the Sanity Studio configuration or source
schema. This trace cannot establish field labels, help text, conditional
fields, editor roles, required-field rules, review workflow, scheduled
publishing, asset-library behavior, localization, revision recovery or whether
the queried model is pleasant and safe to author.

**Inferred seam:** the GraphQL schema reveals what the delivery application can
ask for, not the complete editorial model or governance contract. A new Oak
app cannot infer its authoring requirements from OWA alone.

### 2. Query and generated transport contract

**Observed:** local `.gql` operations and a remote, authenticated Sanity schema
feed GraphQL Code Generator, which emits TypeScript operation types and a
`graphql-request` SDK
([codegen configuration](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/sanity-graphql/codegen.yml#L1-L12),
[generated operation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/sanity-graphql/generated/sdk.ts#L7426-L7480),
[generated method](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/sanity-graphql/generated/sdk.ts#L7833-L7835)).

**Observed:** the GraphQL client selects Sanity's API or CDN endpoint from
environment configuration, authenticates with a bearer token, and reports
operation name and endpoint if a request fails
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/sanity-graphql/index.ts#L15-L40),
[error wrapper](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/sanity-graphql/index.ts#L85-L108)).

**Observed:** the query does not request `seo`, although the Zod page schema
accepts a nullish SEO object. The render path also supplies a fixed title rather
than `pageData.seo`
([query](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/sanity-graphql/queries/oaksImpactPage.gql#L1-L50),
[schema](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/common-lib/cms-types/aboutPages.ts#L190-L198),
[render](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/about-us/oaks-impact.tsx#L38-L52)).

**Inferred:** generated types prevent many query/consumer mismatches during
development, while the hand-written operation still acts as a second content
selection model. Code generation cannot show that every editorial field is
selected or used.

### 3. CMS adaptation and runtime validation

**Observed:** `CMSClient.oaksImpactPage` is registered as a singleton operation
with the impact Zod schema and plucks the newest result from the transport
response
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cms/sanity-client/index.ts#L233-L242)).

**Observed:** the shared singleton adapter:

1. sets a draft filter according to preview mode;
2. invokes the generated operation;
3. returns `null` when there is no document;
4. resolves embedded Sanity and HubSpot references; and
5. parses the result with the supplied runtime schema.

([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cms/sanity-client/cmsMethods.ts#L69-L99),
[reference resolution](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cms/sanity-client/cmsMethods.ts#L130-L145)).

**Observed:** the impact schema requires the header/video, statistics, case
studies and school quotes to be structurally valid even though most are not
rendered. Image fields preserve accessible-alt and presentational intent; video
requires playback identity and permits captions
([impact schema](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/common-lib/cms-types/aboutPages.ts#L151-L198),
[media schemas](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/common-lib/cms-types/base.ts#L30-L87)).

**Observed:** malformed singleton content throws at the validation boundary.
In preview, a Zod failure is wrapped as a `preview/zod-error`; list operations
have extra invalid-item and draft-deduplication behavior, but this singleton
does not use that list behavior
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cms/sanity-client/parseResults.ts#L84-L144)).

**Inferred candidate strength:** build-time generated transport types and runtime
domain validation are complementary. The first catches code drift; the second
protects runtime rendering from remote content that no longer satisfies the
application contract.

**Inferred trade-off:** because unused sections remain required, an invalid
quote or case study can prevent the page rendering even though the current UI
would not display it. That may deliberately prevent partially valid
publication, or may be coupling to an unfinished future shape.

### 4. Preview and draft selection

**Observed:** `GET /api/preview/[[...path]]` checks a configured secret, enables
Next draft mode and redirects to the path embedded after `/api/preview/`.
`?disable=true` disables draft mode without requiring the secret
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/preview/%5B%5B...path%5D%5D/route.ts#L11-L44)).

**Observed:** the impact Pages route maps `context.preview === true` to
`CMSClient.oaksImpactPage({ previewMode: true })`. Normal mode sends
`{ is_draft: false }`; preview omits the boolean value so the query can see
both draft and published documents, then its update-time ordering and limit
select the newest
([page loader](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/about-us/oaks-impact.tsx#L96-L121),
[draft filter](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cms/sanity-client/cmsMethods.ts#L147-L158),
[query ordering](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/sanity-graphql/queries/oaksImpactPage.gql#L1-L9)).

**Observed:** the Pages layout checks router preview state, labels the page
"Preview mode enabled", and links back through the same API path to exit
([layout](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/AppComponents/AppLayout/AppLayout.tsx#L39-L76),
[controls](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/AppComponents/LayoutPreviewControls/LayoutPreviewControls.tsx#L12-L35)).

**Observed seam:** an App Router route establishes draft state for a Pages
Router page. The page-level PostHog gate runs before draft content is fetched,
so an editor also needs a request identity in the enabled flag cohort.

**Unknown:** no discovered test proves that the App Router draft cookie becomes
`context.preview` and `router.isPreview` on this Pages route, that Sanity's CDN
configuration returns drafts correctly, or that a Sanity editor receives the
required feature-flag cookie. The preview endpoint and page loader are tested
separately.

### 5. Freshness, publication and failure

**Observed:** Oak's impact uses `getServerSideProps` and calls `getPageProps`
with `withIsr: false`; it therefore does not receive the shared
`sanityRevalidateSeconds` ISR policy
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/about-us/oaks-impact.tsx#L75-L123),
[shared wrapper](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/getPageProps.ts#L29-L62)).

**Inferred freshness contract:** an enabled request asks the CMS for content at
request time. A publish should not require an OWA build, but visibility latency
still depends on the configured Sanity API/CDN and any platform response cache.
No per-page maximum age, stale fallback or publication acknowledgement is
named at the page or CMS interface.

**Observed:** missing CMS content becomes `404`. Query or validation errors are
reported by the page wrapper and rethrown for Next to handle
([page](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/about-us/oaks-impact.tsx#L104-L121),
[error policy](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/getPageProps.ts#L63-L81)).

**Unknown:** the required publish-to-visible latency, acceptable stale period,
rollback process, editorial incident response, behavior during Sanity outage,
and whether returning `404` for invalid remote content is preferable to the
last valid revision are not encoded here.

### 6. Page shaping, media and accessibility

**Observed:** the render path uses the CMS intro and complete statistics
section. `OaksImpactStats` renders an `h2`, portable text, optional CTA and each
stat with a CMS image and text
([page](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/about-us/oaks-impact.tsx#L45-L54),
[statistics](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GenericPagesComponents/OaksImpactStats/index.tsx#L20-L112)).

**Observed:** `CMSImage` derives responsive Sanity image URLs, dimensions and
crop behavior. It uses CMS alt text unless explicitly overridden and emits
empty alt plus `aria-hidden` for presentational images
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/CMSImage/CMSImage.tsx#L81-L205)).

**Observed:** the shared header renders a semantic `h1`, supports portable
introductory text and hides its illustration panel below 921px. The impact page
passes a fixed Sanity CDN image with empty alt, rather than the queried CMS
video and description
([header](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GenericPagesComponents/AboutSharedHeader/index.tsx#L68-L145),
[page use](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/about-us/oaks-impact.tsx#L33-L52)).

**Observed:** case studies render as a semantic `ul` of card `li` elements,
but the page supplies three placeholder fixtures instead of `pageData.caseStudies`.
The quote UI has accessible-image and list support with focused tests, but the
page displays a bordered `TODO: Quotes` box instead of it
([case-study component](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GenericPagesComponents/OaksImpactCaseStudies/index.tsx#L19-L58),
[fixtures](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GenericPagesComponents/OaksImpactCaseStudies/OaksImpactCaseStudies.fixtures.ts#L1-L23),
[placeholder](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/about-us/oaks-impact.tsx#L53-L62)).

**Inferred:** accessibility intent exists in the content model, design system
and component implementations, but content accessibility is not currently an
end-to-end invariant: authored media can be valid yet never rendered, and
placeholder content can bypass the authored semantics.

### 7. SEO, discovery and analytics

**Observed:** the page fixes the SEO title to `Oak's impact`; description falls
back to the application default and canonical URL is derived from the router.
The CMS SEO field is neither queried nor consumed
([page](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/about-us/oaks-impact.tsx#L38-L43),
[SEO shaping](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/seo/getSeoProps.tsx#L7-L25),
[SEO render](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/seo/Seo.tsx#L33-L71)).

**Observed:** the impact route is explicitly excluded from the generated
sitemap
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/next-sitemap.config.js#L62-L80)).

**Observed:** the common analytics provider still sends HubSpot and Avo/PostHog
page views, but page naming comes from the central `OAK_PAGES` registry. That
registry contains adjacent About routes but not Oak's impact, so this path
falls back to a null page name
([page-view lookup](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/analytics/getPageViewProps.ts#L10-L58),
[About registry](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/common-lib/urls/urls.ts#L549-L581),
[emission](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/Analytics/AnalyticsProvider.tsx#L188-L210)).

**Inferred:** URL existence, sitemap inclusion, metadata ownership, analytics
identity and release exposure are separate registrations. For a new editorial
capability, they should be one explicit publication contract or checked for
parity, not remembered as independent finishing tasks.

### 8. Tests and deployment behavior

**Observed:** the page test covers enabled rendering, disabled-flag `404` and
missing-CMS `404`. It checks for an `h1` and a snapshot but does not assert that
queried media, case studies, quotes or SEO are rendered, nor that preview mode
reaches the CMS client
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/__tests__/pages/about-us/oaks-impact.test.tsx#L31-L123)).

**Observed:** focused component tests check the statistics heading, case-study
link count and quote image alt text/list rendering
([statistics test](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GenericPagesComponents/OaksImpactStats/OaksImpactStats.test.tsx#L9-L18),
[case-study test](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GenericPagesComponents/OaksImpactCaseStudies/OaksImpactCaseStudies.test.tsx#L9-L20),
[quote test](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GenericPagesComponents/OaksImpactSchoolQuote/OaksImpactSchoolQuote.test.tsx#L9-L30)).

**Observed:** generic CMS tests verify production/draft filters, reference
resolution and runtime parse failures; preview-route tests verify enable,
disable, redirect and invalid-secret behavior
([CMS tests](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cms/sanity-client/cmsMethods.test.ts#L51-L97),
[validation tests](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/cms/sanity-client/parseResults.test.ts#L46-L89),
[preview tests](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/preview/%5B%5B...path%5D%5D/route.test.ts#L24-L84)).

**Observed:** successful deployments trigger Pa11y and Percy jobs against a
shared URL list. Oak's impact is not in that list, so the configured deployed
accessibility and visual checks do not directly exercise this page
([workflow](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/workflows/post_deployment_actions.yml#L67-L176),
[URL list](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/common-lib/urls/getDeploymentTestUrls.js#L1-L33)).

**Observed:** repository documentation says release commits deploy through
Vercel and trigger deployment checks, but an earlier line still says preview
and production builds are on Netlify. Static source therefore does not prove
the current hosting topology
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/README.md#L133-L151)).

**Inferred:** code changes to the query, schema or renderer require the normal
release/deploy path. An ordinary CMS publish should use the already deployed
SSR path and need no code deployment. Feature-flag changes form a third,
independent release mechanism.

## Observed strengths and preservation questions

These mechanisms are visible in source. Their impact and necessity remain
preservation hypotheses until editor, product, user, operational or impact
evidence establishes them.

- **Observed:** editor-originated content crosses a named CMS boundary rather
  than reaching React as unchecked transport data.
- **Observed:** shared fragments retain portable text, media, link and
  accessibility semantics across pages.
- **Observed:** generated query types and Zod runtime schemas protect different
  failure modes.
- **Observed:** published requests explicitly exclude drafts, while preview has
  an obvious on-page state and exit control.
- **Observed:** the page fails closed when its content is absent or invalid and
  reports unexpected failures.
- **Observed:** unfinished public content is isolated behind a server-evaluated
  release gate and excluded from the sitemap.
- **Observed:** semantic headings, lists and CMS image-alt behavior are encoded
  in reusable components and focused tests.

## Seams and competing interpretations

| Evidence                                  | Interpretation A                                            | Interpretation B                                                                                    | Discriminating evidence                                                                                            |
| ----------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Rich CMS model, partial rendering         | A deliberate incremental migration protected by a flag.     | The CMS and UI contracts can drift without a completeness check.                                    | Intended rollout plan, PR history and a field-to-render acceptance contract.                                       |
| `CMSClient` plus page-specific Zod schema | A strong existing editorial domain port.                    | A transport adapter whose interface still exposes page/source shape rather than editorial outcomes. | Substitute a fixture provider and compare whether page/use-case code changes.                                      |
| Request-time SSR with optional Sanity CDN | Correct freshness for a gated editorial page.               | Unnamed freshness and failure policy with unnecessary request-time work.                            | Publish-latency measurements, traffic and resource-use data, and outage expectations.                              |
| App preview endpoint to Pages route       | A pragmatic cross-router contract already supplied by Next. | A migration-sensitive shell seam with untested cookie and UI parity.                                | One browser test from preview URL through draft render and exit.                                                   |
| Feature flag requires a PostHog cookie    | Appropriate controlled exposure.                            | Editorial preview and public delivery are accidentally coupled to analytics identity.               | Editor walkthroughs and explicit flag-bypass/release requirements.                                                 |
| No impact URL in Pa11y/Percy              | Intentional while the route is gated.                       | The riskiest integration state has no deployed outcome check.                                       | A deployment test authenticated into the flag cohort, including its reliability, ownership and diagnostic quality. |
| CMS SEO allowed but not queried           | SEO is intentionally fixed while hidden from discovery.     | Publication completeness depends on manual parallel wiring.                                         | Product SEO requirement and a CMS-field usage test.                                                                |

## Hypothesis effects and invalidators

### H001: Capability-owned modules

**Effect:** this trace supports owning an editorial-publication capability that
joins content contract, preview, release state, render completeness, metadata
and assurance. Today those responsibilities span page, generic components,
CMS client, query files, schemas, URL registry and deployment configuration.

**Counterevidence:** the existing generic CMS adapter, media components, SEO
shell and deployment checks are valuable shared services. A self-contained
package per editorial page would duplicate them and confuse capability
ownership with filesystem colocation.

**Invalidator:** weaken H001 if recent editorial changes are consistently
local, the current cross-folder trace is easy for unfamiliar engineers, and a
capability slice either duplicates shared policy or introduces cycles without
improving field-to-outcome completeness.

### H003: Unified runtime-shell contract

**Effect:** editorial preview crosses App and Pages roots and depends on draft
state, feature flags, analytics, SEO, error reporting and preview controls. It
supports an explicit `editorial-preview` shell profile, not necessarily one
provider tree.

**Invalidator:** weaken H003 if Next's cross-router draft behavior is already
fully guaranteed and tested, editorial pages intentionally require different
analytics/metadata/error contracts, and a shared profile adds more coupling
than the observed migration seam causes.

### H004: Domain ports and explicit freshness

**Effect:** `CMSClient.oaksImpactPage` is strong counterevidence to any claim
that OWA lacks provider ports: it owns draft selection, reference resolution,
null behavior and runtime validation. H004 remains relevant because the port
does not state publish latency, maximum staleness, degraded behavior or
last-known-good policy.

**Invalidator:** narrow H004 if editorial stakeholders require only
latest-available content per request, current Sanity/platform configuration
meets a measured latency and availability target, and adding freshness types
would be pass-through ceremony with no different behavior to select.

### H005: Journey-level confidence

**Effect:** lower-level tests cover most mechanisms in isolation, yet they do
not prove the editorial outcome `draft edit -> preview -> publish -> visible,
complete, accessible public page`. The current gap between queried and rendered
fields makes a journey or contract matrix an appropriate discriminating test;
it does not establish that a browser journey has unique or decisive signal.

**Invalidator:** weaken H005 if a deterministic query-to-render integration
test catches the meaningful failures with clearer diagnosis than a browser
journey, and real editor-to-Sanity automation cannot be made deterministic,
representative or diagnostically useful.

## Most decisive next work

1. Obtain the Sanity Studio/schema source and record the actual editor workflow,
   roles, validation, preview URL construction, approval and rollback behavior.
2. Turn the impact model into a field matrix: authored, queried, generated,
   runtime-validated, rendered, accessible, indexed, measured and tested.
3. Add a fixture-backed integration test that passes a complete valid impact
   document through `CMSClient` shaping and the page, then asserts every
   intended section and metadata field. This supplies more direct evidence than
   external CMS E2E.
4. Run one controlled draft/publish experiment with the editor: measure draft
   preview visibility, published visibility and rollback with CDN on/off and
   with/without the feature-flag identity.
5. Add one browser contract for entering preview, seeing a unique draft marker,
   exiting preview and seeing the published revision. Keep Sanity behind a
   deterministic provider unless a real-dataset test proves materially better.
6. Decide whether the hidden page should be in deployed Pa11y/Percy checks via
   a stable flag bypass. Do not add it until the test can obtain the intended
   cohort without relying on a person's cookie.
7. Sample incidents and recent editorial changes before choosing a new module
   boundary; distinguish an actively staged implementation from enduring
   architecture.

## Provisional conclusion

**Inferred:** the durable Oak requirement is not "render Sanity documents". It
is controlled editorial publication: an authoring contract, trustworthy
preview, explicit release and freshness behavior, runtime-safe content,
accessible rendering, discoverability and outcome-level assurance.

The current stack contains several excellent ingredients, especially the
generated query SDK, runtime CMS boundary, draft filtering and accessible media
semantics. Oak's impact also shows why those ingredients need a completeness
contract: content can be authorable, queryable and valid without being the
content a visitor actually receives.
