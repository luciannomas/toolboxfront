import { renderHook, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useFiles } from '../hooks/useFiles';

// Mock de axios
jest.mock('axios');
const mockedAxios = axios;

describe('useFiles Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock de console.log para evitar ruido en los tests
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
        console.error.mockRestore();
    });

    test('inicializa con valores por defecto', () => {
        // Mock para que falle la petición inicial
        mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() => useFiles());

        expect(result.current.files).toEqual([]);
        expect(result.current.selectedFile).toBe('');
        expect(result.current.fileData).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(typeof result.current.handleFileChange).toBe('function');
    });

    test('obtiene lista de archivos al inicializar', async () => {
        const mockFiles = ['test1.csv', 'test2.csv'];
        const mockFileData = [
            {
                file: 'test1.csv',
                lines: [
                    { text: 'abc', number: 123, hex: '0x123' }
                ]
            }
        ];

        mockedAxios.get
            .mockResolvedValueOnce({ data: mockFiles }) // Para fetchFiles
            .mockResolvedValueOnce({ data: mockFileData }); // Para fetchAllFilesData

        const { result } = renderHook(() => useFiles());

        await waitFor(() => {
            expect(result.current.files).toEqual(mockFiles);
        });

        expect(mockedAxios.get).toHaveBeenCalledWith(
            'https://toolboxback-production.up.railway.app/files/list',
            { headers: { Authorization: 'Bearer aSuperSecretKey' } }
        );
    });

    test('maneja errores al obtener archivos', async () => {
        const errorMessage = 'Network error';
        mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

        const { result } = renderHook(() => useFiles());

        await waitFor(() => {
            expect(result.current.error).toBe(errorMessage);
        });

        expect(result.current.files).toEqual([]);
    });

    test('handleFileChange con archivo específico', async () => {
        const mockFiles = ['test1.csv', 'test2.csv'];
        const mockFileData = [
            {
                file: 'test1.csv',
                lines: [
                    { text: 'abc', number: 123, hex: '0x123' }
                ]
            }
        ];

        mockedAxios.get
            .mockResolvedValueOnce({ data: mockFiles }) // fetchFiles inicial
            .mockResolvedValueOnce({ data: mockFileData }) // fetchAllFilesData inicial
            .mockResolvedValueOnce({ data: mockFileData }); // fetchFileData específico

        const { result } = renderHook(() => useFiles());

        await waitFor(() => {
            expect(result.current.files).toEqual(mockFiles);
        });

        await act(async () => {
            result.current.handleFileChange('test1.csv');
        });

        await waitFor(() => {
            expect(result.current.selectedFile).toBe('test1.csv');
        });

        expect(mockedAxios.get).toHaveBeenCalledWith(
            'https://toolboxback-production.up.railway.app/files/data?fileName=test1.csv',
            { headers: { Authorization: 'Bearer aSuperSecretKey' } }
        );
    });

    test('handleFileChange con valor vacío (todos los archivos)', async () => {
        const mockFiles = ['test1.csv', 'test2.csv'];
        const mockFileData = [
            {
                file: 'test1.csv',
                lines: [
                    { text: 'abc', number: 123, hex: '0x123' }
                ]
            }
        ];

        mockedAxios.get
            .mockResolvedValueOnce({ data: mockFiles }) // fetchFiles inicial
            .mockResolvedValueOnce({ data: mockFileData }) // fetchAllFilesData inicial
            .mockResolvedValueOnce({ data: mockFileData }) // fetchAllFilesData cuando se selecciona ""
            .mockResolvedValueOnce({ data: mockFileData });

        const { result } = renderHook(() => useFiles());

        await waitFor(() => {
            expect(result.current.files).toEqual(mockFiles);
        });

        await act(async () => {
            result.current.handleFileChange('');
        });

        await waitFor(() => {
            expect(result.current.selectedFile).toBe('');
        });
    });

    test('procesa datos de archivo correctamente', async () => {
        const mockFiles = ['test1.csv'];
        const mockFileData = [
            {
                file: 'test1.csv',
                lines: [
                    { text: 'abc', number: 123, hex: '0x123' },
                    { text: 'xyz', number: 456, hex: '0x456' }
                ]
            }
        ];

        const expectedProcessedData = [
            { fileName: 'test1.csv', text: 'abc', number: 123, hex: '0x123' },
            { fileName: 'test1.csv', text: 'xyz', number: 456, hex: '0x456' }
        ];

        mockedAxios.get
            .mockResolvedValueOnce({ data: mockFiles })
            .mockResolvedValueOnce({ data: mockFileData });

        const { result } = renderHook(() => useFiles());

        await waitFor(() => {
            expect(result.current.fileData).toEqual(expectedProcessedData);
        });
    });

    test('maneja estados de loading correctamente', async () => {
        const mockFiles = ['test1.csv'];
        let resolvePromise;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        mockedAxios.get
            .mockResolvedValueOnce({ data: mockFiles }) // fetchFiles
            .mockReturnValueOnce(promise); // fetchAllFilesData (pendiente)

        const { result } = renderHook(() => useFiles());

        // Esperar a que se complete fetchFiles
        await waitFor(() => {
            expect(result.current.files).toEqual(mockFiles);
        });

        // Verificar que loading es true durante fetchAllFilesData
        expect(result.current.loading).toBe(true);

        // Resolver la promesa
        await act(async () => {
            resolvePromise({ data: [] });
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
    });

    test('maneja errores en fetchFileData', async () => {
        const mockFiles = ['test1.csv'];
        mockedAxios.get
            .mockResolvedValueOnce({ data: mockFiles }) // fetchFiles inicial
            .mockResolvedValueOnce({ data: [] }) // fetchAllFilesData inicial
            .mockRejectedValueOnce(new Error('File error')); // fetchFileData error

        const { result } = renderHook(() => useFiles());

        await waitFor(() => {
            expect(result.current.files).toEqual(mockFiles);
        });

        await act(async () => {
            result.current.handleFileChange('test1.csv');
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.fileData).toEqual([]);
        });
    });
}); 