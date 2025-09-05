import { execSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

function extractExports(source: string): string[] {
  const names = new Set<string>();
  // export function / async function
  for (const m of source.matchAll(/export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/g)) {
    names.add(m[1]);
  }
  // export class
  for (const m of source.matchAll(/export\s+class\s+([A-Za-z0-9_]+)/g)) {
    names.add(m[1]);
  }
  // export const/let/var
  for (const m of source.matchAll(/export\s+(?:const|let|var)\s+([A-Za-z0-9_]+)/g)) {
    names.add(m[1]);
  }
  // export { a, b as c }
  for (const m of source.matchAll(/export\s*\{([^}]+)\}/g)) {
    const inside = m[1];
    inside
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((seg) => {
        const asMatch = seg.match(/^(?:type\s+)?([A-Za-z0-9_]+)(?:\s+as\s+([A-Za-z0-9_]+))?$/);
        if (asMatch) names.add(asMatch[2] ?? asMatch[1]);
      });
  }
  // export default ...
  if (/export\s+default\b/.test(source)) names.add('default');
  return Array.from(names).sort();
}

async function main() {
  const args = new Map<string, string>();
  for (const a of process.argv.slice(2)) {
    const [k, v] = a.split('=');
    if (k && v) args.set(k.replace(/^--/, ''), v);
  }
  const pkg = args.get('package') ?? 'oak-notion-mcp';
  const baselineRef = args.get('baseline-ref') ?? 'HEAD~1';

  const repoRoot = process.cwd();
  const indexPath = path.join(repoRoot, 'ecosystem', 'psycha', pkg, 'src', 'index.ts');

  const outDir = path.join(repoRoot, '.agent', 'refactor', 'exports');
  await fs.mkdir(outDir, { recursive: true });

  const currentTs = await fs.readFile(indexPath, 'utf8');
  let baselineTs = '';
  try {
    baselineTs = execSync(`git show ${baselineRef}:${path.relative(repoRoot, indexPath)}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    // Fallback to current if baseline not available
    baselineTs = currentTs;
  }

  const post = extractExports(currentTs);
  const baseline = extractExports(baselineTs);

  const postFile = path.join(outDir, `post-exports.${pkg}.json`);
  const baseFile = path.join(outDir, `baseline-exports.${pkg}.json`);
  await fs.writeFile(postFile, JSON.stringify(post, null, 2));
  await fs.writeFile(baseFile, JSON.stringify(baseline, null, 2));

  const bSet = new Set(baseline);
  const pSet = new Set(post);
  const added = post.filter((x) => !bSet.has(x));
  const removed = baseline.filter((x) => !pSet.has(x));
  const diff = { added, removed };
  const diffFile = path.join(outDir, `exports-diff.${pkg}.json`);
  await fs.writeFile(diffFile, JSON.stringify(diff, null, 2));

  console.log(
    JSON.stringify({ pkg, baseline: baseFile, post: postFile, diff: diffFile, ...diff }, null, 2),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
