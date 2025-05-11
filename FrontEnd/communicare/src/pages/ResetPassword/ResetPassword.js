import "./ResetPassword.css";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from '../../utils/axios.js'; 
import iconCC from "../../assets/iconCC.jpg";
import icon from '../../assets/icon.jpg';

const Header = () => {
  return (
    <header className="header ep">
      <img className="iconCC" src={iconCC} width={60} height={60} alt="IconCare" />
    </header>
  );
};

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token"); 

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("As passwords não coincidem.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await api.post(`Utilizadores/ResetarSenha?token=${token}`, {
        novaSenha: password,
      });
      

      if (response.status === 200) {
        setSuccessMessage("A sua password foi alterada com sucesso!");
        setTimeout(() => {
          navigate("/");
        }, 2000); // Redireciona para a página de login após 2 segundos
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-bgImg"></div>
      <form onSubmit={handleSubmit}>
        <h1 className="reset-h1">Redefinir a password</h1>
        <img className="iconImage" src={icon} width={100} height={100} alt="Icon" />

        <div className="reset-form">
          <div className="reset-field">
            <input
              type="password"
              name="password"
              placeholder="Nova Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="reset-field">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

          <button className="reset-buttonSubmit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "A redefinir..." : "Redefinir Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ResetPassword() {
  return (
    <>
      <Header />
      <ResetPasswordForm />
    </>
  );
}

export default ResetPassword;