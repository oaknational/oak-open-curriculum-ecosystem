# TypeScript estate review knowledge-safety checkpoint

Recorded at `2026-08-02T20:47:24Z` during a live seat. This is not a
handoff or a session close. Claims, watcher, custody, and implementation remain
active.

## Purpose of this checkpoint

This file preserves the reasoning, observations, corrections, open promises,
and continuation state accumulated before the extractor's first full-estate
run. It is indexed from this evidence family's README so a successor does not
need the originating conversation to recover the work.

The governing plan remains
[`typescript-estate-consolidation-review`](../../plans/delivery/typescript-estate-consolidation-review.plan.md).
This checkpoint is continuity evidence, not a detector input, finding ledger,
or source of architectural authority.

## Owner direction conserved

The owner established these boundaries in the originating conversation:

1. Begin from the broadly used structures, algorithms, and recurring software
   constructs, rather than assuming a repository-specific exploration had
   already been requested.
2. Review the repository broadly across applications, agent tools, packages,
   and core code, beginning with the filesystem distribution of every tracked
   `*.ts` and `*.tsx` file.
3. Do not exclude generated code. The repository controls its form and
   organisation, so generated carriers are evidence about generator and
   authority decisions even when the carrier is not the right remediation
   locus.
4. Include the curriculum SDK explicitly, including its generated, authored,
   exported, and packed-consumer boundaries.
5. Plan and then implement a full and deep review.
6. Stop at evidence and ticket-shaped proposals. Do not apply production
   remediations or create external tickets.
7. This checkpoint makes knowledge safe mid-session; it is expressly not a
   session end.

## Impact model and decision boundary

The review is intended to improve a maintainer decision: which repeated
structures and algorithms should be generated, shared, inlined, deleted,
rerouted, or deliberately kept, and which authority boundary owns a later
cure. The immediate beneficiaries are maintainers, contributors, and agents
who need to locate authority and predict change propagation.

Static source similarity is not itself a defect. Frequency is not importance,
compiler inclusion is not shipping, TSX is not a delivery category, and a
generated carrier is not necessarily the semantic authority. The review must
therefore preserve raw observations separately from classifications,
inferences, candidate dispositions, and proposals.

The work is not a general quality audit, an automatic refactoring queue, a new
generic graph substrate, or an authority registry. Existing schemas,
generators, package exports, runtime composition, and accepted ADR boundaries
retain authority.

## Grounded estate observations so far

At calibration commit `7ea6ba55b16988cfb0cdcb0f485db32f71777628`:

- the complete Git-tree census contains 3,618 tracked TypeScript/TSX paths;
- 3,487 end in `.ts` and 131 end in `.tsx`;
- the initial broad sweep counted approximately 446,777 source lines;
- the largest top-level populations were `packages/` (1,170 paths), `apps/`
  (1,112), and `agent-tools/` (1,067);
- an early path-rule sweep found 130 paths in declared generated-output roots;
  this is a path observation, not the final provenance denominator;
- the curriculum SDK population was 184 tracked TypeScript/TSX paths;
- strict expansion of the 27 supported workspace patterns admitted 32
  workspaces; 31 contained 3,598 TypeScript paths and 20 paths sat outside all
  admitted workspaces.

These are calibration observations, not final results. The final review commit
is intentionally pinned only after the extractor entrypoint lands so the
extractor's own TypeScript source is included in its denominator.

Existing tools were inspected and found to answer narrower questions:
TypeScript projects do not cover every root/research/generated surface; Turbo
covers registered workspaces; Dependency Cruiser and Knip require exclusions
or explicit entries; Sonar duplication policy deliberately excludes several
populations. No existing composition produced a closed per-file role,
provenance, delivery, module, graph, construct, and repetition record. That
gap warranted a minimal read-only extractor in `agent-tools`.

## Frozen review model

The accepted model currently contains:

- every tracked `.ts` and `.tsx` path, including unsupported Git modes and
  successfully read invalid UTF-8 bytes in the denominator;
- separate role, provenance, and ten-dimension delivery classifications using
  `present | absent | not-probed | ambiguous`;
- 20 runtime-value structure detectors, 16 erased type-model structure
  detectors, 14 algorithmic-operation detectors, and seven type-truth boundary
  signals;
- exact and structural region-clone analyses plus authored/generated schema
  key-set matches;
- a review-specific graph with seven node kinds, nine edge kinds, and 29 exact
  producer tokens;
- four ownership chains: OpenAPI → codegen → curriculum SDK → MCP; bulk data →
  vocabulary/search consumer; agent-tools source → dist → CLI/hook; and TSX →
  bundle → served UI;
- deterministic Git-tree source reads, canonical JSON, complete-output resource
  limits, fail-closed semantic validation, and atomic contained publication;
