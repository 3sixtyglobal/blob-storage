// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ContextIdStore } from "@twin.org/context";
import { HealthStatus, Urn } from "@twin.org/core";
import { MemoryBlobStorageConnector } from "../src/memoryBlobStorageConnector.js";

describe("MemoryBlobStorageConnector", () => {
	beforeAll(async () => {
		ContextIdStore.getContextIds = vi
			.fn()
			.mockImplementation(() => ({ node: "node", tenant: "tenant", user: "user" }));
	});

	test("can construct", async () => {
		const blobStorage = new MemoryBlobStorageConnector();
		expect(blobStorage).toBeDefined();
	});

	test("can health check", async () => {
		const blobStorage = new MemoryBlobStorageConnector();
		const health = await blobStorage.health();
		expect(health).toBeDefined();
		expect(health.length).toEqual(1);
		expect(health[0].status).toEqual(HealthStatus.Ok);
	});

	test("can fail to set an item with no blob", async () => {
		const blobStorage = new MemoryBlobStorageConnector();
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
		const blobStorage = new MemoryBlobStorageConnector();
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));
		expect(idUrn).toBeDefined();

		const urn = Urn.fromValidString(idUrn);
		const id = urn.namespaceSpecific(1);
		const store = blobStorage.getStore();
		expect(store).toEqual({
			[`root/${id}`]: new Uint8Array([1, 2, 3])
		});
	});

	test("can fail to get an item with no id", async () => {
		const blobStorage = new MemoryBlobStorageConnector();
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
		const blobStorage = new MemoryBlobStorageConnector();
		await expect(blobStorage.get("urn:foo:1234")).rejects.toMatchObject({
			name: "GeneralError",
			message: "memoryBlobStorageConnector.namespaceMismatch",
			properties: {
				namespace: MemoryBlobStorageConnector.NAMESPACE
			}
		});
	});

	test("can not get an item", async () => {
		const blobStorage = new MemoryBlobStorageConnector();
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));
		const item = await blobStorage.get(`${idUrn}-2`);

		expect(item).toBeUndefined();
	});

	test("can get an item", async () => {
		const blobStorage = new MemoryBlobStorageConnector();
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));
		const item = await blobStorage.get(idUrn);

		expect(item).toBeDefined();
		expect(item?.length).toEqual(3);
		expect(item?.[0]).toEqual(1);
		expect(item?.[1]).toEqual(2);
		expect(item?.[2]).toEqual(3);
	});

	test("can fail to remove an item with no id", async () => {
		const blobStorage = new MemoryBlobStorageConnector();
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
		const blobStorage = new MemoryBlobStorageConnector();
		await expect(blobStorage.remove("urn:foo:1234")).rejects.toMatchObject({
			name: "GeneralError",
			message: "memoryBlobStorageConnector.namespaceMismatch",
			properties: {
				namespace: MemoryBlobStorageConnector.NAMESPACE
			}
		});
	});

	test("can not remove an item", async () => {
		const blobStorage = new MemoryBlobStorageConnector();
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));
		const urn = Urn.fromValidString(idUrn);
		const id = urn.namespaceSpecific(1);

		await blobStorage.remove(`${idUrn}-2`);

		const store = blobStorage.getStore();
		expect(store).toEqual({
			[`root/${id}`]: new Uint8Array([1, 2, 3])
		});
	});

	test("can remove an item", async () => {
		const blobStorage = new MemoryBlobStorageConnector();
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));

		await blobStorage.remove(idUrn);

		const store = blobStorage.getStore();
		expect(store).toEqual({});
	});

	test("can set and get an item with a partitionKey", async () => {
		const blobStorage = new MemoryBlobStorageConnector({
			partitionContextIds: ["node", "tenant", "user"]
		});
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));

		const urnParsed = Urn.fromValidString(idUrn);
		const id = urnParsed.namespaceSpecific(1);

		const store = blobStorage.getStore();
		expect(store).toEqual({
			[`node/tenant/user/${id}`]: new Uint8Array([1, 2, 3])
		});

		const item = await blobStorage.get(idUrn);
		expect(item).toBeDefined();
		expect(item?.length).toEqual(3);
		expect(item?.[0]).toEqual(1);
		expect(item?.[1]).toEqual(2);
		expect(item?.[2]).toEqual(3);
	});

	test("can remove an item with a partitionKey", async () => {
		const blobStorage = new MemoryBlobStorageConnector({
			partitionContextIds: ["node", "tenant", "user"]
		});
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));

		const urnParsed = Urn.fromValidString(idUrn);
		const id = urnParsed.namespaceSpecific(1);

		let store = blobStorage.getStore();
		expect(store).toEqual({
			[`node/tenant/user/${id}`]: new Uint8Array([1, 2, 3])
		});

		await blobStorage.remove(idUrn);

		store = blobStorage.getStore();
		expect(store).toEqual({});
	});

	test("can not get an item from a different partition", async () => {
		const blobStorageWithPartition = new MemoryBlobStorageConnector({
			partitionContextIds: ["tenant"]
		});
		const blobStorageNoPartition = new MemoryBlobStorageConnector();

		const idUrn = await blobStorageWithPartition.set(new Uint8Array([7, 8, 9]));
		expect(await blobStorageNoPartition.get(idUrn)).toBeUndefined();

		const idUrn2 = await blobStorageNoPartition.set(new Uint8Array([10, 11, 12]));
		expect(await blobStorageWithPartition.get(idUrn2)).toBeUndefined();
	});

	test("can not remove an item from a different partition", async () => {
		const blobStorageWithPartition = new MemoryBlobStorageConnector({
			partitionContextIds: ["tenant"]
		});
		const blobStorageNoPartition = new MemoryBlobStorageConnector();

		const idUrn = await blobStorageWithPartition.set(new Uint8Array([7, 8, 9]));
		expect(await blobStorageNoPartition.remove(idUrn)).toBe(false);

		const idUrn2 = await blobStorageNoPartition.set(new Uint8Array([10, 11, 12]));
		expect(await blobStorageWithPartition.remove(idUrn2)).toBe(false);
	});

	test("can empty with no items", async () => {
		const blobStorage = new MemoryBlobStorageConnector();
		await blobStorage.empty();
		const store = blobStorage.getStore();
		expect(store).toEqual({});
	});

	test("can empty all items", async () => {
		const blobStorage = new MemoryBlobStorageConnector();
		await blobStorage.set(new Uint8Array([1, 2, 3]));
		await blobStorage.set(new Uint8Array([4, 5, 6]));

		let store = blobStorage.getStore();
		expect(Object.keys(store).length).toEqual(2);

		await blobStorage.empty();

		store = blobStorage.getStore();
		expect(store).toEqual({});
	});

	test("can empty all items with a partitionKey", async () => {
		const blobStorage = new MemoryBlobStorageConnector({
			partitionContextIds: ["node", "tenant", "user"]
		});
		await blobStorage.set(new Uint8Array([1, 2, 3]));
		await blobStorage.set(new Uint8Array([4, 5, 6]));

		let store = blobStorage.getStore();
		expect(Object.keys(store).length).toEqual(2);

		await blobStorage.empty();

		store = blobStorage.getStore();
		expect(store).toEqual({});
	});

	test("can teardown the store", async () => {
		const blobStorage = new MemoryBlobStorageConnector();
		await blobStorage.set(new Uint8Array([1, 2, 3]));
		await blobStorage.set(new Uint8Array([4, 5, 6]));

		let store = blobStorage.getStore();
		expect(Object.keys(store).length).toEqual(2);

		const result = await blobStorage.teardown();
		expect(result).toBe(true);

		store = blobStorage.getStore();
		expect(store).toEqual({});
	});
});
