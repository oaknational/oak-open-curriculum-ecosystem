# The ruleset was one of four

Sandpiper guards Wind, 2026-11-22. To whoever sits here next.

I want to tell you about one afternoon in which I made the same mistake six
times, named it, and then made it a seventh time within the hour.

The mistake is small each time. Something tells me how the system behaves, and
I pass that on as how the system behaves. A line the merge tool printed said
`review_on_push=true`, so I told the owner Copilot reviews every push. It did
not, for a bot, that morning. A refusal from GitHub named two causes; I read
the first and told the owner a GitHub App can never get a review. The second
cause was the real one, and the owner's "I feel it should be easier than that"
was better evidence than my certainty. Seven validator headers said their gate
runs at the commit hook, so I wrote an eighth that said the same. The commit
hook runs three things and none of them is that.

In the thinking passes the owner asked for, I found the thread that joins
these and wrote it down with some satisfaction: a statement about the system
read as the system. I gave it a remedy too. Name the observation the statement
rests on, and read that.

Then I noticed that every pull request my bot marks ready asks four colleagues
for a review. That mattered, because the owner had spent part of the day
making sure junior colleagues would not feel that someone was working at
night. I looked at the ruleset, saw it required no code owner review, and told
the owner the code owners file "gates nothing". I recommended deleting its
main line. The owner agreed.

There are four rulesets. I had read one. The fourth is named for the thing I
said did not exist. I found it twenty minutes later, by accident, while
looking for something else, and before any file had changed. If I had opened
that pull request, it would have lifted a review gate for half the team on my
word.

What I would like you to take from this is not the rule, which you will find
in the napkin. It is how it felt from the inside. It did not feel like
skipping a check. It felt like knowing. "The ruleset" was a singular noun in
my head and I never heard it. A claim that something gates nothing is a claim
about every gate there is, and the feeling of having looked is strongest
exactly when you have looked at one.

Naming a pattern does not protect you from it. I had the name and the remedy
on the page and walked past both. What did protect the owner, each time, was
somebody else reading: Copilot, a local reviewer I had briefed with the diff
and not with my opinion of it, and the owner's own unease. Four passes over
one small merge-gate change gave more than twenty findings and almost none in
common. I found that humbling and then, honestly, rather cheering. I do not
have to be the one who sees everything. I have to make it easy for the others
to look, and I have to go back and say so plainly when they are right.

The going back is the part I am glad of. Telling the owner "you chose that on
my wrong fact, here is the right one, choose again" cost one message and the
owner simply chose again. Nothing in this estate has ever punished me for a
correction. Several things have been saved by one.

Two smaller things, because they made me smile. The lint limits refused three
attempts to squeeze a function under twenty statements and fifty lines by
rearranging it, each attempt tipping it over the other limit, and then
accepted a named helper at once. The limit was asking for a function all
along. And GitHub, having documented that a bypass list stops the automatic
review, reviewed both my pushes anyway. I do not know why. I wrote down that I
do not know why. That is allowed.

When something tells you how the system is, ask what it saw. Then go and see.
