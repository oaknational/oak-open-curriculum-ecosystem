/**
 * Statusline emission composition: payload logging, misconfiguration
 * warning, planning, and rendering in their contract order.
 *
 * @remarks
 * Extracted from the bin so the composition contracts are testable through
 * injected deps (ADR-078): the raw payload is logged BEFORE planning
 * (malformed and noop payloads are exactly the invocations a diagnosis
 * needs), and the invalid-config warning precedes EVERY outcome — noop,
 * render, and render-throw alike. The bin composes the real deps and
 * writes the returned string.
 *
 * @packageDocumentation
 */

import { BOLD, RED, RESET } from './statusline-ansi.js';
import { invalidConfigWarningLine, resolveDebugLogConfig } from './statusline-debug-log.js';
import { planStatuslineExecution, type StatuslinePlan } from './statusline-identity-input.js';

/** The render-plan inputs the injected renderer receives. */
export type RenderInputs = Extract<StatuslinePlan, { kind: 'render' }>['inputs'];

/**
 * The injected composition surface, faked in tests and composed with the
 * real environment, clock, log appender, and renderer by the bin.
 */
export interface EmitDeps {
  readonly env: Readonly<Record<string, string | undefined>>;
  readonly nowIso: () => string;
  readonly appendEntry: (path: string, payload: string, nowIso: string) => void;
  readonly render: (inputs: RenderInputs) => string;
}

/**
 * Compose the full statusline output for one stdin payload.
 *
 * @param rawJson - The stdin payload exactly as received, pre-parse.
 * @param deps - The injected composition surface.
 * @returns Everything the adapter writes for this invocation: the
 * misconfiguration warning (when the log destination is set but invalid),
 * then the rendered statusline or — on a renderer fault — a loud fault
 * token; empty only for a clean noop.
 */
export function emitStatusline(rawJson: string, deps: EmitDeps): string {
  const debugLog = resolveDebugLogConfig(deps.env);
  if (debugLog.kind === 'enabled') {
    deps.appendEntry(debugLog.path, rawJson, deps.nowIso());
  }
  const warningPrefix = invalidConfigWarningLine(debugLog, {
    red: RED,
    bold: BOLD,
    reset: RESET,
  });
  const plan = planStatuslineExecution(rawJson);
  if (plan.kind === 'noop') {
    return warningPrefix;
  }
  try {
    return warningPrefix + deps.render(plan.inputs);
  } catch (cause) {
    // Fail loud, never blank: the fault token joins the warning rather than
    // replacing it, so a misconfiguration stays visible through a renderer
    // fault.
    return `${warningPrefix}${RED}${BOLD}⚠ statusline: ${String(cause)}${RESET}`;
  }
}
