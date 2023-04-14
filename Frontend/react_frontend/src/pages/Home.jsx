import { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "react-jwt";
import UsersBoard from "../components/UsersBoard";


const Home = () => {

   const { store, actions } = useContext(Context)
   const navigate = useNavigate();
   const myDecodedToken = decodeToken(store.token);
   const [current_user, setCurrent_user] = useState("")


   useEffect(() => {
      if (store.token && store.token !== undefined && store.token != null) navigate("/login")
   }, [])


   useEffect(() => {
      if (store.token && store.token !== undefined) {         
         const current = myDecodedToken.current_user
         setCurrent_user(current)
         sessionStorage.setItem("current_user", current_user.username)
      }
   }, [])

   const handleLogout = () => { actions.logout() }


   return (
      <div>
         <h1>This is the homepage</h1>
         <div>
            <h1>Welcome back {current_user.username} !</h1>
            <button type="submit" onClick={handleLogout} > LOGOUT </button>
         </div>
         <UsersBoard/>

     </div>
   )
}

export default Home;