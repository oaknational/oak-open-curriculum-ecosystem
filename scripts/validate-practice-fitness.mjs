#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const PRACTICE_CORE_DIR = '.agent/practice-core';
const TRINITY_FILES = ['practice.md', 'practice-lineage.md', 'practice-bootstrap.md'];

// --- Helpers ---

async function readText(relPath) {
  return fs.readFile(path.join(repoRoot, relPath), 'utf8');
}

function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? null;
}

function getFrontmatterNumber(frontmatter, key) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escapedKey}:\\s*(.+)$`, 'm');
  const match = frontmatter?.match(regex);
  if (!match) return null;
  const num = Number(match[1].trim());
  return Number.isNaN(num) ? null : num;
}

/**
 * Classify each line as prose, code-block, or table.
 * Returns an array of { text, kind, lineNumber } objects.
 */
function classifyLines(content) {
  const lines = content.split('\n');
  let inCodeBlock = false;
  let inFrontmatter = false;
  let fmCount = 0;
  return lines.map((text, i) => {
    // YAML frontmatter (between first and second --- lines)
    if (/^---\s*$/.test(text) && fmCount < 2) {
      fmCount++;
      inFrontmatter = fmCount === 1;
      if (fmCount === 2) inFrontmatter = false;
      return { text, kind: 'frontmatter', lineNumber: i + 1 };
    }
    if (inFrontmatter) {
      return { text, kind: 'frontmatter', lineNumber: i + 1 };
    }
    if (/^(`{3,}|~{3,})/.test(text)) {
      inCodeBlock = !inCodeBlock;
      return { text, kind: 'code-fence', lineNumber: i + 1 };
    }
    if (inCodeBlock) {
      return { text, kind: 'code-block', lineNumber: i + 1 };
    }
    if (/^\|/.test(text.trim())) {
      return { text, kind: 'table', lineNumber: i + 1 };
    }
    return { text, kind: 'prose', lineNumber: i + 1 };
  });
}

// --- Check a single file ---

async function checkFile(filename) {
  const relPath = path.join(PRACTICE_CORE_DIR, filename);
  const content = await readText(relPath);
  const frontmatter = extractFrontmatter(content);

  // fitness_ceiling is the existing line-count field (backward compatible)
  const ceilingLines = getFrontmatterNumber(frontmatter, 'fitness_ceiling');
  const ceilingChars = getFrontmatterNumber(frontmatter, 'fitness_ceiling_chars');
  const maxProseLineWidth = getFrontmatterNumber(frontmatter, 'fitness_max_prose_line');

  const classified = classifyLines(content);
  const totalLines = classified.length;
  const totalChars = content.length;

  // Find longest prose line and all violations
  const proseViolations = [];
  let maxProseLen = 0;
  let maxProseLineNum = 0;
  for (const line of classified) {
    if (line.kind !== 'prose') continue;
    const len = line.text.length;
    if (len > maxProseLen) {
      maxProseLen = len;
      maxProseLineNum = line.lineNumber;
    }
    if (maxProseLineWidth && len > maxProseLineWidth) {
      proseViolations.push(line);
    }
  }

  const violations = [];

  // Line count check
  const linesOk = ceilingLines == null || totalLines <= ceilingLines;
  if (!linesOk) {
    violations.push(`Lines: ${totalLines} exceeds ceiling ${ceilingLines}`);
  }

  // Character count check
  const charsOk = ceilingChars == null || totalChars <= ceilingChars;
  if (!charsOk) {
    violations.push(`Characters: ${totalChars} exceeds ceiling ${ceilingChars}`);
  }

  // Prose line width check
  const proseOk = maxProseLineWidth == null || maxProseLen <= maxProseLineWidth;
  if (!proseOk) {
    violations.push(
      `Prose line width: ${proseViolations.length} line(s) exceed ${maxProseLineWidth} chars (longest: ${maxProseLen} at line ${maxProseLineNum})`,
    );
  }

  return {
    filename,
    totalLines,
    totalChars,
    maxProseLen,
    maxProseLineNum,
    proseViolationCount: proseViolations.length,
    proseViolations: proseViolations.slice(0, 5), // show first 5
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

function indicator(ok) {
  return ok ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
}

function formatResult(r) {
  const lines = [];
  lines.push(`  ${r.filename}`);

  if (r.ceilingLines != null) {
    lines.push(
      `    Lines:            ${String(r.totalLines).padStart(6)} / ${r.ceilingLines}  ${indicator(r.linesOk)}`,
    );
  } else {
    lines.push(`    Lines:            ${String(r.totalLines).padStart(6)}  (no ceiling)`);
  }

  if (r.ceilingChars != null) {
    lines.push(
      `    Characters:       ${String(r.totalChars).padStart(6)} / ${r.ceilingChars}  ${indicator(r.charsOk)}`,
    );
  } else {
    lines.push(`    Characters:       ${String(r.totalChars).padStart(6)}  (no ceiling)`);
  }

  if (r.maxProseLineWidth != null) {
    const detail = r.proseOk
      ? ''
      : ` (${r.proseViolationCount} violations, longest at line ${r.maxProseLineNum})`;
    lines.push(
      `    Max prose line:   ${String(r.maxProseLen).padStart(6)} / ${r.maxProseLineWidth}  ${indicator(r.proseOk)}${detail}`,
    );
  } else {
    lines.push(`    Max prose line:   ${String(r.maxProseLen).padStart(6)}  (no ceiling)`);
  }

  if (!r.proseOk && r.proseViolations.length > 0) {
    lines.push('    Prose violations:');
    for (const v of r.proseViolations) {
      lines.push(`      line ${String(v.lineNumber).padStart(3)}: ${v.text.length} chars`);
    }
    if (r.proseViolationCount > 5) {
      lines.push(`      ... and ${r.proseViolationCount - 5} more`);
    }
  }

  return lines.join('\n');
}

// --- Main ---

async function main() {
  console.log('\nPractice Core Fitness Check');
  console.log('══════════════════════════════════════\n');

  const results = await Promise.all(TRINITY_FILES.map(checkFile));
  const totalViolations = results.reduce((sum, r) => sum + r.violations.length, 0);

  for (const r of results) {
    console.log(formatResult(r));
    console.log();
  }

  if (totalViolations === 0) {
    console.log('\x1b[32mResult: PASS\x1b[0m\n');
    process.exit(0);
  } else {
    console.log(
      `\x1b[31mResult: FAIL (${totalViolations} violation${totalViolations === 1 ? '' : 's'})\x1b[0m\n`,
    );
    for (const r of results) {
      for (const v of r.violations) {
        console.log(`  \x1b[31m•\x1b[0m ${r.filename}: ${v}`);
      }
    }
    console.log();
    process.exit(1);
  }
}

main();
