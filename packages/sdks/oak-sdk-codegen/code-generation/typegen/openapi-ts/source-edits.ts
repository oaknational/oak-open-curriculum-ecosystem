/**
 * Text edits over a TypeScript source string, addressed by character offsets
 * taken from its AST.
 *
 * @remarks
 * Shared by the openapi-typescript post-processors, which read positions from
 * `ts.createSourceFile` and splice replacements without re-printing the file,
 * so every byte they do not name (comments, strings, layout) survives as
 * openapi-typescript emitted it.
 */

/** One replacement of the half-open range `[start, end)`. */
export interface SourceEdit {
  readonly start: number;
  readonly end: number;
  readonly replacement: string;
}

/** Whether `inner` lies strictly inside `outer`. */
export function isNestedEdit(inner: SourceEdit, outer: SourceEdit): boolean {
  return inner !== outer && inner.start >= outer.start && inner.end <= outer.end;
}

/**
 * Applies edits to a source string, last range first so earlier offsets stay
 * valid. An edit nested inside another is dropped: the outer replacement
 * already covers its range.
 *
 * @param source - The text the edit offsets were taken from
 * @param edits - Replacements over non-overlapping or nested ranges
 */
export function applySourceEdits(source: string, edits: readonly SourceEdit[]): string {
  const outermost = edits.filter((edit) => !edits.some((other) => isNestedEdit(edit, other)));
  const ordered = [...outermost].sort((a, b) => b.start - a.start);
  let result = source;
  for (const edit of ordered) {
    result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end);
  }
  return result;
}

/**
 * The text of `[start, end)` with the edits that fall inside it applied,
 * re-based to the range's own offsets.
 */
export function editedSlice(
  source: string,
  start: number,
  end: number,
  edits: readonly SourceEdit[],
): string {
  const inner = edits
    .filter(
      (edit) =>
        edit.start >= start && edit.end <= end && !(edit.start === start && edit.end === end),
    )
    .map((edit) => ({ ...edit, start: edit.start - start, end: edit.end - start }));
  return applySourceEdits(source.slice(start, end), inner);
}
