---
name: claude-design-pipeline
classification: active
description: >-
  Work the Claude Design pipeline for a converted app — conversion playbook,
  byte-sacred export refresh via the claude-design MCP, and its core: the
  export↔implementation fidelity review (serve the canonical export and the
  dev server, capture both sides at matched geometry, perceptually diff every
  declared pair, review the side-by-side report, and record a disposition —
  fix / deliberate / investigate / matched / superseded — for every finding
  in the tracked divergence register). Use when converting or refreshing a
  Claude Design export, judging visual/feature fidelity against a canonical
  export, or before a §D-class sign-off.
---

# Claude Design Pipeline

## The pipeline at a glance

**Convert** (the
[conversion playbook](../../../../../docs/engineering/claude-design-conversion-playbook.md))
→ **refresh** the byte-sacred export via the claude-design MCP →
**fidelity review** (this skill's core, below) → the tracked **divergence
register** that ingestion tooling reads. The
`@oaknational/fidelity-review` package is the machinery; this skill is the
judgment workflow around it.

## Fidelity review

Compare a converted app against its canonical Claude Design export and leave
**every divergence with a recorded judgment**. The diff is triage; the
judgment is the deliverable. This is the agent-judged reconcile step of the
Claude-Design ingestion pipeline
([productionisation plan WS2](../../../../plans-backlog-2026-07/curriculum-hub-demo/current/productionisation-and-reuse.plan.md)
— "there is likely no deterministic route"): tools surface differences, an
agent or human decides what each one means.

## The contract

1. **The diff never gates.** Changed-pixel ratios prioritise attention; a
   high ratio is not a failure and a low one is not a pass. §D-class
   acceptance stays human/agent judgment over the report.
2. **Every finding gets a disposition** in the app's tracked register
   (`fidelity-register.json`): `fix` (real drift, work owed), `deliberate`
   (ratified divergence — cite the decision), `investigate` (cause unknown —
   name the next check), `matched` (verified equivalent), `superseded` (the
   pair or export moved on). Silence is the only wrong answer.
3. **The register is machine-read.** Ingestion tooling reads it to avoid
   re-flagging ratified divergences on export refreshes (the divergence
   register of WS2 stage 2). Keys are `<pairId>/<finding-slug>` — stable
   across refreshes; entries carry evidence paths, rationale, a role-handle
   author (never a personal name), and a date.
4. **The export is byte-sacred.** Never format, fix, or edit the canonical
   export; refresh it via the claude-design MCP
   (see the [conversion playbook](../../../../../docs/engineering/claude-design-conversion-playbook.md)).

## Worked instance — the Curriculum Hub demo

```bash
# Full run: serves the export, attaches to (or spawns) the dev server,
# captures both sides at 1440 CSS px / 2x, diffs, writes the report:
pnpm --filter @oaknational/oak-curriculum-hub tool:fidelity

# Re-diff and re-render the report from existing evidence (no browsers):
pnpm --filter @oaknational/oak-curriculum-hub tool:fidelity -- --report-only
```

Then open `demos/oak-curriculum-hub/demo-evidence/fidelity-report/index.html`:
each pair renders export | live | diff with its ratio, caveats
(height-mismatch etc.), and its recorded dispositions. Unjudged pairs show a
copy-ready JSON snippet — judge the pair, paste the entry into
`fidelity-register.json` with your disposition and rationale, and re-run
`--report-only` to see it recorded.

The comparable surface itself is declared in `tools/fidelity-pairs.ts`
(schema-validated: page pairs, per-block section pairs, reference-only pairs
that are never pixel-diffed, and the exempt surfaces that HAVE no export
target — absence is recorded, never silent).

## Review workflow

1. Run the tool; read the stdout summary (`PAIR <id>: <ratio>
   disposition=<recorded|UNREGISTERED>`).
2. Open the report. Work highest-ratio-first among UNREGISTERED pairs, but
   read every pair — a 2% diff can be a broken feature and a 25% diff can be
   a ratified redesign.
3. For each finding: name what differs (visual / feature / content / token),
   check whether a ratified decision covers it, and record the entry. Cite
   decisions in rationales.
4. `fix` entries become work items; `investigate` entries name their next
   check; the report's orphaned-entries section lists candidates for
   `superseded` after an export refresh.
5. A §D-class sign-off cites the report + a register where every pair's
   findings are dispositioned — that pairing is the evidence.

## Porting to a new conversion

The shared core lives in `@oaknational/fidelity-review`
(`packages/libs/fidelity-review` — consolidated at its second consumer,
2026-08-09; its README's §Modules is the authoritative enumeration).
Porting means composing it, not copying it: declare the app's own PAIR
schema (pair kinds legitimately differ per app) and wrap it with the
package's `buildPairingMapSchema`, seed a register, author the
app-local capture arms and export server at matched geometry with the
app's own default base and `SERVER_HINT`, and compose the package's
`/orchestrator` in a `tools/fidelity-review.ts` that keeps only paths,
capture arms, and `main`. The
[conversion playbook](../../../../../docs/engineering/claude-design-conversion-playbook.md)
§"Fidelity review and the divergence register" carries the method; this
skill carries the workflow.
