import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';
import axios from 'axios';

jest.mock('axios');

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el título y el selector', async () => {
    axios.get.mockResolvedValueOnce({ data: ['test1.csv', 'test2.csv'] });
    axios.get.mockResolvedValueOnce({ data: [] }); // Para fetchAllFilesData
    render(<Home />);
    expect(await screen.findByText('React Test App')).toBeInTheDocument();
    expect(await screen.findByLabelText('Selecciona un archivo:')).toBeInTheDocument();
  });

  test('muestra la tabla con los headers correctos', async () => {
    axios.get.mockResolvedValueOnce({ data: ['test1.csv'] });
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<Home />);
    expect(await screen.findByText('File Name')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Number')).toBeInTheDocument();
    expect(screen.getByText('Hex')).toBeInTheDocument();
  });

  test('muestra "Sin datos" si no hay datos', async () => {
    axios.get.mockResolvedValueOnce({ data: ['test1.csv'] });
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<Home />);
    expect(await screen.findByText('Sin datos')).toBeInTheDocument();
  });

  test('muestra "Cargando..." cuando está en loading', async () => {
    axios.get.mockResolvedValueOnce({ data: ['test1.csv'] });
    // Simular loading: la segunda petición nunca se resuelve
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    render(<Home />);
    expect(await screen.findByText('Cargando...')).toBeInTheDocument();
  });

  test('muestra los datos correctamente cuando llegan del backend', async () => {
    axios.get.mockResolvedValueOnce({ data: ['test1.csv'] });
    axios.get.mockResolvedValueOnce({
      data: [
        {
          file: 'test1.csv',
          lines: [
            { text: 'abc', number: 1, hex: '123' },
            { text: 'def', number: 2, hex: '456' }
          ]
        }
      ]
    });
    render(<Home />);
    // Verifica que al menos una celda de la tabla tenga 'test1.csv'
    const fileCells = await screen.findAllByText('test1.csv');
    expect(fileCells.length).toBeGreaterThan(0);
    expect(screen.getByText('abc')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('def')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
  });

  test('maneja errores de la API correctamente', async () => {
    const errorMessage = 'Error al obtener archivos';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));
    render(<Home />);
    expect(await screen.findByText('Sin datos')).toBeInTheDocument();
  });

  test('cambia de archivo correctamente', async () => {
    // Primera llamada para obtener la lista de archivos
    axios.get.mockResolvedValueOnce({ data: ['test1.csv', 'test2.csv'] });
    // Segunda llamada para obtener datos de todos los archivos
    axios.get.mockResolvedValueOnce({ data: [] });
    // Tercera llamada cuando se selecciona un archivo específico
    axios.get.mockResolvedValueOnce({
      data: [
        {
          file: 'test2.csv',
          lines: [
            { text: 'xyz', number: 3, hex: '789' }
          ]
        }
      ]
    });
    // Mock adicional para la llamada cuando se selecciona test2.csv
    axios.get.mockResolvedValueOnce({
      data: [
        {
          file: 'test2.csv',
          lines: [
            { text: 'xyz', number: 3, hex: '789' }
          ]
        }
      ]
    });

    render(<Home />);
    
    // Esperar a que se cargue el selector
    const select = await screen.findByLabelText('Selecciona un archivo:');
    
    // Seleccionar test2.csv
    fireEvent.change(select, { target: { value: 'test2.csv' } });
    
    // Esperar a que se actualice la tabla con los nuevos datos
    await waitFor(() => {
      expect(screen.getByText('xyz')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('789')).toBeInTheDocument();
    });
  });
}); 