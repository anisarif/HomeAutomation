import Light from "./Light";
import { getActuators } from "../../../utils/api";
import { useState, useEffect } from 'react';

const Lights = () => {
    const [lights, setLights] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const actuators = await getActuators();
            setLights(actuators.filter(a => a.type === "Light"));
        };
        fetchData().catch(console.error);
    }, []);

    if (lights.length === 0) return null;

    return (
        <div className="p-4 bg-slate-200 rounded-md">
            <h1 className="text-slate-700 font-medium text-center text-3xl mb-8">Lights</h1>
            {lights.map((light) => (
                <div key={light.id}>
                    <Light name={light.name} id={light.id} state={light.state} />
                </div>
            ))}
        </div>
    );
};

export default Lights;
