// By default "node_modules" is excluded from the transforms, explicitly include these
//    modules in the transform
const transform_node_modules = [
    'react-syntax-highlighter',
];

const jest_config = {

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // Only run coverage for the TypeScript files in lib as everything in the root of `./src`
    //    is an entry point or constants
    collectCoverageFrom: [
        'src/App.tsx',
        'src/components/**/*.tsx',
        'src/partials/**/*.tsx',
        'src/lib/**/*.ts',
    ],

    testPathIgnorePatterns : [

        // Ignore Playwright E2E tests as they need to be ran with `npx playwright test` exclusively
        '.spec.ts',
    ],

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    transform: {

        // Use ts-jest transform with ESM module support
        // - Regex supports ts, tsx, js, jsx all use ts-jest with useESM flag
        // - https://kulshekhar.github.io/ts-jest/docs/next/guides/esm-support
        '^.+\\.[tj]sx?$': [
            'ts-jest',
            { useESM : true },
        ],
    },

    // Treat all TypeScript files as ESM modules
    // - .js not included on this list due to being automatically included based off of the `package.json`
    //   `"type" : "module"` definition (will throw error if you add .js to this!)
    extensionsToTreatAsEsm : [ '.ts', '.tsx', '.jsx' ],

    moduleNameMapper: {

        // Remove the .js extension when running tests because Jest is directly running the TypeScript
        //    files instead of compiling them to JavaScript
        '^(\\.{1,2}/.*)\\.js$': '$1',

        // Map the @src path alias defined in `tsconfig.json`
        '^@src/(.*)' : '<rootDir>/src/$1',

        // Mocking CSS asset modules
        // - https://jestjs.io/docs/webpack#mocking-css-modules
        '\\.(css)$': 'identity-obj-proxy',

        // Mocking static asset modules
        // - Uses `test/__mocks__/file_mock.js` to return string "test_file_contents" so static assets
        //   can be included in tests without throwing invalid syntax errors on Jest run
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$' : '<rootDir>/tests/__mocks__/file_mock.ts',
    },

    // An array of regexp pattern strings that are matched against all source file paths before
    //   running through `transform` defined above
    // - All files inside `node_modules` are not transformed by default
    // - Setting as empty array will remove the `node_modules` exclusion
    // - Dynamically set below by processing `transform_node_modules` array above for ease of use
    //   and allowing for long list of modules to avoid
    // transformIgnorePatterns: [],

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // The default environment in Jest is a Node.js environment
    // - If you are building a web app, you can use a browser-like environment through jsdom instead
    // - jsdom Requires package to work - `npm install jest-environment-jsdom --save-dev`
    testEnvironment: 'jsdom',

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    setupFilesAfterEnv: [

        // Global pre-tests Jest setup
        './jest_setup.ts',
    ],
};

if( transform_node_modules && transform_node_modules.length ) {

    // Ensure to use any existing transformIgnorePatterns if set above
    const existing_transform_ignore_patterns = jest_config.transformIgnorePatterns ?
        jest_config.transformIgnorePatterns : [];

    // Append the ESM modules that we want to explicitly include
    jest_config.transformIgnorePatterns = [
        ...existing_transform_ignore_patterns,
        'node_modules/(?!(' + transform_node_modules.join( '|' ) + ')/)',
    ];
}

export default jest_config;
