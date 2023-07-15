import { useContext } from "react";
import { Context } from "../../../store/appContext";

const ButtonDeleteUser = (id, {update}) => {
    const { actions } = useContext(Context)
    const handleClick = () => {actions.deleteUser(id).then(() => {
        update();
    });
    }

    return (
        <>
        <button onClick={handleClick} > - </button>
        </>
    )
}

export default ButtonDeleteUser;