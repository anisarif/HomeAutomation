import { useState, useEffect, useRef } from 'react';
import { Sun } from 'lucide-react';
import { setRGBColor, getRGBState } from '../../../utils/api';

const EFFECTS = [
    { value: 'solid',      label: 'Solid' },
    { value: 'breath',     label: 'Breath' },
    { value: 'pulse',      label: 'Pulse' },
    { value: 'colorCycle', label: 'Color Cycle' },
    { value: 'strobe',     label: 'Strobe' },
];

const hexToRgb = (hex) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
});

const rgbToHex = (r, g, b) =>
    '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');

const RGBLight = ({ name, id }) => {
    const [on,        setOn]        = useState(false);
    const [color,     setColor]     = useState('#ff0000');
    const [intensity, setIntensity] = useState(100);
    const [effect,    setEffect]    = useState('solid');
    const [speed,     setSpeed]     = useState(5);
    const debounceRef = useRef(null);

    useEffect(() => {
        getRGBState(id).then(state => {
            const isOn = state.r > 0 || state.g > 0 || state.b > 0;
            setOn(isOn);
            if (isOn) setColor(rgbToHex(state.r, state.g, state.b));
            if (state.effect) setEffect(state.effect);
            if (state.speed)  setSpeed(state.speed);
        });
    }, [id]);

    const send = (isOn, hex, pct, eff, spd) => {
        if (!isOn) { setRGBColor(id, 0, 0, 0, 'solid', spd); return; }
        const { r, g, b } = hexToRgb(hex);
        const f = pct / 100;
        setRGBColor(id, Math.round(r * f), Math.round(g * f), Math.round(b * f), eff, spd);
    };

    const sendDebounced = (isOn, hex, pct, eff, spd) => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => send(isOn, hex, pct, eff, spd), 150);
    };

    const handleToggle = () => {
        const next = !on;
        setOn(next);
        send(next, color, intensity, effect, speed);
    };

    const handleColor = (e) => {
        setColor(e.target.value);
        if (on) sendDebounced(true, e.target.value, intensity, effect, speed);
    };

    const handleIntensity = (e) => {
        const val = parseInt(e.target.value);
        setIntensity(val);
        if (on) sendDebounced(true, color, val, effect, speed);
    };

    const handleEffect = (e) => {
        setEffect(e.target.value);
        if (on) send(true, color, intensity, e.target.value, speed);
    };

    const handleSpeed = (e) => {
        const val = parseInt(e.target.value);
        setSpeed(val);
        if (on) sendDebounced(true, color, intensity, effect, val);
    };

    const hideColor = on && effect === 'colorCycle';

    return (
        <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
            {/* Name + toggle */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                    <span
                        className="h-4 w-4 shrink-0 rounded-full ring-2 ring-border"
                        style={{ backgroundColor: on && !hideColor ? color : '#475569' }}
                    />
                    <h3 className="truncate text-base font-medium text-foreground">{name}</h3>
                </div>
                <button
                    type="button"
                    onClick={handleToggle}
                    aria-pressed={on}
                    className={`w-16 rounded-lg py-1.5 text-sm font-bold text-white transition-all active:scale-95 ${on ? 'bg-accent shadow-glow-accent' : 'bg-danger/90'}`}
                >
                    {on ? 'ON' : 'OFF'}
                </button>
            </div>

            {/* Color + intensity */}
            <div className="flex items-center gap-3">
                {!hideColor && (
                    <input
                        type="color"
                        value={color}
                        onChange={handleColor}
                        disabled={!on}
                        aria-label="Pick color"
                        className="h-9 w-10 cursor-pointer rounded-lg border border-border bg-surface2 disabled:cursor-not-allowed disabled:opacity-40"
                    />
                )}
                <div className="flex flex-1 items-center gap-2">
                    <Sun size={16} className="shrink-0 text-muted" aria-hidden="true" />
                    <input
                        type="range" min="1" max="100" value={intensity}
                        onChange={handleIntensity}
                        disabled={!on || hideColor}
                        className="h-1.5 flex-1 cursor-pointer accent-accent disabled:cursor-not-allowed disabled:opacity-40"
                    />
                    <span className="w-9 text-right text-sm tabular-nums text-muted">{intensity}%</span>
                </div>
            </div>

            {/* Effect + speed */}
            <div className="flex items-center gap-3">
                <select
                    value={effect}
                    onChange={handleEffect}
                    disabled={!on}
                    className="rounded-lg border border-border bg-surface2 px-2 py-1.5 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {EFFECTS.map(e => (
                        <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                </select>
                {effect !== 'solid' && (
                    <div className="flex flex-1 items-center gap-2">
                        <span className="whitespace-nowrap text-sm text-muted">Speed</span>
                        <input
                            type="range" min="1" max="10" value={speed}
                            onChange={handleSpeed}
                            disabled={!on}
                            className="h-1.5 flex-1 cursor-pointer accent-accent disabled:cursor-not-allowed disabled:opacity-40"
                        />
                        <span className="w-4 text-right text-sm tabular-nums text-muted">{speed}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RGBLight;
