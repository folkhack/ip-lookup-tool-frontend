# Playwright Tests

Playwright is useful for automating browser interactions, supporting cross-browser testing, and enhancing test reliability. It offers a rich API and can run in headless mode, ideal for CI/CD pipelines. End-to-End (E2E) tests validate the entire flow of an application, simulating real-world user scenarios from start to finish.

https://playwright.dev/

---

* **Configuration/Tests:**
    - [`playwright.config.ts`](../playwright.config.ts) - Main configuration file that controls Playwright testing
    - [`tests/e2e/*.spec.ts`](../tests/e2e) - Playwright E2E tests
* **`package.json` scripts:**
    - `npm run tests_e2e` - Runs E2E tests via `npx playwright test`
* **`package.json --save-dev` Development Dependencies:**
    - [`@playwright/test`](https://playwright.dev/) - Cross-browser E2E testing tool

---

### Expects Application Running

To alleviate the complexity of making the E2E tests start both the front-end (ip-lookup-tool-frontend) and back-end (ip-lookup-tool) we start those manually before testing:

```bash
# Start the API
cd ip-lookup-tool
npm run api

# In a different terminal, start the front-end:
cd ip-lookup-tool-frontend
node build.js --serve

# In a different terminal, run the E2E tests:
npm run tests_e2e
```

---

### Separate From Jest

Playwright tests must be ran with `npx playwright test` meaning that they can't be included in the normal application Jest tests. `*.spec.ts` files are ignored by Jest tests and there is a specific `package.json` script to handle this: `npm run tests_e2e`.
