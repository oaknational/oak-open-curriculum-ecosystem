## Napkin rotation — 2026-04-16

Rotated at 525 lines after 12 sessions (2026-04-14g through
2026-04-16) covering metacognitive correction on native wrappers,
start-right grounding, native wrapper compatibility gap investigation,
investigation answers, plan rewrite around value, plan validation and
simplification, recovering removed scope to companion plans, parent
plan reconciliation, parent metadata parity, education skills
exploration, native Sentry MCP adoption implementation, and cleanup
commit 2 (circular chain break). Archived to
`archive/napkin-2026-04-16.md`. Merged 3 new entries into
`distilled.md`:

- Reconcile parent when child changes runtime truth (Process)
- All gates blocking, no "pre-existing" exceptions (Process)
- "Tests use it" is migration surface, not justification (Process)

Extracted 2 new patterns:

- `patterns/circular-test-justification.md` (testing)
- `patterns/test-claim-assertion-parity.md` (testing)

Previous rotation: 2026-04-14 at 641 lines.

---

## Session 2026-04-16 — Sentry handoff refresh

## Session 2026-04-16 — OAuth supported-scope split for dynamic clients

### Surprise

Expected:
The existing OAuth metadata tests would already protect the distinction between
required tool scopes and PRM-advertised supported scopes.

Actual:
The security policy used one source of truth for both concerns, and the test
suite had encoded the now-stale assumption that `openid` must never appear in
`scopes_supported`.

Why expectation failed:
We had optimised around an earlier Clerk invalid-scope incident and baked that
 workaround into generation, tests, docs, and ADR narrative instead of keeping
tool-enforcement scope separate from dynamic-client compatibility scope.

Behaviour change:
Keep protected-tool required scopes minimal, but model PRM-advertised supported
scopes as a separate generated contract and regression-test both surfaces so
Codex/client fixes do not break other OAuth consumers.

### Surprise

Expected:
Updating the active Sentry plans would leave the restart surfaces broadly in
sync.

Actual:
The parent plan, collection index, strategic index, and continuation prompts
still taught conflicting closure criteria and next-step sequencing until they
were swept together.

Why expectation failed:
Authority drift showed up first in narrative and handoff surfaces rather than
in todo metadata.

Behaviour change:
When a live plan is repartitioned, sweep parent, child, index, strategic, and
prompt surfaces together before trusting the restart story.

### Surprise

Expected:
Once validation was the only remaining branch-critical work, the next session
would naturally pivot toward the search observability lane.

Actual:
The user clarified the intended order: finish validation, then continue with
the MCP-server-confined expansion plan, and leave broader search observability
to a later session and PR.

Why expectation failed:
I over-inferred sequencing from the plan topology instead of treating the
user's explicit priority correction as the authoritative state change.

Behaviour change:
When the user sharpens sequencing across companion plans, rewrite all restart
surfaces immediately and treat that correction as a first-class status update.

## Session 2026-04-16 — Vercel production release gating

### Surprise

Expected:
The new root `package.json` version policy could be enforced entirely through
the build command.

Actual:
That would have turned every non-release production deployment into a failed
build, which the user correctly called out as useless noise. The right control
point is Vercel's ignore-build path, not the build itself.

Why expectation failed:
I initially optimised for fail-fast validation without distinguishing product
misconfiguration from intentionally skipped production deployments.

Behaviour change:
When the desired outcome is "do not deploy this class of build", prefer the
deployment platform's explicit cancel/skip surface over converting expected
non-events into failing builds.

## Session 2026-04-16 — Workspace-owned build scripts and gate cleanup

### Surprise

Expected:
Moving the Vercel ignore-build script into an MCP workspace-owned
`build-scripts/` folder would be a tidy structural change with only local
follow-on fixes.

Actual:
The move exposed knock-on quality-gate issues across shared version handling,
Sentry config exports, search CLI runtime-config sizing, and `knip` export
hygiene. One turbo MCP test run also failed transiently even though the direct
package suite passed cleanly.

Why expectation failed:
I underestimated how many repo-level constraints converge on "simple" build
script changes once version metadata is shared across workspaces and all gates
are treated as blocking.

Behaviour change:
When moving logic out of root `scripts/`, immediately expect follow-on fixes in
shared config surfaces, export maps, and static analysis, and use `pnpm check`
as the authoritative closure signal rather than package-local success.

