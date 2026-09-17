# Studio source material — not production code

Everything under `studio-source/` is **explicitly source material from Claude
Design**: specimen cards, white-label proofs, the reference homepage build,
the deck/worksheet templates and their studio runtime, the four compiled
reference components, the reveal.js integration example, and the proof pages.

None of it is used as production code in this repository:

- nothing here is on the package export surface (`package.json` `exports`
  names only the root consumable files);
- nothing here is imported or executed by any app or demo in this repo, and
  no app serves this tree. The ONE sanctioned consumer (ratified in the
  `identity-switchboard-first-pixels` plan node, 2026-08-09: "capture
  tooling only — nothing app-serves the fenced tree") is the
  design-showcase fidelity capture (`demos/oak-design-showcase/tools/`),
  which serves this tree read-only on an ephemeral localhost port for the
  seconds of a capture run and renders it headlessly as the diff target.
  That consumption pins `whitelabel/specimen.html`, the `whitelabel/`
  brand directories, and `Identity Switchboard.html` as CAPTURE CONTRACT —
  a rename or restructure of those files breaks `tool:fidelity` loudly and
  must update the showcase pairing map in the same change;
- these files render live on the **Claude Design studio surface** (their
  relative references resolve against the studio's layout, not this
  directory) — in-repo they are sources and fidelity targets.

**The quality-gate boundary follows this directory** (owner ruling
2026-07-19): production code gets no Sonar exclusions for any reason —
including generated product code — no quality-gate exceptions, nothing; the
scope exclusions in `.sonarcloud.properties` bind exactly `studio-source/**`
and only because this material is not production code. If any file here ever
becomes consumed by product code, it moves out of `studio-source/` and under
the full strict gate in the same change.

**Design-sync path mapping**: the studio project keeps these at its root
(`preview/`, `whitelabel/`, `templates/`, …). Sync maps
`studio:/<instrument-dirs>` ⇄ `repo:studio-source/<instrument-dirs>`; the
consumable files map root ⇄ root. See the workspace README §design-sync
runbook.
