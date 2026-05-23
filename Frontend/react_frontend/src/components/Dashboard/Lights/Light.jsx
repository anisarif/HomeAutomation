import { useState, useEffect } from "react";
import ButtonSwitchState from "../ButtonSwitchState";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";

const Light = (props) => {
    const [autoMode, setAutoMode] = useState(true);
    const [loadingAuto, setLoadingAuto] = useState(true);

    // Fetch initial auto-mode state for this light
    useEffect(() => {
        fetch(`${backendUrl}api/auto-mode/${props.id}`)
            .then(r => r.json())
            .then(d => setAutoMode(d.enabled))
            .catch(() => setAutoMode(true))
            .finally(() => setLoadingAuto(false));
    }, [props.id]);

    const toggleAutoMode = async () => {
        const next = !autoMode;
        try {
            const res = await fetch(`${backendUrl}api/auto-mode/${props.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled: next }),
            });
            const d = await res.json();
            setAutoMode(d.enabled);
        } catch (err) {
            console.error("Failed to toggle auto mode:", err);
        }
    };

    return (
        <div className="flex flex-col gap-2 mx-4 mb-4">
            {/* Name + ON/OFF switch */}
            <div className="flex justify-between items-center">
                <h2 className="text-center text-2xl font-medium">{props.name}</h2>
                <ButtonSwitchState lockId={props.id} state={props.state} />
            </div>

            {/* Auto-mode toggle */}
            {!loadingAuto && (
                <div className="flex items-center justify-end gap-2">
                    <span className="text-sm text-slate-500">WiFi auto</span>
                    <button
                        onClick={toggleAutoMode}
                        title={autoMode ? "Auto mode ON — WiFi presence controls this light" : "Manual mode — you control this light"}
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                            autoMode ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                                autoMode ? "translate-x-5" : "translate-x-1"
                            }`}
                        />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Light;
