import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Card, Button, Container, Row } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Layout from '../component/Layout';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const IndexPage = () => {
    const router = useRouter();
    const [mahasiswa, setMahasiswa] = useState([]);
    const [webinarMap, setWebinarMap] = useState({});

    useEffect(() => {
        fetchMahasiswa();
        fetchWebinarMap();
    }, []);

    const fetchMahasiswa = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/mahasiswa');
            const formattedMahasiswa = response.data.map((mhs) => ({
                ...mhs,
                tanggal_lahir: formatDate(mhs.tanggal_lahir),
            }));
            setMahasiswa(formattedMahasiswa);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchWebinarMap = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/webinar');
            const webinarData = response.data.reduce((map, webinar) => {
                map[webinar.id] = webinar.nama_webinar;
                return map;
            }, {});
            setWebinarMap(webinarData);
        } catch (error) {
            console.error(error);
        }
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear().toString();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const handleEdit = (id) => {
        router.push(`/indexEdit?id=${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/mahasiswa/${id}`);
            fetchMahasiswa();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Layout>
                <Container className="p-3 mt-3 mb-15">
                    <Row>
                        {mahasiswa.map((mhs) => (
                            <Col md={4} key={mhs.nim}>
                                <Card className='mb-3'>
                                    <Card.Body>
                                        {mhs.foto && (
                                            <Card.Img src={`/uploads/${mhs.foto}`} alt="Foto" style={{ maxWidth: '100%' }} />
                                        )}  
                                        <Card.Title className="pt-3 pb-2"><h4 className='text-bold'>{mhs.nama}</h4></Card.Title>
                                        <table className="table table-borderless custom-table">
                                            <tbody>
                                                <tr>
                                                    <th className="py-0">NIM</th>
                                                    <th className="py-0">:</th>
                                                    <td className="py-0">{mhs.nim}</td>
                                                </tr>
                                                <tr>
                                                    <th className="py-0">Tanggal Lahir</th>
                                                    <th className="py-0">:</th>
                                                    <td className="py-0">{mhs.tanggal_lahir}</td>
                                                </tr>
                                                <tr>
                                                    <th className="py-0">Alamat</th>
                                                    <th className="py-0">:</th>
                                                    <td className="py-0">{mhs.alamat}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <center>
                                            <Card.Title className="text-center"><h5 className='text-bold text-black'> Terdaftar Pada Webinar  </h5></Card.Title>
                                            <Card.Title className="text-center"><h6 className='text-bold text-red'> {mhs.id_webinar ? webinarMap[mhs.id_webinar] : "Belum Daftar Webinar"}</h6></Card.Title>
                                        </center> 

                                        <div className="mt-3">
                                            <Button variant="primary" className="black-btn" onClick={() => handleEdit(mhs.id)}>
                                                <FontAwesomeIcon icon={faEdit} />  Edit
                                            </Button>{' '}
                                            <Button variant="danger" onClick={() => handleDelete(mhs.id)}>
                                                <FontAwesomeIcon icon={faTrash} /> Hapus
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </Layout>
        </div >
    );
};

export default IndexPage;
