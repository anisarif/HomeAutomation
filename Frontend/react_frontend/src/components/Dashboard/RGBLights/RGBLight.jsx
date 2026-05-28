import { useState, useEffect } from 'react';
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
        setRGBColor(id,
            Math.round(r * f),
            Math.round(g * f),
            Math.round(b * f),
            eff, spd
        );
    };

    const handleToggle = () => {
        const next = !on;
        setOn(next);
        send(next, color, intensity, effect, speed);
    };

    const handleColor = (e) => {
        setColor(e.target.value);
        if (on) send(true, e.target.value, intensity, effect, speed);
    };

    const handleIntensity = (e) => {
        const val = parseInt(e.target.value);
        setIntensity(val);
        if (on) send(true, color, val, effect, speed);
    };

    const handleEffect = (e) => {
        setEffect(e.target.value);
        if (on) send(true, color, intensity, e.target.value, speed);
    };

    const handleSpeed = (e) => {
        const val = parseInt(e.target.value);
        setSpeed(val);
        if (on) send(true, color, intensity, effect, val);
    };

    const hideColor = on && effect === 'colorCycle';

    return (
        <div className="flex flex-col gap-3 mx-4 py-3 border-b border-slate-300 last:border-0">
            {/* Name + toggle */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-medium">{name}</h2>
                <button
                    onClick={handleToggle}
                    className={`w-16 py-1 rounded-md font-bold text-white border-none cursor-pointer ${on ? 'bg-emerald-600' : 'bg-red-600'}`}
                >
                    {on ? 'ON' : 'OFF'}
                </button>
            </div>

            {/* Color + intensity */}
            <div className="flex items-center gap-4">
                <div
                    className="w-8 h-8 rounded-full border-2 border-slate-400 flex-shrink-0"
                    style={{ backgroundColor: on && !hideColor ? color : '#9ca3af' }}
                />
                {!hideColor && (
                    <input
                        type="color"
                        value={color}
                        onChange={handleColor}
                        disabled={!on}
                        className="w-10 h-8 cursor-pointer rounded border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                )}
                <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm text-slate-500">☀</span>
                    <input
                        type="range" min="1" max="100" value={intensity}
                        onChange={handleIntensity}
                        disabled={!on || hideColor}
                        className="flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-slate-600 w-9 text-right">{intensity}%</span>
                </div>
            </div>

            {/* Effect + speed */}
            <div className="flex items-center gap-3">
                <select
                    value={effect}
                    onChange={handleEffect}
                    disabled={!on}
                    className="text-slate-700 rounded-md px-2 py-1 bg-white border border-slate-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {EFFECTS.map(e => (
                        <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                </select>
                {effect !== 'solid' && (
                    <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-slate-500 whitespace-nowrap">Speed</span>
                        <input
                            type="range" min="1" max="10" value={speed}
                            onChange={handleSpeed}
                            disabled={!on}
                            className="flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                        <span className="text-sm text-slate-600 w-4 text-right">{speed}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RGBLight;
