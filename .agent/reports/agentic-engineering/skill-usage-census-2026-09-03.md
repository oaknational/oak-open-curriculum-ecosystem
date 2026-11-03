# Skill usage census — 2026-09-03 (Flounder turns Estuary, c5cc2c)

Owner ask, verbatim: "which repo skills have rarely or never been used?" then "record the
skills data in a report, that is a lot of skills we are not using, and note that claude loads
some skills or rules twice because they appear in two locations and it doesn't appear to be
able to dedupe them." Recorded 2026-09-03 ~17:2xZ from two instruments on the owner's machine.
Nothing here is a decision; the closing section names the decisions the data surfaces and
lays out the factors for each.

## Review contract

- **Purpose and impact.** Give the owner a first-hand measurement of which repo skills are
  used, how often, and by which signal, so that the shape of the skills estate can be decided
  from data rather than impression. The report changes nothing itself.
- **Questions a review should test.** Do the headline counts reconcile to the full table and to
  the stated instruments? Are the bounds of each instrument stated honestly, including what it
  cannot see? Is the double-loading finding supported by the cited debug evidence and the
  documentation quoted? Does any line pick an answer to a call reserved for an owner-ratified
  deliverable rather than laying out the factors?
- **Evidence standard and authority.** Every number derives from the harness's own usage
  record, the local transcripts, or a logged debug run, by the commands in the Reproduction
  section below; the intermediate files are machine-local and the report is the record. The
  report has no authority
  over the skills estate; its shape is decided in owner-ratified plans and rulings.
- **Non-goals.** This is not a retirement list, not a measure of any skill's quality or
  correctness, and not a census of Codex or Cursor sessions.
- **A successful review** establishes that the counts reconcile and that every line stays on
  the considerations side of the line the reports README draws. Missing evidence or a
  contract mismatch is reported as a review thread on the carrying pull request naming the
  line; it is cured in the report, never argued down.

## Instruments and their bounds

| Instrument | What it counts | Window | Bound |
| --- | --- | --- | --- |
| Harness record: the `skillUsage` map in the Claude Code user config | Explicit invocations of a skill by name (the Skill tool or a slash command), summed per name, with the last-used time | Since the record began; every project on the machine | Claude Code only; Codex and Cursor sessions are invisible; a skill invoked under an earlier prefix is counted under that prefix (see the eras table) |
| Transcript census: the 53 local session transcripts for this repo and its worktrees | Sessions that invoked a skill (as above) and, separately, sessions in which the skill's canonical file path appeared (a read or a reference) | 2026-08-04 to 2026-09-03: the sessions whose transcript was last written in that span (the 30-day retention leaves no older ones); records inside a transcript are not filtered by their own timestamps | Sessions, not calls; the "appeared" column is inflated for skills whose path sits in every session's boilerplate (`commit`, `under-the-hood`, `working-with-agentic-ai`) |

Neither instrument sees passive loading: an always-active skill such as `napkin` or
`comms-channels` shapes a session without ever being invoked, so a low count there is not
evidence of disuse. The `oak-` prefix dates from 2026-05-22 (ff8254336); harness counts under
it run from 2026-06-12.

## Reproduction

Run from the repository root on the machine whose sessions are being measured. Paths use the
harness's own locations; `<project-dir>` is the directory the harness keeps for this checkout
under `~/.claude/projects/` (its name is the checkout path with separators replaced), and the
worktree checkouts each have their own. Only a directory's top-level `*.jsonl` files are
sessions (`-maxdepth 1`); the `<session>/subagents/` trees beneath them hold sub-agent
transcripts and are excluded. Enumerate the project directories by hand before running: this
report's cohort was five directories (the checkout and four worktrees) holding 53 session
files; a worktree kept under a differently named parent directory needs adding to the list.

