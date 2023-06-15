import React from 'react';
import { useRouter } from 'next/router';

const Navbar = () => {
    const router = useRouter();

    const handleLinkClick = (path) => {
        router.push(path);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container p-2">
                <a href='#' className="navbar-brand font-weight-bold text-bold" onClick={() => handleLinkClick('/')}>
                    DyoRizqal
                </a>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a href='#' className="nav-link" onClick={() => handleLinkClick('/indexAll')}>
                                Homepage
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href='#' className="nav-link" onClick={() => handleLinkClick('/indexAdd')}>
                                Master Student
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
