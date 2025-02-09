import React from 'react';
import Day from './Day';

function Weather({ weather, location }) {
  const {
    temperature_2m_max: max,
    temperature_2m_min: min,
    time: dates,
    weathercode: codes,
  } = weather;
  return (
    <div>
      <h2>Weather in {location}</h2>
      <ul className="weather">
        {dates.map((date, i) => {
          return (
            <Day
              date={date}
              max={max.at(i)}
              min={min.at(i)}
              code={codes.at(i)}
              key={date}
              isToday={i === 0}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default Weather;
