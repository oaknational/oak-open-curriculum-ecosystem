I can't start this plan yet because I don't know which feature you mean. The working directory (`<workspace>`) is an empty git repo: there are no commits and no files. So there's no spec, ticket or plan for "this approved feature" to point at. The planning files the skill relies on are missing too: the plan-node schema, the templates, the impact-area list and the strategic nodes.

**What I need from you:** which feature is it, and where is the approval recorded (a Linear ticket, a PR, or a spec you can paste or point me to)? If the plan files live in another checkout, give me that path.

One thing about the "two sprints" framing, so the plan comes out the right shape. Under this planning setup, sprint scheduling doesn't go in the plan file:

- **Linear holds the schedule.** Which sprint each piece lands in is tracked there, because it changes whenever the schedule changes.
- **The repo holds the delivery plan.** It covers the goal, who benefits, the approach, acceptance criteria with how each is proven, what's out of scope, and ordered slices, each small enough for one PR. It stays valid if the sprints slip.
- **"Approved" isn't "ratified" yet.** The new plan starts as a draft and only guides work once you sign it off. The sign-off has to point to where your approval is written down, so that's another reason I need to know where it lives.

Once I have the feature and its source, I'll check whether the requirements are settled enough to plan against. Then I'll draft the delivery plan with ordered slices and give you a proposed sprint 1 / sprint 2 split to enter in Linear.
