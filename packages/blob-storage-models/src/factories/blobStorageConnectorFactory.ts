// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@3sixty/core";
import type { IBlobStorageConnector } from "../models/IBlobStorageConnector.js";

/**
 * Factory for creating blob storage connectors.
 */
export const BlobStorageConnectorFactory =
	Factory.createFactory<IBlobStorageConnector>("blob-storage");
