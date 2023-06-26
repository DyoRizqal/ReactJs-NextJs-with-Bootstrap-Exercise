import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Form } from 'react-bootstrap';
import Layout from '../component/Layout';
import { useRouter } from 'next/router';

const IndexAddPageWebinar = () => {
    const router = useRouter();
    const [namaWebinar, setNamaWebinar] = useState('');
    const [narasumber, setNarasumber] = useState('');
    const [tanggalWebinar, setTanggalWebinar] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [cover, setCover] = useState(null);

    const handleSubmit = async (event) => {
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

            await axios.post('http://localhost:5000/api/webinar', formData, {
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
        <div>
            <Layout>
                <Container className='mt-4'>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNamaWebinar" className='p-2'>
                            <Form.Label>Nama Webinar</Form.Label>
                            <Form.Control type="text" placeholder="Nama Webinar" value={namaWebinar} onChange={(e) => setNamaWebinar(e.target.value)} required autoComplete='off' />
                        </Form.Group>

                        <Form.Group controlId="formNarasumber" className='p-2'>
                            <Form.Label>Narasumber</Form.Label>
                            <Form.Control type="text" placeholder="Narasumber" value={narasumber} onChange={(e) => setNarasumber(e.target.value)} required autoComplete='off' />
                        </Form.Group>

                        <Form.Group controlId="formTanggalWebinar" className='p-2'>
                            <Form.Label>Tanggal Webinar</Form.Label>
                            <Form.Control type="date" placeholder="Tanggal Webinar (YYYY-MM-DD)" value={tanggalWebinar} onChange={(e) => setTanggalWebinar(e.target.value)} required />
                        </Form.Group>

                        <Form.Group controlId="formDeskripsi" className='p-2'>
                            <Form.Label>Deskripsi</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required />
                        </Form.Group>

                        <Form.Group controlId="formCover" className='p-2'>
                            <Form.Label>Cover</Form.Label>
                            <Form.Control type="file" name="cover" onChange={handleCoverChange} />
                        </Form.Group>

                        <Form.Group controlId="btnSubmit" className='p-2'>
                            <Button variant="success" type="submit" className='p-2 btn'>
                                Simpan
                            </Button>
                        </Form.Group>
                    </Form>
                </Container>
            </Layout>
        </div>
    );
};

export default IndexAddPageWebinar;
