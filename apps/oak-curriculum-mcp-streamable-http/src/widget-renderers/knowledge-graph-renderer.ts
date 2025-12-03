/* eslint-disable max-lines -- JC: long SVGs*/

/**
 * Knowledge Graph renderer for the widget.
 *
 * Renders two SVG network diagrams representing the Oak Curriculum
 * knowledge graph structure. Both SVGs are hidden by default in collapsible
 * details elements.
 *
 * 1. Overview graph: Simplified view of main concept categories
 * 2. Full graph: All 28 concepts and 45 edges from knowledge-graph-data.ts
 *
 * The SVGs are stylized representations with:
 * - Bold white lines with black outlines
 * - Lozenges (rounded rectangles) for nodes
 * - Color coding by category
 *
 * @see widget-renderer-registry.ts - Registry that routes to this renderer
 * @see knowledge-graph-data.ts - Source data for the graph structure
 * @module widget-renderers/knowledge-graph-renderer
 */

/**
 * Shared CSS styles for both SVG graphs.
 */
const SVG_STYLES = `
  .node-core { fill: #287d3c; stroke: #1b3d1c; stroke-width: 2; }
  .node-context { fill: #5da0d9; stroke: #2d5a7b; stroke-width: 2; }
  .node-content { fill: #d97d5d; stroke: #7b3d2d; stroke-width: 2; }
  .node-taxonomy { fill: #9b7dcf; stroke: #5d4a7b; stroke-width: 2; }
  .node-ks4 { fill: #cfab5d; stroke: #7b6a2d; stroke-width: 2; }
  .node-metadata { fill: #7a9e7a; stroke: #3d5a3d; stroke-width: 2; }
  .edge { stroke: #fff; stroke-width: 4; fill: none; }
  .edge-outline { stroke: #1b3d1c; stroke-width: 8; fill: none; }
  .edge-dashed { stroke: #fff; stroke-width: 3; fill: none; stroke-dasharray: 8 5; }
  .edge-dashed-outline { stroke: #1b3d1c; stroke-width: 7; fill: none; stroke-dasharray: 8 5; }
  .label { font-size: 14px; fill: #fff; stroke: #1b3d1c; stroke-width: 3px; paint-order: stroke fill; text-anchor: middle; font-family: inherit; font-weight: 700; }
  .label-sm { font-size: 11px; fill: #fff; stroke: #1b3d1c; stroke-width: 2px; paint-order: stroke fill; text-anchor: middle; font-family: inherit; font-weight: 600; }
  .group-label { font-size: 11px; fill: #fff; stroke: #1b3d1c; stroke-width: 2.5px; paint-order: stroke fill; text-anchor: start; font-family: inherit; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
`;

/**
 * Overview SVG - simplified view of main concept categories.
 * Shows 18 key nodes and primary relationships.
 */
