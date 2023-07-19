import { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useParams } from 'react-router-dom';

const ModifyPassword = () => {
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const { actions } = useContext(Context)
    const {id} = useParams()
    console.log(id)

    return (
        <div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password"/>
            <button type="submit" onClick={() => actions.modifyPassword(id, password, newPassword)}> Modify Password </button>
        </div>
    )
}

export default ModifyPassword;