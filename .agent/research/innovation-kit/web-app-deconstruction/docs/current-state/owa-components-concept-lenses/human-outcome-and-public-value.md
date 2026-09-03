# OWA and Oak Components through human-outcome and public-value lenses

## Purpose and method

This record asks what Oak Web Application (OWA), Oak Components and the boundary
between them look like when the primary unit is a human outcome or public value,
not a route, package, component or runtime. It applies OCE's pinned
[`concept-exploration`](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/skills/concept-exploration/SKILL-CANONICAL.md)
workflow separately through nine lenses. Each pass runs all four movements before
convergence is considered:

1. reflect on literal observations and expose inherited assumptions;
2. define a mechanism-neutral problem space;
3. reopen competing explanations and possible solution shapes; and
4. synthesise only warranted next investigations, each with a falsifier.

The examined revisions are:

| Source                        | Pinned revision                                                                                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Oak Web Application           | [`510ac63a62fb37a70183b00ce0f5fb15be4491e5`](https://github.com/oaknational/Oak-Web-Application/tree/510ac63a62fb37a70183b00ce0f5fb15be4491e5)           |
| Oak Components                | [`8ff8264fa921e4e40fdaf9a99b02fd156c699cc8`](https://github.com/oaknational/oak-components/tree/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8)                |
| OCE Concept Explorer Practice | [`bd878a3a550c8e5e5d21163a6d0962cebdaf43fa`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa) |

This is current-state research. It does not prescribe an OCE architecture and it
does not propose repairs to OWA or Oak Components.

## Epistemic discipline

- **Observed** means the pinned source directly encodes the stated behaviour or
  declares the stated intent.
- **Inferred** means the statement is a reasoned interpretation of those
  observations. It is not a fact about production use or impact.
- **Unknown** means the repositories cannot establish the answer. Plausible
  product intent is not substituted for evidence.
- A component's name, copy or test can establish an encoded interaction. It
  cannot establish that a person understood it, could use it in context, or
  benefited from it.
- An analytics event can establish what the application attempts to observe. It
  cannot establish that the event measures the intended human outcome.

## Boundary vocabulary

For this pass:

- **OWA** means application orchestration, routes, remote authorities, workflow
  state, persistence, application policy and OWA-local presentation.
- **Components** means the published package's primitives, patterns and the
  teacher/pupil product-shaped components it exports.
- **Boundary** means the point at which application facts and policies become an
  interaction contract. It is an analytical seam, not a proposal for another
  package.

---

## Lens 1: teleology and Jobs-to-be-Done

### Governing question

What progress are teachers, pupils and other participants trying to make, and
where do the present mechanisms stand in for that intended progress?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** The teacher homepage describes the offer as free,
  time-saving resources and names browsing and downloading worksheets, quizzes
  and slides. The rendered hero instead foregrounds helping teachers deliver a
  world-class curriculum, offers curriculum plans, teaching resources and AI
  tools, and starts with a subject/phase picker
  ([page metadata](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/index.tsx#L49-L69),
  [teacher hero](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GenericPagesComponents/TeachersTab/TeachersTab.tsx#L22-L125)).
- **Observed (OWA):** The pupil homepage promises a path from year group,
  subject and lesson to free lessons, videos and quizzes
  ([pupil page](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/pupils/index.tsx#L13-L35)).
- **Observed (OWA):** A teacher lesson projection combines learning outcomes,
  key learning points, misconceptions, tips, equipment, guidance, slides,
  worksheets, videos, quizzes, downloads, sharing and notes. It also records
  distinct analytics intentions for using resources, media and AI material
  generation
  ([lesson inputs](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonOverview/LessonOverview.view.tsx#L91-L130),
  [analytics intentions](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonOverview/LessonOverview.view.tsx#L218-L280)).
- **Observed (OWA):** Search inserts an invitation to generate a tailor-made
  lesson with Aila after the fifth result, so one result journey can change from
  retrieving existing material to creating new material
  ([search result composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/SearchResults/SearchResults.tsx#L58-L113)).
- **Observed (Components):** The package declares itself a React/TypeScript
  library for Oak-produced applications, but its public OWA surface exports
  teacher notes, pupil browse, lesson and quiz families as well as lower-level
  controls
  ([declared scope](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L7-L17),
  [OWA exports](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/index.ts#L1-L42)).
- **Observed (boundary):** OWA supplies lesson facts, workflow state, event
  handling and persistence while Components sometimes supplies a named,
  product-language interaction. For example, OWA grades a question and chooses
  feedback state; Components renders the lesson shell, hint and
  correct/incorrect feedback
  ([OWA composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/pupil/lessons-pages/new/QuizPageContent.tsx#L385-L463),
  [Components bottom navigation](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/lesson/OakLessonBottomNav/OakLessonBottomNav.tsx#L21-L74)).

#### Initial interpretation and inherited assumptions

- **Inferred:** `teacher` and `pupil` are audience categories, not complete
  jobs. Planning tomorrow's lesson, adapting a sequence, teaching, setting work,
  revising independently and evidencing progress can have different desired
  outcomes even when they use the same content.
- **Inferred:** The present surface contains several plausible job chains, but
  repository structure does not show which are primary, which are supporting,
  or where a person's job begins and ends outside Oak.
- **Unknown:** There is no pinned evidence here that the labels `explore`, `use`
  or event completion correspond to successful teacher or pupil progress.

### Movement 2: define the problem space

**Problem frame (Inferred):** An educational service must help a person make
intended progress in a real situation. The gap is not a missing page or
component; it is any break between the person's circumstance and desired
progress, the sequence of decisions and actions they must take, and the outcome
they can carry into teaching or learning. It harms teachers when activity creates
work without usable preparation or classroom confidence, and harms pupils when
activity does not produce understanding, agency or a useful account of progress.

The causal chain to examine is:

```text
situation -> desired progress -> discovery -> judgement -> adaptation/action
          -> use outside or inside Oak -> human outcome -> trustworthy evidence
```

**Constraints (Inferred):** Different roles can share mechanisms without sharing
jobs; important progress can occur outside the browser; protective friction can
be legitimate; and public educational value cannot be reduced to conversion.

**Success (Inferred):** For each material journey, the intended human progress,
its preconditions, its continuation beyond Oak, and evidence capable of
disproving success are legible end to end.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                | Reopened interpretation                                                                                                                                              |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Changed assumption:** Teacher and pupil sites are jobs.       | **Inferred:** They are entry partitions. Several incompatible jobs can exist within either partition.                                                                |
| **Changed assumption:** Resource use is the outcome.            | **Inferred:** Viewing, saving, sharing or downloading can be an intermediate hand-off into planning, teaching, homework or revision.                                 |
| **Changed assumption:** Search failure needs more search.       | **Inferred:** The Aila insertion may address an unmet creation job, may be a helpful fallback, or may divert a retrieval job. Source alone cannot choose among them. |
| **Changed assumption:** Reusable UI is value.                   | **Inferred:** Reuse can preserve a valuable interaction, or efficiently reproduce a mechanism that does not advance the job.                                         |
| **Competing explanation:** Breadth reflects a coherent service. | **Inferred:** The lesson projection may intentionally assemble the whole preparation job, or may be accumulated adjacent capabilities.                               |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** OWA encodes explicit audience propositions and many
activity-level intents, but the repositories do not expose a warranted map from
those activities to human progress. The important seam is therefore **human
intent -> application journey -> interaction contract -> outcome in context**.
The package boundary occasionally divides one interaction across application
policy and product-language UI, but that fact alone neither validates nor
invalidates the boundary.

| Warranted next investigation                                                                                                                        | Warrant                                                                                                                               | Explicit falsifier                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reconstruct jobs from contextual inquiry with teachers, pupils and mediating adults, sampled across planning, classroom use, homework and revision. | Audience labels and repository journeys underdetermine the progress people seek and the work performed outside Oak.                   | The observed situations converge on a small, already documented set of jobs whose steps, outcomes and failure signals fully explain the encoded journeys. |
| Trace three complete outcome chains: find/adapt/teach a lesson, set/share work, and independently complete/review a lesson.                         | These journeys cross content, application, Components and real-world hand-offs; local usability cannot establish end-to-end progress. | Each chain already has an owned outcome definition, end-to-end evidence and no material unobserved hand-off.                                              |
| Compare analytics vocabulary with the reconstructed outcome chains.                                                                                 | Current event names encode platform activity and engagement intent; their relationship to human success is not established here.      | Every material outcome and failure state is already measured by a validated indicator, while activity events are explicitly treated only as diagnostics.  |

#### Unresolved evidence

- **Unknown:** Which jobs participants consider most important and which they
  currently complete with tools or people outside Oak.
- **Unknown:** The causal relationship between discovery, download, save, share,
  AI generation or lesson completion events and classroom or learning outcomes.
- **Unknown:** Whether product-shaped Components exports express stable jobs
  needed by additional consumers or primarily OWA's current interaction wording.

---

## Lens 2: pedagogy, learning science and assessment validity

### Governing question

What claims about learning and assessment are embodied by the journeys, and
what evidence would make the resulting inferences educationally valid rather
than merely computable?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** Teacher lesson data distinguishes a pupil lesson outcome,
  key learning points, misconceptions and responses, teacher tips, equipment,
  content guidance, starter questions and exit questions
  ([lesson model use](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonOverview/LessonOverview.view.tsx#L91-L130),
  [key learning points](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/LessonOverviewKeyLearningPoints/LessonOverviewKeyLearningPoints.tsx#L12-L56),
  [misconceptions](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/LessonOverviewCommonMisconceptions/LessonOverviewCommonMisconceptions.tsx#L13-L55)).
- **Observed (OWA):** Experiment-controlled explanatory copy says slides break
  learning into concepts using learning cycles with explanations, checks for
  understanding, practice and feedback
  ([slide-deck projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonOverview/LessonOverview.view.tsx#L471-L505)).
- **Observed (OWA):** The teacher projection labels the starter quiz as a check
  of necessary prior knowledge and the exit quiz as a test of key-learning-point
  understanding that can later be used for retrieval practice
  ([starter and exit descriptions](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonOverview/LessonOverview.view.tsx#L671-L775)).
- **Observed (Components):** The pupil lesson layout names a fixed vocabulary of
  overview, intro, starter quiz, video, exit quiz and review, with section-specific
  presentation and optional celebratory imagery
  ([lesson sequence and layout](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/lesson/OakLessonLayout/OakLessonLayout.tsx#L12-L31),
  [section treatments](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/lesson/OakLessonLayout/OakLessonLayout.tsx#L175-L280)).
- **Observed (OWA):** Client code grades multiple-choice, short-answer, ordering
  and matching tasks by dispatching on question type. Completion is a separate
  state from correctness, and review becomes the destination after required
  sections are complete
  ([grading dispatch](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/pupil/lessons-pages/new/quizPageContentHelpers.ts#L96-L150),
  [completion routing](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/pupil/lessons-pages/new/quizPageContentHelpers.ts#L27-L66)).
- **Observed (boundary):** OWA determines the grade, partial-correctness state,
  correct-answer explanation and whether to celebrate. Components turns that
  into `Correct`, `Incorrect` or `Almost correct`, an alert and optional answer
  feedback
  ([OWA feedback composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/pupil/lessons-pages/new/QuizPageContent.tsx#L342-L365),
  [Components feedback semantics](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/quiz/OakQuizFeedback/OakQuizFeedback.tsx#L8-L75)).
- **Observed (OWA):** Persisted attempt data can include per-question answers,
  grades, correctness feedback, correct answers and whether a hint was offered,
  plus video and worksheet activity
  ([attempt schema](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/pupil-api/types/lessonAttempt.ts#L43-L117)).

#### Initial interpretation and inherited assumptions

- **Inferred:** The system embodies a pedagogical theory involving prerequisite
  activation, explanation, practice, feedback, post-instruction assessment,
  review and possible retrieval.
- **Inferred:** The scoring code proves reproducible classification under encoded
  rules. It does not prove that a question elicits the intended construct, that
  scoring warrants the learning inference, or that feedback improves learning.
- **Unknown:** The pinned repositories do not contain validity arguments,
  item-development evidence, learner studies, psychometric results or a record
  of how assessment evidence changes teaching.

### Movement 2: define the problem space

**Problem frame (Inferred):** An educational interaction creates value only when
the intended learning claim, task, response, scoring rule, feedback and ensuing
action remain aligned. A failure can produce an invalid inference even when the
UI is accessible and the software is correct: the task may measure a different
construct, the interaction may add irrelevant difficulty, binary feedback may
erase useful uncertainty, or completion may be mistaken for learning.

The validity chain is:

```text
curriculum intent -> learning claim -> teaching/learning activity -> elicited response
                  -> scoring interpretation -> feedback -> next action -> later evidence
```

**Who is harmed (Inferred):** Pupils can receive misleading feedback or encounter
avoidable construct-irrelevant load; teachers can make decisions from evidence
that does not support the claimed inference; curriculum authors can have their
intent altered by projection or interaction.

**Constraints (Inferred):** Different subjects, ages, modalities and purposes
require different evidence; formative prompts and summative claims are not
interchangeable; and a pedagogical pattern's consistency does not establish its
universal suitability.

**Success (Inferred):** Each consequential learning inference is traceable to an
intended construct and supported by evidence that the task, interaction, scoring
and feedback are appropriate for its use and population.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                 | Reopened interpretation                                                                                                                                                  |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Changed assumption:** A quiz with correct scoring is valid.    | **Inferred:** Software correctness is one link in a validity argument; content alignment, response process, fairness and intended use remain separate.                   |
| **Changed assumption:** The six lesson stages are pedagogy.      | **Inferred:** They may be a useful scaffold, a product navigation vocabulary, a content-production convention, or all three. Their names do not prove learning efficacy. |
| **Changed assumption:** Immediate feedback is always helpful.    | **Inferred:** Timing and specificity can aid learning, disclose answers prematurely, encourage guessing, or create dependence depending on purpose and context.          |
| **Changed assumption:** More assessment data means more insight. | **Inferred:** Fine-grained answers and activity can support reflection, but can also invite unsupported inference or unnecessary collection.                             |
| **Competing explanation:** Uniform components preserve pedagogy. | **Inferred:** They may preserve an evidence-based pattern, or make current wording and reward semantics difficult to vary when evidence or context changes.              |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** OWA and Components encode a substantial learning and
assessment model, not a neutral content viewer. The most important seam is
**curriculum claim -> learning activity -> response -> assessment inference ->
next action**. Application code owns much of scoring and progression while
Components owns consequential feedback and lesson-stage semantics. Static source
establishes this distribution but cannot establish pedagogical validity.

| Warranted next investigation                                                                                                                      | Warrant                                                                                                                     | Explicit falsifier                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Audit claim lineage for a stratified sample of lessons across subjects, phases and question types, from authored outcome through UI and feedback. | The model contains distinct learning claims and task forms, but their alignment is not visible at the application boundary. | Every sampled item has a complete reviewed validity chain, and independent subject experts find no material loss or construct mismatch in projection.     |
| Observe pupils' response processes for each interactive question form, including keyboard, touch and assistive technology use.                    | Ordering and matching interactions can introduce demands unrelated to the intended subject construct.                       | Representative pupils interpret and operate each form as intended, with no systematic construct-irrelevant difficulty or subgroup difference.             |
| Examine how teachers actually use starter results, exit results, misconceptions and lesson-review output in subsequent decisions.                 | The UI describes purposes such as prerequisite checking and retrieval, but intended and actual use can diverge.             | Observed use consistently matches the claimed purpose and produces decisions supported by the evidence, including known limitations.                      |
| Review the evidence behind feedback timing, wording, hints and celebration by age and assessment purpose.                                         | Components fixes `Correct`, `Incorrect`, `Almost correct`, hint and celebratory interaction semantics across consumers.     | Existing research and live evidence already justify the same semantics for each served population and use, with monitored guardrails for adverse effects. |

#### Unresolved evidence

- **Unknown:** Authorship, review and change authority for learning outcomes,
  questions, scoring rules and pedagogical interaction language.
- **Unknown:** Reliability, fairness and validity evidence for question sets or
  the meaning of a stored grade.
- **Unknown:** Whether review and retry cause durable learning, answer recall,
  disengagement or another outcome.
- **Unknown:** Whether additional consumers require the same lesson sequence and
  feedback semantics or only the underlying capabilities.

---

## Lens 3: teacher cognitive ergonomics and workflow

### Governing question

How does the system shape teacher attention, memory, decision load, mode
switching and recovery during real preparation and teaching work?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** The teacher entry point starts with subject and phase and
  advertises three resource families rather than beginning from a single named
  task
  ([teacher entry interaction](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GenericPagesComponents/TeachersTab/TeachersTab.tsx#L90-L125)).
- **Observed (OWA):** A lesson overview offers a sticky section navigation and
  groups guide, slides, media, lesson details, video, worksheet, starter quiz,
  exit quiz and additional material into one projection
  ([section navigation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonOverview/LessonOverview.view.tsx#L387-L435),
  [resource composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonOverview/LessonOverview.view.tsx#L442-L568)).
- **Observed (OWA):** Search paginates twenty results, moves focus to the first
  result after pagination and interleaves an AI-generation offer after five
  items
  ([search interaction](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/SearchResults/SearchResults.tsx#L39-L128)).
- **Observed (OWA):** Saving a unit changes between `Save` and `Saved`; signed-out
  saving opens a sign-in modal. The button's accessible name includes the unit
  title
  ([save interaction](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/SaveUnitButton/SaveUnitButton.tsx#L35-L78)).
- **Observed (OWA):** Teacher notes provide rich text, a 2,000-character limit,
  save after more than fifty changed characters and save on blur. OWA validates
  and highlights detected PII during save. Its share handler starts that save
  without awaiting it, conditionally copies an existing URL, then sets the
  shared feedback flag; the rendered share control is disabled while validation
  is active or known PII errors remain
  ([editor and autosave](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/TeacherNotesModal/TeacherNotesModal.tsx#L93-L170),
  [save, PII and share handling](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/TeacherNotesModal/TeacherNotesModal.tsx#L187-L261),
  [rendered share guard](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/TeacherNotesModal/TeacherNotesModal.tsx#L297-L320)).
- **Observed (Components):** The public teacher-notes modal supplies the
  editor frame, formatting controls, character feedback, save/share messages,
  share command and safety copy. OWA supplies the editor engine, validation,
  persistence and link
  ([Components modal contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/teacher/OakTeacherNotesModal/OakTeacherNotesModal.tsx#L15-L114),
  [OWA composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/TeacherNotesModal/TeacherNotesModal.tsx#L297-L320)).
- **Observed (OWA):** Downloading can require resource selection, school or
  home-school details, terms, HubSpot availability, copyright policy, login and
  geography checks before a ZIP is initiated
  ([download state](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L91-L239),
  [rendered form conditions](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L400-L468)).

#### Initial interpretation and inherited assumptions

- **Inferred:** Search, saved units, notes, anchored sections and pre-populated
  details can offload memory and preserve work across a multi-step teacher
  journey.
- **Inferred:** The same workflow also crosses browse/search, lesson inspection,
  authentication, data collection, download/share and potentially AI modes. The
  source cannot establish whether this feels coherent or creates costly
  switching.
- **Unknown:** No pinned task analysis, interruption study, time-on-task evidence,
  field observation or recovery-error distribution was found in these repos.

### Movement 2: define the problem space

**Problem frame (Inferred):** Teachers often act under limited time, partial
information, interruption and responsibility for consequential classroom
choices. The service must make the current goal, relevant evidence, available
actions, system state and recovery path legible without requiring unnecessary
recall or repeated re-entry. The failure is avoidable cognitive work or a mode
error that delays preparation, loses intent, or causes an unsuitable resource to
be selected, adapted or shared.

**Causal mechanism (Inferred):** Cognitive cost accumulates through information
fragmentation, unclear state, option overload, mode changes, repeated identity or
school context, weak acknowledgement and recovery that depends on remembering a
prior path.

**Constraints (Inferred):** Density can support expert scanning; friction can
protect copyright, privacy or safety; novices and experienced teachers may need
different information; and the workflow extends into school systems, files and
classroom practice.

**Success (Inferred):** A teacher can form a correct mental model, compare and
adapt relevant material, preserve work, recover from interruption or failure and
carry the result into teaching with proportionate attention and confidence.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                  | Reopened interpretation                                                                                                                                      |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Changed assumption:** A dense lesson page is overload.          | **Inferred:** Co-location and stable anchors may reduce navigation and memory load for expert scanning; the relevant measure is task cost, not item count.   |
| **Changed assumption:** Fewer steps are always better.            | **Inferred:** Copyright, safety, consent and provenance can warrant deliberate steps. Unexplained or repeatedly requested steps are a different failure.     |
| **Changed assumption:** Save, notes and download are features.    | **Inferred:** They are continuity mechanisms within broader preparation and collaboration workflows; local success can still leave the workflow incomplete.  |
| **Changed assumption:** AI after failed retrieval is recovery.    | **Inferred:** It may be a useful goal-preserving alternative, a disruptive mode switch, or an inappropriate substitution when provenance matters.            |
| **Competing explanation:** Product-shaped Components reduce work. | **Inferred:** They may preserve tested cognitive patterns across consumers, or distribute workflow meaning across two repositories and increase change cost. |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** OWA contains several explicit cognitive offloading
mechanisms, but the unit of design visible in source is commonly the page or
feature rather than the teacher's end-to-end episode. The critical seam is
**teacher goal -> information for judgement -> reversible action -> durable
continuity -> classroom hand-off**. The teacher-notes boundary demonstrates that
interaction wording and application state can be split while still forming one
cognitive contract.

| Warranted next investigation                                                                                                                                  | Warrant                                                                                                                        | Explicit falsifier                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Conduct contextual task analysis across novice and experienced teachers for planning, adapting, downloading, sharing, saving and resuming after interruption. | Static composition shows many continuity mechanisms and policy gates but cannot reveal working-memory load or real sequencing. | Representative teachers complete these episodes with low, stable cognitive effort, no material mode or recovery errors, and no workarounds outside Oak. |
| Run a state-legibility audit of every teacher acknowledgement: saved, copied, downloaded, restricted, loading, generated and failed.                          | Each label can refer to a different transition stage; a false mental model creates rework or loss.                             | Each acknowledgement accurately names the durable state users infer from it, and comprehension testing finds no material mismatch.                      |
| Trace context carried and re-entered across search, lesson, notes, share, download, sign-in and return journeys.                                              | Re-entry and context loss are common mechanisms of cognitive cost; several current journeys cross these boundaries.            | Context is intentionally preserved or re-requested for a warranted reason at every transition, with negligible abandonment or correction.               |

#### Unresolved evidence

- **Unknown:** Which teacher workflows dominate actual use and how they differ by
  career stage, subject, school context or assistive need.
- **Unknown:** Whether the lesson overview's density reduces search cost or
  increases decision fatigue.
- **Unknown:** Frequency and consequence of interruption, sign-in diversion,
  form re-entry, failed downloads, stale saves or lost notes.
- **Unknown:** Whether Components' product-shaped contracts make workflows more
  legible to additional consumers or require OWA knowledge to use correctly.

---

## Lens 4: pupil agency, motivation and cognitive load

### Governing question

How does the experience distribute choice, control, attention, support and
reward for pupils, and where might it create avoidable dependence, confusion or
disengagement?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** Pupils are offered a numbered lesson list. Guidance says
  lessons are ordered to build on prior learning and recommends starting with
  the first, while the list still exposes each lesson as a selectable link
  ([lesson choice and guidance](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilViews/PupilLessonListing/PupilLessonListing.view.tsx#L94-L175)).
- **Observed (Components):** The lesson shell distinguishes six stages, keeps
  onward controls in a sticky footer, exposes a back slot and progress summary,
  and changes visual treatment by phase and stage
  ([layout contract](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/lesson/OakLessonLayout/OakLessonLayout.tsx#L12-L31),
  [navigation composition](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/lesson/OakLessonTopNav/OakLessonTopNav.tsx#L21-L71)).
- **Observed (OWA):** Quiz state is restored to the first unanswered question;
  completed hydrated quizzes redirect onward. Each response can move through
  init, incomplete, input, grading and feedback states before the next question
  ([quiz hydration](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/context/PupilLessonQuiz/pupilLessonQuizHelpers.ts#L41-L71),
  [question progression](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/pupil/lessons-pages/new/QuizPageContent.tsx#L233-L320)).
- **Observed (boundary):** OWA offers a content-authored hint, records whether it
  was opened, supplies immediate feedback and sets `celebrate` when the grade is
  one. Components controls the reveal interaction, accessible hint description,
  feedback vocabulary and celebratory lesson background
  ([OWA hint and feedback composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/pupil/lessons-pages/new/QuizPageContent.tsx#L385-L446),
  [Components hint](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/quiz/OakQuizHint/OakQuizHint.tsx#L7-L46)).
- **Observed (OWA):** The learner can go back to overview. Leaving an incomplete
  quiz records an abandoned event; a read-only exit quiz disables checking and
  alters next-step logic
  ([back and completion behaviour](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/pupil/lessons-pages/new/QuizPageContent.tsx#L292-L340),
  [read-only check state](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/pupil/lessons-pages/new/QuizPageContent.tsx#L427-L445)).
- **Observed (OWA and Components):** Content guidance presents explicit continue
  and decline actions. OWA changes decline wording for a Classroom assignment;
  Components defaults to `I understand, continue` and `Take me back to lessons`
  and removes the modal close button
  ([OWA policy composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/Views/PupilLessonOverview/PupilLessonOverviewContentGuidanceModal/PupilLessonOverviewContentGuidanceModal.tsx#L36-L85),
  [Components interaction](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/browse/OakPupilJourneyContentGuidance/OakPupilJourneyContentGuidance.tsx#L84-L161)).

#### Initial interpretation and inherited assumptions

- **Inferred:** Visible progression, one-question focus, hints, immediate feedback,
  resume state and reversible exit can reduce extraneous load and support
  persistence.
- **Inferred:** Recommended ordering, progression gates, correctness language,
  celebration and warning acknowledgement also shape learner control and
  motivation. They are not neutral styling choices.
- **Unknown:** The repositories do not establish how pupils of different ages,
  prior attainment, language, neurotype or context interpret these controls and
  rewards.

### Movement 2: define the problem space

**Problem frame (Inferred):** A pupil must be able to understand the goal and
current state, devote attention to learning rather than interface mechanics,
seek help without stigma, make proportionate choices, recover from mistakes and
retain a sense of authorship over participation. Failure appears as extraneous
cognitive load, coerced continuation, learned dependence, unproductive guessing,
misinterpreted feedback or disengagement.

**Causal mechanism (Inferred):** Agency and load are shaped by how options are
framed, how much information must be held at once, when progress is gated, how
errors and hints are treated, whether system state survives interruption, and
whether rewards direct attention toward understanding or mere correctness.

**Constraints (Inferred):** Scaffolding can legitimately narrow choice; younger
learners may need stronger orientation; safety can require an explicit decision;
and the same interaction can support one pupil while burdening another.

**Success (Inferred):** Pupils can explain where they are, why an action is
required, what choices remain, what feedback means and how to proceed, while
attention and motivation remain directed toward learning.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                         | Reopened interpretation                                                                                                                                         |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Changed assumption:** More choice means more agency.                   | **Inferred:** Sequencing and defaults can reduce decision burden; agency requires meaningful control and understandable reasons, not maximal options.           |
| **Changed assumption:** A linear journey is paternalistic.               | **Inferred:** It may provide a valuable learning scaffold, or may prevent adaptive routes. The evidence must be population- and purpose-specific.               |
| **Changed assumption:** Celebration motivates pupils.                    | **Inferred:** It may reinforce effort or mastery, reward only correctness, distract, or have no meaningful effect. Encoded confetti is not motivation evidence. |
| **Changed assumption:** Hints are unambiguously supportive.              | **Inferred:** A hint can scaffold productive struggle, disclose too much, or be avoided due to framing. Recording use does not reveal which.                    |
| **Competing explanation:** A fixed interaction language creates clarity. | **Inferred:** Shared language may aid orientation across lessons, while fixed feedback semantics may poorly fit age, subject or assessment purpose.             |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** The pupil journey deliberately manages attention,
choice, progression, help and reward. The seam is **learner intention -> framed
choice -> supported action -> interpreted feedback -> self-directed next step**.
Components owns much of the repeated motivational and orienting language; OWA
owns state, content and progression policy. Neither repository contains evidence
that this combined contract produces agency or appropriate load in context.

| Warranted next investigation                                                                                                                        | Warrant                                                                                                         | Explicit falsifier                                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Run age-stratified cognitive walkthroughs and observation with pupils, including SEND, EAL, keyboard-only, touch and interrupted-session scenarios. | Current interactions intentionally constrain attention and choice; effects will vary by capability and context. | Participants across the served range accurately understand state, choices and feedback with low interface-induced effort and no material subgroup disparity. |
| Investigate hint, feedback and celebration effects on strategy, persistence and explanation quality rather than click-through.                      | The UI makes these motivationally consequential, while current events mostly record action and correctness.     | Controlled and qualitative evidence shows the mechanisms consistently support mastery-oriented behaviour without harmful dependence or avoidance.            |
| Test resume, back, read-only and content-guidance paths as agency contracts, including why progression is blocked.                                  | Agency is most visible at boundaries where the system refuses, redirects or restores action.                    | Pupils can predict and explain every tested transition, retain intended work and choose a safe recovery without adult or researcher interpretation.          |

#### Unresolved evidence

- **Unknown:** Pupil comprehension of stage names, scores, `Almost correct`,
  hints, completion and read-only states.
- **Unknown:** Whether the visual and verbal reward model affects mastery,
  performance orientation, anxiety or persistence.
- **Unknown:** How often pupils self-direct versus act through a teacher,
  parent/carer or Classroom assignment.
- **Unknown:** Whether a consumer needs the exact Oak pupil journey or needs
  adaptable capability primitives for a different learning relationship.

---

## Lens 5: accessibility as a human-capability model

### Governing question

Which real actions and understandings are available to a person in their
environment, beyond whether the rendered markup satisfies a checklist?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** The main application layout renders a `main` landmark with
  id `main`, and the top navigation offers a `Skip to content` link to that id
  ([main landmark](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/AppComponents/AppLayout/AppLayout.tsx#L51-L76),
  [skip link](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/AppComponents/TopNav/TopNavMinimal.tsx#L42-L61)).
- **Observed (Components):** The central modal uses a focus-management library,
  auto-focuses, returns focus by default, closes on Escape unless disabled,
  makes overflowing content focusable and declares `role="alertdialog"`
  ([modal behaviour](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/messaging-and-feedback/OakModalCenter/OakModalCenter.tsx#L99-L169),
  [focus and semantics](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/messaging-and-feedback/OakModalCenter/OakModalCenter.tsx#L202-L280)).
- **Observed (boundary):** OWA intercepts the first Tab press on each quiz
  question and moves focus to an answer control chosen for the question type
  ([quiz focus policy](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages-helpers/pupil/lessons-pages/new/QuizPageContent.tsx#L167-L200)).
- **Observed (Components):** Ordering and matching questions register mouse,
  touch and keyboard sensors, publish drag announcements, describe keyboard
  operation and replace smooth scroll or drop animation when reduced motion is
  preferred
  ([order interaction](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/quiz/OakQuizOrder/OakQuizOrder.tsx#L97-L147),
  [match interaction](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/quiz/OakQuizMatch/OakQuizMatch.tsx#L153-L225)).
- **Observed (Components):** The lesson transcript control exposes
  `aria-controls`, `aria-expanded`, a polite live region and a slot for a sign
  language control
  ([transcript interaction](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/lesson/OakLessonVideoTranscript/OakLessonVideoTranscript.tsx#L8-L79)).
- **Observed (OWA):** Video activity records whether subtitles were present and
  whether sign language or transcript controls were opened. Attempt data also
  records those states
  ([video tracking state](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/VideoPlayer/VideoPlayer.tsx#L155-L179),
  [persisted video state](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/pupil-api/types/lessonAttempt.ts#L103-L116)).
- **Observed (OWA assurance):** A post-deployment workflow is configured to run
  Pa11y against successful non-Storybook deployments and publish a custom status
  ([Pa11y workflow](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/.github/workflows/post_deployment_actions.yml#L67-L115)).

#### Initial interpretation and inherited assumptions

- **Inferred:** Accessibility responsibilities are distributed across semantic
  application composition, package primitives, product components, content
  alternatives, application focus policy and deployment checks.
- **Inferred:** The source shows serious attention to operability and alternative
  presentation. It does not establish that a person can complete the educational
  outcome across the entire journey.
- **Unknown:** Automated-check coverage, check authority, manual audit results,
  assistive-technology compatibility and disabled-user evidence are not
  established by configuration or markup alone.

### Movement 2: define the problem space

**Problem frame (Inferred):** Accessibility is the fit between a person's
capabilities, tools and environment and the service's demands. A local control
can be conformant while the journey remains unavailable because content,
navigation, timing, cognition, authentication, download formats, media or
recovery impose an unbridgeable demand. The harm is exclusion from an educational
or teaching capability, not merely a rule violation.

**Causal mechanism (Inferred):** Capability is lost where semantic information
does not survive composition, input methods are not equivalent, focus or state
changes are unexpected, alternatives omit necessary meaning, motion or timing
cannot be controlled, or a later boundary invalidates an accessible earlier
step.

**Constraints (Inferred):** Needs can conflict; accessibility includes authors'
content and external media; responsive context and assistive technology create a
large state space; and automated checks can only detect some deterministic
failures.

**Success (Inferred):** People with the relevant range of capabilities can
perceive, understand, operate and recover through the same material outcome with
equivalent meaning and agency, even where the presentation or interaction route
differs.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                         | Reopened interpretation                                                                                                                                     |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Changed assumption:** Accessible components make an accessible app.    | **Inferred:** Composition, content, route changes, focus policy, data states and external services can defeat locally accessible controls.                  |
| **Changed assumption:** Conformance is the outcome.                      | **Inferred:** Standards are essential constraints and evidence, while the human capability to teach or learn is the end-to-end criterion.                   |
| **Changed assumption:** Keyboard support makes drag-and-drop equivalent. | **Inferred:** Operability, comprehensibility, effort and announced state all matter; keyboard mechanics alone do not establish equivalence.                 |
| **Changed assumption:** A transcript is equivalent access.               | **Inferred:** It may preserve spoken information but lose timing, demonstration or visual meaning; sign-language and transcript needs also differ.          |
| **Competing explanation:** Shared components centralise accessibility.   | **Inferred:** They can preserve hard-won behaviours, while application callbacks, slots and product composition still carry essential accessibility policy. |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** Accessibility is already a cross-boundary system
property. The important seam is **human capability and environment -> composed
demand -> alternative interaction or representation -> equivalent outcome**.
Components supplies substantial reusable mechanics, but OWA decides many
semantic, focus, content and progression details. Neither component tests nor a
deployment scanner alone can warrant end-to-end capability.

| Warranted next investigation                                                                                                                                                          | Warrant                                                                                                        | Explicit falsifier                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build capability-oriented journey audits for representative teacher and pupil outcomes across screen reader, keyboard, switch/voice, zoom, reduced motion and cognitive access needs. | Responsibilities cross routes, content and package slots; local control tests cannot establish the outcome.    | Each sampled capability group completes the material outcome with equivalent meaning, acceptable effort and recovery, and no failure outside existing coverage. |
| Trace semantic and focus contracts at each OWA/Components slot and callback boundary.                                                                                                 | The package often supplies mechanics while OWA supplies labels, children, routing and focus decisions.         | Every boundary has an explicit, tested contract that prevents the consumer from producing an inaccessible but type-valid composition.                           |
| Reconcile automated Pa11y coverage with manual and assistive-technology evidence by outcome claim.                                                                                    | A workflow exists, but configuration does not establish route/state coverage or which failures block delivery. | Pa11y plus existing manual evidence demonstrably covers every material journey state and has sufficient authority to prevent known accessibility regressions.   |
| Audit educational equivalence of transcript, subtitle, sign-language and non-drag alternatives.                                                                                       | Alternative mechanics do not automatically preserve the learning construct or information.                     | Subject and accessibility review finds equivalent necessary meaning and outcome for every sampled alternative, with no material unsupported content.            |

#### Unresolved evidence

- **Unknown:** The population and capability model used to define accessibility
  requirements.
- **Unknown:** Real Pa11y route/state coverage and whether the resulting status
  gates promotion.
- **Unknown:** Manual audit cadence, disabled-user involvement and defect
  ownership across OWA, Components and content.
- **Unknown:** Whether every downloadable or generated resource preserves the
  accessibility available in the web journey.

---

## Lens 6: safeguarding, harm and vulnerable-user safety

### Governing question

Where can a child or vulnerable user encounter preventable physical,
psychological, informational or interpersonal harm, and who is entitled to
decide that a transition is safe?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** Pupil lesson content can carry content-guidance labels and
  areas, supervision level and age restriction. A modal opens before progression
  when conditions permit and offers accept and decline actions
  ([content-guidance policy](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/Views/PupilLessonOverview/PupilLessonOverviewContentGuidanceModal/PupilLessonOverviewContentGuidanceModal.tsx#L16-L85)).
- **Observed (Components):** The package owns default safety wording and the
  interaction shape: `I understand, continue`, `Take me back to lessons`, hidden
  close control, deduplicated guidance labels and optional supervision text
  ([content-guidance component](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/browse/OakPupilJourneyContentGuidance/OakPupilJourneyContentGuidance.tsx#L13-L67),
  [modal actions](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/pupil/browse/OakPupilJourneyContentGuidance/OakPupilJourneyContentGuidance.tsx#L84-L161)).
- **Observed (OWA):** A practical PE resource can display a banner instructing
  the teacher to carry out a risk assessment and linking to a physical-activity
  disclaimer and external safe-practice guidance
  ([PE risk banner](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/RiskAssessmentBanner/RiskAssessmentBanner.tsx#L6-L40)).
- **Observed (OWA):** Teacher notes are checked for person names, email addresses,
  phone numbers and street addresses. Matching segments are highlighted and the
  share action is disabled while PII findings exist or validation is running
  ([DLP check configuration](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/dlp/dlp.ts#L50-L70),
  [PII response](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/TeacherNotesModal/TeacherNotesModal.tsx#L222-L245),
  [share guard](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/TeacherNotesModal/TeacherNotesModal.tsx#L264-L320)).
- **Observed (Components):** The notes modal tells users not to include direct or
  indirect identifying, locating or contact information and says personal
  information will be redacted to help keep everyone safe
  ([notes safety copy](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/teacher/OakTeacherNotesModal/OakTeacherNotesModal.tsx#L192-L217)).
- **Observed (OWA):** A pupil attempt contains a generated attempt id, lesson and
  browse data, exact short-text or selected answers, correctness, video activity
  and worksheet activity. GET and POST handlers operate on the attempt id; this
  source excerpt contains no user-authentication check
  ([attempt data](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/pupil-api/types/lessonAttempt.ts#L81-L136),
  [attempt route](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/pupil/lesson-attempt/route.ts#L8-L69)).

#### Initial interpretation and inherited assumptions

- **Inferred:** Safeguarding is encoded as several different mechanisms: authored
  content classification, age/supervision communication, adult risk assessment,
  PII prevention and capability-like access to pupil results.
- **Inferred:** A warning acknowledgement records that a control was activated;
  it does not establish comprehension, voluntariness, appropriate adult support
  or absence of harm.
- **Unknown:** The threat model, retention rules, incident history, moderation
  model, content-review authority, escalation routes and evidence behind age or
  supervision decisions are not established by these excerpts.

### Movement 2: define the problem space

**Problem frame (Inferred):** The service must prevent, reduce and respond to
foreseeable harm while preserving access, dignity and appropriate agency. Harm
can originate in lesson subject matter, physical activity, exposure of personal
information, sharing of pupil work, misleading safety communication, coercive
choice or a failure to connect a vulnerable person with appropriate support.

**Causal mechanism (Inferred):** Risk crosses an authority chain: content is
classified, projected as guidance, interpreted by a pupil or adult, accepted or
declined, acted upon, possibly recorded or shared, and monitored for incidents.
A break can occur even when every local mechanism executes as coded.

**Constraints (Inferred):** Age and vulnerability are contextual; excessive
warnings can exclude or desensitise; a child may not be able to consent to the
relevant risk; teachers and carers mediate some but not all journeys; and safe
defaults must not silently expose sensitive information.

**Success (Inferred):** Material risks have an accountable authority, evidence-
based classification, comprehensible and non-coercive controls, safe failure and
recovery, proportionate data exposure, and a monitored response path.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                     | Reopened interpretation                                                                                                                                                                |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Changed assumption:** Content guidance is a safeguarding boundary. | **Inferred:** It is one communication and choice mechanism inside a larger classification, supervision, support and incident-response system.                                          |
| **Changed assumption:** `I understand` proves informed acceptance.   | **Inferred:** It proves a click under encoded conditions. Understanding, capacity, voluntariness and adult mediation remain separate.                                                  |
| **Changed assumption:** PII detection makes notes safe.              | **Inferred:** Detection can reduce known patterns while missing indirect identifiers, creating false confidence, or exposing data before/after validation.                             |
| **Changed assumption:** Random attempt ids are anonymous.            | **Inferred:** The schema omits an account identity, but answers and context can still be sensitive and a possessed identifier can govern access.                                       |
| **Competing explanation:** Product safety belongs in Components.     | **Inferred:** Central interaction wording may preserve consistency, while risk authority and context may belong to content or application policy. Placement is not proof of ownership. |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** The current estate contains deliberate safeguards, but
they form a distributed safety case rather than one component or gate. The key
seam is **hazard -> authoritative classification -> comprehensible protected
choice -> safe action/data transition -> incident observation and response**.
The OWA/Components split is consequential where Components fixes safety language
while OWA supplies risk facts, contextual policy and effects.

| Warranted next investigation                                                                                                                            | Warrant                                                                                                               | Explicit falsifier                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Construct end-to-end safety cases for sensitive content, practical activity, teacher-note sharing and pupil-result sharing.                             | Each crosses different authorities and mechanisms; source fragments do not establish complete prevention or response. | An existing reviewed safety case already links every material hazard to owner, control, evidence, residual risk, monitoring and response with no gaps.        |
| Test content-guidance comprehension, capacity and choice with age-appropriate participants and mediating adults, including Classroom-assigned journeys. | The control claims understanding and changes decline behaviour by context.                                            | Participants consistently understand the hazard and consequences, can decline without inappropriate penalty, and obtain needed adult support.                 |
| Perform a privacy-abuse and safeguarding threat model for attempt ids, share links, teacher notes, telemetry and external providers.                    | Possessed identifiers and pupil/teacher-authored data create misuse paths that cannot be assessed from schemas alone. | The current threat model, controls and adversarial tests cover plausible disclosure, enumeration, coercion and retention harms with acceptable residual risk. |
| Audit classification provenance and incident feedback for content guidance, age restriction, supervision and PE risk.                                   | Safety depends on who makes and revises the classification and what happens when reality contradicts it.              | Every classification is traceable to a qualified authority, periodically reviewed and demonstrably revised from incident or evidence signals.                 |

#### Unresolved evidence

- **Unknown:** The safeguarding policy and named accountable owners behind each
  encoded control.
- **Observed:** The note API awaits DLP inspection and returns matching segments
  before its upsert path
  ([note route](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/app/api/teacher/note/route.ts#L60-L82)).
- **Unknown:** DLP-provider retention, what happens to rejected or previously
  stored material, and whether every caller waits for validation before claiming
  a downstream outcome. The inspected client share handler does not wait for its
  save call.
- **Unknown:** Attempt-id entropy in production, access logging, expiry, deletion,
  rate controls and sharing expectations.
- **Unknown:** Harm reports, near misses and how content or interface decisions
  change in response.

---

## Lens 7: public value, equity and digital-public-good reach

### Governing question

Who can realise the educational benefit, who bears the burdens or is excluded,
and how well can the public asset be reused, scrutinised and extended?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** Public teacher copy describes resources as free, national-
  curriculum-aligned, designed by subject experts and openly available; pupil
  metadata advertises free KS1-to-KS4 lessons, videos and quizzes
  ([teacher proposition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GenericPagesComponents/TeachersTab/TeachersTab.tsx#L90-L125),
  [pupil proposition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/pupils/index.tsx#L18-L35)).
- **Observed (OWA):** Web access, downloadable resources and printable/shareable
  pupil results are distinct delivery modes. A result projection includes quiz
  responses, video percentage and worksheet status
  ([result projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilViews/PupilResults/PupilResults.view.tsx#L23-L86),
  [printable journey](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/pupils/lessons/%5BlessonSlug%5D/results/%5BattemptId%5D/printable.tsx#L35-L88)).
- **Observed (OWA):** Some lesson downloads are restricted by copyright, login,
  onboarding and geography. The UK-blocked view explains that the restriction is
  due to copyright and offers a correction route
  ([restriction calculation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L91-L123),
  [region-blocked explanation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/LessonDownloadRegionBlocked/LessonDownloadRegionBlocked.tsx#L22-L75)).
- **Observed (OWA):** The download journey can collect school/home-school context,
  email and terms agreement and waits for HubSpot before enabling the final
  action
  ([download form composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L400-L468)).
- **Observed (Components):** The package is installable from npm and its code is
  MIT-licensed; documentation is under the Open Government Licence except where
  stated. Correct image use requires two environment variables whose values the
  README says can be obtained from OWA configuration or a fellow engineer
  ([installation dependency](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L7-L44),
  [licensing](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L158-L166)).
- **Observed (Components):** The repository says external code contributions are
  not currently accepted, although this is under review. Repo-specific
  components are allowed in the package when they need unexported internals
  ([external contribution policy](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/README.md#L138-L152)).

#### Initial interpretation and inherited assumptions

- **Inferred:** Zero price and open licensing are important public-value enablers,
  but effective reach also depends on connectivity, devices, formats, language,
  disability, geography, institutional context, data exchange and the ability of
  others to reuse and improve the asset.
- **Inferred:** Copyright and safeguarding can legitimately constrain access;
  equity depends on the distribution and explanation of the resulting burden,
  not on eliminating all constraints.
- **Unknown:** The repositories do not establish reach, learning benefit or
  burden by socioeconomic status, geography, language, disability, school type
  or other protected or underserved group.

### Movement 2: define the problem space

**Problem frame (Inferred):** A publicly purposed educational service must create
benefit that is broad, equitable, accountable and durable. Failure occurs where
formal availability does not become practical capability, benefits concentrate
among already advantaged users, burdens fall disproportionately, or the public
asset cannot be scrutinised and extended by legitimate consumers.

**Causal mechanism (Inferred):** Reach is filtered through awareness, discovery,
connectivity, device and browser capability, accessibility, identity and data
requirements, licensing, format adaptability, local curriculum fit, trust and
institutional support. Open code and content can still have operationally closed
dependencies.

**Constraints (Inferred):** Rights holders and child safety impose real limits;
universal uniformity can ignore local needs; public value includes quality and
stewardship as well as volume; and reuse must preserve provenance, accessibility
and legitimate restrictions.

**Success (Inferred):** Intended populations can realise comparable benefit with
proportionate burden, exclusions are explicit and justified, distributional
effects are measured, and public assets can be independently used and improved
without hidden institutional access.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                           | Reopened interpretation                                                                                                                                     |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Changed assumption:** Free means equitable.                              | **Inferred:** Price removes one barrier; connectivity, time, data collection, confidence, format and institutional support can preserve others.             |
| **Changed assumption:** Open source means a digital public good.           | **Inferred:** Licensing enables reuse, while undocumented assets, internal configuration, contribution closure and product-specific contracts can limit it. |
| **Changed assumption:** More reach is always better.                       | **Inferred:** Reach without educational quality, safeguarding, provenance or sustainable stewardship can create harm or dilute public value.                |
| **Changed assumption:** Access restrictions oppose public value.           | **Inferred:** Some protect rights or safety. Public-value analysis asks whether they are necessary, narrowly applied, legible and mitigated.                |
| **Competing explanation:** Product-specific Components exports help reuse. | **Inferred:** They can transfer excellent Oak interactions quickly, or bind consumers to OWA assumptions and inaccessible operational dependencies.         |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** OWA expresses a strong free/open proposition and offers
several modes of use, while effective access is mediated by policy, data,
platform and institutional constraints. Components is publicly installable and
licensed but includes internal-knowledge and product-specific dependencies. The
seam is **public investment -> available asset -> practical capability ->
distributed benefit -> accountable reuse and improvement**.

| Warranted next investigation                                                                                                                                  | Warrant                                                                                                      | Explicit falsifier                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Measure the full reach funnel and outcome distribution by relevant population and environment, including where data is lawfully available and ethical to use. | Repository claims establish intent, not who receives benefit or bears friction.                              | Benefit, completion and burden are already measured with representative coverage and show no material unexplained disparity across intended populations. |
| Perform an access-burden audit of connectivity, device, browser, identity, school details, geography, licensing, format and accessibility for core outcomes.  | Several visible gates can be individually justified while cumulatively excluding a group.                    | Every material burden is necessary and proportionate, has an effective alternative or mitigation, and produces no meaningful distributional disparity.   |
| Test Oak Components as a public-good dependency from a clean external-consumer environment without OWA secrets or staff knowledge.                            | The package is public, but image configuration and repo-specific surface imply possible operational closure. | Independent consumers can install, understand, render, test, adapt and contribute improvements to all intended capabilities using only public materials. |
| Trace content and software licensing/provenance through web, download, print, share and reuse journeys.                                                       | Public reuse and legitimate restrictions depend on knowing which rights survive each projection.             | Every asset and projection exposes complete machine- and human-legible rights/provenance, and downstream consumers can enforce them without inference.   |

#### Unresolved evidence

- **Unknown:** Distribution of users, outcomes and failed journeys across
  relevant social and environmental dimensions.
- **Unknown:** Offline, low-bandwidth, low-memory, old-device and shared-device
  effectiveness.
- **Unknown:** Availability and quality of alternative languages, formats and
  local adaptations.
- **Unknown:** Whether independent external consumers have successfully built
  and sustained services with Oak Components at this revision.

---

## Lens 8: privacy, consent and data dignity

### Governing question

Is information about people collected, inferred, shared, retained and exposed in
a way that preserves legitimate purpose, comprehension and agency?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** The application uses a separate consent client as the
  authority for policy consents and Components as the consent UI. When the client
  says interaction is required, OWA opens the banner; consent changes are passed
  back to the client
  ([consent composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/cookie-consent/CookieConsentProvider.tsx#L1-L73)).
- **Observed (OWA):** PostHog, Gleap, Bugsnag, Sentry and HubSpot are all mapped
  to one `statistics` policy in the local service map
  ([service-policy map](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/cookie-consent/ServicePolicyMap.ts#L1-L11)).
- **Observed (Components):** Consent data includes a policy id, label,
  explanation, necessary status, third parties and granted/denied/pending state.
  The provider offers accept, reject and per-policy confirmation paths; rejection
  preserves strictly necessary policies
  ([consent model](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/cookies/OakCookieConsentProvider/OakCookieConsentProvider.tsx#L15-L109),
  [consent effects](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/cookies/OakCookieConsentProvider/OakCookieConsentProvider.tsx#L165-L238)).
- **Observed (OWA):** PostHog is configured for cookieless operation after
  rejection, disables session recording and automatic page views, and limits
  autocapture to named route patterns
  ([PostHog configuration](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/browser-lib/posthog/getPosthogInitConfig.ts#L9-L34)).
- **Observed (OWA):** The download journey can use email, school id/name and
  local-storage details, and submits data to HubSpot before initiating the
  resource operation
  ([download data flow](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L161-L224)).
- **Observed (OWA):** Teacher notes can contain free text and links; OWA checks
  named classes of PII and Components displays a direct/indirect-identifier
  warning
  ([OWA validation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/TeacherNotesModal/TeacherNotesModal.tsx#L187-L245),
  [Components warning](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/teacher/OakTeacherNotesModal/OakTeacherNotesModal.tsx#L192-L217)).
- **Observed (OWA):** Pupil attempts can persist exact answers, grades, hint use,
  video behaviour and worksheet activity under an attempt id. A server-rendered
  share page retrieves the record using the route's attempt id and includes it in
  the response projection
  ([attempt schema](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/node-lib/pupil-api/types/lessonAttempt.ts#L43-L136),
  [share projection](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/pages/pupils/lessons/%5BlessonSlug%5D/results/%5BattemptId%5D/share.tsx#L40-L80)).

#### Initial interpretation and inherited assumptions

- **Inferred:** Consent presentation, service activation, product analytics,
  operational error reporting, CRM submission, teacher-authored notes and pupil
  work form distinct data relationships even where one policy label or provider
  groups them.
- **Inferred:** The attempt id acts like an address and may act as a possession-
  based sharing capability. That is not equivalent to public data or to proven
  anonymity.
- **Unknown:** Purpose records, lawful bases, processor contracts, retention,
  deletion, subject access, production payloads, re-identification analysis and
  whether cookieless events remain person-linkable are not established here.

### Movement 2: define the problem space

**Problem frame (Inferred):** Data dignity requires that information about a
person is used only for a legitimate, intelligible and proportionate purpose;
that control is meaningful rather than ceremonial; and that collection,
inference, linkage, sharing, retention and deletion remain consistent with the
person's reasonable expectations and vulnerability. Failure can occur without a
security breach: overcollection, opaque bundling, indefinite retention,
misleading anonymity or coerced exchange for a public benefit can all remove
agency.

**Causal mechanism (Inferred):** Human activity becomes identifiers and event or
content payloads, which cross application, browser storage, Oak services and
third parties, are combined or inferred, retained, accessed and eventually
deleted or outlive their purpose. Consent UI governs only some of those stages.

**Constraints (Inferred):** Some processing is necessary for requested service,
security or safeguarding; children merit heightened protection; meaningful
measurement can serve public accountability; and minimisation must be assessed
against a named purpose rather than as zero data.

**Success (Inferred):** Every data field and inference has a named subject,
purpose, authority, recipient, sensitivity, lifetime and control; people can
understand and exercise the control appropriate to their relationship; and the
system can prove that downstream behaviour follows the choice.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                 | Reopened interpretation                                                                                                                                           |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Changed assumption:** Cookie consent is the privacy boundary.  | **Inferred:** It governs some browser-service activation. Requested operations, server logs, CRM, auth, shared links and authored content have other authorities. |
| **Changed assumption:** Reject means no tracking.                | **Inferred:** The configured PostHog mode changes after rejection; what cookieless events contain or permit is a separate empirical question.                     |
| **Changed assumption:** One statistics category is intelligible. | **Inferred:** Product insight, support, error reporting and CRM can have different purposes, recipients and user expectations despite one local mapping.          |
| **Changed assumption:** No account identity means anonymous.     | **Inferred:** Lesson, subject, year, exact free-text answers and a shareable identifier can still be personal or identifying in context.                          |
| **Competing explanation:** PII detection preserves data dignity. | **Inferred:** It can prevent common accidental disclosure, but warning, validation, persistence order, false positives and false negatives determine the result.  |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** OWA and Components implement meaningful privacy
mechanisms, but the data relationship is wider than cookie consent. The seam is
**human action -> data representation/inference -> legitimate authority ->
recipient and use -> expiry/deletion -> person's continuing agency**. Components
owns consent and warning interactions; OWA and other services own most purposes
and effects, so the visible choice must be tested against actual downstream
behaviour.

| Warranted next investigation                                                                                                                                 | Warrant                                                                                                                           | Explicit falsifier                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Build a field-level, purpose-led data inventory for pupil attempts, teacher notes, downloads, auth, analytics, support and error reporting through deletion. | Source exposes several data relations but cannot establish production payloads, linkage, recipients or lifetime.                  | A current verified inventory already maps every field and inference to subject, purpose, authority, recipient, retention, deletion and control with no gaps. |
| Run consent effect tests at network, storage and provider boundaries for grant, reject, revoke and policy-version change.                                    | UI and service maps express intent; dignity depends on effective behaviour and revocation across time.                            | Every service and stored identifier demonstrably follows each choice immediately and retrospectively as promised, including cookieless modes.                |
| Threat-model and user-test possessed-id sharing for pupil results and teacher notes.                                                                         | Shareability creates value and a disclosure boundary; source alone cannot establish audience expectations or capability controls. | Intended users accurately understand scope and lifetime, and adversarial testing finds no practical unintended discovery, forwarding or persistence harm.    |
| Test whether school/email/CRM exchange is necessary and understood for each download or share outcome.                                                       | A free public resource journey can impose a data burden whose necessity and expectation vary by operation.                        | Each collected item is required for a documented legitimate purpose, no less intrusive route achieves it, and users accurately understand the exchange.      |

#### Unresolved evidence

- **Unknown:** Effective production payloads and identifiers for each analytics,
  error, support and CRM service.
- **Unknown:** Retention, expiry, erasure and access-control policies for pupil
  attempts and teacher notes.
- **Unknown:** Whether consent categories and explanations distinguish purposes
  at the granularity users expect.
- **Unknown:** Whether pupils or responsible adults are informed about attempt
  persistence and link sharing in an age-appropriate way.

---

## Lens 9: adoption, trust and legibility

### Governing question

Can a person form an accurate mental model of what Oak offers, why it can be
trusted, what just happened, what is changing and what to do when reality differs
from expectation?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed (OWA):** Public copy makes quality and provenance-like claims:
  resources are national-curriculum-aligned, designed by subject experts, and new
  resources are described as designed by teachers and subject experts and tested
  in classrooms
  ([homepage claim](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/GenericPagesComponents/TeachersTab/TeachersTab.tsx#L90-L100),
  [redirect explanation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/TeacherRedirectedOverlay/TeacherRedirectedOverlay.tsx#L38-L49)).
- **Observed (OWA):** When historical content is redirected, pupils are told the
  requested resource is gone and, for lesson pages, that Oak has taken them to a
  similar topic. Teachers receive a different explanation tied to pandemic-era
  material
  ([pupil redirect explanation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/PupilComponents/PupilRedirectedOverlay/PupilRedirectedOverlay.tsx#L36-L71),
  [teacher redirect explanation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/TeacherRedirectedOverlay/TeacherRedirectedOverlay.tsx#L19-L50)).
- **Observed (OWA):** Takedown messaging distinguishes whether replacement units
  exist and tells teachers that older resources were built for lockdown learning,
  may need downloading, and may invalidate saved or shared links
  ([takedown variants](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/SharedComponents/TakedownBanner/getBannerContent.tsx#L31-L103)).
- **Observed (OWA):** Region-blocked downloads state the reason, scope and a
  correction channel. Download initiation shows a success toast saying the
  operation may take minutes
  ([restriction explanation](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/LessonDownloadRegionBlocked/LessonDownloadRegionBlocked.tsx#L49-L74),
  [download acknowledgement](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherViews/LessonDownloads.view.tsx#L211-L239)).
- **Observed (Components):** The teacher-notes component distinguishes `Progress
saved`, `Link copied to clipboard` and `An error occurred`. OWA sets the saved
  flag after a successful persistence result, but its share handler starts save
  without awaiting it, conditionally copies an existing URL and sets the shared
  flag independently of the eventual save or clipboard outcome
  ([Components messages](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/components/owa/teacher/OakTeacherNotesModal/OakTeacherNotesModal.tsx#L94-L130),
  [OWA state composition](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/src/components/TeacherComponents/TeacherNotesModal/TeacherNotesModal.tsx#L187-L261)).
- **Observed (Components):** Design guidance prefers UI-role colour tokens,
  fewer props and more components, explicit deprecation, single responsibility
  and long unambiguous names
  ([component-design guidance](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/src/docs/designingComponents.mdx#L15-L63)).

#### Initial interpretation and inherited assumptions

- **Inferred:** The system attempts to build trust through declared expertise,
  consistent interaction language, transparent restriction, explicit retirement
  messaging and visible acknowledgement of state.
- **Inferred:** Trust is warranted only when the claim, mechanism and actual state
  correspond. Polished consistency can increase confidence even when a claim or
  acknowledgement is incomplete.
- **Unknown:** User comprehension, perceived credibility, adoption barriers,
  reputation evidence, provenance visibility and the accuracy of state beliefs
  are not established by source copy.

### Movement 2: define the problem space

**Problem frame (Inferred):** Adoption depends on a person understanding the
offer, judging it credible for their context, predicting the consequence of an
action and recovering when the system changes or fails. The harm is not only
non-adoption; misplaced trust can cause a teacher to rely on unsuitable or stale
material, a pupil to misinterpret a redirect or score, or a user to believe data
or work is saved when only an earlier transition succeeded.

**Causal mechanism (Inferred):** Trust forms through claims, provenance,
recognisable language, consistency, successful experience, transparent limits,
acknowledgement and correction. It erodes when different layers use the same word
for different states, when content identity changes without adequate explanation,
or when polished presentation exceeds the evidence behind a claim.

**Constraints (Inferred):** Users cannot inspect implementation; excessive
technical detail can reduce legibility; trust must accommodate uncertainty and
change; and consistency is valuable only when the underlying semantics are
consistent.

**Success (Inferred):** A person can explain what Oak provides, the basis and
limits of relevant claims, the state and consequence of their action, the reason
for a restriction or change, and a credible recovery route. Confidence is
calibrated rather than maximised.

### Movement 3: reflect on possible solutions

| Inherited shape or fluent answer                                        | Reopened interpretation                                                                                                                                      |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Changed assumption:** Consistent design creates trust.                | **Inferred:** It creates familiarity and apparent coherence; warranted trust additionally requires semantic and operational correspondence.                  |
| **Changed assumption:** More explanation creates legibility.            | **Inferred:** The right explanation names consequence, reason and recovery at the decision point. Volume alone can obscure them.                             |
| **Changed assumption:** A success message is a binary truth.            | **Inferred:** `saved`, `copied`, `started`, `submitted` and `available` refer to different transition stages and authorities.                                |
| **Changed assumption:** Redirect transparency resolves identity change. | **Inferred:** It may prevent surprise, while `similar topic` or `improved` still requires an authority and evidence a user can appropriately rely upon.      |
| **Competing explanation:** Product language belongs in Components.      | **Inferred:** Central language can preserve familiarity, while state-specific truth may require the application authority to supply more than Boolean flags. |

### Movement 4: synthesise and propose

**Synthesis (Inferred):** OWA and Components encode numerous trust cues and
explicit explanations. Their risk is not absence of messaging but possible
misalignment between a human-readable claim and the authority or transition it
summarises. The seam is **claim or command -> evidence/authority -> actual system
state -> user belief -> recovery or reliance**. This crosses the package boundary
where Components names a state and OWA supplies a Boolean interpretation of it.

| Warranted next investigation                                                                                                                                | Warrant                                                                                                           | Explicit falsifier                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build a claim-to-evidence register for quality, alignment, expertise, classroom testing, similarity, improvement, availability, saved state and completion. | The UI makes consequential claims whose supporting authority is not visible in these repos.                       | Every material claim already has an accountable owner, current evidence, scope/limits, review date and user-visible correction path with no unsupported use.  |
| Test user mental models immediately after save, share, download, redirect, restriction, quiz completion and content-guidance actions.                       | These are high-trust transitions where a concise label can hide a different durable state or consequence.         | Representative users consistently predict actual state, audience, durability and recovery at each transition without hidden knowledge.                        |
| Study adoption and abandonment by job and trust reason, combining behavioural evidence with interviews rather than treating conversion as trust.            | Non-use can reflect irrelevance, exclusion, low confidence, workflow mismatch or successful completion elsewhere. | Existing research already distinguishes these causes with representative evidence and ties them to owned product decisions.                                   |
| Audit Components' product-language props against the application states they represent.                                                                     | Boolean flags such as `progressSaved` can collapse validation, request, commit and visible outcome into one word. | Every product-language state has a precise contract, cannot be asserted prematurely by a type-valid consumer, and is verified against the authority it names. |

#### Unresolved evidence

- **Unknown:** Which claims users notice, trust, doubt or misunderstand and why.
- **Unknown:** Provenance and review evidence behind `subject experts`, `tested in
classrooms`, `similar topic`, `improved` and curriculum-alignment claims.
- **Unknown:** Production frequency of misleading acknowledgement, redirects,
  stale links, restrictions and recovery failure.
- **Unknown:** Whether additional consumers need Oak's exact product language or
  need to express the same state through a different trust relationship.

---

## Cross-lens synthesis

### Problem frame and load-bearing observations

**Inferred:** Across all nine passes, OWA and Components are not merely delivering
pages and controls. Together they mediate human progress, educational inference,
attention, agency, capability, safety, public benefit, personal information and
trust. The load-bearing observations are:

1. **Observed:** Teacher and pupil entry points make explicit outcome and quality
   claims, while a lesson journey spans many actions whose real outcome often
   occurs beyond the page.
2. **Observed:** Learning sequence, scoring, feedback, hints, celebration,
   warnings and progress language are encoded across both repositories.
3. **Observed:** Accessibility, safety, privacy and trust responsibilities cross
   content, OWA application policy, Components interactions and external
   authorities.
4. **Observed:** Components exports both low-level UI and complete OWA-shaped
   teacher/pupil interactions; OWA supplies state and effects to those product
   contracts.
5. **Unknown:** Static source does not establish educational impact, user
   comprehension, distributional equity, safety effectiveness, data legitimacy
   or calibrated trust.

The recurring human seams are:

| Seam                                                     | Question exposed by the lenses                                                                             |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Human situation -> product journey                       | Is the audience route serving the progress the person is actually trying to make?                          |
| Curriculum claim -> activity -> assessment inference     | Does the interaction warrant the learning conclusion and next action?                                      |
| Teacher intent -> continuity -> classroom hand-off       | Does the workflow reduce avoidable memory and recovery burden while preserving legitimate safeguards?      |
| Pupil choice -> progression -> feedback                  | Is attention directed toward learning with meaningful, comprehensible agency?                              |
| Conformant control -> human capability                   | Can the person complete an equivalent outcome in their real environment?                                   |
| Hazard -> protected decision -> response                 | Does the safety case survive classification, communication, action, data transition and incident learning? |
| Public availability -> distributed benefit               | Do price, licence and publication become equitable practical capability and accountable reuse?             |
| Human action -> data lifecycle -> continuing agency      | Is collection, inference, sharing, retention and deletion legitimate and intelligible?                     |
| Application transition -> interaction language -> belief | Does the state a component names correspond to the authority and durability a person reasonably infers?    |

### Assumptions and inherited shapes that changed

- **Changed assumption:** Audience, page, component and analytics-event
  taxonomies are not outcome taxonomies.
- **Changed assumption:** Correct software and consistent UI do not establish
  pedagogical validity, accessibility, safety, equity, privacy or trust.
- **Changed assumption:** Friction is not inherently waste. It can protect a
  right or person; its necessity, proportionality and explanation must be
  established.
- **Changed assumption:** A component-library boundary is not only a reuse
  boundary. When product language lives there, it becomes a pedagogical, safety,
  privacy, cognition or trust boundary as well.
- **Changed assumption:** Consent, warning, acknowledgement and completion are
  transitions with distinct authorities, not self-proving Boolean outcomes.
- **Changed assumption:** Open publication and zero price are necessary but
  insufficient evidence of equitable public value or consumer enablement.

### Warranted portfolio investigations

These are evidence programmes, not an implementation plan or target
architecture.

| Next investigation                                                      | Warrant                                                                                                                  | Falsifier                                                                                                                                                |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Human-outcome chain study across representative teacher and pupil jobs  | Every lens found that meaningful outcomes cross several application surfaces and often continue outside Oak.             | Existing owned outcome maps and representative evidence already connect each core journey to human benefit and failure without material gaps.            |
| Learning-claim and assessment-validity audit                            | The system encodes consequential educational inferences, but static scoring correctness cannot warrant them.             | A current independent validity case covers every sampled construct, task, interaction, scoring use, subgroup and consequence.                            |
| Capability, safety and data-dignity cases for the highest-harm journeys | Accessibility, safeguarding and privacy controls are distributed and share identifiers, warnings, content and providers. | Existing evidence links all hazards and data fields to accountable owners, effective controls, affected populations, monitoring and safe recovery.       |
| State-language correspondence audit across OWA and Components           | Product-shaped components name states whose truth is supplied by application callbacks and Boolean props.                | Each named state is formally defined, cannot be asserted before its authority warrants it, and user testing confirms the intended belief.                |
| Public-value and external-consumer evidence study                       | Open claims, restrictions and public packaging do not establish equitable benefit or independent usability.              | Representative distributional outcomes show no material disparity, and independent consumers can realise intended capabilities using only public inputs. |

### Unresolved evidence capable of changing the whole synthesis

- **Unknown:** A current, evidence-backed hierarchy of Oak's intended human and
  public outcomes.
- **Unknown:** Representative research with teachers, pupils, disabled users,
  vulnerable users, non-adopters and independent framework consumers.
- **Unknown:** The authoritative educational, safeguarding, accessibility,
  privacy and public-value governance that surrounds the code.
- **Unknown:** Live outcome, failure, disparity, incident and comprehension
  evidence, including cases where users complete the job outside Oak.
- **Unknown:** Which product semantics are intentionally stable across future
  consumers and which are current OWA policy or language.

The synthesis would materially change if that evidence showed that these seams
already have explicit authorities, validated contracts and effective feedback
loops. Until then, the warranted conclusion is not that a particular architecture
is needed. It is that any future architecture claim must be able to name and
falsify the human outcome it exists to protect or enable.
