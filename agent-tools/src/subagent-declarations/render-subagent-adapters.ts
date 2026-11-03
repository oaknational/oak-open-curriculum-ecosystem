/**
 * The sub-agent adapter generator (closure item 6, 2b-ii): every template's declaration
 * renders its Cursor, Claude, Codex and Gemini adapters, byte for byte, in the estate's one adapter
 * shape (`standard-adapter-body.ts`): the frontmatter or the TOML head, the title, the
 * platform's pre-pointer line, the pointer sentence, and the closing prose. A ROLE renders
 * from the defaults it does not deviate from (`adapter-defaults.ts`); a VARIANT
 * renders exactly what it declares, no default filled. The adapters are outputs: the
 * portability validator compares the surfaces with what this renders and `--fix` writes it
 * (`validators/portability/subagent-projection-validation.ts`), so nothing on them is
 * hand-kept.
 *
 * Serialisation is one form per platform, measured on the estate's 86 adapters on
 * 2026-09-14: a Markdown description is a quoted YAML scalar on one line in the quote style
 * the estate's formatter keeps (`yaml-scalar.ts` states it; four hand-kept Cursor files
 * carried a folded form and three the other quote style, and normalise on the first
 * regeneration); every other field value is plain where YAML reads it plain and quoted by
 * the same rule otherwise; the Claude field order is the one that reproduces
 * every file, `tools`, `disallowedTools`, `color`, `permissionMode`, `model`, `effort`, then
 * `maxTurns` written as its number; the Codex form and what it refuses are
 * `render-codex-adapter.ts`.
 *
 * One Claude shape departs from the pointer skeleton (`claude-fields.ts`): a role whose
 * Claude body is its template's System prompt block renders exactly the fields it declares,
 * `tools: none` as the null-value `tools:` field, and the block verbatim as its body, then
 * the provenance comment (`standard-adapter-body.ts`); its other platforms keep the pointer.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import {
  platformDescription,
  pointerLine,
  specsOf,
  SUBAGENT_SURFACES,
  TEMPLATES_DIR,
  type AdapterSpec,
  type SubagentSurface,
} from './adapter-spec.js';
import { CLAUDE_DEFAULTS } from './adapter-defaults.js';
import { ZERO_TOOLS, type ClaudeFields } from './claude-fields.js';
import type { SubagentPlatform } from './declaration-scalars.js';
import { renderCodexAdapter } from './render-codex-adapter.js';
import { renderGeminiAdapter } from './render-gemini-adapter.js';
import {
  STANDARD_CLOSINGS,
  STANDARD_PRE_POINTER,
  systemPromptClosing,
} from './standard-adapter-body.js';
import type { MarkdownPlatform, SubagentDeclaration } from './subagent-declaration.js';
import { yamlQuoted, yamlScalar } from './yaml-scalar.js';

/** One rendered adapter: its repo-relative path and its full text. */
export interface SubagentProjection {
  readonly path: string;
  readonly text: string;
}

/** The Claude frontmatter fields in the order the estate's adapters carry them (measured). */
const CLAUDE_KEY_ORDER = [
  'tools',
  'disallowedTools',
  'color',
  'permissionMode',
  'model',
  'effort',
  'maxTurns',
] as const;

function markdownBody(
  platform: MarkdownPlatform,
  spec: AdapterSpec,
  prose: { readonly pointerTail?: string; readonly note?: string } | undefined,
): string {
  const closing = prose?.note ?? STANDARD_CLOSINGS[platform];
  return `\n# ${spec.title}\n\n${STANDARD_PRE_POINTER[platform]}\n\n${pointerLine(platform, spec, prose?.pointerTail)}\n\n${closing}\n`;
}

function renderCursor(spec: AdapterSpec): string {
  const description = platformDescription('cursor', spec);
  const head = `---\nname: ${spec.name}\ndescription: ${yamlQuoted(description)}\nreadonly: true\n---\n`;
  return `${head}${markdownBody('cursor', spec, spec.cursor)}`;
}

/**
 * The Claude fields a spec renders: a role's defaults filled, save a role whose body is its
 * System prompt block, which renders exactly what it declares, as a variant does.
 */
function claudeFieldsOf(spec: AdapterSpec): ClaudeFields {
  const declared = spec.claude ?? {};
  return spec.fillDefaults && declared.body === undefined
    ? {
        ...declared,
        tools: declared.tools ?? CLAUDE_DEFAULTS.tools,
        disallowedTools: declared.disallowedTools ?? CLAUDE_DEFAULTS.disallowedTools,
        permissionMode: declared.permissionMode ?? CLAUDE_DEFAULTS.permissionMode,
      }
    : declared;
}

