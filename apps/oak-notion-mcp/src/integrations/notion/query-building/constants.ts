/**
 * Constants for Notion query building
 */

/**
 * Valid property types for Notion
 */
export const VALID_PROPERTY_TYPES = [
  'title',
  'rich_text',
  'number',
  'select',
  'multi_select',
  'date',
  'people',
  'files',
  'checkbox',
  'url',
  'email',
  'phone_number',
  'formula',
  'relation',
  'rollup',
  'created_time',
  'created_by',
  'last_edited_time',
  'last_edited_by',
] as const;

/**
 * Valid operators by property type
 */
export const VALID_OPERATORS: Record<string, readonly string[]> = {
  title: [
    'equals',
    'does_not_equal',
    'contains',
    'does_not_contain',
    'starts_with',
    'ends_with',
    'is_empty',
    'is_not_empty',
  ],
  rich_text: [
    'equals',
    'does_not_equal',
    'contains',
    'does_not_contain',
    'starts_with',
    'ends_with',
    'is_empty',
    'is_not_empty',
  ],
  number: [
    'equals',
    'does_not_equal',
    'greater_than',
    'less_than',
    'greater_than_or_equal_to',
    'less_than_or_equal_to',
    'is_empty',
    'is_not_empty',
  ],
  select: ['equals', 'does_not_equal', 'is_empty', 'is_not_empty'],
  multi_select: ['contains', 'does_not_contain', 'is_empty', 'is_not_empty'],
  date: ['equals', 'before', 'after', 'on_or_before', 'on_or_after', 'is_empty', 'is_not_empty'],
  people: ['contains', 'does_not_contain', 'is_empty', 'is_not_empty'],
  files: ['is_empty', 'is_not_empty'],
  checkbox: ['equals', 'does_not_equal'],
  url: ['equals', 'does_not_equal', 'contains', 'does_not_contain', 'is_empty', 'is_not_empty'],
  email: ['equals', 'does_not_equal', 'contains', 'does_not_contain', 'is_empty', 'is_not_empty'],
  phone_number: [
    'equals',
    'does_not_equal',
    'contains',
    'does_not_contain',
    'is_empty',
    'is_not_empty',
  ],
};

/**
 * Valid sort directions
 */
export const VALID_SORT_DIRECTIONS = ['ascending', 'descending'] as const;
export type SortDirection = (typeof VALID_SORT_DIRECTIONS)[number];

// Create string arrays for type guard checks
export const validSortDirectionsArray: readonly string[] = VALID_SORT_DIRECTIONS;
export const validPropertyTypesArray: readonly string[] = VALID_PROPERTY_TYPES;