- a preselected held-out audit, history and counterfactual evidence, repeated
  generation proofs, a packed curriculum-SDK consumer proof, second-worktree
  reproduction, and final branch-drift reconciliation.

The four frozen contract hashes at this initial checkpoint were:

| Contract member | SHA-256 |
| --- | --- |
| `detector-config.json` | `443c020eb13bf861ff55bb96c3df16c09de6c94a29165241522b358d89f301d5` |
| `detector-config.schema.json` | `40745a5147ee0d67d295aee55fc4d28ce9451018be33d7fc40d0cebfb47e71cf` |
| `raw-extraction.schema.json` | `a2b6f1c39d67a86e512dcdcf7a32717cde9ab96cc63218aec643637f9537576d` |
| `evidence.schema.json` | `cfcf97f3e5c5ae75849fe5a4c587a3a32253b84624d9fd652bd617ba887a198e` |

Any byte change to those four files invalidates the freeze and requires a new
pre-execution review. No estate result has yet been produced under any
contract version.

## Contract corrections and why they mattered

Versions 1 through 1.4 were rejected before execution. The corrections are
part of the evidence, not process debris:

- initial construct and fingerprint labels did not define executable AST
  mappings;
- module resolution, Git object reads, complete tree enumeration, publication,
  and failure semantics were incomplete;
- the original Git pathspec could produce an empty census;
- provenance, roles, delivery states, type-space mechanisms, graph producers,
  verification exclusions, proof environments, and built-smoke obligations
  were internally incomplete or contradictory;
- later review found determinations still delegated to future implementation:
  producer tokens, MCP registration names, empty-prefix aggregation, wildcard
  exports, graph-node paths, completion fields, and proof environments;
- adversarial R6 review found an impossible positive control, unsafe packed
  member normalisation, graph endpoint recipes left open, and an undefined
  runtime-versus-types export partition;
- the first R6 cure check found target-segment wording accidentally included
  the mandatory `./` prefix and static registration status competed with
  possible executable evidence;
- read-only implementation mapping then proved a fixed implementation-file
  list omitted the built unified entrypoint and most of its eager local ESM
  closure;
- R7 added option-terminated ref resolution, exact SourceFile line counting,
  a strict pinned-only workspace-pattern grammar, independent invoking and
  executing roots, and component-wise no-follow identity reads;
- R7 security review required ancestor-symlink refusal, a total bare-package
  grammar, and explicit root ownership;
- the final adversarial cure check caught one fluent but ambiguous phrase,
  “valid node builtin”. The contract now defines one syntax-only `node:`
  predicate, explicitly excludes runtime membership, and accepts syntactically
  valid runtime-unknown names; and
- Red-first coverage implementation later found that `coverage.pathsSha256`
  was required and recomputed without a defined domain or byte framing. With
  no estate result produced, R8 refroze only that digest as domain-separated,
  unsigned 64-bit-length-prefixed ordered paths.

The node-builtin correction is reusable: words such as “valid” are not
executable total predicates. The path-digest correction is the same problem in
another form: requiring recomputation is insufficient when two conforming
implementations could frame the bytes differently. The contract must name the
complete predicate or transformation and its rejected cases.

## Verification evidence at this checkpoint

- Strict AJV 2020 compilation of all three schemas and validation of the
  detector configuration passes at the hashes above.
- Prettier validation passes for the frozen contract family.
- A local built-closure probe found 215 local JavaScript closure members from
  the unified entrypoint and 17 external specifiers; current members had no
  unresolved local import, non-literal dynamic import, or symlink component.
- Security review returned `ALL CURED` for the root-separation, external
  grammar, and no-follow identity boundary.
- Adversarial architecture review returned `ALL CURED` for the final
  syntax-only node-builtin predicate at the current detector-config hash.
- An earlier independent external R6 review returned nine of nine bounded
  items cured. Its unchanged item-level results remain evidence, but it does
  not substitute for the requested R7 delta re-anchor.
- The R7 delta re-anchor has been requested from the Director lane and is
  pending. The first estate-wide run remains held until that verdict lands.

## Current implementation state

The work runs in a dedicated review worktree on branch
`jimcresswell/typescript-estate-consolidation-review`, currently at
calibration base `7ea6ba55b16988cfb0cdcb0f485db32f71777628`.

Uncommitted review work currently consists of the ratified plan, evidence
contract family, this checkpoint, and a first shared TypeScript model draft at
`agent-tools/src/typescript-estate/`:

- `errors.ts`
- `file-vocabulary.ts`
- `graph-vocabulary.ts`
- `file-model.ts`
- `analysis-model.ts`
- `graph-model.ts`
- `config-model.ts`
- `document-model.ts`
- `ports.ts`

