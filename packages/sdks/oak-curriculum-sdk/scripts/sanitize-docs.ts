import { promises as fs } from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve(process.cwd(), 'src');
const OUT_DIR = path.resolve(process.cwd(), 'docs/_typedoc_src');

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

function sanitizeJsDoc(content: string, filePath: string): string {
  // Only sanitize generated api-schema files; leave other sources intact
  const isGenerated = filePath.includes(
    `${path.sep}types${path.sep}generated${path.sep}api-schema${path.sep}`,
  );
  if (!isGenerated) return content;

  // Replace JSDoc blocks like `/** @description Something */` with `/** Something */`
  let out = content.replace(/\/\*\*\s*@description\s+/g, '/** ');
  // Replace line tags like `* @description Foo` with `* Foo`
  out = out.replace(/^(\s*\*)\s*@description\s+/gm, '$1 ');
  return out;
}

async function copyAndSanitize(): Promise<void> {
  await ensureDir(OUT_DIR);
  for await (const file of walk(SRC_DIR)) {
    const rel = path.relative(SRC_DIR, file);
    const outFile = path.join(OUT_DIR, rel);
    await ensureDir(path.dirname(outFile));
    const buf = await fs.readFile(file, 'utf8');
    const sanitized = sanitizeJsDoc(buf, file);
    await fs.writeFile(outFile, sanitized, 'utf8');
  }
}

copyAndSanitize().catch((err: unknown) => {
  console.error('[sanitize-docs] Failed:', err);
  process.exit(1);
});
