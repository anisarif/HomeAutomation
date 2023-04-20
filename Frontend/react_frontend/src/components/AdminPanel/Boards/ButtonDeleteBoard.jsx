import { useContext } from "react";
import { Context } from "../../../store/appContext";

const ButtonDeleteBoard = (id) => {
    const { actions } = useContext(Context)
    const handleClick = () => { actions.deleteBoard(id) }

    return (
        <>
            <button onClick={handleClick} > - </button>
        </>
    )
}

export default ButtonDeleteBoard;