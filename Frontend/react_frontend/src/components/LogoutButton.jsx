import {useContext} from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"
import logout from "../images/logout.png"

const LogoutButton = () => {
    const { actions } = useContext(Context)
    const navigate = useNavigate()
    const handleLogout = () => { actions.logout()
        navigate('/login')}

    return (
        <button className="mx-5 rounded-lg px-3 py-2  hover:bg-slate-500 " type="submit" onClick={handleLogout} >
            <img title="Logout" className=" h-12 w-12" src={logout} alt="logout" /> 
        </button>
    )
}

export default LogoutButton;