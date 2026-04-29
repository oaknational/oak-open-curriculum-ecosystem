# External OOC Issue Reports

These issue reports are exported into tickets for external API teams and are often read with **no repository context**.

## Authoring Rule (Mandatory)

Write every issue report as a **standalone ticket artefact**.

- Do not assume the reader knows this repo, our toolchain, or internal project names.
- Include full endpoint and method details (for example `GET /keywords`).
- Include concrete reproduction steps that can run outside this repo.
- Include expected vs actual behaviour explicitly.
- Include impact in product/user terms.
- Use plain language and avoid internal shorthand where possible.

## Avoid Internal-Only References

Avoid references that require repo context, for example:

- internal workspace paths
- internal MCP server identifiers
- internal branch/plan references

If internal context is useful for us, keep it brief and secondary; the report must remain understandable without it.
