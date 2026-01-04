import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import StockData from './StockData';
import { calculatePERatio } from './StockUtils';

function App() {
  const [tickers, setTickers] = useState('');
  const [year, setYear] = useState('');
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState('');

  const apiKey = process.env.REACT_APP_FINANCIAL_MODELING_PREP_API_KEY;

  const calculateAveragePrice = (historicalData) => {
    if (!historicalData || historicalData.length === 0) {
      return 0;
    }
    const total = historicalData.reduce((sum, item) => sum + item.close, 0);
    return total / historicalData.length;
  };

  const fetchStockData = async () => {
    if (!tickers || !year) {
      setError('Please enter stock tickers and a fiscal year.');
      return;
    }
    if (process.env.NODE_ENV === 'production' && (!apiKey || apiKey === 'YOUR_API_KEY_HERE')) {
      setError('Please add your Financial Modeling Prep API key to the .env file.');
      return;
    }

    setError('');
    setStockData([]);

    const tickerList = tickers.split(',').map((t) => t.trim());

    try {
      const dataPromises = tickerList.map(async (ticker) => {
        // Fetch Diluted EPS
        const epsResponse = await axios.get(
          `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?period=annual&apikey=${apiKey}`
        );
        const annualReports = epsResponse.data;
        const reportForYear = annualReports.find((report) => report.calendarYear === year);
        const eps = reportForYear ? reportForYear.epsdiluted : null;

        // Fetch Historical Stock Price
        const priceResponse = await axios.get(
          `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?from=${year}-11-01&to=${year}-11-30&apikey=${apiKey}`
        );
        const averagePrice = calculateAveragePrice(priceResponse.data.historical);

        const peRatio = calculatePERatio(averagePrice, eps);

        return {
          ticker,
          price: averagePrice.toFixed(2),
          eps: eps ? eps.toFixed(2) : 'N/A',
          peRatio,
        };
      });

      const results = await Promise.all(dataPromises);
      setStockData(results);
    } catch (err) {
      setError('Could not fetch stock data. Please check the tickers and year and try again.');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Stock P/E Ratio Calculator</h1>
        <div className="input-container">
          <input
            type="text"
            value={tickers}
            onChange={(e) => setTickers(e.target.value)}
            placeholder="Enter stock tickers (comma-separated)"
          />
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter fiscal year"
          />
          <button onClick={fetchStockData}>Get P/E Ratios</button>
        </div>
        {error && <p className="error">{error}</p>}
      </header>
      <StockData data={stockData} />
    </div>
  );
}

export default App;
