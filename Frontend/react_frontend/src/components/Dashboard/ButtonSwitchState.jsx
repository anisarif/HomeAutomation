import { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";

const ButtonSwitchState = (props) => {
    const { actions } = useContext(Context);
    const [newState, setNewState] = useState(props.state);

    // Sync when parent polls and passes an updated state from the backend
    useEffect(() => {
        setNewState(props.state);
    }, [props.state]);

    const handleClickTrue = async () => {
        try {
            const res = await actions.updateState({ lockId: props.lockId, state: true });
            if (res === true) setNewState(true);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const handleClickFalse = async () => {
        try {
            const res = await actions.updateState({ lockId: props.lockId, state: false });
            if (res === true) setNewState(false);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <div className="w-12 p-4">
            {newState === false ?
                <button className="w-12 bg-red-600 text-white border-r-5 cursor-pointer border-none font-bold text-center rounded-md" onClick={handleClickTrue}>OFF</button> :
                <button className="w-12 bg-emerald-600 text-white border-r-5 cursor-pointer border-none font-bold text-center rounded-md" onClick={handleClickFalse}>ON</button>
            }
        </div>
    );
};

export default ButtonSwitchState;
