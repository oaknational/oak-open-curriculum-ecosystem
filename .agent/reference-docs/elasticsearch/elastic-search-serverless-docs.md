---
title: Elastic Cloud Serverless
description: Elastic Cloud Serverless is a fully managed solution that allows you to deploy and use Elastic for your use cases without managing the underlying infrastructure...
url: https://www.elastic.co/docs/deploy-manage/deploy/elastic-cloud/serverless
products:
  - Elastic Cloud Serverless
---

# Elastic Cloud Serverless

Elastic Cloud Serverless is a fully managed solution that allows you to deploy and use Elastic for your use cases without managing the underlying infrastructure. It represents a shift in how you interact with Elasticsearch - instead of managing clusters, nodes, data tiers, and scaling, you create **serverless projects** that are fully managed and automatically scaled by Elastic. This abstraction of infrastructure decisions allows you to focus solely on gaining value and insight from your data.

## Serverless overview

Elastic Cloud Serverless automatically provisions, manages, and scales your Elasticsearch resources based on your actual usage. Unlike traditional deployments where you need to predict and provision resources in advance, serverless adapts to your workload in real-time, ensuring optimal performance while eliminating the need for manual capacity planning.
Serverless projects use the core components of the Elastic Stack, such as Elasticsearch and Kibana, and are based on an architecture that decouples compute and storage. Search and indexing operations are separated, which offers high flexibility for scaling your workloads while ensuring a high level of performance.
<note>
There are differences between Elasticsearch Serverless and Elastic Cloud Hosted. Learn more in [Compare Elastic Cloud Hosted and Elasticsearch Serverless](/docs/deploy-manage/deploy/elastic-cloud#general-what-is-serverless-elastic-differences-between-serverless-projects-and-hosted-deployments-on-ecloud).
</note>

## Get started

Elastic provides three serverless solutions available on Elastic Cloud. Follow these guides to get started with your serverless project:

- **[Elasticsearch Serverless](https://www.elastic.co/docs/solutions/search/get-started)**: Build powerful applications and search experiences using a rich ecosystem of vector search capabilities, APIs, and libraries.
- **[Elastic Observability Serverless](https://www.elastic.co/docs/solutions/observability/get-started)**: Monitor your own platforms and services using powerful machine learning and analytics tools with your logs, metrics, traces, and APM data.
- **[Elastic Security Serverless](/docs/solutions/security/get-started#create-sec-serverless-project)**: Detect, investigate, and respond to threats with SIEM, endpoint protection, and AI-powered analytics capabilities.

Afterwards, you can:

- Learn about the [cloud organization](https://www.elastic.co/docs/deploy-manage/cloud-organization) that is the umbrella for all of your Elastic Cloud resources, users, and account settings.
- Learn about how Elasticsearch Serverless is [billed](https://www.elastic.co/docs/deploy-manage/cloud-organization/billing/serverless-project-billing-dimensions).
- Learn how to [create an API key](https://www.elastic.co/docs/deploy-manage/api-keys/serverless-project-api-keys). This key provides access to the API that enables you to manage your deployments.
- Learn how manage [users and roles](https://www.elastic.co/docs/deploy-manage/users-roles/cloud-organization) in your Elasticsearch Serverless deployment.
- Learn more about Elastic Cloud Serverless in [our blog](https://www.elastic.co/blog/elastic-cloud-serverless).

## Benefits of serverless projects

**Management free:** Elastic manages the underlying Elastic cluster, so you can focus on your data. With serverless projects, Elastic is responsible for automatic upgrades, data backups, and business continuity.
**Autoscaled:** To meet your performance requirements, the system automatically adjusts to your workloads. For example, when you have a short time spike on the data you ingest, more resources are allocated for that period of time. When the spike is over, the system uses less resources, without any action on your end.
**Optimized data storage:** Your data is stored in cost-efficient, general storage. A cache layer is available on top of the general storage for recent and frequently queried data that provides faster search speed. The size of the cache layer and the volume of data it holds depend on [settings](https://www.elastic.co/docs/deploy-manage/deploy/elastic-cloud/project-settings) that you can configure for each project.
**Dedicated experiences:** All serverless solutions are built on the Elastic Search Platform and include the core capabilities of the Elastic Stack. They also each offer a distinct experience and specific capabilities that help you focus on your data, goals, and use cases.
**Pay per usage:** Each serverless project type includes product-specific and usage-based pricing.
**Data and performance control**. Control your project data and query performance against your project data.

- **Data:** Choose the data you want to ingest and the method to ingest it. By default, data is stored indefinitely in your project, and you define the retention settings for your data streams.
- **Performance:** For granular control over costs and query performance against your project data, serverless projects come with a set of predefined settings you can edit.

<admonition title="Simplify monitoring with AutoOps" applies-to="{ ess:, ece:, eck:, self:, "serverless": "ga" }">
AutoOps is a monitoring tool that simplifies cluster management through performance recommendations, resource utilization visibility, and real-time issue detection with resolution paths. Learn more about [AutoOps](https://www.elastic.co/docs/deploy-manage/monitor/autoops).
</admonition>

## Monitor serverless status

Serverless projects run on cloud platforms, which may undergo changes in availability. When availability changes, Elastic makes sure to provide you with a current service status.
To learn more about serverless status, see [Service status](https://www.elastic.co/docs/deploy-manage/cloud-organization/service-status).

## Frequently asked questions (FAQ) about Elastic Cloud Serverless projects

The following FAQ addresses common questions about using Elastic Cloud Serverless projects.
For information about upcoming features, refer to our [roadmap](https://www.elastic.co/cloud/serverless/roadmap).

### Pricing and availability

**Q: Where can I learn about pricing for Serverless?**

A: See pricing information for [Elasticsearch Serverless](https://www.elastic.co/pricing/serverless-search), [Observability](https://www.elastic.co/pricing/serverless-observability), and [Elastic Security Serverless](https://www.elastic.co/pricing/serverless-security).
**Q: What Cloud regions does Elastic Cloud Serverless support?**

A: Elastic Cloud Serverless is available in select AWS, GCP, and Azure regions, with plans to expand to more regions. For more information, refer to [Regions](https://www.elastic.co/docs/deploy-manage/deploy/elastic-cloud/regions).

### Data management

**Q: How can I move data to or from Serverless projects?**

A: We are working on data migration tools. In the interim, [use Logstash](https://www.elastic.co/docs/reference/logstash) with Elasticsearch input and output plugins to move data to and from Serverless projects.
**Q: Can I request backups or restores for my serverless projects?**

A: Request for project backups or restores is currently unsupported, and we are working on data migration tools to better support this.

### Security, compliance, and access

**Q: How can I create Elastic Cloud Serverless service accounts?**

A: Create API keys for service accounts in your Serverless projects. Options to automate the creation of API keys with tools such as Terraform will be available in the future.
**Q: What compliance and privacy standards does Elastic Cloud Serverless adhere to?**

A: Alongside the entire Elastic platform, Elastic Cloud Serverless is independently audited and certified to meet industry-leading compliance and privacy standards. Refer to the [Elastic Trust Center](https://www.elastic.co/trust) for more information. Further details about specific standards are available on our [roadmap](https://www.elastic.co/cloud/serverless/roadmap).

### Project lifecycle and support

**Q: How does Elastic Cloud Serverless ensure compatibility between software versions?**

A: Connections and configurations are unaffected by upgrades. To ensure compatibility between software versions, quality testing and API versioning are used.
**Q: Can I convert a Elastic Cloud Serverless project into an Elastic Cloud Hosted deployment, or a hosted deployment into a Serverless project?**

A: Projects and deployments are based on different architectures, so you are unable to convert.
**Q: Can I convert a Serverless project into a project of a different type?**

A: You are unable to convert projects into different project types, but you can create as many projects as you’d like. You will be charged only for your usage.
**Q: How do I raise a support case for Elastic Cloud Serverless?**

A: Raise a case for your subscription as you do today. In the body of the case, mention you are working with a Serverless project to ensure appropriate support.
