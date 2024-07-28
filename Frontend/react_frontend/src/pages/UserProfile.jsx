import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext';
import ModifyPassword from '../components/ModifyPassword';
import { Link } from 'react-router-dom';
import home from "../images/home.png";

const UserProfile = () => {
    const [username, setUsername] = useState("");
    const [current_user, setCurrent_user] = useState({});
    const [id, setId] = useState("");
    const [trigger, setTrigger] = useState(false);
    const [error, setError] = useState("");

    const { actions } = useContext(Context);

    const handleClick = async () => {
        try {
            // Encode user input to prevent XSS
            const encodedUsername = encodeURIComponent(username);

            // Perform update user profile action
            const result = await actions.updateUserProfile(id, encodedUsername);

            if (!result.success) {
                throw new Error(result.message || "Profile update failed");
            }

            // Clear error message on successful update
            setError("");
        } catch (err) {
            // Handle errors and display error message
            setError(err.message);
        }
    };

    useEffect(() => {
        const current = JSON.parse(sessionStorage.getItem("current_User"));
        if (current) {
            setCurrent_user(current);
            setId(current.id);
        }
    }, []);

    useEffect(() => {
        setUsername(current_user.username || "");
        sessionStorage.setItem("current_User", JSON.stringify(current_user));
    }, [current_user]);

    return (
        <div>
            <button className="mx-5 rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-500">
                <Link to={`/`}>
                    <img title="home" className="h-12 w-12" src={home} alt="home" />
                </Link>
            </button>

            <div className='h-100 m-5 mt-10 flex flex-col items-center justify-center'>
                <div>
                    <h1 className='mb-4 text-xl font-medium text-slate-600'>Edit Profile</h1>
                </div>

                <div className='flex flex-col items-center justify-center'>
                    <input
                        className="rounded-md p-1 m-2 bg-slate-300"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username'
                    />
                    <button
                        className="m-4 px-4 py-2 bg-slate-600 rounded-lg text-slate-100 hover:bg-slate-300 hover:text-slate-700"
                        type="submit"
                        onClick={handleClick}
                    >
                        Update
                    </button>
                    {error && <div className="text-red-500 mt-2">{error}</div>}
                </div>
                <div>
                    {trigger ?
                        <div>
                            <ModifyPassword id={id} />
                            <button onClick={() => setTrigger(!trigger)}>x</button>
                        </div>
                        : <button onClick={() => setTrigger(!trigger)}>Change Password</button>}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
