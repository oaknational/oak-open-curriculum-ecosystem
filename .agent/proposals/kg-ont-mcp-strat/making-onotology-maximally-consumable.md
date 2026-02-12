# From Ontology to Leverage  

Turning Oak’s Curriculum Knowledge Graph into Strategic Advantage

---

## 1. The Opportunity

Oak is building something rare in education:  
a formal, machine-readable, standards-aligned representation of curriculum structure.

That is not just a documentation exercise.  
It is infrastructure.

The ontology gives us a canonical model of:

- Programmes, Units, Unit Variants and Lessons  
- Sequencing and optionality  
- Exam board and tier variation  
- Cross-cutting threads  
- Alignment to National Curriculum content  

Built on W3C standards such as [RDF](https://www.w3.org/TR/rdf11-primer/), [OWL](https://www.w3.org/TR/owl2-overview/) and [SHACL](https://www.w3.org/TR/shacl/), it establishes semantic clarity and long-term durability.

The question now is not *whether* it is useful.  
The question is:

> How do we design the right levers so that this work delivers maximum value across Oak?

---

## 2. One Canonical Graph, Many Levers

The most powerful framing is this:

> Maintain one authoritative knowledge graph — and derive multiple high-value capabilities from it.

The ontology becomes the semantic spine.  
Different use cases become projections or interfaces over that spine.

If we do this well, we avoid:

- Multiple competing curriculum models
- Re-implementing sequencing logic in different services
- Hard-coding exam board variation in product layers
- Losing alignment traceability over time

Instead, we create compounding value.

---

## 3. Lever 1: Product Acceleration

A formal graph allows product teams to work with stable, structured curriculum data.

From the canonical graph, we can generate:

- Ordered programme navigation structures  
- Unit and lesson summaries  
- Explicit optionality points  
- Clear breadcrumb hierarchies  
- Structured search documents  

The ontology handles correctness.  
Projection layers handle performance and usability.

This separation means:

- Front-end changes do not require curriculum remodelling  
- Sequencing logic lives in one place  
- Variation (exam boards, tiers) is explicit rather than conditional  

The result is faster iteration with lower risk.

---

## 4. Lever 2: Richer Discovery and Search

Curriculum is not only hierarchical; it is relational.

A knowledge graph supports discovery patterns that static trees cannot:

- Finding all units addressing a particular content descriptor  
- Tracing a thread across key stages  
- Comparing pathways across exam boards  
- Identifying conceptual overlap between subjects  

This can combine structured queries (e.g. [SPARQL 1.1](https://www.w3.org/TR/sparql11-overview/)) with conventional indexing approaches.

The graph does not replace search — it gives it structure.

---

## 5. Lever 3: Analytical Insight

When curriculum structure is formalised, it becomes analysable.

Potential capabilities include:

- Coverage analysis against National Curriculum descriptors  
- Identification of sequencing dependencies  
- Detection of gaps or clustering across phases  
- Comparison of alternative pathways  
- Mapping the distribution of threads  

Knowledge graphs are increasingly used as analytical backbones in other sectors:

- [Google Knowledge Graph research](https://research.google/pubs/pub45634/)  
- [Enterprise knowledge graph applications](https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-knowledge-graph-as-a-backbone-for-enterprise-ai)

For Oak, this enables both internal planning and external transparency.

---

## 6. Lever 4: Interoperability and Ecosystem Positioning

By clearly separating:

- DfE-owned core standards  
- Oak-owned extensions  

we position Oak within a broader semantic ecosystem.

This enables:

- Linking to national standards cleanly  
- Future publisher or university extensions  
- Research and policy integrations  
- Potential international alignment  

The pattern mirrors models used by [Schema.org](https://schema.org/) and the wider [Linked Open Data Cloud](https://lod-cloud.net/).

Clear ownership plus explicit linking allows each organisation to evolve independently without fragmentation.

---

## 7. Lever 5: Grounded AI and Intelligent Systems

As AI becomes embedded in educational tooling, structured grounding becomes essential.

A formal curriculum graph provides:

- Stable identifiers for curriculum entities  
- Explicit alignment relationships  
- Traceable reasoning paths  
- Clear modelling of variation and optionality  

Rather than relying on implicit assumptions in free text, systems can retrieve authoritative curriculum structure.

Approaches such as [Retrieval-Augmented Generation (RAG)](https://arxiv.org/abs/2005.11401) demonstrate how structured knowledge can anchor language models to trusted sources.

The ontology becomes a guardrail, not an afterthought.

---

## 8. Lever 6: Durability Through Change

Curriculum evolves slowly.  
Product interfaces evolve quickly.

By isolating semantic meaning in the ontology layer, we decouple:

- Curriculum stability  
- Presentation logic  
- API contracts  
- User interface experimentation  

That separation reduces technical debt and makes change safer.

It also ensures that alignment, sequencing and variation logic remain coherent over time.

---

## 9. Designing for Maximum Value

To ensure the ontology compounds in value, a few design principles matter:

### 9.1 Treat the Graph as Canonical

All derived representations — JSON, APIs, search documents — should flow from the graph, not bypass it.

### 9.2 Define Stable Consumption Contracts

Product teams need predictable interfaces.  
Versioned projections and documented schemas prevent accidental breakage.

### 9.3 Make Alignment and Reasoning Visible

Where possible, expose why relationships exist:

- Why is this unit in this year?  
- Which descriptors does it address?  
- What threads recur across phases?  

Explainability increases trust and reuse.

### 9.4 Think in Relationships, Not Just Trees

The ontology’s strength lies in modelling:

- Sequencing  
- Optionality  
- Variation  
- Cross-cutting themes  

These are structural advantages. They should shape product thinking.

---

## 10. The Strategic Framing

Oak is not simply building a data model.

It is building a knowledge infrastructure layer for curriculum.

If we align our products, analytics and integrations around that layer, we gain:

- Consistency  
- Reusability  
- Transparency  
- Strategic leverage  

The ontology is the investment.  
The levers above determine the return.

The more we consciously design for consumption, the more this work compounds.
