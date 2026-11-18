I can't start this plan yet, for two reasons.

**1. I don't know which feature you mean.** Your message says "this approved feature" but doesn't name it, and there's nothing to look it up from. The working directory has no files, no `.agent/plans/` estate, and no commits. I won't guess the feature, its scope or its acceptance criteria.

**2. The two-sprint schedule doesn't go in the plan file.** This planning process keeps schedules in Linear, not in the repo. A plan file records what's being built, how, and how we'll know it's done. Which sprint each piece lands in goes on the Linear tickets. So what I'd produce is:
- **A delivery plan file**, written to the plan-node schema, in `sketch` status until you approve it. It would cover the goal, who it's for and why, how it works, acceptance criteria (each with how it'll be proven), what's out of scope, and the work broken into small, single-story PRs, in order.
- **A split of those PRs across sprint 1 and sprint 2**, which you or I would put on the Linear tickets. Dates stay off the plan file.

**What I need from you:**
1. **The feature.** A Linear ticket, a spec or plan file path, or a short description of what was approved.
2. **Where the work lives.** The repo or path that has the plan files and the code. This directory is empty, so either I'm in the wrong place or the repo isn't set up yet.
3. **Where the approval was given**, such as a ticket, PR or meeting note. The plan records this as its approval reference.
4. **Sprint length and team capacity**, if they're fixed, so the split between the two sprints is realistic.

Once I have the feature and the repo, I'll read the plan schema, templates and project rules there. Then I'll draft the plan and send it back for your approval.
