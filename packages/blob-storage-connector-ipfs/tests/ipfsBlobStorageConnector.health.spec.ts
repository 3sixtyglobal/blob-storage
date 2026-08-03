// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { HealthStatus } from "@twin.org/api-models";
import { ContextIdStore } from "@twin.org/context";
import { TEST_IPFS_CONFIG } from "./setupTestEnv.js";
import { IpfsBlobStorageConnector } from "../src/ipfsBlobStorageConnector.js";

describe("IpfsBlobStorageConnector Health", () => {
	beforeAll(async () => {
		ContextIdStore.getContextIds = vi
			.fn()
			.mockImplementation(() => ({ node: "node", tenant: "tenant", user: "user" }));
	});

	test("can health check", async () => {
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });
		const health = await blobStorage.health(0);
		expect(health).toBeDefined();
		expect(health.length).toEqual(1);
		expect(health[0].status).toEqual(HealthStatus.Ok);
	});

	test("can health check fail with unreachable node", async () => {
		const blobStorage = new IpfsBlobStorageConnector({
			config: { apiUrl: "http://localhost:19999/api/v0" }
		});
		const health = await blobStorage.health(0);
		expect(health).toBeDefined();
		expect(health.length).toEqual(1);
		expect(health[0].status).toEqual(HealthStatus.Error);
	});
});
