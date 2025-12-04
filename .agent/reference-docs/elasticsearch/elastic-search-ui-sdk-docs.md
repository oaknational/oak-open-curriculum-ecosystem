---
title: Search UI
description: Search UI is a JavaScript library for building modern, customizable search experiences using Elastic as a backend. Maintained by the Elastic team, it...
url: https://www.elastic.co/docs/reference/search-ui
---

# Search UI

Search UI is a JavaScript library for building modern, customizable search experiences using Elastic as a backend. Maintained by the Elastic team, it helps you implement search interfaces with minimal boilerplate.
As a headless library, Search UI separates logic from presentation. It provides search state and actions you can use with React, vanilla JavaScript, or other frameworks like Vue.

## Live demos

### Connectors

- [Elasticsearch](https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox?file=%2Fsrc%2Fpages%2Felasticsearch-basic%2Findex.jsx): Browser-only implementation
- [Elasticsearch](https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox?file=%2Fsrc%2Fpages%2Felasticsearch-production-ready%2Findex.jsx): Production-ready implementation, using proxy connector
- [Elastic Site Search (Swiftype)](https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox?file=%2Fsrc%2Fpages%2Fsite-search%2Findex.jsx)

### Examples

- [Search as you type](https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox?file=%2Fsrc%2Fpages%2Fsearch-as-you-type%2Findex.jsx)
- [Search bar in header](https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox?file=%2Fsrc%2Fpages%2Fsearch-bar-in-header%2Findex.jsx)
- [Customizing Styles and Components](https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox?file=%2Fsrc%2Fpages%2Fcustomizing-styles-and-html%2Findex.jsx)

## Get Started

### Installation

```sh
npm install @elastic/search-ui @elastic/react-search-ui @elastic/react-search-ui-views
# or
yarn add @elastic/search-ui @elastic/react-search-ui @elastic/react-search-ui-views
```

### Tutorials 📘

