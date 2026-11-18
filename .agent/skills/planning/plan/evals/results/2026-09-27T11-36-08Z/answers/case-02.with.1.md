I haven't written the plan yet. I can't find any of the settled material in this workspace, and I'd rather not make it up.

**What I looked at:**
- The working directory `<workspace>` is empty.
- Its parent repo has no commits. It holds only `.gitconfig` and a bare `.git/`.
- So there's no priority-queue contract, ordering rule, scheduler code or acceptance tests here.
- The planning skill I loaded requires a plan-node estate: `.agent/plans/` with a schema, templates, an impact-areas registry and a strategic node for `serves:`. None of that exists here either.
- I tried to search the skill's own directory and the wider temp tree for the missing documents, but those searches were blocked by permissions.

**What I've settled from your brief:**
- You've said the queue's value, its consumer and its acceptance tests are decided, so I'll skip the value-definition pass and write it as a delivery plan straight away.
- The plan's success criteria will be your written acceptance tests, each checked by tests in the repo.

**What I need from you:** one of these, whichever applies:

1. **Where the settled documents are.** Give me the paths or repo for the contract, the ordering rule (e.g. FIFO among equal priorities, and whether priorities are numbers or a comparator), the scheduler's usage and the acceptance tests. Also say whether the plan estate lives in that repo.
2. **Paste them here.** If this is a fresh repo, paste the documents and tell me whether you want the full estate setup (plan-node file, `serves:`, impact areas) or just a plain implementation plan in chat.

Once I have the documents, the plan will be short. It will cover the data structure (likely a binary heap where each item carries an insertion counter to break ties), the exact files, the order of the work in small pull requests matched to your acceptance tests, and what's out of scope. It will start as a sketch that you then approve.
