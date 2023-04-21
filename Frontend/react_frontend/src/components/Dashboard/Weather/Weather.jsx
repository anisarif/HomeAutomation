import React, {useEffect, useState, useContext} from 'react';
import { Context } from "../../../store/appContext";

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
        <>
         <h1 >External Weather</h1>
         <div >   
            <h1>Temperature : {temperature}° C</h1>
            <h1>Windspeed : {windspeed} Km/h</h1>
        </div>
        </>
    );
}

export default Weather;