import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../../store/appContext';



const UpdateActuator = (user, update, setShowModal) => {
    const [username, setUsername] = useState("")
    const [role, setRole] = useState("")
    const [id, setId] = useState("")
    const { actions } = useContext(Context)

    const handleClick = () => {
        actions.updateUser(id, username, role).then(() => {
            update();
        });
    }

    useEffect(() => {
        setUsername(user.username)
        setRole(user.role)
        setId(user.id)
    }, [user])

    return (
        <div>
        <button onClick={() => { setShowModal(false) }} > CLOSE </button>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={username} />
        <select value={role} onChange={(e) => setRole(e.target.value)} placeholder={role}>
            <option value="">-- Select --</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
        </select>
        <button type="submit" onClick={handleClick} > Update </button>

    </div>
)
}

export default UpdateActuator