I can't write this yet because I couldn't find a component to specify. The working directory `<workspace>` is empty. The repository has no commits. The only file in the parent directory is an untracked `.gitconfig`. There's no code, schema, interface definition, design note or test for me to read. If I wrote a spec now, I'd be making up the component's obligations instead of recording them.

To get started, I need:

1. **What the component is.** Its name and kind (service, library module, UI component, API, data pipeline, agent behaviour…), plus a sentence or two on its purpose. Or the path to it if it lives somewhere else.
2. **Any existing material.** Code, an interface or schema, design notes, a ticket, or prose describing what it should do. The spec will link to these rather than duplicate them.
3. **What the spec is for.** Discussion, implementation, integration with another component, or operation. This decides how detailed it needs to be and what evidence it must plan for.
4. **Who has authority over it.** I need to know whose decisions count as adopted obligations and which ideas are still open.

Even a short description will do. From it I'll write one concrete success case and the failure cases, then the obligations and what's deliberately left open. I'll mark each open question as blocking, needing investigation or an accepted risk, and include an evidence plan.
