#!/usr/bin/env tsx
/**
 * Part 1 Architecture Normalisation Codemod (Plan Mode)
 *
 * Generates a dry-run JSON plan of directory moves and import rewrites without touching the filesystem.
 * No behavioural changes. Idempotent planning.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Project, SyntaxKind } from 'ts-morph';

interface PackagePlanMove {
  from: string;
  to: string;
  exists: boolean;
  fileCount: number;
}

interface PackagePlan {
  name: string;
  root: string;
  moves: PackagePlanMove[];
  collisions: { source: string; target: string }[];
  importRewriteEstimate: number;
}

async function estimateImportRewrites(pkgRoot: string, moves: PackagePlanMove[]): Promise<number> {
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  // collect all ts/tsx files under src
  const srcDir = path.join(pkgRoot, 'src');
  const filePaths: string[] = [];
  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await walk(full);
      else if (e.isFile() && /\.[cm]?tsx?$/.test(e.name)) filePaths.push(full);
    }
  }
  if (await pathExists(srcDir)) await walk(srcDir);
  for (const f of filePaths) project.addSourceFileAtPath(f);
  const legacySegments = moves.map((m) => m.from.split('/').slice(1).join('/')); // drop leading src/
  let count = 0;
  for (const sf of project.getSourceFiles()) {
    const importDecls = sf.getImportDeclarations();
    for (const imp of importDecls) {
      const text = imp.getModuleSpecifierValue();
      if (legacySegments.some((seg) => text.includes(seg.replace(/^src\//, './')))) {
        count++;
      }
    }
    // also handle export * from '...'
    sf.forEachChild((node) => {
      if (node.getKind() === SyntaxKind.ExportDeclaration) {
        const spec = (node as any).getModuleSpecifier?.()?.getLiteralText?.();
        if (
          typeof spec === 'string' &&
          legacySegments.some((seg) => spec.includes(seg.replace(/^src\//, './')))
        )
          count++;
      }
    });
  }
  return count;
}

const MAPPINGS: { from: string; to: string }[] = [
  { from: 'src/chorai/phaneron', to: 'src/config' },
  { from: 'src/chorai/aither', to: 'src/logging' },
  { from: 'src/chorai/stroma', to: 'src/types' },
  { from: 'src/chorai/eidola', to: 'src/test/mocks' },
  { from: 'src/organa/mcp', to: 'src/tools' },
  // organa/<integration> handled dynamically
  { from: 'src/psychon', to: 'src/app' },
];

async function pathExists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function countFiles(dir: string): Promise<number> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let count = 0;
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) count += await countFiles(full);
    else if (e.isFile()) count++;
  }
  return count;
}

async function discoverPhenotypePackages(
  repoRoot: string,
): Promise<{ name: string; root: string }[]> {
  const psychaDir = path.join(repoRoot, 'ecosystem', 'psycha');
  const entries = await fs.readdir(psychaDir, { withFileTypes: true });
  const pkgs: { name: string; root: string }[] = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const pkgRoot = path.join(psychaDir, e.name);
    const srcDir = path.join(pkgRoot, 'src');
    if (await pathExists(srcDir)) pkgs.push({ name: e.name, root: pkgRoot });
  }
  return pkgs.sort((a, b) => a.name.localeCompare(b.name));
}

async function buildPlan(repoRoot: string): Promise<PackagePlan[]> {
  const packages = await discoverPhenotypePackages(repoRoot);
  const plans: PackagePlan[] = [];
  for (const pkg of packages) {
    const moves: PackagePlanMove[] = [];
    const collisions: { source: string; target: string }[] = [];

    // Static mappings
    for (const m of MAPPINGS) {
      const fromAbs = path.join(pkg.root, m.from);
      const toAbs = path.join(pkg.root, m.to);
      const fromExists = await pathExists(fromAbs);
      const toExists = await pathExists(toAbs);
      if (!fromExists && !toExists) continue; // nothing to do
      if (fromExists && toExists) {
        // potential collision, record for manual review (will abort in execute mode)
        collisions.push({ source: m.from, target: m.to });
      }
      if (fromExists) {
        moves.push({
          from: m.from,
          to: m.to,
          exists: true,
          fileCount: fromExists ? await countFiles(fromAbs) : 0,
        });
      }
    }

    // Dynamic organa/<integration>
    const organaDir = path.join(pkg.root, 'src', 'organa');
    if (await pathExists(organaDir)) {
      const organs = await fs.readdir(organaDir, { withFileTypes: true });
      for (const organ of organs) {
        if (!organ.isDirectory()) continue;
        if (organ.name === 'mcp') continue; // handled by static mapping
        const from = `src/organa/${organ.name}`;
        const to = `src/integrations/${organ.name}`;
        const fromAbs = path.join(pkg.root, from);
        const toAbs = path.join(pkg.root, to);
        const fromExists = await pathExists(fromAbs);
        const toExists = await pathExists(toAbs);
        if (fromExists && toExists) collisions.push({ source: from, target: to });
        if (fromExists && !toExists) {
          moves.push({ from, to, exists: true, fileCount: await countFiles(fromAbs) });
        }
      }
    }

    const importRewriteEstimate = await estimateImportRewrites(pkg.root, moves);
    plans.push({ name: pkg.name, root: pkg.root, moves, collisions, importRewriteEstimate });
  }
  return plans;
}

async function main() {
  const repoRoot = path.resolve(
    path.join(import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname), '../../'),
  );
  const plans = await buildPlan(repoRoot);
  const outDir = path.join(repoRoot, '.agent', 'refactor');
  await fs.mkdir(outDir, { recursive: true });
  const planPath = path.join(outDir, 'refactor-plan.part1.dryrun.json');
  await fs.writeFile(
    planPath,
    JSON.stringify({ timestamp: new Date().toISOString(), plans }, null, 2),
    'utf8',
  );
  console.log(`Dry-run plan written: ${planPath}`);
  for (const p of plans) {
    console.log(`Package: ${p.name}`);
    p.moves.forEach((m) => console.log(`  MOVE ${m.from} -> ${m.to} (${m.fileCount} files)`));
    if (p.collisions.length) {
      console.warn('  COLLISIONS:');
      p.collisions.forEach((c) => console.warn(`    * ${c.source} -> ${c.target}`));
    }
  }
}

main().catch((err) => {
  console.error('Plan generation failed:', err);
  process.exit(1);
});
