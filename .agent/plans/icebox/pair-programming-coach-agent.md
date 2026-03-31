# Pair Programming Coach Agent Plan

**Status**: RESEARCH COMPLETE → PLANNING  
**Priority**: Medium (High value for DX, but not blocking)  
**Created**: 2025-11-11  
**Owner**: Engineering

## Purpose

Create an **event-driven AI agent** that actively monitors developer coding activity in real-time and provides proactive, context-aware suggestions, acting as a senior engineer pair programming partner who observes rather than types.

**Key Insight**: Unlike traditional agents that wait for explicit user input in the side panel, this agent **reacts to coding events** (file changes, saves, errors) and offers timely feedback without disrupting flow.

## Vision

> "Like having a senior engineer watching over your shoulder, who knows when to speak up and when to stay quiet."

**Example Scenario**:

```typescript
// Developer types this:
const user = data as User;

// 2 seconds later, sidebar shows:
💡 Type Safety Coach
━━━━━━━━━━━━━━━━━━━
Type assertion detected on line 42.

Consider using a type guard instead:

if (isUser(data)) {
  // data is now User type
}

This preserves type information and
follows @typescript-practice.md

[Apply Fix] [Dismiss] [Explain More]
```

## Research Summary

### VSCode Extension API (Confirmed Capabilities)

**Text Change Detection**:

```typescript
vscode.workspace.onDidChangeTextDocument((event) => {
  // Fires on EVERY keystroke
  // event.document - the file being edited
  // event.contentChanges - array of changes
  // Must debounce to avoid performance issues
});
```

**Save Detection**:

```typescript
vscode.workspace.onDidSaveTextDocument((document) => {
  // Fires after user saves
  // Good timing for deeper analysis
});
```

**File System Monitoring**:

```typescript
const watcher = vscode.workspace.createFileSystemWatcher('**/*.ts');
watcher.onDidChange((uri) => {
  // Detects external file changes
  // E.g., git operations, build tools
});
```

**Active Editor Switching**:

```typescript
vscode.window.onDidChangeActiveTextEditor((editor) => {
  // Fires when user switches files
  // Agent can analyze new context
});
```

**Diagnostics (Linter/Type Errors)**:

```typescript
vscode.languages.onDidChangeDiagnostics((event) => {
  // Fires when linting/type errors change
  // Agent can suggest fixes
});
```

**Code Lens (Inline Annotations)**:

```typescript
vscode.languages.registerCodeLensProvider(selector, {
  provideCodeLenses(document) {
    // Add inline suggestions above code
    return [new vscode.CodeLens(range, command)];
  },
});
```

### Cursor-Specific Capabilities

**Confirmed**:

- ✅ Inherits all VSCode Extension APIs
- ✅ Inline Edit Mode (`Ctrl+K`) - real-time AI edits
- ✅ AI Code Tracking API - analytics on AI-generated code
- ✅ Enhanced AI panel integration

**Unknown** (Requires further investigation):

- ❓ Custom agent hooks (e.g., `cursor.agent.observe`)
- ❓ Direct integration with Cursor's AI context
- ❓ Access to Cursor Rules from extensions
- ❓ Cursor-specific event bus

**Action Required**: Contact Cursor team or reverse-engineer from Cursor codebase to discover any proprietary extension APIs.

## Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                    VSCode/Cursor IDE                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │     Pair Programming Coach Extension                   │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │   Event Hub (Debounced & Filtered)              │ │ │
│  │  │                                                  │ │ │
│  │  │   • onDidChangeTextDocument (2s debounce)      │ │ │
│  │  │   • onDidSaveTextDocument (immediate)          │ │ │
│  │  │   • onDidChangeDiagnostics (500ms debounce)    │ │ │
│  │  │   • onDidChangeActiveTextEditor (immediate)    │ │ │
│  │  └──────────────┬───────────────────────────────────┘ │ │
│  │                 │                                      │ │
│  │                 ▼                                      │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │   Context Analyzer                               │ │ │
│  │  │                                                  │ │ │
│  │  │   Gathers:                                       │ │ │
│  │  │   - Current file & changes                      │ │ │
│  │  │   - Project rules (.agent/directives, @rules)  │ │ │
│  │  │   - Linter errors                               │ │ │
│  │  │   - Recent git history                          │ │ │
│  │  │   - Open files (context)                        │ │ │
│  │  │   - Cursor position                             │ │ │
│  │  └──────────────┬───────────────────────────────────┘ │ │
│  │                 │                                      │ │
│  │                 ▼                                      │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │   Pattern Detector (Local)                       │ │ │
│  │  │                                                  │ │ │
│  │  │   Fast, rule-based checks:                       │ │ │
│  │  │   - Type assertions (as, any)                   │ │ │
│  │  │   - Missing tests (new function without test)   │ │ │
│  │  │   - Architecture violations (wrong directory)   │ │ │
│  │  │   - ESLint rule violations                      │ │ │
│  │  │                                                  │ │ │
│  │  │   If patterns detected → trigger AI             │ │ │
│  │  └──────────────┬───────────────────────────────────┘ │ │
│  │                 │                                      │ │
│  │                 ▼                                      │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │   AI Analyzer (Claude Haiku)                     │ │ │
│  │  │                                                  │ │ │
│  │  │   System Prompt:                                 │ │ │
│  │  │   "You are a senior engineer doing pair          │ │ │
│  │  │    programming. The developer just wrote [X].    │ │ │
│  │  │    Project rules: [principles.md]. Suggest            │ │ │
│  │  │    improvements. Be concise and actionable."     │ │ │
│  │  │                                                  │ │ │
│  │  │   Model: Claude Haiku (fast, cheap)             │ │ │
│  │  │   Fallback: Claude Sonnet (complex analysis)    │ │ │
│  │  └──────────────┬───────────────────────────────────┘ │ │
│  │                 │                                      │ │
│  │                 ▼                                      │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │   Suggestion Presenter                           │ │ │
│  │  │                                                  │ │ │
│  │  │   ┌──────────────────────────────────────────┐  │ │ │
│  │  │   │  Sidebar Panel (Primary UI)             │  │ │ │
│  │  │   │  - Categorized suggestions              │  │ │ │
│  │  │   │  - Expandable details                   │  │ │ │
│  │  │   │  - One-click apply                      │  │ │ │
│  │  │   │  - Dismissible                          │  │ │ │
│  │  │   └──────────────────────────────────────────┘  │ │ │
│  │  │   ┌──────────────────────────────────────────┐  │ │ │
│  │  │   │  Status Bar Indicator                   │  │ │ │
│  │  │   │  "🤖 Coach: 2 suggestions"             │  │ │ │
│  │  │   └──────────────────────────────────────────┘  │ │ │
│  │  │   ┌──────────────────────────────────────────┐  │ │ │
│  │  │   │  Code Lens (Inline - Optional)          │  │ │ │
│  │  │   │  Appears above problematic code         │  │ │ │
│  │  │   └──────────────────────────────────────────┘  │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Event Flow

```
Developer types code
       ↓
onDidChangeTextDocument fires
       ↓
Debounce (2 seconds)
       ↓
Context Analyzer runs
       ↓
Pattern Detector (fast, local)
       ↓
Pattern detected? → Yes
       ↓
AI Analyzer (Claude Haiku)
       ↓
Generate suggestion
       ↓
Update sidebar panel
       ↓
Show status bar notification (subtle)
       ↓
Developer can review/apply/dismiss
```

### Performance Strategy

**Critical**: Avoid slowing down the IDE

1. **Debouncing**:
   - Text changes: 2 seconds after typing stops
   - Diagnostics: 500ms after errors change
   - Saves: Immediate (good timing for analysis)

2. **Throttling**:
   - Max 1 analysis per 2 seconds
   - Queue suggestions if events fire rapidly

3. **Local Pattern Detection First**:
   - Fast regex/AST checks for common patterns
   - Only call AI if pattern detected
   - Reduces API calls by ~80%

4. **Incremental Analysis**:
   - Only analyze changed lines, not entire file
   - Use `contentChanges` from event

5. **Background Processing**:
   - Run analysis in extension host (separate process)
   - Don't block main UI thread

6. **Caching**:
   - Cache project rules (principles.md) in memory
   - Cache recent AI responses
   - Invalidate on file changes

## Key Features

### Priority 1: Type Safety Coach

