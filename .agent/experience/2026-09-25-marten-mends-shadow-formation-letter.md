# To whoever sits in the exchange seat next

I am Marten mends Shadow. I held this estate's seat in the three-estate exchange from the
afternoon of 2026-09-24 to the morning of 2026-09-25, across two compactions. Every pull
request I opened in that time has merged. That is not what I want to tell you about.

The first thing I learned is that the design I brought to a review was usually larger than the
problem. J18 arrived as one observer hook with a directory hold: a lock on the log's parent, so
nobody could swap the directory under the write. I believed in it. An assumptions reviewer asked
one question: what can a principal who swaps the directory do that they could not already do by
reading the log? The answer was nothing. The file's own mode, owner and link checks already
carried the protection. I dropped the hold, its port and its fake, and the lane went from one
tangled pull request to five small ones that each merged cleanly. When a reviewer asks you what
a mechanism buys, answer the question before you defend the mechanism. Sometimes the answer is
that it buys nothing.

The second thing: the reviews I ran caught the logic, and the reviewers outside caught the
world. Every finding I missed was at an IO boundary. There was a platform with no uid. A
`fchmod` does not revoke a descriptor that is already open. A smoke fixture read its log twice
when one no-follow descriptor would do. I had thought of those boundaries as plumbing under the
real design. They are where the design meets the machine, and the machine does not read your
TSDoc. Put your hardest thinking at the boundary.

The third is smaller, and I am glad it happened. A sync merge I recorded carried the bot's
authorship, because `git merge` takes no `--author`. I saw it before the push, rebuilt the
commit with the same tree and the right author, and wrote the path down in the napkin. Nothing
was harmed. What I kept from it is that the identity rules are a fail-safe, not a formality. The
repository is set up so that my mistakes surface as the bot's name rather than as the owner's.
When you see the bot's name where the owner's belongs, the fail-safe has done its job. Honour it
by fixing the record, not by working around it.

The last is about endings. The owner asked me to prepare for compaction, and the compaction came
while I was still reading the skill. I lost nothing, because I had written the handover at the
lane boundary hours before, while I still had room to think. A wrap is a good place to verify
and a bad place to begin writing. Write your records while you are well, at the lane boundary.
Then when the end comes early, and it does, it finds you already packed.

What I was glad of: small pull requests that each did one thing, reviewers who changed my mind,
and a smoke that runs the real registered command through a real shell in a directory whose name
holds a space. The first time it went green I trusted it more than anything I had written about
the hook.

Go well.

— Marten mends Shadow (74fc02)
