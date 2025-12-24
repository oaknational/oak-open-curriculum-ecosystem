/**
 * 1. is this file used?
 * 2. type-gen code must not depend on curriculum sdk run-time code. So the import is invalid.
 */
import { ontologyData } from '../../../../src/mcp/ontology-data.js';

interface SynonymBuildResult {
  entries: [string, string][];
  allowed: readonly string[];
  missingInConfig: readonly string[];
  unusedConfigKeys: readonly string[];
}

function normaliseKey(value: string): string {
  return value.trim().toLowerCase();
}

function escapeTsString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function buildSynonymEntries(
  canonicalValues: readonly string[],
  config: Partial<Record<string, readonly string[]>>,
): SynonymBuildResult {
  const allowed = [...canonicalValues].sort((a, b) => a.localeCompare(b));
  const canonicalSet = new Set(allowed);
  const entries: [string, string][] = [];
  const missing: string[] = [];

  for (const canonical of allowed) {
    const configSynonyms = config[canonical];
    if (!configSynonyms) {
      missing.push(canonical);
    }
    const synonyms = new Set<string>();
    synonyms.add(normaliseKey(canonical));
    if (configSynonyms) {
      for (const synonym of configSynonyms) {
        synonyms.add(normaliseKey(synonym));
      }
    }
    for (const synonym of synonyms) {
      entries.push([synonym, canonical]);
    }
  }

  const unusedConfigKeys = Object.keys(config)
    .filter((key) => !canonicalSet.has(key))
    .sort((a, b) => a.localeCompare(b));

  return { entries, allowed, missingInConfig: missing, unusedConfigKeys };
}

function renderSynonymSection(
  entity: 'Subject' | 'KeyStage',
  buildResult: SynonymBuildResult,
): string {
  const prefix = entity === 'Subject' ? 'SUBJECT' : 'KEY_STAGE';
  const canonicalConst = `${prefix}_CANONICALS`;
  const typeName = `${entity}Canonical`;
  const mapName = `${prefix}_SYNONYM_MAP`;

  const allowedValues = buildResult.allowed.map((value) => `'${escapeTsString(value)}'`).join(', ');
  const mapEntries = buildResult.entries
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(
      ([synonym, canonical]) => `  ['${escapeTsString(synonym)}', '${escapeTsString(canonical)}'],`,
    )
    .join('\n');

  const describeFunction = `describe${entity}Allowed`;
  const standardiseFunction = `standardise${entity}`;

  return `export const ${canonicalConst} = [${allowedValues}] as const;\nexport type ${typeName} = typeof ${canonicalConst}[number];\n\nconst ${mapName} = new Map<string, ${typeName}>([\n${mapEntries}\n]);\n\nexport function ${standardiseFunction}(value: string): ${typeName} | undefined {\n  const key = normaliseSynonymKey(value);\n  return ${mapName}.get(key);\n}\n\nexport function ${describeFunction}(): string {\n  return ${canonicalConst}.join(', ');\n}\n`;
}

export function generateSynonymsFile(
  subjects: readonly string[],
  keyStages: readonly string[],
): { content: string; subjectReport: SynonymBuildResult; keyStageReport: SynonymBuildResult } {
  const subjectReport = buildSynonymEntries(subjects, ontologyData.synonyms.subjects);
  const keyStageReport = buildSynonymEntries(keyStages, ontologyData.synonyms.keyStages);

  const header = `/**\n * GENERATED FILE - DO NOT EDIT\n *\n * Synonym maps for canonicalising MCP tool arguments.\n */\n\nfunction normaliseSynonymKey(value: string): string {\n  return value.trim().toLowerCase();\n}\n`;

  const subjectSection = renderSynonymSection('Subject', subjectReport);
  const keyStageSection = renderSynonymSection('KeyStage', keyStageReport);

  const content = `${header}\n${subjectSection}\n${keyStageSection}`;

  return { content, subjectReport, keyStageReport };
}
