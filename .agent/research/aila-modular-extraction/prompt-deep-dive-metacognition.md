# Prompt Deep Dive: Patterns, Metacognition, and Impact

**Research Area**: Prompt Architecture - Deep Analysis
**Status**: Complete
**Date**: 2025-11-30

---

## Preface: On Metacognition

> "Think hard about it, those are your thoughts.
> Reflect deeply on those thoughts, those are your reflections.
> Consider deeply those reflections, those are your insights."

This document applies metacognitive analysis to the Aila prompt architecture. It moves beyond documenting _what_ the prompts do to understanding _why_ they work and _what_ they reveal about effective AI-human collaboration in education.

---

## Part 1: The Thoughts

### What I Observed

**1. Voice as Architecture, Not Style**

The prompts define 7 distinct voices:

| Voice                      | Speaker | Audience        | Core Purpose                         |
| -------------------------- | ------- | --------------- | ------------------------------------ |
| `AILA_TO_TEACHER`          | Aila    | Teacher/User    | Supportive expert guidance           |
| `PUPIL`                    | A pupil | Class/Teacher   | "I can..." statements, model answers |
| `TEACHER_TO_PUPIL_WRITTEN` | Teacher | Pupils (slides) | Formal, concise instructions         |
| `TEACHER_TO_PUPIL_SPOKEN`  | Teacher | Pupils (verbal) | Professional but warmer narrative    |
| `EXPERT_TEACHER`           | Expert  | User            | Pedagogical insights and rationale   |
| `AGENT_TO_AGENT`           | Aila    | Other agents    | Task-focused coordination            |
| `AGENT_TO_DEVELOPER`       | Aila    | Developers      | Technical communication              |

This isn't styling - it's a **communication ontology**. Each voice encodes a _relationship_, not just a tone.

**2. Knowledge Density in body.ts**

The `body.ts` file contains approximately 400 lines of prose that encode:

- Lesson structure requirements
- Learning outcome format ("I can..." max 30 words)
- Quiz design methodology (6 questions, 5/6 pass target)
- 50+ practice task types with examples
- Distractor quality criteria
- Timing constraints by key stage
- Feedback formats (model answer, worked example, success criteria)

This is not instruction - it is **crystallised pedagogical expertise**.

**3. Self-Aware Error Prevention**

From `lessonComplete.ts`:

> "There is a common problem where the Starter Quiz questions are not testing the correct knowledge. Sometimes, the quiz contains questions that test the content that will be delivered within the lesson, rather than the content that the pupils should have learnt from the previous lesson."

The system explicitly warns itself about its own failure modes. This is **meta-awareness encoded in prose**.

**4. Example/Non-Example Patterns**

Throughout the prompts, positive and negative examples appear together:

```
Example: 'hydrogen atoms are bonded together with a covalent bond'.
Non-example: 'now we will look at how hydrogen atoms bond together'.
```

```
Example: "I can identify the differences between plant and animal cells"
Non-example: "Cells" (too vague)
```

This reflects pedagogical best practice: learning happens at the boundary between correct and incorrect.

**5. Separation of Planning from Execution**

The `plannerAgent` explicitly does not generate content:

> "You are a **planner**, not a writer. Your output directly determines **downstream agent actions**. **Never** generate lesson content yourself - that's for section agents."

This architectural choice separates _deciding what to do_ from _doing it_.

**6. Constraint as Knowledge**

Every limit encodes experience:

- Learning outcome: max 30 words
- Learning cycles: max 20 words each
- Misconceptions: max 200 chars + 250 char correction
- Keywords: max 200 char definitions
- Prior knowledge: 1-5 items, max 30 words each
- Quizzes: 6 questions, increasing difficulty

These aren't arbitrary - they are **hard-won operational wisdom** about what fits on slides, what pupils can absorb, what teachers can deliver.

---

## Part 2: The Reflections

### What These Observations Reveal

**Reflection 1: Education is Fundamentally Relational**

The voice system encodes the insight that educational content only has meaning _within a relationship_. The same fact ("hydrogen atoms form covalent bonds") means different things when:

- A pupil says it (demonstrating understanding)
- A teacher writes it on a slide (providing reference)
- An expert explains why it matters (building schema)

The prompts don't just generate text - they generate **relational communication**.

