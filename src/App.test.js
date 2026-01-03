import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import App from './App';

// Mock axios
jest.mock('axios');

const mockWeatherData = {
  name: 'London',
  weather: [{ description: 'clear sky' }],
  main: { temp: 20, humidity: 80 },
  wind: { speed: 5 },
};

describe('App', () => {
  test('renders the weather app title', () => {
    render(<App />);
    expect(screen.getByText(/Weather App/i)).toBeInTheDocument();
  });

  test('fetches and displays weather data', async () => {
    // Mock the axios.get implementation for this test
    axios.get.mockResolvedValue({ data: mockWeatherData });

    render(<App />);

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText(/Enter city name/i), {
      target: { value: 'London' },
    });

    // Simulate button click
    fireEvent.click(screen.getByText(/Get Weather/i));

    // Wait for the weather data to be displayed
    await waitFor(() => {
      expect(screen.getByText(/London/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
    expect(screen.getByText(/Temperature: 20°C/i)).toBeInTheDocument();
    expect(screen.getByText(/Humidity: 80%/i)).toBeInTheDocument();
    expect(screen.getByText(/Wind Speed: 5 m\/s/i)).toBeInTheDocument();
  });

  test('shows an error message when the input is empty', async () => {
    render(<App />);

    // Click the button without entering a location
    fireEvent.click(screen.getByText(/Get Weather/i));

    // Check for the error message
    expect(await screen.findByText(/Please enter a location./i)).toBeInTheDocument();
  });

  test('shows an error message when the API call fails', async () => {
    // Mock the axios.get implementation to simulate an error
    axios.get.mockRejectedValue(new Error('API Error'));

    render(<App />);

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText(/Enter city name/i), {
      target: { value: 'InvalidCity' },
    });

    // Simulate button click
    fireEvent.click(screen.getByText(/Get Weather/i));

    // Check for the error message
    expect(await screen.findByText(/Could not fetch weather data/i)).toBeInTheDocument();
  });
});
