import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../../../store/appContext';

const UpdateUser = ({id, user,  update }) => {
    const [username, setUsername] = useState([])
    const [role, setRole] = useState([])
    const [toggleIsOn, setToggleIsOn] = useState(false)


    const { actions } = useContext(Context)
    const handleClick = () => {
        actions.updateUser(id, username, role).then(() => {
            update();
        });
    }

    useEffect(() => {
        setUsername(user.username)
        setRole(user.role)
    }, [user])

    return (
        <>
            {toggleIsOn ? (
                <div>
                    <button onClick={() => { setToggleIsOn(!toggleIsOn) }} > - </button>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={username} />
                    <select value={role} onChange={(e) => setRole(e.target.value)} placeholder={role}>
                        <option value="">-- Select --</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    <button type="submit" onClick={handleClick} > Update </button>

                </div>
            ) : (
                <button onClick={() => {
                    setToggleIsOn(!toggleIsOn)

                }} > edit </button>)}

        </>
    )
}

export default UpdateUser