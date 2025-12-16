/**
 * SVG Component Functions for Knowledge Graph Rendering.
 * Pure functions that compose to build SVG using nested <g> groups.
 */

/** 2D position with x and y coordinates. */
export interface Position {
  readonly x: number;
  readonly y: number;
}

/** Configuration for a single node (lozenge-style concept node). */
export interface NodeConfig {
  readonly id: string;
  readonly label: string;
  readonly width: number;
  readonly height: number;
  readonly position: Position;
  readonly cssClass: string;
  /** Optional brief description shown as tooltip on hover. */
  readonly brief?: string;
}

/** Configuration for a section label. */
export interface SectionLabelConfig {
  readonly text: string;
  readonly position: Position;
}

/** Configuration for an edge connecting two points. */
export interface EdgeConfig {
  readonly from: Position;
  readonly to: Position;
  readonly relationship: string;
  readonly isDashed: boolean;
}

/** Configuration for a section containing label and nodes. */
export interface SectionConfig {
  readonly id: string;
  readonly label: string;
  readonly position: Position;
  readonly labelPosition: Position;
  readonly nodes: readonly NodeConfig[];
}

const CHAR_WIDTH = 10;
const PADDING_X = 5;
const LABEL_HEIGHT = 20;
const LABEL_BORDER_RADIUS = 4;
const LABEL_TEXT_Y = 15;

/** Creates an SVG node (lozenge with centered text and optional tooltip). */
export function createNode(config: NodeConfig): string {
  const { id, label, width, height, position, cssClass, brief } = config;
  const textX = width / 2;
  const textY = height / 2 + 5;
  const rx = height / 2;
  const x = String(position.x);
  const y = String(position.y);
  const title = brief !== undefined ? `<title>${label}: ${brief}</title>` : '';
  return `<g id="${id}" transform="translate(${x}, ${y})">${title}<rect class="${cssClass}" width="${String(width)}" height="${String(height)}" rx="${String(rx)}"/><text class="label" x="${String(textX)}" y="${String(textY)}">${label}</text></g>`;
}

/** Creates a section label with auto-sized background and centered text. */
export function createSectionLabel(config: SectionLabelConfig): string {
  const { text, position } = config;
  const width = PADDING_X + text.length * CHAR_WIDTH + PADDING_X;
  const x = String(position.x);
  const y = String(position.y);
  const textX = width / 2;
  return `<g transform="translate(${x}, ${y})"><rect class="group-label-bg" width="${String(width)}" height="${String(LABEL_HEIGHT)}" rx="${String(LABEL_BORDER_RADIUS)}"/><text class="group-label" x="${String(textX)}" y="${String(LABEL_TEXT_Y)}" style="text-anchor:middle">${text}</text></g>`;
}

/** Creates an edge between two points with relationship tooltip. */
export function createEdge(config: EdgeConfig): string {
  const { from, to, relationship, isDashed } = config;
  const outlineClass = isDashed ? 'edge-dashed-outline' : 'edge-outline';
  const lineClass = isDashed ? 'edge-dashed' : 'edge';
  const x1 = String(from.x);
  const y1 = String(from.y);
  const x2 = String(to.x);
  const y2 = String(to.y);
  return `<g><title>${relationship}</title><line class="${outlineClass}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><line class="${lineClass}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/></g>`;
}

/** Creates a section with label and nodes. */
export function createSection(config: SectionConfig): string {
  const { id, label, position, labelPosition, nodes } = config;
  const labelSvg = createSectionLabel({ text: label, position: labelPosition });
  const nodesSvg = nodes.map(createNode).join('');
  const x = String(position.x);
  const y = String(position.y);
  return `<g id="${id}" transform="translate(${x}, ${y})">${labelSvg}${nodesSvg}</g>`;
}

/** Calculates the absolute center position of a node. */
export function getNodeCenter(sectionPosition: Position, nodeConfig: NodeConfig): Position {
  return {
    x: sectionPosition.x + nodeConfig.position.x + nodeConfig.width / 2,
    y: sectionPosition.y + nodeConfig.position.y + nodeConfig.height / 2,
  };
}

/** Result of finding a node in sections. */
interface NodeLookupResult {
  readonly node: NodeConfig;
  readonly sectionPosition: Position;
}

/**
 * Finds a node by ID across multiple sections.
 * Returns the node and its parent section's position.
 */
export function findNodeInSections(
  nodeId: string,
  sections: readonly SectionConfig[],
): NodeLookupResult | null {
  for (const section of sections) {
    for (const node of section.nodes) {
      if (node.id === nodeId) {
        return { node, sectionPosition: section.position };
      }
    }
  }
  return null;
}

/**
 * Creates an EdgeConfig between two nodes by their IDs.
 * Calculates absolute center positions from section/node data.
 * Throws if either node is not found.
 */
export function createEdgeBetweenNodes(
  fromNodeId: string,
  toNodeId: string,
  relationship: string,
  isDashed: boolean,
  sections: readonly SectionConfig[],
): EdgeConfig {
  const fromResult = findNodeInSections(fromNodeId, sections);
  if (fromResult === null) {
    throw new Error(`Node not found: ${fromNodeId}`);
  }

  const toResult = findNodeInSections(toNodeId, sections);
  if (toResult === null) {
    throw new Error(`Node not found: ${toNodeId}`);
  }

  const from = getNodeCenter(fromResult.sectionPosition, fromResult.node);
  const to = getNodeCenter(toResult.sectionPosition, toResult.node);

  return { from, to, relationship, isDashed };
}
