# TypeScript

TypeScript adds static type checking to JavaScript, allowing for early error detection and more robust code. It also provides features like interfaces and generics, enhancing code quality and maintainability.

---

* **Configuration:**
    - [`tsconfig.json`](../tsconfig.json) - Main configuraiton file that controls TypeScript
* **`package.json` scripts:**
    - `npm run compile` - Compiles the TypeScript source in `src/**/*.ts` to plain JavaScript in `dest/**/*.js`
* **`package.json --save-dev` Development Dependencies:**
    - [`typescript`](https://www.typescriptlang.org/) - TypeScript is a strongly typed programming language that builds on JavaScript
    - [`ts-node`](https://typestrong.org/ts-node/) - TypeScript execution and REPL for Node.js; used for both Jest tests and Swagger docs
    - [`@typescript-eslint/eslint-plugin`](https://typescript-eslint.io/) - The tooling that enables ESLint and Prettier to support TypeScript
    - [`@typescript-eslint/parser`](https://github.com/typescript-eslint/typescript-eslint) - ESLint parser which leverages TypeScript ESTree to allow for ESLint to lint TypeScript source code
    - [`ts-jest`](https://www.npmjs.com/package/ts-jest) - Jest transformer with source map support that lets you use Jest to test projects written in TypeScript

---

### `jest_setup.ts` `tsconfig.json` Include

We include additional Jest matchers in the `tsconfig.json` by referencing `ts_setup.ts` in the includes. This may seem like an error but since esbuild is handling the entry point + bundling for the application this is a generally safe simplification.

If this is undesired a separate `tsconfig.jest.json` could be created specifically for the Jest testing.

---

### Path Aliases

Two path aliases are setup out-of-box to avoid complex relative pathing:

* `@assets/` - for static assets like PNGs, SVGs, global CSS
* `@src/` - for application assets/modules like React application `*.tsx` files, library files, and non-TypeScript modules like CSS modules

---

### TypeScript Module Declarations for CSS and Images

In TypeScript-based projects, it's common to import various types of files like CSS or images. TypeScript needs a way to understand these imports. This is achieved using custom type definitions for these non-TypeScript modules.

##### CSS Modules

CSS modules are CSS files that allow for local scope CSS by default. This means that the classes you define in a CSS Module are scoped to the component, not global, which helps prevent styling conflicts.

**Importing CSS Modules:**

```typescript
import styles from './MyComponent.module.css';
```

**Using CSS Modules:**

```tsx
<div className={ styles.my_custom_class }>Hello</div>
```

**CSS Modules TypeScript Definition:**

See [types/css_modules.d.ts](types/image_modules.d.ts)

This tells TypeScript that when we import a `.module.css` file, it will look like an object where keys are the class names and the values are the transformed class names you will apply in your HTML.

##### Static Asset Modules

These declarations enable importing image files in a TypeScript file. This is useful for using images in components.

**Importing Static Asset Modules:**

```typescript
import my_image from './my_image.jpg';
```

**Using Static Asset Modules:**

```tsx
<img src={ my_image } alt="My Image" />
```

**Static Asset Modules TypeScript Definition:**

See [types/image_modules.d.ts](types/image_modules.d.ts)

This allows TypeScript to understand what the imported value will be. It tells TypeScript that when you import an image of the specified formats, it should treat them as a string, which would be the image URL.
