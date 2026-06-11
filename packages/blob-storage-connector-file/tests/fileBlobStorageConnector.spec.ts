// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { rm, stat } from "node:fs/promises";
import path from "node:path";
import { ContextIdStore } from "@twin.org/context";
import { ComponentFactory, Converter, HealthStatus, RandomHelper, Urn } from "@twin.org/core";
import { MemoryEntityStorageConnector } from "@twin.org/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@twin.org/entity-storage-models";
import {
	EntityStorageLoggingConnector,
	type LogEntry,
	initSchema
} from "@twin.org/logging-connector-entity-storage";
import { LoggingConnectorFactory } from "@twin.org/logging-models";
import { LoggingService } from "@twin.org/logging-service";
import { nameof } from "@twin.org/nameof";
import { FileBlobStorageConnector } from "../src/fileBlobStorageConnector.js";
import type { IFileBlobStorageConnectorConfig } from "../src/models/IFileBlobStorageConnectorConfig.js";

let memoryEntityStorage: MemoryEntityStorageConnector<LogEntry>;

const TEST_DIRECTORY_ROOT = "./.tmp/";
const TEST_DIRECTORY = `${TEST_DIRECTORY_ROOT}test-data-${Converter.bytesToHex(RandomHelper.generate(8))}`;

describe("FileBlobStorageConnector", () => {
	beforeAll(async () => {
		initSchema();
	});

	beforeEach(() => {
		memoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>({
			entitySchema: nameof<LogEntry>()
		});
		EntityStorageConnectorFactory.register("log-entry", () => memoryEntityStorage);
		ComponentFactory.register("platform", () => ({
			className: () => "MockPlatform",
			isMultiTenant: () => false,
			execute: async (method: () => Promise<void>) => method()
		}));
		LoggingConnectorFactory.register(
			"logging",
			() =>
				new EntityStorageLoggingConnector({
					config: {
						batchSize: 0,
						batchIntervalMs: 0
					}
				})
		);
		ComponentFactory.register("logging", () => new LoggingService());

		ContextIdStore.getContextIds = vi
			.fn()
			.mockImplementation(() => ({ node: "node", tenant: "tenant", user: "user" }));
	});

	afterAll(async () => {
		try {
			await rm(TEST_DIRECTORY_ROOT, { recursive: true });
		} catch {}
	});

	test("can fail to construct when there is no options", async () => {
		expect(
			() =>
				new FileBlobStorageConnector(
					undefined as unknown as {
						config: IFileBlobStorageConnectorConfig;
					}
				)
		).toThrow(
			expect.objectContaining({
				name: "GuardError",
				message: "guard.objectUndefined",
				properties: {
					property: "options",
					value: "undefined"
				}
			})
		);
	});

	test("can fail to construct when there is no config", async () => {
		expect(
			() =>
				new FileBlobStorageConnector(
					{} as unknown as {
						config: IFileBlobStorageConnectorConfig;
					}
				)
		).toThrow(
			expect.objectContaining({
				name: "GuardError",
				message: "guard.objectUndefined",
				properties: {
					property: "options.config",
					value: "undefined"
				}
			})
		);
	});

	test("can fail to construct when there is no config directory", async () => {
		expect(
			() =>
				new FileBlobStorageConnector({ config: {} } as unknown as {
					config: IFileBlobStorageConnectorConfig;
				})
		).toThrow(
			expect.objectContaining({
				name: "GuardError",
				message: "guard.string",
				properties: {
					property: "options.config.directory",
					value: "undefined"
				}
			})
		);
	});

	test("can construct", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
		expect(blobStorage).toBeDefined();
	});

	test("can fail to bootstrap with invalid directory", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: "|\0"
			}
		});
		await blobStorage.bootstrap("logging");
		const logs = memoryEntityStorage.getStore();
		expect(logs).toBeDefined();
		expect(logs?.length).toEqual(2);
		expect(logs?.[0].message).toEqual("directoryCreating");
		expect(logs?.[1].message).toEqual("directoryCreateFailed");
	});

	test("can bootstrap and create directory", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
		await blobStorage.bootstrap("logging");
		const logs = memoryEntityStorage.getStore();
		expect(logs).toBeDefined();
		expect(logs?.length).toEqual(1);
		expect(logs?.[0].message).toEqual("directoryCreating");
	});

	test("can bootstrap and skip existing directory", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
		await blobStorage.bootstrap("logging");
		const logs = memoryEntityStorage.getStore();
		expect(logs).toBeDefined();
		expect(logs?.length).toEqual(1);
		expect(logs?.[0].message).toEqual("directoryExists");
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

	test("can fail to set an item with no blob", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
		await expect(blobStorage.set(undefined as unknown as Uint8Array)).rejects.toMatchObject({
			name: "GuardError",
			message: "guard.uint8Array",
			properties: {
				property: "blob",
				value: "undefined"
			}
		});
	});

	test("can fail to set an item when write operation fails", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY,
				extension: "\0"
			}
		});

		await expect(blobStorage.set(new Uint8Array([1, 2, 3]))).rejects.toMatchObject({
			name: "GeneralError",
			message: "fileBlobStorageConnector.setBlobFailed"
		});
	});

	test("can set an item", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));

		const item = await blobStorage.get(idUrn);

		expect(item).toBeDefined();
		expect(item?.length).toEqual(3);
		expect(item?.[0]).toEqual(1);
		expect(item?.[1]).toEqual(2);
		expect(item?.[2]).toEqual(3);
	});

	test("can fail to get an item with no id", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
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
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
		await expect(blobStorage.get("urn:foo:1234")).rejects.toMatchObject({
			name: "GeneralError",
			message: "fileBlobStorageConnector.namespaceMismatch",
			properties: {
				namespace: FileBlobStorageConnector.NAMESPACE
			}
		});
	});

	test("can fail to get an item with read failure", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY,
				extension: "\0"
			}
		});
		await expect(
			blobStorage.get(`urn:blob:${FileBlobStorageConnector.NAMESPACE}:1234`)
		).rejects.toMatchObject({
			name: "GeneralError",
			message: "fileBlobStorageConnector.getBlobFailed"
		});
	});

	test("can not get an item", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));
		const item = await blobStorage.get(`${idUrn}-2`);

		expect(item).toBeUndefined();
	});

	test("can get an item", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));
		const item = await blobStorage.get(idUrn);

		expect(item).toBeDefined();
		expect(item?.length).toEqual(3);
		expect(item?.[0]).toEqual(1);
		expect(item?.[1]).toEqual(2);
		expect(item?.[2]).toEqual(3);
	});

	test("can fail to remove an item with no id", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
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
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
		await expect(blobStorage.remove("urn:foo:1234")).rejects.toMatchObject({
			name: "GeneralError",
			message: "fileBlobStorageConnector.namespaceMismatch",
			properties: {
				namespace: FileBlobStorageConnector.NAMESPACE
			}
		});
	});

	test("can fail to remove an item with storage failure", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY,
				extension: "\0"
			}
		});
		await expect(
			blobStorage.remove(`urn:blob:${FileBlobStorageConnector.NAMESPACE}:1234`)
		).rejects.toMatchObject({
			name: "GeneralError",
			message: "fileBlobStorageConnector.removeBlobFailed"
		});
	});

	test("can not remove an item", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));

		await blobStorage.remove(`${idUrn}-2`);

		const item = await blobStorage.get(idUrn);

		expect(item).toBeDefined();
	});

	test("can remove an item", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));
		await blobStorage.remove(idUrn);
		const item = await blobStorage.get(idUrn);

		expect(item).toBeUndefined();
	});

	test("can set and get an item with a partitionKey", async () => {
		const blobStorage = new FileBlobStorageConnector({
			partitionContextIds: ["node", "tenant", "user"],
			config: {
				directory: TEST_DIRECTORY
			}
		});
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));

		const urnParsed = Urn.fromValidString(idUrn);
		const exists = await fileExists(
			path.join(TEST_DIRECTORY, "node/tenant/user", `${urnParsed.namespaceSpecific(1)}.blob`)
		);
		expect(exists).toBe(true);

		const item = await blobStorage.get(idUrn);

		expect(item).toBeDefined();
		expect(item?.length).toEqual(3);
		expect(item?.[0]).toEqual(1);
		expect(item?.[1]).toEqual(2);
		expect(item?.[2]).toEqual(3);
	});

	test("can remove an item with a partitionKey", async () => {
		const blobStorage = new FileBlobStorageConnector({
			partitionContextIds: ["node", "tenant", "user"],
			config: {
				directory: TEST_DIRECTORY
			}
		});
		const idUrn = await blobStorage.set(new Uint8Array([1, 2, 3]));

		const urnParsed = Urn.fromValidString(idUrn);
		const fullName = path.join(
			TEST_DIRECTORY,
			"node/tenant/user",
			`${urnParsed.namespaceSpecific(1)}.blob`
		);
		let exists = await fileExists(fullName);
		expect(exists).toBe(true);

		await blobStorage.remove(idUrn);

		exists = await fileExists(fullName);
		expect(exists).toBe(false);

		const itemAfterRemove = await blobStorage.get(idUrn);
		expect(itemAfterRemove).toBeUndefined();
	});

	test("can not get an item from a different partition", async () => {
		const blobStorageWithPartition = new FileBlobStorageConnector({
			partitionContextIds: ["tenant"],
			config: { directory: TEST_DIRECTORY }
		});
		const blobStorageNoPartition = new FileBlobStorageConnector({
			config: { directory: TEST_DIRECTORY }
		});

		const idUrn = await blobStorageWithPartition.set(RandomHelper.generate(32));
		expect(await blobStorageNoPartition.get(idUrn)).toBeUndefined();

		const idUrn2 = await blobStorageNoPartition.set(RandomHelper.generate(32));
		expect(await blobStorageWithPartition.get(idUrn2)).toBeUndefined();
	});

	test("can not remove an item from a different partition", async () => {
		const blobStorageWithPartition = new FileBlobStorageConnector({
			partitionContextIds: ["tenant"],
			config: { directory: TEST_DIRECTORY }
		});
		const blobStorageNoPartition = new FileBlobStorageConnector({
			config: { directory: TEST_DIRECTORY }
		});

		const idUrn = await blobStorageWithPartition.set(RandomHelper.generate(32));
		expect(await blobStorageNoPartition.remove(idUrn)).toBe(false);

		const idUrn2 = await blobStorageNoPartition.set(RandomHelper.generate(32));
		expect(await blobStorageWithPartition.remove(idUrn2)).toBe(false);
	});

	test("can empty with no items", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
		await blobStorage.empty();
	});

	test("can empty all items", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
		const idUrn1 = await blobStorage.set(new Uint8Array([1, 2, 3]));
		const idUrn2 = await blobStorage.set(new Uint8Array([4, 5, 6]));

		expect(await blobStorage.get(idUrn1)).toBeDefined();
		expect(await blobStorage.get(idUrn2)).toBeDefined();

		await blobStorage.empty();

		expect(await blobStorage.get(idUrn1)).toBeUndefined();
		expect(await blobStorage.get(idUrn2)).toBeUndefined();
	});

	test("can empty all items with a partitionKey", async () => {
		const blobStorage = new FileBlobStorageConnector({
			partitionContextIds: ["node", "tenant", "user"],
			config: {
				directory: TEST_DIRECTORY
			}
		});
		const idUrn1 = await blobStorage.set(new Uint8Array([1, 2, 3]));
		const idUrn2 = await blobStorage.set(new Uint8Array([4, 5, 6]));

		expect(await blobStorage.get(idUrn1)).toBeDefined();
		expect(await blobStorage.get(idUrn2)).toBeDefined();

		await blobStorage.empty();

		expect(await blobStorage.get(idUrn1)).toBeUndefined();
		expect(await blobStorage.get(idUrn2)).toBeUndefined();
	});

	test("can fail to empty with non-existent directory", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: `${TEST_DIRECTORY_ROOT}does-not-exist-for-empty`
			}
		});

		await expect(blobStorage.empty()).rejects.toMatchObject({
			name: "GeneralError",
			message: "fileBlobStorageConnector.emptyFailed"
		});
	});

	test("can teardown the store", async () => {
		const blobStorage = new FileBlobStorageConnector({
			config: {
				directory: TEST_DIRECTORY
			}
		});
		await blobStorage.set(new Uint8Array([1, 2, 3]));

		const result = await blobStorage.teardown();
		expect(result).toBe(true);

		const health = await blobStorage.health();
		expect(health[0].status).toEqual(HealthStatus.Error);
	});
});

/**
 * Does the specified file exist.
 * @param filename The filename to check for existence.
 * @returns True if the file exists.
 */
export async function fileExists(filename: string): Promise<boolean> {
	try {
		const stats = await stat(filename);
		return stats.isFile();
	} catch {
		return false;
	}
}
