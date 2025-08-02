#!/usr/bin/env tsx
import type { SourceFile } from 'ts-morph';
import { Project } from 'ts-morph';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

interface ModuleAnalysis {
  path: string;
  imports: {
    module: string;
    isNodeBuiltin: boolean;
    isNotionSDK: boolean;
    isMCPSDK: boolean;
    isLocal: boolean;
    isExternal: boolean;
  }[];
  exports: {
    namedExports: number;
    defaultExport: boolean;
    typeExports: number;
  };
  classification: {
    score: number;
    category: 'generic' | 'mixed' | 'specific';
    reasoning: string[];
  };
  nodeAPIs: string[];
  lines: number;
}

// Initialize the TypeScript project
const project = new Project({
  tsConfigFilePath: './tsconfig.json',
});

// Ensure output directory exists
mkdirSync('.agent/generalisation-opportunities-analysis/module-analysis', { recursive: true });

// Analyze each source file
const analyses: ModuleAnalysis[] = [];

project.getSourceFiles().forEach((sourceFile) => {
  const filePath = sourceFile.getFilePath();

  // Skip test files and type definition files
  if (filePath.includes('.test.ts') || filePath.endsWith('.d.ts')) {
    return;
  }

  // Only analyze src files
  if (!filePath.includes('/src/')) {
    return;
  }

  const analysis = analyzeModule(sourceFile);
  analyses.push(analysis);
});

// Group by classification
const genericModules = analyses.filter((a) => a.classification.category === 'generic');
const mixedModules = analyses.filter((a) => a.classification.category === 'mixed');
const specificModules = analyses.filter((a) => a.classification.category === 'specific');

// Write analysis reports
writeReport('generic-mcp-components.md', genericModules, 'Generic MCP Components');
writeReport('notion-specific-components.md', specificModules, 'Notion-Specific Components');
writeReport('mixed-components.md', mixedModules, 'Mixed Components (Refactoring Candidates)');

// Write summary
const summary = {
  total: analyses.length,
  generic: genericModules.length,
  mixed: mixedModules.length,
  specific: specificModules.length,
  nodeAPIsUsed: [...new Set(analyses.flatMap((a) => a.nodeAPIs))],
  totalLines: analyses.reduce((sum, a) => sum + a.lines, 0),
};

writeFileSync(
  '.agent/generalisation-opportunities-analysis/module-analysis/summary.json',
  JSON.stringify(summary, null, 2),
);

console.log('Module analysis complete!');
console.log(`Total modules: ${String(summary.total)}`);
console.log(
  `Generic: ${String(summary.generic)} (${((summary.generic / summary.total) * 100).toFixed(1)}%)`,
);
console.log(
  `Mixed: ${String(summary.mixed)} (${((summary.mixed / summary.total) * 100).toFixed(1)}%)`,
);
console.log(
  `Specific: ${String(summary.specific)} (${((summary.specific / summary.total) * 100).toFixed(1)}%)`,
);

// Analysis functions
function analyzeModule(sourceFile: SourceFile): ModuleAnalysis {
  const filePath = sourceFile.getFilePath();
  const imports = sourceFile.getImportDeclarations();
  const exports = sourceFile.getExportedDeclarations();
  const defaultExport = sourceFile.getDefaultExportSymbol();

  // Analyze imports
  const importAnalysis = imports.map((imp) => {
    const moduleSpecifier = imp.getModuleSpecifierValue();
    return {
      module: moduleSpecifier,
      isNodeBuiltin:
        moduleSpecifier.startsWith('node:') ||
        ['fs', 'path', 'crypto', 'process', 'http', 'https'].includes(moduleSpecifier),
      isNotionSDK: moduleSpecifier.includes('@notionhq'),
      isMCPSDK: moduleSpecifier.includes('@modelcontextprotocol'),
      isLocal: moduleSpecifier.startsWith('.'),
      isExternal: !moduleSpecifier.startsWith('.') && !moduleSpecifier.startsWith('node:'),
    };
  });

  // Find Node.js API usage
  const nodeAPIs = findNodeAPIs(sourceFile);

  // Count lines
  const lines = sourceFile.getEndLineNumber();

  // Calculate classification score
  const classification = classifyModule(filePath, importAnalysis, nodeAPIs);

  return {
    path: filePath.replace(process.cwd(), ''),
    imports: importAnalysis,
    exports: {
      namedExports: exports.size,
      defaultExport: defaultExport !== undefined,
      typeExports: sourceFile.getExportDeclarations().filter((exp) => exp.isTypeOnly()).length,
    },
    classification,
    nodeAPIs,
    lines,
  };
}

