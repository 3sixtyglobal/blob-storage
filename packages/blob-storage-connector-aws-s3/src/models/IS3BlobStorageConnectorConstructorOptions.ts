// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IS3BlobStorageConnectorConfig } from "./IS3BlobStorageConnectorConfig.js";

/**
 * Options for the S3 Blob Storage Connector constructor.
 */
export interface IS3BlobStorageConnectorConstructorOptions {
	/**
	 * The keys to use from the context ids to create partitions.
	 */
	partitionContextIds?: string[];

	/**
	 * The configuration for the connector.
	 */
	config: IS3BlobStorageConnectorConfig;
}
