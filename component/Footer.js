import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {

    return (
        <footer id="footer" className='fixed-bottom'>
            <div className="container">
                <div className="copyright">
                    <div className="qr">
                        <img src="./assets/qr.png" alt="QR Code" /> 
                        {new Date().getFullYear()}  © <strong>DRP</strong> All Rights Reserved
                    </div>
                </div>
                <div className="social-links">

                    <a href="https://dyorizqal.site/" target='_blank'><FontAwesomeIcon icon={faGlobe} /></a>
                    <a href="https://www.instagram.com/dyorizqal/" target='_blank'><FontAwesomeIcon icon={faInstagram} /></a>
                    <a href="mailto:dyorizqal7@gmail.com" target='_blank'><FontAwesomeIcon icon={faGoogle} /></a>
                    <a href="https://www.linkedin.com/in/dyorizqal/" target='_blank'><FontAwesomeIcon icon={faLinkedin} /></a>
                </div>
            </div>
        </footer>

    );
};

export default Navbar;
