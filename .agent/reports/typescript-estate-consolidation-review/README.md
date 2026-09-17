# TypeScript estate consolidation review

This directory is the durable evidence family for the owner-ratified
TypeScript estate consolidation and architectural-coherence review. Its
population is every tracked `.ts` and `.tsx` file, including generated
carriers and all authored and generated parts of the curriculum SDK.

The governing delivery plan is
[`typescript-estate-consolidation-review`](../../plans/delivery/typescript-estate-consolidation-review.plan.md).

## Review contract

### Purpose and intended impact

The review exists to improve a live consolidation decision: which repeated
structures and algorithms should be generated, shared, inlined, deleted,
rerouted, or kept, and at which authority boundary each cure belongs. The
intended impact is lower change cost and fewer inconsistent fixes for
maintainers, contributors, and agents without treating all similarity as a
defect.

The wider systems intent is the
[cost-of-change gradient](../../../docs/foundation/cost-of-change-gradient.md),
with a repository-specific
[foundations-first software projection](../../../docs/architecture/foundations-first.md):
pay the implementation and assurance cost of a genuinely shared responsibility
once in the lowest coherent layer, then let foundations, libraries, and products
inherit it. This review therefore also identifies foundation-admission
candidates and the evidence that would reject them; it does not implement or
ratify their extraction.

### Questions a substantive review must test

- Does the census close over every tracked TypeScript and TSX file rather than
  a convenient source subset?
- Are authored source, generators, generated carriers, package exports,
  runtime owners, and composition boundaries distinguished?
- Do declared graph edges agree with executable generation, packing, build,
  and registration proofs for the four calibrated archetypes?
- Does each consolidation candidate have evidence both for and against it,
  one explicit disposition, and the correct intervention locus?
- Are raw observations preserved independently from every normalised or
  inferred view?
- Can an independent clean worktree reproduce the bundle at the pinned commit,
  and has branch drift been reconciled before publication?

### Evidence standard and authority boundary

The bundle distinguishes observations from inferences and records confidence
and missing evidence. Static analysis is evidence about source shape and
declared relationships; it does not prove production execution, maintenance
harm, the value of an abstraction, or a human outcome. Executable proofs extend
that ceiling only for the path they exercise.

This directory contains derived review evidence, not a canonical registry.
Existing schemas, generator inputs and implementations, package exports, and
runtime composition retain authority. A graph edge or candidate disposition
does not create architectural authority and cannot ratify a production change.
The review schemas therefore use repo-relative `$id` values rather than the
public Oak API schema namespace.

### Non-goals and authority not granted

The review does not apply production fixes, add a quality gate, create an
external ticket, collect product telemetry, or profile contributors. It does
not authorise use of people-derived or pupil-derived evidence. Any such need is
reported as outside the evidence boundary and requires separate authority.

### Successful review

A successful review proves census closure, calibrated path coverage, candidate
closure, raw-evidence preservation, second-worktree reproduction, and final
branch-drift reconciliation. Missing evidence is recorded with its consequence
and resolving proof. A decision-relevant `undetermined` candidate, a missing
tracked file, or a failed reproduction is a contract failure, not a wording
issue and not permission to soften the claim. An unresolved candidate that
cannot change a proposal, priority, canonical form, intervention locus,
public/shipped claim, generator-determinism claim, or ownership claim may
remain only as an explicit limitation and may not be referenced by a proposal.

## Readers and decisions changed

| Reader | Decision this evidence changes |
| --- | --- |
| Repository maintainer | Whether to authorise the proposed foundations-first consolidation programme and in what order |
| Generator or package owner | Whether a candidate belongs at semantic authority, generator, carrier, export, runtime-owner, or composition level |
| Architecture reviewer | Whether repeated forms share one responsibility or are purposeful local variation |
| Implementing contributor or agent | Which canonical form and acceptance proof a later, separately ratified delivery slice must use |

No reader should use the bundle as an automatic refactoring queue. Each
ticket-shaped proposal remains a proposal until accepted through normal owner
and delivery authority.

## Directory layout

The completed family uses this shape:

```text
typescript-estate-consolidation-review/
├── README.md
├── calibration.md
├── foundational-building-blocks-frame.md
├── handoff-2026-08-03.md
├── knowledge-safety-2026-08-02.md
├── knowledge-safety-foundations-first-2026-08-02.md
├── detector-config.json
├── detector-config.schema.json
├── evidence.schema.json
├── raw-extraction.schema.json
├── raw-extraction.json
├── evidence.json
├── manifest.json
├── report.md
├── proposals.md
└── proofs/
    ├── raw/
    │   ├── tracked-files.json
    │   ├── history.jsonl
    │   ├── generation/
    │   ├── packed-sdk-consumer/
    │   └── counterfactuals/
    └── normalised/
        ├── history.json
        ├── generation.json
        ├── packed-sdk-consumer.json
        └── counterfactuals.json
```

