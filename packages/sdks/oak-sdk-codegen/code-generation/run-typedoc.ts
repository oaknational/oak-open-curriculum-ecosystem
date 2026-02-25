import { spawn } from 'node:child_process';

// Allowed warning symbol fragments we plan to address long-term.
// See: .agent/plans/generated-document-enhancements-plan.md
const ALLOWLIST = [
  'ToolName',
  'AssetTypes',
  'KeyStages',
  'Lessons',
  'ValidPath',
  'Sequences',
  'Subjects',
  'ThreadSlugs',
  'Units',
  'AllowedMethods',
  'RawPaths',
  'PathParameters',
  'ValidPathGroupings',
  'ValidRequestParams',
  'TypeValue',
  'KeyStageValue',
  'SubjectValue',
  'YearValue',
];

function isAllowedWarning(line: string): boolean {
  if (!line.includes('[warning]')) {
    return false;
  }
  // Only treat TypeDoc "referenced but not included" warnings as candidates
  if (!line.includes('is referenced by') || !line.includes('not included in the documentation')) {
    return false;
  }
  return ALLOWLIST.some((sym) => line.includes(sym));
}

function processLine(line: string): string | null {
  if (line.trim().length === 0) {
    return null;
  }
  if (isAllowedWarning(line)) {
    return (
      line.replace('[warning]', '[allowed-warning]') +
      ' — see .agent/plans/generated-document-enhancements-plan.md'
    );
  }
  return line;
}

async function run(): Promise<number> {
  const args = process.argv.slice(2);
  const child = spawn('typedoc', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  child.stdout.on('data', (chunk: string) => {
    for (const raw of chunk.split(/\r?\n/)) {
      const line = processLine(raw);
      if (line) {
        console.log(line);
      }
    }
  });

  child.stderr.on('data', (chunk: string) => {
    for (const raw of chunk.split(/\r?\n/)) {
      const line = processLine(raw);
      if (line) {
        console.error(line);
      }
    }
  });

  return await new Promise<number>((resolve) => {
    child.on('close', (code: number | null) => {
      resolve(code ?? 0);
    });
    child.on('error', () => {
      resolve(1);
    });
  });
}

await run().then((code: number) => {
  process.exitCode = code;
});
