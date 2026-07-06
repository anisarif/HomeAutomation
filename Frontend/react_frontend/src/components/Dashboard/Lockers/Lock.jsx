import { Lock as LockClosed, LockOpen } from "lucide-react";
import ButtonSwitchState from "../ButtonSwitchState";

const Lock = (props) => {
    const Icon = props.state ? LockOpen : LockClosed;
    return (
        <div className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div className="flex min-w-0 items-center gap-2.5">
                <Icon size={18} className={props.state ? "text-accent" : "text-muted"} aria-hidden="true" />
                <h3 className="truncate text-base font-medium text-foreground">{props.name}</h3>
            </div>
            <ButtonSwitchState lockId={props.id} state={props.state} />
        </div>
    );
};

export default Lock;
