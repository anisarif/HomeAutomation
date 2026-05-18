import Lock from "./Lock";
import { getActuators } from "../../../utils/api";
import { useState, useEffect } from 'react';

const Locks = () => {
    const [locks, setLocks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const actuators = await getActuators();
            setLocks(actuators.filter(a => a.type === "Lock"));
        };
        fetchData().catch(console.error);
    }, []);

    if (locks.length === 0) return null;

    return (
        <div className="p-4 bg-slate-200 rounded-md">
            <h1 className="text-slate-700 font-medium text-center text-3xl mb-8">Lockers</h1>
            {locks.map((lock) => (
                <div key={lock.id}>
                    <Lock name={lock.name} id={lock.id} state={lock.state} />
                </div>
            ))}
        </div>
    );
};

export default Locks;
