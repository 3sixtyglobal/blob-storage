// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ContextIdStore } from "@twin.org/context";
import { HealthStatus, RandomHelper, Urn } from "@twin.org/core";
import { TEST_IPFS_CONFIG, TEST_IPFS_PUBLIC_GATEWAY } from "./setupTestEnv.js";
import { IpfsBlobStorageConnector } from "../src/ipfsBlobStorageConnector.js";

const TEST_DATA = RandomHelper.generate(32);
const TEST_DATA_2 = RandomHelper.generate(32);

describe("IpfsBlobStorageConnector", () => {
	beforeAll(async () => {
		ContextIdStore.getContextIds = vi
			.fn()
			.mockImplementation(() => ({ node: "node", tenant: "tenant", user: "user" }));
	});

	test("can construct", async () => {
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });
		expect(blobStorage).toBeDefined();
	});

	test("can health check", async () => {
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });
		const health = await blobStorage.health();
		expect(health).toBeDefined();
		expect(health.length).toEqual(1);
		expect(health[0].status).toEqual(HealthStatus.Ok);
	});

	test("can health check fail with unreachable node", async () => {
		const blobStorage = new IpfsBlobStorageConnector({
			config: { apiUrl: "http://localhost:19999/api/v0" }
		});
		const health = await blobStorage.health();
		expect(health).toBeDefined();
		expect(health.length).toEqual(1);
		expect(health[0].status).toEqual(HealthStatus.Error);
	});

	test("can fail to set an item with no blob", async () => {
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });
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
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });

		const idUrn = await blobStorage.set(TEST_DATA);

		expect(idUrn).toBeDefined();

		const urn = Urn.fromValidString(idUrn);
		console.debug(TEST_IPFS_PUBLIC_GATEWAY.replace(":hash", urn.namespaceSpecific(1)));
	});

	test("can fail to get an item with no id", async () => {
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });
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
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });
		await expect(blobStorage.get("urn:foo:1234")).rejects.toMatchObject({
			name: "GeneralError",
			message: "ipfsBlobStorageConnector.namespaceMismatch",
			properties: {
				namespace: IpfsBlobStorageConnector.NAMESPACE
			}
		});
	});

	test("can not get an item if it does not exist", async () => {
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });

		const errorUri = "blob:ipfs:QmYjGapQfNT9MN3k3oz7TFv7RxoF45JuypCjSXkdCffy4A";

		const item = await blobStorage.get(errorUri);
		expect(item).toBeUndefined();
	});

	test("can not get an item with exception", async () => {
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });
		const idUrn = await blobStorage.set(TEST_DATA);

		const ipfsHash = Urn.fromValidString(idUrn).namespaceSpecific(1);
		const errorUri = `blob:ipfs:${ipfsHash}-2`;

		await expect(blobStorage.get(errorUri)).rejects.toMatchObject({
			name: "GeneralError",
			message: "ipfsBlobStorageConnector.getBlobFailed",
			cause: {
				name: "GeneralError",
				message: "ipfsBlobStorageConnector.fetchFail",
				properties: {
					Message: `invalid path "${ipfsHash}-2": path does not have enough components`,
					Code: 0,
					Type: "error"
				}
			}
		});
	});

	test("can get an item", async () => {
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });
		const idUrn = await blobStorage.set(TEST_DATA);
		const item = await blobStorage.get(idUrn);

		expect(item).toBeDefined();
		expect(item).toEqual(TEST_DATA);
	});

	test("can fail to remove an item with no id", async () => {
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });
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
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });
		await expect(blobStorage.remove("urn:foo:1234")).rejects.toMatchObject({
			name: "GeneralError",
			message: "ipfsBlobStorageConnector.namespaceMismatch",
			properties: {
				namespace: IpfsBlobStorageConnector.NAMESPACE
			}
		});
	});

	test("can not remove an item with exception", async () => {
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });
		const idUrn = await blobStorage.set(TEST_DATA);

		const ipfsHash = Urn.fromValidString(idUrn).namespaceSpecific(1);
		const errorUri = `blob:ipfs:${ipfsHash}-2`;

		await expect(blobStorage.remove(errorUri)).rejects.toMatchObject({
			name: "GeneralError",
			message: "ipfsBlobStorageConnector.removeBlobFailed",
			cause: {
				name: "GeneralError",
				message: "ipfsBlobStorageConnector.fetchFail",
				properties: {
					Message: `invalid path "${ipfsHash}-2": path does not have enough components`,
					Code: 0,
					Type: "error"
				}
			}
		});
	});

	test("can remove an item", async () => {
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });
		const idUrn = await blobStorage.set(TEST_DATA);
		const removed = await blobStorage.remove(idUrn);
		expect(removed).toBe(true);
	});

	test("can empty all items", async () => {
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });
		const idUrn1 = await blobStorage.set(TEST_DATA);
		const idUrn2 = await blobStorage.set(TEST_DATA_2);

		expect(await blobStorage.get(idUrn1)).toBeDefined();
		expect(await blobStorage.get(idUrn2)).toBeDefined();

		await blobStorage.empty();

		expect(await blobStorage.get(idUrn1)).toBeUndefined();
		expect(await blobStorage.get(idUrn2)).toBeUndefined();
	});

	test("can set and get an item with a partitionKey", async () => {
		const blobStorage = new IpfsBlobStorageConnector({
			partitionContextIds: ["tenant"],
			config: TEST_IPFS_CONFIG
		});
		const idUrn = await blobStorage.set(TEST_DATA);

		const urnParsed = Urn.fromValidString(idUrn);
		expect(urnParsed.namespaceSpecific(1)).toBeDefined();
		expect(urnParsed.namespaceSpecific(2)).toBeDefined();

		const item = await blobStorage.get(idUrn);
		expect(item).toBeDefined();
		expect(item).toEqual(TEST_DATA);
	});

	test("can not get an item with mismatched partition", async () => {
		const blobStorage = new IpfsBlobStorageConnector({
			partitionContextIds: ["tenant"],
			config: TEST_IPFS_CONFIG
		});
		const idUrn = await blobStorage.set(TEST_DATA);

		const urnParsed = Urn.fromValidString(idUrn);
		const ipfsHash = urnParsed.namespaceSpecific(1).split(":")[0];
		const idWithoutPartition = `blob:ipfs:${ipfsHash}`;

		const item = await blobStorage.get(idWithoutPartition);
		expect(item).toBeUndefined();
	});

	test("can remove an item with a partitionKey", async () => {
		const blobStorage = new IpfsBlobStorageConnector({
			partitionContextIds: ["tenant"],
			config: TEST_IPFS_CONFIG
		});
		const idUrn = await blobStorage.set(TEST_DATA_2);

		const removed = await blobStorage.remove(idUrn);
		expect(removed).toBe(true);
	});

	test("can not remove an item with mismatched partition", async () => {
		const blobStorage = new IpfsBlobStorageConnector({
			partitionContextIds: ["tenant"],
			config: TEST_IPFS_CONFIG
		});
		const idUrn = await blobStorage.set(TEST_DATA_2);

		const urnParsed = Urn.fromValidString(idUrn);
		const ipfsHash = urnParsed.namespaceSpecific(1).split(":")[0];
		const idWithoutPartition = `blob:ipfs:${ipfsHash}`;

		const removed = await blobStorage.remove(idWithoutPartition);
		expect(removed).toBe(false);
	});

	test("can teardown the store", async () => {
		const blobStorage = new IpfsBlobStorageConnector({ config: TEST_IPFS_CONFIG });
		await blobStorage.set(TEST_DATA);
		await blobStorage.set(TEST_DATA_2);

		const result = await blobStorage.teardown();
		expect(result).toBe(true);
	});
});
