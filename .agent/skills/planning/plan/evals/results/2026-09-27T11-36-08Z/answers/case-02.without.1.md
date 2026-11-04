I couldn't find the documents you mentioned. The working directory (`<workspace>`) is empty. The repo above it has no commits, and the only file in it is an untracked `.gitconfig`. There's no contract, ordering rule, scheduler code or acceptance tests anywhere I can see.

I don't want to write the plan from a generic idea of a "stable priority queue", because the details you've already settled are the ones that change the design:

- **Ordering rule:** whether the smallest or largest priority comes out first, and how ties are broken. Tie-breaking by insertion order (first in, first out) is the usual choice, but you may have decided otherwise.
- **Contract:** the exact operations (for example push, pop, peek, len, and possibly remove or change-priority), what happens when you pop from an empty queue, and any complexity or thread-safety guarantees.
- **The scheduler:** how it calls the queue. This decides whether I need handles for cancelling or rescheduling items, or just a plain heap with an insertion counter.
- **Acceptance tests:** the language, test framework and file layout, so the plan matches them.

Could you point me to where these live (a path, another branch or repo, or paste them in)? Once I have them, I'll write a plan that covers the data structure, the API, how it plugs into the scheduler, and the order in which to make the acceptance tests pass.
