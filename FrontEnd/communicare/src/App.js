import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Registar from "./pages/RegistPage/Registar";
import Login from "./pages/LoginPage/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Profile from "./pages/ProfilePage/Profile";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

import OutrosVoluntariados from "./pages/VoluntariadosPage/OutrosPedidosPage/OutrosPedidos"

import OutrosEmprestimos from "./pages/EmpretimosPage/OutrosEmprestimos/OutrosEmprestimos";
import MaisInformacoes from "./pages/EmpretimosPage/OutrosEmprestimos/MaisInformacoes/MaisInformacoes";

import Notificacoes from "./pages/NotificacoesPage/Notificacoes";
import PedirVoluntariado from "./pages/VoluntariadosPage/PedirVoluntariado/PedirVoluntariado";
import PedirEmprestimo from "./pages/EmpretimosPage/PedirEmprestimo/PedirEmprestimo";

import Loja from "./pages/Loja/Loja";


import AdminRouteWrapper from "./utils/authWrapperAdmin";
import AuthWrapper from "./utils/authWrapper";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        < Route path="/" element={<Login />} />
        < Route path="/registar" element={<Registar />} />
        < Route path="/fgpassword" element={<ForgotPassword />} />

        < Route path="/outrosPedidos" element={<OutrosVoluntariados />} />

        < Route path="/outrosEmprestimos" element={<OutrosEmprestimos />} />
        < Route path="/maisInfo/:id" element={<MaisInformacoes />} />

        <Route path="/resetpassword" element={<ResetPassword />} />

        <Route element={<AuthWrapper />}>

        < Route path="/profile" element={<Profile />} />

        <Route path="/notificacoes" element={<Notificacoes />} />

        <Route path="/pedirVoluntariado" element={<PedirVoluntariado />} />  
        <Route path="/pedirEmprestimo" element={<PedirEmprestimo />} />
        <Route path="/loja" element={<Loja />} />

          <Route element={<AdminRouteWrapper />}>
          </Route>
          
        </Route>



      </Routes>

    </BrowserRouter>
  );
}

export default App;