```bash
# The canonical skill ids (the population of the table)
find .agent/skills -name SKILL-CANONICAL.md -exec grep -m1 '^name:' {} \; | sed 's/^name: *//' | sort -u

# Instrument A: the harness usage record, by invoked name, with the last-used time
jq -r '.skillUsage | to_entries[] | "\(.value.usageCount) \(.value.lastUsedAt/1000|floor|strftime("%Y-%m-%d")) \(.key)"' ~/.claude.json | sort -rn

# The census window. A session is in the cohort when its transcript was last written inside the
# window (file modification time); records are not filtered by their own timestamps, so a session
# that began before SINCE and was still active after it contributes whole. This report: 53 files,
# all inside the window, none older than the retention boundary.
SINCE=2026-08-04; UNTIL=2026-09-04

# The cohort's project directories, listed by hand (the harness's encoded names). This report's
# five, written relative to the checkout: the checkout itself (41 files); its
# .claude/worktrees/design-plan-truings (1), .claude/worktrees/merge-bot-merge (2) and
# .claude/worktrees/merge-bot-merge/agent-tools (8); and the sibling
# ../oak-open-curriculum-ecosystem-worktrees/typescript-estate-review-019fc3 (2).
DIRS="$HOME/.claude/projects/<checkout-dir> $HOME/.claude/projects/<worktree-dir-1> ..."

# Instrument B1: sessions that invoked a skill (the Skill tool or a slash command), one row per session and skill
for f in $(for d in $DIRS; do find "$d" -maxdepth 1 -name '*.jsonl' -newermt "$SINCE" ! -newermt "$UNTIL"; done); do sid=$(basename "$f" .jsonl); \
  grep -a -o -E '"name":"Skill","input":\{"skill":"[^"]+"|<command-name>/[a-z0-9-]+</command-name>' "$f" \
  | sed -E 's/.*"skill":"([^"]+)".*/\1/; s#<command-name>/([a-z0-9-]+)</command-name>#\1#' \
  | sed -E 's/^(oak|jc|engraph)-//' | sort -u | sed "s/^/$sid /"; done
# (every prefix era maps to the canonical id; this report's window held oak- keys only)

# Instrument B2: sessions in which a skill's canonical path appeared (a read or a reference)
for f in $(for d in $DIRS; do find "$d" -maxdepth 1 -name '*.jsonl' -newermt "$SINCE" ! -newermt "$UNTIL"; done); do sid=$(basename "$f" .jsonl); \
  grep -a -o -E 'skills/([a-z0-9-]+/)*[a-z0-9-]+/SKILL-CANONICAL\.md' "$f" \
  | sed -E 's#.*/([a-z0-9-]+)/SKILL-CANONICAL\.md#\1#' | sort -u | sed "s/^/$sid /"; done
# (canonical files sit at any depth under .agent/skills — cognition/, knowledge/,
#  domain-craft/ui-design/ — so the pattern must accept any number of directory segments)

# Aggregation. With B1's rows in uses.txt and B2's in reads.txt (each "session skill"), the ids
# in ids.txt, and Instrument A's rows in harness.txt ("count date key"):
#   per-skill 30-day session counts:      awk '{print $2}' uses.txt | sort | uniq -c   (same for reads.txt)
#   the table row for one skill:          grep -c " <id>$" uses.txt ; grep -c " <id>$" reads.txt ;
#                                          grep " oak-<id>$" harness.txt   (count and last-used)
#   sessions with any repo-skill invocation: awk 'NR==FNR{ids[$1]=1;next} ($2 in ids){print $1}' ids.txt uses.txt | sort -u | wc -l   (37)
#     (uses.txt also carries built-in commands such as compact and rename, which the pattern matches; restrict to ids)
#   sessions in the cohort:               the file count the loops iterated                     (53)
#   no trace at all:                      ids in ids.txt absent from both uses.txt and reads.txt (4)
#   never invoked under oak-:             ids in ids.txt with no "oak-<id>" key in harness.txt (29)
#   top-15 share:                         sum of the 15 largest harness counts over their total (3,069 / 3,112)

# The double-loading probe: one non-interactive run with --debug, then the skill lines of its log
claude -p 'reply with the single word ok' --debug --output-format text > /dev/null
grep -i -E 'Loaded .* skills|Loading skills from|plugin skills loaded' ~/.claude/debug/"$(ls -t ~/.claude/debug | head -1)"
```

