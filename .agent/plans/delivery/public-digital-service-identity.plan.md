---
id: public-digital-service-identity
node_type: delivery
name: "Public Digital Service identity — total naming replacement of the outgoing counter-identity"
overview: "Replace the outgoing counter-identity's name everywhere with the owner's new naming universe — Public Digital Service (PDS), a clear nod to GDS, serving the Office of Education (OoE) — as a pure naming-and-identity change: visuals unchanged (the design is near perfect), zero occurrences of the outgoing word in the tracked tree at completion, enforced by a standing census-driven validator."
status: ratified
ratified_by: "Jim Cresswell (owner)"
ratified_date: 2026-08-03
ratified_where: "Owner card answers (AskUserQuestion), Corsair session 4d3282, 2026-08-03: ~06:04Z ratify-and-execute + mapping + records policy; ~06:27Z archive conditional-removal + tracked-tree boundary; decision-complete plan approved via plan-mode ExitPlanMode same sitting"
serves: design-system-as-configured-framework
impact_areas:
  - design-system
tickets: []
depends_on: []
owner_gates: []
# The former mechanical gate (its record, conserved): it held ONLY the
# tickets field — substance is the owner's 2026-08-03 instruction,
# quoted verbatim in §Direction, with the ratification stamp complete
# since 2026-08-03. Both premises dissolved (embargo lifted 2026-08-06;
# ticket-existence obligation removed by the plan-node schema
# §2026-08-07 amendment, PR #817), so the gate DISCHARGED 2026-08-07
# with tickets left [] — a visibility ticket remains optional working
# practice.
last_updated: 2026-08-07
---

# Public Digital Service identity — total naming replacement

**Dated note (2026-08-03).** Authored, ratified, and taken to DECISION-COMPLETE
in one sitting at the owner's word by the executing design seat (Corsair hunts
Surf, 4d3282). The decision-complete pass ran two exhaustive exploration
catalogues plus an adversarial mechanics pressure-test; every implementation
decision below is made — execution requires zero further design calls. The
owner approved the decision-complete plan via plan mode; its working copy is
conserved at the session plan file and transcribed here as the durable home.

## Direction (owner words, 2026-08-03, verbatim)

"We need to take the Freedonia identity and replace it with Public Digital
Service, PDS, a clear nod to GDS... this is about naming and identity, the
design is near perfect, later we will compare it to the official GDS colours
and guidelines. At the end of the replacement the word Freedonia will not exist
in the repo, only Public Digital Service, PDS, and the Office of Education
OoE." Precedence, his words: it "take[s] precedent as soon as it can do so
without being disruptive or risking loss of other design work."

Owner card answers (all 2026-08-03): ratify-and-execute; the PDS/OoE role
mapping confirmed; EMC²/`creature` untouched confirmed; records repaired in
place confirmed — then, on the planning pass's discovery of the capture tree's
standing byte-preservation ruling: "You can remove them only if everything of
value in them also exists in our tracked files" (the conditional-removal
authorisation for that ONE tree); and the repo boundary confirmed as the
git-tracked tree.

## The reading (CONFIRMED at the owner's cards)

The old fiction (verified verbatim in the live tree): the **Republic of
Freedonia** (polity) has a **Department of State for Education** (DSE; brand
label "Freedonia DSE", abbreviation FDSE); demonym **Freedonian**. The new
fiction from the owner's four given names: the **Public Digital Service
(PDS)** — the GDS-analogue whose design system this identity is — serving the
**Office of Education (OoE)**, the department whose pages the proof renders.
One rendered identity, two names in one fiction (ARC-converged with the
Director). No polity name was given, so none is invented: polity references
are dropped or neutralised. The identity was designed as a public service from
the start — the live brand sheet's own header reads `v7 "the public service"`.

## D1 — Names and keys (complete mapping)

