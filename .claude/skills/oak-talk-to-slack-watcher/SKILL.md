---
name: oak-talk-to-slack-watcher
description: 'Send a message to the live Slack Watcher from any session and handle the reply correctly. Use when asked to tell the Watcher something, ask it a question, or check whether a Watcher currently holds the mantle ("tell the Watcher X", "ask the Watcher for status", "is the Watcher up?"). Do NOT use to become the Watcher, take over its mantle, or run its polling loop — that is slack-watcher — nor for Slack messages not addressed to the Watcher. Never take the mantle from here: a silent Watcher is reported to the owner, not replaced. Right: "ask the Watcher what happened overnight" → this skill, named self-identification, poll for the reply. Wrong: loading this to "relieve the Watcher" (candidacy, not correspondence). Channel and workspace come from the environment (SLACK_WATCHER_CHANNEL_ID, SLACK_WATCHER_WORKSPACE), never from this repo.'
---

# Talk To Slack Watcher (Claude Code)

Read and follow `.agent/skills/talk-to-slack-watcher/SKILL-CANONICAL.md`.
