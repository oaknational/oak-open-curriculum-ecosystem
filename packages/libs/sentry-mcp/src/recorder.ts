import type { McpObservationRecorder, MergedMcpObservation } from './types.js';

interface InMemoryMcpObservationRecorder extends McpObservationRecorder {
  readonly observations: readonly MergedMcpObservation[];
}

export function createInMemoryMcpObservationRecorder(): InMemoryMcpObservationRecorder {
  const observations: MergedMcpObservation[] = [];

  return {
    observations,
    record(observation): void {
      observations.push(observation);
    },
  };
}