const KNOWLEDGE_GRAPH_OVERVIEW_SVG = `
<svg viewBox="0 0 960 620" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:960px;height:auto;display:block;margin:0 auto">
  <style>${SVG_STYLES}</style>

  <!-- ========== ALL EDGES FIRST (behind nodes) ========== -->

  <!-- Context chain: Phase → KeyStage → YearGroup -->
  <line class="edge-outline" x1="130" y1="62" x2="195" y2="62"/>
  <line class="edge-outline" x1="325" y1="62" x2="410" y2="62"/>
  <line class="edge" x1="130" y1="62" x2="195" y2="62"/>
  <line class="edge" x1="325" y1="62" x2="410" y2="62"/>

  <!-- Core hierarchy: Subject → Sequence → Unit → Lesson -->
  <line class="edge-outline" x1="130" y1="180" x2="200" y2="180"/>
  <line class="edge-outline" x1="330" y1="180" x2="420" y2="180"/>
  <line class="edge-outline" x1="500" y1="180" x2="680" y2="180"/>
  <line class="edge" x1="130" y1="180" x2="200" y2="180"/>
  <line class="edge" x1="330" y1="180" x2="420" y2="180"/>
  <line class="edge" x1="500" y1="180" x2="680" y2="180"/>

  <!-- Context to Core (dashed) - center to center -->
  <line class="edge-dashed-outline" x1="80" y1="80" x2="80" y2="160"/>
  <line class="edge-dashed-outline" x1="260" y1="80" x2="265" y2="160"/>
  <line class="edge-dashed-outline" x1="475" y1="80" x2="460" y2="160"/>
  <line class="edge-dashed" x1="80" y1="80" x2="80" y2="160"/>
  <line class="edge-dashed" x1="260" y1="80" x2="265" y2="160"/>
  <line class="edge-dashed" x1="475" y1="80" x2="460" y2="160"/>

  <!-- Unit to Taxonomy (dashed) -->
  <line class="edge-dashed-outline" x1="460" y1="200" x2="350" y2="310"/>
  <line class="edge-dashed-outline" x1="460" y1="200" x2="490" y2="310"/>
  <line class="edge-dashed" x1="460" y1="200" x2="350" y2="310"/>
  <line class="edge-dashed" x1="460" y1="200" x2="490" y2="310"/>

  <!-- Lesson to Content -->
  <line class="edge-outline" x1="730" y1="200" x2="680" y2="310"/>
  <line class="edge-outline" x1="730" y1="200" x2="780" y2="310"/>
  <line class="edge-outline" x1="730" y1="200" x2="890" y2="310"/>
  <line class="edge" x1="730" y1="200" x2="680" y2="310"/>
  <line class="edge" x1="730" y1="200" x2="780" y2="310"/>
  <line class="edge" x1="730" y1="200" x2="890" y2="310"/>

  <!-- Quiz to Question -->
  <line class="edge-outline" x1="680" y1="350" x2="720" y2="420"/>
  <line class="edge" x1="680" y1="350" x2="720" y2="420"/>

  <!-- Question to Answer -->
  <line class="edge-outline" x1="720" y1="455" x2="750" y2="520"/>
  <line class="edge" x1="720" y1="455" x2="750" y2="520"/>

  <!-- KS4 structure -->
  <line class="edge-outline" x1="95" y1="420" x2="70" y2="490"/>
  <line class="edge-outline" x1="95" y1="420" x2="180" y2="490"/>
  <line class="edge-outline" x1="95" y1="530" x2="95" y2="570"/>
  <line class="edge" x1="95" y1="420" x2="70" y2="490"/>
  <line class="edge" x1="95" y1="420" x2="180" y2="490"/>
  <line class="edge" x1="95" y1="530" x2="95" y2="570"/>

  <!-- ========== NODES (on top of edges) ========== -->

  <!-- Row 1: Context -->
  <text class="group-label" x="30" y="30">Context</text>
  <rect class="node-context" x="30" y="45" width="100" height="35" rx="17"/>
  <text class="label" x="80" y="69">Phase</text>
  <rect class="node-context" x="195" y="45" width="130" height="35" rx="17"/>
  <text class="label" x="260" y="69">KeyStage</text>
  <rect class="node-context" x="410" y="45" width="130" height="35" rx="17"/>
  <text class="label" x="475" y="69">YearGroup</text>

  <!-- Row 2: Core Structure (label UNDER the nodes) -->
  <rect class="node-core" x="30" y="160" width="100" height="40" rx="20"/>
  <text class="label" x="80" y="186">Subject</text>
  <rect class="node-core" x="200" y="160" width="130" height="40" rx="20"/>
  <text class="label" x="265" y="186">Sequence</text>
  <rect class="node-core" x="420" y="160" width="80" height="40" rx="20"/>
  <text class="label" x="460" y="186">Unit</text>
  <rect class="node-core" x="680" y="160" width="100" height="40" rx="20"/>
  <text class="label" x="730" y="186">Lesson</text>
  <text class="group-label" x="30" y="220">Core Structure</text>

  <!-- Row 3: Taxonomy (left) -->
  <text class="group-label" x="290" y="285">Taxonomy</text>
  <rect class="node-taxonomy" x="290" y="305" width="110" height="35" rx="17"/>
  <text class="label" x="345" y="329">Thread</text>
  <rect class="node-taxonomy" x="430" y="305" width="120" height="35" rx="17"/>
  <text class="label" x="490" y="329">Category</text>

  <!-- Row 3: Content (right, more space) -->
  <text class="group-label" x="620" y="285">Content</text>
  <rect class="node-content" x="620" y="305" width="80" height="35" rx="17"/>
  <text class="label" x="660" y="329">Quiz</text>
  <rect class="node-content" x="720" y="305" width="80" height="35" rx="17"/>
  <text class="label" x="760" y="329">Asset</text>
  <rect class="node-content" x="830" y="305" width="115" height="35" rx="17"/>
  <text class="label" x="887" y="329">Transcript</text>

  <!-- Row 4: Question -->
  <rect class="node-content" x="660" y="415" width="120" height="35" rx="17"/>
  <text class="label" x="720" y="439">Question</text>

  <!-- Row 5: Answer -->
  <rect class="node-content" x="695" y="505" width="105" height="35" rx="17"/>
  <text class="label" x="747" y="529">Answer</text>

  <!-- KS4 Section (left side) -->
  <text class="group-label" x="30" y="375">KS4</text>
  <rect class="node-ks4" x="30" y="395" width="130" height="35" rx="17"/>
  <text class="label" x="95" y="419">Programme</text>
  <rect class="node-ks4" x="30" y="475" width="80" height="35" rx="17"/>
  <text class="label" x="70" y="499">Tier</text>
  <rect class="node-ks4" x="130" y="475" width="110" height="35" rx="17"/>
  <text class="label" x="185" y="499">Pathway</text>
  <rect class="node-ks4" x="30" y="555" width="130" height="35" rx="17"/>
  <text class="label" x="95" y="579">ExamBoard</text>
</svg>`.trim();

