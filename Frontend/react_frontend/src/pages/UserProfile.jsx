import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../store/appContext';

const UserProfile = ({ id }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")
    const [current_user, setCurrent_user] = useState({})

    const { actions } = useContext(Context)
    const current = JSON.parse(sessionStorage.getItem("current_User"))
    const handleClick = () => {
        actions.updateUser(id, username, password, role)        
    }
    

    useEffect(() => {
        setCurrent_user(current)
        setUsername(current_user.username)
        setRole(current_user.role)
    }, [current_user])

    return (
        <>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={username} />
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="new password" />
                <button type="submit" onClick={handleClick} > Update </button>

        </>
    )
}

export default UserProfile;

