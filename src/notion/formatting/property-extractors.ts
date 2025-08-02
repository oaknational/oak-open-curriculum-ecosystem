/**
 * Property extractors compatibility layer
 * Re-exports from modular structure
 */

// Re-export the main function and individual extractors explicitly
export {
  extractPropertyValue,
  extractTitleValue,
  extractRichTextValue,
  extractSelectValue,
  extractStatusValue,
  extractMultiSelectValue,
  extractNumberValue,
  extractCheckboxValue,
  extractDateValue,
  extractUrlValue,
  extractEmailValue,
  extractPhoneValue,
  extractCreatedTimeValue,
  extractLastEditedTimeValue,
  extractPeopleValue,
  extractFilesValue,
  extractRelationValue,
} from './property-extractors/index.js';
