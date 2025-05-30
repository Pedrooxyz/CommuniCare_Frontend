import "./ForgotPassword.css";
import { useState, useRef } from "react";
import iconCC from "../../assets/iconCC.jpg";
import backImage from '../../assets/back.jpg';
import icon from '../../assets/icon.jpg';
import { api } from '../../utils/axios.js';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header ep">
      <img className="iconCC" src={iconCC} width={60} height={60} alt="IconCare" />
    </header>
  );
};

function EmailAuthentication() {
  const [email, setEmail] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const errorMessageRef = useRef(null);

  const validate = (value) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!value) {
      errors.email = "Email é necessário!";
    } else if (!regex.test(value)) {
      errors.email = "Não é válido para o formato de email!";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(email);
    setFormErrors(errors);
    setSuccessMessage("");
    setErrorMessage("");

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await api.post("/utilizadores/RecuperarSenha", {
          email,
        });

        setSuccessMessage("E-mail de recuperação enviado com sucesso!");
        setEmail("");
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Erro ao enviar pedido. Tente novamente.");
        if (errorMessageRef.current) {
          errorMessageRef.current.style.display = "block";
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <div className="bgImg" style={{ backgroundImage: `url(${backImage})` }}></div>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h1 className="h1FP">Esqueci-me da password</h1>
          <img className="iconImage" src={icon} width={100} height={100} alt="Icon" />

          <div className="divider"></div>
          <div className="form">
            <div className="field">
              <input
                className="inputDadosFP"
                type="text"
                name="email"
                placeholder="Email de recuperação"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <p className="pErros">{formErrors.email}</p>

            {errorMessage && (
              <p ref={errorMessageRef} style={{ color: "red" }}>
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p style={{ color: "green" }}>
                {successMessage}
              </p>
            )}

            <button className="buttonSubmit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "A enviar..." : "Submeter"}
            </button>

            <div className="textFP">
              Já possui conta? <Link className="fpLinks" to="/">Iniciar sessão</Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

function ForgotPassword() {
  return (
    <>
      <Header/>
      <EmailAuthentication />
    </>
  );
}

export default ForgotPassword;
