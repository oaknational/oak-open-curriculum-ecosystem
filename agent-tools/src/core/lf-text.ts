/**
 * Normalise checkout line-ending presentation to LF.
 *
 * @remarks
 * Committed blobs are LF; a Windows checkout under Git's default
 * `autocrlf=true` presents them CRLF on disk. Applying this transform at a
 * read edge lets downstream comparisons, marker parsing, and projection
 * equality judge CONTENT rather than checkout presentation — anything the
 * tool composes and writes stays LF regardless. Only the CRLF pair is
 * checkout presentation: a lone `\r` is real content and is preserved.
 *
 * @param text - Text as read from a checkout file.
 * @returns The text with every CRLF sequence replaced by LF.
 */
export function toLfText(text: string): string {
  return text.replaceAll('\r\n', '\n');
}
