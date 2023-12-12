import React, { useState } from 'react';
import './App.css'

const App = () => {
  const [imagen, setImagen] = useState(null)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
  }
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('imagen', imagen)
    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json();
      console.log('Imagen subida:', data.imagen);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  }
  return (
    <div className='card-style'>
      <input className='buttons-style' type="file" accept=".web, .jpg, jpeg, png" onChange={handleFileChange} />
      <br />
      <button className='buttons-style' onClick={handleUpload}>Subir Imagen</button>
    </div>
  );
};

export default App
