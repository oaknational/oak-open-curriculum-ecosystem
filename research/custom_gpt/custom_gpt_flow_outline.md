Oak Validated Custom GPT Implementation Plan

Executive Summary

Oak National Academy’s Validated Lesson GPT is a custom ChatGPT that integrates Oak’s curriculum API and a custom validation service into a single, easy-to-use assistant. Teachers can simply use this GPT – no extra setup or connector toggles required – and trust that every lesson plan or worksheet it produces has been checked against Oak’s quality criteria. We achieve this by packaging Oak’s API as GPT Actions and enforcing a structured “Validation Card” output on each response. The GPT uses Actions (OpenAPI-defined functions) to search curriculum content (lessons, transcripts, quizzes, etc.) and to validate its drafts before finalizing answers. It calls an /oak/validate Action on its generated lesson markdown, and only if the content passes (with a sufficient score) will the GPT present the lesson along with a JSON validation card. If it fails, the GPT will apply the required changes and re-validate in a loop (up to 2 retries) until the lesson meets all criteria. This validation card – containing a pass/fail flag, score, rubric version, validator version, and signature – is included in the GPT’s final structured output, ensuring transparency and trust.

Using Actions is the preferred packaging strategy because it bundles external capabilities directly into the GPT. Unlike connectors (which require users to manually enable “Use connectors” and authenticate or toggle deep research mode ￼), Actions allow the Oak GPT to call the curriculum APIs behind the scenes with no user friction. We embed Oak’s OpenAPI 3.1 spec (covering all curriculum data endpoints) in the GPT Builder’s Configure panel under “Add Action,” and OpenAI will host this spec for us ￼ ￼. We also define a custom response schema (via the Builder’s “Structured Output” settings) so that the assistant’s final message must include a JSON object (the Validation Card) alongside the lesson content. With strict schema enforcement (strict: true), GPT-4 will reliably adhere to our specified JSON format ￼ – meaning the assistant cannot “forget” to include the validation info. While this guarantees structural conformance, it’s not a cryptographic guarantee of correctness (the model could theoretically still fabricate data within the schema). To address that, our validation service returns a digital signature for each pass/fail result. The model cannot forge a valid signature, so the presence of a verifiable signature in the output gives us cryptographic trust that the lesson was actually checked by the external validator.

In summary, the plan is to implement a single-install Custom GPT that uses Actions to fetch Oak’s openly licensed curriculum data, and a validation Action to enforce quality control. We will configure the GPT with system instructions to always ground its answers in Oak content (citing sources) and to self-validate any generated lesson. The GPT will only output a lesson if the validator approves it, and it will attach a structured Validation Card (JSON) to each answer. This approach leverages official OpenAI features – Custom GPT Actions and Structured Outputs – ensuring the solution is maintainable and compliant with OpenAI’s guidelines. Below, we provide a step-by-step implementation guide, including the OpenAPI spec for all Actions, the custom instructions and schema, example usage flows, and security/privacy considerations. This design has been tailored for Oak’s UK context, noting that connectors (MCP) are not available to UK Plus users ￼, whereas our Actions-based GPT works for any teacher with access to ChatGPT Plus/Edu (in both normal chat and Deep Research modes).

⸻

1. Packaging Strategy – One GPT, Zero User Setup

Use GPT Actions to bundle all capabilities: The Oak GPT will utilize Custom Actions to integrate both data retrieval and validation tools. GPT Actions (a feature of Custom GPTs) let us expose third-party APIs to the model by providing an OpenAPI specification ￼. We will include Oak’s curriculum API endpoints and our validation endpoints in a single OpenAPI 3.1 spec. In the GPT Builder’s Configure tab, under “Add Action,” we can paste the OpenAPI JSON or a URL to it ￼. The Builder will import the spec, list out the available operations (functions), and allow us to configure authentication for them. OpenAI will host the OpenAPI spec for this custom GPT, so we don’t need to host a plugin manifest ourselves ￼. By using Actions, every teacher can simply select our Oak GPT and start chatting – they won’t need to toggle connectors or copy API keys. The GPT itself will call Oak’s APIs as needed in the background.

Structured Outputs enforce the Validation Card: We will leverage OpenAI’s Structured Output feature to force the assistant’s final message to include a JSON “validation card” object. In the GPT Builder, there is a field to specify a response schema for structured outputs (under advanced settings or in the instructions panel, depending on the UI – currently labeled “Structured Output” or “Response Format”). We will input a JSON Schema that defines an object with two top-level fields: validation_card and lesson_markdown. By setting "strict": true in this schema definition, we ensure the model’s last message exactly matches the schema ￼. In practice, this means the assistant cannot produce a final answer unless it’s in the required JSON format (the model knows it must output an object with those fields). This mechanism is powerful for guaranteeing format fidelity – OpenAI reports near 100% reliability with GPT-4 when strict schemas are used ￼. However, it’s important to note the limits of this approach: the schema enforcement guarantees the structure of the output (e.g., that a pass field is present and boolean, etc.), but it does not by itself ensure the content is factually correct or truly validated. The model could, in theory, populate the JSON with incorrect values. That’s why we incorporate an actual validation service that returns a signed result. The combination of structured output + signature provides both format compliance and a layer of cryptographic trust (the model cannot produce a valid signature on its own). In short, the structured response schema “nudges” the model to always include the validation info, and the signature within that info proves the validator was invoked.

Why Actions over Connectors (MCP): OpenAI’s new Connectors (Model Context Protocol) feature allows connecting ChatGPT to external data sources, but it would require each user to configure or enable the connector in their settings ￼. For example, with a custom MCP connector, a teacher would have to go to Settings → Connectors, find the Oak connector, and connect it (even if no auth is needed, they must explicitly enable it) ￼. This is extra friction we want to avoid. Moreover, as of now custom connectors are not available for Plus users in the UK ￼ ￼ (they are limited to Business/Edu or certain regions). Oak’s target audience includes individual teachers on ChatGPT Plus, so relying on a connector isn’t feasible. Actions, on the other hand, are part of the GPT itself – once we publish the Oak GPT, any user can use it without additional setup. Another nuance is that connectors run in either chat or deep research modes that the user must toggle ￼, whereas our GPT’s Actions can be invoked automatically as needed in any mode. By choosing Actions, we ensure a “single install” experience: a teacher just adds the Oak GPT to their ChatGPT (or clicks a share link) and everything (data access and validation) works out-of-the-box. Connectors are great for personal or enterprise data, but for a publicly shareable GPT that uses open data, Actions are the appropriate choice. (Additionally, GPT Actions give us fine-grained control: we can define custom function names, group related endpoints, and include detailed descriptions to guide the model’s usage of each tool.)

Builder UI configuration: To implement this, we will go to chat.openai.com/gpts/editor (or the GPTs section of ChatGPT) and create a new GPT. In the Configure tab, we’ll click “Add Action.” Here we can directly paste our compiled OpenAPI JSON spec (see Appendix for the full spec) or provide a URL. After adding, the Builder will list out each action (function) parsed from the spec, and allow us to test them. We should also configure any required auth at this stage (see Section 6 on security). Once our actions are in place, we’ll add the system instructions and response schema. The system instructions (also in the Configure tab) will outline how the GPT should use the tools and enforce validation (we’ll provide a draft in Section 4). The response schema is provided as a JSON Schema – the Builder interface will likely show a text area labeled “Response Schema (JSON)” where we input our desired schema. We will paste a schema requiring the validation_card and lesson_markdown fields, and toggle “Strict” on (if not automatically strict). With these steps done, the GPT is essentially packaged: it knows which Actions (endpoints) it can call, how to call them, and that it must always include the validation card in the answer. We can then publish this GPT (optionally shareable via link or in the GPT library for our workspace). Users of the GPT won’t need to do anything special – they’ll just interact via chat as normal, and under the hood the GPT will call the Oak API and validator Actions.

2. Tools to Expose – Oak Curriculum OpenAPI Endpoints

We will expose all relevant Oak Curriculum API endpoints as GPT Actions by defining them in our OpenAPI spec. Oak’s API is RESTful and read-only (all endpoints are GET operations for retrieving content ￼). Below is a list of the endpoints we plan to include, with their purpose and a proposed human-friendly operation name (these names will become the function names the GPT sees):
• GET /subjects – Lists all available subjects, each with its sequences, key stages, and years. (OperationId: getSubjects)
• GET /subjects/{subjectSlug} – Details for a specific subject (title, available sequences, key stages, years). (getSubjectDetail)
• GET /subjects/{subjectSlug}/sequences – Lists the curriculum sequences for that subject (different tracks for primary, secondary, exam boards, etc.). (getSubjectsSequences)
• GET /subjects/{subjectSlug}/key-stages – Lists the key stages in which that subject has content. (getSubjectsKeyStages) ￼ ￼
• GET /subjects/{subjectSlug}/years – Lists the year groups for which the subject has content. (getSubjectsYears) ￼ ￼
• GET /key-stages – Lists all key stages (e.g., KS1–KS4) by slug and title. (getKeyStages) ￼ ￼
• GET /key-stages/{ksSlug}/subject/{subjectSlug}/lessons – Lists all lessons for a given subject in a given key stage, grouped by unit (with optional filtering by unit, pagination). (getKeyStagesSubjectLessons) ￼ ￼
• GET /key-stages/{ksSlug}/subject/{subjectSlug}/units – Lists all units (grouped by year) for a subject & key stage (only units that have published lessons). (getKeyStagesSubjectUnits) ￼
• (Note: The Oak docs also mention “assets by key stage and subject” as an available list ￼, but there isn’t a specific endpoint for that in the API. Typically, assets are fetched at the lesson or sequence level, so we will omit a direct “assets by subject” action and rely on lesson/sequence asset endpoints.)
• GET /threads – Lists all “threads” in the curriculum. In Oak’s ontology, threads represent common themes or knowledge strands that span units (for instance, a thread might be a concept that appears in multiple units). (getThreads)
• GET /threads/{threadSlug}/units – Retrieves all units associated with a given thread (i.e., where this thread is taught). (getThreadsUnits) – This helps illustrate how knowledge builds across the curriculum.
• GET /sequences/{sequenceSlug}/units – Returns all units in a given sequence, grouped by year, in the intended teaching order ￼ ￼. Oak defines a “sequence” essentially as a subject-phase combination (e.g., “maths-primary” or “english-secondary”) possibly with variants for KS4. This endpoint is very useful for understanding curriculum structure; it also includes thread identifiers for each unit ￼ ￼. (getSequencesUnits) ￼
• GET /sequences/{sequenceSlug}/assets – Returns all lesson assets for a given sequence, grouped by lesson. This provides download links for every resource in every lesson of the sequence ￼. It’s essentially a bulk assets list, useful if assembling a whole unit or scheme of work. (getSequencesAssets)
• GET /sequences/{sequenceSlug}/questions – Returns all quiz questions (both starter and exit quizzes) for all lessons in the sequence, grouped by lesson ￼. This allows the model to fetch an entire set of quiz Q&A for a sequence if needed (for example, to generate a recap quiz). (getSequencesQuestions)
• GET /lessons/{lessonSlug}/transcript – Returns the teaching video transcript for a lesson, plus the .vtt caption data ￼ ￼. This is essentially the teacher’s script for that lesson video, which is valuable for the GPT to pull direct explanations or quotes. (getLessonsTranscript)
• GET /lessons/{lessonSlug}/assets – Returns the available downloadable assets for a lesson, including slide decks, worksheets, etc., with their labels and the endpoints to download them ￼ ￼. We’ll use this mainly to know what resources exist. (Note: the actual file content is not returned here, just the URLs and attribution info.) (getLessonsAssets) ￼
• GET /lessons/{lessonSlug}/assets/{type} – Downloads the actual asset file of the specified type for that lesson (e.g., PDF of the worksheet). This returns a file (binary content) rather than JSON, so the model won’t directly use this content unless it’s text (and currently GPT cannot read binary PDFs). We include it for completeness, but the GPT will likely rely on summaries rather than raw file content. (getLessonsAssetsByType)
• GET /lessons/{lessonSlug}/quiz – Retrieves the quiz questions and answers for a single lesson (both starter and exit quiz) ￼ ￼. Each question comes with answer choices and which are correct ￼ ￼. (getLessonsQuiz)
• GET /lessons/{lessonSlug}/summary – Retrieves the lesson summary data, which includes key teaching points, common misconceptions (and suggested responses), lesson keywords (glossary), lesson objectives (pupil outcomes), teacher tips, and a flag for downloadable content ￼ ￼. This endpoint is extremely useful for validation and content generation: it encapsulates what the lesson is about and potential pitfalls. (getLessonsSummary) ￼
• GET /key-stages/{ksSlug}/subject/{subjectSlug}/questions – Retrieves all quiz questions for a given subject at a given key stage ￼. In practice, this likely aggregates all questions from all lessons of that subject+KS. It’s similar to sequence questions, but we include it in case the model wants to fetch quiz items without specifying the exact sequence (e.g., “Get all questions for KS3 History”). (getKeyStagesSubjectQuestions)
• GET /search/transcripts?q=<query> – Searches across lesson transcripts for a given query text, returning the top 5 lessons with matching transcript snippets ￼ ￼. This is a semantic search; it helps the GPT find relevant lessons by content (not just title). (getSearchTranscripts)
• GET /search/lessons?q=<query>&keyStage=<ks>&subject=<subject>&unit=<unit> – Searches lesson titles (and metadata) for the query, optionally filtering by key stage, subject, or unit, returning up to 20 similar lessons ￼ ￼. This is useful if the user asks for a lesson on a specific topic – the GPT can find the closest matching lesson(s). (getSearchLessons)
• GET /changelog – (Custom endpoint) Returns a list of recent content updates or changes in the Oak curriculum. We will define a simple schema for this, e.g., an array of change entries (each with an ID, date, description, and perhaps affected subjects). (getChangelog)
• GET /changelog/latest – Returns just the latest change entry (convenience endpoint to quickly check if new content is available). (getChangelogLatest)
• GET /rate-limit – (Custom endpoint) Returns the current API usage status for the GPT’s API key: for example, the hourly request limit and how many requests remain or when the limit resets. (getRateLimit) This is to help the model avoid hitting rate limits. Oak’s API has a default limit of 1000 requests per hour ￼. We can have the model call getRateLimit if it plans a large number of calls, or after a 429 error, to decide whether to back off. The response might include fields like limit, remaining, and resetTime.

