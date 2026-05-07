// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ContextIdStore } from "@twin.org/context";
import { HealthStatus, RandomHelper } from "@twin.org/core";
import { TEST_AZURE_CONFIG } from "./setupTestEnv.js";
import { AzureBlobStorageConnector } from "../src/azureBlobStorageConnector.js";

const TEST_DATA = RandomHelper.generate(32);

describe("AzureBlobStorageConnector", () => {
	beforeAll(async () => {
		ContextIdStore.getContextIds = vi
			.fn()
			.mockImplementation(() => ({ node: "node", tenant: "tenant", user: "user" }));
	});

	test("can construct", async () => {
		const blobStorage = new AzureBlobStorageConnector({ config: TEST_AZURE_CONFIG });
		expect(blobStorage).toBeDefined();
	});

	test("can bootstrap", async () => {
		const blobStorage = new AzureBlobStorageConnector({ config: TEST_AZURE_CONFIG });
		await blobStorage.bootstrap("logging");
		expect(blobStorage).toBeDefined();
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

	test("can fail to set an item with no blob", async () => {
		const blobStorage = new AzureBlobStorageConnector({ config: TEST_AZURE_CONFIG });
		await expect(blobStorage.set(undefined as unknown as Uint8Array)).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.uint8Array",
			properties: {
				property: "blob",
				value: "undefined"
			}
		});
	});

	test("can set an item", async () => {
		const blobStorage = new AzureBlobStorageConnector({ config: TEST_AZURE_CONFIG });

		const idUrn = await blobStorage.set(TEST_DATA);

		expect(idUrn).toBeDefined();
	});

	test("can fail to get an item with no id", async () => {
		const blobStorage = new AzureBlobStorageConnector({ config: TEST_AZURE_CONFIG });
		await expect(blobStorage.get(undefined as unknown as string)).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "id",
				value: "undefined"
			}
		});
	});

	test("can fail to get an item with mismatched urn namespace", async () => {
		const blobStorage = new AzureBlobStorageConnector({ config: TEST_AZURE_CONFIG });
		await expect(blobStorage.get("urn:foo:1234")).rejects.toMatchObject({
			name: "GeneralError",
			message: "azureBlobStorageConnector.namespaceMismatch",
			properties: {
				namespace: AzureBlobStorageConnector.NAMESPACE
			}
		});
	});

	test("can not get an item", async () => {
		const blobStorage = new AzureBlobStorageConnector({ config: TEST_AZURE_CONFIG });
		const idUrn = await blobStorage.set(TEST_DATA);

		const errorUri = `${idUrn}-2`;

		const item = await blobStorage.get(errorUri);
		expect(item).toBeUndefined();
	});

	test("can get an item", async () => {
		const blobStorage = new AzureBlobStorageConnector({ config: TEST_AZURE_CONFIG });
		const idUrn = await blobStorage.set(TEST_DATA);
		const item = await blobStorage.get(idUrn);

		expect(item).toBeDefined();
		expect(item).toEqual(TEST_DATA);
	});

	test("can fail to remove an item with no id", async () => {
		const blobStorage = new AzureBlobStorageConnector({ config: TEST_AZURE_CONFIG });
		await expect(blobStorage.remove(undefined as unknown as string)).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.string",
			properties: {
				property: "id",
				value: "undefined"
			}
		});
	});

	test("can fail to remove an item with mismatched urn namespace", async () => {
		const blobStorage = new AzureBlobStorageConnector({ config: TEST_AZURE_CONFIG });
		await expect(blobStorage.remove("urn:foo:1234")).rejects.toMatchObject({
			name: "GeneralError",
			message: "azureBlobStorageConnector.namespaceMismatch",
			properties: {
				namespace: AzureBlobStorageConnector.NAMESPACE
			}
		});
	});

	test("can remove an item", async () => {
		const blobStorage = new AzureBlobStorageConnector({ config: TEST_AZURE_CONFIG });
		const idUrn = await blobStorage.set(TEST_DATA);
		const removed = await blobStorage.remove(idUrn);
		expect(removed).toBe(true);
	});

	test("can not remove an item", async () => {
		const blobStorage = new AzureBlobStorageConnector({ config: TEST_AZURE_CONFIG });
		const idUrn = await blobStorage.set(TEST_DATA);

		const removed = await blobStorage.remove(`${idUrn}-2`);
		expect(removed).toBe(false);
	});

	test("can set and get an item with a partitionKey", async () => {
		const blobStorage = new AzureBlobStorageConnector({
			partitionContextIds: ["node", "tenant", "user"],
			config: TEST_AZURE_CONFIG
		});
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));

		const item = await blobStorage.get(idUrn);

		expect(item).toBeDefined();
		expect(item?.length).toEqual(3);
		expect(item?.[0]).toEqual(1);
		expect(item?.[1]).toEqual(2);
		expect(item?.[2]).toEqual(3);
	});

	test("can remove an item with a partitionKey", async () => {
		const blobStorage = new AzureBlobStorageConnector({
			partitionContextIds: ["node", "tenant", "user"],
			config: TEST_AZURE_CONFIG
		});
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));

		const item = await blobStorage.get(idUrn);
		expect(item).toBeDefined();

		await blobStorage.remove(idUrn);

		const itemAfterRemove = await blobStorage.get(idUrn);
		expect(itemAfterRemove).toBeUndefined();
	});
});
