import AdminPanel from "../components/AdminPanel";
import { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { decodeToken } from "react-jwt";
import LogoutButton from "../components/LogoutButton";

const Home = () => {
   const { store } = useContext(Context)
   const [current_username, setCurrent_username] = useState("")
   const [isAdminView, setIsAdminView] = useState("")
   useEffect(() => {
      const getRole = () => {
         if (store.token && store.token !== undefined && store.token !== null) {
            const myDecodedToken = decodeToken(store.token);
            const current = myDecodedToken.current_user
            const checkrole = myDecodedToken.is_administrator
            setCurrent_username(current.username)
            setIsAdminView(checkrole)
            sessionStorage.setItem("current_user", current)
         }
      }
      getRole()
   }, [store.token]);

   return (
      <div>
         <div>
            <h1>Hi {current_username} ! Welcome back !</h1>
            <LogoutButton />
         </div>
         {(isAdminView) ?
            <h1><AdminPanel /></h1> :
            <h1>{current_username} is not admin</h1>}
      </div>
   )
}

export default Home;