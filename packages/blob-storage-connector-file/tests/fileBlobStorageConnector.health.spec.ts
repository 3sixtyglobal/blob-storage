// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { rm } from "node:fs/promises";
import { HealthStatus } from "@twin.org/api-models";
import { ContextIdStore } from "@twin.org/context";
import { Converter, RandomHelper } from "@twin.org/core";
import { FileBlobStorageConnector } from "../src/fileBlobStorageConnector.js";

const TEST_DIRECTORY_ROOT = "./.tmp/";
const TEST_DIRECTORY = `${TEST_DIRECTORY_ROOT}health-test-${Converter.bytesToHex(RandomHelper.generate(8))}`;

describe("FileBlobStorageConnector Health", () => {
	beforeAll(async () => {
		ContextIdStore.getContextIds = vi
			.fn()
			.mockImplementation(() => ({ node: "node", tenant: "tenant", user: "user" }));
		const blobStorage = new FileBlobStorageConnector({ config: { directory: TEST_DIRECTORY } });
		await blobStorage.bootstrap("logging");
	});

	afterAll(async () => {
		try {
			await rm(TEST_DIRECTORY_ROOT, { recursive: true });
		} catch {}
	});

	test("can health check with existing directory", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
		const health = await blobStorage.health();
		expect(health).toBeDefined();
		expect(health.length).toEqual(1);
		expect(health[0].status).toEqual(HealthStatus.Ok);
	});

	test("can health check with missing directory", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: `${TEST_DIRECTORY_ROOT}does-not-exist`
			}
		});
		const health = await blobStorage.health();
		expect(health).toBeDefined();
		expect(health.length).toEqual(1);
		expect(health[0].status).toEqual(HealthStatus.Error);
	});
});
