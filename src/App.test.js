import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza el título principal', () => {
  render(<App />);
  const titleElement = screen.getByText('React Test App');
  expect(titleElement).toBeInTheDocument();
});
