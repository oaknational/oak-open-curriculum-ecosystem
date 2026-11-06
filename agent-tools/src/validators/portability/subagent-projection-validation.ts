/**
 * The sub-agent adapter leg of the portability validator (closure item 6, 2b-ii): every
 * template's declaration is read from its frontmatter, the Cursor, Claude, Codex and Gemini
 * adapters are rendered from those declarations (`render-subagent-adapters.ts`) and the Codex
 * registry's agent blocks after its hand-kept head (`render-codex-registry.ts`), and the
 * four adapter surfaces and the registry are compared byte for byte. `--fix` writes what is missing or drifted and
 * removes what no declaration renders; without it, every difference is an issue naming the
 * cure.
 *
 * The leg refuses, with one issue and no write, whenever it cannot vouch for its input, on
 * the rule leg's terms (`rule-projection-validation.ts`): a template with no declaration
 * (a set rendered without it would remove that template's adapters as stale), a
 * declaration that does not parse, a template whose name a path cannot carry, an
 * unreadable template or surface entry, a templates directory that is absent, unreadable or
 * empty, a regular file there that is not a template, a symlink or special entry on any
 * surface, a name two declarations render, a pointer tail with a backtick, a declared value
 * the Codex form cannot carry verbatim, a registry with no file (there is no head to keep) and
 * a foreign line in the registry's tail. The four adapter directories and the registry's
 * tail are wholly generated outputs, so a regular file on the directories that no
 * declaration renders is stale and `--fix` removes it, and the tail is rewritten whole.
 * Every read is LF-normalised by the port and the rendered adapters are LF.
 *
 * @packageDocumentation
 */

import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { readSubagentDeclaration } from '../../subagent-declarations/read-subagent-declaration.js';
import {
  CODEX_REGISTRY_PATH,
  SUBAGENT_SURFACES,
  TEMPLATES_DIR,
} from '../../subagent-declarations/adapter-spec.js';
import { renderCodexRegistry } from '../../subagent-declarations/render-codex-registry.js';
import { renderSubagentAdapters } from '../../subagent-declarations/render-subagent-adapters.js';
import type { SubagentDeclaration } from '../../subagent-declarations/subagent-declaration.js';
import { templateNameRefusal } from '../../subagent-declarations/template-name.js';

import { applyProjectionDrift, diffProjections, type Projection } from './projection-drift.js';
import { driftIssues, filesOf, refusing, SUBAGENT_SUBJECT, textOf } from './projection-issues.js';
import type { RuleProjectionFs } from './rule-projection-fs.js';
import { readRegistry } from './subagent-registry-surface.js';

/** What the leg found and, in fix mode, did. */
export interface SubagentProjectionValidation {
  readonly issues: readonly string[];
  readonly templateCount: number;
  /** Repo-relative paths written in fix mode. */
  readonly written: readonly string[];
  /** Repo-relative stale paths removed in fix mode. */
  readonly removed: readonly string[];
}

const REFUSING = refusing(SUBAGENT_SUBJECT);

/**
 * Validate (and in fix mode regenerate) the sub-agent adapters.
 *
 * @param fixMode - Whether to write missing and drifted adapters and remove stale ones.
 * @param projectionFs - The file-system port over the repository.
 * @returns The issues found and the paths written or removed.
 */
export async function validateSubagentProjections(
  fixMode: boolean,
  projectionFs: RuleProjectionFs,
): Promise<SubagentProjectionValidation> {
  const canonical = await readDeclarations(projectionFs);
  const templateCount = canonical.templateCount;
  if (canonical.issues.length > 0) {
    return { issues: canonical.issues, templateCount, written: [], removed: [] };
  }
  const surfaces = await readSurfaces(projectionFs);
  if (!surfaces.ok) {
    return { issues: [surfaces.error], templateCount, written: [], removed: [] };
  }
  const expected = renderExpected(canonical.declarations, surfaces.value.registryHead);
  if (!expected.ok) {
    return { issues: [expected.error], templateCount, written: [], removed: [] };
  }
  const drift = diffProjections(expected.value, surfaces.value.actual);
  if (!fixMode) {
    return {
      issues: driftIssues(drift, SUBAGENT_SUBJECT),
      templateCount,
      written: [],
      removed: [],
    };
  }
  return { templateCount, ...(await applyProjectionDrift(expected.value, drift, projectionFs)) };
}

