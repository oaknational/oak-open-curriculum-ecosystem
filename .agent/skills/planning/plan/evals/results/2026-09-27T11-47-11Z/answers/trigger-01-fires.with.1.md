Before I write anything I need two things from you, plus one note on how "two sprints" fits the planning approach.

**What I found:** the working directory (`<workspace>`) is empty. There's no feature spec, no approval record, no `.agent/plans/` folder and no templates or impact-area list for the plan to follow. I can't tell which feature "this approved feature" refers to, and I won't guess its scope or acceptance criteria.

**What I need:**
1. **The feature.** Paste the spec or brief, or point me to where it lives (a repo path, ticket or doc). Include who approved it and where, because the plan has to point to that approval.
2. **The repo.** Is this the right working directory, or is the codebase with the plan folder somewhere else? Without the plan schema and templates, I'd be writing a freeform plan that the plan validator won't accept.

**How "two sprints" fits:** under this approach, sprint assignments, dates and milestones live in Linear, not in the plan file. The rule is that anything that changes when the schedule changes belongs in Linear. So what I'd produce is:
- **A delivery plan in the repo:** the goal, who benefits and how, why the approach works, acceptance criteria each with a named proof, what's out of scope, and the work split into slices that each fit in one PR. The slices come in a fixed order, with no "start this when X ships" triggers.
- **A sprint mapping for Linear:** which slices go in sprint 1 and which in sprint 2, with a clear stopping point at the end of sprint 1. You can use it to create or update tickets.

If the feature is really a strategy or bet rather than a bounded piece of work, it needs a different kind of plan, a strategic one with delivery plans under it. I'll tell you which fits once I've seen the feature.

The plan starts as a draft and doesn't govern any work until you approve it.

Send the feature details and the repo location, and I'll draft both parts.
