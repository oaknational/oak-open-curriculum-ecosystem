# TSDoc and Documentation Hygiene

Use canonical TSDoc and keep documentation aligned with the code.

- Per `.agent/directives/principles.md`, document all files, modules, functions, data structures, classes, constants, and type information with TypeDoc-compilable TSDoc. This rule covers the canonical syntax and style for those docs.
- Open every TSDoc block with a plain-language summary sentence. Do not start with a tag.
- Put supporting detail in `@remarks` when the summary is not enough.
- Only use tags supported by `tsdoc.json`. Treat that file as the source of truth for allowed tags.
- Use `@packageDocumentation` for file-level documentation. Never use `@module`, `@fileoverview`, or other non-TSDoc aliases.
- Escape literal braces in prose and examples as `\{` and `\}` so `tsdoc/syntax` stays clean.
- Use TSDoc to explain intent, constraints, examples, and trade-offs. Do not narrate obvious code line-by-line.
