# Testing MCP Authentication

We need to validate the auth flow.

Please start the dev server in observability mode `pnpm dev:observe`, as you can see from the command it will output all logs to file. Leave it running in the background.

In a new terminal, start the MCP Inspector `npx @modelcontextprotocol/inspector@latest`. Make sure it is similarly outputting logs to file.

Then, use the Browser tool to open the Inspector, and connect to the dev server. When there is a prompt to authenticate with an OAuth provider, I will enter my details, and then you take back control and complete the validation.

Does that make sense?
