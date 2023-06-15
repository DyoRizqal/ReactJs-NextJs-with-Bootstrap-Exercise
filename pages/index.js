import React from 'react';
import Layout from '../component/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
    return (
        <div>
        
            <Layout>
                <div className="text-center welcomeContainer">
                    <img src="/assets/welcome.png" alt="Gambar" className="welcomeImage" />
                    <p className="welcomeText">Selamat Datang Di Halaman Website STMIK Jayakarta</p>
                </div>
            </Layout>
        </div>
    );
};

export default HomePage;
