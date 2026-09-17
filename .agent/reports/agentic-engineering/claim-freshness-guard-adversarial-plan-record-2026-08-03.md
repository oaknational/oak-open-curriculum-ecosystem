# Adversarial plan-review record — claim freshness and guard degraded states (2026-08-03)

Session record for the three adversarial review rounds that shaped the
delivery plan `claim-freshness-and-guard-degraded-states` (PR #745,
MCP-476/MCP-477), plus incidental discoveries and session lessons that
would otherwise live only in one session's context. Authored by agent
seat Lava lifts Brimstone (session b3467b) as a knowledge-safety
capture at owner word ("this is not a closeout, it is knowledge
safety", 2026-08-03). The adjudicated OUTPUT of every accepted finding
is the plan text itself; this record adds what the plan does not carry:
the dispositions, the rejections with reasons, and the trajectory.

## Shape of the loop

Owner instruction: "Turn that into a decision complete repo plan, then
read it adversarially, take it apart, fix it, repeat." Three Workflow
fleets over the plan file and the hook-policy sources, all reviewers on
opus with schema-forced findings (severity × axis: correctness /
goal-alignment), adjudication goal-aware at the seat between rounds.

- **Round 1** — six reviewers (assumptions-expert, architecture-expert-
  wilma, test-expert, security-expert, code-expert, frame-challenger):
  42 findings, 6/6 needs-work. Broke the frame.
- **Round 2** — three reviewers (assumptions, security, test): 22
  findings. Confirmed the frame, hardened mechanisms.
- **Round 3** — two reviewers (security, test): 13 findings. Predicates
  and fixtures only. Declared converged; residual review moved to
  per-slice PR rounds.

Convergence read: each round attacked a strictly lower design altitude
(frame → mechanism → predicate), which is the review-ratchet's
shrinking test satisfied.

## Round 1 — what broke and where it went

- **Source-direct guard execution falsified** (5/6 reviewers,
  independently): the dispatcher graph imports `zod` (node_modules) and
  `@oaknational/result` (workspace package whose exports resolve only
  to gitignored built `dist`), so "fresh clone guarded from instant
  zero" was unachievable; the `.ts`-specifier migration also reds the
  `esm-import-extensions` smoke gate (35 specifiers / 12 files), a
  `.claude/hooks/*.ts` entry has no tsconfig/lint/vitest home, and a
  PATH Node below type-stripping support fails silent-open. →
  **Dropped entirely** (plan D11); child-process + dist architecture
  retained. The friction-ratchet discipline (three signals against a
  shape → reconsider the shape) fired as designed.
- **In-gate expiry notice rejected** as a tolerated warning and a
  vigilance mechanism (no-warning-toleration; structure-over-vigilance)
  → the owner-ratified plan-gate-drift split adopted: clock-free gate
  validator + session-open drift instrument (plan D3, ADR-223 §5).
- **Dispatcher availability/verdict conflation**: a malformed
  `.agent/hooks/policy.json` hard-blocks Bash+Edit+Write including the
  edit that would repair it — the real surviving brick → discriminated
  outcome with tagged error classes (plan D6).
- **ADR-167 durable-log regression** → log retained on every degraded
  path; ADR-167 named as a consumer.
- **Back-stamped grounding dates** → per-row evidence dates ruled
  (D12); `pinned_to: null` explicitly-unverified vocabulary adopted
  from PDR-133 §8 (whose §8 a reviewer surfaced as the governing
  sibling — folded into ADR-223).
- **Test-doctrine violations in the acceptance proofs** (`.agent/**`
  reads in tests — absolute owner doctrine; subprocess proofs tiered as
  integration; wall-clock ceilings) → proofs re-tiered (pure fixtures /
  smoke tier / one-off measured records).
- **Rejected or transformed rather than folded verbatim**: the
  suggestion to fold freshness rules into `validate-policy-reappraisal`
  (rejected: distinct remit — decay contract vs content doctrine — and
  the registry carries per-surface risk class; recorded in plan
  Mechanism); the suggestion to validate prose mirrors against
  policy.json (transformed: pointer-dedup now, mirror validation named
  a follow-up residual, D13).

## Round 2 — mechanism hardening

- **Single-decision-line invariant was asserted, not mechanical**:
  under `stdio: 'inherit'` the shim cannot observe child stdout, and a
  double decision line is a silent allow on Claude Code 2.1.220 →
  piped-stdout buffering with an emission decision (D16).
- **Classification mechanism unstated** → closed set of tagged error
  types thrown at source, `instanceof` at the boundary, **untagged
  throws default fail-closed** (D6).
- **Timeout contradiction found first-hand**: docs say a timed-out hook
  blocks; the installed 2.1.220 binary carries "hook timed out —
  output discarded", implying proceed → recorded as a CONTESTED vendor
  clause with a named pre-merge probe (D7/D8). Lesson: a docs-cited
  answer and the installed binary are two different evidence rungs.
- **`ask` unproven in non-interactive contexts** (headless `claude -p`,
  bypassPermissions, subagents) → D8 probe set with a pre-agreed
  outcome mapping so no probe result requires a fresh judgement call at
  merge time; the missing-artefact class reverts to loud-allow if ask
  proves to be refusal in unattended contexts (the install catch-22
  argument survives every round).
- **Copilot exposure corrected**: three availability classes (not one)
  move block→allow+log on ask-ignoring hosts → recorded as the
  owner-visible D9 choice, not a side effect.
- **Reason strings**: raw `error.message` leaks absolute paths (ENOENT
  carries the home path) → fixed hand-written per-class reasons;
  diagnostics only in the durable log, repo-relative (D17).
- **Pin-drift collector named as a new attack surface** (PATH
  shadowing, prompt injection via injected stdout) → allow-list,
  no-shell, strict version extraction spec.
- **Slice-1 sequencing defect**: wiring the validator before the rows
  it validates cannot land green → merged into one landing (executed
  exactly so in commit 5310fbe50).
- **Third SessionStart shim clone flagged** against
  consolidate-at-second-consumer → one generic parameterised
  `session-drift-alert.mjs`, registered twice (D15).

## Round 3 — predicate precision

- **Zero-route default inverted** (the round's blocker): every
  PreToolUse payload IS a tool call, so "unrecognised envelope → ask"
  was an open denylist reachable by vendor drift — a content-policy
  bypass on ask-ignoring hosts. Now: zero-route refuses hard unless the
  payload is **provably actionless** by a closed
  no-command/content/path-key predicate (plan Mechanism, AC6 rows).
- **Both `PolicyUnavailableError` tagging sites named** (read/parse arm
  in `loadPolicySnapshot` AND schema rethrow in `unwrapPolicySection`);
  integration proofs must inject UNTAGGED production-shaped errors so
  they exercise production's tagging, not the mock's.
- **D16 predicate corrected from byte-count to content** (buffer ends
  in newline + last line parses as JSON), with flush discipline at the
  dispatch entry — `process.exit` racing a piped stdout write turns a
  crash-during-deny into a proceed.
- **Live defect found first-hand**: the landed
  `plan-gate-drift-alert.mjs` SessionStart registration is bare-path
  with no exec bit — exit 126 — so the ratified gate-expiry alert has
  been **silently inert since it landed**. The generic-shim migration
  in Slice 1 revives it with the execution-mode-independent
  `node "${CLAUDE_PROJECT_DIR:-.}/..."` form. (A silent-failure
  instance of exactly the disease this lane treats.)
- **Dated correction (2026-08-11):** that observation was true at the
  round-3 snapshot but is no longer live. Commit
  `e9ac696362120153757f3046b776e91829570e52` restored mode `100755` on
  2026-08-06. The generic-shim migration retains its
  execution-mode-independent `node ...` form and second-consumer
  consolidation value; it no longer claims to revive an exit-126 hook.
- Instrument checker must alert on an unreadable policy file (its own
  compensating-control duty); collector gains byte cap, scrubbed env,
  fixed candidate dirs; stdin JSON-parse diagnostics are a second
  hostile-text carrier (V8 quotes the input head — verified with a
  secret-shaped fixture); smoke fixtures moved off the live tree onto
  mkdtemp roots with the sentinel `pnpm-workspace.yaml`.

## Fleet economics

| Round | Agents | Model | Tokens | Wall clock |
| ----- | ------ | ----- | ------- | ---------- |
| 1 | 6 | opus | ~878k | ~14 min |
| 2 | 3 | opus | ~442k | ~14 min |
| 3 | 2 | opus | ~309k | ~10 min |
| docs verification | 1 | (agent default) | ~96k | ~1 min |

Full findings corpora live in the session's machine-local workflow
journals (`~/.claude/projects/...-b3467b/subagents/workflows/
wf_92369b5e-cf2 / wf_acc57205-e4d / wf_5d9e7756-c44`, journal.jsonl).
They are expendable once this ledger exists — the knowledge is here and
in the plan; the bytes are not the record.

## Session lessons (napkin-class, dual-homed here for push safety)

- **Commit identity and `gh` identity are separate credential
  surfaces**: this session's PR #739 went out on the owner's keyring
  via bare `gh pr create` although author/committer were already the
  bot via shared git config — verifying one surface says nothing about
  the other. Cured per bot-identity worked mechanics (#739 closed,
  #740 recreated as the bot). The credential-selection pause fires per
  WRITE per surface, not per session.
- **The Bash guard's `rg -r` block fired twice in one session on the
  same typo** (`rg -rn` for `rg -n`), on top of six prior recorded
  instances — the block works (both fires prevented silently mangled
  output), and the recurrence rate says the habit substitution
  (spelling flags separately) still is not automatic.
- **Markdown autofix is a silent meaning-changer on wrapped prose**:
  `markdownlint --fix` rewrote a line-wrapped `… ⇒ ask\n+ log` into a
  bullet (`- log`), corrupting doctrine text while "fixing" style. Any
  autofix pass over meaning-dense prose needs a diff read before
  staging.
- **A fluent architecture claim about a module graph is worthless
  until the graph is walked**: the source-direct premise felt verified
  (probes proved Node could strip types) but no probe walked the import
  closure to its dist-only workspace exports; five independent
  reviewers did. First-hand verification must cover the CLAIM's full
  dependency chain, not the nearest impressive fragment of it.

## In-flight state (for continuation, not a handoff)

Everything decision-bearing is in the plan
(`.agent/plans/delivery/claim-freshness-and-guard-degraded-states.plan.md`,
Todos + D-record + Verification record). Landed: Slice-1 first landing
(commit 5310fbe50 on PR #745). Next: Slice-1 second landing (generic
SessionStart shim + `check-claim-freshness` + collector + health-probe
extension + smoke), then README/dedup landing, then ready-for-review;
Slice 2 opens after merge, D8 probes pre-merge. The owner's
ratification gate clears only on his own act on PR #745.

## Disposition update — 2026-08-11

This section supersedes only the in-flight continuation statement and
the proposed `pinned_to: null` delivery shape above; the 2026-08-03
findings remain historical evidence.

The owner answered the #745 ratification card, "Yes — ratify via
merge-drive word", recorded by Director session Plover lifts
Troposphere (b10c37). Pre-merge review then found that the branch
carried the clock-free validator but not its claimed SessionStart
consumer. The ratified reconciliation is:

- PR #745 is MCP-476 landing 1: every row has the strict closed `pin`
  union (`pinned` with version or `not-tracked` with reason), plus
  `grounded_at` and `review_by`; legacy `pinned_to`, nulls, mixed arms,
  and extra keys fail integrity validation.
- A valid landing-1 run exits 0 but reports pinned monitoring
  obligations and not-tracked rows with their reasons, explicitly
  naming the absent landing-2 enforcement. This bounded inventory is
  an owner-directed staging exception, not evidence that expiry is
  prevented.
- The concrete MCP-476 successor branch
  `jimcresswell/mcp-476-claim-freshness-session-instrument` owns the
  generic SessionStart shim, expiry/pin-drift checker, allow-listed
  collector, health-probe extension, and their proofs. It is the sole
  enforcement consumer.
- README guidance and ADR-223 are trued in PR #745. MCP-477 remains the
  later guard-degraded-state slice and opens after both freshness
  landings merge.
