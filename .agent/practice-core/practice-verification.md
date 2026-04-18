---
provenance: provenance.yml
fitness_line_target: 200
fitness_line_limit: 300
fitness_char_limit: 15000
fitness_line_length: 100
---

# Practice Verification

This file completes the hydration lifecycle. Where
[practice-bootstrap.md](practice-bootstrap.md) defines **what to build**,
this file defines **how to verify the build is operational**. The five
sections form a progressive sequence: structural checklist, intent-level
health check, minimum estate definition, three-state audit, and acceptance
criteria.

**See also**: [practice-bootstrap.md](practice-bootstrap.md) for artefact
templates, [practice-lineage.md](practice-lineage.md) §Validation for the
portable validation checks.

## Bootstrap Checklist

After creating all files, validate:

1. `.agent/practice-core/` contains the full Practice Core package:
   the eight files (trinity + verification + entry points + changelog
   + provenance), plus the three required directories —
   `decision-records/` (with its README and any PDRs),
   `patterns/` (with its README and any general abstract patterns),
   and `incoming/.gitkeep`. The contract is the **set of surfaces
   and their roles**, not a file count; growth by explicit decision
   per PDR-007. One optional peer directory may accompany the Core:
   `.agent/practice-context/` (sender-maintained ephemeral exchange
   material; `incoming/` there is transient; `outgoing/` sharpened
   under PDR-007 to ephemeral-exchange-only).
2. `.agent/practice-index.md` exists, all its links resolve, and its
   sections match the format specified in
   [practice-bootstrap.md](practice-bootstrap.md).
3. `AGENT.md` links to `.agent/practice-core/index.md`.
4. Every file path referenced in AGENT.md, rules, commands, and agents
   resolves.
5. Every agent's reading requirements point to files that exist.
6. `AGENTS.md` links to `AGENT.md`, which links to `principles.md` and
   `testing-strategy.md`.
7. The `start-right-quick` skill references all foundation documents.
8. The napkin rule points to a napkin skill that exists.
9. Quality gates (`type-check`, `lint`, `build`, `test`) are wired in
   `package.json`.
10. The project builds.
11. **Artefact portability**: canonical skills and commands in `.agent/`
    contain no platform-specific syntax. All platform adapters are thin
    wrappers. Validate adapter-to-canonical consistency and authorisation
    parity in tracked project config with a portability check or manual
    review.
12. **Cohesion audit**: all Practice Core files are internally consistent,
    practice-index.md links resolve, and all broader Practice files
    (directives, rules, commands, skills) are aligned with the Core. No
    stale descriptions, no contradictions, no outdated wording.

## Post-Installation Health Check

After the Bootstrap Checklist passes, run this intent-level verification.
Structure alone does not guarantee a working Practice — shallow artefacts
look correct but fail silently. This check is mandatory, not optional.

1. **Metacognition verification** — read the metacognition directive. It
   must contain explicitly named layers (thoughts, reflections, insights),
   an affective break, and a grounding anchor. If any are missing, the
   directive has been reduced to a planning template — rewrite it from
   the reference in [practice-bootstrap.md](practice-bootstrap.md).
2. **Escape-hatch scan** — read rules and principles. Flag "where
   practical", "where possible", "when appropriate", "unless" — these
   turn mandatory rules into optional suggestions. Flag rules shorter
   than three lines with no reasoning — they are likely stubs.
3. **Reference resolution** — for every markdown link in directives,
   commands, and sub-agent templates, verify the target file exists.
   Silent degradation (correct-looking links to absent files) is worse
   than a missing artefact because it is invisible.
4. **Adapter completeness** — for every canonical rule in `.agent/rules/`,
   verify a corresponding adapter exists in each configured platform
   directory. Missing adapters mean rules do not fire on that platform.
   Record gaps in the surface matrix if one exists.
5. **Self-reflection** — run the metacognition directive on the
   integration itself. If it produces genuine insights, the integration
   is likely healthy. If it produces a summary of steps taken, the
   metacognition directive is probably broken (return to step 1).
6. **Continuity-host existence** — if `go`, `session-handoff`, or
   start-right reference a continuity surface, that surface must exist.
   Doctrine without a host surface is not operational continuity.
