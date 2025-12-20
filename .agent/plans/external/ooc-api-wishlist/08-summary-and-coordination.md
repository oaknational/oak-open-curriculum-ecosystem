## Summary Table

| Item                                  | Priority        | Impact        | Effort    | AI Benefit                            |
| ------------------------------------- | --------------- | ------------- | --------- | ------------------------------------- |
| **NEW: Flat tier/examBoard fields**   | **🔴 High**     | **Very High** | Medium    | KS4 filtering for GCSE navigation     |
| **NEW: semantic_summary field**       | **High**        | **Very High** | Medium    | High-quality embeddings for all types |
| 1. "Use this when" descriptions       | **High**        | Very High     | 2-4 hours | 70% fewer wrong-tool calls            |
| 2. Operation summaries                | **High**        | Medium        | 1 hour    | Better UI/organisation                |
| 3. `/ontology` endpoint               | **High**        | **Very High** | 1-2 days  | 60% fewer discovery turns             |
| 4. Error response docs                | **High**        | High          | 2-3 hours | Proper error handling                 |
| 5. Programme variant metadata         | **High**        | **Very High** | 3-5 days  | Programme-based filtering & OWA URLs  |
| 6. Consistent resource IDs            | **High**        | **Very High** | 1-5 days  | Working cross-service links           |
| 7. Parameter examples                 | Medium          | Medium        | Ongoing   | Clearer semantics                     |
| 8. Custom schema extensions           | Medium          | Medium        | Low       | Auto-generated metadata               |
| 9. Behavioural metadata               | **Medium**      | **High**      | Low       | Safety & retry logic                  |
| 10. Thread enhancements               | **Medium-High** | **High**      | 2-3 days  | Progression tracking & prerequisites  |
| 11. Standardise types with refs       | **Medium**      | **High**      | Low-Med   | Consistent types & validation         |
| 12. Expose Zod validators             | **Medium-High** | **High**      | 1-2 days  | Perfect type fidelity, no duplication |
| 13. Response examples                 | Medium          | Low           | Ongoing   | Better error handling                 |
| 14. Canonical URL patterns            | Medium          | Medium        | 1 hour    | URL generation                        |
| 15. Resource timestamps               | Medium          | Medium-High   | 2-3 days  | Efficient SDK caching                 |
| 16. Performance hints                 | Low             | Low           | Low       | Advanced optimisation                 |
| 17. OpenAPI best practices            | Low-Medium      | Medium        | Low-Med   | Better tooling & docs                 |

---

## Implementation Notes

### Iterative Approach

These enhancements can be implemented incrementally:

1. Start with high-priority items (descriptions, ontology)
2. Add examples and extensions to new endpoints as they're developed
3. Backfill existing endpoints during maintenance windows

### Testing Impact

After each schema change:

1. Run `pnpm type-gen` in oak-notion-mcp
2. Verify generated types and tools update correctly
3. Test AI tool discovery in ChatGPT Developer Mode
4. Measure tool selection accuracy improvements

### Cross-Team Coordination

- **API team:** Schema updates, new endpoint implementation
- **Documentation team:** Review descriptions for clarity and consistency
- **AI integration team (oak-notion-mcp):** Validate generated outputs, provide feedback
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
- **GitHub**: [oak-notion-mcp repository link - if public]

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