Counting a session once per skill (`sort -u` per file) is what makes the 30-day columns
session counts. The transcript window is whatever the harness's retention leaves on disk.
Instrument A is a live record: the next invocation changes it, and there is no as-of-date
query. The full table below IS the snapshot of that record as read on 2026-09-03 (every `oak-`
key that is a current skill, with the three retired keys and the era totals stated in the
eras section), so a later reconciliation is against the table, not against the live file.

## Headline

| Fact | Value |
| --- | --- |
| Repo skills (canonical `SKILL-CANONICAL.md` files) | 61 |
| Current repo skills ever invoked under the `oak-` prefix | 32 |
| Current repo skills never invoked under the `oak-` prefix | 29 (none of them invoked in the 30-day window either; three of them, `codex-helper`, `gates` and `ground-truth-design`, carry one invocation each under the earlier `jc-` prefix, see the eras section) |
| `oak-` invocations recorded by the harness on current repo skills | 3,112 |
| Invocations carried by the top 15 skills | 3,069 (98.6%) |
| Retired `oak-` names still in the harness record (not in the table) | 3 names, 6 invocations (the record holds 35 `oak-` keys and 3,118 invocations in all) |
| Skills with no trace at all in the 30-day window (neither invoked nor appeared) | 4 |
| Sessions in the window with at least one explicit invocation of a repo skill | 37 of 53 (a 38th session ran only built-in commands such as `/compact`, which the invocation pattern also matches; the count is restricted to canonical ids) |

## The full table

Columns: harness invocations under `oak-` (all time), the last such invocation, sessions in the
30-day window that invoked the skill, sessions in the window in which its canonical path
appeared. Sorted by harness invocations, ascending.