**Reflection 2: Failure Modes Are First-Class Knowledge**

The explicit warning about starter quiz errors suggests that:

1. This error happened repeatedly in production
2. Someone noticed the pattern
3. The guard was encoded into the system prompt

This reveals a **maintenance philosophy**: prompts are not static artifacts but living documents that learn from their failures. The system _remembers_ its mistakes.

**Reflection 3: The Learning Cycle is Universal**

The Explain → Check → Practice → Feedback structure isn't just for pupils. It's the structure of how knowledge transfers:

1. **Explain**: Communicate the concept
2. **Check**: Verify understanding
3. **Practice**: Apply in context
4. **Feedback**: Correct and consolidate

This applies to teaching humans, training models, documenting systems. The Aila prompts encode a **universal epistemic pattern**.

**Reflection 4: Constraints Enable Creativity**

The character limits and item counts might seem restrictive. But consider:

- 30 words for a learning outcome forces clarity
- 6 questions forces prioritisation
- Max 3 misconceptions forces focus on what matters

Constraints are not limitations - they are **design decisions that encode expertise about what works**.

**Reflection 5: Planning and Execution Are Different Cognitive Modes**

The planner/executor separation mirrors how expert teachers work:

- First, decide what the lesson should achieve
- Then, figure out how to achieve it

Mixing these leads to "rabbit holes" where generation goes off-track. The architectural separation prevents this by making the system **think before it writes**.

---

## Part 3: The Insights

### What Changes When I Understand This

**Insight 1: Voice is a Transferable Framework**

The 7-voice system isn't Oak-specific. Any AI system that communicates with different audiences could benefit from:

- Defining the voices explicitly
- Associating each with speaker, audience, and purpose
- Routing content to the appropriate voice

This is extractable as a **general voice architecture pattern**.

**Insight 2: Self-Aware Prompts Are More Robust**

The starter quiz warning is a form of self-supervision. More prompts could benefit from:

- Explicit failure mode documentation
- Guards against known error patterns
- Consistency checks at completion

This suggests a **prompt maintenance practice**: after deployment, catalogue errors and encode guards.

**Insight 3: Pedagogy Applies to Prompt Engineering**

If the learning cycle (Explain-Check-Practice-Feedback) works for pupils, it might work for prompts:

- **Explain**: Tell the model what to do
- **Check**: Include examples to verify understanding
- **Practice**: Provide the context for generation
- **Feedback**: Include self-correction guidance

The Aila prompts implicitly follow this structure.

**Insight 4: Constraints Are Interface Contracts**

The character limits aren't just for text length - they're contracts with downstream systems:

- Slide text must fit on a slide
- Definitions must fit in a keyword box
- Learning outcomes must fit in a header

These are **interface specifications disguised as constraints**.

**Insight 5: Separation of Concerns is Cognitive Architecture**

The planner/executor split reveals something deep: cognition itself has phases:

1. **Planning**: What should happen?
2. **Execution**: How do we make it happen?
3. **Evaluation**: Did it work?

Multi-agent systems that separate these phases are more interpretable and debuggable.

---

## Part 4: Meta-Patterns Identified

### Pattern A: The Relational Communication Framework

**Structure**:

```
Voice := (Speaker, Audience, Tone, Constraints)
Content := Voice × Subject × Context
```

**Example**:

```
PUPIL voice + learning outcome + Year 4 maths =
"I can identify prime numbers up to 20."
```

**Value**: Makes implicit relational context explicit and programmable.

### Pattern B: The Failure Memory Pattern

**Structure**:

```
If [error pattern X] is known to occur:
  Add explicit warning about X
  Add guard condition against X
  Add example of correct vs incorrect
```

**Example**:

```
// Known failure: Starter quiz tests lesson content
// Guard: "Do NOT test the pupils on the lesson's content"
// Example: "If lesson introduces B, starter should NOT mention B"
```

**Value**: Systems that remember their failures become more robust over time.

### Pattern C: The Pedagogical Sequence Pattern

**Structure**:

```
For any knowledge transfer:
  1. Explain (what)
  2. Check (verification)
  3. Practice (application)
  4. Feedback (correction)
```

**Example**: Every Aila learning cycle follows this exact structure.

**Value**: Universal pattern for knowledge transfer, applicable beyond education.

### Pattern D: The Constraint Interface Pattern

