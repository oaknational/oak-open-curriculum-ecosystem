import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CODEX_CONFIG_PATH,
  readCodexAgentRegistrations,
  resolveCodexAgentConfigFilePath,
} from './codex-project-agent-registry.js';
import type { CodexAgentRegistration } from './codex-project-agent-registry.js';
import {
  createTopLevelTomlBasicStringReader,
  readOptionalTopLevelTomlBasicString,
  readRequiredTopLevelTomlBasicString,
  type TopLevelTomlBasicStringReader,
} from './toml-top-level-basic-string.js';

export { parseCodexAgentRegistrations } from './codex-project-agent-registry.js';

const CANONICAL_PATH_PATTERN = /`(\.agent\/[^`]+)`/gu;

interface AdapterMetadata {
  readonly name: string;
  readonly description: string;
  readonly model: string | null;
  readonly modelReasoningEffort: string;
  readonly sandboxMode: string;
  readonly approvalPolicy: string;
}

export interface CodexProjectAgent {
  name: string;
  description: string;
  configPath: string;
  adapterPath: string;
  model: string | null;
  modelReasoningEffort: string;
  sandboxMode: string;
  approvalPolicy: string;
  developerInstructions: string;
  referencedCanonicalFiles: string[];
}

export function listCodexProjectAgentNames(repoRoot: string): string[] {
  return readCodexAgentRegistrations(repoRoot).map((registration) => registration.name);
}

export function resolveCodexProjectAgent(repoRoot: string, agentName: string): CodexProjectAgent {
  const registrations = readCodexAgentRegistrations(repoRoot);
  const registration = findRegistrationOrThrow(registrations, agentName);
  const adapterPath = resolveCodexAgentConfigFilePath(registration.configFile);
  const adapterContent = readAdapterContent(repoRoot, adapterPath, agentName);
  const readValue = createTopLevelTomlBasicStringReader(adapterContent);
  const adapterMetadata = readAdapterMetadata(registration, adapterPath, readValue, agentName);
  const developerInstructions = readDeveloperInstructions(readValue, adapterPath);
  const referencedCanonicalFiles = readReferencedCanonicalFiles(
    repoRoot,
    agentName,
    developerInstructions,
    adapterPath,
  );

  return {
    ...adapterMetadata,
    configPath: CODEX_CONFIG_PATH,
    adapterPath,
    developerInstructions,
    referencedCanonicalFiles,
  };
}

function findRegistrationOrThrow(
  registrations: readonly CodexAgentRegistration[],
  agentName: string,
): CodexAgentRegistration {
  const registration = registrations.find((entry) => entry.name === agentName);
  if (registration) {
    return registration;
  }

  const availableAgents = registrations.map((entry) => entry.name).join(', ');
  throw new Error(
    `Codex project agent '${agentName}' is not registered in ${CODEX_CONFIG_PATH}. Available agents: ${availableAgents}`,
  );
}

function readAdapterContent(repoRoot: string, adapterPath: string, agentName: string): string {
  const adapterAbsolutePath = join(repoRoot, adapterPath);
  if (!existsSync(adapterAbsolutePath)) {
    throw new Error(`Codex project agent '${agentName}' points at missing adapter ${adapterPath}.`);
  }

  return readFileSync(adapterAbsolutePath, 'utf8');
}

function readAdapterMetadata(
  registration: CodexAgentRegistration,
  adapterPath: string,
  readValue: TopLevelTomlBasicStringReader,
  agentName: string,
): AdapterMetadata {
  const name = readRequiredAdapterValue(readValue, 'name', adapterPath);
  const description = readRequiredAdapterValue(readValue, 'description', adapterPath);

  validateAdapterValue('name', name, registration.name, registration, agentName);
  validateAdapterValue(
    'description',
    description,
    registration.description,
    registration,
    agentName,
  );

  return {
    name,
    description,
    model: readOptionalTopLevelTomlBasicString(readValue, 'model', adapterPath),
    modelReasoningEffort: readRequiredAdapterValue(
      readValue,
      'model_reasoning_effort',
      adapterPath,
    ),
    sandboxMode: readRequiredAdapterValue(readValue, 'sandbox_mode', adapterPath),
    approvalPolicy: readRequiredAdapterValue(readValue, 'approval_policy', adapterPath),
  };
}

function readRequiredAdapterValue(
  readValue: TopLevelTomlBasicStringReader,
  key: string,
  adapterPath: string,
): string {
  return readRequiredTopLevelTomlBasicString(readValue, key, adapterPath);
}

function validateAdapterValue(
  key: 'name' | 'description',
  actual: string,
  expected: string,
  registration: CodexAgentRegistration,
  agentName: string,
): void {
  if (actual === expected) {
    return;
  }

  if (key === 'name') {
    throw new Error(
      `Codex project agent '${agentName}' adapter name '${actual}' does not match registry name '${registration.name}'.`,
    );
  }

  throw new Error(
    `Codex project agent '${agentName}' adapter description does not match the registry description in ${CODEX_CONFIG_PATH}.`,
  );
}

function readReferencedCanonicalFiles(
  repoRoot: string,
  agentName: string,
  developerInstructions: string,
  adapterPath: string,
): string[] {
  const referencedCanonicalFiles = extractCanonicalPaths(developerInstructions);
  if (referencedCanonicalFiles.length === 0) {
    throw new Error(
      `Codex project agent '${agentName}' does not reference any canonical .agent files in ${adapterPath}.`,
    );
  }

  ensureCanonicalFilesExist(repoRoot, agentName, referencedCanonicalFiles);
  return referencedCanonicalFiles;
}

function ensureCanonicalFilesExist(
  repoRoot: string,
  agentName: string,
  referencedCanonicalFiles: readonly string[],
): void {
  for (const referencedFile of referencedCanonicalFiles) {
    const referencedAbsolutePath = join(repoRoot, referencedFile);
    if (existsSync(referencedAbsolutePath)) {
      continue;
    }

    throw new Error(
      `Codex project agent '${agentName}' references missing canonical file ${referencedFile}.`,
    );
  }
}

function readDeveloperInstructions(
  readValue: TopLevelTomlBasicStringReader,
  adapterPath: string,
): string {
  const developerInstructions = readValue('developer_instructions')?.trim();
  if (!developerInstructions) {
    throw new Error(`${adapterPath} is missing a top-level developer_instructions string.`);
  }

  return developerInstructions;
}

function extractCanonicalPaths(developerInstructions: string): string[] {
  const referencedFiles = new Set<string>();
  for (const match of developerInstructions.matchAll(CANONICAL_PATH_PATTERN)) {
    if (match[1]) {
      referencedFiles.add(match[1]);
    }
  }
  return [...referencedFiles].sort((a, b) => a.localeCompare(b));
}
