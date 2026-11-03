---
id: quality-analyser-security-reliability-to-zero
node_type: delivery
name: "Code-quality analyser security and reliability findings to zero, and held there by the lint gate"
overview: "Every open BLOCKER, HIGH or MEDIUM security or reliability issue the code-quality analyser reports on the resting branch is FIXED in the tree, and the six analyser rules with a lint twin are locked at error so the class cannot regrow: thirteen single-story pull requests, landed one at a time under the work-in-progress limit."
status: ratified
ratified_by: "Jim Cresswell (owner)"
ratified_date: 2026-11-03
ratified_where: "The owner's word of 2026-11-03 in the session of Sandpiper guards Wind (690653), answering which plans pull request 375 serves: \"plans agreed\"; items 13 and 14 approved in the same message"
serves: maintenance
impact_areas:
  - practice-and-estate
  - analytics-and-observability
  - auth-and-access
  - served-surface
  - design-system
tickets: []
depends_on:
  - plan: code-quality-binding-per-checkout
    kind: beneficial
owner_gates: []
last_updated: 2026-11-03
---

# Code-quality analyser security and reliability findings to zero, and held there by the lint gate

## Goal

The code-quality analyser's issue list for this checkout's project on the resting branch, filtered
to BLOCKER, HIGH and MEDIUM impact on the SECURITY and RELIABILITY qualities with status OPEN or
CONFIRMED, reads zero. It stays there because the commit-time lint gate refuses the six rules behind
33 of the 34 findings; the 34th rule (S6845) has no lint twin in the estate and is held by the
specimen's keyboard tests and the analyser's own pull-request analysis. Every finding is FIXED in
the tree (owner ruling 2026-09-08, verbatim: "We don't dismiss issues, we fix them."). The
observations the triage made beside the findings are triaged, never absorbed: two misleading
documentation lines are corrected beside the cures that already edit their files, and the rest are
routed to named homes (§Out of scope).

## User groups and value

- **The owner and release readiness.** One analyser view that means what it says: zero, held by a
  gate, so a new finding is a fact about a new change.
- **Agents working the estate.** The backlog regrows today: super-linear-regex findings were
  created on 2026-09-12, 09-29, 10-03 and 10-05. With the twins at error a seat meets the defect at
  its own commit, in its own diff, instead of inheriting it months later.
- **Seats driving pull requests.** The review-cost gate runs on every push and parses review bodies;
  once the parsers are cured no review body can slow a push by seconds.
- **Consumers of the MCP server's logs and traces.** Correlation ids and trace ids come from a
  cryptographic source and a current hash.
- **Keyboard users of the design showcase.** The specimen's data table is a tab stop exactly when
  it scrolls, with the design system's focus ring.

## Problem

Thirty-four issues are open in the filter (the analyser's issue query for the resting branch,
2026-10-27; its last analysis is the commit `493951ad7`). The analyser holds one weak-hash finding
in any status and zero security hotspots in any status: this project reports hotspot-class rules
as issues. Every site was read first-hand, and every flagged regex was timed on adversarial input,
doubling its size three times: all are super-linear, `pr-tally/dispositions.ts:40` roughly cubic
(x6.8 per doubling).

