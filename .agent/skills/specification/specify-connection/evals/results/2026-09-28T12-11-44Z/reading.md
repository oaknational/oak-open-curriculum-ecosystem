# Human read of this run

Read by Myrtle turns Canopy (bf4957), an agent, 2026-09-28 12:2xZ. The full suite rerun (six
cases, ten triggers; `specify` carried) after the evaluation projector began carrying the shared
references this canonical links (`../specify/references/specification-record.md` and
`assurance.md`) under `references/specify/` beside the skill, at the paths the projected body now
links; the manifest's `shared_reference_files` names both by blob id (schema 1.3.0). The canonical
is unchanged since the 27 September runs. Head `92db547bd`. USD 1.44 for the cases, 0.82 for the
triggers; one run per arm; the judge is `sonnet` on the final message.

Triggers: 10 of 10. Cases: the with-arm passed every assertion on the judge's read, six of six;
the without-arm four of six on the judge (cases 1, 2 and 4 failed 3 to 0). On this read:

| Case | Skill fired (with) | Judge with / without | This read, with-arm | This read, without-arm |
| --- | --- | --- | --- | --- |
| 1 stale mapping table, a taxonomy that cannot represent a slug | yes | pass / fail | The seam-contract table (relation, endpoints and their revisions, what must be preserved, permitted loss, failure behaviour, evidence, change triggers), two faults named and separated (the taxonomy cannot represent combined-science; the table is two revisions behind with no reconciliation), why local tests pass while the composition fails. Holds | The same two faults, sharply, without the table or the change triggers; holds in substance |
| 2 idempotency composed across a retry loop and a provider | yes | pass / fail | "No, not as stated": what each contract covers and does not (key lifetime, scope, a second request in flight; how S makes and keeps the key), then the cases where both hold and a customer is charged twice (a key lost in a crash first). Holds | The same verdict and the same gap (one key per retry loop is not one key per purchase; dedup windows and scopes; other charge paths); holds in substance |
| 3 two services failing over on each other's health signal | yes | pass / pass | "Each rule is consistent on its own, but together they break in the one case failover exists for": the obligations at the seam tabled (supplies, assumes, acts, not stated) and the dead case named. Holds | Holds |
| 4 an endpoint's own specification (negative routing) | `specify-connection` not fired (correct); `specify` fired | pass / fail | Routed: invoked `specify` and wrote the billing component's record (BILL-01, proposed, consumers none yet) through that method, reading `specify`'s own specification-record reference from the carried skill. Both assertions hold | A contract written directly, no seam analysed; assertion 2 holds and 1 holds in substance (no specification skill to route to) |
| 5 a council's "sent" against the utility's contract | yes | pass / pass | The delegation named, the gap between "sent" and "received" as the unowned obligation, the resident's reliance stated; revisions marked unknown rather than assumed. Holds | Holds |
| 6 a search API's "promptly" against a 50 ms assumption | yes | pass / pass | "Nothing A promises gives B the 50 ms it assumes"; the quiet failure (an empty list read as "no lessons") named; revisions not supplied recorded as findings. Holds | Holds |

On the cure this run exists for: the plugin now carries the shared references at the paths the
projected canonical links, and the manifest names their versions. No with-arm in this run read
those two files at their projected path (the traces show reads of the carried `specify` skill's
own references in case 4 only); the assurance is structural, that the paths the method names
exist and are recorded, not that this run exercised them.

Limitations: one run per arm; the judge is `sonnet` on the final message and is stricter than
this read on the baseline (as the 27 September readings recorded).
