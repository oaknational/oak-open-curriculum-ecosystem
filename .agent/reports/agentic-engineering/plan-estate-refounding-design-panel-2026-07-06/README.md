# Design-panel working corpus — plan-estate refounding (2026-07-06)

The verbatim outputs of the six-facet design panel + four-lens critic pass that produced
`plan-corpus-refounding.plan.md`,
conserved from the session-local working directory so the R0 builder has the full script
contracts, cost tables, worker-role specs, and rejected alternatives — not just the
synthesis.

**Authority order:** the [design record](../plan-estate-refounding-design-2026-07-06.md)
is authoritative (it carries every critical finding's disposition and the cross-estate
review absorption); these files are the un-reconciled panel inputs and contain the
contradictions the critics caught (e.g. the phantom pre-partition, the divergent row
estimates, the exempted challenge classes later corrected). Read them WITH the design
record's §3/§3a disposition tables, never instead of them. `brief.md` is the panel's
grounding brief as issued. These files are conserved verbatim and are never edited.
Panel-caught contradictions are dispositioned in the design record's §3/§3a tables;
build-time divergences discovered after the panel are recorded in the list below.

**Known superseded points in F1 (named so a builder cannot mis-anchor):**

1. **Area/batch count** — F1 §10 says "17 areas"; the measured spread is 20+ buckets
   (22 top-level directories). Already dispositioned: the deterministic denominator
   script settles the enumeration at freeze time, and batch ordering is a RULE over that
   enumeration, never a frozen list (design record §1; F6 open question).
2. **`refound-plant-orphan` scope** — F1 specifies residue-style plants only. The
   ratified contract is wider: the marker-free sweep-net paraphrase plant AND the sealed
   planted-loss challenge plants with hash-commit-then-reveal keys (plan P4 + r3/r4
   acceptance; both arrived AFTER the panel — the lossless critique and the cross-estate
   review's B1). The plan's R0a todo and the R0 session opener carry the full plant set;
   build to those, not to F1 §plant-orphan alone.
3. **Tiling block start rule** — F1 D5 and §11 describe an anchor-ONLY start, but F1 §9
   itself defines the line-1 file-preamble block that precedes the first anchor. The
   landed rule is anchor-start OR line-1 preamble: a block may start on an anchor line or
   on line 1 as the pre-anchor preamble. An unconditional anchor-only rule would leave the
   S2 tiling verifier permanently RED (every file's pre-anchor preamble would read as a
   non-anchor start); build to anchor-OR-line-1, not anchor-only.
4. **`block_id` form** — F1 §3 shows a counter-style example (`semantic-search-0417`). The
   ratified block id is coordinate-derived — `<file>:<start>-<end>` (e.g.
   `plans/alpha/a.md:3-5`) — never a counter, so the id is a pure function of the block's
   coordinates and stays byte-stable across runs. Build to the coordinate form, not the
   counter example.
5. **Arrivals report basename** — F1 §5 names `arrivals.report.json`. The landed artefact
   applies F1's own versioned-artefact convention (as `denominator.v1.json`,
   `inventory.v1.jsonl`, etc.) and is written as `arrivals.v1.report.json`. Build to the
   versioned basename, not the unversioned §5 spelling.
6. **No root `agent-tools:refound-*` aliases** — F1 D9 and §5 assume root-level
   `agent-tools:refound-*` script aliases. The landed surface is package scripts (in
   `agent-tools/package.json`) plus knip entries only — no root aliases (a pre-existing
   tranche-1 divergence, carried forward for tranches 2–3). Invoke the tools by their
   package scripts, not by root aliases that do not exist.
7. **Per-line digest algorithm** — F1 §3 records SHA-1 per-line digests in
   `inventory.v1.jsonl` and `sweep-hits.v1.jsonl`; landed = SHA-256 (field `sha256`),
   one digest primitive estate-wide. SHA-1's weak-hash class is gate-checked
   (Sonar S4790) and the "fingerprint, not a security boundary" caveat it needed is a
   caveat a future reader can get wrong; build to SHA-256, not to F1 §3's algorithm.
8. **Run-state basename** — F1's artefact tree and its §5 script-catalogue row for
   `refound-batch-status` name `run-state.json`. The landed artefact applies F1's own
   versioned-artefact convention (as items 5 and 7) and is written as
   `run-state.v1.json`; build to the versioned basename, not the unversioned §5
   spelling.

F1 itself is NEVER edited; every point above is recorded here, not patched into the
conserved panel input.
