// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IFileBlobStorageConnectorConfig } from "./IFileBlobStorageConnectorConfig.js";

/**
 * Options for the File Blob Storage Connector constructor.
 */
export interface IFileBlobStorageConnectorConstructorOptions {
	/**
	 * The keys to use from the context ids to create partitions.
	 */
	partitionContextIds?: string[];

	/**
	 * The configuration for the connector.
	 */
	config: IFileBlobStorageConnectorConfig;
}
