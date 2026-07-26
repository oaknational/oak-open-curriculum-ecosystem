import { err, isErr, ok, type Result } from '@oaknational/result';

/**
 * Structural parsing for `apply_patch` documents.
 *
 * @packageDocumentation
 */

/** Apply-patch marker for a hunk that reaches end of file. */
export const END_OF_FILE = '*** End of File';
/** Apply-patch move target prefix inside an update section. */
export const MOVE_TO_PREFIX = '*** Move to: ';
/** Apply-patch document opening sentinel. */
const BEGIN_PATCH = '*** Begin Patch';
/** Apply-patch document closing sentinel. */
const END_PATCH = '*** End Patch';
/** Apply-patch add-file section prefix. */
const ADD_FILE_PREFIX = '*** Add File: ';
/** Apply-patch update-file section prefix. */
const UPDATE_FILE_PREFIX = '*** Update File: ';
/** Apply-patch delete-file section prefix. */
const DELETE_FILE_PREFIX = '*** Delete File: ';

/** Parsed patch-file section produced by the structural parser. */
export interface PatchFileSection {
  readonly operation: 'add' | 'update' | 'delete';
  readonly filePath: string;
  readonly lines: readonly string[];
}

/** Header projection derived from the parsed section schema. */
type PatchFileHeader = Pick<PatchFileSection, 'operation' | 'filePath'>;

/** Internal cursor while walking the already-bounded line array. */
type PatchSectionCursor = Readonly<{
  section: PatchFileSection;
  nextIndex: number;
}>;

/** Normalise platform newlines and one optional terminal newline. */
function normalisePatchLines(patch: string): readonly string[] {
  const lines = patch.replaceAll('\r\n', '\n').split('\n');
  if (lines.at(-1) === '') {
    lines.pop();
  }
  return lines;
}

/** Parse one file-section header, or report that the line is not a header. */
function parseFileHeader(line: string): Result<PatchFileHeader | null, Error> {
  const definitions = [
    { prefix: ADD_FILE_PREFIX, operation: 'add' },
    { prefix: UPDATE_FILE_PREFIX, operation: 'update' },
    { prefix: DELETE_FILE_PREFIX, operation: 'delete' },
  ] as const;

  for (const definition of definitions) {
    if (line.startsWith(definition.prefix)) {
      const filePath = line.slice(definition.prefix.length);
      return filePath.length === 0
        ? err(new Error(`apply_patch ${definition.operation} section has an empty file path.`))
        : ok({ operation: definition.operation, filePath });
    }
  }
  return ok(null);
}

/** Whether a line begins any supported file section. */
function isFileHeader(line: string): boolean {
  return (
    line.startsWith(ADD_FILE_PREFIX) ||
    line.startsWith(UPDATE_FILE_PREFIX) ||
    line.startsWith(DELETE_FILE_PREFIX)
  );
}

/** Read one complete file section beginning at `startIndex`. */
function readSection(
  lines: readonly string[],
  startIndex: number,
): Result<PatchSectionCursor, Error> {
  const headerResult = parseFileHeader(lines[startIndex] ?? '');
  if (isErr(headerResult)) {
    return headerResult;
  }
  if (headerResult.value === null) {
    return err(new Error(`apply_patch expected a file section at line ${startIndex + 1}.`));
  }

  const body: string[] = [];
  let nextIndex = startIndex + 1;
  while (nextIndex < lines.length - 1 && !isFileHeader(lines[nextIndex] ?? '')) {
    body.push(lines[nextIndex] ?? '');
    nextIndex += 1;
  }
  return ok({ section: { ...headerResult.value, lines: body }, nextIndex });
}

/** Parse every file section between the document sentinels. */
function parseSections(lines: readonly string[]): Result<readonly PatchFileSection[], Error> {
  const sections: PatchFileSection[] = [];
  let index = 1;

  while (index < lines.length - 1) {
    const sectionResult = readSection(lines, index);
    if (isErr(sectionResult)) {
      return sectionResult;
    }
    sections.push(sectionResult.value.section);
    index = sectionResult.value.nextIndex;
  }

  return sections.length === 0
    ? err(new Error('apply_patch contained no file sections.'))
    : ok(sections);
}

/** Parse and structurally validate one complete `apply_patch` document. */
export function parseApplyPatchSections(patch: string): Result<readonly PatchFileSection[], Error> {
  const lines = normalisePatchLines(patch);
  if (lines[0] !== BEGIN_PATCH || lines.at(-1) !== END_PATCH) {
    return err(
      new Error(`apply_patch must start with "${BEGIN_PATCH}" and end with "${END_PATCH}".`),
    );
  }
  return parseSections(lines);
}
