# ADR-231: Five Independent Repositories — Product, Search, Plugins, and Skills Each Stand Alone

**Status**: Proposed (owner-directed topology, captured 2026-10-07; this
written record is the next thing for the owner to ratify — see
§Recommendations and next steps).
**Date**: 2026-10-07
**Related**: [ADR-227](227-oak-product-in-its-own-repository.md) — the
single product-repository decision this record partially supersedes
(ruling 1, the search-bundling decision) and partially amends (ruling 6);
[ADR-230](230-curriculum-capability-canonical-source-across-repos.md) —
the skills/plugin canonical-source decision whose item 4 (the plugin
bundle's permanent home) this record supersedes with a concrete,
already-created repository; [ADR-154](154-separate-framework-from-consumer.md)
— the reusable-mechanism-vs-Oak-specific-instance principle this record
applies at a second repository boundary; [PDR-051](../../../.agent/practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md)
— vendor-agnostic skills standardisation, whose generation target widens
with this record.

## Context

ADR-227 decided a single new public repository,
`oaknational/oak-open-curriculum-mcp`, carrying the MCP server together
with its search instance (ruling 1: "yes the search app is effectively
part of the MCP app"), with the toolkit, packs, demos, and all agent
tooling staying in this repository (ruling 6: "all agent tooling stays
with the primary repo, not the oak app repo"). ADR-230 (Proposed)
separately recommended that the `{skills + MCP}` plugin bundle's
permanent home become that same product repository once it exists.

Both records predate two things that have since happened.

First, a platform constraint forced a decision neither record
anticipated. The owner, verbatim (2026-10-07): "we had to go ahead and
create this <https://github.com/oaknational/oak-ai-plugins> because we
were over the limit of Claude's new repo-size-for-plugins constraint.
it's kinda forced our hand nicely on that." The plugin bundle has a
public repository today, created ahead of `oak-open-curriculum-mcp`,
not nested inside it.

Second, the owner re-examined the full repository topology and directed
a five-repository shape, verbatim (2026-10-07):

> As I understand it, the repos we've got should be:
>
> - a public oak-ai-plugins repo which contains the published/released
>   plugins for different providers. Its CI should be where evals run on
>   PRs as public evidence of what's going out (tbd, we might just have
>   IDs here which link out to a separate evals space ... but juding by
>   how the evals service is looking -- see the Requirements for
>   auto-eval service document) ... either way some repo housekeeping
>   should be firmly esytablished
>   and grounded in best practise
> - some sort of skills experimentation/innovation repo which is private
>   and interal and marked strictly experimentation only
> - an oak-engineering-skills repo, most likely private, which is for
>   agentic engineering guiding the agents to adhere to oak's standards
>   (ideally acorss all our engineering techs and disciplines)
> - oak-mcp-server repo which is simply the server which exposes the mcp
>   routes (the layer over the api)
> - oak-semantic-search which is the repo concerned with the search
>   index and probably convenience sdks for it. ultimately this could be
>   used by owa/mcp/api/aila/ and any downstream service requiring search

Asked why the server and search repository would be coupled at all, the
owner's answer settled it: no reason. The two are independent repositories
with no umbrella between them — `oak-open-curriculum-mcp` consumes
`oak-semantic-search` the same way any other downstream consumer does.

On the product repository's name, the owner then corrected the working
assumption that it would be renamed `oak-mcp-server`, verbatim
(2026-10-07): "i think oak-open-curriculum-mcp does work, and it's
better because we might well have other internal mcp servers later
which do differnt things so best be specific." The name ADR-227 already
fixed stands; what changes is its contents, not its identity.

## Decision

**The estate's repository topology is five independent repositories,
each with its own consumers, release clock, and visibility, replacing
ADR-227's two-repository shape and ADR-230's product-repo-hosted plugin
bundle.**

1. **`oaknational/oak-open-curriculum-mcp`** (public) — the MCP server
   only: the protocol layer exposing MCP routes over the Oak API. It
   does not carry the search service. Its name stays specific to the
   curriculum domain rather than generic (`oak-mcp-server`), because
   Oak expects further internal MCP servers later for other domains,
   and a generic name would collide with that future namespace.
2. **`oak-semantic-search`** — the search index and its convenience
   SDKs, standing apart from the MCP server as a shared capability: OWA,
   RAG-retrieval consumers (Aila among them), the API, and any further
   downstream service that needs search — not just the MCP server.
   `oak-open-curriculum-mcp` depends on it exactly as every other
   consumer does: no shared repo, no shared deploy, no shared release
   clock, no umbrella repository above the pair.
3. **`oaknational/oak-ai-plugins`** (public, already created) — the
   published, released plugins for each provider. Its CI is where evals
   run on pull requests as public evidence of what ships, or — pending
   how the auto-eval service now described in a separate requirements
   document lands — carries eval-run IDs that link out to a separate
   evals space. Either shape, its repository housekeeping
   (branch protection, CI, release process) is established against the
   same best-practice bar as every other Oak repository, not assembled
   ad hoc because it arrived under a size-limit deadline.
4. **`oak-pedagogy-skills-experiments`** (private), marked strictly
   experimental. This is where draft curriculum-assistance skills,
   agents, and plugin content live before anything in them is fit to
   publish into `oak-ai-plugins`. ADR-230's open question — does the
   private authoring source (`oak-skills`) ever go public once past its
   experimental gate — is answered here: no. The experimentation
   repository stays private by design; maturity moves content _out_ to
   a public target, the repository itself does not change visibility.
   Whether it is a new repository under this name, or `oak-skills`
   itself archived and replaced or repurposed into it (see Rollout), is
   not fixed by this record.
5. **`oak-engineering-skills`** (private, most likely), owned and
   maintained by a Community of Practice — agentic
   engineering guidance: the material that keeps agents working on Oak
   repositories aligned to Oak's standards, scoped across every Oak
   engineering technology and discipline, not only this repository. This
   is a repository ADR-227 did not create: ruling 6 kept agent tooling in
   this repository because ADR-227's problem was "do not burden the
   product squad with the agentic engineering material." This record's
   reason for a separate repository is different and broader: Oak's
   engineering standards need to reach every Oak repository, not stay
   usable from one. ADR-227 ruling 6 is amended accordingly — agent
   tooling's primary-repo home was never permanent, only unforced until
   a cross-repository consumer existed.

None of the five is a move of today's workspaces wholesale, following
the same per-box cut ADR-227 ruling 3 already established: each
repository is assembled from the thin, specific content that belongs to
it, not from whichever workspace happens to be nearby.

## Rollout

The topology in Decision is the target shape; it lands in stages, not as
one cut-over.

1. **Immediately**: release AI plugins into `oak-ai-plugins`. The
   repository already exists; this starts populating it with published,
   provider-specific plugin content.
2. **Soon**: break out the MCP server and search as separate
   repositories, possibly with `oak-semantic-search` living inside
   `oak-open-curriculum-mcp`'s own repository at first, before its own
   extraction — the exact staging is TBD. This is a sequencing choice
   only: it does not reopen Decision item 2's no-coupling architecture,
   shared release clock, or umbrella repository, which this record rules
   out as the end state.
3. **Soon**: either archive `oak-skills` and stand up
   `oak-pedagogy-skills-experiments` fresh, or repurpose `oak-skills`
   into it directly, with proper lifecycle and governance — an
   innovation space upstream of `oak-ai-plugins` either way.
4. **Soon**: create `oak-engineering-skills`, owned and maintained by a
   Community of Practice.
5. **Later**: iterate on `oak-semantic-search` to support consumers
   beyond the MCP server — OWA, RAG retrieval, and any further
   downstream service — so the shared-capability claim in Decision item
   2 is proven by real use, not only architected for it. This may mean
   `oak-semantic-search` eventually replaces or absorbs `search-api`
   (today's separate, legacy search repository) — most likely as a new
   version or endpoint within it rather than a wholesale replacement —
   but that relationship is a decision for a dedicated follow-up PR, not
   this record.

## Alternatives considered

**(a) Keep ADR-227's two-repository shape — one product repository
bundling the MCP server and search.** Rejected: it ties search's release
and consumption to the MCP app's, when search is meant to serve
consumers beyond it — OWA, RAG-retrieval consumers such as Aila, the
API — that would otherwise depend
on the product repository or fork the capability if bundled. Whether
those consumers are real yet is a separate, unproven question — see
Trade-offs and Rollout item 5 — but the bundling risk holds regardless
of when they arrive. ADR-227 ruling 13 already
left this option open ("there is no need for it to be the same service,
or have the same indexes"); this record exercises that option rather
than inventing a new one.

**(b) Name the server repository generically, `oak-mcp-server`.**
Rejected on the owner's own correction: Oak expects further internal MCP
servers for different domains later, and a generic name would have no
way to distinguish them. `oak-open-curriculum-mcp` names the domain it
serves; a later server for a different domain gets its own specific
name, not a numbered sibling of this one.

**(c) Leave the plugin bundle's permanent home as `oak-open-curriculum-mcp`
per ADR-230 item 4.** Overtaken by events, not a competing design: a
platform-size constraint forced `oak-ai-plugins` into existence before
`oak-open-curriculum-mcp` exists at all. The bundle's home is decided by
where it already lives, not by which repository this estate intended to
build first.

**(d) Fold the engineering-skills material into the skills
experimentation repository, rather than a separate `oak-engineering-skills`.**
Rejected: the two serve different audiences and different maturity
models. The experimentation repository is pre-publication draft content
for curriculum-assistance capabilities, gated by Oak's editorial and
quality-assurance process before anything leaves it; engineering-Practice
standards have no equivalent teacher-facing publication gate and are
consumed directly by agents working across Oak's repositories, mature or
not. Merging them would make the experimental marking on one repository
apply, inaccurately, to the other.

## Rationale

Each split in this topology answers the same question ADR-154 already
poses at the module level and ADR-227 posed at the first repository
boundary: does this unit have consumers, a release clock, and a
visibility requirement distinct from its neighbours? Search answers yes
in design intent — real non-MCP consumers are a Rollout item, not a
claim made here (see Trade-offs). Plugins answer yes, now
concretely: a platform-specific packaging and eval-evidence requirement
that a size limit already forced into its own repository. Engineering
skills answer yes: every Oak repository and discipline is a consumer,
not only the one repository that happens to have authored the material
first. Applying the same test consistently is what turns ADR-227's
two-repository shape into this record's five, not a change of principle.

## Trade-offs and limitations

- **Search having real consumers beyond the MCP server is the least
  definite part of this record.** Decision item 2 architects
  `oak-semantic-search` as a shared capability for OWA, RAG-retrieval
  consumers such as Aila, and the API; none of them consume it yet. The claim is proven by Rollout item
  5's follow-through, not assumed here, and once real usage confirms it
  a follow-up ADR should record that as settled rather than this record
  being read as already having shown it. Whether that eventually folds
  into or replaces `search-api` — today's separate legacy search
  repository — is explicitly out of scope here; see Rollout item 5.
- **Five repositories to keep honest instead of two.** ADR-230's
  cross-repository generator (Direction A) now has a wider set of
  targets — `oak-ai-plugins` directly, not `oak-open-curriculum-mcp` as
  an intermediate stop — and is more load-bearing than either prior
  record assumed, not less.
- **`oak-semantic-search`'s visibility is not yet decided.** This record
  states the repository exists and names its consumers; it does not
  state whether it is public or private. That is an open point for the
  owner, not an inferred default. Its staging relative to
  `oak-open-curriculum-mcp` — a day-one separate repository, or an
  interim home inside the server's repository before extraction — is
  also open; see Rollout.
- **`oak-pedagogy-skills-experiments`'s relationship to `oak-skills` is
  not yet decided.** It may be a new repository built fresh, `oak-skills`
  archived and replaced, or `oak-skills` repurposed directly into it,
  with proper lifecycle and process either way — see Rollout.
- **`oak-engineering-skills` is named by role here, not yet scaffolded.**
  Its Community-of-Practice ownership is named in Decision item 5; the
  CoP's own formation and remit are outside this record.

## Recommendations and next steps

1. **Ratification is the owner's decision, not this record's.** This ADR
   stays Proposed until the owner accepts, amends, or rejects it as
   written.
2. **State `oak-semantic-search`'s visibility explicitly** before it is
   created, so its consumers (OWA, RAG-retrieval consumers such as Aila,
   the API) know what they are depending on from day one.
3. **Decide `oak-pedagogy-skills-experiments`'s relationship to
   `oak-skills`** — new repository, archived-and-replaced, or repurposed
   directly, each with proper lifecycle and process — closing ADR-230's
   §Recommendations item 6 in the same motion.
4. **Re-scope ADR-230's Direction A generator** to target `oak-ai-plugins`
   directly as the plugin-bundle output, retiring its assumption that
   `oak-open-curriculum-mcp` is an intermediate stop.
5. **Establish `oak-ai-plugins`'s repository housekeeping** (branch
   protection, CI, release process, the eval-evidence mechanism) against
   Oak's ordinary best-practice bar, independent of the deadline that
   created the repository.
6. **Amend ADR-227 and ADR-230** by dated note pointing here for the
   superseded and amended items (done in the same change set as this
   record — see each ADR's Status block).

## Consequences

### Positive

- Resolves ADR-227 ruling 13's left-open search-independence question —
  Rollout item 5 names how the shared-capability claim gets tested
  rather than asserting it settled here.
- Gives the plugin bundle a permanent home that matches where it was
  actually forced into existing, rather than treating a deadline-driven
  repository as a stand-in for a home decided before the constraint hit.
- Generalises Oak's engineering-Practice standards beyond the one
  repository that authored them first, which ADR-227 did not set out to
  do and does not need to be read as having done.
- Keeps `oak-open-curriculum-mcp`'s name, which already carries domain
  specificity the estate will need once further internal MCP servers
  exist.

### Negative / residual risk

- The cross-repository generator work ADR-230 scoped is a harder
  prerequisite now, not a softer one: five repositories to keep
  synchronised instead of two.
- `oak-semantic-search`'s visibility and rollout staging, and
  `oak-pedagogy-skills-experiments`'s relationship to `oak-skills`
  (new, archived-and-replaced, or repurposed), remain open; a
  consumer-facing commitment (SDK versioning, access model) cannot be
  made on `oak-semantic-search` until the owner resolves them.

## References

- [ADR-227](227-oak-product-in-its-own-repository.md) — the single
  product-repository decision this record partially supersedes (ruling
  1. and amends (ruling 6)
- [ADR-230](230-curriculum-capability-canonical-source-across-repos.md)
  — the skills/plugin canonical-source decision whose item 4 this record
  supersedes
- `https://github.com/oaknational/oak-ai-plugins` — the public plugin
  repository already created
- The Requirements for auto-eval service document (owner-held; not
  linked here — see `notion-strategy-page-fence.md`) — the evals-service
  design this record's eval-CI-or-linked-IDs question depends on
