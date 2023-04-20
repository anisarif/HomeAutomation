import { useContext } from "react";
import { Context } from "../../../store/appContext";

const ButtonDeleteUser = (id) => {
    const { actions } = useContext(Context)
    const handleClick = () => {actions.deleteUser(id)}

    return (
        <>
        <button onClick={handleClick} > - </button>
        </>
    )
}

export default ButtonDeleteUser;