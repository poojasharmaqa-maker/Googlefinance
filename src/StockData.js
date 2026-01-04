import React from 'react';
import './StockData.css';

const StockData = ({ data }) => {
  return (
    <div className="stock-data-container">
      <table>
        <thead>
          <tr>
            <th>Stock Ticker</th>
            <th>Price per Share</th>
            <th>Diluted EPS</th>
            <th>P/E Ratio</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((stock) => (
            <tr key={stock.ticker}>
              <td>{stock.ticker}</td>
              <td>{stock.price}</td>
              <td>{stock.eps}</td>
              <td>{stock.peRatio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockData;
