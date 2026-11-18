# Serendipitous learning: user-value model (draft)

The main risk here is honesty about what we know. We have an owner direction and a synthetic demo. We have no evidence yet that people want or benefit from unexpected connections. So everything below is a **proposed opportunity with assumed needs**, and it says so throughout.

## 1. Authority and evidence limits

| Item | Status |
|---|---|
| Follow unexpected connections; sessions may end open | **Owner direction** (adopted purpose). It is not a user need. |
| AI host behaviour | **Partner-controlled dependency.** We control how a suggested connection is presented, what choices people get, how sessions end and what is stored. The partner controls what the model generates, and possibly safety policy, logging and uptime. |
| Synthetic prototype demo | Shows the flow **can be rendered with a simulated host**. It does not show that the partner's host behaves this way, that people understand the flow, or that they value it. |
| Participant research | None. No needs below are research-supported. |

**Open authority questions:**
- Who defines the host's prompts and connection policy?
- Who can see and keep learners' open questions?
- Is the public audience likely to include children?

## 2. Needs (all assumed) and offered value

**Value proposition (to explore):** people using a public creative-learning service can **follow a surprising link between ideas when they choose to**. They can see why the link is being suggested, and they can leave with **a question worth carrying on with** rather than a false sense of being finished. This holds only if connections are grounded, declining is easy, and the service doesn't present an open ending as success when it was really a failure.

| ID | Assumed need (goal and reason) | Who |
|---|---|---|
| N1 | Explore an interest in a way that allows tangents, because curiosity doesn't follow a syllabus | Curious learner |
| N2 | Understand *why* two things are connected, so they can judge whether the link is real or invented | Any learner |
| N3 | Stay in control: follow, save for later or ignore a connection, and get back to their own thread | Especially people with a specific goal |
| N4 | Leave with something usable (an open question in their own words) so an unfinished session still feels like progress | Learner at the end |
| N5 | Keep working on a task without being distracted | Goal-focused learner. Proposition risk: this person may not want the feature at all |
| N6 | Rely on a host that behaves predictably and safely | Service owner and partner |

**Costs and adverse effects to track:**
- **Invented or misleading connections.** Learners bear the risk of wrong beliefs. The partner's model is the source.
- **Distraction and cognitive load.** Disabled or neurodivergent users and people short on time may be hit hardest.
- **An "unfinished" ending that feels like failure,** or that hides a host failure.
- **Privacy.** Stored questions are personal data.

## 3. Proposed journey (J1, not observed)

| Stage | What happens | Needs | Hypotheses / open questions |
|---|---|---|---|
| 0. Before entry | Person hears of the service; may not come in | Access | Who is put off by "AI" or "open-ended"? |
| 1. Start | Brings a topic, question or just curiosity | N1, N5 | Can they signal how open they are to tangents? |
| 2. Explore | Conversation with the AI host | N1 | Partner host availability |
| 3. Connection offered | Host suggests an unexpected link | N2, N3 | Is the reason visible? Is the link grounded? |
| 4. Choose | Follow, save for later, or stay on track | N3 | Is declining as easy as following? |
| 5. Follow / return | Explores the link and can get back to where they were | N1, N3 | Do people get lost? |
| 6. Ending | **(a)** answered, **(b)** open question worth keeping, **(c)** stopped confused or frustrated, **(d)** stopped because the host failed or refused | N4 | (b) must be distinguishable from (c) and (d) |
| 7. After (optional) | Returns to the question, takes it elsewhere, or doesn't | N4 | Is "doesn't return" fine? Often yes |

Recovery paths include host unavailable (d), a link the learner rejects as wrong (the answer to stage 3 is "no, that's not related"), and a person who leaves at stage 0 or 1.

## 4. One small story

