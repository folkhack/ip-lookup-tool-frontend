import React from 'react';
import { render } from '@testing-library/react';
import Button from './Button';

import { default as JestAxe } from 'jest-axe';
expect.extend( JestAxe.toHaveNoViolations );

describe( 'Button component', () => {

    it( 'renders Button component with children', () => {

        const { getByText } = render( <Button>Click Me</Button> );
        expect( getByText( 'Click Me' ) ).toBeInTheDocument();
    } );

    it( 'renders Button component with default type as button', () => {

        const { getByRole } = render( <Button>Click Me</Button> );
        const buttonElement = getByRole( 'button' );
        expect( buttonElement.getAttribute( 'type' ) ).toBe( 'button' );
    } );

    it( 'renders Button component with type as submit', () => {

        const { getByRole } = render( <Button type="submit">Click Me</Button> );
        const buttonElement = getByRole( 'button' );
        expect( buttonElement.getAttribute( 'type' ) ).toBe( 'submit' );
    } );

    it( 'renders Button component with type as reset', () => {

        const { getByRole } = render( <Button type="reset">Click Me</Button> );
        const buttonElement = getByRole( 'button' );
        expect( buttonElement.getAttribute( 'type' ) ).toBe( 'reset' );
    } );

    it( 'renders Button component with type as reset', () => {

        const { getByRole } = render( <Button type="reset">Click Me</Button> );
        const buttonElement = getByRole( 'button' );
        expect( buttonElement.getAttribute( 'type' ) ).toBe( 'reset' );
    } );

    it( 'should not have accessibility violations', async() => {

        const { container } = render( <Button type="reset">Click Me</Button> );
        expect( await JestAxe.axe( container ) ).toHaveNoViolations();
    } );
} );