**Triggers**:

- Type assertion detected (`as`, `any`, `!`, `Object.*`, `Reflect.*`)
- Broad type usage (`Record<string, unknown>`, `{ [key: string]: unknown }`)

**Suggestions**:

- Link to @typescript-practice.md
- Suggest type guard pattern
- Show example from codebase

### Priority 2: Test Reminder

**Triggers**:

- New function added to `.ts` file
- No corresponding `.test.ts` or `.spec.ts` file exists

**Suggestions**:

- "New function detected. Add a test? TDD from @principles.md"
- Generate test template
- Link to testing strategy docs

### Priority 3: Architecture Guide

**Triggers**:

- File created in unusual location
- Import from wrong layer (e.g., app importing from SDK internals)

**Suggestions**:

- "This looks like auth logic. Should it go in lib/auth/?"
- Link to architecture diagrams
- Suggest correct location

### Priority 4: Rules Enforcement

**Triggers**:

- ESLint error detected
- Pattern violates @principles.md (e.g., unused variable prefix `_`)

**Suggestions**:

- Explain why rule exists
- Show fix
- Link to relevant rule section

### Priority 5: Performance & Security

**Triggers**:

- Blocking I/O in async function
- Potential security issue (e.g., SQL injection pattern)
- Inefficient algorithm (e.g., nested loops over large arrays)

**Suggestions**:

- Explain issue
- Suggest alternative
- Link to best practices

## UI/UX Design

### Sidebar Panel (Primary Interface)

```
┌─────────────────────────────────────────┐
│  🤖 Pair Programming Coach              │
├─────────────────────────────────────────┤
│                                         │
│  💡 Type Safety (1)                     │
│  └─ auth.ts:42                          │
│     Type assertion detected             │
│     [View] [Apply Fix] [Dismiss]        │
│                                         │
│  📝 Testing (1)                         │
│  └─ middleware.ts:15                    │
│     New function, no test               │
│     [Generate Test] [Dismiss]           │
│                                         │
│  ✅ All caught up!                      │
│                                         │
│  Settings:                              │
│  ☑ Type safety                          │
│  ☑ Testing                              │
│  ☑ Architecture                         │
│  ☐ Performance (opt-in)                 │
│                                         │
│  [Pause for 1 hour]                     │
└─────────────────────────────────────────┘
```

### Status Bar Indicator

```
🤖 Coach: 2 suggestions  |  [Click to open panel]
```

**Interactions**:

- Click to open sidebar
- Shows count of active suggestions
- Green (all good) / Yellow (suggestions) / Red (critical issues)

### Code Lens (Inline - Optional)

```typescript
function createUser(data: unknown) {
  // ← 💡 Consider type guard
  const user = data as User; // ← ⚠️ Type assertion detected
  return user;
}
```

**Toggle**: Can be disabled in settings if too intrusive

### Notifications (Minimal)

**Only for critical issues**:

- Security vulnerabilities
- Build-breaking changes

**Otherwise**: Silent updates to sidebar

## Implementation Plan

### Phase 0: Research & Investigation (1 week)

**Goal**: Confirm technical feasibility and discover any Cursor-specific APIs

**Tasks**:

1. **Deep dive into VSCode Extension API**:
   - Read official documentation
   - Study existing extensions (CodeLens, Diagnostics providers)
   - Identify performance best practices

2. **Cursor-specific API research**:
   - Contact Cursor team (if possible)
   - Reverse-engineer from Cursor codebase
   - Test VSCode APIs in Cursor to confirm compatibility
   - Explore if Cursor Rules are accessible from extensions

3. **Competitive analysis**:
   - Study similar tools (GitHub Copilot, CodeWhisperer, Tabnine)
   - Identify what works well vs. what's annoying
   - Define differentiation strategy

4. **Performance benchmarking**:
   - Test `onDidChangeTextDocument` event frequency
   - Measure debounce impact
   - Estimate API costs (Claude Haiku calls)

**Acceptance**:

- ✅ VSCode Extension API fully understood
- ✅ Cursor-specific capabilities documented
- ✅ Performance strategy validated
- ✅ Competitive landscape mapped

### Phase 1: V0 Proof of Concept (2-3 weeks)

