import React, { ReactNode, ChangeEventHandler } from 'react';
import styles from './Input.module.css';

interface Props {
    name: string;
    label?: string;
    placeholder?: string;
    children?: ReactNode;
    is_required?: boolean;
    on_change?: ChangeEventHandler<HTMLInputElement>;
}

const Input: React.FC<Props> = ( { name, label, children, placeholder, is_required, on_change } ) => {

    return (

        <div className={ styles.wrapper }>
            {
                label && (
                    <label htmlFor={ name } className={ styles.label }>
                        { label }:
                    </label>
                )
            }
            <input
                id={ name }
                name={ name }
                className={ styles.input }
                required={ is_required ? true : undefined }
                placeholder={ placeholder }
                onChange={ on_change }
            />
            <div className={ styles.help }>
                { children }
            </div>
        </div>
    );
};

export default Input;
