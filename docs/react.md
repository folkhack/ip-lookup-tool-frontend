# React`

React is useful for building dynamic, interactive user interfaces in web applications. It allows for the creation of reusable UI components and efficiently updates and renders components when data changes.

https://react.dev/

---

* **`package.json --save` Dependencies:**
    - [`react`](https://react.dev/) - Base React library
    - [`react-dom`](https://www.npmjs.com/package/react-dom) - Entry point to the DOM and server renderers for React
    - [`react-syntax-highlighter`](https://github.com/react-syntax-highlighter/react-syntax-highlighter) - Syntax highlighting component
* **`package.json --save-dev` Development Dependencies:**
    - [`@axe-core/react`](https://www.npmjs.com/package/@axe-core/react) - Accessibility testing library
    - [`@testing-library/react`](https://www.npmjs.com/package/@testing-library/react) - React DOM testing utilities
    - `@types/react` - Types for `react`
    - `@types/react-dom` - Types for `react-dom`
    - `@types/react-syntax-highlighter` - Types for `react-syntax-highlighter`
    - `@types/react-test-renderer` - Types for `react-test-renderer`
    - [`eslint-plugin-react`](https://www.npmjs.com/package/eslint-plugin-react) - React linting
    - [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) - React "Rules of Hooks" linting - https://react.dev/warnings/invalid-hook-call-warning
    - [`react-test-renderer`](https://www.npmjs.com/package/react-test-renderer) - Experimental React renderer that can be used to render React components to pure JavaScript objects, without depending on the DOM or a native mobile environment

---

### Environment Variables

* `.env` will be used for the application and build configuration; if it is not there `.env.default` will be used
* We use esbuild's define configuration to set environment variables in the application:
    - https://esbuild.github.io/api/#define
    - `process.env.NODE_ENV` is set to "development" if the `node build.js --dev` flag is set; and `production` otherwise
    - Any environment variable that starts with `REACT_APP_` will be set - this is for configuring the front-end; ex: changing an API hostname

---

### `<StrictMode>`

If `process.env.NODE_ENV` is "development" then React's `StrictMode` will be enabled in [src/index.tsx](../src/index.tsx) - this enables additional debug tooling that helps find bugs during development.

https://react.dev/reference/react/StrictMode

---

### React App Anatomy

##### Static `index.html` render target + included bundles

The HTML file that you visit from the browser is in (assets/index.html)[../assets/index.html]. It gets copied over to the `dist` directory during the esbuild build.

**Parts:**

* `<link rel="stylesheet" href="global.css">` - global CSS asset (not built, static)
* `<link rel="stylesheet" href="bundle.css">` - bundled CSS asset (built by `build.js`)
* `<div id="root"></div>` - the application render target at id `#root`
* `<script src="bundle.js"></script>` - the bunlded JS asset (built by `build.js`)

##### React app `index.tsx` entry point

(src/index.tsx)[../src/index.tsx] is the only entry point defined in `build.js` esbuild build option `entryPoints` as this application is a SPA pattern - `entryPoints : [ './src/index.tsx' ]`.

* Has multiple dev/prod configurations; if development:
    - Axe accessibility tooling will be dynamically imported and enabled - https://github.com/dequelabs/axe-core-npm#readme
    - `<StrictMode>` enabled - https://react.dev/reference/react/StrictMode
    - Development tooling specifically managed here to keep it out of `App.tsx`
* Gets the root element and manages for React rendering:
    - `createRoot( root_el )` - gets `#root` element and creates a root to display React components inside a DOM node
    - `react_root.render( <App /> )` - renders main `<App />` component to React root specified above

##### React app `App.tsx` main application

(src/App.tsx)[../src/App.tsx] is the main React app entry point. It pulls in the main components of the application and is meant to be simple to understand as it's a starting point for the application's component tree.
