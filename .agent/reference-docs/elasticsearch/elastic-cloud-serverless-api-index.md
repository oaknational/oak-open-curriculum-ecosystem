# Elastic Cloud Serverless API

## Description

This is version `0.1.0` of this API documentation. Last update on Dec 3, 2025.
This API enables you to manage Elastic Cloud Serverless Projects.
You can create, update, and delete projects, as well as manage project features and usage.

You can find more information and examples using this API in the [documentation](https://www.elastic.co/docs/deploy-manage/deploy/elastic-cloud/manage-serverless-projects-using-api).

## API principles

The Elastic Cloud Serverless REST API is built following REST principles:

- Resources (such as projects) are represented as URIs.
- Standard HTTP response codes and verbs are used (GET, POST, PUT, PATCH and DELETE).
- API calls are stateless. Every request that you make happens in isolation from other calls and must include all the information necessary to fulfill the request.
- JSON is the data interchange format.

## Open API Specification

The Project Management API is documented using the [OpenAPI Specification](https://en.wikipedia.org/wiki/OpenAPI_Specification). The current supported version of the specification is 3.0.
For details, check the [API reference](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/) or download the [OpenAPI Specification](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless.yaml).
This specification can be used to generate client SDKs, or on tools that support it, such as the [Swagger Editor](https://editor.swagger.io/).

## Documentation source and versions

This documentation is derived from a private repository.
It is provided under license [Attribution-NonCommercial-NoDerivatives 4.0 International](https://creativecommons.org/licenses/by-nc-nd/4.0/).

## Servers

- https://api.elastic-cloud.com: https://api.elastic-cloud.com ()

## Endpoints and operations

### [elasticsearch projects](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/group/endpoint-elasticsearch-projects.md)

- [Get Elasticsearch projects](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-listelasticsearchprojects.md)
- [Create an Elasticsearch project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-createelasticsearchproject.md)
- [Get an Elasticsearch project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-getelasticsearchproject.md)
- [Delete an Elasticsearch project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-deleteelasticsearchproject.md)
- [Update an Elasticsearch project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-patchelasticsearchproject.md)
- [Reset the project credentials](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-resetelasticsearchprojectcredentials.md)
- [Resume Elasticsearch project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-resumeelasticsearchproject.md)
- [Get roles for an Elasticsearch project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-getelasticsearchprojectroles.md)
- [Get the status of an Elasticsearch project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-getelasticsearchprojectstatus.md)

### [observability projects](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/group/endpoint-observability-projects.md)

- [Get Observability projects](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-listobservabilityprojects.md)
- [Create an observability project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-createobservabilityproject.md)
- [Get an Observability project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-getobservabilityproject.md)
- [Delete an Observability project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-deleteobservabilityproject.md)
- [Update an Observability project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-patchobservabilityproject.md)
- [Reset the project credentials](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-resetobservabilityprojectcredentials.md)
- [Resume Observability project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-resumeobservabilityproject.md)
- [Get roles for an Observability project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-getobservabilityprojectroles.md)
- [Get the status of an Observability project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-getobservabilityprojectstatus.md)

### [security projects](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/group/endpoint-security-projects.md)

- [Get Security projects](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-listsecurityprojects.md)
- [Create a security project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-createsecurityproject.md)
- [Get a Security project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-getsecurityproject.md)
- [Delete a Security project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-deletesecurityproject.md)
- [Update a Security project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-patchsecurityproject.md)
- [Reset the project credentials](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-resetsecurityprojectcredentials.md)
- [Resume Security project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-resumesecurityproject.md)
- [Get roles for a Security project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-getsecurityprojectroles.md)
- [Get the status of a Security project](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-getsecurityprojectstatus.md)

### [regions](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/group/endpoint-regions.md)

- [Get regions](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-listregions.md)
- [Get a region](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-getregion.md)

### [traffic filters](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/group/endpoint-traffic-filters.md)

- [List traffic filters](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-listtrafficfilters.md)
- [Create a traffic filter](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-createtrafficfilter.md)
- [List PrivateLink region metadata](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-gettrafficfiltermetadata.md)
- [Retrieves the traffic filter by ID.](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-gettrafficfilter.md)
- [Delete a traffic filter](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-deletetrafficfilter.md)
- [Updates a traffic filter](https://www.elastic.co/docs/api/doc/elastic-cloud-serverless/operation/operation-patchtrafficfilter.md)

[Powered by Bump.sh](https://bump.sh)
