import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Container, Form } from 'react-bootstrap';
import Layout from '../component/Layout';
import { useRouter } from 'next/router';

const IndexEditWebinar = () => {
    const router = useRouter();
    const { id } = router.query;
    const [webinar, setWebinar] = useState(null);
    const [namaWebinar, setNamaWebinar] = useState('');
    const [narasumber, setNarasumber] = useState('');
    const [tanggalWebinar, setTanggalWebinar] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [cover, setCover] = useState(null);

    useEffect(() => {
        if (id) {
            fetchWebinar(id);
        }
    }, [id]);

    const fetchWebinar = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/webinar/${id}`);
            const webinarData = response.data;
            setWebinar(webinarData);
            setNamaWebinar(webinarData.nama_webinar);
            setNarasumber(webinarData.narasumber);
            setTanggalWebinar(formatDate(webinarData.tanggal));
            setDeskripsi(webinarData.deskripsi);
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

    const handleUpdate = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('nama_webinar', namaWebinar);
            formData.append('narasumber', narasumber);
            formData.append('tanggal', tanggalWebinar);
            formData.append('deskripsi', deskripsi);
            if (cover) {
                formData.append('cover', cover);
            }

            await axios.put(`http://localhost:5000/api/webinar/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            router.push('/indexWebinar');
        } catch (error) {
            console.error(error);
        }
    };

    const handleCoverChange = (event) => {
        const file = event.target.files[0];
        setCover(file);
    };

    return (
        <Layout>
            <Container className="mt-4">
                <Card>
                    <Card.Body>
                        <h2>Edit Webinar</h2>

                        {webinar && (
                            <Form onSubmit={handleUpdate}>
                                <Form.Group controlId="formNamaWebinar" className="p-2">
                                    <Form.Label>Nama Webinar</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nama Webinar"
                                        value={namaWebinar}
                                        onChange={(e) => setNamaWebinar(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formNarasumber" className="p-2">
                                    <Form.Label>Narasumber</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Narasumber"
                                        value={narasumber}
                                        onChange={(e) => setNarasumber(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formTanggalWebinar" className="p-2">
                                    <Form.Label>Tanggal Webinar</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Tanggal Webinar (YYYY-MM-DD)"
                                        value={tanggalWebinar}
                                        onChange={(e) => setTanggalWebinar(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formDeskripsi" className="p-2">
                                    <Form.Label>Deskripsi</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Deskripsi"
                                        value={deskripsi}
                                        onChange={(e) => setDeskripsi(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formCover" className="p-2">
                                    <Form.Label>Cover</Form.Label>
                                    <Form.Control type="file" onChange={handleCoverChange} />
                                </Form.Group>

                                <Form.Group controlId="btnSubmit" className="p-2">
                                    <Button variant="success" type="submit">
                                        Simpan Perubahan
                                    </Button>
                                </Form.Group>
                            </Form>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </Layout>
    );
};

export default IndexEditWebinar;
