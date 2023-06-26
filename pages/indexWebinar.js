import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Layout from '../component/Layout';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const IndexPageWebinar = () => {
    const router = useRouter();
    const [webinar, setWebinar] = useState([]);

    useEffect(() => {
        fetchWebinar();
    }, []);

    const fetchWebinar = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/webinar');
            setWebinar(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    const handleAdd = () => {
        router.push(`/indexAddWebinar`);
    };
    const handleEdit = (id) => {
        router.push(`/indexEditWebinar?id=${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/webinar/${id}`);
            fetchWebinar();
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

    return (
        <Layout>
            <div className="container p-3 mt-3 mb-15">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Webinar List</h1>
                    <Button variant="primary" className="black-btn" onClick={() => handleAdd()}>
                        <FontAwesomeIcon icon={faPlus} /> Tambah
                    </Button>
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Cover</th>
                            <th>Nama Webinar</th>
                            <th>Narasumber</th>
                            <th>Tanggal Webinar</th>
                            <th>Deskripsi</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="align-middle">
                        {webinar.map((wb, index) => (
                            <tr key={wb.id}>
                                <td className='text-center'>{index + 1}.</td>
                                <td>
                                    {wb.cover && (
                                        <img src={`/cover/${wb.cover}`} alt="Cover" style={{ maxWidth: '100px' }} />
                                    )}
                                </td>
                                <td>{wb.nama_webinar}</td>
                                <td>{wb.narasumber}</td>
                                <td>{formatDate(wb.tanggal)}</td>
                                <td>{wb.deskripsi}</td>
                                <td>
                                    <Button className="black-btn" onClick={() => handleEdit(wb.id)}>
                                        <FontAwesomeIcon icon={faEdit} /> Edit
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(wb.id)}>
                                        <FontAwesomeIcon icon={faTrash} /> Hapus
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Layout >
    );
};

export default IndexPageWebinar;
