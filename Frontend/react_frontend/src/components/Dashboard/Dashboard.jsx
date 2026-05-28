import { useState, useEffect } from 'react'
import { getActuators } from '../../utils/api'
import Locks from "./Lockers/Locks"
import Lights from "./Lights/Lights"
import RGBLights from "./RGBLights/RGBLights"
import Weather from "./Weather/Weather"
import Sensor from "./Weather/Sensor"

const Dashboard = () => {
    const [actuators, setActuators] = useState([]);

    useEffect(() => {
        const load = () => getActuators().then(setActuators).catch(console.error);
        load();
        const interval = setInterval(load, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-2 gap-4 m-8 mx-24">
            <Locks actuators={actuators} />
            <Lights actuators={actuators} />
            <RGBLights actuators={actuators} />
            <Weather />
            <Sensor />
        </div>
    )
}

export default Dashboard
