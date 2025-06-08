import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, AUTH_TOKEN, API_ENDPOINTS } from '../utils/config';

export const useFiles = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [fileData, setFileData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFiles = async () => {
        try {
            console.log('Intentando obtener lista de archivos...');
            const response = await axios.get(`${API_URL}${API_ENDPOINTS.LIST_FILES}`, {
                headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
            });
            console.log('Respuesta completa:', response);
            console.log('Archivos recibidos:', response.data);
            const fileList = Array.isArray(response.data) ? response.data : response.data.files || [];
            setFiles(fileList);
            setError(null);
            
            // Si hay archivos, cargar la data de todos por defecto
            if (fileList.length > 0) {
                setSelectedFile('');
                fetchAllFilesData(fileList);
            }
        } catch (err) {
            console.error('Error al obtener archivos:', err);
            setError(err.message);
        }
    };

    const fetchAllFilesData = async (fileList) => {
        setLoading(true);
        setError(null);
        try {
            const allData = [];
            for (const file of fileList) {
                try {
                    console.log(`Obteniendo datos para archivo: ${file}`);
                    const res = await axios.get(`${API_URL}${API_ENDPOINTS.GET_FILE_DATA}?fileName=${file}`, {
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
            setFileData(allData);
        } finally {
            setLoading(false);
        }
    };

    const fetchFileData = async (fileName) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}${API_ENDPOINTS.GET_FILE_DATA}?fileName=${fileName}`, {
                headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
            });
            console.log('Data recibida para', fileName, response.data);
            let rows = [];
            if (Array.isArray(response.data)) {
                response.data.forEach(fileObj => {
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
            setFileData(rows);
            setLoading(false);
        } catch (err) {
            console.error('Error al obtener data:', err);
            setFileData([]);
            setLoading(false);
        }
    };

    const handleFileChange = (fileName) => {
        setSelectedFile(fileName);
        if (fileName === '') {
            fetchAllFilesData(files);
        } else {
            fetchFileData(fileName);
        }
    };

    // Si cambia la lista de archivos y el seleccionado ya no existe, actualizarlo
    useEffect(() => {
        if (files.length > 0 && selectedFile && !files.includes(selectedFile)) {
            setSelectedFile('');
            fetchAllFilesData(files);
        }
    }, [files, selectedFile]);

    useEffect(() => {
        fetchFiles();
    }, []);

    return {
        files,
        selectedFile,
        fileData,
        loading,
        error,
        handleFileChange
    };
}; 