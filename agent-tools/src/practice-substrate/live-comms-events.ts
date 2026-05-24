import { readFile } from 'node:fs/promises';

import { parseCommsEvent } from '../collaboration-state/state-parsers.js';
import {
  type CommsEvent,
  type DirectedCommsMessage,
  type LifecycleCommsEvent,
  type NarrativeCommsEvent,
} from '../collaboration-state/types.js';
import { CANONICAL_COMMS_ROOT, absolutePath, parseFailureFinding } from './live-types.js';
import { listJsonFiles } from './live-json-support.js';
import { type SubstrateFinding } from './types.js';

export interface CommsEventFiles {
  readonly narrative: readonly NarrativeCommsEvent[];
  readonly lifecycle: readonly LifecycleCommsEvent[];
  readonly directed: readonly DirectedCommsMessage[];
  readonly findings: readonly SubstrateFinding[];
}

/**
 * Read all immutable communication events from the canonical comms directory,
 * parsing each file against the top-level kind-discriminated
 * parser. Parse failures become substrate findings rather than throwing, so a
 * single malformed event does not block evaluation of the rest.
 */
export async function readCommsEventFiles(repoRoot: string): Promise<CommsEventFiles> {
  const events: CommsEvent[] = [];
  const findings: SubstrateFinding[] = [];

  await readUnifiedDirectory({
    repoRoot,
    root: CANONICAL_COMMS_ROOT,
    surface: 'collaboration-comms',
    accumulator: events,
    findings,
  });

  return {
    narrative: filterEvents(events, 'narrative'),
    lifecycle: filterEvents(events, 'lifecycle'),
    directed: filterEvents(events, 'directed'),
    findings,
  };
}

async function readUnifiedDirectory(input: {
  readonly repoRoot: string;
  readonly root: string;
  readonly surface: string;
  readonly accumulator: CommsEvent[];
  readonly findings: SubstrateFinding[];
}): Promise<void> {
  for (const path of await listJsonFiles(input.repoRoot, input.root)) {
    try {
      input.accumulator.push(
        parseCommsEvent(await readFile(absolutePath(input.repoRoot, path), 'utf8')),
      );
    } catch (error) {
      input.findings.push(parseFailureFinding(input.surface, path, error));
    }
  }
}

function filterEvents<TKind extends CommsEvent['kind']>(
  events: readonly CommsEvent[],
  kind: TKind,
): readonly Extract<CommsEvent, { readonly kind: TKind }>[] {
  return events.filter((event): event is Extract<CommsEvent, { readonly kind: TKind }> => {
    return event.kind === kind;
  });
}
