---
fitness_line_target: 200
fitness_line_limit: 275
fitness_char_limit: 16500
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs (ADRs, governance, READMEs); this is the specialist refinement layer"
---

# Distilled Learnings

Hard-won rules extracted from napkin sessions. Read this before every session.
Every entry earned its place by changing behaviour.

**Source**: Distilled from archived napkins
`napkin-2026-02-24.md` through `napkin-2026-04-21.md`
(sessions 2026-02-10 to 2026-04-21).

**Permanent documentation**: Entries graduate to permanent
docs when stable and a natural home exists. Always graduate
useful understanding — fitness management handles the
consequences. What remains here is repo/domain-specific
context with no natural permanent home.

---

## User Preferences

- Plans must be **discoverable** (linked from README, roadmap,
  AND session prompt) AND **actionable** (status tracking tables,
  completion checklists, resolved open questions).
- Archive docs are historical records — never update them.
- When a plan is blocking a merge, simplify ruthlessly — minimum
  to unblock CI, capture rest as future work.
- Listen to user priorities, not document structure. Try it
  before assuming it will not work.
- Risk acceptance is a human decision. Agents classify severity
  and describe impact; agents do not accept risks or defer items
  on behalf of the owner.
- Onboarding simulations are discovery-based (README-only start;
  motivation-described personas) — see the onboarding plan for the
  full rubric.
- **Scope changes precisely.** When the user asks for "only
  config, no code" (or any analogous boundary), respect the
  boundary strictly. Surface follow-on work that would extend
  scope; never silently expand scope to be helpful.

## Fitness Management

- **User feedback is the correction signal**: when user feedback
  contradicts a napkin entry, apply the feedback fully. Do not
  negotiate a compromise with the original incorrect framing.

## Process

- **Lead with narrative, not infrastructure**: on a multi-workstream
  initiative, write the ADR and README first. WS-0 (narrative) →
  WS-1 (factory) → WS-2+ (consumers).
- **Narrative sections drift first**: when syncing plan state,
  inspect body status lines, decision tables, and current-state
  prose — not just frontmatter and todo checkboxes.
- **Ignored estates need explicit sweeps**: when validating
  gitignored lanes, use `rg -uu` or run from inside the target
  directory; otherwise ignore rules create false-clean checks.
- **Reconcile parent when child changes runtime truth**: a child
  plan that evolves runtime architecture must reconcile the parent
  plan and closure proof in the same session.
- **CLI-first enumeration before owner questions**: research
  the generic REST surface (`sentry api`, `clerk api`, vendor-
  equivalent) before raising any owner question about observability
  or infrastructure state. "The specialist tool doesn't surface X"
  ≠ "X is unknowable from automation." **Extends to workstream
  sizing**: when owner direction names a repo-level mechanism
  (build cancellation, env-var policy, release resolution),
  search the repo for prior implementation before sizing a
  workstream. "Stated many times" or "should already be true"
  signals the substance may exist and the gap is
  documentation/linkage, not implementation.
- **Validation closures: produce locally-producible evidence
  first**. For deployment validation lanes, generate every
  locally-producible proof under a session-specific release tag
  before asking. Only ask for owner action when tooling cannot
  reach the artefact.
- **Split client-compatibility out of deployment-validation
  lanes**: a client-specific compat issue emerging in an active
  deployment-validation lane spins into its own follow-up plan.
  Shared preview infra ≠ shared plan ownership.
- **Duplicate type becomes load-bearing at three consumers**. Two-
  workspace type duplication is tolerated stably; the would-be third
  consumer forces canonicalisation. Use the three-consumer pressure
  as the planning trigger for consolidation.

- **Durable doctrine states the why, not only the what** — when
  authoring rules, PDRs, READMEs, or commands, ask: could a future
  reader re-derive this under novel conditions from what is written?
  If not, add the reasons. Stating the *what* without the *why*
  decays to ritual under novel conditions; the rule is followed when
  convenient and broken under pressure.

