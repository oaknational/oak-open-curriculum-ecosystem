# Trial evidence

The evidence behind [`../delivery-trial.md`](../delivery-trial.md) and
[`../habit-text-trial.md`](../habit-text-trial.md), copied from the session's scratch
directory on 12 November 2026 so that a later reader can check the tables against it. A Codex
review of pull request 397 asked for it; until then both records said it was not kept.

## What is here

| File | What it is |
| --- | --- |
| `sessions-delivery-run-1.json` | The delivery trial's first run of ten sessions, which that record sets aside for the fault it describes |
| `sessions-delivery-run-2-control-1.json` | The delivery trial's second run, which is also the habit-text trial's first control |
| `sessions-habit-text-control-2.json` | The habit-text trial's second control, the unchanged clone run again |
| `sessions-habit-text-treatment.json` | The habit-text trial's treatment, the clone with 28 instructions as text |
| `startup-skill-listing.json` | The skills each session's start-up event listed: the names once, and for each of the forty sessions how many were listed, how many were distinct, and whether the list was the same |
| `habit-text-pack/answers.txt` | The thirty final answers as the reader saw them, under shuffled labels |
| `habit-text-pack/key.json` | The key from label to condition and session, kept from the reader |
| `habit-text-pack/instructions.txt` | The 28 instructions the reader marked against |
| `habit-text-pack/applicable.txt` | The reader's decision, per task, on which instructions bear |
| `habit-text-pack/marks.tsv` | The reader's 115 marks: label, instruction, mark and quoted line |
| [`tools/scripts.md`](tools/scripts.md) | The scripts as text, each in its own block: the three drivers, the task list, the two analysis scripts, the script that built the treatment clone, the script that built the pack, and `build_evidence.py`, which made this directory. They are records of what ran and not files to run |

Each `sessions-*.json` file holds one record for each session: the model, the input tokens of
the first model call, every path given to `Read` in order, every `Skill` call, counts of
`Grep` and `Glob` calls, turns, duration, cost, how the session ended, and the final answer.

## What is not here

The raw stream-JSON traces, about 8.6 MB for forty sessions. Each line repeats the session's
whole context, so they are large for what they add, and they carry the machine's paths and
identifiers on most lines. The session records above are what `build_evidence.py` drew
from them, and that script is the statement of what was taken. The traces are gone when the
session's container is reclaimed.

## What was changed in copying

`build_evidence.py` replaced the scratch directory's path, the home directory, session
identifiers and UUIDs with placeholders in angle brackets, and removed each clone's path
prefix so that read paths are relative to the repository root. Nothing else was altered. The
treatment clone's directory name, `cloneT`, is left where an answer wrote it: that answer is
the incomplete blind the habit-text record describes, and it is evidence.

## Checks made on the copy

- The first model call carries 39,302 to 40,152 input tokens in the three unchanged runs and
  42,225 to 42,509 in the treatment, which agrees with the records' figures of about 39,300
  and 42,250.
- The pack holds thirty answers and the key thirty labels; the marks file holds 115 rows.
- Every one of the forty sessions listed the same 118 skills at start-up, all distinct, 78 of
  them named `oak-`, which is what the review of the collection reports.
