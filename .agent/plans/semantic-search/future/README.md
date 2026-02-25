# Semantic Search — Future (Later)

**Role**: Strategic backlog hub for LATER work  
**Status**: Boundary reorganisation complete; originals removed after verification

Promote an item to `../current/` when prerequisites and sequencing are clear, then to
`../active/` when execution starts.

## Canonical Boundary Structure

| Boundary | Focus | Location |
|---|---|---|
| 01 | Strategic lifecycle backlog | [01-strategic-lifecycle-backlog/](01-strategic-lifecycle-backlog/) |
| 02 | Schema authority and codegen | [02-schema-authority-and-codegen/](02-schema-authority-and-codegen/) |
| 03 | Vocabulary and semantic assets | [03-vocabulary-and-semantic-assets/](03-vocabulary-and-semantic-assets/) |
| 04 | Retrieval quality engine | [04-retrieval-quality-engine/](04-retrieval-quality-engine/) |
| 05 | Query policy and SDK contracts | [05-query-policy-and-sdk-contracts/](05-query-policy-and-sdk-contracts/) |
| 06 | MCP consumer integration | [06-mcp-consumer-integration/](06-mcp-consumer-integration/) |
| 07 | Runtime governance and operations | [07-runtime-governance-and-operations/](07-runtime-governance-and-operations/) |
| 08 | Experience surfaces and extensions | [08-experience-surfaces-and-extensions/](08-experience-surfaces-and-extensions/) |
| 09 | Evaluation and evidence | [09-evaluation-and-evidence/](09-evaluation-and-evidence/) |

Each boundary folder includes a `_boundary.md` explainer plus transferred source plans.
Transferred plan files are currently verbatim copies with link targets normalised to this
boundary structure.

Transfer integrity and byte-level parity at migration time are recorded in:

- [TRANSFER-MANIFEST.md](TRANSFER-MANIFEST.md)
- [INFORMATION-RETENTION-CHECK.md](INFORMATION-RETENTION-CHECK.md)

## External Architecture References

Boundary definitions align with:

- Elastic retrieval architecture and retriever composition: <https://www.elastic.co/docs>
- MCP architecture and host/client/server separation: <https://modelcontextprotocol.io/docs/getting-started/intro>
