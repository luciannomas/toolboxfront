import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Home from '../Home';
import { useFiles } from '../hooks/useFiles';

// Mock del hook useFiles
jest.mock('../hooks/useFiles');

describe('Home Component', () => {
    const mockFiles = ['test1.csv', 'test2.csv'];
    const mockFileData = [
        { fileName: 'test1.csv', text: 'abc', number: 123, hex: '0x123' },
        { fileName: 'test1.csv', text: 'xyz', number: 456, hex: '0x456' }
    ];

    beforeEach(() => {
        useFiles.mockReturnValue({
            files: mockFiles,
            selectedFile: '',
            fileData: mockFileData,
            loading: false,
            error: null,
            handleFileChange: jest.fn()
        });
    });

    test('renderiza el título correctamente', () => {
        render(<Home />);
        expect(screen.getByText('React Test App')).toBeInTheDocument();
    });

    test('muestra la etiqueta y select de archivos', () => {
        render(<Home />);
        expect(screen.getByText('Selecciona un archivo:')).toBeInTheDocument();
        
        const select = screen.getByRole('combobox');
        expect(select).toHaveValue('');
        
        // Verificar que tiene la opción "Todos"
        expect(screen.getByRole('option', { name: 'Todos' })).toBeInTheDocument();
    });

    test('muestra los encabezados de la tabla correctamente', () => {
        render(<Home />);
        
        expect(screen.getByText('File Name')).toBeInTheDocument();
        expect(screen.getByText('Text')).toBeInTheDocument();
        expect(screen.getByText('Number')).toBeInTheDocument();
        expect(screen.getByText('Hex')).toBeInTheDocument();
    });

    test('muestra los datos en la tabla', () => {
        render(<Home />);
        
        // Buscar en la tabla específicamente
        const table = screen.getByRole('table');
        expect(table).toHaveTextContent('abc');
        expect(table).toHaveTextContent('123');
        expect(table).toHaveTextContent('0x123');
        expect(table).toHaveTextContent('xyz');
        expect(table).toHaveTextContent('456');
        expect(table).toHaveTextContent('0x456');
    });

    test('maneja el cambio de archivo seleccionado', () => {
        const mockHandleFileChange = jest.fn();
        useFiles.mockReturnValue({
            files: mockFiles,
            selectedFile: '',
            fileData: mockFileData,
            loading: false,
            error: null,
            handleFileChange: mockHandleFileChange
        });

        render(<Home />);
        const select = screen.getByRole('combobox');
        
        fireEvent.change(select, { target: { value: 'test1.csv' } });
        
        expect(mockHandleFileChange).toHaveBeenCalledWith('test1.csv');
    });

    test('muestra mensaje de carga cuando está cargando', () => {
        useFiles.mockReturnValue({
            files: [],
            selectedFile: '',
            fileData: [],
            loading: true,
            error: null,
            handleFileChange: jest.fn()
        });

        render(<Home />);
        expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    test('muestra mensaje sin datos cuando no hay datos', () => {
        useFiles.mockReturnValue({
            files: mockFiles,
            selectedFile: '',
            fileData: [],
            loading: false,
            error: null,
            handleFileChange: jest.fn()
        });

        render(<Home />);
        expect(screen.getByText('Sin datos')).toBeInTheDocument();
    });
}); 