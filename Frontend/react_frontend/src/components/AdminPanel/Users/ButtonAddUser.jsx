import { useContext, useState } from "react";
import { Context } from "../../../store/appContext";
import addUser from "../../../images/addUser.png";

const ButtonAddUser = ({ update }) => {
    const { actions } = useContext(Context)
    const handleClick = () => {
        actions.addUser(username, password, role).then(() => {
            update();
        });
        setToggleIsOn(!toggleIsOn)
    }
    const [username, setUsername] = useState([])
    const [password, setPassword] = useState([])
    const [role, setRole] = useState([])
    const [toggleIsOn, setToggleIsOn] = useState(false)

    return (
        <div className="flex w-full justify-end">
            {toggleIsOn ? (
                <div>
                    <button onClick={() => { setToggleIsOn(!toggleIsOn) }} > + </button>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    <select value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role">
                        <option value="">-- Select --</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    <button type="submit" onClick={handleClick} > ADD </button>
                </div>
            ) : (
                <button className=" hover:bg-slate-300 rounded-full" onClick={() => {
                    setToggleIsOn(!toggleIsOn)

                }} >
                    <img title="Add New User" className=" h-12 w-12" src={addUser} alt="addUser" />
                </button>
            )}

        </div>
    )
}

export default ButtonAddUser;