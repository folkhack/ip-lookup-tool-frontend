import { HttpScheme } from './lib/FetchHttpClient';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

//
//  Both HTTP API and ip-api.com Fields
//  - What fields to query from both our HTTP API, as well as the downstream ip-api.com API
//

export const ALL_FIELDS = [
    'continent',
    'continentCode',
    'country',
    'countryCode',
    'region',
    'regionName',
    'city',
    'district',
    'zip',
    'lat',
    'lon',
    'timezone',
    'offset',
    'isp',
    'org',
    'as',
    'asname',
    'mobile',
    'proxy',
    'hosting',
    'query',
    'reverse',
];

const fields_without_resverse = [ ...ALL_FIELDS ];
fields_without_resverse.pop();

export const DEFAULT_FIELDS = fields_without_resverse;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

//
//  HTTP API Config
//

export const DEFAULT_APP_HOST        = '127.0.0.1';
export const DEFAULT_APP_PORT        = 63100;
export const DEFAULT_APP_HTTP_SCHEME = HttpScheme.HTTP;

export const APP_PORT =
    typeof process.env.REACT_APP_PORT === 'string' && process.env.REACT_APP_PORT.length ?
        parseInt( process.env.REACT_APP_PORT ) :
        DEFAULT_APP_PORT;

export const APP_HTTP_SCHEME =
    process.env.REACT_APP_USE_HTTPS === 'true' ?
        HttpScheme.HTTPS :
        DEFAULT_APP_HTTP_SCHEME;

export const APP_HOST =
    typeof process.env.REACT_APP_HOST === 'string' && process.env.REACT_APP_HOST.length ?
        process.env.REACT_APP_HOST :
        DEFAULT_APP_HOST;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

//
//  HTTP API Config
//

export const DEFAULT_HTTP_API_HOST        = '127.0.0.1';
export const DEFAULT_HTTP_API_PORT        = 63100;
export const DEFAULT_HTTP_API_HTTP_SCHEME = HttpScheme.HTTP;
export const DEFAULT_HTTP_API_TIMEOUT_MS  = 2500;

export const HTTP_API_PORT =
    typeof process.env.REACT_APP_HTTP_API_PORT === 'string' && process.env.REACT_APP_HTTP_API_PORT.length ?
        parseInt( process.env.REACT_APP_HTTP_API_PORT ) :
        DEFAULT_HTTP_API_PORT;

export const HTTP_API_HTTP_SCHEME =
    process.env.REACT_APP_HTTP_API_USE_HTTPS === 'true' ?
        HttpScheme.HTTPS :
        DEFAULT_HTTP_API_HTTP_SCHEME;

export const HTTP_API_HOST =
    typeof process.env.REACT_APP_HTTP_API_HOST === 'string' && process.env.REACT_APP_HTTP_API_HOST.length ?
        process.env.REACT_APP_HTTP_API_HOST :
        DEFAULT_HTTP_API_HOST;

export const HTTP_API_TIMEOUT_MS =
    typeof process.env.REACT_APP_HTTP_API_TIMEOUT_MS === 'string' && process.env.REACT_APP_HTTP_API_TIMEOUT_MS.length ?
        parseInt( process.env.REACT_APP_HTTP_API_TIMEOUT_MS ) :
        DEFAULT_HTTP_API_TIMEOUT_MS;