7. **Bridge truthfulness** — verify that `practice-index.md` truthfully
   reflects the installed estate: correct counts, correct directories,
   no links to absent surfaces, deliberate omissions documented.
8. **Runtime smokes** — where the runtime depends on repo-local canonical
   files (hook scripts, validators), execute them against the installed
   estate. Parity checks alone can false-green when the canonical source
   is missing. Three proof modes apply: presence checks (do canonical
   files exist?), parity checks (do wrappers and permissions match?),
   and runtime smokes (can the live runtime execute?).

## Minimum Operational Estate

The artefact templates in [practice-bootstrap.md](practice-bootstrap.md)
describe what _can_ exist. A working Practice requires a minimum estate to
be _operational_ — without these surfaces, workflows reference absent sinks
and the Practice is structurally present but inert.

### Mandatory Surfaces

1. **Core and local bridge** — `.agent/practice-core/` (the portable Core
   package), `.agent/directives/AGENT.md` (repo entry point), and
   `.agent/practice-index.md` (local bridge from Core to live estate).
2. **Memory layer** — `.agent/memory/napkin.md`,
   `.agent/memory/distilled.md`, `.agent/memory/patterns/README.md`. If
   always-active skills reference these files, they must exist on first
   real use.
3. **Continuity host** — one explicit surface for the continuity contract
   (see [practice-bootstrap.md §Continuity Contract](practice-bootstrap.md#continuity-contract)).
   Prompts are a strong default; if a repo chooses a different host,
   `go`, `session-handoff`, and start-right must point to it explicitly.
4. **Planning scaffold** — `.agent/plans/README.md` and executable-plan
   templates. The repo does not need live workstream plans on day one,
   but it needs the scaffold for the first real multi-session workstream.
5. **Platform truth for activated surfaces** — if tracked platform config
   activates hooks, permissions, or other shared behaviour, the canonical
   sources must also exist. For hook support: `.agent/hooks/policy.json`,
   `.agent/hooks/README.md`, the surface matrix, and repo-local runtimes.
   Tracked activation without canonical source is a broken install.
6. **Validators** — portability validation, practice-fitness validation,
   and any repo-specific surface parity checks. Without validators, the
   Practice can drift back into documentary-only mode.

### Optional But Coherent

These surfaces are optional, but their absence must be explicit and
consistent across operational surfaces:

- `.agent/experience/` — experiential records (referenced in
  `practice.md` Artefact Map but not required for basic operation)
- hooks when every platform is unsupported
- workstream-specific plan collections
- domain or tool specific reviewer clusters

Optional never means "silently referenced but not installed."

## Claimed / Installed / Activated Audit

The Health Check above tests intent; this audit tests state exhaustively.
A surface is only operational when three states line up:

- **Claimed**: what `AGENT.md`, `practice-index.md`, commands, skills,
  and local docs say exists
- **Installed**: directories and files actually present in `.agent/`,
  adapters, prompts, memory, hooks, and reference docs
- **Activated**: platform config, validators, and runtime scripts that
  make a surface live on a fresh checkout

The most dangerous failures are silent — adapters exist but permissions
do not, tracked activation exists but canonical source does not, the
bridge still advertises surfaces that were removed, or continuity
workflows look plausible but no host surface exists.

After hydration, verify every referenced local surface actually exists.
Fail validation when activation exists without canonical source — the
missing source is the defect, not a condition that bypasses the check.
Treat optional local surfaces as feature flags, not assumptions: if a
repo does not install prompts, continuity workflows must point to the
real local surface instead of hardcoding a path that does not exist.

## Fresh-Checkout Acceptance Criteria

A hydration is complete only when an agent can do all of the following
**without consulting the source repo**:

1. Read `AGENT.md`, the bridge, memory, and continuity surfaces
   successfully.
2. Use `go` and `session-handoff` against a real continuity host.
3. Create the first real plan collection from local templates.
4. If hooks are supported, run the hook runtimes successfully against
   local canonical policy.
5. Run the portability validator (or equivalent) successfully.
6. Confirm the bridge truthfully reflects the installed estate —
   correct counts, no links to absent surfaces, deliberate omissions
   documented.
