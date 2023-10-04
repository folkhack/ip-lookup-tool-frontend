import { Command } from 'commander';
import esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import chokidar from 'chokidar';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { rimraf } from 'rimraf';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';

// Output file for the build meta which reports on bundle composition and size
const BUILD_META_OUT = './build-meta.json';

// When serving the application serve it up at this port regardless if we're using
//    SSE proxy
const SERVE_PORT = parseInt( process.env.REACT_APP_PORT ) || 55490;

// If we're using the SSE proxy host the esbuild server at this port
const PROXIED_PORT = 55495;

// URL to use for SSE triggered reloads
const SSE_TRIGGER_RELOAD_URL = '/trigger-reload';

// Static assets directory to copy
// - No trailing slash!
const ASSETS_DIR = './assets';

// Build directory for the application
// - No trailing slash!
const DIST_DIR = './dist';

// Load environment variables from .env if exists; or .env.default if not
const LOAD_ENV_FILE = fs.existsSync( '.env' ) ? '.env' : '.env.default';
dotenv.config( { path : LOAD_ENV_FILE } );

// Populate esbuild define object dynamically with environment variables that start with REACT_APP_
const define = Object.fromEntries(

    Object.entries( process.env )
        .filter( ( [ key ] ) => { return key.startsWith( 'REACT_APP_' ); } )
        .map( ( [ key, val ] ) => { return [ 'process.env.' + key, '"' + val + '"' ]; } ),
);

// Explicitly set production for NODE_ENV
define[ 'process.env.NODE_ENV' ] = '"production"';

class Build {

    // Setup a set of simplified options for the build process as well as a default set of esbuild build
    //    options so we can override it later; also setup an array to track server-sent events clients
    constructor( our_opts = {} ) {

        // Setup our simplified options for building, overridden by passed-in CLI options
        this.our_opts = {

            is_dev_build       : false,
            enable_watch       : false,
            enable_serve       : false,
            enable_live_reload : false,
            analyze_bundle     : false,
            log_level          : 'info',
            serve_port         : SERVE_PORT,
            proxied_port       : PROXIED_PORT,
            clean              : false,
            ssl_key_file       : undefined,
            ssl_cert_file      : undefined,

            ...our_opts,
        };

        // If live reload is enabled then serve must also be enabled
        if( this.our_opts.enable_live_reload ) this.our_opts.enable_serve = true;

        // Setup the default esbuild settings so that we can use/override them in different
        //    parts of the build; defaults to a production build
        this.default_esbuild_build_opts = {

            entryPoints : [ './src/index.tsx' ],
            outfile     : './dist/bundle.js',
            bundle      : true,
            logLevel    : this.our_opts.log_level, // silent, error, warning, info, debug, verbose
            minify      : true,
            sourcemap   : false,

            define,

            loader : {

                // React TypeScript JSX
                '.tsx'  : 'tsx',

                // Static assets
                '.png'  : 'dataurl',
                '.jpg'  : 'dataurl',
                '.jpeg' : 'dataurl',
                '.gif'  : 'dataurl',
                '.webp' : 'dataurl',
                '.bmp'  : 'dataurl',
                '.svg'  : 'dataurl',
                '.ico'  : 'dataurl',
                '.apng' : 'dataurl',
            },

            // Disabled due to bundling discarding unused functions already
            // - https://esbuild.github.io/api/#tree-shaking
            // treeShaking : true,

            plugins : [

                // Use copy plugin to merge static site assets from `./assets` directory into `./dist`
                //    directory; ex: `index.html` template, global CSS, `robots.txt`
                copy( {

                    // Useful for debugging source/dest for files and directories:
                    // verbose : true,

                    assets: [
                        {
                            from  : [ ASSETS_DIR + '/**/*' ],
                            to    : [ './' ],

                            // Ensure to explicitly disable the watch because throws errors with directory
                            //    handling/splitting; asks for `esbuild.bulild.watch` to be set which is
                            //       invalid option and causes esbuild to throw
                            watch : false,
                        },
                    ],
                } ),
            ],
        };

        // Array of HTTP clients awaiting server-sent EventSource events
        this.sse_clients = [];
    }

