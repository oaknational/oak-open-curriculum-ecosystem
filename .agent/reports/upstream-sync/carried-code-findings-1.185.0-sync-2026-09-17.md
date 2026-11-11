# Findings ledger: the 1.181.3 → 1.185.0 sync (carrier #154, 2026-09-17)

**Review contract.** Purpose: record every issue found while integrating the Oak line's main
`d9138c8b9` (release 1.185.0) into `engraph`, from any source — the seat's own reading during
conflict resolution, regeneration and the premise sweep; this line's quality gates; the review
rounds on the carrier. Owner's word (2026-09-17): quality cures of code authored on the Oak line never ride
the sync and each becomes its own pull request later; a cure that a failing gate on this line forces is
made on the carrier and recorded here as gate-forced; issues in this line's own sync machinery are
fixed in their own lanes and recorded here for the record. Each item cites the file and its lines
as they stand at the carrier's merged head (where this line's merged edits shift a file, the
numbers differ from the Oak line's tip; the cited passages are byte-identical there, checked by
a context-free claim pass on 2026-09-20), the standard it misses, and the finding in the finder's words; no cure text beyond that. A reader
verifies each item reproduces at the cited tip before opening its lane.

## A. Code and prose authored on the Oak line: quality findings (cure in their own PRs, never on the carrier)

