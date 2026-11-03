/**
 * The adapters the declarations say exist: every template's declaration reduced to its
 * adapter names with the platforms each names. The health probe's adapter parity reads
 * this, so the declarations are the one platform truth.
 *
 * The reduction is pure (`declaredAdaptersFrom`, over the templates' names and texts) and
 * the read is a thin synchronous wrapper over it, as the probe reads its other surfaces.
 * Both refuse whole rather than return a partial truth: an empty template set (the adapter
 * leg refuses it too, so an inert estate never reads healthy), an entry that is not a
 * template (a name a path cannot carry, a regular file without the `.md` suffix, a leaf
 * that is a link or is not a regular file), a template that cannot be read, a declaration
 * that refuses, a template with none, and an adapter name two templates render (the
 * generator refuses that set as unrenderable).
 *
 * The read goes through `TemplateReads`, the two reads it needs (the directory's listing,
 * one template's text), so its refusal arms are described over injected reads; the live
 * reads are the file-system boundary. There each template is opened once and classified
 * and read through that descriptor, so the file read is the file classified: the open's
 * flags are the estate's no-follow read (`core/no-follow-read.ts`, `O_NOFOLLOW` and
 * `O_NONBLOCK` where the host has them, so a link at the final component fails the open),
 * and on a host without `O_NOFOLLOW` (Windows) the path's own entry is checked after the
 * open to be the very regular file the descriptor holds (`pathEntryIsDescriptorFileSync`),
 * so a linked leaf is refused there too and the probe never admits a template the adapter
 * leg refuses. What this read does not do, stated plainly: the templates directory and its
 * ancestors are never classified, so a link at or above the directory is followed by the
 * listing and the open; the estate's fd-anchored reader with ancestor classification
 * (`validators/portability/rule-surface-fs.ts`) is asynchronous where this probe is
 * synchronous, and moving the probe's read onto it is the named follow-on.
 *
 * @packageDocumentation
 */

