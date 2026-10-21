/**
 * The pinned host catalogue: which hosts a usable compat capture must name,
 * and the judgement of whether a given capture was evaluated against it.
 *
 * Its own module so `agent-tools` holds ONE copy of the pin: the schema test
 * imports it rather than restating it. The app's per-commit gate keeps its own
 * copy DELIBERATELY — `agent-tools` publishes no entry point and the app does
 * not depend on it, and duplication was chosen over opening that boundary
 * (ADR-230, §Alternatives rejected). If the two lists ever disagree, both
 * suites fail loudly. `compat-types.ts` owns the report's SHAPE; this owns
 * which catalogue the report describes.
 *
 * The two judgements live together because they are one question asked twice:
 * the report can name the wrong catalogue (`catalogSource`), or name the right
 * one while carrying a different host set (the SDK pin moved under us). Both
 * mean the verdicts inside were not produced against the catalogue this
 * repository pinned.
 */
import { type CompatReport } from './compat-types.js';

/**
 * The EXACT host ids the catalogue bundled with the pinned SDK carries, read
 * from the retained 2026-08-15 capture. Pinned by NAME, not by count: a report
 * that drops `claude` and adds a stranger still counts sixteen unique hosts.
 * The set belongs to the SDK pin — update it deliberately when the pin moves,
 * and read the change rather than absorbing it.
 */
export const PINNED_CATALOGUE_HOST_IDS = [
  'agentcore',
  'chatgpt',
  'claude',
  'claude-code',
  'cline',
  'codex',
  'copilot',
  'cursor',
  'goose',
  'mcpjam',
  'mistral',
  'n8n',
  'notion',
  'perplexity',
  'slack',
  'vscode',
] as const;

const PINNED_HOST_IDS: ReadonlySet<string> = new Set(PINNED_CATALOGUE_HOST_IDS);

/**
 * Names how a capture's catalogue departs from the pinned one, or `undefined`
 * when it matches. A description rather than a boolean: the caller reports the
 * departure to an operator, and "which hosts moved" is the whole diagnostic.
 */
export function describeCatalogueDrift(report: CompatReport): string | undefined {
  if (report.catalogSource !== 'bundled') {
    return `mcpjam evaluated against the ${JSON.stringify(report.catalogSource)} catalogue, not the pinned bundled one — --offline was requested but not honoured, so these verdicts can drift with upstream publishes; do not use this capture`;
  }
  // The vendor stamps a bundled catalogue as version 0 by construction
  // (`@mcpjam/cli@3.19.0` dist: `catalogVersion: liveCatalog && catalogResult?.ok
  // ? catalogResult.version : 0`). A report calling itself bundled with any
  // other version contradicts itself, so it is not pinned evidence (review,
  // 2026-09-11).
  if (report.catalogVersion !== 0) {
    return `mcpjam reported a bundled catalogue with catalogVersion ${String(report.catalogVersion)}, but the vendor stamps every bundled catalogue as version 0 — the capture contradicts itself; do not use it`;
  }
  const reported = report.hosts.map((host) => host.hostId);
  const drifted = [
    ...reported.filter((id) => !PINNED_HOST_IDS.has(id)).map((id) => `unexpected ${id}`),
    ...PINNED_CATALOGUE_HOST_IDS.filter((id) => !reported.includes(id)).map(
      (id) => `missing ${id}`,
    ),
  ];
  return drifted.length === 0
    ? undefined
    : `mcpjam reported a host set that is not the pinned catalogue's (${drifted.join('; ')}) — the SDK pin may have moved, or this capture is of a different catalogue; read the change rather than absorbing it`;
}
