# MCP-137 preservation tier — read this before touching either capture folder

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

| Folder                                    | Source                                                                                                                                                 | Captured   | Contents                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | -------------------------------------------------------------------------- |
| `original-capture-2026-07-23/`            | The original Claude Design project (`314dd517-493d-4be2-bd08-56ae0e80e780`), via the owner's studio export of 2026-07-24 11:41                         | 2026-07-24 | 290 files — the full project minus the 39 held-out-class files (see below) |
| `iteration-pull-preservation-2026-07-23/` | The prior/iteration system: the pristine as-pulled 2026-07-23 pull-set (uncleaned — includes `theme-enhancements.css` and both candidate explorations) | 2026-07-24 | 17 files                                                                   |

Directory names carry the plan's corpus-as-of dates; per-file byte-size and
sha256 live in the manifest:
[`capture-manifest-2026-07-24.tsv`](./capture-manifest-2026-07-24.tsv).
The manifest's first row is a header; data rows resolve relative to the
folder their disposition names (`fetched-committed` →
`original-capture-2026-07-23/`, `legB-committed` →
`iteration-pull-preservation-2026-07-23/`, `fetched-local-held-out` → the
staging tier named in rule 5).

## Rules

1. **Never consumed.** No working surface imports, serves, builds, lints as
   product code, or references anything in either folder. They are records.
2. **Never edited.** Byte-preserved copies. A change here is a defect.
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
5. **Held-out classes** (39 files: `uploads/`, `reference/`, studio
   scaffolding, build outputs, thumbnails) are excluded from git per the
   import-era `LICENSING-MANIFEST.md` classes and held complete, byte-faithful,
   at `packages/design/design-import/original-capture-held-out-2026-07-24/` in
   the primary checkout — a gitignored staging tier (root `.gitignore` rule
   `packages/design/design-import/`), so it is invisible from linked worktrees
   and absent from git history; the import-era doctrine ("re-obtain from the
   studio") remains the fallback path. The import-era dispositions are
   hypotheses pending the owner's per-piece re-review (owner word, 2026-07-24:
   every piece gets re-reviewed); that review happens in the staging tier —
   nothing materialises into the capture folders before the owner's ruling.
   Classification note: root `support.js` is held out by class although
   byte-identical copies are committed at `templates/lesson-deck/support.js`
   and `templates/worksheet/support.js`. The manifest lists every held-out
   file with its hash.
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
