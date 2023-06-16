import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Container, Form } from 'react-bootstrap';
import Layout from '../component/Layout';
import { useRouter } from 'next/router';


const IndexAddPage = () => {
    const router = useRouter();
    const [mahasiswa, setMahasiswa] = useState([]);
    const [nim, setNim] = useState('');
    const [nama, setNama] = useState('');
    const [foto, setFoto] = useState(null);
    const [tanggalLahir, setTanggalLahir] = useState('');
    const [alamat, setAlamat] = useState('');


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
    }
    const handleFileChange = (event) => {
        // setFoto(event.target.files[0]);
        const file = event.target.files[0];
        setFoto(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('nim', nim);
            formData.append('nama', nama);
            formData.append('tanggal_lahir', tanggalLahir);
            formData.append('alamat', alamat);
            if (foto) {
                formData.append('foto', foto);
            }

            await axios.post('http://localhost:5000/api/mahasiswa', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            router.push('/indexAll');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Layout>
                <Container className='mt-4'>
                    <Card>
                        <Card.Body>
                            <h2>Tambah Mahasiswa</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formNIM" className='p-2'>
                                    <Form.Label>NIM</Form.Label>
                                    <Form.Control type="text" placeholder="NIM" value={nim} onChange={(e) => setNim(e.target.value)} required autoComplete='off' />
                                </Form.Group>

                                <Form.Group controlId="formNama" className='p-2'>
                                    <Form.Label>Nama</Form.Label>
                                    <Form.Control type="text" placeholder="Nama" value={nama} onChange={(e) => setNama(e.target.value)} required autoComplete='off' />
                                </Form.Group>

                                <Form.Group controlId="formFoto" className='p-2'>
                                    <Form.Label>Foto</Form.Label>
                                    <Form.Control type="file" name="foto" onChange={handleFileChange} />
                                </Form.Group>

                                <Form.Group controlId="formTanggalLahir" className='p-2'>
                                    <Form.Label>Tanggal Lahir</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Tanggal Lahir (YYYY-MM-DD)"
                                        value={tanggalLahir}
                                        onChange={(e) => setTanggalLahir(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="formAlamat" className='p-2'>
                                    <Form.Label>Alamat</Form.Label>
                                    <Form.Control type="text" placeholder="Alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} required autoComplete='off' />
                                </Form.Group>

                                <Form.Group controlId="btnSubmit" className='p-2'>
                                    <Button variant="success" type="submit" className='p-2 btn'>
                                        Simpan
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </Layout>
        </div>
    );
};

export default IndexAddPage;
