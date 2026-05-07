import { finding } from './finding.js';
import {
  type GeneratedReadModelSnapshot,
  type ParseStateSnapshot,
  type SubstrateFinding,
  type TextSurfaceSnapshot,
} from './types.js';

/**
 * Compare an injected rendered read model with its injected regenerated text.
 */
export function evaluateGeneratedReadModelDrift(
  snapshot: GeneratedReadModelSnapshot,
): readonly SubstrateFinding[] {
  if (snapshot.committedText === snapshot.regeneratedText) {
    return [];
  }

  return [
    finding({
      id: 'generated-read-model-drift',
      surface: snapshot.surface,
      severity: 'blocking',
      repair: 'deterministic',
      message: `Generated read model ${snapshot.outputPath} is stale.`,
      evidence: [snapshot.outputPath],
    }),
  ];
}

/**
 * Classify injected JSON parse and schema validation outcomes.
 */
export function evaluateParseState(snapshot: ParseStateSnapshot): readonly SubstrateFinding[] {
  if (snapshot.json === 'invalid') {
    return [
      finding({
        id: 'invalid-json',
        surface: snapshot.surface,
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message: `JSON surface ${snapshot.path} does not parse.`,
        evidence: [snapshot.path],
      }),
    ];
  }
  if (snapshot.schema === 'invalid') {
    return [
      finding({
        id: 'schema-incoherence',
        surface: snapshot.surface,
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message: `JSON surface ${snapshot.path} does not satisfy its schema.`,
        evidence: [snapshot.path],
      }),
    ];
  }

  return [];
}

/**
 * Detect unresolved conflict markers in injected state or memory text.
 */
export function evaluateConflictMarkers(
  snapshot: TextSurfaceSnapshot,
): readonly SubstrateFinding[] {
  if (!hasConflictMarker(snapshot.text)) {
    return [];
  }

  return [
    finding({
      id: 'conflict-marker',
      surface: snapshot.surface,
      severity: 'blocking',
      repair: 'manual-with-provenance',
      message: `Surface ${snapshot.path} contains unresolved conflict markers.`,
      evidence: [snapshot.path],
    }),
  ];
}

function hasConflictMarker(text: string): boolean {
  return text
    .split('\n')
    .some(
      (line) => line.startsWith('<<<<<<< ') || line === '=======' || line.startsWith('>>>>>>> '),
    );
}
