// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { HealthStatus } from "@twin.org/api-models";
import { ContextIdStore } from "@twin.org/context";
import { MemoryBlobStorageConnector } from "../src/memoryBlobStorageConnector.js";

describe("MemoryBlobStorageConnector Health", () => {
	beforeAll(async () => {
		ContextIdStore.getContextIds = vi
			.fn()
			.mockImplementation(() => ({ node: "node", tenant: "tenant", user: "user" }));
	});

	test("can health check", async () => {
		const blobStorage = new MemoryBlobStorageConnector();
		const health = await blobStorage.health(0);
		expect(health).toBeDefined();
		expect(health.length).toEqual(1);
		expect(health[0].status).toEqual(HealthStatus.Ok);
	});
});
