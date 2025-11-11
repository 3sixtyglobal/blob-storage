// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IAzureBlobStorageConnectorConfig } from "./IAzureBlobStorageConnectorConfig.js";

/**
 * Options for the Azure Blob Storage Connector constructor.
 */
export interface IAzureBlobStorageConnectorConstructorOptions {
	/**
	 * The keys to use from the context ids to create partitions.
	 */
	partitionContextIds?: string[];

	/**
	 * The configuration for the connector.
	 */
	config: IAzureBlobStorageConnectorConfig;
}
