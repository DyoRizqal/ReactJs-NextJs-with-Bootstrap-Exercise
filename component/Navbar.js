import React from 'react';
import { useRouter } from 'next/router';

const Navbar = () => {
    const router = useRouter();

    const handleLinkClick = (path) => {
        router.push(path);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container p-2 d-flex align-items-center justify-content-between">
                <a href='#' className="navbar-brand font-weight-bold text-bold" onClick={() => handleLinkClick('/')}>
                    <img src="./assets/logo.png" alt="DyoRizqal" />
                </a>
                <div>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a href='#' className="nav-link" onClick={() => handleLinkClick('/indexAll')}>
                                Master Student
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href='#' className="nav-link" onClick={() => handleLinkClick('/indexAdd')}>
                                Register Student
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href='#' className="nav-link" onClick={() => handleLinkClick('/indexWebinar')}>
                                Master Webinar
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href='#' className="nav-link" onClick={() => handleLinkClick('/indexAbout')}>
                                About Website
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