| Rule | Count | Sites | Exposure |
| --- | --- | --- | --- |
| S8786 super-linear regex | 25 | agent-tools validators and PR tools (16), sdk-codegen generator (7), search-cli (1), a smoke test (1) | Three read third-party text. Two run live on every push through the review-cost gate (`.husky/pre-push`, no timeout): `pr-watch/skip-markers.ts:20` over every review body from any author (about 8 s per 64 KiB body) and `pr-tally/findings.ts:35` over the Codex connector's bodies. `pr-tally/dispositions.ts:40` is latent until pr-tally's command lands. The rest read repo files, upstream-controlled data or the tool's own output. |
| S2245 pseudo-random | 3 | `correlation/index.ts:37` (MCP server), `sitemap-scanner.ts:125`, `bulk-chunk-utils.ts:183` | No security use: a correlation id and two retry jitters. |
| S4790 weak hash | 1 | `logger/src/otel-format.ts:83` | MD5 derives a fallback 32-hex trace id from a correlation id; no security use (the owner's reading, confirmed first-hand). |
| S7737 object-literal default | 2 | `process-runner.ts:20`, `mcp-auth-clerk.ts:65` | Clarity. |
| S2310 loop counter reassigned | 1 | `field-readback-audit-cli.ts:140` | Clarity. |
| S3923 identical branches | 1 | `logger/src/node.ts:52` | The adapter silently ignores its `encoding` argument. |
| S6845 tabIndex on non-interactive | 1 | `oak-design-showcase/app/identity-switchboard/specimen/resources.tsx:64` | Deliberate: the table's scroll region is focusable for WCAG 2.1.1 (commit `fd27de13a`), and a tab stop at widths where nothing scrolls. |

Six of the seven rules have a lint twin in the `eslint-plugin-sonarjs` 4.2.0 and
`eslint-plugin-unicorn` 73 the shared config already registers (`cjs/plugin-rules.js`:
`sonarjs/super-linear-regex`, `pseudo-random`, `hashing`, `updated-loop-counter`,
`no-all-duplicated-branches`; S7737 is `unicorn/no-object-as-default-parameter`); none needs type
information. The shared config enables four sonarjs rules today (`recommended.ts:70-73`). S6845 has
no twin: `eslint-plugin-jsx-a11y` is not in the estate. An in-memory run of the six twins over the
4,650 tracked TypeScript files (2026-10-27) found every analyser site plus 18 the analyser does not
analyse: 15 more super-linear regexes (8 in test files, 7 in three skill eval scripts), 2
object-literal defaults and 1 identical-branch conditional in test files. The lock therefore cures
51 twin sites, and S6845 is the 52nd.

Observations the triage made beside the findings, each triaged (`concept-exploration` §Loop
Dynamics: work the story does not require is routed to a named home, never absorbed):

- Two documentation lines mislead: the `mcp-router.ts` TSDoc examples call
  `createMcpAuthClerk(logger)`, a signature that no longer exists (`allowedHosts` is required), and
  the shared lint config's activation comment points at a plan directory that no longer exists.
  Misleading docs are blocking (`principles.md` §Code Quality), so each is corrected in the unit
  that already edits its file.
- Nine code-fence detectors in agent-tools disagree. Three track the CommonMark closer rule
  (`validators/core-host-names/markdown-headings.ts`, `validators/plan-schema/yaml-fence-blocks.ts`,
  `subagent-declarations/system-prompt-block.ts`); six toggle on any fence-like line
  (`validators/cited-paths/extract-path-citations.ts`, `validators/cited-scripts/extract-script-citations.ts`,
  `validators/markdown-links/validate-markdown-links-helpers.ts:72`,
  `practice-fitness/markdown.ts`, `practice-fitness/item-count.ts`'s strip regex,
  `hook-policy/matchers.ts:73` (backticks only)). Two of the three CommonMark fence patterns are analyser findings and take one shared
  helper; the six toggling detectors are no finding's site, and moving them would change
  their behaviour on nested, longer and tilde fences. Routed: §Out of scope.
- `isSignedSelfReply` (`pr-watch/reviewer-legs.ts:107`) reads only the body's last line, so any
  commenter can sign as a seat, and pr-tally would read such a comment as the seat's disposition,
  where the pr-lifecycle skill requires self-AUTHORED signed replies. Routed to its owner: the
  `pr-tally` node carries the author check in its review-dispositions ledger (2026-10-27).
- The correlation middleware (`correlation/middleware.ts:111`) accepts any non-empty
  `X-Correlation-ID` into logs, error-report tags and the response header. Routed: §Out of scope.

## Mechanism

One outcome per site, FIXED in the tree. Each cure is pinned by a test that passes before and after
it (characterisation first, per `tdd-for-refactoring`), except the named behaviour changes below,
each pinned by a test that is red before its cure. The class is then held by the lint twins at
error.

- **Super-linear regexes.** Each site takes the linear form named in its unit: a negated class that
  excludes the opener (`“[^“”\n]*”`, `\[[^\][]*\]`, `\(([^()]+)\)`), `[ \t]` in place of `\s` where a
  multiline pattern must not cross lines, an anchored or lookbehind-started run, or a string
  operation (split on a separator, `lastIndexOf`, a trailing-character trim). If a named regex form
  still trips its twin, that site takes the string-operation form; there is no third choice.
- **Pseudo-random.** `node:crypto`: `randomBytes(3).toString('hex')` keeps the correlation id's
  6-hex part; `randomInt` gives both jitters the ranges they have now.
- **Weak hash.** The trace id becomes the first 32 hex characters of SHA-256 over the correlation id
  (the disposition policy's S4790 cure).
- **Clarity cures.** Destructured parameter defaults over an empty-object default
  (`{ stdout = process.stdout, stderr = process.stderr }: Partial<…> = {}`), a `while` loop with an
  explicit cursor, the dead conditional removed.
- **Generator first.** The sdk-codegen regexes are fixed in the generator, and regenerating from
  the tracked cached schema produces byte-identical tracked output.
- **One fence-line helper for the CommonMark detectors.** The two flagged fence patterns
  (`markdown-headings.ts:23`, `yaml-fence-blocks.ts:55`) and their unflagged twin
  (`system-prompt-block.ts:17-18`) are one shape in three files; the second consumer makes the
  shape load-bearing (`consolidate-at-second-consumer`), so one string-operation fence-line helper
  in `agent-tools/src/core/markdown/` replaces all three, with no behaviour change.
- **A scroll region that is a tab stop only when it scrolls.** The specimen table's region takes its
  `tabIndex` from observed overflow rather than a constant: WCAG 2.1.1 holds at narrow widths, and
  the tab stop goes where nothing scrolls.
- **The lock.** The six twins go to `error` in `packages/core/oak-eslint/src/configs/recommended.ts`
  at the head of the series, with one pathogen fixture per rule, so the commit hook (changed
  workspaces) and `pnpm check` (all workspaces) refuse the class from then on and the cures land
  against a red gate in the same pull request.

Named behaviour changes (each red-first): nested curly quotes mark only the inner span, and a disposition line with an empty item or a
Codex badge line with no heading makes no finding; trace-id values change; the parenthetical
synonym pattern counts the innermost span; inline-link alt text cannot contain `[`; no tab stop
where nothing scrolls.

Why this produces the outcome: each finding is cured at its root (the generator, the shared helper,
the parser), so a sibling rule cannot re-trip the site, and the twins turn "zero" into an invariant
at commit time rather than a reading after merge.

Warrants and their falsifiers:

- *The twins have parity with the analyser.* Warrant: one in-memory run in which every analyser site
  was among the twins' hits (one observation, against the analyser's own list). Falsifier: a finding
  of one of the six rules appears on the resting branch, in a linted workspace, after the pull request has
  merged; the parity claim is then wrong for that shape, and the site is cured and the shape recorded
  in the disposition policy.
- *No consumer depends on the trace id's MD5 value.* Warrant: the derived trace id is a fallback,
  used per log record only when no active span exists, from a per-request correlation id
  (`otel-format.ts:111-126`). Falsifier: a test or a stored fixture pins an MD5-derived trace id; it
  is then re-derived, not kept.

## Acceptance criteria (each with a proof — required)

1. The analyser's issue list for this checkout's project on the resting branch, in the goal's
   filter, is empty. Proof: `owner-held` — the analyser is the record of its own state; the closing
   seat reads it after the last unit's merge has been analysed and records the dated reading on the
   lane's closing comms event.
2. The six twins are at `error` in the shared config, each with a pathogen fixture that surfaces its
   error, and the aggregate gate is green with them on. Proof: `repo-safe` — the new
   `packages/core/oak-eslint/src/configs/recommended.unit.test.ts` and `pnpm check` on the pull
   request.
3. No file a workspace lints breaks a twin, and the skill eval scripts' formerly flagged patterns
   live in the showcase's linted tools module. Proof: `repo-safe` — the lint gate on the pull
   request and the tools module's unit tests.
4. Every cured site's behaviour is pinned by a test that passes before and after its cure, except
   the named behaviour changes, each pinned by a test that is red before its cure; the pr-tally
   recorded-corpus suites are unchanged; the regenerated SDK output is byte-identical. Proof:
   `repo-safe` — the tests named in each unit; `git diff --exit-code` over
   `packages/sdks/oak-sdk-codegen/src/types/generated` after `pnpm sdk-codegen`, on the pull request.
5. The skip-marker, disposition-line and Codex-item parsers each classify an adversarial body as a
   plain assertion, with no clock read and no wall-clock ceiling (the testing directive: a finite
   ceiling in a gated test is deleted, never raised); each input is sized so the current regex takes
   past the harness's default timeout on the authoring host (measured once, and recorded in the
   test's TSDoc), so each test is red before its cure, and the cured reader answers in
   milliseconds. Proof: `repo-safe` — the parsers' tests.
6. The correlation id carries a 6-hex cryptographic part; the trace id is 32 hex, stable for one
   input, and equal to a pinned SHA-256 vector. Proof: `repo-safe` — the correlation and trace tests.
7. The CommonMark fence detectors that read a fence's info string use the one helper, and each
   detector's output over the tracked corpus before and after is identical. Proof: `repo-safe` —
   the helper's tests and the validators' own, which pin the headings and YAML blocks they read.
8. The specimen's lesson-breakdown region is a tab stop exactly while its table overflows (present
   at 320px, absent at 1280px), keyboard scrolling works at 320px, and the specimen's accessibility
   matrix and 320px reflow cells stay green. Proof: `repo-safe` —
   `pnpm --filter @oaknational/oak-design-showcase test:a11y` with the specimen's three tests.