function findNodeAPIs(sourceFile: SourceFile): string[] {
  const nodeAPIs: string[] = [];
  const text = sourceFile.getFullText();

  // Common Node.js API patterns
  const patterns = [
    { pattern: /process\.env/g, api: 'process.env' },
    { pattern: /process\.cwd\(/g, api: 'process.cwd' },
    { pattern: /process\.exit/g, api: 'process.exit' },
    { pattern: /fs\./g, api: 'fs' },
    { pattern: /path\./g, api: 'path' },
    { pattern: /crypto\./g, api: 'crypto' },
    { pattern: /Buffer\./g, api: 'Buffer' },
    { pattern: /__dirname/g, api: '__dirname' },
    { pattern: /__filename/g, api: '__filename' },
  ];

  patterns.forEach(({ pattern, api }) => {
    if (pattern.test(text)) {
      nodeAPIs.push(api);
    }
  });

  return [...new Set(nodeAPIs)];
}

/**
 * Analyzes import dependencies to determine domain coupling
 * Pure function that evaluates how tightly coupled a module is to specific domains
 */
function analyzeDomainCoupling(imports: ModuleAnalysis['imports']): {
  isDomainAgnostic: boolean;
  hasSpecificDomainDependency: boolean;
  reasoning: string;
} {
  const hasNotionDependency = imports.some((i) => i.isNotionSDK);
  const hasOnlyUtilityImports = imports.every(
    (i) => i.isLocal || i.isNodeBuiltin || ['zod', 'consola'].includes(i.module),
  );

  return {
    isDomainAgnostic: !hasNotionDependency && hasOnlyUtilityImports,
    hasSpecificDomainDependency: hasNotionDependency,
    reasoning: hasNotionDependency
      ? 'Has Notion SDK dependency'
      : hasOnlyUtilityImports
        ? 'Only utility/standard imports'
        : 'Mixed dependencies',
  };
}

/**
 * Analyzes architectural location to determine module purpose
 * Pure function that interprets directory structure as architectural intent
 */
function analyzeArchitecturalLocation(filePath: string): {
  isInfrastructure: boolean;
  isDomainSpecific: boolean;
  isTypeDefinition: boolean;
  reasoning: string;
} {
  const infrastructurePaths = ['/mcp/', '/logging/', '/errors/', '/utils/'];
  const isInfrastructure = infrastructurePaths.some((path) => filePath.includes(path));
  const isDomainSpecific = filePath.includes('/notion/');
  const isTypeDefinition = filePath.includes('/types/');

  const reasoning = isDomainSpecific
    ? 'In domain-specific directory'
    : isInfrastructure
      ? 'In generic infrastructure directory'
      : isTypeDefinition
        ? 'Type definition file'
        : 'In mixed location';

  return { isInfrastructure, isDomainSpecific, isTypeDefinition, reasoning };
}

/**
 * Analyzes platform dependencies to determine portability
 * Pure function that evaluates how portable a module is across platforms
 */
function analyzePlatformDependencies(nodeAPIs: string[]): {
  portabilityLevel: 'full' | 'partial' | 'limited';
  reasoning: string;
} {
  if (nodeAPIs.length === 0) {
    return { portabilityLevel: 'full', reasoning: 'No Node.js API usage' };
  } else if (nodeAPIs.length <= 2) {
    return { portabilityLevel: 'partial', reasoning: 'Minimal Node.js API usage' };
  }
  return { portabilityLevel: 'limited', reasoning: 'Heavy Node.js API usage' };
}

/**
 * Classifies a module based on its reusability characteristics
 * Orchestrates the analysis of different module aspects to determine classification
 */
function classifyModule(
  filePath: string,
  imports: ModuleAnalysis['imports'],
  nodeAPIs: string[],
): ModuleAnalysis['classification'] {
  // Analyze different aspects of the module
  const coupling = analyzeDomainCoupling(imports);
  const location = analyzeArchitecturalLocation(filePath);
  const platform = analyzePlatformDependencies(nodeAPIs);

  // Build reasoning from analyses
  const reasoning = [coupling.reasoning, location.reasoning, platform.reasoning].filter(Boolean);

  // Calculate reusability score based on meaningful criteria
  let score = 0;
  if (coupling.isDomainAgnostic) score += 2;
  if (location.isInfrastructure || location.isTypeDefinition) score += 1;
  if (platform.portabilityLevel === 'full') score += 1;
  else if (platform.portabilityLevel === 'partial') score += 0.5;

  // Determine category based on overall characteristics
  const category: 'generic' | 'mixed' | 'specific' =
    score >= 3.5 ? 'generic' : score >= 2 ? 'mixed' : 'specific';

  return { score, category, reasoning };
}

function writeReport(filename: string, modules: ModuleAnalysis[], title: string): void {
  const content = [`# ${title}\n`];

  content.push(`Total modules: ${String(modules.length)}\n`);
  content.push('## Modules\n');

  modules.forEach((module) => {
    content.push(`### ${module.path}`);
    content.push(`- **Lines**: ${String(module.lines)}`);
    content.push(`- **Score**: ${String(module.classification.score)}/5`);
    content.push(`- **Reasoning**: ${module.classification.reasoning.join(', ')}`);

    if (module.nodeAPIs.length > 0) {
      content.push(`- **Node APIs**: ${module.nodeAPIs.join(', ')}`);
    }

    if (module.imports.filter((i) => i.isExternal && !i.isNodeBuiltin).length > 0) {
      const externalImports = module.imports
        .filter((i) => i.isExternal && !i.isNodeBuiltin)
        .map((i) => i.module);
      content.push(`- **External imports**: ${externalImports.join(', ')}`);
    }

    content.push('');
  });

  writeFileSync(
    join('.agent/generalisation-opportunities-analysis/module-analysis', filename),
    content.join('\n'),
  );
}
