import React from 'react';
import Layout from '../component/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Card, Container, Row } from 'react-bootstrap';

const AboutPage = () => {
    return (
        <div>
            <Layout>
                <Container className="p-3 mt-3 mb-5">
                    <Row className="justify-content-center">
                        {/* <Card className='mb-3'>
                            <Card.Body>
                                <Card.Title className="pt-3 pb-2 text-left"><h4 className='text-bold text-red'>TENTANG APLIKASI</h4></Card.Title>
                                <Card.Title className="text-left"><h6>Setelah belajar mata kuliah pemrograman web dan dalam rangka Ujian Akhir Semester (UAS), saya mempersembahkan sebuah website yang saya buat. Website ini merupakan hasil dari pembelajaran saya tentang cara membuat web menggunakan ReactJS, NextJs, dan Bootstrap</h6></Card.Title>
                                <Card.Title className="text-left"><h6>Saya mencoba mengaplikasikan pengetahuan yang saya dapat selama kuliah untuk membuat website ini. Saya berfokus pada hal-hal seperti bagaimana tata letaknya harus terlihat bagus , bagaimana pengunjung dapat dengan mudah berpindah halaman, dan tentunya, tampilan yang menarik. Saya juga menggunakan HTML, CSS, dan JavaScript untuk memberikan efek interaktif dan menarik.</h6></Card.Title>
                                <Card.Title className="text-left"><h6>Website ini adalah hasil belajar saya dalam menguasai materi pemrograman web. Saya berharap website ini bisa menjadi bukti kemajuan saya dalam memahami dan mengimplementasikan ilmu pemrograman web dalam praktiknya.</h6></Card.Title>
                            </Card.Body>
                        </Card> */}
                        <Col md={4}>
                            <Card className='mb-3'>
                                <Card.Body>
                                    <Card.Img src={`/assets/pak_dimas.jpg`} className='mb-4 rounded-circle' alt="Foto" style={{ maxHeight: '350px' }} />
                                    <Card.Title className="pt-3 pb-2 text-center"><h4 className='text-bold text-red'>DOSEN PENGAMPU</h4></Card.Title>
                                    <Card.Title className="pt-3 pb-2 text-center"><h5>DIMAS PRASETYO TEGAR ASMORO, S.Kom,M.Kom</h5></Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className='mb-3'>
                                <Card.Body>
                                    <Card.Img src={`/assets/dyo.jpg`} className='mb-4 rounded-circle' alt="Foto" style={{ maxHeight: '350px' }} />
                                    <Card.Title className="pt-3 pb-2 text-center"><h4 className='text-bold text-red'>MAHASISWA</h4></Card.Title>
                                    <Card.Title className="pt-3 pb-2 text-center"><h5>DYO RIZQAL PAHLEVI <i>CALON</i> S.Kom<br />21572001</h5></Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Layout>
        </div>
    );
};

export default AboutPage;
