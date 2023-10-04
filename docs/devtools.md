# Chrome/Chromium DevTools Setup

### SSL Note:

Some Chrome API features like the speech recognition API require SSL for working with/developing.

---

### Ensure Sourcemaps Enabled:

* Under DevTools settings (upper-right hand gear):
    - Ensure "enable JavaScript sourcemaps"
    - Ensure "enable CSS sourcemaps"

---

### React Developer Tools:

Tool that allows you to inspect React component trees in devtools:

* https://react.dev/learn/react-developer-tools
* https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi

---

### @axe-core/react Accessibility Tool

If the application is built using the `--dev` flag, the `@axe-core/react` package activates additional accessibility tests in [src/index.tsx](src/index.tsx), with results displayed in the DevTools console.

* https://www.npmjs.com/package/@axe-core/react
