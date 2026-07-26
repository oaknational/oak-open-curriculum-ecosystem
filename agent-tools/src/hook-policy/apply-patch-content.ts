import { assertNeverResult, err, isErr, ok, type Result } from '@oaknational/result';

import {
  END_OF_FILE,
  MOVE_TO_PREFIX,
  parseApplyPatchSections,
  type PatchFileSection,
} from './apply-patch-sections.js';
import type { ContentChange } from './content-types.js';

/**
 * Canonical content projection for structurally valid `apply_patch` documents.
 *
 * The policy needs added and removed text per target file; evaluating the raw
 * patch as wholly-new content would falsely classify deleted text as an
 * addition.
 *
 * @packageDocumentation
 */

/** Internal accumulator while parsing one already-validated update section. */
interface UpdateAccumulator {
  additions: string[];
  deletions: string[];
  filePath: string;
}

/** Strip and validate the required prefix on every add/delete body line. */
function stripRequiredPrefix(
  lines: readonly string[],
  prefix: '+' | '-',
  operation: 'add' | 'delete',
): Result<readonly string[], Error> {
  const content: string[] = [];
  for (const [index, line] of lines.entries()) {
    if (!line.startsWith(prefix)) {
      return err(
        new Error(
          `apply_patch ${operation} section has invalid content at body line ${index + 1}.`,
        ),
      );
    }
    content.push(line.slice(1));
  }
  return ok(content);
}

/** Apply one update-body line to the canonical additions/deletions accumulator. */
function consumeUpdateLine(
  state: UpdateAccumulator,
  line: string,
  lineNumber: number,
): Result<UpdateAccumulator, Error> {
  if (line.startsWith(MOVE_TO_PREFIX)) {
    const filePath = line.slice(MOVE_TO_PREFIX.length);
    return filePath.length === 0
      ? err(new Error('apply_patch update section has an empty move path.'))
      : ok({ ...state, filePath });
  }
  if (line.startsWith('@@') || line === END_OF_FILE || line.startsWith(' ')) {
    return ok(state);
  }
  if (line.startsWith('+')) {
    state.additions.push(line.slice(1));
    return ok(state);
  }
  if (line.startsWith('-')) {
    state.deletions.push(line.slice(1));
    return ok(state);
  }
  return err(
    new Error(`apply_patch update section has invalid content at body line ${lineNumber}.`),
  );
}

/** Convert one update section to a canonical content change. */
function parseUpdateSection(section: PatchFileSection): Result<ContentChange, Error> {
  let state: UpdateAccumulator = {
    additions: [],
    deletions: [],
    filePath: section.filePath,
  };

  for (const [index, line] of section.lines.entries()) {
    if (line.startsWith(MOVE_TO_PREFIX) && index !== 0) {
      return err(new Error('apply_patch move target must be the first update body line.'));
    }
    if (line === END_OF_FILE && index !== section.lines.length - 1) {
      return err(new Error('apply_patch end-of-file marker must end its update section.'));
    }
    const lineResult = consumeUpdateLine(state, line, index + 1);
    if (isErr(lineResult)) {
      return lineResult;
    }
    state = lineResult.value;
  }

  return ok({
    newContent: state.additions.join('\n'),
    priorContent: state.deletions.join('\n'),
    filePath: state.filePath,
  });
}

/** Convert one parsed file section to a canonical content change. */
function sectionToContentChange(section: PatchFileSection): Result<ContentChange, Error> {
  switch (section.operation) {
    case 'add': {
      if (section.lines.length === 0) {
        return err(new Error('apply_patch add section must contain at least one added line.'));
      }
      const content = stripRequiredPrefix(section.lines, '+', section.operation);
      return isErr(content)
        ? content
        : ok({
            newContent: content.value.join('\n'),
            priorContent: '',
            filePath: section.filePath,
          });
    }
    case 'update':
      return parseUpdateSection(section);
    case 'delete': {
      return section.lines.length === 0
        ? ok({
            newContent: '',
            priorContent: '',
            filePath: section.filePath,
          })
        : err(new Error('apply_patch delete section must not contain body lines.'));
    }
    default:
      return assertNeverResult(
        section.operation,
        (unexpected) => new Error(`Unhandled apply_patch operation: ${unexpected}`),
      );
  }
}

/**
 * Parse one complete `apply_patch` document into per-file canonical changes.
 */
export function parseApplyPatchContent(patch: string): Result<readonly ContentChange[], Error> {
  const sectionsResult = parseApplyPatchSections(patch);
  if (isErr(sectionsResult)) {
    return sectionsResult;
  }

  const changes: ContentChange[] = [];
  for (const section of sectionsResult.value) {
    const changeResult = sectionToContentChange(section);
    if (isErr(changeResult)) {
      return changeResult;
    }
    changes.push(changeResult.value);
  }
  return ok(changes);
}
