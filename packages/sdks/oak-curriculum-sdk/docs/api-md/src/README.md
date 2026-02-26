[**@oaknational/curriculum-sdk v0.8.0**](../README.md)

---

[@oaknational/curriculum-sdk](../README.md) / src

# src

## Classes

- [BaseApiClient](classes/BaseApiClient.md)

## Interfaces

- [components](interfaces/components.md)
- [OakClientConfig](interfaces/OakClientConfig.md)
- [paths](interfaces/paths.md)
- [RateLimitConfig](interfaces/RateLimitConfig.md)
- [RateLimitInfo](interfaces/RateLimitInfo.md)
- [RateLimitTracker](interfaces/RateLimitTracker.md)
- [RetryConfig](interfaces/RetryConfig.md)
- [SdkLegallyRestrictedError](interfaces/SdkLegallyRestrictedError.md)
- [SdkNetworkError](interfaces/SdkNetworkError.md)
- [SdkNotFoundError](interfaces/SdkNotFoundError.md)
- [SdkRateLimitError](interfaces/SdkRateLimitError.md)
- [SdkServerError](interfaces/SdkServerError.md)
- [SdkValidationError](interfaces/SdkValidationError.md)

## Type Aliases

- [AllSubjectSlug](type-aliases/AllSubjectSlug.md)
- [ContentType](type-aliases/ContentType.md)
- [DocKeyStage](type-aliases/DocKeyStage.md)
- [DocSubject](type-aliases/DocSubject.md)
- [Ks4ScienceVariant](type-aliases/Ks4ScienceVariant.md)
- [OakApiClient](type-aliases/OakApiClient.md)
- [OakApiPathBasedClient](type-aliases/OakApiPathBasedClient.md)
- [OakKeyStage](type-aliases/OakKeyStage.md)
- [OakSubject](type-aliases/OakSubject.md)
- [OpenApiPathsMap](type-aliases/OpenApiPathsMap.md)
- [OperationId](type-aliases/OperationId.md)
- [ParentSubjectSlug](type-aliases/ParentSubjectSlug.md)
- [PathOperation](type-aliases/PathOperation.md)
- [ResourceType](type-aliases/ResourceType.md)
- [SdkFetchError](type-aliases/SdkFetchError.md)
- [ServerErrorStatus](type-aliases/ServerErrorStatus.md)
- [StatusCodeMaxRetries](type-aliases/StatusCodeMaxRetries.md)

## Variables

- [ALL_SUBJECTS](variables/ALL_SUBJECTS.md)
- [apiSchemaUrl](variables/apiSchemaUrl.md)
- [apiUrl](variables/apiUrl.md)
- [ASSET_TYPES](variables/ASSET_TYPES.md)
- [CONTENT_TYPE_PREFIXES](variables/CONTENT_TYPE_PREFIXES.md)
- [DEFAULT_RATE_LIMIT_CONFIG](variables/DEFAULT_RATE_LIMIT_CONFIG.md)
- [DEFAULT_RETRY_CONFIG](variables/DEFAULT_RETRY_CONFIG.md)
- [KEY_STAGES](variables/KEY_STAGES.md)
- [KS4_SCIENCE_VARIANTS](variables/KS4_SCIENCE_VARIANTS.md)
- [OPERATIONS_BY_ID](variables/OPERATIONS_BY_ID.md)
- [PARENT_TO_SUBJECTS](variables/PARENT_TO_SUBJECTS.md)
- [PATH_OPERATIONS](variables/PATH_OPERATIONS.md)
- [PATHS](variables/PATHS.md)
- [schema](variables/schema.md)
- [SUBJECT_TO_PARENT](variables/SUBJECT_TO_PARENT.md)
- [SUBJECTS](variables/SUBJECTS.md)
- [VALID_PATHS_BY_PARAMETERS](variables/VALID_PATHS_BY_PARAMETERS.md)

## Functions

- [classifyException](functions/classifyException.md)
- [classifyHttpError](functions/classifyHttpError.md)
- [createOakBaseClient](functions/createOakBaseClient.md)
- [createOakClient](functions/createOakClient.md)
- [createOakPathBasedClient](functions/createOakPathBasedClient.md)
- [extractSlug](functions/extractSlug.md)
- [formatSdkError](functions/formatSdkError.md)
- [generateCanonicalUrl](functions/generateCanonicalUrl.md)
- [generateCanonicalUrlWithContext](functions/generateCanonicalUrlWithContext.md)
- [getSubjectParent](functions/getSubjectParent.md)
- [isAllowedMethod](functions/isAllowedMethod.md)
- [isAllSubject](functions/isAllSubject.md)
- [isAssetType](functions/isAssetType.md)
- [isKeyStage](functions/isKeyStage.md)
- [isKs4ScienceVariant](functions/isKs4ScienceVariant.md)
- [isRecoverableError](functions/isRecoverableError.md)
- [isSubject](functions/isSubject.md)
- [isValidParameterType](functions/isValidParameterType.md)
- [isValidPath](functions/isValidPath.md)
- [isValidPathParameter](functions/isValidPathParameter.md)
- [typeSafeEntries](functions/typeSafeEntries.md)
- [typeSafeFromEntries](functions/typeSafeFromEntries.md)
- [typeSafeGet](functions/typeSafeGet.md)
- [typeSafeHas](functions/typeSafeHas.md)
- [typeSafeHasOwn](functions/typeSafeHasOwn.md)
- [typeSafeKeys](functions/typeSafeKeys.md)
- [typeSafeOwnKeys](functions/typeSafeOwnKeys.md)
- [typeSafeSet](functions/typeSafeSet.md)
- [typeSafeValues](functions/typeSafeValues.md)
- [validateCurriculumResponse](functions/validateCurriculumResponse.md)
- [validateRequest](functions/validateRequest.md)
- [validationError](functions/validationError.md)

## References

### ~~createApiClient~~

Renames and re-exports [createOakClient](functions/createOakClient.md)

---

### HttpMethod

Re-exports [HttpMethod](validation/types/type-aliases/HttpMethod.md)

---

### isValidationFailure

Re-exports [isValidationFailure](validation/types/functions/isValidationFailure.md)

---

### isValidationSuccess

Re-exports [isValidationSuccess](validation/types/functions/isValidationSuccess.md)

---

### KeyStage

Renames and re-exports [OakKeyStage](type-aliases/OakKeyStage.md)

---

### OakApiPaths

Renames and re-exports [paths](interfaces/paths.md)

---

### Subject

Renames and re-exports [OakSubject](type-aliases/OakSubject.md)

---

### ValidatedClientOptions

Re-exports [ValidatedClientOptions](validation/types/interfaces/ValidatedClientOptions.md)

---

### validateSearchResponse

Re-exports [validateSearchResponse](validation/search-response-validators/functions/validateSearchResponse.md)

---

### ValidationIssue

Re-exports [ValidationIssue](validation/types/interfaces/ValidationIssue.md)

---

### ValidationResult

Re-exports [ValidationResult](validation/types/type-aliases/ValidationResult.md)
