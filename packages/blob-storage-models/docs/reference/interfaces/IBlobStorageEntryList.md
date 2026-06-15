# Interface: IBlobStorageEntryList

Interface describing a blob storage entry list.

## Properties

### @context {#context}

> **@context**: \[`"https://schema.org"`, `"https://schema.twindev.org/blob-storage/"`, `"https://schema.twindev.org/common/"`, `...IJsonLdContextDefinitionElement[]`\]

JSON-LD Context.

***

### type {#type}

> **type**: `"ItemList"`

JSON-LD Type.

***

### itemListElement {#itemlistelement}

> **itemListElement**: [`IBlobStorageEntry`](IBlobStorageEntry.md)[]

The list of entries.
