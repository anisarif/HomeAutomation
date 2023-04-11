import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import  Home  from "./pages/Home";
import  Login  from "./pages/Login";
import Register from "./pages/Register";
import injectContext from "./store/appContext";


const Layout = () => {

    return (
        <div>
            <BrowserRouter>
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Register />} path="/register" />

                    </Routes>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);