| Skill | Harness uses | Last used | 30-day sessions invoked | 30-day sessions appeared |
| --- | --- | --- | --- | --- |
| `chatgpt-report-normalisation` | 0 | never | 0 | 1 |
| `claude-design-pipeline` | 0 | never | 0 | 3 |
| `codex-helper` | 0 | never | 0 | 3 |
| `cut-coordination-branch` | 0 | never | 0 | 3 |
| `dependency-currency` | 0 | never | 0 | 4 |
| `gates` | 0 | never | 0 | 4 |
| `ground-truth-design` | 0 | never | 0 | 0 |
| `ground-truth-evaluation` | 0 | never | 0 | 0 |
| `knowledge-safety-sweep` | 0 | never | 0 | 2 |
| `parallax-audit` | 0 | never | 0 | 3 |
| `parallax-decide` | 0 | never | 0 | 2 |
| `parallax-design-experiment` | 0 | never | 0 | 1 |
| `parallax-design-inquiry` | 0 | never | 0 | 1 |
| `parallax-frame` | 0 | never | 0 | 2 |
| `parallax-learn` | 0 | never | 0 | 2 |
| `parallax-product-experiment` | 0 | never | 0 | 1 |
| `parallax-synthesise` | 0 | never | 0 | 2 |
| `sif` | 0 | never | 0 | 6 |
| `slack-watcher` | 0 | never | 0 | 3 |
| `talk-to-slack-watcher` | 0 | never | 0 | 1 |
| `ticket-management` | 0 | never | 0 | 8 |
| `tsdoc` | 0 | never | 0 | 0 |
| `ui-visual-design` | 0 | never | 0 | 2 |
| `undo-change` | 0 | never | 0 | 2 |
| `update-dependencies` | 0 | never | 0 | 4 |
| `update-upstream-api-spec` | 0 | never | 0 | 0 |
| `visual-comparison` | 0 | never | 0 | 1 |
| `visual-verification` | 0 | never | 0 | 3 |
| `working-with-agentic-ai` | 0 | never | 0 | 33 |
| `complex-merge` | 1 | 2026-06-13 | 0 | 9 |
| `go` | 1 | 2026-06-24 | 0 | 2 |
| `under-the-hood` | 1 | 2026-06-28 | 0 | 33 |
| `retrospective` | 1 | 2026-07-23 | 0 | 1 |
| `the-codex-dialogues` | 1 | 2026-08-06 | 1 | 7 |
| `curator-pass` | 1 | 2026-08-07 | 1 | 5 |
| `working-with-graphs` | 1 | 2026-08-07 | 1 | 2 |
| `inter-practice-collaboration` | 1 | 2026-08-08 | 0 | 2 |
| `update-bulk-download-schema` | 1 | 2026-08-12 | 1 | 3 |
| `napkin` | 1 | 2026-08-13 | 0 | 4 |
| `comms-channels` | 1 | 2026-09-03 | 1 | 9 |
| `parallax` | 3 | 2026-09-02 | 3 | 6 |
| `coordination-fold` | 4 | 2026-08-19 | 2 | 5 |
| `design-system-usage` | 5 | 2026-08-13 | 4 | 10 |
| `cricket` | 5 | 2026-09-03 | 4 | 33 |
| `set-up-worktree-lane` | 7 | 2026-09-03 | 6 | 14 |
| `semantic-merge` | 8 | 2026-07-20 | 0 | 11 |
| `proportionality` | 15 | 2026-09-03 | 12 | 25 |
| `pr-lifecycle` | 30 | 2026-09-03 | 10 | 22 |
| `consolidate-until-done` | 35 | 2026-08-14 | 2 | 4 |
| `start-right-thorough` | 64 | 2026-09-03 | 8 | 10 |
| `wrap` | 66 | 2026-09-03 | 20 | 27 |
| `free-play` | 78 | 2026-09-03 | 27 | 30 |
| `start-right-quick` | 138 | 2026-09-03 | 4 | 34 |
| `concept-exploration` | 177 | 2026-09-03 | 30 | 33 |
| `reason` | 182 | 2026-09-03 | 7 | 32 |
| `plan` | 196 | 2026-09-03 | 20 | 25 |
| `consolidate-docs` | 203 | 2026-09-03 | 5 | 17 |
| `commit` | 251 | 2026-09-03 | 13 | 35 |
| `session-handoff` | 364 | 2026-07-26 | 0 | 15 |
| `start-right-team` | 627 | 2026-09-03 | 34 | 34 |
| `metacognition` | 643 | 2026-09-03 | 31 | 31 |

## Prefix eras in the harness record

The harness keys usage by the invoked name, so the estate's earlier prefixes remain visible.

| Prefix | Distinct skills | Invocations | Last invocation |
| --- | --- | --- | --- |
| `jc-` | 15 | 910 | 2026-08-09 |
| `engraph-` | 18 | 359 | 2026-07-19 |
| `oak-` | 35 | 3,118 | 2026-09-03 |

The harness record is per machine, not per repository, so the earlier eras are not all this
repository's history. An `engraph-` prefixed estate ran on this machine through July; its 18
skills are the same core that dominates the `oak-` era. The `jc-` invocations after the
2026-05-22 migration, including the six keys last used on 2026-08-08 and 09, come from a
personal repository on the same machine that runs its own `jc-` prefixed copy of the Practice
(verified: the only in-window transcript holding a `jc-` invocation sits under that
repository's project directory, and none under this repository's five), so this cohort is
complete and held `oak-` keys only. The table's "harness uses" column is the `oak-` era by
construction, and every never-invoked reading in this report is scoped to it: mapping the
earlier prefixes to canonical ids adds their 1,269 uses onto the same core, and touches the
never-invoked set in exactly three places, each a single invocation — `jc-gates` (2026-03-08),
`jc-ground-truth-design` (2026-05-11) and `jc-codex-helper` (2026-05-12). Five old-era names
(`decide`, `design-brief`, `lean-task-subagents`, `start-right`, `wrap-up`) are not current
skills.

