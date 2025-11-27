original doc: <https://developers.openai.com/apps-sdk/build/auth>

# Authentication

## Authenticate your users

Many Apps SDK apps can operate in a read-only, anonymous mode, but anything that exposes customer-specific data or write actions should authenticate users.

You can integrate with your own authorization server when you need to connect to an existing backend or share data between users.

## Custom auth with OAuth 2.1

For an authenticated MCP server, you are expected to implement a OAuth 2.1 flow that conforms to the [MCP authorization spec](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization).

### Components

- **Resource server** – your MCP server, which exposes tools and verifies access tokens on each request.
- **Authorization server** – your identity provider (Auth0, Okta, Cognito, or a custom implementation) that issues tokens and publishes discovery metadata.
- **Client** – ChatGPT acting on behalf of the user. It supports dynamic client registration and PKCE.

### MCP authorization spec requirements

- Host protected resource metadata on your MCP server
- Publish OAuth metadata from your authorization server
- Echo the `resource` parameter throughout the OAuth flow
- Advertise PKCE support for ChatGPT

Here is what the spec expects, in plain language.

#### Host protected resource metadata on your MCP server

- You need an HTTPS endpoint such as `GET https://your-mcp.example.com/.well-known/oauth-protected-resource` (or advertise the same URL in a `WWW-Authenticate` header on `401 Unauthorized` responses) so ChatGPT knows where to fetch your metadata.
- That endpoint returns a JSON document describing the resource server and its available authorization servers:

```json
{
  "resource": "https://your-mcp.example.com",
  "authorization_servers": ["https://auth.yourcompany.com"],
  "scopes_supported": ["files:read", "files:write"],
  "resource_documentation": "https://yourcompany.com/docs/mcp"
}
```

