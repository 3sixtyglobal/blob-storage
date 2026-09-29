// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { DataTypeHelper } from "@twin.org/data-core";
import { JsonLdDataTypes } from "@twin.org/data-json-ld";
import * as CompiledValidators from "../compiled/validators.js";
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
		// Register the types referenced by the schemas, which are only registered once.
		JsonLdDataTypes.registerTypes();

		const types = [
			{
				type: BlobStorageTypes.Entry,
				schema: BlobStorageEntrySchema,
				compiledValidator: CompiledValidators.CompiledBlobStorageEntry
			},
			{
				type: BlobStorageTypes.CompressionType,
				schema: BlobStorageCompressionTypeSchema,
				compiledValidator: CompiledValidators.CompiledBlobStorageCompressionType
			}
		];

		DataTypeHelper.registerTypes(
			BlobStorageContexts.Namespace,
			BlobStorageContexts.JsonLdContext,
			types
		);
	}
}
