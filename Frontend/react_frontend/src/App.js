import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login  from "./Routes/Login";
import Home from "./Routes/Home";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;
