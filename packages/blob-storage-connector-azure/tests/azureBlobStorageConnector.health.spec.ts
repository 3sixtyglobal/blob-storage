// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { HealthStatus } from "@twin.org/api-models";
import { ContextIdStore } from "@twin.org/context";
import { TEST_AZURE_CONFIG } from "./setupTestEnv.js";
import { AzureBlobStorageConnector } from "../src/azureBlobStorageConnector.js";

describe("AzureBlobStorageConnector Health", () => {
	beforeAll(async () => {
		ContextIdStore.getContextIds = vi
			.fn()
			.mockImplementation(() => ({ node: "node", tenant: "tenant", user: "user" }));
	});

	test("can health check", async () => {
		const blobStorage = new AzureBlobStorageConnector({ config: TEST_AZURE_CONFIG });
		const health = await blobStorage.health();
		expect(health).toBeDefined();
		expect(health.length).toEqual(1);
		expect(health[0].status).toEqual(HealthStatus.Ok);
	});

	test("can health check fail with unreachable endpoint", async () => {
		const blobStorage = new AzureBlobStorageConnector({
			config: {
				accountName: "testaccount",
				accountKey: "dGVzdA==",
				containerName: "test-container",
				endpoint: "http://localhost:19999/"
			}
		});
		const health = await blobStorage.health();
		expect(health).toBeDefined();
		expect(health.length).toEqual(1);
		expect(health[0].status).toEqual(HealthStatus.Error);
	});
});
