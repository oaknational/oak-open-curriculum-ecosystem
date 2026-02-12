## Summary Tables

### Bugs (Observed and confirmed)

| Item | Priority | Impact | Effort | AI Benefit | User impact |
| --- | --- | --- | --- | --- | --- |
| `/sequences/{sequence}/assets` ignores `year` filter (see `00-overview-and-known-issues.md`; examples: `11-assets-and-transcripts-examples.md`) | Medium | Medium | Hours | Correct year-scoped asset selection | API consumers and SDK/MCP engineers avoid mis-scoped asset downloads. |
| Lessons endpoint pagination bug (see `00-overview-and-known-issues.md`; examples: `14-listing-and-pagination-examples.md`) | High | High | Days | Complete lesson listings | Teachers and curriculum leaders do not miss lessons; API consumers get complete results. |
| Binary asset endpoint documented as JSON (see `00-overview-and-known-issues.md`; examples: `11-assets-and-transcripts-examples.md`) | Medium | Medium | Hours | Correct tooling and validators | Human engineers consuming the API and SDK/MCP engineers avoid invalid validators and parsing errors. |
| Empty transcript responses return 200 (see `00-overview-and-known-issues.md`; examples: `11-assets-and-transcripts-examples.md`) | Medium | Medium | Hours | Reliable transcript availability signals | Teachers and accessibility tooling can trust transcript availability; API consumers handle errors correctly. |
| Bulk download: null titles with populated slugs (see `00-overview-and-known-issues.md`; examples: `15-bulk-download-examples.md`) | Medium | Medium | Days | Cleaner ingestion and matching | Curriculum leaders and data analysts get readable labels; SDK ingestion is simpler. |
| Bulk download: missing tier metadata for KS4 variants (see `00-overview-and-known-issues.md`; examples: `15-bulk-download-examples.md`) | Medium | Medium | Days | Accurate KS4 filtering | Teachers and edtech founders can filter KS4 tiers; API consumers can disambiguate variants. |
| Bulk download: missing lesson record referenced by units (see `00-overview-and-known-issues.md`; examples: `15-bulk-download-examples.md`) | High | High | Days | Data integrity for joins | API consumers avoid broken references; teachers do not see missing lessons. |
| Bulk download: inconsistent null semantics (see `00-overview-and-known-issues.md`; examples: `15-bulk-download-examples.md`) | Low | Low | Days | Predictable null handling | SDK engineers avoid special cases; data tooling is more robust. |
| Bulk download: missing transcripts in maths primary (see `00-overview-and-known-issues.md`; examples: `15-bulk-download-examples.md`) | Medium | Medium | Days | Complete transcript coverage | Learners, including adult learners, and teachers get full accessibility coverage; search indexing is complete. |
| Bulk download: missing threads and empty descriptions on secondary units (see `00-overview-and-known-issues.md`; examples: `15-bulk-download-examples.md`) | Medium | Medium | Days | Stronger pedagogy metadata | Curriculum leaders and teachers gain better progression context; AI tools provide clearer summaries. |

### Potential Gaps Requiring Investigation

