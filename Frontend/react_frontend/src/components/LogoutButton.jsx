import React, {useContext} from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"

const LogoutButton = () => {
    const { actions } = useContext(Context)
    const navigate = useNavigate()
    const handleLogout = () => { actions.logout()
        navigate('/login')}

    return (
        <button className="mx-5 rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900" type="submit" onClick={handleLogout} > LOGOUT </button>
    )
}

export default LogoutButton;