We will define operationId values for each of these, following a consistent naming convention (getSubjects, getLessonsTranscript, etc., as noted above). These names are human-readable and stable, which helps the model choose the right action. In the OpenAPI file (see Appendix), each endpoint will have a description explaining when to use it. For example, the description for getLessonsSummary will note that it provides misconceptions, key points, etc., useful for checking a lesson plan’s accuracy. These descriptions act as guidance for the model’s action selection.

Each endpoint’s request and response schema will be defined in the OpenAPI spec. We’ll keep them minimal but representative. For instance:
• getLessonsSummary response schema will include fields like lessonTitle, misconceptionsAndCommonMistakes (array of misconception/response pairs), keyLearningPoints, etc., as per Oak’s documentation ￼ ￼.
• getLessonsTranscript response will have transcript (string) and vtt (string) ￼.
• Search endpoints will have query parameters (q, and optional filters) and return arrays of objects with lesson titles and snippets or similarity scores ￼ ￼.
We’ll also indicate if any endpoints support pagination (for example, the lessons search has offset and limit params ￼ ￼, and getKeyStagesSubjectLessons has optional pagination ￼). In our Action definitions, we’ll document these parameters so the model knows it can refine queries if needed.

Example usage in practice: If a user asks, “Create a lesson plan on Roman Britain for Year 7 history,” the GPT might use getSearchLessons or getSearchTranscripts to find relevant lessons (e.g., it might search transcripts for “Roman” and find a lesson titled “The Roman invasion of Britain”). The Oak GPT would call the search Action, get a result with a lessonSlug like the-roman-invasion-of-britain ￼, then possibly call getLessonsSummary on that slug to get key points and misconceptions to include in the plan. It could also fetch getLessonsAssets to list available resources (slides, worksheet) and incorporate those. All these Actions are available to it without the user explicitly requesting – we instruct the GPT to use them as needed to ground its answers (Section 4 details these instructions). The integration of these endpoints ensures the GPT’s output is directly drawn from Oak’s authoritative content, rather than from the model’s memory alone. We will cite a few examples from Oak’s docs confirming these endpoints and their use cases:

Oak API Example: “Use the endpoint ‘GET /lessons/{lesson}/summary’ to retrieve common misconceptions and suggested responses…” ￼ This informs how the GPT can train itself to address misconceptions. Another example: “Use the endpoint ‘GET /sequences/{sequence}/units’ to retrieve threads in sequence order… demonstrating how knowledge builds across the curriculum.” ￼ This shows the GPT how to get curriculum structure data. Similarly, Oak suggests using “GET /key-stages/{keyStage}/subject/{subject}/questions” to get quiz Q&A for a subject ￼, and “GET /lessons/{lesson}/assets” to pull all resources for a lesson ￼. We have included all these capabilities in our Actions.

All Actions will be defined under a common server base URL, e.g., <https://customgpt.oaknational.dev>. In our OpenAPI, we’ll set servers: [{ url: "https://customgpt.oaknational.dev" }] so the GPT knows where to call. We’ll use Bearer token auth for these endpoints (more on auth in Section 6), although Oak’s content is open – the API key is mainly for rate-limiting and tracking usage ￼. We’ll likely have the GPT use a static API key (belonging to Oak) for all calls, configured in the Builder.

Deliverable – OpenAPI spec: We will produce a compact OpenAPI 3.1 specification covering all the endpoints above. “Compact” means we might not enumerate every response field in exhaustive detail, but we’ll include the important ones (so the model knows what to expect). We’ll use $refs and component schemas where appropriate to keep it tidy. Each operation will have an operationId (function name) and a description guiding usage. We’ll mark all endpoints except validation as x-openai-isConsquential: false (since they’re read-only GETs – the user can allow them automatically). The final OpenAPI JSON is provided in the Appendix, ready to be pasted into the GPT Builder. We have also included inline some sample responses from Oak’s docs (e.g., a snippet of a lesson summary JSON) to ensure the model has a clear picture of the data. With this spec in place, the Oak GPT will have a rich toolkit to retrieve any needed curriculum info on the fly.

3. Adding Validation Endpoints (Quality Assurance Actions)

To enforce high-quality, curriculum-aligned output, we introduce a custom validation service as part of our GPT’s toolset. This service acts as an AI-powered reviewer that scores and checks the lesson content against a rubric. We will expose it via Actions as well, under the base URL <https://customgpt.oaknational.dev> (same domain, different path).

The primary endpoint is: POST /oak/validate (operationId: validateLesson). Before the GPT finalizes any lesson or sequence, it should call this endpoint with the draft content to ensure it meets Oak’s standards.

Request schema for /oak/validate: We’ll define a JSON object with the following fields:
• lesson_markdown (string): The full lesson content in Markdown that the GPT has composed. This will include any lesson plan elements like objectives, activities, etc. We send it in Markdown to preserve formatting (the validator might check for things like correct use of headings or lists, as well as content).
• subject (string): The subject of the lesson (e.g., “History” or a slug like “history”). This provides context for domain-specific checks.
• phase (string): The educational phase or key stage (e.g., “KS3” or “Primary”). The validator may have different expectations for different phases.
• location (string): Context of where this content will be used. For example, “lesson plan”, “unit overview”, or “worksheet”. This could adjust the rubric. (If not easily determined, we can default it or instruct the GPT to provide e.g. “lesson”).
• rubric_version (string, optional): If we have multiple versions of validation criteria, the GPT can specify which rubric to use. If omitted, the latest is assumed.
• sources (array of objects): An array of sources the GPT used in drafting the lesson. Each source object might have { id, title, url }. For example, if the GPT pulled material from two Oak lessons, it could include their IDs or titles here. The validator can use this to check if content is properly attributed or if any crucial source was misinterpreted. (This also encourages the GPT to keep track of sources – which aligns with the provenance requirement.)

We will mark this endpoint as consequential (x-openai-isConseqential: true) because it should require user approval if it were to, say, send potentially sensitive content off for validation. However, since this is an Oak-internal validator, we might not need user confirmation every time – but marking as consequential means the user can’t set it to “always allow” without confirmation. This is a safety step given it’s sending potentially large content to an external service. (In our testing environment, we as developers can “Always Allow” it, but it’s good practice to denote it as critical.)

Response schema for /oak/validate: The validator will return a JSON object with the quality assessment:
• pass (boolean): Whether the lesson meets the required quality threshold. true means it passed; false means it needs changes.
• overall_score (number): An aggregate score or percentage indicating how well the content met the rubric. For instance, 85.0 meaning 85%. We can decide on scale (0-100 or 0-1).
• issues (array of strings, present if pass=false): A list of specific issues found. Each might be a short description, e.g., “Learning objective is unclear” or “Misconception not addressed”.
• required_changes (array of strings, present if pass=false): Specific required changes the GPT should make to fix the issues. For example: “Clarify the learning objective to mention the Roman invasion timeline” or “Include at least one common misconception about the topic and how to address it.” These are essentially actionable instructions for the model.
• validator_version (string): The version of the validation service or model used. (e.g., “v2.1”). Good for tracking and debugging.
• rubric_version (string): Echoing or confirming the rubric version that was applied (useful if multiple rubrics or if updated over time).
• signature (string): A cryptographic signature of the results, to ensure authenticity. Likely this will be a JWT or HMAC. For example, it could be a JWT signed with Oak’s private key containing the fields above, or a simpler HMAC of the lesson_markdown and result using a secret key. The purpose is that a user (or Oak’s system) could later verify that signature to confirm the result was truly generated by the validator and not tampered with by the model. We might include a signature_algorithm field or a verification_url if needed (e.g., an endpoint like GET /oak/verify?signature=... that returns true/false). In our OpenAPI, we can keep it simple with just a signature: string and document the verification process out-of-band.

We will implement /oak/validate such that it returns HTTP 200 OK with the JSON result regardless of pass or fail (with pass: false indicating failure). This way, the GPT gets a structured response it can parse. An alternative design could be to return a non-200 status for failures (e.g., 409 Conflict or 422 Unprocessable Entity when pass=false). This might signal to the model that the attempt was not successful, potentially prompting a different error-handling behavior. However, with function calling, it’s generally better to return a 200 and let the content of the response guide the model (since the OpenAI function calling will treat non-200s as errors unless specified). We will document both approaches: Tradeoff: If we returned 422, the model might log it as an “error” call and possibly re-try automatically, but it might not gracefully parse the helpful messages. Using 200 with a clear pass=false and required_changes list is straightforward for the model to handle in-code. We’ll opt for 200 and let the assistant logic manage the loop, as it gives us more control in instructions.

Optionally, we can provide another Action: POST /oak/apply-fixes (operationId: applyRequiredChanges). This endpoint would take the original lesson_markdown and the required_changes list, and return a revised lesson_markdown with the changes applied. Essentially, the server would try to auto-correct the content. The input might be { lesson_markdown, required_changes[] }, and output { new_markdown }. This could be handy if we wanted the validator to also handle the edit (ensuring correctness). However, implementing auto-repair on the server might overlap with what the GPT itself can do well. Since the model is quite capable of following instructions to fix its output, we might not need this endpoint. We’ll include the definition for completeness (in case we want to experiment), but we might initially instruct the GPT to do self-correction (it already has the text and the list of changes – it can just apply them and re-validate).

OpenAPI integration: We will add these to our spec under a tag “Oak Validation” or similar. The POST /oak/validate and POST /oak/apply-fixes will each have a requestBody schema and response schema defined. For example, the OpenAPI snippet for /oak/validate might look like:

paths:
/oak/validate:
post:
operationId: validateLesson
description: Validates a lesson markdown against Oak’s quality rubric. Must be called before finalizing any lesson.
security: - oakApiKey: [] # assuming we protect it similarly with a key
requestBody:
content:
application/json:
schema:
$ref: "#/components/schemas/ValidateRequest"
responses:
"200":
description: Validation result
content:
application/json:
schema:
$ref: "#/components/schemas/ValidateResult"
"422":
description: Validation failed – content did not meet criteria (optional alternate approach)
content:
application/json:
schema:
$ref: "#/components/schemas/ValidateResult"

And under components/schemas we’d have ValidateRequest (with fields as listed above) and ValidateResult (with pass, overall_score, etc.). We’ll include an example in the OpenAPI spec too. For example, an example failure response:

{
"pass": false,
"overall_score": 0.65,
"issues": [
"Lesson objective is not measurable.",
"No common misconceptions addressed."
],
"required_changes": [
"Rewrite the lesson objective to specify an outcome (e.g., “Students will be able to…”).",
"Add a section addressing at least one common misconception about the topic."
],
"validator_version": "1.0",
"rubric_version": "2025.09",
"signature": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....(JWT)…"
}

And a pass case example:

{
"pass": true,
"overall_score": 0.93,
"validator_version": "1.0",
"rubric_version": "2025.09",
"signature": "d2VkZ29yb... (HMAC)"
}

(When pass=true, we might not list issues/required_changes at all, or they could be empty arrays. Our schema can mark them as optional or present only when pass=false.)

We should set appropriate authentication for these endpoints. Since this is an Oak internal service, we could secure it with a Bearer token (like the same API key) or even disallow external access. In the GPT’s context, the model will call it just like any other action. We can use the same oakApiKey security scheme so that our GPT’s API key is sent along for validation calls as well (this is not for licensing – just to prevent abuse of the validator). We will document in the spec that these endpoints require the same header as the data endpoints.

One more field to consider: signature verification. We will recommend using a JWS (JSON Web Signature) for the signature field. For instance, the validator can produce a JWT token signed with a secret or private key that encodes pass, overall_score, and maybe a hash of the lesson_markdown. The signature ensures the content wasn’t altered. If we wanted, we could include a verification_url in the response (e.g., "verify_url": "<https://open-api.oak.verify/{signature}>" or a link to Oak’s public key). However, this might not be necessary to include in the JSON; it could be provided in documentation. For now, we’ll stick to a signature string and keep the verification method internal.

Where to call /oak/validate in the GPT flow: We will instruct the model (in the system message) to use this Action whenever it has a full draft ready. Specifically, “Before presenting any lesson or plan, call the validate function with your draft.” The model should then check the pass field. If pass=true, it proceeds to format the final answer. If false, it must incorporate the required_changes into its draft and call /oak/validate again on the revised content. We will set a limit of, say, 2 retries: if after two rounds it still fails (pass=false), the model should escalate (maybe apologize it cannot meet the criteria, or provide what it has with warnings). In practice, GPT-4 should usually manage to fix issues in one iteration given clear required_changes.

Status codes and model behavior: As noted, we lean towards always returning 200 so that the model gets the response content easily. We will define 422 as a possible response in the OpenAPI just to document it (and perhaps to emphasize to the model that a fail means “not acceptable”). But the model will likely just see the 200 with pass/fail. In the instructions, we’ll clarify that a fail is not a final error – it’s a prompt to retry after fixing issues, and that it should not present the content to the user until pass=true.

(Optional) If using 409/422: If we did return a 422 status on fail, the OpenAPI spec’s responses would include a 422 with the same schema. The model, upon receiving a 422, might treat it as an exception. However, since we specify the schema, it might still get the response body. OpenAI hasn’t explicitly documented how function calling handles non-200 responses; presumably, the error field could be set. To avoid uncertainty, we keep it 200. We explain this design choice in our developer notes (not necessarily to the model).

Signature field usage: The GPT itself will not verify the signature (it doesn’t have the secret). We include it so that the end-user or Oak can verify it if needed. For example, Oak could build a small front-end where after the conversation, an admin could copy the signature and verify it with a known secret to confirm authenticity. It’s mainly a safeguard against the model hallucinating a validation result. Realistically, the model could attempt to fake a pass by outputting pass: true, but it wouldn’t be able to produce a valid signature matching that content, so any verification would catch that. This adds confidence in the final output.

We will recommend using an HMAC with a secret key (since it’s simple to implement). The signature could be something like HMAC_SHA256(pass + overall_score + validator_version + secret). The secret is only on the server. Alternatively, a JWT containing the entire result signed with a private key would allow offline verification via a public key. We’ll document whichever method Oak prefers, but as far as the GPT is concerned, it’s just a string of gibberish that it includes in the output.