| Role | Today | Becomes |
| --- | --- | --- |
| Machine identity key (slug regex `/^[\w-]+$/` verified) | `freedonia` | `pds` |
| Directories (live kit, served copies) | `whitelabel/freedonia/`, `public/brands/freedonia/` | `whitelabel/pds/`, `public/brands/pds/` |
| Brand display label (Switchboard, READMEs, page h2s, option labels, iframe titles) | `Freedonia DSE` / `FDSE` | `Public Digital Service` (`PDS` where the site used the abbreviation) |
| The org on the proof page (title, masthead wordmark, BRAND.md h1) | `Freedonia Department of State for Education` | `Office of Education` |
| Polity small-line (masthead `<small>`, card wordmark) | `Republic of Freedonia` | dropped — the masthead carries the org alone (GDS-like; no invented polity) |
| Demonym/adjective | `Freedonian` curriculum | `national` ("the national curriculum, openly published") |
| Bare `DSE` / "the DSE" in brand prose | the department | `the Office` / `OoE` |
| CSS identifiers | `.fdse-icon`, `.m-fdse` | `.pds-icon`, `.m-pds` (class + every markup consumer in the same commit) |
| JS identifiers | `fdse` var, `'Oak↔FDSE'`/`'FDSE↔EMC²'` keys | `pds`, `'Oak↔PDS'`/`'PDS↔EMC²'` |
| Footer disclaimer | "Freedonia and its Department… are fictional" | "The Office of Education and the Public Digital Service are fictional — a proof of this design system's white-label contract." |
| `logo.svg` | geometric mark (GDS blue/yellow); the word ONLY in `aria-label` | same mark; `aria-label="Public Digital Service"` — one-line edit, no re-authoring, visuals untouched |

Disciplines bound to the table: fiction-wording rows are defaults the owner
corrects at the PR3 rendered checkpoint in Chrome; the FDSE guard is
CASE-SENSITIVE exact matching per D2 (trued 2026-08-03 at the PR1 review
round — the earlier word-boundary phrasing described a mechanism the gate
does not have; case-sensitivity is what makes the mixed-case base64 blob
`Fdse63A+…` in the lesson-deck standalone template unmatchable, and that
file must never be touched); `oak-flat.generated.css` is
regenerated via the kit build after `components.css` is edited, never
hand-edited; parity pairs (`KIT_ASSET_COPIES` — name-MAPPED, brand-full.css
serves as brand.css) change atomically with their manifest rows; slug-derived
paths (`/brands/${identity}/…`, `?brand=` builders) self-heal when slug and
directories rename together; `capture-manifest-2026-07-24.tsv` gets
path-column substitution + head-note with sizes/hashes left as captured-fact.

## D2 — The validator (the standing guard)

Home `agent-tools/src/validators/identity-naming/`, mirroring the
`machine-local-paths` validator exactly (git ls-files -z full read,
SKIP_EXTENSIONS binary skip + NUL sniff, fail-loud unreadable reads, exit
0/1/2 contract, colocated helpers + unit tests, agent-tools script, root
`repo-validators:check` chain — running in CI and pre-commit). Forbidden
token set: the outgoing name (case-insensitive, non-locale lowercase —
catching demonym and possessives as substrings) PLUS the initialism pair
`FDSE`/`fdse` (case-sensitive, immune to the base64 trap). Tokens built by
STRING CONSTRUCTION in source and tests (principles §"Never weaken a gate").
Two legs: the PATH leg unconditional over every tracked path including
skipped binaries; the CONTENT leg respects the skip set (rasters are
ungateable — PR5 records a one-off `strings`/`pdftotext` sweep and
dispositions residue). One validator, census-driven mode: census present
with entries → RATCHET (per-entry count equality both directions — live
above census fails as new occurrence, live below fails as stale census, so
the census update IS the ratchet-down ceremony, recomputed at CI and
pre-commit); census empty or deleted → STRICT, zero tolerance, zero
exclusions. Every accidental state fails red. Red-first proof: the recorded
strict-leg output in PR1 (~215 content + 16 path findings) — never a
wired-red gate. Non-vacuity: fails loudly on zero files scanned.

## D3 — The census artefact

Home `.agent/reports/design/pds-identity-rename/census.json`
(formatter-safe under the existing reports-tree ignore rules). Entry schema
(trued 2026-08-03 to the implemented three-column shape — name casings pool
into one case-insensitive count because every casing is forbidden and the
end state is zero regardless; the two initialism casings stay separate,
which is where re-casing churn is actually detectable):
`{ file, kind: "content"|"path", countByVariant: {name, initialismUpper, initialismLower}, breakdown: [{mappingRole, contextKind, dispositionClass, count}] }`.
The ratchet contract is `(file, kind, countByVariant)` only — line numbers
never in the contract (the validator prints live `file:line:col` in run
output); per-variant counts catch re-casing churn; breakdown sums are
validator-checked. Census self-hit cure: in ratchet mode the content scan
excludes exactly the census's own path (the `file` column necessarily carries
the token); in strict mode there is no exclusion — the census is emptied and
deleted in the same final landing.

## D4 — Records repair mechanics

