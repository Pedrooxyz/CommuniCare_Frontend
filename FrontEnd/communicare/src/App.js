import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Registar from "./pages/RegistPage/Registar";
import Login from "./pages/LoginPage/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Profile from "./pages/ProfilePage/Profile";
import EditarPerfil from './pages/ProfilePage/EditarPerfilPage/EditarPerfil';
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import GerirUtilizadores from "./pages/Admin/GerirUtilizadores";



import OutrosVoluntariados from "./pages/VoluntariadosPage/OutrosPedidosPage/OutrosPedidos"

import OutrosEmprestimos from "./pages/EmpretimosPage/OutrosEmprestimos/OutrosEmprestimos";
import MaisInformacoes from "./pages/EmpretimosPage/OutrosEmprestimos/MaisInformacoes/MaisInformacoes";
import PendentesEmprestimos from "./pages/EmpretimosPage/PendentesEmprestimos/PendentesEmprestimos";
import PendentesMaisInformacoes from "./pages/EmpretimosPage/PendentesEmprestimos/MaisInformacoes/PendentesMaisInformacoes";
import MeusEmprestimos from "./pages/EmpretimosPage/MeusEmprestimos/MeusEmprestimoPage"
import PedirEmprestimo from "./pages/EmpretimosPage/PedirEmprestimo/PedirEmprestimo";
import EditarItem from "./pages/EmpretimosPage/EditarItem/EditarItem";

import MeusPedidos from "./pages/VoluntariadosPage/MeusPedidos/MeusPedidos"

import Notificacoes from "./pages/NotificacoesPage/Notificacoes";
import NotificacoesArq from "./pages/NotificacoesPage/NotificacoesArq/NotificacoesArq";
import PedirVoluntariado from "./pages/VoluntariadosPage/PedirVoluntariado/PedirVoluntariado";
import PendentesPedidos from "./pages/VoluntariadosPage/PendentesPedidoPage/PendentesPedido";


import Loja from "./pages/Loja/Loja";
import PublicarArtigo from "./pages/PublicarArtigoPage/PublicarArtigo";
import DetalhesArtigo from "./pages/Loja/DetalhesArtigo/DetalhesArtigo";


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
        <Route path="/pendentesPedidos" element={<PendentesPedidos />} />


        < Route path="/outrosEmprestimos" element={<OutrosEmprestimos />} />
        < Route path="/maisInfo/:id" element={<MaisInformacoes />} />
        < Route path="/pendentesEmprestimos" element={<PendentesEmprestimos />} />
        < Route path="/pendentesMaisInformacoes/:id" element={<PendentesMaisInformacoes />} />
        < Route path="/meusEmprestimos" element={<MeusEmprestimos />} />
        < Route path="/editarItem/:itemId" element={<EditarItem />} />
        <Route path="/pedirEmprestimo" element={<PedirEmprestimo />} />

        < Route path="/meusPedidos" element={<MeusPedidos />} />

        <Route path="/resetpassword" element={<ResetPassword />} />

        <Route element={<AuthWrapper />}>

        < Route path="/profile" element={<Profile />} />
        < Route path="/editar-perfil" element={<EditarPerfil />} />
        


        <Route path="/notificacoes" element={<Notificacoes />} />
        <Route path="/notificacoesarq" element={<NotificacoesArq />} />

        <Route path="/pedirVoluntariado" element={<PedirVoluntariado />} />  

        <Route path="/loja" element={<Loja />} />
        <Route path="/detalhesArtigo/:artigoId" element={<DetalhesArtigo />} />



          <Route element={<AdminRouteWrapper />}>

          <Route path="/publicarartigo" element={<PublicarArtigo />} /> 
          <Route path="/GerirUtilizadores" element={<GerirUtilizadores />} />

          </Route>
          
        </Route>



      </Routes>

    </BrowserRouter>
  );
}

export default App;