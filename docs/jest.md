# Jest Tests/Coverage

Jest provides a testing framework for JavaScript, complete with a built-in coverage tool that generates reports on how much code is covered by tests. The framework supports various types of tests including unit, integration, and end-to-end, streamlining the testing process across different layers of your application.

---

* **Configuration/Tests:**
    - [`jest.config.js`](../jest.config.js) - Main configuration file that controls Jest testing
    - [`jest_setup.ts`](../jest_setup.ts)
        + Ran after environment setup, but before tests are ran
        + Adds custom Jest matchers that help with assertions for DOM nodes
        + Manual configuration to mock modules with named default exports due to inconsistencies (see below "Named Default Module Issues")
        + Included in `tsconfig.json` includes so matcher includes are automatically included
    - [`src/lib/*.test.ts`](../src/lib) - Unit tests for project libraries/classes
    - [`src/components/*.test.ts`](../src/components) - Integration tests for React components
    - [`src/partials/*.test.ts`](../src/partials) - Integration tests for application partials (also React components)
* **`package.json` scripts:**
    - `npm run tests` - Runs the tests with `--silent` to suppress console.log/error statements
    - `npm run tests_verbose` - Runs the tests with full console output
    - `npm run coverage` - Runs the `*.test.ts` tests in `./src/lib` with `--silent` and `--coverage` options to suppress console.log/error statements and generate code coverage reports
    - `npm run coverage_verbose` - Runs the `*.test.ts` tests in `./src/lib` with `--coverage` option to generate code coverage reports with full console output
