import { useState, useEffect, useRef, useCallback } from 'react'
import { getActuators } from '../../utils/api'
import { useMqtt } from '../../hooks/useMqtt'
import Locks from "./Lockers/Locks"
import Lights from "./Lights/Lights"
import RGBLights from "./RGBLights/RGBLights"
import Weather from "./Weather/Weather"
import Sensor from "./Weather/Sensor"
import AC from "./AC/AC"

const Dashboard = () => {
    const [actuators, setActuators] = useState([]);
    const debounceRef = useRef(null);

    const load = useCallback(
        () => getActuators().then(setActuators).catch(console.error),
        []
    );

    // Initial fetch + slow safety poll (real-time is the primary path below).
    useEffect(() => {
        load();
        const interval = setInterval(load, 30000);
        return () => clearInterval(interval);
    }, [load]);

    // Real-time: any MQTT message on a numeric actuator-id topic means a device
    // changed state (from this or ANY other client) — debounce-refetch the
    // authoritative state so every browser updates near-instantly.
    useMqtt((topic) => {
        if (!/^\d+$/.test(topic)) return; // ignore t/h, ac/*, etc.
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(load, 300);
    });
    useEffect(() => () => debounceRef.current && clearTimeout(debounceRef.current), []);

    const cards = [
        <Locks key="locks" actuators={actuators} index={0} />,
        <Lights key="lights" actuators={actuators} index={1} />,
        <RGBLights key="rgb" actuators={actuators} index={2} />,
        <Weather key="weather" index={3} />,
        <Sensor key="sensor" index={4} />,
        <AC key="ac" index={5} />,
    ];

    return (
        <main className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-8 md:grid-cols-2 md:px-8 xl:grid-cols-3 lg:px-12">
            {cards}
        </main>
    )
}

export default Dashboard
