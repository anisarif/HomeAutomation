import { useContext } from "react";
import { Context } from "../../../store/appContext";

const ButtonDeleteActuator = (id, {update}) => {
    const { actions } = useContext(Context)
    const handleClick = () => {
        actions.deleteActuator(id).then(() => {
            update();
        });
    }

    return (
        <>
            <button onClick={handleClick} > - </button>
        </>
    )
}

export default ButtonDeleteActuator;