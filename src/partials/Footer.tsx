import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={ styles.footer }>
            <p>
                This is a test application that sits in front of <a href="https://ip-api.com/docs" rel="noopener noreferrer" target="_blank">ip-api.com&#39;s IP information API</a><br />
                Corresponding back-end API implementation @ <a href="https://github.com/folkhack/ip-lookup-tool" rel="noopener noreferrer" target="_blank">github.com/folkhack/ip-lookup-tool</a>
            </p>
        </footer>
    );
};

export default Footer;
