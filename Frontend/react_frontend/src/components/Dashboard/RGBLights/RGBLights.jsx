import { Palette } from "lucide-react";
import Card from "../../ui/Card";
import RGBLight from './RGBLight';

const RGBLights = ({ actuators = [], index = 0 }) => {
    const strips = actuators.filter(a => a.type === 'RGBLight');
    if (strips.length === 0) return null;
    return (
        <Card title="RGB Strips" icon={Palette} index={index}>
            <div className="divide-y divide-border/40">
                {strips.map(strip => (
                    <RGBLight key={strip.id} name={strip.name} id={strip.id} />
                ))}
            </div>
        </Card>
    );
};

export default RGBLights;
