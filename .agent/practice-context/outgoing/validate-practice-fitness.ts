#!/usr/bin/env tsx

/**
 * Practice Core Fitness Check — Three-Dimension Validation
 *
 * Checks each trinity file against three soft ceilings declared in
 * its YAML frontmatter:
 *   - fitness_ceiling        — max total lines (structural sprawl)
 *   - fitness_ceiling_chars  — max total characters (content volume)
 *   - fitness_max_prose_line — max chars per prose line (readability)
 *
 * Run from the repo root: tsx scripts/validate-practice-fitness.ts
 * Or via package.json:     pnpm practice:fitness
 *
 * Origin: oak-mcp-ecosystem, 2026-03-19
 * See: three-dimension-fitness-functions.md for the rationale
 */

import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const PRACTICE_CORE_DIR = ".agent/practice-core";
const TRINITY_FILES = [
  "practice.md",
  "practice-lineage.md",
  "practice-bootstrap.md",
];

// --- Types ---

type LineKind =
  | "frontmatter"
  | "code-fence"
  | "code-block"
  | "table"
  | "prose";

interface ClassifiedLine {
  text: string;
  kind: LineKind;
  lineNumber: number;
}

interface FileResult {
  filename: string;
  totalLines: number;
  totalChars: number;
  maxProseLen: number;
  maxProseLineNum: number;
  proseViolationCount: number;
  proseViolations: ClassifiedLine[];
  ceilingLines: number | null;
  ceilingChars: number | null;
  maxProseLineWidth: number | null;
  linesOk: boolean;
  charsOk: boolean;
  proseOk: boolean;
  violations: string[];
}

// --- Helpers ---

async function readText(relPath: string): Promise<string> {
  return fs.readFile(path.join(repoRoot, relPath), "utf8");
}

function extractFrontmatter(content: string): string | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? null;
}

function getFrontmatterNumber(
  frontmatter: string | null,
  key: string,
): number | null {
  if (!frontmatter) return null;
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`^${escapedKey}:\\s*(.+)$`, "m");
  const match = frontmatter.match(regex);
  if (!match) return null;
  const num = Number(match[1].trim());
  return Number.isNaN(num) ? null : num;
}

/**
 * Classify each line as prose, code-block, table, or frontmatter.
 * Prose lines are the only ones checked against the width ceiling.
 */