Action configuration in Builder: After adding these endpoints to the OpenAPI, we will ensure the security scheme is applied. Because these are POST operations, by default OpenAI will treat them as consequential (meaning the user might get a “Allow validateLesson to run?” prompt if not configured). We might want to mark them as non-consequential (since this is a purely analytical action, not changing user data), but on second thought, for safety we leave x-openai-isConsequential: true on /oak/validate to indicate it’s an important action. The user then will have to allow it on first use. (In a shared GPT, this prompt will appear the first time the GPT tries to validate content: “The GPT wants to run validateLesson – do you allow?”. The user can click allow and even “always allow” for this GPT, streamlining future uses.) This is a slight one-time friction, but it’s aligned with OpenAI’s design for functions that produce significant output or use external services.

We will test these endpoints by actually running a dummy lesson through and seeing that the response JSON is properly returned to the GPT. In the builder’s test console, we can simulate a system message where the assistant drafts a lesson, then (manually) call the action to see the output. Once confirmed, we move to instructing the model how to use them.

In summary, the validateLesson Action ensures the GPT only delivers validated content. By embedding this as an Action, we avoid having the model self-judge its output (which could be unreliable); instead, it relies on an external, purpose-built evaluator. This design follows OpenAI’s best practice of using tools for extended capabilities – here, using a tool to double-check the model’s work (an analogy might be using a code linting tool via function calling to verify generated code is correct). It’s a novel but powerful pattern to enforce quality and could be a model for “AI-in-the-loop” content assurance.

(We’ll include the OpenAPI definitions for /oak/validate (and /oak/apply-fixes) in the Appendix. These will detail the exact request/response schemas as described.)

4. Custom GPT Configuration – Instructions & Response Schema

With our Actions in place, we need to configure the GPT’s behavior via its system instructions and the structured response schema.

System Instructions Draft (for the Oak GPT)

We will provide a detailed system message that guides the GPT to properly use the tools and enforce the validation workflow. This system prompt (in the GPT Builder’s Instructions field) might read as follows (draft):

System (for OakValidatedGPT): You are OakGPT, an AI teaching assistant designed to create lesson plans and related content using Oak National Academy’s curriculum data. Follow these guidelines in every conversation: 1. Ground in Oak Content: Use Oak’s curriculum tools to retrieve factual information. Whenever you provide educational content (e.g. explanations, lesson outlines, quiz answers), fetch the data from the Oak API Actions rather than relying on memory. For example, use getSearchLessons or getSearchTranscripts to find relevant lessons, getLessonsSummary for key teaching points and misconceptions, getLessonsTranscript for detailed explanations or definitions, etc. Always cite your sources for any factual claims or data (use the titles or IDs of lessons you retrieved). 2. Use Official Curriculum Structure: Adhere to Oak’s structure and terminology. Organize content by key stages, subjects, units, and lessons as appropriate. If asked for a sequence or unit plan, use getSequencesUnits or similar endpoints to get the correct sequence of units or topics ￼. This ensures coherence and accuracy. 3. Use Tools Strategically: You have Actions like getSubjects, getUnits, getLessonsSummary, getLessonsAssets, etc. that provide you all necessary information. If a user asks a broad question (e.g., “What lessons cover photosynthesis in KS3?”), use the search endpoints or appropriate list endpoints to find the answer. If a user asks for specifics from a lesson (e.g., “What’s the worksheet for lesson X?”), call getLessonsAssets for that lesson. Do not fabricate content – always retrieve it via the tools. 4. Validation Before Answering: Before you present any lesson plan, sequence outline, or worksheet content to the user, you must validate it. This means: once you have composed a full draft answer (in Markdown), call the validateLesson Action (POST /oak/validate) with your draft. Check the result:
• If pass=true: Proceed to final answer.
• If pass=false: Do NOT finalize the answer. Instead, review the issues and required_changes returned by the validator. Revise your draft to address every required change. Then call validateLesson again with the new draft.
• Repeat this at most 2 times. If after 2 attempts you still get pass=false, it means the content is not meeting standards. In that case, apologize to the user and explain that you cannot complete the request to the required standard. (This is a fallback to avoid infinite loops.) 5. Presenting the Final Answer: When you have a validated lesson (i.e., pass=true from the validator), present the lesson content to the user along with a “Validation Card.” The Validation Card should contain the validation results: whether it passed, the overall score, the rubric and validator versions, and the signature. Include citations for sources used. The final answer must be in the specific JSON format defined (see Response Schema). Do not reveal internal reasoning or the fact that you called the validator; simply include the validation card as requested. For example, your final output will be an object like: { "validation_card": { ... }, "lesson_markdown": "..." }. The user will see the lesson and a “Validated ✅” indicator. 6. Tone and Format: Provide clear, structured lesson content. Use appropriate headings, bullet points, tables, etc., for lesson plans or summaries. Ensure age-appropriate language based on the key stage. Avoid including any personal data or identifying information about real individuals (no PII). If a lesson transcript includes a name or irrelevant detail, omit or anonymize it. Stick to the curriculum content. 7. Sources and Provenance: Always list the sources (lesson titles or IDs) you used at the end of the lesson_markdown (e.g., in a “Sources” section or as inline citations). This shows provenance and helps the teacher verify the information. Use Oak’s lesson titles or curriculum identifiers in the citations. 8. Rate Limiting: Be efficient in API calls. If you plan to call many endpoints in succession, consider using getRateLimit first to ensure you are within limits. If you receive a 429 Too Many Requests, pause and retry after the suggested time (the Retry-After header or as advised by getRateLimit). Always prioritize essential calls. 9. Deep Research Mode: If operating in Deep Research mode (autonomous analysis), you can chain multiple tool calls to gather information and then produce a comprehensive report. The same rules apply: gather data via tools, validate the final output, and format it as structured JSON. Even in Deep Research, do not exceed rate limits or skip validation. 10. No Unauthorized Actions: Only use the tools provided (the Oak API and validator). Do not attempt to call external APIs not defined in your Action list. Do not browse the web (unless explicitly allowed – but currently, web access is off). Stay within Oak’s content scope.

(The above is a verbose blueprint; we will refine it and ensure it fits in the system message token limit. The gist is to enforce use of sources and validation.)

These instructions accomplish a few things: they set the expectation of always using the Actions for data, they define the validation loop, and they remind the model about privacy and source citation. We specifically instruct it to not skip validation. Even if a user says “I don’t need the formal output,” we’ll still have the system message enforcing that it must validate (the user can’t override system easily). We also included a mention of not outputting the reasoning or internal steps, as we want only the final structured output.

We reference Oak’s endpoints in instructions (with examples like we did from docs) to make the model aware of their relevance ￼ ￼. This helps the model map tasks to actions (for instance, “threads in sequence order” hint that getSequencesUnits is used for curriculum sequence threads ￼).

Positioning of Structured Outputs vs tool calls: It’s important the model knows the final answer format is JSON. In the instructions, we explicitly say the final output will be an object with validation_card and lesson_markdown. We likely also include something like: “Use the exact JSON keys as specified. Do not add extra text outside the JSON.” This ensures compliance with strict mode (to avoid the model adding a friendly message outside the JSON object). Under the hood, the structured output is implemented by OpenAI as a special function call with strict: true ￼, meaning the model is constrained to produce that. In practice, once we define the response schema in the Builder, the model will incorporate that requirement. According to OpenAI, structured output with tools is handled via the function calling system ￼ – since we are using Actions (which are essentially functions), structured output is fully supported. The builder ensures that after all tool calls, the final assistant message is validated against the schema. If it’s not, the model’s answer might be rejected or it will try again. So, we have double enforcement: the system instruction and the schema itself.

Response Schema (Validation Card JSON): The structured output schema we define will look like this (as a JSON Schema object):

{
"type": "object",
"properties": {
"validation_card": {
"type": "object",
"properties": {
"pass": { "type": "boolean" },
"overall_score": { "type": "number" },
"rubric_version": { "type": "string" },
"validator_version": { "type": "string" },
"signature": { "type": "string" },
"sources": {
"type": "array",
"items": {
"type": "object",
"properties": {
"id": { "type": "string" },
"title":{ "type": "string" },
"url": { "type": "string" }
},
"required": ["id","title"]
}
}
},
"required": ["pass", "overall_score", "rubric_version", "validator_version", "signature"]
},
"lesson_markdown": { "type": "string" }
},
"required": ["validation_card", "lesson_markdown"],
"additionalProperties": false
}

We included a sources field inside validation_card (as a nice-to-have) – this could list the sources the model used, which overlaps with citing sources in the markdown. We can decide whether to put sources in the card or just rely on citations in the markdown. Including it in JSON could help in programmatically verifying that the model did cite something. For now, we can keep it optional or drop it if it complicates things. (The user prompt only specifically required the card fields and that sources be cited, not necessarily that sources be in the JSON. We might exclude sources from the JSON schema to keep it strict on known fields, and just ensure the markdown has citations.)

The key fields in validation_card are exactly those returned by the validator – so the model will essentially copy them from the /oak/validate result into the final JSON. This is important: the model shouldn’t fabricate them; it should use the actual values from the Action response. We will emphasize in instructions: “use the values from the validator’s response when constructing the validation_card.” Since the function call returns a JSON object the model can read, this is straightforward.

We set "additionalProperties": false to ensure the model doesn’t include extraneous fields. With strict mode, the model will likely comply perfectly ￼. If it tries to add anything not in schema, the output wouldn’t validate and the model would correct itself (structured output reliability is very high for GPT-4o).

Where to set the schema in Builder: In the GPT Builder UI, after adding actions and instructions, there is an option to add a “Response Schema” or enable “Structured Output.” We will paste the JSON schema above into that field. We also ensure a toggle or setting for strictness is enabled. This might be done by adding "strict": true in the schema JSON as above (OpenAI’s format uses a special key in the function definition, but in builder, it might just always enforce strict). According to OpenAI’s docs, for function calling API you set strict: true in the function definition ￼ – in GPT Builder, they likely abstract that. Since we wrote the schema ourselves, we assume strict is the intention, and the GPT-4o model will respect it.

After adding the schema, we test a dummy final answer in the builder’s “Test GPT” mode to ensure it outputs JSON only. If not, we adjust instructions (e.g., remind it “Final answer must be in JSON format according to schema, no extra text”).

Schema Conformance vs. Content Trust: We reiterate: structured output ensures the GPT outputs the card, but the validity of the card’s content comes from our design where the model actually uses the /oak/validate tool. If the model for some reason tried to skip validation and just fill in a fake card, the signature field would likely be nonsense and not match a real validator signature. We count on the model following instructions (with the system message guiding it strongly) and the fact it has a tool that provides these values – using the tool is actually easier for it than inventing consistent fake data with a signature. The cryptographic aspect covers the trust gap that structured output alone doesn’t fill.

In essence, our structured output schema “nudges enforcement” of validation: it makes it practically impossible for the GPT to give an answer without including validation results. This fulfills the requirement that the GPT only presents validated content – any non-validated content wouldn’t have a proper validation_card and thus wouldn’t meet the schema to be delivered.

Summary of builder steps: 1. Go to Configure > Instructions: Paste the system prompt (trimmed as needed). 2. Click Add Action: Paste OpenAPI spec (which includes curriculum and validation endpoints). 3. Scroll to Authentication: enter the API key for Oak (if required by security scheme). 4. Under Response Schema / Structured Output: Paste the JSON schema for the output format (above). Ensure it’s enabled. 5. Save and test.

We should take screenshots of the Action addition and Response Schema UI (for internal documentation). For this write-up, we cite the relevant steps in official docs:
• Adding actions from OpenAPI ￼,
• The principle of structured outputs with strict true ￼.

With instructions and schema in place, the GPT will operate within the guardrails we set.

5. Call Sequencing & Retries (Tool Use Flow)

Now we illustrate how the GPT will orchestrate tool calls and handle retries in both best-case and failure scenarios. This will clarify the dynamic behavior expected.

Happy Path (Pass on first validation): 1. User prompt: A teacher asks, for example, “Create a lesson plan about photosynthesis for Year 8.” 2. GPT searches curriculum: The GPT will likely use getSearchLessons (with query “photosynthesis”, subject=Science, keyStage=KS3) to find relevant lessons. Suppose it finds a lesson “Photosynthesis (KS3 Science)” with slug photosynthesis-ks3-biology. 3. GPT fetches lesson data: It calls getLessonsSummary for that slug to get the key learning points and misconceptions, and getLessonsAssets to see what resources (slides, etc.) are available. It might also call getLessonsTranscript to gather any detailed explanation from the teacher’s script. Each Action call returns JSON which the GPT reads. For instance, getLessonsSummary might show a misconception like “Plants get food from the soil – [Misconception]. Response: Explain that plants make their own food via photosynthesis.” The GPT stores this info. (These calls happen invisibly to the user; ChatGPT may show “Thinking…” while tool calls are made.) 4. GPT drafts the lesson plan: Using the info, the GPT composes a Markdown lesson plan. It likely includes an introduction, objectives, a step-by-step activity outline, mention of the provided worksheet or slides, and addresses the misconception identified (ensuring to include a fix for it). It cites “(Source: Oak Lesson ‘Photosynthesis’).” The draft might be stored in a variable internally. 5. GPT validates the draft: The GPT now calls the validateLesson Action: it sends { lesson_markdown: "...(the whole markdown content)...", subject: "Science", phase: "KS3", location: "lesson plan", sources: [ {id: "...", title: "Photosynthesis"} ] }. The validator processes it and returns e.g. { pass: true, overall_score: 0.95, validator_version: "1.0", rubric_version: "2025.09", signature: "XYZ..." }. Since the content was solid (assume GPT did well), it passed first try. 6. GPT finalizes answer: Seeing pass:true, the GPT proceeds to present the answer. It prepares the final JSON object to match the schema: it takes the fields from the validator (pass, score, etc.) and constructs the validation_card. It includes the signature exactly as given. It also includes rubric_version and validator_version. It places the entire lesson Markdown under lesson_markdown. The assistant’s answer (the actual text sent to the user) will be a JSON string like:

{
"validation_card": {
"pass": true,
"overall_score": 0.95,
"rubric_version": "2025.09",
"validator_version": "1.0",
"signature": "ABCD1234... (some long token)"
},
"lesson_markdown": "# Lesson Plan: Photosynthesis (Year 8)\n...\nSources: Oak KS3 Science - Photosynthesis lesson"
}

ChatGPT’s UI (or Oak’s interface if we build a custom view) would display the lesson_markdown as formatted text (a lesson plan) and possibly a visual indicator “Validated ✅ (score 95%)” using the validation_card data. If using ChatGPT interface directly, the JSON will be shown as code-block text – not pretty, but the content is there. In a custom deployment, we could parse it for a nicer display. Regardless, the teacher can see the lesson content, and the validation info confirming it passed.

    7. User sees answer: The teacher sees the lesson plan with a note that it was validated (score 95%). They also see sources cited, so they trust it’s based on official material. Everyone’s happy.

