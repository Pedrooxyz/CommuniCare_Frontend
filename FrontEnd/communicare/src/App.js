import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Registar from "./pages/RegistPage/Registar";
import Login from "./pages/LoginPage/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Profile from "./pages/ProfilePage/Profile";

function App(){
  return (
    <BrowserRouter>
      <Routes>

        < Route path="/login" element={<Login/>}/>
        < Route path="/registar" element={<Registar/>}/>
        < Route path="/fgpassword" element={<ForgotPassword/>}/>
        < Route path="/profile" element={<Profile/>}/>



      </Routes>
    
    </BrowserRouter>
  );
}

export default App;