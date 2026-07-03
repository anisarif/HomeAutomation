import { useContext, useState } from "react";
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
                disabled={busy}
                onClick={send}
                className="w-full px-3 py-2 bg-sky-600 text-white font-medium rounded-md truncate"
                title={command.name}
            >{command.name}</button>
            <button
                onClick={remove}
                className="absolute -top-2 -right-2 w-5 h-5 bg-slate-700 text-white text-xs rounded-full leading-none"
                title="Delete"
            >×</button>
        </div>
    );
};

export default CommandButton;