The tracked target set outside design/demos is exactly 13 files / 79
occurrences, all under `.agent/` (zero in docs, ADRs, source, config —
definitively verified; the review corpora dominate). Markdown records:
mechanical substitution + ONE dated head-note per file, written in the new
vocabulary only. Verbatim owner quotes (the completion plan's Direction and
gate lines, the director-handoff ruling blockquote): bracketed elision INSIDE
the quote — never silent substitution inside quoted owner words. JSON
records: TEXT-MODE substitution only, never parse-and-reserialise
(`findings.v1.json` carries `\uXXXX` escapes a round-trip would normalise);
no added fields anywhere (the comms schema is `additionalProperties: false`).
DSE alone is not a forbidden token; its dead-label references are swept
editorially and the deliberate "DSE-analogue" anchor in this plan survives
until PR5 trues this plan's own text. Self-referential surfaces (this plan's
Direction quote, the ARC channel naming-map entry, the thread record) are
trued in PR5 with quote-elision + head-note — the last occurrences standing
by design. No deletions except the owner-authorised archive removal (D7).

## D5 — PR slices (PDR-132; branches `jimcresswell/pds-*`; bot identity; Copilot at open; never squash)

| PR | Story | Reviewers (fan-from-brief, opus) | Window |
| --- | --- | --- | --- |
| PR1 | Census generator + census artefact + validator (ratchet wired; strict red-proof recorded; FDSE census-governed from day one) | code-expert + test-expert | immediately — touches nothing frozen |
| PR2 | Live MECHANICAL rename in one coherent state: kit whitelabel dir + slug + served copies + parity rows + tests + `.fdse-icon`/`.m-fdse`/`fdse` identifier renames + the Switchboard LABEL and logo `aria-label` (the user-facing identity moves atomically — never `pds: 'Freedonia DSE'` between PRs) | code-expert + design-system-expert + react-component-expert | after PR1 |
| PR3 | Naming-universe prose: brand-sheet headers/comments, BRAND.md, page fiction (masthead, title, disclaimer, demonym rewrites), preview labels; kit-source + served-copy content edits land together (byte-parity coupling) | design-system-expert + accessibility-expert; `owner-held` rendered checkpoint in Chrome BEFORE merge | after PR2 |
| PR4 | Docs/skill/plans true-up: kit CHANGELOG/DECISIONS/KNOWN-ISSUES/LICENCES/README, `design-system-usage` skill (coupled to the dir rename), `integration-oak-curriculum-hub.md` FDSE line, `components.css` comment + kit rebuild regenerating `oak-flat.generated.css`, completion-plan references with dated Decision-log provenance | docs-adr-expert | completion-plan file only after round 3 closes |
| PR5 | Records repair (13 `.agent` files); the ARCHIVE VALUE-PARITY AUDIT then removal; comms/handoff courtesy sweep; census empties + file deleted; validator flips strict; recorded binary sweep; PRESERVATION-README updated with the dated removal ruling + git-history pointer | code-expert + docs-adr-expert | after round 3 closes |

**PR5's archive value-parity audit (the owner's removal condition)**: a
committed audit report enumerating every file in
`original-capture-2026-07-23/` (329 files), each dispositioned
`identical-to-live` / `superseded-by-evolution` (git history holds the
captured state) / `unique-value` (extracted to a named tracked home in the
same PR). Removal executes only at zero unextracted `unique-value` rows. The
sibling `iteration-pull-preservation-2026-07-23/` tree carries zero
occurrences and is untouched. The size-warning (>8 files) is consciously
accepted for PR2/PR5 — a rename is one story (PDR-132 §4).

## D6 — Sequencing and precedence (ARC-converged with the Director)

Round-3 verdict absorption preempts at any moment; rename work fills
non-disruptive gaps. PR4's completion-plan edit and PR5's corpora repair wait
for round-3 close. The Director routes landing windows against the fold
cadence. The natural landing arc completes before design-system-completion
implementation begins, so its identity work executes in the new names at zero
migration cost.

## D7 — Scope boundary (the tracked tree is the repo; owner-confirmed)