<note>
  Search UI can connect to Serverless using a backend proxy. In this setup, the frontend uses the `ApiProxyConnector` to send requests to your backend, which then forwards them to Elasticsearch. Direct browser connections to Serverless are not supported due to CORS restrictions.[See our guide for using Search UI in production](https://www.elastic.co/docs/reference/search-ui/tutorials-elasticsearch-production-usage) for a full example of this setup.
</note>

Get started quickly with Search UI and your favorite Elastic product by following one of the tutorials below:

- [Elasticsearch](https://www.elastic.co/docs/reference/search-ui/tutorials-elasticsearch)
- ⚠️ DEPRECATED [Elastic App Search](https://www.elastic.co/docs/reference/search-ui/tutorials-app-search)
- ⚠️ DEPRECATED [Elastic Workplace Search](https://www.elastic.co/docs/reference/search-ui/tutorials-workplace-search)

## [Ecommerce](https://www.elastic.co/docs/reference/search-ui/ecommerce)

Guides for implementing ecommerce use cases using Search UI components.

- [Autocomplete](https://www.elastic.co/docs/reference/search-ui/solutions-ecommerce-autocomplete): Add real-time query and product suggestions to your search box.
- [Product Carousels](https://www.elastic.co/docs/reference/search-ui/solutions-ecommerce-carousel): Display horizontal lists of products, like 'Best Rated' or 'On Sale'.
- [Category Page](https://www.elastic.co/docs/reference/search-ui/solutions-ecommerce-category-page): Filter and explore products in a specific category using facets.
- [Product Detail Page](https://www.elastic.co/docs/reference/search-ui/solutions-ecommerce-product-detail-page): Enrich product pages with cross-sell suggestions and related items.
- [Search Page](https://www.elastic.co/docs/reference/search-ui/solutions-ecommerce-search-page): Show full search results with options for sorting, filters, and variants.

## [Basic usage](https://www.elastic.co/docs/reference/search-ui/basic-usage)

Quick-start guides for common Search UI tasks like styling, header placement, search behavior, and debugging.

- [Using search-as-you-type](https://www.elastic.co/docs/reference/search-ui/guides-using-search-as-you-type): Trigger a search request with each keystroke using the `searchAsYouType` prop.
- [Adding a search bar to a header](https://www.elastic.co/docs/reference/search-ui/guides-adding-search-bar-to-header): Place a search bar in the site header and redirect queries to a results page.
- [Debugging](https://www.elastic.co/docs/reference/search-ui/guides-debugging): Enable debug mode to inspect actions and state changes in the browser console.

## [Advanced usage](https://www.elastic.co/docs/reference/search-ui/advanced-usage)

Learn how to customize component behavior, build your own UI components, connect to any backend, and integrate Search UI with frameworks like Vue and Next.js.

- [Conditional Facets](https://www.elastic.co/docs/reference/search-ui/guides-conditional-facets): Show or hide facets based on selected filters.
- [Changing component behavior](https://www.elastic.co/docs/reference/search-ui/guides-changing-component-behavior): Override default logic using `mapContextToProps` or custom props.
- [Analyzing performance](https://www.elastic.co/docs/reference/search-ui/guides-analyzing-performance): Measure and analyze your search experience’s performance using browser and React profiling tools.
- [Building a custom connector](https://www.elastic.co/docs/reference/search-ui/guides-building-custom-connector): Use Search UI with any backend by implementing a connector.
- [Next.js integration](https://www.elastic.co/docs/reference/search-ui/guides-nextjs-integration): Use Search UI with server-side rendering in Next.js apps.

## [API reference](https://www.elastic.co/docs/reference/search-ui/api-reference)

### [Core API](https://www.elastic.co/docs/reference/search-ui/api-core-index)

Configuration, state, and actions that power the search experience.

- [Configuration](https://www.elastic.co/docs/reference/search-ui/api-core-configuration)
- [State](https://www.elastic.co/docs/reference/search-ui/api-core-state)
- [Actions](https://www.elastic.co/docs/reference/search-ui/api-core-actions)

### [React API](https://www.elastic.co/docs/reference/search-ui/api-react-search-provider)

React-specific utilities for accessing and interacting with the Core API.

- [WithSearch & withSearch](https://www.elastic.co/docs/reference/search-ui/api-react-with-search)
- [useSearch hook](https://www.elastic.co/docs/reference/search-ui/api-react-use-search)

## [React components](https://www.elastic.co/docs/reference/search-ui/api-react-components-search-box)

Search UI includes a set of ready-to-use React components for building your search interface. This section documents each component's API and customization options.

- [Results](https://www.elastic.co/docs/reference/search-ui/api-react-components-results)
- [Result](https://www.elastic.co/docs/reference/search-ui/api-react-components-result)
- [ResultsPerPage](https://www.elastic.co/docs/reference/search-ui/api-react-components-results-per-page)
- [Facet](https://www.elastic.co/docs/reference/search-ui/api-react-components-facet)
- [Sorting](https://www.elastic.co/docs/reference/search-ui/api-react-components-sorting)
- [Paging](https://www.elastic.co/docs/reference/search-ui/api-react-components-paging)
- [PagingInfo](https://www.elastic.co/docs/reference/search-ui/api-react-components-paging-info)
- [ErrorBoundary](https://www.elastic.co/docs/reference/search-ui/api-react-components-error-boundary)

## Connectors API

Built-in connectors let Search UI talk to Elastic backends. This section documents how to configure each connector, including usage examples and integration details.

- [Elasticsearch Connector](https://www.elastic.co/docs/reference/search-ui/api-connectors-elasticsearch): Connect directly to Elasticsearch indices using cloud or self-managed instances.
- [Site Search Connector](https://www.elastic.co/docs/reference/search-ui/api-connectors-site-search): Use Elastic Site Search as a backend. Note: Some advanced Search UI features are not supported.
- ⚠️ DEPRECATED [Workplace Search Connector](https://www.elastic.co/docs/reference/search-ui/api-connectors-workplace-search): Legacy connector for Elastic Workplace Search.
- ⚠️ DEPRECATED [App Search Connector](https://www.elastic.co/docs/reference/search-ui/api-connectors-app-search): Legacy connector for Elastic App Search.

## Plugins

- ⚠️ DEPRECATED [Analytics Plugin](https://www.elastic.co/docs/reference/search-ui/api-core-plugins-analytics-plugin): Track user behavior and send events to Elastic Behavioral Analytics.

## Known issues

- [Known issues](https://www.elastic.co/docs/reference/search-ui/known-issues)

## License

[Apache-2.0](https://github.com/elastic/search-ui/blob/main/LICENSE.txt) © [Elastic](https://github.com/elastic)
Thank you to all the [contributors](https://github.com/elastic/search-ui/graphs/contributors)! 🙏 🙏
