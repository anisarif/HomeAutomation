import { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/appContext";

const ButtonAddBoard = ({update, userCount}) => {
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
    setSelectedUsers((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleSubmit = () => {
    if (privacy === "private" && selectedUsers.length === 0) {
      alert("Please select at least one user.");
    } else {
      actions.addBoard(name, privacy, selectedUsers).then(() => {
        update();
    });
      setName("");
      setPrivacy("");
      setSelectedUsers([]);
      setToggleIsOn(false);
    }
  };

  useEffect(() => {
    const session_users = sessionStorage.getItem("users");
    if (session_users) {
      const parsed_users = JSON.parse(session_users);
      if (Array.isArray(parsed_users)) {
        setUsers(parsed_users);
      } else {
        console.log("users is not an array");
      }
    }
  }, [userCount]);

  return (
    <>
      {toggleIsOn ? (
        <div>
          <button onClick={() => {
          setToggleIsOn(!toggleIsOn)
          }
          }>+</button>
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
            ADD
          </button>
        </div>
      ) : (
        <button onClick={() => setToggleIsOn(!toggleIsOn)}>+</button>
      )}
    </>
  );
};

export default ButtonAddBoard;
