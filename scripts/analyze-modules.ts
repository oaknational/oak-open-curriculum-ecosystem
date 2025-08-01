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
console.log(`Total modules: ${summary.total}`);
console.log(
  `Generic: ${summary.generic} (${((summary.generic / summary.total) * 100).toFixed(1)}%)`,
);
console.log(`Mixed: ${summary.mixed} (${((summary.mixed / summary.total) * 100).toFixed(1)}%)`);
console.log(
  `Specific: ${summary.specific} (${((summary.specific / summary.total) * 100).toFixed(1)}%)`,
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

function classifyModule(
  filePath: string,
  imports: ModuleAnalysis['imports'],
  nodeAPIs: string[],
): ModuleAnalysis['classification'] {
  let score = 0;
  const reasoning: string[] = [];

  // Check imports (1 point each criteria)
  const hasNotionImports = imports.some((i) => i.isNotionSDK);
  const hasOnlyUtilityImports = imports.every(
    (i) => i.isLocal || i.isNodeBuiltin || ['zod', 'consola'].includes(i.module),
  );

  if (!hasNotionImports) {
    score += 1;
    reasoning.push('No Notion SDK imports');
  }

  if (hasOnlyUtilityImports) {
    score += 1;
    reasoning.push('Only utility/standard imports');
  }

  // Check file path and purpose (1 point)
  if (filePath.includes('/notion/')) {
    reasoning.push('In Notion-specific directory');
  } else if (
    filePath.includes('/mcp/') ||
    filePath.includes('/logging/') ||
    filePath.includes('/errors/') ||
    filePath.includes('/utils/')
  ) {
    score += 1;
    reasoning.push('In generic infrastructure directory');
  }

  // Check Node.js API usage (1 point)
  if (nodeAPIs.length === 0) {
    score += 1;
    reasoning.push('No Node.js API usage');
  } else if (nodeAPIs.length <= 2) {
    score += 0.5;
    reasoning.push('Minimal Node.js API usage');
  }

  // Check if it's a pure type/interface file (1 point)
  if (filePath.includes('/types/')) {
    score += 1;
    reasoning.push('Type definition file');
  }

  // Determine category
  let category: 'generic' | 'mixed' | 'specific';
  if (score >= 3.5) {
    category = 'generic';
  } else if (score >= 2) {
    category = 'mixed';
  } else {
    category = 'specific';
  }

  return { score, category, reasoning };
}

function writeReport(filename: string, modules: ModuleAnalysis[], title: string): void {
  const content = [`# ${title}\n`];

  content.push(`Total modules: ${modules.length}\n`);
  content.push('## Modules\n');

  modules.forEach((module) => {
    content.push(`### ${module.path}`);
    content.push(`- **Lines**: ${module.lines}`);
    content.push(`- **Score**: ${module.classification.score}/5`);
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
