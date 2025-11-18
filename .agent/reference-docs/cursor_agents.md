# Hooks

Hooks let you observe, control, and extend the agent loop using custom scripts. Hooks are spawned processes that communicate over stdio using JSON in both directions. They run before or after defined stages of the agent loop and can observe, block, or modify behavior.

With hooks, you can:

- Run formatters after edits
- Add analytics for events
- Scan for PII or secrets
- Gate risky operations (e.g., SQL writes)

## Quickstart

Create a `hooks.json` file in your home directory at `~/.cursor/hooks.json`

```
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [{ "command": "./hooks/format.sh" }]
  }
}
```

Create your hook script at `~/.cursor/hooks/format.sh`:

```
#!/bin/bash
# Read input, do something, exit 0
cat > /dev/null
exit 0
```

Make it executable:

```
chmod +x ~/.cursor/hooks/format.sh
```

Restart Cursor. Your hook now runs after every file edit.

## Examples

hooks.jsonaudit.shblock-git.shredact-secrets.sh```
{
"version": 1,
"hooks": {
"beforeShellExecution": [
{
"command": "./hooks/audit.sh"
},
{
"command": "./hooks/block-git.sh"
}
],
"beforeMCPExecution": [
{
"command": "./hooks/audit.sh"
}
],
"afterShellExecution": [
{
"command": "./hooks/audit.sh"
}
],
"afterMCPExecution": [
{
"command": "./hooks/audit.sh"
}
],
"beforeReadFile": [
{
"command": "./hooks/redact-secrets.sh"
}
],
"afterFileEdit": [
{
"command": "./hooks/audit.sh"
}
],
"beforeSubmitPrompt": [
{
"command": "./hooks/audit.sh"
}
],
"stop": [
{
"command": "./hooks/audit.sh"
}
]
}
}

```

## Configuration

Define hooks in a `hooks.json` file. Configuration can exist at multiple levels; higher-priority sources override lower ones:

```

~/.cursor/
├── hooks.json
└── hooks/
├── audit.sh
├── block-git.sh
└── redact-secrets.sh

```

- Home Directory (User-specific):
- `~/.cursor/hooks.json`
- Global (Enterprise-managed):
- macOS: `/Library/Application Support/Cursor/hooks.json`
- Linux/WSL: `/etc/cursor/hooks.json`
- Windows: `C:\\ProgramData\\Cursor\\hooks.json`

The `hooks` object maps hook names to arrays of hook definitions. Each definition currently supports a `command` property that can be a shell string, an absolute path, or a path relative to the `hooks.json` file.

### Configuration file

```

{
"version": 1,
"hooks": {
"beforeShellExecution": [{ "command": "./script.sh" }],
"afterShellExecution": [{ "command": "./script.sh" }],
"afterMCPExecution": [{ "command": "./script.sh" }],
"afterFileEdit": [{ "command": "./format.sh" }]
}
}

```

## Team Distribution

Hooks can be distributed to team members using MDM tools or Cursor's cloud distribution system.

### MDM Distribution

Distribute hooks across your organization using Mobile Device Management (MDM) tools. Place the `hooks.json` file and hook scripts in the target directories on each machine.

**User home directory** (per-user distribution):

- `~/.cursor/hooks.json`
- `~/.cursor/hooks/` (for hook scripts)

**Global directories** (system-wide distribution):

- macOS: `/Library/Application Support/Cursor/hooks.json`
- Linux/WSL: `/etc/cursor/hooks.json`
- Windows: `C:\\ProgramData\\Cursor\\hooks.json`

Note: MDM-based distribution is fully managed by your organization. Cursor does not deploy or manage files through your MDM solution. Ensure your internal IT or security team handles configuration, deployment, and updates in accordance with your organization's policies.

### Cloud Distribution (Enterprise Only)

Enterprise teams can use Cursor's native cloud distribution to automatically sync hooks to all team members. Configure hooks in the [web dashboard](https://cursor.com/dashboard?tab=team-content&section=hooks). Cursor automatically delivers configured hooks to all client machines when team members log in.

Cloud distribution provides:

- Automatic synchronization to all team members (every thirty minutes)
- Operating system targeting for platform-specific hooks
- Centralized management through the dashboard

Enterprise administrators can create, edit, and manage team hooks from the dashboard without requiring access to individual machines.

## Reference

### Common schema

#### Input (all hooks)

```

{
"conversation_id": "string",
"generation_id": "string",
"hook_event_name": "string",
"workspace_roots": ["<path>"]
}

```

### Hook events

#### beforeShellExecution / beforeMCPExecution

Called before any shell command or MCP tool is executed. Return a permission decision.

```

// beforeShellExecution input
{
"command": "<full terminal command>",
"cwd": "<current working directory>"
}

// beforeMCPExecution input
{
"tool_name": "<tool name>",
"tool_input": "<json params>"
}
// Plus either:
{ "url": "<server url>" }
// Or:
{ "command": "<command string>" }

// Output
{
"permission": "allow" | "deny" | "ask",
"user_message": "<message shown in client>",
"agent_message": "<message sent to agent>"
}

```

#### afterShellExecution

Fires after a shell command executes; useful for auditing or collecting metrics from command output.

```

// Input
{
"command": "<full terminal command>",
"output": "<full terminal output>"
}

```

#### afterMCPExecution

Fires after an MCP tool executes; includes the tool's input parameters and full JSON result.

```

// Input
{
"tool_name": "<tool name>",
"tool_input": "<json params>",
"result_json": "<tool result json>"
}

```

#### afterFileEdit

Fires after a file is edited; useful for formatters or accounting of agent-written code.

```

// Input
{
"file_path": "<absolute path>",
"edits": [{ "old_string": "<search>", "new_string": "<replace>" }]
}

```

#### beforeReadFile

Enable redaction or access control before the agent reads a file. Includes any prompt attachments for auditing rules inclusion.

```

// Input
{
"file_path": "<absolute path>",
"content": "<file contents>",
"attachments": [
{
"type": "rule",
"file_path": "<absolute path>"
}
]
}

// Output
{
"permission": "allow" | "deny"
}

```

#### beforeSubmitPrompt

Called right after user hits send but before backend request. Can prevent submission.

```

// Input
{
"prompt": "<user prompt text>",
"attachments": [
{
"type": "file" | "rule",
"filePath": "<absolute path>"
}
]
}

// Output
{
"continue": true | false
}

```

#### afterAgentResponse

Called after the agent has completed an assistant message.

```

// Input
{
"text": "<assistant final text>"
}

```

#### stop

Called when the agent loop ends. Can optionally auto-submit a follow-up user message to keep iterating.

```

// Input
{
"status": "completed" | "aborted" | "error",
"loop_count": 0
}

```

```

// Output
{
"followup_message": "<message text>"
}

```

- The optional `followup_message` is a string. When provided and non-empty, Cursor will automatically submit it as the next user message. This enables loop-style flows (e.g., iterate until a goal is met).
- The `loop_count` field indicates how many times the stop hook has already triggered an automatic follow-up for this conversation (starts at 0). To prevent infinite loops, a maximum of 5 auto follow-ups is enforced.

## Troubleshooting

**I'm on SSH, how do I use hooks?**

Remote SSH is not yet supported

**How to confirm hooks are active**

There is a Hooks tab in Cursor Settings to debug configured and executed hooks, as well as a Hooks output channel to see errors.

**If hooks are not working**

- Restart Cursor to ensure the hooks service is running.
- Ensure hook script paths are relative to `hooks.json` when using relative paths.
```
