import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import  Home  from "./pages/Home";
import  Login  from "./pages/Login";
import injectContext from "./store/appContext";

const Layout = () => {
    const users = sessionStorage.getItem("users")
    const token = sessionStorage.getItem("token")
    return (
        <div>
            <BrowserRouter>
                    <Routes>
                        <Route path="/"  element={users ? <Home /> : <Navigate replace to={"/login"} />}/>
                        <Route path="/login" element={ token ? <Navigate replace to={"/"} /> : <Login /> }/>

                    </Routes>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);