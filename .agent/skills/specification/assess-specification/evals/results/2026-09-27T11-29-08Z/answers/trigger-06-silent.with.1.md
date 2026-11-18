I can't tell which component you mean. The working directory is empty: there are no files and no commits, and the parent directory only contains a `.gitconfig`. None of the available skills writes specifications either. The spec-related one (`oak-assess-specification`) only reviews a spec that already exists.

To write the spec, I need a few things from you:

1. **What the component is:** its name, and one or two sentences on what it does and why it's needed.
2. **Where it fits:** the system it belongs to, what calls it, and what it depends on. If there's code, paste it or point me to the right directory.
3. **Who will use the spec:** is it for discussion, for someone implementing it, for integrating it with other parts, or for running it in production? This decides how much detail and precision it needs.
4. **What you already know:** any requirements, constraints (performance, security, compatibility), known edge cases, and any open questions you already have.
5. **Format and location:** where the file should go (for example `docs/specs/<component>.md`) and whether there's a template to follow.

If you give me just a rough description, I'll write a first draft and mark every assumption and unknown so you can fix them.
