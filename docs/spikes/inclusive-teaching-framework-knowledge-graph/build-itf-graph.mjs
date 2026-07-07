#!/usr/bin/env node
/**
 * build-itf-graph.mjs
 *
 * Builds a knowledge graph from the content of the Inclusive Teaching
 * Framework (Ambition Institute, March 2026) in the style of the Oak Open
 * Curriculum Ecosystem graph corpus: kind-qualified node ids, a
 * discriminated union of node kinds, and a small typed directed-edge
 * vocabulary, wrapped in an envelope with recomputed stats.
 *
 * Emits into ./itf-graph/ :
 *   - data.json    — OCE-style corpus envelope { version, stats, nodes, edges }
 *   - data.jsonl   — line-oriented rendering: one meta line, then one record
 *                    per node and per edge ({ record: 'meta'|'node'|'edge' })
 *   - schema.json  — JSON Schema (2020-12); root validates data.json,
 *                    #/$defs/jsonlRecord validates each data.jsonl line
 *
 * All node/edge content is grounded in the document text. People are
 * deliberately not modelled as nodes; published bibliographic citations are
 * kept verbatim. The source typo "predicable" (sensory insight 1 title) is
 * normalised to "predictable".
 *
 * PRESERVATION COPY — this hand-authored JavaScript is sanctioned for this
 * spike only (owner direction 2026-07-07, knowledge preservation). All
 * official repository code must be TypeScript; the proper integration pass
 * will promote this to a typed, tested workspace module. See README.md and
 * NOTES.md alongside this file.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Outputs are written alongside this script.
const OUT_DIR = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Source content (extracted from the PDF)
// ---------------------------------------------------------------------------

const FRAMEWORK = {
  kind: 'framework',
  id: 'framework:inclusive-teaching-framework',
  title: 'Inclusive Teaching Framework',
  publisher: 'Ambition Institute',
  published: '2026-03',
  audience:
    'Teacher educators (people who lead the professional development of teachers) in mainstream schools',
  purpose:
    'Sets out essential knowledge to help teachers understand and meet a wider range of pupils’ needs in mainstream classrooms. A starting point for what knowledge teachers need to help create inclusive classrooms, building on their core teaching skills, organised by five areas of pupil need.',
};

const AREAS = [
  {
    slug: 'speech-and-language',
    title: 'Speech and language',
    order: 1,
    partner: 'speech-and-language-uk',
    summary:
      'How children understand and use spoken language to think, learn and relate to others: how children process and make meaning from language (receptive) and how they formulate and share their ideas with others (expressive). Expressive and receptive language capabilities can differ within the same child, and challenges with either can influence difficulties in reading or with mental health. Everyday opportunities for talk, questioning and visuals are universal supports that influence speech and language development for all pupils, and the curriculum itself can catalyse language development.',
  },
  {
    slug: 'sensory',
    title: 'Sensory',
    order: 2,
    partner: 'royal-college-of-occupational-therapists',
    summary:
      'How children experience their environment through their senses — sight, hearing, touch, taste and smell, plus proprioception (awareness of the body in space) and the vestibular sense (balance). Everyone experiences the environment differently; differences include hypersensitivity (experiencing input more strongly) and hyposensitivity (less easily). The sensory information an environment provides influences a child’s ability to focus on and process information, is crucial for coordinating precise actions, and differences in noticing and interpreting it can produce strong reactions, frustration or avoidance.',
  },
  {
    slug: 'motor',
    title: 'Motor',
    order: 3,
    partner: 'royal-college-of-occupational-therapists',
    summary:
      'Motor skills involve the planning, control and coordination of the body’s muscles to perform tasks — from whole-body movement to fine hand control. Gross motor skills (posture, balance, whole-body control and large movements) and fine motor skills (precise hand and finger movements) interact to produce movement. Developing fine motor skills enables tasks such as writing to become more automatic and take less effort, so children can think about the content they are learning.',
  },
  {
    slug: 'executive-function',
    title: 'Executive function',
    order: 4,
    partner: 'national-association-of-principal-educational-psychologists',
    summary:
      'Executive functions are the mental processes involved in managing thoughts, behaviours and emotions to achieve goals. The core executive functions — working memory, inhibitory control and cognitive flexibility — underpin higher-order functions such as planning and organisation, continue to develop into adulthood, and vary widely between children, across tasks and according to the environment. They can be developed in specific contexts through modelling, practice and feedback, and are affected by sleep, stress and the predictability of the environment.',
  },
  {
    slug: 'social-and-emotional-development',
    title: 'Social and emotional development',
    order: 5,
    partner: 'the-difference',
    summary:
      'How children understand and manage emotions, build relationships, and navigate social situations as learners and members of the school community. Includes regulation, how children identify, understand and express emotions in themselves and others, and social cognition such as Theory of Mind. Adult-child interactions, predictable routines and supporting language development create the conditions for safety and engagement; the interactions, systems and structures of school and teachers provide the essential scaffold for self-regulation to develop (co-regulation).',
  },
];

const IDEAS = [
  {
    slug: 'expressive-and-receptive-language-are-different',
    area: 'speech-and-language',
    title: 'Expressive and receptive language are different',
    description:
      'Expressive language (how we communicate our thinking) and receptive language (how we understand others) are different. This means we can find one harder than the other.',
    concepts: ['expressive-language', 'receptive-language'],
  },
  {
    slug: 'we-learn-language-at-different-rates',
    area: 'speech-and-language',
    title: 'We learn language at different rates',
    description:
      'Practice with language can affect the speed that language develops. Good quality, structured and meaningful conversations can advance language development.',
    concepts: ['expressive-language', 'receptive-language'],
  },
  {
    slug: 'we-have-more-than-five-senses',
    area: 'sensory',
    title: 'We have more than five senses',
    description:
      'There is debate about exactly how many senses human beings have, but there is broad agreement about many of them, including sight, hearing, touch, taste, smell, awareness of our body in space (proprioception), and balance (vestibular sense).',
    concepts: ['proprioception', 'vestibular-sense'],
  },
  {
    slug: 'we-each-experience-our-environment-differently-through-our-senses',
    area: 'sensory',
    title: 'We each experience our environment differently through our senses',
    description:
      'How we experience our environment is affected by our ability to notice and interpret sensory information, need for predictability, how our brain responds to sensory input, and our skill in managing our exposure to sensory information. Some people experience one or more forms of sensory information more strongly (hypersensitive) or less easily (hyposensitive).',
    concepts: ['hypersensitivity', 'hyposensitivity'],
  },
  {
    slug: 'sensory-experience-is-influenced-by-many-factors',
    area: 'sensory',
    title: 'Sensory experience is influenced by many factors',
    description:
      'We all respond differently to sensory information. This is influenced by many factors, including how we receive and process sensory information, personal preferences, our emotional state, fatigue, previous experiences, and our broader development. We can experience the same environment differently, potentially affecting how we feel, act and learn; all these factors interact, making it hard to predict the consequences of actions.',
    concepts: ['sensory-environment'],
  },
  {
    slug: 'actions-require-us-to-combine-different-types-of-motor-skills',
    area: 'motor',
    title: 'Actions require us to combine different types of motor skills',
    description:
      'Motor skills involve the coordination and control of the body’s muscles to perform a task. Gross motor skills (such as waving a hand) use larger muscle groups; fine motor skills (such as buttoning a shirt) use smaller muscles. Many physical actions involve a combination — writing by hand requires both gross (movements in the shoulder and elbow) and fine motor skills (precise movement of the hand).',
    concepts: ['gross-motor-skills', 'fine-motor-skills'],
  },
  {
    slug: 'motor-skills-facilitate-learning',
    area: 'motor',
    title: 'Motor skills facilitate learning',
    description:
      'Writing and drawing rely on fine motor skills, as well as cognitive processes like planning, sequencing movements and maintaining attention. When fine motor skills develop, tasks such as writing and drawing become more automatic, reducing the mental effort needed for each movement and freeing up attention for learning and thinking. Improving motor skills can support some cognitive processes and vice versa.',
    concepts: ['fine-motor-skills', 'automaticity', 'attention'],
  },
  {
    slug: 'executive-functions-enable-success',
    area: 'executive-function',
    title: 'Executive functions enable success',
    description:
      'Managing attention, planning and managing time enable us to orchestrate our thoughts, behaviours and emotion toward our goals. These higher-order executive functions are often considered to be made up of three core executive functions in combination: working memory (holding information in mind and manipulating it), inhibitory control (ignoring distractions and resisting unwanted responses), and cognitive flexibility (switching between ideas or approaches).',
    concepts: [
      'executive-functions',
      'working-memory',
      'inhibitory-control',
      'cognitive-flexibility',
    ],
  },
  {
    slug: 'everyones-ability-to-use-executive-functions-varies',
    area: 'executive-function',
    title: 'Everyone’s ability to use executive functions varies',
    description:
      'Executive functions start developing in early childhood and continue into adulthood. We develop these skills at different rates, shaped by the support and guidance we receive, and we all find certain aspects easier or harder. This can change depending on factors like age, energy, emotions, motivation and environment.',
    concepts: ['executive-functions'],
  },
  {
    slug: 'social-and-emotional-development-continues-into-adulthood',
    area: 'social-and-emotional-development',
    title: 'Social and emotional development continues into adulthood',
    description:
      'Skills like self-regulation, recognising emotions and managing relationships take time to build and continue to develop throughout our lives. Children may be earlier in their development than we expect and may have gaps in their social and emotional learning; they may need extra support to meet the expectations of school life.',
    concepts: ['self-regulation'],
  },
  {
    slug: 'learning-is-an-emotional-and-social-process',
    area: 'social-and-emotional-development',
    title: 'Learning is an emotional and social process',
    description:
      'Learning involves taking risks, building relationships and coping with setbacks, which can trigger many emotions and place demands on emotional regulation and social skills. Classrooms, schools and homes are diverse spaces with a wide range of norms and expectations, and children may require support navigating these differences. How safe and secure the school environment makes children feel shapes how much they benefit from teaching.',
    concepts: ['self-regulation'],
  },
  {
    slug: 'the-environment-is-linked-to-social-and-emotional-interactions',
    area: 'social-and-emotional-development',
    title: 'The environment is linked to social and emotional interactions',
    description:
      'How we express and regulate emotions and interact socially are closely linked to our environment. Behaviours and relationships are influenced by what others feel, say and do, and by the expectations set. The way adults respond and relate to children can affect if, how and when children share feelings and can regulate.',
    concepts: ['self-regulation'],
  },
];

const INSIGHTS = [
  {
    area: 'speech-and-language',
    order: 1,
    title: 'Visual cues can help overcome receptive language challenges',
    explanation:
      'Combining speech with visuals (the modality effect) can improve comprehension for all learners, especially those who find it hard to process language by listening alone. Visual cues — such as pictures, symbols, gestures or objects — aid understanding of what is said for two reasons: spoken language is fleeting, so visual cues provide a stable reference point to help make sense of what is heard; and children hold and process visual information differently.',
    concepts: ['visual-cues', 'modality-effect', 'receptive-language'],
  },
  {
    area: 'speech-and-language',
    order: 2,
    title: 'Carefully phrasing questions and explanations can make learning easier',
    explanation:
      'The way teachers phrase questions and explanations affects how children process and understand spoken information. When language is complex — unfamiliar words, intricate sentence structures or idioms — it is harder to make sense of what is being said. Using simple sentence structures, avoiding complex grammar or idioms, and allowing more time to process information helps all pupils, especially those who experience greater challenges with attention, working memory or receptive language.',
    concepts: ['receptive-language', 'working-memory', 'attention'],
  },
  {
    area: 'speech-and-language',
    order: 3,
    title: 'Classroom talk can help develop expressive and receptive language skills',
    explanation:
      'Children become better at understanding others (receptive language) and communicating their thoughts and emotions (expressive language) through practice. Regular, structured classroom talk gives children opportunities to practise tracking conversations, clarifying meaning, and forming and expressing ideas clearly. Teachers can plan meaningful classroom talk by linking it to curriculum content, supporting both language development and content learning.',
    concepts: ['classroom-talk', 'expressive-language', 'receptive-language'],
  },
  {
    area: 'speech-and-language',
    order: 4,
    title: 'The curriculum can act as a lever for speech and language development',
    explanation:
      'Subject content naturally provides rich vocabulary, complex sentence patterns and varied forms of communication, such as explanation, argument and narrative. Subject-specific words in maths and science, and stories or arguments in history and literature, encourage children to use complex language with a wide variety of sounds and meanings; written texts further expose children to sophisticated vocabulary and structures, supporting overall language growth.',
    concepts: ['expressive-language', 'receptive-language'],
  },
  {
    area: 'speech-and-language',
    order: 5,
    title: 'Everyday teacher-child conversations can support speech and language development',
    explanation:
      'Children need regular chances to hear, practise and develop their understanding and use of language in everyday contexts, across all age groups, complementing targeted interventions. Teachers can provide these opportunities through everyday conversations, in lessons or informal moments, and can give informal feedback during interactions — exchanges that lower the stakes and encourage further interaction. Everyday conversation should respect and build on pupils’ existing capabilities and varieties of talk, rather than presenting it as right or wrong.',
    concepts: ['expressive-language', 'receptive-language'],
  },
  {
    area: 'sensory',
    order: 1,
    title: 'Sensory environments matter, so predictable, simple environments can support learning',
    explanation:
      'Children’s learning is shaped by the sensory environment — the mix of sights, smells, sounds, heat and light present in a space — and its predictability affects how effectively children can engage, allocate attention and process information. Limited attention and working memory can make it challenging to ignore background sensory stimuli. Simplifying sensory environments can support learning for all children, including those who experience sensory information more strongly.',
    concepts: ['sensory-environment', 'attention', 'working-memory'],
  },
  {
    area: 'sensory',
    order: 2,
    title:
      'Senses enable precise, coordinated actions, and targeted practice helps build these skills',
    explanation:
      'Children need to notice and interpret sensory information to carry out precise, coordinated actions in school, such as writing, using equipment and moving around the classroom — actions that depend not only on sight and touch but also on proprioception and the vestibular sense. Differences in how children notice and interpret sensory information can affect their ability to judge force, maintain grip and move accurately, influencing confidence and motivation over time. Children can benefit from support and time focused on the specific skill being learned, rather than general motor activities.',
    concepts: ['proprioception', 'vestibular-sense', 'fine-motor-skills'],
  },
  {
    area: 'sensory',
    order: 3,
    title: 'Scaffolding and practice can support sensory needs',
    explanation:
      'How children process and respond to sensory information can be developed through practice and scaffolding. Temporary support can help children manage sensory responses while sensory regulation develops — for example, noise-cancelling headphones used for a time-limited, specific situation as part of a broader desensitisation strategy. Providing practice involves working in partnership with parents/carers and the school SENCO, helping children understand and manage gradual exposure to sensory input over time, building confidence and strategies for self-regulation.',
    concepts: ['scaffolding', 'sensory-regulation', 'self-regulation'],
  },
  {
    area: 'sensory',
    order: 4,
    title:
      'Understanding sensory differences helps teachers better interpret and support children’s behaviours and interactions with others',
    explanation:
      'Differences in how children experience information from their senses can affect how they move, maintain personal space and interact with others. Differences in proprioception might influence spatial awareness, contributing to bumping into others; differences in vestibular input might manifest as frequent running or restlessness, which might be misinterpreted as intentional rule-breaking or distraction. Understanding how children experience sensory information, alongside emotional state and social understanding, can help teachers better understand children’s actions and how to support them.',
    concepts: ['proprioception', 'vestibular-sense'],
  },
  {
    area: 'sensory',
    order: 5,
    title:
      'Trusted adults can help support every child in the classroom to manage the interplay between senses and emotion',
    explanation:
      'Children’s sensory experiences and emotions are intertwined: what they see, hear or feel can affect their emotions, and their emotional state can change how they respond to sensory input. Heightened or reduced sensitivity can affect emotional reactions and self-regulation, and these responses are affected by mood, context or fatigue. Over time, children can become more used to sensory stimuli and be supported to develop strategies to manage their emotions; explicit support from trusted adults often plays a role in building these skills.',
    concepts: ['hypersensitivity', 'hyposensitivity', 'self-regulation'],
  },
  {
    area: 'motor',
    order: 1,
    title:
      'Supporting and building core strength and posture enables precise movement such as writing',
    explanation:
      'Muscles in the torso, lower back, pelvis and hips provide stability for balance and posture, which in turn support fine motor skills like writing, drawing and using tools. Without enough core and upper body strength, children may struggle to sit upright or use their hands effectively; this can affect participation and may be mistaken for inattention, and discomfort or fatigue from instability can make it harder to focus. Most children can improve core and upper body strength through regular practice and exercise; if specialists recommend core strength development, it should be paired with targeted support for the specific learning task.',
    concepts: ['core-strength-and-posture', 'fine-motor-skills', 'attention'],
  },
  {
    area: 'motor',
    order: 2,
    title:
      'Fine motor skills for everyday tasks build on multiple components. Focusing on specific, small steps supports children to learn and build those skills',
    explanation:
      'Activities vital for learning, such as handwriting, copying shapes, and manual work in art or design technology, rely on fine motor skills. These depend on stable posture supported by larger muscles in the core and shoulder, control and dexterity of the small hand muscles, and sensory information combined with motor control. Gross motor skills typically develop before fine motor skills and children develop at different speeds; difficulties can stem from challenges with planning and control of movement, responding to sensory information, and executive functions such as planning and working memory. Teachers can support children by focusing on specific skills, breaking actions into smaller steps, providing models and offering opportunities to practise.',
    concepts: [
      'fine-motor-skills',
      'core-strength-and-posture',
      'executive-functions',
      'working-memory',
    ],
  },
  {
    area: 'motor',
    order: 3,
    title:
      'Practice can help all children to perform motor skills more easily and with less effort',
    explanation:
      'While some motor skills develop through everyday experience, others — such as cutting with scissors, using a ruler, or accurate ball skills — often require explicit guidance, targeted practice and feedback. When underlying motor skills are still developing, children may need to use more attention and working memory, making learning academic content more challenging. Children develop motor skills more effectively through targeted, task-specific practice than through general motor exercises; breaking skills into smaller steps, practising in varied contexts, and focusing on specific components helps children build confidence and perform tasks automatically.',
    concepts: ['automaticity', 'attention', 'working-memory'],
  },
  {
    area: 'executive-function',
    order: 1,
    title: 'Supporting inhibitory control can help manage attention',
    explanation:
      'Children’s ability to manage attention depends on inhibitory control, a core executive function that allows them to ignore distractions, resist impulses and choose appropriate responses; it works with working memory and cognitive flexibility to support children to direct, sustain and switch attention as needed. Inhibitory control develops gradually through many specific situations and varies across contexts and ages. The environment — from rules and relationships with adults to how tasks are set up to reduce distractions — is important in enabling it; teachers can support this by scaffolding tasks to reduce distraction and establishing rules, routines and interactions that support practice over time.',
    concepts: [
      'inhibitory-control',
      'attention',
      'working-memory',
      'cognitive-flexibility',
      'scaffolding',
    ],
  },
  {
    area: 'executive-function',
    order: 2,
    title: 'Working memory can act as a bottleneck for learning',
    explanation:
      'Learning requires children to hold information in their working memory, but working memory capacity is very limited, restricting how much new information can be processed at once. When overloaded, children may struggle to follow instructions, grasp new concepts, or appear distracted. Children process language and visual information separately in working memory; too much information in one form, or conflicting spoken and visual information, makes understanding harder. Capacity is influenced by age, attention, self-control and prior knowledge — so teachers can connect new learning to prior knowledge, introduce new information gradually, and align language with visual information.',
    concepts: ['working-memory', 'cognitive-load', 'attention'],
  },
  {
    area: 'executive-function',
    order: 3,
    title:
      'Scaffolding can support cognitive flexibility, enabling shifts in attention or perspectives',
    explanation:
      'Children use cognitive flexibility to vary their thinking and behaviour according to different contexts — coping with change, shifting attention or considering different points of view. It develops throughout childhood and relies on working memory and inhibitory control, and varies with the individual and the environment (stress and fatigue can affect it). Critically, cognitive flexibility appears to be tied to specific contexts and situations rather than being an overarching trait; children show greater flexibility where they have had prior practice. All children can be supported through scaffolds adults put in place: advance warning before changes in routine, modelling the thought process required to take on board other perspectives, and opportunities for practice and feedback.',
    concepts: ['cognitive-flexibility', 'scaffolding', 'working-memory', 'inhibitory-control'],
  },
  {
    area: 'executive-function',
    order: 4,
    title: 'Planning and organisation are learned not innate',
    explanation:
      'Children need planning and organisation to manage their learning — organising an essay, deciding how to use blocks to build a tower, or designing an experiment. Although some development happens through experience, children also need explicit support such as modelling, feedback and reinforcement, practised in specific contexts, because planning and organisation are not generic skills. They rely on core executive functions: holding ideas in working memory, avoiding distractions (inhibitory control) and considering different options (cognitive flexibility). Teachers can respond by reorganising information, using scaffolds such as visual reminders, or giving children time to talk through and refine their plans.',
    concepts: [
      'planning-and-organisation',
      'working-memory',
      'inhibitory-control',
      'cognitive-flexibility',
      'scaffolding',
    ],
  },
  {
    area: 'executive-function',
    order: 5,
    title: 'Secure, predictable environments, sleep and fitness support executive functions',
    explanation:
      'How well children can manage attention and plan and enact self-control at school is influenced by their environment, emotional state, sleep and physical fitness. Safe, lasting and predictable relationships and routines help children feel secure and reduce emotional reactions that can disrupt executive functioning; when children experience stress, anxiety, or lack of sleep or physical fitness, they can find it harder to focus or remember instructions because attention and working memory are affected. Executive functioning is not fixed but closely tied to a child’s environment and wellbeing, making support both in and out of school essential.',
    concepts: ['executive-functions', 'attention', 'working-memory', 'self-regulation'],
  },
  {
    area: 'social-and-emotional-development',
    order: 1,
    title: 'Maintaining curiosity about behaviour(s) helps understand needs',
    explanation:
      'Children’s behaviour is often influenced by the interaction between their environment and their underlying emotional, cognitive or social needs, especially when language or self-regulation skills are still developing. Actions like calling out, withdrawing or struggling with tasks can be shaped by a mix of individual factors and environmental influences, including relationships, routines, previous experiences, noise and peer dynamics. By remaining curious about the reasons and needs behind behaviour, teachers can identify interactions, patterns and environmental triggers to better understand the developmental needs driving children’s actions.',
    concepts: ['self-regulation'],
  },
  {
    area: 'social-and-emotional-development',
    order: 2,
    title: 'Co-regulation precedes self-regulation',
    explanation:
      'Managing emotions, thoughts and behaviours (self-regulation) is important in school; it continues to develop into adulthood, so it is likely to be a challenge for most pupils, especially when learning or navigating peer relationships. Adults, relationships and the school environment play a crucial role in helping children continually develop self-regulation, through co-regulation — adults guiding children’s emotions through responsive support. Predictable, proportionate responses, modelling calmness and teaching structured routines are all acts of co-regulation; with proactive, consistent support, children can lean on adults’ guidance and stability while learning to manage their emotions independently.',
    concepts: ['co-regulation', 'self-regulation'],
  },
  {
    area: 'social-and-emotional-development',
    order: 3,
    title: 'The environment can support social interaction',
    explanation:
      'Sharing, resolving disagreements, and cooperating in groups are complex social skills key to school life. To develop these, children rely on language, executive functions such as inhibitory control, and understanding abstract social cues (such as tone of voice or expressions). These skills also depend on Theory of Mind — recognising and anticipating that others may think or feel differently — which develops throughout childhood and is important for building positive relationships and behaviours like helping and cooperation. Social understanding develops with experience; teachers can structure group or paired activities and provide explicit support in understanding themselves and each other, their feelings and points of view.',
    concepts: ['theory-of-mind', 'inhibitory-control', 'executive-functions'],
  },
  {
    area: 'social-and-emotional-development',
    order: 4,
    title: 'Language supports children to express and understand emotion',
    explanation:
      'Recognising, describing and sharing emotions (emotional literacy) helps children regulate their feelings, reflect and communicate. Small, intentional steps — such as explicitly teaching children to identify emotions within specific contexts — support self-regulation and enable children to communicate their feelings and needs; the adult-child relationship and classroom environment can help children feel safe and provide space for validating and discussing feelings. Emotional literacy is tightly linked to speech and language development, and difficulties with language can increase the risk of social-emotional challenges, so approaches that explicitly support language development can help children build emotional literacy and wider wellbeing.',
    concepts: ['emotional-literacy', 'self-regulation', 'expressive-language'],
  },
  {
    area: 'social-and-emotional-development',
    order: 5,
    title: 'Teachers can help children manage the emotional and social charge of the classroom',
    explanation:
      'Every classroom activity places emotional and social demands on children, which can affect learning by occupying attention, memory and motivation. Emotions shape what children attend to, their motivation and how well they remember information; intense emotions like fear or anger can overload working memory and impair learning. Social demands, like following norms or working with others, can also require children to use executive functions and can be challenging if they feel threatening. Teachers can anticipate and respond by intentionally designing the interactions and routines that help children feel safe, supported and able to succeed.',
    concepts: ['working-memory', 'attention', 'executive-functions'],
  },
];

const CONCEPTS = [
  {
    slug: 'expressive-language',
    term: 'Expressive language',
    category: 'construct',
    description:
      'How children formulate and share their ideas with others; how we communicate our thinking.',
  },
  {
    slug: 'receptive-language',
    term: 'Receptive language',
    category: 'construct',
    description: 'How children process and make meaning from language; how we understand others.',
  },
  {
    slug: 'modality-effect',
    term: 'Modality effect',
    category: 'construct',
    description:
      'Combining speech with visuals can improve comprehension for all learners, especially those who find it hard to process language by listening alone.',
  },
  {
    slug: 'visual-cues',
    term: 'Visual cues',
    category: 'practice',
    description:
      'Pictures, symbols, gestures or objects that provide a stable reference point to help children make sense of what they hear, temporarily easing auditory processing demands.',
  },
  {
    slug: 'classroom-talk',
    term: 'Classroom talk',
    category: 'practice',
    description:
      'Regular, structured, meaningful talk that gives children opportunities to practise understanding — tracking conversations, clarifying meaning — and forming and expressing ideas clearly.',
  },
  {
    slug: 'working-memory',
    term: 'Working memory',
    category: 'construct',
    description:
      'Holding information in mind and manipulating it. Capacity is very limited, so it can act as a bottleneck restricting how much new information can be processed at once.',
  },
  {
    slug: 'inhibitory-control',
    term: 'Inhibitory control',
    category: 'construct',
    description:
      'Avoiding automatic responses and managing distractions; ignoring distractions and resisting unwanted responses.',
  },
  {
    slug: 'cognitive-flexibility',
    term: 'Cognitive flexibility',
    category: 'construct',
    description:
      'Switching attention, strategy or perspective; switching between ideas or approaches.',
  },
  {
    slug: 'executive-functions',
    term: 'Executive functions',
    category: 'construct',
    description:
      'The mental processes involved in managing thoughts, behaviours and emotions to achieve goals; core executive functions combine to support higher-order functions such as planning and organisation.',
  },
  {
    slug: 'planning-and-organisation',
    term: 'Planning and organisation',
    category: 'construct',
    description:
      'Higher-order executive functions children need to manage their learning; learned rather than innate, and not generic skills — they develop through explicit support in specific contexts.',
  },
  {
    slug: 'attention',
    term: 'Attention',
    category: 'construct',
    description:
      'Directing, sustaining and switching focus as needed; managing attention depends on inhibitory control working with working memory and cognitive flexibility.',
  },
  {
    slug: 'cognitive-load',
    term: 'Cognitive load',
    category: 'construct',
    description:
      'The demand placed on limited working memory when processing information; reducing cognitive load is a known, reliable instructional approach for novice learners.',
  },
  {
    slug: 'proprioception',
    term: 'Proprioception',
    category: 'construct',
    description: 'Awareness of the body in space, derived from muscles, ligaments and joints.',
  },
  {
    slug: 'vestibular-sense',
    term: 'Vestibular sense',
    category: 'construct',
    description: 'Balance, derived from the inner ear.',
  },
  {
    slug: 'hypersensitivity',
    term: 'Hypersensitivity',
    category: 'construct',
    description: 'Experiencing one or more forms of sensory input more strongly.',
  },
  {
    slug: 'hyposensitivity',
    term: 'Hyposensitivity',
    category: 'construct',
    description: 'Experiencing one or more forms of sensory input less easily.',
  },
  {
    slug: 'sensory-environment',
    term: 'Sensory environment',
    category: 'construct',
    description:
      'The mix of sights, smells, sounds, heat and light present in a space; its content and predictability affect how effectively children can engage, allocate attention and process information.',
  },
  {
    slug: 'sensory-regulation',
    term: 'Sensory regulation',
    category: 'construct',
    description:
      'How children process and respond to sensory information; it can be developed through practice and scaffolding, including managed gradual exposure to sensory input.',
  },
  {
    slug: 'gross-motor-skills',
    term: 'Gross motor skills',
    category: 'construct',
    description:
      'Posture, balance, whole-body control and large movements, using larger muscle groups.',
  },
  {
    slug: 'fine-motor-skills',
    term: 'Fine motor skills',
    category: 'construct',
    description: 'Precise hand and finger movements, using smaller muscles.',
  },
  {
    slug: 'core-strength-and-posture',
    term: 'Core strength and posture',
    category: 'construct',
    description:
      'Stability provided by muscles in the torso, lower back, pelvis and hips that supports balance and posture, which in turn support fine motor skills like writing, drawing and using tools.',
  },
  {
    slug: 'automaticity',
    term: 'Automaticity',
    category: 'construct',
    description:
      'Performing tasks more automatically so they take less mental effort, freeing attention for learning and thinking.',
  },
  {
    slug: 'scaffolding',
    term: 'Scaffolding',
    category: 'practice',
    description:
      'Temporary support that helps children manage demands while underlying skills develop.',
  },
  {
    slug: 'self-regulation',
    term: 'Self-regulation',
    category: 'construct',
    description:
      'Managing emotions, thoughts and behaviours; it continues to develop into adulthood.',
  },
  {
    slug: 'co-regulation',
    term: 'Co-regulation',
    category: 'construct',
    description:
      'Adults guiding children’s emotions through responsive support — predictable, proportionate responses, modelling calmness and teaching structured routines — providing the scaffold for self-regulation to develop.',
  },
  {
    slug: 'theory-of-mind',
    term: 'Theory of Mind',
    category: 'construct',
    description:
      'The capacity to recognise that others may have different thoughts and feelings; central to navigating social interactions and developing throughout childhood.',
  },
  {
    slug: 'emotional-literacy',
    term: 'Emotional literacy',
    category: 'construct',
    description:
      'Recognising, describing and sharing emotions, which helps children regulate their feelings, reflect and communicate.',
  },
  {
    slug: 'needs-based-approach',
    term: 'Needs-based approach',
    category: 'approach',
    description:
      'Organising professional learning by underlying areas of pupil need rather than by diagnosis, helping teachers understand needs that might underpin common diagnoses and support all pupils, including those who may not reach the threshold for diagnosis.',
  },
  {
    slug: 'adaptive-teaching',
    term: 'Adaptive teaching',
    category: 'practice',
    description:
      'A focus of teachers’ foundational professional development programmes on which the framework builds.',
  },
  {
    slug: 'send',
    term: 'Special educational needs and disabilities (SEND)',
    category: 'policy',
    description:
      'Pupils with SEND are some of the most educationally disadvantaged children in the school system; there is a lack of consensus about what SEND means and how it is used in education.',
  },
  {
    slug: 'experts-at-hand',
    term: 'Experts at Hand',
    category: 'policy',
    description:
      'Proposed government programme giving schools access to a dedicated allocation of specialists, such as educational psychologists, occupational therapists, speech and language therapists and others.',
  },
  {
    slug: 'autism',
    term: 'Autism',
    category: 'diagnosis',
    description:
      'A common diagnosis whose underlying needs a needs-based approach helps teachers understand.',
  },
  {
    slug: 'adhd',
    term: 'ADHD',
    category: 'diagnosis',
    description:
      'A common diagnosis whose underlying needs a needs-based approach helps teachers understand.',
  },
  {
    slug: 'dyslexia',
    term: 'Dyslexia',
    category: 'diagnosis',
    description:
      'A common diagnosis; knowledge of working memory helps educators meet the needs of pupils with dyslexia.',
  },
  {
    slug: 'dyspraxia',
    term: 'Dyspraxia',
    category: 'diagnosis',
    description:
      'A diagnosis; knowledge of working memory helps educators meet the needs of pupils with dyspraxia.',
  },
];

// Concept-to-concept relations stated in the document text.
const CONCEPT_EDGES = [
  ['expressive-language', 'relatedTo', 'receptive-language'],
  ['working-memory', 'partOf', 'executive-functions'],
  ['inhibitory-control', 'partOf', 'executive-functions'],
  ['cognitive-flexibility', 'partOf', 'executive-functions'],
  ['attention', 'reliesOn', 'inhibitory-control'],
  ['cognitive-flexibility', 'reliesOn', 'working-memory'],
  ['cognitive-flexibility', 'reliesOn', 'inhibitory-control'],
  ['planning-and-organisation', 'reliesOn', 'working-memory'],
  ['planning-and-organisation', 'reliesOn', 'inhibitory-control'],
  ['planning-and-organisation', 'reliesOn', 'cognitive-flexibility'],
  ['fine-motor-skills', 'reliesOn', 'core-strength-and-posture'],
  ['fine-motor-skills', 'reliesOn', 'executive-functions'],
  ['fine-motor-skills', 'reliesOn', 'proprioception'],
  ['fine-motor-skills', 'reliesOn', 'vestibular-sense'],
  ['gross-motor-skills', 'precedes', 'fine-motor-skills'],
  ['co-regulation', 'precedes', 'self-regulation'],
  ['automaticity', 'supports', 'attention'],
  ['scaffolding', 'supports', 'sensory-regulation'],
  ['scaffolding', 'supports', 'cognitive-flexibility'],
  ['emotional-literacy', 'supports', 'self-regulation'],
  ['emotional-literacy', 'relatedTo', 'expressive-language'],
  ['cognitive-load', 'relatedTo', 'working-memory'],
  ['working-memory', 'relatedTo', 'dyslexia'],
  ['working-memory', 'relatedTo', 'dyspraxia'],
  ['needs-based-approach', 'relatedTo', 'autism'],
  ['needs-based-approach', 'relatedTo', 'adhd'],
  ['needs-based-approach', 'relatedTo', 'dyslexia'],
];

// Cross-area links stated in the document (symmetric; recorded once per pair).
const AREA_OVERLAPS = [
  ['executive-function', 'sensory'],
  ['executive-function', 'motor'],
  ['executive-function', 'speech-and-language'],
  ['social-and-emotional-development', 'speech-and-language'],
  ['social-and-emotional-development', 'executive-function'],
];

const ORGANISATIONS = [
  {
    slug: 'ambition-institute',
    name: 'Ambition Institute',
    role: 'author-publisher',
    description:
      'A charity providing training and professional development for teachers and school leaders, based on rigorous research and evidence.',
  },
  {
    slug: 'speech-and-language-uk',
    name: 'Speech and Language UK',
    role: 'partner',
    description: 'Specialist partner for the speech and language area.',
  },
  {
    slug: 'royal-college-of-occupational-therapists',
    name: 'Royal College of Occupational Therapists',
    role: 'partner',
    description: 'Specialist partner for the sensory and motor areas.',
  },
  {
    slug: 'national-association-of-principal-educational-psychologists',
    name: 'National Association of Principal Educational Psychologists',
    role: 'partner',
    description: 'Specialist partner for the executive function area.',
  },
  {
    slug: 'the-difference',
    name: 'The Difference',
    role: 'partner',
    description: 'Specialist partner for the social and emotional development area.',
  },
];

const PRINCIPLES = [
  {
    slug: 'partner-with-specialists',
    order: 1,
    title: 'Partner with specialists',
    description:
      'The framework is the result of partnership with specialist practitioners and organisations, including occupational therapists, speech and language therapists, educational psychologists and specialist teachers, combined with experience as a national provider of professional development.',
  },
  {
    slug: 'thorough-research',
    order: 2,
    title: 'Thorough research',
    description:
      'Evidence was selected using four filters: does it build on well-established concepts; can the insight be substantiated across multiple, high quality studies (large-scale studies, systematic reviews or meta-analyses, and converging smaller studies); is it relevant to mainstream settings; and does it align with principles of high quality teaching, such as those in the national professional development frameworks.',
  },
  {
    slug: 'focus-on-knowledge-likely-to-make-the-biggest-difference',
    order: 3,
    title: 'Focus on knowledge likely to make the biggest difference',
    description:
      'The framework focuses on knowledge and insights rather than a toolkit of strategies, prioritising insights that build on teachers’ and leaders’ prior knowledge so training based on the framework is manageable to implement.',
  },
  {
    slug: 'a-starting-point',
    order: 4,
    title: 'A starting point',
    description:
      'The framework is intended as a starting point for teacher educators; the evidence base will continue to evolve and grow, and it should be used alongside wider resources including the Equality Act and guidance from the Education Endowment Foundation.',
  },
];

const REFERENCES = [
  {
    slug: 'cleave-2015',
    year: 2015,
    areas: ['speech-and-language'],
    citation:
      'Cleave, P. L., Becker, S. D., Curran, M. K., Owen Van Horne, A. J., & Fey, M. E. (2015). The efficacy of recasts in language intervention: A systematic review and meta-analysis. American Journal of Speech-Language Pathology, 24(2), 237–255.',
  },
  {
    slug: 'dobinson-2021',
    year: 2021,
    areas: ['speech-and-language'],
    citation:
      'Dobinson, K. L., & Dockrell, J. E. (2021). Universal strategies for the improvement of expressive language skills in the primary classroom: A systematic review. First Language, 41(5), 527-554.',
  },
  {
    slug: 'dockrell-2012',
    year: 2012,
    areas: ['speech-and-language'],
    citation:
      'Dockrell, J., Ricketts, J., & Lindsay, G. (2012). Understanding speech, language and communication needs: Profiles of need and provision (2012). DfE RR227 BCRP4.',
  },
  {
    slug: 'holt-2020',
    year: 2020,
    areas: ['speech-and-language'],
    citation:
      'Holt, R., Bruggeman, L., & Demuth, K. (2020). Visual speech cues speed processing and reduce effort for children listening in quiet and noise. Applied Psycholinguistics, 41(4), 933-961.',
  },
  {
    slug: 'law-2017',
    year: 2017,
    areas: ['speech-and-language'],
    citation:
      'Law, J., Charlton, J., Dockrell, J., Gascoigne, M., McKean, C., & Theakston, A. (2017). Early Language Development: Needs, provision, and intervention for preschool children from socioeconomically disadvantaged backgrounds. London: Education Endowment Foundation.',
  },
  {
    slug: 'nation-1999',
    year: 1999,
    areas: ['speech-and-language'],
    citation:
      'Nation, K., Adams, J.W., Bowyer-Crane, C.A. & Snowling, M.J. (1999) Working Memory Deficits in Poor Comprehenders Reflect Underlying Language Impairments. Journal of Experimental Child Psychology. 73(2): 139-158.',
  },
  {
    slug: 'nation-2022',
    year: 2022,
    areas: ['speech-and-language'],
    citation:
      'Nation, K., Dawson, N. J., & Hsiao, Y. (2022). Book Language and Its Implications for Children’s Language, Literacy, and Development. Current Directions in Psychological Science, 31(4), 375-380.',
  },
  {
    slug: 'owen-van-horne-2024',
    year: 2024,
    areas: ['speech-and-language'],
    citation:
      'Owen Van Horne, A. J., Curran, M., Weatherford, S., & McGregor, K. K. (2024). We Have to Talk About Something: Why NOT Talk About the Curriculum? A Guide to Embedding Language Interventions in Curricular Content. Language, Speech, and Hearing Services in Schools, 55(3), 648-660.',
  },
  {
    slug: 'sedgwick-2018',
    year: 2018,
    areas: ['speech-and-language'],
    citation:
      'Sedgwick, A., & Stothard, J. (2018). A systematic review of school–based, mainstream, oral language interventions for key stage 1 children. Support for Learning, 33(4), 360-387.',
  },
  {
    slug: 'sweller-2019',
    year: 2019,
    areas: ['speech-and-language'],
    citation:
      'Sweller, J., Van Merriënboer, J. J., & Paas, F. (2019). Cognitive architecture and instructional design: 20 years later. Educational psychology review, 31(2), 261-292.',
  },
  {
    slug: 'zimmerman-2009',
    year: 2009,
    areas: ['speech-and-language'],
    citation:
      'Zimmerman, F. J., Gilkerson, J., Richards, J. A., Christakis, D. A., Xu, D., Gray, S., & Yapanel, U. (2009). Teaching by listening: The importance of adult-child conversations to language development. Pediatrics, 124(1), 342-349.',
  },
  {
    slug: 'barton-2015',
    year: 2015,
    areas: ['sensory'],
    citation:
      'Barton, E. E., Reichow, B., Schnitz, A., Smith, I. C., & Sherlock, D. (2015). A systematic review of sensory-based treatments for children with disabilities. Research in developmental disabilities, 37, 64-80.',
  },
  {
    slug: 'blank-2019',
    year: 2019,
    areas: ['sensory', 'motor'],
    citation:
      'Blank, R., Barnett, A. L., Cairney, J., Green, D., Kirby, A., Polatajko, H., Rosenblum, S., Smits-Engelsman, B., Sugden, D., Wilson, P. & Vinçon, S. (2019). International clinical practice recommendations on the definition, diagnosis, assessment, intervention, and psychosocial aspects of developmental coordination disorder. Developmental Medicine & Child Neurology, 61(3), 242-285.',
  },
  {
    slug: 'choi-2014',
    year: 2014,
    areas: ['sensory'],
    citation:
      'Choi, H. H., Van Merriënboer, J. J., & Paas, F. (2014). Effects of the physical environment on cognitive load and learning: Towards a new model of cognitive load. Educational psychology review, 26(2), 225-244.',
  },
  {
    slug: 'connolly-2019',
    year: 2019,
    areas: ['sensory'],
    citation:
      'Connolly, D., Dockrell, J., Shield, B., Conetta, R., Mydlarz, C., & Cox, T. (2019). The effects of classroom noise on the reading comprehension of adolescents. The journal of the Acoustical Society of America, 145(1), 372-381.',
  },
  {
    slug: 'daly-smith-2018',
    year: 2018,
    areas: ['sensory'],
    citation:
      'Daly-Smith, A. J., Zwolinsky, S., McKenna, J., Tomporowski, P. D., Defeyter, M. A., & Manley, A. (2018). Systematic review of acute physically active learning and classroom movement breaks on children’s physical activity, cognition, academic performance and classroom behaviour: understanding critical design features. BMJ open sport & exercise medicine, 4(1).',
  },
  {
    slug: 'eddy-2019',
    year: 2019,
    areas: ['sensory'],
    citation:
      'Eddy, L. H., Wood, M. L., Shire, K. A., Bingham, D. D., Bonnick, E., Creaser, A., ... & Hill, L. J. (2019). A systematic review of randomized and case-controlled trials investigating the effectiveness of school-based motor skill interventions in 3-to 12-year-old children. Child: care, health and development, 45(6), 773-790.',
  },
  {
    slug: 'firestone-2016',
    year: 2016,
    areas: ['sensory'],
    citation:
      'Firestone, C., & Scholl, B. J. (2016). Cognition does not affect perception: Evaluating the evidence for “top-down” effects. Behavioral and brain sciences, 39, e229.',
  },
  {
    slug: 'lerner-2015',
    year: 2015,
    areas: ['sensory'],
    citation:
      'Lerner, J. S., Li, Y., Valdesolo, P., & Kassam, K. S. (2015). Emotion and decision making. Annual review of psychology, 66(1), 799-823.',
  },
  {
    slug: 'unwin-2024',
    year: 2024,
    areas: ['sensory'],
    citation:
      'Unwin, K., Wales, K., Johnson, T., Leonard, C., Dixon, G., English, L., & Lane, A. (2024). Evidence Synthesis and Clinical Recommendations for Supporting School Students With Sensory Processing Challenges: A Rapid Review. The American Journal of Occupational Therapy, 78(6), 7806205010.',
  },
  {
    slug: 'cameron-2016',
    year: 2016,
    areas: ['motor'],
    citation:
      'Cameron, C. E., Cottone, E. A., Murrah, W. M., & Grissmer, D. W. (2016). How Are Motor Skills Linked to Children’s School Performance and Academic Achievement? Child Development, 10(2), 93-98.',
  },
  {
    slug: 'davis-2011',
    year: 2011,
    areas: ['motor'],
    citation:
      'Davis, E. E., Pitchford, N. J., & Limback, E. (2011). The interrelation between cognitive and motor development in typically developing children aged 4–11 years is underpinned by visual processing and fine manual control. British Journal of Psychology, 102(3), 569-584.',
  },
  {
    slug: 'ericsson-2016',
    year: 2016,
    areas: ['motor'],
    citation:
      'Ericsson, A., & Pool, R. (2016). Peak: Secrets from the new science of expertise. Random House.',
  },
  {
    slug: 'gandotra-2022',
    year: 2022,
    areas: ['motor'],
    citation:
      'Gandotra, A., Csaba, S., Sattar, Y., Cserényi, V., Bizonics, R., Cserjesi, R., & Kotyuk, E. (2022). A meta-analysis of the relationship between motor skills and executive functions in typically-developing children. Journal of Cognition and Development, 23(1), 83-110.',
  },
  {
    slug: 'scott-2023',
    year: 2023,
    areas: ['motor'],
    citation:
      'Scott, M. W., Wood, G., Holmes, P. S., Marshall, B., Williams, J., & Wright, D. J. (2023). Combined action observation and motor imagery improves learning of activities of daily living in children with developmental coordination disorder. PLoS One, 18(5).',
  },
  {
    slug: 'wulf-2010',
    year: 2010,
    areas: ['motor'],
    citation:
      'Wulf, G., Shea, C., & Lewthwaite, R. (2010). Motor skill learning and performance: a review of influential factors. Medical education, 44(1), 75-84.',
  },
  {
    slug: 'best-2010',
    year: 2010,
    areas: ['executive-function'],
    citation:
      'Best, J. R., & Miller, P. H. (2010). A developmental perspective on executive function. Child development, 81(6), 1641-1660.',
  },
  {
    slug: 'best-2011',
    year: 2011,
    areas: ['executive-function'],
    citation:
      'Best, J. R., Miller, P. H., & Naglieri, J. A. (2011). Relations between executive function and academic achievement from ages 5 to 17 in a large, representative national sample. Learning and individual differences, 21(4), 327-336.',
  },
  {
    slug: 'braem-2018',
    year: 2018,
    areas: ['executive-function'],
    citation:
      'Braem, S., & Egner, T. (2018). Getting a grip on cognitive flexibility. Current directions in psychological science, 27(6), 470-476.',
  },
  {
    slug: 'center-on-the-developing-child-2011',
    year: 2011,
    areas: ['executive-function'],
    citation:
      'Center on the Developing Child at Harvard University (2011). Building the Brain’s “Air Traffic Control” System: How Early Experiences Shape the Development of Executive Function: Working Paper No. 11.',
  },
  {
    slug: 'diamond-2013',
    year: 2013,
    areas: ['executive-function'],
    citation:
      'Diamond, A. (2013). Executive functions. Annual review of psychology, 64(1), 135-168.',
  },
  {
    slug: 'furley-2025',
    year: 2025,
    areas: ['executive-function'],
    citation:
      'Furley, P., Schütz, L. M., & Wood, G. (2025). A critical review of research on executive functions in sport and exercise. International Review of Sport and Exercise Psychology, 18(1), 316-344.',
  },
  {
    slug: 'gathercole-2004',
    year: 2004,
    areas: ['executive-function'],
    citation:
      'Gathercole, S. E., Pickering, S. J., Ambridge, B., & Wearing, H. (2004). The Structure of Working Memory From 4 to 15 Years of Age. Developmental Psychology, 40(2), 177-190.',
  },
  {
    slug: 'melby-lervag-2016',
    year: 2016,
    areas: ['executive-function'],
    citation:
      'Melby-Lervåg, M., Redick, T. S., & Hulme, C. (2016). Working memory training does not improve performance on measures of intelligence or other measures of “far transfer” evidence from a meta-analytic review. Perspectives on Psychological Science, 11(4), 512-534.',
  },
  {
    slug: 'tricot-2014',
    year: 2014,
    areas: ['executive-function'],
    citation:
      'Tricot, A., & Sweller, J. (2014). Domain-specific knowledge and why teaching generic skills does not work. Educational psychology review, 26(2), 265-283.',
  },
  {
    slug: 'allen-2011',
    year: 2011,
    areas: ['social-and-emotional-development'],
    citation:
      'Allen, J. P., Pianta, R. C., Gregory, A., Mikami, A. Y., & Lun, J. (2011). An interaction-based approach to enhancing secondary school instruction and student achievement. Science, 333(6045), 1034–1037.',
  },
  {
    slug: 'blair-2015',
    year: 2015,
    areas: ['social-and-emotional-development'],
    citation:
      'Blair, C., & Raver, C. C. (2015). School readiness and self regulation: A developmental psychobiological approach. Annual Review of Psychology, 66, 711–731.',
  },
  {
    slug: 'blakemore-2012',
    year: 2012,
    areas: ['social-and-emotional-development'],
    citation:
      'Blakemore, S. J. (2012). Development of the social brain in adolescence. Journal of the Royal Society of Medicine, 105(3), 111-116.',
  },
  {
    slug: 'compas-2017',
    year: 2017,
    areas: ['social-and-emotional-development'],
    citation:
      'Compas, B. E., Jaser, S. S., Bettis, A. H., Watson, K. H., Gruhn, M. A., Dunbar, J. P., Williams, E., & Thigpen, J. C. (2017). Coping, emotion regulation, and psychopathology in childhood and adolescence: A meta-analysis and narrative review. Psychological Bulletin, 143(9), 939–991.',
  },
  {
    slug: 'durlak-2011',
    year: 2011,
    areas: ['social-and-emotional-development'],
    citation:
      'Durlak, J. A., Weissberg, R. P., Dymnicki, A. B., Taylor, R. D., & Schellinger, K. B. (2011). The impact of enhancing students’ social and emotional learning: A meta-analysis of school-based universal interventions. Child Development, 82(1), 405–432.',
  },
  {
    slug: 'imuta-2016',
    year: 2016,
    areas: ['social-and-emotional-development'],
    citation:
      'Imuta, K., Henry, J. D., Slaughter, V., Selcuk, B., & Ruffman, T. (2016). Theory of mind and prosocial behavior in childhood: A meta-analytic review. Developmental Psychology, 52(8), 1192–1205.',
  },
  {
    slug: 'jimenez-2016',
    year: 2016,
    areas: ['social-and-emotional-development'],
    citation:
      'Jimenez, M. E., Wade, R., Jr., Lin, Y., Morrow, L. M., & Reichman, N. E. (2016). Adverse experiences in early childhood and kindergarten outcomes. Pediatrics, 137(2), e20151839.',
  },
  {
    slug: 'kirschner-2009',
    year: 2009,
    areas: ['social-and-emotional-development'],
    citation:
      'Kirschner, F., Paas, F., & Kirschner, P. A. (2009). A cognitive-load approach to collaborative learning: United brains for complex tasks. Educational Psychology Review, 21(1), 31–42.',
  },
  {
    slug: 'plass-2019',
    year: 2019,
    areas: ['social-and-emotional-development'],
    citation:
      'Plass, J. L., & Kalyuga, S. (2019). Four ways of considering emotion in cognitive load theory. Educational Psychology Review, 31(2), 339–363.',
  },
  {
    slug: 'robson-2020',
    year: 2020,
    areas: ['social-and-emotional-development'],
    citation:
      'Robson, D. A., Allen, M. S., & Howard, S. J. (2020). Self-regulation in childhood as a predictor of future outcomes: A meta-analytic review. Psychological Bulletin, 146(4), 324–354.',
  },
  {
    slug: 'roorda-2011',
    year: 2011,
    areas: ['social-and-emotional-development'],
    citation:
      'Roorda, D. L., Koomen, H. M. Y., Spilt, J. L., & Oort, F. J. (2011). The influence of affective teacher–student relationships on students’ school engagement and achievement: A meta-analytic approach. Review of Educational Research, 81(4), 493–529.',
  },
  {
    slug: 'taylor-2017',
    year: 2017,
    areas: ['social-and-emotional-development'],
    citation:
      'Taylor, R. D., Oberle, E., Durlak, J. A., & Weissberg, R. P. (2017). Promoting positive youth development through school-based social and emotional learning interventions: A meta-analysis of follow-up effects. Child Development, 88(4), 1156–1171.',
  },
  {
    slug: 'vallotton-2011',
    year: 2011,
    areas: ['social-and-emotional-development'],
    citation:
      'Vallotton, C., & Ayoub, C. (2011). Use your words: The role of language in the development of toddlers’ self-regulation. Early Childhood Research Quarterly, 26(2), 169–181.',
  },
  {
    slug: 'van-de-pol-2010',
    year: 2010,
    areas: ['social-and-emotional-development'],
    citation:
      'van de Pol, J., Volman, M., & Beishuizen, J. (2010). Scaffolding in teacher–student interaction: A decade of research. Educational Psychology Review, 22(3), 271–296.',
  },
];

// Concepts the framework as a whole involves (from its introduction/policy sections).
const FRAMEWORK_CONCEPTS = ['needs-based-approach', 'send', 'experts-at-hand', 'adaptive-teaching'];

// External sources for references (and the framework itself). Terminal link
// nodes only: nothing beyond the original document is processed into the
// graph; these make the references explorable. DOIs were resolved via the
// Crossref API (query.bibliographic per citation, match reviewed against
// author/title/year); non-DOI items carry a verified publisher URL, or a
// Google Scholar search URL where no stable canonical page exists (books).
const EXTERNAL_SOURCES = {
  'inclusive-teaching-framework': {
    url: 'https://www.ambition.org.uk/inclusive-teaching-framework/',
    resolution: 'publisher',
    label: 'Inclusive Teaching Framework — Ambition Institute',
  },
  'cleave-2015': { doi: '10.1044/2015_ajslp-14-0105' },
  'dobinson-2021': { doi: '10.1177/0142723721989471' },
  'dockrell-2012': {
    url: 'https://assets.publishing.service.gov.uk/media/5a80840ae5274a2e87dba411/DFE-RR247-BCRP4.pdf',
    resolution: 'publisher',
    label: 'DfE research report DFE-RR247-BCRP4 (gov.uk)',
  },
  'holt-2020': { doi: '10.1017/s0142716420000302' },
  'law-2017': {
    url: 'https://educationendowmentfoundation.org.uk/education-evidence/evidence-reviews/early-language/',
    resolution: 'publisher',
    label: 'EEF evidence review: early language',
  },
  'nation-1999': { doi: '10.1006/jecp.1999.2498' },
  'nation-2022': { doi: '10.1177/09637214221103264' },
  'owen-van-horne-2024': { doi: '10.1044/2024_lshss-23-00177' },
  'sedgwick-2018': { doi: '10.1111/1467-9604.12225' },
  'sweller-2019': { doi: '10.1007/s10648-019-09465-5' },
  'zimmerman-2009': { doi: '10.1542/peds.2008-2267' },
  'barton-2015': { doi: '10.1016/j.ridd.2014.11.006' },
  'blank-2019': { doi: '10.1111/dmcn.14132' },
  'choi-2014': { doi: '10.1007/s10648-014-9262-6' },
  'connolly-2019': { doi: '10.1121/1.5087126' },
  'daly-smith-2018': { doi: '10.1136/bmjsem-2018-000341' },
  'eddy-2019': { doi: '10.1111/cch.12712' },
  'firestone-2016': { doi: '10.1017/s0140525x15000965' },
  'lerner-2015': { doi: '10.1146/annurev-psych-010213-115043' },
  'unwin-2024': { doi: '10.5014/ajot.2024.050766' },
  'cameron-2016': { doi: '10.1111/cdep.12168' },
  'davis-2011': { doi: '10.1111/j.2044-8295.2011.02018.x' },
  'ericsson-2016': {
    url: 'https://scholar.google.com/scholar?q=%22Peak%3A+Secrets+from+the+New+Science+of+Expertise%22+Ericsson+Pool',
    resolution: 'search',
    label: 'Google Scholar search: Peak (Ericsson & Pool, 2016)',
  },
  'gandotra-2022': { doi: '10.1080/15248372.2021.1979554' },
  'scott-2023': { doi: '10.1371/journal.pone.0284086' },
  'wulf-2010': { doi: '10.1111/j.1365-2923.2009.03421.x' },
  'best-2010': { doi: '10.1111/j.1467-8624.2010.01499.x' },
  'best-2011': { doi: '10.1016/j.lindif.2011.01.007' },
  'braem-2018': { doi: '10.1177/0963721418787475' },
  'center-on-the-developing-child-2011': {
    url: 'https://developingchild.harvard.edu/resources/working-paper/building-the-brains-air-traffic-control-system-how-early-experiences-shape-the-development-of-executive-function/',
    resolution: 'publisher',
    label: 'Center on the Developing Child working paper 11',
  },
  'diamond-2013': { doi: '10.1146/annurev-psych-113011-143750' },
  'furley-2025': { doi: '10.1080/1750984x.2023.2217437' },
  'gathercole-2004': { doi: '10.1037/0012-1649.40.2.177' },
  'melby-lervag-2016': { doi: '10.1177/1745691616635612' },
  'tricot-2014': { doi: '10.1007/s10648-013-9243-1' },
  'allen-2011': { doi: '10.1126/science.1207998' },
  'blair-2015': { doi: '10.1146/annurev-psych-010814-015221' },
  'blakemore-2012': { doi: '10.1258/jrsm.2011.110221' },
  'compas-2017': { doi: '10.1037/bul0000110' },
  'durlak-2011': { doi: '10.1111/j.1467-8624.2010.01564.x' },
  'imuta-2016': { doi: '10.1037/dev0000140' },
  'jimenez-2016': { doi: '10.1542/peds.2015-1839' },
  'kirschner-2009': { doi: '10.1007/s10648-008-9095-2' },
  'plass-2019': { doi: '10.1007/s10648-019-09473-5' },
  'robson-2020': { doi: '10.1037/bul0000227' },
  'roorda-2011': { doi: '10.3102/0034654311421793' },
  'taylor-2017': { doi: '10.1111/cdev.12864' },
  'vallotton-2011': { doi: '10.1016/j.ecresq.2010.09.002' },
  'van-de-pol-2010': { doi: '10.1007/s10648-010-9127-6' },
};

// ---------------------------------------------------------------------------
// Graph assembly
// ---------------------------------------------------------------------------

const EDGE_TYPES = [
  'containsArea',
  'containsIdea',
  'containsInsight',
  'citesReference',
  'involvesConcept',
  'overlapsWith',
  'inPartnershipWith',
  'authoredBy',
  'guidedBy',
  'reliesOn',
  'partOf',
  'precedes',
  'supports',
  'relatedTo',
  'availableAt',
];

const nodes = [];
const edges = [];
const edge = (source, type, target) => edges.push({ source, type, target });

nodes.push(FRAMEWORK);

for (const org of ORGANISATIONS) {
  nodes.push({
    kind: 'organisation',
    id: `organisation:${org.slug}`,
    name: org.name,
    role: org.role,
    description: org.description,
  });
}
edge(FRAMEWORK.id, 'authoredBy', 'organisation:ambition-institute');
for (const org of ORGANISATIONS.filter((o) => o.role === 'partner')) {
  edge(FRAMEWORK.id, 'inPartnershipWith', `organisation:${org.slug}`);
}

for (const p of PRINCIPLES) {
  nodes.push({
    kind: 'principle',
    id: `principle:${p.slug}`,
    title: p.title,
    description: p.description,
    order: p.order,
  });
  edge(FRAMEWORK.id, 'guidedBy', `principle:${p.slug}`);
}

for (const a of AREAS) {
  nodes.push({
    kind: 'area',
    id: `area:${a.slug}`,
    areaSlug: a.slug,
    title: a.title,
    summary: a.summary,
    order: a.order,
  });
  edge(FRAMEWORK.id, 'containsArea', `area:${a.slug}`);
  edge(`area:${a.slug}`, 'inPartnershipWith', `organisation:${a.partner}`);
}

for (const [a, b] of AREA_OVERLAPS) edge(`area:${a}`, 'overlapsWith', `area:${b}`);

for (const c of CONCEPTS) {
  nodes.push({
    kind: 'concept',
    id: `concept:${c.slug}`,
    term: c.term,
    description: c.description,
    category: c.category,
  });
}

for (const i of IDEAS) {
  const id = `idea:${i.slug}`;
  nodes.push({ kind: 'idea', id, title: i.title, description: i.description, areaSlug: i.area });
  edge(`area:${i.area}`, 'containsIdea', id);
  for (const c of i.concepts) edge(id, 'involvesConcept', `concept:${c}`);
}

for (const k of INSIGHTS) {
  const id = `insight:${k.area}-${k.order}`;
  nodes.push({
    kind: 'insight',
    id,
    title: k.title,
    explanation: k.explanation,
    areaSlug: k.area,
    order: k.order,
  });
  edge(`area:${k.area}`, 'containsInsight', id);
  for (const c of k.concepts) edge(id, 'involvesConcept', `concept:${c}`);
}

for (const r of REFERENCES) {
  nodes.push({ kind: 'reference', id: `reference:${r.slug}`, citation: r.citation, year: r.year });
  for (const a of r.areas) edge(`area:${a}`, 'citesReference', `reference:${r.slug}`);
}

for (const [s, t, o] of CONCEPT_EDGES) edge(`concept:${s}`, t, `concept:${o}`);
for (const c of FRAMEWORK_CONCEPTS) edge(FRAMEWORK.id, 'involvesConcept', `concept:${c}`);

for (const [slug, src] of Object.entries(EXTERNAL_SOURCES)) {
  const node = { kind: 'externalSource', id: `externalSource:${slug}` };
  if (src.doi) {
    node.url = `https://doi.org/${src.doi}`;
    node.doi = src.doi;
    node.resolution = 'doi';
    node.label = `doi.org resolver: ${src.doi}`;
  } else {
    node.url = src.url;
    node.resolution = src.resolution;
    node.label = src.label;
  }
  nodes.push(node);
  const owner = slug === 'inclusive-teaching-framework' ? FRAMEWORK.id : `reference:${slug}`;
  edge(owner, 'availableAt', node.id);
}

// ---------------------------------------------------------------------------
// Validation: recompute, don't just record
// ---------------------------------------------------------------------------

const errors = [];
const ids = new Set();
for (const n of nodes) {
  if (ids.has(n.id)) errors.push(`duplicate node id: ${n.id}`);
  ids.add(n.id);
  if (!n.id.startsWith(`${n.kind}:`))
    errors.push(`id not kind-qualified: ${n.id} (kind ${n.kind})`);
}
const seenEdges = new Set();
for (const e of edges) {
  if (!ids.has(e.source))
    errors.push(`edge source unresolved: ${e.source} -${e.type}-> ${e.target}`);
  if (!ids.has(e.target))
    errors.push(`edge target unresolved: ${e.source} -${e.type}-> ${e.target}`);
  if (!EDGE_TYPES.includes(e.type)) errors.push(`unknown edge type: ${e.type}`);
  if (e.source === e.target) errors.push(`self-loop: ${e.source} -${e.type}-> ${e.target}`);
  const key = `${e.source}|${e.type}|${e.target}`;
  if (seenEdges.has(key)) errors.push(`duplicate edge: ${key}`);
  seenEdges.add(key);
}
if (errors.length > 0) {
  console.error(`Graph validation failed with ${errors.length} error(s):`);
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

const count = (items, keyFn) => {
  const acc = {};
  for (const item of items) acc[keyFn(item)] = (acc[keyFn(item)] ?? 0) + 1;
  return Object.fromEntries(Object.entries(acc).sort(([a], [b]) => a.localeCompare(b)));
};

const stats = {
  totalNodes: nodes.length,
  totalEdges: edges.length,
  nodeKindCounts: count(nodes, (n) => n.kind),
  edgeTypeCounts: count(edges, (e) => e.type),
};

const corpus = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  source: {
    title: 'Inclusive Teaching Framework',
    authors: 'Gilbride, N., & Jackson, J.',
    publisher: 'Ambition Institute',
    published: '2026-03',
    file: 'InclusiveTeachingFramework_2026_final_release_2.pdf',
    url: 'https://www.ambition.org.uk/inclusive-teaching-framework/',
    attribution:
      'Gilbride, N., & Jackson, J. (2026). Inclusive Teaching Framework. Ambition Institute, in partnership with the National Association of Principal Educational Psychologists, the Royal College of Occupational Therapists, Speech and Language UK, and The Difference. © Ambition Institute 2026, registered charity 1146924.',
    licenceNote:
      'Derived data reused on an academic basis for research and learning, with full acknowledgement of the authors and Ambition Institute. The source document is freely distributed but not openly licensed; this dataset is excluded from the host repository’s data-licence grant.',
  },
  stats,
  nodes,
  edges,
  seeAlso:
    'Format mirrors the Oak Open Curriculum Ecosystem graph corpus design: kind-qualified node ids, a discriminated union of node kinds, and a typed directed-edge vocabulary in an envelope with recomputed stats.',
};

// ---------------------------------------------------------------------------
// JSON Schema (2020-12). Root validates data.json; #/$defs/jsonlRecord
// validates one data.jsonl line.
// ---------------------------------------------------------------------------

const nodeDef = (kind, props, required) => ({
  type: 'object',
  additionalProperties: false,
  required: ['kind', 'id', ...required],
  properties: {
    kind: { const: kind },
    id: { type: 'string', pattern: `^${kind}:[a-z0-9-]+$` },
    ...props,
  },
});

const schema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://example.org/itf-graph/schema.json',
  title: 'Inclusive Teaching Framework knowledge graph',
  description:
    'Root validates the corpus envelope (data.json). Validate each data.jsonl line against #/$defs/jsonlRecord.',
  type: 'object',
  additionalProperties: false,
  required: ['version', 'generatedAt', 'source', 'stats', 'nodes', 'edges', 'seeAlso'],
  properties: {
    version: { type: 'string' },
    generatedAt: { type: 'string', format: 'date-time' },
    source: { $ref: '#/$defs/source' },
    stats: { $ref: '#/$defs/stats' },
    nodes: { type: 'array', items: { $ref: '#/$defs/node' } },
    edges: { type: 'array', items: { $ref: '#/$defs/edge' } },
    seeAlso: { type: 'string' },
  },
  $defs: {
    source: {
      type: 'object',
      additionalProperties: false,
      required: [
        'title',
        'authors',
        'publisher',
        'published',
        'file',
        'url',
        'attribution',
        'licenceNote',
      ],
      properties: {
        title: { type: 'string' },
        authors: { type: 'string' },
        publisher: { type: 'string' },
        published: { type: 'string' },
        file: { type: 'string' },
        url: { type: 'string', format: 'uri' },
        attribution: { type: 'string' },
        licenceNote: { type: 'string' },
      },
    },
    stats: {
      type: 'object',
      additionalProperties: false,
      required: ['totalNodes', 'totalEdges', 'nodeKindCounts', 'edgeTypeCounts'],
      properties: {
        totalNodes: { type: 'integer', minimum: 0 },
        totalEdges: { type: 'integer', minimum: 0 },
        nodeKindCounts: { type: 'object', additionalProperties: { type: 'integer', minimum: 0 } },
        edgeTypeCounts: { type: 'object', additionalProperties: { type: 'integer', minimum: 0 } },
      },
    },
    nodeId: {
      type: 'string',
      pattern:
        '^(framework|area|idea|insight|concept|reference|organisation|principle|externalSource):[a-z0-9-]+$',
    },
    edgeType: { enum: EDGE_TYPES },
    node: {
      oneOf: [
        nodeDef(
          'framework',
          {
            title: { type: 'string' },
            publisher: { type: 'string' },
            published: { type: 'string' },
            audience: { type: 'string' },
            purpose: { type: 'string' },
          },
          ['title', 'publisher', 'published', 'audience', 'purpose'],
        ),
        nodeDef(
          'area',
          {
            areaSlug: { type: 'string' },
            title: { type: 'string' },
            summary: { type: 'string' },
            order: { type: 'integer', minimum: 1 },
          },
          ['areaSlug', 'title', 'summary', 'order'],
        ),
        nodeDef(
          'idea',
          {
            title: { type: 'string' },
            description: { type: 'string' },
            areaSlug: { type: 'string' },
          },
          ['title', 'description', 'areaSlug'],
        ),
        nodeDef(
          'insight',
          {
            title: { type: 'string' },
            explanation: { type: 'string' },
            areaSlug: { type: 'string' },
            order: { type: 'integer', minimum: 1 },
          },
          ['title', 'explanation', 'areaSlug', 'order'],
        ),
        nodeDef(
          'concept',
          {
            term: { type: 'string' },
            description: { type: 'string' },
            category: { enum: ['construct', 'practice', 'approach', 'policy', 'diagnosis'] },
          },
          ['term', 'description', 'category'],
        ),
        nodeDef(
          'reference',
          {
            citation: { type: 'string' },
            year: { type: 'integer', minimum: 1900, maximum: 2100 },
          },
          ['citation', 'year'],
        ),
        nodeDef(
          'organisation',
          {
            name: { type: 'string' },
            role: { enum: ['author-publisher', 'partner'] },
            description: { type: 'string' },
          },
          ['name', 'role', 'description'],
        ),
        nodeDef(
          'principle',
          {
            title: { type: 'string' },
            description: { type: 'string' },
            order: { type: 'integer', minimum: 1 },
          },
          ['title', 'description', 'order'],
        ),
        nodeDef(
          'externalSource',
          {
            url: { type: 'string', format: 'uri' },
            label: { type: 'string' },
            resolution: { enum: ['doi', 'publisher', 'search'] },
            doi: { type: 'string' },
          },
          ['url', 'label', 'resolution'],
        ),
      ],
    },
    edge: {
      type: 'object',
      additionalProperties: false,
      required: ['source', 'type', 'target'],
      properties: {
        source: { $ref: '#/$defs/nodeId' },
        type: { $ref: '#/$defs/edgeType' },
        target: { $ref: '#/$defs/nodeId' },
      },
    },
    jsonlRecord: {
      oneOf: [
        {
          type: 'object',
          additionalProperties: false,
          required: ['record', 'meta'],
          properties: {
            record: { const: 'meta' },
            meta: {
              type: 'object',
              additionalProperties: false,
              required: ['version', 'generatedAt', 'source', 'stats'],
              properties: {
                version: { type: 'string' },
                generatedAt: { type: 'string', format: 'date-time' },
                source: { $ref: '#/$defs/source' },
                stats: { $ref: '#/$defs/stats' },
              },
            },
          },
        },
        {
          type: 'object',
          additionalProperties: false,
          required: ['record', 'node'],
          properties: { record: { const: 'node' }, node: { $ref: '#/$defs/node' } },
        },
        {
          type: 'object',
          additionalProperties: false,
          required: ['record', 'edge'],
          properties: { record: { const: 'edge' }, edge: { $ref: '#/$defs/edge' } },
        },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------

mkdirSync(OUT_DIR, { recursive: true });

writeFileSync(join(OUT_DIR, 'data.json'), `${JSON.stringify(corpus, null, 2)}\n`);

const jsonlLines = [
  JSON.stringify({
    record: 'meta',
    meta: {
      version: corpus.version,
      generatedAt: corpus.generatedAt,
      source: corpus.source,
      stats,
    },
  }),
  ...nodes.map((n) => JSON.stringify({ record: 'node', node: n })),
  ...edges.map((e) => JSON.stringify({ record: 'edge', edge: e })),
];
writeFileSync(join(OUT_DIR, 'data.jsonl'), `${jsonlLines.join('\n')}\n`);

writeFileSync(join(OUT_DIR, 'schema.json'), `${JSON.stringify(schema, null, 2)}\n`);

console.log(`Wrote ${OUT_DIR}/{data.json,data.jsonl,schema.json}`);
console.log(`nodes: ${stats.totalNodes} ${JSON.stringify(stats.nodeKindCounts)}`);
console.log(`edges: ${stats.totalEdges} ${JSON.stringify(stats.edgeTypeCounts)}`);
