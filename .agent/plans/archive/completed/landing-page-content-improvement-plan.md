# Landing Page Content Improvement Plan

## Document Purpose

This plan outlines the necessary improvements to the Oak Curriculum MCP HTTP server landing page (`/` route) to ensure it accurately represents the current implementation, provides useful information to users, and supports the broader goals of the Oak Curriculum API ecosystem.

## Context: What Needs Updating and Why

### Current State

The landing page at the `/` route of the MCP HTTP server (`apps/oak-curriculum-mcp-streamable-http/src/landing-page.ts`) currently serves as the first point of contact for anyone visiting the server's root URL. It provides:

1. An MCP client configuration snippet showing how to connect
2. Basic server status information
3. A link to the OAuth protected resource metadata

### Issues Identified

#### 1. Misleading Authentication Description

**Current:** "Auth: Bearer token required for POST"

**Problem:** This phrasing suggests users need to manually obtain and manage bearer tokens, which is incorrect. The server implements OAuth 2.1 authorization, where the MCP client handles the entire authentication flow automatically. Users never directly interact with bearer tokens.

**Impact:** This creates confusion about how to use the server and may discourage adoption by making the authentication process seem more complex than it is.

#### 2. Missing Critical Context

**Current:** The page shows a configuration snippet but doesn't explain what the server provides.

**Problem:** Users landing on this page have no context about:

- What Oak National Academy is
- The broader Oak Curriculum API ecosystem

**Impact:** Without context, potential users cannot evaluate whether this MCP server meets their needs or understand the educational value it provides.

#### 3. No Link to Underlying API Documentation

**Current:** The page links only to the OAuth metadata endpoint.

