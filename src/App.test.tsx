import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import App from './App';

import { default as JestAxe } from 'jest-axe';
expect.extend( JestAxe.toHaveNoViolations );

describe( 'App', () => {

    it( 'renders without crashing', () => {

        render( <App /> );
    } );

    // Snapshot
    it( 'renders correctly', () => {

        const tree = renderer
            .create( <App /> )
            .toJSON();

        expect( tree ).toMatchSnapshot();
    } );

    // Accessibility
    it( 'should not have accessibility violations', async() => {

        const { container } = render( <App /> );
        expect( await JestAxe.axe( container ) ).toHaveNoViolations();
    } );
} );