## Reading the shape

The estate is a small working core and a long tail. Fifteen skills carry 98% of invocations:
the start-right trio, the cognition set (`metacognition`, `concept-exploration`, `reason`,
`free-play`, `proportionality`), `plan`, `commit`, `pr-lifecycle`, `wrap`, `consolidate-docs`,
`consolidate-until-done`, and `session-handoff` (whose invocations stop on 2026-07-26 because
wrap absorbed it at the owner's 2026-07-28 ruling).

The 29 never-invoked skills fall into classes with different meanings:

| Class | Skills | What the zero means |
| --- | --- | --- |
| Event-driven runbooks | `update-upstream-api-spec`, `update-dependencies`, `dependency-currency`, `cut-coordination-branch`, `undo-change`, `knowledge-safety-sweep` | Frequency is not their measure, and the zeros differ in kind. No upstream spec change fired in the window. The dependency event DID fire: the MCP-549 wave of 2026-08-11 (23 lockfile-touching commits in the window). `update-dependencies` landed mid-wave that day (63482f961 at 16:25; two further dependency fixes followed at 17:53 and 18:31, 73f9c4335 and 2671dc2e9) and `dependency-currency` on 2026-08-26 (7a44d9d84), after the wave. So `dependency-currency`'s zero is "introduced after the event", while `update-dependencies`' zero already contains dependency work done after it existed, on the lane that had just written it; whether the next dependency event routes through them is the open question |
| The parallax family | `parallax-audit`, `parallax-decide`, `parallax-design-experiment`, `parallax-design-inquiry`, `parallax-frame`, `parallax-learn`, `parallax-product-experiment`, `parallax-synthesise` (the orchestrator `parallax`: 3) | All eight components never invoked, ever; only the orchestrator has been used: the largest idle block, nine skill listings for one instrument |
| Design and visual | `claude-design-pipeline`, `ui-visual-design`, `visual-comparison`, `visual-verification` (`design-system-usage`: 5) | Never invoked, though their canonical files were read or referenced in a few sessions. Not explained by the lane's later pause: `ui-visual-design` landed 2026-08-12 (612bb7f3a) and `visual-verification` 2026-08-13 (d46242a41), and the lane shipped visual work on 2026-08-18 and 19 (05897c076, 3b276f0d6, e54be4b4d) matching their stated triggers without invoking them — the same bypass shape as the dependency wave |
| Search quality | `ground-truth-design`, `ground-truth-evaluation` | Idle with the search-quality lane |
| Multi-seat and cross-vendor instruments | `slack-watcher`, `talk-to-slack-watcher`, `sif`, `codex-helper` (`the-codex-dialogues`: 1, `inter-practice-collaboration`: 1, `comms-channels`: 1) | Need a second seat or a second vendor. Seat count per session was not measured: `start-right-team` (34 sessions) is the standard opener at any seat count, so its count says nothing about team size; the claims register's concurrent-seat history is the measure not taken. Until it is, the zero is either "no second seat" or a routing gap |
| Authoring and orientation aids | `tsdoc`, `chatgpt-report-normalisation`, `working-with-agentic-ai`, `gates`, `ticket-management` (`go`: 1, `under-the-hood`: 1, `retrospective`: 1) | `working-with-agentic-ai` is a primer whose path sits in every session's boilerplate (hence its 33 appearances) and which has never been invoked; whether people read it, these instruments cannot say. `under-the-hood` is the directed orientation entry and was invoked once (2026-06-28), otherwise its path appeared. `tsdoc` is the anomaly, since code shipped in the window |

## Skills and rules present in two locations

The owner's observation, verbatim: "claude loads some skills or rules twice because they
appear in two locations and it doesn't appear to be able to dedupe them."

What is on disk at f88be5afe:

| Surface | `.claude/` | `.agents/` | `.cursor/` | Canonical |
| --- | --- | --- | --- | --- |
| Skills | 70 entries: 61 directories plus 9 symlinks that resolve into `.agents/skills` (the vendored `clerk*`, `mcp-inspector`, `skill-creator`) | 70 directories, the same 70 names | — | 61 under `.agent/skills` (plus 9 vendored) |
| Rules | 125 files | 125 files | 127 files | 125 under `.agent/rules` |

The two skill adapters for one name differ only in their heading line ("(Claude Code)" versus
"(Cross-tool)"); both point at the same canonical file. Every rule file under `.claude/rules`
is a one-line pointer to its canonical.

What the Claude Code documentation states (the skills page,
<https://code.claude.com/docs/en/skills>, read 2026-09-03 against Claude Code 2.1.259; the
page carries no version stamp, so the quoted wording is as of that date): project skills load
from `.claude/skills/`; same-name conflicts resolve by source level (enterprise over personal
over project), plugin skills carry a `plugin:skill` namespace so they cannot collide, and
nested `.claude/skills/` directories surface under a directory-qualified name. The page does
not name `.agents/skills/` as a discovery location, so whether the `.agents/` projection is
also scanned is not settled by the documentation. The listing cost is documented precisely:
"The listing always contains every skill name, but if you have many skills, Claude Code
shortens descriptions to fit the listing's character budget, which can strip the keywords
Claude needs to match your request." `/doctor` reports the listing's context cost and its
biggest contributors; the Skills row of `/context` reports the size after the budget.

What a `--debug` run of Claude Code 2.1.259 on this checkout logged (2026-09-03 17:23Z), with
the machine-local path prefixes replaced by their portable forms:

- "Loading skills from: managed=…, user=~/.claude/skills, project=[<repo>/.claude/skills]" —
  one project directory.
- "Loaded 72 unique skills (72 unconditional, 0 conditional, managed: 0, user: 2, project: 70,
  additional: 0, legacy commands: 0)" — the 70 are the entries of `.claude/skills`: its 61
  directories plus the 9 vendored skills reached through its symlinks into `.agents/skills`,
  each loaded once.
