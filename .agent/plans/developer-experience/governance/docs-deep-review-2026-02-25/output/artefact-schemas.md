# Artefact Schemas

## DocInventoryRow

Fields:

- `path`
- `boundary`
- `role`
- `lines`
- `status_marker`
- `last_updated`
- `refs_in`
- `refs_out`

File: `doc-inventory.tsv`

## DocFinding

Fields:

- `id`
- `path`
- `boundary`
- `category`
- `severity`
- `evidence`
- `impact`
- `remediation`
- `related_paths`

Files:

- `doc-findings.tsv`
- `doc-findings.md`

## MoveProposal

Fields:

- `path_current`
- `path_target`
- `boundary_from`
- `boundary_to`
- `rationale`
- `ref_updates_required`

File: `move-proposals.tsv`

## BoundaryMetadata (proposed markdown frontmatter standard)

Fields:

- `boundary`
- `doc_role`
- `authority`
- `status`
- `last_reviewed`

Not yet applied to existing docs in this pass.
