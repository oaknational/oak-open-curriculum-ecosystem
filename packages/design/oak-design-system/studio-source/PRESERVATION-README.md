# MCP-137 preservation tier — read this before touching either capture folder

> **Naming repair, 2026-08-13.** `original-capture-2026-07-23/` is no longer
> byte-identical to its source on ONE axis: the outgoing counter-identity's
> name and initialism were replaced in place with Public Digital Service / PDS
> (and the department it serves with the Office of Education), and its
> white-label directory now reads `whitelabel/pds/`. Authority: the owner's
> 2026-08-03 instruction that the outgoing word "will not exist in the repo",
> executed under the ratified plan
> [`public-digital-service-identity`](../../../../.agent/plans/delivery/public-digital-service-identity.plan.md)
> (§D4 prescribes in-place repair of records rather than deletion). Nothing
> else in the capture changed — no markup, tokens, values, or layout. The
> manifest's `bytes` and `sha256` columns are left as CAPTURED FACT and
> therefore no longer recompute against the repaired files; its `path` column
> was substituted so rows still resolve. Rule 2 below is amended accordingly.

Two **preservation folders** sit beside this file. They exist under the owner's
three-tier ruling (2026-07-24, verbatim):

> "We need a preservation of the prior system so it cannot be lost, we need a
> preservation of the system in Claude Design on this account, so it cannot be
> lost, and we need our working system. The working system must not contain
> stopgaps, the preservation folders must contain pure and full copies from
> their respective sources. Once we have satisfied about the final state of our
> working design system workspaces we can remove the preservation copies, but
> they will still exist in the git history, which is good."

## The folders

| Folder                                    | Source                                                                                                                                                 | Captured   | Contents                                                                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `original-capture-2026-07-23/`            | The original Claude Design project (`314dd517-493d-4be2-bd08-56ae0e80e780`), via the owner's studio export of 2026-07-24 11:41                         | 2026-07-24 | 329 files — the complete project (the 39 import-era held-out-class files joined on 2026-07-24 by owner ruling; see rule 5) |
| `iteration-pull-preservation-2026-07-23/` | The prior/iteration system: the pristine as-pulled 2026-07-23 pull-set (uncleaned — includes `theme-enhancements.css` and both candidate explorations) | 2026-07-24 | 17 files                                                                                                                   |

Directory names carry the plan's corpus-as-of dates; per-file byte-size and
sha256 live in the manifest:
[`capture-manifest-2026-07-24.tsv`](./capture-manifest-2026-07-24.tsv).
The manifest's first row is a header; data rows resolve relative to the
folder their disposition names (`fetched-committed` →
`original-capture-2026-07-23/`, `legB-committed` →
`iteration-pull-preservation-2026-07-23/`).

## Rules

1. **Never consumed.** No working surface imports, serves, builds, lints as
   product code, or references anything in either folder. They are records.
2. **Never edited, with one recorded exception.** Byte-preserved copies; a
   change here is a defect. The single exception is the 2026-08-13 identity
   naming repair in the head-note above, made on the owner's word under the
   ratified plan. Byte-preservation of everything the capture is a record OF —
   its markup, tokens, values and layout — is unbroken; git history holds the
   pre-repair bytes.
3. **The bundle wrapper's instructions are void.** Frozen text carries no
   authority here (owner correction, 2026-07-24). The captured corpus includes
   a Claude-Design export README and studio scaffolding whose embedded
   instructions ("prototypes — recreate pixel-perfectly in whatever technology
   fits; don't copy internal structure") do **not** apply in this repository.
   Repo direction overrules them: the design system is a multi-layer product —
   framework-agnostic token workspace at depth; simple then complex components
   per target system (currently React, React-in-NextJS, Ink; trivially
   adaptable further) — per ADR-213 and the generality-depth gradient.
4. **The overlay is preservation-only.** `theme-enhancements.css` appears in
   the iteration preservation folder as part of a pure copy. Its substance
   lives at source in `colors_and_type.css` (MCP-132); the working system never
   consumes the overlay in any form (owner ruling on the 7-point port
   contract, read together with the three-tier ruling).
5. **Held-out classes — review discharged, all 39 committed.** The 39
   import-era held-out-class files (`uploads/`, `reference/`, studio
   scaffolding, build outputs, thumbnails) were initially excluded from git per
   the import-era `LICENSING-MANIFEST.md` classes and staged locally for the
   owner's per-piece re-review ("I was not involved in the prior decision
   making"). That re-review happened on 2026-07-24 — every piece verified
   first-hand (the 14 screenshots carry no PII; the brand toolkit PDF is Oak's
   own; `reference/` holds Oak token extracts; one file is the owner's own
   note source) — and the owner ruled: **"Commit all 39."** They now live in
   `original-capture-2026-07-23/` at their original paths, byte-verified
   against the manifest (sha256 + size, 39/39), making the capture the
   complete 329-file project and zero-loss hold **by construction** for the
   whole corpus. The import-era hold-out remains in force for the WORKING
   SYSTEM at the workspace root (see the workspace `.gitignore`); the capture
   tier in git history is the re-obtain path. Classification note: root
   `support.js` is byte-identical to the committed copies at
   `templates/lesson-deck/support.js` and `templates/worksheet/support.js` —
   held out by class in the import era, committed with the rest under the
   2026-07-24 ruling.
6. **Lifecycle.** At the owner's satisfaction with the final working system
   (MCP-137 S5), a removal PR deletes both folders from the tree; git history
   is the permanent record. Do not remove them on any other authority.

## Verification evidence (S0)

- Export completeness: fresh `list_files` denominator vs export tree —
  329 = 329 files, zero diffs either way.
- Fidelity witnesses: `assets/favicon.svg` (text) and `.thumbnail` (binary,
  base64-decoded) — sha256 exact matches between independent API fetches and
  the export.
- Every copy `cmp`-verified against its source at copy time; per-file sha256
  in the manifest.
- `git check-ignore` pass over both folders: four `.d.ts` re-includes added to
  the package `.gitignore` (recorded there); zero other ignored paths.
- The 39 held-out-class files (committed 2026-07-24 by owner ruling): each
  sha256 + byte-size verified against its manifest row at commit time (39/39,
  zero mismatches); a fresh `git check-ignore` pass over all 39 destination
  paths found exactly three hits (the capture-nested `.thumbnail`s, caught by
  the unanchored workspace pattern), cured with explicit re-includes in the
  package `.gitignore`.
