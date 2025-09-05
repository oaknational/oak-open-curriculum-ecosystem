#!/usr/bin/env tsx
/**
 * Part 1 Architecture Normalisation Codemod (Execution Mode)
 *
 * Performs directory moves and import path rewrites for phenotype packages.
 * Invariants: abort on collisions, no behavioural changes (only path/import updates).
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { Project, SyntaxKind, Node } from 'ts-morph';

interface Move {
  from: string;
  to: string;
}
interface PackageExecPlan {
  name: string;
  root: string;
  moves: Move[];
}

const STATIC_MAPPINGS: Move[] = [
  { from: 'src/chorai/phaneron', to: 'src/config' },
  { from: 'src/chorai/aither', to: 'src/logging' },
  { from: 'src/chorai/stroma', to: 'src/types' },
  { from: 'src/chorai/eidola', to: 'src/test/mocks' },
  { from: 'src/organa/mcp', to: 'src/tools' },
  { from: 'src/psychon', to: 'src/app' },
];

function runGitMv(cwd: string, from: string, to: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('git', ['mv', from, to], { cwd, stdio: 'inherit' });
    proc.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`git mv failed (${code}) for ${from} -> ${to}`));
    });
  });
}

async function pathExists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function discoverPhenotypes(repoRoot: string): Promise<{ name: string; root: string }[]> {
  const psychaDir = path.join(repoRoot, 'ecosystem', 'psycha');
  const entries = await fs.readdir(psychaDir, { withFileTypes: true });
  const list: { name: string; root: string }[] = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const pkgRoot = path.join(psychaDir, e.name);
    if (await pathExists(path.join(pkgRoot, 'src'))) list.push({ name: e.name, root: pkgRoot });
  }
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

async function buildExecPlan(pkg: { name: string; root: string }): Promise<PackageExecPlan> {
  const moves: Move[] = [];
  // static
  for (const m of STATIC_MAPPINGS) {
    if (await pathExists(path.join(pkg.root, m.from))) moves.push(m);
  }
  // dynamic integrations
  const organaDir = path.join(pkg.root, 'src', 'organa');
  if (await pathExists(organaDir)) {
    const organs = await fs.readdir(organaDir, { withFileTypes: true });
    for (const organ of organs) {
      if (!organ.isDirectory()) continue;
      if (organ.name === 'mcp') continue;
      const from = `src/organa/${organ.name}`;
      if (await pathExists(path.join(pkg.root, from))) {
        moves.push({ from, to: `src/integrations/${organ.name}` });
      }
    }
  }
  // order: deepest paths first to reduce risk (heuristic sort by depth desc then length desc)
  moves.sort(
    (a, b) => b.from.split('/').length - a.from.split('/').length || b.from.length - a.from.length,
  );
  return { name: pkg.name, root: pkg.root, moves };
}

function toPosix(p: string): string {
  return p.split('\\').join('/');
}

function applySegmentMapping(text: string): string {
  const replacements: [RegExp, string][] = [
    [/organa\/mcp(?=$|\/)/g, 'tools'],
    [/organa\/notion(?=$|\/)/g, 'integrations/notion'],
    [/chorai\/phaneron(?=$|\/)/g, 'config'],
    [/chorai\/aither(?=$|\/)/g, 'logging'],
    [/chorai\/stroma(?=$|\/)/g, 'types'],
    [/chorai\/eidola(?=$|\/)/g, 'test/mocks'],
    [/psychon(?=$|\/)/g, 'app'],
  ];
  let out = text;
  for (const [rx, to] of replacements) out = out.replace(rx, to);
  return out;
}

function applySegmentMappingAbsolute(absPath: string): string {
  // Map legacy segments inside an absolute path string
  return applySegmentMapping(toPosix(absPath));
}

function getPackageRootFromFilePath(currentFilePath: string): string | null {
  const idx = currentFilePath.lastIndexOf(`${path.sep}src${path.sep}`);
  if (idx === -1) return null;
  return currentFilePath.slice(0, idx);
}

function rewriteRelativeSpecifier(currentFilePath: string, spec: string): string {
  // 1) Map legacy segments inside the spec text (handles ../chorai/... etc.)
  const mappedSpec = applySegmentMapping(spec);
  const hadJsExt = /\.js$/i.test(spec);
  const hadTsExt = /\.tsx?$/i.test(spec);
  // 2) Resolve to absolute, preferring packageRoot/src/<segment>/... for known top-level segments
  const currentDir = path.dirname(currentFilePath);
  const pkgRoot = getPackageRootFromFilePath(currentFilePath);
  let abs: string;
  if (pkgRoot) {
    const withoutDots = toPosix(mappedSpec)
      .replace(/^\.\/?/, '')
      .replace(/^\.\//, '');
    const parts = withoutDots.split('/');
    const first = parts[0];
    const rest = parts.slice(1).join('/');
    const knownTop = new Set([
      'config',
      'logging',
      'types',
      'test',
      'tools',
      'integrations',
      'app',
    ]);
    if (knownTop.has(first)) {
      const candidateUnderSrc = path.join(pkgRoot, 'src', first, rest);
      abs = candidateUnderSrc;
    } else {
      abs = path.resolve(currentDir, mappedSpec);
    }
  } else {
    abs = path.resolve(currentDir, mappedSpec);
  }
  // 3) Ensure absolute path also has mapped segments applied
  const absMapped = applySegmentMappingAbsolute(abs);
  // 4) Compute new relative from current file to target
  let rel = toPosix(path.relative(currentDir, absMapped));
  if (!rel.startsWith('.')) rel = './' + rel;
  // 5) Preserve original extension behaviour for idempotency & ESM runtime:
  //    - If original had .js, keep .js
  //    - If original had .ts/.tsx, drop extension
  //    - If original had no extension, keep extensionless
  if (hadJsExt) {
    // normalise to .js suffix
    rel = rel.replace(/\.(ts|tsx)$/g, '');
    if (!/\.js$/i.test(rel)) rel = rel.replace(/\.(mjs|cjs)$/i, '').replace(/$/, '') + '.js';
  } else if (hadTsExt) {
    rel = rel.replace(/\.(ts|tsx)$/g, '');
  } else {
    // ensure no accidental TS/JS extension leaks
    rel = rel.replace(/\.(ts|tsx)$/g, '');
  }
  return rel;
}

function rewriteSpecifier(currentFilePath: string, spec: string): string {
  // Fast idempotency path: if spec already references only new segments and is extensionally
  // equivalent to desired style, return as-is.
  if (!/(psychon|chorai|organa\/mcp)/.test(spec)) {
    return spec;
  }
  if (spec.startsWith('.')) {
    return rewriteRelativeSpecifier(currentFilePath, spec);
  }
  // Bare/module-like specifiers: apply segment mapping only (no path math)
  return applySegmentMapping(spec);
}

async function rewriteImports(pkgRoot: string) {
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  const srcDir = path.join(pkgRoot, 'src');
  const files: string[] = [];
  async function collect(d: string) {
    const ents = await fs.readdir(d, { withFileTypes: true });
    for (const e of ents) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) await collect(full);
      else if (e.isFile() && /\.[cm]?tsx?$/.test(e.name)) files.push(full);
    }
  }
  if (await pathExists(srcDir)) await collect(srcDir);
  files.forEach((f) => project.addSourceFileAtPath(f));
  let rewrites = 0;
  for (const sf of project.getSourceFiles()) {
    let changed = false;
    const filePath = sf.getFilePath();
    sf.getImportDeclarations().forEach((imp) => {
      const before = imp.getModuleSpecifierValue();
      const after = rewriteSpecifier(filePath, before);
      if (after !== before) {
        imp.setModuleSpecifier(after);
        changed = true;
        rewrites++;
      }
    });
    sf.getExportDeclarations().forEach((exp) => {
      const spec = exp.getModuleSpecifierValue();
      if (spec) {
        const after = rewriteSpecifier(filePath, spec);
        if (after !== spec) {
          exp.setModuleSpecifier(after);
          changed = true;
          rewrites++;
        }
      }
    });
    // Dynamic import("...") and require("...")
    sf.forEachDescendant((node) => {
      // import("...")
      if (node.getKind() === SyntaxKind.ImportExpression) {
        // @ts-ignore ts-morph typings
        const arg = node.getArgument && node.getArgument();
        if (arg && Node.isStringLiteral(arg)) {
          const before = arg.getLiteralText();
          const after = rewriteSpecifier(filePath, before);
          if (after !== before) {
            arg.setLiteralValue(after);
            changed = true;
            rewrites++;
          }
        }
      }
      // require("...")
      if (Node.isCallExpression(node)) {
        const expr = node.getExpression();
        if (Node.isIdentifier(expr) && expr.getText() === 'require') {
          const args = node.getArguments();
          if (args.length > 0 && Node.isStringLiteral(args[0])) {
            const before = args[0].getLiteralText();
            const after = rewriteSpecifier(filePath, before);
            if (after !== before) {
              args[0].setLiteralValue(after);
              changed = true;
              rewrites++;
            }
          }
        }
      }
    });
    if (changed) sf.saveSync();
  }
  return rewrites;
}

async function execPackage(plan: PackageExecPlan) {
  console.log(`\n[EXEC] Package ${plan.name}`);
  // collision detection (source+target exist)
  for (const m of plan.moves) {
    const src = path.join(plan.root, m.from);
    const dst = path.join(plan.root, m.to);
    if ((await pathExists(src)) && (await pathExists(dst))) {
      throw new Error(`Collision: ${m.from} and ${m.to} both exist in ${plan.name}`);
    }
  }
  // perform moves
  for (const m of plan.moves) {
    const src = path.join(plan.root, m.from);
    if (!(await pathExists(src))) continue; // already moved (idempotent skip)
    const dst = path.join(plan.root, m.to);
    const dstDir = path.dirname(dst);
    await fs.mkdir(dstDir, { recursive: true });
    console.log(`git mv ${m.from} ${m.to}`);
    await runGitMv(plan.root, m.from, m.to);
  }
  const rewrites = await rewriteImports(plan.root);
  console.log(`[EXEC] Import specifiers rewritten: ${rewrites}`);
}

async function main() {
  const repoRoot = path.resolve(
    path.join(path.dirname(new URL(import.meta.url).pathname), '../../'),
  );
  const phenotypeArg = process.argv.find((a) => a.startsWith('--packages='));
  const filter = phenotypeArg ? phenotypeArg.split('=')[1].split(',') : [];
  const phenotypes = await discoverPhenotypes(repoRoot);
  for (const pkg of phenotypes) {
    if (filter.length && !filter.includes(pkg.name)) continue;
    const plan = await buildExecPlan(pkg);
    await execPackage(plan);
  }
  console.log('\n[EXEC] Completed. Run quality gates to validate.');
}

main().catch((err) => {
  console.error('[EXEC] Failure', err);
  process.exit(1);
});
