# Production and reunification preview: consistency report, 2026-11-16

## Review contract

- **Purpose.** Show what the merge of the `reunify-oce-forks` branch (oaknational#1023) changes
  for the people who use the MCP server: teachers working through an AI assistant, developers
  connecting to the server, and vendors assessing the connector or plugin for their store.
  Changes to engineering and developer experience are in scope only where they change what those
  people see.
- **Question tested.** Does every difference observed between the two live servers trace to a
  known cause: a change in the branch's source, or a difference between the two hosting
  environments? An unexplained difference fails the test.
- **Evidence standard.** Every result here was observed on the two live servers on 2026-11-16.
  Statements about cause are marked as read from source or as inference.
- **Interest.** Consistency, not correctness. Where both servers are wrong in the same way, the
  comparison passes and the fault is listed under [Production notes](#production-notes).
- **Non-goals.** This report does not test load, release tooling, the repository's non-server
  workspaces or agent tooling, and it does not authorise the merge. The merge decision belongs to
  the repository owner.
- **Suggested action.** The report labels each difference that reaches production with a
  severity and a suggested action, at the repository owner's direction.
- **A successful review** checks the method against the limits stated in
  [What this does not show](#what-this-does-not-show) and reports any difference this report
  missed or explained wrongly.

## What changes for people who use the server

Two differences reach production with the merge. Both are minor (P4), both are deliberate
changes made on the branch, and neither affects the user experience of the product. One tool's result changes: the orientation text of `oak-under-the-hood`, which a developer or vendor asking about the repository can see. No curriculum tool, curriculum result, resource or sign-in step changes. Suggested action for both: accept as deliberate
and not user-facing.

| #   | Difference                                           | Severity   | Deliberate | Affects the product's user experience | Suggested action |
| --- | ---------------------------------------------------- | ---------- | ---------- | ------------------------------------- | ---------------- |
| 1 | Orientation text from `oak-under-the-hood` | P4 (minor) | Yes | No: the changed text is visible to someone asking about the repository; no curriculum result changes | Accept |
| 2 | Unknown addresses return JSON in place of an HTML page | P4 (minor) | Yes | No: seen only by a developer requesting an address the server does not serve | Accept |

1. **The orientation text returned by `oak-under-the-hood` changes in 10 places.** This tool
   answers questions about the repository and the service, not about the curriculum. The changes
   follow the repository's rewritten README:
   - pointers into the README are updated to its new section names, and to
     `docs/engineering/setup.md` and `docs/architecture/README.md` for content that moved there;
   - where the text named the supported assistants ("ChatGPT, Claude, Copilot, Gemini"), it now
     points to Oak's page, `https://www.thenational.academy/ai-plugin`, which says which are
     available;
   - the instruction on credit no longer mentions a README credits section or contributor names;
     it points to `ATTRIBUTION.md` for citation names.
2. **A request to an address the server does not serve returns JSON, not an HTML page.** The
   status is 404 on both. A person using an assistant does not see this; a developer probing the
   server does.

Nothing else that a connected client or its user can observe was found to differ for a reason the
merge carries into production.

What stays the same, as observed:

- **What the server offers.** The same 38 tools, with the same names, descriptions, input
  schemas, read-only annotations and sign-in requirements; the same 6 resources; the same
  instructions to the assistant. A store reviewer reading the tool list sees no change.
- **What the tools return.** 60 of 62 calls return identical results, including search, lesson
  content, quizzes, transcripts, the curriculum graphs and every error tested. The two that
  differ are the orientation text above and a preview-only address in download links.
- **The interactive view.** The widget is byte-for-byte the same.
- **Downloads.** A slide deck downloaded through each server is the same file, by SHA-256 digest.
- **Which assistants it works with.** The compatibility check gives the same verdict for each of
  28 client hosts.
- **Sign-in.** The flow has the same steps and the same metadata fields. The preview signs in
  through a development identity provider, so the branch's sign-in code has not run against
  production's: see [What this does not show](#what-this-does-not-show).

## Improvements

Changes for the better that the merge brings, as measured or observed on 2026-11-16.

- **SonarCloud: the whole-project analysis of the branch's code reports 15 open issues and no
  bug, where `main`'s reports 161 open issues and 1 bug.** Three analyses, each with its scope:

  | Measure                  | `main`, whole project | The branch's code, whole project | Pull request 1023, new code |
  | ------------------------ | --------------------- | -------------------------------- | --------------------------- |
  | Analysed                 | 2026-11-09            | 2026-11-16, commit `e9abb2a83`   | commit `e9abb2a83`          |
  | Quality gate             | Failed                | Passed                           | Passed                      |
  | Bugs                     | 1                     | 0                                | 0                           |
  | Reliability rating       | C                     | A                                | A                           |
  | Vulnerabilities          | 0                     | 0                                | 0                           |
  | Security hotspots        | 0                     | 0                                | 0                           |
  | Code smells              | 160                   | 15                               | 1                           |
  | Technical debt (minutes) | 871                   | 53                               | 0                           |
  | Duplicated lines         | 0.7%                  | 0.6%                             | 0.6%                        |
  | Lines of code analysed   | 376,589               | 429,524                          | 199,618                     |

  The first and third columns are from Oak's SonarCloud project
  (`oaknational_oak-open-curriculum-ecosystem`). The middle column is the analysis of the same
  commit as the default branch of the fork's own SonarCloud project; it is the like-for-like
  comparison with `main`, because both analyse the whole project. The two projects sit in
  different SonarCloud organisations, so their settings can differ; the analysis configuration in
  the repository is the same file. A pull-request analysis judges new code only, so the third
  column does not show that older issues are gone; the middle column does that.

  The quality gate fails on `main` on one condition (maintainability of new code). Whether
  `main` passes after the merge is settled by its first analysis after the merge.

- **Unknown addresses answer in JSON.** A client that expects JSON from the server now receives
  it on a 404 (difference 2 above; production note 2).
- **The orientation text no longer carries its own list of supported assistants.** It points to
  Oak's page, so it stays true when that list changes.

## Summary of evidence

| Area                                         | Compared                           | Result                                           |
| -------------------------------------------- | ---------------------------------- | ------------------------------------------------ |
| Advertised surface                           | 38 tools, 6 resources, 0 prompts   | Identical                                        |
| Tool behaviour                               | 62 calls: all 38 tools, 7 bad calls | 60 identical; 2 different, both explained        |
| Resource contents                            | 6 resources, including the widget  | Identical                                        |
| Host compatibility (`mcpjam compat`)         | 28 client hosts                    | Identical                                        |
| Asset download | 1 signed link per server, fetched | Identical (HTTP 200, same type, 8,782,614 bytes, same SHA-256) |
| Unauthenticated endpoints and OAuth metadata | 12 paths                           | Same shape; 2 differences, both explained         |
| Response headers | Health path | 5 headers differ; cause is the hosting, not the source |

No unexplained difference was found. Every difference found, with its cause. "Source" differences
reach production with the merge; "Environment" differences belong to the preview deployment and
do not.

| #   | Difference                                                                 | Cause                                                              | Kind        |
| --- | -------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------- |
| 1   | `oak-under-the-hood` returns different orientation text                    | The branch edits the orientation skill the tool serves             | Source      |
| 2   | `download-asset` links on the preview use the per-commit deployment host   | Preview deployments resolve their own address per commit           | Environment |
| 3   | Unknown paths: JSON `{"error":"Not found"}` on the preview, HTML in production | The branch adds a JSON not-found handler                       | Source      |
| 4   | OAuth metadata names a different Clerk instance                            | The preview uses a development Clerk instance                      | Environment |
| 5   | Security headers on the health path differ                                 | The header source is unchanged; Oak's Cloudflare rewrites production's headers | Environment |
| 6   | The preview sends `x-robots-tag: noindex`                                  | Vercel adds it to preview deployments                              | Environment |

## What was compared

| Side       | Address                                                                                    | Build                                                         |
| ---------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| Production | `https://mcp.thenational.academy/mcp`                                                      | `main`, release 1.186.10 (`0d8543021`) — see the limit below |
| Preview    | `https://poc-oak-open-curriculum-mcp-git-reunify-oce-forks.vercel.thenational.academy/mcp` | `reunify-oce-forks` at `e9abb2a83`                            |

Both servers report themselves as `oak-curriculum-http` 0.1.0 on MCP protocol 2025-11-25.
Neither exposes its commit, so the production build is taken from the latest release on `main`;
that is an inference.

Both servers read the same upstream curriculum API and the same search index. Identical results
therefore show that the two builds treat the same data the same way; they say nothing about the
data.

## Method

The test compares what the source predicts with what the live servers do.

1. **Prediction from source.** Between `main` (`0d8543021`) and the branch (`e9abb2a83`), 60
   files change under the server's `src/` directory (33 excluding tests and generated files),
   covering authentication, routing, the OAuth proxy, environment handling and search wiring. The
   generated tool definitions the server registers do not change in what they advertise:
   `served-tool-table.md` changes two lines of prose. The one generated file under the server
   that changes is the orientation content (`oak-under-the-hood-content.ts`). The prediction: the
   same tools, the same results, different orientation text.
2. **Observation.** Each server was signed in to once through its own OAuth flow, then driven
   with `@mcpjam/cli` 6.3.1 using the same commands and arguments.
3. **Normalisation.** Before comparing, the two host names were masked, signed query strings
   were masked, timing fields were removed, and JSON carried inside text was parsed and
   key-sorted. Nothing else was altered.
4. **Comparison.** Byte equality of the normalised output, per call.

All tools on both servers are read-only, so the calls changed nothing.

```bash
# surface
mcpjam --no-telemetry --format json server export --url <server> --credentials-file <file>
# one tool call
mcpjam --no-telemetry --format json tools call --url <server> --credentials-file <file> \
  --tool-name <name> --tool-args '<json>'
# one resource
mcpjam --no-telemetry --format json resources read --url <server> --credentials-file <file> \
  --resource-uri <uri>
# host compatibility
mcpjam --no-telemetry --format json compat --url <server> --credentials-file <file>
```

## Results

### Advertised surface

Identical after masking the host: 38 tools with the same names, descriptions, input schemas,
annotations and security schemes; 6 resources; no prompts; the same server instructions. The normalised export of each server has the same SHA-256 digest, `a7ac28169dba…`.

### Tool behaviour

62 calls per server: at least one for each of the 38 tools, with extra calls for tools that take
different argument shapes, and 7 calls built to fail. Sizes are bytes of normalised output; each digest is the first 12 hexadecimal characters of the SHA-256 of that output. A result is identical when the two digests match.

| # | Tool | Arguments | Outcome | Bytes, production | Bytes, preview | SHA-256, production | SHA-256, preview | Result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `get-key-stages` | `{}` | ok | 879 | 879 | `eb0c01152bd9` | `eb0c01152bd9` | Identical |
| 2 | `get-subjects` | `{}` | ok | 980 | 980 | `a53ce0aea09a` | `a53ce0aea09a` | Identical |
| 3 | `get-threads` | `{}` | ok | 40,187 | 40,187 | `e3b5f2f31391` | `e3b5f2f31391` | Identical |
| 4 | `get-rate-limit` | `{}` | ok | 482 | 482 | `5bde383dda6c` | `5bde383dda6c` | Identical |
| 5 | `get-curriculum-model` | `{}` | ok | 126,095 | 126,095 | `bee9f6c7f79c` | `bee9f6c7f79c` | Identical |
| 6 | `oak-under-the-hood` | `{}` | ok | 37,102 | 37,364 | `a32627c405bc` | `ab8454000aa4` | **Different** |
| 7 | `browse-curriculum` | `{}` | ok | 740,732 | 740,732 | `093c2f801a3d` | `093c2f801a3d` | Identical |
| 8 | `browse-curriculum` | `{"subject": "maths", "keyStage": "ks2"}` | ok | 30,853 | 30,853 | `e0d44cb693c0` | `e0d44cb693c0` | Identical |
| 9 | `explore-topic` | `{"query": "volcanos"}` | ok | 49,420 | 49,420 | `397c6fef5085` | `397c6fef5085` | Identical |
| 10 | `explore-topic` | `{"query": "fractions", "subject": "maths", "keyStage": "ks2"}` | ok | 57,557 | 57,557 | `81b6a01e0aa0` | `81b6a01e0aa0` | Identical |
| 11 | `fetch` | `{"id": "lesson:add-fractions-with-the-same-denominator"}` | ok | 5,890 | 5,890 | `56b254f03aaa` | `56b254f03aaa` | Identical |
| 12 | `fetch` | `{"id": "unit:comparing-fractions"}` | ok | 6,756 | 6,756 | `e3926135872e` | `e3926135872e` | Identical |
| 13 | `fetch` | `{"id": "thread:number-fractions"}` | ok | 12,097 | 12,097 | `4d8a922037f0` | `4d8a922037f0` | Identical |
| 14 | `fetch` | `{"id": "sequence:maths-primary"}` | ok | 146,112 | 146,112 | `1f08a4b67e87` | `1f08a4b67e87` | Identical |
| 15 | `fetch` | `{"id": "subject:maths"}` | ok | 4,278 | 4,278 | `4e2a42c2ab0c` | `4e2a42c2ab0c` | Identical |
| 16 | `download-asset` | `{"lesson": "add-fractions-with-the-same-denominator", "type": "slideDeck"}` | ok | 883 | 1,107 | `93c41d950870` | `136cf67668af` | **Different** |
| 17 | `get-key-stages-subject-assets` | `{"keyStage": "ks1", "subject": "english", "unit": "word-class", "type": "slideDeck"}` | ok | 4,141 | 4,141 | `1e7c8501a55c` | `1e7c8501a55c` | Identical |
| 18 | `get-key-stages-subject-lessons` | `{"keyStage": "ks1", "subject": "english", "limit": 10}` | ok | 4,300 | 4,300 | `d33d5d02d2bf` | `d33d5d02d2bf` | Identical |
| 19 | `get-key-stages-subject-lessons` | `{"keyStage": "ks1", "subject": "english", "unit": "word-class"}` | ok | 2,554 | 2,554 | `bd7ae0ca06fb` | `bd7ae0ca06fb` | Identical |
| 20 | `get-key-stages-subject-questions` | `{"keyStage": "ks1", "subject": "art", "limit": 10}` | ok | 621 | 621 | `b6384d93ca3c` | `b6384d93ca3c` | Identical |
| 21 | `get-key-stages-subject-units` | `{"keyStage": "ks1", "subject": "art"}` | ok | 4,819 | 4,819 | `0be4bcadbe06` | `0be4bcadbe06` | Identical |
| 22 | `get-key-stages-subject-units` | `{"keyStage": "ks4", "subject": "maths", "examBoard": "aqa"}` | ok | 424 | 424 | `5d6590a303bc` | `5d6590a303bc` | Identical |
| 23 | `get-keyword-graph` | `{"subject": "maths", "keyStage": "ks2", "limit": 20}` | ok | 160,642 | 160,642 | `1da5fc547368` | `1da5fc547368` | Identical |
| 24 | `get-keywords` | `{"keyStage": "ks1", "subject": "english", "limit": 20}` | ok | 26,025 | 26,025 | `80d330ef4571` | `80d330ef4571` | Identical |
| 25 | `get-lessons-assets` | `{"lesson": "creating-a-new-word"}` | ok | 3,275 | 3,275 | `c067248558b3` | `c067248558b3` | Identical |
| 26 | `get-lessons-quiz` | `{"lesson": "imagining-you-are-the-characters-the-three-billy-goats-gruff"}` | ok | 16,371 | 16,371 | `01ef17bbd8e6` | `01ef17bbd8e6` | Identical |
| 27 | `get-lessons-summary` | `{"lesson": "using-vector-tools-to-draw-and-modify-shapes"}` | ok | 4,414 | 4,414 | `47f089bf7689` | `47f089bf7689` | Identical |
| 28 | `get-lessons-transcript` | `{"lesson": "checking-understanding-of-basic-transformations"}` | ok | 107,808 | 107,808 | `83236b21a398` | `83236b21a398` | Identical |
| 29 | `get-misconception-graph` | `{"threadSlug": "number-fractions"}` | ok | 152,710 | 152,710 | `98a19c0312f6` | `98a19c0312f6` | Identical |
| 30 | `get-misconception-graph` | `{"unitSlugs": ["comparing-fractions"]}` | ok | 12,372 | 12,372 | `b8d27193558f` | `b8d27193558f` | Identical |
| 31 | `get-misconception-graph` | `{"lessonSlugs": ["add-fractions-with-the-same-denominator"]}` | ok | 2,480 | 2,480 | `916f5684ddd3` | `916f5684ddd3` | Identical |
| 32 | `get-prior-knowledge-graph` | `{"unitSlugs": ["comparing-fractions"]}` | ok | 1,556 | 1,556 | `37b585163859` | `37b585163859` | Identical |
| 33 | `get-programmes` | `{"programme": "english-secondary-year-10-edexcel"}` | ok | 1,165 | 1,165 | `86ffcc79ea64` | `86ffcc79ea64` | Identical |
| 34 | `get-programmes-assets` | `{"programme": "computing-secondary-year-7", "limit": 20}` | ok | 28,788 | 28,788 | `3aafcd749088` | `3aafcd749088` | Identical |
| 35 | `get-programmes-questions` | `{"programme": "computing-secondary-year-7", "limit": 20}` | ok | 251,848 | 251,848 | `53682332a325` | `53682332a325` | Identical |
| 36 | `get-programmes-units` | `{"programme": "english-secondary-year-10-edexcel"}` | ok | 4,738 | 4,738 | `076364f566e2` | `076364f566e2` | Identical |
| 37 | `get-sequences` | `{"sequence": "english-secondary-aqa"}` | ok | 1,832 | 1,832 | `307611bc28f8` | `307611bc28f8` | Identical |
| 38 | `get-sequences-assets` | `{"sequence": "maths-primary", "year": "1"}` | ok | 752,001 | 752,001 | `46fd678ecea0` | `46fd678ecea0` | Identical |
| 39 | `get-sequences-questions` | `{"sequence": "maths-secondary", "limit": 20}` | ok | 346,258 | 346,258 | `b03c62814da0` | `b03c62814da0` | Identical |
| 40 | `get-sequences-units` | `{"sequence": "english-primary", "year": "1"}` | ok | 26,080 | 26,080 | `bd1b4752bfea` | `bd1b4752bfea` | Identical |
| 41 | `get-subject-detail` | `{"subject": "art"}` | ok | 3,447 | 3,447 | `a77939014ab3` | `a77939014ab3` | Identical |
| 42 | `get-subjects-key-stages` | `{"subject": "art"}` | ok | 1,043 | 1,043 | `1c867744ab90` | `1c867744ab90` | Identical |
| 43 | `get-subjects-programmes` | `{"subject": "english"}` | ok | 1,450 | 1,450 | `272320c4a696` | `272320c4a696` | Identical |
| 44 | `get-subjects-years` | `{"subject": "cooking-nutrition"}` | ok | 526 | 526 | `025b96c28218` | `025b96c28218` | Identical |
| 45 | `get-thread-progressions` | `{"threadSlug": "number-fractions"}` | ok | 49,513 | 49,513 | `73335e3f8621` | `73335e3f8621` | Identical |
| 46 | `get-thread-progressions` | `{"subject": "maths", "keyStage": "ks2"}` | ok | 6,063 | 6,063 | `beff2cb04474` | `beff2cb04474` | Identical |
| 47 | `get-threads-units` | `{"thread": "number-multiplication-and-division"}` | ok | 16,769 | 16,769 | `a38dc52f5515` | `a38dc52f5515` | Identical |
| 48 | `get-units-summary` | `{"unit": "programming-subroutines"}` | ok | 6,808 | 6,808 | `70bd6049e2b2` | `70bd6049e2b2` | Identical |
| 49 | `search` | `{"scope": "lessons", "query": "photosynthesis", "subject": "science", "keyStage": "ks3", "size": 5}` | ok | 28,280 | 28,280 | `005f8d00dd5e` | `005f8d00dd5e` | Identical |
| 50 | `search` | `{"scope": "lessons", "query": "Romans", "year": "3", "size": 5, "highlight": true}` | ok | 29,810 | 29,810 | `a9698c11f16e` | `a9698c11f16e` | Identical |
| 51 | `search` | `{"scope": "lessons", "query": "trigonometry", "keyStage": "ks4", "tier": "higher", "size": 5}` | ok | 26,519 | 26,519 | `c33bea3b4a83` | `c33bea3b4a83` | Identical |
| 52 | `search` | `{"scope": "units", "query": "fractions", "subject": "maths", "keyStage": "ks2", "size": 5}` | ok | 23,666 | 23,666 | `7a0534ad427e` | `7a0534ad427e` | Identical |
| 53 | `search` | `{"scope": "threads", "subject": "maths"}` | ok | 5,580 | 5,580 | `848fbd6fbaad` | `848fbd6fbaad` | Identical |
| 54 | `search` | `{"scope": "sequences", "query": "science", "size": 5}` | ok | 58,827 | 58,827 | `a3542c658ed4` | `a3542c658ed4` | Identical |
| 55 | `search` | `{"scope": "suggest", "query": "frac", "subject": "maths", "limit": 5}` | ok | 2,298 | 2,298 | `c2ae93852600` | `c2ae93852600` | Identical |
| 56 | `get-lessons-summary` | `{"lesson": "this-lesson-does-not-exist-xyz"}` | error | 95 | 95 | `7adf0d6c787d` | `7adf0d6c787d` | Identical |
| 57 | `search` | `{"scope": "bogus", "query": "x"}` | error | 256 | 256 | `59d3fa603899` | `59d3fa603899` | Identical |
| 58 | `get-units-summary` | `{}` | error | 225 | 225 | `639dd277e4c0` | `639dd277e4c0` | Identical |
| 59 | `fetch` | `{"id": "nonsense"}` | error | 112 | 112 | `5b7869d034b6` | `5b7869d034b6` | Identical |
| 60 | `get-key-stages-subject-units` | `{"keyStage": "ks9", "subject": "maths"}` | error | 253 | 253 | `71aa37feee0f` | `71aa37feee0f` | Identical |
| 61 | `search` | `{"scope": "suggest", "query": "frac"}` | error | 208 | 208 | `dd638b01a5c1` | `dd638b01a5c1` | Identical |
| 62 | `get-prior-knowledge-graph` | `{"unitSlugs": ["no-such-unit-xyz"]}` | ok | 717 | 717 | `016db38f7ec4` | `016db38f7ec4` | Identical |

The two different results:

- **Call 6, `oak-under-the-hood`.** The text differs where the branch edits the orientation
  skill (`.agent/skills/orientation/under-the-hood/SKILL-CANONICAL.md`), which is generated into
  the server. Read against the source difference: the changed lines are those edits and nothing
  else.
- **Call 16, `download-asset`.** Production's link is on `mcp.thenational.academy`. The preview's
  link is on `poc-oak-open-curriculum-c1yg9j7l3.vercel.thenational.academy`, the address of the
  deployment for that commit, although the call went to the branch address. The rest of the
  result is identical. Both links were fetched: each returned HTTP 200 and a PowerPoint file of
  8,782,614 bytes, and the two files have the same SHA-256 digest (`b01e989c…870ff9f3`).

Calls 56 to 61 return the same errors on both servers. Call 62 (a unit that does not exist)
returns the same well-formed result on both, without an error flag.

### Resource contents

All 6 resources were read from both servers and are identical after masking the host.

| Resource | Bytes | SHA-256, production | SHA-256, preview |
| --- | --- | --- | --- |
| `curriculum://model` | 52,190 | `f98317a25335` | `f98317a25335` |
| `docs://oak/getting-started.md` | 1,217 | `1074324f3ec9` | `1074324f3ec9` |
| `docs://oak/guidance/explore-curriculum.md` | 1,020 | `d56f07ae1a74` | `d56f07ae1a74` |
| `docs://oak/guidance/find-lessons.md` | 1,150 | `86a445b20152` | `86a445b20152` |
| `docs://oak/guidance/learning-progression.md` | 1,476 | `b213060b9191` | `b213060b9191` |
| `ui://widget/oak-curriculum-app-v1.html` | 628,928 | `2c4439669dfd` | `2c4439669dfd` |

### Host compatibility

`mcpjam compat` (host catalogue version 31) judges a server against 28 client hosts. The two
reports are identical after masking hosts and timings (SHA-256 `f9048dc46beb…` on both): 6 hosts "works", 22 "degraded", none
"blocked". The degraded verdicts describe what each client supports, not a server fault: 10
clients show the plain-text result where `get-curriculum-model` offers an interactive view, and
others lack one or more capabilities the view uses, such as file download.

### Unauthenticated endpoints

| Path                                                               | Result                                                        |
| ------------------------------------------------------------------ | ------------------------------------------------------------- |
| `/healthz`, `/mcp/healthz`, `/robots.txt`                          | Identical bodies                                              |
| `GET /mcp`, `GET /mcp/does-not-exist`                              | Identical bodies                                              |
| `/.well-known/oauth-protected-resource` (and `/mcp` variant)       | Same shape; the authorisation server differs (difference 4)   |
| `/.well-known/oauth-authorization-server`                          | Same fields; hosts differ (difference 4)                      |
| `/`, `/llms.txt`, `/.well-known/api-catalog`, `/.well-known/mcp/server-card.json` | 404 on both; body differs (difference 3)        |

Difference 4 in detail: production names `clerk.thenational.academy`; the preview names
`native-hippo-15.clerk.accounts.dev`. The authorisation-server metadata has the same 7 varying
fields on each side, each differing only by host. Sign-in on the preview therefore exercised the
branch's OAuth proxy code against a development identity provider, not production's.

### Response headers

On `/healthz`, 5 headers differ: the 4 in the table, and `x-robots-tag: noindex`, which only the
preview sends.

| Header                    | Production                                    | Preview                                    |
| ------------------------- | --------------------------------------------- | ------------------------------------------ |
| `content-security-policy` | `upgrade-insecure-requests; frame-ancestors 'self';` | The 13-directive policy set in `security-headers.ts` |
| `x-frame-options`         | `DENY`                                        | `SAMEORIGIN`                               |
| `referrer-policy`         | `strict-origin-when-cross-origin`             | `no-referrer`                              |
| `permissions-policy`      | `camera=(), geolocation=(), microphone=()`    | Not sent                                   |

The file that sets these headers,
`apps/oak-curriculum-mcp-streamable-http/src/security-headers.ts`, is the same on `main` and on
the branch, and the preview's values are the ones that file sets. Production's values are not
the ones the file sets. Both hosts answer through Cloudflare (`server: cloudflare`). Oak's Cloudflare rewrites response headers for production (confirmed by the repository owner, 2026-11-16); the branch does not change them.

## Production notes

Faults and shortcomings seen on the production server while comparing. They are kept as open
entries in the
[production snagging list](../../docs/operations/mcp-server-production-snagging.md). Notes 3 and 4 are the
same on the preview, so the merge neither causes nor cures them.

1. **A client holding older sign-in state can fail against the two-issuer layout.** The
   protected-resource metadata names `https://clerk.thenational.academy` as the authorisation
   server, and the server's own `/.well-known/oauth-authorization-server` gives the issuer as
   `https://mcp.thenational.academy` with `/oauth/*` proxy endpoints. That layout is decided
   ([ADR-115](../../docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md)).
   One client configuration in this exercise failed to sign in, reporting that it expected
   `mcp.thenational.academy` and received `clerk.thenational.academy`, while a fresh connection
   to the same address signed in. The cause of that one failure was not established.
2. **Unknown paths return an HTML page.** `Cannot GET /…` as HTML, where a JSON client expects
   JSON. The branch returns `{"error":"Not found"}`.
3. **Some tools return very large results from small requests.** `get-sequences-assets`
   (`maths-primary`, year 1) returns about 750 kB; `browse-curriculum` with no arguments about
   740 kB; `get-sequences-questions` with `limit: 20` about 346 kB; `get-programmes-questions`
   with `limit: 20` about 252 kB. A result of that size can exceed what a client or model
   accepts.
4. **Sign-in prompts inside tool results are not acted on by most clients.** The compatibility
   check reports that 24 of the 28 hosts show a tool result carrying a sign-in challenge as an
   ordinary error and do not start sign-in from it. All tools declare the OAuth scheme that
   relies on that behaviour.
5. **The content security policy the code sets is not the one production serves.** See
   [Response headers](#response-headers). Production serves a two-directive policy in place of the application's, set by Oak's Cloudflare.

## What this does not show

- **Production's identity provider with the branch's code.** The preview signs in through a
  development Clerk instance. The branch changes authentication and OAuth-proxy source, and that
  code has not run against `clerk.thenational.academy`. The repository owner accepts this (2026-11-16): the production instance is in constant use and the mechanism is the same.
- **Production's environment.** Environment variables, the edge configuration and the canonical
  host are production's own. Difference 2 shows that the preview resolves its own address per
  deployment; production's value for that address is set by its environment.
- **Every argument.** 62 calls sample each tool; they do not cover every combination of
  arguments.
- **Rendering in a client.** The widget's bytes are identical. It was not opened in a client
  host on either side.
- **Load, rate limiting and caching.**
- **Anything outside the MCP server.** The branch changes 4,826 files across the repository.
  The repository's own checks on the pull request cover those; this report does not.
- **The production build's identity.** Taken from the latest release, not read from the server.

## Reproduction

The calls above, in table order, with the arguments shown, against the two addresses in
[What was compared](#what-was-compared), using `@mcpjam/cli` 6.3.1 and an account that can sign
in to each server. Normalise as described in [Method](#method) step 3 and compare by byte. The raw outputs of this run were held in a session scratch directory and are not kept. The tables record each normalised output's size and SHA-256 digest on both sides, so a re-run can be checked against this one result by result. Both addresses serve whatever is deployed at the time: a re-run after either changes compares different builds.
