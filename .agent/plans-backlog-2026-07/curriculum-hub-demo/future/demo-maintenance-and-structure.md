---
title: Curriculum-hub demo — upstream reconciliation + directory discipline (forward capture)
status: ACTIVE INNOVATION / ENABLEMENT — captured 2026-07-01 (Director Swordfish holds Shoal), reframed by owner 2026-07-01. This is innovation work to ENABLE a second (and further) instances; it is NOT gated on a second instance appearing, and NOT an N=1 throwaway to harden-only-if-reused. Building the enabling capability IS the deliverable. (Earlier draft mis-applied the premature-generalisation/N=1 guard — corrected.) Structured via oak-reason. Warrants promotion future/ → current/. Sync mechanism CORRECTED 2026-07-01 (Polaris mends Perigee, Frigate's data-plane successor): canonical-export pull+unzip+diff-previous is the owner-directed reconcile; DesignSync per-file top-up + Vercel import-from-url are recorded as rejected.
lane: future
lineage:
  serves_thread: curriculum-hub-demo
  derives_from: owner forward-asks 2026-07-01 (three "for later" notes) + Squall's codification proposal
branch: feat/curriculum-hub-demo
---

# Curriculum-hub demo — upstream reconciliation + directory discipline

Capture of three owner asks (2026-07-01), reframed as **active innovation/enablement work**: we are
building the capability that makes a **second (and further) Oak Claude-Design demo/product instance**
possible. The second instance is a **goal we enable**, not a trigger we wait for — so nothing here is
gated on it. Sequence the work by value and dependency, not by "wait for demo #2." This brief is the
enablement plan; execution is owner-sequenced, not owner-deferred.

## Why this is one brief, not three

The `oak-reason` framing collapsed the three asks into a clearer shape:

- **Asks 1 and 2 are ONE artefact, not merely one pattern** (owner-directed mechanism,
  2026-07-01). The authoritative upstream is now the **Claude Design canonical export**
  (`demos/curriculum-hub-hw/claude-design-canonical-export/`) — a single self-contained snapshot
  that carries **both** the demo pages/content (`*.dc.html`, `data/*.json`, `assets/`, `embeds/`)
  **and** the design system (`_ds/…` bundle, tokens, fonts). So the demo-update ask (1) and the
  kit-update ask (2) are satisfied by **one sync unit and one diff**, not two separate reconcile
  machineries. "Pull in updates" is **pull a fresh export → unzip → diff against the previous
  committed export snapshot → classify + reconcile the delta**, NOT a `git merge` (no shared VCS
  ancestry) and NOT a per-file DesignSync pull.
- **Ask 3 (directory discipline) is a prerequisite** for 1 and 2: a reconcile workflow inherently
  names "the upstream-snapshot dir" and "our target dir" — those roles must be declared first.
- **All three feed the reusable-demo-process codification** (Squall → owner) — which is the
  **enablement spine**, not a someday-if-reused nicety. This is the first instance *by which* we
  build the repeatable capability; the codification is authored **now** (owner-reframed 2026-07-01),
  because enabling the next instance is the point. What stays disciplined is *sequencing by value*,
  not deferral.

## Ask 3 (do first, low cost, immediate value): directory-role taxonomy

`demos/curriculum-hub-hw/` grew organically to five subdirs + a file with no declared roles.
Ground truth (2026-07-01):

| Path | Role | Workspace? | Committed? |
| --- | --- | --- | --- |
| `PROJECT-BRIEF.md` | brief / entry doc | n/a | yes |
| `oak-curriculum-hub/` | **THE demo app** (`@oaknational/oak-curriculum-hub`; in `pnpm-workspace.yaml`) | **workspace** | yes |
| `oak-design-kit/` | vendored Oak design assets (from-prototype decode + DesignSync pulls) | no | yes (post-C7) |
| `oak-design-system/` | working DesignSync reference (partial) | no | **gitignored** |
| `reference-prototype/` | the upstream source (Heather W's prototype HTML) | no | yes |
| `demo-evidence/` | verification output (screenshots, probes) | no | yes (post-C7) |

**Problem:** it is not obvious which dir is the workspace vs vendored-upstream vs
working-reference vs output vs source; two design dirs (`oak-design-kit` committed vs
`oak-design-system` gitignored) are easily confused.

**Approach (deferred):** declare each dir's role explicitly — a short taxonomy section in
`PROJECT-BRIEF.md` (or a `demos/curriculum-hub-hw/README.md`) naming, per dir: role
(workspace / vendored-upstream-snapshot / working-reference / source-prototype /
output-evidence), commit status, and the discipline rule (what belongs, what does not). Consider
whether `oak-design-system/` (gitignored working ref) and `oak-design-kit/` (committed vendored
snapshot) should converge or be explicitly distinguished by name. This is a docs/convention
change — reversible, cheap — and could be actioned during or right after the demo lands.

## Asks 1 & 2 (enablement capability; sequence by value)

Both are instances of **upstream-reconciliation of a no-shared-ancestry vendored copy** — a
repeatable capability that enables future instances, built as real work (not held for a trigger).

### Ask 1 — pull in upstream DEMO updates (when the Claude Design project is revised)

- **Gap:** when the upstream Claude Design project changes, there is no repeatable way to carry the
  delta into our re-platformed React/Next demo without re-doing the port by hand.
- **Mechanism (owner-directed, 2026-07-01):** the upstream is obtained as a fresh **Claude Design
  canonical export** (a first-party export-zip the owner produces — the trustworthy acquire step;
  it depends on no third-party tool). Reconciliation = **pull the fresh export → unzip → diff
  against the previous committed export snapshot** (a deterministic git/structural diff over the
  `*.dc.html` block models + `_ds` manifest + `data/*.json` + assets) → classify the delta
  (content / structure / style / asset) → apply it to the React components, with an evidence trail.
  The `reference-prototype/` decode is **superseded** as the upstream representation.
- **Why this is trustworthy:** each export is committed as an immutable, versioned snapshot, so
  "the previous version" is a real, diffable artefact in git — the comparison the owner asked for.
- **The apply-and-verify half now has a working consumer (landed 2026-07-03, owner-directed):**
  the fidelity review (`tool:fidelity` + the tracked `fidelity-register.json` divergence
  register + the `claude-design-pipeline` skill) compares the RESULT of any reconcile against the
  export at matched geometry and records a disposition per divergence — so a sync's "did the
  apply preserve fidelity, and is every remaining difference judged?" question has a standing
  answer surface. Ratified divergences live in the register and are not re-flagged on the next
  pull (the productionisation plan WS2 stage-2 contract).
- **Fidelity ground-truth authority order (worked, 2026-07-02):** the export's **source JS
  bindings beat its renders**. State-dependent treatments (quiz answered-states, flip backs,
  hotspot active markers) exist ONLY in the template's `enrich()` style strings — no capture of
  a resting page can show them, and a render can lie (the missing-font serif artefact class).
  Order of authority: export JS bindings > export template wrappers > SPA-driven per-state
  captures > static screenshots.
- **The content arm of the sync loop is the re-runnable generator (Director-ratified insight,
  2026-07-01):** a content-extraction generator built re-runnable (the 214-block Course
  generator) IS the reconcile mechanism for content — pull fresh export → diff → re-run the
  generator → reconcile. Content extraction and upstream sync are one mechanism, not two.
- **Enablement value:** a repeatable author-update path makes the demo family sustainable; build the
  capability rather than wait for the first update to arrive.

### Ask 2 — reconcile upstream Claude Design KIT changes

- **Gap:** the Oak design kit (Claude Design source) evolves; our committed `oak-design-kit/`
  snapshot drifts → visual fidelity decays.
- **Mechanism (owner-directed, 2026-07-01) — same as Ask 1:** the design system ships **inside**
  the canonical export (`_ds/…` bundle, `tokens/`, `colors_and_type.css`, `fonts/`, `assets/`), so
  kit changes arrive in the **same fresh export** as demo changes. Reconciliation = **pull the
  fresh export → unzip → diff against the previous committed export snapshot** → re-apply the token
  / asset deltas → update provenance/versioning. No separate kit-reconcile machinery is needed.
- **DesignSync is NOT the mechanism (owner: assume prior-team DesignSync mechanisms suspect,
  2026-07-01).** The earlier DesignSync `get_project`/`list_files`/`get_file` per-file top-up
  (research-doc Proposal A) is **not adopted**: it is read-only + chat-scoped to `/design-login`,
  per-file only (the ~140-icon bottleneck), has no independent byte-diff source, and is treated as
  suspect. It is recorded as *considered and rejected*, not as a live option.
- **The Vercel `import-claude-design-from-url` tool is NOT the mechanism (owner-rejected,
  2026-07-01).** It is an import-*assist* into a hosting target that yields no versioned, diffable
  snapshot, so it cannot serve as the export+diff sync; recorded as *considered and rejected*.
- **On a Claude Design export API:** whether Anthropic exposes a programmatic export/sync API is an
  **open, unverified research item** — do not assert either way. The mechanism above is **robust to
  the answer**: the manual export-zip + git-versioned snapshot + deterministic diff works
  regardless; a confirmed export API would only automate the acquire step.
- **Feeder research:** `.agent/research/claude-design-integration.md` (Claude Design nature +
  integration surface, first-hand validated). Its Ask-2 answer has been **corrected in place** to
  this canonical-export mechanism; treat every prior-team claim there as a claim-to-verify, not a
  fact. Likely cross-thread with `agentic-mechanisms-discovery` + the reusable-demo-process
  codification proposal.

## Decision record (from oak-reason, reframed by owner 2026-07-01)

- **Sequence, don't defer.** All three are active enablement work; the discipline is *ordering by
  value and dependency*, not waiting for a second-instance trigger. The N=1/premature-generalisation
  guard does NOT apply — the second instance is the goal being enabled, not a hypothetical that
  might justify generalising later.
- **Sync mechanism is owner-directed (2026-07-01):** pull a fresh **Claude Design canonical export**
  → unzip → diff against the previous committed export snapshot → classify + reconcile. The export
  is one self-contained artefact carrying both demo content and the design system, so Asks 1 and 2
  share **one sync unit and one diff**. **Rejected mechanisms** (recorded as decisions, not live
  options): the DesignSync per-file top-up — read-only, chat-scoped, per-file (the ~140-icon
  bottleneck), with no independent byte-diff source, and owner-directed to treat prior-team
  DesignSync mechanisms as suspect; and the Vercel `import-from-url` tool — an import-assist into a
  hosting target that yields no versioned, diffable snapshot, so it cannot serve as the export+diff
  sync. The `reference-prototype/` decode is superseded.
- **Dependency order:** Ask 3 (directory-role taxonomy) is the cheap prerequisite; the
  canonical-export reconcile capability (Asks 1 & 2, unified) plus the codification spine are the
  enablement core; the codification is authored as real work, not held as an isolated proposal.
- **Warrant / falsifier:** the "one export snapshot" framing holds while the canonical export
  remains the complete, self-contained upstream (pages + data + assets + design system). It must be
  revisited if a future upstream splits the design system out of the export, or if a verified
  Claude Design export API changes the acquire step. Whether such an API exists is an open research
  item; the mechanism does not depend on the answer.

## Sequencing (owner-set priority welcome)

Not "non-goals / wait" — these are the enablement work items, ordered by value + dependency:

1. The demo (first instance) lands — in progress.
2. Directory-role taxonomy (Ask 3) — cheap prerequisite; clears the seams for reconciliation, and
   declares where committed export snapshots live so "the previous version" is a real git artefact.
3. Canonical-export reconcile capability (Asks 1 & 2, unified: pull fresh export → unzip → diff
   previous snapshot → reconcile) + the codification spine — the enablement core, informed by the
   Claude Design research (`.agent/research/claude-design-integration.md`).

The workspace-vs-not structuring and any repo-topology moves are deliberate design steps within
this, not deferred non-goals.
