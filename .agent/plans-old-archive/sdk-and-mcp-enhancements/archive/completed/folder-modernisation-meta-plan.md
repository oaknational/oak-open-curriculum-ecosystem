# Meta Plan: Bring `.agent/plans/sdk-and-mcp-enhancements` Fully Up to Date

**Baseline Date**: 22 February 2026  
**Status**: Complete and archived  
**Completed Date**: 22 February 2026  
**Archived Location**: `.agent/plans/sdk-and-mcp-enhancements/archive/completed/folder-modernisation-meta-plan.md`

## Summary

This plan modernises the folder into a stable governance model by:

1. Archiving legacy numbered plans.
2. Preserving useful concepts in standard current files.
3. Treating ADRs as architecture truth and code as current-state truth.
4. Resolving the ADR-071 collision by keeping widget URI ADR as `071` and renumbering the superseded dense-vector ADR to `118`.
5. Leaving the folder decision-complete and low-maintenance.

## Scope

In scope:

1. `.agent/plans/sdk-and-mcp-enhancements/*`
2. Cross-links into this folder from elsewhere in the repository
3. ADR reference hygiene required to remove ambiguity, including ADR-071 collision

Out of scope:

1. Runtime behaviour changes in SDK/apps
2. Implementing feature work described by plans

## Source of Truth Policy

1. ADRs are the architecture source of truth.
2. Code is the current implementation source of truth.
3. Archived plans are concept sources only.

## Definition of "Completely Up to Date"

1. No legacy numbered plans remain in the folder root as execution sources.
2. Root contains only standard governance files plus `archive/`.
3. Every file in the folder tree is represented in the disposition ledger.
4. Active governance files pass link and markdown health checks.
5. ADR references are unambiguous; accepted ADRs are binding, superseded/proposed ADRs are context only.
6. Current-state assertions rely on code evidence rather than stale status labels.

## Target File Model

Keep and modernise in root:

1. `.agent/plans/sdk-and-mcp-enhancements/README.md`
2. `.agent/plans/sdk-and-mcp-enhancements/concept-preservation-and-supersession-map.md`
3. `.../../active/mcp-apps-standard-migration.plan.md`
4. `.agent/plans/sdk-and-mcp-enhancements/folder-disposition-ledger.md`

Completed governance record:

1. `.agent/plans/sdk-and-mcp-enhancements/archive/completed/folder-modernisation-meta-plan.md`

Archive classes:

1. Legacy numbered plans in `.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/`
2. Implemented historical references in `.agent/plans/sdk-and-mcp-enhancements/archive/implemented/`
3. Raw data artefacts in `.agent/plans/sdk-and-mcp-enhancements/archive/data/`

## ADR Collision Resolution (Locked)

1. Retain `docs/architecture/architectural-decisions/071-widget-uri-cache-busting-simplification.md` as ADR-071.
2. Renumber superseded dense-vector ADR:
   - from `docs/architecture/architectural-decisions/071-elastic-native-dense-vector-strategy.md`
   - to `docs/architecture/architectural-decisions/118-elastic-native-dense-vector-strategy.md`
3. Update title/status text in the renumbered file to make superseded historical status explicit.
4. Update references to dense-vector ADR filename/number where they point to this ADR.

## Foundation Lock Evidence Snapshot

Captured at baseline:

1. Root inventory before migration contained legacy numbered files plus governance files.
2. Broken local links in legacy files were present:
   - `archive/legacy-numbered/06-ux-improvements-and-research-plan.md`
   - `archive/legacy-numbered/08b-openai-apps-sdk-part-2-deferred.md`
   - `archive/legacy-numbered/10-quick-wins-from-aila-research.md`
   - `archive/legacy-numbered/11-widget-universal-renderers-plan.md`
3. Known cross-references needing repair when moving legacy plans:
   - `docs/architecture/architectural-decisions/058-context-grounding-for-ai-agents.md`
   - `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts`
   - `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`

## Workstreams and Sequencing

### Workstream 1: Standard Governance Files

1. Maintain root `README.md` as execution index.
2. Maintain this meta plan as orchestration authority.
3. Maintain disposition ledger as file-state authority.
4. Maintain concept map as preserved-concepts authority.

### Workstream 2: Archive Legacy Materials

1. Keep legacy files in archive paths; do not execute directly.
2. Preserve content for provenance; avoid line-by-line normalisation.
3. Use active plans for new execution details.

### Workstream 3: Reference Repair and Provenance