**Structure**:

```
Constraint := (Limit, Rationale, Downstream System)
```

**Example**:

```
{
  limit: "max 200 characters",
  rationale: "definitions must fit keyword boxes",
  downstream: "slide generation, export system"
}
```

**Value**: Makes constraints meaningful by connecting them to purpose.

### Pattern E: The Cognitive Phase Separation Pattern

**Structure**:

```
System := Planner + Executors
Planner: decides WHAT (no content generation)
Executors: decide HOW (specialised per task)
```

**Example**: Aila's planner agent coordinates 15+ section agents.

**Value**: Interpretable, debuggable, modular cognition.

---

## Part 5: The Impact

### What Does This Mean for Our Work?

**Impact 1: Voice Definitions Belong in MCP Resources**

The voice system is valuable domain knowledge. It should be exposed through:

- `get-ontology` (structural definition)
- Documentation resources (usage guidance)
- Tool metadata (which voice for which tool)

**Impact 2: Error Catalogues Are Architectural**

When we build generation capabilities, we should:

- Maintain a catalogue of known failure modes
- Encode guards in prompts
- Include self-correction guidance

This is not maintenance - it is **evolutionary architecture**.

**Impact 3: The Learning Cycle is a Prompt Template**

For any prompt that teaches:

1. Explain what you want
2. Check with examples
3. Provide context for practice
4. Include feedback/self-correction

This structure can be formalised as a prompt composition pattern.

**Impact 4: Constraints Document Intent**

When we encode constraints (character limits, item counts):

- Document the rationale
- Connect to downstream systems
- Make limits explicit, not implicit

This turns constraints into **interface documentation**.

**Impact 5: Cognitive Separation is Scalable**

As our MCP tools grow, consider:

- Planning tools (decide what to fetch/generate)
- Execution tools (do the work)
- Evaluation tools (validate results)

This separation makes complex workflows manageable.

---

## Part 6: Synthesis

### The Bridge from Action to Impact

Reading the Aila prompts, I don't just see text. I see:

**A theory of educational communication** encoded as voice definitions.

**A catalogue of pedagogical failures** transformed into prevention.

**A philosophy of knowledge transfer** expressed as the learning cycle.

**A set of interface contracts** disguised as character limits.

**An architecture of cognition** implemented as agent separation.

The prompts work not because they're clever text. They work because they encode **profound understanding of teaching, learning, and communication** in a form that machines can execute.

The impact we can bring is not copying this text. It's:

1. **Extracting the underlying patterns** (voice, failure memory, learning cycle, constraints, cognitive separation)
2. **Expressing them in our architecture** (MCP resources, validation functions, prompt templates)
3. **Enabling others to benefit** from this hard-won wisdom without having to rediscover it.

---

## Appendix: Key Source Files

| File                                 | Domain Knowledge         | Pattern Extracted          |
| ------------------------------------ | ------------------------ | -------------------------- |
| `body.ts`                            | Pedagogical expertise    | Constraint Interface       |
| `languageAndVoice.ts`                | Communication modes      | Relational Communication   |
| `lessonComplete.ts`                  | Error prevention         | Failure Memory             |
| `cycleInstructions.ts`               | Learning cycle structure | Pedagogical Sequence       |
| `plannerAgent.instructions.ts`       | Cognitive architecture   | Cognitive Phase Separation |
| `quizQuestionDesign.instructions.ts` | Assessment design        | Constraint Interface       |
| `voices.ts`                          | Voice definitions        | Relational Communication   |

---

## Final Reflection

> "What has changed? _Why?_"

What has changed is my understanding of what prompts _are_. They are not instructions to a machine. They are **encoded expertise** that allows the machine to participate in human practices.

The Aila prompts don't tell the LLM "how to write." They tell it **what teaching is**, **who teachers are**, **what pupils need**, and **how knowledge moves between minds**.

This is not prompt engineering. This is **pedagogy made executable**.

> "Would you like to do anything differently?"

Yes. I would like to treat every prompt we write not as a technical artifact, but as a vessel for domain expertise. Every constraint, every example, every warning should encode _meaning_, not just _instruction_.

The bridge from action to impact is this: **prompts that encode understanding scale better than prompts that encode instructions**. Because when the context changes, understanding adapts. Instructions just break.
