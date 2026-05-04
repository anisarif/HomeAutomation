import { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/appContext";
import { getUsers } from "../../../utils/api";

const UpdateBoard = ({ id, board, update, userCount, setShowModal }) => {
    const { actions } = useContext(Context);
    const [name, setName] = useState("");
    const [privacy, setPrivacy] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);

    const handlePrivacyChange = (e) => {
        setPrivacy(e.target.value);
        setSelectedUsers([]);
    };

    const handleUserChange = (e) => {
        const { value } = e.target;
        setSelectedUsers((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handleSubmit = () => {
        if (privacy === "private" && selectedUsers.length === 0) {
            alert("Please select at least one user.");
            return;
        }
        if (!name || !privacy) {
            alert('Please fill all fields');
            return;
        }
        actions.updateBoard(id, name, privacy, selectedUsers).then(() => {
            update();
            setShowModal(false);
        });
    };

    useEffect(() => {
        setName(board.name);
        setPrivacy(board.privacy);
        setSelectedUsers(board.users || []);
    }, [board]);

    useEffect(() => {
        getUsers().then(setUsers).catch(console.error);
    }, [userCount]);

    return (
        <div className='flex flex-col items-center justify-center align-middle content-around place-content-center'>
            <h1 className='font-medium text-2xl text-slate-400'>Edit Board</h1>
            <input
                className='flex mt-10 text-slate-700 rounded-lg items-center justify-center'
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />
            <select className='mt-10 text-slate-700 rounded-lg' value={privacy} onChange={handlePrivacyChange}>
                <option value="">-- Select --</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
            </select>
            {privacy === "private" && (
                <>
                    <p>Select users:</p>
                    <select className='mt-10 text-slate-700 rounded-lg' multiple value={selectedUsers} onChange={handleUserChange}>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </>
            )}
            <button className='mt-10 bg-slate-300 text-slate-800 rounded-lg px-3 py-1' type="submit" onClick={handleSubmit}>
                update
            </button>
        </div>
    );
};

export default UpdateBoard;