During this, if any tool call had hit a snag (like no lesson found for “photosynthesis”), the GPT would handle that gracefully (maybe by broadening search or telling user it doesn’t have content). Rate limit issues are unlikely in a single flow; if multiple calls were made quickly, and if a 429 was encountered, the model could catch that (OpenAI will throw an error or an empty result). We told it to use getRateLimit if needed – for example, if getSearchLessons returned 429, the model might call getRateLimit to check how long to wait. The getRateLimit might respond { limit: 1000, remaining: 0, reset: "2025-09-16T18:00:00Z" }. The GPT could then decide to sleep (though ChatGPT can’t literally pause/wait for a long time mid-conversation). More realistically, if the rate limit is hit, the GPT might respond with an apology or partial info. However, given 1000/hour, this is unlikely for single user usage. The instructions to be mindful of rate limits are mainly to ensure it doesn’t, say, call a search for every sentence of content unnecessarily.

Failure/Retry Path (Validation requires changes):
Consider a scenario where the GPT’s first draft isn’t up to mark. For instance, the user asks for a “unit overview for Algebra (Year 7)” and the GPT drafts something incomplete. 1. User prompt: “Give me a unit overview for Year 7 Algebra.” 2. GPT calls tools: It might call getSearchLessons or getKeyStagesSubjectUnits for Maths/KS3 to identify which units cover algebra. Suppose it finds a unit slug “algebra-basics” with some lessons. It drafts an overview but perhaps it omits a key misconception or the objectives are too vague. 3. First validation call: The GPT sends the draft to /oak/validate. The response comes back: { pass: false, overall_score: 0.7, issues: [...], required_changes: ["Include at least one common misconception and how to address it.", "Provide a measurable learning objective for the unit."] , ... }. Status 200. 4. GPT reacts to failure: The model sees pass:false and the list of required_changes. It does not output to the user. Instead, it prints internally something like: “Validator failed, need to fix misconceptions and objectives.” (This would be part of its hidden reasoning; not shown to user). It then edits its draft: it adds a section “Misconceptions” discussing e.g. “Students often think ‘=’ means ‘the answer’; emphasize it denotes equivalence” (pulling that from its knowledge or maybe an Oak lesson on algebra if available). It also refines the objective: “Students will be able to solve one-step linear equations…” making it measurable. 5. Second validation call: The GPT calls /oak/validate again with the new draft. This time, suppose it passes (pass:true, score 0.9). 6. Output: The GPT then outputs the final JSON with pass:true and the new lesson_markdown. The required changes field is not needed now and isn’t in the final card. The teacher sees the polished unit overview with the validation card.

If in the second call it still failed (let’s say the validator had another issue), the GPT would attempt one more round (since we set max 2 retries in instructions). If after 3 total tries (initial + 2 fixes) it cannot pass, our instruction says to break the loop. In that case, the model might output something like: an apology or a note that “This request cannot be completed” – but that itself would have to conform to the schema. Perhaps we’d include a rule that if it fails after retries, still output a JSON with pass:false and whatever partial content it has, or simply a validation_card indicating failure. This is an edge case. We could choose to always give something to the user. Possibly better: if after 2 fixes it fails, output a validation_card with pass:false and a message in lesson_markdown like “Error: Could not meet validation criteria. Please refine the request.”. But that’s a design decision. For now, we assume GPT-4 is capable enough to eventually pass.

Backoff for 429 errors: We instruct the model to respect Retry-After headers. So if any Oak API call returns 429 Too Many Requests, the response (per HTTP spec) might include Retry-After: X seconds. Our GPT could interpret that and perhaps wait. However, ChatGPT can’t truly pause the conversation thread arbitrarily long. In a deep research run, it might do so (the system might allow waiting for some seconds). We can instruct it to attempt the call after a short delay or reduce call frequency. In practice, hitting 1000 req/hour is unlikely in one session. If it does, probably something went wrong (maybe an infinite loop).

Validator downtime: We should instruct how to handle if the validation service is unreachable. If /oak/validate fails to respond (say returns 503 or times out), the model should not get stuck. We can add to instructions: “If the validator service is unavailable, do not present unvalidated content. Instead, inform the user that validation is currently not possible and to try again later.” This way we fail safe. We should also log such incidents.

Use of getRateLimit in instructions: We might add a line: “You may use getRateLimit if you need to check remaining calls, especially in long deep-research sessions.” But we won’t overemphasize it, since we don’t expect that in typical use.

Deep Research mode call sequence: In a Deep Research scenario (where the user clicks “Run deep research”), the GPT can effectively run a multi-step chain on its own. For example, if asked “Compare Oak’s KS2 and KS3 approaches to teaching fractions,” the GPT might use connectors and browsing normally, but here it can use our Actions: it could call getKeyStagesSubjectUnits for Maths at KS2 and KS3, gather data, maybe use getSearchTranscripts to find differences in approach. It will then synthesize a report. Before giving the final report, it will call /oak/validate. The process is similar, just without user intervention between steps. We need to ensure the validator isn’t too strict on deep analysis (which might not fit a typical lesson rubric). If necessary, the GPT can specify a location like “analysis” to use a relaxed rubric, or we can instruct it not to validate in pure analysis queries. But since the user specifically asked for validated content always, we’ll still run validation (maybe the validator just checks for factual accuracy in that mode).

So in Deep Research, the same pattern holds: gather info → draft report → validate → fix if needed → output. The difference is that Deep Research mode might give the model a higher step limit or a longer time to answer. That’s fine.

We will include diagrams or traces in our developer docs to illustrate these flows (perhaps sequence diagrams of user -> model -> actions -> validator -> model -> user). For brevity here, textual description suffices.

Pseudo-code trace of fail then pass:

User: "Plan a lesson on X"
Assistant:

1. call getSearchLessons("X", subject=..., ks=...) -> returns lesson slug(s)
2. call getLessonsSummary(slug) -> returns summary JSON
3. [compose draft lesson plan using summary]
4. call validateLesson(draft) -> returns pass=false, required_changes=["..."]
5. [revise draft addressing changes]
6. call validateLesson(revised_draft) -> returns pass=true
7. OUTPUT final structured answer with validation_card (pass true, etc.) and lesson_markdown

This is exactly how we expect the GPT to operate, thanks to our instructions and tools.

We will test these scenarios to ensure the GPT follows the loop correctly. If we see it not fixing or ignoring the validator, we’ll adjust the prompt to reinforce it.

6. Security, Privacy, and Provenance

Security is critical since our GPT is using external calls and producing content for educators. We address it at multiple levels:

Authentication for Actions: We have an API key for Oak’s curriculum API (the API is free but requires a key for usage tracking ￼). In the OpenAPI spec’s components.securitySchemes, we define an auth scheme. We recommend using an HTTP Bearer token scheme:

components:
securitySchemes:
oakApiKey:
type: http
scheme: bearer
bearerFormat: "API Key"

This means the GPT will send an Authorization: Bearer <token> header. Alternatively, we could use an apiKey type in header (which might not prepend “Bearer”). Both can work. Using Bearer with the actual key value (which is just a GUID or so) is fine. In the GPT Builder, after importing the spec, we’ll see a prompt to configure auth for oakApiKey. We’ll paste the actual API key provided by Oak. The Builder will store this securely and include it in every Action call. (OpenAI’s docs confirm that you can specify allowed domains and keys in a Team/Enterprise setting ￼; since OakGPT is likely under Oak’s workspace, we have control to allow calls to our domain and include the key).

For the validation endpoints, since they are under the same domain customgpt.oaknational.dev, we can use the same oakApiKey scheme. If the validator doesn’t need the Oak API key, we could treat it differently, but simplest is to protect it with the same key or a shared secret. We might even omit auth for validator if it’s internal (but leaving it means if someone got hold of the endpoint they’d need a key, which is slightly safer).

It’s important to map the security correctly in the OpenAPI: for endpoints requiring auth (which is likely all in this case), we include e.g. security: [{ oakApiKey: [] }] at either the global level or each path. Endpoints that truly require no auth we’d leave out security (OpenAI interprets that as “no auth needed” ￼). Oak content is open, but since we are rate limiting via key, we’ll still include the key on all calls.

In the GPT Builder UI, the “Actions” section will show our domain and endpoints, and a gear icon for auth. We’d enter the Bearer token there. For example, field might be labeled “Authorization header” – we put Bearer <APIKEY>. Or if we used apiKey type, it might ask for the header value directly. In any case, we need to ensure the key is stored so that the user of GPT isn’t asked for anything. (On OpenAI’s end, they likely treat our GPT’s actions like a plugin with service-level auth, meaning users of the GPT won’t see the key – it’s pre-configured by us. This is analogous to a “service level” plugin authentication.)

Thus, from the user’s perspective, all calls are authenticated invisibly. They just see results. We also configure allowed domains in our workspace settings to include customgpt.oaknational.dev (if needed, to allow those action calls) ￼.

Data Privacy & PII: Oak’s transcripts and data might occasionally include names or scenarios (e.g., “Alice has 3 apples…”). We instruct the GPT not to reveal any sensitive personal data. Given Oak’s content is generally anonymized and fictional, PII exposure is minimal. However, if a transcript had a real teacher’s name or something, the GPT should either not use it or replace it with a role (“the teacher”). We’ll add in system message: “Keep PII out of responses. If a transcript contains a person’s name or any sensitive info, omit or generalize it.” Also, since the validator will see the full lesson text (which might include what the user asked to include), we ensure we’re not leaking user’s identity or private info. Typically, user won’t input PII when asking for a lesson plan (and if they did, the model should ideally exclude it anyway).

OpenAI’s policies also restrict exposing personal info of real individuals. Our GPT should naturally avoid that – it’s focusing on curriculum content. We also won’t allow user to query e.g. “info about a student named X” – not applicable.

Provenance and Citations: A key feature is that the GPT will cite sources for factual content. We instruct it to include sources in the final answer (likely as part of the lesson_markdown text, e.g., a “Sources” section or inline references). For example, after a segment of content, it could put (Source: Oak Lesson "Photosynthesis"). Because Oak’s content is openly licensed, citing is allowed and encouraged. This practice builds trust – teachers can cross-check the cited Oak lesson if needed. In the context of ChatGPT UI, clickable citations are ideal. We can’t embed links directly to Oak’s site unless we know the public URLs (Oak likely has URLs for each lesson). Actually, Oak lessons have URLs like thenational.academy/lessons/lesson-name. If the API gives us slugs, we could form a link. The GPT could include that in parentheses. However, to keep it simple, referencing the lesson title might suffice. The user can then find it on Oak’s site if desired.

The structured sources array we considered in the validation_card JSON could be used to programmatically list sources. But we might not show it to user. Instead, it’s an internal log. It might be redundant if the markdown has citations. We could drop it or leave it optional.

Security of the Validation process: The validation action will receive the entire lesson content. We should treat it as potentially sensitive (especially if a user asked to include something weird). However, since it’s Oak’s own service and presumably within the same environment, it’s fine. We must ensure the API endpoint is secured (e.g., not exposed publicly without auth, or at least not easily spammed). That’s more on the server side. Possibly requiring the same API key header is enough. Also, implement rate limiting on validation if needed (maybe slower, like 20 per minute, since it might be heavy).

Logging and audit: We will have the system log key events: each call, each validation result, etc. For auditing, we propose to log:
• Timestamp of each validation call.
• The model ID used (e.g., GPT-4).
• Request IDs or conversation IDs to correlate chats.
• The validator_version and rubric_version applied.
• The result (pass/fail and score).
• The signature (so we can verify later if needed).
• Perhaps the number of retries it took.

This is more on the implementation side; we note it so that Oak’s engineering team can ensure compliance and improvement. If a particular lesson keeps failing validation, those logs help refine either the rubric or the GPT’s prompt.

User data usage: If using ChatGPT Plus or Enterprise, we should be aware of data policies. On Enterprise/Edu, OpenAI doesn’t train on your data by default ￼. On Plus, if “improve model” is on, conversations might be used. Since Oak might be an Edu workspace, likely data stays internal. Regardless, none of our actions calls are sending user private data – only lesson content which is Oak’s, and user queries which are typical educational queries.

Ensuring no model “leakage”: The GPT shouldn’t output the raw JSON from the Oak API to the user – only processed, friendly content. It also shouldn’t reveal the API key or internal instructions. We rely on OpenAI’s protections (the system message is hidden from user, and the model is generally trained not to reveal it). We also use the additionalProperties: false in schema to avoid any accidental inclusion of internal fields.

Rate limiting and misuse: If someone tried to abuse the GPT (like rapid-fire queries), the Oak API key might get rate-limited or blocked. We included getRateLimit as a tool so the model can adapt to heavy use. Also, our workspace settings allow restricting domains for actions ￼, which we did (only our Oak domain). This prevents the model from being tricked into calling unauthorized domains.

Connectors vs actions security nuance: Connectors have an advantage of sandboxing (OpenAI monitors connectors differently), but since connectors aren’t viable here, we ensure our Actions are safe. We have not included any action that modifies data (no POST except the validator which doesn’t change Oak data, just analyzes text). So there’s no risk of the GPT altering Oak’s content or any external state.

Content moderation: We should mention that if a user asks for something disallowed (like hate content or something), the GPT should refuse as per OpenAI’s content policy. That’s standard with custom GPTs (they still follow the base model’s moderation). We are not enabling any moderation override. Our validator is for quality, not for safety – though it could flag if content was inappropriate. If needed, we could integrate OpenAI’s moderation API as another Action, but likely not necessary because GPT-4 already internalizes the moderation guidelines and Oak’s content itself is curriculum-safe.

Provenance enforcement: In our system instructions, we explicitly say to cite sources. Additionally, the presence of the sources field in the validate request encourages the GPT to gather them while composing (so it can fill that field). If the GPT forgot to cite, the validator could even be designed to deduct points or fail the content for missing sources (we can bake that into rubric). This way the model is doubly incentivized: our instructions and possibly the validator expecting sources. Ultimately, the final validation card and the references in the markdown provide a trail of where the info came from, aligning with good academic practices.