**Goal**: Minimal working extension that detects one pattern and shows one suggestion

**Scope** (MINIMAL):

- ✅ Detect type assertions (`as`) in TypeScript files
- ✅ Show suggestion in sidebar panel (hardcoded message)
- ✅ Status bar indicator
- ✅ Debouncing (2s after typing stops)
- ❌ NO AI integration yet (hardcoded responses)
- ❌ NO pattern detection (just type assertions)
- ❌ NO apply fix functionality
- ❌ NO settings panel

**Tasks**:

**Session 1: Extension Scaffold**

1. Set up VSCode extension project: `yo code`
2. Configure TypeScript, ESLint, and build tools
3. Implement activation command
4. Test "Hello World" extension

**Session 2: Event Listeners**

1. Implement `onDidChangeTextDocument` listener
2. Add debounce logic (2s delay)
3. Log file changes to console
4. Test performance with rapid typing

**Session 3: Pattern Detection (Local)**

1. Parse TypeScript AST using `typescript` library
2. Detect type assertions (`as` keyword)
3. Extract location (file, line, column)
4. Test on sample files

**Session 4: Sidebar Panel UI**

1. Create webview panel
2. Display hardcoded suggestion for detected pattern
3. Add dismiss button
4. Style with VSCode theme colors

**Session 5: Status Bar Indicator**

1. Add status bar item
2. Update count when suggestions change
3. Click handler to open sidebar
4. Test interaction

**Acceptance**:

- ✅ Extension detects type assertions in real-time
- ✅ Sidebar shows hardcoded suggestion
- ✅ Status bar updates with count
- ✅ No performance degradation
- ✅ Can be installed and tested in VSCode/Cursor

### Phase 2: AI Integration (2 weeks)

**Goal**: Replace hardcoded responses with Claude Haiku

**Tasks**:

**Session 1: Context Gathering**

1. Read project rules from `.agent/directives/principles.md`
2. Cache rules in memory
3. Extract relevant file context (±10 lines around issue)
4. Gather diagnostics (linter errors)

**Session 2: AI Prompt Engineering**

1. Design system prompt for "pair programming coach"
2. Define input structure (code snippet, rules, issue type)
3. Define output structure (suggestion, explanation, fix)
4. Test prompts manually with Claude API

**Session 3: Claude Integration**

1. Install `@anthropic-ai/sdk`
2. Implement AI analyzer function
3. Call Claude Haiku with gathered context
4. Parse and validate response
5. Handle errors gracefully

**Session 4: Response Presenter**

1. Update sidebar to show AI-generated suggestions
2. Add expandable details section
3. Format code snippets nicely
4. Add "Explain more" button (calls AI again with more detail)

**Session 5: Testing & Optimization**

1. Test on various code patterns
2. Measure API costs per suggestion
3. Implement caching for similar issues
4. Optimize prompt to reduce tokens

**Acceptance**:

- ✅ AI generates context-aware suggestions
- ✅ Responses reference project rules
- ✅ Suggestions are actionable and concise
- ✅ API costs under control (<$0.10 per hour of coding)

### Phase 3: Pattern Expansion (2-3 weeks)

**Goal**: Support 5 common patterns (type safety, tests, architecture, rules, performance)

**Tasks**:

**Session 1: Test Detection**

1. Detect new function declarations
2. Check if corresponding test file exists
3. Suggest test creation with template

**Session 2: Architecture Detection**

1. Detect file creation in unusual locations
2. Analyze import statements for layer violations
3. Suggest correct architecture based on project structure

**Session 3: Rules Detection**

1. Parse @principles.md into structured rules
2. Map ESLint rules to project rules
3. Detect violations in real-time
4. Link suggestions to specific rule sections

**Session 4: Performance Detection**

1. Detect blocking I/O in async functions
2. Identify nested loops over large arrays
3. Flag potential memory leaks

**Session 5: Integration & Testing**

1. Integrate all pattern detectors
2. Prioritize suggestions (critical first)
3. Test on real codebase
4. Gather user feedback

**Acceptance**:

- ✅ 5 pattern types working reliably
- ✅ Suggestions prioritized correctly
- ✅ No false positives (or very few)
- ✅ User feedback positive

