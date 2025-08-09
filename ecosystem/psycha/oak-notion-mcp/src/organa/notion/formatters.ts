/**
 * Pure functions for formatting Notion data into text representations
 *
 * This file now re-exports from the modular formatting subdomain
 * to maintain backward compatibility while reducing file size.
 */

// Re-export formatters
export {
  formatSearchResults,
  formatPageSummary,
  formatDatabaseSummary,
  formatDatabaseList,
  formatDatabaseQueryResults,
  formatPageProperties,
  formatPageDetails,
  formatUserList,
} from './formatting/index';

// Re-export property extractors
export {
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
  extractPropertyValue,
} from './formatting/index';