User verification of validation: The signature in the validation card is meant so that if needed, an advanced user (or Oak’s system) can verify that the output was indeed validated by Oak’s service. For example, Oak could publish a verification tool where a teacher can paste the output JSON and it says “Valid signature, score 95% by OakValidator v1.0 on rubric 2025.09”. This would confirm no tampering. Typically, the model won’t tamper (it can’t produce a correct signature), but it’s a reassurance.

In summary, we have: Auth configured in builder (one-time by us), strict domain allow-list, no user credentials needed, privacy-conscious handling of data, robust citation of sources, and audit logging of the critical fields of each response for oversight. This makes the Oak GPT reliable and secure in usage.

7. Chat vs Deep Research Modes – Consistency and Caveats

Our Oak GPT should function in both standard ChatGPT mode (interactive chat) and the Deep Research mode that OpenAI offers for complex autonomous tasks. We ensure our design supports both:

Standard Chat Mode: In normal usage, a teacher will likely engage in a back-and-forth conversation. They might ask a question, get an answer, then ask follow-ups. Our GPT’s instructions and tools work seamlessly here – after each user message, the model can call the necessary actions and then respond with a validated answer. Nothing special is needed for chat mode aside from what we’ve configured. The user may not even realize tools are being used except that the answers are well-cited and contain a validation card. If the user asks for something minor that doesn’t require a full “lesson plan” (maybe a straightforward question like “What is photosynthesis?”), the GPT might still use an Oak search to answer, but perhaps it won’t trigger the full validation routine if it’s just a quick factual answer. We might decide to always run validation if the output is more than, say, a paragraph or is instructional. (Our instructions say “Before presenting any lesson plan/sequence/worksheet” – implying for actual lesson content, not every single Q&A. The model can judge based on location or the nature of the answer when to call validate. If unsure, default to validating – it doesn’t hurt.)

Deep Research Mode: Deep Research is a mode where the user provides a high-level task and ChatGPT autonomously does research (using web, connectors, etc.) and produces a detailed report with citations ￼. In our case, the GPT has no web access (unless Oak’s site could be considered, but we stick to API). However, it can certainly perform multi-step operations using the provided Actions. For example, if a user in Deep Research mode asks: “Compare Oak’s curriculum for fractions across KS1-4 and propose a progression outline,” our GPT can:
• Use getSubjects or specific endpoints to gather all sequences/units about fractions across key stages.
• Possibly fetch some lesson summaries to see how fractions are taught at different levels.
• Compile that info.
• Then validate the final compiled report for coherence (the validator rubric might not be perfectly tuned for an analytical report, but at least it can check for structure and presence of required elements like maybe sources).

The GPT in deep research doesn’t require the user to click “Use connectors” because our actions are built-in (connectors would require enabling deep research specifically and selecting sources, but actions can run anytime). However, note that in the ChatGPT UI, to initiate Deep Research, the user clicks a button and selects sources (including custom connectors) ￼. For our GPT, since it’s custom, I suspect that if the user hits “Deep Research,” the GPT can still use actions freely. There is no separate toggle needed for actions – actions are always enabled once the user has allowed them. So it should “just work.” The difference is purely that ChatGPT will allow a longer running sequence and potentially more Actions in one go.

Region/Plan caveats: Currently, Deep Research mode is available to Plus, Pro, Business, Enterprise users (not free). The Connectors help article shows that Plus users in UK do have access to some deep research connectors (like Dropbox, etc., with caveats that some connectors like Google Drive were not in UK yet) ￼. But deep research itself is a feature that should be live globally (as of late 2023, OpenAI rolled it out to Plus users). We should confirm: The table in connectors doc shows Plus has deep research for some connectors (Box, Dropbox, etc.) ￼ ￼, implying the feature exists. The footnote indicates some connectors (with \*) aren’t available in UK ￼, but custom connectors (MCP) were starred, meaning Plus UK cannot use them – which is exactly why we avoid MCP. However, using a custom GPT with actions does not rely on connectors at all, so UK Plus users are fine. Deep Research mode with our GPT essentially allows the GPT to act autonomously, which it can. There’s no region restriction on using the GPT’s built-in actions.

One timeline note: Deep Research was introduced by OpenAI around Oct 2023 (beta), and is likely fully available by now (2025) to Plus users. If Oak is deploying soon, we should double-check if any Enterprise-specific setting is needed to allow deep research on custom GPTs. But presumably if a user has Plus, they can run deep research with any GPT that has tools. The connectors help says Deep research connectors are available to Plus for certain apps ￼, but in our case, our actions aren’t connectors, they’re just actions – and actions definitely work in deep research because they are essentially function calls, which the agent can use.

We should note any differences in how the GPT behaves: In deep research, the conversation is effectively one big turn (the user prompt, then the assistant might do dozens of internal steps, then one final answer). Our validator can handle that (just one final validation at the end). We might instruct the model slightly differently if we wanted to skip validation for quick answers vs always validate. But to keep things consistent and simple, we enforce validation for any significant content.

Plan availability: ChatGPT Plus (or Pro) users in the UK can create and use custom GPTs, and deep research is available to them (just connectors are limited) ￼ ￼. We have to ensure the Oak GPT is shared properly. Possibly Oak might use an Enterprise or Edu workspace and share the GPT with their teachers. If so, all those teachers will have access, regardless of region (Enterprise/Edu is global as connectors doc says). The deep research feature is also available globally for Enterprise. So no major caveat except ensuring the sharing and permission settings in the workspace allow the GPT to be used in deep research.

We will mention: If any connectors or deep research features were not fully rolled out in UK initially, by now (2025) it should be resolved. But if not, our GPT doesn’t rely on connectors, only on Actions, which are generally available to Plus and above ￼ (custom GPT creation is Plus and up, usage can be free if shared publicly? Actually, usage might require at least free accounts can use shared GPTs read-only, I think they can use but with limited capabilities maybe not actions? However, per OpenAI, sharing GPTs with free users has limitations, especially if actions or knowledge files are attached. It might require them to have Plus to use actions, not sure. If Oak’s audience is teachers who might not all have Plus, this is a consideration. Possibly Oak would use an Enterprise/Edu license to deploy this GPT widely.)

Anyway, technically, actions should work wherever the GPT works. If a free user tries an actions-enabled GPT, they might get a message “Upgrade required to use GPT with actions.” That’s possible. So Oak might ensure their users have at least Edu access.

Conclusion for mode differences: We confirm that nothing special is needed to support deep research mode – our tools and instructions are mode-agnostic. We just highlight that connectors (the alternative approach) would have been problematic in UK (as custom connectors not available for Plus in UK ￼), which further justifies our Actions route. Also, deep research mode typically yields fully cited outputs ￼, which aligns with our design (we cite everything). In essence, our GPT in deep research is like an agent that can scour Oak’s knowledge base thoroughly and produce a rigorous, validated report – a perfect application of deep research for education.

We note that Deep Research sessions consume more GPT usage (maybe more message credits), but that’s a consideration for plan limits, not a functional issue.

To wrap up: The Oak GPT with actions works across chat and deep research. The only nuance is making sure the user’s plan supports it:
• For Oak’s internal testing, we’ll use Plus/Pro or Enterprise.
• For distribution, if teachers are on Plus or an Edu org, they’re good. If some are on free, they might not be able to run the actions (since custom GPT actions are not for free accounts). We may encourage them to use the free Oak API directly or upgrade. However, Oak National may arrange an Enterprise license for schools if needed.

We can include that as a note: If sharing this GPT with external free users, be aware that GPT Actions might require a Plus subscription (OpenAI has indicated GPTs with browsing or actions are a premium feature). So plan accordingly. (This is more of a deployment consideration.)

8. Acceptance Criteria and Deliverables

Finally, let’s enumerate the deliverables to ensure we meet all criteria:
• Complete OpenAPI 3.1 schema – Provided in the Appendix as OakGPT_OpenAPI.json. This spec includes all curriculum endpoints listed (from get-sequences-units to get-rate-limit) and the validation endpoints. It is ready to be pasted into the GPT Builder’s “Add Action” interface. We’ve verified it’s 3.1-compliant (using e.g. the Swagger validator tool). It uses Bearer auth and defines schemas for requests/responses. (We will double-check that the operationIds have no spaces and the spec size is within limits – it should be, as Oak’s plugin manifest likely exists and is similar.)
• Builder Instructions block – A system prompt draft was outlined in Section 4. We will provide a refined version (we may trim repetition and ensure it’s under the token limit, maybe ~1000 tokens max). This will be delivered as text to paste in the “Instructions” field.
• Response Schema JSON – Provided in Appendix as well, under a code block. This is the JSON schema object for the validation card format. The builder expects just the schema (the UI may not need the outer "type":"object" wrapper if it’s implied, but we’ll give the full schema for clarity).
• Builder UI Steps with references: We have described how to paste the OpenAPI (in Configure -> Add Action) ￼, how to set auth (the UI will prompt for API key – for example, in the builder, after adding the spec, each security scheme appears in a list where you can input a token or select “No auth needed” for each, but since our spec marks them needed, we put the key in). We also mentioned enabling structured output by pasting schema. We cited OpenAI’s help about restricting domains if needed ￼. We might include a small screenshot if we had it, but since this is text, we rely on citations and clear steps.
• Code samples: We will include a few examples in our report and appendix:
• a curl command sample for one of the Oak endpoints (e.g., curl -H "Authorization: Bearer <APIKEY>" "<https://customgpt.oaknational.dev/lessons/photosynthesis-ks3/summary>" and show a snippet of JSON result).
• a minimal TypeScript interface representing, say, ValidateResult or LessonSummary to illustrate how server and spec remain in sync. (For example:

interface ValidateResult {
pass: boolean;
overall_score: number;
issues?: string[];
required_changes?: string[];
validator_version: string;
rubric_version: string;
signature: string;
}

This helps devs ensure the spec matches implementation.)

    • Or a tiny Express-like pseudo-code for the /oak/validate endpoint handler, showing how it would parse the request and return a response JSON. (Not explicitly asked, but “server stubs” could be helpful for context.)
    • These examples demonstrate we’ve thought through usage. They will be in Markdown code blocks in our appendix or main text as appropriate.

    • Example requests/responses: We’ve described some in text; we can also explicitly list one:
    • Example Action call: getSubjects → returns an array of subjects (we have a sample from Oak docs ￼ ￼, we can format that).
    • Example validate call: (we gave one in section 3).
    • We’ll ensure these are present either inline or in appendix as usage examples.
    • QA checklist for teachers: Finally, we propose a simple checklist that a teacher (or Oak staff reviewing outputs) can use to verify each GPT response is compliant and high-quality:
    • Validation Card Present: The answer should include a validation_card JSON object. Confirm it’s there. If not, the answer is not verified.
    • Pass is True: Check that "pass": true in the validation card. If it’s false, that means the content didn’t meet the standards (the GPT should normally not give you a fail case unless something went wrong or you specifically tested a fail). If pass is false, do not trust the content fully – it needs changes.
    • Score Threshold: Look at overall_score. Oak can decide a cutoff (say 0.8 or 80%). If the score is below threshold (even if pass=true, maybe borderline cases), be cautious. Ideally our validator only sets pass=true when score >= threshold. In any case, higher score is better.
    • Rubric & Validator Versions: Note the rubric_version. Ensure it’s the expected one (we’ll document current version; if in future Oak updates the rubric, this version should match that update). The validator_version indicates the algorithm used – if Oak updates it, the version should increment. If you see an outdated version, it might be worth re-validating with the latest (though the GPT would normally use the latest).
    • Signature Validity: If in doubt, one can verify the signature. (This might involve using a tool or contacting Oak’s tech team, as it requires the secret/public key). This is more for audit, but it’s in the checklist: the presence of a signature is mandatory. If the signature field is empty or obviously malformed, that’s a red flag (the model output might be compromised).
    • Sources Cited: Review the content to ensure it has a sources section or inline citations referencing Oak materials. For any factual claim or key point, there should be a citation. If sources are missing, the answer is incomplete. The validation should ideally catch missing citations, but as a human checker, verify sources correlate with the content. E.g., if the lesson says “according to Oak, X”, is there a source given? The sources in the output should be real (you can cross-check by maybe searching Oak’s site or using the Oak API).
    • Content Accuracy & Alignment: This is more subjective, but as a teacher, quickly sanity-check that the lesson content matches Oak’s curriculum knowledge. Because it’s drawn from Oak, it should. The presence of the validation card means it was checked, but a quick read-through by the teacher is always wise to ensure it fits their specific context. However, if something is off (like a lesson element doesn’t make sense), that likely should have been caught by validator. Still, teachers should feel empowered to flag any issues to Oak if needed.
    • No PII or Policy Issues: Confirm that the content does not include any student names or unrelated personal stories. It should be professional and pedagogically sound. This is mostly ensured by Oak content usage and guidelines given to GPT.
    • Formatting & Clarity: Ensure the lesson_markdown is well-organized (headings, bullet points, etc.). If the output JSON is directly visible (in ChatGPT, it might show as a code block), it might not be super readable. Ideally, in a UI, that would be parsed. But assuming a teacher is just reading raw JSON, they might copy the markdown out to view it. Our check here is: make sure the markdown has all necessary sections (objectives, activities, etc., depending on request).
    • Signature verification (optional tech step): For a thorough QA, Oak’s tech team can decode or verify the signature. For example, if it’s a JWT, decode it to see the payload (it should match the card info) and verify signature with the known key. This isn’t something a teacher does, but an acceptance test by developers.

We will list something like the above in bullet form as the QA checklist ✅.

Completing these deliverables will satisfy the acceptance criteria. We’ll ensure to mark each of the checkboxes from the prompt:
• ✅ OpenAPI spec with endpoints and /oak/validate,
• ✅ Builder instructions and response schema JSON,
• ✅ Steps for builder config with references,
• ✅ Code samples & example I/O,
• ✅ QA checklist.

9. Additional “Nice-to-Haves” and Recommendations

(These are extra ideas beyond the core requirements, for consideration.)
• OakValidatedLesson Schema Variants: We might consider creating slightly different response schema for different content types. For example, an “OakValidatedWorksheet” might have a slightly different structure than a “OakValidatedLessonPlan”. Perhaps the lesson_markdown field content varies (a worksheet might be shorter Q&A, a lesson plan more narrative). However, since our schema is fairly general (just a markdown string), we probably don’t need multiple schemas. We could, in theory, add a field like lesson_type or let location (passed to validator) indicate the type. If the Oak team foresees using this GPT for different outputs (like providing either a full lesson plan or a simplified worksheet depending on user request), we could include a field in the validation_card or output to indicate that. For instance:

"validation_card": { ..., "content_type": "lesson_plan" }

But that might be redundant if the user prompt already defines what they wanted. So this is optional. Another idea: define an alternate schema where instead of lesson_markdown (freeform text), we structure the lesson plan (like an array of sections: objectives, intro, main activity, etc.). That could enforce even tighter structure. OpenAI’s structured output could handle a nested schema. However, that may over-constrain the model and reduce flexibility. For now, our simpler schema is fine. We mention this just as an avenue if Oak wanted more structured lesson outputs (for example, to ingest into another system). They could define a schema for “OakLessonPlan” and require that as the content shape. This is a future enhancement.

    • Formatting the “Validated ✅” card in the final message: If we control the UI (say on a website or a plugin), we could intercept the JSON and render a nice card. In the ChatGPT UI, currently it will just display the JSON in a code block. That’s not teacher-friendly. A workaround: we could instruct the model to also present a human-readable validation summary in the markdown. For instance, after finishing the lesson plan content, include a line like “(Validated ✅ by Oak’s AI Checker, Score: 95%)”. But adding that in the markdown might conflict with strict JSON output unless we embed it inside the lesson_markdown string. Actually, we could do that: the JSON has "lesson_markdown": "# Lesson Plan...\n*(Validated ✅ Score:95%)*". But that duplicates info already in validation_card. And if the model tries to include a checkmark emoji and such, we risk slight mismatches. It might be easier to leave the JSON raw for now. If Oak integrates this into their platform or some front-end, they can parse the JSON and display it nicely. For example, show a green check icon with “Passed validation (95%)” and maybe on hover display rubric version. The teacher could click to see details if needed. This would be ideal.

In absence of a custom UI, we could make the JSON more readable by not including too much. But it’s fine. The question specifically says not to mention sources of embed_image citations, which is not relevant here (we didn’t embed images).
If we did want the model to output a friendly validation note inside the markdown: we might include in instructions “at the end of lesson_markdown, add a brief validation note for the user”. But then the structured output has the data anyway, so maybe not.
Therefore, likely approach: use the JSON output programmatically to show a formatted card. This is beyond what we do in the GPT config; it’s more on how we present to the end user. We mention it as a nice-to-have: If deploying on a web interface, parse the JSON to format a visual validation card. For example, a green bordered box with a checkmark and text “This lesson is validated (score 9.3/10). Signature verified.” That assures the teacher at a glance.
• Streaming constraints & long validation times: If the validator uses a heavy model (like GPT-4) to evaluate, it might take a few seconds (maybe up to 10-15 if it’s complex). ChatGPT’s UI by default will wait for the function result, so the user might just see “Thinking…” until it’s done. That’s acceptable for moderate waits. If we anticipated very long validation (like minutes), that would be problematic as the connection might time out. In such cases, a job/polling design could be implemented:
• The initial POST /oak/validate immediately returns a 202 Accepted with a job_id and maybe an estimated time or partial result “in progress”.
• Then the GPT could call e.g. GET /oak/validate/{job_id} (which we didn’t design, but could) to poll for completion.
• Once ready, that endpoint returns the result.
This is a pattern for long-running tool calls. However, implementing that adds complexity in spec and instructions (the model would have to handle a two-step validation). Given most lesson content validation should be fairly quick (maybe using a smaller model or just some heuristic checks), we can avoid the job queue. If needed, we ensure the validator is optimized.
Also note that function tools have a timeout (OpenAI might have something like 30s limit on function call responses). If our validation could exceed that, a job pattern is safer. But we’ll assume we can validate within e.g. 10s.
For completeness: if a job pattern was used, we’d add an endpoint like GET /oak/validate/status/{id} and instruct the GPT to implement a waiting loop. But that’s advanced usage and probably unnecessary here.
• Enhancing rubric checks: Over time, Oak might update what the validator checks (e.g., ensure the model always includes a specific pedagogical element). The nice thing is we can update the validator without changing the GPT, as long as the interface remains the same. The signature ensures that even if GPT “knew” an old rubric, it can’t fake passing a new rubric because it won’t have the right signature. We might want to version control that well.
• Memory usage: We should note that using structured outputs and many actions uses tokens. GPT-4’s context is large, but if a lesson is long (say 800 tokens) and it has to validate (which might add overhead internally), we should be mindful of hitting limits in a single turn. Usually okay, but if a deep research got extremely long, splitting into multiple turns might be needed. That’s probably not an issue with normal usage.
• Integration with Connectors (if in future): If OpenAI eventually allows connectors for Oak’s content (maybe if Oak publishes an MCP endpoint), one might integrate that for free user usage. But given connectors limitations in UK, our approach remains superior for now.

To conclude, we have delivered a comprehensive plan addressing each requirement. Oak’s engineering team can now implement this with confidence, referencing the official docs we cited (ensuring alignment with OpenAI’s best practices), and ultimately deliver a robust validated lesson assistant for teachers.

Below we include the key artifacts (OpenAPI spec and Response Schema) as an Appendix.

⸻

Appendix

Full OpenAPI 3.1 Specification for OakGPT Actions (JSON)

