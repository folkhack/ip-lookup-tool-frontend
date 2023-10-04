import { jest } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react';
import IpFormResult from './IpFormResult';
import { IpAddrInfoResult } from '@src/lib/IpAddrInfoTypes';

// Easy to modify a11y `window.matchMedia` matches response for testing both light/dark
//    JSON result syntax highlighting code branch
let global_a11y_dark_matches = false;

// Mock window.matchMedia so we can use our global matches switch
Reflect.defineProperty( window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation( ( query ) => {
        return {
            matches : global_a11y_dark_matches,
            media   : query,
        };
    } ),
} );

describe( 'IpFormResult', () => {

    // Reset mocks before each test
    beforeEach( () => {
        jest.clearAllMocks();
    } );

    it( 'renders without crashing', () => {

        render( <IpFormResult /> );
    } );

    it( 'handles result', () => {

        const info_result:IpAddrInfoResult = {
            success        : true,
            status_code    : 200,
            url            : 'https://test.com',
            query_start_at : new Date,
            query_stop_at  : new Date,
            errors         : [],
            data : {
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
        };

        const { getByText } = render( <IpFormResult result={ info_result } /> );

        expect( getByText( 'Success' ) ).toBeTruthy();
    } );

    it( 'renders with default a11yDark (code branch assertion)', () => {

        // Set the global dark matches to true to test the dark code branch for coverage
        global_a11y_dark_matches = true;
        render( <IpFormResult /> );
    } );
} );
