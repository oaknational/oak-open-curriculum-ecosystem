/**
 * Knowledge Graph renderer for the widget.
 *
 * Renders a simplified SVG network diagram representing the Oak Curriculum
 * knowledge graph structure, with a CTA button to request a detailed
 * visualization from the AI agent.
 *
 * The SVG is a static, geometric representation with:
 * - White circles with black outlines for nodes
 * - Lines connecting nodes based on relationships
 * - Organized by concept category
 *
 * @see widget-renderer-registry.ts - Registry that routes to this renderer
 * @see knowledge-graph-data.ts - Source data for the graph structure
 * @module widget-renderers/knowledge-graph-renderer
 */

/**
 * Prompt sent when user clicks the "Visualize Knowledge Graph" CTA.
 *
 * This prompt instructs the agent to create a professional, detailed
 * visualization of the knowledge graph data.
 */
export const KNOWLEDGE_GRAPH_VISUALIZATION_PROMPT = `Please read the knowledge graph JSON data I just loaded, and create a detailed visual representation of it as a network diagram.

Include all proper terms and labels from the graph. Group concepts by their category (structure, content, context, taxonomy, ks4, metadata).

This visualization is to support professional teachers using the Oak curriculum, so the style should be:
- Clean and professional
- Easy to read and understand
- Show the hierarchy clearly (Subject → Sequence → Unit → Lesson)
- Distinguish between explicit and inferred relationships
- Use appropriate colors for different concept categories

Create the visualization now.`;

/**
 * Static SVG network diagram of the knowledge graph.
 *
 * Node positions are pre-computed to show the graph structure clearly:
 * - Core structure (Subject→Sequence→Unit→Lesson) flows left to right
 * - Content items branch down from Lesson
 * - Context items (Phase, KeyStage, YearGroup) are on top
 * - Taxonomy and KS4 concepts are positioned around the periphery
 *
 * Styling: white fill (#fff) with dark green stroke (#1b3d1c), matching Oak branding.
 */
const KNOWLEDGE_GRAPH_SVG = `
<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px;height:auto;display:block;margin:0 auto 16px">
  <defs>
    <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
      <polygon points="0 0, 6 2, 0 4" fill="currentColor" opacity="0.4"/>
    </marker>
  </defs>
  <style>
    .node { fill: #fff; stroke: currentColor; stroke-width: 1.5; }
    .edge { stroke: currentColor; stroke-width: 1; opacity: 0.3; fill: none; }
    .edge-inferred { stroke-dasharray: 3,3; }
    .label { font-size: 7px; fill: currentColor; text-anchor: middle; font-family: inherit; opacity: 0.8; }
  </style>

  <!-- Core Structure: Subject → Sequence → Unit → Lesson (horizontal flow) -->
  <line class="edge" x1="60" y1="100" x2="120" y2="100" marker-end="url(#arrowhead)"/>
  <line class="edge" x1="130" y1="100" x2="190" y2="100" marker-end="url(#arrowhead)"/>
  <line class="edge" x1="200" y1="100" x2="260" y2="100" marker-end="url(#arrowhead)"/>
  
  <!-- Context: Phase → KeyStage → YearGroup (top) -->
  <line class="edge" x1="60" y1="40" x2="120" y2="40" marker-end="url(#arrowhead)"/>
  <line class="edge" x1="130" y1="40" x2="190" y2="40" marker-end="url(#arrowhead)"/>
  <line class="edge edge-inferred" x1="55" y1="45" x2="55" y2="90"/>
  <line class="edge edge-inferred" x1="125" y1="45" x2="125" y2="90"/>
  
  <!-- Content: branches from Lesson -->
  <line class="edge" x1="270" y1="105" x2="290" y2="140" marker-end="url(#arrowhead)"/>
  <line class="edge" x1="270" y1="105" x2="330" y2="140" marker-end="url(#arrowhead)"/>
  <line class="edge" x1="270" y1="105" x2="370" y2="140" marker-end="url(#arrowhead)"/>
  <line class="edge" x1="295" y1="150" x2="310" y2="180" marker-end="url(#arrowhead)"/>
  <line class="edge" x1="315" y1="190" x2="340" y2="210" marker-end="url(#arrowhead)"/>
  
  <!-- Taxonomy: Thread ↔ Unit, Category ↔ Unit -->
  <line class="edge" x1="195" y1="105" x2="195" y2="160"/>
  <line class="edge" x1="195" y1="105" x2="250" y2="160"/>
  
  <!-- KS4: Programme and related concepts (bottom left) -->
  <line class="edge edge-inferred" x1="60" y1="200" x2="120" y2="200"/>
  <line class="edge edge-inferred" x1="60" y1="200" x2="80" y2="240"/>
  <line class="edge edge-inferred" x1="60" y1="200" x2="130" y2="240"/>
  
  <!-- Metadata: branches from Lesson (bottom right) -->
  <line class="edge" x1="270" y1="105" x2="310" y2="60"/>
  <line class="edge" x1="270" y1="105" x2="350" y2="60"/>

  <!-- Context Nodes (top) -->
  <circle class="node" cx="50" cy="40" r="8"/>
  <text class="label" x="50" y="28">Phase</text>
  <circle class="node" cx="125" cy="40" r="8"/>
  <text class="label" x="125" y="28">KeyStage</text>
  <circle class="node" cx="195" cy="40" r="8"/>
  <text class="label" x="195" y="28">YearGroup</text>

  <!-- Core Structure Nodes -->
  <circle class="node" cx="50" cy="100" r="10"/>
  <text class="label" x="50" y="118">Subject</text>
  <circle class="node" cx="125" cy="100" r="10"/>
  <text class="label" x="125" y="118">Sequence</text>
  <circle class="node" cx="195" cy="100" r="10"/>
  <text class="label" x="195" y="118">Unit</text>
  <circle class="node" cx="270" cy="100" r="10"/>
  <text class="label" x="270" y="118">Lesson</text>

  <!-- Content Nodes -->
  <circle class="node" cx="290" cy="145" r="7"/>
  <text class="label" x="290" y="158">Quiz</text>
  <circle class="node" cx="330" cy="145" r="7"/>
  <text class="label" x="330" y="158">Asset</text>
  <circle class="node" cx="370" cy="145" r="7"/>
  <text class="label" x="370" y="158">Transcript</text>
  <circle class="node" cx="310" cy="185" r="6"/>
  <text class="label" x="310" y="198">Question</text>
  <circle class="node" cx="340" cy="215" r="5"/>
  <text class="label" x="340" y="228">Answer</text>

  <!-- Taxonomy Nodes -->
  <circle class="node" cx="195" cy="165" r="7"/>
  <text class="label" x="195" y="178">Thread</text>
  <circle class="node" cx="250" cy="165" r="7"/>
  <text class="label" x="250" y="178">Category</text>

  <!-- KS4 Nodes (bottom left) -->
  <circle class="node" cx="55" cy="200" r="9"/>
  <text class="label" x="55" y="218">Programme</text>
  <circle class="node" cx="120" cy="200" r="6"/>
  <text class="label" x="120" y="213">Tier</text>
  <circle class="node" cx="80" cy="245" r="6"/>
  <text class="label" x="80" y="258">Pathway</text>
  <circle class="node" cx="130" cy="245" r="6"/>
  <text class="label" x="130" y="258">ExamBoard</text>

  <!-- Metadata Nodes (top right) -->
  <circle class="node" cx="310" cy="55" r="5"/>
  <text class="label" x="310" y="45">Keyword</text>
  <circle class="node" cx="350" cy="55" r="5"/>
  <text class="label" x="350" y="45">Tips</text>
</svg>`.trim();

