import { useContext } from "react";
import { Context } from "../../../store/appContext";

const ButtonDeleteActuator = (id) => {
    const { actions } = useContext(Context)
    const handleClick = () => { actions.deleteActuator(id) }

    return (
        <>
            <button onClick={handleClick} > - </button>
        </>
    )
}

export default ButtonDeleteActuator;