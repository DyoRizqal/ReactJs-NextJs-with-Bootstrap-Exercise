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
    useEffect(() => {
        fetchMahasiswa();
    }, []);

    const fetchMahasiswa = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/mahasiswa');
            const formattedMahasiswa = response.data.map((mhs) => ({
                ...mhs,
                tanggal_lahir: formatDate(mhs.tanggal_lahir),
            }));
            setMahasiswa(formattedMahasiswa);
            // setMahasiswa(response.data);  
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
    };

    const handleEdit = (nim) => {
        router.push(`/indexEdit?nim=${nim}`);
    };

    const handleDelete = async (nim) => {
        try {
            await axios.delete(`http://localhost:5000/api/mahasiswa/${nim}`);
            fetchMahasiswa();
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div>
            <Layout>
                <Container className="p-3 mt-3 mb-10">
                    <Row>
                        {mahasiswa.map((mhs) => (
                            <Col md={4} key={mhs.nim}>
                                <Card className='mb-3'>
                                    <Card.Body>
                                        {mhs.foto && (
                                            <Card.Img src={`/uploads/${mhs.foto}`} alt="Foto" style={{ maxHeight: '350px' }} />
                                        )}
                                        <Card.Title className="pt-3 pb-2"><h4 className='text-bold'>{mhs.nama}</h4></Card.Title>
                                        <Card.Text>
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


                                        </Card.Text>

                                        <div className="mt-3">
                                            <Button variant="primary" className="black-btn" onClick={() => handleEdit(mhs.nim)}>
                                                <FontAwesomeIcon icon={faEdit} />  Edit
                                            </Button>{' '}
                                            <Button variant="danger" onClick={() => handleDelete(mhs.nim)}>
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
