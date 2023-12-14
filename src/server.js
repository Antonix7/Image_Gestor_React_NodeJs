// server.js
import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import multer from 'multer';
import path from 'path';
import url from 'url';

const app = express();
const PORT = 3001;

// Configurar Sequelize para la conexión a la base de datos SQL Server
const sequelize = new Sequelize({
  dialect: 'mssql',
  host: 'localhost',
  port: 3001,
  database: 'files_db',
  username: 'null',
  password: 'null',
});

// Definir el modelo de la tabla Imagen
const Imagen = sequelize.define('Imagen', {
  nombre: {
    type: DataTypes.STRING,
  },
  ruta: {
    type: DataTypes.STRING,
  },
});

// Configuración de Multer para manejar archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Ruta para manejar la carga de imágenes
app.post('/upload', upload.single('imagen'), async (req, res) => {
  try {
    const nuevaImagen = await Imagen.create({
      nombre: req.file.originalname,
      ruta: req.file.path,
    });
    res.json({ imagen: nuevaImagen });
    console.log('Imagen subida con éxito');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir la imagen' });
    console.log('Error al subir la imagen');
  }
});

// Ruta para servir las imágenes desde el servidor
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inicializando el servidor
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida con la base de datos');
    await sequelize.sync();
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
});