| Item | Priority | Impact | Effort | AI Benefit | User impact |
| --- | --- | --- | --- | --- | --- |
| Unit summary `unitLessons` truncation (see `00-overview-and-known-issues.md`; examples: `14-listing-and-pagination-examples.md`) | Medium | Medium | Days | Accurate unit summaries | API consumers and teachers get complete unit lesson lists. |
| Subject gating and allowlists not documented (see `00-overview-and-known-issues.md`; examples: `10-availability-and-gating-examples.md`) | Medium | Medium | Hours | Predictable availability rules | API consumers and SDK/MCP engineers understand availability constraints upfront. |
| Assets endpoint TPC filtering needs explicit documentation (see `00-overview-and-known-issues.md`; examples: `10-availability-and-gating-examples.md`) | Low | Low | Hours | Avoids incorrect assumptions | Edtech founders and API consumers can plan around licensing constraints. |
| `/search/lessons` excludes `financial-education` (see `00-overview-and-known-issues.md`; examples: `12-search-and-enums-examples.md`) | Medium | Medium | Hours | Transparent search coverage | Teachers and learners understand search limits; API consumers can route around the gap. |
| Quiz endpoints omit image-based questions silently (see `00-overview-and-known-issues.md`; examples: `13-quiz-content-examples.md`) | Medium | Medium | Days | Complete, explainable quizzes | Teachers and students can trust quizzes or see omissions explicitly. |
| Key stage and subject enums are static (see `00-overview-and-known-issues.md`; examples: `12-search-and-enums-examples.md`) | Medium | Medium | Days | Fresh, accurate enums | SDK/MCP engineers avoid rejected requests; API consumers see current subject coverage. |
| KS4 science only accessible via sequences endpoint (see `00-overview-and-known-issues.md`; examples: `14-listing-and-pagination-examples.md`) | Medium | Medium | Days | Easier KS4 science access | Curriculum leaders and edtech founders can access GCSE science reliably. |
| Legitimate `z.unknown()` exceptions registry (see `00-overview-and-known-issues.md`; examples: `20-validation-and-schema-examples.md`) | Low | Low | Hours | Prevents over-strict validation | SDK/MCP engineers know where strict validation is impossible. |
| Open questions (path-level examples, OpenAPI 3.1, Zod 4, schema snippets, metadata usefulness, data integrity) (see `00-overview-and-known-issues.md`; examples: `20-validation-and-schema-examples.md`) | Low | Low | Hours | Clearer roadmap and tooling | API team and tooling authors can plan roadmap and compatibility. |

### Enhancement Requests

