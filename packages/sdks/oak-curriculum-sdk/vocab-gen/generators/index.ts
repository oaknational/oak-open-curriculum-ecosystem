/**
 * Graph generators for the vocabulary mining pipeline.
 *
 * @remarks
 * Generators transform extracted vocabulary data into static graph
 * structures suitable for MCP tool consumption.
 *
 * @module vocab-gen/generators
 */

export {
  generatePrerequisiteGraphData,
  type PrerequisiteEdge,
  type PrerequisiteGraph,
  type PrerequisiteGraphStats,
  type PrerequisiteNode,
} from './prerequisite-graph-generator.js';

export {
  generateThreadProgressionData,
  type ThreadNode,
  type ThreadProgressionGraph,
  type ThreadProgressionStats,
} from './thread-progression-generator.js';

export {
  serializePrerequisiteGraph,
  serializeThreadProgressionGraph,
  writePrerequisiteGraphFile,
  writeThreadProgressionFile,
} from './write-graph-file.js';
