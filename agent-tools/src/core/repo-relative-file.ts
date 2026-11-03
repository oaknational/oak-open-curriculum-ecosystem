import { z } from 'zod';

/** One plain path segment: a letter, a digit, `_`, `.`, `@`, `+` or `-`, at least one. */
const PLAIN_SEGMENT = /^[\w.@+-]+$/u;

/**
 * A file named for an agent to read, as a repository-relative path.
 *
 * @remarks
 * An allow-list, not a deny-list: the path is plain segments joined by `/`, none of them `.`
 * or `..`. A leading slash, a drive letter, a backslash, whitespace, a newline, `~`, `$` and a
 * URL scheme are all refused, so the path cannot name a place outside the repository, nor
 * carry a second line into the file list a prompt renders from it; and each file has one
 * spelling, so an exact-string membership check cannot miss it. The check is lexical and runs
 * per segment, so a path of any length is an error result, never a regular expression's stack
 * overflow. Two map stages read their partition files through it: the corpus analysis and the
 * restatement audit.
 */
export const repoRelativeFileSchema = z
  .string()
  .refine(
    (file) =>
      file
        .split('/')
        .every((segment) => PLAIN_SEGMENT.test(segment) && segment !== '.' && segment !== '..'),
    {
      error:
        'a partition file must be a repository-relative path: plain segments (letters, digits, `_`, `.`, `@`, `+`, `-`) joined by `/`, none of them `.` or `..`',
    },
  );