9. `code-scanning-alerts-to-zero` no longer carries the pseudo-random and weak-hash sites in any
   section, and `pr-tally`'s ledger names the parser cures and carries the author check as its own.
   Proof: `repo-safe` — both nodes' text.

## Todos

One pull request from the branch `fix/stricter_linting`, cut from the default branch (the owner's
word, 2026-11-02: one pull request, never a series of them). The cures land as local commits in
sensible chunks, one per workspace; the series' first and last commits run the hooks and the others
are committed with the hooks bypassed under that word, each saying so in its body, with the
major-version guard run by hand over every message. The whole gate, `pnpm check`, is green on the
tree before the push. The work, by item; every item is in the tree unless marked still to land:

1. **The lock.** The six twins at `error` in `recommended.ts`, at the head of the series with the
   autofixable twins applied across the estate; `recommended.unit.test.ts` with one pathogen fixture
   per rule, in the shape of `strict.unit.test.ts` and over the fixture linter the two tests share;
   the activation comment re-pointed at `docs/governance/sonar-disposition-policy.md`; the policy's
   S8786, S2245, S4790, S2310, S3923 and S7737 classes record their commit-time twin.
2. **Parsers of third-party review text.** `pr-watch/skip-markers.ts:20` → `“[^“”\n]*”` in the curly
   branch; `pr-tally/dispositions.ts:40` → a field-wise parse that checks the bullet and bold label,
   splits the rest on the `·` separator, and reads the head SHA, the review id, the anchor (path and
   line split at `lastIndexOf(':')`) and the text; `pr-tally/findings.ts:35` → a string parse (badge
   prefix, first `</sub></sub>`, trailing `**`). Tests per criterion 5; the recorded-corpus suites
   unchanged.