| Item | Priority | Impact | Effort | AI Benefit | User impact |
| --- | --- | --- | --- | --- | --- |
| **NEW: Flat tier/examBoard fields** (examples: `18-programmes-and-identifiers-examples.md`) | High | High | Days | KS4 filtering for GCSE navigation | Teachers and curriculum leaders can filter GCSE pathways; founders of major tech companies focused on maths access in the global South can target impact. |
| **NEW: semantic_summary field** (examples: `19-semantic-summary-examples.md`) | High | High | Days | High-quality embeddings for all types | Teachers, students, and adult learners get better discovery; AI tool builders improve search quality. |
| **NEW: Maths sequence bundle endpoint** (examples: `21-maths-education-enhancements.md`) | High | High | Sprint | Progression-aware maths tooling | Teachers and curriculum leaders see clearer maths progression; SDK/MCP engineers avoid N+1 calls. |
| **NEW: Maths lesson thread tags + thread metadata** (examples: `21-maths-education-enhancements.md`) | Medium | Medium | Days | Domain-led filtering and progression maps | Teachers and curriculum leaders track concept coverage; API consumers build domain-aware tools. |
| **NEW: Structured maths answers + marking metadata** (examples: `21-maths-education-enhancements.md`) | High | High | Sprint | Reliable maths validation and feedback | Learners receive accurate feedback; SDK/MCP engineers can build maths practice tools safely. |
| **NEW: Return image/diagram quiz items** (examples: `21-maths-education-enhancements.md`) | High | High | Days | Complete maths assessment coverage | Students and teachers access full quiz content; API consumers avoid silent omissions. |
| **NEW: Maths representation tags** (examples: `21-maths-education-enhancements.md`) | Medium | Medium | Days | Representation-aware lesson selection | Teachers can plan concrete-pictorial-abstract sequences; learners get varied representations. |
| **NEW: Transcript segments + maths normalisation** (examples: `21-maths-education-enhancements.md`) | Medium | Medium | Days | Maths-aware retrieval and alignment | Teachers and learners find explanations faster; SDK/MCP engineers build better study tools. |
| **NEW: Transcript search filters + richer context** (examples: `21-maths-education-enhancements.md`) | Medium | Medium | Days | Higher precision transcript search | Teachers and curriculum leaders find relevant maths content; API consumers reduce noise. |
| **NEW: Maths glossary + keyword IDs** (examples: `21-maths-education-enhancements.md`) | Medium | Medium | Days | Stable vocabulary linking | Teachers and learners track maths vocabulary; SDK/MCP engineers build glossary tools. |
| 1. "Use this when" descriptions (examples: `16-schema-and-metadata-examples.md`) | High | High | Hours | 70% fewer wrong-tool calls | API consumers and SDK/MCP engineers pick the right endpoint quickly. |
| 2. Operation summaries (examples: `16-schema-and-metadata-examples.md`) | High | High | Hours | Better UI/organisation | Human engineers and documentation readers understand endpoint intent faster. |
| 3. `/ontology` endpoint (examples: `17-ontology-and-threads-examples.md`) | High | High | Days | 60% fewer discovery turns | Curriculum leaders and AI tool builders can reason about structure and progression. |
| 4. Error response docs (examples: `16-schema-and-metadata-examples.md`) | High | High | Hours | Proper error handling | API consumers and teachers get clearer, actionable error messages. |
| 5. Programme variant metadata (examples: `18-programmes-and-identifiers-examples.md`) | High | High | Days | Programme-based filtering & OWA URLs | Teachers and curriculum leaders align with OWA programme views; SDK/MCP can link correctly. |
| 6. Consistent resource IDs (examples: `18-programmes-and-identifiers-examples.md`) | High | High | Days | Working cross-service links | Teachers and API consumers use consistent identifiers across systems. |
| 7. Parameter examples (examples: `16-schema-and-metadata-examples.md`) | Medium | Medium | Days | Clearer semantics | API consumers avoid invalid inputs; teachers get reliable filters. |
| 8. Custom schema extensions (examples: `16-schema-and-metadata-examples.md`) | Medium | Medium | Hours | Auto-generated metadata | SDK/MCP engineers can generate tool metadata without manual mapping. |
| 9. Behavioural metadata (examples: `16-schema-and-metadata-examples.md`) | Medium | Medium | Hours | Safety & retry logic | AI tool builders avoid unsafe actions; API consumers know retry semantics. |
| 10. Thread enhancements (examples: `17-ontology-and-threads-examples.md`) | Medium | Medium | Days | Progression tracking & prerequisites | Teachers and curriculum leaders can trace conceptual progression. |
| 11. Standardise types with refs (examples: `16-schema-and-metadata-examples.md`) | Medium | Medium | Days | Consistent types & validation | SDK/MCP engineers reduce validation drift; API consumers see consistent types. |
| 12. Expose Zod validators (examples: `20-validation-and-schema-examples.md`) | Medium | Medium | Days | Perfect type fidelity, no duplication | SDK/MCP engineers reuse validators; API consumers can opt into runtime checks. |
| 13. Response examples (examples: `16-schema-and-metadata-examples.md`) | Medium | Medium | Days | Better error handling | API consumers and teachers understand real response shapes quickly. |
| 14. Canonical URL patterns (examples: `16-schema-and-metadata-examples.md`) | Medium | Medium | Hours | URL generation | Teachers and curriculum leaders get reliable OWA links from tools. |
| 15. Resource timestamps (examples: `16-schema-and-metadata-examples.md`) | Medium | Medium | Days | Efficient SDK caching | SDK/MCP engineers cache safely; API consumers reduce unnecessary calls. |
| 16. Performance hints (examples: `16-schema-and-metadata-examples.md`) | Low | Low | Hours | Advanced optimisation | AI tool builders can plan batching and latency-sensitive workflows. |
| 17. OpenAPI best practices (examples: `16-schema-and-metadata-examples.md`) | Low | Low | Days | Better tooling & docs | API consumers and tooling authors benefit from predictable schemas. |

Effort estimates are very approximate and for orientation only. Every task needs proper sizing by the person doing the work.

See `09-schemas-endpoint-rfc.md` for the detailed plan behind item 12 (validator bundle endpoint and SDK type-gen integration).

