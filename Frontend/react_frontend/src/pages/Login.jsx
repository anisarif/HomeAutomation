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
    <div className=' h-100 m-5 flex flex-col items-center justify-center'>
      <div >
        <h1 className='mb-4 text-xl font-medium text-slate-600'>Login</h1>
      </div>
      <div className='flex flex-col items-center justify-center'>
        <input className="rounded-md p-1 m-2 bg-slate-300" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='UserName' />
        <input className="rounded-md p-1 m-2 bg-slate-300" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
        <button className="m-4 px-4 py-2 bg-slate-600 rounded-lg text-slate-100 hover:bg-slate-300 hover:text-slate-700" type="submit" onClick={handleClick} > LOGIN </button>
      </div>
    </div>
  );
}

export default Login;
