import React, { useEffect, useState, useContext } from 'react';
import { Context } from "../../../store/appContext";
import thermometer from "../../../images/thermometer.png";
import humidityimg from "../../../images/humidity.svg";


const Sensor = () => {
  const [roomWeather, setRoomWeather] = useState([])
  const [temperature, setTemperature] = useState('')
  const [humidity, setHumidity] = useState('')
  const { actions } = useContext(Context)

  useEffect(() => {
    const fetchData = async () => {
      const current = await actions.getRoomSensor();
      setRoomWeather(current);
    };
    fetchData().catch(console.error);
  }, [actions]);

  useEffect(() => {
    if (roomWeather) {
      setTemperature(roomWeather.temp);
      setHumidity(roomWeather.hum);
    }
  }, [roomWeather]);

  return (
    <div className="p-4 bg-slate-200 rounded-md">
      <h1 className=" text-slate-700 font-medium text-center text-3xl mb-8">Room</h1>
      <div className='grid grid-cols-2 gap-4'>
        <h1 className=' font-medium text-6xl m-4 mb-8 col-span-2'>Living Room</h1>
        <div className='flex'>
          <img className="h-20 w-20" src={thermometer} alt="thermometer" /><h1 className='text-6xl text-center align-text-center'>{temperature}°C</h1>
        </div>
        <div className='flex'>
          <img className="h-20 w-20" src={humidityimg} alt="humidity" /><h1 className='text-6xl text-center align-text-center'>{humidity} %</h1>
        </div>
      </div>
    </div>
  );
}

export default Sensor;