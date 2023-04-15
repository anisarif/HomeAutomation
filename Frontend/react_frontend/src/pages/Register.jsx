import { useState} from 'react';
import { RegisterApi } from '../utils/api';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const opts = {    
    method:'POST',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "username": username,
      "password": password,
    }),
  }

  const handleClick = () => {
    RegisterApi(opts)
    navigate("/login")
  }

  return (
    <div>
        <input  type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <input  type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit" onClick={handleClick} > Register </button>

    </div>
  );
}

export default Register;
