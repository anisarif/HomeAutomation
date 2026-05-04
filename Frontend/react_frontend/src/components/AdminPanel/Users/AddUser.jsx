import { useContext, useState } from "react";
import { Context } from "../../../store/appContext";

const AddUser = ({ update, setShowAddModal }) => {
    const [username, setUsername] = useState("")
    const [role, setRole] = useState("")
    const { actions } = useContext(Context)

    const handleClick = () => {
        if (!username || !role) {
            alert('Please fill all fields');
            return;
        }

        actions.addUser(username, role).then(() => {
            update();
            alert("User added");
            setShowAddModal(false);
        }).catch(error => {
            console.error("Error adding user:", error);
        });
    }

    return (
        <div className='flex flex-col items-center justify-center align-middle content-around place-content-center'>
            <h1 className='font-medium text-2xl text-slate-400'>New User</h1>
            <input className='flex mt-10 text-slate-700 rounded-lg items-center justify-center' type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <select className='mt-10 text-slate-700 rounded-lg' value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">-- Select Role --</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>
            <button className='mt-10 bg-slate-300 text-slate-800 rounded-lg px-3 py-1' type="submit" onClick={handleClick}>ADD</button>
        </div>
    )
}

export default AddUser;
