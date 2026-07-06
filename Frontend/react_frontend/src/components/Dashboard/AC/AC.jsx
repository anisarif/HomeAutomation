import { useState, useEffect, useCallback } from "react";
import { Snowflake } from "lucide-react";
import { getACUnits, getACCommands } from "../../../utils/api";
import Card from "../../ui/Card";
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
            <h3 className="mb-4 text-base font-semibold text-foreground">{unit.name}</h3>

            {hasProtocol(unit) && <ACControls unit={unit} />}

            {commands.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
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

const AC = ({ index = 0 }) => {
    const [units, setUnits] = useState([]);

    useEffect(() => {
        getACUnits()
            .then((acs) => setUnits(Array.isArray(acs) ? acs : []))
            .catch(console.error);
    }, []);

    if (units.length === 0) return null;

    return (
        <Card title="Air Conditioning" icon={Snowflake} index={index}>
            {units.map((unit) => (
                <ACUnitCard key={unit.id} unit={unit} />
            ))}
        </Card>
    );
};

export default AC;