The foundation draft has not yet been type-checked, linted, or reviewed. A
read-only mapper identified two specific follow-ups before it becomes a
reliable worker boundary:

1. preserve all schema literal vocabularies as closed unions rather than
   falling back to free-form strings; and
2. expand the config and evidence-document models rather than collapsing
   description-heavy sections into generic records.

Those are open implementation tasks, not accepted shortcuts. No extractor
entrypoint, production runtime, test, smoke harness, or full-estate output
exists yet.

## Metacognition: what changed the work shape

The inherited fluent shape was “count popular data structures and algorithms,
then look for duplication”. That would have produced an attractive but weak
answer: syntax frequency without authority, shipping, or intervention locus.
The owner corrections about generated code and the curriculum SDK changed the
question into an estate decision-support problem.

The action-to-impact bridge is now explicit:

1. establish a complete, reproducible population;
2. keep authored/generated and verification/non-verification partitions
   visible;
3. connect similarity to authority, consumers, history, and shipped form;
4. disposition rather than automatically deduplicate; and
5. stop at evidence and proposals so later production work requires its own
   authority.

The review loop also taught a stopping lesson. Pre-run review was warranted
while it continued to find contradictory or non-total executable semantics.
Once the bounded R7 delta re-anchor is clean, another general contract round
has no decision-relevant warrant. The next safe, reversible, directly
observable move is implementation and a fixed smoke run. A newly discovered
mechanism class may reopen calibration; surprising results within an already
modelled class may not.

Proportionality therefore leaves correctness unchanged but narrows the next
instrument: no new assurance architecture, no fleet-wide re-review, and no
production remediation. Build the minimal extractor, run its tests and smoke,
then observe the estate.

## Free-play harvest

These are associations, not findings:

- Generated carriers reminded this seat of geological strata: repeated form
  may preserve the history of an upstream generator decision more clearly than
  authored source does. This seed is routed to the later authority-chain
  interpretation.
- An extractor whose own complete built closure enters its identity reminded
  this seat of a measuring instrument that must include its calibration
  certificate. This seed is routed to reproduction and drift analysis.
- Independent executing and invoking roots looked like separating telescope
  from observed sky: the instrument and observed checkout can vary
  independently. This seed is already grounded by the cross-root smoke
  contract.
- Ownership chains looked like supply chains: some repeated forms may be
  deliberate inventory at compatibility boundaries rather than accidental
  duplication. This seed is routed to candidate opposing evidence.
- Type-truth signals looked like fault-line markers rather than defects. This
  seed is routed to boundary interpretation, never automatic remediation.

Visible discards after the second look:

- “All repetition should be deduplicated” was forced and is discarded;
  purposeful local similarity is an allowed outcome.
- “The top ten reveals architectural priorities” was fluent but unsupported
  and is discarded; frequency and importance are different measures.
- “Generated code should share authored-code organisation” overreached and is
  discarded; generator and consumer constraints may warrant a different form.

## Concept synthesis

The problem is now formed: maintainers lack one closed, reproducible view that
can distinguish common syntax from costly competing responsibility across the
whole TypeScript estate. The causal hypothesis is that fragmented source,
build, export, generation, and registration views obscure the real authority
and encourage cures at carriers rather than causes.

Load-bearing constraints are complete tracked coverage, generated and
curriculum-SDK inclusion, raw-evidence preservation, no production changes,
test-doctrine compliance, deterministic output, and explicit evidence ceilings.

The formed decision has already crossed into the ratified delivery plan; this
checkpoint does not reopen it as an unshaped exploration. The next proposals
and their falsifiers are:

| Next step | Warrant | Falsifier |
| --- | --- | --- |
| Complete and test the shared extractor foundation | The schema contract is frozen and implementation is a reversible local probe | The R7 external delta finds a contract contradiction that changes the model |
| Implement the Git-pinned census and analysis pipeline | Existing tools cannot close the denominator or per-file model | A composed existing tool produces the same complete deterministic document without new code |
| Run held-out audit before interpreting candidates | Detector presence must not tune its own admission | Precision or classification failure rejects the affected detector |
| Run generation and packed-SDK proofs only where dispositions depend on them | Static declarations cannot prove generated or shipped form | A lane's decision is unchanged by either success or failure, making the proof unnecessary |
| Publish three separate top-ten tables and a disposition ledger | Runtime, type, and algorithm counts use different construct universes | The output collapses them or allows verification/generated volume to hide partitions |

Material unresolved evidence is the first full-estate output, held-out detector
precision, change-history and counterfactual results, generation determinism,
packed curriculum-SDK consumption, second-worktree reproduction, final drift,
and the pending R7 delta re-anchor.

## Standing promises and exact continuation

The active seat owns these promises:

1. Preserve the four contract bytes until the pending external delta verdict.
2. Cure the shared foundation against its mapper report, then type-check and
   lint it before workers depend on it.
