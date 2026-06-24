// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BlobStorageConnectorFactory } from "../../src/factories/blobStorageConnectorFactory.js";
import type { IBlobStorageConnector } from "../../src/models/IBlobStorageConnector.js";

describe("BlobStorageConnectorFactory", () => {
	test("can add an item to the factory", async () => {
		BlobStorageConnectorFactory.register(
			"my-blob-storage",
			() => ({}) as unknown as IBlobStorageConnector
		);
	});
});