- "Total plugin skills loaded: 38 (0 duplicate/user-owned entries skipped)" — figma 14,
  cloudflare 11, sonarqube 9, mcp-server-dev 3, frontend-design 1.
- No line in the log names `.agents/skills`; the directory is not scanned by this version.

So on this host the repo's skills are not loaded twice: `.agents/skills` is not scanned as a
directory, and the only entries Claude Code takes from it are the nine it reaches through the
`.claude/skills` symlinks, once each; `.cursor/rules` is a projection for another host. What
the 70-entry listing
does cost is its description budget (above). If the doubled loading was observed on another
host (Codex or Cursor reading both `.agents/` and `.claude/`), that is the place to measure;
the generator emits a projection per host precisely so each host reads one.

## Decisions this census surfaces, with the factors

Each item names a call that belongs to an owner-ratified deliverable and lays out what the
data says about it. None is decided here.

- **Whether the doubled projections cost anything on other hosts.** On this host the debug
  log settles it: one directory is scanned. Factors: the `.agents/` and `.cursor/` projections
  exist for Codex and Cursor, whose discovery rules were not measured; the generator emits one
  projection per host, so any cure belongs in the generator rather than in a hand deletion
  that regenerates on the next `skills:generate`. Discriminating evidence: the same debug-style
  probe on each other host.