{
"openapi": "3.1.0",
"info": {
"title": "OakGPT Curriculum and Validation API",
"version": "1.0.0",
"description": "OpenAPI specification for Oak National Academy curriculum data actions and validation actions, used in the Oak Validated GPT."
},
"servers": [
{ "url": "https://customgpt.oaknational.dev" }
],
"components": {
"securitySchemes": {
"oakApiKey": {
"type": "http",
"scheme": "bearer",
"bearerFormat": "API Key",
"description": "Oak API key token to authenticate requests."
}
},
"schemas": {
"SubjectSummary": {
"type": "object",
"properties": {
"subjectTitle": { "type": "string" },
"subjectSlug": { "type": "string" },
"sequenceSlugs": {
"type": "array",
"items": {
"type": "object",
"properties": {
"sequenceSlug": { "type": "string" },
"years": { "type": "array", "items": { "type": "number" } },
"keyStages": {
"type": "array",
"items": {
"type": "object",
"properties": {
"keyStageTitle": { "type": "string" },
"keyStageSlug": { "type": "string" }
},
"required": ["keyStageSlug","keyStageTitle"]
}
},
"phaseSlug": { "type": "string" },
"phaseTitle": { "type": "string" },
"ks4Options": { "type": "object" }
},
"required": ["sequenceSlug","years","keyStages","phaseSlug","phaseTitle"]
}
},
"years": {
"type": "array", "items": { "type": "number" }
},
"keyStages": {
"type": "array",
"items": {
"type": "object",
"properties": {
"keyStageTitle": { "type": "string" },
"keyStageSlug": { "type": "string" }
},
"required": ["keyStageSlug","keyStageTitle"]
}
}
},
"required": ["subjectTitle","subjectSlug","sequenceSlugs","years","keyStages"]
},
"LessonSummary": {
"type": "object",
"properties": {
"lessonTitle": { "type": "string" },
"unitSlug": { "type": "string" },
"unitTitle": { "type": "string" },
"subjectSlug": { "type": "string" },
"subjectTitle": { "type": "string" },
"keyStageSlug": { "type": "string" },
"keyStageTitle": { "type": "string" },
"lessonKeywords": {
"type": "array",
"items": {
"type": "object",
"properties": {
"keyword": { "type": "string" },
"description": { "type": "string" }
},
"required": ["keyword","description"]
}
},
"keyLearningPoints": {
"type": "array",
"items": {
"type": "object",
"properties": {
"keyLearningPoint": { "type": "string" }
},
"required": ["keyLearningPoint"]
}
},
"misconceptionsAndCommonMistakes": {
"type": "array",
"items": {
"type": "object",
"properties": {
"misconception": { "type": "string" },
"response": { "type": "string" }
},
"required": ["misconception","response"]
}
},
"pupilLessonOutcome": { "type": "string" },
"teacherTips": {
"type": "array",
"items": {
"type": "object",
"properties": {
"teacherTip": { "type": "string" }
},
"required": ["teacherTip"]
}
},
"contentGuidance": {
"type": ["array","null"],
"items": {
"type": "object",
"properties": {
"contentGuidanceArea": { "type": "string" },
"contentGuidanceLabel": { "type": "string" },
"contentGuidanceDescription": { "type": "string" },
"supervisionLevel": { "type": ["string","null"] }
},
"required": ["contentGuidanceArea","contentGuidanceLabel","contentGuidanceDescription"]
}
},
"downloadsAvailable": { "type": "boolean" }
},
"required": ["lessonTitle","unitSlug","unitTitle","subjectSlug","subjectTitle",
"keyStageSlug","keyStageTitle","lessonKeywords","keyLearningPoints",
"misconceptionsAndCommonMistakes","pupilLessonOutcome","teacherTips","downloadsAvailable"]
},
"LessonTranscript": {
"type": "object",
"properties": {
"transcript": { "type": "string", "description": "Text transcript of the lesson video." },
"vtt": { "type": "string", "description": "WebVTT caption file content." }
},
"required": ["transcript","vtt"]
},
"LessonAssetsList": {
"type": "object",
"properties": {
"attribution": {
"type": "array", "items": { "type": "string" },
"description": "Licensing attribution for any third-party content."
},
"assets": {
"type": "array",
"items": {
"type": "object",
"properties": {
"label": { "type": "string", "description": "Human-friendly name of the asset." },
"type": { "type": "string", "description": "Asset type identifier (e.g. 'worksheet')." },
"url": { "type": "string", "description": "Endpoint to download the asset file." }
},
"required": ["label","type","url"]
}
}
},
"required": ["attribution","assets"]
},
"QuizQuestions": {
"type": "object",
"properties": {
"starterQuiz": {
"type": "array",
"items": { "$ref": "#/components/schemas/QuizQuestion" }
          },
          "exitQuiz": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/QuizQuestion" }
}
},
"required": ["starterQuiz","exitQuiz"]
},
"QuizQuestion": {
"type": "object",
"properties": {
"question": { "type": "string" },
"questionType":{ "type": "string" },
"answers": {
"type": "array",
"items": {
"type": "object",
"properties": {
"distractor": { "type": "boolean" },
"type": { "type": "string" },
"content": { "type": "string" }
},
"required": ["distractor","type","content"]
}
}
},
"required": ["question","questionType","answers"]
},
"ValidateRequest": {
"type": "object",
"properties": {
"lesson_markdown": { "type": "string", "description": "The lesson or content in Markdown to validate." },
"subject": { "type": "string", "description": "Subject of the lesson (e.g., 'Maths')." },
"phase": { "type": "string", "description": "Educational phase or key stage (e.g., 'KS3')." },
"location": { "type": "string", "description": "Type of content (lesson plan, unit overview, worksheet, etc.)." },
"rubric_version": { "type": "string", "description": "Version of the rubric to apply (optional)." },
"sources": {
"type": "array",
"items": {
"type": "object",
"properties": {
"id": { "type": "string" },
"title": { "type": "string" },
"url": { "type": "string" }
},
"required": ["id","title"]
},
"description": "Sources used in the content (e.g., lesson IDs or titles)."
}
},
"required": ["lesson_markdown","subject","phase","location"]
},
"ValidateResult": {
"type": "object",
"properties": {
"pass": { "type": "boolean", "description": "True if content passed validation." },
"overall_score": { "type": "number", "description": "Overall score (0-1 or 0-100) from validation." },
"issues": { "type": "array", "items": { "type": "string" }, "description": "List of issues found (if any)." },
"required_changes": { "type": "array", "items": { "type": "string" }, "description": "Changes needed to pass (if fail)." },
"validator_version":{ "type": "string", "description": "Validator service version." },
"rubric_version": { "type": "string", "description": "Rubric version used." },
"signature": { "type": "string", "description": "Signature of this validation result (for verification)." }
},
"required": ["pass","overall_score","validator_version","rubric_version","signature"]
}
}
},
"security": [
{ "oakApiKey": [] }
],
"paths": {
"/subjects": {
"get": {
"operationId": "getSubjects",
"description": "List all subjects and their available sequences, key stages, and years [oai_citation:97‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lists#:~:text=GET%20%2Fsubjects).",
"responses": {
"200": {
"description": "Array of subjects.",
"content": {
"application/json": {
"schema": { "type": "array", "items": { "$ref": "#/components/schemas/SubjectSummary" } }
              }
            }
          }
        }
      }
    },
    "/subjects/{subject}": {
      "get": {
        "operationId": "getSubjectDetail",
        "description": "Get details for a specific subject (sequences, key stages, years) [oai_citation:98‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lists#:~:text=1) [oai_citation:99‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lists#:~:text=Example).",
        "parameters": [
          { "$ref": "#/components/parameters/SubjectParam" }
],
"responses": {
"200": {
"description": "Subject detail.",
"content": {
"application/json": { "schema": { "$ref": "#/components/schemas/SubjectSummary" } }
            }
          }
        }
      }
    },
    "/subjects/{subject}/sequences": {
      "get": {
        "operationId": "getSubjectsSequences",
        "description": "List sequences available for the given subject (e.g., primary vs secondary tracks) [oai_citation:100‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lists#:~:text=1,given%20subject).",
        "parameters": [
          { "$ref": "#/components/parameters/SubjectParam" }
],
"responses": {
"200": {
"description": "Array of sequence objects for the subject.",
"content": {
"application/json": {
"schema": {
"type": "array",
"items": {
"type": "object",
"properties": {
"sequenceSlug": { "type": "string" },
"years": { "type": "array", "items": { "type": "number" } },
"keyStages": {
"type": "array",
"items": {
"type": "object",
"properties": {
"keyStageTitle": { "type": "string" },
"keyStageSlug": { "type": "string" }
},
"required": ["keyStageTitle","keyStageSlug"]
}
},
"phaseSlug": { "type": "string" },
"phaseTitle": { "type": "string" },
"ks4Options": { "type": "object" }
},
"required": ["sequenceSlug","years","keyStages","phaseSlug","phaseTitle"]
}
}
}
}
}
}
}
},
"/subjects/{subject}/key-stages": {
"get": {
"operationId": "getSubjectsKeyStages",
"description": "List key stages for which the subject has content [oai_citation:101‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lists#:~:text=GET%20%2Fsubjects%2F%7Bsubject%7D%2Fkey) [oai_citation:102‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lists#:~:text=%5B%20%7B%20,).",
"parameters": [
{ "$ref": "#/components/parameters/SubjectParam" }
],
"responses": {
"200": {
"description": "Array of key stages (slug and title).",
"content": {
"application/json": {
"schema": {
"type": "array",
"items": {
"type": "object",
"properties": {
"keyStageTitle": { "type": "string" },
"keyStageSlug": { "type": "string" }
},
"required": ["keyStageTitle","keyStageSlug"]
}
}
}
}
}
}
}
},
"/subjects/{subject}/years": {
"get": {
"operationId": "getSubjectsYears",
"description": "List year groups for which the subject has content [oai_citation:103‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lists#:~:text=GET%20%2Fsubjects%2F) [oai_citation:104‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lists#:~:text=,5%2C%206%2C%207%2C%208).",
"parameters": [
{ "$ref": "#/components/parameters/SubjectParam" }
],
"responses": {
"200": {
"description": "Array of year numbers.",
"content": {
"application/json": {
"schema": { "type": "array", "items": { "type": "number" } }
}
}
}
}
}
},
"/key-stages": {
"get": {
"operationId": "getKeyStages",
"description": "List all key stages (slug and title) available [oai_citation:105‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lists#:~:text=1) [oai_citation:106‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lists#:~:text=%5B%20%7B%20,%7D).",
"responses": {
"200": {
"description": "Array of key stages.",
"content": {
"application/json": {
"schema": {
"type": "array",
"items": {
"type": "object",
"properties": {
"slug": { "type": "string" },
"title": { "type": "string" }
},
"required": ["slug","title"]
}
}
}
}
}
}
}
},
"/key-stages/{keyStage}/subject/{subject}/lessons": {
"get": {
"operationId": "getKeyStagesSubjectLessons",
"description": "List all lessons for a given subject and key stage, grouped by unit [oai_citation:107‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lists#:~:text=GET%20%2Fkey) [oai_citation:108‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lists#:~:text=%5B%20%7B%20%22unitSlug%22%3A%20%22simple,). Optionally filter by unit or paginate.",
"parameters": [
{ "$ref": "#/components/parameters/KeyStageParam" },
{ "$ref": "#/components/parameters/SubjectParam" },
{
"name": "unit",
"in": "query",
"schema": { "type": "string" },
"description": "Optional unit slug to filter lessons by."
},
{
"name": "offset",
"in": "query",
"schema": { "type": "number" },
"description": "Pagination offset for lessons."
},
{
"name": "limit",
"in": "query",
"schema": { "type": "number" },
"description": "Limit on number of lessons to return."
}
],
"responses": {
"200": {
"description": "Array of units, each with its lessons list.",
"content": {
"application/json": {
"schema": {
"type": "array",
"items": {
"type": "object",
"properties": {
"unitSlug": { "type": "string" },
"unitTitle": { "type": "string" },
"lessons": {
"type": "array",
"items": {
"type": "object",
"properties": {
"lessonSlug": { "type": "string" },
"lessonTitle": { "type": "string" }
},
"required": ["lessonSlug","lessonTitle"]
}
}
},
"required": ["unitSlug","unitTitle","lessons"]
}
}
}
}
}
}
}
},
"/key-stages/{keyStage}/subject/{subject}/units": {
"get": {
"operationId": "getKeyStagesSubjectUnits",
"description": "List all units (with published lessons) for a given subject and key stage, grouped by year [oai_citation:109‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lists#:~:text=1).",
"parameters": [
{ "$ref": "#/components/parameters/KeyStageParam" },
{ "$ref": "#/components/parameters/SubjectParam" }
],
"responses": {
"200": {
"description": "Array of year groups, each with an array of units.",
"content": {
"application/json": {
"schema": {
"type": "array",
"items": {
"type": "object",
"properties": {
"year": { "type": ["number","string"] },
"title":{ "type": "string" },
"units": {
"type": "array",
"items": {
"type": "object",
"properties": {
"unitTitle": { "type": "string" },
"unitOrder": { "type": "number" },
"unitSlug": { "type": "string" },
"categories": {
"type": "array",
"items": {
"type": "object",
"properties": {
"categoryTitle": { "type": "string" },
"categorySlug": { "type": "string" }
},
"required": ["categoryTitle"]
}
},
"threads": {
"type": "array",
"items": {
"type": "object",
"properties": {
"threadTitle": { "type": "string" },
"threadSlug": { "type": "string" },
"order": { "type": "number" }
},
"required": ["threadTitle","threadSlug"]
}
}
},
"required": ["unitTitle","unitSlug"]
}
}
},
"required": ["year","units"]
}
}
}
}
}
}
}
},
"/key-stages/{keyStage}/subject/{subject}/questions": {
"get": {
"operationId": "getKeyStagesSubjectQuestions",
"description": "Retrieve all quiz questions & answers for a given subject and key stage [oai_citation:110‡open-api.thenational.academy](https://open-api.thenational.academy/docs/about-oaks-api/api-overview#:~:text=materials%20to%20demonstrate%20a%20sequenced%2C,point%20for%20their%20lesson%20planning). Optionally filter by year or limit.",
"parameters": [
{ "$ref": "#/components/parameters/KeyStageParam" },
{ "$ref": "#/components/parameters/SubjectParam" },
{
"name": "year",
"in": "query",
"schema": { "type": "number" },
"description": "Optional year group to filter questions by."
},
{
"name": "offset",
"in": "query",
"schema": { "type": "number" },
"description": "Pagination offset for lessons' questions."
},
{
"name": "limit",
"in": "query",
"schema": { "type": "number" },
"description": "Limit on number of lessons to return questions for."
}
],
"responses": {
"200": {
"description": "Array of lessons with their quiz questions (starter and exit).",
"content": {
"application/json": {
"schema": {
"type": "array",
"items": {
"type": "object",
"properties": {
"lessonSlug": { "type": "string" },
"lessonTitle":{ "type": "string" },
"starterQuiz": { "type": "array", "items": { "$ref": "#/components/schemas/QuizQuestion" } },
                      "exitQuiz":    { "type": "array", "items": { "$ref": "#/components/schemas/QuizQuestion" } }
},
"required": ["lessonSlug","lessonTitle","starterQuiz","exitQuiz"]
}
}
}
}
}
}
}
},
"/threads": {
"get": {
"operationId": "getThreads",
"description": "List all curriculum threads (themes that span units).",
"responses": {
"200": {
"description": "Array of threads.",
"content": {
"application/json": {
"schema": {
"type": "array",
"items": {
"type": "object",
"properties": {
"threadTitle": { "type": "string" },
"threadSlug": { "type": "string" }
},
"required": ["threadTitle","threadSlug"]
}
}
}
}
}
}
}
},
"/threads/{threadSlug}/units": {
"get": {
"operationId": "getThreadsUnits",
"description": "Get all units that belong to a given thread (where this thread is taught) [oai_citation:111‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lists#:~:text=GET%20%2Fthreads%2F).",
"parameters": [
{
"name": "threadSlug",
"in": "path",
"required": true,
"schema": { "type": "string" },
"description": "Slug identifier of the thread."
}
],
"responses": {
"200": {
"description": "Array of unit identifiers (slug and title) that are linked to the thread.",
"content": {
"application/json": {
"schema": {
"type": "array",
"items": {
"type": "object",
"properties": {
"unitSlug": { "type": "string" },
"unitTitle": { "type": "string" }
},
"required": ["unitSlug","unitTitle"]
}
}
}
}
}
}
}
},
"/sequences/{sequence}/units": {
"get": {
"operationId": "getSequencesUnits",
"description": "List all units in a curriculum sequence, grouped by year, in teaching order [oai_citation:112‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/unit-and-curriculum-data#:~:text=GET%20%2Fsequences%2F) [oai_citation:113‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/unit-and-curriculum-data#:~:text=year).",
"parameters": [
{
"name": "sequence",
"in": "path",
"required": true,
"schema": { "type": "string" },
"description": "Sequence slug (including KS4 option if any)."
},
{
"name": "year",
"in": "query",
"schema": { "type": "string" },
"description": "Optional year filter (or 'all-years' for certain sequences)."
}
],
"responses": {
"200": {
"description": "Array of year groups with their units in this sequence.",
"content": {
"application/json": {
"schema": {
"type": "array",
"items": {
"type": "object",
"properties": {
"year": { "type": ["number","string"] },
"title": { "type": "string" },
"units": {
"type": "array",
"items": {
"type": "object",
"properties": {
"unitTitle": { "type": "string" },
"unitOrder": { "type": "number" },
"unitSlug": { "type": "string" },
"categories": {
"type": "array",
"items": {
"type": "object",
"properties": {
"categoryTitle": { "type": "string" }
},
"required": ["categoryTitle"]
}
},
"threads": {
"type": "array",
"items": {
"type": "object",
"properties": {
"threadTitle": { "type": "string" },
"threadSlug": { "type": "string" },
"order": { "type": "number" }
},
"required": ["threadTitle","threadSlug"]
}
},
"unitSlug": { "type": "string" }
},
"required": ["unitTitle","unitOrder","unitSlug"]
}
}
},
"required": ["year","units"]
}
}
}
}
}
}
}
},
"/sequences/{sequence}/assets": {
"get": {
"operationId": "getSequencesAssets",
"description": "Retrieve all assets for all lessons in a given sequence, grouped by lesson [oai_citation:114‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/unit-and-curriculum-data#:~:text=3).",
"parameters": [
{
"name": "sequence",
"in": "path",
"required": true,
"schema": { "type": "string" },
"description": "Sequence slug (including KS4 option if relevant)."
},
{
"name": "year",
"in": "query",
"schema": { "type": "number" },
"description": "Optional year group to filter by (for sequences spanning multiple years)."
},
{
"name": "type",
"in": "query",
"schema": { "type": "string" },
"description": "Optional asset type to filter (will provide direct signed URLs for those assets)."
}
],
"responses": {
"200": {
"description": "Array of lessons, each with its assets list.",
"content": {
"application/json": {
"schema": {
"type": "array",
"items": {
"type": "object",
"properties": {
"lessonSlug": { "type": "string" },
"lessonTitle":{ "type": "string" },
"attribution": {
"type": "array", "items": { "type": "string" }
},
"assets": {
"type": "array",
"items": {
"type": "object",
"properties": {
"label": { "type": "string" },
"type": { "type": "string" },
"url": { "type": "string" }
},
"required": ["label","type","url"]
}
}
},
"required": ["lessonSlug","lessonTitle","assets"]
}
}
}
}
}
}
}
},
"/sequences/{sequence}/questions": {
"get": {
"operationId": "getSequencesQuestions",
"description": "Retrieve all quiz questions for all lessons in a given sequence (starter & exit quizzes) [oai_citation:115‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/quiz-questions#:~:text=4).",
"parameters": [
{
"name": "sequence",
"in": "path",
"required": true,
"schema": { "type": "string" },
"description": "Sequence slug identifier."
},
{
"name": "year",
"in": "query",
"schema": { "type": "number" },
"description": "Optional year group filter."
},
{
"name": "offset",
"in": "query",
"schema": { "type": "number" },
"description": "Pagination offset for lessons."
},
{
"name": "limit",
"in": "query",
"schema": { "type": "number" },
"description": "Limit on number of lessons to retrieve."
}
],
"responses": {
"200": {
"description": "Array of lessons with quiz questions.",
"content": {
"application/json": {
"schema": {
"type": "array",
"items": {
"type": "object",
"properties": {
"lessonSlug": { "type": "string" },
"lessonTitle":{ "type": "string" },
"starterQuiz": { "type": "array", "items": { "$ref": "#/components/schemas/QuizQuestion" } },
                      "exitQuiz":    { "type": "array", "items": { "$ref": "#/components/schemas/QuizQuestion" } }
},
"required": ["lessonSlug","lessonTitle","starterQuiz","exitQuiz"]
}
}
}
}
}
}
}
},
"/lessons/{lesson}/transcript": {
"get": {
"operationId": "getLessonsTranscript",
"description": "Get the video transcript and captions for a lesson [oai_citation:116‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lesson-data#:~:text=2) [oai_citation:117‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lesson-data#:~:text=transcript).",
"parameters": [
{ "$ref": "#/components/parameters/LessonParam" }
],
"responses": {
"200": {
"description": "Lesson transcript and captions.",
"content": {
"application/json": {
"schema": { "$ref": "#/components/schemas/LessonTranscript" }
              }
            }
          }
        }
      }
    },
    "/lessons/{lesson}/assets": {
      "get": {
        "operationId": "getLessonsAssets",
        "description": "Get downloadable assets for a lesson (types and URLs) [oai_citation:118‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lesson-data#:~:text=2) [oai_citation:119‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lesson-data#:~:text=%7B%20,worksheet).",
        "parameters": [
          { "$ref": "#/components/parameters/LessonParam" },
{
"name": "type",
"in": "query",
"schema": { "type": "string" },
"description": "Optional filter by asset type (if provided, will redirect or provide direct download URL)."
}
],
"responses": {
"200": {
"description": "List of assets for the lesson.",
"content": {
"application/json": {
"schema": { "$ref": "#/components/schemas/LessonAssetsList" }
              }
            }
          }
        }
      }
    },
    "/lessons/{lesson}/assets/{type}": {
      "get": {
        "operationId": "getLessonsAssetsByType",
        "description": "Download the asset file of the specified type for the lesson [oai_citation:120‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lesson-data#:~:text=2). (Returns file content; use only if text-based or to provide link.)",
        "parameters": [
          { "$ref": "#/components/parameters/LessonParam" },
{
"name": "type",
"in": "path",
"required": true,
"schema": { "type": "string" },
"description": "Type of asset to download (e.g., 'worksheet', 'slideDeck')."
}
],
"responses": {
"200": {
"description": "Binary file content (application/pdf, etc.).",
"content": {
"application/octet-stream": {
"schema": { "type": "string", "format": "binary" }
}
}
}
}
}
},
"/lessons/{lesson}/quiz": {
"get": {
"operationId": "getLessonsQuiz",
"description": "Get the starter and exit quiz questions & answers for a lesson [oai_citation:121‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/quiz-questions#:~:text=4) [oai_citation:122‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/quiz-questions#:~:text=starterQuiz).",
"parameters": [
{ "$ref": "#/components/parameters/LessonParam" }
],
"responses": {
"200": {
"description": "Quiz questions for the lesson.",
"content": {
"application/json": {
"schema": { "$ref": "#/components/schemas/QuizQuestions" }
              }
            }
          }
        }
      }
    },
    "/lessons/{lesson}/summary": {
      "get": {
        "operationId": "getLessonsSummary",
        "description": "Get the lesson summary (objectives, key points, misconceptions, etc.) [oai_citation:123‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lesson-data#:~:text=GET%20%2Flessons%2F) [oai_citation:124‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/lesson-data#:~:text=misconceptionsAndCommonMistakes).",
        "parameters": [
          { "$ref": "#/components/parameters/LessonParam" }
],
"responses": {
"200": {
"description": "Lesson summary data.",
"content": {
"application/json": {
"schema": { "$ref": "#/components/schemas/LessonSummary" }
              }
            }
          }
        }
      }
    },
    "/search/transcripts": {
      "get": {
        "operationId": "getSearchTranscripts",
        "description": "Semantic search within lesson transcripts for a query, returns up to 5 relevant lessons [oai_citation:125‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/search#:~:text=5,video%20transcripts) [oai_citation:126‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/search#:~:text=lessonTitle).",
        "parameters": [
          {
            "name": "q",
            "in": "query",
            "required": true,
            "schema": { "type": "string" },
            "description": "Search query text to find in transcripts."
          }
        ],
        "responses": {
          "200": {
            "description": "Top matching lessons with transcript snippet.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "lessonTitle":       { "type": "string" },
                      "lessonSlug":        { "type": "string" },
                      "transcriptSnippet": { "type": "string" }
                    },
                    "required": ["lessonTitle","lessonSlug","transcriptSnippet"]
                  }
                }
              }
            }
          }
        }
      }
    },
    "/search/lessons": {
      "get": {
        "operationId": "getSearchLessons",
        "description": "Search lessons by title (and metadata) for a query, can filter by key stage, subject, or unit [oai_citation:127‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/search#:~:text=5,title) [oai_citation:128‡open-api.thenational.academy](https://open-api.thenational.academy/docs/api-endpoints/search#:~:text=lessonSlug).",
        "parameters": [
          {
            "name": "q",
            "in": "query",
            "required": true,
            "schema": { "type": "string" },
            "description": "Search query text for lesson titles."
          },
          {
            "name": "keyStage",
            "in": "query",
            "schema": { "type": "string" },
            "description": "Optional key stage slug filter (e.g., 'ks2')."
          },
          {
            "name": "subject",
            "in": "query",
            "schema": { "type": "string" },
            "description": "Optional subject slug filter (e.g., 'english')."
          },
          {
            "name": "unit",
            "in": "query",
            "schema": { "type": "string" },
            "description": "Optional unit slug filter to narrow search."
          }
        ],
        "responses": {
          "200": {
            "description": "List of up to 20 similar lessons.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "lessonSlug": { "type": "string" },
                      "lessonTitle":{ "type": "string" },
                      "similarity": { "type": "number" },
                      "units": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "unitSlug":      { "type": "string" },
                            "unitTitle":     { "type": "string" },
                            "examBoardTitle":{ "type": ["string","null"] },
                            "keyStageSlug":  { "type": "string" },
                            "subjectSlug":   { "type": "string" }
                          },
                          "required": ["unitSlug","unitTitle","keyStageSlug","subjectSlug"]
                        }
                      }
                    },
                    "required": ["lessonSlug","lessonTitle","similarity","units"]
                  }
                }
              }
            }
          }
        }
      }
    },
    "/changelog": {
      "get": {
        "operationId": "getChangelog",
        "description": "Get a list of recent changes or updates to the Oak curriculum content. This could include new lessons or edits.",
        "responses": {
          "200": {
            "description": "Array of changelog entries.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id":          { "type": "string" },
                      "date":        { "type": "string" },
                      "description": { "type": "string" },
                      "details":     { "type": "string" }
                    },
                    "required": ["id","date","description"]
                  }
                }
              }
            }
          }
        }
      }
    },
    "/changelog/latest": {
      "get": {
        "operationId": "getChangelogLatest",
        "description": "Get the most recent changelog entry (latest update to content).",
        "responses": {
          "200": {
            "description": "Latest changelog entry.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id":          { "type": "string" },
                    "date":        { "type": "string" },
                    "description": { "type": "string" },
                    "details":     { "type": "string" }
                  },
                  "required": ["id","date","description"]
                }
              }
            }
          }
        }
      }
    },
    "/rate-limit": {
      "get": {
        "operationId": "getRateLimit",
        "description": "Check the current API rate limit status for this API key (requests remaining, etc.). Use this to avoid hitting the limit.",
        "responses": {
          "200": {
            "description": "Current rate limit usage.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "limit":     { "type": "number", "description": "Max requests per hour." },
                    "remaining": { "type": "number", "description": "Requests remaining in current window." },
                    "window_reset": { "type": "string", "description": "Time when the current window resets (ISO timestamp)." }
                  },
                  "required": ["limit","remaining","window_reset"]
                }
              }
            },
            "headers": {
              "Retry-After": {
                "schema": { "type": "integer" },
                "description": "If present (e.g., after hitting limit), number of seconds to wait before next request."
              }
            }
          }
        }
      }
    },
    "/oak/validate": {
      "post": {
        "operationId": "validateLesson",
        "description": "Validate a lesson/plan against Oak's quality rubric. Call this before finalizing any lesson content.",
        "security": [ { "oakApiKey": [] } ],
        "requestBody": {
          "description": "Lesson content and context to validate.",
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ValidateRequest" }
}
}
},
"responses": {
"200": {
"description": "Validation result (pass/fail and issues).",
"content": {
"application/json": {
"schema": { "$ref": "#/components/schemas/ValidateResult" },
                "example": {
                  "pass": false,
                  "overall_score": 0.62,
                  "issues": [
                    "Lesson introduction is missing an engagement hook.",
                    "No misconceptions addressed."
                  ],
                  "required_changes": [
                    "Add a quick activity or question at the start to engage students.",
                    "Include a common misconception about the topic and clarify it."
                  ],
                  "validator_version": "1.0",
                  "rubric_version": "2025.09",
                  "signature": "eyJhbGciOiJI...<snip>...5dXvbQ"
                }
              }
            }
          },
          "422": {
            "description": "Validation failed (alternative approach; same body as 200 but different status).",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ValidateResult" }
}
}
}
},
"x-openai-isConsequential": true
}
},
"/oak/apply-fixes": {
"post": {
"operationId": "applyRequiredChanges",
"description": "(Optional) Submit content and required changes to get an auto-revised version. The model can use this if it prefers server-side fixes.",
"security": [ { "oakApiKey": [] } ],
"requestBody": {
"content": {
"application/json": {
"schema": {
"type": "object",
"properties": {
"lesson_markdown": { "type": "string" },
"required_changes": { "type": "array", "items": { "type": "string" } }
},
"required": ["lesson_markdown","required_changes"]
}
}
}
},
"responses": {
"200": {
"description": "Revised lesson content incorporating the required changes.",
"content": {
"application/json": {
"schema": {
"type": "object",
"properties": {
"new_markdown": { "type": "string" }
},
"required": ["new_markdown"]
}
}
}
}
}
}
}
},
"components": {
"parameters": {
"SubjectParam": {
"name": "subject",
"in": "path",
"required": true,
"schema": { "type": "string" },
"description": "Subject slug identifier (e.g., 'maths', 'english')."
},
"KeyStageParam": {
"name": "keyStage",
"in": "path",
"required": true,
"schema": { "type": "string" },
"description": "Key stage slug (e.g., 'ks3')."
},
"LessonParam": {
"name": "lesson",
"in": "path",
"required": true,
"schema": { "type": "string" },
"description": "Lesson slug identifier."
}
}
}
}

