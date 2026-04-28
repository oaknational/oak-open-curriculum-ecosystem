import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join, posix } from 'node:path';

export const CODEX_CONFIG_PATH = '.codex/config.toml';
const CODEX_CONFIG_DIR = posix.dirname(CODEX_CONFIG_PATH);

const AGENT_SECTION_PATTERN = /^\[agents\."([^"]+)"\]$/u;
const TOML_BASIC_STRING_PATTERN = /^([a-z_]+)\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"$/u;

interface MutableCodexAgentRegistration {
  readonly name: string;
  description?: string;
  configFile?: string;
}

interface TomlStringAssignment {
  readonly key: string;
  readonly value: string;
}

export interface CodexAgentRegistration {
  name: string;
  description: string;
  configFile: string;
}

export function parseCodexAgentRegistrations(content: string): CodexAgentRegistration[] {
  const entries: CodexAgentRegistration[] = [];
  let current: MutableCodexAgentRegistration | null = null;

  for (const line of readRelevantTomlLines(content)) {
    const sectionName = readAgentSectionName(line);
    if (sectionName) {
      flushRegistration(entries, current);
      current = { name: sectionName };
      continue;
    }

    current = applyRegistrationLine(current, line);
  }

  flushRegistration(entries, current);
  return entries.sort((left, right) => left.name.localeCompare(right.name));
}

export function readCodexAgentRegistrations(repoRoot: string): CodexAgentRegistration[] {
  const configAbsolutePath = join(repoRoot, CODEX_CONFIG_PATH);
  if (!existsSync(configAbsolutePath)) {
    throw new Error(`Missing Codex project-agent registry: ${CODEX_CONFIG_PATH}`);
  }

  return parseCodexAgentRegistrations(readFileSync(configAbsolutePath, 'utf8'));
}

export function resolveCodexAgentConfigFilePath(configFile: string): string {
  if (isAbsolute(configFile)) {
    return configFile;
  }

  return posix.normalize(posix.join(CODEX_CONFIG_DIR, configFile));
}

export function readRequiredTomlValue(content: string, key: string, adapterPath: string): string {
  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim();
    const assignment = parseTomlStringAssignment(line);
    if (!assignment || assignment.key !== key) {
      continue;
    }

    return assignment.value;
  }

  throw new Error(`${adapterPath} is missing required TOML key '${key}'.`);
}

function parseTomlBasicString(rawValue: string): string {
  const parsedValue: unknown = JSON.parse(`"${rawValue}"`);
  if (typeof parsedValue !== 'string') {
    throw new Error('Expected TOML basic string value to parse as a string.');
  }

  return parsedValue;
}

function readRelevantTomlLines(content: string): string[] {
  return content
    .split(/\r?\n/u)
    .map((rawLine) => rawLine.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}

function readAgentSectionName(line: string): string | null {
  const match = line.match(AGENT_SECTION_PATTERN);
  return match?.[1] ?? null;
}

function applyRegistrationLine(
  current: MutableCodexAgentRegistration | null,
  line: string,
): MutableCodexAgentRegistration | null {
  if (!current) {
    return current;
  }

  const assignment = parseTomlStringAssignment(line);
  if (!assignment) {
    return current;
  }

  assignRegistrationValue(current, assignment);
  return current;
}

function parseTomlStringAssignment(line: string): TomlStringAssignment | null {
  const match = line.match(TOML_BASIC_STRING_PATTERN);
  if (!match?.[1] || match[2] === undefined) {
    return null;
  }

  return {
    key: match[1],
    value: parseTomlBasicString(match[2]),
  };
}

function assignRegistrationValue(
  current: MutableCodexAgentRegistration,
  assignment: TomlStringAssignment,
): void {
  if (assignment.key === 'description') {
    current.description = assignment.value;
    return;
  }

  if (assignment.key === 'config_file') {
    current.configFile = assignment.value;
  }
}

function flushRegistration(
  entries: CodexAgentRegistration[],
  current: MutableCodexAgentRegistration | null,
): void {
  if (!current) {
    return;
  }

  entries.push(finalizeRegistration(current));
}

function finalizeRegistration(current: MutableCodexAgentRegistration): CodexAgentRegistration {
  if (!current.description) {
    throw new Error(`Codex agent '${current.name}' is missing a description.`);
  }

  if (!current.configFile) {
    throw new Error(`Codex agent '${current.name}' is missing a config_file.`);
  }

  return {
    name: current.name,
    description: current.description,
    configFile: current.configFile,
  };
}
