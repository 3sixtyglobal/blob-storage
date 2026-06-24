// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the Memory Blob Storage Connector constructor.
 */
export interface IMemoryStorageConnectorConstructorOptions {
	/**
	 * The keys to use from the context ids to create partitions.
	 */
	partitionContextIds?: string[];
}
