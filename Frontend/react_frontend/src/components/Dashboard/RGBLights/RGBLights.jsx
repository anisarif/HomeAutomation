import RGBLight from './RGBLight';

const RGBLights = ({ actuators = [] }) => {
    const strips = actuators.filter(a => a.type === 'RGBLight');
    if (strips.length === 0) return null;
    return (
        <div className="p-4 bg-slate-200 rounded-md">
            <h1 className="text-slate-700 font-medium text-center text-3xl mb-8">RGB Strips</h1>
            {strips.map(strip => (
                <RGBLight key={strip.id} name={strip.name} id={strip.id} />
            ))}
        </div>
    );
};

export default RGBLights;