- `raw-extraction.json` is the complete deterministic extractor output
  validated by `raw-extraction.schema.json`; `evidence.json` is the derived
  dataset validated by `evidence.schema.json` and contains a typed reference
  back to that raw artefact.
- `calibration.md`, `detector-config.json`,
  `detector-config.schema.json`, and `raw-extraction.schema.json` preserve the
  pre-run model decision, executable detector semantics, falsifiers, and
  strict configuration and raw extractor output contracts.
- `detector-config.json` also carries a document-family-independent
  `contractRevision` and a closed implementation gate. A contract-held slice
  may not emit observations, and the estate run remains prohibited until the
  held list is empty and the external built smoke passes.
  Revision 2.6 currently authorises workspace attribution, provenance, and
  role classification as an independently testable classification fragment;
  module, delivery, graph/ownership, candidate assembly, and any estate run
  remain held. Revision 2.6 changes only the unknown-provenance wording and
  contract identities. The configuration-boundary assumptions review has
  since been absorbed as one AJV-validated, defensively prepared ingress with
  schema-invalid downstream states made unrepresentable; the latest exact
  execution and proof state is recorded in `handoff-2026-08-03.md`.
- `foundational-building-blocks-frame.md` applies the portable
  cost-of-change gradient and its foundations-first software projection to this
  review. It defines the
  core-package promotion test, future excellence contract, opposing evidence,
  and the boundary between observation and later extraction without altering
  the frozen detector contract.
- `knowledge-safety-2026-08-02.md` preserves the live pre-run decision trail,
  rejected contract shapes, current implementation state, and exact resume
  sequence. It is a mid-session continuity checkpoint, not review evidence or
  a handoff.
- `knowledge-safety-foundations-first-2026-08-02.md` preserves the second
  metacognitive step-back, owner corrections, foundations-first purpose,
  duplication economics, frozen-contract fit, and exact live-seat continuation.
- `handoff-2026-08-03.md` is the current pickup surface. It distinguishes the
  approved classification fragment from incomplete low-level slices, records
  the known red intermediate state and absent estate evidence, and gives the
  ordered finishing sequence without claiming current re-verification.
- `manifest.json` pins repository and toolchain provenance, structured command
  arguments, configuration digests, and every artefact hash.
- `report.md` is the human synthesis: coverage, separate top-ten runtime-value
  structures, type-model structures, and algorithmic operations, limitations,
  findings, rejected interpretations, final dispositions, and a vertical
  foundations-first promotion reading for each relevant production candidate.
- `proposals.md` carries independently adoptable, ticket-shaped remediation
  proposals without creating tickets.
- `proofs/raw/` contains source-faithful command and executable-proof output.
  `proofs/normalised/` contains declared transformations for comparison and
  analysis. A normalised file never replaces its raw input.

The final implementation may shard a large evidence array only when the
manifest lists every shard and the schema-valid aggregate is regenerated from
those shards deterministically. Sharding must not create hand-maintained
denominators.

## Deterministic regeneration contract

1. Resolve the requested ref to one full commit and tree. Enumerate and retain
   one complete ordered index of the NUL-delimited Git tree, then derive the
   `.ts` and `.tsx` denominator; do not use the previously rejected shell-style
   `*.ts`/`*.tsx` Git pathspec. Ref resolution uses Git's option terminator so a
   caller-controlled ref cannot become an option.
2. Use Node and pnpm versions recorded in the manifest and install from the
   committed lockfile with frozen resolution.
3. Execute the manifest's structured command vectors in their recorded order.
   Commands must accept or derive only repo-relative inputs and must not embed
   a checkout path in output.
4. Read every analysed byte from that pinned tree, never from the live
   worktree. Invoke trusted Git with replacement objects and lazy promisor
   fetching disabled. A missing object or any regular-blob Git read failure
   fails the complete run rather than reading the network or publishing a
   partial artefact. Unsupported tree modes and successfully read bytes that
   are invalid UTF-8 stay in the denominator with explicit unavailable facts.
   Valid decoded sources use TypeScript's `SourceFile.getLineStarts().length`
   as the line count, so even an empty source has one line. Read later auxiliary
   blobs only through the same commit-bound Git capability, cache and charge
   each unique non-TypeScript path once, and emit the exact ordered read ledger;
   no auxiliary boundary interprets the bytes or falls back to the filesystem.
5. Run the four calibration archetypes. Freeze the detector configuration and
   its digest before the full-estate and held-out passes.
6. Run the full census and initial signal triage. Use that result to identify
   which lane-level executable proofs can change a disposition.
