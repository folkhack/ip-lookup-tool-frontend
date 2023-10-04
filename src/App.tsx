import React from 'react';
import Card from '@src/components/Card/Card';
import Footer from '@src/partials/Footer';
import IpForm from '@src/partials/IpForm';
import favicon from '@assets/img/favicon.png';

const App = () => {

    return (

        <main id="app">

            <Card
                title="IP Info Lookup Tool"
                title_as_h1={ true }
                icon={ { src: favicon, title: 'Magnifying Glass', alt: 'Magnifying Glass' } }
            >

                <IpForm />

            </Card>

            <Footer />

        </main>

    );
};

export default App;
