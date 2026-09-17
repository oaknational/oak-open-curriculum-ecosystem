# Developer and agent experience

- **Status:** proposed definition
- **Owns:** the end-to-end consumer experience of understanding, composing, running, diagnosing,
  changing, elevating and contributing through the Kit
- **Does not own:** one CLI, generator, documentation technology, agent vendor or host framework

## The Kit is a product for its builders

The Kit succeeds only if developers, designers, product and curriculum practitioners, partners and
agents can build complete experiences without reconstructing hidden policy from repository history
or a small group of experts.

Developer experience is not one row in a capability backlog. It is the interface through which
every semantic, quality and lifecycle decision becomes usable. A powerful runtime with weak
concepts, errors, documentation or diagnostics simply moves recurring work into framework
archaeology.

The strongest cold-start test is an external ecosystem consumer who knows Oak's public capability
but lacks Oak's institutional memory.

## The consumer journey

### 1. Discover

A consumer should be able to find:

- what the Kit is and is not;
- available semantic capabilities and their current support/evidence state;
- which authority owns each meaning;
- supported hosts, adapters, bindings and profile presets;
- worked normal and adverse scenarios;
- constraints, unsupported combinations and provider-specific strengths; and
- the shortest route for their real proposition.

Indexes route; they do not restate contracts. Search and agent retrieval must surface status,
authority, revision and applicability with every result.

### 2. Declare

The path begins with a proposition and activation facts, not a framework template. The consumer
records people, outcome, claim, authority, effects, exposure, control boundary, difficult states
and requested evidence. The Kit should explain why each question matters and permit honest
unknowns rather than eliciting invented certainty.

### 3. Compose

The consumer can see:

- the obligations derived from the declared context;
- activated, omitted, reduced, unavailable and unknown capabilities;
- valid adapter/binding combinations and their trade-offs;
- configuration and secret boundaries;
- source and release dependencies;
- what the Kit supplies, what the product must own and which human authority must decide; and
- the resulting scenario, assurance, operational and lifecycle obligations.

The paved road should make the correct recurring choice easy. It must not waive authority or
quality, and it must explain the guarantee and omission behind every default.

### 4. Run and inspect

Local and preview experiences should expose the same semantic contracts as later bindings. A
consumer should be able to inspect:

- effective profile and why obligations were activated;
- exact capability, adapter, binding, host and source versions;
- configuration provenance and environment differences;
- release/projection identity, freshness, completeness and accepted loss;
- current activation and health state; and
- which evidence is simulated, fixture-based, derived or observed from a real external system.

Local convenience must not stage an effect that the product presents as committed or delivered.

### 5. Diagnose and recover

Errors are part of the public Kit contract. They should distinguish semantic invalidity, missing
authority, unsupported combination, absent binding, provider failure, stale projection, partial
effect, unsafe retry, evidence failure and product-level outcome failure.

Diagnostics should answer:

- what was attempted and under which profile;
- what the last truthful state is;
- which contract, source, adapter, binding or host boundary failed;
- what can be retried, resumed, reconciled, repaired or rolled back safely;
- what evidence is missing;
- who owns the next decision; and
- which user-visible acknowledgement or support action is required.

A generic stack trace or provider error is insufficient when the Kit knows the product meaning.

### 6. Prove and decide

The consumer can run or collect the profile's applicable contract, scenario, accessibility,
security, operational and evidence checks, then produce an evidence record that does not overstate
the result. Automation should generate direct evidence and links, not a single “production ready”
badge.

### 7. Change and elevate

When context changes, the Kit should show the obligation delta, affected contracts, migration and
recovery work, and the asserted unchanged semantic core. Mechanical changes may be generated;
semantic changes require competent review. Upgrade guidance includes compatibility windows,
codemods where safe, data/projection transitions, provider differences, deprecation and rollback
limits.

### 8. Contribute, diverge or retire

Consumers can propose recurring work without turning their first implementation into a universal
abstraction. The system supports local extension, governed divergence, admission evidence,
compatibility and eventual retirement. It should be easier to explain a legitimate local choice
than to create an unofficial fork that silently loses support.

## Paved-road design principles

1. **Concept before command.** Tooling uses the vocabulary in the definition rather than exposing
   provider or repository mechanics as the mental model.
2. **One source per concern.** Generated surfaces and examples link to authoritative contracts;
   they do not silently copy them.
3. **Explain defaults.** Every default states its guarantee, omission, evidence and reopening
   condition.
4. **Make invalid combinations difficult.** Prefer schema/types and composition rules where they
   represent real semantics; otherwise fail early with an explanatory diagnostic.
5. **Preserve provider strength.** Common contracts do not erase useful provider capabilities;
   extensions and portability limits are visible.
6. **Support progressive precision.** Start with a narrow honest contract and add semantics when
   the proposition activates them; do not silently discard unsupported meaning.
7. **Use representative scenarios.** Fixtures include adverse and correction paths, not only a
   golden hello-world.
8. **Dry-run and explain.** Consequential generation, migration, deployment and retirement paths
   should make planned effects and evidence visible before execution where possible.
9. **No hidden hooks.** Activation, background work and agent behaviour remain inspectable and
   reproducible.
10. **Governed product-specific substitution.** A consumer can replace a Kit mechanism when the
    proposition requires it while retaining every applicable semantic, authority, quality,
    evidence and lifecycle contract. Substitution is never a bypass.

## Documentation as the first Kit interface

Before implementation exists, this definition is the first expression of the consumer model. A
durable documentation system therefore needs:

- a small stable router by reader decision;
- explicit authority and status at every entry point;
- one canonical home per concept;
- conceptual explanation separate from dated current-state evidence;
- worked scenarios separate from rules;
- capability reference generated from its legitimate source when possible;
- change/migration guidance beside compatibility decisions;
- errors and difficult states documented as first-class behaviour;
- direct links from record fields and diagnostics to governing contracts; and
- retirement/supersession that removes obsolete guidance from ordinary paths while preserving
  provenance.

Documentation quality is observable when unfamiliar humans and agents can make correct decisions,
not when an index contains many links.

## Agent-facing contract

An agent needs the same product truths as a human plus machine-actionable navigation. It should be
able to determine:

- which source is strategic, proposed, authoritative, evidential, historical or illustrative;
- the stable identity and current version of each proposition, contract, profile and release;
- applicable obligations and invalid combinations;
- what is unknown or blocked on human authority;
- which changes are mechanical and which alter meaning, rights or evidence;
- the exact evidence required before making a claim;
- how to update the single source of truth without duplicating it; and
- when to stop, refuse, request competent judgment or surface a design fork.

Agent tools should expose bounded answers with source revision, authority/status, coverage,
unknowns, loss and continuation. Retrieval relevance does not grant permission to act.

## Measuring consumer quality

Candidate measures include:

- time and conceptual hops to first meaningful real outcome;
- hidden-policy or repository-archaeology discoveries;
- invalid compositions prevented or diagnosed before release;
- time to identify the last truthful state and legitimate owner during failure;
- recurring plumbing versus proposition-specific effort;
- semantic and quality defects caught before public use;
- upgrade/elevation work that preserves unchanged contracts;
- successful independent or cold composition where claimed;
- legitimate governed substitution without unsupported framework forks; and
- maintenance, support and retirement burden over the declared lifecycle.

Speed without an equal quality and claim boundary is not a DX measure.

## Reopening conditions

The experience model should change if consumers still need specialist archaeology, profiles feel
ceremonial, defaults hide material decisions, diagnostics stop at provider mechanics, agents
cannot identify authority, or governed extension costs more than an explicit product-local path.
