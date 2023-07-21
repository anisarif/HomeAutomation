import { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { decodeToken } from "react-jwt";
import LogoutButton from "./LogoutButton";
import UserProfileButton from "./UserProfileButton";

const Navbar = () => {
    const { store } = useContext(Context)
    const [current_username, setCurrent_username] = useState("")
    const [current_user, setCurrent_user] = useState([])
    const [isAdminView, setIsAdminView] = useState("")
    const [toggle, setToggle] = useState(false)

    useEffect(() => {
        const getRole = () => {
            if (store.token && store.token !== undefined && store.token !== null) {
                const myDecodedToken = decodeToken(store.token);
                const current = myDecodedToken.current_user
                sessionStorage.setItem("current_User", JSON.stringify(current))
                const checkrole = myDecodedToken.is_administrator
                setCurrent_user(current)
                setCurrent_username(current.username)
                setIsAdminView(checkrole)
                sessionStorage.setItem("current_user", current)
            }
        }
        getRole()
    }
        , [store.token]);

    return (    
        <div className=" sticky top-0 flex items-center justify-items-center justify-between h-12 bg-slate-200  rounded-b-xl">
            <div className="object-center mx-40 place-items-center">
                <h1 className=" text-slate-700 font-medium">Hi {current_username} ! Welcome back !</h1>
            </div>
            <div className="mx-20 justify-evenly">
            {(isAdminView) ? (toggle ? <button onClick={setToggle(true)} className="mx-5 rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900">Dashboard</button> : <button onClick={setToggle(false)} className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900">Admin Panel</button>) : null}
                <UserProfileButton  id={current_user.id} />
                <LogoutButton />
            </div>
        </div>
    )
}

export default Navbar;


