I can't write this yet because I can't tell which component you mean. The working directory (`<workspace>`) is empty. The repository has no commits, and the only file in it is `.gitconfig`. There's no code, schema, interface definition or document to read.

A specification here would list what the component must do, what it must never do, and what's deliberately left open, with the conditions and failure behaviour for each. Without the actual component I'd be inventing those, so I'd rather ask.

To start, I need:

1. **The component.** Its name and kind (service, API, library module, data pipeline, agent behaviour, and so on). Either point me to where it lives or paste its code, schema or description.
2. **Whether this is new or existing.** If it's new, I'll start from the smallest record that works. If there's an existing spec to repair or revise, point me to it and I'll keep its identifiers and show what changed from it.
3. **What the spec is for.** For example discussion, implementation, integrating with other components, operations, or backing a specific claim. That decides how detailed it needs to be.
4. **Who decides.** Whose rules count when two sources disagree, such as a product owner, an upstream standard or a regulation.
5. **Anything you already know is important** (optional). Inputs it must reject, dependencies that can fail, the users or cases it must handle, and existing tests or service-level targets.

With the component and its purpose, I'll start from one worked example of it succeeding plus the failure cases. From those I'll write the obligations with their conditions, failure and recovery behaviour, and how each will be verified. I'll also list any unknowns and how each should be handled.
