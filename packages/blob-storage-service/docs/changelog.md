# Changelog

## [0.10.1-next.2](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.10.1-next.1...blob-storage-service-v0.10.1-next.2) (2026-09-26)


### Miscellaneous Chores

* **blob-storage-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.10.1-next.1 to 0.10.1-next.2
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.10.1-next.1 to 0.10.1-next.2

## [0.10.1-next.1](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.10.1-next.0...blob-storage-service-v0.10.1-next.1) (2026-09-18)


### Features

* add compression support ([67d239b](https://github.com/iotaledger/twin-blob-storage/commit/67d239bca8321bd90bf4ff93167c564130309730))
* add context id features ([#30](https://github.com/iotaledger/twin-blob-storage/issues/30)) ([fbf1c92](https://github.com/iotaledger/twin-blob-storage/commit/fbf1c9276424c841ef5ef3f4de8469ab3fba7e9c))
* add empty and teardown methods ([#49](https://github.com/iotaledger/twin-blob-storage/issues/49)) ([cec6248](https://github.com/iotaledger/twin-blob-storage/commit/cec624809ffd2f2baa4b7b8cbf72a7247b8703ed))
* add ts-to-jsonld-context tool ([2fd217f](https://github.com/iotaledger/twin-blob-storage/commit/2fd217f50dfaf6ac068091876237f5a101a7995e))
* add validate-locales ([f20fcec](https://github.com/iotaledger/twin-blob-storage/commit/f20fceced91e39a0c9edb770b2e43ce944c92f3c))
* additional encryption options on per item basis ([4b95a65](https://github.com/iotaledger/twin-blob-storage/commit/4b95a656d19e3b571cea905e36f29b679b13e1e8))
* allow large payloads on the blob create route ([#103](https://github.com/iotaledger/twin-blob-storage/issues/103)) ([af87205](https://github.com/iotaledger/twin-blob-storage/commit/af8720504e52daa07b98e3569e9d39f7617f2999))
* async getStore ([#59](https://github.com/iotaledger/twin-blob-storage/issues/59)) ([2de1ae5](https://github.com/iotaledger/twin-blob-storage/commit/2de1ae5c274b84a2320f75ac4628b81e9459c540))
* blobHash changed to integrity ([#41](https://github.com/iotaledger/twin-blob-storage/issues/41)) ([c06a55f](https://github.com/iotaledger/twin-blob-storage/commit/c06a55f0eed3f7cad5d19c4084abd8ef0cdbfb60))
* enhanced rest testing ([#74](https://github.com/iotaledger/twin-blob-storage/issues/74)) ([d56ae7b](https://github.com/iotaledger/twin-blob-storage/commit/d56ae7bf71767f8dd8a98113916309ab7c761f9c))
* eslint migration to flat config ([e4239dd](https://github.com/iotaledger/twin-blob-storage/commit/e4239dd1c721955cff7f0357255d2bba15319972))
* improve entity schemas ([#116](https://github.com/iotaledger/twin-blob-storage/issues/116)) ([c26a110](https://github.com/iotaledger/twin-blob-storage/commit/c26a1108d1c1cf62a247d2c326141da34b284684))
* linting and dependency update ([d95c578](https://github.com/iotaledger/twin-blob-storage/commit/d95c57878a6dd3f220580595ba4096107d7015c3))
* mock telemetry ([362cef4](https://github.com/iotaledger/twin-blob-storage/commit/362cef4bec171edc872bf19d76c36ff892a811b3))
* multiple fixes ([#90](https://github.com/iotaledger/twin-blob-storage/issues/90)) ([90414b3](https://github.com/iotaledger/twin-blob-storage/commit/90414b39b4fbb5eba0e227a4086130a62d29c016))
* remove hosting component ([#63](https://github.com/iotaledger/twin-blob-storage/issues/63)) ([215b744](https://github.com/iotaledger/twin-blob-storage/commit/215b7446fa94485fd4c87225746345f05773fb9b))
* remove includeNodeIdentity flag ([13bc334](https://github.com/iotaledger/twin-blob-storage/commit/13bc33445b179879688af3c98e8be8a5609d3f46))
* remove unused namespace ([6376433](https://github.com/iotaledger/twin-blob-storage/commit/637643399ffa42dbf6af07e7579e82e392ac90c9))
* replace nextItem property with Link header ([#37](https://github.com/iotaledger/twin-blob-storage/issues/37)) ([0b68da5](https://github.com/iotaledger/twin-blob-storage/commit/0b68da58549c9e52eb2313ea5a868573840d5ca6))
* rest enhancements ([#76](https://github.com/iotaledger/twin-blob-storage/issues/76)) ([ffe3d0c](https://github.com/iotaledger/twin-blob-storage/commit/ffe3d0cd456324eb79c18ea5e49b0e8be704cc5d))
* telemetry ([#99](https://github.com/iotaledger/twin-blob-storage/issues/99)) ([e1e1644](https://github.com/iotaledger/twin-blob-storage/commit/e1e16441d1211022ea9d0edd98f2f57857aa8eb5))
* typescript 6 update ([4eed54f](https://github.com/iotaledger/twin-blob-storage/commit/4eed54f5ce2dc697c06597269c97ad4cad108be5))
* update contexts ([#34](https://github.com/iotaledger/twin-blob-storage/issues/34)) ([b9e432c](https://github.com/iotaledger/twin-blob-storage/commit/b9e432c26025e4bfdf5ba837516dfdbf40f45a61))
* update contexts and namespaces ([#32](https://github.com/iotaledger/twin-blob-storage/issues/32)) ([187ed36](https://github.com/iotaledger/twin-blob-storage/commit/187ed36a7d83062665f70689ec5e2b2f553a592e))
* update dependencies ([ca3c571](https://github.com/iotaledger/twin-blob-storage/commit/ca3c571573c771b8d25594f729651c8214e28263))
* update dependencies ([56f0094](https://github.com/iotaledger/twin-blob-storage/commit/56f0094b68d8bd22864cd899ac1b61d95540f719))
* update framework core ([ff339fe](https://github.com/iotaledger/twin-blob-storage/commit/ff339fe7e3f09ddff429907834bdf43617e9c05e))
* update naming ([19d160f](https://github.com/iotaledger/twin-blob-storage/commit/19d160f6c2b155a1a19b85f4d676cbc15c0f0869))
* update schemas ([6fe6571](https://github.com/iotaledger/twin-blob-storage/commit/6fe65714e23209cdd760ecd5aa8e18762044e4b3))
* update to support fully qualified data type names ([3297d69](https://github.com/iotaledger/twin-blob-storage/commit/3297d69d332058b0f0141002087f56ba230620e1))
* use new hosting url for cursor links ([6844126](https://github.com/iotaledger/twin-blob-storage/commit/6844126e1c431448de51225392daa3559776fdf3))
* use shared store mechanism ([#12](https://github.com/iotaledger/twin-blob-storage/issues/12)) ([cae8110](https://github.com/iotaledger/twin-blob-storage/commit/cae8110681847a1ac4fcac968b8196694e49c320))
* use standard list json ld types ([d6bdfd6](https://github.com/iotaledger/twin-blob-storage/commit/d6bdfd68af47f70f3cc53658b4a12543497e1f48))


### Bug Fixes

* Adding the optional flag to the entity ([#10](https://github.com/iotaledger/twin-blob-storage/issues/10)) ([626677e](https://github.com/iotaledger/twin-blob-storage/commit/626677e5730d23535a0eb1f36f8394d941ff2447))
* api docs ([0f5d3ad](https://github.com/iotaledger/twin-blob-storage/commit/0f5d3ad88c4c048495ffd64886d00ceb25a976d6))
* query params force coercion ([a5e547a](https://github.com/iotaledger/twin-blob-storage/commit/a5e547a775f8997cb04780938c7a9561ddb048d1))
* support new compactArrays flag ([eb81ea7](https://github.com/iotaledger/twin-blob-storage/commit/eb81ea7e43d532f121fa391bc07e268eecd6c571))
* use async getStore in tests ([b6b347f](https://github.com/iotaledger/twin-blob-storage/commit/b6b347f3db578b0e3d7c171a65e8dc31062ba5aa))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.10.1-next.0 to 0.10.1-next.1
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.10.1-next.0 to 0.10.1-next.1

## [0.10.0](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.10.0...blob-storage-service-v0.10.0) (2026-09-16)


### Features

* mock telemetry ([816a877](https://github.com/iotaledger/twin-blob-storage/commit/816a877f2d779d65108194b7c44172dab96ea917))
* mock telemetry ([3adf214](https://github.com/iotaledger/twin-blob-storage/commit/3adf2142cd38735aebfd252f540f16a114829291))
* release to production ([eacfe75](https://github.com/iotaledger/twin-blob-storage/commit/eacfe754a0dcd9243d9e13d86422327d0a605164))
* release to production ([#108](https://github.com/iotaledger/twin-blob-storage/issues/108)) ([ae87a7a](https://github.com/iotaledger/twin-blob-storage/commit/ae87a7a7b70595e9fac8d8843bdc7c01fbc9b3fe))
* release to production ([#70](https://github.com/iotaledger/twin-blob-storage/issues/70)) ([6a38fe5](https://github.com/iotaledger/twin-blob-storage/commit/6a38fe583076baf1fc53d1d891d294b75ebbefd1))
* release to production ([#81](https://github.com/iotaledger/twin-blob-storage/issues/81)) ([0743e8f](https://github.com/iotaledger/twin-blob-storage/commit/0743e8fd2d542d687a8ba49a8251ae1805023c9f))
* release to production [skip ci] ([#113](https://github.com/iotaledger/twin-blob-storage/issues/113)) ([d387e9a](https://github.com/iotaledger/twin-blob-storage/commit/d387e9aa65b07a5e328f7fdf3bad09c95f86355a))

## [0.9.2](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.9.2...blob-storage-service-v0.9.2) (2026-08-24)


### Features

* release to production ([eacfe75](https://github.com/iotaledger/twin-blob-storage/commit/eacfe754a0dcd9243d9e13d86422327d0a605164))
* release to production ([#108](https://github.com/iotaledger/twin-blob-storage/issues/108)) ([ae87a7a](https://github.com/iotaledger/twin-blob-storage/commit/ae87a7a7b70595e9fac8d8843bdc7c01fbc9b3fe))
* release to production ([#70](https://github.com/iotaledger/twin-blob-storage/issues/70)) ([6a38fe5](https://github.com/iotaledger/twin-blob-storage/commit/6a38fe583076baf1fc53d1d891d294b75ebbefd1))
* release to production ([#81](https://github.com/iotaledger/twin-blob-storage/issues/81)) ([0743e8f](https://github.com/iotaledger/twin-blob-storage/commit/0743e8fd2d542d687a8ba49a8251ae1805023c9f))

## [0.9.2-next.5](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.9.2-next.4...blob-storage-service-v0.9.2-next.5) (2026-08-20)


### Features

* allow large payloads on the blob create route ([#103](https://github.com/iotaledger/twin-blob-storage/issues/103)) ([af87205](https://github.com/iotaledger/twin-blob-storage/commit/af8720504e52daa07b98e3569e9d39f7617f2999))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.9.2-next.4 to 0.9.2-next.5
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.9.2-next.4 to 0.9.2-next.5

## [0.9.2-next.4](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.9.2-next.3...blob-storage-service-v0.9.2-next.4) (2026-08-10)


### Features

* telemetry ([#99](https://github.com/iotaledger/twin-blob-storage/issues/99)) ([e1e1644](https://github.com/iotaledger/twin-blob-storage/commit/e1e16441d1211022ea9d0edd98f2f57857aa8eb5))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.9.2-next.3 to 0.9.2-next.4
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.9.2-next.3 to 0.9.2-next.4

## [0.9.2-next.3](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.9.2-next.2...blob-storage-service-v0.9.2-next.3) (2026-08-07)


### Features

* linting and dependency update ([d95c578](https://github.com/iotaledger/twin-blob-storage/commit/d95c57878a6dd3f220580595ba4096107d7015c3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.9.2-next.2 to 0.9.2-next.3
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.9.2-next.2 to 0.9.2-next.3

## [0.9.2-next.2](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.9.2-next.1...blob-storage-service-v0.9.2-next.2) (2026-08-03)


### Miscellaneous Chores

* **blob-storage-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.9.2-next.1 to 0.9.2-next.2
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.9.2-next.1 to 0.9.2-next.2

## [0.9.2-next.1](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.9.2-next.0...blob-storage-service-v0.9.2-next.1) (2026-07-30)


### Features

* add compression support ([67d239b](https://github.com/iotaledger/twin-blob-storage/commit/67d239bca8321bd90bf4ff93167c564130309730))
* add context id features ([#30](https://github.com/iotaledger/twin-blob-storage/issues/30)) ([fbf1c92](https://github.com/iotaledger/twin-blob-storage/commit/fbf1c9276424c841ef5ef3f4de8469ab3fba7e9c))
* add empty and teardown methods ([#49](https://github.com/iotaledger/twin-blob-storage/issues/49)) ([cec6248](https://github.com/iotaledger/twin-blob-storage/commit/cec624809ffd2f2baa4b7b8cbf72a7247b8703ed))
* add ts-to-jsonld-context tool ([2fd217f](https://github.com/iotaledger/twin-blob-storage/commit/2fd217f50dfaf6ac068091876237f5a101a7995e))
* add validate-locales ([f20fcec](https://github.com/iotaledger/twin-blob-storage/commit/f20fceced91e39a0c9edb770b2e43ce944c92f3c))
* additional encryption options on per item basis ([4b95a65](https://github.com/iotaledger/twin-blob-storage/commit/4b95a656d19e3b571cea905e36f29b679b13e1e8))
* async getStore ([#59](https://github.com/iotaledger/twin-blob-storage/issues/59)) ([2de1ae5](https://github.com/iotaledger/twin-blob-storage/commit/2de1ae5c274b84a2320f75ac4628b81e9459c540))
* blobHash changed to integrity ([#41](https://github.com/iotaledger/twin-blob-storage/issues/41)) ([c06a55f](https://github.com/iotaledger/twin-blob-storage/commit/c06a55f0eed3f7cad5d19c4084abd8ef0cdbfb60))
* enhanced rest testing ([#74](https://github.com/iotaledger/twin-blob-storage/issues/74)) ([d56ae7b](https://github.com/iotaledger/twin-blob-storage/commit/d56ae7bf71767f8dd8a98113916309ab7c761f9c))
* eslint migration to flat config ([e4239dd](https://github.com/iotaledger/twin-blob-storage/commit/e4239dd1c721955cff7f0357255d2bba15319972))
* multiple fixes ([#90](https://github.com/iotaledger/twin-blob-storage/issues/90)) ([90414b3](https://github.com/iotaledger/twin-blob-storage/commit/90414b39b4fbb5eba0e227a4086130a62d29c016))
* remove hosting component ([#63](https://github.com/iotaledger/twin-blob-storage/issues/63)) ([215b744](https://github.com/iotaledger/twin-blob-storage/commit/215b7446fa94485fd4c87225746345f05773fb9b))
* remove includeNodeIdentity flag ([13bc334](https://github.com/iotaledger/twin-blob-storage/commit/13bc33445b179879688af3c98e8be8a5609d3f46))
* remove unused namespace ([6376433](https://github.com/iotaledger/twin-blob-storage/commit/637643399ffa42dbf6af07e7579e82e392ac90c9))
* replace nextItem property with Link header ([#37](https://github.com/iotaledger/twin-blob-storage/issues/37)) ([0b68da5](https://github.com/iotaledger/twin-blob-storage/commit/0b68da58549c9e52eb2313ea5a868573840d5ca6))
* rest enhancements ([#76](https://github.com/iotaledger/twin-blob-storage/issues/76)) ([ffe3d0c](https://github.com/iotaledger/twin-blob-storage/commit/ffe3d0cd456324eb79c18ea5e49b0e8be704cc5d))
* typescript 6 update ([4eed54f](https://github.com/iotaledger/twin-blob-storage/commit/4eed54f5ce2dc697c06597269c97ad4cad108be5))
* update contexts ([#34](https://github.com/iotaledger/twin-blob-storage/issues/34)) ([b9e432c](https://github.com/iotaledger/twin-blob-storage/commit/b9e432c26025e4bfdf5ba837516dfdbf40f45a61))
* update contexts and namespaces ([#32](https://github.com/iotaledger/twin-blob-storage/issues/32)) ([187ed36](https://github.com/iotaledger/twin-blob-storage/commit/187ed36a7d83062665f70689ec5e2b2f553a592e))
* update dependencies ([ca3c571](https://github.com/iotaledger/twin-blob-storage/commit/ca3c571573c771b8d25594f729651c8214e28263))
* update dependencies ([56f0094](https://github.com/iotaledger/twin-blob-storage/commit/56f0094b68d8bd22864cd899ac1b61d95540f719))
* update framework core ([ff339fe](https://github.com/iotaledger/twin-blob-storage/commit/ff339fe7e3f09ddff429907834bdf43617e9c05e))
* update naming ([19d160f](https://github.com/iotaledger/twin-blob-storage/commit/19d160f6c2b155a1a19b85f4d676cbc15c0f0869))
* update schemas ([6fe6571](https://github.com/iotaledger/twin-blob-storage/commit/6fe65714e23209cdd760ecd5aa8e18762044e4b3))
* update to support fully qualified data type names ([3297d69](https://github.com/iotaledger/twin-blob-storage/commit/3297d69d332058b0f0141002087f56ba230620e1))
* use new hosting url for cursor links ([6844126](https://github.com/iotaledger/twin-blob-storage/commit/6844126e1c431448de51225392daa3559776fdf3))
* use shared store mechanism ([#12](https://github.com/iotaledger/twin-blob-storage/issues/12)) ([cae8110](https://github.com/iotaledger/twin-blob-storage/commit/cae8110681847a1ac4fcac968b8196694e49c320))
* use standard list json ld types ([d6bdfd6](https://github.com/iotaledger/twin-blob-storage/commit/d6bdfd68af47f70f3cc53658b4a12543497e1f48))


### Bug Fixes

* Adding the optional flag to the entity ([#10](https://github.com/iotaledger/twin-blob-storage/issues/10)) ([626677e](https://github.com/iotaledger/twin-blob-storage/commit/626677e5730d23535a0eb1f36f8394d941ff2447))
* api docs ([0f5d3ad](https://github.com/iotaledger/twin-blob-storage/commit/0f5d3ad88c4c048495ffd64886d00ceb25a976d6))
* query params force coercion ([a5e547a](https://github.com/iotaledger/twin-blob-storage/commit/a5e547a775f8997cb04780938c7a9561ddb048d1))
* support new compactArrays flag ([eb81ea7](https://github.com/iotaledger/twin-blob-storage/commit/eb81ea7e43d532f121fa391bc07e268eecd6c571))
* use async getStore in tests ([b6b347f](https://github.com/iotaledger/twin-blob-storage/commit/b6b347f3db578b0e3d7c171a65e8dc31062ba5aa))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.9.2-next.0 to 0.9.2-next.1
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.9.2-next.0 to 0.9.2-next.1

## [0.9.1](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.9.1...blob-storage-service-v0.9.1) (2026-07-27)


### Features

* release to production ([eacfe75](https://github.com/iotaledger/twin-blob-storage/commit/eacfe754a0dcd9243d9e13d86422327d0a605164))
* release to production ([#70](https://github.com/iotaledger/twin-blob-storage/issues/70)) ([6a38fe5](https://github.com/iotaledger/twin-blob-storage/commit/6a38fe583076baf1fc53d1d891d294b75ebbefd1))
* release to production ([#81](https://github.com/iotaledger/twin-blob-storage/issues/81)) ([0743e8f](https://github.com/iotaledger/twin-blob-storage/commit/0743e8fd2d542d687a8ba49a8251ae1805023c9f))

## [0.9.1-next.3](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.9.1-next.2...blob-storage-service-v0.9.1-next.3) (2026-06-30)


### Features

* rest enhancements ([#76](https://github.com/iotaledger/twin-blob-storage/issues/76)) ([ffe3d0c](https://github.com/iotaledger/twin-blob-storage/commit/ffe3d0cd456324eb79c18ea5e49b0e8be704cc5d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.9.1-next.2 to 0.9.1-next.3
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.9.1-next.2 to 0.9.1-next.3

## [0.9.1-next.2](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.9.1-next.1...blob-storage-service-v0.9.1-next.2) (2026-06-29)


### Features

* enhanced rest testing ([#74](https://github.com/iotaledger/twin-blob-storage/issues/74)) ([d56ae7b](https://github.com/iotaledger/twin-blob-storage/commit/d56ae7bf71767f8dd8a98113916309ab7c761f9c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.9.1-next.1 to 0.9.1-next.2
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.9.1-next.1 to 0.9.1-next.2

## [0.9.1-next.1](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.9.1-next.0...blob-storage-service-v0.9.1-next.1) (2026-06-26)


### Features

* add compression support ([67d239b](https://github.com/iotaledger/twin-blob-storage/commit/67d239bca8321bd90bf4ff93167c564130309730))
* add context id features ([#30](https://github.com/iotaledger/twin-blob-storage/issues/30)) ([fbf1c92](https://github.com/iotaledger/twin-blob-storage/commit/fbf1c9276424c841ef5ef3f4de8469ab3fba7e9c))
* add empty and teardown methods ([#49](https://github.com/iotaledger/twin-blob-storage/issues/49)) ([cec6248](https://github.com/iotaledger/twin-blob-storage/commit/cec624809ffd2f2baa4b7b8cbf72a7247b8703ed))
* add ts-to-jsonld-context tool ([2fd217f](https://github.com/iotaledger/twin-blob-storage/commit/2fd217f50dfaf6ac068091876237f5a101a7995e))
* add validate-locales ([f20fcec](https://github.com/iotaledger/twin-blob-storage/commit/f20fceced91e39a0c9edb770b2e43ce944c92f3c))
* additional encryption options on per item basis ([4b95a65](https://github.com/iotaledger/twin-blob-storage/commit/4b95a656d19e3b571cea905e36f29b679b13e1e8))
* async getStore ([#59](https://github.com/iotaledger/twin-blob-storage/issues/59)) ([2de1ae5](https://github.com/iotaledger/twin-blob-storage/commit/2de1ae5c274b84a2320f75ac4628b81e9459c540))
* blobHash changed to integrity ([#41](https://github.com/iotaledger/twin-blob-storage/issues/41)) ([c06a55f](https://github.com/iotaledger/twin-blob-storage/commit/c06a55f0eed3f7cad5d19c4084abd8ef0cdbfb60))
* eslint migration to flat config ([e4239dd](https://github.com/iotaledger/twin-blob-storage/commit/e4239dd1c721955cff7f0357255d2bba15319972))
* remove hosting component ([#63](https://github.com/iotaledger/twin-blob-storage/issues/63)) ([215b744](https://github.com/iotaledger/twin-blob-storage/commit/215b7446fa94485fd4c87225746345f05773fb9b))
* remove includeNodeIdentity flag ([13bc334](https://github.com/iotaledger/twin-blob-storage/commit/13bc33445b179879688af3c98e8be8a5609d3f46))
* remove unused namespace ([6376433](https://github.com/iotaledger/twin-blob-storage/commit/637643399ffa42dbf6af07e7579e82e392ac90c9))
* replace nextItem property with Link header ([#37](https://github.com/iotaledger/twin-blob-storage/issues/37)) ([0b68da5](https://github.com/iotaledger/twin-blob-storage/commit/0b68da58549c9e52eb2313ea5a868573840d5ca6))
* typescript 6 update ([4eed54f](https://github.com/iotaledger/twin-blob-storage/commit/4eed54f5ce2dc697c06597269c97ad4cad108be5))
* update contexts ([#34](https://github.com/iotaledger/twin-blob-storage/issues/34)) ([b9e432c](https://github.com/iotaledger/twin-blob-storage/commit/b9e432c26025e4bfdf5ba837516dfdbf40f45a61))
* update contexts and namespaces ([#32](https://github.com/iotaledger/twin-blob-storage/issues/32)) ([187ed36](https://github.com/iotaledger/twin-blob-storage/commit/187ed36a7d83062665f70689ec5e2b2f553a592e))
* update dependencies ([ca3c571](https://github.com/iotaledger/twin-blob-storage/commit/ca3c571573c771b8d25594f729651c8214e28263))
* update dependencies ([56f0094](https://github.com/iotaledger/twin-blob-storage/commit/56f0094b68d8bd22864cd899ac1b61d95540f719))
* update framework core ([ff339fe](https://github.com/iotaledger/twin-blob-storage/commit/ff339fe7e3f09ddff429907834bdf43617e9c05e))
* update naming ([19d160f](https://github.com/iotaledger/twin-blob-storage/commit/19d160f6c2b155a1a19b85f4d676cbc15c0f0869))
* update schemas ([6fe6571](https://github.com/iotaledger/twin-blob-storage/commit/6fe65714e23209cdd760ecd5aa8e18762044e4b3))
* update to support fully qualified data type names ([3297d69](https://github.com/iotaledger/twin-blob-storage/commit/3297d69d332058b0f0141002087f56ba230620e1))
* use new hosting url for cursor links ([6844126](https://github.com/iotaledger/twin-blob-storage/commit/6844126e1c431448de51225392daa3559776fdf3))
* use shared store mechanism ([#12](https://github.com/iotaledger/twin-blob-storage/issues/12)) ([cae8110](https://github.com/iotaledger/twin-blob-storage/commit/cae8110681847a1ac4fcac968b8196694e49c320))
* use standard list json ld types ([d6bdfd6](https://github.com/iotaledger/twin-blob-storage/commit/d6bdfd68af47f70f3cc53658b4a12543497e1f48))


### Bug Fixes

* Adding the optional flag to the entity ([#10](https://github.com/iotaledger/twin-blob-storage/issues/10)) ([626677e](https://github.com/iotaledger/twin-blob-storage/commit/626677e5730d23535a0eb1f36f8394d941ff2447))
* api docs ([0f5d3ad](https://github.com/iotaledger/twin-blob-storage/commit/0f5d3ad88c4c048495ffd64886d00ceb25a976d6))
* query params force coercion ([a5e547a](https://github.com/iotaledger/twin-blob-storage/commit/a5e547a775f8997cb04780938c7a9561ddb048d1))
* use async getStore in tests ([b6b347f](https://github.com/iotaledger/twin-blob-storage/commit/b6b347f3db578b0e3d7c171a65e8dc31062ba5aa))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.9.1-next.0 to 0.9.1-next.1
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.9.1-next.0 to 0.9.1-next.1

## [0.9.0](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.9.0...blob-storage-service-v0.9.0) (2026-06-24)


### Features

* release to production ([eacfe75](https://github.com/iotaledger/twin-blob-storage/commit/eacfe754a0dcd9243d9e13d86422327d0a605164))
* release to production ([#70](https://github.com/iotaledger/twin-blob-storage/issues/70)) ([6a38fe5](https://github.com/iotaledger/twin-blob-storage/commit/6a38fe583076baf1fc53d1d891d294b75ebbefd1))

## [0.9.0-next.1](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.9.0-next.0...blob-storage-service-v0.9.0-next.1) (2026-06-23)


### Features

* add compression support ([67d239b](https://github.com/iotaledger/twin-blob-storage/commit/67d239bca8321bd90bf4ff93167c564130309730))
* add context id features ([#30](https://github.com/iotaledger/twin-blob-storage/issues/30)) ([fbf1c92](https://github.com/iotaledger/twin-blob-storage/commit/fbf1c9276424c841ef5ef3f4de8469ab3fba7e9c))
* add empty and teardown methods ([#49](https://github.com/iotaledger/twin-blob-storage/issues/49)) ([cec6248](https://github.com/iotaledger/twin-blob-storage/commit/cec624809ffd2f2baa4b7b8cbf72a7247b8703ed))
* add ts-to-jsonld-context tool ([2fd217f](https://github.com/iotaledger/twin-blob-storage/commit/2fd217f50dfaf6ac068091876237f5a101a7995e))
* add validate-locales ([f20fcec](https://github.com/iotaledger/twin-blob-storage/commit/f20fceced91e39a0c9edb770b2e43ce944c92f3c))
* additional encryption options on per item basis ([4b95a65](https://github.com/iotaledger/twin-blob-storage/commit/4b95a656d19e3b571cea905e36f29b679b13e1e8))
* async getStore ([#59](https://github.com/iotaledger/twin-blob-storage/issues/59)) ([2de1ae5](https://github.com/iotaledger/twin-blob-storage/commit/2de1ae5c274b84a2320f75ac4628b81e9459c540))
* blobHash changed to integrity ([#41](https://github.com/iotaledger/twin-blob-storage/issues/41)) ([c06a55f](https://github.com/iotaledger/twin-blob-storage/commit/c06a55f0eed3f7cad5d19c4084abd8ef0cdbfb60))
* eslint migration to flat config ([e4239dd](https://github.com/iotaledger/twin-blob-storage/commit/e4239dd1c721955cff7f0357255d2bba15319972))
* remove hosting component ([#63](https://github.com/iotaledger/twin-blob-storage/issues/63)) ([215b744](https://github.com/iotaledger/twin-blob-storage/commit/215b7446fa94485fd4c87225746345f05773fb9b))
* remove includeNodeIdentity flag ([13bc334](https://github.com/iotaledger/twin-blob-storage/commit/13bc33445b179879688af3c98e8be8a5609d3f46))
* remove unused namespace ([6376433](https://github.com/iotaledger/twin-blob-storage/commit/637643399ffa42dbf6af07e7579e82e392ac90c9))
* replace nextItem property with Link header ([#37](https://github.com/iotaledger/twin-blob-storage/issues/37)) ([0b68da5](https://github.com/iotaledger/twin-blob-storage/commit/0b68da58549c9e52eb2313ea5a868573840d5ca6))
* typescript 6 update ([4eed54f](https://github.com/iotaledger/twin-blob-storage/commit/4eed54f5ce2dc697c06597269c97ad4cad108be5))
* update contexts ([#34](https://github.com/iotaledger/twin-blob-storage/issues/34)) ([b9e432c](https://github.com/iotaledger/twin-blob-storage/commit/b9e432c26025e4bfdf5ba837516dfdbf40f45a61))
* update contexts and namespaces ([#32](https://github.com/iotaledger/twin-blob-storage/issues/32)) ([187ed36](https://github.com/iotaledger/twin-blob-storage/commit/187ed36a7d83062665f70689ec5e2b2f553a592e))
* update dependencies ([ca3c571](https://github.com/iotaledger/twin-blob-storage/commit/ca3c571573c771b8d25594f729651c8214e28263))
* update dependencies ([56f0094](https://github.com/iotaledger/twin-blob-storage/commit/56f0094b68d8bd22864cd899ac1b61d95540f719))
* update framework core ([ff339fe](https://github.com/iotaledger/twin-blob-storage/commit/ff339fe7e3f09ddff429907834bdf43617e9c05e))
* update naming ([19d160f](https://github.com/iotaledger/twin-blob-storage/commit/19d160f6c2b155a1a19b85f4d676cbc15c0f0869))
* update schemas ([6fe6571](https://github.com/iotaledger/twin-blob-storage/commit/6fe65714e23209cdd760ecd5aa8e18762044e4b3))
* update to support fully qualified data type names ([3297d69](https://github.com/iotaledger/twin-blob-storage/commit/3297d69d332058b0f0141002087f56ba230620e1))
* use new hosting url for cursor links ([6844126](https://github.com/iotaledger/twin-blob-storage/commit/6844126e1c431448de51225392daa3559776fdf3))
* use shared store mechanism ([#12](https://github.com/iotaledger/twin-blob-storage/issues/12)) ([cae8110](https://github.com/iotaledger/twin-blob-storage/commit/cae8110681847a1ac4fcac968b8196694e49c320))
* use standard list json ld types ([d6bdfd6](https://github.com/iotaledger/twin-blob-storage/commit/d6bdfd68af47f70f3cc53658b4a12543497e1f48))


### Bug Fixes

* Adding the optional flag to the entity ([#10](https://github.com/iotaledger/twin-blob-storage/issues/10)) ([626677e](https://github.com/iotaledger/twin-blob-storage/commit/626677e5730d23535a0eb1f36f8394d941ff2447))
* api docs ([0f5d3ad](https://github.com/iotaledger/twin-blob-storage/commit/0f5d3ad88c4c048495ffd64886d00ceb25a976d6))
* query params force coercion ([a5e547a](https://github.com/iotaledger/twin-blob-storage/commit/a5e547a775f8997cb04780938c7a9561ddb048d1))
* use async getStore in tests ([b6b347f](https://github.com/iotaledger/twin-blob-storage/commit/b6b347f3db578b0e3d7c171a65e8dc31062ba5aa))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.9.0-next.0 to 0.9.0-next.1
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.9.0-next.0 to 0.9.0-next.1

## [0.0.3-next.16](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.15...blob-storage-service-v0.0.3-next.16) (2026-06-18)


### Features

* remove hosting component ([#63](https://github.com/iotaledger/twin-blob-storage/issues/63)) ([215b744](https://github.com/iotaledger/twin-blob-storage/commit/215b7446fa94485fd4c87225746345f05773fb9b))


### Bug Fixes

* use async getStore in tests ([b6b347f](https://github.com/iotaledger/twin-blob-storage/commit/b6b347f3db578b0e3d7c171a65e8dc31062ba5aa))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.15 to 0.0.3-next.16
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.15 to 0.0.3-next.16

## [0.0.3-next.15](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.14...blob-storage-service-v0.0.3-next.15) (2026-06-15)


### Features

* async getStore ([#59](https://github.com/iotaledger/twin-blob-storage/issues/59)) ([2de1ae5](https://github.com/iotaledger/twin-blob-storage/commit/2de1ae5c274b84a2320f75ac4628b81e9459c540))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.14 to 0.0.3-next.15
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.14 to 0.0.3-next.15

## [0.0.3-next.14](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.13...blob-storage-service-v0.0.3-next.14) (2026-06-11)


### Miscellaneous Chores

* **blob-storage-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.13 to 0.0.3-next.14
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.13 to 0.0.3-next.14

## [0.0.3-next.13](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.12...blob-storage-service-v0.0.3-next.13) (2026-05-20)


### Features

* update dependencies ([ca3c571](https://github.com/iotaledger/twin-blob-storage/commit/ca3c571573c771b8d25594f729651c8214e28263))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.12 to 0.0.3-next.13
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.12 to 0.0.3-next.13

## [0.0.3-next.12](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.11...blob-storage-service-v0.0.3-next.12) (2026-05-11)


### Features

* typescript 6 update ([4eed54f](https://github.com/iotaledger/twin-blob-storage/commit/4eed54f5ce2dc697c06597269c97ad4cad108be5))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.11 to 0.0.3-next.12
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.11 to 0.0.3-next.12

## [0.0.3-next.11](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.10...blob-storage-service-v0.0.3-next.11) (2026-05-08)


### Features

* add empty and teardown methods ([#49](https://github.com/iotaledger/twin-blob-storage/issues/49)) ([cec6248](https://github.com/iotaledger/twin-blob-storage/commit/cec624809ffd2f2baa4b7b8cbf72a7247b8703ed))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.10 to 0.0.3-next.11
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.10 to 0.0.3-next.11

## [0.0.3-next.10](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.9...blob-storage-service-v0.0.3-next.10) (2026-05-07)


### Miscellaneous Chores

* **blob-storage-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.9 to 0.0.3-next.10
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.9 to 0.0.3-next.10

## [0.0.3-next.9](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.8...blob-storage-service-v0.0.3-next.9) (2026-05-07)


### Features

* add compression support ([67d239b](https://github.com/iotaledger/twin-blob-storage/commit/67d239bca8321bd90bf4ff93167c564130309730))
* add context id features ([#30](https://github.com/iotaledger/twin-blob-storage/issues/30)) ([fbf1c92](https://github.com/iotaledger/twin-blob-storage/commit/fbf1c9276424c841ef5ef3f4de8469ab3fba7e9c))
* add ts-to-jsonld-context tool ([2fd217f](https://github.com/iotaledger/twin-blob-storage/commit/2fd217f50dfaf6ac068091876237f5a101a7995e))
* add validate-locales ([f20fcec](https://github.com/iotaledger/twin-blob-storage/commit/f20fceced91e39a0c9edb770b2e43ce944c92f3c))
* additional encryption options on per item basis ([4b95a65](https://github.com/iotaledger/twin-blob-storage/commit/4b95a656d19e3b571cea905e36f29b679b13e1e8))
* blobHash changed to integrity ([#41](https://github.com/iotaledger/twin-blob-storage/issues/41)) ([c06a55f](https://github.com/iotaledger/twin-blob-storage/commit/c06a55f0eed3f7cad5d19c4084abd8ef0cdbfb60))
* eslint migration to flat config ([e4239dd](https://github.com/iotaledger/twin-blob-storage/commit/e4239dd1c721955cff7f0357255d2bba15319972))
* remove includeNodeIdentity flag ([13bc334](https://github.com/iotaledger/twin-blob-storage/commit/13bc33445b179879688af3c98e8be8a5609d3f46))
* remove unused namespace ([6376433](https://github.com/iotaledger/twin-blob-storage/commit/637643399ffa42dbf6af07e7579e82e392ac90c9))
* replace nextItem property with Link header ([#37](https://github.com/iotaledger/twin-blob-storage/issues/37)) ([0b68da5](https://github.com/iotaledger/twin-blob-storage/commit/0b68da58549c9e52eb2313ea5a868573840d5ca6))
* update contexts ([#34](https://github.com/iotaledger/twin-blob-storage/issues/34)) ([b9e432c](https://github.com/iotaledger/twin-blob-storage/commit/b9e432c26025e4bfdf5ba837516dfdbf40f45a61))
* update contexts and namespaces ([#32](https://github.com/iotaledger/twin-blob-storage/issues/32)) ([187ed36](https://github.com/iotaledger/twin-blob-storage/commit/187ed36a7d83062665f70689ec5e2b2f553a592e))
* update dependencies ([56f0094](https://github.com/iotaledger/twin-blob-storage/commit/56f0094b68d8bd22864cd899ac1b61d95540f719))
* update framework core ([ff339fe](https://github.com/iotaledger/twin-blob-storage/commit/ff339fe7e3f09ddff429907834bdf43617e9c05e))
* update naming ([19d160f](https://github.com/iotaledger/twin-blob-storage/commit/19d160f6c2b155a1a19b85f4d676cbc15c0f0869))
* update schemas ([6fe6571](https://github.com/iotaledger/twin-blob-storage/commit/6fe65714e23209cdd760ecd5aa8e18762044e4b3))
* update to support fully qualified data type names ([3297d69](https://github.com/iotaledger/twin-blob-storage/commit/3297d69d332058b0f0141002087f56ba230620e1))
* use new hosting url for cursor links ([6844126](https://github.com/iotaledger/twin-blob-storage/commit/6844126e1c431448de51225392daa3559776fdf3))
* use shared store mechanism ([#12](https://github.com/iotaledger/twin-blob-storage/issues/12)) ([cae8110](https://github.com/iotaledger/twin-blob-storage/commit/cae8110681847a1ac4fcac968b8196694e49c320))
* use standard list json ld types ([d6bdfd6](https://github.com/iotaledger/twin-blob-storage/commit/d6bdfd68af47f70f3cc53658b4a12543497e1f48))


### Bug Fixes

* Adding the optional flag to the entity ([#10](https://github.com/iotaledger/twin-blob-storage/issues/10)) ([626677e](https://github.com/iotaledger/twin-blob-storage/commit/626677e5730d23535a0eb1f36f8394d941ff2447))
* api docs ([0f5d3ad](https://github.com/iotaledger/twin-blob-storage/commit/0f5d3ad88c4c048495ffd64886d00ceb25a976d6))
* query params force coercion ([a5e547a](https://github.com/iotaledger/twin-blob-storage/commit/a5e547a775f8997cb04780938c7a9561ddb048d1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.8 to 0.0.3-next.9
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.8 to 0.0.3-next.9

## [0.0.3-next.8](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.7...blob-storage-service-v0.0.3-next.8) (2026-05-07)


### Miscellaneous Chores

* **blob-storage-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.7 to 0.0.3-next.8
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.7 to 0.0.3-next.8

## [0.0.3-next.7](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.6...blob-storage-service-v0.0.3-next.7) (2026-02-25)


### Features

* update schemas ([6fe6571](https://github.com/iotaledger/twin-blob-storage/commit/6fe65714e23209cdd760ecd5aa8e18762044e4b3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.6 to 0.0.3-next.7
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.6 to 0.0.3-next.7

## [0.0.3-next.6](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.5...blob-storage-service-v0.0.3-next.6) (2026-02-09)


### Features

* add ts-to-jsonld-context tool ([2fd217f](https://github.com/iotaledger/twin-blob-storage/commit/2fd217f50dfaf6ac068091876237f5a101a7995e))
* blobHash changed to integrity ([#41](https://github.com/iotaledger/twin-blob-storage/issues/41)) ([c06a55f](https://github.com/iotaledger/twin-blob-storage/commit/c06a55f0eed3f7cad5d19c4084abd8ef0cdbfb60))
* update naming ([19d160f](https://github.com/iotaledger/twin-blob-storage/commit/19d160f6c2b155a1a19b85f4d676cbc15c0f0869))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.5 to 0.0.3-next.6
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.5 to 0.0.3-next.6

## [0.0.3-next.5](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.4...blob-storage-service-v0.0.3-next.5) (2026-01-26)


### Features

* use new hosting url for cursor links ([6844126](https://github.com/iotaledger/twin-blob-storage/commit/6844126e1c431448de51225392daa3559776fdf3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.4 to 0.0.3-next.5
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.4 to 0.0.3-next.5

## [0.0.3-next.4](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.3...blob-storage-service-v0.0.3-next.4) (2026-01-23)


### Features

* replace nextItem property with Link header ([#37](https://github.com/iotaledger/twin-blob-storage/issues/37)) ([0b68da5](https://github.com/iotaledger/twin-blob-storage/commit/0b68da58549c9e52eb2313ea5a868573840d5ca6))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.3 to 0.0.3-next.4
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.3 to 0.0.3-next.4

## [0.0.3-next.3](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.2...blob-storage-service-v0.0.3-next.3) (2026-01-21)


### Features

* update contexts ([#34](https://github.com/iotaledger/twin-blob-storage/issues/34)) ([b9e432c](https://github.com/iotaledger/twin-blob-storage/commit/b9e432c26025e4bfdf5ba837516dfdbf40f45a61))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.2 to 0.0.3-next.3
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.2 to 0.0.3-next.3

## [0.0.3-next.2](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.1...blob-storage-service-v0.0.3-next.2) (2026-01-14)


### Features

* update contexts and namespaces ([#32](https://github.com/iotaledger/twin-blob-storage/issues/32)) ([187ed36](https://github.com/iotaledger/twin-blob-storage/commit/187ed36a7d83062665f70689ec5e2b2f553a592e))


### Bug Fixes

* api docs ([0f5d3ad](https://github.com/iotaledger/twin-blob-storage/commit/0f5d3ad88c4c048495ffd64886d00ceb25a976d6))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.1 to 0.0.3-next.2
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.1 to 0.0.3-next.2

## [0.0.3-next.1](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.3-next.0...blob-storage-service-v0.0.3-next.1) (2025-11-11)


### Features

* add compression support ([67d239b](https://github.com/iotaledger/twin-blob-storage/commit/67d239bca8321bd90bf4ff93167c564130309730))
* add context id features ([#30](https://github.com/iotaledger/twin-blob-storage/issues/30)) ([fbf1c92](https://github.com/iotaledger/twin-blob-storage/commit/fbf1c9276424c841ef5ef3f4de8469ab3fba7e9c))
* add validate-locales ([f20fcec](https://github.com/iotaledger/twin-blob-storage/commit/f20fceced91e39a0c9edb770b2e43ce944c92f3c))
* additional encryption options on per item basis ([4b95a65](https://github.com/iotaledger/twin-blob-storage/commit/4b95a656d19e3b571cea905e36f29b679b13e1e8))
* eslint migration to flat config ([e4239dd](https://github.com/iotaledger/twin-blob-storage/commit/e4239dd1c721955cff7f0357255d2bba15319972))
* remove includeNodeIdentity flag ([13bc334](https://github.com/iotaledger/twin-blob-storage/commit/13bc33445b179879688af3c98e8be8a5609d3f46))
* remove unused namespace ([6376433](https://github.com/iotaledger/twin-blob-storage/commit/637643399ffa42dbf6af07e7579e82e392ac90c9))
* update dependencies ([56f0094](https://github.com/iotaledger/twin-blob-storage/commit/56f0094b68d8bd22864cd899ac1b61d95540f719))
* update framework core ([ff339fe](https://github.com/iotaledger/twin-blob-storage/commit/ff339fe7e3f09ddff429907834bdf43617e9c05e))
* update to support fully qualified data type names ([3297d69](https://github.com/iotaledger/twin-blob-storage/commit/3297d69d332058b0f0141002087f56ba230620e1))
* use shared store mechanism ([#12](https://github.com/iotaledger/twin-blob-storage/issues/12)) ([cae8110](https://github.com/iotaledger/twin-blob-storage/commit/cae8110681847a1ac4fcac968b8196694e49c320))
* use standard list json ld types ([d6bdfd6](https://github.com/iotaledger/twin-blob-storage/commit/d6bdfd68af47f70f3cc53658b4a12543497e1f48))


### Bug Fixes

* Adding the optional flag to the entity ([#10](https://github.com/iotaledger/twin-blob-storage/issues/10)) ([626677e](https://github.com/iotaledger/twin-blob-storage/commit/626677e5730d23535a0eb1f36f8394d941ff2447))
* query params force coercion ([a5e547a](https://github.com/iotaledger/twin-blob-storage/commit/a5e547a775f8997cb04780938c7a9561ddb048d1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.3-next.0 to 0.0.3-next.1
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.3-next.0 to 0.0.3-next.1

## [0.0.2-next.5](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.2-next.4...blob-storage-service-v0.0.2-next.5) (2025-10-09)


### Features

* add validate-locales ([f20fcec](https://github.com/iotaledger/twin-blob-storage/commit/f20fceced91e39a0c9edb770b2e43ce944c92f3c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.2-next.4 to 0.0.2-next.5
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.2-next.4 to 0.0.2-next.5

## [0.0.2-next.4](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.2-next.3...blob-storage-service-v0.0.2-next.4) (2025-10-02)


### Miscellaneous Chores

* **blob-storage-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.2-next.3 to 0.0.2-next.4
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.2-next.3 to 0.0.2-next.4

## [0.0.2-next.3](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.2-next.2...blob-storage-service-v0.0.2-next.3) (2025-08-29)


### Features

* eslint migration to flat config ([e4239dd](https://github.com/iotaledger/twin-blob-storage/commit/e4239dd1c721955cff7f0357255d2bba15319972))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.2-next.2 to 0.0.2-next.3
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.2-next.2 to 0.0.2-next.3

## [0.0.2-next.2](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.2-next.1...blob-storage-service-v0.0.2-next.2) (2025-08-20)


### Features

* update framework core ([ff339fe](https://github.com/iotaledger/twin-blob-storage/commit/ff339fe7e3f09ddff429907834bdf43617e9c05e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.2-next.1 to 0.0.2-next.2
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.2-next.1 to 0.0.2-next.2

## [0.0.2-next.1](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.2-next.0...blob-storage-service-v0.0.2-next.1) (2025-07-24)


### Features

* add compression support ([67d239b](https://github.com/iotaledger/twin-blob-storage/commit/67d239bca8321bd90bf4ff93167c564130309730))
* additional encryption options on per item basis ([4b95a65](https://github.com/iotaledger/twin-blob-storage/commit/4b95a656d19e3b571cea905e36f29b679b13e1e8))
* remove includeNodeIdentity flag ([13bc334](https://github.com/iotaledger/twin-blob-storage/commit/13bc33445b179879688af3c98e8be8a5609d3f46))
* remove unused namespace ([6376433](https://github.com/iotaledger/twin-blob-storage/commit/637643399ffa42dbf6af07e7579e82e392ac90c9))
* update dependencies ([56f0094](https://github.com/iotaledger/twin-blob-storage/commit/56f0094b68d8bd22864cd899ac1b61d95540f719))
* update to support fully qualified data type names ([3297d69](https://github.com/iotaledger/twin-blob-storage/commit/3297d69d332058b0f0141002087f56ba230620e1))
* use shared store mechanism ([#12](https://github.com/iotaledger/twin-blob-storage/issues/12)) ([cae8110](https://github.com/iotaledger/twin-blob-storage/commit/cae8110681847a1ac4fcac968b8196694e49c320))
* use standard list json ld types ([d6bdfd6](https://github.com/iotaledger/twin-blob-storage/commit/d6bdfd68af47f70f3cc53658b4a12543497e1f48))


### Bug Fixes

* Adding the optional flag to the entity ([#10](https://github.com/iotaledger/twin-blob-storage/issues/10)) ([626677e](https://github.com/iotaledger/twin-blob-storage/commit/626677e5730d23535a0eb1f36f8394d941ff2447))
* query params force coercion ([a5e547a](https://github.com/iotaledger/twin-blob-storage/commit/a5e547a775f8997cb04780938c7a9561ddb048d1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.2-next.0 to 0.0.2-next.1
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.2-next.0 to 0.0.2-next.1

## 0.0.1 (2025-07-04)


### Features

* release to production ([eacfe75](https://github.com/iotaledger/twin-blob-storage/commit/eacfe754a0dcd9243d9e13d86422327d0a605164))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from ^0.0.0 to ^0.0.1
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from ^0.0.0 to ^0.0.1

## [0.0.1-next.37](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.1-next.36...blob-storage-service-v0.0.1-next.37) (2025-06-20)


### Bug Fixes

* query params force coercion ([a5e547a](https://github.com/iotaledger/twin-blob-storage/commit/a5e547a775f8997cb04780938c7a9561ddb048d1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.1-next.36 to 0.0.1-next.37
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.1-next.36 to 0.0.1-next.37

## [0.0.1-next.36](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.1-next.35...blob-storage-service-v0.0.1-next.36) (2025-06-19)


### Features

* add compression support ([67d239b](https://github.com/iotaledger/twin-blob-storage/commit/67d239bca8321bd90bf4ff93167c564130309730))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.1-next.35 to 0.0.1-next.36
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.1-next.35 to 0.0.1-next.36

## [0.0.1-next.35](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.1-next.34...blob-storage-service-v0.0.1-next.35) (2025-06-17)


### Features

* additional encryption options on per item basis ([4b95a65](https://github.com/iotaledger/twin-blob-storage/commit/4b95a656d19e3b571cea905e36f29b679b13e1e8))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.1-next.34 to 0.0.1-next.35
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.1-next.34 to 0.0.1-next.35

## [0.0.1-next.34](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.1-next.33...blob-storage-service-v0.0.1-next.34) (2025-06-12)


### Features

* update dependencies ([56f0094](https://github.com/iotaledger/twin-blob-storage/commit/56f0094b68d8bd22864cd899ac1b61d95540f719))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.1-next.33 to 0.0.1-next.34
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.1-next.33 to 0.0.1-next.34

## [0.0.1-next.33](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.1-next.32...blob-storage-service-v0.0.1-next.33) (2025-06-03)


### Miscellaneous Chores

* **blob-storage-service:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.1-next.32 to 0.0.1-next.33
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.1-next.32 to 0.0.1-next.33

## [0.0.1-next.32](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.1-next.31...blob-storage-service-v0.0.1-next.32) (2025-05-28)


### Features

* update to support fully qualified data type names ([3297d69](https://github.com/iotaledger/twin-blob-storage/commit/3297d69d332058b0f0141002087f56ba230620e1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.1-next.31 to 0.0.1-next.32
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.1-next.31 to 0.0.1-next.32

## [0.0.1-next.31](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.1-next.30...blob-storage-service-v0.0.1-next.31) (2025-05-08)


### Features

* use standard list json ld types ([d6bdfd6](https://github.com/iotaledger/twin-blob-storage/commit/d6bdfd68af47f70f3cc53658b4a12543497e1f48))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.1-next.30 to 0.0.1-next.31
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.1-next.30 to 0.0.1-next.31

## [0.0.1-next.30](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.1-next.29...blob-storage-service-v0.0.1-next.30) (2025-04-17)


### Features

* use shared store mechanism ([#12](https://github.com/iotaledger/twin-blob-storage/issues/12)) ([cae8110](https://github.com/iotaledger/twin-blob-storage/commit/cae8110681847a1ac4fcac968b8196694e49c320))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.1-next.29 to 0.0.1-next.30
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.1-next.29 to 0.0.1-next.30

## [0.0.1-next.29](https://github.com/iotaledger/twin-blob-storage/compare/blob-storage-service-v0.0.1-next.28...blob-storage-service-v0.0.1-next.29) (2025-03-28)


### Bug Fixes

* Adding the optional flag to the entity ([#10](https://github.com/iotaledger/twin-blob-storage/issues/10)) ([626677e](https://github.com/iotaledger/twin-blob-storage/commit/626677e5730d23535a0eb1f36f8394d941ff2447))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/blob-storage-models bumped from 0.0.1-next.28 to 0.0.1-next.29
  * devDependencies
    * @twin.org/blob-storage-connector-memory bumped from 0.0.1-next.28 to 0.0.1-next.29

## v0.0.1-next.28

- Initial Release