1. Repair broken references created by archive path moves.
2. Replace path-specific remarks with stable governance references where practical.
3. Keep provenance links from current documents back to archived concept sources.

### Workstream 4: ADR Hygiene

1. Enforce unique ADR numeric prefixes.
2. Keep ADR-071 bound to widget URI cache-busting.
3. Keep dense-vector superseded history under ADR-118 and ADR-075 supersession chain.

### Workstream 5: Validation and Closeout

1. Validate folder root shape.
2. Validate ledger coverage.
3. Validate markdown/link quality in active governance files.
4. Validate ADR numbering uniqueness.

## Gates (Stop/Go)

Gate 0: Foundation lock complete.

- Stop: source-of-truth policy not explicit.
- Go: policy written and dated.

Gate 1: Standard governance files complete.

- Stop: no ledger or incomplete ledger columns.
- Go: all files listed in ledger with disposition.

Gate 2: Archive migration complete.

- Stop: numbered legacy plans remain in root.
- Go: root cleaned and archive paths populated.

Gate 3: Reference repair complete.

- Stop: moved-file references unresolved.
- Go: known cross-references repaired.

Gate 4: ADR collision resolved.

- Stop: duplicate ADR numeric prefixes persist.
- Go: one ADR-071, dense-vector ADR renumbered.

Gate 5: Validation complete.

- Stop: any quality command fails.
- Go: all checks pass and exit criteria are met.

## Rollback

1. If archive migration breaks provenance, restore paths from git and replay migration in smaller batches.
2. If ADR renumbering causes broad breakage, revert ADR rename only and complete folder modernisation first.
3. If quality gates fail, block closeout until remediated.

## Validation Commands

```bash
pnpm markdownlint:root
```

```bash
ls -1 .agent/plans/sdk-and-mcp-enhancements | rg '^[0-9].*\.md$'
```

```bash
ls -1 docs/architecture/architectural-decisions \
| sed -E 's/^([0-9]{3})-.*/\1/' \
| sort | uniq -d
```

```bash
rg -n "02-curriculum-ontology-resource-plan.md|16-context-grounding-optimization.md" .
```

```bash
node - <<'NODE'
const fs=require('fs');const path=require('path');
const files=[
'.agent/plans/sdk-and-mcp-enhancements/README.md',
'.agent/plans/sdk-and-mcp-enhancements/archive/completed/folder-modernisation-meta-plan.md',
'.agent/plans/sdk-and-mcp-enhancements/folder-disposition-ledger.md',
'.agent/plans/sdk-and-mcp-enhancements/concept-preservation-and-supersession-map.md',
'.../../active/mcp-apps-standard-migration.plan.md'
];
let bad=[];
for(const f of files){
  const txt=fs.readFileSync(f,'utf8');
  const dir=path.dirname(f);
  const links=[...txt.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map(m=>m[1]);
  for(const l of links){
    if(/^(https?:|mailto:|#)/.test(l)) continue;
    const t=l.split('#')[0].split('?')[0];
    if(!t) continue;
    const p=path.resolve(dir,t);
    if(!fs.existsSync(p)) bad.push({f,l});
  }
}
if(bad.length){console.error(JSON.stringify(bad,null,2));process.exit(1);}
console.log('OK');
NODE
```

## Risks and Mitigations

1. Risk: over-archiving hides useful context.
   Mitigation: mandatory concept map and provenance backlinks.
2. Risk: link breakage from path moves.
   Mitigation: explicit reference repair and `rg` validation.
3. Risk: ADR renumber confusion.
   Mitigation: filename and reference sweep plus supersession notes.
4. Risk: folder appears clean but lacks authority.
   Mitigation: disposition ledger as required closeout gate.

## Exit Criteria

1. `archive/completed/folder-modernisation-meta-plan.md` and `folder-disposition-ledger.md` exist and are complete.
2. Root contains only governance files plus `archive/`.
3. Legacy numbered plans are archived and traceable.
4. ADR-071 collision is resolved with widget ADR as `071` and dense-vector ADR as `118`.
5. README and concept map reflect source-of-truth policy and archive layout.
6. Validation commands pass.

## Assumptions and Defaults

1. Baseline date is 22 February 2026.
2. Archive-first strategy is chosen over per-file normalisation.
3. Useful concepts are preserved centrally rather than via active legacy files.
4. Accepted ADRs are binding; superseded/proposed ADRs are context only.
5. Codebase state is authoritative for current implementation.
6. No runtime API/interface behaviour changes are performed in this modernisation.
