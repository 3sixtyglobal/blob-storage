// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { HealthStatus } from "@3sixty/api-models";
import { ContextIdStore } from "@3sixty/context";
import { TEST_S3_CONFIG } from "./setupTestEnv.js";
import { S3BlobStorageConnector } from "../src/s3BlobStorageConnector.js";

describe("S3BlobStorageConnector Health", () => {
	let blobStorage: S3BlobStorageConnector;

	beforeAll(async () => {
		ContextIdStore.getContextIds = vi
			.fn()
			.mockImplementation(() => ({ node: "node", tenant: "tenant", user: "user" }));
		blobStorage = new S3BlobStorageConnector({ config: TEST_S3_CONFIG });
		await blobStorage.bootstrap();
	});

	afterAll(async () => {
		await blobStorage.teardown();
	});

	test("can health check", async () => {
		const health = await blobStorage.health();
		expect(health).toBeDefined();
		expect(health.length).toEqual(1);
		expect(health[0].status).toEqual(HealthStatus.Ok);
	});

	test("can health check fail with unreachable endpoint", async () => {
		const blobStorage2 = new S3BlobStorageConnector({
			config: {
				endpoint: "http://localhost:19999",
				region: "us-east-1",
				bucketName: "test-bucket",
				accessKeyId: "test-access-key",
				secretAccessKey: "test-secret-key"
			}
		});
		const health = await blobStorage2.health();
		expect(health).toBeDefined();
		expect(health.length).toEqual(1);
		expect(health[0].status).toEqual(HealthStatus.Error);
	});
});
