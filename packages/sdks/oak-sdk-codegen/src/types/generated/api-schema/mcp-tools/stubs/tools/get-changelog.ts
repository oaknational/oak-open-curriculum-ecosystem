/* GENERATED FILE - DO NOT EDIT */
export const stubGetChangelogResponse = [
  {
    "version": "0.7.0",
    "date": "2026-05-21",
    "changes": [
      "/subjects/{subject} now exposes `ks4ProgrammeFactors.childSubject` for subjects split into child subjects at KS4 (currently science → biology, chemistry, combined-science, physics)",
      "Removed the per-sequence `ks4Options` field from `sequenceSlugs[]` in /subjects, /subjects/{subject}, and /subjects/{subject}/sequences responses; the variant is still encoded in the sequenceSlug suffix"
    ]
  },
  {
    "version": "0.6.0",
    "date": "2026-02-19",
    "changes": [
      "Change to how blocked content is handled, using BAD_REQUEST & .data.cause instead of 451"
    ]
  }
] as const;