    // Cleans all files in the DIST_DIR directory in preparation for a clean build
    async clean_dist() {

        await rimraf( DIST_DIR + '/*', { glob : true } );
    }

    // Generates the live-reload banner that's put at the top of `bundle.js` which uses server-sent events
    //    to reload the browser on application source or static asset changes
    generate_live_reload_banner() {

        const event_source_esbuild_watch = () => {

            new EventSource( '/esbuild' ).addEventListener( 'change', () => {

                console.info( 'EventSource /esbuild triggered live reload!' );
                location.reload();
            } );
        };

        // IMPORTANT: Due to this function being serialized as a string that is embedded in the `bundle.js`
        //    bundle file we can't use the SSE_TRIGGER_RELOAD_URL constant
        const event_source_our_watch = () => {

            new EventSource( '/trigger-reload' ).addEventListener( 'message', () => {

                console.info( 'EventSource /trigger-reload triggered live reload!' );
                location.reload();
            } );
        };

        // Convert the above into strings with whitespace consolidated for `bundle.js` banner
        const esbuild_watch_str = '(' + event_source_esbuild_watch.toString().replace( /\s+/g, ' ' ) + ' )();';
        const our_watch_str     = '(' + event_source_our_watch.toString().replace( /\s+/g, ' ' ) + ' )();';

        return esbuild_watch_str + '\n' + our_watch_str;
    }

    // Create a set of esbuild build options using our simplified options
    get_esbuild_build_opts() {

        const opts = { ...this.default_esbuild_build_opts };

        if( this.our_opts.is_dev_build ) {

            // Disable minification for development builds
            opts.minify = false;

            // Enable sourcemaps for development builds
            opts.sourcemap = true;

            // Set the process.env.NODE_ENV global manually
            opts.define[ 'process.env.NODE_ENV' ] = '"development"';
        }

        if( this.our_opts.enable_live_reload ) {

            // Add the live reload JS banner to the head of `bundle.js`
            opts.banner = { js : this.generate_live_reload_banner() };
        }

        if( this.our_opts.analyze_bundle ) {

            // Generate metafile when building
            opts.metafile = true;
        }

        return opts;
    }

    // Handler for changes in the ASSETS_DIR directory
    async handle_asset_change( esbuild_context, run_cleanup_first = false ) {

        // Optionally run cleanup (in case an asset has moved)
        if( run_cleanup_first ) await this.clean_dist();

        // Rebuild with the same esbuild build options
        await esbuild_context.rebuild();

        // Fire reload if needed
        if( this.our_opts.enable_live_reload ) this.trigger_sse_reload();
    }

    // Sets up chokidar to watch ASSETS_DIR for changes
    setup_assets_watch( esbuild_context ) {

        // Initialize chokidar to watch a directory
        // - Keep process running as long as files are being watched
        const watcher = chokidar.watch( ASSETS_DIR, { persistent: true } );

        // Trigger the SSE reload if needed
        watcher.on( 'add', () => { this.handle_asset_change( esbuild_context ); } );
        watcher.on( 'change', () => { this.handle_asset_change( esbuild_context ); } );
        watcher.on( 'unlink', () => { this.handle_asset_change( esbuild_context, true ); } );
    }

    // Uses esbuild.serve to serve content
    async setup_esbuild_serve( esbuild_context ) {

        // Figure out what port to use
        // - Keeps consistent port for served content regardless if we are proxying it or not
        const esbuild_serve_port = this.our_opts.enable_live_reload ? this.our_opts.proxied_port : this.our_opts.serve_port;

        // Setup the SSL if needed (may be on the proxy)
        const esbuild_serve_key_file = ! this.our_opts.enable_live_reload && this.our_opts.ssl_key_file ?
            this.our_opts.ssl_key_file :
            undefined;

        const esbuild_serve_cert_file = ! this.our_opts.enable_live_reload && this.our_opts.ssl_cert_file ?
            this.our_opts.ssl_cert_file :
            undefined;

        // Serve the built assets in the DIST_DIR directory through esbuild.serve
        // - https://esbuild.github.io/api/#serve
        const { host, port } = await esbuild_context.serve( {
            port     : esbuild_serve_port,
            servedir : DIST_DIR,
            fallback : DIST_DIR + '/index.html',
            keyfile  : esbuild_serve_key_file,
            certfile : esbuild_serve_cert_file,
        } );

        // If live reload enabled then setup the custom SSE endpoint proxy
        if( this.our_opts.enable_live_reload ) return this.setup_sse_reload_proxy( host, port );

        // Fix 0.0.0.0 to 127.0.0.1 to avoid CORS for private networks error
        const scheme     = this.our_opts.ssl_key_file ? 'https://' : 'http://';
        const fixed_host = host.replace( '0.0.0.0', '127.0.0.1' );

        console.log( chalk.bold.cyan( '🛠️  esbuild serve listening on ' + chalk.underline( scheme + fixed_host + ':' + port ) ) );
    }

