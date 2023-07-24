import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../../store/appContext';

const UpdateUserId = ({ user, update, setShowModal }) => {
    const [username, setUsername] = useState("")
    const [role, setRole] = useState("")
    const [id, setId] = useState("")
    const { actions } = useContext(Context)

    const handleClick = () => {
        actions.updateUser(id, username, role)
            .then(() => {
                update();
                alert("User updated");
                setShowModal(false);
            })
            .catch(error => {
                console.error("Error updating user:", error);
            });
    }

    useEffect(() => {
        setUsername(user.username)
        setRole(user.role)
        setId(user.id)
    }, [user])

    return (
        <div className='flex flex-col items-center justify-center align-middle content-around place-content-center'>
            <h1 classname=' font-medium text-2xl text-slate-400'>Edit User</h1>
            <input className='flex mt-10 text-slate-700 rounded-lg items-center justify-center' type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={username} />
            <select className='mt-10 text-slate-700 rounded-lg' value={role} onChange={(e) => setRole(e.target.value)} placeholder={role}>
                <option value="">-- Select --</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>
            <button className='mt-10 bg-slate-300 text-slate-800 rounded-lg px-3 py-1' type="submit" onClick={handleClick}> Update </button>
        </div>
    )
}

export default UpdateUserId