/** One Claude field as its lines: `inherit` tools as no line, `none` as the null value, a number bare. */
function claudeFieldLine(key: (typeof CLAUDE_KEY_ORDER)[number], fields: ClaudeFields): string[] {
  const value = fields[key];
  if (value === undefined || (key === 'tools' && value === 'inherit')) {
    return [];
  }
  if (key === 'tools' && value === ZERO_TOOLS) {
    return ['tools:'];
  }
  return [`${key}: ${typeof value === 'number' ? String(value) : yamlScalar(value)}`];
}

/**
 * The Claude body: the pointer skeleton, or, where the declared body names it, the template's
 * System prompt block and its provenance; the refusal when the spec carries no block to name.
 */
function claudeBody(path: string, spec: AdapterSpec): Result<string, string> {
  if (spec.claude?.body === undefined) {
    return ok(markdownBody('claude', spec, spec.claude));
  }
  return spec.systemPrompt === undefined
    ? err(
        `${path}: claude.body names the System prompt block, and the declaration carries none (the reader takes it from the template); refusing to render it`,
      )
    : ok(
        `\n${spec.systemPrompt}\n\n${systemPromptClosing(`${TEMPLATES_DIR}/${spec.template}.md`)}\n`,
      );
}

function renderClaude(path: string, spec: AdapterSpec): Result<string, string> {
  const body = claudeBody(path, spec);
  if (!body.ok) {
    return body;
  }
  const fields = claudeFieldsOf(spec);
  const lines = [
    '---',
    `name: ${spec.name}`,
    `description: ${yamlQuoted(spec.description)}`,
    ...CLAUDE_KEY_ORDER.flatMap((key) => claudeFieldLine(key, fields)),
    '---',
  ];
  return ok(`${lines.join('\n')}\n${body.value}`);
}

/** Each platform's adapter text for a spec at its path, or the refusal its form raises. */
const RENDERERS: Readonly<
  Record<SubagentPlatform, (path: string, spec: AdapterSpec) => Result<string, string>>
> = {
  cursor: (_path, spec) => ok(renderCursor(spec)),
  claude: renderClaude,
  codex: renderCodexAdapter,
  gemini: renderGeminiAdapter,
};

function renderOn(surface: SubagentSurface, spec: AdapterSpec): Result<SubagentProjection, string> {
  const { platform } = surface;
  const path = `${surface.dir}/${spec.name}${surface.extension}`;
  // A Gemini adapter carries no prose of its own (the schema's Gemini fields are the CLI's).
  const tail = platform === 'gemini' ? undefined : pointerTailIssue(path, spec[platform]);
  if (tail !== undefined) {
    return err(tail);
  }
  const text = RENDERERS[platform](path, spec);
  return text.ok ? ok({ path, text: text.value }) : text;
}

/**
 * The refusal for a pointer tail carrying a backtick: the pointer sentence's path delimiter
 * is the backtick, so a tail with one would leave the path ambiguous to any reader of the
 * rendered adapter.
 */
function pointerTailIssue(
  path: string,
  prose: { readonly pointerTail?: string } | undefined,
): string | undefined {
  return prose?.pointerTail?.includes('`') === true
    ? `${path}: the pointer tail carries a backtick, which the reader takes for the path's delimiter; refusing to render it`
    : undefined;
}

/** The first adapter name two specs share, in name order; `--fix` would write its path twice. */
function duplicateName(specs: readonly AdapterSpec[]): string | undefined {
  const seen = new Set<string>();
  const names = specs.map((spec) => spec.name).sort((left, right) => left.localeCompare(right));
  for (const name of names) {
    if (seen.has(name)) {
      return name;
    }
    seen.add(name);
  }
  return undefined;
}

/**
 * Render every adapter the declarations project onto the four generated surfaces: templates
 * in name order, a fan-out's variants in their declared order, then surface order.
 *
 * @param declarations - The templates' declarations, in any order.
 * @returns The adapters, or the first refusal (a name two declarations render, a pointer
 * tail with a backtick, a Claude body naming a System prompt block the spec does not carry,
 * or a value the Codex form cannot carry).
 */
export function renderSubagentAdapters(
  declarations: readonly SubagentDeclaration[],
): Result<readonly SubagentProjection[], string> {
  const specs = [...declarations]
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap(specsOf);
  const duplicate = duplicateName(specs);
  if (duplicate !== undefined) {
    return err(
      `${duplicate}: rendered by more than one declaration (a role and a fan-out variant, or two fan-outs); refusing to render the sub-agent adapters`,
    );
  }
  const projections: SubagentProjection[] = [];
  for (const spec of specs) {
    for (const surface of SUBAGENT_SURFACES.filter((entry) =>
      spec.platforms.includes(entry.platform),
    )) {
      const rendered = renderOn(surface, spec);
      if (!rendered.ok) {
        return rendered;
      }
      projections.push(rendered.value);
    }
  }
  return ok(projections);
}