7. Run offline-capable generation twice from identical materialised inputs in
   clean output locations and preserve both byte-level output sets and their
   raw diff.
8. Pack the curriculum SDK and resolve the tarball in an isolated Node 24
   consumer under the frozen scrubbed environment with `CI=true`,
   `--lockfile-only`,
   `--config.minimumReleaseAge=1440`,
   `--config.minimumReleaseAgeStrict=true`, and `--ignore-scripts`. Preserve
   and review the generated consumer lockfile, fetch the frozen closure in the
   only other network-permitted phase, then install with `CI=true`, `--offline`,
   `--frozen-lockfile`, and the same release-age/script policy. The reviewed
   lockfile is committed proof input for the second worktree. Inspect the raw
   tarball, retain regular files only, require the exact `package/` root, and
   canonicalise each safe member to one `./`-prefixed package-relative POSIX
   path. Export targets must carry that exact prefix; validation strips it,
   requires a non-empty remainder, and validates only the remainder segments.
   Absolute paths, backslashes, empty segments, single-dot or double-dot
   segments, and canonical-name collisions fail the proof. Exercise every
   runtime export condition under a proved network-deny sandbox and resolve
   every type-only condition without executing it. The exact condition name
   `types` is the sole type-only condition; every other current or future
   condition is runtime-required. Wildcard export keys are expanded against
   the canonical sorted regular-member list: each matching target substitution
   produces one concrete subpath/condition pair, and zero matches, duplicate
   pairs, ambiguous pairs, or absent targets fail the proof. Record the exact
   concrete export denominator/result matrix, dependency closure, exit status,
   and output.
   Treat this as the boundary proof for SDK-related conclusions, not as a
   universal health gate for unrelated lanes.
9. Validate `evidence.json`, recompute all artefact hashes, and compare them
   with the manifest. Repeat in a second clean worktree at the same commit.

The manifest is incomplete until it names an executable repository entrypoint
or an exact composition of existing repository commands. A prose-only recipe
does not satisfy reproduction. If calibration proves that no existing command
composition can emit the required evidence, the plan permits one minimal,
read-only agent-tools extractor; the manifest then records that repository
entrypoint and its version.

That extractor is a run-scoped census and serialisation capability only. It
emits the frozen producer for each of the nine graph edge kinds and the four
calibrated ownership chains. Its node-edge JSON is specific to this review and is not a reusable graph
substrate. It neither imports the curriculum SDK or SDK codegen packages nor
reimplements generic graph operations owned by the foundation graph
workspaces. Package generators and pack/build commands remain authoritative;
the extractor may invoke them and inspect their declared inputs, outputs,
manifests, and export maps.

Workspace admission also stays inside the pinned tree. The extractor parses a
strict YAML `packages` sequence and supports only literal directory segments
and a whole-segment `*`, which matches exactly one segment. Any other glob
grammar fails the run. Candidate workspaces come only from pinned regular
`package.json` paths, require a unique non-empty package name, and use deepest
root containment for file attribution.

Every graph producer also has one frozen endpoint-construction recipe in
`detector-config.json`. The recipe determines source and target node kinds and
identity components, edge status, evidence paths, and the exact cases that
emit no edge. Semantic validation recomputes those endpoints from the raw
producer observation; merely pointing an edge at two existing node IDs is not
sufficient. This keeps registration nodes distinct from external contracts
and prevents implementation choice from changing graph identity.

The extractor command accepts `--out` as a directory contained by
`invokingGitRoot` and publishes the fixed file `raw-extraction.json`. It reuses the established
`agent-tools` containment and directory-swap guards, refuses symlink targets,
creates an exclusive same-directory temporary file, and atomically renames
only a schema-valid complete result. Limit, validation, write, or rename
failure removes only that temporary file and leaves a previous successful
artefact untouched. Resource limits fail the whole run; clone groups and other
decision-bearing arrays are never silently truncated.

Strict JSON-schema validation is followed by a semantic completeness pass
before serialisation or temporary-file creation. That pass reconciles the file
denominator and availability partition, proves unique ordered paths, requires
one definition and total for every configured construct, recomputes per-file
totals, requires one complete analysis for each repetition detector, and checks
every diagnostic, clone member, module target, config reference, graph-node
path, and per-kind producer token against the pinned tree and frozen
vocabularies. The denominator digest uses the domain-separated, unsigned
64-bit-length-prefixed ordered-path framing declared by
`semanticValidation.pathsSha256`; it is not an implementation-selected join.
The pass also rejects decision-relevant `undetermined` candidates and any
completion-blocking evidence gap. These invariants are behavioural tests, not
assumptions delegated to JSON Schema.