```text
ID / lifecycle: S1 — candidate (not ready)
Actor and situation: A learner in a session, at the moment the host offers an unexpected connection.
Change and purpose: The offer shows a one-line reason for the link and three equal choices:
  follow / save for later / stay on my thread. Whichever they choose, their original
  thread remains one step away. Purpose: they can take the detour knowingly, without
  losing their way or feeling pushed.
Addresses: N2, N3 (expression); changes J1 stages 3–5 (realisation). Owner purpose O1.
Evidence basis: Owner direction plus synthetic demo only. Needs assumed.
  Unknown: whether a one-line reason is enough to judge the link.
Acceptance outcomes (what would be true):
  - Every offered connection shows a stated reason.
  - "Stay" and "save" take no more effort than "follow" and trigger no repeated nudging.
  - After following, the learner can return to the original point in one action.
  - A saved connection appears at the session's end.
Observation methods:
  - A defined set of test cases (varied topics, weak or false links, sensitive topics)
    run against the *partner's* host, not the simulated one, and judged against a
    written rubric by more than one reviewer. One good demo response doesn't count.
  - Short formative sessions with real people, including goal-focused ones, watching
    whether they notice, understand and feel free to decline.
Failure/recovery: The host gives no reason or a fabricated one → the offer is suppressed
  rather than shown without a reason. Learner rejects the link → they can say so, and
  that is recorded as a quality signal.
Dependencies / authority: Partner contract that the host returns a connection with a
  separable reason (or we can derive one). Agreement on logging of choices.
Readiness questions: Can the partner guarantee the reason field? Who owns the rubric?
  Where does the simulated boundary end in the current prototype?
Next action: Ask the partner about the reason-field contract; draft about 20 cases.
```

The next candidate is **S2, "Keep my open question."** At the ending, the learner can phrase or edit the open question and keep it or take it away. It links to N4 and stage 6.

## 5. Assessing success without a completion score

Keep four claims separate. Passing one says nothing about the next.

1. **Delivery acceptance (S1 works):** the rubric cases above, pass or fail against the partner host.
2. **Usability (people can use it):** formative observation of whether people understand the reason, feel free to decline and can find their way back.
3. **Experienced value (people get something from it):** see below.
4. **Learning or public benefit (it makes a difference):** not assessable yet. It needs its own study design. Don't claim it from usage data.

**For experienced value, describe endings instead of scoring them.** Record the mix of ending types (a)–(d). Neither "answered" nor "open" counts as the good outcome. The aim is to tell **a good unfinished ending** from a bad one:

| Signals of a good open ending | Signals of a bad one |
|---|---|
| Learner can state the open question in their own words | Leaves straight after an offered connection |
| Chooses to keep or edit it | Says "that's not related" or corrects the host |
| Optional one-question check-out, e.g. "What are you leaving with?" | Keeps retreating to the original thread |
| Later return or taking it elsewhere (a weak signal; not returning is fine) | Host errors or refusals right before the ending |

**What to avoid:**
- Using completion rate, time on site or number of connections followed as success. Tangents can inflate engagement while making things worse.
- Using an LLM to classify endings automatically unless that classifier is itself checked against people's own labels.
- Setting targets or sample sizes now. There's no baseline to set them from.

## 6. Coverage gaps and what would change this

- **Gaps:**
  - N5 (goal-focused learners) is only protected, not served.
  - N6 depends entirely on the partner contract.
  - Nothing covers people who never enter (stage 0).
- **Tension:** the owner wants people to follow connections, while learners need to be free not to. S1 settles this in favour of choice. The owner should confirm they're happy with that.
- **Most useful next research:** formative sessions with real people from the intended public (including sceptics and goal-focused users), looking at stages 3–6. The key question is whether people experience an open ending as a gift or as being left hanging.
- **Revisit this model if:** that research contradicts N2–N4, the partner can't provide reasons for its connections, the audience includes minors, or anyone starts making claims about learning outcomes.

**Review limits:** I reviewed this myself, in the same conversation that produced it, using the skill's review questions. There has been no independent challenge. I haven't written any files. I can save this into the repo, or split S1 into tasks, if you'd like.
