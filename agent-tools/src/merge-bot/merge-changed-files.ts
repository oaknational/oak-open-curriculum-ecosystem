import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';
import { GITHUB_API } from './merge-github-api.js';
import {
  githubHeaders,
  readJsonBody,
  sendGithubRequest,
  type GithubApiFetch,
} from './mint-installation-token.js';
import type { BotIdentity } from './resolve-identity.js';

/**
 * The changed-files read behind the door's records class: the pull request's
 * files, every page, each file's name and (for a rename) its previous name,
 * for `change-class.ts` to classify. `merge-records-checks.ts` asks for it
 * only when the class can change the outcome — at the door, once the
 * required contexts are green by name — so a typed refusal elsewhere never
 * turns into a network failure here.
 */

const PER_PAGE = 100;
/** GitHub lists at most 3,000 files on a pull request. */
const MAX_PAGES = 30;

const filesPageSchema = z.array(
  z.object({ filename: z.string().min(1), previous_filename: z.string().min(1).optional() }),
);

interface FilesPage {
  readonly paths: readonly string[];
  readonly items: number;
}

interface ChangedFilesTarget {
  readonly identity: BotIdentity;
  readonly prNumber: number;
}

async function readFilesPage(
  fetchImpl: GithubApiFetch,
  token: string,
  target: ChangedFilesTarget,
  page: number,
): Promise<Result<FilesPage, Error>> {
  const url =
    `${GITHUB_API}/repos/${target.identity.owner}/${target.identity.repoName}` +
    `/pulls/${target.prNumber}/files?per_page=${PER_PAGE}&page=${page}`;
  const sent = await sendGithubRequest(
    fetchImpl,
    url,
    { method: 'GET', headers: githubHeaders(token) },
    'changed files read',
  );
  if (!sent.ok) {
    return sent;
  }
  if (sent.value.status !== 200) {
    return err(new Error(`changed files read answered ${sent.value.status} on page ${page}`));
  }
  const body = await readJsonBody(sent.value, 'changed files read');
  if (!body.ok) {
    return body;
  }
  const parsed = parseWithSchema({
    label: `changed files page ${page}`,
    schema: filesPageSchema,
    value: body.value,
  });
  if (!parsed.ok) {
    return parsed;
  }
  const paths = parsed.value.flatMap((file) =>
    file.previous_filename === undefined
      ? [file.filename]
      : [file.filename, file.previous_filename],
  );
  return ok({ paths, items: parsed.value.length });
}

/** Every path the pull request changes, across every page; a rename contributes both names. */
export async function listChangedPaths(
  fetchImpl: GithubApiFetch,
  token: string,
  target: ChangedFilesTarget,
): Promise<Result<readonly string[], Error>> {
  const paths: string[] = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    // Pages are sequential by nature: the next request exists only when this one was full.
    const read = await readFilesPage(fetchImpl, token, target, page);
    if (!read.ok) {
      return read;
    }
    paths.push(...read.value.paths);
    if (read.value.items < PER_PAGE) {
      return ok(paths);
    }
  }
  return err(
    new Error(
      `changed files read exceeded ${MAX_PAGES} pages (${MAX_PAGES * PER_PAGE} files, GitHub's ` +
        'ceiling) — a pull request this size is never records-class; the SETTLE-READY door stands',
    ),
  );
}
