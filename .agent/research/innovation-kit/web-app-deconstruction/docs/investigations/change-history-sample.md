# Change-history sample

## Question

Do recent changes follow user outcomes or existing technical layers, and what does that imply for capability boundaries and assurance?

## Method

The sample is the 20 most recent first-parent pull-request merges reachable from pinned OWA commit `510ac63a62fb37a70183b00ce0f5fb15be4491e5`. Release commits, branch-sync merges and unmerged refs are excluded. The window is 2026-07-13 to 2026-07-17, so this is a delivery pulse rather than a representative history of OWA.

Each row was classified by its dominant PR subject and first-parent diff. `Test co-change` means the diff contains a test, spec or snapshot file, or is itself test infrastructure. It does not mean those assertions were sufficient.

## Auditable sample

| PR                                                                                                          | Dominant intent                 | First-parent change shape                                                                           | Test co-change |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------- | -------------- |
| [#4344](https://github.com/oaknational/Oak-Web-Application/commit/ad35f1502c62bce3d8d37ea30e0b7dd017053cc3) | Impact statistics feature       | Page plus new local component, fixture, story and tests                                             | Yes            |
| [#4359](https://github.com/oaknational/Oak-Web-Application/commit/88cd922d6d27a429dc4954341c12ae32dc27eaa7) | Remove EYFS-specific routing    | URL, curriculum slug helpers, lesson helper, search UI, My Library and tests                        | Yes            |
| [#4354](https://github.com/oaknational/Oak-Web-Application/commit/a8eda62b0f69557e2ed9b2f658c66df7d512a0aa) | Impact school quote             | New local component, fixture, story and tests                                                       | Yes            |
| [#4367](https://github.com/oaknational/Oak-Web-Application/commit/de40e1647f4cd320109373a06388ea7097872eaf) | Semantic list rendering         | Oak Components upgrade, several editorial views and broad snapshot changes                          | Yes            |
| [#4364](https://github.com/oaknational/Oak-Web-Application/commit/31424aaff58fb365e923ad43f148c9b678609c3a) | Pupil guidance-modal fix        | Pupil experience hook, route/view, modal and tests                                                  | Yes            |
| [#4358](https://github.com/oaknational/Oak-Web-Application/commit/cc54e7239c00cc4d4c74f04dcaec6048c039c58b) | Consolidate filtering           | Programme route/views and shared curriculum filtering; 18 files, net deletion                       | Yes            |
| [#4355](https://github.com/oaknational/Oak-Web-Application/commit/230a784849fdd2337bdf160b60c31ef66e794088) | Quote-border fix                | Oak Components upgrade and local testimonial adjustment                                             | Yes            |
| [#4341](https://github.com/oaknational/Oak-Web-Application/commit/6943cefec7183d6f81b6b1838db5b2f9ee60e6e0) | Storybook configuration         | Two configuration files                                                                             | No             |
| [#4361](https://github.com/oaknational/Oak-Web-Application/commit/829bf0c4b9c7dd51fc21ab65eb9a4b0ac9690031) | Impact CMS integration          | CMS types, Sanity query/generated SDK, page and tests                                               | Yes            |
| [#4357](https://github.com/oaknational/Oak-Web-Application/commit/8c11faf48bd9615bf7396ab00bdab23d63212d7e) | Impact case studies             | Page plus new local component, fixture, story and tests                                             | Yes            |
| [#4362](https://github.com/oaknational/Oak-Web-Application/commit/201d75533087370cd263cf1a825e464ff7576566) | Support content                 | Shared editorial component, two pages and tests/snapshots                                           | Yes            |
| [#4356](https://github.com/oaknational/Oak-Web-Application/commit/bb868c36d9b5b8429a23794fc1c52487d92ea9b9) | Teacher-browse analytics store  | Route/view integration, analytics provider/store/types, fixtures, stories and tests across 36 files | Yes            |
| [#4363](https://github.com/oaknational/Oak-Web-Application/commit/606b6f343fe7d071a5df3d50d5a79eb9e2114539) | My Library subject-category fix | URL, UI, hook, BFF, GraphQL query/generated SDK, fixtures and tests                                 | Yes            |
| [#4311](https://github.com/oaknational/Oak-Web-Application/commit/d8a4389409bb89550a5f4272d209c5a6c906acca) | Remove legacy pupil experience  | 234 files across pupil routes/views/state/tests and former Classroom coursework paths               | Yes            |
| [#4348](https://github.com/oaknational/Oak-Web-Application/commit/415ac419148a58e6be84cd541ba24299c249f134) | Picker exam-board visibility    | One complex picker plus page/component snapshots                                                    | Yes            |
| [#4352](https://github.com/oaknational/Oak-Web-Application/commit/a04f6123c3c0f7acb898a8cd5e165ba5155426b5) | HubSpot fetch error             | Three account/download consumers and error taxonomy                                                 | No             |
| [#4346](https://github.com/oaknational/Oak-Web-Application/commit/e89997bd93996a21ebab6434f79372f9e0335f7d) | App Router error handling       | Root/core/teacher boundaries, fallback UI, simulation control and tests                             | Yes            |
| [#4317](https://github.com/oaknational/Oak-Web-Application/commit/0d57b65e894ad274013b39f41f636f48193a2d1c) | Computing download banner       | Oak Components upgrade, curriculum banners and tests                                                | Yes            |
| [#4343](https://github.com/oaknational/Oak-Web-Application/commit/e22d920445da2cfbcdcb7401ca5e09a582054db5) | Playwright setup                | Configuration, docs, fixture updater and teacher download smoke test                                | Yes            |
| [#4347](https://github.com/oaknational/Oak-Web-Application/commit/f2612d15852197a82f84dd5bacbc73cc07e15583) | Announce form validation        | Shared schema plus newsletter/onboarding forms and tests                                            | Yes            |

## Observations

### Change shape

**Observed:** 18 of 20 sampled PRs changed test/spec/snapshot evidence or test infrastructure with the production change. The two exceptions were isolated Storybook configuration and a four-file HubSpot error-handling fix.

**Observed:** several changes are compact and convention-aligned. New editorial components commonly arrive with a fixture, story, focused test, snapshot and page composition change. This weakens any blanket claim that OWA's present structure prevents local delivery.

**Observed:** outcome and policy changes cross existing technical families:

- the My Library subject-category fix spans browser URL policy, view shaping, educator hook, Pages BFF, GraphQL query/types, generated SDK, fixtures and tests;
- teacher-browse analytics spans App routes, route-local views, global analytics context, a new store and several test/story decorators;
- removing the legacy pupil experience spans pupil routes, components, progress/analytics state and Classroom-related paths;
- removing an EYFS special case touches curriculum slug helpers, teacher and search UI, analytics naming and My Library.

**Inferred:** these are stronger evidence for candidate capability boundaries than raw folder counts, because one product change repeatedly traverses horizontal taxonomies. They do not prove that every dependency should move into a vertical package.

### Assurance shape

**Observed:** co-changing tests are the norm in this window. Focused tests were added for the pupil modal regression, My Library data shaping, error boundaries, semantic form feedback and CMS data.

**Observed:** snapshot volume can dominate apparently small semantic changes. PR #4367 changed thousands of snapshot lines after a list-rendering and component-release update; PR #4348 changed nearly two thousand snapshot lines around one picker.

**Inferred:** the repository has substantial change-level discipline, but assertion maintenance burden and user-outcome confidence are separate questions. H005 should not be justified as "there are not enough tests"; it must show that a small journey contract catches integration failures that focused tests and snapshots do not.

### Migration and direction

**Observed:** the window includes consolidation and deletion, not only accretion: filter logic was merged with a net deletion, EYFS special cases were removed, and a 234-file pupil migration removed the legacy experience and former Classroom coursework code.

**Inferred:** directory duplication and large component families are moving targets. A current-state map is evidence about constraints and transition, not a destination to reproduce.

### OWA and Oak Components coordination

**Observed:** three sampled OWA PRs upgrade Oak Components as part of a product or semantic change. In the component repository's ten most recent merged PRs at its pinned revision, five carry OWA product ticket prefixes (`LESQ`, `ADOPT` or `PUPIL`), including a breaking save-button removal and two pupil accessibility fixes ([component history](https://github.com/oaknational/oak-components/commits/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8)).

**Inferred:** Oak Components is not currently only a neutral foundation. It is also a delivery boundary for OWA product work. This makes release coordination and product-recipe ownership part of H002's test, not merely package naming.

## Counterevidence and limits

- Six sampled changes are editorial page/components that remain compact and well covered inside existing conventions. H001 would be too broad if it demanded a new capability package for every page section.
- The filter consolidation shows that a horizontal curriculum utility can reduce duplication across a capability. Vertical ownership must still permit genuinely shared domain policy.
- Eighteen test co-changes materially weaken a claim that the codebase lacks testing discipline. This sample cannot measure escaped defects, test signal or CI execution.
- PR subjects describe intent imperfectly, first-parent diffs include generated and snapshot noise, and a five-day window overrepresents the work active at that moment.
- Commit history cannot establish team boundaries, review friction, cycle time, incident severity or why a design was chosen.

## Effect on hypotheses

- **H001:** strengthened for teacher browse, My Library and pupil journeys, but weakened as a universal packaging rule by compact editorial changes and reusable curriculum policy.
- **H002:** strengthened as a boundary question because OWA changes and product-ticketed component releases are coordinated; no evidence yet proves the proposed four layers are the right answer.
- **H003:** the error-boundary change supplies one concrete shell behavior that already varies by App layout profile; runtime parity remains untested.
- **H004:** My Library and CMS changes show validation/transformation across provider boundaries, but the sample does not connect defects to cache freshness.
- **H005:** narrowed to unique integration signal and CI evidence quality. Existing focused test co-change is a strength to build on, not a gap to replace.

## Next discriminating work

1. Select a representative historical PR sample using an explicit method, then compare category and breadth distributions.
2. Select representative user-visible regressions from incident and support evidence, then classify the most direct assertion that would have caught each one.
3. For My Library, pupil guidance and one compact editorial feature, compare conceptual change paths, review ownership and deployment evidence.
4. Separate authored source, generated code and snapshots when measuring review surface.
5. Trace representative paired OWA/Oak Components release sequences, including version lag and rollback behavior.

## Conclusion

**Inferred, 2026-07-19:** recent OWA delivery combines strong focused-test habits with outcome changes that often traverse horizontal layers and coordinated component releases. That is enough to move reference-derived hypotheses into active testing, but not enough to select OCE product architecture. The next evidence must connect these change shapes to escaped defects, ownership, conceptual integrity and delivery behaviour.
