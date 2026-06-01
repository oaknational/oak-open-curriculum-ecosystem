---
name: "Plan-Index Reachability Remediation"
overview: "Ensure every plan file is a leaf node traceable to the shared root via collection + lifecycle indexes. Audit performed 2026-05-19 found 3 unindexed collections, 5 orphan plans below lifecycle layer, and 2 collections missing lifecycle READMEs."
status: decision-incomplete
todos:
  - id: phase-0-grounding
    content: "Phase 0: Re-run the orphan audit script from this plan's appendix to confirm the gap list has not changed since 2026-05-19."
    status: pending
  - id: phase-1-collections-into-root
    content: "Phase 1: Add `notes/`, `observability/`, and `user-experience/` to the Plan Collections table in `.agent/plans/README.md` with accurate scope and status."
    status: pending
  - id: phase-2-lifecycle-readmes
    content: "Phase 2: Add lifecycle `README.md` files to `observability/{active,current,future}/` and `security-and-privacy/future/`, each listing every plan in that directory per the existing lifecycle-README convention."
    status: pending
  - id: phase-3-orphan-threading
    content: "Phase 3: Thread the 5 orphan plans into their lifecycle READMEs — agent-tooling/current/sub-agent-rename-and-skill-integration.plan.md; agent-tooling/future/third-party-skill-reimport-targets.md; agentic-engineering-enhancements/current/validation-and-tdd-doctrine-restructure.plan.md; architecture-and-infrastructure/future/vercel-build-warning-elimination.plan.md; semantic-search/future/search-ingestion-sdk-extraction.execution.plan.md."
    status: pending
  - id: phase-4-validator
    content: "Phase 4: Add a repo-validators check that fails CI when a plan file under `.agent/plans/**/{active,current,future}/` is not referenced by its sibling `README.md`, and when a collection is not referenced by `.agent/plans/README.md`. Hooks into `pnpm repo-validators:check`."
    status: pending
  - id: phase-5-docs
    content: "Phase 5: Update `.agent/plans/README.md` Plan Collection Structure section to make the leaf-to-root reachability requirement explicit, and reference the new validator."
    status: pending
---

# Plan-Index Reachability Remediation

**Last Updated**: 2026-05-19
**Status**: 🟠 DECISION-INCOMPLETE — awaiting owner review and slot
**Scope**: Restore the leaf-to-root reachability invariant for the
`.agent/plans/` tree so every plan file is reachable from
`.agent/plans/README.md` via collection and lifecycle indexes.

---

## Context

A reachability audit on 2026-05-19 (Shaded Passing Candle session) found
three categories of gap against the `root README → collection README →
lifecycle README → leaf plan` convention documented in
[`.agent/plans/README.md`](../../README.md):

1. **Three collections present in the filesystem but absent from the
   root Plan Collections table**: `notes/`, `observability/`,
   `user-experience/`. Of these, `observability/` and `user-experience/`
   are referenced from `high-level-plan.md` but not the canonical root
   README. `notes/` is unreferenced from either.
2. **Two collections missing lifecycle READMEs** so the leaf plans
   bypass the lifecycle index entirely: `observability/{active,current,
   future}/` and `security-and-privacy/future/`. Their plans are
   currently surfaced via the collection-root `README.md` and
   `high-level-observability-plan.md` only, which is inconsistent with
   the convention applied across other collections.
3. **Five orphan plans below the lifecycle layer** — present in their
   directory but not listed in the sibling `README.md`:
   - `agent-tooling/current/sub-agent-rename-and-skill-integration.plan.md`
   - `agent-tooling/future/third-party-skill-reimport-targets.md`
   - `agentic-engineering-enhancements/current/validation-and-tdd-doctrine-restructure.plan.md`
   - `architecture-and-infrastructure/future/vercel-build-warning-elimination.plan.md`
   - `semantic-search/future/search-ingestion-sdk-extraction.execution.plan.md`

The three top-level graph coordination artefacts
(`graph-portfolio-index.md`, `graph-mvp-arc.plan.md`,
`graph-combinatorial-arc.plan.md`) were a fourth gap in this audit. They
were remediated in-line at audit time by adding direct references to
`.agent/plans/README.md` above the Plan Collections table, since they
were cross-collection coordination spines rather than members of any
single collection.

**Update 2026-06-01**: these three spines (plus
`feat-mcp-graph-support-foundation-meta.md`) were subsequently quarantined to
`archive/completed/` as superseded pre-rebuild framing (see `completed-plans.md`),
and the root-`README.md` references were removed. Graph work is now reached
through its owning collections, not through root-level spine files.

## Non-Goals

- Re-organising any plan's actual content. This is a pure indexing pass.
- Moving plans between lifecycle states. Status of each leaf is owned by
  its plan file, not this remediation.
- Renaming collections.

## Acceptance

- **A1**: Every plan file at `.agent/plans/**/{active,current,future}/*.md`
  (excluding `README.md`) is referenced by name in the sibling lifecycle
  `README.md`.
- **A2**: Every lifecycle directory under `active/`, `current/`, `future/`
  has a `README.md`.
- **A3**: Every collection directory under `.agent/plans/` (excluding
  `archive/`, `templates/`, `icebox/`) appears in the Plan Collections
  table in `.agent/plans/README.md`.
- **A4**: A repo validator enforces A1 and A3 at `pnpm repo-validators:check`
  time, failing CI on new orphans or unindexed collections.
- **A5**: `.agent/plans/README.md` Plan Collection Structure section
  states the leaf-to-root reachability invariant explicitly and points
  at the validator.

## Validation

- Re-run the orphan audit script (Appendix) and confirm zero orphans.
- Run `pnpm repo-validators:check` and confirm the new validator passes.
- Spot-check three random leaf plans and trace each back to root via
  link-following.

## Relationship to Existing Plans

- Owned by the `agentic-engineering-enhancements` collection because the
  concern is *how the plan portfolio is organised and discovered*, not
  any one workspace's implementation.
- Independent of the broken/accelerator lens being applied to paused
  steps in
  [`agentic-engineering-enhancements`](../../../memory/operational/threads/agentic-engineering-enhancements.next-session.md);
  this plan does not affect program advancement.
- Should run alongside graph tooling rather than ahead of it: reachability
  is structurally important but not a graph-tooling accelerator. The
  validator (A4) is the gate that prevents regression.

## Open Questions for Owner

- **Q1**: Slot — parallel to graph work, or queued behind it? Default:
  parallel, since the validator is the long-term guard and the rest is
  bounded index editing.
- **Q2**: Validator location — `agent-tools/` workspace (extending the
  existing repo-validators set) or a standalone script? Default: extend
  `agent-tools/` repo-validators for consistency with existing patterns.

## Appendix — Orphan Audit Script

```bash
for col in agent-tooling agentic-engineering-enhancements \
           architecture-and-infrastructure compliance \
           connecting-oak-resources developer-experience \
           exploring-open-education-resources observability \
           sdk-and-mcp-enhancements sector-engagement \
           security-and-privacy semantic-search \
           user-experience notes; do
  for sub in active current future; do
    dir=".agent/plans/$col/$sub"
    [ -d "$dir" ] || continue
    readme="$dir/README.md"
    actual=$(find "$dir" -maxdepth 1 -type f -name "*.md" \
             ! -name "README.md" | sort)
    [ -z "$actual" ] && continue
    for f in $actual; do
      base=$(basename "$f")
      if [ -f "$readme" ]; then
        grep -q "$base" "$readme" || echo "ORPHAN: $col/$sub/$base"
      else
        echo "NO-README: $col/$sub/$base"
      fi
    done
  done
done
```
