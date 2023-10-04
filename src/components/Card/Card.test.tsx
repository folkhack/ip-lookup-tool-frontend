import React from 'react';
import { render } from '@testing-library/react';
import Card from './Card';

import { default as JestAxe } from 'jest-axe';
expect.extend( JestAxe.toHaveNoViolations );

describe( 'Card component', () => {

    it( 'renders Card component with title', () => {

        const { getByText } = render( <Card title="My Title">My Content</Card> );

        expect( getByText( 'My Title' ) ).toBeInTheDocument();
        expect( getByText( 'My Content' ) ).toBeInTheDocument();
    } );

    it( 'renders Card component without title', () => {

        const { queryByText } = render( <Card>My Content</Card> );

        expect( queryByText( 'My Title' ) ).toBeNull();
        expect( queryByText( 'My Content' ) ).toBeInTheDocument();
    } );

    it( 'renders Card component with icon and title', () => {

        const icon = {
            src   : 'icon.png',
            alt   : 'My Icon',
            title : 'Icon Title',
        };

        const { getByText, getByAltText, getByTitle } = render( <Card title="My Title" icon={ icon }>My Content</Card> );

        expect( getByText( 'My Title' ) ).toBeInTheDocument();
        expect( getByAltText( 'My Icon' ) ).toBeInTheDocument();
        expect( getByTitle( 'Icon Title' ) ).toBeInTheDocument();
        expect( getByText( 'My Content' ) ).toBeInTheDocument();
    } );

    it( 'renders Card component title as h1 element if title_as_h1 flag set', () => {

        const { getByRole } = render( <Card title="My Title" title_as_h1={ true }>My Content</Card> );
        expect( getByRole( 'heading', { level : 1 } ) ).toBeInTheDocument();
    } );

    it( 'should not have accessibility violations', async() => {

        const icon = {
            src   : 'icon.png',
            alt   : 'My Icon',
            title : 'Icon Title',
        };

        const { container } = render( <Card title="My Title" icon={ icon }>My Content</Card> );
        expect( await JestAxe.axe( container ) ).toHaveNoViolations();
    } );
} );
