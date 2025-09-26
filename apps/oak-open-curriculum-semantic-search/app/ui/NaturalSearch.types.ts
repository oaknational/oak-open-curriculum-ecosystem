export interface NaturalBody {
  q: string;
  scope?: 'units' | 'lessons' | 'sequences' | 'all';
  size?: number;
  subject?: string;
  keyStage?: string;
  phaseSlug?: string;
  minLessons?: number;
}

export type NaturalScopeChoice = 'auto' | NonNullable<NaturalBody['scope']>;
