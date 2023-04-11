import { useState } from 'react';
import { loginApi } from '../utils/api';

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const opts = {    
    method:'POST',
    mode: 'cors',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "username": username,
      "password": password,
    }),
  }
  
  const handleClick = () => loginApi(opts)

  return (
    <div>
        <input  type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <input  type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit" onClick={handleClick} > LOGIN </button>

    </div>
  );
}

export default Login;
