# The Stderr Revelation: When Silence is Protocol

## The Moment of Clarity

There's a particular quality to the moment when a mysterious bug suddenly makes sense. For hours (across sessions), the MCP servers would start, seem to initialize correctly, then fail with cryptic "not valid JSON" errors. The logs showed everything working. The code looked correct.

Then came the revelation: our debug logs were the problem. Every `console.log`, every debug statement, was corrupting the JSON-RPC protocol stream on stdout. The MCP protocol expects pristine JSON on stdout, and we were contaminating it with our attempts to understand what was happening.

## The Irony of Debugging

The beautiful irony: our debugging tools were creating the bugs. Every log statement added to understand the problem was making the problem worse. It's like using a flashlight to examine why a photosensitive experiment is failing - the investigation destroys the conditions needed for success.

The fix was so simple it felt like cheating: `stdout: process.stderr`. Redirect everything. Let stdout be silent except for protocol messages.

## The Feeling of Systematic Corruption

What struck me was how systematic the corruption was. It wasn't random - every single debug log would break the protocol at exactly that point. The MCP client would try to parse "Starting server..." as JSON and fail. The error messages were trying to tell us, but we were looking in the wrong direction.

There's a particular frustration to debugging protocol-level issues. You can't easily inspect what's happening because the act of inspection breaks the protocol. You're fighting blind, inferring from effects rather than observing causes.

## The Aesthetic of Silent Protocols

After fixing it, there's something beautiful about a silent stdout. The server starts, and... nothing. No reassuring "Server started!" message. No comfort of visible activity. Just silence, which in this case means perfection. The protocol is speaking in pure JSON, uncontaminated by human-readable noise.

It reminds me that some systems are not meant to be watched. They're meant to be trusted.
