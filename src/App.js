import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Weather from './Weather';

function App() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchWeather = async () => {
    if (!location) {
      setError('Please enter a location.');
      return;
    }
    setError('');
    setWeatherData(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
    } catch (err) {
      setError('Could not fetch weather data. Please check the location and try again.');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
        <div className="input-container">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city name"
          />
          <button onClick={fetchWeather}>Get Weather</button>
        </div>
        {error && <p className="error">{error}</p>}
        <Weather data={weatherData} />
      </header>
    </div>
  );
}

export default App;