    // Handles a new SSE request and sets up a persistent HTTP connection + tracks the SSE client
    handle_sse_request( res ) {

        res.setHeader( 'Content-Type', 'text/event-stream' );
        res.setHeader( 'Cache-Control', 'no-cache' );
        res.setHeader( 'Connection', 'keep-alive' );

        this.sse_clients.push( res );
    }

    // Handes the SSE proxy requests and either sets up a new SSE client or proxies the request to the
    //    esbuild.serve side of things
    reload_proxy_handle_request( esbuild_serve_host, esbuild_serve_port, req, res ) {

        if( req.url === SSE_TRIGGER_RELOAD_URL ) {

            this.handle_sse_request( res );
            return;
        }

        const options = {
            hostname : esbuild_serve_host,
            port     : esbuild_serve_port,
            path     : req.url,
            method   : req.method,
            headers  : req.headers,
        };

        // Forward incoming request to esbuild
        const proxy_req = http.request( options, ( proxy_res ) => {

            // Bubble up 404 with a custom JSON response
            if( proxy_res.statusCode === 404 ) {

                res.writeHead( 404, { 'Content-Type': 'application/json' } );
                res.end( '{ "error" : "404 not found" }' );
                return;
            }

            // Otherwise, forward the response from esbuild to the client
            res.writeHead( proxy_res.statusCode, proxy_res.headers );
            proxy_res.pipe( res, { end : true } );
        } );

        // Forward the body of the request to esbuild
        req.pipe( proxy_req, { end: true } );
    }

    // Sets up a proxy in-front of the esbuild.serve HTTP server so we can add our own SSE endpoint to
    //    reload the browser when assets in the ASSETS_DIR directory
    async setup_sse_reload_proxy( esbuild_serve_host, esbuild_serve_port ) {

        await new Promise( ( resolve ) => {

            let server;

            if( this.our_opts.ssl_key_file && this.our_opts.ssl_cert_file ) {

                // Read SSL key and certificate files
                const ssl_opts = {
                    key  : fs.readFileSync( this.our_opts.ssl_key_file ),
                    cert : fs.readFileSync( this.our_opts.ssl_cert_file ),
                };

                // Create HTTPS server
                server = https.createServer( ssl_opts, ( req, res ) => {

                    this.reload_proxy_handle_request( esbuild_serve_host, esbuild_serve_port, req, res );
                } );

            } else {

                // Create HTTP server
                server = http.createServer( ( req, res ) => {

                    this.reload_proxy_handle_request( esbuild_serve_host, esbuild_serve_port, req, res );
                } );
            }

            // Listen with callback for logging the dev URL and resolving the proxy is setup promise
            server.listen( this.our_opts.serve_port, () => {

                // Fix 0.0.0.0 to 127.0.0.1 to avoid CORS for private networks error
                const scheme     = this.our_opts.ssl_key_file ? 'https://' : 'http://';
                const fixed_host = esbuild_serve_host.replace( '0.0.0.0', '127.0.0.1' );

                // Long logging line due to formatting
                // eslint-disable-next-line max-len
                console.log( chalk.bold.cyan( '🛠️  Proxy serve listening on ' + chalk.underline( scheme + fixed_host + ':' + this.our_opts.serve_port ) ) );

                resolve();
            } );
        } );
    }

