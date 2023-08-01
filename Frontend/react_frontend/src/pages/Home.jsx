import AdminPanel from "../components/AdminPanel/AdminPanel";
import { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { decodeToken } from "react-jwt";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard/Dashboard";

const Home = () => {
   const { store } = useContext(Context)
   const [isAdminView, setIsAdminView] = useState("")
   const [toggle, setToggle] = useState(false)

   const handleClick = () => {
      setToggle(!toggle)
   }

   useEffect(() => {
      const getRole = () => {
         if (store.token && store.token !== undefined && store.token !== null) {
            const myDecodedToken = decodeToken(store.token);
            const current = myDecodedToken.current_user
            sessionStorage.setItem("current_User", JSON.stringify(current))
            const checkrole = myDecodedToken.is_administrator
            setIsAdminView(checkrole)
            sessionStorage.setItem("current_user", current)
         }
      }
      getRole()
   }, [store.token]);

   return (
      <div className=" bg-slate-600 h-full h-min-screen pb-20 ">
         <Navbar handleClick={handleClick} isAdminView={isAdminView} />
         {toggle ? <AdminPanel />
            : <Dashboard />}

      </div>

   )
}

export default Home;