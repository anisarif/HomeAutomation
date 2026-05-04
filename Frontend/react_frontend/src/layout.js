import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import injectContext from "./store/appContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

const Layout = () => {
    return (
        <BrowserRouter>
            <ErrorBoundary>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<Navigate replace to="/" />} />
                </Routes>
            </ErrorBoundary>
        </BrowserRouter>
    );
};

export default injectContext(Layout);
