import React, { useState, FormEvent, ChangeEvent } from 'react';
import Input from '@src/components/Input/Input';
import Button from '@src/components/Button/Button';
import IpFormResult from './IpFormResult';

import { IpAddrInfoResult } from '@src/lib/IpAddrInfoTypes';
import { HttpApiClient } from '@src/lib/HttpApiClient';
import { ALL_FIELDS } from '@src/constants';

import styles from './IpForm.module.css';

const IpForm = () => {

    // Initialize state for errors, IP address, and result
    const [ errors, set_errors ]   = useState<string[]>( [] );
    const [ ip_addr, set_ip_addr ] = useState<string>( '' );
    const [ result, set_result ]   = useState<IpAddrInfoResult|null>( null );

    // Instantiate HTTP API client
    const ApiClient = new HttpApiClient;

    // Handle form submission
    const handle_submit = async( evt: FormEvent ) => {

        // Prevent default form behavior
        evt.preventDefault();

        try {

            // Perform IP lookup
            const lookup_result = await ApiClient.lookup_ip( ip_addr, ALL_FIELDS );

            // Extract response data, casting to IpAddrInfoResult
            const data:IpAddrInfoResult = lookup_result.response_data;

            // Update state with errors and result
            set_errors( data.errors );
            set_result( data );

        } catch( e ) {

            // Log exception and update state for exception condition
            console.error( 'Exception caught during IP lookup!', e );
            set_errors( [ 'Exception caught during IP lookup, check console for more information' ] );
            set_result( null );
        }
    };

    // Handle changes to the IP address input field
    const handle_ip_change = ( evt:ChangeEvent<HTMLInputElement> ) => {

        // Update state with the new IP address value
        set_ip_addr( evt.target.value );
    };

    return (

        <form onSubmit={ handle_submit }>

            { /* Display errors if any */ }
            {
                errors && errors.length > 0 && (
                    <div className={ styles.errors_wrap }>
                        <h5 className={ styles.errors_heading }>Errors:</h5>
                        <ul className={ styles.errors_list }>
                            {
                                errors.map( ( error, index ) => {

                                    return ( <li key={ index }>{ error }</li> );
                                } )
                            }
                        </ul>
                    </div>
                )
            }

            { /* Input field */ }
            <Input
                name="ip_address"
                label="IP Address"
                is_required={ true }
                placeholder="ex: 2606:4700:4700::64"
                on_change={ handle_ip_change }
            >
                <b>NOTE:</b> IPv4 &amp; IPv6 supported!
            </Input>

            { /* Submit button */ }
            <div className="text_center">
                <Button type="submit">
                    Lookup IP Address &raquo;
                </Button>
            </div>

            <IpFormResult result={ result } />

        </form>
    );
};

export default IpForm;
