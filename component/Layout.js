import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';


const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
            <div className="mb-20-child"></div>
        </div>
    );
};

export default Layout;
