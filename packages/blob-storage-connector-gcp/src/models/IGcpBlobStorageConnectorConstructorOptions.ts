// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IGcpBlobStorageConnectorConfig } from "./IGcpBlobStorageConnectorConfig.js";

/**
 * Options for the GCP Blob Storage Connector constructor.
 */
export interface IGcpBlobStorageConnectorConstructorOptions {
	/**
	 * The keys to use from the context ids to create partitions.
	 */
	partitionContextIds?: string[];

	/**
	 * The configuration for the connector.
	 */
	config: IGcpBlobStorageConnectorConfig;
}