Implementation is Red-first and atomic: each extractor behaviour lands with
its adjacent in-process unit description. Those tests operate only on injected
in-memory adapters; they never read `.agent/**/*`, inspect the live environment,
spawn a process, use the network, or conditionally register/skip cases. Pinned
real-source excerpts with source path and blob hash provide hand-counted
transform backstops. After build, an unconditional smoke command outside
Vitest executes the built unified CLI and identity gate against a deterministic
temporary Git fixture. Generation, consumer, closure, report, reproduction,
and drift proofs remain explicit manifest commands outside the test runner.

`implementationSha256` identifies the local built executable closure used for
the run, not the reviewed source snapshot. `executingCheckoutRoot` is derived
only from the built identity module URL and owns the executable, manifest, and
lock; `invokingGitRoot` is independently discovered from the caller and owns
the pinned snapshot and output. They may intentionally differ, as they do in
the built smoke. Starting at the actual built unified entrypoint, the identity
pass recursively follows every contained relative ESM import/export and literal
dynamic import to a member under `agent-tools/dist`. Each read rejects symlink
ancestors and leaf symlinks, checks lexical and real containment before and
after a no-follow descriptor read, and refuses unresolved, escaping,
non-literal-dynamic, or invalid members. It then includes
`agent-tools/package.json` and
`pnpm-lock.yaml` and hashes the exact ordered paths and bytes with the
length-prefixed framing declared in `detector-config.json`; all member paths and
hashes, Node version, and TypeScript version are emitted alongside it. The
manifest and lock represent declared external dependencies; installed external
package bytes are not byte-proved. Source/tsx execution is refused.

The published bytes use canonical JSON version
`lexicographic-object-keys-v1`: object keys are recursively sorted, validated
array order is preserved, indentation is two spaces, line endings and the sole
terminal newline are LF, and the exact UTF-8 byte sequence is size-checked once
before atomic publication.

Commands used for committed raw evidence must be selected or configured to
emit portable, repo-relative output. If a tool can emit only machine-local
paths or unbounded environment data, that output is not committed as “raw”;
the gap is recorded and the proof is rerun through a portable output mode.
Redacted or transformed output is never labelled raw.

Command records use the frozen `proof-env-v1` allowlist. They may persist only
the non-secret values `CI`, `NODE_ENV`, `TZ`, `LANG`, `LC_ALL`, and
`GIT_NO_LAZY_FETCH`. Secret-bearing variable names are recorded only as
present/absent booleans; their values, `PATH`, `HOME`, checkout paths, and
unknown environment keys are forbidden. Proof children inherit no ambient
environment: the harness supplies fixed locale values, a trusted executable
path, run-scoped HOME/XDG/npm cache, and an empty user config. The default
profile uses `NODE_ENV=test`; the `tsx-bundle-served-ui` `run-one` and
`run-two` stages must use `NODE_ENV=production`, and semantic validation
cross-checks that parent-proof/stage mapping. Only lockfile resolution and
package fetch may use the network; install is offline and export exercise
requires a proved network-deny canary.

## Raw and normalised evidence

Raw evidence is immutable within a completed snapshot. It records command
arguments, exit status, and a content hash. Normalisation is a separate,
versioned transformation with input hashes and a stated method. In particular:

- raw Git history includes commit identity, parent identity, time, path, and
  change type, but excludes author names and email addresses;
- normalised history may resolve renames and stable package identities while
  retaining pointers to raw rows;
- raw generation evidence preserves both runs and their byte-level diff;
- normalised generation evidence may group files by authority chain but cannot
  erase a raw mismatch; and
- inferred graph edges and candidate signals cite raw proof artefacts and are
  labelled as inference rather than observation.

Timestamps and host facts that do not affect the reviewed claim are provenance
metadata, not evidence payload. Reproducibility compares the declared
substantive artefacts and transformations; it never hides a substantive diff
inside normalisation.

## Generated code and source authority

Generated code is included because this repository controls its form,
organisation, packaging, and downstream use. Inclusion does not make a
generated carrier the semantic authority. Every generated-file record therefore
distinguishes:

1. semantic authority;
2. generator;
3. generated carrier;
4. runtime owner;
5. composition boundary; and
6. remediation locus.

Generated repetition can justify changing a generator, splitting an output,
or changing packaging. It cannot justify hand-editing generated output. A
finding in the carrier is routed upstream unless executable evidence places the
problem at packaging, export, build, or runtime composition.

The curriculum SDK is not labelled wholesale as generated. Its authored
runtime code, generated types and clients, export map, packed dependencies,
and consumers are classified separately. The packed Node 24 consumer proof is
the boundary test for what the published SDK actually carries; workspace
imports and a successful monorepo build are supporting evidence, not a
substitute.
