import path from 'node:path';

export const REQUIRED_CODEX_SETTINGS = {
  model_reasoning_effort: 'high',
  sandbox_mode: 'read-only',
  approval_policy: 'never',
};

const TOML_BASIC_STRING_REGEX = /^([a-z_]+)\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"$/u;
const CODEX_DEVELOPER_INSTRUCTIONS_REGEX =
  /^developer_instructions\s*=\s*"""\r?\n([\s\S]*?)\r?\n"""/mu;
const CANONICAL_PATH_REGEX = /`(\.agent\/[^`]+)`/gu;
const CODEX_CONFIG_PATH = '.codex/config.toml';

export function parseTomlBasicString(rawValue) {
  return JSON.parse(`"${rawValue}"`);
}

export function readTomlBasicStringValue(content, key) {
  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim();
    const match = line.match(TOML_BASIC_STRING_REGEX);
    if (!match?.[1] || match[2] === undefined || match[1] !== key) {
      continue;
    }
    return parseTomlBasicString(match[2]);
  }
  return null;
}

export function parseCodexRegistrations(content) {
  const registrations = [];
  let current = null;

  const flushCurrent = () => {
    if (current) {
      registrations.push(current);
    }
  };

  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith('#')) {
      continue;
    }

    const sectionMatch = line.match(/^\[agents\."([^"]+)"\]$/u);
    if (sectionMatch?.[1]) {
      flushCurrent();
      current = { name: sectionMatch[1], description: '', configFile: '' };
      continue;
    }

    if (!current) {
      continue;
    }

    const valueMatch = line.match(TOML_BASIC_STRING_REGEX);
    if (!valueMatch?.[1] || valueMatch[2] === undefined) {
      continue;
    }

    const parsedValue = parseTomlBasicString(valueMatch[2]);
    if (valueMatch[1] === 'description') {
      current.description = parsedValue;
    } else if (valueMatch[1] === 'config_file') {
      current.configFile = parsedValue;
    }
  }

  flushCurrent();
  return registrations;
}

export function resolveCodexConfigFilePath(configFile, configPath = CODEX_CONFIG_PATH) {
  if (path.isAbsolute(configFile)) {
    return configFile;
  }

  return path.posix.normalize(path.posix.join(path.posix.dirname(configPath), configFile));
}

export function readCodexDeveloperInstructions(content) {
  return content.match(CODEX_DEVELOPER_INSTRUCTIONS_REGEX)?.[1]?.trim() ?? '';
}

export function extractCanonicalPaths(developerInstructions) {
  const paths = new Set();
  for (const match of developerInstructions.matchAll(CANONICAL_PATH_REGEX)) {
    if (match[1]) {
      paths.add(match[1]);
    }
  }
  return [...paths].sort();
}

export function getCodexRegistrationValidation({
  registrations,
  configPath = CODEX_CONFIG_PATH,
  fileExists = () => true,
}) {
  const issues = [];
  const registrationsByName = new Map();

  for (const registration of registrations) {
    if (!registration.description) {
      issues.push(`${configPath}: agent "${registration.name}" is missing a description`);
    }
    if (!registration.configFile) {
      issues.push(`${configPath}: agent "${registration.name}" is missing a config_file`);
      continue;
    }

    registrationsByName.set(registration.name, registration);

    const adapterPath = resolveCodexConfigFilePath(registration.configFile, configPath);
    if (!fileExists(adapterPath)) {
      issues.push(
        `${configPath}: agent "${registration.name}" references missing adapter ${adapterPath}`,
      );
    }
  }

  return { issues, registrationsByName };
}

export function getCodexAdapterValidation({
  codexAdapterFile,
  content,
  registeredAgent = null,
  templateDir = '.agent/sub-agents/templates',
  requiredSettings = REQUIRED_CODEX_SETTINGS,
  configPath = CODEX_CONFIG_PATH,
}) {
  const issues = [];
  const adapterBasename = codexAdapterFile.replace(/^.*\/|\.toml$/gu, '');
  const declaredName = readTomlBasicStringValue(content, 'name');
  const declaredDescription = readTomlBasicStringValue(content, 'description');

  if (!declaredName) {
    issues.push(`${codexAdapterFile}: missing required TOML key "name"`);
  } else if (declaredName !== adapterBasename) {
    issues.push(
      `${codexAdapterFile}: name must match filename "${adapterBasename}" (found: ${declaredName})`,
    );
  }

  if (!declaredDescription) {
    issues.push(`${codexAdapterFile}: missing required TOML key "description"`);
  }

  if (!registeredAgent) {
    issues.push(
      `${codexAdapterFile}: no matching agent registration exists in .codex/config.toml for "${adapterBasename}"`,
    );
  } else {
    const registeredAdapterPath = resolveCodexConfigFilePath(
      registeredAgent.configFile,
      configPath,
    );
    if (registeredAdapterPath !== codexAdapterFile) {
      issues.push(
        `${codexAdapterFile}: .codex/config.toml resolves "${adapterBasename}" to ${registeredAdapterPath}, expected ${codexAdapterFile}`,
      );
    } else {
      if (declaredName && declaredName !== registeredAgent.name) {
        issues.push(
          `${codexAdapterFile}: name "${declaredName}" must match .codex/config.toml registration "${registeredAgent.name}"`,
        );
      }
      if (declaredDescription && declaredDescription !== registeredAgent.description) {
        issues.push(
          `${codexAdapterFile}: description must match .codex/config.toml registration for "${registeredAgent.name}"`,
        );
      }
    }
  }

  for (const [settingKey, expectedValue] of Object.entries(requiredSettings)) {
    const actualValue = readTomlBasicStringValue(content, settingKey);
    if (actualValue !== expectedValue) {
      issues.push(
        `${codexAdapterFile}: ${settingKey} must be "${expectedValue}" (found: ${actualValue ?? 'missing'})`,
      );
    }
  }

  const developerInstructions = readCodexDeveloperInstructions(content);
  if (!developerInstructions) {
    issues.push(`${codexAdapterFile}: missing triple-quoted developer_instructions block`);
    return { issues, templatePaths: [], canonicalPaths: [] };
  }

  const canonicalPaths = extractCanonicalPaths(developerInstructions);
  const templatePaths = canonicalPaths.filter((pathValue) =>
    pathValue.startsWith(`${templateDir}/`),
  );
  if (templatePaths.length === 0) {
    issues.push(
      `${codexAdapterFile}: developer_instructions must reference at least one canonical template inside ${templateDir}`,
    );
  }

  return { issues, templatePaths, canonicalPaths };
}
