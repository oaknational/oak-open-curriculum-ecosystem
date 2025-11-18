# Search UI (Frontend) Plans

Planning documentation for the semantic search frontend: React components, design system, theme, testing, and user experience.

## Scope

This directory contains plans for:

- **React Components**: Search forms, results display, facet filters, suggestions
- **Design System**: Oak Components integration, theme customisation, responsive layouts
- **Client State**: Search controller, fixture mode, query parameter management
- **Testing**: Playwright E2E tests, fixture coverage, component tests
- **Accessibility**: WCAG compliance, keyboard navigation, screen reader support

## Out of Scope

API routes, Elasticsearch, ingestion, backend logic → see [../search-service/](../search-service/)

## Current Implementation Plan

- [Frontend Implementation Plan](./frontend-implementation.md) - Comprehensive UI/UX implementation strategy

## Key Concepts

### Design System

The search UI is built with Oak Components, a design system providing:

- **Typography**: Lexend typeface with clear hierarchy
- **Color modes**: Light/dark theme support
- **Responsive layouts**: Mobile-first, tablet, desktop breakpoints
- **Accessibility**: High contrast, large fonts, ARIA patterns

### Component Architecture

**Search Pages**:

- Structured search (`/structured_search`) - Form-based with facets
- Natural language search (`/natural_language_search`) - Text input with intent parsing
- Suggestions - Type-ahead completion integrated into both modes

**Shared Components**:

- `SearchResults` - Unified result display (lessons, units, sequences)
- `SearchFilters` - Faceted navigation (subject, key stage, year, category, thread, tier)
- `SearchSuggestions` - Type-ahead completion with highlighting

### State Management

Client-side state controller pattern:

- URL-driven state (search params synced to URL)
- Optimistic updates with server validation
- Fixture mode toggle for development/testing

### Theme System

Extending Oak Components with semantic search-specific styles:

- Custom color tokens for search highlights
- Result card variants for different entity types
- Responsive grid layouts for facets and results
- Dark mode support with consistent contrast

## Fixture Testing Strategy

The UI supports three fixture modes for comprehensive testing:

1. **Live Mode** - Real API calls to backend
2. **Fixtures (Success)** - Realistic mock data with full results
3. **Fixtures (Empty)** - Empty result sets for zero-state UI
4. **Fixtures (Error)** - Error scenarios for error handling

Fixture mode is controlled via cookie and can be toggled in development.

## Testing Approach

### Playwright E2E Tests

Coverage matrix:

- Structured search flows (all scopes, filters)
- Natural language search flows
- Suggestion interactions
- Facet navigation
- Responsive layouts (mobile, tablet, desktop)
- Accessibility (keyboard, screen reader)
- Dark mode vs light mode

### Component Tests

Unit tests for:

- Search controller state transitions
- Fixture builders and data transforms
- URL parameter serialization
- Theme utilities

## Accessibility Requirements

Following Oak's accessibility standards:

- **WCAG 2.1 AA compliance** minimum
- **Large, legible fonts** with high contrast
- **Keyboard navigation** for all interactions
- **Screen reader** support with ARIA labels
- **Focus indicators** visible and clear
- **Color contrast** ratios ≥ 4.5:1 (text), ≥ 3:1 (UI components)

## Technology Stack

- **Next.js 15**: App Router, server components, client components
- **React 19**: Concurrent features, suspense
- **Oak Components**: Design system (@oaknational/oak-components)
- **Styled Components**: CSS-in-JS with theme support
- **Playwright**: E2E browser automation

## Related Plans

- [High-level overview](../semantic-search-overview.md)
- [Search service plans](../search-service/index.md)
- [Testing strategy](../../../docs/agent-guidance/testing-strategy.md)

## Historical Context

Completed and superseded plans → [../archive/](../archive/)