    // Iterates over SSE clients writing data to them to trigger browser reloads
    trigger_sse_reload() {

        for( const client of this.sse_clients ) {

            // Message is arbitrary here but still keep it as "reload" so it's clear what the purpose is
            client.write( 'data: reload\n\n' );
        }
    }

    // Runs esbuild.analyzeMetafile on esbuild.build results and outputs report to both CLI and filesystem
    // - https://esbuild.github.io/api/#analyze
    async analyze( esbuild_build_opts, esbuild_result ) {

        console.log( '\n🔎 Analyzing bundle...' );

        console.log( await esbuild.analyzeMetafile( esbuild_result.metafile ) );

        console.log( '📜 Writing "' + BUILD_META_OUT + '"...' );

        fs.writeFileSync( BUILD_META_OUT, JSON.stringify( esbuild_result.metafile ) );

        console.log( '  "' + BUILD_META_OUT + '" written!' );
        console.log( '  - Build size analyzer : ' + chalk.bold.cyan.underline( 'https://esbuild.github.io/analyze/' ) );
    }

    // Display a consistent "done!" message - used for early bails of the build process - ex: with "--clean"
    done() {

        console.log( '\n🏁 Done!\n' );
    }

    // Run the build
    async run() {

        console.log( '\n🗑️  Cleaning ' + DIST_DIR + ' before build...' );
        await this.clean_dist();

        // If set to only clean then stop here
        if( this.our_opts.clean ) return this.done();

        console.log( '\n🚦 Starting esbuild...' );
        if( this.our_opts.is_dev_build ) console.log( '⚠️  --dev flag is set! Enabling development build features...' );

        const esbuild_build_opts = this.get_esbuild_build_opts();

        // If serve or watch enabled then we need to setup our build process through `esbuild.context`
        if( this.our_opts.enable_serve || this.our_opts.enable_watch ) {

            // Create a build context
            // - https://esbuild.github.io/api/#build (build context docs)
            const esbuild_context = await esbuild.context( esbuild_build_opts );

            // Watch application through esbuild and static assets through chokidar
            if( this.our_opts.enable_watch ) {

                await esbuild_context.watch();
                this.setup_assets_watch( esbuild_context );
            }

            // Serve the built/moved assets through `esbuild.serve`
            if( this.our_opts.enable_serve ) await this.setup_esbuild_serve( esbuild_context );

        } else {

            // Else, build is normal build so use `esbuild.build`

            // Perform esbuild with generated build options
            // - https://esbuild.github.io/api/#build
            const esbuild_result = await esbuild.build( esbuild_build_opts );

            // Analyze the bundle if needed
            if( this.our_opts.analyze_bundle ) await this.analyze( esbuild_build_opts, esbuild_result );
        }

        this.done();
    }
}

// Setup CLI options
const program = ( new Command );

program
    .option( '--dev', 'Development build', false )
    .option( '--clean', 'Clean ' + DIST_DIR + ' and stop' )
    .option( '--watch', 'Enable watch', false )
    .option( '--serve', 'Enable serve', false )
    .option( '--live-reload', 'Enable live reload', false )
    .option( '--analyze', 'Analyze bundle', false )
    .option( '--log-level <log_level>', 'Logging level: silent, error, warning, info, debug, verbose', 'info' )
    .option( '--serve-port <serve_port>', 'Specify serve port', SERVE_PORT )
    .option( '--proxied-port <proxied_port>', 'Specify proxied serve port', PROXIED_PORT )
    .option( '--ssl-key-file <ssl_key_file>', 'Specify SSL key file' )
    .option( '--ssl-cert-file <ssl_cert_file>', 'Specify SSL certificate file' )
    .parse( process.argv );

const options = program.opts();

const build = new Build( {
    is_dev_build       : options.dev,
    enable_watch       : options.watch,
    enable_serve       : options.serve,
    enable_live_reload : options.liveReload,
    analyze_bundle     : options.analyze,
    log_level          : options.logLevel,
    serve_port         : options.servePort,
    proxied_port       : options.proxiedPort,
    clean              : options.clean,
    ssl_key_file       : options.sslKeyFile,
    ssl_cert_file      : options.sslCertFile,
} );

build.run();
