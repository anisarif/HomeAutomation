import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login  from "./pages/Login";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;
