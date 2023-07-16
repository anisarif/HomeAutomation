import React, {useEffect, useState, useContext} from 'react';
import { Context } from "../../../store/appContext";

const Sensor = () => {
    const [roomWeather, setRoomWeather] = useState([])
    const [temperature, setTemperature] = useState('')
    const [humidity, setHumidity ] = useState('')
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
        <>
         <h1 >External Weather</h1>
         <div >   
            <h1>Temperature : {temperature}° C</h1>
            <h1>Humidity : {humidity} %</h1>
        </div>
        </>
    );
}

export default Sensor;