## Session 2026-04-16 — Shared Vercel build policy extraction

### Surprise

Expected:
Extracting the Vercel ignore-build policy into a new core workspace would be
mostly about moving code and wiring imports.

Actual:
The clean reusable shape was slightly split-brain: runtime metadata belongs in
a normal shared package, but Vercel's `ignoreCommand` still wants an app-local
entrypoint, so the best structure is a tiny app wrapper over shared workspace
logic rather than a pure package-only move.

Why expectation failed:
I initially treated "shared across apps" and "directly callable by Vercel" as
the same packaging problem, but they have different execution constraints.

Behaviour change:
For reusable Vercel deployment policy, keep the policy engine in a core
workspace and leave each app with a minimal local adapter script that matches
Vercel's entrypoint contract.

## Session 2026-04-16 — Collection-level observability drift sweep

### Surprise

Expected:
The earlier observability handoff sweep had already brought the relevant
restart surfaces into alignment.

Actual:
Collection-level index files such as
`architecture-and-infrastructure/README.md`,
`architecture-and-infrastructure/current/README.md`, and
`architecture-and-infrastructure/roadmap.md` still taught the pre-split story
that Search CLI adoption was the next implementation step.

Why expectation failed:
I corrected the parent plan, child/companion plans, and session prompts first
but did not complete the same sweep across the collection index layer.

Behaviour change:
When a workstream is repartitioned or re-sequenced, sweep collection README and
roadmap indexes alongside the active plans and prompts before declaring the
continuity story clean.

## Session 2026-04-16 — Turbo-sensitive MCP rate-limit proof

### Surprise

Expected:
Because the MCP rate-limit integration test passed in isolation, the same test
would remain stable inside the commit hook's concurrent turbo run.

Actual:
The test timed out only under the hook's broader concurrent gate load even
though the behaviour under test was correct.

Why expectation failed:
The assertion was valid, but the default per-test timeout underrepresented the
cost of full-app bootstrap inside the repo's real gate topology.

Behaviour change:
For broad integration tests that boot the full app and prove boundary
behaviour, set an explicit timeout that matches the real gate environment
instead of relying on the default unit-test-oriented timeout.

## Session 2026-04-16 — Report normalisation contract hardening

### Surprise

Expected:
The report-normalisation skill already enforced sibling clean-file output and
source preservation strongly enough to prevent in-place overwrite ambiguity.

Actual:
The skill and command wording still allowed in-place edits by interpretation,
which caused avoidable confusion about "validation against original markdown."

Why expectation failed:
The output contract was presented as optional modes instead of a hard invariant
set. The guidance mixed flexible phrasing with strict validation language.

Behaviour change:
For this workflow, encode non-negotiable invariants directly: always emit
`*-clean.md`, never overwrite source, source markdown defines structure, DOCX
repairs citations/links, and drift proof compares clean vs source.

## Session 2026-04-16 — Codex follow-up lane separated from Sentry validation

### Surprise

Expected:
The next planning move after the failed Codex auth experiment would fit inside
the active Sentry observability lane because both touched the same preview
deployment.

Actual:
The Codex issue proved to be a separate client-compatibility problem. The
attempted shared auth-metadata change did not unblock Codex and regressed
Cursor, so folding it into the Sentry closure lane would have mixed two
different decision surfaces and muddied the restart story.

Why expectation failed:
I over-grouped by deployment target instead of by decision boundary. Shared
preview infrastructure does not mean shared plan ownership.

Behaviour change:
When a client-specific compatibility issue emerges during an active deployment
validation lane, spin it out into its own follow-up plan and restore the
restart surfaces so the active lane remains operationally crisp.

## Session 2026-04-16 — Sentry validation closure pass

### Surprise

Expected:
The 12-item Sentry evidence bundle could be produced end-to-end from the
fresh preview alone, with owner-gated items raised as pre-emptive questions
before doing any more work.

Actual:
The user overrode that framing sharply. Handled/unhandled/rejected errors
and kill-switch were producible locally via a temporary, dev-guarded
`__test_generate_errors` tool under a session-specific release tag
(`SENTRY_RELEASE_OVERRIDE`) without any deploy. Source-map upload was
explicitly pulled forward from the expansion plan (EXP-E) into this closure
pass rather than deferred. The only legitimately blocking owner action was
alerting baseline wiring, and even that was only legitimate to raise after
doing the research.

