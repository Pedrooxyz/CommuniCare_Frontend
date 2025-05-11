import "./EditarPerfil.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from '../../../utils/axios.js';
import noImage from '../../../assets/icon.jpg';
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; 

const EditarPerfil = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [contactos, setContactos] = useState([]);
  const [formData, setFormData] = useState({
    nomeUtilizador: "",
    numCares: "",
    contacto: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');

        const [userResponse, contactosResponse] = await Promise.all([
          api.get('/Utilizadores/InfoUtilizador', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/Utilizadores/ContactosUtilizador', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await api.put('/Utilizadores/InfoUtilizador', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (imageFile) {
        const imageData = new FormData();
        imageData.append('fotoUtil', imageFile);

        await api.post('/Utilizadores/UploadFoto', imageData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      navigate('/perfil');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  return (
    <div className="centerPageEP">
      {/* Adiciona a seta de voltar */}
      <Link to="/profile" className="backArrowEP">
        <ArrowLeft size={28} />
      </Link>

      <div className="infoEP">
        <div className="IconProfileEP">
          <label htmlFor="imageUploadEP">
            <img
              className="icPersonEP"
              src={selectedImage || userInfo?.fotoUtil || noImage}
              alt="icProfile"
            />
          </label>
          <input
            id="imageUploadEP"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className="gridProfileEP">
        <div className="cardProfileEP">
          <h2 className="nameEP">Editar Perfil</h2>

          <form onSubmit={handleSubmit}>
            <div className="formFieldEP">
              <label htmlFor="nomeUtilizador">Nome</label>
              <input
                className="inputChangesEP"
                type="text"
                id="nomeUtilizador"
                name="nomeUtilizador"
                value={formData.nomeUtilizador}
                onChange={handleChange}
                required
              />
            </div>

            <div className="formFieldEP">
              <label htmlFor="contacto">Contacto Telefónico</label>
              <input
                className="inputChangesEP"
                type="text"
                id="contacto"
                name="contacto"
                value={formData.contacto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="formFieldEP">
              <button type="submit" className="saveBtnEP">Guardar Alterações</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function EditarPerfilPage() {
  return <EditarPerfil />;
}

export default EditarPerfilPage;