### Phase 4: Advanced Features (3-4 weeks)

**Goal**: Apply fixes, settings panel, Cursor-specific integration

**Tasks**:

**Session 1: Apply Fix Functionality**

1. Generate code patches from AI suggestions
2. Implement `workspace.applyEdit` to apply fixes
3. Add preview mode (show diff before applying)
4. Test with various fix types

**Session 2: Settings Panel**

1. Create settings UI in sidebar
2. Toggle pattern detectors on/off
3. Adjust sensitivity (conservative vs. aggressive)
4. Pause for N hours

**Session 3: Cursor-Specific Integration**

1. Integrate with Cursor Rules (if accessible)
2. Add to Cursor's AI panel (if possible)
3. Test compatibility with Cursor features

**Session 4: Code Lens (Inline Suggestions)**

1. Implement CodeLens provider
2. Show inline suggestions above code
3. Make toggleable in settings
4. Test performance impact

**Session 5: Polish & Documentation**

1. Add comprehensive README
2. Create demo video
3. Write usage guide
4. Prepare for internal release

**Acceptance**:

- ✅ One-click fix application works
- ✅ Settings panel fully functional
- ✅ Cursor integration (if APIs available)
- ✅ Code Lens optional feature works
- ✅ Documentation complete

### Phase 5: Production Hardening (2 weeks)

**Goal**: Make extension stable, performant, and production-ready

**Tasks**:

**Session 1: Error Handling**

1. Graceful degradation if AI unavailable
2. Retry logic for API failures
3. User-friendly error messages
4. Telemetry for debugging

**Session 2: Performance Optimization**

1. Profile extension performance
2. Optimize AST parsing
3. Reduce memory footprint
4. Test with large files (>10,000 lines)

**Session 3: User Experience**

1. Refine suggestion wording based on feedback
2. Add keyboard shortcuts
3. Improve visual design
4. Add dark mode support (if needed)

**Session 4: Testing**

1. Write unit tests for pattern detectors
2. Write integration tests for AI flow
3. Test on multiple projects
4. Gather beta user feedback

**Session 5: Release Preparation**

1. Publish to VSCode marketplace (if appropriate)
2. Create distribution package for Cursor
3. Write release notes
4. Plan rollout strategy

**Acceptance**:

- ✅ Extension stable with no crashes
- ✅ Performance acceptable (<100ms overhead)
- ✅ User feedback very positive
- ✅ Ready for production use

## Configuration

### Extension Settings (settings.json)

```json
{
  "pairProgrammingCoach.enabled": true,
  "pairProgrammingCoach.debounceMs": 2000,
  "pairProgrammingCoach.model": "claude-haiku",
  "pairProgrammingCoach.patterns": {
    "typeSafety": true,
    "testing": true,
    "architecture": true,
    "rules": true,
    "performance": false, // Opt-in
    "security": true
  },
  "pairProgrammingCoach.ui": {
    "showStatusBar": true,
    "showCodeLens": false, // Opt-in
    "showNotifications": false // Only critical
  },
  "pairProgrammingCoach.ai": {
    "provider": "anthropic",
    "model": "claude-haiku-4",
    "maxTokens": 500,
    "temperature": 0.3
  }
}
```

### Project Rules Integration

**Automatic Detection**:

- `.agent/directives/principles.md`
- `.agent/directives/typescript-practice.md`
- `.cursorrules` (Cursor-specific)
- `.eslintrc` (ESLint rules)

**Behavior**:

- Extension loads rules on activation
- Watches for changes, reloads if modified
- Uses rules as context for AI suggestions

## Success Criteria

### V0 POC Success

1. ✅ Detects type assertions in TypeScript files
2. ✅ Shows hardcoded suggestion in sidebar
3. ✅ Debouncing works (no performance issues)
4. ✅ Can be installed in VSCode/Cursor
5. ✅ User can review and dismiss suggestions

### Full Extension Success

1. ✅ Detects 5+ code patterns reliably
2. ✅ AI suggestions are actionable and context-aware
3. ✅ Apply fix works for most suggestions
4. ✅ Performance overhead <100ms per keystroke
5. ✅ User feedback: "This helps me code better"
6. ✅ Adoption: 80%+ of team uses it regularly
7. ✅ Cost: <$5 per developer per month (API calls)

