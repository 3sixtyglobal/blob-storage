// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdContextDefinitionElement } from "@3sixty/data-json-ld";
import type { SchemaOrgContexts, SchemaOrgTypes } from "@3sixty/standards-schema-org";
import type { BlobStorageContexts } from "./blobStorageContexts.js";
import type { IBlobStorageEntry } from "./IBlobStorageEntry.js";

/**
 * Interface describing a blob storage entry list.
 */
export interface IBlobStorageEntryList {
	/**
	 * JSON-LD Context.
	 */
	"@context": [
		typeof SchemaOrgContexts.Context,
		typeof BlobStorageContexts.Context,
		typeof BlobStorageContexts.ContextCommon,
		...IJsonLdContextDefinitionElement[]
	];

	/**
	 * JSON-LD Type.
	 */
	type: typeof SchemaOrgTypes.ItemList;

	/**
	 * The list of entries.
	 */
	[SchemaOrgTypes.ItemListElement]: IBlobStorageEntry[];
}