The guarantee is over git-tracked files, contents and paths. Explicit
exclusions, stated never silent: gitignored instance state (4 comms events +
9 handoff-pack files — untracked by design, never on a fresh clone; a
one-time courtesy sweep in PR5 repairs this machine's copies,
substitution-only, schema-safe); the gitignored museum export trees
(`oak-open-curriculum-design-system-tna-24072026-1141/`, `design-import/` —
frozen import bundles, left untouched); `.turbo` build logs (self-heal);
linked worktrees (excluded by the validator's `git ls-files` scope). The
tracked capture archive `original-capture-2026-07-23/` is REMOVED at PR5
under the owner's conditional authorisation, honouring its own standing
ruling ("Never edited… we can remove the preservation copies; they will
still exist in git history") instead of falsifying its byte-preservation
guarantee. Also out of scope: the GDS colour/guideline comparison (owner's
"later"); any visual change; EMC²/`creature`.

## Acceptance (proof-typed)

1. `repo-safe`: PR1's recorded strict-leg red-proof + ratchet leg green
   against the committed census + count-parity test.
2. `repo-safe`: after each rename PR, all suites green; the ratchet census
   strictly decreases; no visual diff (tokens/values untouched — showcase
   suites + a screenshot note at PR2).
3. `owner-held`: PR3's rendered naming checkpoint in the owner's Chrome
   before merge.
4. `repo-safe`: PR5 — strict leg green over the tracked tree: zero
   occurrences, contents and paths; standing thereafter.
5. `repo-safe`: `validate-plan-corpus`, `check:docs`, markdownlint, prettier
   green at every landing.

## First-principles check (plan-body rule, clauses 4–6)

- Every decided state above carries owner provenance (the verbatim
  instruction + four card answers) or a named seat verdict confirmed at a
  card; the one standing-ruling collision found in planning (the capture
  tree's byte-preservation ruling) was surfaced to the owner and resolved by
  his conditional-removal word, never adjudicated by the seat.
- Landing path: five single-story PRs from main under the full ceremony; the
  validator + census land first so every subsequent state is census-governed.
- Repository literals verified at authoring (2026-08-03, two exploration
  catalogues + a mechanics pressure-test, all first-hand against the primary
  tree): ~215 content occurrences + 16 token-bearing tracked paths; 95
  `FDSE` + 16 `fdse`; the slug-guard regex; the parity manifest's name
  mapping; the comms schema's closedness; zero occurrences in docs/ADRs;
  `logo.svg`'s geometry.
- Record-consumer clause: the census is read by the validator on every CI
  and pre-commit run and by the rename PRs as the work queue; the audit
  report is the archive removal's standing evidence; no write-only records.

## Decision log (owner word unless marked seat-verdict)

| Decision | Provenance |
| --- | --- |
| Plan RATIFIED for execution | Owner card answer, 2026-08-03 ~06:04Z |
| Decision-complete plan APPROVED | Owner plan-mode approval, 2026-08-03 ~06:30Z |
| PDS = service-name role; OoE = department role (DSE-analogue) | Seat reading (Corsair, 2026-08-03); CONFIRMED at the owner's cards |
| Machine identity key: `pds` | Seat verdict (Corsair, 2026-08-03) — matches the `oak`/`creature` key shape |
| Records repaired in place with dated head-notes | Owner card 1; JSON text-mode + quote-elision refinements from the planning pass |
| Capture archive REMOVED, conditional on the value-parity audit | Owner card 2 (2026-08-03 ~06:27Z): "remove them only if everything of value in them also exists in our tracked files" |
| Repo boundary = the git-tracked tree | Owner card 2 (2026-08-03 ~06:27Z) |
| FDSE/fdse join the forbidden token set (case-sensitive) | Seat verdict (Corsair, 2026-08-03) per the pressure-test — one concept, one name; the initialism universe would otherwise survive the gate |
| Polity dropped; demonym → "national" | Seat defaults (Corsair, 2026-08-03) per never-invent-identities; owner corrects at the PR3 rendered checkpoint |
| EMC²/`creature` untouched | Seat reading; CONFIRMED at the owner's card |
| D3 variant schema = 3 columns (name pooled; initialism per-casing); D1 FDSE guard wording trued to case-sensitivity | Seat verdict (Corsair, 2026-08-03) at the PR1 review round — code-expert Important 6 + suggestion |

## Relationships

- **`design-system-completion`** (this seat's executing node) — references
  the outgoing name at L77, L101–102, L267–270, L574; trued by PR4 at its
  next legal edit window (post-round-3) with dated Decision-log provenance.
  This node's PR2/PR3 landing before that plan's implementation start
  removes its identity-migration naming cost entirely.
- **Review corpora** under `.agent/reports/design/plan-review-2026-08-02/` —
  live round-3 read set; PR5 repairs them only after the round closes.
- The ARC dialogue channel
  (`.agent/collaboration/rapid-comms/2026-08-03-pds-identity-…`) carries the
  Director convergence record; trued in PR5 like every dated record.

## Execution seat and review

Corsair hunts Surf (4d3282), PDR-117 implementer; claims `6dff4c64` (this
node) and `953f9f8c` (the completion plan) held. Execution worktree:
`pds-w0-census-validator` (branched from origin/main; install + build before
gates). Per-PR review per the D5 reviewer table under invoke-code-experts. This
node is the durable home of the decision-complete content (the plan-mode
working copy was session-local and is superseded by this transcription).
