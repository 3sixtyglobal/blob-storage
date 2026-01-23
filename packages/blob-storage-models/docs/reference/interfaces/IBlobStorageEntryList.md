# Interface: IBlobStorageEntryList

Interface describing an blob storage entry list.

## Properties

### @context

> **@context**: \[`"https://schema.org"`, `"https://schema.twindev.org/blob-storage/"`, `"https://schema.twindev.org/common/"`, `...IJsonLdContextDefinitionElement[]`\]

JSON-LD Context.

***

### type

> **type**: `"ItemList"`

JSON-LD Type.

***

### itemListElement

> **itemListElement**: [`IBlobStorageEntry`](IBlobStorageEntry.md)[]

The list of entries.
