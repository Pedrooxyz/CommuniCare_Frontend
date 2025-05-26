import "./EditarPerfil.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from '../../../utils/axios.js';
import noImage from '../../../assets/icon.jpg';
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; 
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";

const EditarPerfil = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [contactos, setContactos] = useState([]);
  const [userTipoUtilizadorId, setUserTipoUtilizadorId] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telemovel: "",
  });

  const verificarTipoUtilizador = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/Utilizadores/VerificarAdmin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserTipoUtilizadorId(response.data);
    } catch (error) {
      console.error("Erro ao verificar o tipo de utilizador", error);
      setUserTipoUtilizadorId(false);
    }
  };

  useEffect(() => {
    verificarTipoUtilizador();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const userResponse = await api.get("/Utilizadores/InfoUtilizador", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = userResponse.data;

        setUserInfo(user);

        setFormData({
          nome: user.nomeUtilizador || "",
          email: user.email || "",
          telemovel: user.telemovel || "",
          rua: user.rua || "",
          numPorta: user.numPorta || "",
          cPostal: user.cPostal || "",
          localidade: user.localidade || "",
        });
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit disparado");
    try {
      const token = localStorage.getItem("token");

      const dadosAlterados = {};
      Object.keys(formData).forEach((key) => {
        const valorAtual = formData[key]?.trim();
        const valorOriginal = userInfo ? (userInfo[key] || "") : "";

        if (valorAtual && valorAtual !== valorOriginal) {
          dadosAlterados[key] = valorAtual;
        }
      });

      console.log("Dados alterados:", dadosAlterados);

      if (Object.keys(dadosAlterados).length === 0) {
        alert("Não houve alterações para guardar.");
        return;
      }

      const response = await api.put("/Utilizadores/EditarPerfil", dadosAlterados, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Resposta da API:", response.data);
      navigate("/profile");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  return (
    <>
      <HeaderProfileCares />
      <div className="centerPageEP">
        <Link to="/profile" className="backArrowEP">
          <ArrowLeft size={28} />
        </Link>

        <div className="gridProfileEP">
          <div className="cardProfileEP">
            <h2 className="nameEP">Editar Perfil</h2>

            <form onSubmit={handleSubmit}>
              <div className="formFieldEP">
                <label htmlFor="nome">Nome</label>
                <input
                  className="inputChangesEP"
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />
              </div>

              <div className="formFieldEP">
                <label htmlFor="email">Email</label>
                <input
                  className="inputChangesEP"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="formFieldEP">
                <label htmlFor="telemovel">Contacto Telefónico</label>
                <input
                  className="inputChangesEP"
                  type="text"
                  id="telemovel"
                  name="telemovel"
                  value={formData.telemovel}
                  onChange={handleChange}
                />
              </div>

              <div className="formFieldEP">
                <button type="submit" className="saveBtnEP">
                  Guardar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

function EditarPerfilPage() {
  return <EditarPerfil />;
}

export default EditarPerfilPage;