import { closeSync, fstatSync, openSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { NO_FOLLOW_READ_FLAGS, pathEntryIsDescriptorFileSync } from '../core/no-follow-read.js';

import { TEMPLATES_DIR, specsOf } from './adapter-spec.js';
import type { SubagentPlatform } from './declaration-scalars.js';
import { readSubagentDeclaration } from './read-subagent-declaration.js';
import { templateNameRefusal } from './template-name.js';

/**
 * The two reads the declared-adapters read needs, so a test describes its arms over
 * in-memory reads and the live reads stay the one file-system boundary.
 */
export interface TemplateReads {
  /** The entries of a directory (absolute path), unsorted; the failure's code on refusal. */
  readonly list: (dir: string) => Result<readonly string[], string>;
  /** One template's text (absolute path): `not a regular file`, or the read failure. */
  readonly read: (file: string) => Result<string, string>;
}

/** One adapter name and the platforms its declaration renders it on. */
export interface DeclaredAdapter {
  readonly name: string;
  readonly platforms: readonly SubagentPlatform[];
}

/** One template as read: its basename without `.md` and its full text. */
export interface TemplateText {
  readonly name: string;
  readonly text: string;
}

/**
 * The declared adapters of the given templates, in the order given.
 *
 * @param templates - Each template's name and text.
 * @returns The declared adapters, or the first refusal: no templates, a declaration that
 *   does not read, a template with none, or an adapter name two templates render.
 */
export function declaredAdaptersFrom(
  templates: readonly TemplateText[],
): Result<readonly DeclaredAdapter[], string> {
  if (templates.length === 0) {
    return err(`${TEMPLATES_DIR}: no templates, so no adapter is declared`);
  }
  const declared: DeclaredAdapter[] = [];
  const renderedBy = new Map<string, string>();
  for (const template of templates) {
    const head = readSubagentDeclaration(template.name, template.text);
    if (!head.ok) {
      return err(`${TEMPLATES_DIR}/${template.name}.md: ${head.error}`);
    }
    if (head.value.kind === 'undeclared') {
      return err(`${TEMPLATES_DIR}/${template.name}.md: no declaration in its frontmatter`);
    }
    for (const spec of specsOf(head.value.declaration)) {
      const other = renderedBy.get(spec.name);
      if (other !== undefined) {
        return err(
          `${TEMPLATES_DIR}/${template.name}.md: renders ${spec.name}, which ${TEMPLATES_DIR}/${other}.md also renders; the generator refuses that set`,
        );
      }
      renderedBy.set(spec.name, template.name);
      declared.push({ name: spec.name, platforms: spec.platforms });
    }
  }
  return ok(declared);
}

/**
 * The template name an entry of the templates directory carries, or the refusal: every
 * entry is validated before any suffix filter, so a stray regular file is refused as the
 * adapter leg refuses it, and a name a path cannot carry never reaches an open.
 */
function templateNameOf(entry: string): Result<string, string> {
  if (!entry.endsWith('.md')) {
    return err(
      `${TEMPLATES_DIR}/${entry}: not a template (the templates directory admits .md templates only)`,
    );
  }
  const name = entry.slice(0, -'.md'.length);
  const refusal = templateNameRefusal(name);
  return refusal === undefined ? ok(name) : err(`${TEMPLATES_DIR}/${entry}: ${refusal}`);
}

/**
 * Every declared adapter under the repository's templates directory, in name order.
 *
 * @param repoRoot - Absolute path to the repository root.
 * @param reads - The directory listing and the template read; the live file system by default.
 * @returns The declared adapters, or the first refusal: the directory unlistable, an entry
 *   that is not a template, a template that is not a regular file or cannot be read, or a
 *   refusal of `declaredAdaptersFrom`.
 */
export function readDeclaredAdapters(
  repoRoot: string,
  reads: TemplateReads = liveTemplateReads,
): Result<readonly DeclaredAdapter[], string> {
  const dir = join(repoRoot, TEMPLATES_DIR);
  const listing = reads.list(dir);
  if (!listing.ok) {
    return err(`${TEMPLATES_DIR}: cannot list the templates (${listing.error})`);
  }
  const entries = [...listing.value].sort((a, b) => a.localeCompare(b));
  const templates: TemplateText[] = [];
  for (const entry of entries) {
    const name = templateNameOf(entry);
    if (!name.ok) {
      return name;
    }
    const text = reads.read(join(dir, entry));
    if (!text.ok) {
      return err(`${TEMPLATES_DIR}/${entry}: ${text.error}`);
    }
    templates.push({ name: name.value, text: text.value });
  }
  return declaredAdaptersFrom(templates);
}

/** The live reads: the directory listed, each template opened once with the no-follow flags. */
const liveTemplateReads: TemplateReads = {
  list: (dir) => {
    try {
      return ok(readdirSync(dir));
    } catch (cause) {
      return err(describe(cause));
    }
  },
  read: readTemplateText,
};

/**
 * A template's text, opened once and classified and read through the one descriptor.
 *
 * @param file - Absolute path to one entry of the templates directory.
 * @returns The text, or the refusal: `not a regular file` when the open fails with `ELOOP`
 *   (under `O_NOFOLLOW`, a link at the leaf), `fstat` does not find a regular file, or, on a
 *   host without `O_NOFOLLOW`, the path's own entry is not the very file the descriptor
 *   holds (a linked leaf followed by the open); otherwise the failure's code, never its
 *   message.
 */
function readTemplateText(file: string): Result<string, string> {
  let fd: number;
  try {
    fd = openSync(file, NO_FOLLOW_READ_FLAGS);
  } catch (cause) {
    return err(isLinkRefusal(cause) ? 'not a regular file' : unreadable(cause));
  }
  try {
    const viaDescriptor = fstatSync(fd, { bigint: true });
    if (!viaDescriptor.isFile() || !pathEntryIsDescriptorFileSync(file, viaDescriptor)) {
      return err('not a regular file');
    }
    return ok(readFileSync(fd, 'utf8'));
  } catch (cause) {
    return err(unreadable(cause));
  } finally {
    closeSync(fd);
  }
}

function isLinkRefusal(cause: unknown): boolean {
  return cause instanceof Error && 'code' in cause && cause.code === 'ELOOP';
}

function unreadable(cause: unknown): string {
  return `cannot read the template (${describe(cause)})`;
}

/** The error's code or kind, never its message (which carries the working copy's absolute path). */
function describe(cause: unknown): string {
  if (cause instanceof Error) {
    const code = 'code' in cause ? cause.code : undefined;
    return typeof code === 'string' && code.length > 0 ? code : cause.name;
  }
  return 'unknown';
}
