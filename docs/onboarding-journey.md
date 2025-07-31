# Developer Onboarding Journey

Welcome! This guide provides a structured path for experienced developers new to MCP servers and agentic workflows. Follow this journey to build understanding progressively.

## 🎯 Learning Objectives

By the end of this journey, you'll understand:

- What MCP servers are and why they matter
- How AI agents interact with external tools
- The architecture of our Notion integration
- How to contribute effectively to the project

## 📚 The Journey

### Day 1: Understanding the Problem Space (2-3 hours)

#### 1. Start with Why

**Read**: [README.md](../README.md) - Get the project overview

- Focus on: What problem does this solve?
- Key insight: AI assistants need safe, controlled access to external tools

#### 2. Understand MCP Conceptually

**Read**: Start with our curated references

- [MCP Documentation for Agents](../.agent/reference/mcp-docs-for-agents.md) - Curated overview
- [Quick Start Server Development](https://modelcontextprotocol.io/quickstart/server) - Official guide
- [Building MCP with LLMs](https://modelcontextprotocol.io/tutorials/building-mcp-with-llms) - Human-friendly tutorial

- Focus on: Resources, Tools, and Prompts concepts
- Key insight: MCP is like REST API but for AI-to-tool communication

#### 3. See It In Action

**Do**: Install and try the server

```bash
# Clone, install, and run
git clone <repo>
pnpm install
cp .env.example .env  # Add a Notion API key
pnpm dev
```

**Try**: Use with Claude Desktop (if available) or review the [API Reference](api-reference.md)

- Make a few tool calls
- Observe the request/response format

### Day 2: Architecture Deep Dive (3-4 hours)

#### 1. System Architecture

**Read**: [High Level Architecture](high-level-architecture.md)

- Focus on: The layer diagram and data flow
- Key insight: Clean architecture with pure functions at the core

#### 2. Code Exploration

**Explore** the codebase in this order:

1. **Entry Point**: `src/index.ts`
   - How does the server start?
   - What's stdio transport?

2. **Server Setup**: `src/server.ts`
   - How are handlers registered?
   - What's the MCP protocol layer?

3. **Pure Business Logic**: `src/notion/transformers.ts`
   - Notice: No side effects, fully testable
   - Example: How PII scrubbing works

4. **Integration Points**: `src/notion/client.ts`
   - How is the Notion SDK wrapped?
   - Why abstraction matters

#### 3. Understanding Agentic Patterns

**Read**: [Safety and Security](safety-and-security.md)

- Focus on: Why read-only by default?
- Key insight: Agents need guardrails, humans need control

### Day 3: Development Practices (2-3 hours)

#### 1. Testing Philosophy

**Read**: [Testing and Development Strategy](testing-and-development-strategy.md)

- Focus on: Test pyramid and TDD approach
- Key insight: Pure functions enable comprehensive testing

#### 2. Run and Write Tests

**Do**: Run the test suite

```bash
pnpm test          # Run unit & integration tests
pnpm test:watch    # Watch mode for TDD
```

**Try**: Write a simple test

1. Pick a pure function in `src/utils/`
2. Write a test following existing patterns
3. Use TDD: Red → Green → Refactor

#### 3. Development Workflow

**Read**: [Development Practice](development-practice.md)

- Focus on: Quality gates and Git workflow
- Try: Make a small change and run quality gates

### Day 4: Making Contributions (3-4 hours)

#### 1. Contribution Setup

**Read**: [CONTRIBUTING.md](../CONTRIBUTING.md)

- Set up your development environment
- Understand commit conventions

#### 2. Your First Contribution

**Good first issues**:

1. **Documentation**: Improve examples in API Reference
2. **Testing**: Add edge case tests for existing functions
3. **Refactoring**: Extract a pure function from integration code

#### 3. Understanding the AI Agent Perspective

**Exercise**: Think like an AI agent

- You can only call defined tools
- You have no context between calls
- You must handle errors gracefully

**Read** some E2E tests to see real usage patterns

### Day 5: Advanced Topics (2-3 hours)

#### 1. MCP Protocol Details

**Explore**:

- `src/mcp/handlers.ts` - Protocol handling
- `src/mcp/types.ts` - Type definitions

**Exercise**: Trace a request

- Pick a tool (e.g., `notion-search`)
- Follow the code path from request to response
- Note each transformation

#### 2. Future Enhancements

**Read**: [Phase 2.5 Implementation Plan](../.agent/plans/phase-2.5-implementation-plan.md)

- Understand planned improvements
- See where you could contribute

#### 3. Architectural Decisions

**Review**: ADRs in [High Level Architecture](high-level-architecture.md)

- Why ESM only?
- Why wrap the Notion SDK?
- Why automatic PII scrubbing?

## 🎓 Knowledge Checkpoints

After each day, you should be able to answer:

### Day 1 Checkpoint

- [ ] What is MCP and why do AI agents need it?
- [ ] What's the difference between a Resource and a Tool?
- [ ] How does an AI assistant use this server?

### Day 2 Checkpoint

- [ ] How does data flow through the architecture layers?
- [ ] Why are most functions pure?
- [ ] How does the server ensure safety?

### Day 3 Checkpoint

- [ ] What's the difference between unit and integration tests?
- [ ] How does TDD work in this project?
- [ ] What are the quality gates?

### Day 4 Checkpoint

- [ ] How do you structure a good commit message?
- [ ] Where would you add a new tool?
- [ ] How do you test MCP handlers?

### Day 5 Checkpoint

- [ ] How would you add pagination to a tool?
- [ ] What makes a good abstraction layer?
- [ ] Where would caching be most beneficial?

## 🚀 Next Steps

### Immediate Contributions

1. **Bug Fixes**: Check GitHub issues
2. **Test Coverage**: Add missing edge cases
3. **Documentation**: Improve examples

### Medium-Term Projects

1. **Performance**: Implement caching where noted
2. **Features**: Add new tools from Phase 2.5 plan
3. **Refactoring**: Extract more pure functions

### Long-Term Vision

1. **Write Operations**: Design confirmation UI
2. **Real-time Updates**: WebSocket support
3. **Advanced Integrations**: Multi-workspace support

## 📖 Additional Resources

### MCP Deep Dives

- **Start Here**: [Reference Documentation](../.agent/reference/README.md) - Curated links and guides
- [MCP TypeScript SDK](../.agent/reference/mcp-typescript-sdk-readme.md) - SDK we're using
- [MCP Specification](https://spec.modelcontextprotocol.org) - Full protocol spec
- [Building MCP Servers](https://modelcontextprotocol.org/tutorials) - More tutorials

### Notion API

- [Notion API Overview](../.agent/reference/notion-api-overview.md) - Our curated guide
- [Notion SDK Documentation](../.agent/reference/notion-sdk-readme.md) - SDK reference
- [Notion API Reference](https://developers.notion.com) - Official docs
- [Notion SDK Examples](https://github.com/makenotion/notion-sdk-js) - Code examples

### Agentic Workflows

- [Claude Configuration Docs](../.agent/reference/claude-configuration-docs.md) - How to configure MCP in Claude
- [Claude MCP Documentation](../.agent/reference/claude-mcp-docs.md) - Claude's MCP implementation
- [Anthropic's Claude Documentation](https://docs.anthropic.com) - General Claude docs
- [Best Practices for Tool Use](https://docs.anthropic.com/claude/docs/tool-use) - AI tool usage patterns

## 💡 Pro Tips

1. **Use the AI**: Ask Claude about the codebase while developing
2. **Read Tests**: Tests document behavior better than comments
3. **Think Safety**: Always consider what could go wrong
4. **Pure First**: Can this be a pure function?
5. **Type Everything**: The compiler is your friend

## 🤝 Getting Help

- **Quick Questions**: Check [Troubleshooting](troubleshooting.md)
- **Design Decisions**: Review ADRs in architecture docs
- **Code Questions**: Read the tests for that module
- **Stuck?**: Create a GitHub issue with context

Welcome to the team! We're excited to see your contributions. 🎉