Why expectation failed:
I defaulted to "raise any owner-touching item as a question" rather than
"research the tooling boundary first, then ask only what genuinely requires
ownership." Locally-generable evidence and scope movements inside our own
roadmap are not owner questions; they are agent work.

Behaviour change:
For validation closure passes, generate every locally-producible proof
item under a session-specific release tag before asking anything, pull
forward roadmap items that are genuinely closure-critical rather than
deferring, and only ask for owner action when the tooling itself cannot
reach the artefact (e.g. Sentry MCP tools do not expose alert-rule state).

## Session 2026-04-16 — CLIs are becoming first-class agent-facing tools

### Surprise

Expected:
Vendor CLIs were primarily human developer conveniences. Agents would
typically reach for SDKs or raw APIs rather than shelling out to CLIs.

Actual:
Modern vendor CLIs are being shipped with agent-awareness as a
first-class concern. The Clerk CLI ([clerk/cli](https://github.com/clerk/cli))
explicitly exposes `--mode agent` (vs `human`), a `--prompt` output for
AI agents, a flat `clerk api` subcommand for humans and agents alike,
and a `doctor --json` mode for structured health-check consumption.
The new `sentry` dev CLI similarly exposes a generic `sentry api`
surface and built-in Sentry AI integration. These tools are being
designed for autonomous consumption, not just interactive use.

Why expectation failed:
I was carrying a 2023-era mental model in which CLIs were a human
ergonomics layer on top of the "real" API, rather than a first-class
agent-facing capability surface that complements both the API and
the SDK.

Behaviour change:
When a vendor ships a CLI with agent-mode features, treat it as a
first-class integration surface:

- Install it the pnpm-first way (rule 3.5) where possible.
- Commit its scoping config per-workspace so project blast radius is
  bounded.
- Document it in README prereqs and in agent skills so both humans
  and agents discover it.
- Prefer the CLI over hand-rolled API calls for standard workflows,
  because the CLI tends to encode the vendor's intended auth, scoping,
  and idempotence semantics better than ad-hoc code.

This theme extends beyond Sentry to Clerk and probably to other
vendors the repo integrates with. See
`.agent/plans/architecture-and-infrastructure/future/clerk-cli-adoption.plan.md`.

## Session 2026-04-16 — Per-workspace CLI ownership, not root-hoisting

### Surprise

Expected:
A single root-level `devDependency` + single `.sentryclirc` at the repo
root was the obvious shape for Sentry CLI adoption, because it
minimises repetition across workspaces.

Actual:
The user's stated preference is the opposite: each workspace that uses
Sentry should declare the CLI as its own devDependency and commit its
own workspace-local config that limits the CLI to that workspace's
Sentry project. The three Sentry-using workspaces right now are
`apps/oak-curriculum-mcp-streamable-http`, `apps/oak-search-cli`, and
`packages/libs/sentry-node`; each should own its own scoping.

Why expectation failed:
I optimised for DRY ("install once, config once") without weighing the
blast-radius cost: a single root-level CLI config means any script in
any workspace can accidentally touch any Sentry project. Per-workspace
ownership makes project scoping visible at the workspace boundary, and
makes it impossible for a script in workspace A to pick up workspace
B's defaults by accident.

Behaviour change:
For vendor CLIs that are scoped per-project (Sentry, Clerk, and
presumably others), the default shape is **per-workspace ownership**:
workspace-local devDependency + workspace-local committed config. Only
hoist to the root if a cross-workspace concern genuinely requires it,
and justify the hoist explicitly.

## Session 2026-04-16 — `practice:fitness` is advisory, not blocking

### Surprise

Expected:
Following the distilled rule "All gates blocking, no 'pre-existing'
exceptions", `practice:fitness` violations at a commit boundary meant the
branch should not be committed until fitness was clean, even if the
violations were in files I had not touched.

Actual:
The user clarified explicitly that `practice:fitness` is advisory, not a
failure gate. Its output is always important and should be read, but
fitness-triggered changes must be "thoughtful and in some cases deserve
a separate session." Dragging unrelated directive-file length violations
into a tightly-scoped closure branch is precisely the wrong move.

Why expectation failed:
I collapsed two different gate families ("lint/type/test" vs
"practice:fitness") into one category because both were reachable from
`pnpm` scripts, and then applied the strictest interpretation uniformly.

Behaviour change:
Treat `pnpm practice:fitness` output as signal, not as a merge/commit
gate. At closure boundaries: read the output, record anything genuinely
new that the branch introduced, and raise the rest as candidate follow-up
work rather than scope-creeping into the active branch.

## Session 2026-04-16 — Infrastructure config belongs in the repo

### Surprise

Expected:
Running `sentry cli defaults org=… project=… url=…` to pin the new
`sentry` CLI to a single project was an acceptable guardrail because it
prevented cross-project writes from the authenticated user's account.

Actual:
The user pushed back: that command writes to `~/.sentry/cli.db`, which is
user-global and invisible to the repo. The pin exists only on whichever
machine ran that command. The stated principle is: **all infrastructure
configuration must live in code, in the repo.** Per-machine CLI state
violates that principle even when the state is "safer" than the default.

Why expectation failed:
I treated "constrain the blast radius" as the whole requirement and did
not check whether the constraint was reproducible, portable, or visible
to other contributors / agents.

Behaviour change:
When a tool has both a repo-tracked config file format (e.g.
`.sentryclirc`, `.envrc`, `*.config.ts`) and a user-global store, the
repo-tracked form is the only acceptable location unless there is an
explicit secrets reason otherwise. Prefer committing the config; then
document the binary prerequisite in README prereqs with a warning pattern
if the binary is missing.

## Session 2026-04-16 — Sentry has two CLIs, split by purpose not by age

### Surprise

Expected:
Sentry had a single evolving CLI, with `@sentry/cli` (npm) and the newer
`sentry` binary from cli.sentry.dev being two installation routes onto the
same tool. I wrote an earlier napkin entry in this session based on that
assumption.

Actual:
They are two separately maintained tools with different intended audiences,
per Sentry's own docs (<https://docs.sentry.io/cli/>):

- `sentry-cli` (distributable via `@sentry/cli` on npm, brew, or a curl
  installer) is the automation-focused CLI for CI/CD: releases, source
  maps, debug information files, code mappings, send-event, crons. It
  reads `.sentryclirc` (INI) discovered upwards from the current path, so
  config can live in the repo.
- `sentry` (<https://cli.sentry.dev/>) is the developer-time interactive
  CLI with Sentry AI: issue triage, event inspection, dashboards, `sentry
  api` ad-hoc API calls, plus release/sourcemap subcommands. Defaults are
  stored in `~/.sentry/cli.db` (user-global), not in the repo.

Why expectation failed:
I treated "the newer thing obsoletes the older thing" as the default
pattern, without reading the upstream doc banner that calls out the
purpose split explicitly.

Behaviour change:
Keep both tools, but route them by purpose:

- Any Sentry task that must run in CI, from `pnpm`, or as part of a build
  step goes through `sentry-cli` installed as a devDependency from
  `@sentry/cli`, with config in a repo-tracked `.sentryclirc`. This
  satisfies the "installable via pnpm → MUST be installed that way" rule
  and the "infrastructure config lives in the repo" rule.
- The `sentry` dev CLI is listed in README prereqs (optional) with a clear
  install link and a script-level warning pattern matching the `lsof` /
  `bun` / `jq` examples already in the repo. It is for local developer
  ergonomics, not for automation.
- When a script depends on a binary that cannot be pnpm-installed, it must
  fail fast with a link to the official install instructions and an
  explanation of the consequence.

## Session 2026-04-17 — CLI enumeration before owner questions

### Surprise

Expected:
Item 8 of the 2026-04-16 evidence bundle ("alerting baseline wiring") was a
genuine owner question because the Sentry MCP tools cannot list alert rules.

Actual:
The Sentry REST API exposes the rule state directly at three endpoints
(`projects/.../rules/`, `projects/.../alert-rules/`, and org-level
`combined-rules/`), and `sentry api` drives all three with the existing org
auth token. CLI enumeration resolved the state without owner involvement:
the project has zero rules of any kind. The "owner question" was really
"owner please create the first rule"; the enumeration work was ours.

Why expectation failed:
I let "the dedicated specialist tool doesn't surface X" collapse into "X is
unknowable from automation", skipping the generic REST surface that both
Sentry CLIs expose.

Behaviour change:
Before raising any owner question about observability or infrastructure
state, exhaust the CLI/API enumeration path and record the result in the
evidence bundle. The owner question, if any, then narrows to a concrete
action rather than a research request.

## Session 2026-04-17 — Promote a recurring pattern to an ADR at closure

### Surprise

Expected:
The Sentry CLI hygiene lane would be a narrow follow-up: add a devDep,
commit a config file, rewrite one shell script, close out. An ADR
felt disproportionate for something that narrow.

Actual:
Reviewer feedback reframed the lane. The per-workspace CLI ownership
pattern it applied — pnpm-installed devDep + workspace-local
`.sentryclirc` + `onlyBuiltDependencies` + `knip ignoreDependencies`
+ shared-library "no default project" rule + `require_command`
preflight + Debug-ID post-condition + user-global carve-out for
interactive CLIs — is exactly the shape the future Clerk CLI work
(and any subsequent vendor CLI) will take. Leaving it implicit in
scripts + one operations doc would force the next adopter to
re-derive the decision from code, and any deviation would land
without load-bearing review. Promoting it to ADR-159 made the
decision discoverable, linked it back through ADR-143 / ADR-010 /
ADR-154, and unblocked the Clerk adoption plan from citing a
concrete authority.

Why expectation failed:
I was scoping by size of the diff, not by reusability of the
decision. "Small lane" and "pattern-establishing lane" are
orthogonal — the lane was small precisely because the pattern was
clean, and that is exactly when an ADR captures the most value with
the least writing.

Behaviour change:
At lane closure, run a proportionality check on recurrence, not on
size: "Will the next workspace adopting this vendor / tool need to
re-derive the same decision I just made?" If yes, the ADR is cheap
insurance even when the originating lane is tiny. Related rule:
any closure where reviewer findings cluster around "but where is
this documented canonically?" is a strong ADR-worthy signal.

## Session 2026-04-17 — Reviewers land at different abstraction layers

### Surprise

Expected:
Running sentry-reviewer, docs-adr-reviewer, and code-reviewer in
parallel on the finishing diff would yield mostly overlapping
findings, with docs-adr-reviewer as the chatty one.

Actual:
The three reviewers found almost entirely disjoint issues at
different layers of the same artefacts:

- sentry-reviewer landed on *semantic correctness inside Sentry's
  domain model* — ADR-159 point 6 prescribed a PATH check that
  doesn't match the actual pnpm-local invocation path; the runbook
  told operators to verify the wrong UI surface (release page vs
  Artifact Bundles); the README still cited `upload-sourcemaps.sh`
  as an example of the dev-`sentry` pattern even though the script
  now demonstrates the `pnpm exec sentry-cli` pattern.
- docs-adr-reviewer landed on *mesh density and cross-reference
  hygiene* — one of the closure claims ("ADR-143 links to ADR-159")
  was asserted but not actually present; ADR-159's top-matter
  Related omitted ADR-154 even though the Rationale cited it;
  execution plan didn't name the new ADR.
- code-reviewer landed on *tiny mechanical polish* — `echo` to
  stdout vs stderr in a fail-fast helper.

No two reviewers raised the same issue.

Why expectation failed:
I was treating "reviewer scope" as roughly "which files does this
reviewer read" when in practice it is "at what layer of meaning
does this reviewer look." Three reviewers reading the same ADR will
disagree about what the ADR is *for*: correctness of domain
claims, quality of the cross-reference mesh, and quality of the
prose/code itself.

Behaviour change:
Deliberately route reviewers by abstraction layer, not by file
list. On finishing passes over mixed code+docs+ADR lanes, book
three layer-aligned reviewers (domain-semantics, docs/ADR mesh,
code polish) as a default and expect disjoint outputs. Treat
overlap as a warning sign that I've under-specified scope.

## Session 2026-04-17 — The enforce edge of the loop was quieter than the others

### Surprise

Expected:
The Practice's self-reinforcing loop (ADR-131) — capture, distil, graduate,
enforce — was evenly reinforced across its four stages. Napkin captures
surprises every session; distilled.md curates them; consolidation graduates
stable entries; rules and ADRs enforce.

Actual:
A cross-surface review on 2026-04-17 found the enforce edge structurally
quieter than capture and refinement. Before this pass, 3 of 12 commands
cited any ADR; `session-handoff.md` was an orphan of the very ADR that
created it (ADR-150); 5 of 24 rules cited an ADR at all; `consolidate-docs`
step 7 treated ADR creation as one option buried mid-prose rather than a
distinct graduation outcome; the ADR index was not mandated reading on any
onboarding path. ADR-131 §The Self-Referential Property had named exactly
this failure mode in advance: "If rules about rule creation cannot be
refined through the same loop, the enforcement stage is exempt from its
own governance."

Why expectation failed:
The loop was implemented one stage at a time — napkin skill first,
distilled.md later, consolidation command later still, the ADR corpus
throughout — without a structural check that each subsequent stage's
inputs referenced the previous stage's outputs. Capture produced napkin
entries; distil produced distilled entries; but "graduate" did not
structurally require "propose ADRs for stable architectural entries" and
"enforce" did not structurally require "cite the ADR you operationalise".
Material accumulated faster at the early edges than the later edges
could absorb. One symptom: the live ADR-144 prescribed one semantics
while distilled.md and the session prompt prescribed the opposite —
three incompatible teachings lived in the repo at once.

Behaviour change:
Treat the enforce edge as its own load-bearing step. Every new or
amended rule in `.agent/rules/` cites the ADR(s) it operationalises
at the top of the file. Every new or amended command in
`.agent/commands/` cites its establishing ADR. `consolidate-docs`
step 7a now explicitly scans `distilled.md` and recent napkin
surprises for ADR-shaped doctrine (stable, architectural, no
existing governance home) as a distinct graduation outcome, before
general graduation. Onboarding paths route agents to the ADR index
with a mandate to scan the "5 ADRs in 15 Minutes" block. The
three-zone fitness scale (ADR-144) names `critical` as a
loop-failure signal — reaching it triggers a three-question
post-mortem, not just a local edit. This is the loop learning to
check itself.

Verification (falsifiable):

- `grep -l "^Operationalises" .agent/rules/*.md | wc -l` ≥ 17 (up
  from 5)
- `grep -l "ADR-150" .agent/commands/session-handoff.md` non-empty
- `grep "Scan for ADR-shaped doctrine" .agent/commands/consolidate-docs.md`
  non-empty
- `pnpm practice:vocabulary` exits 0
- `grep "#start-here-5-adrs-in-15-minutes" AGENT.md README.md docs/foundation/quick-start.md .agent/skills/start-right-thorough/shared/start-right-thorough.md .agent/prompts/session-continuation.prompt.md`
  produces ≥ 5 matches

## Session 2026-04-17 — `.sentryclirc` composition is per-workspace clean

### Surprise

Expected:
Per-workspace `.sentryclirc` files might collide or surprise-override each
other when multiple workspaces set `org`/`project`/`url`, and we'd need a
wrapper script with explicit flags to keep project scoping honest.

Actual:
Both Sentry CLIs walk the ancestor chain from `cwd` and merge
`.sentryclirc` files with nearest-wins semantics. Running `sentry-cli`
from inside a workspace picks up that workspace's `.sentryclirc` ahead
of anything higher up. No wrapper script is needed; the committed
workspace-local config is sufficient, and cross-workspace contamination
is structurally impossible when scripts `cd` into their own workspace
before running.

Why expectation failed:
I was modelling the config model from the user-global `~/.sentry/cli.db`
shape and missed that the `.sentryclirc` model is explicitly designed
for monorepo per-workspace scoping.

Behaviour change:
Start with the upstream config-composition docs for any tool adopted
under per-workspace ownership; if composition is already clean, prefer
plain committed config files over custom wrapper scripts.

## Session 2026-04-16 — Fresh preview is a proof precondition, not a detail

### Surprise

Expected:
Once the Vercel Sentry env vars appeared to be configured, the available branch
preview could be treated as the live validation target for the Sentry evidence
pass.

Actual:
The preview was healthy and auth-enforced, but it still served broadened OAuth
metadata that no longer matched the rolled-back local source. That made it a
stale proof target even though the deployment itself was up.

Why expectation failed:
I treated "a preview exists" as equivalent to "this preview represents the
current branch truth." For validation lanes, deployment freshness is part of
the proof contract.

Behaviour change:
Before starting a deployment evidence pass, confirm not just env provisioning
but also that the preview reflects the branch's current source state. A stale
preview is a blocker, not a footnote.
