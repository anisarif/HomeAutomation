import React, {useContext} from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"

const LogoutButton = () => {
    const { actions } = useContext(Context)
    const navigate = useNavigate()
    const handleLogout = () => { actions.logout()
        navigate('/login')}

    return (
        <button type="submit" onClick={handleLogout} > LOGOUT </button>
    )
}

export default LogoutButton;