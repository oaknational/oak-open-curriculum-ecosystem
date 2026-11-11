# Spotify `portal-ai-plugins` — first-hand exploration

**Date**: 2026-09-12
**Subject**: [`github.com/spotify/portal-ai-plugins`](https://github.com/spotify/portal-ai-plugins) at `3c24ca3`
**Author seat**: Sandpiper weaves Updraft (`a96287`), claude-code / `claude-opus-5[1m]`
**Thread**: `agentic-engineering-enhancements`
**Settlement edits**: 2026-09-12, Nettle guards Pistil (`2de368`), on PR #135 — claims narrowed to
the evidence the report itself carries; the author seat had closed

## Review contract

**Purpose and intended impact.** Give a reader of this estate an accurate, first-hand account
of what Spotify's `portal-ai-plugins` repository is, how it is built, and what value it
enables for whom, by what mechanism — at enough resolution that someone deciding whether to
borrow from it, integrate with it, or ignore it can do so on evidence rather than on the
repository's own marketing.

**Questions a review should test.**

1. Is each section's evidence level stated — *read* for §2 and the structural claims of §3,
   *asserted by the subject* for Portal, CLI and AiKA runtime claims, *executed* or *probed*
   only where §5.1 says so — and does any sentence overstate its section's level?
2. Is the value section denominated in outcomes for named user groups, rather than in
   mechanisms?
3. Are the subject's own claims separated from what was independently verified — in
   particular the token-savings table?
4. Does the report steer any decision that belongs to the owner?

**Evidence standard and authority boundary.** Every structural claim comes from reading the
cloned repository's files in full — all 37 tracked files were read, none sampled. Claims about
Spotify Portal, the Portal CLI's runtime behaviour, and AiKA are **the subject repository's own
assertions**, marked at section level — here, in §4's prerequisites and in §5.4 — rather than
sentence by sentence (the contract as first written promised per-claim markers the report does
not carry); this estate holds no Portal instance and no Portal credentials, so none of them
could be exercised. One external corroboration was fetched (the npm registry metadata for
`@spotify/portal-cli`). One local shell probe was run, against a script written in this
session, never against the subject's code.

**Material non-goals.** This report authorises nothing. It does not recommend adopting,
vendoring, forking, or integrating with any part of the subject, and it does not rank the
ideas in it against this estate's existing mechanisms. Where the material raises a question
this estate would have to answer, the question is named and its factors laid out; the answer
is the owner's.

**Successful review.** A reviewer who checks the reproduction block, re-reads the subject at
`3c24ca3`, and finds each section's claims to hold at that section's stated evidence level. A
sentence that overstates its section's level is a contract failure and should be reported as
such, by line.

---

## 1. What it is, in one paragraph

`portal-ai-plugins` is Spotify's official packaging of **Spotify Portal** — their commercial
Backstage distribution — as installable plugins for three coding agents: Claude Code, Codex,
and Cursor. The **portal plugin** ships no application code: it is **agent instructions** (six
Markdown skills) plus **host manifests** (three JSON files) that make those instructions
installable, driving everything through one external dependency, the `@spotify/portal-cli`
npm package. A second, independent plugin in the same repository — **shunt** — does ship code:
hooks, transport scripts, two skills and an eval harness (§3.3), with `jq` as a prerequisite.
It has nothing to do with developer portals: it is a token-economy device that intercepts large
file reads and routes them to cheaper worker models, using the Portal CLI only as a transport.

## 2. Provenance and scale (read first-hand)

| Fact | Value |
| --- | --- |
| HEAD at exploration | `3c24ca3` |
| Tracked files | 37 |
| Repository size on disk | ~396 KB including `.git` |
| Commits, entire history | 6 |
| First commit | 2026-08-11 18:15:43 +0200 |
| Last commit | 2026-08-17 13:35:05 +0200 |
| Contributors | 2 |
| Licence on both plugin manifests | Apache-2.0 (full text in `LICENSE`) |
| Marketplace / portal plugin version | `0.1.0` |
| shunt plugin version | `0.2.0` |

The entire repository was authored in a **six-day window**, and nothing has been committed
since 2026-08-17. Both plugins are pre-1.0 by their own version numbers. This is an early
public artefact, not a settled one — a fact that bears on every claim in it.

There is no CI configuration, no release automation, no `package.json`, no test runner beyond a
hand-rolled bash harness, and no dependency manifest of any kind. `AGENTS.md` states the
absence of release automation as a deliberate design rule: *"Do not add release automation
unless a tagged GitHub release or another distribution channel is explicitly planned."*

## 3. How it is built

### 3.1 The layering: one canonical instruction source, three host manifests

```text
skills/                     ← the canonical workflow instructions (6 skills)
  setup/SKILL.md            ← 92 lines
  doctor/SKILL.md           ← 78 lines
  service/SKILL.md          ← 37 lines
  actions/SKILL.md          ← 35 lines
  feedback/SKILL.md         ← 32 lines
  search/SKILL.md           ← 25 lines

.claude-plugin/plugin.json  ← host manifest, "skills": "./skills/"
.codex-plugin/plugin.json   ← host manifest, "skills": "./skills/"
.cursor-plugin/plugin.json  ← host manifest
.claude-plugin/marketplace.json  ← marketplace listing both plugins
.cursor-plugin/marketplace.json  ← marketplace listing the portal plugin only
```

The Claude Code and Codex manifests point at the **same** `skills/` directory. The commit that
established this is named for it: `663f158 refactor: use skills as the only workflow source`.
`AGENTS.md` makes it a standing rule — *"Keep each workflow canonical in `skills/`"* — and
forbids publishing the skills separately: *"Do not publish the bundled skills as standalone
packages."*

This is the same shape this estate calls canonical-content-plus-thin-adapters. Here the
adapters carry no content at all: they are pure metadata (name, version, author, licence,
keywords, icon) plus a `skills` pointer. The Codex manifest is the exception — it carries an
extra `interface` block with store-facing copy, `defaultPrompt` suggestions, a brand colour,
and privacy-policy and terms-of-service URLs, because Codex's plugin surface demands them.

`CLAUDE.md` is a **symlink** to `AGENTS.md`, so the two hosts read one file. (This estate
forbids symlinks and uses thin pointer files instead; noted as a difference of practice, not a
defect in theirs.)

### 3.2 The portal plugin: six workflows over one CLI

Every workflow is prose that tells the agent which `npx @spotify/portal-cli` commands to run
and how to interpret the results. There is no code between the agent and the CLI.

| Workflow | What the agent is told to do |
| --- | --- |
| `setup` | Verify Node and npm, discover the CLI's command surface, list Portal instances, authenticate the chosen one, select it, then prove access with `actions list --json` |
| `doctor` | The same checks, strictly read-only — never install, authenticate, select, or mutate |
| `search` | `search <query> --limit 10 --json` over the software catalogue and TechDocs |
| `service` | Resolve a service to a canonical entity reference, then compose a briefing from `owner`, `service status`, and `service docs` |
| `actions` | Discover, inspect, dry-run, and invoke Portal actions from the instance's registry |
| `feedback` | Submit CLI feedback verbatim through `actions telemetry:submit-feedback` |

Three disciplines recur across the skills and are worth naming because they are the
load-bearing part of the design:

- **Discover the surface, never pin it.** The skills instruct the agent to run `--help`
  before relying on a command or flag. `setup` checks for the five expected commands (`auth`,
  `actions`, `owner`, `search`, `service`) and *stops* if they are missing rather than
  degrading. The plugin therefore does not encode the CLI's interface; it encodes how to find
  it. That is what lets a `0.1.0` plugin survive a CLI that has since reached `0.4.4`.
- **Credentials never enter the conversation.** `setup` opens with *"Never ask the user to
  paste access tokens, authorization codes, or other credentials into chat"*, and delegates to
  the CLI's browser login. `doctor` repeats it: *"Never request or print credentials, tokens,
  or authorization codes."*
- **Mutation is gated on a preview and a human.** `actions` requires inspect → `--dry-run
  --json` → show the user → execute only after authorisation, with `--yes` reserved for
  actions the registry marks destructive. It closes with *"Never infer successful execution
  from a dry run."*

Two smaller instructions show real operational care: `service` says *"Treat unavailable
workflows and dimensions as unavailable, not healthy"* — refusing the failure mode where a
missing incident feed reads as a quiet service; and `setup` says *"Never assume the default
authenticated Portal instance when more than one instance is listed"* — refusing the failure
mode where an agent acts on production because it was first in the list.

### 3.3 shunt: a hook-enforced delegation triad

shunt is a separate plugin, Claude Code only, and architecturally unrelated to Portal except
that it borrows the Portal CLI as its transport. Its own README states the layering:

> Three layers, from hard gate to soft suggestion:
> 1. **Hooks** block Claude from reading large files and redirect to the bulk-reader skill
> 2. **Scripts** handle the AiKA invocation and output cleanup
> 3. **Skills** tell Claude when and how to call the scripts

```text
plugins/shunt/
  hooks/hooks.json          ← PreToolUse matchers for Read and Bash
  hooks/check-file-size     ← 40 lines; blocks Read on files over 350 lines
  hooks/check-bash-read     ← 33 lines; blocks cat/head/tail/less/more on the same
  scripts/lib/aika.sh       ← shared transport: payload, invocation, error unwrapping
  scripts/bulk-read         ← 58 lines; delegates a read
  scripts/code-write        ← 60 lines; delegates a generation
  skills/bulk-reader/       ← 13 lines; when and how to call bulk-read
  skills/code-writer/       ← 17 lines; when and how to call code-write
  evals/                    ← 51 automated checks, 3 end-to-end cases, 4 benchmarks
```

The design commitment that makes it coherent is stated plainly in its README: *"Claude never
assembles bash pipelines from prose. It calls a script with named arguments. The scripts handle
everything internally."* The skill files are 13 and 17 lines because they carry only the
invocation shape and the judgement about when to use it; everything else is in the scripts,
where it can be tested.

Delegation goes through exactly one Portal action, `aika:invoke-chat`, with the worker mode
addressed **by name** and resolved server-side. The transport library documents the resolution
order — the caller's own mode, then their groups', then public ones — which gives a user a
private override for free: create your own `bulk-reader` and it shadows the public one with no
configuration.

`scripts/lib/aika.sh` is the most carefully written file in the repository, and its guards are
worth enumerating because each one names a real failure it exists to prevent:

- **The payload ceiling.** `aika:invoke-chat` input travels through `argv`, so the request must
  fit in `ARG_MAX`. The script defaults to 400 KB on macOS and 120 KB on Linux (citing Linux's
  128 KiB per-argument `MAX_ARG_STRLEN`) and refuses over-large requests with an explanatory
  error rather than failing with `E2BIG`.
- **The mode-less answer.** A stale pinned mode id only *warns* server-side and the turn runs
  without the mode's instructions — producing a plausible, generic answer under the wrong
  brief. The script reads `.mode.name` back from the response and **discards the answer** if
  it is absent, naming the stale override in the error.
- **Transport noise.** `npx` install notices and CLI warnings on stderr are captured
  separately so they cannot corrupt the JSON envelope on stdout.
- **Unparseable success.** Exit code 0 with garbled stdout is reported as a transport problem
  rather than falling through to the mode guard and being misattributed.
- **The confident answer about nothing.** `bulk-read` validates every path before sending: *"A
  typo'd path would be sent as an empty `<file>` block and produce a confident answer about
  nothing — fail loudly instead."*
- **Context-free generation.** `code-write` makes `--reference` mandatory: *"without a file to
  match patterns against, the worker would generate context-free code that fits nothing in the
  project."*

Files are wrapped in `<file path="...">` tags and streamed straight into a temp file rather
than through a shell variable, so a corpus never becomes a shell argument and file contents
survive byte-for-byte.

### 3.4 What shunt deliberately refuses to delegate

The README is explicit that knowing when *not* to delegate is part of the design: debugging
(*"requires Claude's reasoning, not a summary"*), editing (*"Claude needs exact content in
context"*), files under the threshold (*"delegation overhead exceeds savings"*), and
architectural decisions (*"judgment calls stay on Claude"*). Eval case 3 encodes this as a
test: given a bug on a specific line of a 602-line file, the expected behaviour is that the
agent does **not** delegate and instead reads with offset/limit.

Designing an eval for the case where your own feature must not fire is a distinct practice;
whether it is one worth naming in this estate is §7's fourth question, and is left open there.

## 4. What value it enables, and how

### 4.1 For an engineer inside an organisation running Spotify Portal

**What changes for them.** Questions that previously required leaving the editor — *who owns
this service, is it healthy, where is its runbook, who is on call, what can I trigger* — become
answerable inside the agent session, in natural language, without knowing the catalogue's
entity-reference syntax. And the agent can then *act*: the Portal actions registry is exposed
to it, gated behind dry-run and explicit human authorisation.

**By what mechanism.** The skill descriptions are written as trigger conditions, not feature
lists — `service` fires on *"who owns a service, whether a service is healthy, where its
runbook or docs are"*. The agent matches intent to skill, the skill names the exact CLI
command, the CLI carries the user's own authenticated session to their own Portal instance.
Authority stays with Portal: the catalogue is the source of truth, the actions registry
decides what is invocable, and the plugin is a translation layer with no state of its own.

**What must be true for the value to exist.** The organisation must run Spotify Portal — a
commercial product. There is no value here for anyone who does not. The plugin is Apache-2.0;
the CLI it cannot function without is published under `SEE LICENSE IN LICENSE.md` (npm
registry metadata, fetched 2026-09-12), which is not an open-source licence identifier. The
open licence on the wrapper does not make the capability open.

### 4.2 For an engineer running a large codebase through Claude Code

**What changes for them.** The context window stops being spent on bulk file content.
Reading a large file, or three files to answer one cross-cutting question, no longer consumes
the agent's own context — a summary comes back instead, and the corpus never enters the
session. The subject measures this as a **mean 90% saving on bulk reads** (see §5.2 for what
that number is and is not).

**By what mechanism.** This is the interesting part, and it is a genuine idea: **the saving is
enforced, not advised.** A `PreToolUse` hook on `Read` blocks any full-file read over 350
lines and returns a `reason` string that tells the agent what to do instead; a second hook on
`Bash` catches `cat`/`head`/`tail`/`less`/`more` reaching for the same file. On those reads the
agent cannot comply by accident of good intentions, because the direct path is closed; the
gate's edges — a compound Bash command carrying a pipe or redirect (§5.3), and code-writer, which
has no enforcement at all (§3.4) — are where the claim stops. The skill then supplies the
routing knowledge, and the script supplies the safe invocation.

The threshold is deliberately permissive in the directions that matter: a read with `offset`
or `limit` is always allowed, because a targeted read is evidence the agent already knows what
it needs. So the hook shapes *how* the agent reads rather than forbidding reading.

**What must be true for the value to exist** (as the README states it; §5.4 lists what was not
verified)**.** A Portal instance with AiKA enabled, `jq` installed, an authenticated CLI, and the
two worker modes available (public on the instance, or created by the user). The delegation is
one-shot by the README's account — it states that nothing is stored server-side, a claim §5.4
lists as unverified — so a follow-up question re-sends the corpus. The README argues this is the
right trade (*"Re-sending files is free where it matters, because the corpus goes to the worker
model and never enters Claude's context"*), which holds for context economy and does not hold for
wall clock or for the worker's own billing.

### 4.3 For Spotify

**What changes for them.** Portal reaches users where the work now happens. The `feedback`
workflow is the tell: it pipes user impressions of the CLI straight back to the Portal team
through a telemetry action, with the agent instructed to offer once and pass the text
verbatim, and to set the expectation that the channel is one-way. A product team that ships a
feedback path in its sixth commit is treating the agent surface as a product surface.

### 4.4 For a reader of this estate — the transferable ideas

Independent of Portal, four things in this repository are mechanisms rather than product:

1. **Hook-enforced economy.** A cost discipline expressed as a `PreToolUse` gate with a
   redirect message, rather than as guidance in a directive. The block's `reason` field does
   the teaching at the moment of the attempt.
2. **The three-layer delegation shape.** Hard gate → script with named arguments → skill that
   carries only the judgement. The explicit refusal to let the agent assemble pipelines from
   prose keeps the testable surface inside the scripts.
3. **Evals that encode known bypasses as passing tests.** `offset-zero` and `limit-zero` are
   recorded as `allow` with the reason *"known bypass, documenting behavior"*; `head-n-space-count`
   is recorded as `allow` with the reason *"Parser bug: -n and 5 are separate args, 5 is treated
   as file path"*. The suite pins current behaviour including its defects, so a fix is a visible
   eval change rather than a silent one.
4. **A negative eval for the feature itself.** Case 3 asserts that shunt must *not* fire on a
   debugging task.

## 5. What was verified, and what was not

### 5.1 Verified first-hand

| Claim | How checked | Result |
| --- | --- | --- |
| 37 tracked files, all read | `git ls-files`, then each file read in full | Confirmed |
| 6 commits, 2 contributors, 2026-08-11 → 2026-08-17 | `git log` over the full history | Confirmed |
| One canonical skills directory; the Claude Code and Codex host manifests point at it | Read the three host manifests and the two marketplace manifests (five files) | Confirmed |
| `@spotify/portal-cli` is published and current | npm registry metadata, fetched 2026-09-12; step 7 of §8 prints the dist-tags and the created and modified timestamps | Exists; latest `0.4.4`; first published 2025-10-07 (the licence field quoted in §4.1 came from the same fetch and is not printed by step 7) |
| The README savings table is arithmetically consistent with its own runner | Recomputed each row against `run.sh`'s integer floor arithmetic | Confirmed: 82%, 94%, 94%, mean 90% all reproduce exactly |
| shunt's `--instance` flag survives an instance name containing a space | Shell probe written in this session, reproducing the expansion `${SHUNT_PORTAL_INSTANCE:+--instance "$SHUNT_PORTAL_INSTANCE"}` against a stub, under `bash` | Confirmed correct — `--instance` and `my portal` arrive as two arguments, the space preserved. No defect |

### 5.2 The benchmark table is not reproducible from this repository

This is the most material finding, and it is checkable by anyone.

shunt's README publishes this table under the heading *"Tested against a 162K-line Java
monorepo"*:

| Scenario | Lines | Without shunt | With shunt | Savings |
| --- | --- | --- | --- | --- |
| Single large file | 4,014 | 33,684 tokens | 5,737 tokens | 82% |
| Source + test pair | 7,408 | 75,990 tokens | 4,148 tokens | 94% |
| Multi-file cross-service | 1,281 | 16,221 tokens | 821 tokens | 94% |

The repository's own `evals/benchmarks.json` defines scenarios of the same names, but points
them at the three committed TypeScript fixtures, whose line counts are:

| Fixture | Lines |
| --- | --- |
| `websocket-handler.ts` | 602 |
| `order-service.test.ts` | 55 |
| `user-service.ts` | 35 |

So the benchmark the repository can actually run reads 602 lines where the table says 4,014,
and 90 lines where the table says 7,408. The published numbers came from an internal Java
corpus that is not in the repository, and `bash evals/run.sh --benchmark` measures a different
and much smaller thing.

Two things follow, and they point in opposite directions:

- The table is **honest about its provenance** — it names the corpus it came from — and its
  arithmetic reproduces exactly under the runner's own method. It is not a fabricated number.
- The table is **not independently checkable**. A reader who runs the suite expecting to
  reproduce "82–94%" will measure something else, and the README does not warn them.

The method itself is also worth reading before citing the figure: tokens are estimated as
`chars / 4`, and for the code-write scenario output tokens are weighted 5× ("Opus pricing") —
both stated in `run.sh`, neither stated beside the table. The README is more conservative than
its own runner in one respect: it declines to print a percentage for the code-write row,
where `run.sh` would compute 100%.

### 5.3 A coverage gap in the Bash hook, derived from source

`check-bash-read` allows any command containing a pipe or a redirect, on the reasoning that
both indicate targeted reads. The checks are unanchored greps over the whole command line:

```bash
echo "$command" | grep -qE '\|' && { echo '{"decision": "allow"}'; exit 0; }
echo "$command" | grep -qE '>'  && { echo '{"decision": "allow"}'; exit 0; }
```

Read literally, any compound command containing a `>` anywhere is allowed through regardless of
what else it does — for example `cat big.ts; echo done > /dev/null`. The 17 Bash eval cases
cover the simple pipe and the simple redirect, both as intended allows; the compound-command
case is not among them. This is stated as a reading of the source, **not executed**: the hook
scripts were read, never run (see §6).

It is a gap in a cost-saving heuristic, not in a security boundary — the plugin's own README
frames the hooks as redirection toward a cheaper path, and the design already accepts that
code-writer has *"No enforcement"* at all. It is recorded here because a reader evaluating the
"hard gate" framing should know where the gate's edges are.

### 5.4 Not verified, and why

Everything about **Spotify Portal, the Portal CLI's runtime behaviour, AiKA modes, and the
`aika:invoke-chat` action** is the subject's own assertion. This estate holds no Portal
instance and no credentials, and obtaining them was outside the lane. Specifically unverified:
that the five CLI commands exist as described; that mode-name resolution follows the stated
precedence; that `aika:invoke-chat` is ephemeral; that the public `bulk-reader` and
`code-writer` modes ship on instances; and every token figure.

## 6. Limits of this report

- **Nothing in the subject was executed.** The lane declared, before the clone, that the
  third-party code would be read and never run, and that boundary was held after the reading
  discharged its safety premise, rather than widened on this seat's own judgement. So the 51
  automated eval checks are described from their definitions, not from a passing run. A reader
  who wants that evidence can get it with `bash plugins/shunt/evals/run.sh`, which the subject
  states needs no Portal access.
- **One point in time.** The subject is read at `3c24ca3`; it has not moved since 2026-08-17,
  but that is a fact about the past, not a guarantee.
- **No comparison.** The transferable ideas in §4.4 are described, never scored against this
  estate's existing mechanisms. That comparison is a separate piece of work and a different
  authority.
- **The npm fetch is metadata only.** The `@spotify/portal-cli` package was never downloaded,
  installed, or inspected.

## 7. Questions this raises for this estate

Named, with their factors. None is answered here; each belongs to the owner.

1. **Is hook-enforced context economy a shape this estate wants at all?** Factors: this estate
   already runs a `PreToolUse` guard layer and has recent first-hand experience of its costs —
   quadratic matching, a five-second hook timeout that fails open, and a multi-round review
   tail on the matcher itself. Adding an economy gate on `Read` lands in a surface whose
   behaviour under load is already a known sensitivity. Against that: context exhaustion is a
   live operational cost here, and the seat's own compaction boundaries are the evidence.
2. **Is worker-model delegation worth a transport this estate would have to own?** shunt's
   saving depends entirely on a second, cheaper model being reachable. Spotify's answer is
   their own product's action registry. Any equivalent here needs its own transport, its own
   failure guards, and its own answer to the one-shot-versus-replay trade.
3. **Does the "canonical skills, thin host manifests" packaging tell this estate anything it
   does not already hold?** The shape is this estate's own adapter doctrine, independently
   arrived at by another organisation — which is evidence about the shape, not a change to it.
   The specific detail worth weighing is that their host manifests carry *zero* content, where
   this estate's adapters carry a pointer line.
4. **Is "an eval that asserts the feature must not fire" a practice worth naming here?** It is
   cheap, it is checkable, and this estate's own doctrine on proving guards bite is its nearest
   relative. Whether it earns a home is a curation judgement.

## 8. Reproduction

The repository-derived numbers in this report (§2, §3, §5.2, §5.3) are reproducible from the
subject at `3c24ca3`. The rest are not: the npm registry metadata (§5.1) is an external fetch
dated 2026-09-12; the shell probe (§5.1) ran against a script written in this session; the
on-disk size (§2) depends on the clone; and the README's benchmark figures (§5.2) come from a
corpus the repository does not contain.

```bash
# 1. Clone, outside any tracked tree, and pin the commit this report read.
git clone https://github.com/spotify/portal-ai-plugins.git portal-ai-plugins
cd portal-ai-plugins
git checkout 3c24ca3

# 2. Scale and provenance (§2).
git ls-files | wc -l                                   # 37
git log --pretty=format:'%h %ad %an <%ae> %s' --date=short   # 6 commits, 2 authors
git log --reverse --pretty=format:'%ad' --date=iso | head -1 # 2026-08-11 18:15:43 +0200
git log -1 --pretty=format:'%ad' --date=iso                  # 2026-08-17 13:35:05 +0200

# 3. The file inventory this report read in full (§3).
git ls-files | sort   # the tracked set, including the CLAUDE.md symlink that find -type f omits

# 4. Skill and script sizes (§3.1, §3.3).
wc -l skills/*/SKILL.md plugins/shunt/skills/*/SKILL.md \
      plugins/shunt/hooks/check-* plugins/shunt/scripts/bulk-read \
      plugins/shunt/scripts/code-write

# 5. The benchmark mismatch (§5.2) — compare the README's line counts
#    against the fixtures benchmarks.json actually points at.
grep -A6 '| Scenario |' plugins/shunt/README.md
python3 -c "import json;print(json.load(open('plugins/shunt/evals/benchmarks.json'))['benchmarks'])"
wc -l plugins/shunt/evals/fixtures/*

# 6. The Bash hook's allow conditions (§5.3) — read, not run.
grep -n "grep -qE" plugins/shunt/hooks/check-bash-read

# 7. External corroboration (§5.1): npm registry metadata for the CLI.
#    Read metadata only; the package is not installed.
curl -s https://registry.npmjs.org/@spotify/portal-cli \
  | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['dist-tags'],d['time']['created'],d['time']['modified'])"
```

The clone for this report was made into this session's scratchpad directory, outside any
tracked tree, so it touched no gate and left no residue in this repository.

## 9. Related surfaces

- [Reports index](./README.md) — the report-tier contract this document is written against.
- [Research index](../research/README.md) — where exploratory source material belongs when it
  has not been promoted.