/**
 * JavaScript function to render knowledge graph content in the widget.
 *
 * Displays:
 * 1. A simplified SVG network diagram of the knowledge graph
 * 2. Summary statistics (concepts, edges, categories)
 * 3. A CTA button to request detailed visualization from the AI
 *
 * The CTA does NOT have a time-based gate - it can be clicked anytime.
 */
export const KNOWLEDGE_GRAPH_RENDERER = `
const KNOWLEDGE_GRAPH_SVG = \`${KNOWLEDGE_GRAPH_SVG}\`;

const KNOWLEDGE_GRAPH_VIZ_PROMPT = \`${KNOWLEDGE_GRAPH_VISUALIZATION_PROMPT.replace(/`/g, '\\`')}\`;

function renderKnowledgeGraph(data) {
  let h = '';

  // Header section
  h += '<div class="sec"><h2 class="sec-ttl">Oak Knowledge Graph</h2>';
  h += '<p style="margin:0 0 12px;font-size:14px">Schema-level graph showing how curriculum concept types relate to each other.</p>';
  h += '</div>';

  // SVG visualization
  h += '<div class="sec" style="text-align:center">';
  h += KNOWLEDGE_GRAPH_SVG;
  h += '<p style="margin:0;font-size:11px;color:var(--fg-secondary);font-style:italic">Simplified view • Solid lines: explicit relationships • Dashed: inferred</p>';
  h += '</div>';

  // Statistics
  if (data?.concepts && data?.edges) {
    const conceptCount = data.concepts.length;
    const edgeCount = data.edges.length;
    const categories = [...new Set(data.concepts.map(c => c.category))];
    
    h += '<div class="sec"><h2 class="sec-ttl">Graph Statistics</h2>';
    h += '<div class="list">';
    h += '<div class="item"><p class="item-ttl">Concepts<span class="badge">' + conceptCount + '</span></p>';
    h += '<p class="meta">Categories: ' + categories.join(', ') + '</p></div>';
    h += '<div class="item"><p class="item-ttl">Relationships<span class="badge">' + edgeCount + '</span></p>';
    const inferredCount = data.edges.filter(e => e.inferred).length;
    h += '<p class="meta">Explicit: ' + (edgeCount - inferredCount) + ' • Inferred: ' + inferredCount + '</p></div>';
    h += '</div></div>';
  }

  // CTA for detailed visualization
  h += '<div class="sec" style="text-align:center;padding:16px 0">';
  h += '<button id="kg-viz-cta-btn" class="cta-btn" style="margin:0 auto">Visualize Oak Knowledge Graph</button>';
  h += '</div>';

  return h || '<div class="empty">No knowledge graph data available.</div>';
}

// Initialize CTA button for knowledge graph visualization
function initKnowledgeGraphCta() {
  const btn = document.getElementById('kg-viz-cta-btn');
  if (!btn || !window.openai?.sendFollowUpMessage) return;
  
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'Generating visualization...';
    try {
      await window.openai.sendFollowUpMessage({ prompt: KNOWLEDGE_GRAPH_VIZ_PROMPT });
      btn.textContent = 'Visualize Oak Knowledge Graph';
      btn.disabled = false;
    } catch (error) {
      btn.textContent = 'Visualize Oak Knowledge Graph';
      btn.disabled = false;
      console.error('Failed to send visualization request:', error);
    }
  });
}

// Register the CTA initializer to run after render
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(initKnowledgeGraphCta, 100);
  });
}
`.trim();
