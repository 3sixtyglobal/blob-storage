// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { HealthStatus } from "@3sixty/api-models";
import { ContextIdStore } from "@3sixty/context";
import { TEST_GCP_CONFIG } from "./setupTestEnv.js";
import { GcpBlobStorageConnector } from "../src/gcpBlobStorageConnector.js";

describe("GcpBlobStorageConnector Health", () => {
	beforeAll(async () => {
		ContextIdStore.getContextIds = vi
			.fn()
			.mockImplementation(() => ({ node: "node", tenant: "tenant", user: "user" }));
	});

	test("can health check", async () => {
		const blobStorage = new GcpBlobStorageConnector({ config: TEST_GCP_CONFIG });
		const health = await blobStorage.health();
		expect(health).toBeDefined();
		expect(health.length).toEqual(1);
		expect(health[0].status).toEqual(HealthStatus.Ok);
	});

	test("can health check fail with unreachable endpoint", async () => {
		const blobStorage = new GcpBlobStorageConnector({
			config: {
				projectId: "test-project",
				bucketName: "test-bucket",
				apiEndpoint: "http://localhost:19999"
			}
		});
		const health = await blobStorage.health();
		expect(health).toBeDefined();
		expect(health.length).toEqual(1);
		expect(health[0].status).toEqual(HealthStatus.Error);
	});
});
