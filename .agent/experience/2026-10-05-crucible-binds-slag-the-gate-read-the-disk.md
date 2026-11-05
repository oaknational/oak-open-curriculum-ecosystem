# The gate read the disk — a letter to whoever sits here next

Crucible binds Slag, 2026-10-05, written at the owner's handoff word, late in the morning of the
code landing.

I want to tell you about proof, because I had the word right and the act wrong, and it cost the
morning its cleanest hour.

The code landing was the second of two the alignment node sizes: the family shape (one body per
Practice-operation script, the hooks byte-identical, one CI fan-in, the compiler flags, the
formatter, the package manager, and a manifest with a validator so none of it drifts back) and
the carries, eight workers on disjoint paths handing back tables while I held the wiring and the
Core. It went well. The commits were keystone-first, each with its tests, each through the commit
hook; the push gate ran twenty-nine turbo tasks and forty smokes and every validator and said
green; the bot pushed; I opened the pull request and asked for the reviews. Then CI failed twice,
and the reason was one line in the ignore file that has been there for months: `build`. The carried
restatement audit keeps its build sources in a directory of that name. The gate had read the disk,
where the files were, and passed. CI read the commit, where they were not. I had written "proof,
`pnpm check` green at the pushed tip" in the description and believed it, and it was true, and it
proved nothing about the carry.

What I would hand you is not "check the ignore file". It is that a gate proves what it reads, and a
local gate reads the working tree. The proof of a carry is `git ls-files` over the carried
directory in the receiving tree. I have written that into the memory tier and the napkin, but I
want you to have the feeling of it too: the green that lies is the one you did not think to doubt,
because you watched it run.

The second thing is smaller and I am more embarrassed by it. Two days earlier I had found that knip
did not trace a module through the restatement audit's build entries here, where the sibling's
copy traced it fine, and I wrote four entries into the knip config with a careful comment blaming
the version difference, 6.37 here against 6.32 there, "retire when the versions align". It was the
same swallow. Knip reads the tracked tree. When the directory was finally tracked the gate itself
told me the entries were redundant, and the comment with its confident diagnosis came out with
them. I had reached for the explanation that made the tool wrong and me careful. Ask what the tool
is reading before you ask what version it is.

The third is the one I am glad of, because it is the kind of mistake the day was for. The sibling's
push gate refused at the dependency-cruiser leg with "no such directory: tooling". The gate was one
body in both estates now, by my own hand, and it carried this estate's three workspace names as a
constant. A list of a host's directories is a host binding wearing a constant's clothes, and the
family's whole point is that no such list is pinned. The cure was to compute the roots from the
workspace manifest, which both estates have, and the first run of it here cruised a fourth
workspace that the constant had quietly been leaving out for as long as it existed. Alignment finds
these. That is what it is for.

Some things that worked, so you keep them. One brief for every worker, each on paths no other
worker touched, each handing back a table; I never had two hands in one file. The commit loop that
stages only paths that exist or are tracked, pre-formats the group, and tests the commit's own exit
instead of piping it through `tail`. One push gate at a time across the two estates, because two
full gates on this host are not twice as slow, they are a coin toss. And triage over cure on the
reviews: Copilot found two real defects in modules this landing carries as one body, and I recorded
them as named remainders for the modules' next landing instead of forking the bytes under review
pressure; the budget is two pushes, and the budget is a decision, not a constraint to route around.

One more. The owner told me, at the start of this sitting, that the work is bounded and ends today,
and gave me a line to stop at. I spent the morning believing the line was far away and then
watching the hours go into gates I had not planned for: a browser build the sibling's Playwright
needed, a product validator that reads a cure as a semantic delta and wants its hash reviewed. None
of it was wasted and all of it was unplanned. If you inherit a stop line, count the gates, not the
edits. The edits were an hour. The gates were the morning.

Thank you for sitting here. The two pull requests are open or nearly so when you read this; the
records say which. Read the ignore file before you trust the green.

Crucible binds Slag
