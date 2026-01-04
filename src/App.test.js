import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import App from './App';

// Mock axios
jest.mock('axios');

beforeEach(() => {
  process.env.REACT_APP_FINANCIAL_MODELING_PREP_API_KEY = 'test-api-key';
});

const mockStockData = {
  "ticker": "PIPR",
  "price": "150.00",
  "eps": "10.00",
  "peRatio": "15.00",
};

describe('App', () => {
  test('renders the stock P/E ratio calculator title', () => {
    render(<App />);
    expect(screen.getByText(/Stock P\/E Ratio Calculator/i)).toBeInTheDocument();
  });

  test('fetches and displays stock data', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('income-statement')) {
        return Promise.resolve({
          data: [{ "calendarYear": "2024", "epsdiluted": 10.00 }]
        });
      }
      if (url.includes('historical-price-full')) {
        return Promise.resolve({
          data: { "historical": [{ "close": 150.00 }] }
        });
      }
      return Promise.reject(new Error('not found'));
    });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText(/Enter stock tickers/i), {
      target: { value: 'PIPR' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter fiscal year/i), {
      target: { value: '2024' },
    });

    fireEvent.click(screen.getByText(/Get P\/E Ratios/i));

    await waitFor(() => {
      expect(screen.getByText(/PIPR/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/150.00/i)).toBeInTheDocument();
    expect(screen.getByText(/10.00/i)).toBeInTheDocument();
    expect(screen.getByText(/15.00/i)).toBeInTheDocument();
  });

  test('shows an error message when the input is empty', async () => {
    render(<App />);

    fireEvent.click(screen.getByText(/Get P\/E Ratios/i));

    expect(await screen.findByText(/Please enter stock tickers and a fiscal year./i)).toBeInTheDocument();
  });

  test('shows an error message when the API call fails', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText(/Enter stock tickers/i), {
      target: { value: 'FAIL' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter fiscal year/i), {
      target: { value: '2024' },
    });

    fireEvent.click(screen.getByText(/Get P\/E Ratios/i));

    expect(await screen.findByText(/Could not fetch stock data/i)).toBeInTheDocument();
  });

  test('handles zero EPS correctly', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('income-statement')) {
        return Promise.resolve({
          data: [{ "calendarYear": "2024", "epsdiluted": 0 }]
        });
      }
      if (url.includes('historical-price-full')) {
        return Promise.resolve({
          data: { "historical": [{ "close": 150.00 }] }
        });
      }
      return Promise.reject(new Error('not found'));
    });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText(/Enter stock tickers/i), {
      target: { value: 'ZERO' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter fiscal year/i), {
      target: { value: '2024' },
    });

    fireEvent.click(screen.getByText(/Get P\/E Ratios/i));

    await waitFor(() => {
      expect(screen.getByText(/ZERO/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText(/N\/A/i).length).toBe(2);
  });
});
