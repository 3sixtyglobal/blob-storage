// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The contexts of blob storage data.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const BlobStorageContexts = {
	/**
	 * The canonical RDF namespace URI for Blob Storage.
	 */
	Namespace: "https://schema.3sixty.global/blob-storage/",

	/**
	 * The value to use in JSON-LD context for Blob Storage.
	 */
	Context: "https://schema.3sixty.global/blob-storage/",

	/**
	 * The JSON-LD Context URL.
	 */
	JsonLdContext: "https://schema.3sixty.global/blob-storage/types.jsonld",

	/**
	 * The canonical RDF namespace URI for TWIN Common.
	 */
	NamespaceCommon: "https://schema.3sixty.global/common/",

	/**
	 * The value to use in JSON-LD context for TWIN Common.
	 */
	ContextCommon: "https://schema.3sixty.global/common/",

	/**
	 * The JSON-LD Context URL for TWIN Common.
	 */
	JsonLdContextCommon: "https://schema.3sixty.global/common/types.jsonld"
} as const;

/**
 * The contexts of blob storage data.
 */
export type BlobStorageContexts = (typeof BlobStorageContexts)[keyof typeof BlobStorageContexts];
