import "./Login.css";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import iconCC from "../../assets/iconCC.jpg";
import backImage from '../../assets/back.jpg';
import icon from '../../assets/icon.jpg';

import { Link } from 'react-router-dom'; 


const Header = () => {
  return (
    <header>
      <img className="iconCC" src={iconCC} width={60} height={60} alt="IconCare" />
    </header>
  );
};

function DadosAuthentication() {
  const initialValues = {
    email: "",
    password: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Falsa base dados
  const fakeUsers = [
    { email: "padroribeiro@exemplo.com", password: "SenhaSegura123!" },
    { email: "fernandes@dominio.pt", password: "Pass@12345" },
    { email: "barbosa@dominio.pt", password: "Password&567" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateLogin(formValues);
    setFormErrors(errors);
    setIsSubmit(true);
  };

  const validateLogin = (values) => {
    const errors = {};
    const user = fakeUsers.find((u) => u.email === values.email);

    if (!user || user.password !== values.password) {
      errors.general = "Email ou password incorretos.";
    }
    return errors;
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      alert("Login feito com sucesso!");
      console.log("Utilizador autenticado:", formValues);
    }
  }, [formErrors, formValues, isSubmit]);

  return (
    <>
      <div className="bgImg" style={{ backgroundImage: `url(${backImage})` }}></div>
      <div className="container">
        

        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <img className="iconImage" src={icon} width={100} height={100} alt="Icon" />

          <div className="divider"></div>
          <div className="form">
            <div className="field">
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formValues.email}
                onChange={handleChange}
              />
            </div>

            <div className="field password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formValues.password}
                onChange={handleChange}
                style={{ paddingRight: "35px" }}
              />
              <span  className="passwordEye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {formErrors.general && (
              <p>{formErrors.general}</p>
            )}

            <button className="fluid ui button blue">Entrar</button>

            <div className="text">
              Novo no Condominio? <Link  className="registarLink" to="/registar">
              Criar conta</Link>
            </div>

            <div className="text"> <span>Esqueceu-se da password?</span> </div>

            
          </div>
        </form>
      </div>
    </>
  );
}

function Login() {
  return (
    <>
      <Header />
      <DadosAuthentication />
    </>
  );
}

export default Login;