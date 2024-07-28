import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { decodeToken } from "react-jwt";
import AdminPanel from "../components/AdminPanel/AdminPanel";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard/Dashboard";

const Home = () => {
   const { store } = useContext(Context);
   const [isAdminView, setIsAdminView] = useState(false);
   const [toggle, setToggle] = useState(false);

   const handleClick = () => {
      setToggle(!toggle);
   };

   useEffect(() => {
      const getRole = () => {
         if (store.token) {
            try {
               const myDecodedToken = decodeToken(store.token);
               if (myDecodedToken) {
                  const current = myDecodedToken.current_user;
                  const isAdmin = myDecodedToken.is_administrator;

                  sessionStorage.setItem("current_User", JSON.stringify(current));
                  setIsAdminView(isAdmin);

                  // Ensure the token is only stored if the decoding is successful
                  sessionStorage.setItem("current_user", JSON.stringify(current));
               }
            } catch (error) {
               console.error("Failed to decode token", error);
               // Handle token decoding error
               sessionStorage.removeItem("current_User");
               sessionStorage.removeItem("current_user");
            }
         }
      };
      getRole();
   }, [store.token]);

   return (
      <div className="bg-slate-600 h-full min-h-screen pb-20">
         <Navbar handleClick={handleClick} isAdminView={isAdminView} />
         {toggle ? <AdminPanel /> : <Dashboard />}
      </div>
   );
};

export default Home;
