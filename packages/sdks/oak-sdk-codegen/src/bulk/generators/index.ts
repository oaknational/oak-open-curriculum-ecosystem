/**
 * Graph generators for the vocabulary mining pipeline.
 *
 * @remarks
 * Generators transform extracted vocabulary data into static graph
 * structures suitable for MCP tool consumption.

 */

export {
  generateAnalysisReport,
  serializeAnalysisReport,
  writeAnalysisReportFile,
  type AnalysisReport,
  type AnalysisSummary,
  type CrossSubjectTermEntry,
  type KeywordFrequencyEntry,
  type KeywordStats,
  type MisconceptionDensity,
  type NCCoverage,
  type SubjectRankEntry,
  type SynonymCandidate,
  type SynonymPatterns,
} from './analysis-report-generator.js';

export {
  generateMisconceptionGraphData,
  serializeMisconceptionGraph,
  writeMisconceptionGraphAsJson,
  type MisconceptionGraph,
  type MisconceptionGraphStats,
  type MisconceptionNode,
} from './misconception-graph-generator.js';

export {
  generateNCCoverageGraphData,
  serializeNCCoverageGraph,
  writeNCCoverageGraphAsJson,
  type NCCoverageGraph,
  type NCCoverageGraphStats,
  type NCStatementNode,
} from './nc-coverage-generator.js';

export {
  extractSynonymFromDefinition,
  generateMinedSynonyms,
  serializeMinedSynonyms,
  writeMinedSynonymsFile,
  type MinedSynonym,
  type MinedSynonymsData,
  type MinedSynonymsStats,
} from './synonym-miner.js';

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
  generateVocabularyGraphData,
  serializeVocabularyGraph,
  writeVocabularyGraphAsJson,
  type VocabularyGraph,
  type VocabularyGraphStats,
  type VocabularyNode,
} from './vocabulary-graph-generator.js';

export {
  serializePrerequisiteGraph,
  serializeThreadProgressionGraph,
  writePrerequisiteGraphFile,
  writeThreadProgressionFile,
} from './write-graph-file.js';

export { writePrerequisiteGraphAsJson } from './write-json-graph-file.js';

export {
  serializeDatasetToJson,
  writeJsonDataset,
  type JsonDatasetDescriptor,
} from './write-json-dataset.js';
