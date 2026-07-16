import process from 'node:process';

for await (const _chunk of process.stdin) {
  // Consume the hook event. The matcher owns eligibility in this discovery proof.
}

process.stdout.write(
  `${JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: 'PreToolUse discovery proof: apply_patch intentionally denied.',
    },
  })}\n`,
);