3. Split implementation ownership so snapshot/identity/publication and
   estate-analysis/graph work can proceed independently without reverting peer
   changes.
4. Add the unified `typescript-estate extract --ref --out` CLI and an
   unconditional built smoke whose invoking and executing roots differ.
5. Do not run the first estate-wide extraction until the external delta is
   clean; then pin the final commit after the entrypoint lands.
6. Produce raw extraction, independent history and executable proofs, held-out
   audit, full candidate dispositions, three top-ten tables, proposals,
   second-worktree reproduction, and final drift evidence.
7. Apply no production remediation and create no external ticket.

Resume order:

1. absorb the R7 delta verdict;
2. reconcile the foundation draft with the mapper's closed-type advice;
3. run focused type/lint/unit checks;
4. delegate the two non-overlapping implementation slices;
5. integrate CLI, runtime, validation, smoke, and package scripts;
6. build and smoke before the first complete pinned run;
7. proceed through evidence gathering, human disposition, reproduction, and
   drift in the ratified plan.

## Custody and safety state

The primary checkout remains coordination-owned and is not the implementation
surface. The dedicated branch owns only this review family and its minimal
read-only extractor. No commit or pull request has yet been created, so work is
not yet safe under closeout criteria; that is acceptable because this is a
live-seat checkpoint rather than a closeout.

The root collaboration watcher and active-turn relay remain live. The evidence,
code, and README claims remain active. No claim, watcher, or branch custody is
released by this checkpoint.

## Post-checkpoint continuation events

At `2026-08-02T20:52:31Z`, the independent R7 delta verifier returned
`ALL-CURED`. It matched all four frozen hashes at open and close, transferred
the unchanged R6 schema evidence, independently reproduced the 215-member
local JavaScript closure plus manifest and lock (217 emitted identity entries),
and found zero refusal, non-literal-import, parse-diagnostic, `createRequire`,
or non-JavaScript closure cases. Strict AJV validation passed under Node
24.18.0 and TypeScript 6.0.3. The external gate is discharged and the Director
explicitly authorised the estate run. Three wording observations were marked
non-blocking: owning-root wording is implicit in repo-relative paths,
entrypoint membership is inferential from the closure count, and the identity
module is identity-bearing only when reachable. The reviewer also observed a
concurrent README byte change; the pinned four contract members and the README
anchors used by the review did not change.

A subsequent type-expert review marked the first foundation draft `CRITICAL`
before worker use. It found five exact contract-modelling defects: an open and
incomplete detector-config type, module-resolution variants admitting
schema-impossible nullability, flattened raw-file and schema-shape conditional
unions, graph edge kinds uncoupled from their producer literals and chain ids,
and a scalar dependency cycle. Evidence-document conditional unions are a
separate required slice before synthesis. The extractor implementation remains
held only until these foundation defects are cured; this is an implementation
boundary, not a reopened detector contract or estate-run gate.

Red-first implementation then independently found the unresolved
`coverage.pathsSha256` framing. That finding reopened only the pre-run contract
identity gate: it did not change the detector universe, classifications,
candidate rules, or evidence interpretation. Version 2.1 was refrozen at
`2026-08-02T21:50:38Z` with this current contract set:

| Contract member | SHA-256 |
| --- | --- |
| `detector-config.json` | `e58432612a3d47e9159c5e8271c6eaf307644a39967a716ee98359468c763c50` |
| `detector-config.schema.json` | `a4ee77964171119b04565212eb7b480a03bb2660d09ac7864d63b1e69c153a18` |
| `raw-extraction.schema.json` | `a2b6f1c39d67a86e512dcdcf7a32717cde9ab96cc63218aec643637f9537576d` |
| `evidence.schema.json` | `cfcf97f3e5c5ae75849fe5a4c587a3a32253b84624d9fd652bd617ba887a198e` |

Strict schema compilation and detector-config validation pass locally at these
bytes. The first estate run remains held until a narrow independent R8 review
confirms that the new field closes the determination without changing another
contract.

## Metaloss bounds and fixed point

Deliberately not conserved:

- transient shell output that is exactly recomputable from the frozen files;
- failed local AJV invocation variants whose causes were trivial command-shape
  issues and whose successful strict validation supersedes them;
- internal prose drafts already represented by the frozen contract, plan, or
  this checkpoint;
- unrelated coordination traffic observed by the watcher.

Blind spots remain: this scan is recall-limited to context attended by this
seat, and the canonical watcher does not cover file-only ARC or standards
channels. R7 has returned; the later narrow R8 contract review is pending.
Those bounds are named rather than claimed away.

