import { useContext, useState } from "react";
import { Context } from "../../../store/appContext";

const AddUser = ({ update, setAddShowModal }) => {
    const [username, setUsername] = useState([])
    const [password, setPassword] = useState([])
    const [role, setRole] = useState([])
    const { actions } = useContext(Context)

    const handleClick = () => {
        actions.addUser(username, password, role).then(() => {
            update();
            alert("User added");
            setAddShowModal(false)
        })
            .catch(error => {
                console.error("Error adding user:", error);
            });
    }


    return (
        <div className='flex flex-col items-center justify-center align-middle content-around place-content-center'>
            <h1 classname=' font-medium text-2xl text-slate-400'>New User</h1>
            <input className='flex mt-10 text-slate-700 rounded-lg items-center justify-center' type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input className='flex mt-10 text-slate-700 rounded-lg items-center justify-center' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <select className='mt-10 text-slate-700 rounded-lg' value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role">
                <option value="">-- Select --</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>
            <button className='mt-10 bg-slate-300 text-slate-800 rounded-lg px-3 py-1' type="submit" onClick={handleClick} > ADD </button>
        </div>
    )
}

export default AddUser;