- **What to do with the parallax family.** Nine listings for one instrument; the eight
  components have never been invoked and the orchestrator three times. Factors: the family
  was designed as a capability graph whose parts the orchestrator routes to, so the parts'
  zero may be by design; every listing costs description budget. Discriminating evidence: a
  session that invokes a part directly would appear under its name in the harness record.
- **Whether `session-handoff` keeps its own listing.** Its invocations stop on 2026-07-26,
  matching the ruling that made wrap the only close. Factors: it still appeared in 15 sessions'
  context in the window; a platform that runs handoff without wrap would need it. The call
  sits with the wrap and handoff doctrine, not here.
- **How to value the event-driven runbooks and safety skills.** Their measure is whether they
  are found when their event fires, which usage frequency cannot show. Three kinds of zero
  sit in the class: no event in the window (`update-upstream-api-spec`); an event that did
  fire (the dependency wave of 2026-08-11) around the skills that now cover it, with
  `dependency-currency` arriving after the wave and `update-dependencies` landing mid-wave
  and then unused by the two dependency fixes that followed it the same afternoon, which is
  the one observed instance of dependency work bypassing the skill; and composed use, where a
  parent skill runs the skill as one of its steps and no direct counter sees it
  (`coordination-fold`, invoked in two sessions, runs `cut-coordination-branch` as a mandatory
  step, which the census records only as appearances). Only the second kind can be tested, at
  the next dependency event: handled through the skill, or without it; the third kind needs a
  counter at the step, not at the slash command.
- **Whether idle families follow their lanes.** The search-quality skills are idle while
  that lane is paused, and their status follows the lane decisions recorded elsewhere. The
  design and visual family is different: two of its skills existed for a week of active
  visual work that did not invoke them (the class table has the commits), so for that
  family the data shows a routing gap during activity, not inactivity, and the question is
  whether the lane's next visual work routes through them.
- **Why `tsdoc` was never touched while code shipped.** Either the code-expert path covers its
  purpose or the skill is not on the authoring path it was written for. Discriminating
  evidence: the transcripts of the sessions that shipped code in the window.

## Two instrument findings from the same survey (added at the 2026-09-06 consolidation)

- **Demand versus registration.** For the lens skills the owner types the skill name
  between 4.6 and 7.3 times more often than the harness registers an invocation
  (metacognition 2,984 typed prompts against 643 registered uses, 4.6×; concept-exploration
  1,163 against 177, 6.6×; reason 854 against 182, 4.7×; free-play 571 against 78, 7.3× —
  the prompt history against the harness's per-name usage store, same survey, same
  machine); cadence skills agree; the
  model-chosen skills (commit, the worktree-lane set-up, the Cricket legs) run with
  near-zero typing. Likely mechanism, unverified: only the leading slash command
  registers, trailing names only when the model invokes them. The table above counts
  registrations, so it under-reads the lenses by that factor.
- **The real "loads twice".** Transcripts record rule injections as nested-memory
  attachments: one 2026-08 session (prefix b10c37fe) carries 1,056 rule re-injection
  attachments across eight worktrees under the repository's own platform worktree
  directory, naming 121 distinct rule files — reading a file under a nested checkout
  re-injects that checkout's whole rules directory. The two figures are separate counts
  (attachment records; distinct names) and the per-worktree split was not retained in the
  machine-local data, so the total is not eight times the name count. The cure direction,
  worktrees in the sibling directory rather than under the repository root, is the shape
  the worktree-residency rule already requires.

Data files for this census are machine-local and not tracked; this report is the record.

## How to read this census (owner, 2026-09-03)

The owner's reading rule, given the day the census landed (verbatim gist): include the
top 100 and read the table "like a risk assessment, but for value". Some skills are rare
but high impact (metacognition, free-play, concept-exploration, reason); some are new
(the parallax family); some fire only at key moments (pr-lifecycle, proportionality).
Frequency alone is the wrong instrument: a rebuilt table carries, beside the counts,
a trigger class and a landed date for each skill, and a frequency census is never
presented as a value verdict.