/**
 * Full SVG - complete graph with all 28 concepts and 45 edges.
 * Organized into 6 category sections with all explicit and inferred relationships.
 *
 * Categories:
 * - Structure (green): Subject, Sequence, Unit, Lesson
 * - Context (blue): Phase, KeyStage, YearGroup
 * - Content (orange): Quiz, Question, Answer, Asset, Transcript
 * - Taxonomy (purple): Thread, Category
 * - KS4 (gold): Programme, Tier, Pathway, ExamBoard, ExamSubject
 * - Metadata (sage): Keyword, Misconception, ContentGuidance, SupervisionLevel,
 *                    PriorKnowledge, NationalCurriculumStatement, KeyLearningPoint, TeacherTip
 */
const KNOWLEDGE_GRAPH_FULL_SVG = `
<svg viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1200px;height:auto;display:block;margin:0 auto">
  <style>${SVG_STYLES}</style>

  <!-- ========== ALL EDGES FIRST (behind nodes) ========== -->

  <!-- EXPLICIT EDGES -->

  <!-- Context chain: Phase → KeyStage → YearGroup -->
  <line class="edge-outline" x1="100" y1="55" x2="200" y2="55"/>
  <line class="edge-outline" x1="330" y1="55" x2="440" y2="55"/>
  <line class="edge" x1="100" y1="55" x2="200" y2="55"/>
  <line class="edge" x1="330" y1="55" x2="440" y2="55"/>

  <!-- Core hierarchy: Subject → Sequence → Unit → Lesson -->
  <line class="edge-outline" x1="110" y1="150" x2="200" y2="150"/>
  <line class="edge-outline" x1="330" y1="150" x2="430" y2="150"/>
  <line class="edge-outline" x1="510" y1="150" x2="620" y2="150"/>
  <line class="edge" x1="110" y1="150" x2="200" y2="150"/>
  <line class="edge" x1="330" y1="150" x2="430" y2="150"/>
  <line class="edge" x1="510" y1="150" x2="620" y2="150"/>

  <!-- Subject → KeyStage -->
  <line class="edge-outline" x1="60" y1="130" x2="265" y2="75"/>
  <line class="edge" x1="60" y1="130" x2="265" y2="75"/>

  <!-- Lesson → Quiz, Asset, Transcript -->
  <line class="edge-outline" x1="670" y1="170" x2="670" y2="250"/>
  <line class="edge-outline" x1="670" y1="170" x2="780" y2="250"/>
  <line class="edge-outline" x1="670" y1="170" x2="900" y2="250"/>
  <line class="edge" x1="670" y1="170" x2="670" y2="250"/>
  <line class="edge" x1="670" y1="170" x2="780" y2="250"/>
  <line class="edge" x1="670" y1="170" x2="900" y2="250"/>

  <!-- Quiz → Question → Answer -->
  <line class="edge-outline" x1="670" y1="290" x2="670" y2="340"/>
  <line class="edge-outline" x1="670" y1="380" x2="670" y2="430"/>
  <line class="edge" x1="670" y1="290" x2="670" y2="340"/>
  <line class="edge" x1="670" y1="380" x2="670" y2="430"/>

  <!-- Thread ↔ Unit, Unit → Category -->
  <line class="edge-outline" x1="470" y1="170" x2="350" y2="270"/>
  <line class="edge-outline" x1="470" y1="170" x2="470" y2="270"/>
  <line class="edge" x1="470" y1="170" x2="350" y2="270"/>
  <line class="edge" x1="470" y1="170" x2="470" y2="270"/>

  <!-- Lesson → Metadata (explicit) -->
  <line class="edge-outline" x1="720" y1="150" x2="850" y2="530"/>
  <line class="edge-outline" x1="720" y1="150" x2="970" y2="530"/>
  <line class="edge-outline" x1="720" y1="150" x2="1090" y2="530"/>
  <line class="edge-outline" x1="720" y1="150" x2="850" y2="620"/>
  <line class="edge-outline" x1="720" y1="150" x2="970" y2="620"/>
  <line class="edge" x1="720" y1="150" x2="850" y2="530"/>
  <line class="edge" x1="720" y1="150" x2="970" y2="530"/>
  <line class="edge" x1="720" y1="150" x2="1090" y2="530"/>
  <line class="edge" x1="720" y1="150" x2="850" y2="620"/>
  <line class="edge" x1="720" y1="150" x2="970" y2="620"/>

  <!-- ContentGuidance → SupervisionLevel -->
  <line class="edge-outline" x1="1090" y1="555" x2="1090" y2="610"/>
  <line class="edge" x1="1090" y1="555" x2="1090" y2="610"/>

  <!-- Unit → PriorKnowledge, NationalCurriculum -->
  <line class="edge-outline" x1="470" y1="170" x2="850" y2="710"/>
  <line class="edge-outline" x1="470" y1="170" x2="1015" y2="710"/>
  <line class="edge" x1="470" y1="170" x2="850" y2="710"/>
  <line class="edge" x1="470" y1="170" x2="1015" y2="710"/>

  <!-- KS4 explicit edges -->
  <line class="edge-outline" x1="100" y1="430" x2="100" y2="530"/>
  <line class="edge-outline" x1="100" y1="570" x2="60" y2="620"/>
  <line class="edge-outline" x1="100" y1="570" x2="140" y2="620"/>
  <line class="edge-outline" x1="100" y1="430" x2="60" y2="710"/>
  <line class="edge" x1="100" y1="430" x2="100" y2="530"/>
  <line class="edge" x1="100" y1="570" x2="60" y2="620"/>
  <line class="edge" x1="100" y1="570" x2="140" y2="620"/>
  <line class="edge" x1="100" y1="430" x2="60" y2="710"/>

  <!-- INFERRED EDGES (dashed) -->

  <!-- Unit/Lesson → Subject, KeyStage, YearGroup, Phase (context) -->
  <line class="edge-dashed-outline" x1="470" y1="130" x2="60" y2="150"/>
  <line class="edge-dashed-outline" x1="470" y1="130" x2="265" y2="75"/>
  <line class="edge-dashed-outline" x1="470" y1="130" x2="505" y2="75"/>
  <line class="edge-dashed-outline" x1="470" y1="130" x2="50" y2="55"/>
  <line class="edge-dashed" x1="470" y1="130" x2="60" y2="150"/>
  <line class="edge-dashed" x1="470" y1="130" x2="265" y2="75"/>
  <line class="edge-dashed" x1="470" y1="130" x2="505" y2="75"/>
  <line class="edge-dashed" x1="470" y1="130" x2="50" y2="55"/>

  <!-- Lesson → Subject, KeyStage -->
  <line class="edge-dashed-outline" x1="620" y1="150" x2="60" y2="150"/>
  <line class="edge-dashed-outline" x1="620" y1="150" x2="265" y2="75"/>
  <line class="edge-dashed" x1="620" y1="150" x2="60" y2="150"/>
  <line class="edge-dashed" x1="620" y1="150" x2="265" y2="75"/>

  <!-- Programme → many (inferred) -->
  <line class="edge-dashed-outline" x1="100" y1="410" x2="265" y2="170"/>
  <line class="edge-dashed-outline" x1="100" y1="410" x2="60" y2="170"/>
  <line class="edge-dashed-outline" x1="100" y1="410" x2="265" y2="75"/>
  <line class="edge-dashed-outline" x1="100" y1="410" x2="505" y2="75"/>
  <line class="edge-dashed-outline" x1="100" y1="410" x2="470" y2="170"/>
  <line class="edge-dashed" x1="100" y1="410" x2="265" y2="170"/>
  <line class="edge-dashed" x1="100" y1="410" x2="60" y2="170"/>
  <line class="edge-dashed" x1="100" y1="410" x2="265" y2="75"/>
  <line class="edge-dashed" x1="100" y1="410" x2="505" y2="75"/>
  <line class="edge-dashed" x1="100" y1="410" x2="470" y2="170"/>

  <!-- Sequence → ExamSubject, Tier (inferred) -->
  <line class="edge-dashed-outline" x1="265" y1="170" x2="210" y2="530"/>
  <line class="edge-dashed-outline" x1="265" y1="170" x2="60" y2="640"/>
  <line class="edge-dashed" x1="265" y1="170" x2="210" y2="530"/>
  <line class="edge-dashed" x1="265" y1="170" x2="60" y2="640"/>

  <!-- ExamSubject → Tier, Unit (inferred) -->
  <line class="edge-dashed-outline" x1="210" y1="555" x2="60" y2="640"/>
  <line class="edge-dashed-outline" x1="210" y1="555" x2="470" y2="170"/>
  <line class="edge-dashed" x1="210" y1="555" x2="60" y2="640"/>
  <line class="edge-dashed" x1="210" y1="555" x2="470" y2="170"/>

  <!-- Tier → Unit (inferred) -->
  <line class="edge-dashed-outline" x1="60" y1="620" x2="430" y2="170"/>
  <line class="edge-dashed" x1="60" y1="620" x2="430" y2="170"/>

  <!-- ========== NODES (on top of edges) ========== -->

  <!-- CONTEXT (blue) - Row 1 -->
  <text class="group-label" x="20" y="25">Context</text>
  <rect class="node-context" x="20" y="38" width="80" height="32" rx="16"/>
  <text class="label" x="60" y="60">Phase</text>
  <rect class="node-context" x="200" y="38" width="130" height="32" rx="16"/>
  <text class="label" x="265" y="60">KeyStage</text>
  <rect class="node-context" x="440" y="38" width="130" height="32" rx="16"/>
  <text class="label" x="505" y="60">YearGroup</text>

  <!-- CORE STRUCTURE (green) - Row 2 -->
  <rect class="node-core" x="20" y="130" width="90" height="40" rx="20"/>
  <text class="label" x="65" y="156">Subject</text>
  <rect class="node-core" x="200" y="130" width="130" height="40" rx="20"/>
  <text class="label" x="265" y="156">Sequence</text>
  <rect class="node-core" x="430" y="130" width="80" height="40" rx="20"/>
  <text class="label" x="470" y="156">Unit</text>
  <rect class="node-core" x="620" y="130" width="100" height="40" rx="20"/>
  <text class="label" x="670" y="156">Lesson</text>
  <text class="group-label" x="20" y="190">Core Structure</text>

  <!-- CONTENT (orange) - Right side -->
  <text class="group-label" x="620" y="235">Content</text>
  <rect class="node-content" x="620" y="250" width="80" height="35" rx="17"/>
  <text class="label" x="660" y="274">Quiz</text>
  <rect class="node-content" x="730" y="250" width="80" height="35" rx="17"/>
  <text class="label" x="770" y="274">Asset</text>
  <rect class="node-content" x="840" y="250" width="120" height="35" rx="17"/>
  <text class="label" x="900" y="274">Transcript</text>
  <rect class="node-content" x="610" y="340" width="120" height="35" rx="17"/>
  <text class="label" x="670" y="364">Question</text>
  <rect class="node-content" x="620" y="430" width="100" height="35" rx="17"/>
  <text class="label" x="670" y="454">Answer</text>

  <!-- TAXONOMY (purple) - Below Unit -->
  <text class="group-label" x="290" y="255">Taxonomy</text>
  <rect class="node-taxonomy" x="290" y="270" width="110" height="35" rx="17"/>
  <text class="label" x="345" y="294">Thread</text>
  <rect class="node-taxonomy" x="420" y="270" width="120" height="35" rx="17"/>
  <text class="label" x="480" y="294">Category</text>

  <!-- KS4 (gold) - Left side lower -->
  <text class="group-label" x="20" y="395">KS4</text>
  <rect class="node-ks4" x="20" y="410" width="140" height="35" rx="17"/>
  <text class="label" x="90" y="434">Programme</text>
  <rect class="node-ks4" x="150" y="530" width="130" height="35" rx="17"/>
  <text class="label" x="215" y="554">ExamSubject</text>
  <rect class="node-ks4" x="20" y="530" width="100" height="35" rx="17"/>
  <text class="label" x="70" y="554">Tier</text>
  <rect class="node-ks4" x="20" y="620" width="80" height="35" rx="17"/>
  <text class="label-sm" x="60" y="642">Tier</text>
  <rect class="node-ks4" x="110" y="620" width="100" height="35" rx="17"/>
  <text class="label" x="160" y="644">Pathway</text>
  <rect class="node-ks4" x="20" y="710" width="130" height="35" rx="17"/>
  <text class="label" x="85" y="734">ExamBoard</text>

  <!-- METADATA (sage) - Right side lower -->
  <text class="group-label" x="790" y="505">Metadata</text>
  <rect class="node-metadata" x="790" y="520" width="100" height="35" rx="17"/>
  <text class="label" x="840" y="544">Keyword</text>
  <rect class="node-metadata" x="910" y="520" width="140" height="35" rx="17"/>
  <text class="label-sm" x="980" y="544">Misconception</text>
  <rect class="node-metadata" x="1020" y="520" width="160" height="35" rx="17"/>
  <text class="label-sm" x="1100" y="544">ContentGuidance</text>
  <rect class="node-metadata" x="790" y="610" width="145" height="35" rx="17"/>
  <text class="label-sm" x="862" y="634">KeyLearningPoint</text>
  <rect class="node-metadata" x="945" y="610" width="115" height="35" rx="17"/>
  <text class="label-sm" x="1002" y="634">TeacherTip</text>
  <rect class="node-metadata" x="1020" y="610" width="160" height="35" rx="17"/>
  <text class="label-sm" x="1100" y="634">SupervisionLevel</text>
  <rect class="node-metadata" x="790" y="700" width="140" height="35" rx="17"/>
  <text class="label-sm" x="860" y="724">PriorKnowledge</text>
  <rect class="node-metadata" x="940" y="700" width="170" height="35" rx="17"/>
  <text class="label-sm" x="1025" y="724">NationalCurriculum</text>

  <!-- Legend -->
  <rect x="20" y="820" width="1160" height="60" rx="8" fill="rgba(0,0,0,0.3)"/>
  <text class="group-label" x="40" y="845">Legend:</text>
  <rect class="node-core" x="120" y="830" width="20" height="20" rx="5"/>
  <text class="label-sm" x="165" y="845">Structure</text>
  <rect class="node-context" x="230" y="830" width="20" height="20" rx="5"/>
  <text class="label-sm" x="275" y="845">Context</text>
  <rect class="node-content" x="340" y="830" width="20" height="20" rx="5"/>
  <text class="label-sm" x="385" y="845">Content</text>
  <rect class="node-taxonomy" x="450" y="830" width="20" height="20" rx="5"/>
  <text class="label-sm" x="495" y="845">Taxonomy</text>
  <rect class="node-ks4" x="570" y="830" width="20" height="20" rx="5"/>
  <text class="label-sm" x="610" y="845">KS4</text>
  <rect class="node-metadata" x="660" y="830" width="20" height="20" rx="5"/>
  <text class="label-sm" x="705" y="845">Metadata</text>
  <line class="edge" x1="780" y1="840" x2="830" y2="840"/>
  <text class="label-sm" x="880" y="845">Explicit</text>
  <line class="edge-dashed" x1="940" y1="840" x2="990" y2="840"/>
  <text class="label-sm" x="1040" y="845">Inferred</text>
</svg>`.trim();

