import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Container, Form } from 'react-bootstrap';
import Layout from '../component/Layout';

const IndexEdit = () => {
    const router = useRouter();
    const { id } = router.query;
    const [currentNama, setCurrentNama] = useState('');
    const [editNim, setEditNim] = useState('');
    const [editNama, setEditNama] = useState('');
    const [editFoto, setEditFoto] = useState('');
    const [currentFoto, setCurrentFoto] = useState('');
    const [editTanggalLahir, setEditTanggalLahir] = useState('');
    const [editAlamat, setEditAlamat] = useState('');
    const [webinarList, setWebinarList] = useState([]);
    const [selectedWebinar, setSelectedWebinar] = useState('');
    const handleWebinarChange = (event) => {
        setSelectedWebinar(event.target.value);
    };

    useEffect(() => {
        if (id) {
            fetchMahasiswa(id);
            fetchWebinarList();
        }
    }, [id]);

    const fetchMahasiswa = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/mahasiswa/${id}`);
            const mahasiswa = response.data;
            setEditNim(mahasiswa.nim);
            setEditNama(mahasiswa.nama);
            setCurrentNama(mahasiswa.nama);
            setEditFoto(mahasiswa.foto);
            setCurrentFoto(mahasiswa.foto);
            setEditTanggalLahir(formatDate(mahasiswa.tanggal_lahir));
            setEditAlamat(mahasiswa.alamat);
            setSelectedWebinar(mahasiswa.id_webinar);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchWebinarList = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/webinar');
            setWebinarList(response.data);
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
            formData.append('nim', editNim); // Perbaiki baris ini
            formData.append('nama', editNama);
            if (editFoto) {
                formData.append('foto', editFoto);
            } else {
                formData.append('foto', currentFoto);
            }
            formData.append('tanggal_lahir', editTanggalLahir);
            formData.append('alamat', editAlamat);
            formData.append('id_webinar', selectedWebinar);

            await axios.put(`http://localhost:5000/api/mahasiswa/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                params: { id },
            });

            router.push('/indexAll');
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Layout>
            <Container className="mt-4 ">
                <Card>
                    <Card.Body>
                        <h2>Edit Mahasiswa {currentNama}</h2>

                        <Form onSubmit={handleUpdate}>
                            <Form.Group controlId="formNIM" className="p-2">
                                <Form.Label>NIM</Form.Label>
                                <Form.Control type="text" placeholder="NIM" value={editNim} onChange={(e) => setEditNim(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="formNama" className="p-2">
                                <Form.Label>Nama</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nama"
                                    value={editNama}
                                    onChange={(e) => setEditNama(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formFoto" className="p-2">
                                <Form.Label>Foto</Form.Label>
                                <Form.Control type="file" onChange={(e) => setEditFoto(e.target.files[0])} />
                            </Form.Group>

                            <Form.Group controlId="formTanggalLahir" className="p-2">
                                <Form.Label>Tanggal Lahir</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Tanggal Lahir (YYYY-MM-DD)"
                                    value={editTanggalLahir}
                                    onChange={(e) => setEditTanggalLahir(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formAlamat" className="p-2">
                                <Form.Label>Alamat</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Alamat"
                                    value={editAlamat}
                                    onChange={(e) => setEditAlamat(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formWebinar" className="p-2">
                                <Form.Label>Pilih Webinar</Form.Label>
                                <Form.Control as="select" value={selectedWebinar} onChange={handleWebinarChange}>
                                    <option value="">Pilih Webinar</option>
                                    {webinarList.map((webinar) => (
                                        <option key={webinar.id} value={webinar.id}>
                                            {webinar.nama_webinar}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="btnSubmit" className="p-2">
                                <Button variant="success" type="submit" className="p-2">
                                    Simpan Perubahan
                                </Button>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </Layout>
    );
};

export default IndexEdit;