3. **Request correlation and trace identity.** `correlation/index.ts` (`randomBytes(3)`),
   `logger/src/otel-format.ts` (SHA-256, the first 32 hex). Tests per criterion 6.
4. **Retry jitter from the cryptographic source.** `sitemap-scanner.ts:125`
   (`baseDelay * 2 ** attempt + randomInt(baseDelay)`), `bulk-chunk-utils.ts:183`
   (`randomInt(Math.max(1, Math.floor(exponentialDelay)))`, the same range). The existing bound
   tests hold.
5. **Clarity cures.** `logger/src/node.ts:52` (the ternary removed; the adapter writes UTF-8, said in
   its TSDoc); `field-readback-audit-cli.ts:140` (`while` with an explicit cursor);
   `process-runner.ts:20` and `mcp-auth-clerk.ts:65` (destructured defaults); the two test-file
   object defaults (`pr-watch/content-reader.integration.test.ts:26`,
   `practice-fitness/decision-debt-report.unit.test.ts:9`); the identical-branch helper in
   `document-transform-helpers.unit.test.ts:132` (collapses to `(year) => [String(year)]`); the
   `mcp-router.ts` TSDoc examples given `allowedHosts`.
6. **The SDK generator.** Its regexes take their linear forms in the generator (`codegen-core.ts`,
   `verify-docs.ts`, `analysis-report-generator.ts`), with a characterisation test over every JSDoc
   shape the TSDoc post-processor rewrites and a red-first test of the parenthetical count; the
   generated root types take PascalCase names and each union of three or more members that recurs at
   three or more sites is declared once, named after the property most of its sites share; the
   generator's file access goes through a port with an in-memory fake, so its tests read no disk;
   regeneration from the tracked schema is byte-stable (criterion 4).
7. **Trailing-run trims and slugs.** A string-operation `trimEndWhile(text, predicate)` in
   `agent-tools/src/core/` with its unit test, used by `extract-path-citations.ts:53` and `:116`,
   `mcp-content-workspace/render-workspace.ts:28` and `practice-fitness/item-count.ts:123`;
   `core/agent-identity/derive.ts:197` and search-cli `reference-document-builders.ts:178` take
   `/^-|-$/g` (the collapse before each leaves runs of one).
8. **Link, flag, field and alt-text parsers.** A shared `stripLinkTitle(target)` (the title is the
   last whitespace-preceded quoted span, found from the end) used by
   `validate-markdown-links-helpers.ts:141` and `validate-reference-direction-helpers.ts:139`;
   `shell-command-citations.ts:23` → `/^-[A-Za-bd-z]*c[A-Za-z]*$/`; the provenance repo line
   (`validate-no-host-names-in-core-headings-helpers.ts:53`) → `^\s*(?:-\s*)?repo:`;
   `practice-fitness/markdown.ts:108` → `[^\][]*` in the alt text.
