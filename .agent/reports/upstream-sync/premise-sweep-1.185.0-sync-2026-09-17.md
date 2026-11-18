# Premise sweep record: the 1.181.3 → 1.185.0 sync (carrier #154, 2026-09-17)

**Review contract.** Purpose: the cross-fork skill's §6 sweep, recorded per file so the reviewer
can check "nothing to re-true" as a read, not a count. Frame (owner, 2026-09-17): the Oak line
and this line are one repository temporarily diverged into two lines that will come back
together; "the Oak line's tip" below names a commit, never a separate estate. Scope: every
document on this line that differed from the Oak line's tip `d9138c8b9` after the rehearsal
merge of `engraph` `cd847a2b3` — 536 `.md`/`.json`/`.yml` files (the enumeration list is
conserved with the seat's handoff instruments). Method: a keyword census over the incoming
change's twelve claims selected 55 files, read whole; the other 481 were read at claim level
(headings and every passage asserting a fact about a changed area); 14 very large files were
additionally read whole. Readers were read-only subagents dispatched by the integrating seat
(Dynamo turns Temper, 2a4c8a); every flagged passage was read by the seat at its line before any
edit, and the seat made every edit. The provenance instrument: `git diff d9138c8b9 -- <file>`
shows text added on this line; text absent from that diff is byte-identical to the Oak line's tip.
Disposition line (owner card answers, 2026-09-17): premises authored on this line and this line's
governing plans are re-trued on the carrier; stale prose identical to the Oak line's tip in
documents the Oak line's changes should have updated goes to the findings ledger
(`carried-code-findings-1.185.0-sync-2026-09-17.md`) for its own PRs on this line, which the
lines carry together when they rejoin; generated pages are never hand-edited; dated records get
an addendum at most.

## The twelve claims

1. MCP host landing page removed (Oak line #928, #987): no HTML on any host, `GET /` 404, no
   `/mcp` HTML negotiation, no `getLandingPageHtml`, `dnsRebindingProtection` on no route.
2. `robots.txt` served by the MCP host (MCP-703).
3. Agent-discovery `Link` header (MCP-734), stated as the property the source gives: it is
   `app.use` middleware mounted at `application.ts` line 92, so it rides the response of every
   route registered after that point and the default 404, and no response that a handler
   registered earlier ends. The Oak line's docstring says "every response" (ledger A13). Stated
   as a property after two reviewer rounds each found another earlier route; this record
   enumerates none.
4. Server instructions gain the routing paragraph, addition A012, twelve governed additions
   (MCP-421).
5. A second plugin package `plugins/oak-open-curriculum-chatgpt/` and `.agents/plugins/
   marketplace.json`; `validate-plugin-skill-copies` (MCP-692). Owner correction 2026-09-17: the
   first package is the Claude plugin, for any Claude host, never "the Claude Code plugin".
6. Spec-portable frontmatter passed through quoted; `metadata.owned` is not the prefix trigger
   (MCP-123/706).
7. The Oak line's ADR-228 agent-web dispositions (Proposed).
8. This line's identity ADR is ADR-231 (renumbered at this sync).
9. `ALLOWED_SERVED_URL_PREFIXES` admits the canonical MCP host (MCP-651).
10. The Oak line's default branch is at 1.185.0.
11. `pnpm/action-setup` v6.1.0 in `ci.yml`.
12. Skill adapters regenerated with the new fields.

## Hit index and dispositions

| # | File | Lines | Claim | Bytes | Disposition | Applied |
| --- | --- | --- | --- | --- | --- | --- |
| H1 | `.agent/rules/confident-seats-proceed-and-report.md` | 34 | 1 | Oak-line tip | ledger A2 | ledger |
| H2 | `.agent/skills/README.md` | 37; 42 | 5 | 37 tip; 42 this line | 37 → ledger A3; 42 re-trued (the Claude plugin and its ChatGPT/Codex package) | carrier |
| H3 | ADR-189 (2026-09-05 amendment) | 93–95 | 5 | this line | dated addendum naming the second manifest and package; the "(Claude Code)" qualifier is the Oak line's wording, corrected here | carrier |
| H4 | `apps/…/docs/deployment-architecture.md` | 374, 398, 400, 450–451, 462–463 | 1 | tip | ledger A1 | ledger |
| H5 | `.agent/plans/delivery/oak-open-curriculum-mcp-extraction.plan.md` | 293, 632, 772 | 1 | tip (a governing plan) | narrowed: the landing page named at authoring was removed by #928/#987 | carrier |
| H6 | `.agent/memory/operational/director-rulings-ledger.md` | 113 (SPARK-6) | 1 | tip | row moved to Expired/superseded with the reason | carrier |
| H7 | `.agent/memory/operational/frictions-register.md` | F-37, 1166–1170; status 1183 | 6 | tip | status addendum: pass-through landed 2026-09-09; owned/ingested check and `claude-*` hoisting still open | carrier |
| H8 | paused `orientation-skills-family` thread | 221–225 | 6 | tip | OVERTAKEN prefix, original kept as the dated record | carrier |
| H9 | paused `mcp-submission-drive` thread | 355–356 | 1 | tip | dated line: `selectsHtmlLeg` and the HTML leg no longer exist | carrier |
| H10 | `.agent/plans/delivery/workspace-classification-census.plan.md` | 80–84 | 5 | tip (a governing plan) | dated amendment: the manifest arm finds Claude plugin manifests only; the code gap is ledger A5 | carrier |
| H11 | `.agent/plans/delivery/archive/design-system-completion.plan.md` | 412–414, 531–534, 1336–1339 | 1 | tip text in a this-line archive | dated addendum under the ARCHIVED banner; citations left as conserved history | carrier |
| H12 | `agent-tools/src/mcp-content-workspace/content-workspace-config.ts` | 49 | 1 | this line only | source re-trued (drop "the landing page"); `docs/governance/model-behaviour-content/README.md` and `domains/ux-accessibility.md` regenerated | carrier |
| H13 | `apps/…/docs/vercel-environment-config.md` | 29, 84 | 1 | tip | ledger A8 | ledger |
| H14 | `docs/governance/development-practice.md` | 428–429 | 5 | this line (owner definition) | KEEP — owner 2026-09-17: the plugin is a Claude plugin, not Claude Code only; the Oak line's qualifier is the misstatement (ledger A11) | none |
| H15 | `.agent/plans-backlog-2026-07/effectiveness-and-impact/current/mcp-content-assessment-methodology-research.plan.md` | 168 | 1 | tip | leave: an owner-gated plan whose gate names its pickup; at that pickup re-count the "~16–24 rendered items" without the landing page | none |
| H16 | `.agent/plans/strategic/public-packages-release.plan.md` | 66–69 | 10 | tip | leave: "1.175.x" was stale before this sync and is not the sentence's point; drop the number if the sentence is ever edited | none |
| N1 | `.agent/reports/README.md` 57–58; `.agent/research/README.md` 226–227 | — | 10-adjacent | this line | narrow "Engraph's continuing 1.178.5 boundary" to "dated report with per-sync reopening addenda" — applied at the landing, 2026-09-20 (§Recompute at the landing) | carrier (owed) |
| N2 | `.agent/research/public-service-ai-tuition/AUTHORITY.md` | 80–85 | 10-adjacent | this line | add the 1.185.0 sync to the incorporation record — applied at the landing, 2026-09-20 (§Recompute at the landing) | carrier (owed) |
| N3 | `.agent/practice-index.md` | 367 | 5 | tip | ledger A9 (minor) | ledger |
| N4 | `.agent/reports/mcp-agent-facing-content-audit/registry.json` C355 purpose | — | 1 | tip | ledger A6; the generated pedagogy page repeats it and is not hand-edited | ledger |
| N5 | `.github/actions/setup/action.yml` | 13 | 11 | tip | ledger A10 (the v6.0.9 pin the Oak line's own bump left behind) | ledger |
| N6 | archived `director-handoff-current-handoff-state-2026-09-08.md` | 298 | 1 | this line (byte-proof archive) | leave: the archive declares itself history; the live counterpart (SPARK-6) is superseded | none |
| N7 | research chapters 08 (515, 33, 525, 2922) and 09 (2383) | — | 1, 5 | this line (pinned records) | leave; a collection-level addendum is optional; the root URL they link now answers 404 | none |
| N8 | ADR-217 index rows and body | 446–450, 577 | 1 | tip | the ADR's own status on the Oak line; ledger A7 | ledger |

Nothing was found for claims 2, 3, 4, 8, 9 and 12 in any file; every 1.181.x mention is dated
history; the only "ADR-228" prose is the correct index row for the Oak line's record; this line's
old `pnpm/action-setup` 6.0.10 pin is gone from `ci.yml` (the merge took v6.1.0).

## Reader 1 — the 55 keyword-hit files (read whole unless marked claim-level)

Hits: H1–H9 as indexed. Generated pages reading inconsistently with claim 1 (never hand-edited;
cured at the source, H12): `docs/governance/model-behaviour-content/README.md` L40, L51;
`domains/ux-accessibility.md` L15.

Read whole, clear: `.agent/rules/design-work-for-small-prs.md` (L30 historical);
`.agent/rules/one-pr-per-leaf-issue.md` (L105–106 dated measurement);
`.agent/reports/upstream-sync/upstream-report-draft-1.181.1-sync-2026-09-11.md` (dated);
`upstream-report-draft-1.181.3-sync-2026-09-15.md` (dated); `package.json` (1.185.0; the new
validator wired); `agent-tools/package.json`; `turbo.json` (L148–160 dated history);
`docs/engineering/extending.md` (L109–112 already name the ChatGPT package); ADR-125 (consistent
with claims 5 and 6; L709–711 marked historical at L820–824); the ADR index (ADR-228 row matches
claim 7; ADR-231 row matches claim 8; ADR-217 rows — N8); `README.md` (L41 still true);
`docs/engineering/quality-tooling-mcp-coupling.md` (L25 homonym: the Sonar MCP's instructions);
the cross-fork skill (1.181.x dated; ADR-231 cited); `.agent/rules/verify-dont-trust.md`
(L797–800 inside a dated 2026-06-23 instance; borderline, left); PDR-117 (L599–601 dated);
generated `agent-facing-routing-copy.md` (A012 present), `owner-signed-copy.md`,
`tool-usability--server-instructions.md` (consistent); `.agent/memory/active/napkin.md` (L29
history); `.agent/memory/operational/director-handoff.md` (L360 dated snapshot);
`pending-graduations.md` (L119 dated); `repo-continuity.md` (L372 names a work list; L620–623 is
this line's own discovery map, not a claim about the Oak line's decision); paused
`mcp-agent-facing-content` thread (L246 still true: A012 lives in
`agent-support-tool-metadata.ts`); paused `upstream-api-alignment` thread (L53 historical;
L289–297 the API's pagination header, a homonym);
`.agent/reports/spotify-portal-ai-plugins-exploration-2026-09-12.md` (Spotify's files);
`packages/design/oak-design-system/CHANGELOG.md` (L29 history).

Read at claim level (too large for one context), clear: `.agent/memory/active/archive/
napkin-2026-09-16.md` (1.181.x dated; the OpenAI challenge block dated 2026-09-09);
`.agent/memory/active/patterns/README.md` (L335 generic trigger); archived `director-handoff-
current-handoff-state-2026-09-08.md` (header "read it as history"; L298 and L833 dated — N6);
archived `director-handoff-upstream-line-2026-09-15.md` (L401–410 measured 2026-09-03);
`design-system-integration` thread (L224, L323 dated; L3044 homonym); `estate-coordination`
thread (every 1.181.x dated; L3314–3317 the 2026-09-16 landing proof); the research chapters 08,
09, 10, 12 (N7; L806/L847 other programmes' pages; L722 the collection's own position);
`agent-capacities-2026-09-09/report.md` (L212 Google ADK's page; A2A as external spec);
`current-source-delta-inventory.json` (every `src/landing-page/*` row reads "Governed source
deleted"; `robots-txt.ts` and `agent-discovery-link-header.ts` present); generated
`engineering-structural.md` (landing items Retired L1870–1952), `legal-licensing.md` (C351, C352
retired), `pedagogy.md` (Retired L2069–2262), `tool-usability--response-format-template.md`
(Retired L635–686), `tool-usability--tool-description.md` (no count asserted); the archived
`design-system-completion.plan.md` (H11).

## Reader 2 — 238 files under `.agent/plans`, `plans-backlog`, `rules`, `skills`, `directives`, `practice-core`, `prompts`, `sub-agents`, `experience` (claim level)

Verdict: three hits (H10, H15, H16); every other listed file clear at claim level. Checked and
left: `AGENT.md` L261 ("`pnpm check` always includes browser suites" — still true: the showcase's
Playwright config and the MCP app's `playwright.widget.config.ts` remain); `testing-strategy.md`
L738 ("MCP App HTML resources" = the widget resources); `mcp-served-surface-truth` L178 (a
pagination lane, not the discovery header); the commit skill's "owned skill" (ADR-125's class
name, not the `metadata.owned` trigger; root scripts still pass `--prefix=oak-`); no prose
"ADR-228" and no `pnpm/action-setup` pin in the set; `quality-gate-hardening.plan.md` L97
(`oak-banner.html` now under `widget/`; dated April 2026); the merged app's
`src/no-html-surface.integration.test.ts` matches claim 1. Bound: the reader's per-file reasons
beyond its nineteenth line were truncated in transit and are not conserved; the per-file verdict
is "clear at claim level" for every file in the conserved list except the three hits. The reader
also saved ten experience letters to its own scratch (a copy of tracked files, harmless).

## Reader 3 — 243 files under `.agent/memory`, `.agent/research`, `.agent/reports`, `docs/**`, `.claude/**`, `.agents/**`, `packages/**`, `apps/**`, `agent-tools/**`, `.github/workflows`, root files (claim level)

Findings: H13 (tip bytes, ledger) and H14 (owner definition, kept). Notes: N1, N3, N5. Checks
asked for: `ci.yml` L85 reads the v6.1.0 pin exactly; `upstream-carrier.yml` and
`upstream-mirror.yml` carry no `pnpm/action-setup` line; all 30 skill adapters under
`.claude/skills` and `.agents/skills` carry `name` and `description` only because their canonicals
declare no spec-portable field (correct output; `oak-parallax` shows `metadata.owned: "true"`
quoted); three listed paths are absent from the merged tree by staged deletion
(`.agents/rules/pr-target-is-engraph.md`, `.claude/rules/pr-target-is-engraph.md`,
`.github/merge-bot.json` — this line's remote lacks all three); the generated content-review
workspace was regenerated at the merge with A012 present.

Per-file verdicts (all clear at claim level unless stated): `.agent/README.md` (L14 still holds);
`claude-harness-integrations/cloud-environment.md`, `workflow-tool-operations.md`; `hooks/
README.md`, `hooks/policy.json`; `napkin-2026-09-07.md`, `napkin-2026-09-10.md` (dated);
`distilled.md`; the eleven `active/patterns/*.md` files; `collaboration/cross-lane-commit-
blocking.md`; `executive/agent-collaboration-channels.md`, `invoke-code-experts.md`, the two
`memory-state-substrate-contracts.*` files, `owner-signal-interpretation.md`; `operational/
README.md`, `collaboration-state-conventions.md`, `collaboration-state-lifecycle.md`,
`jim-next-2026-08-04-week-off-return.md` (frozen), `open-questions.md` (empty), `review-cost-
ledger.md` (dated rows), `team-resume-2026-08-03-matt-clear-run.md` (dated); threads
`continuity-memory-and-knowledge-flow` (L239 dated list), paused `agent-naming`, `agent-
operability`, `architectural-budget-system`, `curriculum-hub-demo`, `exploring-open-education-
resources`, `first-class-copilot-cli-practice` (platform adapters, not skill frontmatter),
`main-sonar-ai-profile-to-zero`, `mcp-product-analytics`, `skills-estate-organisation`,
`statusline-enhancements`, `strategy-and-plan-estate-holistic-review` ("228" is a count),
`typescript-estate-consolidation-review`, `workspace-config-isolation` (dated 2026-08-12),
retired `public-service-ai-tuition-review`; `operator-local/README.md`; `practice-index.md`
(N3); `reference/shell-and-tooling-gotchas.md` (L412 still true); `reports/README.md` (N1) and
twenty dated reports under `.agent/reports/**` (agentic-engineering tallies and ledgers, design
census files, `mcp-63-focused-successor-handoff-2026-07-27.md`, `merge-door-comment-evidence-
decision-2026-09-16.md`, `oak-curriculum-infrastructure-delta-2026-09-08.md` with its reopening
addenda, the two PR-66 reviews, `typescript-estate-consolidation-review/handoff-2026-08-03.md`,
`upstream-and-bulk-alignment-concept-exploration-2026-07-26.md`, `skill-usage-census-2026-09-
03.md` (L252 still holds), `why-written-lessons-kept-needing-the-owner-2026-09-16*.md`);
`research/README.md` (N1); the agent-capacities collection's README, programme, framework,
manifest and source index; `cognitive-systems/structured-thinking/*`; `directives-tier-review-
2026-09-10-efreet-findings.md`; `outreach/oisin-oce-navigator-design.md` (alpha OAuth facts
verified 2026-07-08, none refuted); the tuition collection's chapters 01–07, 11, 13,
`AUTHORITY.md` (L80–85 history, N2), `README.md`, the two probe assets; `reliable-atoms-
workspace-shape-exploration-2026-09-14.md`; `typescript-data-structures-and-algorithms-2026-09-
07.md`; the four `typescript-graph-foundations-2026-09-07/*` files; `upstream-sync-automation-
concept-exploration-2026-09-10.md` (dated 1.179.1/1.181.1); `windows-changeset-comparison-2026-
09-10.md`; `state/collaboration/conversations/owner-only-retention-enforcement-2026-09-11.json`;
`.agents/rules/*` and `.claude/rules/*` pointers (two absent); the fifteen `.agents/skills/*/
SKILL.md` and fifteen `.claude/skills/*/SKILL.md` adapters plus the two `whats-where.md`
reference copies; `.claude/settings.json` (L104 a fetch permission); `.github/PULL_REQUEST_
TEMPLATE.md`, `codeql/codeql-config.yml`, `copilot-instructions.md`, the three workflows;
`AGENTS.md`, `RULES_INDEX.md`; `agent-tools/README.md`, the two collaboration schemas, the
pr-tally fixtures README and three harvests (Spotify's marketplace manifests); the MCP app's
`docs/observability.md` (Vercel–Sentry "Marketplace plugin"), `docs/vercel-environment-config.md`
(H13), `package.json` (0.0.0-development; `playwright.widget.config.ts` is the widget suite);
`demos/README.md`, `oak-curriculum-hub/README.md`, `oak-design-showcase/README.md` (L30 the
showcase's own `/`), `fidelity-register.json`; `docs/architecture/README.md`; ADRs 041, 121
(names the aggregate only), 166, 173, 179, 197, 202, 213 ("MCP App views" = the widget), 216,
221, 230, 231 (no "ADR-228" prose remains); the seventeen `docs/architecture/foundations/*`
files; design decisions 001, 003, 004, 009, 010; `design-review/rubric.md` ("front page" = the
showcase's), `wow-verdict-register.json`; `docs/engineering/build-system.md` (L350 generic task
table), `mcp-servers-for-contributors.md`, `merge-bot.md` ("front door" = the merge command),
`pre-merge-analysis.md` (L153–164 cite ADR-231), `testing-patterns.md` (L54 `/healthz`; e2e files
at L86–88 exist); `docs/governance/README.md`, `design-token-practice.md` (L113–120 the widget
build), `development-practice.md` (H14; L402–403 research advice), the sixteen generated
`model-behaviour-content/**` pages listed by the reader (all consistent; `tool-usability.md` and
`unrendered.md` regenerated), `one-html-many-css-compositions.md`, `sonar-disposition-policy.md`
(L430 names the action with no pin); `docs/operations/sentry-deployment-runbook.md` (L269 a
probe; L335 `ui://` widget HTML), `troubleshooting.md`; `packages/core/safe-path/README.md`;
`packages/design/oak-design-system/KNOWN-ISSUES.md`, `docs/one-html-many-css-compositions.md`,
`studio-source/PRESERVATION-README.md`; `packages/libs/env-resolution/README.md`;
`packages/sdks/graph-corpus-sdk/README.md`, `package.json`, `tsconfig.json`,
`tsconfig.lint.json`; `pnpm-lock.yaml` (this line's diff is the graph-corpus-sdk importer plus one
deprecation line; no pin, no version claim).

## Reader 4 — seven very large files read whole (tuition chapters 08, 09, 10, 12; the agent-capacities report; the frictions register; the archived 2026-09-08 director handoff)

Verdict: no present-tense contradiction of any claim remains. Chapter 08 L515 (landing-page asset
refs, inside a catalogue pinned at 31e76a7), L33 and L525 (one plugin at the pin): weak, N7.
Chapter 09 L2383 links the root URL as "endpoint": a link, not a claim; leave. Chapter 10:
Learn Anything's landing pages, not this repository's. Chapter 12 L722: the collection's own idea
catalogue (A2A, WebMCP), not a claim about the Oak line's decision. Agent-capacities report: A2A
only as an external specification; the ADK "landing page" is Google's; Parallax status pinned.
Frictions register: F-37's Observed (L1166–1172, tip bytes, the dated 2026-06-14 audit) is claim
6's old fact, now carried by this line's status addendum (H7); F-16, F-54, F-57, F-110, F-164,
F-181–F-188 and this line's one-liners at 353, 618, 622, 3109 are clear; this line's added ranges
at the time of reading: 353, 618, 622, 1185–1192, 2530–2535, 2678–2778, 3109, 3132–3135,
3195–3199, 3633–3643, 3941–3957, 3969–3972, 4042–4379. Archived handoff: L298 (N6, the clearest
outdated fact in the sweep; the archive declares itself history and carries a byte-comparison
proof); L262, L401, L356 (29/30/38), L833, L993–994, L1147–1152, L871–874 all inside dated,
superseded blocks.

## Reader 5 — seven very large files read whole (the estate-coordination and design-system-integration threads; the 2026-09-16 napkin archive; the archived design-system-completion plan; generated pedagogy, engineering-structural and tool-description pages)

Verdict: four clear; H11 in the archived plan (three tip-identical passages citing the deleted
`landing-page.spec.ts` and Playwright config as live precedent; addendum applied); one
inconsistency in a generated page (pedagogy C355, N4, the registry purpose at the tip; not
hand-edited). Estate-coordination thread: this line's text at L15–20, 647–650, 1461–3659; every
1.181.x mention dated; L3656–3657's "seven 1.181.3 defects" verified against the work list, none
refuted. Design-system-integration thread: this line's text at L14–48, 209–210, 653, 659,
3806–3892; the landing-page material sits only in dated tip-identical sections (L218–256, L323,
L3242–3245). Napkin archive 2026-09-16: entirely this line's; L857–885 (the OpenAI challenge
route) not refuted; L470–472 dated 2026-09-10. Generated `engineering-structural.md`: landing
items Retired; no rows for robots.txt or the Link header because the registry has none (a
registry gap, not a wrong statement). Generated `tool-usability--tool-description.md`: C620's
`Link rel=next` is the API's pagination header. Adjacent, not a claim: L1106–1107 and
L1362–1364 of the archived plan route "the ADR-217 delivery tail" while ADR-217 still reads
Accepted (N8).

## Recompute at the landing, 2026-09-20

The sweep above was run against `engraph` at `cd847a2b3`. The merge landed against `9993647b1`,
four pull requests later (153, 155, 157, 158). Completeness boundary for the difference:
`git diff --name-only cd847a2b3 origin/engraph -- '*.md' '*.json'` named 45 files at
`bdbdda04a`; their ADDED lines were searched for every term of the twelve claims. Every matching
line was read (five by this seat's term list, eight by the claim pass's wider reading), and
none asserts a refuted premise: each is this lane's own record of the rehearsal
(the landing-page test taken as deleted, the renumbering to ADR-231) or a dated mention of an
earlier sync. Pull request 158's three files landed after that read; they were authored by
this seat with the change in view and cite no swept premise. The renumbering was re-checked on
the merged tree: no citation of the old `228-organisational-identity` path remains, and every
remaining "ADR-228" names the Oak line's record, the index's renumbering note, or this lane's
own dated channel record of the renumbering; no archive mentions it.

Dispositions applied at the landing that the record above listed as owed: the two index rows
for the 2026-09-08 infrastructure-delta report now give the report's date instead of calling it
current state (narrowed); the public-service research collection's authority file gains one
sentence that the 1.185.0 sync changed neither curriculum-graph surface it qualifies (addendum,
checked against the Oak line's diff of the two graph end-to-end checks).

## Pre-publication reviews of the merge commit, 2026-09-20

Two context-free subagent passes read merge commit `514c8100b` before it was pushed (recorded
here because a subagent transcript is not a destination).

- **Claim pass** (96 claims checked, 8 findings, all true, all cured in the following commit).
  One was false: the landing-page teardown (#928) shipped in release 1.181.4, read from the Oak
  line's first-parent log, where the ledger's preamble and the re-trued extraction plan said
  1.183.0. Six were misleading: the ledger's line numbers are the merged head's where its
  contract said the Oak line's tip; item D1 read as if the general dispatch scope had been
  widened; the ledger still wrote "the fork" against the owner's one-repository wording outside
  its reframed preamble; the ADR-228 list missed this lane's channel record; the C355 field was
  misnamed; rows N1 and N2 still read as owed. One was unsupported: the count of matching lines
  in the landing-time recompute. Every specific check passed: the ADR-231 record is consistent,
  the root manifest carries both validators at 1.185.0, the deleted test is absent, and no code
  names the removed landing-page option.
- **Integration code review** (code-expert; verdict approved, nothing blocks the merge; static
  reading only). The three conflict resolutions are correct; none of the Oak line's 32 deletions
  is still referenced by a file present only on this line; nothing the Oak line's new code
  depends on was changed here; no pin skew breaks CI. Four record-only items: a generator input
  present only on this line still named landing copy as in scope (cured on the carrier as the
  same class as C2, page regenerated); stale build inputs identical on the Oak line's tip
  (ledger item D9); the setup action's pin skew (already A10); ADR-125's own "(Claude Code)"
  text (already A11). Reviewers it named as focused follow-ups: docs-adr-expert on the
  renumbering and the ADR-189 addendum, config-expert on the merged build configuration.
