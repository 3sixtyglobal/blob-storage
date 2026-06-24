// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IValidationFailure } from "@twin.org/core";
import { DataTypeHelper } from "@twin.org/data-core";
import { JsonLdDataTypes } from "@twin.org/data-json-ld";
import { BlobStorageDataTypes } from "../../src/dataTypes/blobStorageDataTypes.js";
import { BlobStorageContexts } from "../../src/models/blobStorageContexts.js";
import { BlobStorageTypes } from "../../src/models/blobStorageTypes.js";

describe("BlobStorageDataTypes", () => {
	beforeAll(async () => {
		JsonLdDataTypes.registerTypes();
		BlobStorageDataTypes.registerTypes();
	});

	test("Can fail to validate an empty entry", async () => {
		const validationFailures: IValidationFailure[] = [];
		const isValid = await DataTypeHelper.validate(
			"",
			`${BlobStorageContexts.Namespace}${BlobStorageTypes.Entry}`,
			{},
			validationFailures
		);

		expect(validationFailures.length).toEqual(6);
		expect(isValid).toEqual(false);
	});

	test("Can validate an empty entry", async () => {
		const validationFailures: IValidationFailure[] = [];
		const isValid = await DataTypeHelper.validate(
			"",
			`${BlobStorageContexts.Namespace}${BlobStorageTypes.Entry}`,
			{
				"@context": [BlobStorageContexts.Context, BlobStorageContexts.ContextCommon],
				type: BlobStorageTypes.Entry,
				dateCreated: new Date().toISOString(),
				id: "1111",
				blobSize: 100,
				integrity: "abc"
			},
			validationFailures
		);
		expect(validationFailures.length).toEqual(0);
		expect(isValid).toEqual(true);
	});
});
