const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 5000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kul_akademik',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL server');
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get All Mahasiswa
app.get('/api/mahasiswa', (req, res) => {
    const query = 'SELECT * FROM mahasiswa';
    connection.query(query, (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

// Tambah Mahasiswa
app.post('/api/mahasiswa', upload.single('foto'), (req, res) => {
    const { nim, nama, tanggal_lahir, alamat, id_webinar } = req.body;
    const foto = req.file ? req.file.filename : null;

    const query = 'INSERT INTO mahasiswa (nim, nama, foto, tanggal_lahir, alamat, id_webinar) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [nim, nama, foto, tanggal_lahir, alamat, id_webinar], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Mahasiswa berhasil ditambahkan' });
    });
});

// Update Mahasiswa
app.put('/api/mahasiswa/:id', upload.single('foto'), (req, res) => {
    const id = req.params.id;
    const { nim, nama, tanggal_lahir, alamat, id_webinar } = req.body;
    let foto = req.file ? req.file.filename : null;

    const querySelectFoto = 'SELECT foto FROM mahasiswa WHERE id = ?';
    connection.query(querySelectFoto, [id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui mahasiswa' });
        }

        let oldFotoPath = null;
        if (rows.length > 0) {
            oldFotoPath = rows[0].foto;
        }

        if (!foto) {
            foto = oldFotoPath;
        }

        const query = 'UPDATE mahasiswa SET nim = ?, nama = ?, foto = ?, tanggal_lahir = ?, alamat = ?, id_webinar = ? WHERE id = ?';
        connection.query(query, [nim, nama, foto, tanggal_lahir, alamat, id_webinar, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui mahasiswa' });
            }

            if (oldFotoPath && oldFotoPath !== foto && foto !== null) {
                const fotoPath = path.join(__dirname, 'public', 'uploads', oldFotoPath);
                fs.unlink(fotoPath, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Gagal menghapus file foto lama' });
                    }
                    console.log(`File ${fotoPath} berhasil dihapus`);
                    res.json({ message: 'Mahasiswa berhasil diperbarui' });
                });
            } else {
                res.json({ message: 'Mahasiswa berhasil diperbarui' });
            }
        });
    });
});

// Delete Mahasiswa
app.delete('/api/mahasiswa/:id', (req, res) => {
    const id = req.params.id;

    const querySelectFoto = 'SELECT foto FROM mahasiswa WHERE id = ?';
    connection.query(querySelectFoto, [id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Terjadi kesalahan saat menghapus mahasiswa' });
        }

        if (rows.length > 0) {
            const fotoPath = path.join(__dirname, 'public', 'uploads', rows[0].foto);

            fs.unlink(fotoPath, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Gagal menghapus file foto' });
                }

                console.log(`File ${fotoPath} berhasil dihapus`);
            });
        }

        const queryDeleteMahasiswa = 'DELETE FROM mahasiswa WHERE id = ?';
        connection.query(queryDeleteMahasiswa, [id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Terjadi kesalahan saat menghapus mahasiswa' });
            }

            res.json({ message: 'Mahasiswa berhasil dihapus' });
        });
    });
});

app.get('/api/mahasiswa/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM mahasiswa WHERE id = ?';
    connection.query(query, [id], (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
        }
    });
});


// Webinar
const uploadWebinar = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/cover/');
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        },
    })
});
app.post('/api/webinar', uploadWebinar.single('cover'), (req, res) => {
    const { nama_webinar, narasumber, tanggal, deskripsi } = req.body;
    const cover = req.file ? req.file.filename : null;

    const query = 'INSERT INTO webinar (cover, nama_webinar, narasumber, tanggal, deskripsi) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [cover, nama_webinar, narasumber, tanggal, deskripsi], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan webinar' });
        }
        res.json({ message: 'Webinar berhasil ditambahkan' });
    });
});

app.put('/api/webinar/:id', uploadWebinar.single('cover'), (req, res) => {
    const id = req.params.id;
    const { nama_webinar, narasumber, tanggal, deskripsi } = req.body;
    let cover = req.file ? req.file.filename : null;

    const querySelectCover = 'SELECT cover FROM webinar WHERE id = ?';
    connection.query(querySelectCover, [id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui webinar' });
        }

        let oldCoverPath = null;
        if (rows.length > 0) {
            oldCoverPath = rows[0].cover;
        }

        if (!cover) {
            cover = oldCoverPath;
        }

        const query = 'UPDATE webinar SET cover = ?, nama_webinar = ?, narasumber = ?, tanggal = ?, deskripsi = ? WHERE id = ?';
        connection.query(query, [cover, nama_webinar, narasumber, tanggal, deskripsi, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui webinar' });
            }

            if (oldCoverPath && oldCoverPath !== cover && cover !== null) {
                const coverPath = path.join(__dirname, 'public', 'cover', oldCoverPath);
                fs.unlink(coverPath, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Gagal menghapus file cover lama' });
                    }
                    console.log(`File ${coverPath} berhasil dihapus`);
                    res.json({ message: 'Webinar berhasil diperbarui' });
                });
            } else {
                res.json({ message: 'Webinar berhasil diperbarui' });
            }
        });
    });
});

app.delete('/api/webinar/:id', (req, res) => {
    const id = req.params.id;

    const querySelectCover = 'SELECT cover FROM webinar WHERE id = ?';
    connection.query(querySelectCover, [id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Terjadi kesalahan saat menghapus webinar' });
        }

        if (rows.length > 0) {
            const coverPath = path.join(__dirname, 'public', 'cover', rows[0].cover);

            fs.unlink(coverPath, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Gagal menghapus file cover' });
                }

                console.log(`File ${coverPath} berhasil dihapus`);
            });
        }

        const queryDeleteWebinar = 'DELETE FROM webinar WHERE id = ?';
        connection.query(queryDeleteWebinar, [id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Terjadi kesalahan saat menghapus webinar' });
            }

            res.json({ message: 'Webinar berhasil dihapus' });
        });
    });
});

app.get('/api/webinar', (req, res) => {
    const query = 'SELECT * FROM webinar';
    connection.query(query, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data webinar' });
        }
        res.json(rows);
    });
});

app.get('/api/webinar/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM webinar WHERE id = ?';
    connection.query(query, [id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data webinar' });
        }
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Webinar tidak ditemukan' });
        }
    });
});



// Jalankan server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
