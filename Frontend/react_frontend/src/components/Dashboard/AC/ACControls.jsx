import { useContext, useState } from "react";
import { Power, Minus, Plus } from "lucide-react";
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

    const selectCls =
        "rounded-lg border border-border bg-surface2 px-2 py-1.5 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50";

    return (
        <div className="mb-5 flex flex-col gap-4 glass-inset p-4">
            <div className="flex items-center justify-between">
                <span className="text-lg font-semibold tabular-nums">{temp}°C</span>
                <button
                    type="button"
                    disabled={busy}
                    onClick={() => { const v = !power; setPower(v); push({ power: v }); }}
                    aria-pressed={power}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold text-white transition-all active:scale-95 ${power ? "bg-accent shadow-glow-accent" : "bg-danger/90"}`}
                >
                    <Power size={15} aria-hidden="true" />
                    {power ? "ON" : "OFF"}
                </button>
            </div>

            <div className="flex items-center gap-3">
                <span className="w-12 shrink-0 text-sm text-muted">Temp</span>
                <button type="button" disabled={busy}
                    onClick={() => { const v = Math.max(16, temp - 1); setTemp(v); push({ temp: v }); }}
                    className="grid h-9 w-9 place-items-center rounded-lg bg-surface2 text-foreground transition-colors hover:bg-border active:scale-95">
                    <Minus size={16} />
                </button>
                <input
                    type="range" min="16" max="30" value={temp}
                    onChange={(e) => setTemp(Number(e.target.value))}
                    onMouseUp={(e) => push({ temp: Number(e.target.value) })}
                    onTouchEnd={(e) => push({ temp: Number(e.target.value) })}
                    className="h-1.5 flex-1 cursor-pointer accent-accent"
                />
                <button type="button" disabled={busy}
                    onClick={() => { const v = Math.min(30, temp + 1); setTemp(v); push({ temp: v }); }}
                    className="grid h-9 w-9 place-items-center rounded-lg bg-surface2 text-foreground transition-colors hover:bg-border active:scale-95">
                    <Plus size={16} />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <label className="flex flex-1 items-center justify-between gap-2">
                    <span className="text-sm text-muted">Mode</span>
                    <select value={mode} className={selectCls}
                        onChange={(e) => { setMode(e.target.value); push({ mode: e.target.value }); }}>
                        {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </label>
                <label className="flex flex-1 items-center justify-between gap-2">
                    <span className="text-sm text-muted">Fan</span>
                    <select value={fan} className={selectCls}
                        onChange={(e) => { setFan(e.target.value); push({ fan: e.target.value }); }}>
                        {FANS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </label>
            </div>
        </div>
    );
};

export default ACControls;
