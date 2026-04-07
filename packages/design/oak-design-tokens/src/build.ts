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
 * When invoked with `OAK_TOKEN_DEV=1`, contrast violations are
 * reported as warnings instead of errors — CSS is still generated so
 * the widget dev server can render the current state. Violations must
 * be resolved before committing (the CI build does not set this flag).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildContrastReports, buildOakDesignTokensCss } from './build-css.js';

const outputDirectory = resolve(import.meta.dirname, '../dist');
const cssOutputPath = resolve(outputDirectory, 'index.css');
const contrastReportPath = resolve(outputDirectory, 'contrast-report.json');
const isDevMode = process.env['OAK_TOKEN_DEV'] === '1';

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

const totalFailures = contrastReports.reduce((sum, report) => sum + report.summary.failed, 0);

if (totalFailures > 0) {
  const failedEntries = contrastReports.flatMap((report) =>
    report.results
      .filter((entry) => !entry.pass)
      .map(
        (entry) =>
          `  [${report.theme}] ${entry.foreground} on ${entry.background}: ${String(entry.ratio)}:1 (need ${String(entry.requiredRatio)}:1)`,
      ),
  );

  const message = `Contrast validation: ${String(totalFailures)} violation(s):\n${failedEntries.join('\n')}`;

  if (isDevMode) {
    process.stderr.write(`⚠ ${message}\nCSS generated despite violations (OAK_TOKEN_DEV=1).\n`);
  } else {
    throw new Error(message);
  }
}
