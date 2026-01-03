import React from 'react';

const Weather = ({ data }) => {
  return (
    <div className="weather-container">
      {data && (
        <>
          <h2>{data.name}</h2>
          <p>{data.weather[0].description}</p>
          <p>Temperature: {data.main.temp}°C</p>
          <p>Humidity: {data.main.humidity}%</p>
          <p>Wind Speed: {data.wind.speed} m/s</p>
        </>
      )}
    </div>
  );
};

export default Weather;