**Owner ruling, 2026-09-20 (card answer, verbatim label: "Cure here only what misleads
operators").** Items A2, A5 and A15 are routed for cure on this line, one pull request each: A2 landed (#162), A5 landed (#163), A15 landed (#166). Every other
item in this section is held for the Oak line and arrives here through a later carrier, because
each cure made here edits a file the Oak line authored and becomes a conflict at the next sync.

The Oak line's landing-page teardown (#928, release 1.181.4) removed the page and left the repository's
own documentation describing it. Each passage below is byte-identical to the Oak line's tip
(`git diff d9138c8b9 -- <file>` leaves the cited passage untouched; one file, `deployment-architecture.md`, carries this line's deploy-config-gate text elsewhere), so by the owner's constraint it
is cured in its own PR, never on the sync. Which line makes the cure is the ruling above: A2 on
this line, A1 and A3 on the Oak line (A4 moved to C2 and was cured on the carrier). Prose authored on this
line about the same subject was re-trued on the carrier. Standard for all of A1–A4: principles
§Misleading docs are blocking; §Target-architecture wording needs consuming-runtime evidence.

1. `apps/oak-curriculum-mcp-streamable-http/docs/deployment-architecture.md` lines 374, 398, 400,
   450–451, 462–463: the phase diagram lists "DNS Rebinding Protection" under Phase 2 and
   "Phase 5: Static Assets & Landing Page" with a "Landing Page Handler (/)", and the snippet
   calls `mountStaticContentRoutes(app, dnsRebindingMiddleware, …)`. Source at the same tip:
   `src/app/static-content.ts` says `/` has no route and returns 404;
   `src/app/bootstrap-security.ts` no longer constructs `dnsRebindingProtection`;
   `application.ts` calls `mountStaticContentRoutes(app, log, {...})` after
   `mountAgentDiscoveryLinkHeader(app)`.
2. `.agent/rules/confident-seats-proceed-and-report.md` line 34: "freeze-bound surfaces (served
   surface, auth path, landing page — …)" names a surface the app no longer has.
3. `.agent/skills/README.md` line 37 (the audience registry row): the curriculum skills' home is
   given as `.claude-plugin/marketplace.json` alone; the tree now also lists
   `plugins/oak-open-curriculum-chatgpt` through `.agents/plugins/marketplace.json` (Oak #968).
   The sentence below the table, authored on this line, was re-trued on the carrier.
4. (Moved to C2: the generator source is present only on this line, so the premise was this line's own.)
5. `agent-tools/src/workspace-census/subjects.ts` line 86 (identical on the Oak line's tip):
   `PLUGIN_MANIFEST_SUFFIX = '/.claude-plugin/plugin.json'` is the census's only plugin-manifest
   arm, so `plugins/oak-open-curriculum-chatgpt/`, whose manifest is `.codex-plugin/plugin.json`
   (Oak #968), is never a census subject; the Oak line's own tree carries both the package and the
   unchanged rule. This line's census plan gains a dated amendment on the carrier; widening the
   rule is a code change for its own PR. Standard: principles §Strict and Complete (a
   classifier that silently misses a member of its class).
6. `.agent/reports/mcp-agent-facing-content-audit/registry.json`, item C355's `behavioural_intent` field (identical
   on the Oak line's tip): "Determines the endpoint URL shown in the connection snippet: HTTPS on the
   Vercel host when present, else the localhost:3333/mcp dev default." The snippet went with the
   landing page; `served-origin.ts` lines 7–8 at the same tip say it fed the page "until that
   page was removed on 2026-08-20". Standard: §Misleading docs are blocking; the generated
   pedagogy page repeats it and is not hand-edited.
7. `docs/architecture/architectural-decisions/217-*` (server-rendered HTML in the MCP app) still
   reads `Status: Accepted` on the Oak line's tip after #928 removed the surface it decides; the ADR index
   rows repeat it. the Oak line's own ADR status, left as Oak's; recorded so the merge-back carries the
   question. Standard: §Misleading docs are blocking.
8. `apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md` lines 29 and 84
   (identical on the Oak line's tip): "names extra hosts for the DNS-rebinding guard" and "automatically
   included in the allowed hosts for DNS rebinding protection" — `dnsRebindingProtection` has been
   mounted on no route since 2026-08-20 (MCP-650); `ALLOWED_HOSTS` still feeds `deriveSelfOrigin`.
   Standard: §Misleading docs are blocking.
9. `.agent/practice-index.md` line 367 (identical on the Oak line's tip): the `.agents/` row reads
   "Portable skill, command, and rule adapters" and omits the new `.agents/plugins/marketplace.json`
   (Oak #968). Minor. Standard: §Documentation Is Infrastructure (stable indexes point and must not
   drift).
10. `.github/actions/setup/action.yml` line 13 (identical on the Oak line's tip): `pnpm/action-setup` pinned
    at v6.0.9 while Oak bumped its own `ci.yml` to v6.1.0 (#980) and left the composite action
    behind. Standard: principles §Consistent Naming's one-concept-one-value spirit for pins; the
    dependency-currency lane's SHA-pinned-actions leg.
11. The Oak line's ADR-125 amendments of 2026-09-08 and its ChatGPT package README qualify
    `plugins/oak-open-curriculum/` as "(Claude Code)" and call the ChatGPT package's source "the
    Claude plugin". Owner ruling on this line (2026-09-17, verbatim): "it is a Claude plugin, it
    is in no way constrained to Claude Code only". This line's `development-practice.md` definition
    ("never write 'Claude Code plugin' for the Oak plugin") stands; Oak's qualifier is the
    misstatement, and prose on this line never copies it (two rehearsal edits that had were corrected).
    Standard: §Consistent Naming (one concept, one name); §Misleading docs are blocking.

12. `apps/oak-curriculum-mcp-streamable-http/docs/middleware-chain.md` lines 73–127 (identical
    on the Oak line's tip; raised by Copilot on the carrier, round one): the numbered chain above
    correctly shows `GET /robots.txt` terminating before Clerk (MCP-703), but the "Complete
    Request Lifecycle" sequence diagram below still sends every request through `ClerkAuth` and
    has no robots branch, so the document contradicts itself. Standard: §Misleading docs are
    blocking.

13. `apps/oak-curriculum-mcp-streamable-http/src/app/agent-discovery-link-header.ts` line 51
    (identical on the Oak line's tip; raised by Copilot and then Codex on the carrier, rounds two
    and three): the docstring says the header "is set before routing and therefore rides every
    response". It is `app.use` middleware mounted at `application.ts` line 92, inside
    `setupPostAuthPhases` and after `initializeCoreEndpoints`, so by Express's registration order
    it rides only responses from routes registered after it and the default 404. The reviewers
    named `robots.txt`, the domain-verification challenge, the health routes and the signed
    asset-download route as earlier handlers; read at source for the mount order, not exercised
    per route. Standard: §Target-architecture wording needs consuming-runtime evidence.
14. `docs/architecture/architectural-decisions/122-permissive-cors-for-oauth-protected-mcp.md`
    lines 68–70 (identical on the Oak line's tip; raised by Copilot on the carrier, round two):
    the paragraph says the authenticated `/mcp` endpoint is Host-validated in the auth layer and a
    disallowed Host is rejected with `403` before authentication. Copilot reads
    `host-validation-error.ts` lines 69–70 as returning the canonical origin before the request
    Host is read when `CANONICAL_HOST` is set, with the standalone guard mounted on no route
    (consistent with A8). Reported, not reproduced by this seat; the reader reproduces before
    opening the lane. (Copilot's second point, an "incomplete" phrase, is its own masking of the
    words "Bearer token"; the file's text is complete.) Standard: §Misleading docs are blocking.

15. `apps/oak-curriculum-mcp-streamable-http/src/no-html-surface.integration.test.ts` lines 74–80
    (identical on the Oak line's tip; raised by Copilot on the carrier, round four): the test
    "serves no document at the root even to a client that asks for nothing else" asserts the
    status `404` only. With no `/` route and no terminal 404 middleware, the framework's default
    final handler answers that request with an HTML `Cannot GET /` document, so the application
    still serves HTML at the root while the test named for the no-HTML contract passes. The
    sibling test above it asserts an empty body; this one does not. Standard:
    `testing-strategy.md` (a test proves the behaviour its name states); §Misleading docs are
    blocking, for the test's name and comment.

16. `apps/oak-curriculum-mcp-streamable-http/src/mcp-registry/server-json.ts` lines 82–86
    (identical on the Oak line's tip; found by this seat on 2026-09-20 while removing a leftover
    build directory at the owner's word): the docstring says the artefact is written "under the
    gitignored `.generated/` directory, alongside the baked landing page", and
    `SERVER_JSON_ARTEFACT_RELATIVE_PATH` is `.generated/server.json`. No ignore rule covers that
    directory (`git check-ignore` on the path matches nothing, on this line and on the Oak line's
    tip), and the landing page no longer exists: its teardown took the ignore entry with it. A
    build that emits `server.json` leaves an untracked file in the tree. Standard: §Misleading
    docs are blocking.

17. `apps/oak-curriculum-mcp-streamable-http/docs/middleware-chain.md` lines 68, 120–121, 246,
    270, 305, 329, 372–374 and 402, and `src/app/health-endpoints.ts` lines 22, 32 and 36 (both
    identical on the Oak line's tip; found on 2026-09-20 by a context-free claim pass on the A2
    cure, verified by this seat with `git grep -i landing`): the document still describes a live
    "Landing Page Handler" at `/` (A12 covers only the robots branch of the same document), and
    the source comment says the root landing page is mounted in `static-content.ts` and that a
    probe could be handed the landing page. Standard: §Misleading docs are blocking.
    Addendum (2026-09-20, from the code review of A15's cure): when the document is rewritten,
    its chain gains one terminal phase, a JSON 404 for every request that reaches the end of the
    chain, after the diagnostic routes and before the error handlers; today it lists no terminal
    phase and its `GET /` diagram ends in HTML.

## B. Gate-forced cures made on the carrier (owner constraint 4)

1. `agent-tools/src/validators/plugin-skill-copies/plugin-skill-copies-fs.unit.test.ts`
   (added by the Oak line with its skill-copies validator): six tests failed this line's
   `windows-basic` check on the carrier's first CI run (run 35509685464, 2026-09-20). The
   walker under test joins its working paths with the host's separator, which is correct for
   real IO; the test's in-memory file system was keyed with forward slashes and did no
   normalising, so on Windows every lookup missed (`expected { skills: [] … } to strictly equal
   { skills: ['alpha', 'zeta'] … }`). The Oak line runs no Windows job, so the test had never
   run there. Cured in the test's facade only: it reads either separator as the same key. The
   walker's tree keys were already separator-stable by construction. Verified locally (10 of
   10) and by simulating the Windows join; the check itself is the proof on the next run.
   Standard: `principles.md` §Any User, Any Machine; the same class as this line's
   windows-portable fixture pass.

## C. Integration cascades cured on the carrier (files authored on this line meeting the change)

1. `apps/oak-curriculum-mcp-streamable-http/e2e-tests/string-encoded-numbers.e2e.test.ts`
   (line 64 at `engraph` `cd847a2b3`): a test present only on this line passed `getLandingPageHtml` to
   `createApp`, an option Oak #928 removed; `type-check` failed with TS2353 on the merged tree.
   The same class Oak cured on its own side in #987. Cured by dropping the option (the test's
   subject is string-encoded numbers, not the landing page). Standard: the divergence rule's
   "signature mismatches in auto-merged files".
2. `agent-tools/src/mcp-content-workspace/content-workspace-config.ts` line 49 (present only on this line): the
   ux-accessibility domain description read "Human-facing surfaces — the landing page, the
   widget, and authorisation and consent copy", and the generated governance README and
   ux-accessibility page carried it. Re-trued at the source and the pages regenerated. Standard:
   the cross-fork skill's §6 premise sweep (a generated page is regenerated, never hand-edited).

3. `agent-tools/src/mcp-content-workspace/render-index-page.ts` line 76 (present only on this
   line; raised by the integration code review, 2026-09-20): the governance index page's scope
   sentence ended "the human-facing landing and consent copy". Re-trued at the source to
   "authorisation and consent copy" and the page regenerated. Same standard as C2.

## D. This line's sync machinery (fixed in their own lanes)

1. **A bot-dispatched mirror run cannot move the mirror.** `.github/workflows/upstream-mirror.yml`
   fast-forwards `main` with the run's own token; scheduled runs succeed, but run 35240876819
   (dispatched by the bot under the `workflow-dispatch` scope, `actions: write` alone) failed the
   reference update with 403 while its reads succeeded — a dispatched run's token is capped at the
   dispatching token's permissions. Lane `fix/upstream-mirror-dispatch-token-scope`: a new scope,
   `upstream-mirror-dispatch`, carries `actions: write` and `contents: write` (the general
   `workflow-dispatch` scope stays `actions: write` alone); run 35241924531 under it moved `main` by 19 commits. Standard:
   principles §Target-architecture wording needs consuming-runtime evidence (the node's
   "dispatch works" rested on two runs that never reached the write).
2. **An unworked carrier goes stale and blocks its replacement.** The carrier workflow's duplicate
   guard keeps one open carrier regardless of how far the mirror has moved; #151 (1.181.4) sat 76
   commits stale until closed by hand. Lane `fix/upstream-carrier-supersede-unworked-stale`: a
   draft carrier whose head is still the sha in its name and that carries no
   `upstream-carrier-taken` label is closed on its record and re-cut at the mirror tip; a seat
   labels the carrier at pickup. Standard: the carrier node's own goal ("one draft carrier
   pull request exists at `main`'s tip").
3. **The merge-bot doc's scope table lacked the `workflow-dispatch` row and claimed the App holds
   no Actions permission** (`docs/engineering/merge-bot.md`, lines 107–111 and 197 at
   `cd847a2b3`). Re-trued in lane D1. Standard: principles §Misleading docs are blocking.
4. **git sleeps on the file-system-monitor IPC socket on this host** (observed, cause unproven):
   three instances in about 75 minutes on 2026-09-17 — a `git commit` in a fresh worktree slept 12
   minutes with no hook child (15:48Z); a peer seat's `git add` on the primary held `index.lock`
   about ten minutes (~15:58Z); the primary's `git status` answered `error: could not read IPC
   response` (16:13Z). Five `fsmonitor--daemon` processes ran, one per worktree of the one clone;
   `-c core.fsmonitor=false` avoids the socket. Not a code defect on either line; a host and
   worktree-topology finding for the harness-shell pattern and the worktree-hygiene rule.
   Standard: `one-instance-is-an-observation` (three instances, two seats: now a finding).

   **Probe, 2026-09-19 15:52Z–15:59Z (owner-approved; this seat; the trial worktree; read-only
   `GIT_OPTIONAL_LOCKS=0 git status --porcelain` under a 60-second alarm with trace2 timing; no
   commit, add, config write or daemon stop). Reproduced, with a dose-response.**

   | Condition | monitor on | monitor off |
   | --- | --- | --- |
   | Quiet (primary / trial / carrier) | 0.08s / 0.22s / 0.06s | 0.04s / 0.11s / 0.07s |
   | Run 1: 3 bursts of 100,000 files created then deleted in `node_modules/.fsmonitor-probe/` (5s per burst) | worst 9.79s, of which 9.60s inside the client's daemon query; others 1.8–4.1s | 0.08–0.14s on every sample |
   | Run 2: 4 bursts of 400,000 files (about 21s to create each) | 22.10s, 23.01s, 24.49s, 18.64s, one per burst; 0.2–3.5s between | 0.08–0.15s on every sample |

   The client's block lasts about as long as the burst of file events does, and the whole wait
   sits in the trace2 region for the daemon query; with `-c core.fsmonitor=false` the same
   command never exceeded 0.15s under the same load. The directory is git-ignored, so ignored
   churn is enough. A forced install was not run: the stop rule (reproduced under the synthetic
   load) fired. Not varied: two installs at once, commit hooks, a daemon dying mid-query (the
   trial's daemon was born 16:05:58Z on 09-17, after its hung commit, and the primary's at
   15:50:57Z on 09-19, so daemons here do die and respawn). The carrier worktree's daemon token
   reads `builtin:22.…`, 22 forced resyncs since its start. The 12-minute sleeps of 09-17 are
   consistent with this mechanism under minutes-long installs in several watched roots; that
   step is an extrapolation of the measured dose-response, not a reproduction of 12 minutes.
   Benefit side: with the monitor off, status is as fast or faster in all three worktrees, so
   the monitor buys this clone nothing measurable. Verdict for the owner: unset
   `core.fsmonitor` in the clone's local config and stop the five daemons; one line undoes it.
   After the probe: the trial worktree's status count is 986 as before, `MERGE_HEAD` is
   `cd847a2b3`, the probe directory is gone, no `index.lock` exists. Raw logs and the two
   scripts: the integrating seat's handoff instruments (`fsmonitor-probe-*`), which ride the coordination branch's records.
   **Cured 2026-09-19 ~19:42Z** at the owner's word, after the decision lenses and a second
   opinion from the curator seat (comms events a924faaf, c82ce1de): the monitor unset in the
   clone's shared configuration, five daemons stopped, none respawned, status 0.04s. Added
   datum from that seat: its read-only command on the primary slept ten minutes while this
   probe's churn ran in a different worktree, so the event backlog is host-wide; the probe's
   notice should have named the primary as exposed. The guard and the bounded enumeration are
   the sketch node `warranted-means-in-the-operating-environment`.
5. **Hardening follow-ups from the security review of lane D1** (not in that PR): a self-revoking
   dispatch token after use (an installation token can revoke itself); a ruleset on the mirror
   branch with `deletion` and `non_fast_forward` only (owner's admin act); a validator coupling
   each dispatchable job's `permissions:` to the scope that dispatches it. Standard: least
   privilege by construction (merge-bot doc §scopes).
6. **The host's shared browser cache did not hold the Chromium revision the lockfile's
   Playwright needs** (observed 2026-09-19, lane D1's first push): every browser test in two
   workspaces failed in 0ms with `Executable doesn't exist … chromium_headless_shell-1234`
   while the user cache held only revision 1243; `playwright install chromium` fetched 1234 and
   in the same act removed 1243. The cache is one per user, shared by every checkout and every
   other project on the host, and an install in any of them garbage-collects revisions the
   others need. Nothing in the repository declares or checks it. A candidate second instance
   for the sketch node `warranted-means-in-the-operating-environment`'s enumeration (ambient
   state a ceremony depends on, invisible to review); one instance, recorded as an observation.
7. **Two commit messages of this seat carry a commitlint `footer-leading-blank` warning**
   (`67330f696`, `e1fe4438b`): a wrapped body line beginning `word: ` parses as a footer
   token. The hook passes on a warning, so nothing stopped it; an amend to reflow the first
   was declined by the owner's permission layer and both are pushed. Practice since: each
   message is linted before the commit. Candidate cure for its own pull request: the
   commit-msg hook treats warnings as errors (`no-warning-toleration`).
8. **The carrier workflow's open-carrier listing reads one page of 100**
   (`.github/workflows/upstream-carrier.yml`, the `Find an open carrier` step, `per_page=100`
   with no pagination; present on `engraph` before lane D2): with more than 100 open pull
   requests into the default branch a carrier, or a duplicate, on a later page is not seen.
   Raised by Copilot on pull request 158, round seven, as an observation on unchanged code.
   Standard: principles §Strict and Complete (a guard that silently reads part of its set).
   Own pull request: `--paginate` with a slurped filter. Cured on this line in #165
   (2026-09-20): `--paginate --slurp` piped to `jq`, because gh refuses `--slurp` beside `--jq`.
9. **Stale build inputs left by the landing-page teardown** (identical on the Oak line's tip;
   raised by the integration code review, 2026-09-20): `turbo.json`'s `test:ui` and `test:a11y`
   tasks list `playwright.config.ts` as an input, and `.prettierignore` line 78 ignores the MCP
   application's `.generated/` directory; the application has neither since #928. Harmless to a
   gate; a stale pointer. Standard: principles §No unused code. Own pull request, with A10.

10. **The workspace census's `check` is in no gate, and its artefacts drift by construction**
    (found 2026-09-20 on #163 by this seat and Copilot): `facts.json` counts each subject's
    tracked files and Oak-marker hits, so any commit that changes those counts under `.agent/`
    or `agent-tools/` stales it (it failed on
    `engraph` at `93c35f285` with 20 stale entries and again after each of #163's base moves),
    and `rows.json` restates numbers that `facts.json` recomputes (the `.agent`, `agent-tools`
    and `plugins/oak-open-curriculum` rows carry counts now stale). Standard:
    `validators-must-recompute-not-just-record`. Own lane: a row cites the fact by key and never
    restates it; the check either enters a gate or its facts stop counting files.

11. **`DELETE /mcp` draws the terminal 404** (observed 2026-09-20 by the mcp-expert consult on
    A15's cure, landed in #166; a bare `DELETE` meets the accept gate's 406 first, one with a
    conforming `Accept` reaches the 404): no handler registers `DELETE /mcp`. MCP 2025-11-25
    Transports §Session Management, item 5, says a server that assigns session ids MAY answer
    such a `DELETE` with `405 Method Not Allowed` when it does not allow client-initiated
    termination (the `Allow` header is RFC 9110's rule for a 405); this app assigns no session
    (`core-endpoints.ts`, `sessionIdGenerator: undefined`), so the clause's precondition is
    absent. Two records disagree with each other on the point: the trailing-slash
    characterisation of 2026-08-06 recorded the fall-through to the framework's 404 as
    unprobed, and ADR-229 line 263 says the app answers `DELETE` with 405 today, which it does
    not. Own small lane: decide the answer (405 with `Allow`, or the 404 as the stated
    behaviour), re-true ADR-229, and a test without IO.

12. **Authored refusal bodies outside the content audit** (observed 2026-09-20 by Codex on #166,
    P3): the audit's boundary (`.agent/reports/mcp-agent-facing-content-audit/report.md` §2)
    counts authored refusal copy that reaches an agent, and the 403 `{ error: 'Forbidden' }` has
    a registry item, yet the two 406 bodies in `mcp-middleware.ts` (one for an `Accept` without
    `text/event-stream`, one for an `Accept` without `application/json`) and the 404 body in
    `not-found.ts` are recorded as implementation-only in the current-source truth set. Own small lane in the
    audit: one registry item per authored refusal body (three), and their review entries turned
    from `excluded` to `reviewed` with the item ids.

## Addendum, 2026-10-27 — the 1.186.1 sync removes the plugin surfaces

Upstream moved the plugins to oaknational/oak-ai-plugins (MCP-775, 2026-10-21; release 1.186.1):
`claude/plugins/`, `chatgpt/plugins/`, both root marketplace manifests, `validate-plugin-skill-copies`
and the four plugin integration tests are gone from both lines' trees, the last versions at release
v1.186.0. Items whose subject that removal takes: A3 (the audience-registry row; upstream re-trued it
to oaknational/oak-ai-plugins in the same change, and the carrier's resolution kept this line's row
with that fact), A9 (the `.agents/` index row omitting a manifest the tree no longer carries; the row
reads true as it stands) and B1 (the Windows cure to a test deleted with its validator; the test was
taken as deleted at the sync). A11 persists in moved form: upstream's 2026-10-21 amendment to ADR-125
still writes "the Claude Code plugin"; held for the Oak line as before.
