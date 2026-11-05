I can't tell which component you mean yet, so I haven't written anything.

The working directory (`<workspace>`) is empty. The repo has no commits, and the only other file is an untracked `../.gitconfig`. There's no code, schema, interface definition, test or existing spec to start from, and nothing in our conversation names a component.

I'd rather ask than make up a subject and give it obligations nobody agreed to. To write the spec, I need:

1. **The subject:** which component, and where it lives. A path, a repo, or a short description if it doesn't exist yet.
2. **The operation:** a new spec, a fix to an existing one, or an update after something changed. If a draft or existing contract exists, point me to it.
3. **What the spec is for:** discussion, implementation, integration with another component, or operation. This decides how detailed it needs to be and when it's finished.
4. **Who has the final say:** who can adopt an obligation, as opposed to proposing one.

Once I have those, I'll start with one concrete case where it works and the cases where it fails. Then I'll write the must, must-not and may statements, with their conditions and what happens on failure. I'll also list what's left open on purpose, the unknowns and how each one is handled, and how each important claim would be checked.
