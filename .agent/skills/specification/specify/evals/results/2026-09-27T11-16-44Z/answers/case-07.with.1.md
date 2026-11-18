I've repaired the spec below. I kept every original statement and gave each one a label (R2-1 to R2-5) so its fate can be traced. Wherever a fact isn't written down, the spec leaves a named open item (⟨U#⟩) instead of a guessed value.

---

## Nightly active-accounts export — revision 3 (repair of revision 2)

**Status:** Proposed. Nothing here is adopted until the owner and the partner agree to it (U1).
**Subject:** A scheduled batch job that makes a CSV of active accounts and puts it on the partner's SFTP server.
**Purpose and users:** The partner uses the file as an input to its billing. The account holders listed in the file are also affected.
**In scope:** Choosing the records, building the file, naming it, delivering it, and reporting when it fails.
**Out of scope:** How the partner bills. Whether the file is good enough for billing is a question about how the two systems connect (see Seams).

### Example cases

- **Success:** The run for day D starts in the agreed window. It reads a consistent snapshot of accounts that are active under the U3 definition, writes the file in the U5 format, and puts `accounts-YYYYMMDD.csv` on the server. The partner can see the file by the deadline. The partner never sees a partly written file.
- **Things that can go wrong:**
  - The source data is unavailable.
  - The SFTP server can't be reached, or the credentials have expired.
  - The upload stops partway.
  - An account changes status during the extract.
  - There are no active accounts at all.
  - The run starts late or crosses midnight, so the date in the file name is ambiguous.
  - The DST changeover happens.
  - The job is re-run, or one or more nights are missed.
  - The partner reads the file while it is still uploading.

### Obligations

**E1 — Schedule** (from R2-1, kept and made precise)
- The job must start once per calendar day in ⟨U2: timezone⟩, within ⟨U2: start window⟩.
- On DST changeover days it must still run exactly once.
- If a run doesn't start or doesn't finish, that counts as a failure and is handled under E6. It is not skipped silently.

**E2 — Which records go in** (from R2-2, kept and made precise)
- The file must hold exactly the accounts that are active under ⟨U3: definition of "active" and who owns that definition⟩.
- Activity is judged at one snapshot time, ⟨U4⟩, and every row reflects that same moment.
- Each active account appears exactly once.
- No inactive account appears.

**E3 — File format** (new; needed because R2-2 is unusable without it)
- Columns, header, encoding, delimiter, quoting, line endings and number/date formats: ⟨U5⟩.
- The format is set down in one place (U5's owner), and this spec links to it rather than repeating it.
- Any format change is a revision under E7.

**E4 — File name** (from R2-3, kept)
- The name must be `accounts-YYYYMMDD.csv`, using a 4-digit year, a 2-digit month and a 2-digit day on the Gregorian calendar.
- The date in the name means ⟨U6: the snapshot date or the run date, and in which timezone⟩.
- Exactly one file name per day. What happens on a re-run: ⟨U7: overwrite, or refuse⟩.

**E5 — Delivery** (replaces R2-4)
- The partner must never be able to see the file under its final name until the whole file is there. How that is achieved: ⟨U8, e.g. upload under a temporary name and then rename, if the partner's server allows it⟩.
- The file must be there by ⟨U2: delivery deadline⟩.
- Failed uploads are retried ⟨U9: how many times, how far apart, and when to stop⟩.
- A zero-row file (header only, if U5 has a header) means "no active accounts". It must never be sent to report a failure.
- Evidence of completeness that the partner can check: ⟨U10: row count, checksum, a marker file, or none⟩.

**E6 — Failure reporting** (new; "reliable" is meaningless without it)
- If the deadline in E5 is missed, or any step fails, ⟨U1: operator⟩ must be alerted within ⟨U11⟩.
- Whether and how the partner is told: ⟨U11⟩.
- Missed days are re-sent under ⟨U12: backfill rule — whether a missed day is regenerated as of its original snapshot, or only the next run is sent⟩.

**What the partner may rely on** (from R2-5, split up)
- **May rely on:** For each file that is delivered, E2, E3 and E4 hold for the snapshot the file declares.
- **Must not rely on:**
  - Row order, unless U5 specifies it.
  - A file being present unless it can be seen under its final name.
  - A missing file meaning "zero accounts".
  - Any column not defined in U5.
- **Not a promise of this job:** That the file is enough, or correct, for billing. That depends on the partner's billing rules and is sent to the seam review below.

**E7 — Changes:** Any change to U3, U5 or E4 needs ⟨U1: an agreed notice period and approver⟩ before it takes effect. Earlier revisions are kept.

### Seams
- **Source system ↔ job:** The source must support a consistent snapshot (E2). Whether it can is unknown (U4).
- **Job ↔ partner's SFTP:** Authentication, renaming, quotas and retention period: ⟨U8⟩.
- **File ↔ partner billing:** This is the important one. Hand it to `specify-connection` with this revision, the partner's billing inputs, and the intended use (billing).

### Profile trigger
- The file probably holds personal data about account holders. Whether it does depends on U5.
- If it does, lawful basis, keeping only needed fields, encryption in transit and at rest, and retention on both sides all need to be specified. Treatment: blocks deployment until U5 is settled.

### Evidence plan (no evidence exists yet)
- **E2:** Compare the export with fixtures whose expected active set comes from the U3 definition, not from the export query itself.
- **E4:** Unit tests covering DST, crossing midnight and re-runs.
- **E5:** Fault-injection tests (upload dropped partway, server unreachable), checking that no partial file is ever visible under the final name.
- **E5/E6:** Keep a nightly delivery log and reconcile it against what the partner acknowledges. Whether acknowledgement exists: U10.

### Unknowns and how each is treated

| ID | Unknown | Treatment | Consequence |
|---|---|---|---|
| U1 | Who owns and runs the job, who approves changes, and whether a partner agreement exists | Blocks | Nothing can be adopted |
| U2 | Timezone, start window, delivery deadline | Blocks | E1 and E5 can't be tested |
| U3 | Definition of "active" and who owns it | Blocks | E2 can't be implemented; billing risk |
| U4 | Whether the source can give a consistent snapshot, and when | Bounded investigation of the source system | E2 consistency unproven |
| U5 | Columns and format | Blocks implementation and the privacy review | — |
| U6 | What the date in the file name means | Blocks partner reliance | Files could be matched to the wrong billing period |
| U7 | Re-run behaviour | Needs a decision from the U1 owner | Risk of duplicate or overwritten files |
| U8 | SFTP capabilities (renaming, retention) | Bounded investigation with the partner | Decides how E5 is built |
| U9 | Retry rule | Needs a decision from the U1 owner | — |
| U10 | Completeness check for the partner | Needs a decision with the partner | Without it, partial data can't be detected on the partner side |
| U11 | Who gets alerted, how fast, and whether the partner is told | Needs a decision from the U1 owner | Failures may go unnoticed |
| U12 | Backfill rule | Needs a decision together with the partner | Billing gaps after an outage |

### How revision 2 maps to revision 3

| Rev 2 | Outcome | Why |
|---|---|---|
| R2-1 "runs nightly" | Kept → E1 | Correct, but needed a timezone, time window and what counts as a miss |
| R2-2 "exports active accounts" | Kept → E2, plus a new E3 | "Active" and the file format were undefined |
| R2-3 file name | Kept → E4 | The date's meaning and re-run behaviour were missing |
| R2-4 "Delivery is reliable" | Dropped as written → E5, E6 | An adjective, not something you can observe or test |
| R2-5 "partner can rely on it for billing" | Split → the may-rely / must-not-rely list, plus a seam handoff | A claim about outcomes this job alone can't guarantee |

### Readiness and next steps
- **Ready for discussion.** Not ready for implementation or for the partner to rely on it until U1, U2, U3, U5 and U6 are resolved.
- **Next steps:**
  - Resolve U1–U3, U5 and U6 with the job owner and the partner.
  - Hand the file ↔ billing seam to `specify-connection`.
  - Once the evidence exists, `assess-specification` can judge readiness for billing.