9. **One fence-line helper.** `agent-tools/src/core/markdown/fence-line.ts` (the run matched, the
   info string read in code; a closer is the same character, at least as long, with nothing after)
   with its unit test, adopted by `markdown-headings.ts` and `yaml-fence-blocks.ts`;
   `markdown-headings.ts` also takes the ATX form `^ {0,3}(#{1,6})[ \t]+([^ \t].*)?$`.
   `system-prompt-block.ts` keeps its two simpler patterns, which no finding names, and comes onto
   the helper at its next edit. No behaviour change (criterion 7).
10. **Regexes in test files.** `spawn/cli.unit.test.ts:345` (`/^[ \t]*Director: forged/mu`),
    `tests/health-probe.unit.test.ts:156` (`/\b[a-z]+-consolidate-docs/u`),
    `tests/mcp-conformance/render-reviewer-pack.unit.test.ts:122` (`\[[^\][]*…\]`),
    `tests/skills/plugin-listing-invariants.integration.test.ts:74` (match every link with
    `\[([^\][]*)\]\(([^()]*)\)`, then filter labels for "privacy"),
    `build-scripts/copy-oak-ds.integration.test.ts:66` (`url\(([^)]*)\)`, then trim and unquote in
    code), `components/framework/framework-animation.test.ts:51` (`/\d\.\d{3}/`),
    `code-generation/typegen/search/completion-context-alignment.unit.test.ts:47` and
    `code-generation/typegen/search/field-alignment.unit.test.ts:31` (`^[ \t]+`), and
    `smoke-tests/gate-slot-cli.smoke.ts:117` (`/^[ \t]+at /mu`).
11. **Tests off the disk.** Every in-process test that read a real file system directly takes an
    in-memory fake through a port: the generator's `FileSystemPort`, agent-tools' `SyncFileSystem`
    and its watcher-staleness binding, the search CLI's file reader; the `no-real-io-in-tests` rule is
    scoped to the in-process tiers. The helper-mediated reads that remain are the debt the review
    dispositions name, for a node of their own.
12. **Records.** This node and the `maintenance` node it serves, both still `sketch` awaiting the
    owner's stamp; `code-scanning-alerts-to-zero` re-pointed from the retired Reliable Atoms node to
    `maintenance`, with the pseudo-random and weak-hash sites moved here in every section that
    carried them; `pr-tally`'s review dispositions carry the parser row and the author check as that
    node's own work; the content audit's item C484 re-anchored on the heading map the generator cure
    hoisted.
13. **The skill eval scripts' patterns move into the showcase tools module.** Still to land. The
    CSS-fence walker (a line walk, used by `grade-page.ts` and `grade-no-invented-values.ts`), the
    declaration test
    (`/[a-z-]\s*:/i`), the attribute and custom-property patterns (lookbehind-started) and the
    theme-rule walk (split on braces) from `grade-theming.ts` land in
    `demos/oak-design-showcase/tools/`, beside `css-literal-values.ts` that both scripts already
    import, each with a unit test; the three scripts import them. Each script's grade over its own
    fixtures is unchanged.
14. **The specimen's scroll region is a tab stop only while it scrolls.** Still to land. A small
    client component wraps the lesson-breakdown `<section>` (the named region kept): a
    `ResizeObserver` on both the
    section and the table (a web font widens the table without resizing the section) sets a state
    value used as `tabIndex={scrollTabIndex}`: `0` while the content overflows, absent otherwise,
    and kept while the region holds focus so a resize never drops focus to the body. No inline
    ternary: the analyser evaluates a conditional's consequent and still fires.
    `.table-scroll:focus-visible` takes the design system's focus ring in place of the browser
    default. Tests in `specimen-a11y.spec.ts`: at 320px, before axe runs, the region has
    `tabindex="0"` (the assertion waits for hydration); at 1280px it has none; tabbing to it and
    pressing ArrowRight moves `scrollLeft` above zero. The alternatives were ruled out on evidence:
    fitting the table at 320px is infeasible (about 250px of minimum content against 208px before
    any cell padding, in the tightest identity), and a stacked narrow layout loses table semantics
    on older WebKit and changes the design system for four rows.

The two items still to land are the analyser's only findings outside the lint twins' reach: the
eval scripts sit outside every workspace, and S6845 has no twin. They land in this pull request
before the push.