* **`package.json --save-dev` Development Dependencies:**
    - [`jest`](https://jestjs.io/) - JavaScript Testing Framework with a focus on simplicity
    - [`@types/jest`](https://www.npmjs.com/package/@types/jest) - Type definitions for Jest
    - [`ts-node`](https://typestrong.org/ts-node/) - TypeScript execution and REPL for Node.js, Jest requires it to read TypeScript configuration files
    - [`ts-jest`](https://www.npmjs.com/package/ts-jest) - Jest transformer with source map support that lets you use Jest to test projects written in TypeScript
    - [`eslint-plugin-jest`](https://github.com/jest-community/eslint-plugin-jest#readme) - ESLint plugin for Jest
    - [`@testing-library/jest-dom`](https://www.npmjs.com/package/@testing-library/jest-dom) - Custom jest matchers to test the state of the DOM
    - [`@testing-library/react`](https://www.npmjs.com/package/@testing-library/react) - React DOM testing utilities
    - [`jest-axe`](https://www.npmjs.com/package/jest-axe) - Custom Jest matcher for axe for testing accessibility
    - `@types/jest-axe` - type definitions for `jest-axe`
    - [`react-test-renderer`](https://www.npmjs.com/package/react-test-renderer) - Experimental React renderer that can be used to render React components to pure JavaScript objects, without depending on the DOM or a native mobile environment
    - `@types/react-test-renderer` - type definitions for `react-test-renderer`
    - [`identity-obj-proxy`](https://www.npmjs.com/package/identity-obj-proxy) - An identity object using ES6 proxies like CSS modules
    - [`jest-environment-jsdom`](https://www.npmjs.com/package/jest-environment-jsdom) - Jest environment for "jsdom" configuration

---

## Testing Types

Modern front-end testing requires multiple types of tests to be ran in different contexts to fully validate an application. Below covers all of the types of testing handled by Jest.

#### Unit Tests

* Ran with `npm run tests` and `npm run tests_verbose`
* Located in [`src/lib/*.test.ts`](../src/lib)
* Tests libraries that do not have front-end concerns; ex: a HTTP client wrapper

#### Integration Tests

* Ran with `npm run tests` and `npm run tests_verbose`
* Located in [`src/components/*.test.ts`](../src/components) and [`src/partials/*.test.ts`](../src/partials)
* Uses `react-testing-library` utility functions on top of `react-dom` and `react-dom/test-utils` that allow you to emulate the DOM with normal interactions
* Used to test React components

#### Coverage Tests

* Ran with `npm run coverage` and `npm run coverage_verbose`
* Consists of both above "Unit Tests" and "Integration Tests" above
* Ensures all code is reachable
* Coverage reporting generates in `./coverage`

#### Snapshot Tests

* Ran with `npm run tests` and `npm run tests_verbose`
* Included in the main `./src/App.tsx` testing and takes fully rendered snapshot of application
* Generates snapshots in [`./src/__snapshots__`](../src/__snapshots__) directory which are checked-in via SCM
* Update the snapshots via `npm run tests -- -u src/App.test.tsx` and check-in results

#### Accessibility Tests

* Ran with `npm run tests` and `npm run tests_verbose`
* Included in "Integration Tests" above
* Uses `jest-axe` to check for common accessibility issues; ex: missing alt tags on images

#### E2E Tests

Not handled by Jest - see [playwright.md](playwright.md) docs for more information as these need to be ran separate from Jest tests.

---

## Node.js `--experimental-vm-modules` ECMAScript Modules Support

The `--experimental-vm-modules` flag is required when running `jest.js` with Node.js binary. This will generate a warning about using an experimental flag which can be ignored with `--no-warnings`. The following is what the base `npm run test` `package.json` script command:

```bash
# Run all Jest unit and integration tests
node --no-warnings --experimental-vm-modules node_modules/jest/bin/jest.js
```

More on **[Jest ECMAScript Modules »](https://jestjs.io/docs/ecmascript-modules)**

---

## Jest `--detectOpenHandles`, `--silent`

**NOTE:** Both of these are optional!

* `--detectOpenHandles` - Attempts to report on open handles preventing Jest from exiting cleanly; ex: a non-cleared `setTimeout`
* `--silent` - Hide `console.*` output to console and only show test/coverage results; this flag is the difference between the `npm run tests` and the `npm run tests_verbose` `package.json` scripts

```bash
# Run all Jest unit and integration tests with recommended Jest options
node --no-warnings --experimental-vm-modules node_modules/jest/bin/jest.js --detectOpenHandles --silent
node --no-warnings --experimental-vm-modules node_modules/jest/bin/jest.js --detectOpenHandles
```

More on **[`--detectOpenHandles` »](https://jestjs.io/docs/cli#--detectopenhandles)**

---

## Mocking CSS/Static Asset Modules

When front-end code includes CSS or static asset modules it will cause syntax errors with Jest. To avoid this we use `moduleNameMapper` in `jest.config.js` to map these assets to safe mocked versions.

* CSS modules use `identity-obj-proxy`
* Static asset modules use [`file_mock.ts`](../tests/__mocks__/file_mock.ts) to return a simple string representing the asset
* More information on both CSS/static module mocking - https://jestjs.io/docs/webpack#mocking-css-modules

---

## Named Default Module Issues

#### The issue:

A named default export looks like the following:

```js
// Real-world example
import json from "highlight.js/lib/languages/json";
export default json;
```

These are handled different between esbuild and Jest contexts; shown below is the difference of the scope, showing Jest loaded the module as CJS nesting the expected scope under `jest.default` whereas esbuild handles it as-expected:

```js
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';

// esbuild
json

// Jest
json.default
````

#### Why it happens:

**Short version:** Jest and Node's module resolvers are behaving different causing named module imports to be processed as CJS, falling through to `cjs-module-lexer`.

**Full version:**

* Why this issue is happening in Jest - https://github.com/jestjs/jest/issues/11563#issuecomment-863860566
* `cjs-module-lexer` author input (referenced in above issue comment) - https://github.com/nodejs/cjs-module-lexer/issues/57#issuecomment-862413992

#### How to fix:

To fix this we mock the module manually before tests run in [jest_setup.ts](../jest_setup.ts), removing the `.default` if needed. To do this, add the offending module import to `JestSetup.fix_exported_modules_w_named_defaults` and the mock will be setup for you. This ensures that imports work as-expected in the esbuild and Jest contexts, avoiding ugly `json.default || json` logic.

**Example:**

Assuming the import used in our example above, add the import string to [jest_setup.ts](../jest_setup.ts):

```typescript
this.fix_exported_modules_w_named_defaults = [
    'react-syntax-highlighter/dist/esm/languages/hljs/json'
];
```

---

## Including `node_modules` Packages in `ts-jest` Transforms

By default no `node_modules` modules are included in the `ts-jest` transform outlined in the `jest.config.js` `transform` property. Sometimes we may need these to be transformed when testing. There's a utility array that will handle this at the top of `jest.config.js` - `transform_node_modules`. Just add the `node_modules` packages to this and they will be transformed with the same `ts-jest` transformer that the rest of the application uses.

```js
const transform_node_modules = [
    'react-syntax-highlighter'
];
```

---

## TypeScript Path Aliases

We use TypeScript path aliases so that means we need to add the same support to Jest using the `moduleNameMapper` property. To add a path alias copy the existing `@src/` one:

```js
moduleNameMapper: {

    // ...

    // Map the @src path alias defined in `tsconfig.json`
    '^@src/(.*)' : '<rootDir>/src/$1',

    // ...
},
```
