import { useContext, useState } from "react";
import { X } from "lucide-react";
import { Context } from "../../../store/appContext";

// A single learned IR code: tap to replay, small × to delete.
const CommandButton = ({ unitId, command, onDeleted }) => {
    const { actions } = useContext(Context);
    const [busy, setBusy] = useState(false);

    const send = async () => {
        setBusy(true);
        try {
            await actions.sendACCommand(unitId, command.id);
        } catch (e) {
            console.error("An error occurred:", e);
        } finally {
            setBusy(false);
        }
    };

    const remove = async (e) => {
        e.stopPropagation();
        try {
            await actions.deleteACCommand(command.id);
            onDeleted && onDeleted(command.id);
        } catch (err) {
            console.error("An error occurred:", err);
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                disabled={busy}
                onClick={send}
                className="w-full truncate rounded-lg border border-border bg-surface2 px-3 py-2 text-sm font-medium text-foreground transition-all hover:border-accent/50 hover:text-accent active:scale-95 disabled:opacity-60"
                title={command.name}
            >{command.name}</button>
            <button
                type="button"
                onClick={remove}
                aria-label={`Delete ${command.name}`}
                className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-danger text-white shadow transition-transform hover:scale-110"
            ><X size={12} /></button>
        </div>
    );
};

export default CommandButton;