**Problem:** The MCP server is a programmatic interface to the Oak Curriculum API (https://open-api.thenational.academy/docs/about-oaks-api/api-overview), but there's no link to the comprehensive API documentation that explains:

**Impact:** Users cannot discover the full capabilities of the underlying data source, limiting their ability to build meaningful integrations.

#### 4. Vague OAuth Guidance

**Current:** "See resource metadata and POST to /mcp with a valid bearer token"

**Problem:** This instruction suggests manual token handling, which contradicts the OAuth 2.1 flow where:

- MCP clients automatically discover OAuth metadata
- Clients handle the authorization flow
- Tokens are managed transparently
- Users authorize through a browser-based flow

**Impact:** Developers may attempt to manually handle authentication, leading to implementation errors and security issues.

## Intention Behind the Landing Page

### Primary Goals

1. **First Impression and Discovery**
   - The landing page is often the first touchpoint for developers discovering the MCP server
   - It should immediately convey what the server provides and why it matters
   - It should inspire confidence in the quality and usefulness of the service

2. **Quick Start for Technical Users**
   - Provide the exact configuration snippet needed to connect an MCP client
   - Show the correct URL format for different environments (dev, preview, production)
   - Make it copy-paste simple to get started

3. **Educational Context**
   - Explain that this provides access to Oak National Academy's free curriculum data
   - Highlight the educational mission (improving pupil outcomes, closing disadvantage gaps)
   - Connect to the broader Oak ecosystem

4. **Technical Transparency**
   - Clearly indicate the authentication mechanism (OAuth 2.1)
   - Link to relevant technical specifications
   - Show the MCP endpoint and protocol version

5. **Discoverability**
   - Link to comprehensive API documentation
   - Help users understand the full scope of available data
   - Guide users toward additional resources and support

### Secondary Goals

1. **Trust Building**
   - Show that this is an official Oak National Academy service
   - Demonstrate professional quality through clear, accurate content
   - Provide legitimate links to authoritative documentation

2. **Accessibility**
   - Maintain high contrast and large, legible fonts
   - Use semantic HTML with proper ARIA labels
   - Support both light and dark color schemes
   - Ensure screen reader compatibility

3. **Aesthetic Quality**
   - Reflect Oak's brand identity (color scheme, typography)
   - Create a welcoming, professional appearance
   - Use clear visual hierarchy

## Why Making It Useful and Informative Matters

### For the Oak Mission

Oak National Academy exists to improve educational outcomes and close disadvantage gaps by providing free, high-quality curriculum resources. The MCP server extends Oak's reach by:

- Enabling AI applications to access curriculum data
- Supporting developers building educational tools
- Facilitating integration into diverse learning platforms
- Amplifying Oak's impact through the broader education technology ecosystem

**A clear, informative landing page directly supports this mission** by making it easier for developers to discover, understand, and integrate Oak's curriculum data into products that benefit teachers and students.

### For User Experience

Developers and technical decision-makers visiting the landing page need to quickly answer:

1. **"What is this?"** → Without context, they cannot evaluate relevance
2. **"How do I use it?"** → Without clear guidance, they cannot get started
3. **"What can I build with it?"** → Without documentation links, they cannot plan integrations
4. **"Is it trustworthy?"** → Without professional presentation, they may look elsewhere

**Poor landing page content creates friction** that prevents valuable educational technology from being built.

### For Technical Correctness

Inaccurate or misleading technical information:

- **Causes implementation errors** when developers follow incorrect guidance
- **Creates security vulnerabilities** when auth flows are misunderstood
- **Generates support burden** from confused users
- **Damages credibility** of the entire Oak API ecosystem

**Accurate, clear technical content** ensures developers can successfully integrate the MCP server without confusion or errors.

### For Discoverability

The landing page is a critical discovery point:

- **Search engines index it** as the primary description of the service
- **Social sharing** often links to the root URL
- **Curiosity-driven visits** happen when people explore links in config files
- **Documentation references** point to it as the canonical source

**A well-crafted landing page increases adoption** by making it easy for people to understand value and get started.

### For Professional Standards

Oak National Academy is a respected educational institution. The MCP server landing page represents Oak's technical quality and attention to detail. A professional, accurate, helpful landing page:

- **Reflects well on Oak** as an organization
- **Builds trust** with technical audiences
- **Demonstrates care** for developer experience
- **Sets expectations** for the quality of the underlying service

**Quality matters** because it directly impacts how developers perceive and engage with Oak's offerings.

## Specific Content Improvements Needed

### 1. Add Descriptive Paragraph

**Location:** After the H1 title

**Content:**

```html
<p>
  Access Oak National Academy's free curriculum data and lesson resources through the Model Context
  Protocol. This MCP server provides programmatic access to educational content across all subjects
  for key stages 1-4.
</p>
```

**Rationale:** Immediately explains what the service is and what data it provides.

### 2. Update Authentication Status Line

**Current:** "Auth: Bearer token required for POST"

**Improved:** "Auth: OAuth 2.1"

**Rationale:** Accurate, concise, and doesn't imply manual token management.

### 3. Enhance Footer with Documentation Links

**Current:**

```html
<p>
  See <a href="/.well-known/oauth-protected-resource">resource metadata</a> and POST to
  <code>/mcp</code> with a valid bearer token.
</p>
```

**Improved:**

```html
<p>
  This server uses <a href="/.well-known/oauth-protected-resource">OAuth 2.1 authorization</a>. Your
  MCP client will handle authentication automatically. For details about the underlying curriculum
  data, see the
  <a href="https://open-api.thenational.academy/docs/about-oaks-api/api-overview"
    >Oak Curriculum API documentation</a
  >.
</p>
```

**Rationale:**

- Clarifies that OAuth is automatic (clients handle it)
- Links to comprehensive API documentation
- Removes misleading "POST with bearer token" instruction

### 4. Consider Additional Enhancements (Optional)

- Add a "What you can do with this" section with example use cases
- Include API key request link for developers wanting direct API access
- Add contact/support information for technical questions
- Include version information or changelog link
- Add status page link if available

## Implementation Notes

- File to modify: `apps/oak-curriculum-mcp-streamable-http/src/landing-page.ts`
- Changes should maintain accessibility standards
- All links should be tested in dev, preview, and production environments
- Dark mode styling should be verified after changes
- Consider adding integration test to verify links are valid

## Success Criteria

The landing page improvement will be successful when:

1. **Accuracy:** All technical information is correct and up-to-date
2. **Clarity:** First-time visitors can understand what the service provides
3. **Actionability:** Developers can get started with just the configuration snippet
4. **Discoverability:** Links guide users to comprehensive documentation
5. **Trust:** Professional presentation reflects Oak's quality standards
6. **Accessibility:** All users can access and understand the content

## Related Documentation

- [MCP Authorization Specification](../.agent/reference-docs/mcp-auth-spec.md)
- [Oak Curriculum API Documentation](https://open-api.thenational.academy/docs/about-oaks-api/api-overview)
- [Middleware Chain Documentation](../../apps/oak-curriculum-mcp-streamable-http/docs/middleware-chain.md)
- [OAuth Protected Resource Metadata](../../apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts)
