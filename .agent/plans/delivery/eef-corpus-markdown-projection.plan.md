---
id: eef-corpus-markdown-projection
node_type: delivery
name: "EEF corpus markdown projection — strand reference files rendered from the corpus"
overview: "Render the fixed EEF Teaching and Learning Toolkit corpus into prettier-normal markdown — one reference file per strand plus one corpus-reference file carrying source, methodology, caveats and the strand index — from a pure projection in the corpus package with a thin writer script, so any downstream artefact that needs the evidence carries the corpus's own facts and attribution with no hand copy and no server."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-09-06
ratified_where: "Owner decision card at the lane seat (Finch binds Sundog, 47f9d2), 2026-09-06 ~10:3xZ, answer 'Ratify: build it next' to the card describing the per-strand and corpus-reference renderers, nothing committed here, one PR within the two-round budget"
serves: toolkit-re-architecture
impact_areas:
  - packaging-and-distribution
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-10-02
---

# EEF corpus markdown projection

## Goal

When this lands, the corpus package can render its EEF corpus as markdown on demand: one
file per strand carrying that strand's headline metrics
(`EEF_TOOLKIT_DATA.strands[].headline`), definition (`.definition`), key findings
(`.key_findings`) and, where the strand carries them, effectiveness (`.effectiveness`),
behind-the-average detail (`.behind_the_average`), disadvantage-gap note
(`.closing_the_disadvantage_gap`), implementation considerations (`.implementation`),
related guidance reports (`.related_guidance_reports`), related strands
(`.related_strands`) and update history (`.update_history`), plus its tags (`.tags`) and
EEF page (`.eef_url`); and one corpus-reference file carrying the source and attribution
block (`meta.source`, `meta.licence`, `meta.coverage`), the methodology (`methodology`),
every caveat (`meta.caveats`) and the complete strand index (`strands[].name`,
`.headline.headline_summary`, `.eef_url`). The curation index
`strands[].school_context_relevance` is deliberately not rendered, and both the module and
the corpus reference say so. Every rendered line is
corpus text read from one of those source paths or a fixed structural label, and nothing is
authored or paraphrased (the `eef-corpus-grounding` rule's cite-or-tag discipline, applied
by construction); the output is already in the formatter's normal form; and nothing is
committed in this tree: a consumer commits the rendered files with a provenance pin naming
the corpus data version and the commit that rendered them. Today the same facts reach a reader only through the served MCP
tool and the interpretation resource, both of which need a deployed server, and the
interpretation guide's later layers name the served tool, so neither can be shipped as a
no-server reference.

## User groups and value

- **Authors of skills and documents that cite the evidence** — in any repository, including
  a satellite repository worked alongside this one and the canonical organisation's own skills
  library, whose evidence-informed guidance today points at the dormant tool. They get the
  corpus's facts as files they can commit, cite by path and re-render at a corpus refresh.
- **Teachers, through whatever carries those files.** Impact, cost, evidence strength and
  every caveat, attributed to EEF and linked to the strand page. Offered value; the claim
  boundary sits with each consumer's own evaluation.
- **The platform's maintainers.** One projection family beside the existing headline view,
  in the package that owns the data; the interpretation resource can adopt the
  corpus-reference renderer later as its second consumer without this lane touching it.

## Mechanism

