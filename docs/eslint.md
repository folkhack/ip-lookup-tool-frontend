# eslint Linting

ESLint automatically identifies coding errors and enforces a consistent coding style across a codebase. It offers extensibility through plugins and can be integrated into various development workflows.

---

* **Configuration:**
    - [`.eslintrc.json`](../.eslintrc.json) - Main configuraiton file that controls eslint linting and formatting rules
* **`package.json` scripts:**
    - `npm run lint` - Run `eslint` project binary with `.eslintrc.json` configuration
    - `npm run lint_fix` - Run the `eslint` project binary using the `.eslintrc.json` configuration to automatically fix errors where possible and report those it can't. **Note: This will modify your files.**
* **`package.json --save-dev` Development Dependencies:**
    - [`eslint`](https://eslint.org/) - ESLint statically analyzes your code to quickly find problems
    - [`@typescript-eslint/eslint-plugin`](https://typescript-eslint.io/) - The tooling that enables ESLint and Prettier to support TypeScript
    - [`@typescript-eslint/parser`](https://github.com/typescript-eslint/typescript-eslint) - ESLint parser which leverages TypeScript ESTree to allow for ESLint to lint TypeScript source code
    - [`eslint-plugin-jest`](https://github.com/jest-community/eslint-plugin-jest#readme) - ESLint plugin for Jest
    - [`eslint-plugin-jsx-a11y`](https://www.npmjs.com/package/eslint-plugin-jsx-a11y) - JSX accessibility linting
    - [`eslint-plugin-react`](https://www.npmjs.com/package/eslint-plugin-react) - React linting
    - [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) - React "Rules of Hooks" linting - https://react.dev/warnings/invalid-hook-call-warning
