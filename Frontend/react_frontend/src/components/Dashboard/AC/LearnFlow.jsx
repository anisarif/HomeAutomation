import { useContext, useRef, useState } from "react";
import { Context } from "../../../store/appContext";
import { getCaptured } from "../../../utils/api";

// In-app IR learning. No websocket in this app, so we poll GET /captured
// (same pattern as Sensor.jsx polling the room sensor) until a fresh code
// arrives, then let the user name and save it.
const POLL_MS = 1500;
const TTL_S = 30;

const LearnFlow = ({ unitId, onSaved }) => {
    const { actions } = useContext(Context);
    const [phase, setPhase] = useState("idle"); // idle | learning | captured
    const [captured, setCaptured] = useState(null);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const timerRef = useRef(null);
    const baselineRef = useRef(0);

    const clearTimer = () => {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    };

    const startLearn = async () => {
        setMessage("");
        setCaptured(null);
        // Baseline: ignore any code older than this learn session.
        const existing = await getCaptured(unitId);
        baselineRef.current = (existing && existing.capture_id) || 0;
        try {
            await actions.startLearn(unitId, TTL_S);
        } catch (e) {
            setMessage("Could not start learn mode.");
            return;
        }
        setPhase("learning");
        setMessage("Point the remote at the receiver and press a button…");

        const deadline = Date.now() + TTL_S * 1000;
        clearTimer();
        timerRef.current = setInterval(async () => {
            const result = await getCaptured(unitId);
            if (result && result.capture_id > baselineRef.current) {
                clearTimer();
                setCaptured(result);
                setPhase("captured");
                setMessage("");
            } else if (Date.now() > deadline) {
                clearTimer();
                setPhase("idle");
                setMessage("No code received. Try again.");
            }
        }, POLL_MS);
    };

    const cancel = async () => {
        clearTimer();
        try { await actions.stopLearn(unitId); } catch (e) { /* ignore */ }
        setPhase("idle");
        setCaptured(null);
        setMessage("");
    };

    const save = async () => {
        if (!name.trim()) { setMessage("Give the button a name."); return; }
        try {
            await actions.saveCapturedCommand(unitId, name.trim(), captured);
            setName("");
            setCaptured(null);
            setPhase("idle");
            setMessage("Saved!");
            onSaved && onSaved();
        } catch (e) {
            setMessage("Failed to save.");
        }
    };

    return (
        <div className="mt-4 border-t border-border/50 pt-4">
            {phase === "idle" && (
                <button type="button" onClick={startLearn}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-accent-soft active:scale-95">
                    Learn a button
                </button>
            )}

            {phase === "learning" && (
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 font-medium text-accent">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent shadow-glow-accent" />
                        Listening…
                    </span>
                    <button type="button" onClick={cancel}
                        className="rounded-lg bg-surface2 px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-border">Cancel</button>
                </div>
            )}

            {phase === "captured" && (
                <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted">
                        Captured <b className="text-foreground">{captured.protocol}</b>
                        {captured.bits ? ` (${captured.bits} bits)` : ""}. Name it:
                    </span>
                    <div className="flex gap-2">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Power"
                            className="flex-1 rounded-lg border border-border bg-surface2 px-3 py-1.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                        />
                        <button type="button" onClick={save}
                            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-accent-soft">Save</button>
                        <button type="button" onClick={cancel}
                            className="rounded-lg bg-surface2 px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-border">Cancel</button>
                    </div>
                </div>
            )}

            {message && <p className="mt-2 text-sm text-muted">{message}</p>}
        </div>
    );
};

export default LearnFlow;
