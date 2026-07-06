import { useState, useEffect } from "react";
import { Lightbulb, Wifi } from "lucide-react";
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
        <div className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <Lightbulb size={18} className={props.state ? "text-accent" : "text-muted"} aria-hidden="true" />
                    <h3 className="truncate text-base font-medium text-foreground">{props.name}</h3>
                </div>
                <ButtonSwitchState lockId={props.id} state={props.state} />
            </div>

            {!loadingAuto && (
                <button
                    onClick={toggleAutoMode}
                    title={autoMode ? "Auto mode ON — WiFi presence controls this light" : "Manual mode — you control this light"}
                    className="flex items-center justify-end gap-2 self-end text-xs text-muted transition-colors hover:text-foreground"
                >
                    <Wifi size={13} aria-hidden="true" />
                    <span>Auto</span>
                    <span
                        className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors duration-200 ${
                            autoMode ? "bg-accent" : "bg-surface2"
                        }`}
                    >
                        <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform duration-200 ${
                                autoMode ? "translate-x-4" : "translate-x-1"
                            }`}
                        />
                    </span>
                </button>
            )}
        </div>
    );
};

export default Light;
