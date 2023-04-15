import { useContext, useState } from 'react';
import { Context } from '../store/appContext';

const Login = () => {
  const { actions } = useContext(Context);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = () => {
    actions.login(username, password)
  }

  return (
    <>
      <div>
        <h1>Login</h1>
      </div>
      <div>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" onClick={handleClick} > LOGIN </button>
      </div>
    </>
  );
}

export default Login;
