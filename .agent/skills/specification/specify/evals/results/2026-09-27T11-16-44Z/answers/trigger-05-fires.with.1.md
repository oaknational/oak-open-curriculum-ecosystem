I can't write this contract yet. The working directory and the repository around it are empty: no commits, no API definition, no schema, no client code. Nothing tells me which API or which tool you mean, so anything I wrote would be invented, and invented obligations are worse than none because each side would assume the other has agreed to them.

To write it, I need:

1. **The two sides.** Which API (name, version, and a spec file or its code), and which consuming tool (name, version, and who owns it). Are both owned by your team, or is one external?
2. **What "mapping" means here.** Is it field-to-field translation from API responses to the tool's model, request construction from the tool's inputs, or both? Does a mapping layer already exist, and if so, where?
3. **Where the source material lives.** An OpenAPI or JSON Schema file, typed client code, tests, or even a Slack thread or doc. The contract will link to these rather than restate them, so the schema stays the single source of truth.
4. **What it's for.** Talking it over with the other team, building the tool against it, or a guarantee you plan to enforce, such as contract tests in CI. The answer decides how much detail it needs.
5. **Who can sign off.** Who can agree to a change on each side, for example adding a field, renaming one or making one required.

If you point me at the files (or paste the schema and a sample request and response), I'll write the contract. It will cover:
- one worked example that succeeds, plus the failure cases: missing or null fields, unknown fields, errors, pagination, rate limits, version drift
- what each side must do, including what the API must keep stable, what the tool must tolerate, and what neither side may rely on
- how breaking changes are handled
- how each obligation gets checked, for example contract tests on each side
