import { useState, useEffect, useCallback } from "react";
import { getACUnits, getACCommands } from "../../../utils/api";
import ACControls from "./ACControls";
import CommandButton from "./CommandButton";
import LearnFlow from "./LearnFlow";

// A recognised protocol (not empty / not "UNKNOWN") means IRac can build
// full state frames, so we show the power/mode/temp/fan controls.
const hasProtocol = (unit) =>
    unit.protocol && unit.protocol.toUpperCase() !== "UNKNOWN";

const ACUnitCard = ({ unit }) => {
    const [commands, setCommands] = useState([]);

    const loadCommands = useCallback(async () => {
        const cmds = await getACCommands(unit.id);
        setCommands(Array.isArray(cmds) ? cmds : []);
    }, [unit.id]);

    useEffect(() => { loadCommands(); }, [loadCommands]);

    return (
        <div className="mb-6 last:mb-0">
            <h2 className="text-2xl font-semibold mb-4">{unit.name}</h2>

            {hasProtocol(unit) && <ACControls unit={unit} />}

            {commands.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {commands.map((cmd) => (
                        <CommandButton
                            key={cmd.id}
                            unitId={unit.id}
                            command={cmd}
                            onDeleted={loadCommands}
                        />
                    ))}
                </div>
            )}

            <LearnFlow unitId={unit.id} onSaved={loadCommands} />
        </div>
    );
};

const AC = () => {
    const [units, setUnits] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const acs = await getACUnits();
            setUnits(Array.isArray(acs) ? acs : []);
        };
        fetchData().catch(console.error);
    }, []);

    if (units.length === 0) return null;

    return (
        <div className="p-4 bg-slate-200 rounded-md">
            <h1 className="text-slate-700 font-medium text-center text-3xl mb-8">Air Conditioning</h1>
            {units.map((unit) => (
                <ACUnitCard key={unit.id} unit={unit} />
            ))}
        </div>
    );
};

export default AC;
