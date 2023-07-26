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
        <div className='flex flex-col items-center justify-center'>
            <input className="rounded-md p-1 m-2 bg-slate-300" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
            <input className="rounded-md p-1 m-2 bg-slate-300" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password"/>
            <button className="m-4 px-4 py-2 bg-slate-600 rounded-lg text-slate-100 hover:bg-slate-300 hover:text-slate-700" type="submit" onClick={() => actions.modifyPassword(id, password, newPassword)}> Modify Password </button>
        </div>
    )
}

export default ModifyPassword;