/**
 * The Codex adapter of a declaration: the flat `key = "value"` head and the triple-quoted
 * `developer_instructions` block, in the estate's one shape (`render-subagent-adapters.ts`
 * renders the Markdown platforms and composes this one). A Codex value is a TOML basic
 * string written verbatim, so a value that would need an escape (a double quote, a
 * backslash, a control character) is a refusal naming the adapter, never an escape the
 * estate's readers would not read back; the instructions block is a multi-line basic
 * string, so a backslash or a triple quote in its prose refuses too.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import { CODEX_DEFAULTS } from './adapter-defaults.js';
import { platformDescription, pointerLine, type AdapterSpec } from './adapter-spec.js';
import { STANDARD_CLOSINGS } from './standard-adapter-body.js';
import type { CodexFields } from './subagent-declaration.js';

// A TOML basic string carries no double quote, backslash or control character verbatim;
// the multi-line form of the instructions block carries newlines but no backslash or `"""`.
const TOML_LINE_UNSAFE = /["\\\p{Cc}]/u;
const TOML_BLOCK_UNSAFE = /"""|\\|[^\P{Cc}\n]/u;

/** Whether a value needs an escape in a TOML basic string (a double quote, a backslash, a control character). */
export function carriesTomlLineUnsafe(value: string): boolean {
  return TOML_LINE_UNSAFE.test(value);
}

/** The first Codex value the TOML form cannot carry verbatim, as the refusal; none when clean. */
function tomlRefusal(path: string, spec: AdapterSpec, codex: CodexFields): string | undefined {
  const lines: readonly (readonly [string, string | undefined])[] = [
    ['description', platformDescription('codex', spec)],
    ['model', codex.model],
    ['effort', codex.effort],
  ];
  const line = lines.find(([, value]) => value !== undefined && carriesTomlLineUnsafe(value));
  if (line !== undefined) {
    return `${path}: the ${line[0]} carries a character a TOML basic string cannot carry verbatim (a double quote, a backslash or a control character); refusing to render it`;
  }
  const block = [codex.pointerTail, codex.note].find(
    (value) => value !== undefined && TOML_BLOCK_UNSAFE.test(value),
  );
  return block === undefined
    ? undefined
    : `${path}: the instructions prose carries a backslash, a triple quote or a control character the TOML block cannot carry verbatim; refusing to render it`;
}

/** The Codex adapter text for a spec, or the refusal for a value its form cannot carry. */
export function renderCodexAdapter(path: string, spec: AdapterSpec): Result<string, string> {
  const codex = spec.codex ?? {};
  const refusal = tomlRefusal(path, spec, codex);
  if (refusal !== undefined) {
    return err(refusal);
  }
  const effort = spec.fillDefaults ? (codex.effort ?? CODEX_DEFAULTS.effort) : codex.effort;
  const lines = [
    `name = "${spec.name}"`,
    `description = "${platformDescription('codex', spec)}"`,
    ...(codex.model === undefined ? [] : [`model = "${codex.model}"`]),
    ...(effort === undefined ? [] : [`model_reasoning_effort = "${effort}"`]),
    'sandbox_mode = "read-only"',
    'approval_policy = "never"',
    '',
    'developer_instructions = """',
    pointerLine('codex', spec, codex.pointerTail),
    '',
    codex.note ?? STANDARD_CLOSINGS.codex,
    '"""',
    '',
  ];
  return ok(lines.join('\n'));
}
