// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { DataTypeHandlerFactory } from "@twin.org/data-core";
import { BlobStorageContexts } from "../models/blobStorageContexts.js";
import { BlobStorageTypes } from "../models/blobStorageTypes.js";
import BlobStorageCompressionTypeSchema from "../schemas/BlobStorageCompressionType.json" with { type: "json" };
import BlobStorageEntrySchema from "../schemas/BlobStorageEntry.json" with { type: "json" };

/**
 * Handle all the data types for blob storage.
 */
export class BlobStorageDataTypes {
	/**
	 * Register all the data types.
	 */
	public static registerTypes(): void {
		DataTypeHandlerFactory.register(
			`${BlobStorageContexts.Namespace}${BlobStorageTypes.Entry}`,
			() => ({
				namespace: BlobStorageContexts.Namespace,
				type: BlobStorageTypes.Entry,
				defaultValue: {},
				jsonSchema: async () => BlobStorageEntrySchema
			})
		);

		DataTypeHandlerFactory.register(
			`${BlobStorageContexts.Namespace}${BlobStorageTypes.CompressionType}`,
			() => ({
				namespace: BlobStorageContexts.Namespace,
				type: BlobStorageTypes.CompressionType,
				defaultValue: {},
				jsonSchema: async () => BlobStorageCompressionTypeSchema
			})
		);
	}
}
