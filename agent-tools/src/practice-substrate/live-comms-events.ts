import { readFile } from 'node:fs/promises';

import {
  parseDirectedCommsMessage,
  parseLifecycleCommsEvent,
  parseNarrativeCommsEvent,
} from '../collaboration-state/state-parsers.js';
import {
  type DirectedCommsMessage,
  type LifecycleCommsEvent,
  type NarrativeCommsEvent,
} from '../collaboration-state/types.js';
import {
  CANONICAL_EVENTS_ROOT,
  CANONICAL_LIFECYCLE_ROOT,
  CANONICAL_MESSAGES_ROOT,
  absolutePath,
  parseFailureFinding,
} from './live-types.js';
import { listJsonFiles } from './live-json-support.js';
import { type SubstrateFinding } from './types.js';

export interface CommsEventFiles {
  readonly narrative: readonly NarrativeCommsEvent[];
  readonly lifecycle: readonly LifecycleCommsEvent[];
  readonly directed: readonly DirectedCommsMessage[];
  readonly findings: readonly SubstrateFinding[];
}

/**
 * Read all immutable communication events from the three canonical directories
 * (narrative `comms-events/`, lifecycle `comms-lifecycle/`, directed
 * `comms-messages/`), parsing each file against the appropriate kind-specific
 * parser. Parse failures become substrate findings rather than throwing, so a
 * single malformed event does not block evaluation of the rest.
 */
export async function readCommsEventFiles(repoRoot: string): Promise<CommsEventFiles> {
  const narrative: NarrativeCommsEvent[] = [];
  const lifecycle: LifecycleCommsEvent[] = [];
  const directed: DirectedCommsMessage[] = [];
  const findings: SubstrateFinding[] = [];

  await readKindDirectory({
    repoRoot,
    root: CANONICAL_EVENTS_ROOT,
    surface: 'collaboration-comms-events',
    parse: parseNarrativeCommsEvent,
    accumulator: narrative,
    findings,
  });
  await readKindDirectory({
    repoRoot,
    root: CANONICAL_LIFECYCLE_ROOT,
    surface: 'collaboration-comms-lifecycle',
    parse: parseLifecycleCommsEvent,
    accumulator: lifecycle,
    findings,
  });
  await readKindDirectory({
    repoRoot,
    root: CANONICAL_MESSAGES_ROOT,
    surface: 'collaboration-comms-messages',
    parse: parseDirectedCommsMessage,
    accumulator: directed,
    findings,
  });

  return { narrative, lifecycle, directed, findings };
}

async function readKindDirectory<TEvent>(input: {
  readonly repoRoot: string;
  readonly root: string;
  readonly surface: string;
  readonly parse: (text: string) => TEvent;
  readonly accumulator: TEvent[];
  readonly findings: SubstrateFinding[];
}): Promise<void> {
  for (const path of await listJsonFiles(input.repoRoot, input.root)) {
    try {
      input.accumulator.push(
        input.parse(await readFile(absolutePath(input.repoRoot, path), 'utf8')),
      );
    } catch (error) {
      input.findings.push(parseFailureFinding(input.surface, path, error));
    }
  }
}
