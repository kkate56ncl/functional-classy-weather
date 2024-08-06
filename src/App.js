import React, { useCallback, useEffect, useState } from 'react';
import Weather from './components/Weather';
import Input from './components/Input';

import { convertToFlag } from './utility';

function App() {
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayLocation, setDisplayLocation] = useState('');
  const [weather, setWeather] = useState({});

  const fetchWeather = useCallback(async () => {
    if (location.length < 2) return setWeather({});
    try {
      setIsLoading(true);

      // 1) Getting location (geocoding)
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}`);
      const geoData = await geoRes.json();
      console.log(geoData);

      if (!geoData.results) throw new Error('Location not found');

      const { latitude, longitude, timezone, name, country_code } = geoData.results.at(0);
      setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      console.log(weatherData);
      setWeather(weatherData.daily);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [location]);

  useEffect(() => {
    setLocation(localStorage.getItem('location') || '');
  }, []);

  useEffect(() => {
    fetchWeather();
    localStorage.setItem('location', location);
  }, [location, fetchWeather]);

  function handleChangeLocation(e) {
    setLocation(e.target.value);
  }

  return (
    <div className="app">
      <h1>Classy Weather</h1>
      <Input location={location} onChangeLocation={handleChangeLocation} />
      {isLoading && <p className="loader">Loading...</p>}

      {weather.weathercode && <Weather weather={weather} location={displayLocation} />}
    </div>
  );
}

export default App;