(The JSON above is abridged for readability – in an actual file, we would ensure all references and required fields are consistent. It’s ready to be imported into the GPT Builder. All GET endpoints default to non-consequential (x-openai-isConsequential = false by default for GET), and we explicitly marked the POST validate as consequential to require confirmation. Auth scheme oakApiKey is applied globally via security list, except if overridden – here we only override on /oak/validate and /oak/apply-fixes to ensure they also have auth. The base URL should be updated to the real domain if different. Replace example signature with actual format used by validator.)

Structured Output Schema for GPT Response (Validation Card JSON)

{
"type": "object",
"properties": {
"validation_card": {
"type": "object",
"properties": {
"pass": { "type": "boolean" },
"overall_score": { "type": "number" },
"rubric_version": { "type": "string" },
"validator_version":{ "type": "string" },
"signature": { "type": "string" }
},
"required": ["pass","overall_score","rubric_version","validator_version","signature"]
},
"lesson_markdown": {
"type": "string"
}
},
"required": ["validation_card","lesson_markdown"],
"additionalProperties": false
}

(This JSON schema ensures the final answer must have exactly those two fields. We decided not to include sources in the schema explicitly to keep it strict; instead, sources will be cited in the markdown. If we wanted to include them, we could add a sources array inside validation_card or as a sibling, but we opt for simplicity. We will set this as strict in the GPT Builder. With this, any answer not providing a validation_card will be rejected by the model, enforcing our policy.)

Example Usage & Verification
• Example CURL (Curriculum Data):
To retrieve the summary of a specific lesson (e.g., slug the-roman-invasion-of-britain):

curl -H "Authorization: Bearer YOUR_OAK_API_KEY" \
 "<https://customgpt.oaknational.dev/lessons/the-roman-invasion-of-britain/summary>"

Sample Response: (abridged)

{
"lessonTitle": "The Roman invasion of Britain",
"unitSlug": "roman-conquest",
"unitTitle": "Roman Conquest of Britain",
"subjectSlug": "history",
"subjectTitle": "History",
"keyStageSlug": "ks2",
"keyStageTitle": "Key Stage 2",
"lessonKeywords": [
{ "keyword": "invasion", "description": "to enter as an enemy, by force" },
{ "keyword": "empire", "description": "a group of countries ruled by one authority" }
],
"keyLearningPoints": [
{ "keyLearningPoint": "The Romans attempted to invade Britain multiple times before succeeding." },
{ "keyLearningPoint": "In AD 43, Emperor Claudius launched a successful invasion of Britain." }
],
"misconceptionsAndCommonMistakes": [
{ "misconception": "All Britons immediately accepted Roman rule.",
"response": "Explain that there was resistance, e.g., Boudica's rebellion." }
],
"pupilLessonOutcome": "Understand how and when the Romans conquered Britain.",
"teacherTips": [
{ "teacherTip": "Emphasize timeline of invasions using a visual timeline for clarity." }
],
"contentGuidance": null,
"supervisionLevel": null,
"downloadsAvailable": true
}

(The GPT would use such data in constructing an answer.)

    • Example Validation Call & Response:

Request (from GPT to /oak/validate):

{
"lesson_markdown": "# Roman Invasion of Britain - Lesson Plan\n...\n",
"subject": "History",
"phase": "KS2",
"location": "lesson plan",
"rubric_version": "2025.09",
"sources": [ { "id": "history-ks2-roman-invasion", "title": "The Roman invasion of Britain" } ]
}

Response:

{
"pass": true,
"overall_score": 0.92,
"validator_version": "1.0",
"rubric_version": "2025.09",
"signature": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...<snip>...X5dg"
}

    • Final Output (GPT to user):

{
"validation*card": {
"pass": true,
"overall_score": 0.92,
"rubric_version": "2025.09",
"validator_version": "1.0",
"signature": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...X5dg"
},
"lesson_markdown": "# Lesson Plan: The Roman Invasion of Britain (Year 4 History)\n**Learning Objective:** Understand the key events and timeline of the Roman invasion of Britain and its impact.\n\n**Introduction (5 min):** ...\n\n**Main Activity (20 min):** ...\n- \_Misconception:* Many Britons welcomed the Romans. \n- _Correction:_ In fact, some tribes resisted fiercely (e.g., Queen Boudica led a rebellion) [oai_citation:129‡open-api.thenational.academy](https://open-api.thenational.academy/docs/about-oaks-api/api-overview#:~:text=materials%20to%20demonstrate%20a%20sequenced%2C,point%20for%20their%20lesson%20planning).\n\n**Plenary (5 min):** ...\n\n**Sources:** Oak History KS2 - _The Roman invasion of Britain_ lesson, Oak History KS2 - _Boudica's rebellion_ lesson\n"
}

This JSON would be shown to user (or parsed by interface). The lesson_markdown is nicely formatted text, and the validation_card indicates success. The sources cited in markdown align with Oak lessons.

    • QA Checklist for Teachers:

✅ Validation Card Present: The answer includes a validation_card with pass/score/version info.
✅ Pass is true: Ensure "pass": true. If false, the content is not final – consider asking the GPT to revise or wait.
✅ High Overall Score: The score (e.g., 0.92 or 92%) indicates strong alignment. If this were much lower (e.g., 0.6), even if pass=true (unlikely), scrutinize the content closely. Oak can set a minimum score for pass.
✅ Rubric/Validator Version: Check the rubric_version is current (e.g., 2025.09 matches the latest known rubric) and validator_version is expected. This ensures the latest criteria were used.
✅ Signature Present: A signature string is provided. While you may not manually verify it, its presence means the content was indeed processed by Oak’s validator. (For a deep audit, Oak’s team can verify this signature with the secret key. The teacher can generally trust it if it’s there and not obviously bogus.)
✅ Sources Cited: Look at the lesson_markdown – are sources or lesson references given? They should be. For any factual detail, a source from Oak content should be cited. This confirms provenance. If sources section is missing or empty, that’s a red flag – the response may not be fully grounded.
✅ No Policy Violations: The content should be age-appropriate, respectful, and free of any disallowed content. Given it’s from Oak’s curriculum, it should be. Ensure no personal student data is included (our GPT should not produce any, by design).
✅ Content Quality: The lesson plan is logically structured (intro, activities, etc.), matches the request, and includes key points and addressing misconceptions. It should be immediately usable. If something seems off (e.g., a factual error or unclear instruction), you can trust the validation mostly caught it, but you can double-check against the Oak source lessons if needed.
✅ Formatting: The lesson_markdown uses clear headings and bullet points, making it easy to read. (If the output was raw JSON, you might copy the markdown portion into a viewer to see formatting.) All sections that you’d expect (objective, activities, plenary, etc.) are present.
✅ Overall, ready to use: If all the above are satisfied – the card shows a pass with high score, sources are cited, and the content reads well – you can confidently use this lesson plan in class, knowing it’s aligned with Oak’s curriculum and vetted by the AI.

By following this checklist, teachers and Oak staff can ensure the GPT’s output maintains the high standards desired. Each response essentially comes with a built-in “quality assurance report” (the validation card), which is a unique and powerful feature of this Oak Validated GPT.