- **Workflow scope ≡ continuity-unit scope** — session-scoped
  workflows act on session-scoped artefacts; thread-scoped on
  thread-scoped. Label scope in every workflow header and artefact.
- **Dry-run multi-step workflows against accumulated state** before
  committing to the recipe; produces *proceed* or *stage differently*.
- **Pre-commit hooks are repo-wide by default**: when a
  pre-commit hook fails on files you didn't touch, check
  `.husky/pre-commit` for staged-aware vs repo-wide scope. If
  repo-wide, format the working tree to unblock the hook
  without sweeping unrelated drift into your commit.
- **Integrate reviewer dispositions pre-landing**: when
  reviewers are dispatched against a proposed-but-not-yet-landed
  artefact, integrate dispositions before landing as a hard
  rule. Post-landing amendments are costlier (amendment commit
  - re-review + doctrine wrong in interim).
- **Read paginated artefacts in full before forming
  hypotheses**: when an MCP tool returns paginated log/
  diagnostic output, re-call with explicit high limit and
  filter the *full* artefact on structured signal fields
  (`"level": "warning"`, `"level": "error"`) before forming
  any diagnostic hypothesis. Speculative diagnosis is only
  legitimate when the full artefact is silent on the question.

- **Tighten the reference model first**: when a validator is
  drifting, tighten the reference model and rerun the
  authoritative generation path before designing exception
  logic. The real issue is often the model boundary, not
  missing exception code.
- **Package-local green is navigation, not acceptance**: under
  root-gate doctrine, package-local checks are navigation
  only. Until another full repo-root sequence replaces it, the
  last full repo-root run is truth. Do not let package-local
  green quietly redefine the larger acceptance claim.
- **Repeated rationalisation = install a dedicated rule**: when
  a repeated owner correction keeps targeting the same local
  rationalisation (e.g. "bridge", "transitional", "compat
  helper"), install a dedicated always-applied rule rather than
  relying on a broad principle to fire indirectly.
- **Gate-pass ≠ architectural correctness**: green
  static-analysis gates (knip, depcruise) do not replace
  missing acceptance gates. A minimum fix to pass a gate is
  not evidence that the full architecture is correct.

## Architecture (Agent Infrastructure)

<!-- "Implicit architectural intent is not enforced principle" graduated
2026-04-19 — codified as ADR-162 (Observability-First), now Accepted. -->

- **Full triplet portability requires 7 adapter types**: Cursor
  agents + skills + rules, Claude Code agents + rules, Codex
  agents + config, Gemini commands. Easy to miss one — always
  run `pnpm portability:check` after creating a new specialist.
- **Codex adapter descriptions must match exactly**:
  `.codex/agents/*.toml` descriptions must stay identical to the
  registration text in `.codex/config.toml`; the validator checks
  string equality, not semantic similarity.
- **Platform-neutral inputs are the default for cross-platform
  probes** — probes that assert cross-platform claims MUST use
  platform-neutral inputs (thread identity tables, continuity
  surface fields, markdown artefacts) OR provide cross-platform
  parity (Claude + Cursor + Codex minimum). Platform-specific
  probes masquerading as cross-platform claims are forbidden.
- **Self-applying acceptance for tripwire installs** — when a
  session installs a tripwire, at least one acceptance criterion
  should test the install-session against the tripwire it just
  installed. Prevents the session from landing a rule the
  installing agent has bypassed in the process of writing it.

## Repo-Specific Rules

- `src/bulk/generators/` duplicates `vocab-gen/generators/` —
  update both in parallel. Decomposition plan at
  `codegen/future/sdk-codegen-workspace-decomposition.md`.

## Build System (Domain-Specific)

- **Verify reviewer fixes are on disk**: a fix recorded in the
  napkin or conversation summary is not a fix applied on disk.
  Always verify the file's actual content after claiming a fix.
