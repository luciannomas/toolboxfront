import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock del hook useFiles para evitar llamadas a la API en los tests
jest.mock('../hooks/useFiles', () => ({
  useFiles: () => ({
    files: [],
    selectedFile: '',
    fileData: [],
    loading: false,
    error: null,
    handleFileChange: jest.fn()
  })
}));

describe('App Component', () => {
  test('renderiza el componente App correctamente', () => {
    render(<App />);
    
    // Verificar que el componente se renderiza sin errores
    expect(document.body).toBeInTheDocument();
  });

  test('renderiza el título principal', () => {
    render(<App />);
    const titleElement = screen.getByText('React Test App');
    expect(titleElement).toBeInTheDocument();
  });

  test('renderiza el componente Home', () => {
    render(<App />);
    
    // Verificar que el componente Home está presente
    expect(screen.getByText('Selecciona un archivo:')).toBeInTheDocument();
  });

  test('renderiza la estructura Bootstrap correctamente', () => {
    render(<App />);
    
    // Verificar que hay un container de Bootstrap
    const container = document.querySelector('.container');
    expect(container).toBeInTheDocument();
  });
}); 