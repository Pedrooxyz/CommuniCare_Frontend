import "./Login.css";
import { useState, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import iconCC from "../../assets/iconCC.jpg";
import backImage from '../../assets/back.jpg';
import icon from '../../assets/icon.jpg';
import { api } from '../../utils/axios.js';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const Header = () => {
  return (
    <header>
      <img className="iconCC" src={iconCC} width={60} height={60} alt="IconCare" />
    </header>
  );
};

function DadosAuthentication() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  
  const errorMessageRef = useRef(null);

  const navigate = useNavigate();

  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMessage("");

    try {

      
      const response = await api.post("Utilizadores/login", {
        email,
        password,
      });

      
      const { token, userId, userName, expiresIn } = response.data;

      
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("tokenIssuedAt", Date.now());
      localStorage.setItem("tokenExpiresIn", expiresIn);

     
      setPopupMessage("Login realizado com sucesso!");
      setShowPopup(true);

      
      setTimeout(() => {
        setShowPopup(false);
        setIsLoggingIn(false);
      }, 1000);

      if (response.status === 200) {
        setTimeout(() => {
          navigate("/profile");
        }, 1200);
      }
    } catch (error) {
      
      setErrorMessage(error?.response?.data?.message || error.message);
      if (errorMessageRef.current) {
        errorMessageRef.current.style.display = "block";
      }
      setIsLoggingIn(false);
    }
  };

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
                value={email}
                onChange={handleEmailChange}
              />
            </div>

             
             <div className="field password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                style={{ paddingRight: "35px" }}
              />
              <span
                className="passwordEye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            
            {errorMessage && (
              <p ref={errorMessageRef} style={{ color: "red" }}>
                {errorMessage}
              </p>
            )}

            
            <button className="fluid ui button blue" type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? "A entrar..." : "Entrar"}
            </button>

            <div className="text">
              Novo no Condominio?{" "}
              <Link className="registarLink" to="/registar">
                Criar conta
              </Link>
            </div>
            <div className="text">
              <span>Esqueceu-se da password?</span>
            </div>
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