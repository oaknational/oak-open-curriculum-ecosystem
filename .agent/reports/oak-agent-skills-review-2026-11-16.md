# oak-agent-skills: read-only review, 2026-11-16

Subject: [oaknational/oak-agent-skills](https://github.com/oaknational/oak-agent-skills) at
`main` `aa4f22c`, the home of Oak's shared agent skills and the `oak-skills` tool that syncs
them into Oak repositories.

## Review contract

- **Purpose.** Give the repository's maintainers a clear picture of what is already strong, and
  a short, ordered list of what to do before the first release (0.1.0) and the pilot that
  follows it.
- **Questions tested.** Is the release path sound? Is the tool safe to run in a consuming
  repository? Are the six skills accurate? How does the skill format compare with the
  [Agent Skills specification](https://agentskills.io/specification)? What shows that the
  skills make agents behave better?
- **Evidence standard.** Each finding is labelled **run** (reproduced in a scratch copy outside
  the repository), **read** (read from source or the GitHub API), or **inference**. Each
  finding in the first table also states what observation would overturn it.
- **Method.** Read-only: nothing in the checkout or on GitHub was changed. Four reviewers
  covered the tool's code, CI and the supply chain, skill content, and evals; the specification
  comparison and the repository history were done directly. The top findings from each reviewer
  were re-checked against the files before inclusion.
- **Non-goals.** This report does not authorise or block a release, and it does not change the
  repository. The release decision belongs to the skills maintainers.
- **A successful review** checks the findings against the cited lines and reports any that are
  wrong, mis-sized, or missing.

## Summary

This is a strong start. The repository is five weeks old, and it already has the things that
are hardest to add later: a tool with no runtime dependencies, a release pipeline with no
long-lived npm token, a consumer workflow that keeps secrets away from untrusted code, and a
validator that knows the specific ways a skill file can misbehave in Claude Code. Those are
design decisions, and they are the right ones.

The findings below are the normal work of taking a well-built first iteration to its first
release. They are sized by one question: **can this be changed after release?** A published
npm version is permanent, and removing a skill from a profile is a breaking change for every
subscriber, so a small number of items are worth settling first. Everything else can be fixed
at any time, and the pilot is the right place to learn which of those matter.

- **Eight items to settle before 0.1.0** ([table](#before-the-first-release)). Most are small
  changes; one already blocks the release pipeline and is a one-line fix.
- **A set of improvements for the pilot period** ([list](#during-the-pilot)), none urgent.
- **One gap to plan for**: there is not yet evidence that the skills improve agent behaviour
  ([section](#evidence-that-the-skills-help)). A small first layer is described.

## What is already strong

These are specific, and each was checked.

**Release and supply chain**

- All nine GitHub Actions are pinned to commit SHAs, and each SHA matches its tag comment.
- Every checkout sets `persist-credentials: false`. Every workflow starts from read-only or
  empty permissions and grants write access per job.
- Publishing uses npm trusted publishing: no npm token exists to leak. Only the publish job
  holds `id-token: write`, and it publishes the exact tarball the gates checked, by artifact.
- `install-tool.sh` verifies a pinned sha256 before it extracts anything.
- Installs run with `--frozen-lockfile --ignore-scripts` everywhere.
- gitleaks scans the whole history in CI and again immediately before publishing, with rules
  for personal data as well as secrets.

**The consumer sync workflow** (`templates/workflows/oak-skills-sync.yml`)

- It runs on `pull_request`, not `pull_request_target`, and checks both who opened the pull
  request and that the branch is in the same repository.
- The job that runs package code receives no secrets. The job that pushes never runs package
  code, rejects anything that is not an ordinary file or folder, validates folder names, and
  refuses changes outside the skill folders.
- Untrusted values (titles, branch names) reach the shell only through environment variables.

This is a careful design for a hard problem, and many mature projects get it wrong.

**The tool**

- No runtime dependencies: only Node's built-in modules plus `git` and `gh`.
- Every `git` and `gh` call passes an argument array, with paths after `--`. The reviewer
  found no argument injection.
- Argument parsing and exit codes match the documentation. Temporary folders are always
  removed. `init` never overwrites an existing file and is safe to re-run.
- Strict TypeScript settings (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).

**The validator and the documentation**

- `validate` catches Claude Code's `` !`command` `` shell syntax, `.claude-plugin/` folders,
  symlinks, references that leave the skill folder, and dates such as 30 February.
- The description budget shows real understanding of how agents list skills, including the
  double listing in Cursor and Copilot.
- The documentation is plain, accurate about the tool, and honest about scope: for example,
  `CONTRIBUTING.md` says clearly who can open pull requests and why.

**The skills**

- `oak-tdd` is sound and portable. `oak-pr-create` has a clear approval gate before any push
  or pull request. `oak-ticket-start` gates the stash, the branch and the assignment, and
  never pushes. `oak-security-review` is an accurate and well-calibrated checklist.
- Every skill is a valid Agent Skills specification skill
  ([comparison](#compared-with-the-agent-skills-specification)).

## How the findings are sized

Three questions order the rest of this report.

1. **Is it a one-way door?** A published version cannot be withdrawn. A skill placed in `base`
   cannot be removed without a breaking change. A destructive command cannot be undone in a
   consumer's checkout. These come first.
2. **What carries the claim, and what would overturn it?** Each pre-release finding states its
   evidence and the observation that would make it wrong. Two depend on settings this review
   could not see, and say so.
3. **Whose decision is it?** Most items are the maintainers'. Two need a repository or
   organisation administrator. They are marked.

A finding being true does not make it urgent. Items that can be fixed at any time are listed
for the pilot period, without priority pressure. This sizing changes the order of the work; it
does not lower the bar for correctness on anything that ships.

## Before the first release

| # | Finding | Evidence | What would overturn it | Suggested change | Decision |
| --- | --- | --- | --- | --- | --- |
| 1 | The release pipeline fails today. The publish gates run the skill scanner with `--fail-on-severity high` (`publish.yml:113-120`), and the weekly scan has failed on `main` on 2026-11-02, 11-09 and 11-16 (issue #5) | read: run logs | A passing scan on `main` | The finding is a false positive at `oak-ticket-start/SKILL.md:81` (`git fetch` then `git switch`). Reword the step, or add one suppression scoped to the rule, skill and file, with an expiry | Maintainers |
| 2 | A manifest entry can make `sync` delete outside the skills folder. `manifest.ts:34-55` does not check skill names or `source`; `sync.ts:176` deletes `join(root, '.agents/skills', name)` recursively; `promote.ts:298` has the same shape | run: a key of `"."` removed every synced skill and exited 0; `"../.."` removed the checkout | A name check upstream of `readManifest` that this review missed | `schema/manifest.schema.json` already defines the right patterns. Enforce them in `readManifest`, and check the resolved path stays under `.agents/skills/` before any delete | Maintainers |
| 3 | The `publish` job runs outside the `release` environment (`publish.yml:144`). The environment is limited to `main` and has no required reviewers | read: workflow and environment API | An npm trusted-publisher entry that already names an environment (not visible to this review) | Add `environment: release` to `gates` and `publish`, name that environment on npm, and add required reviewers | Maintainers, with an npm org admin |
| 4 | Approval is not yet enforced. The ruleset "main (interim)" requires 0 approvals, no code-owner review and no status checks, and allows all three merge methods; `AGENTS.md` and `CONTRIBUTING.md` describe code-owner approval and squash merges | read: ruleset API | A second ruleset at organisation level | Require code-owner review and the CI checks, and allow squash only. The ruleset's name says this was always the plan | Repository admin |
| 5 | `oak-ticket-start` builds the wrong base ref. `git symbolic-ref --short refs/remotes/origin/HEAD` prints `origin/main` (`SKILL.md:76`), and step 5 runs `git switch -c <branch> origin/<base>` (`SKILL.md:85`), giving `origin/origin/main` | run: the command output | An agent run showing the prefix handled | Strip the `origin/` prefix, and add a fallback for when `origin/HEAD` is not set | Maintainers |
| 6 | `oak-accessibility-review` cites three WCAG criteria incorrectly, and `SKILL.md:32` asks the agent to name the failed criterion, so the errors carry into reports. Autoplaying audio is 1.4.2, not 2.2.2 (`web-and-interactive.md:58`). "Makes sense out of context" is 2.4.9 (AAA), not 2.4.4 (`wcag-2-2-aa.md:31`, `accessibility-checklist.md:13`). Plain language is 3.1.5 (AAA), not "WCAG 3.1" (`SKILL.md:42`) | read: WCAG 2.2 | The W3C text | Correct the three citations, and label AAA items as beyond the AA baseline | Maintainers |
| 7 | `oak-sos-draft` fetches only tickets updated in the last 16 days (`SKILL.md:42`), while step 3 needs every started and unstarted ticket and `SKILL.md:51` says never to report from a partial list. The `since:` input does not move the fixed windows | read | A second, unfiltered fetch elsewhere in the skill | Fetch open tickets by state, and derive the windows from `since:` | Maintainers |
| 8 | `oak-sos-draft` is in `base`. The guide reserves `base` for skills that apply to every repository (`contributing-a-skill.md:120`); this skill supports a squad meeting and does not act on a repository's code. Removal later is a breaking change (`contributing-a-skill.md:150`) | read | A decision that every repository's agents should carry it | Move it to an opt-in profile before any repository subscribes | Maintainers |

One more item costs nothing now and is hard to change later: `promote` strips trailing
whitespace from the patch it builds (`git.ts:10`, used at `promote.ts:301`), so a promotion
fails whenever the diff ends on a blank context line or holds a binary file (**run**). The
change is to read diff output without `trimEnd`. Promotion is the path by which engineers send
improvements back, so it is worth having right for the first pilot user.

## During the pilot

None of these blocks a release. Each can be fixed whenever it is convenient.

**Tool**

- `check` compares a skill with the hashes in the manifest, not with the installed package
  (`status.ts:56-66`), so editing a skill and its recorded hash together passes (**run**).
  Re-hashing the installed package makes `check` hold against deliberate edits as well as
  accidental ones.
- `status.ts:69` tests `entry in manifest.skills`, which also matches inherited object keys: a
  folder named `constructor` is treated as managed (**run**). `Object.hasOwn` fixes it.
  `hash.ts` skips symlinks, so a symlink added inside a skill passes `check` (**run**).
- User text reaches `String.replace` as a plain string (`promote.ts:83`, `101-107`), so `$&`
  or `$1` in a description or `--message` expands as a pattern (**run**). Passing a function as
  the replacement fixes it.
- `promote` pushes the branch before it fetches the pull request template and opens the pull
  request (`promote.ts:390-411`); a failure between the two leaves a branch with no pull
  request (**read**).
- `promote --new` removes drafts under both `.agents/skills/` and `.claude/skills/` when only
  the first was proposed (**read**).
- On Windows, Node writes `\` into symlink targets, so link comparison in `shims.ts` and
  `status.ts:44` reports every link as changed (**inference** from Node's source; no Windows
  CI job exists to confirm).
- `check` exits 70 when a tracked `AGENTS.md` is absent from the working tree (**run**).
- `validate` accepts an `updated` date that moves backwards or into the future
  (`updated-dates.ts:98`), and accepts the bundle code `oak`, which lets a bundle skill share a
  shared skill's name (`central-repo.ts:19`) (**read**).
- `check` treats every skill it did not sync as an error: exit 4 for any entry in
  `.agents/skills/` or `.claude/skills/` that `sync` did not write (`status.ts:68-73`,
  `troubleshooting.md:36`) (**read**). The policy is clear and deliberate. It meets one case
  worth deciding in the pilot: a repository that already keeps skills of its own, or has
  installed a vendor's skills with the standard skills CLI into the same two folders, cannot
  subscribe until they are moved or removed, and a bundle is held to the same budget as the
  shared skills. A list of folders the tool leaves alone would let those repositories join.
- Tests to add alongside the fixes: a promotion whose diff ends in a blank line, a manifest
  with an invalid name, and drafts in both folders. `hash.test.ts:22` currently asserts that
  symlinks are ignored.

**Supply chain**

- `init` advises consumers to exempt this package from Dependabot's cooldown and pnpm's
  `minimumReleaseAge` (`init.ts:60-63`, `127-130`). A cooldown of one or two days leaves time
  to deprecate a bad release before it reaches every repository.
- The gates job installs the scanner with only its top-level version pinned (`publish.yml:107`),
  in the job that builds the tarball. A separate job, or a hash-locked install, isolates it.
- Worth confirming with an administrator: the scope of the GitHub App key that the consumer
  workflow reads, and whether the central repository and consumers share one App.
- Repository defaults: workflow permissions default to `write` and Actions can approve pull
  requests (neither is reachable today, because every workflow sets its own permissions); no
  ruleset protects tags, and `promote` uses `v<version>` tags as its diff base.

**Skills**

- `oak-accessibility-review`: Oak's 7:1 target is correctly identified as 1.4.6 (AAA). Three
  additions make it usable: a source for the target, the 4.5:1 allowance 1.4.6 gives large
  text, and a definition of "where the brand applies". A third result state, "not verified,
  needs a person", suits checks that need a browser (keyboard pass, 400% zoom). Criteria worth
  adding for quiz and component work: 1.4.13, 3.2.1, 3.2.2, 2.5.1, 2.5.2, 2.1.4, 1.3.3, 2.4.1.
- `oak-security-review`: the trigger covers most changes, and "when asked for a security
  review" overlaps Claude Code's built-in command; a narrower trigger keeps it for the cases
  where it adds most. Candidate checklist additions: webhook signatures, mass assignment,
  prompt injection and LLM output handling.
- `oak-ticket-start`: an explicit confirmation before the ticket moves to In Progress; the
  no-Linear fallback still calls Linear tools at steps 3 and 6; "ticket or issue" in the
  description also matches GitHub issues.
- `oak-pr-create`: the "update a pull request" path has no step for pushing new commits, and
  the check for `gh` comes after the push.
- `oak-tdd`: define "undo it" (`SKILL.md:30`) so an agent does not reach for a reset.
- Across the set: a line telling the agent to treat ticket and pull request text as data, not
  instructions; and what to do when a repository's `AGENTS.md` is missing or silent.
  `templates/AGENTS.md:32` asks consumer agents to run `promote` without a confirmation step.

**Housekeeping**

- npm's `latest` tag points at the 0.0.0 name-reservation placeholder, so the README quick
  start works from 0.1.0 onwards.
- `@types/node` is at 22.x for a Node 24 engine; the 24.x line matches. Dependabot pull
  requests #4, #6 and #10 and issue #9 are open.

## Compared with the Agent Skills specification

The repository's format is a stricter subset of the specification: every Oak skill is a valid
specification skill. The repository adds rules the specification leaves open, and almost all
of them are deliberate and well reasoned.

| Aspect | Specification | oak-agent-skills | Reading |
| --- | --- | --- | --- |
| `name` | 1–64 characters, `a-z0-9-`, no leading, trailing or double hyphen, matches the folder | The same, enforced, plus an `oak-` or bundle prefix and the names Claude Code reserves | Conforms; stricter |
| `description` | Required, 1–1024 characters, says what and when | The same, plus a shared budget of 8,000 characters counted twice | Conforms. Descriptions run 273–379 characters, within the specification's guidance of about 100 tokens |
| `license` | Optional | Required (`MIT`) | Stricter |
| `compatibility` | Optional, up to 500 characters, for environment needs | Allowed; the guide names "a tool the skill expects" as its use | Available and unused: `oak-ticket-start` and `oak-sos-draft` need the Linear MCP server, and `oak-pr-create` uses `gh` |
| `metadata` | Open map of strings; distinctive key names advised | Closed set: `owner`, `updated`, `deprecated`, `source` | Stricter. `owner` and `updated` are generic names; a prefix avoids collisions |
| `allowed-tools` | Optional, experimental | Not allowed | Deliberate, and the safer choice for skills that act on GitHub and Linear |
| Other fields | Not addressed | `additionalProperties: false` | Portable. It also rules out Claude Code's `disable-model-invocation`, which suits skills that act on other systems |
| Folders | `SKILL.md` plus optional `scripts/`, `references/`, `assets/` | `references/` and `assets/` in use; symlinks and `.claude-plugin/` not allowed | Conforms; narrower |
| Body size | Under 500 lines; under about 5,000 tokens advised | Under 500 lines, enforced | Conforms. The largest body is about 3,200 tokens |
| File references | Relative to the skill root, one level deep | Existence and containment checked; depth not checked | Conforms in practice: no reference file links onward |
| Validation | `skills-ref validate` | The repository's own validator and schema | The repository's checks are a superset. Running `skills-ref` in CI as well would detect drift from the specification |

## Evidence that the skills help

The repository checks that skills are well formed, safe and adopted. It does not yet check
that they change agent behaviour for the better; no trigger or behaviour evals exist in the
tree or its history (**read**: all 100 commits). At this stage that is expected, and the pilot
is the natural point to add it. Three places already depend on such evidence:

- Skill descriptions make claims an eval can test: "including the criteria automated checkers
  miss" (`oak-accessibility-review`), "adds the judgement those tools can't"
  (`oak-security-review`).
- A description change that alters what a skill fires on requires a major version
  (`contributing-a-skill.md:150`). Today the author judges that alone.
- The description budget is "a starting cap, to tune in the pilot"
  (`description-budget.ts:6`). Tuning needs a measure.

A first layer sized to the pilot, smallest useful version first:

1. **A trigger matrix.** Ten to fifteen prompts per skill, three runs each, with all six
   skills and the agent's built-in commands in the listing. Include near-misses: "review my
   PR" (should not fire `oak-pr-create`), "create a branch called foo" with no ticket (should
   not fire `oak-ticket-start`), "write my weekly status" (should not fire `oak-sos-draft`).
   Run it on pull requests that change a description, as advisory, and attach the difference.
   That turns the major-or-minor question into a measurement.
2. **Order-of-action cases that need no judge model.** `oak-pr-create` runs no `git push` and
   no `gh pr create` before approval. `oak-ticket-start` creates the branch before `save_issue`,
   with Linear mocked.
3. **One seeded defect and one clean control** each for the security and accessibility
   skills, with a no-skill baseline. This is the test of the two claims above.
4. **A short pilot measurement note**: listing size and truncation per agent, misfires tagged
   by engineers, and `skill-feedback` issues and promotions per skill.

Two practical points. A top-level `evals/` folder keeps the cases out of the package, because
`package.json` ships everything under `skills/`. Claude Code's `claude plugin eval` can run
them from a temporary plugin assembled at run time, with a mocked `linear` server. Judge-scored
prose quality, coverage beyond Claude, and hard CI thresholds can all follow later.

## What this review did not see

- npm's trusted-publisher settings for the package (bears on finding 3).
- The scope of the organisation's Dependabot secret and where the GitHub App is installed.
- The design documents `AGENTS.md` says are kept locally. A pilot measurement plan may already
  exist there.
- Windows behaviour was read from Node's source, not run.
- Agents other than Claude Code were not exercised.

## Suggested order of work

1. Clear the scanner finding (item 1), so the pipeline can release.
2. Validate manifest names and contain deletes (item 2); fix the `promote` patch trim.
3. Put `publish` behind the `release` environment and tighten the ruleset (items 3 and 4),
   with an administrator.
4. Correct the three skills (items 5, 6 and 7) and settle the profile for `oak-sos-draft`
   (item 8).
5. Release 0.1.0, start the pilot, and add the trigger matrix alongside it.

The foundations here are sound, and the list above is short because of the care already taken.
