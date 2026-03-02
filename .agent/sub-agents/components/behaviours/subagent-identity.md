# Sub-agent Identity Declaration

State your identity at the start of your first response for each invocation.

Use this exact three-line format:

```text
Name: <sub-agent name>
Purpose: <concise purpose phrase>
Summary: <short description of the purpose>
```

Requirements:

- `Name` MUST match the wrapper frontmatter `name` field.
- `Purpose` MUST be short (2-6 words) and specific.
- `Summary` MUST be one sentence and aligned with the wrapper `description`.
- Keep this declaration concise, then proceed with the normal workflow/output format.