- Key fields you must populate:
  - `resource`: the canonical HTTPS identifier for your MCP server. ChatGPT sends this exact value as the `resource` query parameter during OAuth.
  - `authorization_servers`: one or more issuer base URLs that point to your identity provider. ChatGPT will try each to find OAuth metadata.
  - `scopes_supported`: optional list that helps ChatGPT explain the permissions it is going to ask the user for.
  - Optional extras from [RFC 9728](https://datatracker.ietf.org/doc/html/rfc9728) such as `resource_documentation`, `token_endpoint_auth_methods_supported`, or `introspection_endpoint` make it easier for clients and admins to understand your setup.

When you block a request because it is unauthenticated, return a challenge like:

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer resource_metadata="https://your-mcp.example.com/.well-known/oauth-protected-resource",
                         scope="files:read"
```

That single header lets ChatGPT discover the metadata URL even if it has not seen it before.

#### Publish OAuth metadata from your authorization server

- Your identity provider must expose one of the well-known discovery documents so ChatGPT can read its configuration:
  - OAuth 2.0 metadata at `https://auth.yourcompany.com/.well-known/oauth-authorization-server`
  - OpenID Connect metadata at `https://auth.yourcompany.com/.well-known/openid-configuration`
- Each document answers three big questions for ChatGPT: where to send the user, how to exchange codes, and how to register itself. A typical response looks like:

```json
{
  "issuer": "https://auth.yourcompany.com",
  "authorization_endpoint": "https://auth.yourcompany.com/oauth2/v1/authorize",
  "token_endpoint": "https://auth.yourcompany.com/oauth2/v1/token",
  "registration_endpoint": "https://auth.yourcompany.com/oauth2/v1/register",
  "jwks_uri": "https://auth.yourcompany.com/oauth2/v1/keys",
  "code_challenge_methods_supported": ["S256"],
  "scopes_supported": ["files:read", "files:write"]
}
```

- Fields that must be correct:
  - `authorization_endpoint`, `token_endpoint`, `jwks_uri`: the URL trio ChatGPT needs to run the OAuth authorization-code + PKCE flow end to end.
  - `registration_endpoint`: enables dynamic client registration (DCR) so ChatGPT can mint a dedicated `client_id` per connector.
  - `code_challenge_methods_supported`: must include `S256`, otherwise ChatGPT will refuse to proceed because PKCE appears unsupported.
  - Optional fields follow [RFC 8414](https://datatracker.ietf.org/doc/html/rfc8414) / [OpenID Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html); include whatever helps your administrators configure policies.

#### Redirect URL

ChatGPT completes the OAuth flow by redirecting to `https://chatgpt.com/connector_platform_oauth_redirect`. Add that production redirect URL to your authorization server's allowlist so the authorization code can be returned successfully.

#### Echo the `resource` parameter throughout the OAuth flow

- Expect ChatGPT to append `resource=https%3A%2F%2Fyour-mcp.example.com` to both the authorization and token requests. This ties the token back to the protected resource metadata shown above.
- Configure your authorization server to copy that value into the access token (commonly the `aud` claim) so your MCP server can verify the token was minted for it and nobody else.
- If a token arrives without the expected audience or scopes, reject it and rely on the `WWW-Authenticate` challenge to prompt ChatGPT to re-authorize with the correct parameters.

#### Advertise PKCE support for ChatGPT

- ChatGPT, acting as the MCP client, performs the authorization-code flow with PKCE using the `S256` code challenge so intercepted authorization codes cannot be replayed by an attacker. That protection is why the MCP authorization spec mandates PKCE.
- Your authorization server metadata therefore needs to list `code_challenge_methods_supported` (or equivalent) including `S256`. If that field is missing, ChatGPT will refuse to complete the flow because it cannot confirm PKCE support.

### OAuth flow

Provided that you have implemented the MCP authorization spec delineated above, the OAuth flow will be as follows:

1. ChatGPT queries your MCP server for protected resource metadata.

![](/images/apps-sdk/protected_resource_metadata.png)

2. ChatGPT registers itself via dynamic client registration with your authorization server using the `registration_endpoint` and obtains a `client_id`.

![](/images/apps-sdk/client_registration.png)

3. When the user first invokes a tool, the ChatGPT client launches the OAuth authorization code + PKCE flow. The user authenticates and consents to the requested scopes.

![](/images/apps-sdk/preparing_authorization.png)

4. ChatGPT exchanges the authorization code for an access token and attaches it to subsequent MCP requests (`Authorization: Bearer <token>`).

![](/images/apps-sdk/auth_complete.png)

5. Your server verifies the token on each request (issuer, audience, expiration, scopes) before executing the tool.

### Client registration

The MCP spec currently requires dynamic client registration (DCR). This means that each time ChatGPT connects, it registers a fresh OAuth client with your authorization server, obtains a unique `client_id`, and uses that identity during token exchange. The downside of this approach is that it can generate thousands of short-lived clients—often one per user session.

To address this issue, the MCP council is currently advancing [Client Metadata Documents (CMID)](https://blog.modelcontextprotocol.io/posts/client_registration/). In the CMID model, ChatGPT will publish a stable document (for example `https://openai.com/chatgpt.json`) that declares its OAuth metadata and identity. Your authorization server can fetch the document over HTTPS, pin it as the canonical client record, and enforce policies such as redirect URI allowlists or rate limits without relying on per-session registration. CMID is still in draft, so continue supporting DCR until CIMD has landed.

### Client identification

A frequent question is how your MCP server can confirm that a request actually comes from ChatGPT. Today the only reliable control is network-level filtering, such as allowlisting ChatGPT’s [published egress IP ranges](https://openai.com/chatgpt-connectors.json). ChatGPT does **not** support machine-to-machine OAuth grants such as client credentials, service accounts, or JWT bearer assertions, nor can it present custom API keys or mTLS certificates.

Once rolled out, CMID directly addresses the client identification problem by giving you a signed, HTTPS-hosted declaration of ChatGPT’s identity.

### Choosing an identity provider

Most OAuth 2.1 identity providers can satisfy the MCP authorization requirements once they expose a discovery document, allow dynamic client registration, and echo the `resource` parameter into issued tokens.

We _strongly_ recommend that you use an existing established identity provider rather than implementing authentication from scratch yourself.

Here are instructions for some popular identity providers.

#### Auth0

- [Guide to configuring Auth0 for MCP authorization](https://github.com/openai/openai-mcpkit/blob/main/python-authenticated-mcp-server-scaffold/README.md#2-configure-auth0-authentication)

#### Stytch

- [Guide to configuring Stytch for MCP authorization](https://stytch.com/docs/guides/connected-apps/mcp-server-overview)
- [Overview guide to MCP authorization](https://stytch.com/blog/MCP-authentication-and-authorization-guide/)
- [Overview guide to MCP authorization specifically for Apps SDK](https://stytch.com/blog/guide-to-authentication-for-the-openai-apps-sdk/)

### Implementing token verification

When the OAuth flow finishes, ChatGPT simply attaches the access token it received to subsequent MCP requests (`Authorization: Bearer …`). Once a request reaches your MCP server you must assume the token is untrusted and perform the full set of resource-server checks yourself—signature validation, issuer and audience matching, expiry, replay considerations, and scope enforcement. That responsibility sits with you, not with ChatGPT.

In practice you should:

- Fetch the signing keys published by your authorization server (usually via JWKS) and verify the token’s signature and `iss`.
- Reject tokens that have expired or have not yet become valid (`exp`/`nbf`).
- Confirm the token was minted for your server (`aud` or the `resource` claim) and contains the scopes you marked as required.
- Run any app-specific policy checks, then either attach the resolved identity to the request context or return a `401` with a `WWW-Authenticate` challenge.

If verification fails, respond with `401 Unauthorized` and a `WWW-Authenticate` header that points back to your protected-resource metadata. This tells the client to run the OAuth flow again.

#### SDK token verification primitives

Both Python and TypeScript MCP SDKs include helpers so you do not have to wire this from scratch.

- [Python](https://github.com/modelcontextprotocol/python-sdk?tab=readme-ov-file#authentication)
- [TypeScript](https://github.com/modelcontextprotocol/typescript-sdk?tab=readme-ov-file#proxy-authorization-requests-upstream)

## Testing and rollout

- **Local testing** – start with a development tenant that issues short-lived tokens so you can iterate quickly.
- **Dogfood** – once authentication works, gate access to trusted testers before rolling out broadly. You can require linking for specific tools or the entire connector.
- **Rotation** – plan for token revocation, refresh, and scope changes. Your server should treat missing or stale tokens as unauthenticated and return a helpful error message.
- **OAuth debugging** – use the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) Auth settings to walk through each OAuth step and pinpoint where the flow breaks before you ship.

With authentication in place you can confidently expose user-specific data and write actions to ChatGPT users.

## Triggering authentication UI

ChatGPT only surfaces its OAuth linking UI when your MCP server signals that OAuth is available or necessary.

Triggering the tool-level OAuth flow requires both metadata (`securitySchemes` and the resource metadata document) **and** runtime errors that carry `_meta["mcp/www_authenticate"]`. Without both halves ChatGPT will not show the linking UI for that tool.

1. **Publish resource metadata.** The MCP server must expose its OAuth configuration at a well-known URL such as `https://your-mcp.example.com/.well-known/oauth-protected-resource`.

2. **Describe each tool’s auth policy with `securitySchemes`.** Declaring `securitySchemes` per tool tells ChatGPT which tools require OAuth versus which can run anonymously. Stick to per-tool declarations even if the entire server uses the same policy; server-level defaults make it difficult to evolve individual tools later.

   Two scheme types are available today, and you can list more than one to express optional auth:
   - `noauth` — the tool is callable anonymously; ChatGPT can run it immediately.
   - `oauth2` — the tool needs an OAuth 2.0 access token; include the scopes you will request so the consent screen is accurate.

   If you omit the array entirely, the tool inherits whatever default the server advertises. Declaring both `noauth` and `oauth2` tells ChatGPT it can start with anonymous calls but that linking unlocks privileged behavior. Regardless of what you signal to the client, your server must still verify the token, scopes, and audience on every invocation.

   Example (public + optional auth) – TypeScript SDK

   ```ts
   declare const server: McpServer;

   server.registerTool(
     'search',
     {
       title: 'Public Search',
       description: 'Search public documents.',
       inputSchema: {
         type: 'object',
         properties: { q: { type: 'string' } },
         required: ['q'],
       },
       securitySchemes: [{ type: 'noauth' }, { type: 'oauth2', scopes: ['search.read'] }],
     },
     async ({ input }) => {
       return {
         content: [{ type: 'text', text: `Results for ${input.q}` }],
         structuredContent: {},
       };
     },
   );
   ```

   Example (auth required) – TypeScript SDK

   ```ts
   declare const server: McpServer;

   server.registerTool(
     'create_doc',
     {
       title: 'Create Document',
       description: 'Make a new doc in your account.',
       inputSchema: {
         type: 'object',
         properties: { title: { type: 'string' } },
         required: ['title'],
       },
       securitySchemes: [{ type: 'oauth2', scopes: ['docs.write'] }],
     },
     async ({ input }) => {
       return {
         content: [{ type: 'text', text: `Created doc: ${input.title}` }],
         structuredContent: {},
       };
     },
   );
   ```

3. **Check tokens inside the tool handler and emit `_meta["mcp/www_authenticate"]`** when you want ChatGPT to trigger the authentication UI. Inspect the token and verify issuer, audience, expiry, and scopes. If no valid token is present, return an error result that includes `_meta["mcp/www_authenticate"]` and make sure the value contains both an `error` and `error_description` parameter. This `WWW-Authenticate` payload is what actually triggers the tool-level OAuth UI once steps 1 and 2 are in place.

   Example

   ```json
   {
     "jsonrpc": "2.0",
     "id": 4,
     "result": {
       "content": [
         {
           "type": "text",
           "text": "Authentication required: no access token provided."
         }
       ],
       "_meta": {
         "mcp/www_authenticate": [
           "'Bearer resource_metadata=\"https://your-mcp.example.com/.well-known/oauth-protected-resource\", error=\"insufficient_scope\", error_description=\"You need to login to continue\"'"
         ]
       },
       "isError": true
     }
   }
   ```
