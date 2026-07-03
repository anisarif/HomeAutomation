import { useContext, useState } from "react";
import { Context } from "../../../store/appContext";

const MODES = ["cool", "heat", "dry", "fan", "auto"];
const FANS = ["auto", "low", "med", "high"];

// Protocol-based state controls. Only rendered when the unit's protocol is
// recognised by the ESP (so IRac can build the frame).
const ACControls = ({ unit }) => {
    const { actions } = useContext(Context);
    const [power, setPower] = useState(unit.power);
    const [mode, setMode] = useState(unit.mode || "cool");
    const [temp, setTemp] = useState(unit.temp || 22);
    const [fan, setFan] = useState(unit.fan || "auto");
    const [busy, setBusy] = useState(false);

    const push = async (next) => {
        const state = { power, mode, temp, fan, ...next };
        setBusy(true);
        try {
            await actions.sendACState(unit.id, state);
        } catch (e) {
            console.error("An error occurred:", e);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-medium">Power</span>
                <button
                    disabled={busy}
                    onClick={() => { const v = !power; setPower(v); push({ power: v }); }}
                    className={`w-16 py-1 text-white font-bold rounded-md ${power ? "bg-emerald-600" : "bg-red-600"}`}
                >{power ? "ON" : "OFF"}</button>
            </div>

            <div className="flex justify-between items-center mb-4">
                <span className="text-xl">Mode</span>
                <select
                    value={mode}
                    onChange={(e) => { setMode(e.target.value); push({ mode: e.target.value }); }}
                    className="rounded-md px-2 py-1 bg-white"
                >
                    {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            <div className="flex justify-between items-center mb-4">
                <span className="text-xl">Temp</span>
                <div className="flex items-center gap-3">
                    <button
                        disabled={busy}
                        onClick={() => { const v = Math.max(16, temp - 1); setTemp(v); push({ temp: v }); }}
                        className="w-8 h-8 bg-slate-500 text-white font-bold rounded-md"
                    >-</button>
                    <span className="text-2xl w-14 text-center">{temp}°C</span>
                    <button
                        disabled={busy}
                        onClick={() => { const v = Math.min(30, temp + 1); setTemp(v); push({ temp: v }); }}
                        className="w-8 h-8 bg-slate-500 text-white font-bold rounded-md"
                    >+</button>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-xl">Fan</span>
                <select
                    value={fan}
                    onChange={(e) => { setFan(e.target.value); push({ fan: e.target.value }); }}
                    className="rounded-md px-2 py-1 bg-white"
                >
                    {FANS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>
        </div>
    );
};

export default ACControls;
