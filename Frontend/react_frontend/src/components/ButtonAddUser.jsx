import { useContext, useState } from "react";
import { Context } from "../store/appContext";

const ButtonAddUser = () => {
    const { actions } = useContext(Context)
    const handleClick = () => {
        actions.addUser(username, role)
        setToggleIsOn(!toggleIsOn)
    }
    const [username, setUsername] = useState([])
    const [role, setRole] = useState([])
    const [toggleIsOn, setToggleIsOn] = useState(false)




    return (
        <>
            {toggleIsOn ? (
                <div>
                    <button onClick={() => { setToggleIsOn(!toggleIsOn) }} > + </button>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                    <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
                    <button type="submit" onClick={handleClick} > ADD </button>
                </div>
            ) : (
                <button onClick={() => { setToggleIsOn(!toggleIsOn) }} > + </button>
            )}

        </>
    )
}

export default ButtonAddUser;