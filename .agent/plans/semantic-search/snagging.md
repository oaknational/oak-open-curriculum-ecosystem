# Snagging of Search UX Work

## Code

The apps/oak-open-curriculum-semantic-search/app/ui directory is full of lone components without organisation. What is the principle here? Please pick an organisational principle and apply it, consistently.

## UI

For each of these, put your visual design hat on, the needs to _look good_ AND be a great user experience.

### General Design

The design does not make use of wide screens, and is not optimised for narrow screens. Go back to design basics, and come up with a design that LOOKS GOOD, and uses space appropriately. Read the rest of the issues before planning anything.

- 2025-10-04: Visual sweep highlights remaining opportunities—landing hero CTAs, admin/status tonal hierarchy, and card motion tweaks remain outstanding for Workstreams 3, 6, 7.

### Navigation

- The navigation had the home page mislabelled as "Search". I have fixed that.
- The theme selector remains right-aligned as the viewport becomes narrower. Please fix this. Once it wraps under the nav items, it should be left-aligned.
- The nav lacks an icon on the left for Oak National Academy. Please add it, and make it a link to the home page.
- Are the skip links still in place?
- 2025-10-04: Nav metadata centralised via `useNavItems()`; root route relabelled “Home” and fixture toggle placeholder captured for upcoming utilities work.
- 2025-10-04: Focus and hover states now use Oak palette tokens (`brandPrimary`, `brandPrimaryBright`) with pill padding/radii to increase target size; no new token gaps found.
- 2025-10-04: Header utilities now host the shared fixture mode toggle via `FixtureModeContext`, keeping state in sync with page notices and cookie refresh.
- 2025-10-04: Header adopts the grid layout spec (`logo/nav/utilities`) with responsive wrapping validated in RTL and Playwright coverage.
- 2025-10-04: Visual sweep (light/dark/reduced-motion/high-contrast) confirms header polish; note high-contrast mode still falls back to browser defaults—log palette gap for Oak Components follow-up.

### Home Page

- The layout on the front page is terrible, it wastes so much space, please see `.agent/plans/semantic-search/snagging_files/Screenshot 2025-10-03 at 15.53.18.png`. The hero should have CTA buttons for both structured and natural language search, and the footer should be removed, and the cards below should be optional further information, also with CTAs, although links are fine. Once the Hero has CTAs, the narrow viewport layout should be fine.
- The hero can be wider. There should be no line break in the hero title. The copy of the sub-header and the hero body are redundant, they need differentiating. Consider center aligning the hero on the page.
- Given that the cards animate on hover, they should 1) respect client indicators for low motion, and 2) the entire card should function as a link, and 3) the hover state should be more obvious, the animation is fine, but do some kind of cool backlight effect.

### Structured Search

- The structured search page layout is also terrible, see `.agent/plans/semantic-search/snagging_files/Screenshot 2025-10-03 at 16.02.07.png`
- The banner takes up an incredible amount of space, see `.agent/plans/semantic-search/snagging_files/Screenshot 2025-10-03 at 16.02.07.png`. We only need a single line, with a modest box, stating `Using Fixture Scenario: <fixture name>`, the users will be bright enough to know that they need to select live data to get live data.
- The function of this page is to show off structured search, it needs to be the primary element on the page, the same applies to the natural language search page.
- Lets make the fixtures a drop down menu that lives in the header, to the right of the theme selector, and on narrow views under the theme selector.
- The structured search explanation card should be the first item on the page so it guides the users, but the copy needs reducing, I will do that now. Done.
- The search results, the entire point of all of this, are not even visible on the page until we scroll _past_ the search controls, see `.agent/plans/semantic-search/snagging_files/Screenshot 2025-10-03 at 16.12.33.png`.
- When they do finally come into view, they are almost invisible, see `.agent/plans/semantic-search/snagging_files/Screenshot 2025-10-03 at 16.14.51.png`, the search results are why we are building this, they need to be prominent.

### Natural Language Search

- All of the structured search issues also apply to the natural language search page.
- None of the fixtures work for natural language search, they all cause an error, see `.agent/plans/semantic-search/snagging_files/Screenshot 2025-10-03 at 16.17.32.png`

### Admin Page

- The admin page is a complete mess, see e.g. `.agent/plans/semantic-search/snagging_files/Screenshot 2025-10-03 at 16.19.06.png` it needs a proper layout and a complete design overhaul.

### Status Page

- The status page is also a complete mess, see e.g. `.agent/plans/semantic-search/snagging_files/Screenshot 2025-10-03 at 16.20.26.png` it also needs a proper layout and a complete design overhaul, starting with considering what the INTENTION of the page is.