The durable index is the evidence-family README, which points to this file, the
plan, calibration, and frozen contracts. A second metaloss pass found the
foundation mapper's unabsorbed warnings, the “no estate run yet” boundary, and
the then-pending R7 verdict; all three became explicit above. R8 adds one named
review promise rather than concealing the new determination. A further pass
would only re-find the named promises, blind spots, and unverified foundation
state, so the bounded recursion closes here. The seat continues.

## Continuation update: R8 discharged and foundation slice proved

The narrow independent R8 review returned `PASS` with no blocking or material
finding. Opening and closing hashes matched the four version 2.1 hashes above;
strict AJV 2020 compilation and detector-config validation passed. The review
confirmed that the ordered-path identity is total and consistent across prose,
schema, TypeScript model, implementation, and fixed vectors. Its sole minor
finding was that the first Unicode vector did not distinguish JavaScript
UTF-16 order from UTF-8 or Unicode-scalar order. An adjacent adversarial
astral/BMP vector now proves that distinction. The contract bytes did not
change. The contract hold is discharged; no estate extraction has yet run
because the extractor itself is intentionally incomplete.

The snapshot, identity, canonical-JSON, publication, and path-digest
foundation now passes all 46 in-process TypeScript-estate tests, focused lint,
type-check, and formatting. A read-only audit found and Red/Green work cured
two implementation defects before census use:

- fatal UTF-8 decoding had stripped a valid BOM and then rejected the byte
  round-trip; decoding now preserves BOM bytes for both source and built
  identity members; and
- a literal dynamic `import()` with an options argument was misclassified as
  non-literal; closure discovery now reads its literal first argument after
  the zero-parse-diagnostic gate.

These were implementation cures, not detector refreezes. Current continuation
is analysis and graph implementation, then runtime/CLI integration, semantic
validation, built smoke, and only then the first pinned census.

## Continuation update: R9 AST transformation refreeze

After R8 discharged the ordered-path gate, the first AST Red/Green slice found
a separate set of decisions still delegated to implementation. Schema-shape
member eligibility and unsupported reasons, recovered-AST participation,
structural-region root inclusion, comment-directive boundaries, per-file count
ordering, verification total partitions, and several resource-limit scopes
could each change deterministic output. The slice stopped before making those
choices invisible. No estate result exists.

Contract revision 2.2 now makes only those existing transformations total. It
adds no detector, population, threshold, interpretation, candidate, or proof
boundary. `schemaVersion` remains the evidence-family version `2.0.0`. Current
contract bytes are:

| Contract member | SHA-256 |
| --- | --- |
| `detector-config.json` | `94b32946fd921d26beeaeecdf878f0a09895a9b0115c54a64c0be24e9c8a7739` |
| `detector-config.schema.json` | `a24c1eef15076a548fe21debacbf17fd4a2238eedb690d9764956c044cb7fefa` |
| `raw-extraction.schema.json` | `a2b6f1c39d67a86e512dcdcf7a32717cde9ab96cc63218aec643637f9537576d` |
| `evidence.schema.json` | `cfcf97f3e5c5ae75849fe5a4c587a3a32253b84624d9fd652bd617ba887a198e` |

Independent R9 review matched those bytes at opening and close, strict-compiled
all three schemas under AJV 2020, validated the detector config, and found no
blocking, material, or minor issue. It confirmed that the additions make the
named transformations total without moving a detector, population, threshold,
interpretation, candidate, or proof boundary. The R9 contract hold is
discharged; implementation may resume. The estate run remains prohibited until
integration and the external built smoke are complete. The R8 verdict and its
historical hashes remain valid evidence for the digest change; they are not
rewritten as if they had reviewed this later delta.

## Continuation update: R10 clone-occurrence identity refreeze

After R9 passed, the resumed Red-first repetition mapping found two narrower
output-contract gaps. The top-level two-element `cloneAnalyses` array did not
state which detector came first. More importantly, the frozen member identity
used only line bounds: two identical anonymous regions on one physical line
could therefore share path, kind, line range, name, counts, and fingerprint
while still being distinct occurrences. Implementation stopped before choosing
an order or silently collapsing those observations. No estate result exists.

Contract revision 2.3 now emits `exact-region-clone` before
`structural-region-similarity` and adds exact zero-based UTF-16 `startOffset`
and exclusive `endOffset` coordinates to every clone member. Lines remain for
human reading; offsets make occurrence identity and ordering exact. The same
closure makes the already declared schema-reason order, region kinds,
encoding-version pairing, analysis tuple, and three-key floor exact across
config, schemas, and TypeScript models. This changes no detector, population,
threshold, interpretation, candidate, or proof boundary, and `schemaVersion`
remains `2.0.0`.

Current contract bytes are:

