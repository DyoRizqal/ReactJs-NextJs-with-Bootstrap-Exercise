import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Card, Button, Container, Row, Form } from 'react-bootstrap';

const IndexPage = () => {
    const [mahasiswa, setMahasiswa] = useState([]);
    const [nim, setNim] = useState('');
    const [nama, setNama] = useState('');
    const [foto, setFoto] = useState(null);
    const [tanggalLahir, setTanggalLahir] = useState('');
    const [alamat, setAlamat] = useState('');
    const [editMahasiswaNim, setEditMahasiswaNim] = useState('');
    const [editNama, setEditNama] = useState('');
    const [editFoto, setEditFoto] = useState(null);
    const [editTanggalLahir, setEditTanggalLahir] = useState('');
    const [editAlamat, setEditAlamat] = useState('');
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);


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
            // formData.append('foto', foto);
            if (foto) {
                formData.append('foto', foto);
            }

            await axios.post('http://localhost:5000/api/mahasiswa', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setNim('');
            setNama('');
            setFoto(null);
            setTanggalLahir('');
            setAlamat('');

            fetchMahasiswa();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = async (nim) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/mahasiswa/${nim}`);
            const { nama, foto, tanggal_lahir, alamat } = response.data;

            setEditMahasiswaNim(nim);
            setEditNama(nama);
            setEditFoto(foto);
            setEditTanggalLahir(formatDate(tanggal_lahir));
            setEditAlamat(alamat);

            setIsEditFormVisible(true);
        } catch (error) {
            console.error(error);
        }
    };


    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('nama', editNama);
            formData.append('foto', editFoto);
            formData.append('tanggal_lahir', editTanggalLahir);
            formData.append('alamat', editAlamat);

            await axios.put(`http://localhost:5000/api/mahasiswa/${editMahasiswaNim}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setEditMahasiswaNim('');
            setEditNama('');
            setEditFoto(null);
            setEditTanggalLahir('');
            setEditAlamat('');

            setIsEditFormVisible(false);
            fetchMahasiswa();
        } catch (error) {
            console.error(error);
        }
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

            <Container>
                <Card>
                    <Card.Body>
                        <h2>Tambah Mahasiswa</h2>
                        {isEditFormVisible ? (
                            <form onSubmit={handleUpdate}>
                                <input type="text" placeholder="NIM" value={editMahasiswaNim} disabled />
                                <input type="text" placeholder="Nama" value={editNama} onChange={(e) => setEditNama(e.target.value)} required />
                                <input type="file" name="foto" onChange={(e) => setEditFoto(e.target.files[0])} />
                                <input
                                    type="date"
                                    placeholder="Tanggal Lahir (YYYY-MM-DD)"
                                    value={editTanggalLahir}
                                    onChange={(e) => setEditTanggalLahir(e.target.value)}
                                    required
                                />
                                <input type="text" placeholder="Alamat" value={editAlamat} onChange={(e) => setEditAlamat(e.target.value)} required />
                                <button type="submit">Update</button>
                            </form>
                        ) : (
                            // <form onSubmit={handleSubmit}>
                            //     <input type="text" placeholder="NIM" value={nim} onChange={(e) => setNim(e.target.value)} required />
                            //     <input type="text" placeholder="Nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
                            //     <input type="file" name="foto" onChange={handleFileChange} />
                            //     <input
                            //         type="date"
                            //         placeholder="Tanggal Lahir (YYYY-MM-DD)"
                            //         value={tanggalLahir}
                            //         onChange={(e) => setTanggalLahir(e.target.value)}
                            //         required
                            //     />
                            //     <input type="text" placeholder="Alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} required />
                            //     <button type="submit">Simpan</button>
                            // </form>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formNIM" className='p-2'>
                                    <Form.Label>NIM</Form.Label>
                                    <Form.Control type="text" placeholder="NIM" value={nim} onChange={(e) => setNim(e.target.value)} required />
                                </Form.Group>

                                <Form.Group controlId="formNama" className='p-2'>
                                    <Form.Label>Nama</Form.Label>
                                    <Form.Control type="text" placeholder="Nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
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
                                    <Form.Control type="text" placeholder="Alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} required />
                                </Form.Group>

                                <Form.Group controlId="btnSubmit" className='p-2'>
                                    <Button variant="success" type="submit" className='p-2 btn btn-lg'>
                                        Simpan
                                    </Button>
                                </Form.Group>

                            </Form>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            <Container className="p-3">
                <Row>
                    {mahasiswa.map((mhs) => (
                        <Col md={4} key={mhs.nim}>
                            <Card>
                                <Card.Body>
                                    {mhs.foto && (
                                        <Card.Img src={`/uploads/${mhs.foto}`} alt="Foto" style={{ maxHeight: '200px' }} />
                                    )}
                                    <Card.Title className="pt-3 pb-2">{mhs.nama}</Card.Title>
                                    <Card.Text>
                                        <strong>NIM:</strong> {mhs.nim}<br />
                                        <strong>Tanggal Lahir:</strong> {mhs.tanggal_lahir}<br />
                                        <strong>Alamat:</strong> {mhs.alamat}
                                    </Card.Text>

                                    <div className="mt-3">
                                        <Button variant="primary" onClick={() => handleEdit(mhs.nim)}>
                                            Edit
                                        </Button>{' '}
                                        <Button variant="danger" onClick={() => handleDelete(mhs.nim)}>
                                            Hapus
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div >
    );
};

export default IndexPage;
