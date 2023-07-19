import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../store/appContext';
import ModifyPassword from '../components/ModifyPassword';

const UserProfile = () => {
    const [username, setUsername] = useState("")
    const [current_user, setCurrent_user] = useState({})
    const [id, setId] = useState("")
    const [trigger, setTrigger] = useState(false)

    const { actions } = useContext(Context)
    

    const handleClick = () => {
        actions.updateUserProfile(id, username)
    }

    useEffect(() => {
        const current = JSON.parse(sessionStorage.getItem("current_User"))
        setCurrent_user(current)
        setId(current.id)
    }, [])

    useEffect(() => {
        setUsername(current_user.username)
    }, [current_user])

    return (
        <>
            <div>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={username} />
                <button type="submit" onClick={handleClick} > Update </button>
            </div>
            <div>                
                <button onClick={() => setTrigger(!trigger)}>Change Password</button>
                {trigger ? <ModifyPassword id={id} /> : null}
            </div>

        </>
    )
}

export default UserProfile;

