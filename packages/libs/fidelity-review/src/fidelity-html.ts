/** Escape a data-carried string for safe embedding in HTML text or attributes. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/** Resolve a demo-dir-relative evidence path from the report directory.
 *  The `../../` is a positional contract: the report dir must sit exactly two
 *  levels below the demo root (demo-evidence/fidelity-report/) — moving the
 *  report dir means changing this resolver in the same commit. */
export function fromReportDir(demoRelativePath: string): string {
  return `../../${demoRelativePath}`;
}
