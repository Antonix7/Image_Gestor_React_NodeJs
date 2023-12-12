import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import multer from 'multer';

const app = express();
const PORT = 3001;

const sequelize = new Sequelize('files_db', 'DESKTOP-3HTMILH/JAKC', null, {
    host: 'localhost',
    dialect: 'mssql',
});

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
    console.log('Imagen subida con exito');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir la imagen' });
    console.log('Error al subir la imagen');
  }
});

  // Inicializando servidor
app.listen(PORT, async () => {
  await sequelize.sync(); // Sincronizar modelos con la base de datos
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
