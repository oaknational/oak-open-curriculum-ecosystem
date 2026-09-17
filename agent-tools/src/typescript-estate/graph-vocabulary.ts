export const GRAPH_NODE_KINDS = [
  'file',
  'package',
  'workspace',
  'command',
  'artefact',
  'registration',
  'external-contract',
] as const;

export type GraphNodeKind = (typeof GRAPH_NODE_KINDS)[number];

export const GRAPH_EDGE_KINDS = [
  'import',
  're-export',
  'export-map',
  'generation',
  'script',
  'filesystem-read',
  'filesystem-write',
  'build',
  'runtime-registration',
] as const;

export type GraphEdgeKind = (typeof GRAPH_EDGE_KINDS)[number];

export const GRAPH_PRODUCERS_BY_KIND = {
  import: [
    'import:es-import',
    'import:import-equals',
    'import:dynamic-import',
    'import:commonjs-require',
  ],
  're-export': ['re-export:export-declaration'],
  'export-map': ['export-map:package-exports'],
  generation: ['generation:generated-output-rule', 'generation:generator-script'],
  script: ['script:package-script'],
  'filesystem-read': [
    'filesystem-read:readFile',
    'filesystem-read:readFileSync',
    'filesystem-read:createReadStream',
    'filesystem-read:open',
  ],
  'filesystem-write': [
    'filesystem-write:writeFile',
    'filesystem-write:writeFileSync',
    'filesystem-write:appendFile',
    'filesystem-write:appendFileSync',
    'filesystem-write:createWriteStream',
    'filesystem-write:rename',
  ],
  build: [
    'build:emitting-project-membership',
    'build:project-reference',
    'build:bundler-input',
    'build:package-build-script',
  ],
  'runtime-registration': [
    'runtime-registration:registerTool',
    'runtime-registration:registerResource',
    'runtime-registration:registerAppResource',
    'runtime-registration:setRequestHandler',
    'runtime-registration:use',
    'runtime-registration:command',
  ],
} as const satisfies Readonly<Record<GraphEdgeKind, readonly string[]>>;

export type GraphProducerFor<K extends GraphEdgeKind> = (typeof GRAPH_PRODUCERS_BY_KIND)[K][number];

export type GraphProducer = GraphProducerFor<GraphEdgeKind>;

export const ARCHETYPE_IDS = [
  'openapi-curriculum-sdk-mcp',
  'bulk-vocabulary-search-consumer',
  'agent-tools-dist-cli-hook',
  'tsx-bundle-served-ui',
] as const;

export type ArchetypeId = (typeof ARCHETYPE_IDS)[number];
