const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 5000;

// Konfigurasi MySQL
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

// Konfigurasi Multer untuk mengunggah foto
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

// Definisikan rute-rute untuk CRUD

app.get('/api/mahasiswa', (req, res) => {
    const query = 'SELECT * FROM mahasiswa';
    connection.query(query, (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

app.post('/api/mahasiswa', upload.single('foto'), (req, res) => {
    const { nim, nama, tanggal_lahir, alamat } = req.body;
    const foto = req.file ? req.file.filename : null;

    const query = 'INSERT INTO mahasiswa (nim, nama, foto, tanggal_lahir, alamat) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [nim, nama, foto, tanggal_lahir, alamat], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Mahasiswa berhasil ditambahkan' });
    });
});

app.put('/api/mahasiswa/:nim', upload.single('foto'), (req, res) => {
    const nim = req.params.nim;
    const { nama, tanggal_lahir, alamat } = req.body;
    const foto = req.file ? req.file.filename : null;

    const querySelectFoto = 'SELECT foto FROM mahasiswa WHERE nim = ?';
    connection.query(querySelectFoto, [nim], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui mahasiswa' });
        }

        let oldFotoPath = null;
        if (rows.length > 0) {
            oldFotoPath = rows[0].foto;
        }

        const query = 'UPDATE mahasiswa SET nama = ?, foto = ?, tanggal_lahir = ?, alamat = ? WHERE nim = ?';
        connection.query(query, [nama, foto, tanggal_lahir, alamat, nim], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui mahasiswa' });
            }

            if (oldFotoPath && oldFotoPath !== foto) {
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

app.delete('/api/mahasiswa/:nim', (req, res) => {
    const nim = req.params.nim;

    const querySelectFoto = 'SELECT foto FROM mahasiswa WHERE nim = ?';
    connection.query(querySelectFoto, [nim], (err, rows) => {
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

        const queryDeleteMahasiswa = 'DELETE FROM mahasiswa WHERE nim = ?';
        connection.query(queryDeleteMahasiswa, [nim], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Terjadi kesalahan saat menghapus mahasiswa' });
            }

            res.json({ message: 'Mahasiswa berhasil dihapus' });
        });
    });
});



app.get('/api/mahasiswa/:nim', (req, res) => {
    const nim = req.params.nim;
    const query = 'SELECT * FROM mahasiswa WHERE nim = ?';
    connection.query(query, [nim], (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
        }
    });
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
