import React, { useEffect, useState, useContext } from 'react';
import { Context } from "../../../store/appContext";
import { CloudSun, Thermometer, Wind } from "lucide-react";
import Card from "../../ui/Card";

const Weather = ({ index = 0 }) => {
  const [currentWeather, setCurrentWeather] = useState([]);
  const [temperature, setTemperature] = useState('');
  const [windspeed, setWindspeed] = useState('');
  const { actions } = useContext(Context);

  useEffect(() => {
    actions.getCurrentWeather().then(setCurrentWeather).catch(console.error);
  }, [actions]);

  useEffect(() => {
    if (currentWeather.current_weather) {
      setTemperature(currentWeather.current_weather.temperature);
      setWindspeed(currentWeather.current_weather.windspeed);
    }
  }, [currentWeather]);

  if (!currentWeather || !currentWeather.current_weather) return null;

  return (
    <Card title="External Weather" icon={CloudSun} index={index}>
      <p className="mb-5 text-3xl font-bold tracking-tight text-foreground">Tunis</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-inset flex items-center gap-3 p-4">
          <Thermometer size={26} className="text-accent" aria-hidden="true" />
          <div>
            <div className="text-2xl font-semibold tabular-nums">{temperature}°</div>
            <div className="text-xs text-muted">Temp</div>
          </div>
        </div>
        <div className="glass-inset flex items-center gap-3 p-4">
          <Wind size={26} className="text-sky-400" aria-hidden="true" />
          <div>
            <div className="text-2xl font-semibold tabular-nums">{windspeed}</div>
            <div className="text-xs text-muted">km/h</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Weather;