/**
 * JavaScript function to render knowledge graph content in the widget.
 *
 * Displays:
 * 1. A "Knowledge graph loaded..." status message
 * 2. Two collapsible details elements:
 *    - Graph overview (simplified 18-node view)
 *    - Full graph (complete 28-node, 45-edge view)
 *
 * Both SVGs are hidden by default to avoid overwhelming the user.
 */
export const KNOWLEDGE_GRAPH_RENDERER = `
const KNOWLEDGE_GRAPH_OVERVIEW_SVG = \`${KNOWLEDGE_GRAPH_OVERVIEW_SVG}\`;
const KNOWLEDGE_GRAPH_FULL_SVG = \`${KNOWLEDGE_GRAPH_FULL_SVG}\`;

function renderKnowledgeGraph(data) {
  let h = '';

  // Header section
  h += '<div class="sec"><h2 class="sec-ttl">Oak Knowledge Graph</h2>';
  h += '<p style="margin:0 0 12px;font-size:14px">Schema-level graph showing how curriculum concept types relate to each other.</p>';
  h += '</div>';

  // Status message
  h += '<div class="sec">';
  h += '<p style="margin:0 0 12px;font-size:14px;color:var(--accent);font-weight:600">✓ Knowledge graph loaded successfully</p>';
  h += '</div>';

  // Overview SVG (simplified)
  h += '<div class="sec">';
  h += '<details style="border:1px solid var(--border-color);border-radius:8px;padding:12px">';
  h += '<summary style="cursor:pointer;font-size:13px;font-weight:500;color:var(--fg-secondary)">Graph overview (18 key concepts)</summary>';
  h += '<div style="margin-top:12px;text-align:center">';
  h += KNOWLEDGE_GRAPH_OVERVIEW_SVG;
  h += '<p style="margin:8px 0 0;font-size:11px;color:var(--fg-secondary);font-style:italic">Solid lines: explicit relationships • Dashed lines: inferred relationships</p>';
  h += '</div>';
  h += '</details>';
  h += '</div>';

  // Full SVG (all concepts and edges)
  h += '<div class="sec">';
  h += '<details style="border:1px solid var(--border-color);border-radius:8px;padding:12px">';
  h += '<summary style="cursor:pointer;font-size:13px;font-weight:500;color:var(--fg-secondary)">Full graph (28 concepts, 45 edges)</summary>';
  h += '<div style="margin-top:12px;text-align:center">';
  h += KNOWLEDGE_GRAPH_FULL_SVG;
  h += '<p style="margin:8px 0 0;font-size:11px;color:var(--fg-secondary);font-style:italic">Shows all concept types and relationships from knowledge-graph-data.ts</p>';
  h += '</div>';
  h += '</details>';
  h += '</div>';

  return h || '<div class="empty">No knowledge graph data available.</div>';
}
`.trim();
