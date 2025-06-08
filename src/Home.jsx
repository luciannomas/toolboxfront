import React from 'react';
import { useFiles } from './hooks/useFiles';

function Home() {
    const {
        files,
        selectedFile,
        fileData: tableData,
        loading,
        error,
        handleFileChange
    } = useFiles();

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
                        handleFileChange(value);
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