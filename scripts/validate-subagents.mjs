#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import {
  getCodexAdapterValidation,
  getCodexRegistrationValidation,
  parseCodexRegistrations,
} from './validate-subagents-helpers.mjs';

const repoRoot = process.cwd();

const CURSOR_WRAPPER_DIR = '.cursor/agents';
const CODEX_ADAPTER_DIR = '.codex/agents';
const CODEX_CONFIG_PATH = '.codex/config.toml';
const TEMPLATE_DIR = '.agent/sub-agents/templates';
const IDENTITY_COMPONENT_PATH = '.agent/sub-agents/components/behaviours/subagent-identity.md';

const REQUIRED_FRONTMATTER_FIELDS = ['name', 'model', 'description'];
const TEMPLATE_LOAD_REGEX = /Your first action MUST be to read and internalise `([^`]+)`\./;
const REQUIRED_IDENTITY_LINE = `Read and apply \`${IDENTITY_COMPONENT_PATH}\`.`;

/**
 * @param {string} relPath
 */
async function readText(relPath) {
  const filePath = path.join(repoRoot, relPath);
  return fs.readFile(filePath, 'utf8');
}

/**
 * @param {string} relPath
 */
async function exists(relPath) {
  try {
    await fs.access(path.join(repoRoot, relPath));
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {string} content
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? null;
}

/**
 * @param {string} frontmatter
 * @param {string} key
 */
function getFrontmatterValue(frontmatter, key) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escapedKey}:\\s*(.+)$`, 'm');
  const match = frontmatter.match(regex);
  return match?.[1]?.trim() ?? '';
}

/**
 * @param {string} relDir
 */
async function listMarkdownFiles(relDir) {
  return listFiles(relDir, '.md');
}

/**
 * @param {string} relDir
 * @param {string} extension
 */
async function listFiles(relDir, extension) {
  const absDir = path.join(repoRoot, relDir);
  const entries = await fs.readdir(absDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => `${relDir}/${entry.name}`)
    .sort();
}

const issues = [];

/**
 * @param {string} message
 */
function addIssue(message) {
  issues.push(message);
}

if (!(await exists(IDENTITY_COMPONENT_PATH))) {
  addIssue(`Missing required shared component: ${IDENTITY_COMPONENT_PATH}`);
}

const wrapperFiles = await listMarkdownFiles(CURSOR_WRAPPER_DIR);
const codexAdapterFiles = await listFiles(CODEX_ADAPTER_DIR, '.toml');
const templateFiles = await listMarkdownFiles(TEMPLATE_DIR);
const cursorReferencedTemplates = new Set();
const codexReferencedTemplates = new Set();
const codexRegistrationsByName = new Map();

for (const wrapperFile of wrapperFiles) {
  const content = await readText(wrapperFile);
  const frontmatter = extractFrontmatter(content);
  const wrapperBasename = path.basename(wrapperFile, '.md');

  if (!frontmatter) {
    addIssue(`${wrapperFile}: missing YAML frontmatter block`);
    continue;
  }

  for (const field of REQUIRED_FRONTMATTER_FIELDS) {
    const value = getFrontmatterValue(frontmatter, field);
    if (!value) {
      addIssue(`${wrapperFile}: missing required frontmatter field "${field}"`);
    }
  }

  const declaredName = getFrontmatterValue(frontmatter, 'name');
  if (declaredName && declaredName !== wrapperBasename) {
    addIssue(
      `${wrapperFile}: frontmatter name "${declaredName}" must match filename "${wrapperBasename}"`,
    );
  }

  const templateLoadMatch = content.match(TEMPLATE_LOAD_REGEX);
  if (!templateLoadMatch?.[1]) {
    addIssue(
      `${wrapperFile}: missing required template loading line ("Your first action MUST be to read and internalise ...")`,
    );
    continue;
  }

  const templatePath = templateLoadMatch[1];
  cursorReferencedTemplates.add(templatePath);

  if (!templatePath.startsWith(`${TEMPLATE_DIR}/`)) {
    addIssue(
      `${wrapperFile}: template path must be inside ${TEMPLATE_DIR} (found: ${templatePath})`,
    );
    continue;
  }

  if (!(await exists(templatePath))) {
    addIssue(`${wrapperFile}: referenced template does not exist (${templatePath})`);
  }
}

if (!(await exists(CODEX_CONFIG_PATH))) {
  addIssue(`Missing Codex project-agent registry: ${CODEX_CONFIG_PATH}`);
} else {
  const codexRegistrations = parseCodexRegistrations(await readText(CODEX_CONFIG_PATH));
  const { issues: registrationIssues, registrationsByName: resolvedRegistrationsByName } =
    getCodexRegistrationValidation({
      registrations: codexRegistrations,
      configPath: CODEX_CONFIG_PATH,
      fileExists: (relPath) => codexAdapterFiles.includes(relPath),
    });
  for (const issue of registrationIssues) {
    addIssue(issue);
  }
  for (const [agentName, configFile] of resolvedRegistrationsByName.entries()) {
    codexRegistrationsByName.set(agentName, configFile);
  }
}

for (const codexAdapterFile of codexAdapterFiles) {
  const content = await readText(codexAdapterFile);
  const adapterBasename = path.basename(codexAdapterFile, '.toml');
  const registeredAgent = codexRegistrationsByName.get(adapterBasename);
  const {
    issues: codexAdapterIssues,
    templatePaths,
    canonicalPaths,
  } = getCodexAdapterValidation({
    codexAdapterFile,
    content,
    registeredAgent,
    templateDir: TEMPLATE_DIR,
  });
  for (const issue of codexAdapterIssues) {
    addIssue(issue);
  }
  for (const canonicalPath of canonicalPaths) {
    if (!(await exists(canonicalPath))) {
      addIssue(`${codexAdapterFile}: referenced canonical file does not exist (${canonicalPath})`);
    }
  }
  for (const templatePath of templatePaths) {
    codexReferencedTemplates.add(templatePath);
  }
}

for (const templateFile of templateFiles) {
  const content = await readText(templateFile);

  if (
    !content.includes(
      'Read and apply `.agent/sub-agents/components/behaviours/reading-discipline.md`.',
    )
  ) {
    addIssue(`${templateFile}: missing reading-discipline component reference`);
  }

  if (!content.includes(REQUIRED_IDENTITY_LINE)) {
    addIssue(
      `${templateFile}: missing required identity component reference (${IDENTITY_COMPONENT_PATH})`,
    );
  }

  if (!cursorReferencedTemplates.has(templateFile)) {
    addIssue(
      `${templateFile}: no wrapper in ${CURSOR_WRAPPER_DIR} currently references this template`,
    );
  }

  if (!codexReferencedTemplates.has(templateFile)) {
    addIssue(
      `${templateFile}: no adapter in ${CODEX_ADAPTER_DIR} currently references this template`,
    );
  }
}

if (issues.length > 0) {
  console.error(
    `Sub-agent standards validation failed (${issues.length} issue${issues.length === 1 ? '' : 's'}):`,
  );
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(
  `Sub-agent standards validation passed: ${wrapperFiles.length} Cursor wrappers, ${codexAdapterFiles.length} Codex adapters, and ${templateFiles.length} template files are compliant.`,
);
