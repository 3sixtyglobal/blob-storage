// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdContextDefinitionElement } from "@twin.org/data-json-ld";
import type { SchemaOrgContexts, SchemaOrgTypes } from "@twin.org/standards-schema-org";
import type { BlobStorageContexts } from "./blobStorageContexts.js";
import type { IBlobStorageEntry } from "./IBlobStorageEntry.js";

/**
 * Interface describing an blob storage entry list.
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
