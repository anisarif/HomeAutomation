import { useContext, useState } from 'react';
import { Context } from '../store/appContext';

const Login = () => {
  const { actions } = useContext(Context);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleClick = async () => {
    try {
      // Encode user input to prevent XSS
      const encodedUsername = encodeURIComponent(username);
      const encodedPassword = encodeURIComponent(password);

      // Perform login action
      const result = await actions.login(encodedUsername, encodedPassword);

      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      // Clear error message on successful login
      setError("");
    } catch (err) {
      // Handle errors and display error message
      setError(err.message);
    }
  }

  return (
    <div className=' h-100 m-5 flex flex-col items-center justify-center'>
      <div>
        <h1 className='mb-4 text-xl font-medium text-slate-600'>Login</h1>
      </div>
      <div className='flex flex-col items-center justify-center'>
        <input 
          className="rounded-md p-1 m-2 bg-slate-300" 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder='UserName' 
        />
        <input 
          className="rounded-md p-1 m-2 bg-slate-300" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder='Password' 
        />
        <button 
          className="m-4 px-4 py-2 bg-slate-600 rounded-lg text-slate-100 hover:bg-slate-300 hover:text-slate-700" 
          type="submit" 
          onClick={handleClick} 
        > 
          LOGIN 
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
}

export default Login;
