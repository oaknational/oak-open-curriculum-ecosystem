# Accessibility and assurance

## Question

What evidence currently supports the claim that OWA and Oak Components are
correct, accessible and operable, and where does that evidence stop?

This is a static map at the revisions pinned in the
[research charter](../research-charter.md). It distinguishes a command that can
be run, a command executed by CI, and a check known to block integration. The
repositories establish the first two. **Unknown:** branch-protection rules,
external service policy and whether every reported status is required for merge
are not stored here.

## Working contract

**Inferred:** the current assurance model is a stack of different evidence, not
one test suite:

1. source checks reject formatting, lint and type errors;
2. Jest checks local behavior, rendered structure and snapshots;
3. Storybook exposes components for human and Axe-assisted inspection;
4. Pa11y and Percy inspect selected deployed pages;
5. Playwright can exercise a complete teacher download outcome;
6. runtime reporting supplies evidence after release; and
7. human review covers subjective experience and environments automation cannot
   establish.

Each layer answers a different question. Passing one is not evidence that the
others passed.

## Automated gate map

| Layer                          | OWA                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Oak Components                                                                                                                                                                                                                                                                                                                                                                                                                                                       | What the evidence covers and does not cover                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Format, lint and types         | **Observed, CI-executed:** the `Code checks` workflow runs Prettier, the configured lint command and TypeScript on pushes to `main`, selected pull-request events and merge groups ([workflow](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/workflows/code_checks.yml#L6-L46)).                                                                                                                                                                                                                                                                                                                                                       | **Observed, CI-executed:** `Verify` runs format, lint and type checks on pushes to `main` and selected pull-request events ([workflow](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/verify.yml#L1-L34)).                                                                                                                                                                                            | Static consistency and type contracts. **Observed:** neither repository configures a generic JSX accessibility lint plugin; accessibility is therefore not a named lint gate ([OWA config](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/eslint.config.js#L31-L70), [Components config](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.eslintrc.cjs#L19-L27)). |
| Styles                         | **Observed, configured only:** Stylelint commands exist, but the CI workflow invokes `lint`, not `lint:styles` ([scripts](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/package.json#L36-L39)).                                                                                                                                                                                                                                                                                                                                                                                                                                                | **Observed:** no separate style-lint command is declared.                                                                                                                                                                                                                                                                                                                                                                                                            | CSS syntax or design-token conformance is not a separately visible CI contract. Styled output can still be exercised by Jest, build and Percy.                                                                                                                                                                                                                                                                                                                  |
| Build and packaging            | **Observed, configured:** an application build command exists, but `Code checks` does not run it ([scripts](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/package.json#L10-L14), [workflow](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/workflows/code_checks.yml#L39-L78)). **Unknown:** deployment infrastructure may supply a separate build gate.                                                                                                                                                                                                                             | **Observed, CI-executed and release-coupled:** `Verify` builds before testing, and release runs only after a successful `Verify` on `main` ([verify](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/verify.yml#L29-L39), [release](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/release.yml#L1-L14)).                                | Components has a repository-visible published-artifact gate. Equivalent end-to-end deployment policy for OWA is outside this snapshot.                                                                                                                                                                                                                                                                                                                          |
| Unit and component behavior    | **Observed, CI-executed:** Jest runs with coverage before the Sonar scan; the workflow explicitly calls these unit tests, not integration tests ([workflow](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/workflows/code_checks.yml#L48-L81)). Tests include explicit keyboard focus and navigation behavior, not only snapshots ([example](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/AppComponents/TopNav/TopNav.test.tsx#L254-L280)).                                                                                                                          | **Observed, CI-executed:** Jest is part of `Verify`; component tests include keyboard navigation and dismissal behavior ([workflow](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.github/workflows/verify.yml#L29-L39), [example](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/buttons/OakButtonWithDropdown/OakButtonWithDropdown.test.tsx#L88-L130)). | Local behavior, DOM semantics and controlled interactions. JSDOM does not establish browser, assistive-technology, server/client integration or whole-journey behavior.                                                                                                                                                                                                                                                                                         |
| Coverage and static analysis   | **Observed, CI-executed:** Jest produces LCOV and CI submits it to SonarCloud ([Jest config](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/jest.base.config.js#L2-L21), [Sonar config](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/sonar-project.properties#L18-L31)).                                                                                                                                                                                                                                                                                                                    | **Observed, CI-executed:** Jest coverage is submitted to SonarCloud ([Jest config](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/jest.config.js#L7-L17), [Sonar config](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/sonar-project.properties#L18-L29)).                                                                                                                | **Unknown:** neither repository defines a Jest coverage threshold, and the external Sonar quality-gate policy is not visible. A scan running is not evidence that a particular coverage or quality threshold blocks merge.                                                                                                                                                                                                                                      |
| Storybook component inspection | **Observed, configured:** stories and the Storybook accessibility addon are configured ([config](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.storybook/main.ts#L17-L27)). A Storybook Jest command exists, but its config permits no matching tests and there is no matching runner file in this revision ([config](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/jest.storybook.config.js#L9-L20)).                                                                                                                                                                                     | **Observed, configured:** stories and the accessibility addon are configured ([config](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/.storybook/main.ts#L10-L17)).                                                                                                                                                                                                                                                     | Interactive Axe feedback and isolated human inspection. **Observed:** neither CI workflow builds Storybook or invokes an automated Storybook test runner. This is a capability, not a CI gate.                                                                                                                                                                                                                                                                  |
| Deployed accessibility         | **Observed, CI-executed after deployment:** successful non-Storybook deployment events run Pa11y and publish a custom commit status ([workflow](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/workflows/post_deployment_actions.yml#L67-L115)). Pa11y uses Axe against a curated URL set ([config](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/pa11yci.config.js#L19-L62)).                                                                                                                                                                                                       | **Observed:** no Pa11y, browser Axe or equivalent CI command is configured.                                                                                                                                                                                                                                                                                                                                                                                          | Rendered DOM for selected public, teacher, pupil and sign-in pages. It does not cover authenticated state, interactions, all variants or assistive-technology experience.                                                                                                                                                                                                                                                                                       |
| Deployed visual regression     | **Observed, CI-executed after deployment:** the same deployment workflow runs Percy and publishes a custom status ([workflow](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/workflows/post_deployment_actions.yml#L117-L177)). Snapshots use 375px and 1280px widths ([config](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/percy.config.js#L21-L34)).                                                                                                                                                                                                                             | **Observed:** no visual-regression workflow is configured.                                                                                                                                                                                                                                                                                                                                                                                                           | Visual appearance of selected initial route states. It does not prove interaction, semantics, focus order, content correctness or unlisted responsive states.                                                                                                                                                                                                                                                                                                   |
| Browser journeys               | **Observed, configured but not CI-executed:** Playwright has Chromium, trace and failure-screenshot configuration ([config](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/playwright.config.ts#L11-L49)). The suite contains two tests for one teacher lesson-download flow ([spec](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/tests/e2e/teacher/lesson-page.spec.ts#L1-L40)); the testing guide explicitly records CI wiring as follow-up work ([guide](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/docs/testing.md#L63-L71)). | **Observed:** no browser-journey runner or configuration is present.                                                                                                                                                                                                                                                                                                                                                                                                 | One real cross-route, form and download outcome when someone runs it. Pupil completion, saved content, registration and Classroom are not covered by this suite.                                                                                                                                                                                                                                                                                                |

**Unknown:** GitHub branch protection, Percy approval rules, Sonar quality gates
and Vercel project settings decide which of these successful workflow executions
are required before merge or promotion. They must be inspected separately before
calling any row a release gate.

## Accessibility contract in detail

### Component level

**Observed:** both Storybooks install the accessibility addon. This makes Axe
findings available while developing and reviewing isolated component states in
both repositories. It is valuable feedback, but there is no repository-visible
automated execution of those findings.

**Observed:** accessibility behavior is also encoded directly in focused tests.
For example, OWA tests that pupil copy feedback uses appropriately polite and
assertive live regions
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/Views/PupilLessonReview/PupilLessonReviewShareOptions/PupilLessonReviewShareOptions.test.tsx#L52-L88)),
and Components tests that visually hidden content remains present to assistive
technology
([source](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/messaging-and-feedback/OakScreenReader/OakScreenReader.test.tsx#L20-L32)).
This preserves semantic intent more precisely than a snapshot alone.

### Development runtime

**Observed:** OWA can enable `@axe-core/react` with a browser configuration
flag. It runs only outside production, observes mutations and explicitly enables
the skip-link rule
([implementation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/axe/startAxe.ts#L8-L29),
[configuration](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/getBrowserConfig.ts#L279-L288)).
The shared `AppHooks` mounts this diagnostic alongside error reporting
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/AppComponents/App/AppHooks.tsx#L31-L58)).

**Inferred:** this is a useful developer feedback loop across both router roots,
but it is opt-in console output. It does not fail a build or create a durable
record.

### Deployed pages

**Observed:** Pa11y and Percy deliberately share one route inventory. It includes
public, editorial, search, programme, unit, lesson, sign-in and pupil surfaces
([inventory](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/common-lib/urls/getDeploymentTestUrls.js#L5-L84)).
That reuse keeps semantic and visual inspection focused on the same representative
surface.

**Observed:** the inventory also records known exclusions, and Pa11y globally
hides third-party or dynamic elements and ignores colour-contrast, video-caption
and list rules
([inventory exclusions](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/common-lib/urls/getDeploymentTestUrls.js#L78-L83),
[rule exclusions](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/pa11yci.config.js#L25-L48)).
These comments preserve the reasons for suppression, which is preferable to
silent filtering. The trade-off is a known blind spot: failures in those rules
or excluded journeys cannot be detected by this gate.

**Inferred:** route-list health is not the same as journey accessibility. Pa11y
does not submit quizzes, operate menus, exercise consent states or authenticate
into saved content and Classroom. Percy snapshots only the initial state at two
widths.

## Runtime diagnostics

Runtime diagnostics are observation, not pre-release assurance.

**Observed:** the shared OWA application hooks select Sentry or Bugsnag according
to configuration and gate browser initialization on service consent; Gleap is
also consent-gated and intentionally omitted from pupil and standalone video
routes
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/AppComponents/App/AppHooks.tsx#L31-L56)).
The common error reporter logs locally, attaches context, severity, grouping and
metadata, and sends to the selected service
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/common-lib/error-reporter/errorReporter.ts#L69-L149)).

**Inferred:** contextual error reporting is evidence of operational maturity and
is worth preserving as an application contract. Consent, filtering and route
exclusions mean absence of reports is not evidence of absence of failures.
Neither repository records an accessibility-specific production monitor or an
assurance objective such as error budget, acceptable violation count or journey
success rate.

## Manual evidence

**Observed:** OWA's testing guide explicitly says human evaluation of subjective
experience and exploratory testing are vital, while acknowledging that manual
testing sits outside the repository's automated lifecycle
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/docs/testing.md#L1-L9)).
The pull-request template asks authors to record how to test, before-and-after
screenshots, cross-browser/device testing, accessibility consideration, design
sign-off and product approval
([source](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/pull_request_template.md#L11-L32)).

**Unknown:** the repositories do not define a repeatable screen-reader matrix,
keyboard-only script, zoom/reflow protocol, cognitive-accessibility review,
supported browser/device matrix for manual sign-off, evidence-retention format,
or ownership and cadence for audits. Oak Components contains no equivalent
manual accessibility contract in this snapshot.

## Coverage by outcome

| Outcome                                                                   | Strongest current evidence                                                                        | Important boundary not established                                                                    |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| A component renders and responds in isolation                             | **Observed:** Jest behavior tests, snapshots, stories and interactive Storybook Axe.              | Real browser and assistive-technology behavior; automated Storybook conformance.                      |
| A published Components artifact compiles                                  | **Observed:** build and Jest execute in `Verify`, and release requires successful `Verify`.       | Compatibility inside every consuming framework/runtime; accessible application composition.           |
| A selected deployed route has no unsuppressed deterministic Axe violation | **Observed:** deployment-triggered Pa11y.                                                         | Suppressed rules, excluded routes, authenticated/dynamic states and human experience.                 |
| A selected route matches an approved visual baseline                      | **Observed:** Percy at mobile and desktop widths.                                                 | Semantics, interactive states, intermediate widths and whether approval is required.                  |
| A teacher can download lesson resources                                   | **Observed:** one Playwright flow proves navigation, form completion and a ZIP download when run. | CI enforcement, identity variants, blocked resources, analytics, accessibility and failure recovery.  |
| A pupil completes and reviews a lesson                                    | **Observed:** extensive local tests and selected route-level Pa11y/Percy.                         | One browser journey from entry through persisted results.                                             |
| Saved content or Classroom works across identity and service boundaries   | **Observed:** local tests exist around constituent modules.                                       | A repository-visible end-to-end outcome test or production SLO.                                       |
| Runtime failures are diagnosable                                          | **Observed:** consent-aware contextual Sentry/Bugsnag reporting and user feedback tooling.        | Coverage under denied consent, accessibility-specific monitoring and documented operational response. |

## Observed strengths and preservation questions

These mechanisms are visible in source. Their impact and necessity remain preservation hypotheses until product, user, operational or impact evidence establishes them.

- **Observed:** accessibility is considered at several moments: component
  behavior, Storybook inspection, opt-in development diagnostics, deployed-page
  scanning and pull-request review.
- **Observed:** Pa11y and Percy run against deployments rather than synthetic
  component markup, and custom statuses retain results when multiple themed
  deployments exist.
- **Observed:** the shared route inventory spans teacher and pupil surfaces and
  documents known exclusions rather than implying complete coverage.
- **Observed:** focused tests encode keyboard focus, navigation and live-region
  behavior as explicit contracts.
- **Observed:** Oak Components couples publication to format, lint, type, build,
  test and scan success.
- **Observed:** OWA's documentation values human exploratory judgment instead of
  treating automated checks as a complete accessibility claim.

## Gaps and risks

1. **Observed:** OWA's only browser journey covers one teacher download outcome
   and is not wired into CI.
2. **Observed:** Storybook accessibility addons in both repositories are not
   automatically executed by their CI workflows.
3. **Observed:** Oak Components has no browser-level accessibility or visual
   regression gate, so application integration is the first automated rendered
   accessibility check for shared components.
4. **Observed:** global Pa11y rule suppressions remove contrast, caption and list
   evidence across every scanned page; some known failing pupil routes are absent.
5. **Observed:** authenticated, consent-dependent and interaction states are
   largely outside deployed Pa11y/Percy coverage.
6. **Unknown:** merge protection and external service approval policies are not
   visible, so workflow presence must not be described as a required merge gate
   without settings evidence.
7. **Unknown:** no durable manual assistive-technology protocol or audit record is
   documented in these repositories.
8. **Inferred:** assurance is split at the package/application boundary without a
   named hand-off contract: Components proves isolated behavior and package
   integrity; OWA absorbs rendered, journey and production risk.

## Hypothesis effects and invalidators

### [H002: Layered UI platform](../hypotheses/H002-layered-ui-platform.md)

**Effect:** evidence supports separating the assurance obligations of foundations,
accessible controls, framework adapters and product recipes. Components can prove
isolated semantics and packaging; only a consuming app can prove provider,
routing, content and journey composition.

**Invalidators or material weakening evidence:** narrow H002 if an automated
Storybook/browser suite demonstrates that one package-level harness can reliably
prove all exported UI across Pages, App Router server/client and supported themes;
or if export classification shows that most controls cannot be exercised without
OWA product context. Reject an assurance-driven split if it duplicates tests
without finding distinct failures or improving diagnostics.

### [H003: Unified runtime-shell contract](../hypotheses/H003-unified-runtime-shell.md)

**Effect:** `AppHooks` already centralizes runtime Axe, error reporting and
feedback across roots. The assurance contract is not yet unified: shell parity is
not tested, Pa11y exercises only selected anonymous route states, and runtime
telemetry varies with consent and route profile.

**Invalidators or material weakening evidence:** narrow H003 if rendered parity
tests show the router profiles intentionally require different accessibility,
consent and error-reporting outcomes with no shared assertions; or if a shared
contract adds client code and hydration work while route-local tests prove the
same outcomes more reliably. Strengthen it if one contract suite detects
behavior drift between equivalent Pages and App routes.

### [H005: Journey-level confidence](../hypotheses/H005-journey-level-confidence.md)

**Effect:** the current evidence directly supports testing, but not yet adopting,
H005. Broad local and deployed-page checks coexist with a narrow, non-CI
Playwright suite. The unproven value is whether a few journeys detect failures the
other layers miss at acceptable speed and stability.

**Invalidators or material weakening evidence:** reject or narrow H005 if recent
cross-boundary regressions were already caught earlier by Pa11y, Percy or focused
tests; if controlled identity/service substitutes make journeys unrepresentative;
or if the teacher download test remains flaky and low-diagnostic after its
environment is controlled. Strengthen it if one deterministic pupil or saved-
content journey catches a real routing, provider, persistence or service-contract
failure invisible to existing checks.

## Most decisive next work

1. Inspect branch protection plus Percy, Sonar and deployment settings, then mark
   every row as advisory, required for merge, required for deployment or
   observational.
2. Run Storybook Axe in CI for a small risk-selected set of Components controls
   and OWA recipes. Record runtime, false positives and failures not already caught
   by Jest.
3. Turn each Pa11y suppression and excluded URL into an owned exception record
   with scope, reason, expiry and replacement evidence; test whether contrast can
   be re-enabled for first-party content.
4. Add one deterministic Playwright journey for pupil completion or saved content,
   run it alongside the existing teacher flow for several changes, and measure
   runtime, flake, diagnostic value and unique defects.
5. Execute a short manual protocol against the same journey: keyboard-only,
   200% zoom/reflow, reduced motion and two representative screen-reader/browser
   pairs. Retain findings next to the automated run.
6. Render one equivalent Pages/App route pair under consent granted, denied and
   undecided states; assert landmarks, focus entry, live regions, runtime hooks,
   error fallback and diagnostic behavior. This jointly discriminates H003 and
   H005.
