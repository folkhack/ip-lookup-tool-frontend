import React, { ReactNode } from 'react';
import styles from './Card.module.css';

interface TitleIcon {
    src: string;
    alt: string;
    title: string;
}

interface Props {
    title?: string;
    title_as_h1? : boolean;
    children?: ReactNode;
    icon?: TitleIcon;
}

const Card: React.FC<Props> = ( { title, title_as_h1, children, icon } ) => {

    return (
        <div className={ styles.wrapper }>
            <div className={ styles.title }>

                { icon && ( <img src={ icon.src } alt={ icon.alt } title={ icon.title } /> ) }

                { title_as_h1 === true && (
                    <h1>{ title }</h1>
                ) || title }

            </div>
            <div className={ styles.body }>
                { children }
            </div>
        </div>
    );
};

export default Card;
