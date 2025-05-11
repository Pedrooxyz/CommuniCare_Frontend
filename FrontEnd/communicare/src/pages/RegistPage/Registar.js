import "./Registar.css";
import { useState, useEffect } from "react";
import iconCC from "../../assets/iconCC.jpg";
import backImage from '../../assets/back.jpg';
import icon from '../../assets/icon.jpg';
import { Link, useNavigate } from "react-router-dom";
import { api } from '../../utils/axios.js';

const Header = () => {
  return (
    <header className="header reg">
      <img className="iconCC" src={iconCC} width={60} height={60} alt="IconCare" />
    </header>
  );
};

function DadosAuthentication() {
  const initialValues = {
    nomeUtilizador: "",
    email: "",
    password: "",
    rua: "",
    numPorta: "",
    cPostal: "",
    localidade: ""
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      const registerUser = async () => {
        try {
          const payload = {
            nomeUtilizador: formValues.nomeUtilizador,
            email: formValues.email,
            password: formValues.password,
            rua: formValues.rua,
            numPorta: formValues.numPorta ? parseInt(formValues.numPorta, 10) : null,
            cPostal: formValues.cPostal,
            localidade: formValues.localidade
          };

          const response = await api.post("Utilizadores/RegisterUtilizador", payload);

          if (response.status === 200 || response.status === 201) {
            alert("Registo bem-sucedido!");
            navigate("/");
          }
        } catch (error) {
          const apiError = error?.response?.data;
          const message = typeof apiError === "string" ? apiError : "Erro ao registar.";
          alert(message);
        }
      };

      registerUser();
    }
  }, [formErrors, formValues, isSubmit, navigate]);

  const validate = (values) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9])/;

    if (!values.nomeUtilizador) {
      errors.nomeUtilizador = "Nome é necessário!";
    }

    if (!values.email) {
      errors.email = "Email é necessário!";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "Formato de email inválido!";
    }

    if (!values.password) {
      errors.password = "Password é necessária!";
    } else if (values.password.length < 10) {
      errors.password = "Password deve ter no mínimo 10 caracteres";
    } else if (values.password.length > 16) {
      errors.password = "Password não pode ter mais de 16 caracteres";
    } else if (!passwordRegex.test(values.password)) {
      errors.password = "Password deve conter pelo menos uma letra maiúscula e um caracter especial";
    }

    if (!values.rua) {
      errors.rua = "Rua é necessária!";
    }

    if (!values.numPorta) {
      errors.numPorta = "Número da porta é necessário!";
    } else if (isNaN(values.numPorta)) {
      errors.numPorta = "Número da porta deve ser um número!";
    }

    if (!values.cPostal) {
      errors.cPostal = "Código postal é necessário!";
    }

    if (!values.localidade) {
      errors.localidade = "Localidade é necessária!";
    }

    return errors;
  };

  return (
    <>
      <div className="bgImg" style={{ backgroundImage: `url(${backImage})` }}></div>
      <div className="container">
        {Object.keys(formErrors).length === 0 && isSubmit ? (
          <div className="message success">
            Registo foi sucedido
          </div>
        ) : (
          console.log("Dados inseridos", formValues)
        )}

        <form onSubmit={handleSubmit}>
          <h1 className="h1Reg">Registar</h1>

          <img className="iconImage" src={icon} width={100} height={100} alt="Icon" />

          <div className="divider"></div>
          <div className="form">

            <div className="field">
              <input className="inputDadosReg"
                type="text"
                name="nomeUtilizador"
                placeholder="Nome"
                value={formValues.nomeUtilizador}
                onChange={handleChange}
              />
            </div>
            <p className="pErros">{formErrors.nomeUtilizador}</p>

            <div className="field">
              <input className="inputDadosReg"
                type="text"
                name="email"
                placeholder="Email"
                value={formValues.email}
                onChange={handleChange}
              />
            </div>
            <p className="pErros">{formErrors.email}</p>

            <div className="field">
              <input className="inputDadosReg"
                type="password"
                name="password"
                placeholder="Password"
                value={formValues.password}
                onChange={handleChange}
              />
            </div>
            <p className="pErros">{formErrors.password}</p>

            <div className="field">
              <input className="inputDadosReg"
                type="text"
                name="rua"
                placeholder="Rua"
                value={formValues.rua}
                onChange={handleChange}
              />
            </div>
            <p className="pErros">{formErrors.rua}</p>

            <div className="field">
              <input className="inputDadosReg"
                type="text"
                name="numPorta"
                placeholder="Número da Porta"
                value={formValues.numPorta}
                onChange={handleChange}
              />
            </div>
            <p className="pErros">{formErrors.numPorta}</p>

            <div className="field">
              <input className="inputDadosReg"
                type="text"
                name="cPostal"
                placeholder="Código Postal"
                value={formValues.cPostal}
                onChange={handleChange}
              />
            </div>
            <p className="pErros">{formErrors.cPostal}</p>

            <div className="field">
              <input className="inputDadosReg"
                type="text"
                name="localidade"
                placeholder="Localidade"
                value={formValues.localidade}
                onChange={handleChange}
              />
            </div>
            <p className="pErros">{formErrors.localidade}</p>

            <button className="buttonSubmit" type="submit">Submeter</button>

            <div className="textReg">
              Já possui conta? <Link className="regLinks" to="/">Iniciar sessão</Link>
            </div>

          </div>
        </form>
      </div>
    </>
  );
}

function Registar() {
  return (
    <>
      <Header />
      <DadosAuthentication />
    </>
  );
}

export default Registar;
