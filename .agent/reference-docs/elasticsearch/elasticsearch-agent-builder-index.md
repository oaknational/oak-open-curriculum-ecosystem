---
title: Get started with Elastic Agent Builder
description: Learn how to get started by enabling the Elastic Agent Builder features and begin chatting with your data.
url: https://www.elastic.co/docs/solutions/search/agent-builder/get-started
---

# Get started with Elastic Agent Builder

Learn how to get started by enabling the Elastic Agent Builder features and begin chatting with your data.
<stepper>
<step title="Set up an Elastic deployment">
If you don't already have an Elastic deployment, refer to [Select your deployment type](/docs/solutions/search/get-started#choose-your-deployment-type).
<note>
For Elastic Cloud Hosted deployments, make sure you are using the solution navigation instead of classic navigation.
You can set up a new [space](https://www.elastic.co/docs/deploy-manage/manage-spaces) to use the solution nav.
</note>
</step>

  <step title="Enable {{agent-builder}}">
    <applies-switch>
      <applies-item title="{ "serverless": "preview", "elasticsearch" }">
        Elastic Agent Builder is enabled by default in serverless Elasticsearch projects.Find **Agents** in the navigation menu to begin using the feature, or search for **Agents** in the [global search field](https://www.elastic.co/docs/explore-analyze/find-and-organize/find-apps-and-objects).
      </applies-item>

      <applies-item title="stack: preview 9.2">
        You have to enable Elastic Agent Builder to get started on non-serverless deployments.You can enable the features using the UI:
        1. Search for **AI / Agent Builder** in the [global search field](https://www.elastic.co/docs/explore-analyze/find-and-organize/find-apps-and-objects).
        2. Toggle **Elastic Agent Builder** to on.
        3. Select **Save changes**.
        Find **Agents** in the navigation menu to begin using the feature, or search for **Agents** in the [global search field](https://www.elastic.co/docs/explore-analyze/find-and-organize/find-apps-and-objects).
      </applies-item>
    </applies-switch>

    <note>
      To learn about required privileges for Elastic Agent Builder, refer to [Permissions and access control](https://www.elastic.co/docs/solutions/search/agent-builder/permissions).
    </note>

  </step>

  <step title="Ingest some data">
    Before you begin with agents, you need some data in Elasticsearch. Otherwise, you will be chatting to the underlying LLM without any retrieval-augmented context.To learn about adding data for search use cases, go to [Ingest for search use cases](https://www.elastic.co/docs/solutions/search/ingest-for-search).
    For a broader overview of ingestion options, go to [Ingest: Bring your data to Elastic](https://www.elastic.co/docs/manage-data/ingest).
    <tip>
      If you're not ready to add your own data, you can:
      - Use the Elastic [sample data](https://www.elastic.co/docs/manage-data/ingest/sample-data).
      - Generate synthetic financial data using [this Python tool](https://github.com/jeffvestal/synthetic-financial-data?tab=readme-ov-file#synthetic-financial-data-generator-).  (This requires your [Elasticsearch URL and an API key](https://www.elastic.co/docs/solutions/search/search-connection-details)).
    </tip>
  </step>

  <step title="Begin chatting">
    The **Agent Chat** UI provides a conversational interface where you can interact with agents and explore your data using natural language. Elastic Agent Builder includes a default agent named `Elastic AI Agent` with access to all built-in tools, so you can begin chatting immediately.Learn more in [Agent Chat](https://www.elastic.co/docs/solutions/search/agent-builder/chat).
  </step>

  <step title="Configure model (optional)">
    By default, Elastic Agent Builder uses the Elastic Managed LLM. To use a different model, refer to [model selection and configuration](https://www.elastic.co/docs/solutions/search/agent-builder/models).
  </step>

  <step title="Begin building agents and tools">
    Once you've tested the default **Elastic AI Agent** with the [built-in Elastic tools](https://www.elastic.co/docs/solutions/search/agent-builder/tools), you can begin [building your own agents](/docs/solutions/search/agent-builder/agent-builder-agents#create-a-new-agent) with custom instructions and [creating your own tools](/docs/solutions/search/agent-builder/tools#create-custom-tools) to assign them.
  </step>
</stepper>
