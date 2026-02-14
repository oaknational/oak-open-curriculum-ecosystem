# Elasticsearch Serverless Setup Guide

**Last Updated**: 2026-01-03

This guide documents the steps required to provision and configure Elasticsearch Serverless for the Oak Open Curriculum Semantic Search application.

## Prerequisites

- Access to [Elastic Cloud](https://cloud.elastic.co/)
- Admin permissions to create projects and API keys

## Step 1: Create Elastic Cloud Account

1. Navigate to <https://cloud.elastic.co/>
2. Sign up or log in with your organization credentials
3. Complete any required organization setup

## Step 2: Create Serverless Project

1. From the Elastic Cloud console, click "Create project"
2. Select **Elasticsearch** as the project type
3. Choose **Search** as the solution type
4. Select your preferred cloud provider (AWS recommended)
5. Select your preferred region (e.g., eu-west-2 for UK)
6. Name the project (e.g., "oak-open-curriculum-search")
7. Click "Create project"

## Step 3: Generate API Key

1. Once the project is created, navigate to **API Keys** in the project settings
2. Click "Create API Key"
3. Configure permissions:
   - **Name**: oak-search-app
   - **Privileges**: Ensure the key has:
     - `manage` privilege for index operations
     - `read` and `write` privileges for data operations
     - `monitor` privilege for cluster health checks
4. Copy the generated API key (you won't be able to see it again)

## Step 4: Get Endpoint URL

1. In the project overview, find the **Elasticsearch endpoint**
2. Copy the HTTPS URL (format: `https://your-project.es.region.aws.elastic-cloud.com`)

## Step 5: Configure Environment Variables

Create or update `.env.local` in the semantic search app directory:

```bash
cd apps/oak-search-cli
cp .env.example .env.local
```

`.env.local` is local-only and ignored by git.
Fill it with real values locally only; placeholders stay in `.env.example`.

Update the following variables:

```env
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
```

## Step 6: Verify Connection

Run the E2E connection test to verify your setup:

```bash
cd apps/oak-search-cli
pnpm test:e2e:es
```

Expected output:

```text
✓ should have ELASTICSEARCH_URL configured
✓ should have ELASTICSEARCH_API_KEY configured
✓ should connect to Elasticsearch cluster
✓ should have proper API key permissions (can list indices)
```

## Step 7: Create Indexes (Phase 0.3)

Once the connection is verified, create the required indexes:

```bash
# Run the elastic setup script
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
pnpm elastic:setup
```

This will create:

- `oak_lessons` - Lesson documents with embeddings
- `oak_units` - Unit documents
- `oak_unit_rollup` - Aggregated unit data
- `oak_sequences` - Sequence documents
- Synonym sets for curriculum terminology

## Troubleshooting

### Connection Refused

- Verify the endpoint URL is correct and includes `https://`
- Check that your IP is not blocked by any firewall rules

### Authentication Failed

- Verify the API key is correct (no leading/trailing whitespace)
- Ensure the API key has not expired
- Check that the API key has sufficient privileges

### Permission Denied

- The API key may not have the required privileges
- Create a new API key with admin privileges for setup, then use a restricted key for runtime

## Security Notes

- Never commit `.env.local` to version control
- Rotate API keys periodically
- Use separate API keys for development and production
- Consider using more restrictive API key privileges for production

## Related Documentation

- [Elastic Cloud Serverless Documentation](https://www.elastic.co/docs/serverless)
- [Elasticsearch API Key Management](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html)

## Related ADRs

| ADR                                                                                                | Topic                         |
| -------------------------------------------------------------------------------------------------- | ----------------------------- |
| [ADR-076](../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) | ELSER-Only Embedding Strategy |
