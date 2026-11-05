I couldn't find a requirements document. The working directory (`<workspace>`) is empty, and the rest of the home directory only has git config files. The repo has no commits either.

Can you share the document? Either paste it here or give me its path.

Once I have it, here's what I'll do:

- **Label every statement** by kind: an observation (something seen to be true), a hypothesis (a hope or expectation not yet adopted), a design choice, a firm obligation (a promise), behaviour that's already implemented, or conformance that's been checked.
- **Rewrite each obligation precisely**: under what conditions, who or what is responsible, the observable behaviour, the limits, what happens on failure and how it recovers, and what evidence would show it's met. Any numeric target gets its unit, population, time window and threshold.
- **Keep hopes and observations separate** so none of them reads as a commitment. I'll point out any that look like they should become obligations, but won't promote them myself.
- **List what's missing** (unknown owners, vague terms, gaps) as open issues, each marked as blocking, needing investigation, or an accepted risk.
- **Map the original to the rewrite** so every original statement can be traced to where it went (kept, split, merged or dropped).

It would also help to know what the rewritten document is for, such as discussion, implementation or a contract with a customer. That decides how much precision is worth adding.