## Out of scope

- The nine LOW-impact security findings (six S4036, three S5332) and every CodeQL class: outside the
  owner's filter, and already units 4 and 5 (and the CodeQL units) of `code-scanning-alerts-to-zero`.
- Maintainability-only findings: the analyser's quality-profile backlog, not this filter.
- Linting the skill eval scripts themselves: they sit outside every workspace by design; this plan
  moves their flagged patterns into a linted module.
- The runtime-only scripts' separate lint config (`eslint.runtime-only.config.mjs`, core rules only):
  the analyser reports no finding there.
- Any analyser-side state change: the one-outcome rule.
- Changing the `SimpleWriteStream` interface or `createMcpAuthClerk`'s positional `canonicalOrigin`:
  neither is a finding; each would be a public-API change of its own.
- Binding the analyser project per checkout: `code-quality-binding-per-checkout` (ratified, its own
  pull request). Without it the closing seat reads the project from the operator profile's repo scope
  file (PDR-141).
- The other delivery nodes that still serve the retired Reliable Atoms node: they belong to other
  lanes; only `code-scanning-alerts-to-zero`, which this plan amends anyway, is re-pointed here.
- Bringing the six toggling fence detectors onto the fence-line helper: no finding names them, and
  the move changes their behaviour on nested, longer and tilde fences over the tracked corpus. The
  observation stands in §Problem; each detector comes onto the helper at its next edit, where
  `consolidate-at-second-consumer` fires, and a seat that wants them moved sooner opens that as its
  own lane with its own corpus diff.
- Validating the incoming `X-Correlation-ID` header: no finding names it, and the product's threat
  model (free curriculum material served to teachers) prices an unbounded header echoed into logs
  as hygiene for the served surface's own lane, not a security cure for this one. The observation
  stands in §Problem.
- Binding signed self-replies to their author: `pr-tally`'s own work, carried in its ledger.

## First-principles check

- **Shape.** The tests prove behaviour the estate owns: a classification, a parse, an id's format, a
  fence's extent, a tab stop's presence. The lint fixtures prove the estate's own config refuses a
  pathogen, not that the vendor's rule works.
- **Landing path.** The twins land in the shared config every workspace extends, so the commit hook
  (changed workspaces) and `pnpm check` (all) both run them; the skill eval scripts and the
  runtime-only scripts are named as outside that path. Tests take the estate's tier names so the
  runners include them; the new config test sits beside `strict.unit.test.ts`.
- **Vendor literal.** The twin rule names were read from the installed plugins' rule maps
  (`eslint-plugin-sonarjs` 4.2.0 `cjs/plugin-rules.js`, `eslint-plugin-unicorn` 73); the analyser
  keys from its own issue query; `randomBytes`, `randomInt` and `createHash('sha256')` are
  `node:crypto`'s current API.
- **Optionality surface.** Every site names its cure and its single fallback (the string
  operation); every item names its files; the scroll region's cure was chosen by the decision
  lenses on an accessibility review's evidence, so no choice is left open.
- **Record consumer.** The lane's closing comms event is the only accounting surface; criterion 1's
  reading is its consumer. The records item's ledger rows are read by those nodes' next pickups.
- **Rules tier.** Fix-only (the one-outcome rule and its single CodeQL exception, untouched); checks
  are never disabled, rules only added; generated code is fixed at the generator; one pull request
  of chunked commits (the owner's word, 2026-11-02); TDD for refactoring; one helper at the second consumer (`trimEndWhile`,
  `stripLinkTitle`, the fence-line helper, the eval patterns in the shared tools module); adjacent
  observations routed, never absorbed (`concept-exploration` §Loop Dynamics, `proportionality`);
  one open pull request at a time (`pr-lifecycle` §The work-in-progress limit).

## Review dispositions

One row per finding; "applied" means folded into this node before ratification.

