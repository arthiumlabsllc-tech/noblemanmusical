# ADR-0005: Typesense for Search

## Status
Accepted

## Context
We need a search solution for the product catalog that:
- Provides instant, typo-tolerant search results
- Supports faceted filtering (category, brand, price range)
- Is fast (< 50ms response time)
- Works with Next.js API routes
- Is affordable for a small-to-medium business

## Decision
Use Typesense as the search engine, added in Phase 16.

## Rationale
- **Instant Results:** Sub-50ms search with instant search UI
- **Typo Tolerance:** Built-in fuzzy matching — critical for product names
- **Faceted Search:** Native support for category, brand, price range facets
- **Easy Setup:** Single binary or Typesense Cloud — no Elasticsearch complexity
- **Cost:** Typesense Cloud starts at $0/month for small datasets; self-hosted is free
- **API-Friendly:** REST API works well with Next.js API routes
- **Lightweight:** Much simpler than Elasticsearch/Meilisearch for our use case
- **Ghana-Friendly:** Can self-host on a cheap VPS if cloud hosting is cost-prohibitive

## Consequences
- Additional service to manage (Typesense instance)
- Must sync product data from PostgreSQL to Typesense
- New dependency: `typesense` npm package (ADR-0008)
- Search overlay adds complexity to the header
- Typesense must be running for search to work — graceful degradation needed
