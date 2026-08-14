# MCP maintenance handover — isolation analysis (first notes)

Status: first notes, pre-plan. Owner-commissioned 2026-08-11 at the Director
seat; owner corrections of the same date folded in. Graduates to a plan node
at the owner's word. Runs in parallel with the beta focus — it never displaces
it (owner word: "the current focus is the beta, but we need to be working on
this in parallel").

## Goal

Hand maintenance of the MCP product surface to a human squad — one junior,
one mid, one senior engineer, a product manager, a fraction of a designer,
and QA — without handing over this repository. The Practice stays here; not
everything here is about the MCP. The handover object is a new repository
carrying the product surface, with this repository keeping the platform,
frameworks, and agentic estate, bridged by published packages.

**Acceptance bar for the whole programme**: the junior fixes a real bug in
week one using only what is in the handed-over repo. That bar decides every
marginal call about what travels, what is documented, and what is simplified.

## The two classification rules

1. **Ownership follows change cadence.** Anything the squad will change
   weekly lives in their repo. Anything they should consume like a
   third-party dependency stays here and is published with semver. Anything
   that co-evolves *across* the cut is the danger class: it gets split or
   moved, never bridged.
2. **The split test applies inside each code area, not at existing package
   boundaries** (owner correction, 2026-08-11 — the first draft of this
   analysis classified existing packages as indivisible units; that dealt
   only with what already exists). In each area, examine whether the code
   splits into a **generic framework** (stays here, published, reusable by
   any consumer) and an **Oak library built on that framework** (goes with
   the squad). Existing package boundaries are evidence about today's shape,
   not the unit of decision.

The layering work rule 2 demands is no-regret engineering: it improves this
estate whether or not handover timing moves, and it delivers the "every
workspace reusable for other projects" property already claimed in the
2026-08-11 project update.

## Measured baseline (what exists today — evidence, not the cut)

First-hand, 2026-08-11: the app's full workspace dependency closure is 23 of
34 workspaces.

- Runtime workspace dependencies (11): build-metadata, curriculum-sdk, env,
  env-resolution, logger, oak-search-sdk, observability, posthog-node,
  result, sentry-node, type-helpers.
- Direct dev workspace dependencies (6): eslint-plugin-standards,
  oak-design-assets, oak-design-system, oak-design-tokens, sdk-codegen,
  workspace-config. The design packages are build-time inputs only — the
  landing page is baked at build; nothing design-flavoured runs at runtime.
- Transitives complete the closure: graph-core, graph-corpus-sdk,
  search-contracts, openapi-zod-client-adapter, design-tokens-core.

## Area-by-area seam examination

Each area below names today's shape, the framework/Oak split to examine, and
the open decisions.

### Search — three distinct things, each with its own disposition

Owner correction: differentiate the search **SDK**, the search **CLI**, and
the search **service** running on Elastic — and note that additional Elastic
search instances are trivially added, so "one shared service" is not a
constraint the cut must inherit.

- **Search service (Elastic instance + index + relevance config)**: an
  operating concern, not a package. Because instances are cheap, the squad
  *could* run their own instance for the product, with the estate keeping
  its own for research/evaluation. Open decision: squad-owned instance
  versus estate-run service dependency. If estate-run, the relationship
  (availability expectations, reindex cadence, escalation) must be named
  explicitly in the handover.
- **Search CLI (ingest, evaluation, ground truths)**: examine the internal
  split — a generic ingest/evaluation framework versus the Oak curriculum
  corpus configuration (mappings, ground truths, relevance judgments). The
  framework stays; whether the Oak corpus config goes depends on the
  instance-ownership decision above.
- **Search SDK (client)**: goes with the squad in some form, since the app
  consumes it at runtime — but first examine the split between a generic
  typed-search-client framework and the Oak search surface built on it.
  `search-contracts` likely divides the same way (generic query/result
  shapes versus Oak corpus specifics).

### Curriculum SDK — cure the three-way blur before it travels

Owner correction: if the SDK goes with the apps, it needs splitting into a
**general framework** and an **Oak library using that framework** — and,
orthogonally, three currently-blurred things need separating:

1. **Generation-time code** — the codegen machinery (`sdk-codegen`,
   `openapi-zod-client-adapter`). Framework-class: stays here, published.
2. **Generated output** — the artefacts codegen produces. These are build
   products with clear provenance, regenerated rather than hand-owned; they
   must stop being entangled with hand-written code so regeneration is safe
   and mechanical for the squad.
3. **Runtime consuming code** — the hand-written client and Oak domain
   layer that consume the generated artefacts. This is the Oak library that
   travels.

The handover teaching obligation follows: the squad must be able to run the
regen flow when the upstream API changes, using docs alone.

### Graph packages

Same layering examination: `graph-core` reads as the generic graph framework
candidate (stays), `graph-corpus-sdk` as the Oak corpus layer (travels).
Verify rather than assume — the boundary between them may not currently sit
where the framework/library line wants it.

### Analytics and observability

`posthog-node` wears a generic name but carries Oak policy: the closed event
set, the pseudonym derivation, the strict keyring validation. Split
examination: the generic MCP-analytics adapter layer (candidate to stay, or
to dissolve upstream — `@posthog/mcp` itself is absorbing adjacent concerns,
e.g. vendor-client capture as of 0.11.0) versus the Oak policy layer, which
co-evolves with the app and travels. `sentry-node`, `observability`,
`logger` read as mechanism-class (stay, published) pending the same check.

### Design packages

Build-time inputs only. They stay: the design system is the brand authority,
evolving on its own strand. Publication must be to a **restricted** npm
scope — the licensing model reserves brand, and `oak-design-assets` on
public npm would breach it. The squad's fractional designer consumes the
design system as a published artefact plus brand guidance.

### The app itself — Practice-entangled compliance machinery

At least two app-critical gates currently live inside `agent-tools`, the
Practice tooling workspace: the current-source evidence/registration-drift validator (the
728-item generated projection: 717 baseline items plus 11 reviewed
additions; per its own report, explicitly not a wording-approval
gate) and the under-the-hood content generator. These are product
machinery wearing Practice clothes. They must be extracted into the app or a
small product-owned package before handover. The seam-extraction list —
enumerate every agent-tools piece the app's CI genuinely needs — is the
first concrete deliverable of any plan.

### Mechanism packages (bridge class)

`result`, `type-helpers`, `logger`, `env`, `env-resolution`,
`build-metadata`, `eslint-plugin-standards`, `workspace-config`,
`openapi-zod-client-adapter`: stay here, published to public npm (code is
MIT). Each still gets the rule-2 pass, but the expectation is they are
already framework-class. Keep the bridge as narrow as the closure allows;
every bridged package is a standing version-lag liability.

## The non-code handover surface

The larger half of the handover is not code:

- **Infrastructure ownership**: Vercel project, Clerk production instance,
  Cloudflare fronting at www.thenational.academy/mcp, PostHog and Sentry
  organisations, Elastic, billing, secrets. Access transfer is a workstream.
- **The governance relationship**: content register, sign-off workflow,
  guidance pipeline, restricted-lesson exclusions — a process between the
  squad's PM and Oak's compliance people, not a directory.
- **The Anthropic relationship**: connector and plugin submissions, review
  responses, listing maintenance.
- **Alerting**: the stocktake found alerting effectively unarmed (MCP-544,
  "nobody has aimed the pipe"). The squad is the missing alert consumer —
  design the alert set as part of the handover, with the squad on the
  receiving end. Two open pieces of work become one.
- **Knowledge export**: the relevant ADRs and runbooks travel into the new
  repo's docs. Retention is knowledge, never bytes; `git filter-repo`
  carries the moved paths' full commit history so blame and archaeology
  survive.
- **Release engineering for humans**: per-commit semantic-release (~13
  releases/day) is agent-shaped. The squad repo wants deliberate releases
  (changesets-class), with the same bars — strict TypeScript, blocking
  gates, no warning toleration — as plain, documented CI without the
  agentic ceremony.
- **Team surfaces**: Linear team/project for the squad; QA inherits
  runnable, documented test suites.

## Target repo character

**Human-first, agent-ready.** No Practice corpus, no hook choreography — but
a good CLAUDE.md/AGENTS.md and clean docs, because the squad will use coding
agents too. Strip the ceremony, not the affordances.

## Alternatives considered and set aside

- **Monorepo with CODEOWNERS and a squad view**: rejected — the Practice
  saturates hooks, history, and half the file tree; the owner's judgment
  that it would make no sense to the squad is correct.
- **Reverse split** (evict the Practice, hand this repo over): rejected —
  far more motion for a worse result.
- **Staged operate → maintain → own**: retained as a de-risking option —
  the squad takes on-call and deploys first, code ownership second.

## Open questions (owner decisions, recorded not resolved)

1. **Contribution model** after handover — open (owner word, 2026-08-11).
   Does the agentic estate contribute to the squad repo via ordinary
   external PRs, or go hands-off?
2. **Search instance ownership** — squad-run instance versus estate-run
   service (see §Search); the trivial-additional-instances fact keeps both
   live.
3. **Timing** — TBD (owner word). Beta remains the focus; this lane runs in
   parallel. No dates in this document by design.
4. **npm visibility per class** — public for MIT mechanism/framework
   packages, restricted for brand-bearing design packages; per-package
   confirmation rides the seam review.

## Sequencing sketch (for the future plan node, not yet binding)

1. Ratify the cut lines and the two classification rules.
2. Seam-extraction list: agent-tools machinery the product CI needs, moved
   into the product surface. Small PRs, immediate estate value.
3. Framework/library splits per area (search, SDK three-way, graph,
   analytics) — each a bounded lane with its own plan slice; no-regret
   regardless of handover timing.
4. Publishing pipeline for bridge packages (restricted scope for design).
5. New repo scaffold + filter-repo history carry + human-grade CI.
6. Non-code workstream in parallel: infra access, governance relationship,
   alert set (with squad as consumer), docs/ADR export, Linear team.
7. Staged handover with a co-run window; the junior-week-one bar gates the
   final transfer.
