import React, { useEffect, useState, useContext } from 'react';
import { Context } from "../../../store/appContext";
import thermometer from "../../../images/thermometer.png";
import wind from "../../../images/wind.svg";
const Weather = () => {

  const [currentWeather, setCurrentWeather] = useState([])
  const [temperature, setTemperature] = useState('')
  const [windspeed, setWindspeed] = useState('')
  const { actions } = useContext(Context)

  useEffect(() => {
    const fetchData = async () => {
      const current = await actions.getCurrentWeather();
      setCurrentWeather(current);
    };
    fetchData().catch(console.error);
  }, [actions]);

  useEffect(() => {
    if (currentWeather.current_weather) {
      setTemperature(currentWeather.current_weather.temperature);
      setWindspeed(currentWeather.current_weather.windspeed);
    }
  }, [currentWeather]);

  return (
    <div className="p-4 bg-slate-200 rounded-md">
      <h1 className=" text-slate-700 font-medium text-center text-3xl mb-8">External Weather</h1>
      <div className='grid grid-cols-2 gap-4'>
        
        <h1 className=' font-bold text-8xl m-4 mb-5'>Tunis</h1>
        <div></div>
        <div className='flex'>
          <img className="h-20 w-20" src={thermometer} alt="thermometer"/><h1 className='text-5xl text-center align-text-center'>{temperature}°C</h1>
        </div>
        <div className='flex'>
        <img className="h-20 w-20" src={wind} alt="wind"/><h1 className='text-5xl text-center align-text-center'> {windspeed} Km/h</h1>
        </div>
      </div>
    </div>
  );
}

export default Weather;