function classifyLines(content: string): ClassifiedLine[] {
  const lines = content.split("\n");
  let inCodeBlock = false;
  let inFrontmatter = false;
  let fmCount = 0;

  return lines.map((text, i) => {
    // YAML frontmatter (between first and second --- lines)
    if (/^---\s*$/.test(text) && fmCount < 2) {
      fmCount++;
      inFrontmatter = fmCount === 1;
      if (fmCount === 2) inFrontmatter = false;
      return { text, kind: "frontmatter" as const, lineNumber: i + 1 };
    }
    if (inFrontmatter) {
      return { text, kind: "frontmatter" as const, lineNumber: i + 1 };
    }
    if (/^(`{3,}|~{3,})/.test(text)) {
      inCodeBlock = !inCodeBlock;
      return { text, kind: "code-fence" as const, lineNumber: i + 1 };
    }
    if (inCodeBlock) {
      return { text, kind: "code-block" as const, lineNumber: i + 1 };
    }
    if (/^\|/.test(text.trim())) {
      return { text, kind: "table" as const, lineNumber: i + 1 };
    }
    return { text, kind: "prose" as const, lineNumber: i + 1 };
  });
}

// --- Check a single file ---

async function checkFile(filename: string): Promise<FileResult> {
  const relPath = path.join(PRACTICE_CORE_DIR, filename);
  const content = await readText(relPath);
  const frontmatter = extractFrontmatter(content);

  const ceilingLines = getFrontmatterNumber(frontmatter, "fitness_ceiling");
  const ceilingChars = getFrontmatterNumber(
    frontmatter,
    "fitness_ceiling_chars",
  );
  const maxProseLineWidth = getFrontmatterNumber(
    frontmatter,
    "fitness_max_prose_line",
  );

  const classified = classifyLines(content);
  const totalLines = classified.length;
  const totalChars = content.length;

  // Find longest prose line and all violations
  const proseViolations: ClassifiedLine[] = [];
  let maxProseLen = 0;
  let maxProseLineNum = 0;

  for (const line of classified) {
    if (line.kind !== "prose") continue;
    const len = line.text.length;
    if (len > maxProseLen) {
      maxProseLen = len;
      maxProseLineNum = line.lineNumber;
    }
    if (maxProseLineWidth && len > maxProseLineWidth) {
      proseViolations.push(line);
    }
  }

  const violations: string[] = [];

  const linesOk = ceilingLines == null || totalLines <= ceilingLines;
  if (!linesOk) {
    violations.push(`Lines: ${totalLines} exceeds ceiling ${ceilingLines}`);
  }

  const charsOk = ceilingChars == null || totalChars <= ceilingChars;
  if (!charsOk) {
    violations.push(
      `Characters: ${totalChars} exceeds ceiling ${ceilingChars}`,
    );
  }

  const proseOk =
    maxProseLineWidth == null || maxProseLen <= maxProseLineWidth;
  if (!proseOk) {
    violations.push(
      `Prose line width: ${proseViolations.length} line(s) exceed ` +
        `${maxProseLineWidth} chars (longest: ${maxProseLen} at ` +
        `line ${maxProseLineNum})`,
    );
  }

  return {
    filename,
    totalLines,
    totalChars,
    maxProseLen,
    maxProseLineNum,
    proseViolationCount: proseViolations.length,
    proseViolations: proseViolations.slice(0, 5),
    ceilingLines,
    ceilingChars,
    maxProseLineWidth,
    linesOk,
    charsOk,
    proseOk,
    violations,
  };
}

// --- Format output ---

function indicator(ok: boolean): string {
  return ok ? "\x1b[32m\u2713\x1b[0m" : "\x1b[31m\u2717\x1b[0m";
}

function formatResult(r: FileResult): string {
  const lines: string[] = [];
  lines.push(`  ${r.filename}`);

  if (r.ceilingLines != null) {
    lines.push(
      `    Lines:            ${String(r.totalLines).padStart(6)} / ` +
        `${r.ceilingLines}  ${indicator(r.linesOk)}`,
    );
  } else {
    lines.push(
      `    Lines:            ${String(r.totalLines).padStart(6)}  (no ceiling)`,
    );
  }

  if (r.ceilingChars != null) {
    lines.push(
      `    Characters:       ${String(r.totalChars).padStart(6)} / ` +
        `${r.ceilingChars}  ${indicator(r.charsOk)}`,
    );
  } else {
    lines.push(
      `    Characters:       ${String(r.totalChars).padStart(6)}  (no ceiling)`,
    );
  }

  if (r.maxProseLineWidth != null) {
    const detail = r.proseOk
      ? ""
      : ` (${r.proseViolationCount} violations, longest at ` +
        `line ${r.maxProseLineNum})`;
    lines.push(
      `    Max prose line:   ${String(r.maxProseLen).padStart(6)} / ` +
        `${r.maxProseLineWidth}  ${indicator(r.proseOk)}${detail}`,
    );
  } else {
    lines.push(
      `    Max prose line:   ${String(r.maxProseLen).padStart(6)}  (no ceiling)`,
    );
  }

  if (!r.proseOk && r.proseViolations.length > 0) {
    lines.push("    Prose violations:");
    for (const v of r.proseViolations) {
      lines.push(
        `      line ${String(v.lineNumber).padStart(3)}: ${v.text.length} chars`,
      );
    }
    if (r.proseViolationCount > 5) {
      lines.push(`      ... and ${r.proseViolationCount - 5} more`);
    }
  }

  return lines.join("\n");
}

// --- Main ---

async function main(): Promise<void> {
  console.log("\nPractice Core Fitness Check");
  console.log("\u2550".repeat(38) + "\n");

  const results = await Promise.all(TRINITY_FILES.map(checkFile));
  const totalViolations = results.reduce(
    (sum, r) => sum + r.violations.length,
    0,
  );

  for (const r of results) {
    console.log(formatResult(r));
    console.log();
  }

  if (totalViolations === 0) {
    console.log("\x1b[32mResult: PASS\x1b[0m\n");
    process.exit(0);
  } else {
    console.log(
      `\x1b[31mResult: FAIL (${totalViolations} ` +
        `violation${totalViolations === 1 ? "" : "s"})\x1b[0m\n`,
    );
    for (const r of results) {
      for (const v of r.violations) {
        console.log(`  \x1b[31m\u2022\x1b[0m ${r.filename}: ${v}`);
      }
    }
    console.log();
    process.exit(1);
  }
}

main();
