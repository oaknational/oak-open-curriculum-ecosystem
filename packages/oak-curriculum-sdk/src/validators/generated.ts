/**
 * GENERATED FILE - DO NOT EDIT
 *
 * This file contains Zod validators automatically generated from the Oak Curriculum API OpenAPI schema.
 * To regenerate, run: pnpm generate:types
 *
 * Last generated: 2025-08-10T13:11:10.321Z
 */

import { z } from 'zod';

export const TranscriptResponseSchemaSchema = z.object({
  transcript: z.string(),
  vtt: z.string(),
});

export type TranscriptResponseSchema = z.infer<typeof TranscriptResponseSchemaSchema>;

export const LessonAssetsResponseSchemaSchema = z.object({
  attribution: z.array(z.string()).optional(),
  assets: z
    .array(
      z.object({
        type: z.string(),
        label: z.string(),
        url: z.string(),
      }),
    )
    .optional(),
});

export type LessonAssetsResponseSchema = z.infer<typeof LessonAssetsResponseSchemaSchema>;

export const SubjectResponseSchemaSchema = z.object({
  subjectTitle: z.string(),
  subjectSlug: z.string(),
  sequenceSlugs: z.array(
    z.object({
      sequenceSlug: z.string(),
      years: z.array(z.number()),
      keyStages: z.array(
        z.object({
          keyStageTitle: z.string(),
          keyStageSlug: z.string(),
        }),
      ),
      phaseSlug: z.string(),
      phaseTitle: z.string(),
      ks4Options: z
        .object({
          title: z.string(),
          slug: z.string(),
        })
        .nullable(),
    }),
  ),
  years: z.array(z.number()),
  keyStages: z.array(
    z.object({
      keyStageTitle: z.string(),
      keyStageSlug: z.string(),
    }),
  ),
});

export type SubjectResponseSchema = z.infer<typeof SubjectResponseSchemaSchema>;

export const QuestionForLessonsResponseSchemaSchema = z.object({
  starterQuiz: z.array(z.unknown()),
  exitQuiz: z.array(z.unknown()),
});

export type QuestionForLessonsResponseSchema = z.infer<
  typeof QuestionForLessonsResponseSchemaSchema
>;

export const LessonSummaryResponseSchemaSchema = z.object({
  lessonTitle: z.string(),
  unitSlug: z.string(),
  unitTitle: z.string(),
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  keyStageSlug: z.string(),
  keyStageTitle: z.string(),
  lessonKeywords: z.array(
    z.object({
      keyword: z.string(),
      description: z.string(),
    }),
  ),
  keyLearningPoints: z.array(
    z.object({
      keyLearningPoint: z.string(),
    }),
  ),
  misconceptionsAndCommonMistakes: z.array(
    z.object({
      misconception: z.string(),
      response: z.string(),
    }),
  ),
  pupilLessonOutcome: z.string().optional(),
  teacherTips: z.array(
    z.object({
      teacherTip: z.string(),
    }),
  ),
  contentGuidance: z.unknown(),
  supervisionLevel: z.unknown(),
  downloadsAvailable: z.boolean(),
});

export type LessonSummaryResponseSchema = z.infer<typeof LessonSummaryResponseSchemaSchema>;

export const UnitSummaryResponseSchemaSchema = z.object({
  unitSlug: z.string(),
  unitTitle: z.string(),
  yearSlug: z.string(),
  year: z.unknown(),
  phaseSlug: z.string(),
  subjectSlug: z.string(),
  keyStageSlug: z.string(),
  notes: z.string().optional(),
  description: z.string().optional(),
  priorKnowledgeRequirements: z.array(z.string()),
  nationalCurriculumContent: z.array(z.string()),
  whyThisWhyNow: z.string().optional(),
  threads: z
    .array(
      z.object({
        slug: z.string(),
        title: z.string(),
        order: z.number(),
      }),
    )
    .optional(),
  categories: z
    .array(
      z.object({
        categoryTitle: z.string(),
        categorySlug: z.string().optional(),
      }),
    )
    .optional(),
  unitLessons: z.array(
    z.object({
      lessonSlug: z.string(),
      lessonTitle: z.string(),
      lessonOrder: z.number().optional(),
      state: z.string(),
    }),
  ),
});

export type UnitSummaryResponseSchema = z.infer<typeof UnitSummaryResponseSchemaSchema>;

export const error_UNAUTHORIZEDSchema = z.object({
  message: z.string(),
  code: z.string(),
  issues: z
    .array(
      z.object({
        message: z.string(),
      }),
    )
    .optional(),
});

export type error_UNAUTHORIZED = z.infer<typeof error_UNAUTHORIZEDSchema>;

export const error_FORBIDDENSchema = z.object({
  message: z.string(),
  code: z.string(),
  issues: z
    .array(
      z.object({
        message: z.string(),
      }),
    )
    .optional(),
});

export type error_FORBIDDEN = z.infer<typeof error_FORBIDDENSchema>;

export const error_INTERNAL_SERVER_ERRORSchema = z.object({
  message: z.string(),
  code: z.string(),
  issues: z
    .array(
      z.object({
        message: z.string(),
      }),
    )
    .optional(),
});

export type error_INTERNAL_SERVER_ERROR = z.infer<typeof error_INTERNAL_SERVER_ERRORSchema>;

export const RateLimitResponseSchemaSchema = z.object({
  limit: z.number(),
  remaining: z.number(),
  reset: z.number(),
});

export type RateLimitResponseSchema = z.infer<typeof RateLimitResponseSchemaSchema>;
