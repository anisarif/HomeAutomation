import { useContext } from "react";
import { Context } from "../../../store/appContext";

const ButtonDeleteBoard = (id, { update }) => {
    const { actions } = useContext(Context)
    const handleClick = () => {
        actions.deleteBoard(id).then(() => {
            update();
        });
    }

    return (
        <>
            <button onClick={handleClick} > - </button>
        </>
    )
}

export default ButtonDeleteBoard;