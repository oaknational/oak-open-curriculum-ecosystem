import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const CLAUDE_HOOK_COMMAND = 'pnpm exec tsx scripts/check-blocked-patterns.ts';
const COMMANDS_DIR = '.agent/commands';
export const CURSOR_COMMANDS_DIR = '.cursor/commands';
export const CLAUDE_COMMANDS_DIR = '.claude/commands';
export const GEMINI_COMMANDS_DIR = '.gemini/commands';
const PORTABLE_COMMANDS_DIR = '.agents/skills';
export const CURSOR_AGENTS_DIR = '.cursor/agents';
export const CLAUDE_AGENTS_DIR = '.claude/agents';
export const CODEX_AGENTS_DIR = '.codex/agents';
export const HOOK_POLICY_PATH = '.agent/hooks/policy.json';
export const CLAUDE_SETTINGS_PATH = '.claude/settings.json';
export const SURFACE_MATRIX_PATH = '.agent/memory/executive/cross-platform-agent-surface-matrix.md';
export const PRACTICE_BOX_DIR = '.agent/practice-core/incoming';
export const CONTINUITY_CONTRACT_PATH = '.agent/memory/operational/repo-continuity.md';
export const FRESHNESS_WARNING_DAYS = 7;

const SUPERSEDED_COMMANDS = new Set(['experience']);
type JsonLikeObject = Readonly<Record<PropertyKey, unknown>>;

export function listCanonicalCommandNames(repoRoot: string): string[] {
  return listBasenames(repoRoot, COMMANDS_DIR, '.md').filter(
    (commandName) => !SUPERSEDED_COMMANDS.has(commandName),
  );
}

export function listCommandAdapterNames(
  repoRoot: string,
  relativeDir: string,
  extension: string,
): string[] {
  return listBasenames(repoRoot, relativeDir, extension)
    .filter((fileName) => fileName.startsWith('jc-'))
    .map((fileName) => fileName.replace(/^jc-/u, ''))
    .sort();
}

export function listPortableCommandAdapterNames(repoRoot: string): string[] {
  const skillsDir = join(repoRoot, PORTABLE_COMMANDS_DIR);
  if (!existsSync(skillsDir)) {
    return [];
  }

  return readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('jc-'))
    .filter((entry) => existsSync(join(skillsDir, entry.name, 'SKILL.md')))
    .map((entry) => entry.name.replace(/^jc-/u, ''))
    .sort();
}

export function listBasenames(repoRoot: string, relativeDir: string, extension: string): string[] {
  const absoluteDir = join(repoRoot, relativeDir);
  if (!existsSync(absoluteDir)) {
    return [];
  }

  return readdirSync(absoluteDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => entry.name.slice(0, -extension.length))
    .sort();
}

export function countPracticeBoxFiles(repoRoot: string): number {
  const practiceBoxAbsoluteDir = join(repoRoot, PRACTICE_BOX_DIR);
  if (!existsSync(practiceBoxAbsoluteDir)) {
    return 0;
  }

  return readdirSync(practiceBoxAbsoluteDir, { withFileTypes: true }).filter(
    (entry) => entry.name !== '.gitkeep',
  ).length;
}

export function readOptionalText(repoRoot: string, relativePath: string): string | null {
  const absolutePath = join(repoRoot, relativePath);
  if (!existsSync(absolutePath)) {
    return null;
  }

  return readFileSync(absolutePath, 'utf8');
}

export function readJson(repoRoot: string, relativePath: string): unknown {
  return JSON.parse(readFileSync(join(repoRoot, relativePath), 'utf8'));
}

export function readNestedString(value: unknown, path: readonly string[]): string | null {
  let current: unknown = value;

  for (const segment of path) {
    if (!isJsonLikeObject(current) || !Object.hasOwn(current, segment)) {
      return null;
    }
    current = current[segment];
  }

  return typeof current === 'string' ? current : null;
}

export function readFrontmatterValue(content: string, key: string): string | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/u);
  if (!match?.[1]) {
    return null;
  }

  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const valueMatch = match[1].match(new RegExp(`^${escapedKey}:\\s*(.+)$`, 'mu'));
  return valueMatch?.[1]?.trim().replace(/^['"]|['"]$/gu, '') ?? null;
}

export function calculateAgeDays(isoDate: string, now: Date): number | null {
  const parsedDate = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return Math.floor((now.getTime() - parsedDate.getTime()) / (24 * 60 * 60 * 1000));
}

function isJsonLikeObject(value: unknown): value is JsonLikeObject {
  return value !== null && typeof value === 'object';
}