## Cost Estimation

### API Costs (Claude Haiku)

**Assumptions**:

- Developer types for 4 hours per day
- Suggestion triggered every 5 minutes (48 per day)
- Average 500 tokens per request
- Claude Haiku: $0.25 per 1M input tokens, $1.25 per 1M output tokens

**Calculation**:

- Input: 48 requests × 500 tokens = 24,000 tokens/day
- Output: 48 requests × 300 tokens = 14,400 tokens/day
- Daily cost: (24k × $0.25 / 1M) + (14.4k × $1.25 / 1M) = $0.024/day
- Monthly cost: $0.024 × 22 working days = **$0.53 per developer/month**

**Very affordable!**

### Development Costs

**Time Estimates**:

- Phase 0 (Research): 40 hours
- Phase 1 (V0 POC): 80 hours
- Phase 2 (AI Integration): 80 hours
- Phase 3 (Pattern Expansion): 120 hours
- Phase 4 (Advanced Features): 160 hours
- Phase 5 (Production Hardening): 80 hours

**Total**: ~560 hours (~3-4 months for one developer)

## Risks and Mitigation

**Risk**: Extension slows down IDE

- **Mitigation**: Aggressive debouncing, local pattern detection first, background processing, performance benchmarking

**Risk**: AI suggestions are irrelevant or annoying

- **Mitigation**: Extensive prompt engineering, user feedback loops, toggleable features, "Pause for 1 hour" option

**Risk**: High API costs

- **Mitigation**: Use Haiku (cheap model), caching, local pattern detection to reduce API calls by 80%

**Risk**: Cursor doesn't support VSCode extensions fully

- **Mitigation**: Test early on Cursor, fall back to VSCode-only if needed, reach out to Cursor team for support

**Risk**: Security/privacy concerns (sending code to AI)

- **Mitigation**: Make it opt-in, allow on-premise Claude deployment, sanitize code before sending, clear privacy policy

**Risk**: Users ignore suggestions

- **Mitigation**: Keep suggestions concise and actionable, prioritize high-impact issues, show value metrics ("You've fixed 42 type safety issues!")

## Future Enhancements

- **Team Learning**: Aggregate common patterns across team, share best suggestions
- **Custom Rules**: Allow teams to define custom patterns and suggestions
- **Multi-Language Support**: Expand beyond TypeScript (Python, Go, Rust)
- **Integration with Git**: Suggest fixes before commit, integrate with PR review
- **Metrics Dashboard**: Show developer improvement over time
- **Voice Mode**: Verbal suggestions via text-to-speech (accessibility)
- **Mobile Companion**: Review suggestions on mobile device
- **Gamification**: Badges for following best practices

## Related Plans

- `icebox/agent-lifecycle-automation.md` - Automated quality gates (complementary)
- `architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md` - Observability patterns to detect (promoted from icebox)
- `sdk-and-mcp-enhancements/comprehensive-mcp-enhancement-plan.md` - MCP tools that could benefit from real-time coaching
- `.agent/directives/principles.md` - Rules the coach enforces
- `.agent/directives/typescript-practice.md` - Type safety patterns to detect

## References

- [VSCode Extension API](https://code.visualstudio.com/api)
- [VSCode Extension Samples](https://github.com/microsoft/vscode-extension-samples)
- [Cursor Documentation](https://docs.cursor.com/)
- [Cursor AI Code Tracking API](https://docs.cursor.com/en/account/teams/ai-code-tracking-api)
- [Anthropic Claude API](https://docs.anthropic.com/en/api/getting-started)
- [CodeWatcher Research Paper](https://arxiv.org/abs/2510.11536) - Real-time code monitoring

## Next Steps

1. ✅ **Research complete** - VSCode and Cursor capabilities confirmed
2. ⏳ **Plan created** - This document
3. 🔜 **Phase 0** - Deep dive into VSCode Extension API, Cursor-specific investigation
4. 🔜 **Phase 1** - Build V0 POC (detect type assertions, show hardcoded suggestion)
5. 🔜 **Iterate** - Based on feedback and learnings

**Recommendation**: Start with Phase 0 research when time permits. This is a high-value feature but not blocking any current work.
