I couldn't find a specification to fix. The working directory (`<workspace>`) is empty. The only file in the parent directory is `.gitconfig`, and the repo has no commits. There's also no skill or tool here that defines an "assessment" to check the spec against.

To go ahead, I need:

1. **The spec itself.** Give me a file path, or paste the text.
2. **The assessment criteria.** Is there a rubric, template, linter, or reviewer checklist it has to pass? Without it I'd be guessing what "obligations" and "evidence" need to look like.

Once I have the spec, I'll fix the obligations and rewrite the evidence section. If you don't have a formal rubric, my default would be:
- Each obligation is a single, testable "shall" statement with a unique ID.
- Each obligation maps to at least one piece of concrete, checkable evidence in the evidence section, such as a test, an artifact, or a measurement with pass criteria.
