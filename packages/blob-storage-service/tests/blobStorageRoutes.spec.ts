// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { HttpBodyLimit } from "@twin.org/api-models";
import { generateRestRoutesBlobStorage } from "../src/blobStorageRoutes.js";

describe("blobStorageRoutes", () => {
	test("The create route has a body limit of large", async () => {
		const routes = generateRestRoutesBlobStorage("/blob", "blob-storage");
		const createRoute = routes.find(route => route.operationId === "blobStorageCreate");
		expect(createRoute?.bodyLimit).toEqual(HttpBodyLimit.Large);
	});

	test("The routes other than create have no body limit", async () => {
		const routes = generateRestRoutesBlobStorage("/blob", "blob-storage");
		const otherRoutes = routes.filter(route => route.operationId !== "blobStorageCreate");
		expect(otherRoutes.length).toBeGreaterThan(0);
		for (const route of otherRoutes) {
			expect(route.bodyLimit).toBeUndefined();
		}
	});
});
