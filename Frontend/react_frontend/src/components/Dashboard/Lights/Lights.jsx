import { Lightbulb } from "lucide-react";
import Card from "../../ui/Card";
import Light from "./Light";

const Lights = ({ actuators = [], index = 0 }) => {
    const lights = actuators.filter(a => a.type === "Light");
    if (lights.length === 0) return null;
    return (
        <Card title="Lights" icon={Lightbulb} index={index}>
            <div className="divide-y divide-border/40">
                {lights.map((light) => (
                    <Light key={light.id} name={light.name} id={light.id} state={light.state} />
                ))}
            </div>
        </Card>
    );
};

export default Lights;
