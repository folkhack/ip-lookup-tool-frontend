// Import the Jest global utilities
import { jest } from '@jest/globals';

// Adds custom Jest matchers that help with assertions for DOM nodes. It essentially extends
//    Jest's built-in matchers with more expressive ones, like toBeInTheDocument(), making it
//       easier and more readable to test DOM elements.
import '@testing-library/jest-dom';

class JestSetup {

    fix_exported_modules_w_named_defaults:string[];

    constructor() {

        // Add named default exports here that are causing issues with tests (see below for more info)
        //    eg: fix `json.default || json` errors when imported module has named default export
        this.fix_exported_modules_w_named_defaults = [
            'react-syntax-highlighter/dist/esm/languages/hljs/json',
        ];
    }

    init() {

        this.fix_named_default_exports();
    }

    // Method to fix named default exports for the specified modules
    // - Ensures tested code does not have to change to support tests
    //     - Fixes need to do `module.default || module` mapping; ex:
    //     - `SyntaxHighlighter.registerLanguage( 'json', json.default || json );`
    // - Default named exports can behave different between Jest and Node.js:
    //     - https://github.com/jestjs/jest/issues/11563
    //     - https://github.com/jestjs/jest/issues/11563#issuecomment-863860566
    fix_named_default_exports() {

        // Loop through each module name specified in the 'this.fix_exported_modules_w_named_defaults' array
        for( const named_default_export of this.fix_exported_modules_w_named_defaults ) {

            // Mock the current module using Jest's 'mock' function
            jest.mock( named_default_export, () => {

                // Use 'requireActual' to get the actual (un-mocked) module
                // - Type assertion used to indicate that the real module may have a 'default' property
                // - 'any' type is used as we do not know the actual type of the 'default' property
                //   eslint-disable-next-line @typescript-eslint/no-explicit-any
                const real_module = jest.requireActual( named_default_export ) as { default?: any };

                // Debugging statement for looking at composition of fixed export vs. the real module
                // console.log( 'named_default_export', named_default_export, real_module );

                // Prioritize .default first if exists to ensure we don't have to do this within individual
                //    tests every time we want to import a module with a named default
                return real_module.default || real_module;
            } );
        }
    }
}

( new JestSetup ).init();
