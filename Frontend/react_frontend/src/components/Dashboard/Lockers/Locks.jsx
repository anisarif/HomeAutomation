import { Lock as LockIcon } from "lucide-react";
import Card from "../../ui/Card";
import Lock from "./Lock";

const Locks = ({ actuators = [], index = 0 }) => {
    const locks = actuators.filter(a => a.type === "Lock");
    if (locks.length === 0) return null;
    return (
        <Card title="Lockers" icon={LockIcon} index={index}>
            <div className="divide-y divide-border/40">
                {locks.map((lock) => (
                    <Lock key={lock.id} name={lock.name} id={lock.id} state={lock.state} />
                ))}
            </div>
        </Card>
    );
};

export default Locks;
