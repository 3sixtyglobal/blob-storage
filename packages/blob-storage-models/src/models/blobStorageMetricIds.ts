// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The metric IDs for the blob storage domain.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const BlobStorageMetricIds = {
	/**
	 * Number of blobs created.
	 */
	BlobCreated: "blob_storage_blob_created",
	/**
	 * Number of blobs retrieved.
	 */
	BlobRetrieved: "blob_storage_blob_retrieved",
	/**
	 * Number of blobs updated.
	 */
	BlobUpdated: "blob_storage_blob_updated",
	/**
	 * Number of blobs removed.
	 */
	BlobRemoved: "blob_storage_blob_removed",
	/**
	 * Number of blob queries executed.
	 */
	BlobQueried: "blob_storage_blob_queried"
} as const;

/**
 * Union type of all blob storage metric ID string values.
 */
export type BlobStorageMetricIds = (typeof BlobStorageMetricIds)[keyof typeof BlobStorageMetricIds];
