import React, { useState, useCallback, memo } from "react";
import AdminPanel from "../components/AdminPanel/AdminPanel";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard/Dashboard";
import { ErrorBoundary } from "../components/ErrorBoundary";

const MemoizedAdminPanel = memo(AdminPanel);
const MemoizedDashboard = memo(Dashboard);

const Home = () => {
    const [toggle, setToggle] = useState(false);

    const handleToggle = useCallback(() => {
        setToggle(prev => !prev);
    }, []);

    return (
        <ErrorBoundary>
            <div className="bg-slate-600 h-full min-h-screen pb-20">
                <Navbar handleClick={handleToggle} />
                {toggle ? (
                    <MemoizedAdminPanel />
                ) : (
                    <MemoizedDashboard />
                )}
            </div>
        </ErrorBoundary>
    );
};

export default memo(Home);
