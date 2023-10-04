import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface Props {
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
    children?: ReactNode;
}

const Button: React.FC<Props> = ( { type, children } ) => {

    return (
        <button className={ styles.button } type={ type ? type : 'button' }>
            { children }
        </button>
    );
};

export default Button;
