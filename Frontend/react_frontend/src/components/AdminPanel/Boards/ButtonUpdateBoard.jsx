import { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/appContext";

const UpdateBoard = ({id, board, update}) => {
  const { actions } = useContext(Context);
  const [name, setName] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [toggleIsOn, setToggleIsOn] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);

  const handlePrivacyChange = (e) => {
    setPrivacy(e.target.value);
    setSelectedUsers([]);
  };

  const handleUserChange = (e) => {
    const { value } = e.target;
    setSelectedUsers((prev) => {
      if (!Array.isArray(prev)) {
        console.error('prev is not an array:', prev);
        prev = [];
      }
      return prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value];
    });
  };
  
  const handleSubmit = () => {
    if (privacy === "private" && selectedUsers.length === 0) {
      alert("Please select at least one user.");
    } else {
      actions.updateBoard(id, name, privacy, selectedUsers).then(() => {
        update();
    });
      setName(board.name);
      setPrivacy(board.privacy);
      setSelectedUsers(board.users);
      setToggleIsOn(false);
    }
  };

  useEffect(() => {
    setName(board.name);
    setPrivacy(board.privacy);
    setSelectedUsers(board.users);
}, [board])

  useEffect(() => {
    const session_users = sessionStorage.getItem("users");
    if (session_users) {
      const parsed_users = JSON.parse(session_users);
      if (Array.isArray(parsed_users)) {
        setUsers(parsed_users);
        console.log("users is an array");
      } else {
        console.log("users is not an array");
      }
    }
  }, []);

  return (
    <>
      {toggleIsOn ? (
        <div>
          <button onClick={() => setToggleIsOn(!toggleIsOn)}>-</button>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <select value={privacy} onChange={handlePrivacyChange}>
            <option value="">-- Select --</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          {privacy === "private" && (
            <>
              <p>Select users:</p>
              <select multiple value={selectedUsers} onChange={handleUserChange}>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.username}</option>
                ))}
              </select>
            </>
          )}
          <button type="submit" onClick={handleSubmit}>
            update
          </button>
        </div>
      ) : (
        <button onClick={() => setToggleIsOn(!toggleIsOn)}>edit</button>
      )}
    </>
  );
};

export default UpdateBoard;
