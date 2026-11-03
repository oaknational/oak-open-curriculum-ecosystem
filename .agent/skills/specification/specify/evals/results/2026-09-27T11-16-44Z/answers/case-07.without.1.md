# Nightly Active-Accounts Export: Specification (Revision 3, draft)

## 0. Status of this revision

Revision 2 had five sentences. Three of them state facts: the job runs nightly, it exports active accounts, and the file is named `accounts-YYYYMMDD.csv`. The other two ("Delivery is reliable", "The partner can rely on the file for billing") are promises with no stated mechanism, no measurable threshold and no remedy if they fail. This revision keeps the three facts. It makes each of them precise where it can. It replaces the two promises with obligations that can be checked.

Nothing below adds a fact that revision 2 didn't contain. Where precision needs a decision nobody has written down yet, the text says **[OPEN-n]** and the question is listed in §6. Obligations marked **(proposed)** are suggestions from this revision and need owner sign-off before they bind anyone.

Normative terms: **MUST**, **MUST NOT** and **SHOULD** are used in their RFC 2119 sense.

---

## 1. Schedule

1.1 The job MUST run once per calendar day. *(Rev 2: "runs nightly")*

1.2 The run's start time and time zone are **[OPEN-1]**.

1.3 The file MUST be available to the partner by a deadline, **[OPEN-2]**. "Available" is defined in §4.3.

1.4 Each calendar day MUST produce exactly one delivered file for that day. Where this conflicts with §5, §5 governs.

## 2. Content

2.1 The file MUST contain every account that is active, and only those. *(Rev 2: "exports active accounts")*

2.2 The definition of "active" is **[OPEN-3]**. It needs to name the system of record and the field or rule that decides it.

2.3 The file MUST reflect a single consistent snapshot of account state. The snapshot's as-of time is **[OPEN-4]**.

2.4 The columns, and their order, names, types and meanings, are **[OPEN-5]**.

2.5 The CSV dialect (header row, delimiter, quoting, encoding, line endings) is **[OPEN-6]**.

2.6 If no accounts are active, the job's behaviour is **[OPEN-7]**. It could deliver a header-only file or deliver nothing. Proposed: deliver a header-only file, so that "no file" always means a failure.

## 3. File naming

3.1 The file MUST be named `accounts-YYYYMMDD.csv`. *(Rev 2, unchanged)*

3.2 `YYYYMMDD` MUST be a zero-padded Gregorian date. **[OPEN-8]** needs to decide whether it is the run date or the snapshot as-of date from 2.3, and in which time zone.

3.3 The destination SFTP host and directory are **[OPEN-9]**.

## 4. Delivery (replaces "Delivery is reliable")

4.1 **(proposed)** The partner MUST NOT be able to see a partial file under the final name. One way to meet this is to upload under a temporary name and then rename it. The mechanism needs to be agreed with the partner **[OPEN-10]**.

4.2 **(proposed)** Every file MUST come with an integrity check that the partner can verify, such as a row count or a checksum. The form and location of the check are **[OPEN-11]**.

4.3 A delivery succeeds only when the file is under its final name at the path in 3.3 and it passes the check in 4.2. Any other outcome is a failure.

4.4 On failure, the job MUST retry. The number of retries, the interval between them and the cutoff are **[OPEN-12]**.

4.5 If the file isn't delivered by the deadline in 1.3, the owner in §7 MUST be alerted. Whether and how the partner is told is **[OPEN-13]**.

4.6 Target delivery success, such as on-time delivery on X% of days, is **[OPEN-14]**. Revision 2 gave no number, so none is given here.

## 5. Re-runs, late files and corrections

5.1 **(proposed)** A re-run for a given date MUST produce the same content as the original run, based on the same snapshot from 2.3. This applies only if historical snapshots can be recovered, which is **[OPEN-15]**.

5.2 How a replacement file for a date already delivered is handled is **[OPEN-16]**. It could overwrite the old file, use a new name or come with a correction notice.

5.3 How long files are kept on the SFTP server, and who deletes them, is **[OPEN-17]**.

## 6. Billing use (replaces "The partner can rely on the file for billing")

6.1 The producer's obligations to the partner are the ones in §§1–5. Nothing else is guaranteed.

6.2 Whether the file is an authoritative billing record or only informational is **[OPEN-18]**. If it is authoritative, the dispute and correction process and its time limits must be written down before the partner starts billing from it.

## 7. Ownership

7.1 The owner of the job, and the contact for alerts and partner queries, is **[OPEN-19]**.

---

## Open questions

| # | Question |
|---|---|
| 1 | Run start time and time zone? |
| 2 | Deadline for the file to be available to the partner? |
| 3 | Definition of "active": which system and which rule? |
| 4 | Snapshot as-of time? |
| 5 | Column list and meanings? |
| 6 | CSV dialect: header, delimiter, quoting, encoding, line endings? |
| 7 | Behaviour when there are zero active accounts? |
| 8 | Does `YYYYMMDD` mean the run date or the data date, and in which time zone? |
| 9 | SFTP host and path? |
| 10 | Atomic-publish mechanism, agreed with the partner? |
| 11 | Integrity check format? |
| 12 | Retry count, interval and cutoff? |
| 13 | Is the partner notified on failure, and how? |
| 14 | Delivery success target, if any? |
| 15 | Can past snapshots be reproduced? |
| 16 | How are corrections or replacement files handled? |
| 17 | Retention on SFTP and responsibility for deleting files? |
| 18 | Is the file authoritative for billing? If so, what is the dispute process? |
| 19 | Who owns the job and who is the contact? |

## Changes from revision 2

- **Kept:** "runs nightly" (§1.1), "exports active accounts" (§2.1) and the filename (§3.1). The wording is tightened but the meaning is the same.
- **Replaced:** "Delivery is reliable" was a promise with no way to check it. It is now the obligations in §4, with the thresholds left open.
- **Replaced:** "The partner can rely on the file for billing" was a guarantee about how the partner uses the file, which the producer can't control. §6 now limits it to what the producer commits to, and the billing-authority question is left open.
- **Added as proposals:** 2.6, 4.1, 4.2 and 5.1. None of these is a stated fact, and each needs sign-off.
