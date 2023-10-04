import { jest } from '@jest/globals';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import IpForm from './IpForm';

import { HttpResponse } from '@src/lib/FetchHttpClient';
import { HttpApiClient } from '@src/lib/HttpApiClient';
import { ALL_FIELDS } from '@src/constants';

const PLACEHOLDER_TEXT = 'ex: 2606:4700:4700::64';

describe( 'IpForm', () => {

    // Reset mocks before each test
    beforeEach( () => {
        jest.clearAllMocks();
    } );

    it( 'renders without crashing', () => {

        render( <IpForm /> );
    } );

    it( 'updates state when input changes', () => {

        const { getByPlaceholderText } = render( <IpForm /> );
        const input = getByPlaceholderText( PLACEHOLDER_TEXT ) as HTMLInputElement;

        act( () => {

            fireEvent.change( input, { target: { value: '123.123.123.123' } } );
        } );

        expect( input.value ).toBe( '123.123.123.123' );
    } );

    it( 'handles form submission with a successful API call', async() => {

        const http_response:HttpResponse = {
            url           : 'https://test.com',
            status_code   : 200,
            response_data : {
                success        : true,
                status_code    : 200,
                url            : 'https://test.com',
                query_start_at : new Date,
                query_stop_at  : new Date,
                errors         : [],
                data        : {
                    queried_ip_addr : '123.123.123.123',
                    query_status    : 'success',
                    query_message   : undefined,
                    country         : 'United States of America',
                    country_code    : 'US',
                    continent       : 'North America',
                    continent_code  : 'NA',
                    region          : 'Test Region',
                    region_name     : 'Test Region Name',
                    city            : 'Test City',
                    district        : 'Test District',
                    zip             : '12345',
                    lat             : 40,
                    lon             : -40,
                    timezone        : 'Test Timezone',
                    offset          : 0,
                    isp             : 'Test ISP',
                    org             : 'Test Org',
                    as              : 'Test AS',
                    as_name         : 'Test AS Name',
                    is_mobile       : false,
                    is_proxy        : false,
                    is_hosting      : false,
                    reverse         : 'test.reverse.com',
                },
            },
        };

        const mock = jest.spyOn( HttpApiClient.prototype, 'lookup_ip' );
        mock.mockResolvedValue( http_response );

        const { getByText, getByPlaceholderText } = render( <IpForm /> );
        const input = getByPlaceholderText( PLACEHOLDER_TEXT );
        const button = getByText( 'Lookup IP Address »' );

        // Throws "Warning update was not wrapped in act()" without await + async arrow function
        // eslint-disable-next-line require-await
        await act( async() => {
            fireEvent.change( input, { target: { value: '123.123.123.123' } } );
            fireEvent.click( button );
        } );

        expect( HttpApiClient.prototype.lookup_ip ).toHaveBeenCalledWith( '123.123.123.123', ALL_FIELDS );
    } );

    it( 'handles form submission with a failed API call', async() => {

        const http_response:HttpResponse = {
            url           : 'https://test.com',
            status_code   : 500,
            response_data : {
                success        : false,
                status_code    : 500,
                url            : 'https://test.com',
                query_start_at : new Date,
                exception      : new Error( 'Exception encountered calling API' ),
                errors         : [ 'Exception encountered calling API' ],
            },
        };

        const mock = jest.spyOn( HttpApiClient.prototype, 'lookup_ip' );
        mock.mockResolvedValue( http_response );

        const { getByText, getByPlaceholderText } = render( <IpForm /> );
        const input = getByPlaceholderText( PLACEHOLDER_TEXT );
        const button = getByText( 'Lookup IP Address »' );

        // Throws "Warning update was not wrapped in act()" without await + async arrow function
        // eslint-disable-next-line require-await
        await act( async() => {
            fireEvent.change( input, { target: { value: '127.0.0.1' } } );
            fireEvent.click( button );
        } );

        expect( getByText( 'Errors:' ) ).toBeTruthy();
        expect( getByText( 'Exception encountered calling API' ) ).toBeTruthy();
    } );

    it( 'displays multiple errors when they are present', async() => {

        const http_response:HttpResponse = {
            url           : 'https://test.com',
            status_code   : 400,
            response_data : {
                success        : false,
                status_code    : 400,
                url            : 'https://test.com',
                query_start_at : new Date,
                query_stop_at  : new Date,
                errors         : [ 'Error 1', 'Error 2' ],
            },
        };

        const mock = jest.spyOn( HttpApiClient.prototype, 'lookup_ip' );

        mock.mockResolvedValue( http_response );

        const { getByText, getByPlaceholderText } = render( <IpForm /> );
        const input = getByPlaceholderText( PLACEHOLDER_TEXT );
        const button = getByText( 'Lookup IP Address »' );

        // Throws "Warning update was not wrapped in act()" without await + async arrow function
        // eslint-disable-next-line require-await
        await act( async() => {
            fireEvent.change( input, { target: { value: '127.0.0.1' } } );
            fireEvent.click( button );
        } );

        expect( getByText( 'Errors:' ) ).toBeTruthy();
        expect( getByText( 'Error 1' ) ).toBeTruthy();
        expect( getByText( 'Error 2' ) ).toBeTruthy();
    } );

    // Test failed form submission
    it( 'handles inner throw correctly', async() => {

        const mock = jest.spyOn( HttpApiClient.prototype, 'lookup_ip' );

        // Any allowed here to simulate exception (just give it junk input to cause throw)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mock.mockResolvedValue( new Error( 'Failed' ) as any );

        const { getByText, getByPlaceholderText } = render( <IpForm /> );
        const input = getByPlaceholderText( PLACEHOLDER_TEXT );
        const button = getByText( 'Lookup IP Address »' );

        // Throws "Warning update was not wrapped in act()" without await + async arrow function
        // eslint-disable-next-line require-await
        await act( async() => {
            fireEvent.change( input, { target: { value: '127.0.0.1' } } );
            fireEvent.click( button );
        } );

        expect( HttpApiClient.prototype.lookup_ip ).toHaveBeenCalledWith( '127.0.0.1', ALL_FIELDS );
        expect( getByText( 'Errors:' ) ).toBeTruthy();
        expect( getByText( 'Exception caught during IP lookup, check console for more information' ) ).toBeTruthy();
    } );
} );
