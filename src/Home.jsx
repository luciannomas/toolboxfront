import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://toolboxback-production.up.railway.app';
const AUTH_TOKEN = 'aSuperSecretKey';

function Home() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener lista de archivos al montar
  useEffect(() => {
    console.log('Intentando obtener lista de archivos...');
    axios.get(`${API_URL}/files/list`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    })
      .then(res => {
        console.log('Respuesta completa:', res);
        console.log('Archivos recibidos:', res.data);
        const fileList = Array.isArray(res.data) ? res.data : res.data.files || [];
        setFiles(fileList);
        // Si hay archivos, cargar la data de todos por defecto
        if (fileList.length > 0) {
          setSelectedFile('');
          fetchAllFilesData(fileList);
        }
      })
      .catch(err => {
        console.error('Error al obtener archivos:', err);
        setError(err.message);
      });
  }, []);

  // Obtener datos de todos los archivos
  const fetchAllFilesData = async (fileList) => {
    setLoading(true);
    setError(null);
    try {
      const allData = [];
      for (const file of fileList) {
        try {
          console.log(`Obteniendo datos para archivo: ${file}`);
          const res = await axios.get(`${API_URL}/files/data?fileName=${file}`, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
          });
          console.log(`Respuesta para ${file}:`, res.data);
          if (Array.isArray(res.data)) {
            res.data.forEach(fileObj => {
              if (Array.isArray(fileObj.lines)) {
                fileObj.lines.forEach(line => {
                  allData.push({
                    fileName: fileObj.file,
                    text: line.text,
                    number: line.number,
                    hex: line.hex
                  });
                });
              }
            });
          }
        } catch (err) {
          console.error(`Error al obtener data de ${file}:`, err);
          setError(`Error al obtener datos de ${file}: ${err.message}`);
        }
      }
      setTableData(allData);
    } finally {
      setLoading(false);
    }
  };

  // Cuando seleccionas un archivo, carga solo ese archivo
  useEffect(() => {
    if (selectedFile === '') return; // Si está vacío, ya mostramos todos
    setLoading(true);
    axios.get(`${API_URL}/files/data?fileName=${selectedFile}`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    })
      .then(res => {
        console.log('Data recibida para', selectedFile, res.data);
        let rows = [];
        if (Array.isArray(res.data)) {
          res.data.forEach(fileObj => {
            if (Array.isArray(fileObj.lines)) {
              fileObj.lines.forEach(line => {
                rows.push({
                  fileName: fileObj.file,
                  text: line.text,
                  number: line.number,
                  hex: line.hex
                });
              });
            }
          });
        }
        setTableData(rows);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtener data:', err);
        setTableData([]);
        setLoading(false);
      });
  }, [selectedFile]);

  // Si cambia la lista de archivos y el seleccionado ya no existe, actualizarlo
  useEffect(() => {
    if (files.length > 0 && selectedFile && !files.includes(selectedFile)) {
      setSelectedFile('');
      fetchAllFilesData(files);
    }
  }, [files, selectedFile]);

  return (
    <div className="container mt-4">
      <div style={{ background: '#ff6f6f', padding: '10px 20px', color: 'white', fontWeight: 'bold', fontSize: '2rem', marginBottom: '20px' }}>
        React Test App
      </div>
      <div className="mb-3">
        <label htmlFor="fileSelect" className="form-label">Selecciona un archivo:</label>
        <select
          id="fileSelect"
          className="form-select w-auto d-inline-block ms-2"
          value={selectedFile}
          onChange={e => {
            const value = e.target.value;
            setSelectedFile(value);
            if (value === '') fetchAllFilesData(files);
          }}
        >
          <option value="">Todos</option>
          {files.map(file => (
            <option key={file} value={file}>{file}</option>
          ))}
        </select>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Text</th>
              <th>Number</th>
              <th>Hex</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center">Cargando...</td></tr>
            ) : (
              tableData && tableData.length > 0 ? (
                tableData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.fileName}</td>
                    <td>{row.text}</td>
                    <td>{row.number}</td>
                    <td>{row.hex}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center">Sin datos</td></tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home; 