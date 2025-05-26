import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Registar from "./pages/RegistPage/Registar";
import Login from "./pages/LoginPage/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Profile from "./pages/ProfilePage/Profile";
import EditarPerfil from "./pages/ProfilePage/EditarPerfilPage/EditarPerfil";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import GerirUtilizadores from "./pages/Admin/GerirUtilizadores";

import OutrosVoluntariados from "./pages/VoluntariadosPage/OutrosPedidosPage/OutrosPedidos";
import MeusPedidos from "./pages/VoluntariadosPage/MeusPedidos/MeusPedidos";
import MaisInfoPedidos from "./pages/VoluntariadosPage/OutrosPedidosPage/MaisInfoPedidos/MaisInfoPedidos";
import EditarPedido from "./pages/VoluntariadosPage/EditarPedido/EditarPedido";

import OutrosEmprestimos from "./pages/EmpretimosPage/OutrosEmprestimos/OutrosEmprestimos";
import MaisInformacoes from "./pages/EmpretimosPage/OutrosEmprestimos/MaisInformacoes/MaisInformacoes";
import PendentesEmprestimos from "./pages/EmpretimosPage/PendentesEmprestimos/PendentesEmprestimos";

import PendentesMaisInformacoes from "./pages/EmpretimosPage/PendentesEmprestimos/MaisInformacoes/PendentesMaisInformacoes";
import PendentesMaisInformacoes2 from "./pages/EmpretimosPage/PendentesEmprestimos/MaisInformacoes/PendentesMaisInformacoes2";
import PendentesMaisInformacoes3 from "./pages/EmpretimosPage/PendentesEmprestimos/MaisInformacoes/PendentesMaisInformacoes3";

import MeusEmprestimos from "./pages/EmpretimosPage/MeusEmprestimos/MeusEmprestimoPage";
import PedirEmprestimo from "./pages/EmpretimosPage/PedirEmprestimo/PedirEmprestimo";
import EditarItem from "./pages/EmpretimosPage/EditarItem/EditarItem";

import Notificacoes from "./pages/NotificacoesPage/Notificacoes";
import NotificacoesArq from "./pages/NotificacoesPage/NotificacoesArq/NotificacoesArq";
import PedirVoluntariado from "./pages/VoluntariadosPage/PedirVoluntariado/PedirVoluntariado";
import PendentesPedidos from "./pages/VoluntariadosPage/PendentesPedidoPage/PendentesPedido";
import PendentesPedidosMaisInformacoes1 from "./pages/VoluntariadosPage/PendentesPedidoPage/MaisInformacoes/MaisInformacoes";
import PendentesPedidosMaisInformacoes2 from "./pages/VoluntariadosPage/PendentesPedidoPage/MaisInformacoes/MaisInfoValidarVoluntario";
import PendentesPedidosMaisInformacoes3 from "./pages/VoluntariadosPage/PendentesPedidoPage/MaisInformacoes/MaisInfoValidarConclusao";
import HistoricoTransacoes from "./pages/HistoricoTransacoes/HistoricoTransacoes";

import Loja from "./pages/Loja/Loja";
import PublicarArtigo from "./pages/PublicarArtigoPage/PublicarArtigo";
import DetalhesArtigo from "./pages/Loja/DetalhesArtigo/DetalhesArtigo";
import Favoritos from "./pages/Loja/FavoritosPage/Favoritos";

import AdminRouteWrapper from "./utils/authWrapperAdmin";
import AuthWrapper from "./utils/authWrapper";

import SidebarLayout from "./components/Sidebar/SidebarLayout";

import HistoricoLoja from "./pages/Loja/HistoricoLoja/HistoricoLoja";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registar" element={<Registar />} />
        <Route path="/fgpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />

        <Route element={<AuthWrapper />}>
          <Route element={<SidebarLayout />}>
            <Route path="/meusPedidos" element={<MeusPedidos />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/meusEmprestimos" element={<MeusEmprestimos />} />
            <Route path="/editar-perfil" element={<EditarPerfil />} />
            <Route path="/notificacoes" element={<Notificacoes />} />
            <Route path="/notificacoesarq" element={<NotificacoesArq />} />
            <Route path="/loja" element={<Loja />} />
            <Route path="/pendentesPedidos" element={<PendentesPedidos />} />
            

            <Route path="/editarItem/:itemId" element={<EditarItem />} />
            <Route path="/editarPedido/:pedidoId" element={<EditarPedido />} />
            <Route path="/pedirEmprestimo" element={<PedirEmprestimo />} />
            <Route path="/pedirVoluntariado" element={<PedirVoluntariado />} />
            <Route
              path="/detalhesArtigo/:artigoId"
              element={<DetalhesArtigo />}
            />
            <Route path="/outrosPedidos" element={<OutrosVoluntariados />} />
            <Route path="/maisInfoPedidos/:id" element={<MaisInfoPedidos />} />
            <Route path="/outrosEmprestimos" element={<OutrosEmprestimos />} />
            <Route path="/maisInfo/:id" element={<MaisInformacoes />} />
            <Route path="/HistoricoTransacoes" element={<HistoricoTransacoes />} />
                      <Route path="/HistoricoLojas" element={<HistoricoLoja />} />

          </Route>

          <Route path="/profile" element={<Profile />} />

          <Route path="/HistoricoLojas" element={<HistoricoLoja />} />

          <Route element={<AdminRouteWrapper />}>
          <Route element={<SidebarLayout />}>
          <Route path="/publicarartigo" element={<PublicarArtigo />} />
          <Route path="/GerirUtilizadores" element={<GerirUtilizadores />} />
          <Route
              path="/pedidos/pendentes/mais-info/:id"
              element={<PendentesPedidosMaisInformacoes1 />}
            />
            <Route
              path="/pedidos/pendentes/mais-info2/:id"
              element={<PendentesPedidosMaisInformacoes2 />}
            />
            <Route
              path="/pedidos/pendentes/mais-info3/:id"
              element={<PendentesPedidosMaisInformacoes3 />}
            />

            <Route
              path="/pendentesEmprestimos"
              element={<PendentesEmprestimos />}
            />
            <Route
              path="/pendentesMaisInformacoes/:id"
              element={<PendentesMaisInformacoes />}
            />
            <Route
              path="/pendentesMaisInformacoes2/:id"
              element={<PendentesMaisInformacoes2 />}
            />
            <Route
              path="/pendentesMaisInformacoes3/:id"
              element={<PendentesMaisInformacoes3 />}
            />

          </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
