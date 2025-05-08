import "./EditarPerfil.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from '../../../utils/axios.js';
import HeaderNot from './../Profile'; // Ajuste o caminho para onde o componente está localizado

const EditarPerfil = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [contactos, setContactos] = useState([]);
  const [formData, setFormData] = useState({
    nomeUtilizador: "",
    numCares: "",
    contacto: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');

        // Vai buscar tanto os dados do utilizador como os contactos em simultâneo
        const [userResponse, contactosResponse] = await Promise.all([
          api.get('/Utilizadores/InfoUtilizador', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/Utilizadores/ContactosUtilizador', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log("User info recebida:", userResponse.data);
        console.log("Contactos recebidos:", contactosResponse.data);

        setUserInfo(userResponse.data);
        setContactos(contactosResponse.data);
        setFormData({
          nomeUtilizador: userResponse.data.nomeUtilizador,
          numCares: userResponse.data.numCares,
          contacto: contactosResponse.data[0]?.numContacto || ''
        });

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      // Atualizamos as informações do utilizador
      const updatedData = {
        ...formData,
      };

      const response = await api.put('/Utilizadores/InfoUtilizador', updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Perfil atualizado:', response.data);
      navigate('/perfil');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  return (
    <div>
      <div className="info">
        <div className="IconProfile">
          <img
            className="icPerson"
            src={userInfo ? `${userInfo.fotoUtil}` : "caminho/para/imagem/default.jpg"}
            width={190}
            height={190}
            alt="icProfile"
          />
        </div>
      </div>

      <div className="gridProfile">
        <div className="cardPofile profile">
          <h2 className="name">Editar Perfil</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="nomeUtilizador">Nome</label>
              <input
                type="text"
                id="nomeUtilizador"
                name="nomeUtilizador"
                value={formData.nomeUtilizador}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="contacto">Contacto Telefónico</label>
              <input
                type="text"
                id="contacto"
                name="contacto"
                value={formData.contacto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <button type="submit" className="save-btn">Guardar Alterações</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function EditarPerfilPage() {
  return (
    <>
      <EditarPerfil />
    </>
  );
}

export default EditarPerfilPage;
