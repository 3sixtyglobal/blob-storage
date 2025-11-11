// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IIpfsBlobStorageConnectorConfig } from "./IIpfsBlobStorageConnectorConfig.js";

/**
 * Options for the IPFS Blob Storage Connector constructor.
 */
export interface IIpfsBlobStorageConnectorConstructorOptions {
	/**
	 * The keys to use from the context ids to create partitions.
	 */
	partitionContextIds?: string[];

	/**
	 * The configuration for the connector.
	 */
	config: IIpfsBlobStorageConnectorConfig;
}