Examples index: `10-availability-and-gating-examples.md`, `11-assets-and-transcripts-examples.md`, `12-search-and-enums-examples.md`, `13-quiz-content-examples.md`, `14-listing-and-pagination-examples.md`, `15-bulk-download-examples.md`, `16-schema-and-metadata-examples.md`, `17-ontology-and-threads-examples.md`, `18-programmes-and-identifiers-examples.md`, `19-semantic-summary-examples.md`, `20-validation-and-schema-examples.md`, `21-maths-education-enhancements.md`.

---

## Implementation Notes

### Iterative Approach

These enhancements can be implemented incrementally:

1. Start with high-priority items (descriptions, ontology)
2. Add examples and extensions to new endpoints as they're developed
3. Backfill existing endpoints during maintenance windows

### Testing Impact

After each schema change:

1. Run `pnpm type-gen` in the MCP ecosystem
2. Verify generated types and tools update correctly
3. Test AI tool discovery in ChatGPT Developer Mode
4. Measure tool selection accuracy improvements

### Cross-Team Coordination

- **API team:** Schema updates, new endpoint implementation
- **Documentation team:** Review descriptions for clarity and consistency
- **AI integration team:** Validate generated outputs, provide feedback
- **Product team:** Align tool usage guidance with user workflows

---

## Related Documentation

### External Resources

- **OpenAI Apps SDK Metadata Guidance**: <https://developers.openai.com/apps-sdk/guides/optimize-metadata/>
  - Best practices for API metadata that AI models can understand
  - Tool selection accuracy improvements
  - Real-world impact metrics

- **Model Context Protocol (MCP) Specification**: <https://spec.modelcontextprotocol.io/>
  - Open standard for AI tool integration
  - Supported by Anthropic (Claude), OpenAI (ChatGPT), and others
  - Tool descriptor format and capabilities

- **OpenAPI 3.1 Specification**: <https://spec.openapis.org/oas/v3.1.0>
  - Schema extensions (`x-*` fields)
  - Response examples and error documentation
  - Parameter metadata

- **OpenAPI Learning Site** (Official OpenAPI Initiative):
  - **Best Practices**: <https://learn.openapis.org/best-practices.html>
    - Design-first approach, single source of truth, version control
  - **Providing Documentation and Examples**: <https://learn.openapis.org/specification/docs.html>
    - `summary` vs `description` pattern
    - CommonMark 0.27 syntax for rich formatting
    - `examples` (plural) with Example Objects
  - **API Structure**: <https://learn.openapis.org/specification/structure.html>
    - Required vs optional fields in `info` object
    - Minimal viable OpenAPI description
  - **Describing Security**: <https://learn.openapis.org/specification/security.html>
    - Security schemes and requirements
  - **Enhanced Tags**: <https://learn.openapis.org/specification/tags.html>
    - Tag descriptions and external documentation
  - **Reusing Descriptions**: <https://learn.openapis.org/specification/reusing-descriptions.html>
    - `$ref` patterns and component reuse

### Oak AI Integration

- **Live Demo**: Try the current MCP tools at `https://open-api.thenational.academy/mcp` (requires API key)
- **Example ChatGPT Session**: [To be added - show real teacher using curriculum tools]
- **GitHub**: [oak-mcp-ecosystem repository link - if public]

---

## Next Steps

We'd welcome the opportunity to:

1. **Demo the current AI tools** - Show you what's already possible and what becomes possible with these enhancements
2. **Discuss implementation priority** - Especially Items #3 (ontology) and #4 (error docs) which have the biggest impact
3. **Collaborate on metadata patterns** - We can provide draft descriptions/examples for your review
4. **Share success metrics** - Once improvements are live, we'll track and share tool selection accuracy and teacher satisfaction

---

## Contact

For questions, demos, or to discuss implementation:

- AI Integration Team: [contact details]
- API Squad: [contact details]
- Slack: [channel]

For proposing additional enhancements or reporting issues, please [raise an issue in the API schema repository / contact relevant team].
