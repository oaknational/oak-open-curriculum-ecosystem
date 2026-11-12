# Unexpected Connections: Needs, Journey, Story and Success Measures

## 1. What we actually know

- **Evidence so far:** one synthetic prototype demo. There is no participant research, and no user has asked for this feature.
- **Where the idea comes from:** the owner's belief that following unexpected connections is valuable in creative learning.
- **Constraint:** a partner runs the AI host. That limits what we control: data handling, model behaviour, logging, and who answers when something goes wrong.

So everything below is a **hypothesis to test**, not a finding. I've written the needs as "we believe…" so nobody later mistakes the demo for validation.

## 2. Needs and value (hypotheses)

**Learners (the public, with a wide range of ages, confidence and access needs)**
- **N1:** We believe some learners want permission to wander. They want to follow a tangent without feeling they've failed the "real" task.
- **N2:** We believe learners value leaving with something to carry forward, such as a question, an image or a link. A tidy "done" matters less to them.
- **N3:** We believe learners need to stay in control. They should be able to decline, go back, or stop a tangent at any time without penalty.
- **N4:** Learners need to know when the AI made a connection and how solid it is. "This is a playful leap" is different from "this is established."

**Owner / service**
- **N5:** Show that the service encourages curiosity, not just throughput. There should be a defensible public-value story.
- **N6:** Learn whether the feature helps anyone before investing further.

**Partner / public accountability**
- **N7:** Clear boundaries on what the host may suggest (age-appropriate, no harmful rabbit holes). Also a clear split of responsibility between us and the partner for content, data and incidents.

**The value claim to test:** sessions that end on a good open question lead to more return visits, more self-directed exploration and more creative output than sessions that end at a forced conclusion. They should do this without increasing confusion or drop-off among less confident learners.

## 3. Proposed journey

1. **Start with intent.** The learner begins with their own topic or project. The feature isn't the front door.
2. **Offer a connection.** At a natural pause, the host offers one unexpected link, labelled as a leap. Example: "Spider silk and bridge cables share a design problem. Want to look?"
3. **Choose.** The learner can follow it, park it for later, or dismiss it. Each choice takes one action and none is framed as the wrong answer.
4. **Explore.** A short, bounded tangent follows. A visible trail shows where they started and offers a one-tap route back.
5. **Close with an open end.** Before the session ends, the host helps the learner phrase an unfinished question in their own words, if they want to.
6. **Keep the thread.** The question is saved to a "threads" space the learner controls: keep, edit, share or delete. No account should be required if the service is anonymous by default.
7. **Return (optional).** Next time, the thread is offered as one possible starting point, never pushed.

## 4. One small story

> **As a** learner exploring a topic,
> **I want** to save an unfinished question at the end of a session,
> **so that** I can pick up my curiosity later without having to "finish" now.

**Acceptance criteria**
- Before the session ends, the learner is offered "Leave with a question?" They can skip it with one action and see no nudge or warning.
- The host can suggest a wording, but the learner can edit it or write their own. The saved text is the learner's final version.
- The saved question shows where it came from (the connection that sparked it) and whether that link was labelled as a leap.
- The learner can view, edit and delete saved questions. Deleting removes them from our storage, and from the partner's if applicable.
- Nothing is sent to the partner beyond what the agreed data terms allow. The question text is not used for model training unless the learner explicitly consents.
- Meets the service's accessibility standard (keyboard, screen reader, plain language).
- Skipping the step does not count as failure in any metric (see below).

**Out of scope for this story:** recommendations, sharing, and resurfacing threads on return.

## 5. Measuring success without a completion score

The principle: **judge the feature across many sessions, and let each session be judged on its own terms.** An open ending is a valid outcome, not missing data.

**Label session endings, don't grade them**
Tag each session's ending as one of: *resolved*, *open question saved*, *parked*, *stopped early*, *abandoned with confusion*. Only the last one is a problem signal. Report the mix of endings; never average them into one number.

**Signals that curiosity carried on (aggregate, over time)**
- Share of saved questions revisited, edited or turned into a new session within a few weeks.
- Share of returning sessions that start from the learner's own thread.
- Whether learners edit the host's suggested wording. Editing suggests ownership; accepting unchanged may mean it's rubber-stamping.

**Signals that choice is real (guardrails)**
- Dismiss and park rates should be healthy, not near zero. Near zero may mean the offers feel compulsory.
- Rates of "take me back" after a tangent, and of confusion or abandonment right after a connection offer.
- Breakdown by first-time vs returning learners, and by accessibility needs where it's ethical to know. This checks we aren't helping the confident at the expense of everyone else.

**Quality of the connections themselves**
- A small, regular human review of sampled connections and questions, using a short rubric: surprising? Accurate or honestly labelled? Appropriate? Does it open a question rather than close one?
- A count of partner-host outputs that break content boundaries, tracked jointly with the partner.

**Qualitative evidence (needed because we have no research yet)**
- Short, optional reflection prompts. For example: "Did anything today make you want to find out more?" Not a satisfaction score.
- A handful of moderated sessions with real learners before any wider launch, deliberately including people who are wary of AI or less confident.

**Things to avoid**
- Turning "questions saved" into a target. The host would learn to pressure people into saving.
- Streaks, badges or completion bars on threads.
- Treating time-on-site as success. Wandering for a long time can also mean being lost.

## 6. Open risks and next steps

1. **Validate the need.** Run 5–8 lightweight sessions with real learners, using the prototype as a probe, before building the story. Be ready to find that people don't want this.
2. **Settle the partner agreement.** Agree data flows, retention, deletion, training use, content boundaries and incident ownership. The story's acceptance criteria depend on it.
3. **Decide the pilot kill criteria in advance.** For example: confusion or abandonment after connection offers rises noticeably, or less confident learners drop off more. Then pause or rethink.
4. **Be transparent with the public.** Say plainly that an AI run by a partner makes these suggestions, and that following them is optional.
