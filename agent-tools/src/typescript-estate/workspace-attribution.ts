import { err, ok, type Result } from '@oaknational/result';

import { EstateReviewError } from './errors.js';
import type { WorkspaceRecord } from './file-model.js';
import type { RepoPath } from './scalar-model.js';

export function attributeWorkspace(
  path: RepoPath,
  workspaces: readonly WorkspaceRecord[],
): Result<WorkspaceRecord | null, EstateReviewError> {
  let selected: WorkspaceRecord | null = null;
  let selectedDepth = -1;
  for (const workspace of workspaces) {
    if (!path.startsWith(`${workspace.root}/`)) {
      continue;
    }
    const depth = workspace.root.split('/').length;
    if (depth === selectedDepth) {
      return err(
        new EstateReviewError(
          'SNAPSHOT_INVALID',
          `workspace attribution for '${path}' is ambiguous at depth ${String(depth)}`,
        ),
      );
    }
    if (depth > selectedDepth) {
      selected = workspace;
      selectedDepth = depth;
    }
  }
  return ok(selected === null ? null : { ...selected });
}
