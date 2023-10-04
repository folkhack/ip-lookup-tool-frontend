import React from 'react';

// Ensure to use "Light Build" to not have huge bundle sizes due to all styles/languages
//    being imporated at once!
// - https://github.com/react-syntax-highlighter/react-syntax-highlighter#light-build
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import a11yDark from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
import a11yLight from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-light';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';

import { IpAddrInfoResult } from '@src/lib/IpAddrInfoTypes';
import styles from './IpForm.module.css';

// Register the language with SyntaxHighlighter
SyntaxHighlighter.registerLanguage( 'json', json );

interface Props {
    result?: IpAddrInfoResult|null;
}

const IpFormResult = ( { result }:Props ) => {

    // Figure out result styles based on window prefers color scheme
    const result_theme = window.matchMedia && window.matchMedia( '( prefers-color-scheme: dark )' ).matches ?
        a11yDark :
        a11yLight;

    return (

        <div className="result_wrap">
            { /* Display results if successful */ }
            {
                result && result.success === true && (
                    <div id="result" className={ styles.results_table + ' responsive_wrap' }>
                        <table className="bordered striped">
                            <tbody>
                                <tr>
                                    <th className="shrink">Success</th>
                                    <td data-testid="result_success">{ String( result.success ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">IP Address</th>
                                    <td data-testid="result_ip">{ String( result.data?.queried_ip_addr ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Query Status</th>
                                    <td>{ String( result.data?.query_status ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Country</th>
                                    <td>{ String( result.data?.country ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Country Code</th>
                                    <td>{ String( result.data?.country_code ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Continent</th>
                                    <td>{ String( result.data?.continent ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Continent Code</th>
                                    <td>{ String( result.data?.continent_code ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Region</th>
                                    <td>{ String( result.data?.region ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Region Name</th>
                                    <td>{ String( result.data?.region_name ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">City</th>
                                    <td>{ String( result.data?.city ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">District</th>
                                    <td>{ String( result.data?.district ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Zip</th>
                                    <td>{ String( result.data?.zip ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Latitude</th>
                                    <td>{ String( result.data?.lat ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Longitude</th>
                                    <td>{ String( result.data?.lon ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Timezone</th>
                                    <td>{ String( result.data?.timezone ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Offset</th>
                                    <td>{ String( result.data?.offset ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">ISP</th>
                                    <td data-testid="result_isp">{ String( result.data?.isp ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Org</th>
                                    <td>{ String( result.data?.org ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">AS</th>
                                    <td>{ String( result.data?.as ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">AS Name</th>
                                    <td>{ String( result.data?.as_name ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Is Mobile?</th>
                                    <td>{ String( result.data?.is_mobile ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Is Proxy?</th>
                                    <td>{ String( result.data?.is_proxy ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Is Hosting?</th>
                                    <td>{ String( result.data?.is_hosting ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Reverse DNS</th>
                                    <td>{ String( result.data?.reverse ) }</td>
                                </tr>
                                <tr className="hidden">
                                    <th className="shrink">Started At</th>
                                    <td>{ String( result.query_start_at ) }</td>
                                </tr>
                                <tr className="hidden">
                                    <th className="shrink">Ended At</th>
                                    <td>{ String( result.query_stop_at ) }</td>
                                </tr>
                                <tr>
                                    <th className="shrink">Query Milliseconds</th>
                                    <td>{ String( result.query_ms ) }</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className={ styles.result_wrap }>

                            { /* Due to avoiding erronous whitespace must all be on same line! */ }
                            { /* eslint-disable-next-line max-len */ }
                            <SyntaxHighlighter language="json" style={ result_theme }>{ JSON.stringify( result, null, 2 ) }</SyntaxHighlighter>

                        </div>

                    </div>
                )
            }
        </div>
    );
};

export default IpFormResult;
