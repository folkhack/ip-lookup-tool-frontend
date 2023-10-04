import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Input from './Input';
import { jest } from '@jest/globals';

import { default as JestAxe } from 'jest-axe';
expect.extend( JestAxe.toHaveNoViolations );

describe( 'Input component', () => {

    it( 'renders Input component with label', () => {

        const { getByText, getByLabelText } = render( <Input name="test_name" label="Username" /> );

        expect( getByText( 'Username:' ) ).toBeInTheDocument();
        expect( getByLabelText( 'Username:' ) ).toBeInTheDocument();
    } );

    it( 'renders Input component without label', () => {

        const { queryByLabelText } = render( <Input name="test_name" /> );

        expect( queryByLabelText( /:/ ) ).toBeNull();
    } );

    it( 'renders Input component as required', () => {

        const { getByLabelText } = render( <Input name="test_name" label="Username" is_required={ true } /> );

        // NOTE: Must cast to HTMLInputElement so TypeScript doesn't gripe about missing
        //       required property!
        const inputElement = getByLabelText( 'Username:' ) as HTMLInputElement;

        expect( inputElement.required ).toBe( true );
    } );

    it( 'triggers onChange event in Input component', () => {

        const handle_change      = jest.fn();
        const { getByLabelText } = render( <Input name="test_name" label="Username" on_change={ handle_change } /> );
        const input              = getByLabelText( 'Username:' );

        fireEvent.change( input, { target: { value: 'test' } } );
        expect( handle_change ).toHaveBeenCalledTimes( 1 );
    } );

    it( 'renders children in help section of Input component', () => {

        const { getByText } = render( <Input name="test_name">Help Text</Input> );

        expect( getByText( 'Help Text' ) ).toBeInTheDocument();
    } );

    it( 'should not have accessibility violations', async() => {

        const { container } = render( <Input name="test_name" label="Username" /> );
        expect( await JestAxe.axe( container ) ).toHaveNoViolations();
    } );
} );
