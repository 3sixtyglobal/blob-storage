// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdContextDefinitionElement, IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { BlobStorageCompressionType } from "./blobStorageCompressionType.js";
import type { BlobStorageContexts } from "./blobStorageContexts.js";
import type { BlobStorageTypes } from "./blobStorageTypes.js";

/**
 * Interface describing a blob storage entry.
 */
export interface IBlobStorageEntry {
	/**
	 * JSON-LD Context.
	 */
	"@context": [
		typeof BlobStorageContexts.Context,
		typeof BlobStorageContexts.ContextCommon,
		...IJsonLdContextDefinitionElement[]
	];

	/**
	 * JSON-LD Type.
	 */
	type: typeof BlobStorageTypes.Entry;

	/**
	 * The id for the blob.
	 */
	id: string;

	/**
	 * The date/time when the entry was created.
	 * json-ld namespace:schema
	 */
	dateCreated: string;

	/**
	 * The date/time when the entry was modified.
	 * json-ld namespace:schema
	 */
	dateModified?: string;

	/**
	 * The size of the data in the blob.
	 * json-ld type:schema:Integer
	 */
	blobSize: number;

	/**
	 * The hash of the data in the blob.
	 * json-ld namespace:twin-common
	 */
	blobHash: string;

	/**
	 * The mime type for the blob.
	 * json-ld namespace:schema
	 */
	encodingFormat?: string;

	/**
	 * Indicates if the blob is encrypted.
	 * json-ld type:schema:Boolean
	 */
	isEncrypted?: boolean;

	/**
	 * The type of compression used for the blob, if not set it is not stored with compression.
	 * json-ld type:schema:Text
	 */
	compression?: BlobStorageCompressionType;

	/**
	 * The extension.
	 * json-ld type:schema:Text
	 */
	fileExtension?: string;

	/**
	 * The metadata for the blob as JSON-LD.
	 * json-ld id
	 */
	metadata?: IJsonLdNodeObject;

	/**
	 * The blob in base64 format, included if the includeContent flag was set in the request.
	 * json-ld type:schema:Text
	 */
	blob?: string;
}
