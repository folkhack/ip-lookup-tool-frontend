import { test, expect } from '@playwright/test';
import fs from 'node:fs';

import dotenv from 'dotenv';

// Load environment variables from .env if exists; or .env.default if not
const LOAD_ENV_FILE = fs.existsSync( '.env' ) ? '.env' : '.env.default';
dotenv.config( { path : LOAD_ENV_FILE } );

// Build URL from configured constants
import { APP_HTTP_SCHEME, APP_PORT, APP_HOST } from '../../src/constants';
const app_url = [ APP_HTTP_SCHEME, '://', APP_HOST, ':', APP_PORT ].join( '' );

test( 'gets information about 8.8.8.8', async( { page } ) => {

    // Go to application URL based off of configuration options from .env
    await page.goto( app_url );

    // Get input by placeholder and fill it with 8.8.8.8, submitting the form by hitting Enter
    const input = page.getByPlaceholder( 'ex: 2606:4700:4700::64' );
    await input.fill( '8.8.8.8' );
    await input.press( 'Enter' );

    // Wait for the on-page #result selector to be available
    await page.waitForSelector( '#result' );

    // Once #result is available, check for expect output; ie: success and that 8.8.8.8 resolver
    //    reports Google for ISP
    await expect( page.getByTestId( 'result_success' ) ).toHaveText( 'true' );
    await expect( page.getByTestId( 'result_ip' ) ).toHaveText( '8.8.8.8' );
    await expect( page.getByTestId( 'result_isp' ) ).toContainText( 'Google' );
} );