| Contract member | SHA-256 |
| --- | --- |
| `detector-config.json` | `b8fb8c4359374f5826f3b1c718ab275304b7a404e8c7fa274c4a5235f0c35c73` |
| `detector-config.schema.json` | `61963e76a921932ee4df7925aaacbdd41462db6a517f7b7bb3f3e952cf329ec1` |
| `raw-extraction.schema.json` | `524b7ec47e80ce495244fdddcd31a6ba9cadc1c7e36c41adcd92f217dcd66a99` |
| `evidence.schema.json` | `cfcf97f3e5c5ae75849fe5a4c587a3a32253b84624d9fd652bd617ba887a198e` |

Independent R10 review matched those bytes at opening and close,
strict-compiled all three schemas under AJV 2020, validated the config, and
found no blocking, material, or minor issue. Its same-line counterexample used
two identical eligible anonymous arrows with 47 nodes and 45 tokens each;
identical normalised text still produced distinct occurrence coordinates
`12..120` and `122..230`. The R10 hold is discharged and repetition may resume.
The estate run remains prohibited until integration and built smoke complete.
R8 and R9 remain historical evidence for their own byte sets, not approval of
2.3.

## Continuation update: semantic totals and boundary cures

Two independent semantic-validation slices now reject schema-valid but
internally contradictory raw documents before publication:

- coverage validation recomputes the ordered path digest, denominator length,
  read-status partition, parse totals, diagnostic total, and per-file
  read/parse pairing; and
- totals validation requires class/id construct order, exact per-file construct
  and type-truth vocabularies, zero analysis counts on non-parsed files, and
  recomputes both provenance and verification partitions plus all type-truth
  totals.

The slices were established Red first and now pass 9 coverage cases and 7
totals cases with focused lint and formatting clean. The repetition lane's
deliberate Red was subsequently completed and the full type-check is Green.

A further discriminating type-truth test proved that `z.unknown<string>()` was
incorrectly counted despite the frozen zero-type-argument rule. The test failed
1 versus 0 before the implementation added the explicit type-argument check;
the focused three-case type-truth suite is Green again. This was an
implementation cure under the already reviewed contract, not another refreeze.
No estate result exists.

## Continuation update: analysis tranche Green and R11 classification hold

The complete analysis-only tranche is now Green. Ten source modules and seven
adjacent test files implement deterministic construct and type-truth counting,
schema extraction and cross-provenance matching, exact and structural region
repetition, collision refusal, full threshold handling, UTF-16 ordering, and
same-file occurrence retention. Focused analysis verification passes 18 tests.
The whole agent-tools test run passes 4,015 tests across 392 files; lint has no
errors, type-check passes, and the configured source/test formatting surface is
clean. No extractor or census ran.

A separate broad classification map then found that revision 2.3 could not
honestly authorise a combined classifier. The pinned snapshot exposed only
TypeScript source bytes to later stages, despite workspace, manifest, project,
and resolution decisions requiring non-TypeScript inputs. It also exposed a
direct contradiction: project-reference edges promised a config diagnostic,
while semantic validation required every diagnostic path to be in the
TypeScript denominator. Later provenance evidence, role-regex construction,
module syntax and resolution, delivery derivation, graph assembly, and
candidate synthesis each still admitted materially different implementations.

The implementation plan is therefore staged rather than weakened. Revision
2.4 freezes only the next safe substrate: a complete sorted tree index;
run-scoped, cached, Git-object-only auxiliary blob access; a unique ordered
read ledger; separate TypeScript-source and auxiliary-blob diagnostic domains;
and an explicit gate that prohibits every later under-specified slice and the
estate run. Tree-metadata calibration at the pinned commit found 423 regular
JSON/YAML blobs totalling 51,646,582 bytes, with a 25,026,134-byte maximum.
The frozen limits are therefore 64 MiB per run and 32 MiB per auxiliary blob.

Revision 2.4 currently has these exact pre-review bytes:

| Contract member | SHA-256 |
| --- | --- |
| `detector-config.json` | `429f0b4161a6974028d398362edc31f54dc6d9fa6be73db94b08ae73c5490e68` |
| `detector-config.schema.json` | `efb3b47bee9b8df795fa05044fc076786412a7bb0694fdad6c27080ffb46f58d` |
| `raw-extraction.schema.json` | `5797a6652d41c75b4e2bc976a87726fb15314c35a728da46ed8798d5be25d894` |
| `evidence.schema.json` | `cfcf97f3e5c5ae75849fe5a4c587a3a32253b84624d9fd652bd617ba887a198e` |

The first R11 pass retained a model-sync blocker and one orphaned diagnostic
stage. Both were cured without weakening the ledger: the closed TypeScript
config model now expresses every revision 2.4 field, and direct auxiliary-read
refusals are typed internal results rather than published diagnostics whose
paths would falsely imply a successful read. Published auxiliary diagnostics
name a successfully read initiating blob and carry a separate related target.