| Date | Source | Finding | Disposition |
| --- | --- | --- | --- |
| 2026-10-27 | Cricket panel on the triage (eight seats, both stances) | The weak-hash finding was presented as an open question although the one-outcome policy already rules on it; the owner's plural "most of the weak hash findings" against one finding. | Applied: S4790 is a cure in unit 2; the problem section records one weak-hash finding in any status and zero hotspots. |
| 2026-10-27 | Accessibility review of the scroll-region options (read-only, at authoring) | Ranked a tab stop only while overflowing first; fitting at 320px infeasible by arithmetic; a stacked layout loses table semantics on older WebKit and restoring roles trips the redundant-role rule; an inline ternary still fires the analyser rule; observe the table as well as the section; keep focus through a resize; add the design system's focus ring; assert the attribute before axe because the suite does not wait for hydration. | Applied: unit 12 and criterion 8. |
| 2026-10-27 | Assumptions review (read-only, at authoring), blocking | "Seven twins" where six exist; S6845 has no twin, so the goal over-claimed. | Applied: six twins throughout; the goal names S6845's holders. |
| 2026-10-27 | Assumptions review, blocking | The scroll-region unit was a placeholder while the node declared no owner gate. | Applied: the unit written (unit 12); no gate needed. |
| 2026-10-27 | Assumptions review, blocking | GraphQL records the bot without `[bot]` (as the recorded corpus shows), so `<appSlug>[bot]` would make every recorded signed reply non-self; the authenticated login's source was unnamed. | The observation stands, verified first-hand in `pr-138-harvest.json`; the author check and its `[bot]`-suffix fact are `pr-tally`'s own, carried in that node's ledger. |
| 2026-10-27 | Assumptions review | Ten fence detectors, not eight (`validate-markdown-links-helpers.ts:72`, `hook-policy/matchers.ts:73`); the fence unit over the bands. | Applied: ten detectors recorded, verified first-hand; the three CommonMark detectors take the helper in unit 8, and the seven toggling detectors are routed (§Out of scope). |
| 2026-10-27 | Assumptions review | The eval scripts already import the showcase tools module, so a per-script walker breaks consolidation at the second consumer and its stated reason was false. | Applied: unit 10 moves the patterns into that module. Verified first-hand. |
| 2026-10-27 | Assumptions review | The signature unit over the bands. | Moot: the author check is `pr-tally`'s own. |
| 2026-10-27 | Assumptions review | The vocabulary report is gitignored and needs gitignored bulk data, so its regeneration cannot prove unit 5. | Applied: a red-first unit test pins the innermost-parenthetical capture. |
| 2026-10-27 | Assumptions review | Criterion 4 contradicted the deliberate behaviour changes. | Applied: the named behaviour changes are listed in the mechanism and excepted in criterion 4. |
| 2026-10-27 | Assumptions review | Criterion 5's timing margin was thin and two of its tests made no red claim. | Applied: 1,000 ms explicit timeouts, inputs at ten times the margin, each red-first. |
| 2026-10-27 | Assumptions review | The lock's scope moves with other lanes; a root ESLint run uses every strict rule. | Applied: new sites surface at unit 11's push gate, up to five cured in-unit, more insert a unit 10b; the root run is dropped (the plugins do not resolve from the root; verified) in favour of unit 10's move. |
| 2026-10-27 | Assumptions review | Unit 0 missed sections of `code-scanning-alerts-to-zero` that carry the moved sites. | Applied: every section named in unit 0. |
| 2026-10-27 | Owner, at plan review | "The reliable atoms concept is retired, this is just fixing defects"; asked which node a defect-fix plan serves: "Maintenance". | Applied: `serves: maintenance`, a new strategic node landed by unit 0 (serving TOOLS-1); `code-scanning-alerts-to-zero` re-pointed in the same unit. |
| 2026-10-27 | Assumptions review, nits | Unit 2 has no file dependency; `findings.ts` also runs live; the pr-tally row should name unit 1; the LOW findings are the sibling's units 4 and 5; name the typegen tests; `recommended.unit.test.ts` is new. | Applied, each. |
| 2026-10-27 | Owner, at recheck ("we have rules, follow them": `pr-lifecycle`, `proportionality`, `metacognition`, `principles.md`; "this is about fixing issues, not ceremony"), with a side seat's note | The `maintenance` node promised that reviewer and seat findings are fixed, where the estate triages them (`review-feedback-defaults-to-triage`, PDR-140) and the 2026-09-08 ruling covers analyser findings. The plan absorbed three adjacent observations as five units no finding names (one fence model across ten detectors with behaviour changes, author-bound signatures in two tools, a header grammar): the shape `pr-lifecycle` §Phase 4 records as a worked failure ("a container-aware parser nobody had asked for"). It scheduled three parallel lanes where `pr-lifecycle`'s work-in-progress limit gives a seat the owner names alone one open pull request. It would have opened a draft before ratification, where `pr-lifecycle` §Phase 1 says no draft waits for one. | Applied: the `maintenance` node's outcome names analyser findings only; the fence model is one helper for the three CommonMark detectors (unit 8) and the toggling seven are routed; the author check goes to `pr-tally`'s ledger as its own; the header grammar is routed; unit 2 narrowed to its two findings; thirteen units, landed one at a time; the nodes are stamped on the owner's word before the first push. |
| 2026-10-27 | Cricket pair on the rechecked plan (both stances: ON-TRACK, frame NARROWED) | The order put four record files ahead of the live exposure under a one-pull-request limit, against the owner's "fixing issues, not ceremony"; the plan did not carry the owner's order that the bot's pull-request-opening command lands first; the solo limit, and the counting of the owner's own open pull requests toward it, were readings the owner should see stated in one line. | Applied: unit 1 leads and unit 0 follows as its own pull request; the tool dependency is named in the order; both readings are stated to the owner in the recheck report. |
| 2026-10-28 | Unit 1 authoring (Smelter herds Basalt, 871ba4) | The one-regex readers of the disposition line and the Codex item accepted a whitespace-only item and a whitespace-only heading as findings with an empty key: an accident of the patterns' backtracking, not the intake contract's shape. | Applied: the field readers require the item and the heading; both shapes are red-first tests in unit 1 and named with the unit's behaviour changes. |
| 2026-10-28 | Code-expert read of unit 1 (CHANGES REQUIRED on the tests; the readers approved as written) | The three adversarial-input tests read the clock (`performance.now()`) and set a one-second ceiling, which test-immediate-fails item 4 and the testing directive's no-wall-clock-ceilings rule forbid in a gated test; criterion 5 had asked for exactly that. | Applied: the clock reads and ceilings deleted, the inputs kept as plain classification assertions red before the cure under the harness's default timeout, criterion 5 re-worded; two parity notes recorded as information (the old review field admitted the separator; the old item swallowed a separator before prose), both outside the contract and stricter now. |
| 2026-11-02 | Owner, mid-execution | The analyser backlog is driven to zero in ONE pull request on a branch cut from the default branch, as a series of local commits in sensible chunks with only the first and last commit hooked; "we do not do warnings, we fix problems"; no allowlists; test code is held to the product standard; an in-process test may use no IO other than stdio, an out-of-process test against a test instance may. | Applied: the numbered units collapsed into one pull request; the `no-real-io-in-tests` rule scoped to the in-process tiers; the testing directive carries the two rulings. |
| 2026-11-02 | Lane verification (Smelter herds Basalt, 871ba4), reading every lane diff in full | A lane rewrote the vercel-ignore script's semver regex as a split-based parse and the parity test around it; a lane passed a dev flag to the token build through an env file because the Vite config may not read `process.env`; a red-first test asserted a synonym extraction the generator never performed; the generated root-type rename reached the published SDK's re-exports; two copies of a fence-line reader landed in one diff. | Applied: the canonical semver composition mirrored and the parity test restored; a `--dev` argument on the token build; the test reshaped to the count the pattern feeds; the renamed re-exports named in the commit body (the owner's word: no major version, since no consumer of the repository is affected); one `core/markdown/fence-line.ts` adopted by the two validators. |
| 2026-11-02 | Lane verification, the real-IO rule over agent-tools | Nine in-process tests read a real file system directly; the modules behind them probed `node:fs` inline. | Applied: one `SyncFileSystem` port in agent-tools core with the node default and an in-memory fake, taken by the flag-path resolver, the Codex registry and resolver, the protocol-conformance adapter, the agent index and the watcher-staleness binding; the nine tests replaced by in-memory unit tests, the source-tree grep guard deleted. Debt recorded, not cured: nine test helpers still read a real file system for about thirty-one in-process tests; the MCP app holds twenty-five in-process loopback end-to-end tests; the build-metadata runtime test reads disk at import. A follow-on lane. |
| 2026-11-02 | Lane verification, consolidation | In-memory file-system fakes now exist in env-resolution, codegen, search-cli and agent-tools (three async, one sync), with differing shapes; the fence model is adopted by two of the three CommonMark detectors and none of the seven toggling ones (units 8, 9a, 9b). | Routed: a named consolidation lane for the fakes; units 8 (system-prompt-block), 9a and 9b stay as written. |
| 2026-11-02 | The full repository gate over the verified tree | Knip reported fifteen exports nothing imports, all in the lanes' new modules; the MCP content audit refused item C484 because a lane hoisted the AI reference's heading map out of the function its anchor covered; six files were unformatted. | Applied: the exports dropped or the barrel trimmed; C484 re-anchored on the hoisted map with the `unchanged` verdict (the rendered headings are the same) and the guidance-resource anchor overrides moved into their own module so the registry fits its line limit; the files formatted. The side agent's note on the hoisted union names was checked and cured in the generator: a union is named after the property most of its sites share, ties by the words the tied names share (`Subject`, `QuizItem`), no name map. |
