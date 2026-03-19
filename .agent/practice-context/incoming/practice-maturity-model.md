# Practice Maturity Model

> **Source**: `pine-scripts` integration experience
> **Status**: Proposal

## Observation

The `pine-scripts` Practice installation went through distinct maturity stages over multiple sessions. Each stage had different failure modes, different diagnostic signals, and different intervention strategies. Recognising these stages earlier would have dramatically reduced wasted effort.

## Proposed Maturity Levels

### Level 1: Structural

**Characteristic**: Files present, directories correct, references resolve.

**What it looks like**: The Practice directory exists, files are in the right places, the Practice Core trinity is present. An agent reading the file tree would conclude "this repo has the Practice installed."

**Failure mode**: Everything looks right but nothing works. Directives are shallow or empty. Rules are copied text without reasoning. Sub-agent templates exist but the agent doesn't know what to do with them.

**Diagnostic signal**: Run metacognition. If the output is a mechanical list of "I reflected on X" statements without genuine recursive depth, the Practice is at Level 1.

**Intervention**: Deep comparison with a working Practice installation. Not file-by-file comparison, but **intent comparison** — does each artefact in the receiving repo carry the same depth of reasoning as its counterpart in the source?

### Level 2: Operational

**Characteristic**: Directives have depth, rules have reasoning, sub-agents function.

**What it looks like**: An agent reading the Practice files would understand not just WHAT to do but WHY. The metacognition directive creates genuine feedback loops. The principles explain the reasoning behind each rule. Sub-agent reviewers produce structured, actionable output.

**Failure mode**: The Practice works when invoked but doesn't self-correct. Drift accumulates silently. New files are added without updating cross-references. Adapters diverge from canonical sources.

**Diagnostic signal**: Run consolidation. How many stale references, missing adapters, and fitness ceiling violations are found? If the count is high, the Practice is operational but not self-correcting.

**Intervention**: Establish the consolidation cadence. Make fitness functions active. Add portability validation.

### Level 3: Self-Correcting

**Characteristic**: Metacognition produces genuine insights, consolidation catches drift, fitness functions prevent bloat.

**What it looks like**: Running metacognition generates observations that lead to actual Practice improvements. Running consolidation is routine and catches small issues before they compound. Fitness ceilings are monitored and violations are addressed promptly.

**Failure mode**: The Practice corrects itself but doesn't evolve. It maintains its current state but doesn't discover new principles, propose improvements, or adapt to changing requirements.

**Diagnostic signal**: Check `practice-lineage.md`. When was the last learned principle added? Check `practice-context/outgoing/`. Has the Practice generated any proposals for the wider ecosystem?

**Intervention**: Run deep metacognition focused specifically on "what has this Practice learned that other Practices should know?" Use the experience/memory system to capture insights.

### Level 4: Evolving

**Characteristic**: Practice-lineage captures learned principles, outgoing context proposes improvements, incoming context is processed for insights.

**What it looks like**: The Practice is an active participant in its own improvement and in the improvement of the broader ecosystem. New principles are discovered through work, documented in lineage, and proposed to other repos through the context exchange. Incoming proposals are evaluated and integrated when valuable.

**Failure mode**: Evolution without selection pressure. Changes accumulate without evaluation. Lineage grows without tightening. Context exchange becomes a dump rather than a curated signal.

**Diagnostic signal**: Read the last 3 lineage entries. Are they genuinely new insights or restatements of existing principles? Read outgoing proposals. Would they be useful to another repo, or are they too specific to this domain?

**Intervention**: Periodic deep review of Practice quality. The Practice reviewing itself is the ultimate test of metacognitive depth.

## Integration Process Alignment

The integration process should explicitly target Level 3 before declaring "integration complete":

| Phase | Target Level | Verification |
|-------|-------------|-------------|
| File transfer | 1 (Structural) | All files present, all references resolve |
| Intent transfer | 2 (Operational) | Metacognition produces depth, reviewers produce structured output |
| Consolidation | 3 (Self-Correcting) | First consolidation run finds few/no issues |
| First exchange | 4 (Evolving) | Outgoing context contains a genuine insight |

Most integrations currently stop at Level 1 or early Level 2. The `pine-scripts` experience shows that the gap between Level 1 and Level 3 is where most of the value (and most of the effort) lies.

## Suggested Placement

This model could live in:
- `practice-bootstrap.md` — as a maturity checklist for integration verification
- `practice.md` — as part of the Practice's self-description
- A new `practice-maturity.md` in the Practice Core

The lightest-touch option is adding a brief maturity checklist to `practice-bootstrap.md` with a reference to fuller documentation.
