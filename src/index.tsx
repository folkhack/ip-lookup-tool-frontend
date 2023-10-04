import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App';

// Setup types for conditional import of axe
import type reactAxe from '@axe-core/react';
type axeType = { default : typeof reactAxe };

// Get the root target
const root_id = 'root';
const root_el = document.getElementById( root_id );

// Setup axe accessibility testing in-browser
// - Console output for accessibility issues found
if( process.env.NODE_ENV === 'development' ) {

    // Dynamic import statement in a self-calling function so we can nest this in a
    //    conditional that checks for th development environment
    ( async() => {

        const axe = await import( '@axe-core/react' ) as axeType;
        axe.default( React, ReactDOM, 1000 );

    } )();
}

try {

    // Make sure root exists before rendering application
    if( root_el ) {

        // Create a root based on the root element
        const react_root = createRoot( root_el );

        react_root.render(

            // Only use React.StrictMode if NODE_ENV is explicitly "development"
            process.env.NODE_ENV === 'development' ? (
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            ) : (
                <App />
            ),
        );

    } else {

        throw new Error( '#' + root_id + ' render target not found!' );
    }

} catch( e ) {

    console.error( 'Exception when rendering application!', e );
}
