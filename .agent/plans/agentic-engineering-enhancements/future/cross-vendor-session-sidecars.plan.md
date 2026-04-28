# Cross-Vendor Session Sidecars — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements
**Parent**: [ADR-125 (Agent Artefact Portability)](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
**Related**: [Hooks Portability Plan](./hooks-portability.plan.md), [Manifest-Driven Adapter Generation — Strategic Plan](./adapter-generation.plan.md), [Continuity and Surprise Practice Adoption](../archive/completed/continuity-and-surprise-practice-adoption.plan.md)

## Portability Clarification

All agent infrastructure in this repository must be cross-vendor wherever
the behaviour can be expressed in local portable Practice surfaces. This plan
does not create the first cross-vendor collaboration substrate, and it must not
be read as permission to build single-agent infrastructure elsewhere.

The baseline collaboration substrate is already cross-vendor: markdown,
JSON state, rules, commands, skills, and schemas that Claude Code, Codex,
Cursor, and other capable agents can read and write. This future plan is
narrower. It proposes an additional local-first sidecar layer for structured
session metadata when vendor-native session models, hooks, launch wrappers,
and transcript stores diverge.

## Problem and Intent

Session state is fragmented across vendors.

- Some tools expose native hooks and lifecycle events.
- Some tools only expose a launch surface or a resumable history file.
- Some tools can inject session context but cannot persist or re-expose it to
  later hooks.
- Session metadata that matters to the operator is therefore trapped in prompts,
  transcripts, ad hoc filenames, or vendor-specific UI conventions.

This creates three recurring problems:

1. Useful session-associated data cannot be attached durably in a queryable
   form.
2. Cross-vendor continuity depends on each vendor's native session model rather
   than on a canonical repository-controlled contract.
3. Every new vendor integration risks inventing its own storage, naming, and
   reconciliation rules.

The intent of this plan is to define a **local-first, cross-vendor session
sidecar layer** that can associate arbitrary structured metadata with sessions
without depending on vendor-native session titles, picker behaviour, or hook
support.

Representative use cases include:

- repo or workspace labels
- active plan references
- workflow checkpoints
- human annotations
- handoff artefact links
- compact session summaries
- importer reconciliation state

## Proposed Solution

Define one canonical sidecar model and keep vendor logic thin.

### 1. Canonical session identity

Each tracked session resolves to a canonical session reference with stable
identity fields such as:

- `session_key`
- `vendor`
- `vendor_session_id`
- `installation_id`
- `workspace_key`
- `repo_root`
- `cwd_at_start`
- `transcript_path`
- `started_at`
- `last_seen_at`

`workspace_key` should derive from the git root when available, falling back to
the normalised launch directory when the session is not inside a git repo.

### 2. Sidecar document model

Each canonical session owns a sidecar document with:

- `schema_version`
- `session`
- `namespaces`
- `labels`
- `artifacts`
- `provenance`
- `revision`

The namespace boundary is the multi-writer safety boundary. The initial
reserved namespaces are:

- `system`
- `vendor`
- `workflow`
- `user`
- `app.<name>`

This allows independent producers to attach data without overwriting unrelated
session state.

### 3. Adapter shapes

The model should support exactly three adapter shapes:

- **Hook adapter**: native lifecycle hooks read from and write to the sidecar
  store.
- **Launch wrapper**: a thin wrapper creates or resumes sidecar state before
  launching a tool that lacks native hooks.
- **History importer**: a post-hoc importer scans transcripts or history files
  and backfills canonical session records and linked artefacts.

These adapters are translation layers only. They do not own bespoke storage or
vendor-specific sidecar schemas.

### 4. Canonical storage and access contract

The default storage model should be a local SQLite database so that concurrent
hook, wrapper, and importer writes are handled safely without inventing custom
file-locking rules.

The canonical contract should expose a small CLI or JSON interface:

- `sidecar touch`
- `sidecar apply`
- `sidecar get`
- `sidecar query`
- `sidecar link-artifact`
- `sidecar reconcile`
- `sidecar render`

`sidecar render` is important: injected prompt text or session context should
be treated as a derived view of the sidecar store, not as the authoritative
state itself.

### 5. Operating defaults

The initial design should optimise for:

- local-first storage
- general structured metadata
- no secrets or PII in scope
- deterministic namespace patch semantics
- explicit provenance and revision tracking
- retention controls that prevent the sidecar store becoming an opaque memory
  blob

### Execution note

Any implementation detail recorded here is reference context only. Execution
decisions such as schema shape, reconciliation order, retention defaults, and
performance constraints are finalised only during promotion to `current/` or
`active/`.

## Scope / Non-goals

### In scope

- A canonical session-sidecar model that works across vendors
- Durable association of structured metadata with sessions
- Workspace and repo-level grouping independent of vendor UI
- Thin hook, wrapper, and importer adapter patterns
- Linked artefacts such as transcripts, prompts, plans, and takeover bundles
- Rendering vendor-facing context from the sidecar store as a derived view

### Non-goals

- Building the executable implementation now
- Introducing a shared team service or cloud sync layer in v1
- Storing credentials, secrets, or PII
- Replacing session-handoff, prompts, plans, or other continuity surfaces
- Treating vendor-specific title hacks as the core design goal
- Creating an enormous opaque memory layer with unspecified retention

## Relationship to Other Plans

### Hooks portability

[Hooks Portability Plan](./hooks-portability.plan.md) covers native lifecycle
integration. Hook-based reads and writes are one adapter path into the sidecar
system, not the whole solution.

This sidecar plan is deliberately broader:

- it also covers wrapper-only vendors
- it also covers post-hoc import from history files
- it treats vendor-injected context as derived output, not durable storage

### Adapter generation

[Manifest-Driven Adapter Generation — Strategic Plan](./adapter-generation.plan.md)
is adjacent enabling work, not a prerequisite. If the sidecar adapter estate
grows large enough, generated wrappers may become the correct simplification.
The sidecar contract itself must exist before generation is worth automating.

### Continuity practice

[Continuity and Surprise Practice Adoption](../archive/completed/continuity-and-surprise-practice-adoption.plan.md)
defines repo-local continuity surfaces. Session sidecars complement that work by
providing durable structured session metadata, but they do not replace the
existing continuity contract, prompts, or handoff workflow.

## Success Signals

This plan is successful when the promoted implementation can show that:

- a new vendor integration only needs a thin adapter, not a bespoke state model
- the same workspace can be queried across multiple vendors by a canonical
  workspace key
- session metadata survives resume, restart, and post-hoc import
- namespaced writes do not trample unrelated session data
- vendor-facing context rendering is reproducible from stored sidecar state
- use cases such as repo labels, plan refs, workflow checkpoints, and handoff
  links no longer depend on vendor-native session titles

## Risks and Unknowns

| Risk / unknown | Why it matters | Mitigation direction |
|---|---|---|
| Session identity is messy across vendors | Poor reconciliation would create duplicate or conflicting session records | Treat canonical session identity and reconciliation as a first-class design concern |
| Some vendors expose no native hooks | Hook-only designs would exclude important surfaces | Keep wrapper and importer adapters in scope from the start |
| The sidecar store could become an opaque blob | Unbounded data would erode trust and maintainability | Use namespaces, provenance, retention policy, and explicit query contracts |
| Sensitive data may leak into general metadata | Session stores are likely to be inspected and exported | Keep secrets and PII out of scope in v1 and enforce that boundary explicitly |
| Storage choice may be over- or under-engineered | A weak store creates concurrency issues; an overbuilt store slows adoption | Default to local SQLite, then revisit only if real evidence warrants it |
| Vendor context rendering may drift from stored truth | Derived prompt text can become another inconsistent state layer | Make the sidecar store authoritative and render injected context from it |

## Promotion Trigger

Promote this plan into `current/` when all of the following are true:

1. There is at least one concrete session-sidecar use case beyond a vague wish
   for better titles, such as handoff bundles, plan refs, workflow checkpoints,
   or importer state.
2. The owner wants one canonical solution that spans more than one vendor
   surface or more than one adapter shape.
3. The local-first storage boundary and sensitive-data exclusion are accepted.
4. The initial adapter scope is explicit: which vendors start with hooks, which
   require wrappers, and which need importer-only recovery.
5. The promoted executable plan can define deterministic slices for the
   canonical store, adapter contract, and validation evidence.
