/**
 * The Codex registry as the sub-agent leg reads it: the file through the port, its text for
 * the byte comparison and its hand-kept head for the render (`render-codex-registry.ts`). A
 * registry with no file refuses, since there is no head to keep; an unreadable or foreign
 * entry refuses through the shared wording; a foreign line in the tail refuses through the
 * split.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import { CODEX_REGISTRY_PATH } from '../../subagent-declarations/adapter-spec.js';
import { splitCodexRegistry } from '../../subagent-declarations/render-codex-registry.js';

import { refusing, SUBAGENT_SUBJECT, textOf } from './projection-issues.js';
import type { RuleProjectionFs } from './rule-projection-fs.js';

/** The registry's text and the head the render keeps. */
export interface CodexRegistryRead {
  readonly text: string;
  readonly head: string;
}

/** The registry's text and its kept head; a registry with no file refuses (there is no head to keep). */
export async function readRegistry(
  projectionFs: RuleProjectionFs,
): Promise<Result<CodexRegistryRead, string>> {
  const read = await projectionFs.readEntry(CODEX_REGISTRY_PATH);
  if (read.kind === 'absent') {
    return err(
      `${CODEX_REGISTRY_PATH}: no Codex registry to keep the head of; ${refusing(SUBAGENT_SUBJECT)}`,
    );
  }
  const text = textOf(CODEX_REGISTRY_PATH, read, SUBAGENT_SUBJECT);
  if (!text.ok) {
    return text;
  }
  const split = splitCodexRegistry(CODEX_REGISTRY_PATH, text.value);
  return split.ok ? ok({ text: text.value, head: split.value }) : split;
}
