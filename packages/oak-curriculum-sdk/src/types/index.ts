/**
 * Type definitions for Oak Curriculum API
 */

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  keyStage: string;
  content?: string;
}

export interface Unit {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Programme {
  id: string;
  subject: string;
  keyStage: string;
  units: Unit[];
}