- **Two pure renderers** in `packages/sdks/graph-corpus-sdk/src/eef-strands/`, beside the
  headline view: one takes a strand id and returns that strand's markdown; one takes no
  arguments and returns the corpus-reference markdown (source and attribution verbatim from
  `corpusMeta`, methodology from `corpusMethodology`, caveats from `corpusCaveats`, the index
  over `EEF_STRAND_IDS` with each strand's headline summary and EEF page). Both read only
  the package's own exports. Sections a strand does not carry are absent from its file: the
  strand shapes differ (measured 2026-09-06 over `EEF_TOOLKIT_DATA.strands`: `effectiveness`
  on 7 of 30, `behind_the_average` on 6, `implementation` on 4, `related_strands` on 17,
  `related_guidance_reports` on 7, `update_history` on 10, `closing_the_disadvantage_gap` on
  2, `headline.number_of_studies` on 2), and each optional section is narrowed on a bound
  local before it is read. A strand whose `headline.impact_months` is null (4 of 30) states
  that the corpus holds no figure and carries its `headline_summary` verbatim. Lists are
  bullets, never pipe tables: the formatter pads tables, and a byte pin over padded tables
  fights it forever.
- **A pure file-set function** returns the reference plus one entry per strand, each with
  its relative path (`strands/<id>.md` beside `eef-corpus-reference.md`), so the layout and
  every relative link agree by construction; every strand id is lower-case letters, digits
  and hyphens, pinned by a test so a refresh cannot carry a path segment into a file name.
- **A version stamp.** Each rendered file opens with the corpus data version from
  `corpusMeta.data_version`, so a consumer's provenance pin has a value to name.
- **A thin writer** at `scripts/render-eef-markdown.ts` taking `--out <dir>`
  (the planned `render:eef-markdown` root script): it writes the file set and nothing else. The
  output root must sit inside the directory the command runs from, checked lexically before
  anything is created, canonically through its nearest existing ancestor before it is
  created, and canonically once it exists; each target directory gets the same checks before
  a write; each target is opened without following symbolic links and without blocking,
  checked through its own descriptor to be a regular file with a single link, and only then
  truncated and written, so a symbolic link, a hard link to another file, a directory, a pipe,
  a socket or a device in a target's place is refused with no window and no hang. It never deletes: a consumer's own drift check compares its committed set against the file-set
  function, and a file an earlier render produced that the current corpus no longer does is
  the caller's to remove. It verifies every written file against the repository's formatter
  configuration resolved from the script's own location, so a drift between the renderer's
  normal form and the repository settings fails at the write, and a filesystem failure is
  one stderr line and a non-zero exit. It imports the file-set module directly, never the
  package barrel. It is the corpus package's twin of the MCP app's served-tool-table
  generator.
  The script sits inside both of the package's tsconfig includes so type-check and lint
  cover it, runs under `tsx` declared by the package, and the package's existing knip block
  gains `scripts/**/*.ts` in its entry and project globs.
- **Tests, in the shared vitest include.** The rendered file set equals the reference plus
  `EEF_STRAND_IDS`, with no orphan and no gap, and every rendered path is relative, carries
  no parent segment and resolves under the output root. Each strand's rendering carries its
  headline impact or the no-figure wording, cost label, evidence-strength label, every key
  finding and its EEF page. The key set each renderer reads — strand sections and fields,
  corpus metadata and methodology alike — is pinned at compile time by `satisfies` coverage
  maps in the source that name every key the corpus carries as rendered or omitted, so a
  corpus refresh that adds or drops a field fails the build naming it; no test tests a type.
  The tests derive their omission sets from those maps, and a leaf-completeness walk over
  every string and number value outside them is the prose catch-all behind the pins; named
  cases cover the heterogeneous `by_phase` key set and per-phase months. The
  corpus-reference rendering carries the source, every author, the licence, the attribution
  note, every caveat, every cost band, every evidence factor, every conversion row and every
  index entry verbatim. Every rendered text equals its own formatter-normalised form under
  the formatter's defaults; the writer script, not a test, verifies every written file
  against the repository's resolved configuration, which makes `prettier` a devDependency of
  the package. No test touches the filesystem.

### Where the first-principles check fires

- **Shape.** The tests prove authored behaviour: set completeness, fact presence and
  normal-form output. No vendor assertion.
- **Landing path.** Renderers and tests sit under `src/**`, inside the shared include
  pattern; the writer sits under `scripts/`, outside it by design, and enters knip's map.
- **Vendor literal and locus.** The exports named (`strandById`, `EEF_STRAND_IDS`,
  `corpusMeta`, `corpusMethodology`, `corpusCaveats`) were read from the package's index on
  2026-09-06; the corpus constant itself is not a public export and is not needed.
- **Optionality.** One output shape; no consumer built here; no "either" left open.
- **Record consumer.** No register is added. The provenance pin lives in each consumer and is
  read by that consumer's own drift check.
- **Rules tier.** `eef-corpus-grounding` (every claim a cite), `consolidate-at-second-
  consumer` (the resource's adoption is routed as a named follow-up, not absorbed here),
  `never-disable-checks` (no ignore entries), `no-tombstones-for-removed-ideas`.

## Acceptance criteria (each with a proof — required)

- **Complete and faithful.** The set test and the fact-presence test pass for every strand
  and for the corpus reference. Proof: `repo-safe` — the tests, in `pnpm test` and the
  pre-push suite.
- **Normal form by construction.** Each rendered text equals its formatter-normalised form.
  Proof: `repo-safe` — the test.
- **Writable to any directory inside the invocation directory.** Every rendered path is
  relative, carries no parent segment and resolves under the output root; the script writes
  only what the file-set function returns and refuses an output root outside the directory
  it runs from, a target directory that resolves outside the root (through its nearest
  existing ancestor before creation), or anything but a single-link regular file in a target's
  place.
  Proof: `repo-safe` — the set-equality and path-shape tests;
  the write itself is exercised by running the script into a scratch directory, where its
  own verification checks every written file against the repository formatter
  configuration, by linting the output with the repository's markdown rules, and by the
  refusal runs (outside root, symbolic-link ancestor of the root, symbolic-link target,
  directory in a target's place, named pipe in a target's place, hard-linked target,
  symbolic-link target directory), all named in the PR.
- **Faithful to the corpus.** Every value reachable in a strand outside the omitted keys
  appears in its rendering. Proof: `repo-safe` — the leaf-completeness test.

## Todos

One single-story pull request within the default round budget (PDR-132): the two renderers
with their tests, the writer script, the knip entry.

## Out of scope

- Any consumer of the rendering: a plugin skill, a skills library entry, a document. Each is
  its own artefact in its own home and commits the rendered files with a provenance pin. A
  consumer that is itself an agent skill renders the set into its `references/` directory
  (the reference file and `strands/` beneath it, which the Agent Skills specification
  permits) and authors its own `SKILL.md`; the layout needs no change for that.
- The interpretation resource adopting the corpus-reference renderer: a follow-up
  consolidation at the second consumer, its own small change.
- The writer's containment helpers (canonicalising the nearest existing ancestor before a
  directory is created; opening a target as a regular file through its own descriptor without
  following links) moving into `@oaknational/safe-path`: a consolidation at the second consumer
  that needs them, its own small change; the script keeps them local until then.
- The `school_context_relevance` block: it is the selector the evidence tools use, and on
  some strands it also carries per-phase and per-application impact figures and a study
  count. Rendering those figures is a named follow-up, its own small change to this
  projection, not a silent drop; the module and the corpus reference state the omission.
- Rendered output in this tree: none is committed here. The PR's diff scope shows it, and
  no repository check pins an absence in a consumer's own path.
- The served surface, the served tool and the resource rows: unchanged.
- The corpus data, its provenance and its refresh: the corpus remains a hand-refreshed
  snapshot; the position stays "provenance pending clarification" in the data itself.
- A strategic home for open-evidence work: the strategy choice this projection serves has no
  strategic node; this node serves the seam node and re-parents in one line if one is minted.
- Concurrent modification of the output tree during a run: another process swapping a checked
  ancestor directory for a symbolic link between the containment check and the open (a
  check-then-open race; `O_NOFOLLOW` covers only the final component, and `node:fs` offers no
  `openat`) is outside the writer's closed contract, which states what a target may be, not
  what other processes do to the tree; dispositioned by signed reply at #58's round six,
  recorded here as the Director ruled on 2026-09-07 (eb793bad).