All three schemas strict-compile under AJV 2020, the detector configuration
validates, the schema-equivalent config and document models type-check, focused
lint and formatting pass, and the six snapshot tests remain Green. Independent
R11 re-review matched the opening and closing hashes and found no blocking,
material, or minor issue. It confirmed both the total auxiliary-access contract
and the exact held-slice gate. The auxiliary-reader implementation may now
begin; every later classifier and the estate run remain prohibited. No estate
result exists.

The first post-R11 semantic slice is already Red/Green. An auxiliary-ledger
validator independently recomputes the asserted records from exact cached
bytes and the whole-tree index. Nine focused cases cover strict path order,
cache/ledger equality, exclusion of TypeScript-denominator paths, regular-mode
membership, byte-count and digest identity, and the run-wide byte limit. The
reader's Red-first cases are now Green as well, including defensive cache
copies, budget preflight, typed refusals, fatal object-read failure, TypeScript
byte reuse, and sorted ledger identity. The first post-write gateway retained
two blockers: fatal errors did not poison later reads/finalisation, and semantic
validation trusted a caller-supplied TypeScript path set. Both counterexamples
went Red. The reader now latches the first fatal `EstateReviewError` across all
later reads, ledger access, and observation access while leaving missing and
nonregular refusals nonfatal; the semantic validator derives the `.ts`/`.tsx`
denominator directly from the retained whole-tree index.

The three focused files now pass 24 tests; the full agent-tools suite passed
4,031 tests before the two added cure cases, with type-check and lint clean.
Independent gateway re-review reproduced both cures and approved the slice with
zero blocking, material, or minor findings. Frozen revision 2.4 hashes remain
unchanged. No workspace or config interpretation has started.

## Continuation update: R12 workspace, provenance, and role contract map

The next held boundary has now been mapped without edits or estate execution.
Revision 2.4 correctly withholds all three transformations. A future revision
2.5 may release them only after closing these exact choices:

- workspace attribution reads exact `pnpm-workspace.yaml` and matched manifests
  through the pinned auxiliary capability; `yaml@2.9.0` must parse exactly one
  feature-restricted YAML 1.2 core document with all warnings/errors, anchors,
  aliases, tags, merge keys, directives, duplicate keys, and non-string package
  entries rejected;
- the workspace-pattern language remains literal segments plus a complete `*`
  segment only. It must be compiled directly rather than delegated to
  `tinyglobby`, with decoded duplicates rejected and overlaps treated as a set
  union;
- matched manifests use fatal UTF-8 and native strict `JSON.parse`; because that
  parser discards duplicate-key evidence, the direct TypeScript 6.0.3 parser is
  used only to detect duplicate decoded object keys at every depth. No
  transitive JSON parser becomes an undeclared dependency;
- package names reuse the already frozen package-identity grammar, workspace
  roots exclude the repository root, deepest segment containment wins, and
  duplicate decoded package names fail;
- provenance signals become a closed discriminated union carrying matcher or
  rule identity, evidence paths, and exact UTF-16 header offsets. All matching
  signals survive canonical deduplication and ordering before the existing
  precedence selects the final provenance; and
- role regexes compile once as case-sensitive `RegExp(source, 'u')`. Selector
  alternatives are OR within a family and populated families are AND; an
  unavailable source predicate does not match. Fallback rules become a closed
  union and apply only when no non-fallback role matched.

The planned 2.5 gate change would move only workspace attribution, provenance,
and roles to contract-ready. Module declaration and resolution, delivery,
graph/ownership, candidate synthesis, and the estate run remain held. This map
is a decision surface, not an estate finding or permission to implement.

## Continuation update: revision 2.5 accepted, implementation boundary open

Revision 2.5 now freezes the mapped choices without expanding the review's
evidence ceiling. Exact `pnpm-workspace.yaml` and matched package manifests are
read only through the accepted pinned auxiliary substrate. The contract fixes
`yaml@2.9.0` parser options, feature rejection, direct one-segment wildcard
matching, native strict JSON followed by TypeScript duplicate-decoded-key
detection, the package-name grammar, and deepest-root attribution. Generated
rules now have fail-closed identity, prefix, overlap, and producer-evidence
preflight. Provenance has exact path and leading-comment matchers plus a closed
signal union and canonical retention/order. Role rules are a selector/fallback
union with one-time `u`-flag regex compilation, OR-within/AND-across semantics,
explicit source-predicate availability, and an exclusive fallback.

The accepted freeze bytes are:

| Contract member | SHA-256 |
| --- | --- |
| `detector-config.json` | `0b1b06cfda8a04ca6b4dbd73e2979faa7dd506ae5906c40839a935e7800b48ae` |
| `detector-config.schema.json` | `2988ca7ecdf6aa09a3cc5c386d5a516a8f6e349f68d08229136aa18c074a60ae` |
| `raw-extraction.schema.json` | `fde49f4fdaabbb7e1db73845664b01b1dd774689cdbffe6662af7d5946b262f1` |
| `evidence.schema.json` | `cfcf97f3e5c5ae75849fe5a4c587a3a32253b84624d9fd652bd617ba887a198e` |

Independent R12 review matched those hashes, strict-compiled all three schemas,
validated the configuration, passed type-check, focused lint, and the exact
root formatting gate, verified every configured producer path at the pinned
commit, and rejected adversarial mutations of YAML options, the gate, path
semantics, selector/fallback separation, and producer-evidence uniqueness. It
found zero blocking, material, or minor issues. Only workspace attribution,
provenance, and roles are now implementation-authorised; module syntax and
resolution, delivery, graph/ownership, candidate synthesis, and the estate run
remain held.

The implementation boundary is a classification fragment rather than a
`FileRecord` or `RawExtractionDocument`: the raw document requires delivery
fields, while delivery remains held, and no raw-document assembler exists yet.
This lets the three Red/Green slices land and receive semantic validation
without manufacturing held delivery observations or running the estate. No
`raw-extraction.json` or `evidence.json` exists and no estate result has been
produced.

The first low-level extraction from this work is itself now Green. A single
documented `compareUtf16` primitive replaces eight private copies and one
inline comparison across pinned
tree ordering, canonical JSON, semantic validators, graph identity, schema
shape ordering, and repetition grouping. Its test began Red on the absent
module, then proves equality, prefix order, antisymmetry, transitivity, and the
astral-versus-BMP boundary where UTF-16 order differs from scalar or UTF-8
order. Ten affected suites pass 50 tests after the migration, with type-check,
focused lint, and formatting Green. This is a context-independent shared
mechanic with a reusable proof burden, not an estate disposition.

## Continuation update: classification assurance, revision 2.6, and shape hold

The revision 2.5 workspace, provenance, and role implementation tranche is now
functionally complete and independently approved, but it was not accepted
without correction. Adversarial review exposed a retained-reference defect in
generated-path matchers, malformed in-memory matcher tuples escaping as raw
`TypeError`s, fallback-only roles accepted as selectors, and unknown
provenance/source-predicate values silently entering role rules. Each product
defect first gained a failing counterexample. The classifiers now take
defensive copies and fail with typed `CONFIG_INVALID` results at their public
boundaries. The focused role and provenance suites pass 22 cases.

The assurance shape was corrected as well. All 27 TypeScript-estate in-process
suites now live beside the source they describe. Workspace manifest discovery,
the composed file classifier, and classification semantic validation are named
and exercised as integration points; pure units remain unit tests. Branching
and stateful auxiliary fakes were replaced with constant readers or documented
immutable branch-free exact-path projections. The semantic validator's
acceptance fixture is now hand-authored from the frozen contract rather than
manufactured by the same classifier it audits. The full colocated tranche
passes 196 tests, package type-check and estate-source lint are Green, and the
root formatting gate passes.

The same implementation gateway proved that revision 2.5's unknown-provenance
sentence contradicted its precedence: unreadable source carrying a
generated-path or generated-header signal is
`generated-declared-unconfirmed`, not `unknown`. Because the 2.5 bytes were
already accepted, the wording was not silently edited. Revision 2.6 was
refrozen at `2026-08-03T00:47:05Z`; only that sentence, the contract revision,
and bound identities changed. The current hashes are:

| Contract member | SHA-256 |
| --- | --- |
| `detector-config.json` | `54ace41d941d9fe190b1fd467a3c3ed8aac223953a2e28841b573830e83c7c2d` |
| `detector-config.schema.json` | `cc052b863ff972b7cfaf03dc53098b6081dcaf9f67faf1984b7c8019d28c8016` |
| `raw-extraction.schema.json` | `365ddba4532efbc91d4c6b8a1970c1a62492a806f6f1b60d76e5dac343396ddf` |
| `evidence.schema.json` | `cfcf97f3e5c5ae75849fe5a4c587a3a32253b84624d9fd652bd617ba887a198e` |

Strict AJV 2020 compilation passes for all three schemas and the detector
configuration validates. Independent R13 review approved the current tranche
with no blocking or material correctness finding. It also fired the mandatory
friction-ratchet: repeated schema-mirror validation in individual constructors
may be the wrong solution class. Before any classifier extension, an
assumptions review must compare it with one AJV-validated, defensively prepared
configuration boundary whose downstream types make invalid schema states
unrepresentable and whose handwritten checks cover only non-schema semantics.

No raw extraction, evidence document, census, candidate, disposition, or
estate finding exists. Module declarations/resolution, delivery,
graph/ownership, candidate synthesis, and the estate run remain held.
