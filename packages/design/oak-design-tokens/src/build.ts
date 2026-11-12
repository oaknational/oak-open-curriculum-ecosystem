/**
 * Token build script for `@oaknational/oak-design-tokens`.
 *
 * @remarks
 * Generates `dist/index.css` from DTCG JSON token sources via the
 * `design-tokens-core` helpers, then runs WCAG contrast validation
 * against the declared pairings manifest. Violations fail the build.
 * Errors propagate naturally — Node surfaces the stack trace, and
 * Turbo reports the non-zero exit.
 *
 * When invoked with `--dev`, contrast violations in the
 * hand-authored trees are reported as warnings instead of errors — CSS
 * is still generated so the widget dev server can render the current
 * state. Violations must be resolved before committing (the CI build
 * does not set this flag).
 *
 * The design-system dtcg gate (dual-gate window, ADR-213 §2 amendment
 * 2026-07-20) has NO dev-mode bypass: a red there means the imported
 * design-system export is inconsistent with its own manifest — not a
 * state local token iteration produces or can cure by iterating.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildContrastReports, buildOakDesignTokensCss } from './build-css.js';
import {
  buildDesignSystemContrastReports,
  formatDesignSystemGateError,
} from './design-system-contrast.js';

const outputDirectory = resolve(import.meta.dirname, '../dist');
const cssOutputPath = resolve(outputDirectory, 'index.css');
const contrastReportPath = resolve(outputDirectory, 'contrast-report.json');
const isDevMode = process.argv.includes('--dev');

mkdirSync(outputDirectory, { recursive: true });
writeFileSync(cssOutputPath, buildOakDesignTokensCss());

const contrastResult = buildContrastReports();

if (!contrastResult.ok) {
  const { foreground, background } = contrastResult.error;

  throw new Error(
    `Contrast manifest error: unresolved token — foreground="${foreground}" background="${background}"`,
  );
}

const contrastReports = contrastResult.value;

writeFileSync(contrastReportPath, JSON.stringify(contrastReports, null, 2));

function listFailedEntries(reports: typeof contrastReports): readonly string[] {
  return reports.flatMap((report) =>
    report.results
      .filter((entry) => !entry.pass)
      .map(
        (entry) =>
          `  [${report.theme}] ${entry.foreground} on ${entry.background}: ${String(entry.ratio)}:1 (need ${String(entry.requiredRatio)}:1)`,
      ),
  );
}

const totalFailures = contrastReports.reduce((sum, report) => sum + report.summary.failed, 0);

if (totalFailures > 0) {
  const message = `Contrast validation: ${String(totalFailures)} violation(s):\n${listFailedEntries(contrastReports).join('\n')}`;

  if (isDevMode) {
    process.stderr.write(`⚠ ${message}\nCSS generated despite violations (--dev).\n`);
  } else {
    throw new Error(message);
  }
}

// Second gate instance of the dual-gate window: the design system's dtcg
// export against its own manifest. Separate report artefact, no dev-mode
// bypass (see the header remark).
const designSystemReportPath = resolve(outputDirectory, 'design-system-contrast-report.json');
const designSystemResult = buildDesignSystemContrastReports();

if (!designSystemResult.ok) {
  throw new Error(formatDesignSystemGateError(designSystemResult.error));
}

writeFileSync(designSystemReportPath, JSON.stringify(designSystemResult.value, null, 2));

const designSystemFailures = designSystemResult.value.reduce(
  (sum, report) => sum + report.summary.failed,
  0,
);

if (designSystemFailures > 0) {
  throw new Error(
    `Design-system dtcg gate: ${String(designSystemFailures)} contrast violation(s):\n${listFailedEntries(designSystemResult.value).join('\n')}`,
  );
}