/** The adapters and the registry the declarations render, the registry after its kept head. */
function renderExpected(
  declarations: readonly SubagentDeclaration[],
  registryHead: string,
): Result<readonly Projection[], string> {
  const adapters = renderSubagentAdapters(declarations);
  if (!adapters.ok) {
    return adapters;
  }
  const registry = renderCodexRegistry(registryHead, declarations);
  return registry.ok
    ? ok([...adapters.value, { path: CODEX_REGISTRY_PATH, text: registry.value }])
    : registry;
}

interface CanonicalTemplates {
  readonly declarations: readonly SubagentDeclaration[];
  readonly issues: readonly string[];
  readonly templateCount: number;
}

async function readDeclarations(projectionFs: RuleProjectionFs): Promise<CanonicalTemplates> {
  const listing = await projectionFs.listDirectory(TEMPLATES_DIR, '.md');
  const files = filesOf(TEMPLATES_DIR, listing, 'canonical', SUBAGENT_SUBJECT);
  if (!files.ok) {
    return { declarations: [], issues: [files.error], templateCount: 0 };
  }
  if (files.value.length === 0) {
    const issue = `${TEMPLATES_DIR}: no templates; ${REFUSING} from an empty set`;
    return { declarations: [], issues: [issue], templateCount: 0 };
  }
  const declarations: SubagentDeclaration[] = [];
  const issues: string[] = [];
  for (const templateFile of files.value) {
    const declaration = await readOneDeclaration(templateFile, projectionFs);
    if (declaration.ok) {
      declarations.push(declaration.value);
    } else {
      issues.push(declaration.error);
    }
  }
  return { declarations, issues, templateCount: files.value.length };
}

/** One template's declaration: its name admitted, its text read, its block parsed and present. */
async function readOneDeclaration(
  templateFile: string,
  projectionFs: RuleProjectionFs,
): Promise<Result<SubagentDeclaration, string>> {
  const name = path.basename(templateFile, '.md');
  const nameRefusal = templateNameRefusal(name);
  if (nameRefusal !== undefined) {
    return err(`${templateFile}: ${nameRefusal}; ${REFUSING}`);
  }
  const text = textOf(templateFile, await projectionFs.readEntry(templateFile), SUBAGENT_SUBJECT);
  if (!text.ok) {
    return text;
  }
  const head = readSubagentDeclaration(name, text.value);
  if (!head.ok) {
    return err(`${templateFile}: ${head.error}; ${REFUSING}`);
  }
  if (head.value.kind === 'undeclared') {
    return err(
      `${templateFile}: no declaration in its frontmatter (write the block in the shape .agent/sub-agents/README.md §Declarations gives); ${REFUSING}`,
    );
  }
  return ok(head.value.declaration);
}

/** What the surfaces hold: every adapter file and the registry, and the registry's kept head. */
interface Surfaces {
  readonly actual: ReadonlyMap<string, string>;
  readonly registryHead: string;
}

/** Every file currently on the four adapter surfaces and the registry, keyed by repo-relative path. */
async function readSurfaces(projectionFs: RuleProjectionFs): Promise<Result<Surfaces, string>> {
  const actual = new Map<string, string>();
  const registry = await readRegistry(projectionFs);
  if (!registry.ok) {
    return registry;
  }
  actual.set(CODEX_REGISTRY_PATH, registry.value.text);
  for (const surface of SUBAGENT_SURFACES) {
    const listing = await projectionFs.listDirectory(surface.dir, surface.extension);
    const files = filesOf(surface.dir, listing, 'projection', SUBAGENT_SUBJECT);
    if (!files.ok) {
      return files;
    }
    for (const file of files.value) {
      const text = textOf(file, await projectionFs.readEntry(file), SUBAGENT_SUBJECT);
      if (!text.ok) {
        return text;
      }
      actual.set(file, text.value);
    }
  }
  return ok({ actual, registryHead: registry.value.head });
}
